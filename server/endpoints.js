const handlers = require('./handlers');

module.exports = [
  {
    method: 'USE',
    path: '/faucet/drip',
    handler: handlers.apiLimiter
  },
  {
    method: 'POST',
    path: '/faucet/drip',
    handler: handlers.requestFunds
  }
];
