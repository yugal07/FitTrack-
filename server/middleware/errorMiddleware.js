// error handling

// Handle 404 errors - Route not found
exports.notFound = (req, res, next) => {
          const error = new Error(`Not Found - ${req.originalUrl}`);
          res.status(404);
          next(error);
        };
        
        // Custom error handler
        exports.errorHandler = (err, req, res, next) => {
          // If status code is 200, set it to 500 (server error)
          const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
          
          // Set status code
          res.status(statusCode);
          
          // Return error response
          res.json({
            success: false,
            error: {
              code: err.code || 'SERVER_ERROR',
              message: err.message,
              stack: process.env.NODE_ENV === 'production' ? null : err.stack,
            },
          });
        };
        
        // Handle validation errors
exports.validationErrorHandler = (err, req, res, next) => {
  // If error is a Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: errors.join(', '),
      },
    });
  }

  // If error is a Mongoose cast error (invalid ID format)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ID',
        message: 'Resource not found',
      },
    });
  }

  // If error is a MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'DUPLICATE_KEY',
        message: 'Duplicate field value entered',
        field: Object.keys(err.keyValue)[0],
      },
    });
  }

  // Pass to next error handler
  next(err);
};