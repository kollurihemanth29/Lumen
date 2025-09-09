const express = require('express');
const passport = require('passport');
require('../config/passport'); // Initialize passport configuration
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

const router = express.Router();

// Google OAuth login route
router.get('/google', (req, res, next) => {
  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'Google OAuth not configured on server'
    });
  }
  
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Google OAuth callback route
router.get('/google/callback', (req, res, next) => {
  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_not_configured`);
  }
  
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=unauthorized` 
  })(req, res, next);
}, async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/not-authorized`);
      }

      // Generate JWT token for the authenticated user
      const token = generateToken({ id: req.user._id });
      
      // Determine redirect URL based on user role
      let redirectUrl;
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      switch (req.user.role.toLowerCase()) {
        case 'admin':
          redirectUrl = `${baseUrl}/admin/dashboard`;
          break;
        case 'manager':
          redirectUrl = `${baseUrl}/manager/dashboard`;
          break;
        case 'staff':
          redirectUrl = `${baseUrl}/staff/dashboard`;
          break;
        default:
          redirectUrl = `${baseUrl}/dashboard`;
      }
      
      // Redirect to OAuth success handler with role-based redirect info
      res.redirect(`${baseUrl}/oauth/success?token=${token}&redirect=${encodeURIComponent(redirectUrl)}&user=${encodeURIComponent(JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department
      }))}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=server_error`);
    }
  }
);

// OAuth failure route
router.get('/google/failure', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
});

module.exports = router;
