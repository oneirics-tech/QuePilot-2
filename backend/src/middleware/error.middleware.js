// backend/src/middleware/error.middleware.js
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: err.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }
  
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: 'Duplicate entry',
        details: err.errors.map(e => ({
          field: e.path,
          value: e.value
        }))
      });
    }
  
    res.status(err.statusCode || 500).json({
      error: err.message || 'Internal server error'
    });
  };
  
  module.exports = errorMiddleware;
  