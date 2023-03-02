'use strict';

// const eventPool = require('../../eventPool');
// const handler = require('./handler');

const { io } = require('socket.io-client');
const { packageDelivered, generateOrder } = require('./handler');

const socket = io.connect('http://localhost:3001/caps');

socket.emit('getAll', {store: 'acme-widgets'});


setInterval(() => {
  generateOrder(socket);
}, 8000);


socket.on('delivered', (payload) => {
  packageDelivered(payload);
  socket.emit('received', payload);
});



