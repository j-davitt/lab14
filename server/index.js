'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3002;
const Queue = require('./lib/queue');
const eventQueue = new Queue();

const server = new Server();
const tickets = server.of('/tickets');

tickets.on('connection', (socket) => {
  console.log('Socket connected to tickets namespace', socket.id);
  
  socket.onAny((event, payload) => {
    const time = new Date().toISOString();
    console.log({
      event,
      time,
      payload,
    });
  });

  socket.on('JOIN', (room) => {
    console.log('Rooms ---->', socket.adapter.rooms);
    console.log('payload is the room ----->', room);
    socket.join(room);
  });

  socket.on('REQUEST', (payload) => {
    
    let currentQueue = eventQueue.read(payload.queueId);
    if(!currentQueue){
      let queueKey = eventQueue.store(payload.queueId, new Queue());
      currentQueue= eventQueue.read(queueKey);
    }
    currentQueue.store(payload.messageId, payload);
    // console.log(currentQueue);
   
    tickets.emit('REQUEST', payload);
  });

  socket.on('WORK-ORDER', (payload) => {
    let currentQueue = eventQueue.read(payload.queueId);
    if(!currentQueue){
      let queueKey = eventQueue.store(payload.queueId, new Queue());
      currentQueue= eventQueue.read(queueKey);
    }
    currentQueue.store(payload.messageId, payload);
    // console.log(currentQueue);
    tickets.emit('WORK-ORDER', payload);
  });

  socket.on('IN-PROGRESS', (payload) => {
   
    tickets.emit('IN-PROGRESS', payload);
  });

  socket.on('COMPLETED', (payload) => {
    let currentQueue = eventQueue.read(payload.queueId);
    if(!currentQueue){
      let queueKey = eventQueue.store(payload.queueId, new Queue());
      currentQueue= eventQueue.read(queueKey);
    }
    currentQueue.store(payload.messageId, payload);
    // console.log(currentQueue);
    
    tickets.emit('COMPLETED', payload);
  });

  socket.on('RECEIVED', (payload) => {
    // console.log(eventQueue);
    let currentQueue = eventQueue.read(payload.queueId);
    if(!currentQueue){
      throw new Error('No queue found for ' + payload.queueId);
    }
    currentQueue.remove(payload.messageId);
    console.log(currentQueue);
    tickets.emit('RECEIVED');
  });

  socket.on('GETALL-ORDERS', (payload) => {
    let currentQueue = eventQueue.read(payload.queueId);
    if(currentQueue && currentQueue.data){
      Object.keys(currentQueue.data).forEach((messageId) => {
        let payload = currentQueue.read(messageId);
        socket.emit(payload.queueId, payload);

      });
      // console.log(currentQueue);
    }
  });
});


server.listen(PORT);
