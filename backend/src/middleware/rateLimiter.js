const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  skip: (req) => req.method === 'OPTIONS', // skip OPTIONS preflight
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});

const authLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  }
});

module.exports = { generalLimiter, authLimiter };
