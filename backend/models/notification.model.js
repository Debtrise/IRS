module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
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
    type: {
      type: DataTypes.ENUM(
        'CASE_UPDATE',
        'DOCUMENT_REQUEST',
        'DOCUMENT_APPROVED',
        'DOCUMENT_REJECTED',
        'FORM_READY',
        'SIGNATURE_REQUIRED',
        'PAYMENT_DUE',
        'PAYMENT_PROCESSED',
        'IRS_RESPONSE',
        'DEADLINE_REMINDER',
        'WELCOME',
        'SYSTEM_ALERT',
        'MARKETING'
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
      defaultValue: 'MEDIUM',
    },
    status: {
      type: DataTypes.ENUM('UNREAD', 'READ', 'ARCHIVED'),
      defaultValue: 'UNREAD',
    },
    
    // Delivery Channels
    channels: {
      type: DataTypes.ARRAY(DataTypes.ENUM('IN_APP', 'EMAIL', 'SMS', 'PUSH')),
      defaultValue: ['IN_APP'],
    },
    
    // Email Delivery
    emailSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'email_sent',
    },
    emailSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'email_sent_at',
    },
    emailOpened: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'email_opened',
    },
    emailOpenedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'email_opened_at',
    },
    
    // SMS Delivery
    smsSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'sms_sent',
    },
    smsSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'sms_sent_at',
    },
    
    // Push Notification
    pushSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'push_sent',
    },
    pushSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'push_sent_at',
    },
    
    // Related Entities
    relatedEntityType: {
      type: DataTypes.ENUM('CASE', 'DOCUMENT', 'FORM', 'PAYMENT', 'ASSESSMENT'),
      allowNull: true,
      field: 'related_entity_type',
    },
    relatedEntityId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'related_entity_id',
    },
    
    // Action Information
    actionRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'action_required',
    },
    actionUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'action_url',
    },
    actionText: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'action_text',
    },
    
    // Scheduling
    scheduledFor: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'scheduled_for',
      comment: 'When to send the notification',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expires_at',
      comment: 'When the notification expires',
    },
    
    // Read Information
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'read_at',
    },
    archivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'archived_at',
    },
    
    // Metadata
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional notification data',
    },
    
    // Template Information
    templateId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'template_id',
    },
    templateData: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'template_data',
      comment: 'Data for template rendering',
    },
  }, {
    tableName: 'notifications',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['priority'],
      },
      {
        fields: ['scheduled_for'],
      },
      {
        fields: ['related_entity_type', 'related_entity_id'],
      },
      {
        fields: ['created_at'],
      },
    ],
    scopes: {
      unread: {
        where: {
          status: 'UNREAD',
        },
      },
      actionRequired: {
        where: {
          actionRequired: true,
          status: 'UNREAD',
        },
      },
      byType: (type) => ({
        where: {
          type,
        },
      }),
    },
    hooks: {
      beforeSave: (notification) => {
        // Set read_at when status changes to read
        if (notification.changed('status') && notification.status === 'READ' && !notification.readAt) {
          notification.readAt = new Date();
        }
        
        // Set archived_at when status changes to archived
        if (notification.changed('status') && notification.status === 'ARCHIVED' && !notification.archivedAt) {
          notification.archivedAt = new Date();
        }
      },
    },
  });

  // Instance methods
  Notification.prototype.markAsRead = async function() {
    if (this.status === 'UNREAD') {
      this.status = 'READ';
      this.readAt = new Date();
      await this.save();
    }
    return this;
  };

  Notification.prototype.archive = async function() {
    this.status = 'ARCHIVED';
    this.archivedAt = new Date();
    await this.save();
    return this;
  };

  Notification.prototype.isExpired = function() {
    return this.expiresAt && new Date() > this.expiresAt;
  };

  Notification.prototype.shouldSend = function() {
    const now = new Date();
    
    // Check if expired
    if (this.isExpired()) {
      return false;
    }
    
    // Check if scheduled for future
    if (this.scheduledFor && now < this.scheduledFor) {
      return false;
    }
    
    return true;
  };

  Notification.prototype.markChannelSent = async function(channel) {
    const now = new Date();
    
    switch (channel) {
      case 'EMAIL':
        this.emailSent = true;
        this.emailSentAt = now;
        break;
      case 'SMS':
        this.smsSent = true;
        this.smsSentAt = now;
        break;
      case 'PUSH':
        this.pushSent = true;
        this.pushSentAt = now;
        break;
    }
    
    await this.save();
  };

  Notification.prototype.getDeliveryStatus = function() {
    return {
      email: {
        sent: this.emailSent,
        sentAt: this.emailSentAt,
        opened: this.emailOpened,
        openedAt: this.emailOpenedAt,
      },
      sms: {
        sent: this.smsSent,
        sentAt: this.smsSentAt,
      },
      push: {
        sent: this.pushSent,
        sentAt: this.pushSentAt,
      },
    };
  };

  // Class methods
  Notification.getUnreadByUser = async function(userId) {
    return this.findAll({
      where: {
        userId,
        status: 'UNREAD',
      },
      order: [['created_at', 'DESC']],
    });
  };

  Notification.getUnreadCountByUser = async function(userId) {
    return this.count({
      where: {
        userId,
        status: 'UNREAD',
      },
    });
  };

  Notification.markAllAsReadByUser = async function(userId) {
    return this.update(
      {
        status: 'READ',
        readAt: new Date(),
      },
      {
        where: {
          userId,
          status: 'UNREAD',
        },
      }
    );
  };

  Notification.getPendingDelivery = async function() {
    const now = new Date();
    
    return this.findAll({
      where: {
        [sequelize.Sequelize.Op.or]: [
          {
            channels: {
              [sequelize.Sequelize.Op.contains]: ['EMAIL'],
            },
            emailSent: false,
          },
          {
            channels: {
              [sequelize.Sequelize.Op.contains]: ['SMS'],
            },
            smsSent: false,
          },
          {
            channels: {
              [sequelize.Sequelize.Op.contains]: ['PUSH'],
            },
            pushSent: false,
          },
        ],
        [sequelize.Sequelize.Op.or]: [
          { scheduledFor: null },
          { scheduledFor: { [sequelize.Sequelize.Op.lte]: now } },
        ],
        [sequelize.Sequelize.Op.or]: [
          { expiresAt: null },
          { expiresAt: { [sequelize.Sequelize.Op.gt]: now } },
        ],
      },
      order: [['priority', 'DESC'], ['created_at', 'ASC']],
    });
  };

  Notification.createCaseUpdate = async function(userId, caseId, title, message, priority = 'MEDIUM') {
    return this.create({
      userId,
      type: 'CASE_UPDATE',
      title,
      message,
      priority,
      relatedEntityType: 'CASE',
      relatedEntityId: caseId,
      channels: ['IN_APP', 'EMAIL'],
      actionUrl: `/case/${caseId}`,
      actionText: 'View Case',
    });
  };

  Notification.createDocumentRequest = async function(userId, caseId, documentTypes, dueDate) {
    const documents = Array.isArray(documentTypes) ? documentTypes.join(', ') : documentTypes;
    
    return this.create({
      userId,
      type: 'DOCUMENT_REQUEST',
      title: 'Documents Required',
      message: `Please upload the following documents: ${documents}`,
      priority: 'HIGH',
      relatedEntityType: 'CASE',
      relatedEntityId: caseId,
      channels: ['IN_APP', 'EMAIL'],
      actionRequired: true,
      actionUrl: `/documents/upload?case=${caseId}`,
      actionText: 'Upload Documents',
      expiresAt: dueDate,
    });
  };

  Notification.createPaymentReminder = async function(userId, amount, dueDate, description) {
    return this.create({
      userId,
      type: 'PAYMENT_DUE',
      title: 'Payment Due',
      message: `Payment of $${amount} is due on ${dueDate.toDateString()}. ${description}`,
      priority: 'HIGH',
      channels: ['IN_APP', 'EMAIL', 'SMS'],
      actionRequired: true,
      actionUrl: '/payments',
      actionText: 'Make Payment',
      scheduledFor: new Date(dueDate.getTime() - 24 * 60 * 60 * 1000), // 1 day before
    });
  };

  return Notification;
};