module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
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
    paymentType: {
      type: DataTypes.ENUM(
        'SERVICE_FEE', // OwlTax service fees
        'SUCCESS_FEE', // 10% success fee
        'IRS_PAYMENT', // Payment to IRS
        'SETUP_FEE', // One-time setup fee
        'CONSULTATION_FEE' // Consultation fee
      ),
      allowNull: false,
      field: 'payment_type',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    status: {
      type: DataTypes.ENUM(
        'PENDING',
        'PROCESSING',
        'COMPLETED',
        'FAILED',
        'CANCELLED',
        'REFUNDED',
        'PARTIALLY_REFUNDED'
      ),
      defaultValue: 'PENDING',
    },
    paymentMethod: {
      type: DataTypes.ENUM(
        'CREDIT_CARD',
        'DEBIT_CARD',
        'BANK_TRANSFER',
        'ACH',
        'CHECK',
        'CASH',
        'WIRE_TRANSFER'
      ),
      allowNull: false,
      field: 'payment_method',
    },
    
    // Payment Provider Information
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'stripe_payment_intent_id',
    },
    stripeChargeId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'stripe_charge_id',
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'transaction_id',
      comment: 'External transaction ID',
    },
    
    // Payment Details
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Internal reference number',
    },
    
    // Billing Information
    billingAddress: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'billing_address',
    },
    
    // Payment Dates
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'processed_at',
    },
    failedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'failed_at',
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'refunded_at',
    },
    
    // Failure Information
    failureReason: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'failure_reason',
    },
    failureCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'failure_code',
    },
    
    // Refund Information
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'refund_amount',
    },
    refundReason: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'refund_reason',
    },
    refundReference: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'refund_reference',
    },
    
    // Success Fee Specific
    successFeeBasedOn: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: 'success_fee_based_on',
      comment: 'Amount that success fee is calculated from',
    },
    successFeePercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'success_fee_percentage',
      defaultValue: 10.00,
    },
    
    // Recurring Payment Information
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_recurring',
    },
    recurringSchedule: {
      type: DataTypes.ENUM('MONTHLY', 'QUARTERLY', 'ANNUALLY'),
      allowNull: true,
      field: 'recurring_schedule',
    },
    nextPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'next_payment_date',
    },
    
    // Metadata
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional payment metadata',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    
    // Audit Trail
    processedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'processed_by',
      comment: 'User who processed the payment',
    },
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
  }, {
    tableName: 'payments',
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
        fields: ['status'],
      },
      {
        fields: ['payment_type'],
      },
      {
        fields: ['stripe_payment_intent_id'],
        unique: true,
      },
      {
        fields: ['transaction_id'],
      },
      {
        fields: ['processed_at'],
      },
    ],
    hooks: {
      beforeSave: (payment) => {
        // Set processed_at when status changes to COMPLETED
        if (payment.changed('status') && payment.status === 'COMPLETED' && !payment.processedAt) {
          payment.processedAt = new Date();
        }
        
        // Set failed_at when status changes to FAILED
        if (payment.changed('status') && payment.status === 'FAILED' && !payment.failedAt) {
          payment.failedAt = new Date();
        }
        
        // Calculate success fee amount
        if (payment.paymentType === 'SUCCESS_FEE' && payment.successFeeBasedOn && !payment.amount) {
          payment.amount = (payment.successFeeBasedOn * payment.successFeePercentage) / 100;
        }
      },
    },
  });

  // Instance methods
  Payment.prototype.canBeRefunded = function() {
    return this.status === 'COMPLETED' && 
           !this.refundedAt && 
           ['SERVICE_FEE', 'SETUP_FEE', 'CONSULTATION_FEE'].includes(this.paymentType);
  };

  Payment.prototype.calculateRefundAmount = function(requestedAmount = null) {
    if (!this.canBeRefunded()) {
      return 0;
    }
    
    const refundableAmount = this.amount - (this.refundAmount || 0);
    
    if (requestedAmount) {
      return Math.min(requestedAmount, refundableAmount);
    }
    
    return refundableAmount;
  };

  Payment.prototype.processRefund = async function(amount, reason) {
    if (!this.canBeRefunded()) {
      throw new Error('Payment cannot be refunded');
    }
    
    const refundAmount = this.calculateRefundAmount(amount);
    if (refundAmount <= 0) {
      throw new Error('Invalid refund amount');
    }
    
    // Update payment record
    this.refundAmount = (this.refundAmount || 0) + refundAmount;
    this.refundReason = reason;
    this.refundedAt = new Date();
    
    if (this.refundAmount >= this.amount) {
      this.status = 'REFUNDED';
    } else {
      this.status = 'PARTIALLY_REFUNDED';
    }
    
    await this.save();
    
    return {
      refundAmount,
      newStatus: this.status,
      remainingAmount: this.amount - this.refundAmount,
    };
  };

  Payment.prototype.isSuccessFee = function() {
    return this.paymentType === 'SUCCESS_FEE';
  };

  Payment.prototype.getReceiptData = function() {
    return {
      id: this.id,
      amount: this.amount,
      currency: this.currency,
      description: this.description,
      paymentMethod: this.paymentMethod,
      processedAt: this.processedAt,
      transactionId: this.transactionId,
      reference: this.reference,
    };
  };

  // Class methods
  Payment.calculateSuccessFee = function(debtReduction, feePercentage = 10) {
    return (debtReduction * feePercentage) / 100;
  };

  Payment.getTotalByUser = async function(userId, paymentType = null) {
    const where = { 
      userId, 
      status: 'COMPLETED' 
    };
    
    if (paymentType) {
      where.paymentType = paymentType;
    }
    
    const result = await this.findOne({
      where,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
    });
    
    return {
      total: parseFloat(result?.dataValues?.total || 0),
      count: parseInt(result?.dataValues?.count || 0),
    };
  };

  Payment.getByCase = async function(caseId) {
    return this.findAll({
      where: { caseId },
      order: [['created_at', 'DESC']],
    });
  };

  Payment.getPendingPayments = async function() {
    return this.findAll({
      where: {
        status: ['PENDING', 'PROCESSING'],
      },
      order: [['created_at', 'ASC']],
    });
  };

  Payment.getSuccessFeesOwed = async function() {
    const { Case } = require('./index');
    
    return this.findAll({
      include: [{
        model: Case,
        as: 'case',
        where: {
          status: 'ACCEPTED',
          estimatedSavings: {
            [sequelize.Sequelize.Op.gt]: 0,
          },
        },
      }],
      where: {
        paymentType: 'SUCCESS_FEE',
        status: ['PENDING', 'FAILED'],
      },
    });
  };

  return Payment;
};