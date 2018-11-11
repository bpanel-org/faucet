const rateLimit = require('express-rate-limit');

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

function requestFunds(req, res) {
  return res.status(200).json(req.body);
}

module.exports = {
  requestFunds,
  apiLimiter
};
