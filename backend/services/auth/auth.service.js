const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');

const { User, ActivityLog } = require('../../models');

class AuthService {
  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    this.secretManager = new SecretManagerServiceClient();
    this.jwtSecret = null;
    this.initializeSecrets();
  }

  async initializeSecrets() {
    try {
      if (process.env.NODE_ENV === 'production') {
        // Fetch JWT secret from Secret Manager in production
        const [jwtSecret] = await this.secretManager.accessSecretVersion({
          name: `projects/${process.env.GCP_PROJECT_ID}/secrets/jwt-secret/versions/latest`,
        });
        this.jwtSecret = jwtSecret.payload.data.toString('utf8');
      } else {
        // Use environment variable in development
        this.jwtSecret = process.env.JWT_SECRET || 'dev-jwt-secret-key';
      }
    } catch (error) {
      logger.error('Failed to initialize JWT secret:', error);
      throw error;
    }
  }

  async register(userData, clientInfo = {}) {
    try {
      // Validate input
      this.validateRegistrationData(userData);
      
      // Check if user exists
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists with this email address');
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      
      // Create user with 2FA setup
      const twoFactorSecret = speakeasy.generateSecret({
        name: `OwlTax:${userData.email}`,
        issuer: 'OwlTax',
      });
      
      const user = await User.create({
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        address: userData.address,
        emailVerificationToken,
        twoFactorSecret: twoFactorSecret.base32,
        twoFactorEnabled: false,
        emailVerified: false,
        status: 'pending',
        authProvider: 'local',
      });
      
      // Generate QR code for 2FA
      const qrCodeUrl = await QRCode.toDataURL(twoFactorSecret.otpauth_url);
      
      // Log registration
      await ActivityLog.logUserAction(
        user.id,
        'USER_REGISTER',
        `User registered with email: ${userData.email}`,
        {
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
          metadata: {
            registrationMethod: 'local',
            emailVerificationRequired: true,
          },
        }
      );
      
      // Send verification email (implement email service)
      await this.sendVerificationEmail(user);
      
      return {
        user: user.toSafeObject(),
        message: 'Registration successful. Please check your email for verification.',
        twoFactorQR: qrCodeUrl,
        twoFactorSecret: twoFactorSecret.base32,
      };
    } catch (error) {
      logger.error('Registration failed:', error);
      throw error;
    }
  }

  async login(email, password, twoFactorToken = null, clientInfo = {}) {
    try {
      // Find user
      const user = await User.findOne({ 
        where: { email: email.toLowerCase() },
        include: ['cases'] // Include related data if needed
      });
      
      if (!user) {
        await this.logFailedLogin(email, 'User not found', clientInfo);
        throw new Error('Invalid email or password');
      }
      
      // Check if account is locked or suspended
      if (user.status === 'suspended') {
        throw new Error('Account is suspended. Please contact support.');
      }
      
      if (user.status === 'inactive') {
        throw new Error('Account is inactive. Please contact support.');
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        await this.logFailedLogin(email, 'Invalid password', clientInfo, user.id);
        throw new Error('Invalid email or password');
      }
      
      // Check 2FA if enabled
      if (user.twoFactorEnabled) {
        if (!twoFactorToken) {
          return { 
            requiresTwoFactor: true,
            userId: user.id,
            message: 'Two-factor authentication required',
          };
        }
        
        const isValid = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token: twoFactorToken,
          window: 2, // Allow 2 steps before/after current time
        });
        
        if (!isValid) {
          await this.logFailedLogin(email, 'Invalid 2FA token', clientInfo, user.id);
          throw new Error('Invalid two-factor authentication code');
        }
      }
      
      // Check email verification
      if (!user.emailVerified) {
        return {
          requiresEmailVerification: true,
          userId: user.id,
          message: 'Please verify your email address before logging in',
        };
      }
      
      // Generate tokens
      const tokens = await this.generateTokens(user);
      
      // Update last login and refresh token
      await User.update(
        { 
          lastLogin: new Date(),
          refreshToken: tokens.refreshToken,
          status: 'active', // Activate pending accounts on first login
        },
        { where: { id: user.id } }
      );
      
      // Log successful login
      await ActivityLog.logUserAction(
        user.id,
        'USER_LOGIN',
        `Successful login for user: ${user.email}`,
        {
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
          sessionId: clientInfo.sessionId,
          metadata: {
            loginMethod: user.twoFactorEnabled ? '2FA' : 'password',
            lastLogin: user.lastLogin,
          },
        }
      );
      
      return {
        user: user.toSafeObject(),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: '15m',
      };
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  async googleSignIn(idToken, clientInfo = {}) {
    try {
      // Verify Google token
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      
      if (!payload.email_verified) {
        throw new Error('Google email not verified');
      }
      
      // Find or create user
      let user = await User.findByEmail(payload.email);
      
      if (!user) {
        // Create new user from Google profile
        user = await User.createFromOAuth({
          email: payload.email,
          given_name: payload.given_name,
          family_name: payload.family_name,
          sub: payload.sub,
          picture: payload.picture,
          email_verified: payload.email_verified,
        });
        
        await ActivityLog.logUserAction(
          user.id,
          'USER_REGISTER',
          `User registered via Google OAuth: ${payload.email}`,
          {
            ipAddress: clientInfo.ipAddress,
            userAgent: clientInfo.userAgent,
            metadata: {
              registrationMethod: 'google_oauth',
              googleId: payload.sub,
            },
          }
        );
      } else {
        // Update Google ID if not set
        if (!user.googleId) {
          await User.update(
            { googleId: payload.sub },
            { where: { id: user.id } }
          );
        }
        
        // Update last login
        await User.update(
          { 
            lastLogin: new Date(),
            status: 'active',
          },
          { where: { id: user.id } }
        );
      }
      
      // Generate tokens
      const tokens = await this.generateTokens(user);
      
      // Update refresh token
      await User.update(
        { refreshToken: tokens.refreshToken },
        { where: { id: user.id } }
      );
      
      // Log successful login
      await ActivityLog.logUserAction(
        user.id,
        'USER_LOGIN',
        `Successful Google OAuth login: ${user.email}`,
        {
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
          sessionId: clientInfo.sessionId,
          metadata: {
            loginMethod: 'google_oauth',
            googleId: payload.sub,
          },
        }
      );
      
      return {
        user: user.toSafeObject(),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: '15m',
      };
    } catch (error) {
      logger.error('Google sign-in failed:', error);
      throw new Error('Google authentication failed');
    }
  }

  async refreshToken(refreshToken, clientInfo = {}) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.jwtSecret);
      
      // Find user and verify refresh token matches
      const user = await User.findOne({
        where: { 
          id: decoded.userId,
          refreshToken,
        },
      });
      
      if (!user) {
        throw new Error('Invalid refresh token');
      }
      
      if (user.status !== 'active') {
        throw new Error('User account is not active');
      }
      
      // Generate new tokens
      const tokens = await this.generateTokens(user);
      
      // Update refresh token in database
      await User.update(
        { refreshToken: tokens.refreshToken },
        { where: { id: user.id } }
      );
      
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: '15m',
      };
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw new Error('Invalid refresh token');
    }
  }

  async logout(userId, refreshToken, clientInfo = {}) {
    try {
      // Clear refresh token
      await User.update(
        { refreshToken: null },
        { where: { id: userId } }
      );
      
      // Log logout
      await ActivityLog.logUserAction(
        userId,
        'USER_LOGOUT',
        'User logged out',
        {
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
          sessionId: clientInfo.sessionId,
        }
      );
      
      return { message: 'Logged out successfully' };
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  }

  async generateTokens(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      issuer: 'owltax-api',
      audience: 'owltax-users',
    });
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      this.jwtSecret,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
    
    return { accessToken, refreshToken };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'owltax-api',
        audience: 'owltax-users',
      });
      
      // Check if user still exists and is active
      const user = await User.findOne({
        where: { 
          id: decoded.userId,
          status: 'active',
        },
      });
      
      if (!user) {
        throw new Error('User not found or inactive');
      }
      
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async enable2FA(userId, twoFactorToken) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Verify the 2FA token
      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorToken,
        window: 2,
      });
      
      if (!isValid) {
        throw new Error('Invalid 2FA token');
      }
      
      // Enable 2FA
      await User.update(
        { twoFactorEnabled: true },
        { where: { id: userId } }
      );
      
      await ActivityLog.logUserAction(
        userId,
        'USER_ENABLE_2FA',
        'Two-factor authentication enabled',
        { severity: 'MEDIUM' }
      );
      
      return { message: 'Two-factor authentication enabled successfully' };
    } catch (error) {
      logger.error('Enable 2FA failed:', error);
      throw error;
    }
  }

  async disable2FA(userId, password, twoFactorToken) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      
      // Verify 2FA token
      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorToken,
        window: 2,
      });
      
      if (!isValid) {
        throw new Error('Invalid 2FA token');
      }
      
      // Disable 2FA
      await User.update(
        { twoFactorEnabled: false },
        { where: { id: userId } }
      );
      
      await ActivityLog.logUserAction(
        userId,
        'USER_DISABLE_2FA',
        'Two-factor authentication disabled',
        { severity: 'HIGH' }
      );
      
      return { message: 'Two-factor authentication disabled successfully' };
    } catch (error) {
      logger.error('Disable 2FA failed:', error);
      throw error;
    }
  }

  async requestPasswordReset(email, clientInfo = {}) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists
        return { message: 'If the email exists, a reset link has been sent' };
      }
      
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      await User.update(
        {
          passwordResetToken: resetToken,
          passwordResetExpires: resetExpires,
        },
        { where: { id: user.id } }
      );
      
      // Log password reset request
      await ActivityLog.logUserAction(
        user.id,
        'PASSWORD_RESET_REQUESTED',
        'Password reset requested',
        {
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
          severity: 'MEDIUM',
        }
      );
      
      // Send reset email (implement email service)
      await this.sendPasswordResetEmail(user, resetToken);
      
      return { message: 'If the email exists, a reset link has been sent' };
    } catch (error) {
      logger.error('Password reset request failed:', error);
      throw error;
    }
  }

  validateRegistrationData(userData) {
    const errors = [];
    
    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Valid email is required');
    }
    
    if (!userData.password || userData.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!userData.firstName || userData.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }
    
    if (!userData.lastName || userData.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async logFailedLogin(email, reason, clientInfo, userId = null) {
    await ActivityLog.logSecurityEvent(
      userId,
      'FAILED_LOGIN_ATTEMPT',
      `Failed login attempt for ${email}: ${reason}`,
      clientInfo.ipAddress,
      clientInfo.userAgent,
      60 // Medium risk score
    );
  }

  async sendVerificationEmail(user) {
    // TODO: Implement email service
    logger.info(`Verification email would be sent to ${user.email}`);
  }

  async sendPasswordResetEmail(user, resetToken) {
    // TODO: Implement email service
    logger.info(`Password reset email would be sent to ${user.email} with token ${resetToken}`);
  }
}

module.exports = new AuthService();