'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3002;
const Queue = require('./lib/queue');
const eventQueue = new Queue();

// socket server singleton: listening for events at localhost:3001
const server = new Server();
const caps = server.of('/caps');

// function logger(event, payload) {
//   console.log({
//     event,
//     time: new Date().toISOString(),
//     payload,
//   });
// }

caps.on('connection', (socket) => {
  console.log('Socket connected to caps namespace', socket.id);
  // checkout socket.onAny() to see all events
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

  socket.on('pickup', (payload) => {
    
    let currentQueue = eventQueue.read('DRIVER');
    if(!currentQueue){
      let queueKey = eventQueue.store('DRIVER', new Queue());
      currentQueue= eventQueue.read(queueKey);
    }
    currentQueue.store(payload.orderID, payload);
    // console.log(currentQueue);

    caps.emit('pickup', payload);
  });

  // socket.on('pickup', (payload) => {
    
  //   let currentQueue = eventQueue.read(payload.store);
  //   if(!currentQueue){
  //     let queueKey = eventQueue.store(payload.store, new Queue());
  //     currentQueue= eventQueue.read(queueKey);
  //   }
  //   currentQueue.store(payload.orderID, payload);
  //   console.log(currentQueue);

  //   caps.emit('pickup', payload);
  // });

  // these will use the caps.to(payload.store).emit() once the driver is set up to join a room as well.
  socket.on('in-transit', (payload) => {
   
    caps.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    let currentQueue = eventQueue.read(payload.store);
    if(!currentQueue){
      let queueKey = eventQueue.store(payload.store, new Queue());
      currentQueue= eventQueue.read(queueKey);
    }
    currentQueue.store(payload.orderID, payload);
    // console.log(currentQueue);
    
    caps.emit('delivered', payload);
  });

  socket.on('received', (payload) => {
    let id = payload.queueId ? payload.queueId : payload.store;
    let currentQueue = eventQueue.read(id);
    if(!currentQueue){
      throw new Error('No queue found for store: ' + payload.store);
    }
    let message = currentQueue.remove(payload.orderID);
    // console.log(currentQueue);
    caps.emit('received', message);
  });

  socket.on('getAll', (payload) => {
    let id = payload.queueId ? payload.queueId : payload.store;
    let currentQueue = eventQueue.read(id);
    if(currentQueue && currentQueue.data){
      Object.keys(currentQueue.data).forEach((orderID) => {
        socket.emit('pickup', currentQueue.read(orderID));

      });
    }
  });
});


server.listen(PORT);
