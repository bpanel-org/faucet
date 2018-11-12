const rateLimit = require('express-rate-limit');

function getFaucetPath(clientId, walletId) {
  return `/clients/${clientId}/wallet/wallet/${walletId}/`;
}

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 1,
  statusCode: 429,
  message: {
    error: {
      code: 429,
      message:
        'There have been too many faucet requests. Please wait a little while and try again.'
    }
  }
});

// precaution to ensure that only requests to a wallet
// with the id "faucet" can be queried if not being run as faucet admin
// (currently admin is just a bool set via configs);
function blacklistWallets(req, res, next) {
  // allow custom faucet id to be set at runtime via app config
  // defaults to 'faucet'
  const config = req.config;
  const faucetWallet = config.str('faucet-id', 'faucet');

  // note that if this is true, then all wallet endpoints are whitelisted
  // use only for development purposes
  const faucetAdmin = config.bool('faucet-admin', false);
  if (!req.path.match(faucetWallet) && !faucetAdmin)
    return res.status(403).json({ error: { message: 'Forbidden', code: 403 } });
  next();
}

function requestFunds(req, res, next) {
  const {
    config,
    logger,
    params: { client }
  } = req;
  const faucetWallet = config.str('faucet-id', 'faucet');
  logger.info(
    'Sending faucet request to client "%s" and wallet "%s"',
    client,
    faucetWallet
  );
  const options = {
    outputs: [
      {
        address: req.body.address,
        value: 1000
      }
    ],
    rate: req.body.rate
  };
  req.body = options;
  req.url = `${getFaucetPath(client, faucetWallet)}/send`;
  next();
}

function getFaucetInfo(req, res, next) {
  const {
    config,
    params: { client }
  } = req;
  const faucetWallet = config.str('faucet-id', 'faucet');
  req.url = `${getFaucetPath(client, faucetWallet)}/account/default`;
  next();
}

module.exports = {
  requestFunds,
  apiLimiter,
  blacklistWallets,
  getFaucetInfo
};