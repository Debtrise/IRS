const express = require('express');
const router = express.Router();

const { Payment, Case, User } = require('../models');
const { 
  authenticateToken,
  requireOwnership,
  requireAdmin,
  extractClientInfo,
} = require('../middleware/auth.middleware');
const { 
  validatePayment,
  validateUUID,
  validatePagination,
} = require('../middleware/validation.middleware');

/**
 * @route POST /api/payments
 * @desc Create a new payment
 * @access Private
 */
router.post('/',
  authenticateToken,
  extractClientInfo,
  validatePayment,
  async (req, res) => {
    try {
      const paymentData = {
        ...req.body,
        userId: req.userId,
        ipAddress: req.clientInfo.ipAddress,
        userAgent: req.clientInfo.userAgent,
      };
      
      // For success fees, calculate amount based on debt reduction
      if (paymentData.paymentType === 'SUCCESS_FEE' && paymentData.successFeeBasedOn) {
        paymentData.amount = Payment.calculateSuccessFee(
          paymentData.successFeeBasedOn,
          paymentData.successFeePercentage || 10
        );
      }
      
      const payment = await Payment.create(paymentData);
      
      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: {
          payment,
        },
      });
    } catch (error) {
      logger.error('Payment creation failed:', error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: 'PAYMENT_CREATION_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/payments
 * @desc Get user's payments
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
      
      const where = {};
      
      // Regular users see only their own payments
      if (req.user.role === 'client') {
        where.userId = req.userId;
      }
      
      // Add filters
      if (req.query.paymentType) {
        where.paymentType = req.query.paymentType;
      }
      if (req.query.status) {
        where.status = req.query.status;
      }
      if (req.query.caseId) {
        where.caseId = req.query.caseId;
      }
      
      const { count, rows: payments } = await Payment.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
          {
            model: Case,
            as: 'case',
            attributes: ['id', 'caseId', 'programType', 'status'],
          },
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });
      
      const totalPages = Math.ceil(count / limit);
      
      res.json({
        success: true,
        data: {
          payments,
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
      logger.error('Get payments failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch payments',
        code: 'PAYMENTS_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/payments/:paymentId
 * @desc Get payment by ID
 * @access Private
 */
router.get('/:paymentId',
  authenticateToken,
  validateUUID('paymentId'),
  async (req, res) => {
    try {
      const { paymentId } = req.params;
      
      const payment = await Payment.findByPk(paymentId, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
          {
            model: Case,
            as: 'case',
            attributes: ['id', 'caseId', 'programType', 'status'],
          },
        ],
      });
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          error: 'Payment not found',
          code: 'PAYMENT_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (payment.userId !== req.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'PAYMENT_ACCESS_DENIED',
        });
      }
      
      res.json({
        success: true,
        data: {
          payment,
        },
      });
    } catch (error) {
      logger.error('Get payment failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch payment',
        code: 'PAYMENT_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/payments/:paymentId/process
 * @desc Process a payment (Admin only)
 * @access Private (Admin)
 */
router.post('/:paymentId/process',
  authenticateToken,
  requireAdmin,
  extractClientInfo,
  validateUUID('paymentId'),
  async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { status, transactionId, failureReason } = req.body;
      
      const validStatuses = ['PROCESSING', 'COMPLETED', 'FAILED'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Valid status is required (PROCESSING, COMPLETED, FAILED)',
          code: 'INVALID_STATUS',
        });
      }
      
      const payment = await Payment.findByPk(paymentId);
      if (!payment) {
        return res.status(404).json({
          success: false,
          error: 'Payment not found',
          code: 'PAYMENT_NOT_FOUND',
        });
      }
      
      const updateData = {
        status,
        processedBy: req.userId,
        transactionId: transactionId || payment.transactionId,
      };
      
      if (status === 'COMPLETED') {
        updateData.processedAt = new Date();
      } else if (status === 'FAILED') {
        updateData.failedAt = new Date();
        updateData.failureReason = failureReason;
      }
      
      await Payment.update(updateData, { where: { id: paymentId } });
      
      const updatedPayment = await Payment.findByPk(paymentId, {
        include: ['user', 'case'],
      });
      
      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          payment: updatedPayment,
        },
      });
    } catch (error) {
      logger.error('Payment processing failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process payment',
        code: 'PAYMENT_PROCESSING_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/payments/:paymentId/refund
 * @desc Refund a payment
 * @access Private (Admin)
 */
router.post('/:paymentId/refund',
  authenticateToken,
  requireAdmin,
  extractClientInfo,
  validateUUID('paymentId'),
  async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { amount, reason } = req.body;
      
      if (!reason) {
        return res.status(400).json({
          success: false,
          error: 'Refund reason is required',
          code: 'REASON_REQUIRED',
        });
      }
      
      const payment = await Payment.findByPk(paymentId);
      if (!payment) {
        return res.status(404).json({
          success: false,
          error: 'Payment not found',
          code: 'PAYMENT_NOT_FOUND',
        });
      }
      
      if (!payment.canBeRefunded()) {
        return res.status(400).json({
          success: false,
          error: 'Payment cannot be refunded',
          code: 'REFUND_NOT_ALLOWED',
        });
      }
      
      const refundResult = await payment.processRefund(amount, reason);
      
      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: {
          refund: refundResult,
          payment: await Payment.findByPk(paymentId),
        },
      });
    } catch (error) {
      logger.error('Payment refund failed:', error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: 'REFUND_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/payments/user/:userId/summary
 * @desc Get payment summary for user
 * @access Private
 */
router.get('/user/:userId/summary',
  authenticateToken,
  requireOwnership('userId'),
  validateUUID('userId'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      const summary = {
        totalPaid: await Payment.getTotalByUser(userId),
        serviceFees: await Payment.getTotalByUser(userId, 'SERVICE_FEE'),
        successFees: await Payment.getTotalByUser(userId, 'SUCCESS_FEE'),
        irsPayments: await Payment.getTotalByUser(userId, 'IRS_PAYMENT'),
      };
      
      // Get recent payments
      const recentPayments = await Payment.findAll({
        where: { userId },
        order: [['created_at', 'DESC']],
        limit: 5,
        include: [
          {
            model: Case,
            as: 'case',
            attributes: ['id', 'caseId', 'programType'],
          },
        ],
      });
      
      summary.recentPayments = recentPayments;
      
      res.json({
        success: true,
        data: {
          summary,
        },
      });
    } catch (error) {
      logger.error('Get payment summary failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch payment summary',
        code: 'SUMMARY_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/payments/case/:caseId
 * @desc Get payments for a case
 * @access Private
 */
router.get('/case/:caseId',
  authenticateToken,
  validateUUID('caseId'),
  async (req, res) => {
    try {
      const { caseId } = req.params;
      
      // Verify case access
      const caseRecord = await Case.findByPk(caseId);
      if (!caseRecord) {
        return res.status(404).json({
          success: false,
          error: 'Case not found',
          code: 'CASE_NOT_FOUND',
        });
      }
      
      if (caseRecord.userId !== req.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'CASE_ACCESS_DENIED',
        });
      }
      
      const payments = await Payment.getByCase(caseId);
      
      res.json({
        success: true,
        data: {
          payments,
        },
      });
    } catch (error) {
      logger.error('Get case payments failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch case payments',
        code: 'CASE_PAYMENTS_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/payments/:paymentId/receipt
 * @desc Get payment receipt
 * @access Private
 */
router.get('/:paymentId/receipt',
  authenticateToken,
  validateUUID('paymentId'),
  async (req, res) => {
    try {
      const { paymentId } = req.params;
      
      const payment = await Payment.findByPk(paymentId, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
          {
            model: Case,
            as: 'case',
            attributes: ['id', 'caseId', 'programType'],
          },
        ],
      });
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          error: 'Payment not found',
          code: 'PAYMENT_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (payment.userId !== req.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'PAYMENT_ACCESS_DENIED',
        });
      }
      
      if (payment.status !== 'COMPLETED') {
        return res.status(400).json({
          success: false,
          error: 'Receipt only available for completed payments',
          code: 'PAYMENT_NOT_COMPLETED',
        });
      }
      
      const receipt = payment.getReceiptData();
      
      res.json({
        success: true,
        data: {
          receipt: {
            ...receipt,
            user: payment.user,
            case: payment.case,
            generatedAt: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      logger.error('Get payment receipt failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate receipt',
        code: 'RECEIPT_GENERATION_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/payments/pending/success-fees
 * @desc Get pending success fee payments (Admin only)
 * @access Private (Admin)
 */
router.get('/pending/success-fees',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const pendingSuccessFees = await Payment.getSuccessFeesOwed();
      
      res.json({
        success: true,
        data: {
          pendingSuccessFees,
        },
      });
    } catch (error) {
      logger.error('Get pending success fees failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch pending success fees',
        code: 'PENDING_SUCCESS_FEES_FETCH_FAILED',
      });
    }
  }
);

module.exports = router;