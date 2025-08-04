const express = require('express');
const router = express.Router();

const { Notification, User } = require('../models');
const { 
  authenticateToken,
  requireOwnership,
  requireAdmin,
  extractClientInfo,
} = require('../middleware/auth.middleware');
const { 
  validateNotification,
  validateUUID,
  validatePagination,
} = require('../middleware/validation.middleware');

/**
 * @route POST /api/notifications
 * @desc Create a new notification (Admin only)
 * @access Private (Admin)
 */
router.post('/',
  authenticateToken,
  requireAdmin,
  validateNotification,
  async (req, res) => {
    try {
      const notification = await Notification.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: {
          notification,
        },
      });
    } catch (error) {
      logger.error('Notification creation failed:', error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: 'NOTIFICATION_CREATION_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/notifications
 * @desc Get user's notifications
 * @access Private
 */
router.get('/',
  authenticateToken,
  validatePagination,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'created_at';
      const sortOrder = req.query.sortOrder || 'DESC';
      
      const where = { userId: req.userId };
      
      // Add filters
      if (req.query.status) {
        where.status = req.query.status;
      }
      if (req.query.type) {
        where.type = req.query.type;
      }
      if (req.query.priority) {
        where.priority = req.query.priority;
      }
      
      const { count, rows: notifications } = await Notification.findAndCountAll({
        where,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });
      
      const totalPages = Math.ceil(count / limit);
      
      res.json({
        success: true,
        data: {
          notifications,
          pagination: {
            page,
            limit,
            total: count,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
      });
    } catch (error) {
      logger.error('Get notifications failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notifications',
        code: 'NOTIFICATIONS_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/notifications/unread
 * @desc Get unread notifications
 * @access Private
 */
router.get('/unread',
  authenticateToken,
  async (req, res) => {
    try {
      const notifications = await Notification.getUnreadByUser(req.userId);
      const count = await Notification.getUnreadCountByUser(req.userId);
      
      res.json({
        success: true,
        data: {
          notifications,
          count,
        },
      });
    } catch (error) {
      logger.error('Get unread notifications failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch unread notifications',
        code: 'UNREAD_NOTIFICATIONS_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/notifications/:notificationId
 * @desc Get notification by ID
 * @access Private
 */
router.get('/:notificationId',
  authenticateToken,
  validateUUID('notificationId'),
  async (req, res) => {
    try {
      const { notificationId } = req.params;
      
      const notification = await Notification.findByPk(notificationId);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found',
          code: 'NOTIFICATION_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (notification.userId !== req.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'NOTIFICATION_ACCESS_DENIED',
        });
      }
      
      res.json({
        success: true,
        data: {
          notification,
        },
      });
    } catch (error) {
      logger.error('Get notification failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notification',
        code: 'NOTIFICATION_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route PUT /api/notifications/:notificationId/read
 * @desc Mark notification as read
 * @access Private
 */
router.put('/:notificationId/read',
  authenticateToken,
  validateUUID('notificationId'),
  async (req, res) => {
    try {
      const { notificationId } = req.params;
      
      const notification = await Notification.findByPk(notificationId);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found',
          code: 'NOTIFICATION_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (notification.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'NOTIFICATION_ACCESS_DENIED',
        });
      }
      
      await notification.markAsRead();
      
      res.json({
        success: true,
        message: 'Notification marked as read',
        data: {
          notification,
        },
      });
    } catch (error) {
      logger.error('Mark notification as read failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark notification as read',
        code: 'MARK_READ_FAILED',
      });
    }
  }
);

/**
 * @route PUT /api/notifications/:notificationId/archive
 * @desc Archive notification
 * @access Private
 */
router.put('/:notificationId/archive',
  authenticateToken,
  validateUUID('notificationId'),
  async (req, res) => {
    try {
      const { notificationId } = req.params;
      
      const notification = await Notification.findByPk(notificationId);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found',
          code: 'NOTIFICATION_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (notification.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'NOTIFICATION_ACCESS_DENIED',
        });
      }
      
      await notification.archive();
      
      res.json({
        success: true,
        message: 'Notification archived',
        data: {
          notification,
        },
      });
    } catch (error) {
      logger.error('Archive notification failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to archive notification',
        code: 'ARCHIVE_FAILED',
      });
    }
  }
);

/**
 * @route PUT /api/notifications/mark-all-read
 * @desc Mark all notifications as read
 * @access Private
 */
router.put('/mark-all-read',
  authenticateToken,
  async (req, res) => {
    try {
      const result = await Notification.markAllAsReadByUser(req.userId);
      
      res.json({
        success: true,
        message: `${result[0]} notifications marked as read`,
        data: {
          updatedCount: result[0],
        },
      });
    } catch (error) {
      logger.error('Mark all notifications as read failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark all notifications as read',
        code: 'MARK_ALL_READ_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/notifications/case-update
 * @desc Create case update notification
 * @access Private (Tax Professional, Admin)
 */
router.post('/case-update',
  authenticateToken,
  async (req, res) => {
    try {
      const { userId, caseId, title, message, priority } = req.body;
      
      if (!['admin', 'tax_professional'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
        });
      }
      
      if (!userId || !caseId || !title || !message) {
        return res.status(400).json({
          success: false,
          error: 'Required fields: userId, caseId, title, message',
          code: 'MISSING_REQUIRED_FIELDS',
        });
      }
      
      const notification = await Notification.createCaseUpdate(
        userId,
        caseId,
        title,
        message,
        priority || 'MEDIUM'
      );
      
      res.status(201).json({
        success: true,
        message: 'Case update notification created',
        data: {
          notification,
        },
      });
    } catch (error) {
      logger.error('Create case update notification failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create case update notification',
        code: 'CASE_UPDATE_NOTIFICATION_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/notifications/document-request
 * @desc Create document request notification
 * @access Private (Tax Professional, Admin)
 */
router.post('/document-request',
  authenticateToken,
  async (req, res) => {
    try {
      const { userId, caseId, documentTypes, dueDate } = req.body;
      
      if (!['admin', 'tax_professional'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
        });
      }
      
      if (!userId || !caseId || !documentTypes) {
        return res.status(400).json({
          success: false,
          error: 'Required fields: userId, caseId, documentTypes',
          code: 'MISSING_REQUIRED_FIELDS',
        });
      }
      
      const notification = await Notification.createDocumentRequest(
        userId,
        caseId,
        documentTypes,
        dueDate ? new Date(dueDate) : null
      );
      
      res.status(201).json({
        success: true,
        message: 'Document request notification created',
        data: {
          notification,
        },
      });
    } catch (error) {
      logger.error('Create document request notification failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create document request notification',
        code: 'DOCUMENT_REQUEST_NOTIFICATION_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/notifications/payment-reminder
 * @desc Create payment reminder notification
 * @access Private (Admin)
 */
router.post('/payment-reminder',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId, amount, dueDate, description } = req.body;
      
      if (!userId || !amount || !dueDate) {
        return res.status(400).json({
          success: false,
          error: 'Required fields: userId, amount, dueDate',
          code: 'MISSING_REQUIRED_FIELDS',
        });
      }
      
      const notification = await Notification.createPaymentReminder(
        userId,
        parseFloat(amount),
        new Date(dueDate),
        description || 'Payment due'
      );
      
      res.status(201).json({
        success: true,
        message: 'Payment reminder notification created',
        data: {
          notification,
        },
      });
    } catch (error) {
      logger.error('Create payment reminder notification failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create payment reminder notification',
        code: 'PAYMENT_REMINDER_NOTIFICATION_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/notifications/stats
 * @desc Get notification statistics
 * @access Private
 */
router.get('/stats',
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.userId;
      
      const stats = {
        total: await Notification.count({ where: { userId } }),
        unread: await Notification.getUnreadCountByUser(userId),
        actionRequired: await Notification.count({
          where: {
            userId,
            actionRequired: true,
            status: 'UNREAD',
          },
        }),
        byType: {},
        byPriority: {},
      };
      
      // Get counts by type
      const typeStats = await Notification.findAll({
        where: { userId },
        attributes: [
          'type',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        ],
        group: ['type'],
        raw: true,
      });
      
      typeStats.forEach(stat => {
        stats.byType[stat.type] = parseInt(stat.count);
      });
      
      // Get counts by priority
      const priorityStats = await Notification.findAll({
        where: { userId, status: 'UNREAD' },
        attributes: [
          'priority',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        ],
        group: ['priority'],
        raw: true,
      });
      
      priorityStats.forEach(stat => {
        stats.byPriority[stat.priority] = parseInt(stat.count);
      });
      
      res.json({
        success: true,
        data: {
          stats,
        },
      });
    } catch (error) {
      logger.error('Get notification stats failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notification statistics',
        code: 'NOTIFICATION_STATS_FAILED',
      });
    }
  }
);

module.exports = router;