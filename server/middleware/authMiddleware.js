// middleware for auth

const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Protect routes - Middleware to verify token and authorize user
exports.protect = async (req, res, next) => {
  let token;

  // Check if auth header exists and contains Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Bearer token)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-key-here');

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authorized, user not found',
          },
        });
      }

      next();
    } catch (error) {
      console.error('Error in protect middleware:', error);

      // Handle different types of JWT errors
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Your session has expired. Please log in again.',
          },
        });
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Not authorized, invalid token',
          },
        });
      }

      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Not authorized, token failed',
        },
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: 'Not authorized, no token',
      },
    });
  }
};

// Admin middleware - Check if user is admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Not authorized as an admin',
      },
    });
  }
};