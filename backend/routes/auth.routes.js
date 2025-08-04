const express = require('express');
const router = express.Router();

const authService = require('../services/auth/auth.service');
const { 
  validateRegistration,
  validateLogin,
  validateGoogleAuth,
  validatePasswordResetRequest,
  validatePasswordReset,
} = require('../middleware/validation.middleware');
const { 
  authenticateToken,
  extractClientInfo,
  authRateLimit,
} = require('../middleware/auth.middleware');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', 
  authRateLimit(3, 15), // 3 attempts per 15 minutes
  extractClientInfo,
  validateRegistration,
  async (req, res) => {
    try {
      const result = await authService.register(req.body, req.clientInfo);
      
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          twoFactorQR: result.twoFactorQR,
        },
      });
    } catch (error) {
      logger.error('Registration failed:', error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: 'REGISTRATION_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login',
  authRateLimit(5, 15), // 5 attempts per 15 minutes
  extractClientInfo,
  validateLogin,
  async (req, res) => {
    try {
      const { email, password, twoFactorToken } = req.body;
      const result = await authService.login(email, password, twoFactorToken, req.clientInfo);
      
      // Set secure cookie for refresh token
      if (result.refreshToken) {
        res.cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }
      
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          expiresIn: result.expiresIn,
          requiresTwoFactor: result.requiresTwoFactor,
          requiresEmailVerification: result.requiresEmailVerification,
        },
      });
    } catch (error) {
      logger.error('Login failed:', error);
      res.status(401).json({
        success: false,
        error: error.message,
        code: 'LOGIN_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/auth/google
 * @desc Google OAuth login
 * @access Public
 */
router.post('/google',
  authRateLimit(10, 15), // 10 attempts per 15 minutes
  extractClientInfo,
  validateGoogleAuth,
  async (req, res) => {
    try {
      const { idToken } = req.body;
      const result = await authService.googleSignIn(idToken, req.clientInfo);
      
      // Set secure cookie for refresh token
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.json({
        success: true,
        message: 'Google login successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          expiresIn: result.expiresIn,
        },
      });
    } catch (error) {
      logger.error('Google login failed:', error);
      res.status(401).json({
        success: false,
        error: error.message,
        code: 'GOOGLE_LOGIN_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh',
  extractClientInfo,
  async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token not provided',
          code: 'MISSING_REFRESH_TOKEN',
        });
      }
      
      const result = await authService.refreshToken(refreshToken, req.clientInfo);
      
      // Set new refresh token cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: result.accessToken,
          expiresIn: result.expiresIn,
        },
      });
    } catch (error) {
      logger.error('Token refresh failed:', error);
      res.status(401).json({
        success: false,
        error: error.message,
        code: 'REFRESH_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout',
  authenticateToken,
  extractClientInfo,
  async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      await authService.logout(req.userId, refreshToken, req.clientInfo);
      
      // Clear refresh token cookie
      res.clearCookie('refreshToken');
      
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      logger.error('Logout failed:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        code: 'LOGOUT_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset
 * @access Public
 */
router.post('/forgot-password',
  authRateLimit(3, 60), // 3 attempts per hour
  extractClientInfo,
  validatePasswordResetRequest,
  async (req, res) => {
    try {
      const { email } = req.body;
      const result = await authService.requestPasswordReset(email, req.clientInfo);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      logger.error('Password reset request failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process password reset request',
        code: 'PASSWORD_RESET_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post('/reset-password',
  authRateLimit(5, 60), // 5 attempts per hour
  extractClientInfo,
  validatePasswordReset,
  async (req, res) => {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password, req.clientInfo);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      logger.error('Password reset failed:', error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: 'PASSWORD_RESET_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/auth/enable-2fa
 * @desc Enable two-factor authentication
 * @access Private
 */
router.post('/enable-2fa',
  authenticateToken,
  async (req, res) => {
    try {
      const { twoFactorToken } = req.body;
      
      if (!twoFactorToken || !/^\d{6}$/.test(twoFactorToken)) {
        return res.status(400).json({
          success: false,
          error: 'Valid 6-digit 2FA token is required',
          code: 'INVALID_2FA_TOKEN',
        });
      }
      
      const result = await authService.enable2FA(req.userId, twoFactorToken);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      logger.error('Enable 2FA failed:', error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: 'ENABLE_2FA_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/auth/disable-2fa
 * @desc Disable two-factor authentication
 * @access Private
 */
router.post('/disable-2fa',
  authenticateToken,
  async (req, res) => {
    try {
      const { password, twoFactorToken } = req.body;
      
      if (!password) {
        return res.status(400).json({
          success: false,
          error: 'Password is required',
          code: 'PASSWORD_REQUIRED',
        });
      }
      
      if (!twoFactorToken || !/^\d{6}$/.test(twoFactorToken)) {
        return res.status(400).json({
          success: false,
          error: 'Valid 6-digit 2FA token is required',
          code: 'INVALID_2FA_TOKEN',
        });
      }
      
      const result = await authService.disable2FA(req.userId, password, twoFactorToken);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      logger.error('Disable 2FA failed:', error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: 'DISABLE_2FA_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/auth/verify
 * @desc Verify token and get user info
 * @access Private
 */
router.get('/verify',
  authenticateToken,
  async (req, res) => {
    try {
      // Token is already verified by middleware, just return user info
      res.json({
        success: true,
        data: {
          user: req.user,
          isAuthenticated: true,
        },
      });
    } catch (error) {
      logger.error('Token verification failed:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
    }
  }
);

/**
 * @route POST /api/auth/verify-email
 * @desc Verify email address
 * @access Public
 */
router.post('/verify-email',
  async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Verification token is required',
          code: 'TOKEN_REQUIRED',
        });
      }
      
      const result = await authService.verifyEmail(token);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      logger.error('Email verification failed:', error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: 'EMAIL_VERIFICATION_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/auth/resend-verification
 * @desc Resend email verification
 * @access Public
 */
router.post('/resend-verification',
  authRateLimit(3, 60), // 3 attempts per hour
  async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required',
          code: 'EMAIL_REQUIRED',
        });
      }
      
      const result = await authService.resendVerificationEmail(email);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      logger.error('Resend verification failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resend verification email',
        code: 'RESEND_VERIFICATION_FAILED',
      });
    }
  }
);

module.exports = router;