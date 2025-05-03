// middleware for auth

const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Protect routes - Middleware to verify token and authorize user
exports.protect = async (req, res, next) => {
  let token;
  
  // Log headers for debugging
  console.log('Request headers:', req.headers);
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token.substring(0, 15) + '...');
      
      // Log the secret being used (don't do this in production!)
      const secret = process.env.JWT_SECRET || 'your-jwt-secret-key-here';
      console.log('Using secret for verification:', secret.substring(0, 3) + '...');
      
      const decoded = jwt.verify(token, secret);
      console.log('Token decoded successfully:', decoded);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.error('User not found for token ID:', decoded.id);
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authorized, user not found',
          },
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error('JWT verification error:', {
        name: error.name,
        message: error.message,
        expiredAt: error.expiredAt
      });
      
      // Return detailed error for debugging
      res.status(401).json({
        success: false,
        error: {
          code: error.name,
          message: error.message,
          expiredAt: error.expiredAt
        },
      });
    }
  } else {
    console.error('No authorization header found or incorrect format');
    return res.status(401).json({
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: 'Not authorized, no token provided in Authorization header',
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