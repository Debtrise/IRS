const express = require('express');
const router = express.Router();

const { Form, Case, User } = require('../models');
const { 
  authenticateToken,
  requireTaxProfessional,
  extractClientInfo,
} = require('../middleware/auth.middleware');
const { 
  validateFormCreation,
  validateUUID,
  validatePagination,
} = require('../middleware/validation.middleware');

/**
 * @route POST /api/forms
 * @desc Create a new form
 * @access Private
 */
router.post('/',
  authenticateToken,
  extractClientInfo,
  validateFormCreation,
  async (req, res) => {
    try {
      const formData = {
        ...req.body,
        userId: req.userId,
      };
      
      const form = await Form.create(formData);
      
      res.status(201).json({
        success: true,
        message: 'Form created successfully',
        data: {
          form,
        },
      });
    } catch (error) {
      logger.error('Form creation failed:', error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: 'FORM_CREATION_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/forms
 * @desc Get user's forms
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
      
      if (req.query.formType) {
        where.formType = req.query.formType;
      }
      if (req.query.status) {
        where.status = req.query.status;
      }
      if (req.query.caseId) {
        where.caseId = req.query.caseId;
      }
      
      const { count, rows: forms } = await Form.findAndCountAll({
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
          forms,
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
      logger.error('Get forms failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch forms',
        code: 'FORMS_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/forms/:formId
 * @desc Get form by ID
 * @access Private
 */
router.get('/:formId',
  authenticateToken,
  validateUUID('formId'),
  async (req, res) => {
    try {
      const { formId } = req.params;
      
      const form = await Form.findByPk(formId, {
        include: [
          {
            model: Case,
            as: 'case',
            attributes: ['id', 'caseId', 'programType', 'status'],
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
      });
      
      if (!form) {
        return res.status(404).json({
          success: false,
          error: 'Form not found',
          code: 'FORM_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (form.userId !== req.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'FORM_ACCESS_DENIED',
        });
      }
      
      res.json({
        success: true,
        data: {
          form,
        },
      });
    } catch (error) {
      logger.error('Get form failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch form',
        code: 'FORM_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route PUT /api/forms/:formId
 * @desc Update form
 * @access Private
 */
router.put('/:formId',
  authenticateToken,
  extractClientInfo,
  validateUUID('formId'),
  async (req, res) => {
    try {
      const { formId } = req.params;
      const updateData = req.body;
      
      const form = await Form.findByPk(formId);
      if (!form) {
        return res.status(404).json({
          success: false,
          error: 'Form not found',
          code: 'FORM_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (form.userId !== req.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'FORM_ACCESS_DENIED',
        });
      }
      
      // Don't allow updating signed or submitted forms
      if (['SIGNED', 'SUBMITTED', 'ACCEPTED'].includes(form.status)) {
        return res.status(400).json({
          success: false,
          error: 'Cannot update signed or submitted forms',
          code: 'FORM_LOCKED',
        });
      }
      
      await Form.update(updateData, { where: { id: formId } });
      
      const updatedForm = await Form.findByPk(formId, {
        include: ['case', 'user'],
      });
      
      res.json({
        success: true,
        message: 'Form updated successfully',
        data: {
          form: updatedForm,
        },
      });
    } catch (error) {
      logger.error('Form update failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update form',
        code: 'FORM_UPDATE_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/forms/:formId/validate
 * @desc Validate form data
 * @access Private
 */
router.post('/:formId/validate',
  authenticateToken,
  validateUUID('formId'),
  async (req, res) => {
    try {
      const { formId } = req.params;
      
      const form = await Form.findByPk(formId);
      if (!form) {
        return res.status(404).json({
          success: false,
          error: 'Form not found',
          code: 'FORM_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (form.userId !== req.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'FORM_ACCESS_DENIED',
        });
      }
      
      const isValid = form.validate();
      
      res.json({
        success: true,
        data: {
          isValid,
          errors: form.validationErrors,
        },
      });
    } catch (error) {
      logger.error('Form validation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to validate form',
        code: 'FORM_VALIDATION_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/forms/:formId/generate-pdf
 * @desc Generate PDF for form
 * @access Private
 */
router.post('/:formId/generate-pdf',
  authenticateToken,
  validateUUID('formId'),
  async (req, res) => {
    try {
      const { formId } = req.params;
      
      const form = await Form.findByPk(formId);
      if (!form) {
        return res.status(404).json({
          success: false,
          error: 'Form not found',
          code: 'FORM_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (form.userId !== req.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'FORM_ACCESS_DENIED',
        });
      }
      
      // Validate form before generating PDF
      const isValid = form.validate();
      if (!isValid) {
        return res.status(400).json({
          success: false,
          error: 'Form validation failed',
          code: 'FORM_VALIDATION_FAILED',
          errors: form.validationErrors,
        });
      }
      
      const result = await form.generatePDF();
      
      res.json({
        success: true,
        message: 'PDF generated successfully',
        data: {
          downloadUrl: result.url,
          fileName: result.filename,
        },
      });
    } catch (error) {
      logger.error('PDF generation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate PDF',
        code: 'PDF_GENERATION_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/forms/:formId/sign
 * @desc Sign form
 * @access Private
 */
router.post('/:formId/sign',
  authenticateToken,
  extractClientInfo,
  validateUUID('formId'),
  async (req, res) => {
    try {
      const { formId } = req.params;
      const { signature } = req.body;
      
      const form = await Form.findByPk(formId);
      if (!form) {
        return res.status(404).json({
          success: false,
          error: 'Form not found',
          code: 'FORM_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (form.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          error: 'Only the form owner can sign',
          code: 'FORM_SIGN_DENIED',
        });
      }
      
      if (form.status !== 'READY_FOR_SIGNATURE') {
        return res.status(400).json({
          success: false,
          error: 'Form is not ready for signature',
          code: 'FORM_NOT_READY',
        });
      }
      
      // Validate form before signing
      const isValid = form.validate();
      if (!isValid) {
        return res.status(400).json({
          success: false,
          error: 'Form validation failed',
          code: 'FORM_VALIDATION_FAILED',
          errors: form.validationErrors,
        });
      }
      
      await Form.update(
        {
          status: 'SIGNED',
          signedAt: new Date(),
          signatureData: {
            signature,
            signedBy: req.userId,
            signedAt: new Date(),
            ipAddress: req.clientInfo.ipAddress,
            userAgent: req.clientInfo.userAgent,
          },
        },
        { where: { id: formId } }
      );
      
      const updatedForm = await Form.findByPk(formId);
      
      res.json({
        success: true,
        message: 'Form signed successfully',
        data: {
          form: updatedForm,
        },
      });
    } catch (error) {
      logger.error('Form signing failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sign form',
        code: 'FORM_SIGNING_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/forms/:formId/submit
 * @desc Submit form to IRS
 * @access Private (Tax Professional, Admin)
 */
router.post('/:formId/submit',
  authenticateToken,
  requireTaxProfessional,
  extractClientInfo,
  validateUUID('formId'),
  async (req, res) => {
    try {
      const { formId } = req.params;
      const { submissionMethod } = req.body;
      
      const form = await Form.findByPk(formId);
      if (!form) {
        return res.status(404).json({
          success: false,
          error: 'Form not found',
          code: 'FORM_NOT_FOUND',
        });
      }
      
      if (!form.canBeSubmitted()) {
        return res.status(400).json({
          success: false,
          error: 'Form is not ready for submission',
          code: 'FORM_NOT_READY',
        });
      }
      
      const confirmationNumber = `OT${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      await Form.update(
        {
          status: 'SUBMITTED',
          submittedAt: new Date(),
          submittedBy: req.userId,
          submissionMethod: submissionMethod || 'ELECTRONIC',
          confirmationNumber,
        },
        { where: { id: formId } }
      );
      
      const updatedForm = await Form.findByPk(formId);
      
      res.json({
        success: true,
        message: 'Form submitted successfully',
        data: {
          form: updatedForm,
          confirmationNumber,
        },
      });
    } catch (error) {
      logger.error('Form submission failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit form',
        code: 'FORM_SUBMISSION_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/forms/templates/:formType
 * @desc Get form template
 * @access Private
 */
router.get('/templates/:formType',
  authenticateToken,
  async (req, res) => {
    try {
      const { formType } = req.params;
      
      const template = Form.getFormTemplate(formType);
      
      if (!template) {
        return res.status(404).json({
          success: false,
          error: 'Form template not found',
          code: 'TEMPLATE_NOT_FOUND',
        });
      }
      
      res.json({
        success: true,
        data: {
          template,
        },
      });
    } catch (error) {
      logger.error('Get form template failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch form template',
        code: 'TEMPLATE_FETCH_FAILED',
      });
    }
  }
);

module.exports = router;