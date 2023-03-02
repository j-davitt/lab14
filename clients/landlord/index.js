'use strict';

// const eventPool = require('../../eventPool');
// const handler = require('./handler');
const { io } = require('socket.io-client');

const socket = io.connect('http://localhost:3001/tickets');

// socket.emit('JOIN', payload.store); need to join room for specific store
// socket.emit('getAll', {store: '1-206-flowers'});
socket.emit('GETALL-ORDERS', { queueId: 'REQUEST' });

socket.on('REQUEST', (payload) => {
  setTimeout(() => {
    console.log(`LANDLORD: received ${payload.request.orderID}`);
    socket.emit('RECEIVED', { queueId: 'REQUEST', messageId: payload.messageId });
    console.log('LANDLORD: Work order initiated');
    socket.emit('WORK-ORDER', {...payload, queueId: 'WORK-ORDER' });
  }, 1000);
});



socket.on('COMPLETED', (payload) => {
  console.log(`LANDLORD: Thank you for completing ${payload.request.orderID}`);
  socket.emit('RECEIVED', { queueId: 'COMPLETED', messageId: payload.messageId });
});