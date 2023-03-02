'use strict';

// const eventPool = require('../../eventPool');


var Chance = require('chance');
var chance = new Chance();

const generateOrder = (socket, payload = null) => {
  if(!payload){
    payload = {
      store: 'acme-widgets',
      orderID: chance.guid(),
      customer: chance.name(),
      address: chance.address(),
    };

  }

  socket.emit('JOIN', payload.store);
  console.log('VENDOR: Order ready for pickup.');
  socket.emit('pickup', payload);

};

const packageDelivered = (payload) => {
  console.log(`VENDOR: Thank you for delivering ${payload.orderID}`);
  // process.exit(0);
};

module.exports = { generateOrder, packageDelivered }; 