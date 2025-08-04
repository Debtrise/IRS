const express = require('express');
const router = express.Router();

const { Assessment, Case, User } = require('../models');
const { 
  authenticateToken,
  requireOwnership,
  extractClientInfo,
} = require('../middleware/auth.middleware');
const { 
  validateAssessment,
  validateUUID,
} = require('../middleware/validation.middleware');

/**
 * @route POST /api/eligibility/assess
 * @desc Create or update eligibility assessment
 * @access Private
 */
router.post('/assess',
  authenticateToken,
  extractClientInfo,
  validateAssessment,
  async (req, res) => {
    try {
      const userId = req.userId;
      const assessmentData = {
        ...req.body,
        userId,
      };
      
      // Check if user already has an assessment
      let assessment = await Assessment.findOne({
        where: { userId },
        order: [['created_at', 'DESC']],
      });
      
      if (assessment && assessment.status === 'IN_PROGRESS') {
        // Update existing assessment
        await Assessment.update(assessmentData, {
          where: { id: assessment.id },
        });
        assessment = await Assessment.findByPk(assessment.id);
      } else {
        // Create new assessment
        assessment = await Assessment.create(assessmentData);
      }
      
      // Run eligibility analysis
      const eligibilityResults = await this.analyzeEligibility(assessment);
      
      // Update assessment with results
      await Assessment.update(
        {
          eligibilityResults,
          recommendations: eligibilityResults.recommendations,
          estimatedOutcomes: eligibilityResults.estimatedOutcomes,
          eligibilityScore: eligibilityResults.overallScore,
          riskRating: eligibilityResults.riskRating,
          successProbability: eligibilityResults.successProbability,
        },
        { where: { id: assessment.id } }
      );
      
      const updatedAssessment = await Assessment.findByPk(assessment.id);
      
      res.json({
        success: true,
        message: 'Assessment completed successfully',
        data: {
          assessment: updatedAssessment,
          eligibilityResults,
        },
      });
    } catch (error) {
      logger.error('Assessment failed:', error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: 'ASSESSMENT_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/eligibility/assessment/:assessmentId
 * @desc Get assessment by ID
 * @access Private
 */
router.get('/assessment/:assessmentId',
  authenticateToken,
  validateUUID('assessmentId'),
  async (req, res) => {
    try {
      const { assessmentId } = req.params;
      
      const assessment = await Assessment.findByPk(assessmentId, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
          {
            model: Case,
            as: 'case',
            attributes: ['id', 'caseId', 'programType', 'status'],
          },
        ],
      });
      
      if (!assessment) {
        return res.status(404).json({
          success: false,
          error: 'Assessment not found',
          code: 'ASSESSMENT_NOT_FOUND',
        });
      }
      
      // Check access permissions
      if (assessment.userId !== req.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'ASSESSMENT_ACCESS_DENIED',
        });
      }
      
      res.json({
        success: true,
        data: {
          assessment,
        },
      });
    } catch (error) {
      logger.error('Get assessment failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch assessment',
        code: 'ASSESSMENT_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/eligibility/user/:userId/latest
 * @desc Get user's latest assessment
 * @access Private
 */
router.get('/user/:userId/latest',
  authenticateToken,
  requireOwnership('userId'),
  validateUUID('userId'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      const assessment = await Assessment.findOne({
        where: { userId },
        order: [['created_at', 'DESC']],
        include: [
          {
            model: Case,
            as: 'case',
            attributes: ['id', 'caseId', 'programType', 'status'],
          },
        ],
      });
      
      if (!assessment) {
        return res.status(404).json({
          success: false,
          error: 'No assessment found for user',
          code: 'ASSESSMENT_NOT_FOUND',
        });
      }
      
      res.json({
        success: true,
        data: {
          assessment,
        },
      });
    } catch (error) {
      logger.error('Get latest assessment failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch latest assessment',
        code: 'LATEST_ASSESSMENT_FETCH_FAILED',
      });
    }
  }
);

/**
 * @route POST /api/eligibility/quick-check
 * @desc Quick eligibility check without saving
 * @access Private
 */
router.post('/quick-check',
  authenticateToken,
  async (req, res) => {
    try {
      const { totalTaxDebt, monthlyIncome, monthlyExpenses, allReturnsFiled } = req.body;
      
      if (!totalTaxDebt || !monthlyIncome || !monthlyExpenses || allReturnsFiled === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Required fields: totalTaxDebt, monthlyIncome, monthlyExpenses, allReturnsFiled',
          code: 'MISSING_REQUIRED_FIELDS',
        });
      }
      
      const quickAssessment = {
        totalTaxDebt: parseFloat(totalTaxDebt),
        monthlyIncome: parseFloat(monthlyIncome),
        monthlyExpenses: parseFloat(monthlyExpenses),
        disposableIncome: parseFloat(monthlyIncome) - parseFloat(monthlyExpenses),
        allReturnsFiled,
      };
      
      const eligibilityResults = await this.quickEligibilityCheck(quickAssessment);
      
      res.json({
        success: true,
        data: {
          eligibilityResults,
          quickAssessment,
        },
      });
    } catch (error) {
      logger.error('Quick check failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to perform quick eligibility check',
        code: 'QUICK_CHECK_FAILED',
      });
    }
  }
);

/**
 * @route GET /api/eligibility/programs
 * @desc Get available relief programs
 * @access Private
 */
router.get('/programs',
  authenticateToken,
  async (req, res) => {
    try {
      const programs = [
        {
          id: 'OIC',
          name: 'Offer in Compromise',
          description: 'Settle your tax debt for less than you owe',
          requirements: [
            'All returns filed',
            'Current with estimated tax payments',
            'Financial hardship or doubt as to collectibility',
          ],
          benefits: [
            'Significantly reduce total debt',
            'Fresh start with IRS',
            'Stop collection activities',
          ],
          timeframe: '6-24 months',
          successRate: 42,
        },
        {
          id: 'IA',
          name: 'Installment Agreement',
          description: 'Pay your tax debt over time with monthly payments',
          requirements: [
            'All returns filed',
            'Owe $50,000 or less',
            'Can pay within 72 months',
          ],
          benefits: [
            'Avoid levies and garnishments',
            'Stop penalty accrual',
            'Manageable monthly payments',
          ],
          timeframe: '1-6 years',
          successRate: 95,
        },
        {
          id: 'CNC',
          name: 'Currently Not Collectible',
          description: 'Temporarily halt collection due to financial hardship',
          requirements: [
            'All returns filed',
            'Demonstrate financial hardship',
            'Income below IRS standards',
          ],
          benefits: [
            'Stop collection activities',
            'No monthly payments required',
            'Potential debt expiration',
          ],
          timeframe: 'Annual review',
          successRate: 78,
        },
        {
          id: 'PA',
          name: 'Penalty Abatement',
          description: 'Remove penalties for reasonable cause',
          requirements: [
            'First-time penalty',
            'Reasonable cause for late filing/payment',
            'Current compliance',
          ],
          benefits: [
            'Remove penalty charges',
            'Reduce total debt',
            'Clean compliance record',
          ],
          timeframe: '2-6 months',
          successRate: 65,
        },
        {
          id: 'ISR',
          name: 'Innocent Spouse Relief',
          description: 'Relief from joint tax liability',
          requirements: [
            'Filed joint return with spouse',
            'Understated tax due to spouse',
            'Unaware of understatement',
          ],
          benefits: [
            'Relief from spouse\'s tax debt',
            'Separate liability determination',
            'Protection from collection',
          ],
          timeframe: '6-18 months',
          successRate: 55,
        },
      ];
      
      res.json({
        success: true,
        data: {
          programs,
        },
      });
    } catch (error) {
      logger.error('Get programs failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch relief programs',
        code: 'PROGRAMS_FETCH_FAILED',
      });
    }
  }
);

// Helper methods for eligibility analysis
router.analyzeEligibility = async function(assessment) {
  try {
    const results = {
      qualifiedPrograms: [],
      disqualifiedPrograms: [],
      recommendations: [],
      estimatedOutcomes: {},
      overallScore: 0,
      riskRating: 'MEDIUM',
      successProbability: 50,
    };
    
    // Check filing compliance first
    if (!assessment.allReturnsFiled) {
      results.disqualifiedPrograms = ['OIC', 'IA', 'CNC', 'PA', 'ISR'];
      results.recommendations.push({
        priority: 'CRITICAL',
        action: 'File all missing tax returns',
        description: 'You must file all required tax returns before qualifying for any relief program',
        missingYears: assessment.unfiledYears || [],
      });
      results.overallScore = 10;
      results.riskRating = 'HIGH';
      return results;
    }
    
    // Analyze each program
    const programAnalysis = {
      OIC: this.analyzeOIC(assessment),
      IA: this.analyzeIA(assessment),
      CNC: this.analyzeCNC(assessment),
      PA: this.analyzePA(assessment),
      ISR: this.analyzeISR(assessment),
    };
    
    // Process results
    for (const [program, analysis] of Object.entries(programAnalysis)) {
      if (analysis.qualified) {
        results.qualifiedPrograms.push({
          program,
          confidence: analysis.confidence,
          estimatedBenefit: analysis.estimatedBenefit,
          requirements: analysis.requirements,
          timeline: analysis.timeline,
        });
        results.estimatedOutcomes[program] = analysis.outcome;
      } else {
        results.disqualifiedPrograms.push({
          program,
          reasons: analysis.disqualificationReasons,
          correctiveActions: analysis.correctiveActions,
        });
      }
    }
    
    // Generate recommendations
    results.recommendations = this.generateRecommendations(results.qualifiedPrograms, assessment);
    
    // Calculate overall score
    results.overallScore = this.calculateOverallScore(results.qualifiedPrograms);
    results.riskRating = results.overallScore >= 70 ? 'LOW' : results.overallScore >= 40 ? 'MEDIUM' : 'HIGH';
    results.successProbability = Math.min(95, Math.max(10, results.overallScore + 10));
    
    return results;
  } catch (error) {
    logger.error('Analyze eligibility failed:', error);
    throw new Error('Failed to analyze eligibility');
  }
};

router.quickEligibilityCheck = async function(data) {
  const results = {
    likelyPrograms: [],
    estimatedSavings: 0,
    recommendedNext: [],
  };
  
  const debtToIncomeRatio = data.totalTaxDebt / (data.monthlyIncome * 12);
  const disposableIncomeRatio = data.disposableIncome / data.monthlyIncome;
  
  // Quick OIC analysis
  if (debtToIncomeRatio > 1 && disposableIncomeRatio < 0.2) {
    results.likelyPrograms.push({
      program: 'OIC',
      likelihood: 'HIGH',
      estimatedSavings: data.totalTaxDebt * 0.6,
    });
  }
  
  // Quick IA analysis
  if (data.totalTaxDebt <= 50000 && data.disposableIncome > 0) {
    results.likelyPrograms.push({
      program: 'IA',
      likelihood: 'HIGH',
      monthlyPayment: Math.max(25, data.totalTaxDebt / 72),
    });
  }
  
  // Quick CNC analysis
  if (data.disposableIncome <= 0) {
    results.likelyPrograms.push({
      program: 'CNC',
      likelihood: 'MEDIUM',
      description: 'Temporarily halt collections due to hardship',
    });
  }
  
  results.estimatedSavings = Math.max(...results.likelyPrograms.map(p => p.estimatedSavings || 0));
  
  if (!data.allReturnsFiled) {
    results.recommendedNext.push('File all missing tax returns');
  } else {
    results.recommendedNext.push('Complete full assessment');
    results.recommendedNext.push('Upload required documents');
  }
  
  return results;
};

router.analyzeOIC = function(assessment) {
  // Simplified OIC analysis
  const qualified = assessment.totalTaxDebt > 10000 && assessment.disposableIncome < 100;
  return {
    qualified,
    confidence: qualified ? 75 : 25,
    estimatedBenefit: qualified ? assessment.totalTaxDebt * 0.6 : 0,
    requirements: ['Form 656', 'Form 433-A', 'Application fee'],
    timeline: { estimatedDays: 180 },
    disqualificationReasons: qualified ? [] : ['Sufficient income to pay debt'],
  };
};

router.analyzeIA = function(assessment) {
  const qualified = assessment.totalTaxDebt <= 50000 && assessment.disposableIncome > 0;
  return {
    qualified,
    confidence: qualified ? 90 : 10,
    estimatedBenefit: qualified ? assessment.totalTaxDebt * 0.2 : 0, // Interest savings
    requirements: ['Form 9465'],
    timeline: { estimatedDays: 30 },
    disqualificationReasons: qualified ? [] : ['Debt exceeds $50,000 or no disposable income'],
  };
};

router.analyzeCNC = function(assessment) {
  const qualified = assessment.disposableIncome <= 0;
  return {
    qualified,
    confidence: qualified ? 80 : 20,
    estimatedBenefit: qualified ? assessment.totalTaxDebt : 0, // Potential full relief
    requirements: ['Form 433-F', 'Financial documentation'],
    timeline: { estimatedDays: 90 },
    disqualificationReasons: qualified ? [] : ['Sufficient income to pay debt'],
  };
};

router.analyzePA = function(assessment) {
  // This would require more specific penalty information
  const qualified = true; // Simplified - everyone potentially qualifies
  return {
    qualified,
    confidence: 50,
    estimatedBenefit: assessment.totalTaxDebt * 0.25, // Estimate 25% penalty portion
    requirements: ['Form 843', 'Reasonable cause documentation'],
    timeline: { estimatedDays: 120 },
    disqualificationReasons: [],
  };
};

router.analyzeISR = function(assessment) {
  // This would require spouse/marriage information
  const qualified = assessment.filingStatus === 'MARRIED_JOINT';
  return {
    qualified,
    confidence: qualified ? 60 : 0,
    estimatedBenefit: qualified ? assessment.totalTaxDebt * 0.5 : 0,
    requirements: ['Form 8857', 'Spouse documentation'],
    timeline: { estimatedDays: 365 },
    disqualificationReasons: qualified ? [] : ['Not applicable - no joint filing'],
  };
};

router.generateRecommendations = function(qualifiedPrograms, assessment) {
  if (qualifiedPrograms.length === 0) {
    return [{
      priority: 'HIGH',
      action: 'File missing returns',
      description: 'Complete all unfiled tax returns to qualify for relief programs',
    }];
  }
  
  // Sort by estimated benefit
  const sorted = qualifiedPrograms.sort((a, b) => b.estimatedBenefit - a.estimatedBenefit);
  
  return sorted.slice(0, 3).map((program, index) => ({
    priority: index === 0 ? 'HIGH' : 'MEDIUM',
    program: program.program,
    action: `Apply for ${program.program}`,
    description: `Estimated benefit: $${program.estimatedBenefit.toLocaleString()}`,
    confidence: program.confidence,
  }));
};

router.calculateOverallScore = function(qualifiedPrograms) {
  if (qualifiedPrograms.length === 0) return 10;
  
  const averageConfidence = qualifiedPrograms.reduce((sum, p) => sum + p.confidence, 0) / qualifiedPrograms.length;
  const programCount = Math.min(qualifiedPrograms.length, 5) * 10; // Max 50 points
  
  return Math.round(averageConfidence * 0.7 + programCount);
};

module.exports = router;