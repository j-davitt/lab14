'use strict';



const { io } = require('socket.io-client');
const { generateRequest } = require('./handler');

const socket = io.connect('http://localhost:3001/tickets');



setInterval(() => {
  generateRequest(socket);
}, 5000);


socket.on('COMPLETED', (payload) => {
  console.log(`TENANT: Thank you for completing ${payload.request.orderID}`);
});

