const endpoints = [
  {
    method: 'GET',
    path: '/faucet',
    handler: (req, res) => res.status(200).json({ result: 'FOOOO BAARRR' })
  }
];

module.exports = {
  endpoints
};
