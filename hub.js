// 'use strict';

// let eventPool = require('./eventPool');
// require('./clients/vendor');
// require('./clients/driver');


// eventPool.on('pickup', (payload) => logger('pickup', payload));
// eventPool.on('in-transit', (payload) => logger('in-transit', payload));
// eventPool.on('delivered', (payload) => logger('delivered', payload));

function logger(event, payload) {
  console.log({
    event,
    time: new Date().toISOString(),
    payload,
  });
}



// const start = () => {
//   setInterval(() => {
//     let store = '1-206-flowers';
//     eventPool.emit('VENDOR', store);
//   }, 5000);
// };

// start();

