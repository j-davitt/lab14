'use strict';


const socket = require('../socket.js');
// const handler= require('./handler');
const { packageDelivered, generateOrder } = require('./handler');

jest.mock('../socket.js', () => {
  return {
    on: jest.fn(),
    emit: jest.fn(),
  };
});
console.log = jest.fn();



describe('handle vendor', () => {
  let payload = {
    store: 'test store',
    orderID: 'testOrder',
    customer: 'testCustomer',
    address: 'testAddress',
  }
  it('creates the order payload', () => {
    generateOrder(socket, payload);
    expect(console.log).toHaveBeenCalledWith('VENDOR: Order ready for pickup.');
    expect(socket.emit).toHaveBeenCalledWith('pickup', payload);
    
  });
  it('confirms delivery', () => {
    packageDelivered(payload);
    expect(console.log).toHaveBeenCalledWith(`VENDOR: Thank you for delivering ${payload.orderID}`);
  });
});
