'use strict';


let Chance = require('chance');
let chance = new Chance();
let issuesArr = ['plumbing', 'electrical', 'appliances', 'water', 'landscaping', 'pest'];

const generateRequest = (socket, request = null) => {
  let random = Math.floor(Math.random() * issuesArr.length);
  if(!request){
    request = {
      building: 'Joes Bldg',
      orderID: chance.guid(),
      customer: chance.name(),
      unit: chance.integer({ min: 1, max: 20 }),
      issue: issuesArr[random],
    };
  }
  let payload = {
    queueId: 'REQUEST',
    messageId: request.orderID,
    request,
  };

  // socket.emit('JOIN', payload.building);
  console.log('TENANT: Request made.');
  socket.emit('REQUEST', payload);

};


module.exports = { generateRequest }; 