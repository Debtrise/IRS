const express = require('express');
const multer = require('multer');
const router = express.Router();

const { Document, Case, ActivityLog } = require('../models');
const documentService = require('../services/document/document.service');
const { 
  authenticateToken,
  requireOwnership,
  extractClientInfo,
} = require('../middleware/auth.middleware');
const { 
  validateDocumentUpload,
  validateUUID,
  validatePagination,
  validateFileUpload,
} = require('../middleware/validation.middleware');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});

/**
 * @route POST /api/documents/upload
 * @desc Upload a document
 * @access Private
 */
router.post('/upload',
  authenticateToken,
  extractClientInfo,
  upload.single('file'),
  validateFileUpload,
  validateDocumentUpload,
  async (req, res) => {
    try {
      const { documentType, taxYear, caseId } = req.body;
      const file = req.file;
      
      // Verify case ownership if caseId provided
      if (caseId) {
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
            error: 'Access denied to this case',
            code: 'CASE_ACCESS_DENIED',
          });
        }
      }
      
      const uploadResult = await documentService.uploadDocument(
        file,
        req.userId,
        caseId,
        documentType,
        { taxYear }
      );
      
      // Log document upload
      await ActivityLog.logUserAction(
        req.userId,
        'DOCUMENT_UPLOADED',
        `Document uploaded: ${file.originalname}`,
        {
          ipAddress: req.clientInfo.ipAddress,
          userAgent: req.clientInfo.userAgent,
          entityType: 'DOCUMENT',
          entityId: uploadResult.document.id,
          metadata: {
            documentType,
            fileName: file.originalname,
            fileSize: file.size,
          },
        }
      );
      
      res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: {
          document: uploadResult.document,
          url: uploadResult.url,
        },
      });
    } catch (error) {
      logger.error('Document upload failed:', error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: 'DOCUMENT_UPLOAD_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/documents
 * @desc Get user's documents
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
      if (req.query.documentType) {
        where.documentType = req.query.documentType;
      }
      if (req.query.status) {
        where.status = req.query.status;
      }
      if (req.query.caseId) {
        where.caseId = req.query.caseId;
      }
      if (req.query.taxYear) {
        where.taxYear = req.query.taxYear;
      }
      
      const { count, rows: documents } = await Document.findAndCountAll({
        where,
        include: [
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
          documents,
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
      logger.error('Get documents failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch documents',
        code: 'DOCUMENTS_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/documents/:documentId
 * @desc Get document by ID
 * @access Private
 */
router.get('/:documentId',
  authenticateToken,
  validateUUID('documentId'),
  async (req, res) => {
    try {
      const { documentId } = req.params;
      
      const document = await Document.findByPk(documentId, {
        include: [
          {
            model: Case,
            as: 'case',
            attributes: ['id', 'caseId', 'programType', 'status'],
          },
        ],
      });
      
      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (document.userId !== req.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'DOCUMENT_ACCESS_DENIED',
        });
      }
      
      res.json({
        success: true,
        data: {
          document,
        },
      });
    } catch (error) {
      logger.error('Get document failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch document',
        code: 'DOCUMENT_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/documents/:documentId/download
 * @desc Download document
 * @access Private
 */
router.get('/:documentId/download',
  authenticateToken,
  extractClientInfo,
  validateUUID('documentId'),
  async (req, res) => {
    try {
      const { documentId } = req.params;
      
      const document = await Document.findByPk(documentId);
      
      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (document.userId !== req.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'DOCUMENT_ACCESS_DENIED',
        });
      }
      
      // Generate signed URL for download
      const signedUrl = await document.generateSignedUrl(60); // 1 hour expiry
      
      // Log document access
      await ActivityLog.logUserAction(
        req.userId,
        'DOCUMENT_DOWNLOADED',
        `Document downloaded: ${document.originalName}`,
        {
          ipAddress: req.clientInfo.ipAddress,
          userAgent: req.clientInfo.userAgent,
          entityType: 'DOCUMENT',
          entityId: documentId,
        }
      );
      
      res.json({
        success: true,
        data: {
          downloadUrl: signedUrl,
          fileName: document.originalName,
          expiresIn: 3600, // 1 hour in seconds
        },
      });
    } catch (error) {
      logger.error('Document download failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate download link',
        code: 'DOCUMENT_DOWNLOAD_FAILED',
      });
    }
  }
);

/**
 * @route PUT /api/documents/:documentId/verify
 * @desc Verify document (Tax Professional or Admin)
 * @access Private (Tax Professional, Admin)
 */
router.put('/:documentId/verify',
  authenticateToken,
  extractClientInfo,
  validateUUID('documentId'),
  async (req, res) => {
    try {
      const { documentId } = req.params;
      
      if (!['admin', 'tax_professional'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
        });
      }
      
      const document = await Document.findByPk(documentId);
      
      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND',
        });
      }
      
      await document.markAsVerified(req.userId);
      
      // Log document verification
      await ActivityLog.logUserAction(
        req.userId,
        'DOCUMENT_APPROVED',
        `Document verified: ${document.originalName}`,
        {
          ipAddress: req.clientInfo.ipAddress,
          userAgent: req.clientInfo.userAgent,
          entityType: 'DOCUMENT',
          entityId: documentId,
        }
      );
      
      res.json({
        success: true,
        message: 'Document verified successfully',
        data: {
          document,
        },
      });
    } catch (error) {
      logger.error('Document verification failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify document',
        code: 'DOCUMENT_VERIFICATION_FAILED',
      });
    }
  }
);

/**
 * @route PUT /api/documents/:documentId/reject
 * @desc Reject document (Tax Professional or Admin)
 * @access Private (Tax Professional, Admin)
 */
router.put('/:documentId/reject',
  authenticateToken,
  extractClientInfo,
  validateUUID('documentId'),
  async (req, res) => {
    try {
      const { documentId } = req.params;
      const { reason } = req.body;
      
      if (!['admin', 'tax_professional'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
        });
      }
      
      if (!reason) {
        return res.status(400).json({
          success: false,
          error: 'Rejection reason is required',
          code: 'REASON_REQUIRED',
        });
      }
      
      const document = await Document.findByPk(documentId);
      
      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND',
        });
      }
      
      await document.reject(reason, req.userId);
      
      // Log document rejection
      await ActivityLog.logUserAction(
        req.userId,
        'DOCUMENT_REJECTED',
        `Document rejected: ${document.originalName} - ${reason}`,
        {
          ipAddress: req.clientInfo.ipAddress,
          userAgent: req.clientInfo.userAgent,
          entityType: 'DOCUMENT',
          entityId: documentId,
          metadata: { rejectionReason: reason },
        }
      );
      
      res.json({
        success: true,
        message: 'Document rejected',
        data: {
          document,
          rejectionReason: reason,
        },
      });
    } catch (error) {
      logger.error('Document rejection failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reject document',
        code: 'DOCUMENT_REJECTION_FAILED',
      });
    }
  }
);

/**
 * @route DELETE /api/documents/:documentId
 * @desc Delete document (soft delete)
 * @access Private
 */
router.delete('/:documentId',
  authenticateToken,
  extractClientInfo,
  validateUUID('documentId'),
  async (req, res) => {
    try {
      const { documentId } = req.params;
      
      const document = await Document.findByPk(documentId);
      
      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (document.userId !== req.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'DOCUMENT_ACCESS_DENIED',
        });
      }
      
      // Soft delete
      await Document.update(
        { status: 'DELETED' },
        { where: { id: documentId } }
      );
      
      // Log document deletion
      await ActivityLog.logUserAction(
        req.userId,
        'DOCUMENT_DELETED',
        `Document deleted: ${document.originalName}`,
        {
          ipAddress: req.clientInfo.ipAddress,
          userAgent: req.clientInfo.userAgent,
          entityType: 'DOCUMENT',
          entityId: documentId,
        }
      );
      
      res.json({
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error) {
      logger.error('Document deletion failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete document',
        code: 'DOCUMENT_DELETE_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/documents/types
 * @desc Get available document types
 * @access Private
 */
router.get('/types',
  authenticateToken,
  async (req, res) => {
    try {
      const documentTypes = [
        { value: 'TAX_RETURN', label: 'Tax Return', description: 'Filed tax returns' },
        { value: 'W2', label: 'W-2 Form', description: 'Wage and tax statement' },
        { value: '1099', label: '1099 Form', description: 'Income reporting forms' },
        { value: 'BANK_STATEMENT', label: 'Bank Statement', description: 'Bank account statements' },
        { value: 'PAY_STUB', label: 'Pay Stub', description: 'Pay stubs or salary slips' },
        { value: 'IRS_TRANSCRIPT', label: 'IRS Transcript', description: 'Official IRS transcripts' },
        { value: 'IRS_NOTICE', label: 'IRS Notice', description: 'IRS notices or letters' },
        { value: 'FORM_433A', label: 'Form 433-A', description: 'Collection Information Statement' },
        { value: 'FORM_433F', label: 'Form 433-F', description: 'Collection Information Statement' },
        { value: 'FORM_656', label: 'Form 656', description: 'Offer in Compromise' },
        { value: 'FORM_9465', label: 'Form 9465', description: 'Installment Agreement Request' },
        { value: 'FORM_843', label: 'Form 843', description: 'Claim for Refund and Request for Abatement' },
        { value: 'FORM_8857', label: 'Form 8857', description: 'Request for Innocent Spouse Relief' },
        { value: 'POWER_OF_ATTORNEY', label: 'Power of Attorney', description: 'Form 2848' },
        { value: 'IDENTIFICATION', label: 'Identification', description: 'Driver\'s license, passport, etc.' },
        { value: 'PROOF_OF_INCOME', label: 'Proof of Income', description: 'Income verification documents' },
        { value: 'PROOF_OF_EXPENSES', label: 'Proof of Expenses', description: 'Expense verification documents' },
        { value: 'ASSET_DOCUMENTATION', label: 'Asset Documentation', description: 'Property deeds, investment statements' },
        { value: 'OTHER', label: 'Other', description: 'Other relevant documents' },
      ];
      
      res.json({
        success: true,
        data: {
          documentTypes,
        },
      });
    } catch (error) {
      logger.error('Get document types failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch document types',
        code: 'DOCUMENT_TYPES_FETCH_FAILED',
      });
    }
  }
);

module.exports = router;