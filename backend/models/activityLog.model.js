module.exports = (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define('ActivityLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'User who performed the action (null for system actions)',
    },
    action: {
      type: DataTypes.ENUM(
        // User Actions
        'USER_LOGIN',
        'USER_LOGOUT',
        'USER_REGISTER',
        'USER_UPDATE_PROFILE',
        'USER_CHANGE_PASSWORD',
        'USER_ENABLE_2FA',
        'USER_DISABLE_2FA',
        
        // Case Actions
        'CASE_CREATED',
        'CASE_UPDATED',
        'CASE_STATUS_CHANGED',
        'CASE_ASSIGNED',
        'CASE_SUBMITTED',
        'CASE_CLOSED',
        
        // Document Actions
        'DOCUMENT_UPLOADED',
        'DOCUMENT_APPROVED',
        'DOCUMENT_REJECTED',
        'DOCUMENT_DELETED',
        'DOCUMENT_DOWNLOADED',
        
        // Form Actions
        'FORM_CREATED',
        'FORM_UPDATED',
        'FORM_SIGNED',
        'FORM_SUBMITTED',
        'FORM_APPROVED',
        'FORM_REJECTED',
        
        // Payment Actions
        'PAYMENT_INITIATED',
        'PAYMENT_COMPLETED',
        'PAYMENT_FAILED',
        'PAYMENT_REFUNDED',
        
        // Assessment Actions
        'ASSESSMENT_STARTED',
        'ASSESSMENT_COMPLETED',
        'ASSESSMENT_REVIEWED',
        
        // System Actions
        'SYSTEM_BACKUP',
        'SYSTEM_MAINTENANCE',
        'DATA_EXPORT',
        'DATA_IMPORT',
        
        // Security Actions
        'FAILED_LOGIN_ATTEMPT',
        'SUSPICIOUS_ACTIVITY',
        'PASSWORD_RESET_REQUESTED',
        'PASSWORD_RESET_COMPLETED',
        'ACCOUNT_LOCKED',
        'ACCOUNT_UNLOCKED'
      ),
      allowNull: false,
    },
    entityType: {
      type: DataTypes.ENUM('USER', 'CASE', 'DOCUMENT', 'FORM', 'PAYMENT', 'ASSESSMENT', 'NOTIFICATION'),
      allowNull: true,
      field: 'entity_type',
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'entity_id',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    
    // Context Information
    ipAddress: {
      type: DataTypes.INET,
      allowNull: true,
      field: 'ip_address',
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'user_agent',
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'session_id',
    },
    
    // Change Tracking
    oldValues: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'old_values',
      comment: 'Previous values for update actions',
    },
    newValues: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'new_values',
      comment: 'New values for update actions',
    },
    
    // Risk and Security
    riskScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'risk_score',
      validate: {
        min: 0,
        max: 100,
      },
      comment: 'Risk score for security monitoring',
    },
    severity: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      defaultValue: 'LOW',
    },
    
    // Additional Metadata
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional context data',
    },
    
    // Geo Location (optional)
    location: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Geographic location data',
    },
    
    // Success/Error Information
    success: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'error_message',
    },
    errorCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'error_code',
    },
    
    // Performance Metrics
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Action duration in milliseconds',
    },
    
    // Compliance and Audit
    complianceFlags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      field: 'compliance_flags',
      comment: 'Compliance-related flags',
    },
    auditRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'audit_required',
    },
    auditedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'audited_at',
    },
    auditedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'audited_by',
    },
  }, {
    tableName: 'activity_logs',
    timestamps: true,
    updatedAt: false, // Activity logs should not be updated
    paranoid: false, // Don't allow deletion of activity logs
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['action'],
      },
      {
        fields: ['entity_type', 'entity_id'],
      },
      {
        fields: ['severity'],
      },
      {
        fields: ['risk_score'],
      },
      {
        fields: ['created_at'],
      },
      {
        fields: ['ip_address'],
      },
      {
        fields: ['success'],
      },
    ],
    scopes: {
      security: {
        where: {
          action: {
            [sequelize.Sequelize.Op.in]: [
              'FAILED_LOGIN_ATTEMPT',
              'SUSPICIOUS_ACTIVITY',
              'ACCOUNT_LOCKED',
              'PASSWORD_RESET_REQUESTED',
            ],
          },
        },
      },
      highRisk: {
        where: {
          riskScore: {
            [sequelize.Sequelize.Op.gte]: 70,
          },
        },
      },
      errors: {
        where: {
          success: false,
        },
      },
    },
  });

  // Instance methods
  ActivityLog.prototype.isSecurityEvent = function() {
    const securityActions = [
      'FAILED_LOGIN_ATTEMPT',
      'SUSPICIOUS_ACTIVITY',
      'PASSWORD_RESET_REQUESTED',
      'PASSWORD_RESET_COMPLETED',
      'ACCOUNT_LOCKED',
      'ACCOUNT_UNLOCKED',
    ];
    return securityActions.includes(this.action);
  };

  ActivityLog.prototype.isHighRisk = function() {
    return this.riskScore >= 70;
  };

  ActivityLog.prototype.requiresAudit = function() {
    return this.auditRequired || this.isSecurityEvent() || this.isHighRisk();
  };

  // Class methods
  ActivityLog.logUserAction = async function(userId, action, description, options = {}) {
    return this.create({
      userId,
      action,
      description,
      entityType: options.entityType,
      entityId: options.entityId,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      sessionId: options.sessionId,
      metadata: options.metadata || {},
      oldValues: options.oldValues,
      newValues: options.newValues,
      riskScore: options.riskScore || 10,
      severity: options.severity || 'LOW',
      success: options.success !== false,
      errorMessage: options.errorMessage,
      errorCode: options.errorCode,
      duration: options.duration,
    });
  };

  ActivityLog.logSystemAction = async function(action, description, options = {}) {
    return this.create({
      userId: null, // System action
      action,
      description,
      entityType: options.entityType,
      entityId: options.entityId,
      metadata: options.metadata || {},
      severity: options.severity || 'LOW',
      success: options.success !== false,
      errorMessage: options.errorMessage,
      errorCode: options.errorCode,
      duration: options.duration,
    });
  };

  ActivityLog.logSecurityEvent = async function(userId, action, description, ipAddress, userAgent, riskScore = 80) {
    return this.create({
      userId,
      action,
      description,
      ipAddress,
      userAgent,
      riskScore,
      severity: riskScore >= 90 ? 'CRITICAL' : riskScore >= 70 ? 'HIGH' : 'MEDIUM',
      auditRequired: true,
      metadata: {
        securityEvent: true,
        timestamp: new Date().toISOString(),
      },
    });
  };

  ActivityLog.getSecurityEvents = async function(hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return this.findAll({
      where: {
        createdAt: {
          [sequelize.Sequelize.Op.gte]: since,
        },
        [sequelize.Sequelize.Op.or]: [
          { riskScore: { [sequelize.Sequelize.Op.gte]: 70 } },
          {
            action: {
              [sequelize.Sequelize.Op.in]: [
                'FAILED_LOGIN_ATTEMPT',
                'SUSPICIOUS_ACTIVITY',
                'ACCOUNT_LOCKED',
              ],
            },
          },
        ],
      },
      order: [['created_at', 'DESC']],
    });
  };

  ActivityLog.getUserActivity = async function(userId, limit = 50) {
    return this.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      limit,
    });
  };

  ActivityLog.getEntityActivity = async function(entityType, entityId, limit = 50) {
    return this.findAll({
      where: {
        entityType,
        entityId,
      },
      order: [['created_at', 'DESC']],
      limit,
    });
  };

  ActivityLog.getFailedLoginAttempts = async function(ipAddress, hours = 1) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return this.count({
      where: {
        action: 'FAILED_LOGIN_ATTEMPT',
        ipAddress,
        createdAt: {
          [sequelize.Sequelize.Op.gte]: since,
        },
      },
    });
  };

  ActivityLog.getUserLoginHistory = async function(userId, limit = 10) {
    return this.findAll({
      where: {
        userId,
        action: {
          [sequelize.Sequelize.Op.in]: ['USER_LOGIN', 'FAILED_LOGIN_ATTEMPT'],
        },
      },
      order: [['created_at', 'DESC']],
      limit,
    });
  };

  ActivityLog.generateAuditReport = async function(startDate, endDate) {
    return this.findAll({
      where: {
        createdAt: {
          [sequelize.Sequelize.Op.between]: [startDate, endDate],
        },
        [sequelize.Sequelize.Op.or]: [
          { auditRequired: true },
          { severity: { [sequelize.Sequelize.Op.in]: ['HIGH', 'CRITICAL'] } },
          { riskScore: { [sequelize.Sequelize.Op.gte]: 70 } },
        ],
      },
      order: [['created_at', 'DESC']],
    });
  };

  return ActivityLog;
};