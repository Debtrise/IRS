module.exports = (sequelize, DataTypes) => {
  const Case = sequelize.define('Case', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    caseId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      field: 'case_id',
      comment: 'Human-readable case identifier',
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
    programType: {
      type: DataTypes.ENUM(
        'OIC', // Offer in Compromise
        'IA', // Installment Agreement
        'CNC', // Currently Not Collectible
        'PA', // Penalty Abatement
        'ISR', // Innocent Spouse Relief
        'AUDIT', // Audit Representation
        'MULTIPLE' // Multiple programs
      ),
      allowNull: false,
      field: 'program_type',
    },
    status: {
      type: DataTypes.ENUM(
        'INITIAL_ASSESSMENT',
        'DOCUMENT_COLLECTION',
        'FORM_PREPARATION',
        'REVIEW',
        'SUBMISSION',
        'IRS_PROCESSING',
        'NEGOTIATION',
        'ACCEPTED',
        'REJECTED',
        'WITHDRAWN',
        'ON_HOLD',
        'CLOSED'
      ),
      defaultValue: 'INITIAL_ASSESSMENT',
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
      defaultValue: 'MEDIUM',
    },
    totalDebt: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'total_debt',
    },
    taxYears: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
      field: 'tax_years',
    },
    debtBreakdown: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'debt_breakdown',
      comment: 'Breakdown by year, type (tax, penalty, interest)',
    },
    estimatedSavings: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: 'estimated_savings',
    },
    proposedAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: 'proposed_amount',
      comment: 'Proposed settlement or payment amount',
    },
    monthlyPayment: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'monthly_payment',
      comment: 'For installment agreements',
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_to',
      comment: 'Tax professional handling the case',
    },
    submissionDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'submission_date',
    },
    irsResponseDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'irs_response_date',
    },
    resolutionDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'resolution_date',
    },
    nextDeadline: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'next_deadline',
    },
    documentsComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'documents_complete',
    },
    documentProgress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'document_progress',
      validate: {
        min: 0,
        max: 100,
      },
    },
    formsReady: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'forms_ready',
    },
    submittedToIRS: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'submitted_to_irs',
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'tracking_number',
      comment: 'IRS tracking or confirmation number',
    },
    powerOfAttorney: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'power_of_attorney',
      comment: 'POA filed with IRS',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Internal notes',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional case metadata',
    },
    actionItems: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'action_items',
      comment: 'Array of pending action items',
    },
    stateHistory: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'state_history',
      comment: 'History of state transitions',
    },
    communicationLog: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'communication_log',
      comment: 'Log of IRS communications',
    },
  }, {
    tableName: 'cases',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['case_id'],
        unique: true,
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['program_type'],
      },
      {
        fields: ['assigned_to'],
      },
      {
        fields: ['priority'],
      },
    ],
    hooks: {
      beforeCreate: async (caseInstance) => {
        // Generate case ID if not provided
        if (!caseInstance.caseId) {
          const date = new Date();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          caseInstance.caseId = `OT${year}${month}${random}`;
        }
      },
      beforeUpdate: async (caseInstance) => {
        // Track state changes
        if (caseInstance.changed('status')) {
          const previousStatus = caseInstance._previousDataValues.status;
          const newStatus = caseInstance.status;
          
          if (!caseInstance.stateHistory) {
            caseInstance.stateHistory = [];
          }
          
          caseInstance.stateHistory = [
            ...caseInstance.stateHistory,
            {
              from: previousStatus,
              to: newStatus,
              timestamp: new Date(),
              triggeredBy: 'system', // This should be updated with actual user
            },
          ];
        }
      },
    },
  });

  // Instance methods
  Case.prototype.calculateProgress = function() {
    const statusProgress = {
      'INITIAL_ASSESSMENT': 10,
      'DOCUMENT_COLLECTION': 25,
      'FORM_PREPARATION': 40,
      'REVIEW': 60,
      'SUBMISSION': 70,
      'IRS_PROCESSING': 80,
      'NEGOTIATION': 90,
      'ACCEPTED': 100,
      'REJECTED': 100,
      'WITHDRAWN': 100,
      'CLOSED': 100,
    };
    
    return statusProgress[this.status] || 0;
  };

  Case.prototype.getDaysInCurrentStatus = function() {
    if (!this.stateHistory || this.stateHistory.length === 0) {
      return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
    }
    
    const lastTransition = this.stateHistory[this.stateHistory.length - 1];
    return Math.floor((new Date() - new Date(lastTransition.timestamp)) / (1000 * 60 * 60 * 24));
  };

  Case.prototype.isOverdue = function() {
    if (!this.nextDeadline) return false;
    return new Date() > new Date(this.nextDeadline);
  };

  // Class methods
  Case.getActiveByUser = async function(userId) {
    return this.findAll({
      where: {
        userId,
        status: {
          [sequelize.Sequelize.Op.notIn]: ['CLOSED', 'WITHDRAWN', 'REJECTED'],
        },
      },
      order: [['created_at', 'DESC']],
    });
  };

  Case.generateCaseId = function() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `OT${year}${month}${random}`;
  };

  return Case;
};