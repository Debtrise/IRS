# IRS Tax Debt Relief SaaS - Complete Development Guide

## Table of Contents
1. [Infrastructure Architecture on Google Cloud](#infrastructure-architecture-on-google-cloud)
2. [Backend Development Architecture](#backend-development-architecture)
3. [Frontend Development with React/Tailwind](#frontend-development-with-reacttailwind)
4. [Security Implementation](#security-implementation)
5. [Deployment and DevOps](#deployment-and-devops)
6. [Monitoring and Observability](#monitoring-and-observability)

---

## Infrastructure Architecture on Google Cloud

### 1. Google Cloud Foundation Setup

```yaml
# Core Infrastructure Components
Project Structure:
  Production:
    - Region: us-central1 (primary)
    - Region: us-east1 (DR/backup)
  
  VPC Configuration:
    - Custom VPC with 3 subnets:
      - Public subnet (Load balancers, NAT Gateway)
      - Private subnet (Application servers)
      - Database subnet (Isolated for data layer)
    
  Compute Engine VMs:
    - Backend API Servers: n2-standard-4 (4 vCPU, 16GB RAM)
    - Worker/Job Servers: n2-standard-2 (2 vCPU, 8GB RAM)
    - Document Processing: n2-highmem-4 (4 vCPU, 32GB RAM)
```

### 2. Google Cloud Services Integration

```javascript
// Required GCP Services Configuration
const gcpServices = {
  compute: {
    instances: [
      { name: 'api-server-1', type: 'n2-standard-4', zone: 'us-central1-a' },
      { name: 'api-server-2', type: 'n2-standard-4', zone: 'us-central1-b' },
      { name: 'worker-1', type: 'n2-standard-2', zone: 'us-central1-a' },
      { name: 'worker-2', type: 'n2-standard-2', zone: 'us-central1-b' }
    ]
  },
  storage: {
    buckets: [
      { name: 'irs-tax-documents', location: 'US', encryption: 'CMEK' },
      { name: 'irs-tax-backups', location: 'US', lifecycle: '90days' },
      { name: 'irs-tax-temp-processing', location: 'US', lifecycle: '7days' }
    ]
  },
  database: {
    cloudSQL: {
      instance: 'irs-tax-relief-prod',
      version: 'POSTGRES_15',
      tier: 'db-n1-standard-4',
      highAvailability: true,
      backups: { enabled: true, time: '02:00' }
    },
    memorystore: {
      redis: {
        instance: 'irs-tax-cache',
        tier: 'STANDARD_HA',
        memorySizeGb: 8
      }
    }
  },
  security: {
    kms: { keyRing: 'irs-tax-keys', location: 'us-central1' },
    secretManager: { enabled: true },
    cloudArmor: { enabled: true }
  }
};
```

---

## Backend Development Architecture

### 1. Core Node.js Application Structure

```javascript
// server.js - Main application entry
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { CloudLoggingWinston } = require('@google-cloud/logging-winston');

class TaxReliefServer {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration for React frontend
    this.app.use(cors({
      origin: process.env.FRONTEND_URL,
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Body parsing
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  }

  setupRoutes() {
    // API Routes
    this.app.use('/api/auth', require('./routes/auth.routes'));
    this.app.use('/api/users', require('./routes/user.routes'));
    this.app.use('/api/documents', require('./routes/document.routes'));
    this.app.use('/api/cases', require('./routes/case.routes'));
    this.app.use('/api/eligibility', require('./routes/eligibility.routes'));
    this.app.use('/api/forms', require('./routes/forms.routes'));
    this.app.use('/api/payments', require('./routes/payment.routes'));
    this.app.use('/api/notifications', require('./routes/notification.routes'));
  }
}
```

### 2. Database Layer with Google Cloud SQL

```javascript
// config/database.js
const { Sequelize } = require('sequelize');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

class DatabaseManager {
  constructor() {
    this.secretClient = new SecretManagerServiceClient();
    this.sequelize = null;
  }

  async initialize() {
    const dbConfig = await this.getSecrets();
    
    this.sequelize = new Sequelize({
      dialect: 'postgres',
      host: `/cloudsql/${dbConfig.connectionName}`,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      dialectOptions: {
        socketPath: `/cloudsql/${dbConfig.connectionName}`,
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      pool: {
        max: 20,
        min: 5,
        acquire: 30000,
        idle: 10000
      },
      logging: (msg) => logger.debug(msg)
    });
  }

  async getSecrets() {
    const [dbPassword] = await this.secretClient.accessSecretVersion({
      name: 'projects/PROJECT_ID/secrets/db-password/versions/latest'
    });
    
    return {
      connectionName: process.env.CLOUD_SQL_CONNECTION_NAME,
      username: process.env.DB_USER,
      password: dbPassword.payload.data.toString('utf8'),
      database: process.env.DB_NAME
    };
  }
}
```

### 3. Document Processing Service with Google Cloud Storage

```javascript
// services/document/document.service.js
const { Storage } = require('@google-cloud/storage');
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai');
const crypto = require('crypto');
const stream = require('stream');

class DocumentService {
  constructor() {
    this.storage = new Storage();
    this.documentAI = new DocumentProcessorServiceClient();
    this.bucket = this.storage.bucket(process.env.GCS_BUCKET_NAME);
  }

  async uploadDocument(file, userId, caseId, documentType) {
    try {
      // Generate secure filename
      const fileId = crypto.randomBytes(16).toString('hex');
      const filename = `${userId}/${caseId}/${documentType}/${fileId}`;
      
      // Create write stream with encryption
      const blob = this.bucket.file(filename);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            userId,
            caseId,
            documentType,
            originalName: file.originalname,
            uploadDate: new Date().toISOString()
          }
        },
        resumable: false,
        gzip: true
      });

      // Upload with progress tracking
      return new Promise((resolve, reject) => {
        blobStream.on('error', reject);
        blobStream.on('finish', async () => {
          // Generate signed URL for secure access
          const [url] = await blob.getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
          });
          
          resolve({
            fileId,
            filename,
            url,
            size: file.size,
            mimeType: file.mimetype
          });
        });
        
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(blobStream);
      });
    } catch (error) {
      logger.error('Document upload failed:', error);
      throw new Error('Failed to upload document');
    }
  }

  async processIRSTranscript(fileId) {
    const processorPath = `projects/${process.env.GCP_PROJECT}/locations/us/processors/${process.env.DOCUMENT_AI_PROCESSOR}`;
    
    // Download file from GCS
    const file = this.bucket.file(fileId);
    const [content] = await file.download();
    
    // Process with Document AI
    const request = {
      name: processorPath,
      rawDocument: {
        content: content.toString('base64'),
        mimeType: 'application/pdf',
      },
    };

    const [result] = await this.documentAI.processDocument(request);
    
    // Extract structured data
    return this.parseTranscriptData(result.document);
  }

  parseTranscriptData(document) {
    const extractedData = {
      taxYear: null,
      filingStatus: null,
      adjustedGrossIncome: null,
      taxOwed: null,
      penalties: null,
      interest: null,
      payments: [],
      transcriptType: null
    };

    // Custom parsing logic for IRS transcripts
    if (document.text) {
      // Extract tax year
      const yearMatch = document.text.match(/Tax Year:\s*(\d{4})/);
      if (yearMatch) extractedData.taxYear = yearMatch[1];

      // Extract AGI
      const agiMatch = document.text.match(/Adjusted Gross Income:\s*\$?([\d,]+)/);
      if (agiMatch) extractedData.adjustedGrossIncome = parseFloat(agiMatch[1].replace(/,/g, ''));

      // Extract balances
      const balanceMatch = document.text.match(/Balance Due:\s*\$?([\d,]+\.?\d*)/);
      if (balanceMatch) extractedData.taxOwed = parseFloat(balanceMatch[1].replace(/,/g, ''));
    }

    return extractedData;
  }
}
```

### 4. Eligibility Engine Implementation

```javascript
// services/eligibility/eligibility.engine.js
class EligibilityEngine {
  constructor() {
    this.rules = {
      installmentAgreement: require('./rules/installment.rules'),
      offerInCompromise: require('./rules/oic.rules'),
      currentlyNotCollectible: require('./rules/cnc.rules'),
      penaltyAbatement: require('./rules/penalty.rules'),
      innocentSpouse: require('./rules/innocent.rules')
    };
  }

  async analyzeEligibility(userData) {
    const results = {
      recommendations: [],
      qualifiedPrograms: [],
      disqualifiedPrograms: [],
      requiredActions: [],
      estimatedOutcomes: {}
    };

    // Check filing compliance first
    if (!userData.allReturnsFiled) {
      results.requiredActions.push({
        priority: 'CRITICAL',
        action: 'File all missing tax returns',
        description: 'You must file all required tax returns before qualifying for any relief program',
        missingYears: userData.missingReturns
      });
      return results;
    }

    // Run through each program's rules
    for (const [program, ruleEngine] of Object.entries(this.rules)) {
      const evaluation = await ruleEngine.evaluate(userData);
      
      if (evaluation.qualified) {
        results.qualifiedPrograms.push({
          program,
          confidence: evaluation.confidence,
          estimatedBenefit: evaluation.benefit,
          requirements: evaluation.requirements,
          timeline: evaluation.timeline
        });
      } else {
        results.disqualifiedPrograms.push({
          program,
          reasons: evaluation.disqualificationReasons,
          correctiveActions: evaluation.correctiveActions
        });
      }
    }

    // Rank programs by benefit
    results.recommendations = this.rankPrograms(results.qualifiedPrograms, userData);
    
    return results;
  }

  rankPrograms(qualifiedPrograms, userData) {
    return qualifiedPrograms
      .map(program => ({
        ...program,
        score: this.calculateProgramScore(program, userData)
      }))
      .sort((a, b) => b.score - a.score)
      .map((program, index) => ({
        ...program,
        rank: index + 1,
        reasoning: this.explainRanking(program, userData)
      }));
  }

  calculateProgramScore(program, userData) {
    let score = 0;
    
    // Benefit weight (40%)
    score += (program.estimatedBenefit / userData.totalTaxDebt) * 40;
    
    // Success probability (30%)
    score += program.confidence * 30;
    
    // Time to resolution (20%)
    const timeScore = Math.max(0, 20 - (program.timeline.estimatedDays / 30));
    score += timeScore;
    
    // Complexity factor (10%)
    const complexityScore = 10 - (program.requirements.length * 2);
    score += Math.max(0, complexityScore);
    
    return score;
  }
}
```

### 5. Form Generation Service

```javascript
// services/forms/form.generator.js
const PDFDocument = require('pdfkit');
const { fillForm } = require('@pdftron/pdfnet-node');
const { Storage } = require('@google-cloud/storage');

class FormGenerator {
  constructor() {
    this.storage = new Storage();
    this.bucket = this.storage.bucket(process.env.FORMS_BUCKET);
    this.templates = new Map();
  }

  async generateForm(formType, userData, caseData) {
    const formMapping = {
      '9465': this.generateInstallmentAgreement,
      '656': this.generateOfferInCompromise,
      '433A': this.generateCollectionStatement,
      '8857': this.generateInnocentSpouseRequest,
      '843': this.generatePenaltyAbatement
    };

    const generator = formMapping[formType];
    if (!generator) {
      throw new Error(`Unknown form type: ${formType}`);
    }

    return await generator.call(this, userData, caseData);
  }

  async generateInstallmentAgreement(userData, caseData) {
    const templatePath = 'templates/f9465.pdf';
    const template = await this.loadTemplate(templatePath);
    
    const fieldMappings = {
      'topmostSubform[0].Page1[0].f1_1[0]': userData.firstName,
      'topmostSubform[0].Page1[0].f1_2[0]': userData.lastName,
      'topmostSubform[0].Page1[0].f1_3[0]': userData.ssn,
      'topmostSubform[0].Page1[0].f1_4[0]': userData.spouse?.firstName || '',
      'topmostSubform[0].Page1[0].f1_5[0]': userData.spouse?.lastName || '',
      'topmostSubform[0].Page1[0].f1_6[0]': userData.spouse?.ssn || '',
      'topmostSubform[0].Page1[0].f1_7[0]': userData.address.street,
      'topmostSubform[0].Page1[0].f1_8[0]': `${userData.address.city}, ${userData.address.state} ${userData.address.zip}`,
      'topmostSubform[0].Page1[0].f1_9[0]': caseData.totalAmountOwed,
      'topmostSubform[0].Page1[0].f1_10[0]': caseData.proposedMonthlyPayment,
      'topmostSubform[0].Page1[0].f1_11[0]': caseData.proposedPaymentDate
    };

    // Fill PDF form
    const filledPdf = await fillForm(template, fieldMappings);
    
    // Save to GCS
    const filename = `generated/${userData.userId}/9465_${Date.now()}.pdf`;
    await this.saveToGCS(filename, filledPdf);
    
    return {
      formType: '9465',
      filename,
      url: await this.getSignedUrl(filename),
      generatedAt: new Date().toISOString()
    };
  }

  async generateOfferInCompromise(userData, caseData) {
    // Complex OIC calculation
    const offerAmount = this.calculateOfferAmount(userData, caseData);
    
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    
    // Header
    doc.fontSize(16).text('Offer in Compromise Worksheet', { align: 'center' });
    doc.moveDown();
    
    // Personal Information
    doc.fontSize(12).text(`Name: ${userData.firstName} ${userData.lastName}`);
    doc.text(`SSN: ${this.maskSSN(userData.ssn)}`);
    doc.text(`Case ID: ${caseData.caseId}`);
    doc.moveDown();
    
    // Financial Summary
    doc.fontSize(14).text('Financial Analysis', { underline: true });
    doc.fontSize(12);
    doc.text(`Total Tax Debt: $${caseData.totalAmountOwed.toLocaleString()}`);
    doc.text(`Asset Equity: $${offerAmount.assetEquity.toLocaleString()}`);
    doc.text(`Future Income: $${offerAmount.futureIncome.toLocaleString()}`);
    doc.text(`Calculated Offer: $${offerAmount.total.toLocaleString()}`);
    
    // Detailed breakdown
    doc.moveDown();
    doc.fontSize(14).text('Asset Breakdown', { underline: true });
    doc.fontSize(10);
    
    offerAmount.assets.forEach(asset => {
      doc.text(`${asset.type}: $${asset.quickSaleValue.toLocaleString()}`);
    });
    
    doc.end();
    
    return new Promise((resolve) => {
      doc.on('end', async () => {
        const pdfBuffer = Buffer.concat(buffers);
        const filename = `generated/${userData.userId}/oic_worksheet_${Date.now()}.pdf`;
        await this.saveToGCS(filename, pdfBuffer);
        
        resolve({
          formType: 'OIC_WORKSHEET',
          filename,
          url: await this.getSignedUrl(filename),
          offerAmount: offerAmount.total,
          generatedAt: new Date().toISOString()
        });
      });
    });
  }

  calculateOfferAmount(userData, caseData) {
    const assets = this.calculateAssetEquity(userData.assets);
    const monthlyDisposable = this.calculateMonthlyDisposableIncome(
      userData.income,
      userData.expenses
    );
    
    // Lump sum offer: 12 months of future income
    // Periodic payment: 24 months of future income
    const futureIncomeMultiplier = caseData.offerType === 'lumpSum' ? 12 : 24;
    const futureIncome = Math.max(0, monthlyDisposable * futureIncomeMultiplier);
    
    return {
      assetEquity: assets.total,
      futureIncome,
      total: assets.total + futureIncome,
      assets: assets.breakdown,
      monthlyDisposable
    };
  }
}
```

### 6. Case Management Workflow Engine

```javascript
// services/case/workflow.engine.js
const { PubSub } = require('@google-cloud/pubsub');
const { Firestore } = require('@google-cloud/firestore');

class WorkflowEngine {
  constructor() {
    this.pubsub = new PubSub();
    this.firestore = new Firestore();
    this.workflows = new Map();
    this.initializeWorkflows();
  }

  initializeWorkflows() {
    // Define state machines for each program
    this.workflows.set('OIC', {
      states: {
        INITIAL_ASSESSMENT: {
          next: ['DOCUMENT_COLLECTION', 'DISQUALIFIED'],
          actions: ['assessEligibility', 'calculateOfferAmount']
        },
        DOCUMENT_COLLECTION: {
          next: ['FORM_PREPARATION', 'INCOMPLETE'],
          actions: ['validateDocuments', 'requestMissing'],
          timeout: 30 // days
        },
        FORM_PREPARATION: {
          next: ['REVIEW', 'REVISION_NEEDED'],
          actions: ['generateForms', 'preparePackage']
        },
        REVIEW: {
          next: ['SUBMISSION', 'REVISION_NEEDED'],
          actions: ['qualityCheck', 'clientApproval']
        },
        SUBMISSION: {
          next: ['IRS_PROCESSING', 'SUBMISSION_ERROR'],
          actions: ['submitToIRS', 'trackSubmission']
        },
        IRS_PROCESSING: {
          next: ['ACCEPTED', 'REJECTED', 'ADDITIONAL_INFO'],
          actions: ['monitorStatus', 'sendUpdates'],
          timeout: 180 // days
        }
      }
    });
  }

  async processStateTransition(caseId, currentState, event) {
    const caseRef = this.firestore.collection('cases').doc(caseId);
    const caseDoc = await caseRef.get();
    const caseData = caseDoc.data();
    
    const workflow = this.workflows.get(caseData.programType);
    const stateConfig = workflow.states[currentState];
    
    // Validate transition
    if (!stateConfig.next.includes(event.nextState)) {
      throw new Error(`Invalid state transition: ${currentState} -> ${event.nextState}`);
    }
    
    // Execute transition actions
    for (const action of stateConfig.actions) {
      await this.executeAction(action, caseData, event);
    }
    
    // Update case state
    await caseRef.update({
      state: event.nextState,
      stateHistory: Firestore.FieldValue.arrayUnion({
        from: currentState,
        to: event.nextState,
        timestamp: new Date(),
        triggeredBy: event.triggeredBy,
        metadata: event.metadata
      }),
      lastUpdated: new Date()
    });
    
    // Publish state change event
    await this.publishEvent('case-state-changed', {
      caseId,
      previousState: currentState,
      newState: event.nextState,
      caseData
    });
    
    // Schedule timeout if configured
    if (workflow.states[event.nextState].timeout) {
      await this.scheduleTimeout(caseId, event.nextState, workflow.states[event.nextState].timeout);
    }
  }

  async executeAction(actionName, caseData, event) {
    const actions = {
      assessEligibility: async () => {
        const eligibilityService = require('../eligibility/eligibility.service');
        return await eligibilityService.assess(caseData.userId);
      },
      
      calculateOfferAmount: async () => {
        const oicCalculator = require('./calculators/oic.calculator');
        return await oicCalculator.calculate(caseData);
      },
      
      validateDocuments: async () => {
        const documentService = require('../document/document.service');
        return await documentService.validateCaseDocuments(caseData.caseId);
      },
      
      generateForms: async () => {
        const formService = require('../forms/form.service');
        return await formService.generateCaseForms(caseData);
      },
      
      submitToIRS: async () => {
        const submissionService = require('./submission.service');
        return await submissionService.submitCase(caseData);
      },
      
      monitorStatus: async () => {
        const monitoringService = require('./monitoring.service');
        return await monitoringService.checkIRSStatus(caseData.trackingNumber);
      }
    };
    
    const action = actions[actionName];
    if (action) {
      return await action();
    }
  }

  async scheduleTimeout(caseId, state, timeoutDays) {
    const topic = this.pubsub.topic('case-timeouts');
    const scheduledTime = new Date();
    scheduledTime.setDate(scheduledTime.getDate() + timeoutDays);
    
    await topic.publishMessage({
      json: {
        caseId,
        state,
        scheduledFor: scheduledTime.toISOString()
      },
      attributes: {
        scheduledTime: scheduledTime.getTime().toString()
      }
    });
  }
}
```

---

## Frontend Development with React/Tailwind

### 1. Main Application Structure

```jsx
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from './store/store';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/assessment" element={<AssessmentFlow />} />
                  <Route path="/documents" element={<DocumentManager />} />
                  <Route path="/case/:caseId" element={<CaseDetails />} />
                  <Route path="/forms" element={<FormsCenter />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}
```

### 2. Assessment Flow Component

```jsx
// src/components/assessment/AssessmentFlow.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useAssessment } from '../../hooks/useAssessment';

const AssessmentFlow = () => {
  const navigate = useNavigate();
  const { saveProgress, submitAssessment, getProgress } = useAssessment();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  const steps = [
    {
      id: 'filing-status',
      title: 'Tax Return Filing Status',
      component: FilingStatusStep
    },
    {
      id: 'debt-details',
      title: 'Tax Debt Information',
      component: DebtDetailsStep
    },
    {
      id: 'financial-overview',
      title: 'Financial Overview',
      component: FinancialOverviewStep
    },
    {
      id: 'assets',
      title: 'Assets and Property',
      component: AssetsStep
    },
    {
      id: 'special-circumstances',
      title: 'Special Circumstances',
      component: SpecialCircumstancesStep
    },
    {
      id: 'review',
      title: 'Review & Submit',
      component: ReviewStep
    }
  ];

  useEffect(() => {
    // Load saved progress
    const savedProgress = getProgress();
    if (savedProgress) {
      setAnswers(savedProgress.answers);
      setCurrentStep(savedProgress.currentStep);
    }
  }, []);

  const handleNext = async () => {
    const currentStepData = steps[currentStep];
    const validation = validateStep(currentStepData.id, answers);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    // Save progress
    await saveProgress({ currentStep: currentStep + 1, answers });
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await submitAssessment(answers);
      navigate(`/results/${result.assessmentId}`);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Tax Relief Assessment</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${index <= currentStep 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-500'
                    }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-2 text-center">
            <p className="text-sm font-medium text-gray-900">{steps[currentStep].title}</p>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <CurrentStepComponent
              answers={answers}
              errors={errors}
              onChange={(updates) => setAnswers({ ...answers, ...updates })}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`flex items-center px-4 py-2 rounded-md ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Step Components
const FilingStatusStep = ({ answers, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Have you filed all required tax returns?</h2>
        <div className="space-y-3">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="allReturnsFiled"
              value="yes"
              checked={answers.allReturnsFiled === 'yes'}
              onChange={(e) => onChange({ allReturnsFiled: e.target.value })}
              className="mr-3"
            />
            <span>Yes, all returns are filed</span>
          </label>
          
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="allReturnsFiled"
              value="no"
              checked={answers.allReturnsFiled === 'no'}
              onChange={(e) => onChange({ allReturnsFiled: e.target.value })}
              className="mr-3"
            />
            <span>No, I have unfiled returns</span>
          </label>
        </div>
        
        {errors.allReturnsFiled && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.allReturnsFiled}
          </p>
        )}
      </div>

      {answers.allReturnsFiled === 'no' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> You must file all required tax returns before qualifying 
            for most IRS relief programs. We'll help you understand what needs to be filed.
          </p>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which years have unfiled returns?
            </label>
            <input
              type="text"
              placeholder="e.g., 2021, 2022"
              value={answers.unfiledYears || ''}
              onChange={(e) => onChange({ unfiledYears: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};
```

### 3. Document Upload Component

```jsx
// src/components/documents/DocumentUpload.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocuments } from '../../hooks/useDocuments';

const DocumentUpload = ({ caseId, onUploadComplete }) => {
  const { uploadDocument, validateDocument } = useDocuments();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const onDrop = useCallback(async (acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
      documentType: detectDocumentType(file.name)
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Validate files before upload
    for (const fileInfo of newFiles) {
      const validation = await validateDocument(fileInfo.file);
      if (!validation.isValid) {
        updateFileStatus(fileInfo.id, 'error', validation.message);
        continue;
      }
      
      uploadFile(fileInfo);
    }
  }, []);

  const uploadFile = async (fileInfo) => {
    updateFileStatus(fileInfo.id, 'uploading');
    
    try {
      const result = await uploadDocument(
        fileInfo.file,
        caseId,
        fileInfo.documentType,
        (progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [fileInfo.id]: progress
          }));
        }
      );
      
      updateFileStatus(fileInfo.id, 'completed', null, result);
      
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (error) {
      updateFileStatus(fileInfo.id, 'error', error.message);
    }
  };

  const updateFileStatus = (fileId, status, error = null, result = null) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status, error, result }
        : f
    ));
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const detectDocumentType = (filename) => {
    const lower = filename.toLowerCase();
    if (lower.includes('transcript')) return 'transcript';
    if (lower.includes('return')) return 'tax_return';
    if (lower.includes('w2') || lower.includes('w-2')) return 'w2';
    if (lower.includes('1099')) return '1099';
    if (lower.includes('bank')) return 'bank_statement';
    return 'other';
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">
          {isDragActive ? 'Drop files here' : 'Drop files or click to upload'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Supported formats: PDF, PNG, JPG, Excel (Max 50MB)
        </p>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {files.map(file => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white border rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.documentType}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {file.status === 'uploading' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${uploadProgress[file.id] || 0}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">
                          {uploadProgress[file.id] || 0}%
                        </span>
                      </div>
                    )}
                    
                    {file.status === 'completed' && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    
                    {file.status === 'error' && (
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                        <span className="text-sm text-red-600">{file.error}</span>
                      </div>
                    )}
                    
                    {file.status === 'pending' && (
                      <Loader className="w-6 h-6 text-gray-400 animate-spin" />
                    )}
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Upload Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Ensure documents are clear and legible</li>
          <li>• Include all pages of multi-page documents</li>
          <li>• IRS transcripts should be recent (within 60 days)</li>
          <li>• Sensitive information is encrypted and secure</li>
        </ul>
      </div>
    </div>
  );
};
```

### 4. Case Status Dashboard Component

```jsx
// src/components/dashboard/CaseStatus.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, CheckCircle, AlertCircle, FileText, 
  DollarSign, Calendar, TrendingUp, ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCases } from '../../hooks/useCases';

const CaseStatus = () => {
  const { cases, loading } = useCases();

  if (loading) {
    return <CaseStatusSkeleton />;
  }

  const activeCase = cases.find(c => c.status === 'active');
  
  if (!activeCase) {
    return <NoCasePrompt />;
  }

  const getStatusColor = (status) => {
    const colors = {
      'active': 'blue',
      'pending': 'yellow',
      'approved': 'green',
      'rejected': 'red',
      'on-hold': 'gray'
    };
    return colors[status] || 'gray';
  };

  const getTimelineSteps = () => {
    const steps = [
      { 
        name: 'Assessment', 
        status: 'completed',
        date: activeCase.assessmentDate,
        icon: CheckCircle
      },
      { 
        name: 'Document Collection', 
        status: activeCase.documentsComplete ? 'completed' : 'current',
        progress: activeCase.documentProgress,
        icon: FileText
      },
      { 
        name: 'Form Preparation', 
        status: activeCase.formsReady ? 'completed' : 'pending',
        icon: FileText
      },
      { 
        name: 'IRS Submission', 
        status: activeCase.submittedToIRS ? 'completed' : 'pending',
        icon: TrendingUp
      },
      { 
        name: 'Resolution', 
        status: activeCase.resolved ? 'completed' : 'pending',
        icon: CheckCircle
      }
    ];
    return steps;
  };

  const timelineSteps = getTimelineSteps();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {activeCase.programType} Case Status
          </h2>
          <p className="text-gray-600 mt-1">
            Case ID: {activeCase.caseId} • Started {formatDate(activeCase.createdAt)}
          </p>
        </div>
        
        <Link
          to={`/case/${activeCase.id}`}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          View Details
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tax Debt</p>
              <p className="text-2xl font-bold text-gray-900">
                ${activeCase.totalDebt.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-blue-50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Potential Savings</p>
              <p className="text-2xl font-bold text-blue-900">
                ${activeCase.estimatedSavings.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-green-50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Next Deadline</p>
              <p className="text-lg font-bold text-green-900">
                {activeCase.nextDeadline ? formatDate(activeCase.nextDeadline) : 'None'}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Timeline</h3>
        <div className="relative">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isPending = step.status === 'pending';
            
            return (
              <div key={step.name} className="relative flex items-center mb-8 last:mb-0">
                {/* Line */}
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`absolute top-10 left-6 w-0.5 h-full -bottom-4
                      ${isCompleted ? 'bg-green-300' : 'bg-gray-300'}`}
                  />
                )}
                
                {/* Icon */}
                <div
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full
                    ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Content */}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${isPending ? 'text-gray-500' : 'text-gray-900'}`}>
                        {step.name}
                      </h4>
                      {step.date && (
                        <p className="text-sm text-gray-500">
                          Completed {formatDate(step.date)}
                        </p>
                      )}
                    </div>
                    
                    {isCurrent && step.progress !== undefined && (
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${step.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{step.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Items */}
      {activeCase.actionItems && activeCase.actionItems.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Actions</h3>
          <div className="space-y-3">
            {activeCase.actionItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  {item.dueDate && (
                    <p className="text-sm text-yellow-700 mt-2">
                      Due by {formatDate(item.dueDate)}
                    </p>
                  )}
                </div>
                {item.actionUrl && (
                  <Link
                    to={item.actionUrl}
                    className="ml-4 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                  >
                    Take Action
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default CaseStatus;
```

---

## Security Implementation

### 1. Authentication Service with Google Cloud Identity

```javascript
// services/auth/auth.service.js
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

class AuthService {
  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    this.secretManager = new SecretManagerServiceClient();
    this.initializeSecrets();
  }

  async initializeSecrets() {
    // Fetch JWT secret from Secret Manager
    const [jwtSecret] = await this.secretManager.accessSecretVersion({
      name: `projects/${process.env.GCP_PROJECT}/secrets/jwt-secret/versions/latest`
    });
    this.jwtSecret = jwtSecret.payload.data.toString('utf8');
  }

  async register(userData) {
    // Validate input
    this.validateRegistrationData(userData);
    
    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    // Create user with 2FA setup
    const twoFactorSecret = speakeasy.generateSecret({
      name: `TaxRelief:${userData.email}`
    });
    
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      twoFactorSecret: twoFactorSecret.base32,
      twoFactorEnabled: false,
      emailVerified: false,
      createdAt: new Date()
    });
    
    // Generate QR code for 2FA
    const qrCodeUrl = await QRCode.toDataURL(twoFactorSecret.otpauth_url);
    
    // Send verification email
    await this.sendVerificationEmail(user);
    
    return {
      user: this.sanitizeUser(user),
      twoFactorQR: qrCodeUrl,
      twoFactorSecret: twoFactorSecret.base32
    };
  }

  async login(email, password, twoFactorToken = null) {
    // Find user
    const user = await User.findOne({ email }).select('+password +twoFactorSecret');
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Log failed attempt
      await this.logFailedAttempt(user.id);
      throw new Error('Invalid credentials');
    }
    
    // Check 2FA if enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorToken) {
        return { requiresTwoFactor: true };
      }
      
      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorToken,
        window: 2
      });
      
      if (!isValid) {
        throw new Error('Invalid 2FA token');
      }
    }
    
    // Generate tokens
    const tokens = this.generateTokens(user);
    
    // Update last login
    await User.updateOne(
      { _id: user._id },
      { 
        lastLogin: new Date(),
        refreshToken: tokens.refreshToken
      }
    );
    
    // Log successful login
    await this.logSuccessfulLogin(user.id);
    
    return {
      user: this.sanitizeUser(user),
      ...tokens
    };
  }

  generateTokens(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };
    
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: '15m',
      issuer: 'tax-relief-app',
      audience: 'tax-relief-users'
    });
    
    const refreshToken = jwt.sign(
      { userId: user._id },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'tax-relief-app',
        audience: 'tax-relief-users'
      });
      
      // Check if user still exists and is active
      const user = await User.findById(decoded.userId).select('status');
      if (!user || user.status !== 'active') {
        throw new Error('User not found or inactive');
      }
      
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async googleSignIn(idToken) {
    try {
      // Verify Google token
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      
      // Find or create user
      let user = await User.findOne({ email: payload.email });
      
      if (!user) {
        user = await User.create({
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          googleId: payload.sub,
          emailVerified: payload.email_verified,
          profilePicture: payload.picture,
          authProvider: 'google'
        });
      } else {
        // Update Google ID if not set
        if (!user.googleId) {
          user.googleId = payload.sub;
          await user.save();
        }
      }
      
      // Generate tokens
      const tokens = this.generateTokens(user);
      
      return {
        user: this.sanitizeUser(user),
        ...tokens
      };
    } catch (error) {
      throw new Error('Google authentication failed');
    }
  }

  sanitizeUser(user) {
    const { password, twoFactorSecret, refreshToken, ...sanitized } = user.toObject();
    return sanitized;
  }
}
```

### 2. Data Encryption Service

```javascript
// services/encryption/encryption.service.js
const crypto = require('crypto');
const { KeyManagementServiceClient } = require('@google-cloud/kms');

class EncryptionService {
  constructor() {
    this.kmsClient = new KeyManagementServiceClient();
    this.keyName = `projects/${process.env.GCP_PROJECT}/locations/us-central1/keyRings/tax-relief/cryptoKeys/user-data`;
  }

  async encryptSensitiveData(data) {
    // Convert data to string if object
    const plaintext = typeof data === 'object' ? JSON.stringify(data) : data;
    
    // Generate a data encryption key (DEK)
    const dek = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    
    // Encrypt data with DEK
    const cipher = crypto.createCipheriv('aes-256-gcm', dek, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final()
    ]);
    const authTag = cipher.getAuthTag();
    
    // Encrypt DEK with KMS
    const [encryptResponse] = await this.kmsClient.encrypt({
      name: this.keyName,
      plaintext: dek
    });
    
    // Return encrypted data with encrypted DEK
    return {
      encryptedData: encrypted.toString('base64'),
      encryptedDek: encryptResponse.ciphertext.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64')
    };
  }

  async decryptSensitiveData(encryptedPayload) {
    // Decrypt DEK with KMS
    const [decryptResponse] = await this.kmsClient.decrypt({
      name: this.keyName,
      ciphertext: Buffer.from(encryptedPayload.encryptedDek, 'base64')
    });
    
    const dek = decryptResponse.plaintext;
    
    // Decrypt data with DEK
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      dek,
      Buffer.from(encryptedPayload.iv, 'base64')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedPayload.authTag, 'base64'));
    
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedPayload.encryptedData, 'base64')),
      decipher.final()
    ]);
    
    const plaintext = decrypted.toString('utf8');
    
    // Try to parse as JSON
    try {
      return JSON.parse(plaintext);
    } catch {
      return plaintext;
    }
  }

  // Hash SSN for searching while keeping it secure
  hashSSN(ssn) {
    // Remove any formatting
    const cleanSSN = ssn.replace(/\D/g, '');
    
    // Use HMAC for searchable hash
    const hmac = crypto.createHmac('sha256', process.env.SSN_HASH_SECRET);
    hmac.update(cleanSSN);
    return hmac.digest('hex');
  }

  // Mask SSN for display
  maskSSN(ssn) {
    const clean = ssn.replace(/\D/g, '');
    return `XXX-XX-${clean.slice(-4)}`;
  }
}
```

---

## Deployment and DevOps

### 1. CI/CD Pipeline with Cloud Build

```yaml
# cloudbuild.yaml
steps:
  # Install dependencies
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['ci']
    dir: 'backend'
    
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['ci']
    dir: 'frontend'
  
  # Run tests
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['test']
    dir: 'backend'
    env:
      - 'NODE_ENV=test'
  
  # Security scanning
  - name: 'aquasec/trivy'
    args: ['filesystem', '--exit-code', '1', '--severity', 'HIGH,CRITICAL', '.']
  
  # Build backend Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args: [
      'build',
      '-t', 'gcr.io/$PROJECT_ID/tax-relief-backend:$COMMIT_SHA',
      '-t', 'gcr.io/$PROJECT_ID/tax-relief-backend:latest',
      './backend'
    ]
  
  # Build frontend
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['run', 'build']
    dir: 'frontend'
    env:
      - 'REACT_APP_API_URL=https://api.taxrelief.app'
      - 'REACT_APP_GOOGLE_CLIENT_ID=${_GOOGLE_CLIENT_ID}'
  
  # Deploy backend to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args: [
      'run', 'deploy', 'tax-relief-backend',
      '--image', 'gcr.io/$PROJECT_ID/tax-relief-backend:$COMMIT_SHA',
      '--region', 'us-central1',
      '--platform', 'managed',
      '--allow-unauthenticated',
      '--set-env-vars', 'NODE_ENV=production',
      '--set-cloudsql-instances', '${_CLOUD_SQL_CONNECTION}',
      '--service-account', 'tax-relief-backend@$PROJECT_ID.iam.gserviceaccount.com',
      '--memory', '2Gi',
      '--cpu', '2',
      '--min-instances', '2',
      '--max-instances', '10'
    ]
  
  # Deploy frontend to Cloud Storage + CDN
  - name: 'gcr.io/cloud-builders/gsutil'
    args: ['-m', 'rsync', '-r', '-d', './frontend/build', 'gs://tax-relief-frontend']
  
  # Invalidate CDN cache
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['compute', 'url-maps', 'invalidate-cdn-cache', 'tax-relief-cdn', '--path', '/*']

substitutions:
  _GOOGLE_CLIENT_ID: '${GOOGLE_CLIENT_ID}'
  _CLOUD_SQL_CONNECTION: '${PROJECT_ID}:us-central1:tax-relief-db'

options:
  logging: CLOUD_LOGGING_ONLY
  machineType: 'N1_HIGHCPU_8'
```

### 2. Infrastructure as Code with Terraform

```hcl
# main.tf
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
  backend "gcs" {
    bucket = "tax-relief-terraform-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# VPC Network
resource "google_compute_network" "main" {
  name                    = "tax-relief-vpc"
  auto_create_subnetworks = false
}

# Subnets
resource "google_compute_subnetwork" "public" {
  name          = "public-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region        = var.region
  network       = google_compute_network.main.id
}

resource "google_compute_subnetwork" "private" {
  name          = "private-subnet"
  ip_cidr_range = "10.0.2.0/24"
  region        = var.region
  network       = google_compute_network.main.id
  
  private_ip_google_access = true
}

# Cloud SQL Instance
resource "google_sql_database_instance" "main" {
  name             = "tax-relief-db"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-n1-standard-4"
    
    backup_configuration {
      enabled                        = true
      start_time                     = "02:00"
      point_in_time_recovery_enabled = true
    }
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.main.id
    }
    
    database_flags {
      name  = "max_connections"
      value = "200"
    }
  }
}

# Redis Instance
resource "google_redis_instance" "cache" {
  name           = "tax-relief-cache"
  tier           = "STANDARD_HA"
  memory_size_gb = 8
  region         = var.region
  
  authorized_network = google_compute_network.main.id
  redis_version      = "REDIS_6_X"
  
  persistence_config {
    persistence_mode    = "RDB"
    rdb_snapshot_period = "TWELVE_HOURS"
  }
}

# Cloud Storage Buckets
resource "google_storage_bucket" "documents" {
  name          = "${var.project_id}-tax-documents"
  location      = "US"
  storage_class = "STANDARD"
  
  encryption {
    default_kms_key_name = google_kms_crypto_key.storage.id
  }
  
  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
  
  versioning {
    enabled = true
  }
}

# KMS Key Ring
resource "google_kms_key_ring" "main" {
  name     = "tax-relief-keyring"
  location = var.region
}

# KMS Crypto Keys
resource "google_kms_crypto_key" "storage" {
  name     = "storage-encryption-key"
  key_ring = google_kms_key_ring.main.id
  
  rotation_period = "7776000s" # 90 days
}

# Load Balancer
resource "google_compute_global_address" "default" {
  name = "tax-relief-ip"
}

resource "google_compute_global_forwarding_rule" "default" {
  name       = "tax-relief-forwarding-rule"
  target     = google_compute_target_https_proxy.default.id
  port_range = "443"
  ip_address = google_compute_global_address.default.address
}

# Cloud Armor Security Policy
resource "google_compute_security_policy" "default" {
  name = "tax-relief-security-policy"
  
  rule {
    action   = "deny(403)"
    priority = "1000"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["45.55.0.0/16", "190.220.0.0/16"]
      }
    }
  }
  
  rule {
    action   = "rate_based_ban"
    priority = "2000"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    rate_limit_options {
      rate_limit_threshold {
        count        = 100
        interval_sec = 60
      }
      ban_duration_sec = 600
    }
  }
}
```

---

## Monitoring and Observability

### 1. Application Monitoring Setup

```javascript
// monitoring/monitoring.setup.js
const { MetricServiceClient } = require('@google-cloud/monitoring');
const { ErrorReporting } = require('@google-cloud/error-reporting');
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');

class MonitoringService {
  constructor() {
    this.metricClient = new MetricServiceClient();
    this.errorReporting = new ErrorReporting();
    this.setupTracing();
    this.setupMetrics();
  }

  setupTracing() {
    const provider = new NodeTracerProvider();
    const exporter = new TraceExporter();
    provider.addSpanProcessor(new BatchSpanProcessor(exporter));
    provider.register();
    
    registerInstrumentations({
      instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
        new IORedisInstrumentation(),
      ],
    });
  }

  async recordMetric(metricType, value, labels = {}) {
    const projectId = await this.metricClient.getProjectId();
    const dataPoint = {
      interval: {
        endTime: {
          seconds: Math.floor(Date.now() / 1000),
        },
      },
      value: {
        doubleValue: value,
      },
    };

    const timeSeries = {
      metric: {
        type: `custom.googleapis.com/tax-relief/${metricType}`,
        labels: labels,
      },
      resource: {
        type: 'global',
        labels: {
          project_id: projectId,
        },
      },
      points: [dataPoint],
    };

    await this.metricClient.createTimeSeries({
      name: this.metricClient.projectPath(projectId),
      timeSeries: [timeSeries],
    });
  }

  // Business metrics
  async trackCaseCreation(programType, userId) {
    await this.recordMetric('cases/created', 1, {
      program_type: programType,
      user_segment: await this.getUserSegment(userId)
    });
  }

  async trackDocumentProcessing(documentType, processingTime, success) {
    await this.recordMetric('documents/processing_time', processingTime, {
      document_type: documentType,
      status: success ? 'success' : 'failure'
    });
  }

  async trackEligibilityCheck(programType, qualified) {
    await this.recordMetric('eligibility/checks', 1, {
      program_type: programType,
      result: qualified ? 'qualified' : 'disqualified'
    });
  }
}
```

---

## Conclusion

This comprehensive development guide covers all major aspects of building your IRS Tax Debt Relief SaaS platform on Google Cloud. The implementation focuses on:

1. **Security**: Multi-layered security with encryption, authentication, and compliance measures
2. **Scalability**: Auto-scaling infrastructure with load balancing and caching
3. **Reliability**: High availability setup with backup and disaster recovery
4. **Performance**: Optimized database queries, CDN, and efficient processing
5. **User Experience**: Modern React frontend with real-time updates and intuitive workflows
6. **Compliance**: IRS regulation adherence with audit trails and secure data handling

The platform is designed to handle the complex requirements of tax debt relief processing while providing a smooth experience for users navigating through various IRS programs.