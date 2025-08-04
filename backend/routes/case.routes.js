const express = require('express');
const router = express.Router();

const { Case, User, Document, Form, Assessment } = require('../models');
const { 
  authenticateToken,
  requireOwnership,
  requireTaxProfessional,
  extractClientInfo,
} = require('../middleware/auth.middleware');
const { 
  validateCaseCreation,
  validateUUID,
  validatePagination,
} = require('../middleware/validation.middleware');

/**
 * @route POST /api/cases
 * @desc Create a new case
 * @access Private
 */
router.post('/',
  authenticateToken,
  extractClientInfo,
  validateCaseCreation,
  async (req, res) => {
    try {
      const caseData = {
        ...req.body,
        userId: req.userId,
        caseId: Case.generateCaseId(),
      };
      
      const newCase = await Case.create(caseData);
      
      res.status(201).json({
        success: true,
        message: 'Case created successfully',
        data: {
          case: newCase,
        },
      });
    } catch (error) {
      logger.error('Case creation failed:', error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: 'CASE_CREATION_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/cases
 * @desc Get user's cases
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
      
      // Regular users see only their own cases
      if (req.user.role === 'client') {
        where.userId = req.userId;
      }
      
      // Tax professionals see assigned cases
      if (req.user.role === 'tax_professional') {
        where.assignedTo = req.userId;
      }
      
      // Add filters
      if (req.query.status) {
        where.status = req.query.status;
      }
      if (req.query.programType) {
        where.programType = req.query.programType;
      }
      if (req.query.priority) {
        where.priority = req.query.priority;
      }
      
      const { count, rows: cases } = await Case.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
          {
            model: Document,
            as: 'documents',
            attributes: ['id', 'documentType', 'status', 'createdAt'],
          },
          {
            model: Assessment,
            as: 'assessment',
            attributes: ['id', 'status', 'eligibilityScore', 'completedAt'],
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
          cases,
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
      logger.error('Get cases failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch cases',
        code: 'CASES_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/cases/:caseId
 * @desc Get case by ID
 * @access Private
 */
router.get('/:caseId',
  authenticateToken,
  validateUUID('caseId'),
  async (req, res) => {
    try {
      const { caseId } = req.params;
      
      const caseRecord = await Case.findByPk(caseId, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
          },
          {
            model: Document,
            as: 'documents',
            where: { status: { [require('sequelize').Op.ne]: 'DELETED' } },
            required: false,
          },
          {
            model: Form,
            as: 'forms',
            required: false,
          },
          {
            model: Assessment,
            as: 'assessment',
            required: false,
          },
        ],
      });
      
      if (!caseRecord) {
        return res.status(404).json({
          success: false,
          error: 'Case not found',
          code: 'CASE_NOT_FOUND',
        });
      }
      
      // Check access permissions
      const canAccess = await this.checkCaseAccess(req.user, caseRecord);
      if (!canAccess) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'CASE_ACCESS_DENIED',
        });
      }
      
      // Add calculated fields
      const caseWithCalculations = {
        ...caseRecord.toJSON(),
        progress: caseRecord.calculateProgress(),
        daysInCurrentStatus: caseRecord.getDaysInCurrentStatus(),
        isOverdue: caseRecord.isOverdue(),
      };
      
      res.json({
        success: true,
        data: {
          case: caseWithCalculations,
        },
      });
    } catch (error) {
      logger.error('Get case failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch case',
        code: 'CASE_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route PUT /api/cases/:caseId
 * @desc Update case
 * @access Private
 */
router.put('/:caseId',
  authenticateToken,
  extractClientInfo,
  validateUUID('caseId'),
  async (req, res) => {
    try {
      const { caseId } = req.params;
      const updateData = req.body;
      
      const caseRecord = await Case.findByPk(caseId);
      if (!caseRecord) {
        return res.status(404).json({
          success: false,
          error: 'Case not found',
          code: 'CASE_NOT_FOUND',
        });
      }
      
      // Check access permissions
      const canAccess = await this.checkCaseAccess(req.user, caseRecord);
      if (!canAccess) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'CASE_ACCESS_DENIED',
        });
      }
      
      // Prevent clients from updating certain fields
      if (req.user.role === 'client') {
        const allowedFields = ['notes', 'metadata'];
        Object.keys(updateData).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete updateData[key];
          }
        });
      }
      
      await Case.update(updateData, { where: { id: caseId } });
      
      const updatedCase = await Case.findByPk(caseId, {
        include: ['user', 'documents', 'forms', 'assessment'],
      });
      
      res.json({
        success: true,
        message: 'Case updated successfully',
        data: {
          case: updatedCase,
        },
      });
    } catch (error) {
      logger.error('Case update failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update case',
        code: 'CASE_UPDATE_FAILED',
      });
    }
  }
);

/**
 * @route PUT /api/cases/:caseId/status
 * @desc Update case status
 * @access Private (Tax Professional or Admin)
 */
router.put('/:caseId/status',
  authenticateToken,
  requireTaxProfessional,
  extractClientInfo,
  validateUUID('caseId'),
  async (req, res) => {
    try {
      const { caseId } = req.params;
      const { status, notes } = req.body;
      
      const validStatuses = [
        'INITIAL_ASSESSMENT', 'DOCUMENT_COLLECTION', 'FORM_PREPARATION',
        'REVIEW', 'SUBMISSION', 'IRS_PROCESSING', 'NEGOTIATION',
        'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'ON_HOLD', 'CLOSED'
      ];
      
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Valid status is required',
          code: 'INVALID_STATUS',
        });
      }
      
      const caseRecord = await Case.findByPk(caseId);
      if (!caseRecord) {
        return res.status(404).json({
          success: false,
          error: 'Case not found',
          code: 'CASE_NOT_FOUND',
        });
      }
      
      const oldStatus = caseRecord.status;
      await Case.update(
        { 
          status,
          notes: notes || caseRecord.notes,
        },
        { where: { id: caseId } }
      );
      
      res.json({
        success: true,
        message: 'Case status updated successfully',
        data: {
          caseId,
          oldStatus,
          newStatus: status,
        },
      });
    } catch (error) {
      logger.error('Case status update failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update case status',
        code: 'STATUS_UPDATE_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/cases/:caseId/assign
 * @desc Assign case to tax professional
 * @access Private (Admin)
 */
router.post('/:caseId/assign',
  authenticateToken,
  requireTaxProfessional,
  extractClientInfo,
  validateUUID('caseId'),
  async (req, res) => {
    try {
      const { caseId } = req.params;
      const { assignedTo } = req.body;
      
      if (!assignedTo) {
        return res.status(400).json({
          success: false,
          error: 'Tax professional ID is required',
          code: 'ASSIGNED_TO_REQUIRED',
        });
      }
      
      // Verify the assigned user is a tax professional
      const taxProfessional = await User.findOne({
        where: {
          id: assignedTo,
          role: ['tax_professional', 'admin'],
        },
      });
      
      if (!taxProfessional) {
        return res.status(400).json({
          success: false,
          error: 'Invalid tax professional',
          code: 'INVALID_TAX_PROFESSIONAL',
        });
      }
      
      const caseRecord = await Case.findByPk(caseId);
      if (!caseRecord) {
        return res.status(404).json({
          success: false,
          error: 'Case not found',
          code: 'CASE_NOT_FOUND',
        });
      }
      
      await Case.update(
        { assignedTo },
        { where: { id: caseId } }
      );
      
      res.json({
        success: true,
        message: 'Case assigned successfully',
        data: {
          caseId,
          assignedTo: taxProfessional.getFullName(),
        },
      });
    } catch (error) {
      logger.error('Case assignment failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to assign case',
        code: 'CASE_ASSIGNMENT_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/cases/:caseId/documents/requirements
 * @desc Get document requirements for case
 * @access Private
 */
router.get('/:caseId/documents/requirements',
  authenticateToken,
  validateUUID('caseId'),
  async (req, res) => {
    try {
      const { caseId } = req.params;
      
      const caseRecord = await Case.findByPk(caseId);
      if (!caseRecord) {
        return res.status(404).json({
          success: false,
          error: 'Case not found',
          code: 'CASE_NOT_FOUND',
        });
      }
      
      // Check access permissions
      const canAccess = await this.checkCaseAccess(req.user, caseRecord);
      if (!canAccess) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'CASE_ACCESS_DENIED',
        });
      }
      
      const requirements = await Document.checkRequirements(caseId, caseRecord.programType);
      
      res.json({
        success: true,
        data: {
          requirements,
        },
      });
    } catch (error) {
      logger.error('Get document requirements failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch document requirements',
        code: 'REQUIREMENTS_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/cases/:caseId/timeline
 * @desc Get case timeline/history
 * @access Private
 */
router.get('/:caseId/timeline',
  authenticateToken,
  validateUUID('caseId'),
  async (req, res) => {
    try {
      const { caseId } = req.params;
      
      const caseRecord = await Case.findByPk(caseId);
      if (!caseRecord) {
        return res.status(404).json({
          success: false,
          error: 'Case not found',
          code: 'CASE_NOT_FOUND',
        });
      }
      
      // Check access permissions
      const canAccess = await this.checkCaseAccess(req.user, caseRecord);
      if (!canAccess) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'CASE_ACCESS_DENIED',
        });
      }
      
      // Get state history
      const timeline = caseRecord.stateHistory || [];
      
      // Add additional timeline events from activity logs
      const { ActivityLog } = require('../models');
      const activities = await ActivityLog.findAll({
        where: {
          entityType: 'CASE',
          entityId: caseId,
        },
        order: [['created_at', 'ASC']],
      });
      
      // Merge and sort timeline
      const mergedTimeline = [
        ...timeline.map(event => ({
          ...event,
          type: 'status_change',
        })),
        ...activities.map(activity => ({
          timestamp: activity.createdAt,
          action: activity.action,
          description: activity.description,
          type: 'activity',
        })),
      ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      res.json({
        success: true,
        data: {
          timeline: mergedTimeline,
        },
      });
    } catch (error) {
      logger.error('Get case timeline failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch case timeline',
        code: 'TIMELINE_FETCH_FAILED',
      });
    }
  }
);

// Helper method to check case access
router.checkCaseAccess = async (user, caseRecord) => {
  // Admin can access all cases
  if (user.role === 'admin') {
    return true;
  }
  
  // Users can access their own cases
  if (user.userId === caseRecord.userId) {
    return true;
  }
  
  // Tax professionals can access assigned cases
  if (user.role === 'tax_professional' && user.userId === caseRecord.assignedTo) {
    return true;
  }
  
  return false;
};

module.exports = router;