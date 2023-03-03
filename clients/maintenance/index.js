'use strict';


const { io } = require('socket.io-client');


const socket = io.connect('http://localhost:3001/tickets');

socket.emit('GETALL-ORDERS', { queueId: 'WORK-ORDER' });

socket.on('WORK-ORDER', (payload) => {
  setTimeout(() => {
    console.log(`MAINT: received ${payload.request.orderID}`);
    socket.emit('RECEIVED', { queueId: 'WORK-ORDER', messageId: payload.messageId });
    console.log('MAINT: Work order in-progress.');
    socket.emit('IN-PROGRESS', payload);
  }, 1000);
  setTimeout(() => {
    console.log('MAINT: Work order completed.');
    socket.emit('COMPLETED', { ...payload, queueId: 'COMPLETED' });
  }, 2000);
});






