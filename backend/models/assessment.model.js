module.exports = (sequelize, DataTypes) => {
  const Assessment = sequelize.define('Assessment', {
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
    assessmentType: {
      type: DataTypes.ENUM('INITIAL', 'FOLLOW_UP', 'ANNUAL_REVIEW'),
      defaultValue: 'INITIAL',
      field: 'assessment_type',
    },
    status: {
      type: DataTypes.ENUM('IN_PROGRESS', 'COMPLETED', 'UNDER_REVIEW', 'APPROVED'),
      defaultValue: 'IN_PROGRESS',
    },
    // Filing Information
    allReturnsFiled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'all_returns_filed',
    },
    unfiledYears: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
      field: 'unfiled_years',
    },
    filingStatus: {
      type: DataTypes.ENUM('SINGLE', 'MARRIED_JOINT', 'MARRIED_SEPARATE', 'HEAD_OF_HOUSEHOLD', 'WIDOW'),
      allowNull: true,
      field: 'filing_status',
    },
    
    // Financial Information
    totalTaxDebt: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: 'total_tax_debt',
    },
    debtByYear: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'debt_by_year',
      comment: 'Breakdown of debt by tax year',
    },
    monthlyIncome: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'monthly_income',
    },
    monthlyExpenses: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'monthly_expenses',
    },
    disposableIncome: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'disposable_income',
    },
    
    // Income Details
    incomeDetails: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'income_details',
      comment: 'Detailed income breakdown',
    },
    employmentStatus: {
      type: DataTypes.ENUM('EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'RETIRED', 'DISABLED'),
      allowNull: true,
      field: 'employment_status',
    },
    
    // Expense Details
    expenseDetails: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'expense_details',
      comment: 'Detailed expense breakdown',
    },
    
    // Asset Information
    totalAssets: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: 'total_assets',
    },
    assetDetails: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'asset_details',
      comment: 'Detailed asset breakdown',
    },
    liquidAssets: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: 'liquid_assets',
    },
    
    // Special Circumstances
    specialCircumstances: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'special_circumstances',
      comment: 'Array of special circumstances',
    },
    hardshipDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'hardship_details',
    },
    
    // Assessment Results
    eligibilityResults: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'eligibility_results',
      comment: 'Results of eligibility analysis',
    },
    recommendations: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'recommendations',
      comment: 'Array of recommended programs',
    },
    estimatedOutcomes: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'estimated_outcomes',
      comment: 'Estimated outcomes for each program',
    },
    
    // Scores and Ratings
    eligibilityScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'eligibility_score',
      validate: {
        min: 0,
        max: 100,
      },
    },
    riskRating: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
      allowNull: true,
      field: 'risk_rating',
    },
    successProbability: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'success_probability',
      validate: {
        min: 0,
        max: 100,
      },
    },
    
    // Compliance Check
    complianceIssues: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'compliance_issues',
      comment: 'Array of compliance issues found',
    },
    requiredActions: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'required_actions',
      comment: 'Actions required before proceeding',
    },
    
    // Assessment Metadata
    completedSteps: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'completed_steps',
      comment: 'Array of completed assessment steps',
    },
    progressPercentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'progress_percentage',
      validate: {
        min: 0,
        max: 100,
      },
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completed_at',
    },
    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'reviewed_by',
      comment: 'Tax professional who reviewed',
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reviewed_at',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Assessment notes',
    },
  }, {
    tableName: 'assessments',
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
        fields: ['assessment_type'],
      },
      {
        fields: ['eligibility_score'],
      },
    ],
    hooks: {
      beforeSave: (assessment) => {
        // Calculate disposable income
        if (assessment.monthlyIncome && assessment.monthlyExpenses) {
          assessment.disposableIncome = assessment.monthlyIncome - assessment.monthlyExpenses;
        }
        
        // Update progress percentage based on completed steps
        if (assessment.completedSteps && Array.isArray(assessment.completedSteps)) {
          const totalSteps = 6; // Total assessment steps
          assessment.progressPercentage = Math.round((assessment.completedSteps.length / totalSteps) * 100);
        }
        
        // Mark as completed if all steps done
        if (assessment.progressPercentage === 100 && !assessment.completedAt) {
          assessment.completedAt = new Date();
          assessment.status = 'COMPLETED';
        }
      },
    },
  });

  // Instance methods
  Assessment.prototype.calculateAffordability = function() {
    if (!this.disposableIncome || !this.totalTaxDebt) {
      return null;
    }
    
    // Calculate how many months to pay off debt with current disposable income
    const monthsToPayOff = this.totalTaxDebt / Math.max(this.disposableIncome, 1);
    
    return {
      monthsToPayOff,
      affordabilityRating: monthsToPayOff <= 72 ? 'GOOD' : monthsToPayOff <= 120 ? 'FAIR' : 'POOR',
      suggestedPayment: Math.min(this.disposableIncome, this.totalTaxDebt / 72), // Max 6 years
    };
  };

  Assessment.prototype.getEligiblePrograms = function() {
    if (!this.eligibilityResults) return [];
    
    return Object.entries(this.eligibilityResults)
      .filter(([program, result]) => result.eligible)
      .map(([program, result]) => ({
        program,
        confidence: result.confidence,
        estimatedBenefit: result.estimatedBenefit,
        requirements: result.requirements,
      }))
      .sort((a, b) => b.confidence - a.confidence);
  };

  Assessment.prototype.isComplete = function() {
    return this.status === 'COMPLETED' && this.progressPercentage === 100;
  };

  // Class methods
  Assessment.getByUser = async function(userId) {
    return this.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
    });
  };

  Assessment.getLatestByUser = async function(userId) {
    return this.findOne({
      where: { userId },
      order: [['created_at', 'DESC']],
    });
  };

  return Assessment;
};