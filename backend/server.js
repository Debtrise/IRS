const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { CloudLoggingWinston } = require('@google-cloud/logging-winston');
const winston = require('winston');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const documentRoutes = require('./routes/document.routes');
const caseRoutes = require('./routes/case.routes');
const eligibilityRoutes = require('./routes/eligibility.routes');
const formRoutes = require('./routes/form.routes');
const paymentRoutes = require('./routes/payment.routes');
const notificationRoutes = require('./routes/notification.routes');

// Import database connection
const { sequelize } = require('./config/database');

class TaxReliefServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.setupLogging();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupLogging() {
    // Configure Winston with Google Cloud Logging
    const loggingWinston = new CloudLoggingWinston({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.json(),
      defaultMeta: { service: 'owltax-backend' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });

    // Add Cloud Logging in production
    if (process.env.NODE_ENV === 'production') {
      this.logger.add(loggingWinston);
    }

    // Make logger globally available
    global.logger = this.logger;
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration for React frontend
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests from this IP, please try again later.',
    });
    this.app.use('/api/', limiter);

    // More aggressive rate limiting for auth endpoints
    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 requests per windowMs
      skipSuccessfulRequests: true,
    });
    this.app.use('/api/auth/login', authLimiter);
    this.app.use('/api/auth/register', authLimiter);

    // Body parsing
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      this.logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
      next();
    });
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version,
      });
    });

    // API Routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/documents', documentRoutes);
    this.app.use('/api/cases', caseRoutes);
    this.app.use('/api/eligibility', eligibilityRoutes);
    this.app.use('/api/forms', formRoutes);
    this.app.use('/api/payments', paymentRoutes);
    this.app.use('/api/notifications', notificationRoutes);

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found',
      });
    });
  }

  setupErrorHandling() {
    // Global error handler
    this.app.use((err, req, res, next) => {
      this.logger.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
      });

      // Don't leak error details in production
      const isDev = process.env.NODE_ENV !== 'production';
      
      res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(isDev && { stack: err.stack }),
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  }

  async start() {
    try {
      // Test database connection
      await sequelize.authenticate();
      this.logger.info('Database connection established successfully');

      // Sync database models (use migrations in production)
      if (process.env.NODE_ENV !== 'production') {
        await sequelize.sync({ alter: true });
        this.logger.info('Database models synchronized');
      }

      // Start server
      this.server = this.app.listen(this.port, () => {
        this.logger.info(`OwlTax Backend Server running on port ${this.port}`);
        this.logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      this.logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  async stop() {
    if (this.server) {
      await new Promise((resolve) => {
        this.server.close(resolve);
      });
      await sequelize.close();
      this.logger.info('Server stopped gracefully');
    }
  }
}

// Create and start server
const server = new TaxReliefServer();
server.start();

// Graceful shutdown
const gracefulShutdown = async () => {
  await server.stop();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = server;