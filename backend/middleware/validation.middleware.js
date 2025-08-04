const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value,
        location: error.location,
      })),
    });
  }
  next();
};

/**
 * User registration validation
 */
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone('en-US')
    .withMessage('Valid US phone number is required'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Valid date of birth is required'),
  body('address.street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Street address must be between 5 and 100 characters'),
  body('address.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('address.state')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('State must be 2 characters'),
  body('address.zip')
    .optional()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Valid ZIP code is required'),
  handleValidationErrors,
];

/**
 * User login validation
 */
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('twoFactorToken')
    .optional()
    .matches(/^\d{6}$/)
    .withMessage('Two-factor token must be 6 digits'),
  handleValidationErrors,
];

/**
 * Google OAuth validation
 */
const validateGoogleAuth = [
  body('idToken')
    .notEmpty()
    .withMessage('Google ID token is required'),
  handleValidationErrors,
];

/**
 * Password reset request validation
 */
const validatePasswordResetRequest = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  handleValidationErrors,
];

/**
 * Password reset validation
 */
const validatePasswordReset = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  handleValidationErrors,
];

/**
 * UUID parameter validation
 */
const validateUUID = (paramName) => [
  param(paramName)
    .isUUID()
    .withMessage(`${paramName} must be a valid UUID`),
  handleValidationErrors,
];

/**
 * Case creation validation
 */
const validateCaseCreation = [
  body('programType')
    .isIn(['OIC', 'IA', 'CNC', 'PA', 'ISR', 'AUDIT', 'MULTIPLE'])
    .withMessage('Valid program type is required'),
  body('totalDebt')
    .isFloat({ min: 0.01 })
    .withMessage('Total debt must be a positive number'),
  body('taxYears')
    .isArray({ min: 1 })
    .withMessage('At least one tax year is required'),
  body('taxYears.*')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Valid tax years are required'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Valid priority is required'),
  handleValidationErrors,
];

/**
 * Assessment validation
 */
const validateAssessment = [
  body('allReturnsFiled')
    .isBoolean()
    .withMessage('Filing status is required'),
  body('filingStatus')
    .optional()
    .isIn(['SINGLE', 'MARRIED_JOINT', 'MARRIED_SEPARATE', 'HEAD_OF_HOUSEHOLD', 'WIDOW'])
    .withMessage('Valid filing status is required'),
  body('totalTaxDebt')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total tax debt must be a positive number'),
  body('monthlyIncome')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monthly income must be a positive number'),
  body('monthlyExpenses')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monthly expenses must be a positive number'),
  body('totalAssets')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total assets must be a positive number'),
  handleValidationErrors,
];

/**
 * Document upload validation
 */
const validateDocumentUpload = [
  body('documentType')
    .isIn([
      'TAX_RETURN', 'W2', '1099', 'BANK_STATEMENT', 'PAY_STUB',
      'IRS_TRANSCRIPT', 'IRS_NOTICE', 'FORM_433A', 'FORM_433F',
      'FORM_656', 'FORM_9465', 'FORM_843', 'FORM_8857',
      'POWER_OF_ATTORNEY', 'IDENTIFICATION', 'PROOF_OF_INCOME',
      'PROOF_OF_EXPENSES', 'ASSET_DOCUMENTATION', 'OTHER'
    ])
    .withMessage('Valid document type is required'),
  body('taxYear')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Valid tax year is required'),
  body('caseId')
    .optional()
    .isUUID()
    .withMessage('Case ID must be a valid UUID'),
  handleValidationErrors,
];

/**
 * Form validation
 */
const validateFormCreation = [
  body('formType')
    .isIn([
      'FORM_656', 'FORM_9465', 'FORM_433A', 'FORM_433F',
      'FORM_843', 'FORM_8857', 'FORM_2848', 'FORM_911',
      'CUSTOM_WORKSHEET'
    ])
    .withMessage('Valid form type is required'),
  body('caseId')
    .isUUID()
    .withMessage('Case ID must be a valid UUID'),
  body('formData')
    .isObject()
    .withMessage('Form data must be an object'),
  handleValidationErrors,
];

/**
 * Payment validation
 */
const validatePayment = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('paymentType')
    .isIn(['SERVICE_FEE', 'SUCCESS_FEE', 'IRS_PAYMENT', 'SETUP_FEE', 'CONSULTATION_FEE'])
    .withMessage('Valid payment type is required'),
  body('paymentMethod')
    .isIn(['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'ACH', 'CHECK', 'CASH', 'WIRE_TRANSFER'])
    .withMessage('Valid payment method is required'),
  body('caseId')
    .optional()
    .isUUID()
    .withMessage('Case ID must be a valid UUID'),
  handleValidationErrors,
];

/**
 * Notification validation
 */
const validateNotification = [
  body('type')
    .isIn([
      'CASE_UPDATE', 'DOCUMENT_REQUEST', 'DOCUMENT_APPROVED', 'DOCUMENT_REJECTED',
      'FORM_READY', 'SIGNATURE_REQUIRED', 'PAYMENT_DUE', 'PAYMENT_PROCESSED',
      'IRS_RESPONSE', 'DEADLINE_REMINDER', 'WELCOME', 'SYSTEM_ALERT', 'MARKETING'
    ])
    .withMessage('Valid notification type is required'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Valid priority is required'),
  body('channels')
    .optional()
    .isArray()
    .withMessage('Channels must be an array'),
  body('channels.*')
    .optional()
    .isIn(['IN_APP', 'EMAIL', 'SMS', 'PUSH'])
    .withMessage('Valid channels are required'),
  handleValidationErrors,
];

/**
 * User profile update validation
 */
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone('en-US')
    .withMessage('Valid US phone number is required'),
  body('address.street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Street address must be between 5 and 100 characters'),
  body('address.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('address.state')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('State must be 2 characters'),
  body('address.zip')
    .optional()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Valid ZIP code is required'),
  handleValidationErrors,
];

/**
 * Query parameter validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Sort field must be specified'),
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC', 'asc', 'desc'])
    .withMessage('Sort order must be ASC or DESC'),
  handleValidationErrors,
];

/**
 * File upload validation middleware
 */
const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'No file uploaded',
      code: 'MISSING_FILE',
    });
  }
  
  // Check file size (50MB max)
  const maxSize = 50 * 1024 * 1024;
  if (req.file.size > maxSize) {
    return res.status(400).json({
      error: 'File too large',
      code: 'FILE_TOO_LARGE',
      maxSize: '50MB',
    });
  }
  
  // Check file type
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
  
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      error: 'Invalid file type',
      code: 'INVALID_FILE_TYPE',
      allowedTypes: ['PDF', 'JPG', 'PNG', 'GIF', 'Excel', 'Word'],
    });
  }
  
  next();
};

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateGoogleAuth,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateUUID,
  validateCaseCreation,
  validateAssessment,
  validateDocumentUpload,
  validateFormCreation,
  validatePayment,
  validateNotification,
  validateProfileUpdate,
  validatePagination,
  validateFileUpload,
};