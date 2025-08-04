module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
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
    documentType: {
      type: DataTypes.ENUM(
        'TAX_RETURN',
        'W2',
        '1099',
        'BANK_STATEMENT',
        'PAY_STUB',
        'IRS_TRANSCRIPT',
        'IRS_NOTICE',
        'FORM_433A',
        'FORM_433F',
        'FORM_656',
        'FORM_9465',
        'FORM_843',
        'FORM_8857',
        'POWER_OF_ATTORNEY',
        'IDENTIFICATION',
        'PROOF_OF_INCOME',
        'PROOF_OF_EXPENSES',
        'ASSET_DOCUMENTATION',
        'OTHER'
      ),
      allowNull: false,
      field: 'document_type',
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'file_name',
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'original_name',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'file_size',
      comment: 'File size in bytes',
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'mime_type',
    },
    storageLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'storage_location',
      comment: 'GCS file path',
    },
    bucketName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'bucket_name',
    },
    encryptionKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'encryption_key',
      comment: 'Reference to KMS key used',
    },
    status: {
      type: DataTypes.ENUM(
        'PENDING',
        'PROCESSING',
        'PROCESSED',
        'VERIFIED',
        'REJECTED',
        'DELETED'
      ),
      defaultValue: 'PENDING',
    },
    verificationStatus: {
      type: DataTypes.ENUM(
        'UNVERIFIED',
        'AUTO_VERIFIED',
        'MANUALLY_VERIFIED',
        'FAILED'
      ),
      defaultValue: 'UNVERIFIED',
      field: 'verification_status',
    },
    processedData: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'processed_data',
      comment: 'Extracted data from document processing',
    },
    ocrText: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ocr_text',
      comment: 'OCR extracted text',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional document metadata',
    },
    taxYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'tax_year',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expires_at',
      comment: 'For temporary documents',
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'uploaded_by',
      comment: 'User who uploaded (may differ from owner)',
    },
    verifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'verified_by',
      comment: 'User who verified the document',
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'verified_at',
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'rejection_reason',
    },
    signedUrl: {
      type: DataTypes.VIRTUAL,
      get() {
        // This will be populated when needed
        return this.getDataValue('signedUrl');
      },
    },
    isConfidential: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_confidential',
    },
    accessLog: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'access_log',
      comment: 'Log of document access',
    },
  }, {
    tableName: 'documents',
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
        fields: ['document_type'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['tax_year'],
      },
    ],
    scopes: {
      verified: {
        where: {
          verificationStatus: ['AUTO_VERIFIED', 'MANUALLY_VERIFIED'],
        },
      },
      active: {
        where: {
          status: {
            [sequelize.Sequelize.Op.notIn]: ['DELETED', 'REJECTED'],
          },
        },
      },
      byType: (type) => ({
        where: {
          documentType: type,
        },
      }),
    },
    hooks: {
      beforeDestroy: async (document) => {
        // Mark as deleted instead of hard delete
        document.status = 'DELETED';
        await document.save();
        throw new Error('Use soft delete');
      },
    },
  });

  // Instance methods
  Document.prototype.generateSignedUrl = async function(expirationMinutes = 60) {
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage();
    const bucket = storage.bucket(this.bucketName);
    const file = bucket.file(this.storageLocation);
    
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expirationMinutes * 60 * 1000,
    });
    
    // Log access
    if (!this.accessLog) {
      this.accessLog = [];
    }
    this.accessLog.push({
      timestamp: new Date(),
      action: 'generated_signed_url',
      expiresAt: new Date(Date.now() + expirationMinutes * 60 * 1000),
    });
    await this.save();
    
    return url;
  };

  Document.prototype.markAsVerified = async function(verifiedBy) {
    this.verificationStatus = 'MANUALLY_VERIFIED';
    this.verifiedBy = verifiedBy;
    this.verifiedAt = new Date();
    this.status = 'VERIFIED';
    return this.save();
  };

  Document.prototype.reject = async function(reason, rejectedBy) {
    this.status = 'REJECTED';
    this.verificationStatus = 'FAILED';
    this.rejectionReason = reason;
    this.verifiedBy = rejectedBy;
    this.verifiedAt = new Date();
    return this.save();
  };

  Document.prototype.getSecurityClassification = function() {
    const highSecurity = ['SSN', 'TAX_RETURN', 'BANK_STATEMENT', 'IRS_TRANSCRIPT'];
    const mediumSecurity = ['W2', '1099', 'PAY_STUB', 'FORM_433A', 'FORM_433F'];
    
    if (highSecurity.includes(this.documentType)) {
      return 'HIGH';
    } else if (mediumSecurity.includes(this.documentType)) {
      return 'MEDIUM';
    }
    return 'LOW';
  };

  // Class methods
  Document.getRequiredDocuments = function(programType) {
    const requirements = {
      OIC: [
        'TAX_RETURN',
        'IRS_TRANSCRIPT',
        'BANK_STATEMENT',
        'PAY_STUB',
        'FORM_433A',
        'FORM_656',
      ],
      IA: [
        'TAX_RETURN',
        'IRS_TRANSCRIPT',
        'PROOF_OF_INCOME',
        'FORM_9465',
      ],
      CNC: [
        'TAX_RETURN',
        'IRS_TRANSCRIPT',
        'BANK_STATEMENT',
        'PROOF_OF_EXPENSES',
        'FORM_433F',
      ],
      PA: [
        'TAX_RETURN',
        'IRS_NOTICE',
        'FORM_843',
      ],
      ISR: [
        'TAX_RETURN',
        'FORM_8857',
        'PROOF_OF_INCOME',
      ],
    };
    
    return requirements[programType] || [];
  };

  Document.checkRequirements = async function(caseId, programType) {
    const required = this.getRequiredDocuments(programType);
    const existing = await this.findAll({
      where: {
        caseId,
        documentType: required,
        status: ['PROCESSED', 'VERIFIED'],
      },
      attributes: ['documentType'],
    });
    
    const existingTypes = existing.map(doc => doc.documentType);
    const missing = required.filter(type => !existingTypes.includes(type));
    
    return {
      required,
      existing: existingTypes,
      missing,
      complete: missing.length === 0,
      progress: Math.round((existingTypes.length / required.length) * 100),
    };
  };

  return Document;
};