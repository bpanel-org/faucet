const handlers = require('./handlers');

module.exports = [
  {
    method: 'USE',
    path: '/:client/faucet/drip',
    handler: handlers.apiLimiter
  },
  {
    method: 'USE',
    path: '/clients/:id/wallet/wallet/',
    handler: handlers.blacklistWallets
  },
  {
    method: 'POST',
    path: '/:client/faucet/drip',
    handler: handlers.requestFunds
  },
  {
    method: 'GET',
    path: '/:client/faucet/info',
    handler: handlers.getFaucetInfo
  }
];
