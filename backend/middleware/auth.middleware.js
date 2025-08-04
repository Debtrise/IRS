const authService = require('../services/auth/auth.service');
const { ActivityLog } = require('../models');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        code: 'MISSING_TOKEN',
      });
    }
    
    // Verify token
    const decoded = await authService.verifyToken(token);
    
    // Add user info to request
    req.user = decoded;
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    logger.warn('Token verification failed:', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    
    return res.status(401).json({
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
    });
  }
};

/**
 * Middleware to check if user has required role
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED',
      });
    }
    
    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(userRole)) {
      // Log unauthorized access attempt
      ActivityLog.logSecurityEvent(
        req.user.userId,
        'SUSPICIOUS_ACTIVITY',
        `Attempted to access ${req.path} with insufficient role: ${userRole}`,
        req.ip,
        req.get('user-agent'),
        50
      ).catch(err => logger.error('Failed to log security event:', err));
      
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_ROLE',
        required: allowedRoles,
        current: userRole,
      });
    }
    
    next();
  };
};

/**
 * Middleware to check if user is admin
 */
const requireAdmin = requireRole(['admin']);

/**
 * Middleware to check if user is tax professional or admin
 */
const requireTaxProfessional = requireRole(['admin', 'tax_professional']);

/**
 * Middleware for optional authentication
 * Sets req.user if token is valid, but doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const decoded = await authService.verifyToken(token);
      req.user = decoded;
      req.userId = decoded.userId;
    }
    
    next();
  } catch (error) {
    // Token is invalid, but continue without authentication
    logger.debug('Optional auth failed, continuing without user:', error.message);
    next();
  }
};

/**
 * Middleware to ensure user can only access their own resources
 */
const requireOwnership = (userIdParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED',
      });
    }
    
    const requestedUserId = req.params[userIdParam] || req.body[userIdParam] || req.query[userIdParam];
    const currentUserId = req.user.userId;
    
    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Tax professionals can access assigned cases (implement case assignment check)
    if (req.user.role === 'tax_professional') {
      // TODO: Check if tax professional is assigned to this case
      return next();
    }
    
    // Regular users can only access their own resources
    if (requestedUserId && requestedUserId !== currentUserId) {
      // Log unauthorized access attempt
      ActivityLog.logSecurityEvent(
        currentUserId,
        'SUSPICIOUS_ACTIVITY',
        `Attempted to access resource for user ${requestedUserId}`,
        req.ip,
        req.get('user-agent'),
        70
      ).catch(err => logger.error('Failed to log security event:', err));
      
      return res.status(403).json({
        error: 'Access denied - can only access your own resources',
        code: 'OWNERSHIP_VIOLATION',
      });
    }
    
    next();
  };
};

/**
 * Middleware to check if user's email is verified
 */
const requireEmailVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      code: 'NOT_AUTHENTICATED',
    });
  }
  
  // Skip verification check for admins
  if (req.user.role === 'admin') {
    return next();
  }
  
  // Check if user is properly loaded with email verification status
  if (req.user.emailVerified === false) {
    return res.status(403).json({
      error: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED',
      message: 'Please verify your email address before accessing this resource',
    });
  }
  
  next();
};

/**
 * Middleware to check if user account is active
 */
const requireActiveAccount = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      code: 'NOT_AUTHENTICATED',
    });
  }
  
  const userStatus = req.user.status;
  
  if (userStatus !== 'active') {
    let message;
    switch (userStatus) {
      case 'pending':
        message = 'Account is pending activation. Please complete registration.';
        break;
      case 'suspended':
        message = 'Account is suspended. Please contact support.';
        break;
      case 'inactive':
        message = 'Account is inactive. Please contact support.';
        break;
      default:
        message = 'Account is not in active status.';
    }
    
    return res.status(403).json({
      error: 'Account not active',
      code: 'ACCOUNT_NOT_ACTIVE',
      status: userStatus,
      message,
    });
  }
  
  next();
};

/**
 * Middleware to extract client information for logging
 */
const extractClientInfo = (req, res, next) => {
  req.clientInfo = {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    sessionId: req.sessionID,
    timestamp: new Date(),
  };
  
  next();
};

/**
 * Middleware to log API access
 */
const logApiAccess = (req, res, next) => {
  const startTime = Date.now();
  
  // Override res.end to capture response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    
    // Log API access
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.userId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    };
    
    if (res.statusCode >= 400) {
      logger.warn('API Error:', logData);
    } else {
      logger.info('API Access:', logData);
    }
    
    // Call original end
    originalEnd.apply(this, args);
  };
  
  next();
};

/**
 * Rate limiting for authentication endpoints
 */
const authRateLimit = (maxAttempts = 5, windowMinutes = 15) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;
    
    if (!attempts.has(key)) {
      attempts.set(key, []);
    }
    
    const userAttempts = attempts.get(key);
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(attempt => now - attempt < windowMs);
    attempts.set(key, recentAttempts);
    
    if (recentAttempts.length >= maxAttempts) {
      // Log rate limit exceeded
      ActivityLog.logSecurityEvent(
        null,
        'SUSPICIOUS_ACTIVITY',
        `Rate limit exceeded for authentication endpoint: ${req.path}`,
        req.ip,
        req.get('user-agent'),
        80
      ).catch(err => logger.error('Failed to log security event:', err));
      
      return res.status(429).json({
        error: 'Too many attempts',
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Too many authentication attempts. Please try again in ${windowMinutes} minutes.`,
        retryAfter: windowMinutes * 60,
      });
    }
    
    // Add current attempt
    recentAttempts.push(now);
    
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireTaxProfessional,
  optionalAuth,
  requireOwnership,
  requireEmailVerified,
  requireActiveAccount,
  extractClientInfo,
  logApiAccess,
  authRateLimit,
};