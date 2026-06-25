const mongoose = require('mongoose');

/**
 * Middleware that checks MongoDB connection health.
 * Returns 503 if the database is not connected.
 */
const dbCheck = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      maintenance: true,
      message:
        'Database is temporarily unavailable. The site is running in degraded mode. Please try again shortly.'
    });
  }
  next();
};

module.exports = dbCheck;
