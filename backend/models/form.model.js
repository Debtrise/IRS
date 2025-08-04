module.exports = (sequelize, DataTypes) => {
  const Form = sequelize.define('Form', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    caseId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'case_id',
      references: {
        model: 'cases',
        key: 'id',
      },
    },
    formType: {
      type: DataTypes.ENUM(
        'FORM_656', // Offer in Compromise
        'FORM_9465', // Installment Agreement
        'FORM_433A', // Collection Information Statement for Wage Earners
        'FORM_433F', // Collection Information Statement
        'FORM_843', // Claim for Refund and Request for Abatement
        'FORM_8857', // Request for Innocent Spouse Relief
        'FORM_2848', // Power of Attorney
        'FORM_911', // Taxpayer Advocate Service
        'CUSTOM_WORKSHEET'
      ),
      allowNull: false,
      field: 'form_type',
    },
    formTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'form_title',
    },
    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'IN_REVIEW',
        'READY_FOR_SIGNATURE',
        'SIGNED',
        'SUBMITTED',
        'ACCEPTED',
        'REJECTED',
        'NEEDS_REVISION'
      ),
      defaultValue: 'DRAFT',
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    // Form Data
    formData: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'form_data',
      comment: 'JSON object containing all form field values',
    },
    calculatedFields: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'calculated_fields',
      comment: 'Auto-calculated field values',
    },
    validationErrors: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'validation_errors',
      comment: 'Array of current validation errors',
    },
    
    // File Information
    generatedFileName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'generated_file_name',
    },
    storageLocation: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'storage_location',
      comment: 'GCS file path for generated form',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'file_size',
    },
    
    // Submission Information
    submissionMethod: {
      type: DataTypes.ENUM('MAIL', 'ELECTRONIC', 'FAX', 'IN_PERSON'),
      allowNull: true,
      field: 'submission_method',
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'submitted_at',
    },
    submittedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'submitted_by',
    },
    confirmationNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'confirmation_number',
    },
    
    // Signature Information
    requiresSignature: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'requires_signature',
    },
    signedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'signed_at',
    },
    signatureData: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'signature_data',
      comment: 'Digital signature information',
    },
    
    // Review Information
    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'reviewed_by',
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reviewed_at',
    },
    reviewNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'review_notes',
    },
    
    // IRS Response
    irsResponse: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'irs_response',
      comment: 'IRS response data',
    },
    responseDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'response_date',
    },
    
    // Metadata
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
      defaultValue: 'MEDIUM',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'due_date',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional form metadata',
    },
  }, {
    tableName: 'forms',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['case_id'],
      },
      {
        fields: ['form_type'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['due_date'],
      },
    ],
    hooks: {
      beforeSave: (form) => {
        // Auto-increment version if form data changed
        if (form.changed('formData') && form.status !== 'DRAFT') {
          form.version += 1;
        }
        
        // Clear validation errors if form data changed
        if (form.changed('formData')) {
          form.validationErrors = [];
        }
      },
    },
  });

  // Instance methods
  Form.prototype.validate = function() {
    const errors = [];
    const requiredFields = this.getRequiredFields();
    
    for (const field of requiredFields) {
      if (!this.formData[field] || this.formData[field] === '') {
        errors.push({
          field,
          message: `${field} is required`,
          type: 'REQUIRED_FIELD',
        });
      }
    }
    
    // Form-specific validations
    const specificErrors = this.validateFormSpecific();
    errors.push(...specificErrors);
    
    this.validationErrors = errors;
    return errors.length === 0;
  };

  Form.prototype.validateFormSpecific = function() {
    const errors = [];
    
    switch (this.formType) {
      case 'FORM_656':
        // OIC specific validations
        if (this.formData.offerAmount && this.formData.totalTaxLiability) {
          if (parseFloat(this.formData.offerAmount) > parseFloat(this.formData.totalTaxLiability)) {
            errors.push({
              field: 'offerAmount',
              message: 'Offer amount cannot exceed total tax liability',
              type: 'BUSINESS_RULE',
            });
          }
        }
        break;
        
      case 'FORM_9465':
        // Installment Agreement specific validations
        if (this.formData.monthlyPayment && this.formData.totalOwed) {
          const months = parseFloat(this.formData.totalOwed) / parseFloat(this.formData.monthlyPayment);
          if (months > 72) {
            errors.push({
              field: 'monthlyPayment',
              message: 'Payment plan cannot exceed 72 months',
              type: 'BUSINESS_RULE',
            });
          }
        }
        break;
    }
    
    return errors;
  };

  Form.prototype.getRequiredFields = function() {
    const commonFields = ['taxpayerName', 'ssn', 'address'];
    
    const formSpecificFields = {
      'FORM_656': ['offerAmount', 'paymentTerms', 'reasonForOffer'],
      'FORM_9465': ['monthlyPayment', 'paymentDate', 'totalOwed'],
      'FORM_433A': ['monthlyIncome', 'monthlyExpenses', 'assets'],
      'FORM_843': ['taxPeriod', 'reasonForRequest', 'explanation'],
      'FORM_8857': ['taxYear', 'spouseName', 'reliefRequested'],
    };
    
    return [...commonFields, ...(formSpecificFields[this.formType] || [])];
  };

  Form.prototype.canBeSubmitted = function() {
    return this.status === 'SIGNED' && 
           this.validationErrors.length === 0 && 
           this.storageLocation;
  };

  Form.prototype.generatePDF = async function() {
    const FormGenerator = require('../services/forms/form.generator');
    const generator = new FormGenerator();
    
    const result = await generator.generateForm(
      this.formType,
      this.formData,
      {
        userId: this.userId,
        caseId: this.caseId,
        formId: this.id,
      }
    );
    
    this.generatedFileName = result.filename;
    this.storageLocation = result.url;
    this.fileSize = result.size;
    
    await this.save();
    return result;
  };

  // Class methods
  Form.getByCase = async function(caseId) {
    return this.findAll({
      where: { caseId },
      order: [['created_at', 'DESC']],
    });
  };

  Form.getPendingReview = async function() {
    return this.findAll({
      where: {
        status: 'IN_REVIEW',
      },
      order: [['created_at', 'ASC']],
    });
  };

  Form.getFormTemplate = function(formType) {
    const templates = {
      'FORM_656': {
        title: 'Offer in Compromise',
        sections: [
          {
            name: 'taxpayerInfo',
            title: 'Taxpayer Information',
            fields: [
              { name: 'taxpayerName', type: 'text', required: true },
              { name: 'ssn', type: 'ssn', required: true },
              { name: 'address', type: 'address', required: true },
              { name: 'phone', type: 'phone', required: false },
            ],
          },
          {
            name: 'offerDetails',
            title: 'Offer Details',
            fields: [
              { name: 'offerAmount', type: 'currency', required: true },
              { name: 'paymentTerms', type: 'select', required: true, options: ['lump_sum', 'periodic'] },
              { name: 'reasonForOffer', type: 'textarea', required: true },
            ],
          },
        ],
      },
      // Add other form templates...
    };
    
    return templates[formType];
  };

  return Form;
};