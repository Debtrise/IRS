# OwlTax Backend API Specification - Complete Guide

## Overview
This document provides detailed specifications for every API endpoint required by the OwlTax frontend application. All endpoints should follow RESTful conventions and return consistent response structures.

## Base Configuration

### Base URLs
```
Production: https://api.owltax.com/v1
Staging: https://staging-api.owltax.com/v1
Development: http://localhost:8000/v1
```

### Authentication
- All authenticated endpoints require JWT Bearer token in Authorization header
- Format: `Authorization: Bearer <jwt_token>`
- Tokens expire after 1 hour (access) and 7 days (refresh)

### Response Structure
All responses must follow this format:
```json
{
  "success": boolean,
  "data": object | array | null,
  "message": string,
  "errors": array | null,
  "meta": {
    "timestamp": "ISO8601",
    "version": "1.0",
    "requestId": "uuid",
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    }
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "data": null,
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "fieldName",
      "code": "ERROR_CODE",
      "message": "Detailed error message"
    }
  ],
  "meta": {
    "timestamp": "ISO8601",
    "version": "1.0",
    "requestId": "uuid"
  }
}
```

---

## 1. Authentication Endpoints

### 1.1 User Registration
**POST** `/auth/register`
- **Purpose**: 3-step user registration flow
- **Authentication**: None required
- **Request Body**:
```json
{
  "firstName": "string",          // required, min 2 chars
  "lastName": "string",           // required, min 2 chars
  "email": "string",              // required, valid email format
  "phone": "string",              // required, format: (xxx) xxx-xxxx
  "taxDebt": "string",            // required, values: "5000", "10000", "25000", "50000", "100000", "200000", "500000"
  "taxYears": "string",           // required, e.g., "2020-2023"
  "hasNotices": boolean,          // required
  "password": "string",           // required, min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special
  "agreeToTerms": boolean,        // required, must be true
  "agreeToPrivacy": boolean,      // required, must be true
  "referralSource": "string"      // optional
}
```
- **Success Response** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "phone": "string",
      "status": "active",
      "emailVerified": false,
      "createdAt": "ISO8601"
    },
    "tokens": {
      "accessToken": "jwt_string",
      "refreshToken": "jwt_string",
      "expiresIn": 3600
    },
    "onboardingStatus": {
      "assessmentCompleted": false,
      "documentsUploaded": false,
      "programSelected": false
    }
  },
  "message": "Registration successful"
}
```

### 1.2 User Login
**POST** `/auth/login`
- **Purpose**: Authenticate existing user
- **Request Body**:
```json
{
  "email": "string",        // required
  "password": "string",     // required
  "rememberMe": boolean     // optional, extends refresh token to 30 days
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "status": "active",
      "lastLoginAt": "ISO8601",
      "cases": {
        "total": number,
        "active": number,
        "completed": number
      }
    },
    "tokens": {
      "accessToken": "jwt_string",
      "refreshToken": "jwt_string",
      "expiresIn": 3600
    }
  }
}
```

### 1.3 Password Reset Request
**POST** `/auth/forgot-password`
- **Request Body**:
```json
{
  "email": "string"  // required
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Password reset instructions sent to your email"
}
```

### 1.4 Password Reset Confirmation
**POST** `/auth/reset-password`
- **Request Body**:
```json
{
  "token": "string",              // required, from email link
  "password": "string",           // required, same validation as registration
  "confirmPassword": "string"     // required, must match password
}
```

### 1.5 Token Refresh
**POST** `/auth/refresh`
- **Request Body**:
```json
{
  "refreshToken": "string"  // required
}
```

### 1.6 Logout
**POST** `/auth/logout`
- **Purpose**: Invalidate tokens
- **Authentication**: Required
- **Request Body**: Empty

---

## 2. User Management Endpoints

### 2.1 Get User Profile
**GET** `/users/profile`
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "status": "active|pending|suspended",
    "emailVerified": boolean,
    "taxDebt": "string",
    "taxYears": "string",
    "hasNotices": boolean,
    "createdAt": "ISO8601",
    "lastLoginAt": "ISO8601",
    "subscription": {
      "plan": "basic|standard|premium",
      "status": "active|cancelled|past_due",
      "nextBillingDate": "ISO8601"
    },
    "cases": {
      "total": number,
      "active": number,
      "completed": number
    },
    "assessments": {
      "total": number,
      "lastCompletedAt": "ISO8601"
    }
  }
}
```

### 2.2 Update User Profile
**PUT** `/users/profile`
- **Request Body**:
```json
{
  "firstName": "string",      // optional
  "lastName": "string",       // optional
  "phone": "string",          // optional
  "taxDebt": "string",        // optional
  "taxYears": "string",       // optional
  "notificationPreferences": {
    "email": boolean,
    "sms": boolean,
    "push": boolean
  }
}
```

### 2.3 Change Password
**PUT** `/users/password`
- **Request Body**:
```json
{
  "currentPassword": "string",    // required
  "newPassword": "string",        // required
  "confirmPassword": "string"     // required
}
```

---

## 3. Assessment Endpoints

### 3.1 Submit Assessment
**POST** `/assessments`
- **Purpose**: Submit comprehensive tax situation assessment
- **Request Body**:
```json
{
  "personalInfo": {
    "filingStatus": "single|married-joint|married-separate|head-household|widow",
    "dependents": number,
    "age": number,
    "state": "string"
  },
  "financialInfo": {
    "monthlyGrossIncome": number,
    "monthlyNetIncome": number,
    "employmentStatus": "employed|self-employed|unemployed|retired|disabled",
    "homeOwnership": "own|rent|live-with-family",
    "homeEquity": number,
    "vehicles": number,
    "bankBalance": number,
    "investments": number,
    "retirement": number,
    "otherAssets": number
  },
  "taxInfo": {
    "totalDebt": "string",
    "taxYears": "string",
    "hasUnfiledReturns": boolean,
    "currentWithFilings": boolean,
    "hasNotices": boolean,
    "noticeTypes": ["CP14", "CP501", "CP503", "CP504", "CP2000", "other"],
    "hasLiens": boolean,
    "hasLevies": boolean,
    "hasBankruptcy": boolean
  },
  "circumstances": {
    "emergencyStatus": "no-emergency|medical|job-loss|disability|divorce|other",
    "specialCircumstances": ["medical", "disability", "unemployment", "divorce", "firstTime", "levy", "lien", "business", "covid", "retirement"],
    "additionalInfo": "string"
  }
}
```
- **Success Response** (201):
```json
{
  "success": true,
  "data": {
    "assessmentId": "uuid",
    "completedAt": "ISO8601",
    "eligibility": {
      "installmentAgreement": {
        "eligible": boolean,
        "confidence": 85,
        "estimatedMonthlyPayment": 450,
        "timeline": "3-6 weeks",
        "requirements": ["string"]
      },
      "offerInCompromise": {
        "eligible": boolean,
        "confidence": 70,
        "estimatedOffer": 12500,
        "estimatedSavings": 32500,
        "timeline": "6-12 months",
        "requirements": ["string"]
      },
      "currentlyNotCollectible": {
        "eligible": boolean,
        "confidence": 60,
        "duration": "12-24 months",
        "timeline": "2-4 weeks",
        "requirements": ["string"]
      },
      "penaltyAbatement": {
        "eligible": boolean,
        "confidence": 90,
        "estimatedSavings": 5600,
        "timeline": "4-8 weeks",
        "requirements": ["string"]
      },
      "innocentSpouse": {
        "eligible": boolean,
        "confidence": 40,
        "timeline": "6-9 months",
        "requirements": ["string"]
      }
    },
    "recommendations": {
      "primary": {
        "program": "offer-in-compromise",
        "reasoning": "Based on your financial situation, an OIC offers the best potential for significant tax debt reduction",
        "nextSteps": ["string"]
      },
      "alternatives": [
        {
          "program": "installment-agreement",
          "reasoning": "If OIC is not approved, an IA can provide manageable monthly payments"
        }
      ]
    },
    "financialSummary": {
      "totalDebt": 45000,
      "estimatedSavings": 32500,
      "ourFee": 4500,
      "netSavings": 28000,
      "savingsPercentage": 62
    }
  }
}
```

### 3.2 Get Assessment Results
**GET** `/assessments/{id}`
- **Authentication**: Required
- **Response**: Same as submit assessment response

### 3.3 Get User's Assessments
**GET** `/assessments`
- **Query Parameters**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
- **Response**: Array of assessment summaries

---

## 4. Case Management Endpoints

### 4.1 Get User's Cases
**GET** `/cases`
- **Query Parameters**:
  - `status`: new|in-review|documents-pending|submitted|negotiation|approved|completed|rejected
  - `program`: installment-agreement|offer-in-compromise|currently-not-collectible|penalty-abatement|innocent-spouse
  - `page`: number
  - `limit`: number
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "caseNumber": "OIC-2024-0234",
      "program": "offer-in-compromise",
      "status": "documents-pending",
      "priority": "high",
      "taxDebt": 45000,
      "estimatedSavings": 32500,
      "progress": 35,
      "currentPhase": "Document Collection",
      "assignedSpecialist": {
        "id": "uuid",
        "name": "Sarah Johnson",
        "title": "Senior Tax Resolution Specialist",
        "email": "sarah.j@owltax.com",
        "phone": "(555) 123-4567"
      },
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601",
      "estimatedCompletionDate": "ISO8601",
      "nextActionRequired": {
        "action": "Upload bank statements",
        "dueDate": "ISO8601"
      }
    }
  ]
}
```

### 4.2 Create New Case
**POST** `/cases`
- **Request Body**:
```json
{
  "program": "installment-agreement|offer-in-compromise|currently-not-collectible|penalty-abatement|innocent-spouse",
  "assessmentId": "uuid",
  "priority": "low|medium|high|urgent",
  "notes": "string"
}
```

### 4.3 Get Case Details
**GET** `/cases/{id}`
- **Response**: Detailed case information including timeline, documents, communications

### 4.4 Update Case
**PUT** `/cases/{id}`
- **Request Body**: Partial update of case fields

### 4.5 Get Case Timeline
**GET** `/cases/{id}/timeline`
- **Response**:
```json
{
  "success": true,
  "data": {
    "milestones": [
      {
        "id": "uuid",
        "title": "Case Initiated",
        "description": "Your case was opened and assigned to a specialist",
        "status": "completed",
        "completedAt": "ISO8601",
        "dueDate": null
      }
    ],
    "activities": [
      {
        "id": "uuid",
        "type": "document|message|status|payment",
        "title": "Bank statement uploaded",
        "performedBy": "user|specialist|system",
        "createdAt": "ISO8601"
      }
    ]
  }
}
```

---

## 5. Document Management Endpoints

### 5.1 Get Documents
**GET** `/documents`
- **Query Parameters**:
  - `caseId`: uuid
  - `type`: w2|1099|bank-statement|tax-return|irs-notice|financial-statement|other
  - `status`: pending|approved|rejected|needs-review
  - `category`: tax-returns|irs-notices|financial|supporting|correspondence|forms
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "2023 Form 1040",
      "filename": "2023_form_1040.pdf",
      "type": "tax-return",
      "category": "tax-returns",
      "size": 2457600,
      "mimeType": "application/pdf",
      "status": "approved",
      "caseId": "uuid",
      "uploadedAt": "ISO8601",
      "uploadedBy": "user",
      "reviewedAt": "ISO8601",
      "reviewedBy": "Sarah Johnson",
      "notes": "All schedules included",
      "thumbnailUrl": "string",
      "downloadUrl": "signed-url",
      "metadata": {
        "taxYear": "2023",
        "pages": 12
      }
    }
  ]
}
```

### 5.2 Upload Document
**POST** `/documents/upload`
- **Content-Type**: multipart/form-data
- **Request Body**:
  - `file`: File (required, max 10MB)
  - `title`: string (required)
  - `type`: string (required)
  - `category`: string (required)
  - `caseId`: uuid (optional)
  - `description`: string (optional)
  - `taxYear`: string (optional)
- **Success Response**: Document object with upload details

### 5.3 Get Document Download URL
**GET** `/documents/{id}/download`
- **Response**:
```json
{
  "success": true,
  "data": {
    "downloadUrl": "signed-s3-url",
    "expiresAt": "ISO8601"
  }
}
```

### 5.4 Delete Document
**DELETE** `/documents/{id}`
- **Response**: Success confirmation

---

## 6. Payment Endpoints

### 6.1 Get Payment Methods
**GET** `/payments/methods`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "card",
      "isDefault": true,
      "card": {
        "brand": "visa",
        "last4": "4242",
        "expiryMonth": 12,
        "expiryYear": 2025,
        "holderName": "John Doe"
      },
      "createdAt": "ISO8601"
    }
  ]
}
```

### 6.2 Add Payment Method
**POST** `/payments/methods`
- **Request Body**:
```json
{
  "type": "card|bank",
  "stripeToken": "string",     // for cards
  "isDefault": boolean,
  "billingAddress": {
    "line1": "string",
    "line2": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string"
  }
}
```

### 6.3 Process Payment
**POST** `/payments/process`
- **Request Body**:
```json
{
  "amount": number,
  "currency": "USD",
  "paymentMethodId": "uuid",
  "caseId": "uuid",
  "description": "string",
  "type": "success-fee|subscription|consultation"
}
```

### 6.4 Get Payment History
**GET** `/payments/invoices`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "invoiceNumber": "INV-2024-0234",
      "amount": 99.00,
      "currency": "USD",
      "status": "paid|pending|failed|refunded",
      "type": "subscription",
      "description": "Monthly subscription - Standard Plan",
      "caseId": "uuid",
      "paymentMethod": {
        "type": "card",
        "last4": "4242"
      },
      "createdAt": "ISO8601",
      "paidAt": "ISO8601",
      "invoiceUrl": "string"
    }
  ]
}
```

---

## 7. Communication Endpoints

### 7.1 Get Messages
**GET** `/communications/messages`
- **Query Parameters**:
  - `caseId`: uuid
  - `type`: user|specialist|system
  - `unreadOnly`: boolean
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "threadId": "uuid",
      "caseId": "uuid",
      "subject": "Question about Form 433-A",
      "message": "string",
      "sender": {
        "id": "uuid",
        "name": "Sarah Johnson",
        "type": "specialist",
        "avatar": "url"
      },
      "attachments": [
        {
          "id": "uuid",
          "filename": "string",
          "size": number,
          "url": "string"
        }
      ],
      "isRead": boolean,
      "createdAt": "ISO8601"
    }
  ]
}
```

### 7.2 Send Message
**POST** `/communications/messages`
- **Request Body**:
```json
{
  "subject": "string",
  "message": "string",
  "caseId": "uuid",
  "threadId": "uuid",
  "priority": "low|normal|high",
  "attachmentIds": ["uuid"]
}
```

### 7.3 Get Notifications
**GET** `/communications/notifications`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "document-request|deadline|status-update|payment|message",
      "title": "Document deadline approaching",
      "message": "Please upload your bank statements by Feb 28",
      "priority": "low|medium|high|urgent",
      "isRead": boolean,
      "actionRequired": boolean,
      "actionUrl": "/documents",
      "createdAt": "ISO8601",
      "expiresAt": "ISO8601"
    }
  ]
}
```

### 7.4 Mark Notification as Read
**PUT** `/communications/notifications/{id}/read`

---

## 8. IRS Notice Management Endpoints

### 8.1 Get IRS Notices
**GET** `/notices`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "noticeType": "CP14|CP501|CP503|CP504|CP2000|LT11|LT16|other",
      "noticeNumber": "CP2000-2024-001",
      "noticeDate": "ISO8601",
      "severity": "urgent|important|info",
      "subject": "Proposed Changes to Your 2022 Tax Return",
      "summary": "string",
      "deadline": "ISO8601",
      "amountDue": 4500,
      "taxYear": "2022",
      "documentId": "uuid",
      "status": "new|under-review|responded|resolved",
      "responseRequired": boolean,
      "assignedTo": {
        "id": "uuid",
        "name": "Sarah Johnson"
      }
    }
  ]
}
```

### 8.2 Upload IRS Notice
**POST** `/notices`
- **Request Body**:
```json
{
  "noticeType": "string",
  "noticeDate": "ISO8601",
  "amount": number,
  "taxYear": "string",
  "description": "string",
  "documentId": "uuid",
  "urgency": "low|medium|high|urgent"
}
```

---

## 9. Consultation/Appointment Endpoints

### 9.1 Get Available Time Slots
**GET** `/consultations/availability`
- **Query Parameters**:
  - `type`: initial|followup|specialist
  - `date`: ISO8601
  - `specialistId`: uuid (optional)
- **Response**:
```json
{
  "success": true,
  "data": {
    "date": "2024-02-20",
    "timeSlots": [
      {
        "time": "09:00",
        "available": true,
        "specialistId": "uuid"
      }
    ]
  }
}
```

### 9.2 Schedule Consultation
**POST** `/consultations/schedule`
- **Request Body**:
```json
{
  "type": "initial|followup|specialist",
  "date": "ISO8601",
  "time": "HH:MM",
  "specialistId": "uuid",
  "duration": 30,
  "phone": "string",
  "email": "string",
  "notes": "string",
  "reminderPreferences": {
    "email": boolean,
    "sms": boolean,
    "minutesBefore": [1440, 60]
  }
}
```

### 9.3 Get User's Consultations
**GET** `/consultations`
- **Response**: Array of scheduled consultations

### 9.4 Cancel/Reschedule Consultation
**PUT** `/consultations/{id}`
**DELETE** `/consultations/{id}`

---

## 10. Program-Specific Endpoints

### 10.1 Submit Offer in Compromise
**POST** `/programs/offer-in-compromise`
- **Request Body**:
```json
{
  "caseId": "uuid",
  "offerType": "doubt-collectibility|doubt-liability|effective-tax-administration",
  "offerAmount": 12500,
  "paymentOption": "lump-sum|periodic",
  "lumpsumPayment": {
    "downPayment": 2500,
    "remainingPayment": 10000,
    "paymentDate": "ISO8601"
  },
  "periodicPayments": {
    "monthlyAmount": 500,
    "numberOfMonths": 24,
    "startDate": "ISO8601"
  },
  "financialInfo": {
    "monthlyIncome": 5000,
    "monthlyExpenses": {
      "housing": 1500,
      "utilities": 300,
      "food": 600,
      "transportation": 400,
      "healthcare": 200,
      "insurance": 150,
      "taxes": 800,
      "other": 200
    },
    "assets": {
      "realEstate": [
        {
          "description": "Primary Residence",
          "value": 250000,
          "mortgage": 180000,
          "equity": 70000
        }
      ],
      "vehicles": [
        {
          "description": "2020 Toyota Camry",
          "value": 20000,
          "loan": 12000,
          "equity": 8000
        }
      ],
      "bankAccounts": 5000,
      "investments": 15000,
      "retirement": 45000,
      "lifeInsurance": 10000,
      "otherAssets": 2000
    }
  },
  "specialCircumstances": "string",
  "supportingDocumentIds": ["uuid"]
}
```

### 10.2 Submit Installment Agreement
**POST** `/programs/installment-agreement`
- **Request Body**:
```json
{
  "caseId": "uuid",
  "agreementType": "guaranteed|streamlined|non-streamlined|partial-payment",
  "monthlyPayment": 450,
  "paymentDate": 15,
  "paymentMethod": {
    "type": "direct-debit|check|online",
    "bankAccount": {
      "accountType": "checking|savings",
      "routingNumber": "string",
      "accountNumber": "string",
      "bankName": "string"
    }
  },
  "financialInfo": {
    "monthlyIncome": 5000,
    "monthlyExpenses": 4200,
    "assets": 15000,
    "equity": 8000
  },
  "proposedStartDate": "ISO8601",
  "numberOfMonths": 72
}
```

### 10.3 Submit Currently Not Collectible
**POST** `/programs/currently-not-collectible`
- **Request Body**:
```json
{
  "caseId": "uuid",
  "hardshipType": "unemployment|medical|fixed-income|disability|other",
  "monthlyIncome": 1200,
  "monthlyExpenses": 1500,
  "employmentStatus": "unemployed|disabled|retired|student",
  "dependents": 2,
  "healthIssues": boolean,
  "specialCircumstances": "string",
  "supportingDocuments": {
    "medicalRecords": ["uuid"],
    "unemploymentBenefits": ["uuid"],
    "disabilityDetermination": ["uuid"],
    "incomeProof": ["uuid"]
  }
}
```

### 10.4 Submit Penalty Abatement
**POST** `/programs/penalty-abatement`
- **Request Body**:
```json
{
  "caseId": "uuid",
  "abatementType": "first-time|reasonable-cause",
  "taxYears": [2021, 2022],
  "penaltyAmount": 5600,
  "reasonCategory": "death|serious-illness|natural-disaster|inability-to-obtain-records|ignorance|reliance-on-advice|other",
  "detailedExplanation": "string",
  "priorCompliance": {
    "hasFiledReturns": boolean,
    "hasPaidTaxes": boolean,
    "yearsCompliant": 3
  },
  "supportingEvidence": ["uuid"]
}
```

### 10.5 Submit Innocent Spouse Relief
**POST** `/programs/innocent-spouse-relief`
- **Request Body**:
```json
{
  "caseId": "uuid",
  "reliefType": "traditional|separation-of-liability|equitable",
  "taxYears": [2020, 2021],
  "spouseInfo": {
    "name": "string",
    "ssn": "encrypted-string",
    "currentAddress": {
      "line1": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string"
    }
  },
  "marriageInfo": {
    "marriageDate": "ISO8601",
    "separationDate": "ISO8601",
    "divorceDate": "ISO8601",
    "currentStatus": "married|separated|divorced|widowed"
  },
  "taxInfo": {
    "jointReturnFiled": boolean,
    "understatedTax": 15000,
    "knewOfErrors": boolean,
    "benefitedFrom": boolean,
    "economicHardship": boolean
  },
  "circumstances": "string",
  "supportingDocuments": ["uuid"]
}
```

---

## 11. Admin Endpoints

### 11.1 Admin Authentication
**POST** `/admin/auth/login`
- **Request Body**:
```json
{
  "email": "string",
  "password": "string",
  "mfaCode": "string"  // if MFA enabled
}
```

### 11.2 User Management
**GET** `/admin/users`
- **Query Parameters**:
  - `search`: string
  - `status`: active|pending|suspended
  - `dateFrom`: ISO8601
  - `dateTo`: ISO8601
  - `hasActiveCases`: boolean
  - `page`, `limit`

**GET** `/admin/users/{id}`
**PUT** `/admin/users/{id}`
**PUT** `/admin/users/{id}/status`

### 11.3 Case Management
**GET** `/admin/cases`
- **Query Parameters**:
  - `search`: string
  - `status`: string
  - `program`: string
  - `assignedTo`: uuid
  - `priority`: string
  - `dateFrom`, `dateTo`

**PUT** `/admin/cases/{id}/status`
**PUT** `/admin/cases/{id}/assign`
**POST** `/admin/cases/{id}/notes`

### 11.4 Document Review
**GET** `/admin/documents`
- **Query Parameters**:
  - `status`: pending|approved|rejected
  - `reviewedBy`: uuid
  - `uploadedFrom`, `uploadedTo`

**PUT** `/admin/documents/{id}/review`
- **Request Body**:
```json
{
  "action": "approve|reject|request-clarification",
  "notes": "string",
  "issues": ["illegible", "incomplete", "wrong-document", "expired"]
}
```

### 11.5 Analytics Dashboard
**GET** `/admin/analytics/dashboard`
- **Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1247,
      "activeUsers": 892,
      "newUsersToday": 89,
      "activeCases": 567,
      "completedCases": 234,
      "totalRevenue": 125600,
      "monthlyRecurringRevenue": 45000
    },
    "userMetrics": {
      "signupTrend": [{"date": "ISO8601", "count": 15}],
      "conversionRate": 0.65,
      "averageTimeToConversion": "2.5 days"
    },
    "caseMetrics": {
      "byProgram": {
        "offerInCompromise": 234,
        "installmentAgreement": 156,
        "currentlyNotCollectible": 89,
        "penaltyAbatement": 67,
        "innocentSpouse": 21
      },
      "averageResolutionTime": "4.2 months",
      "successRate": 0.78
    },
    "financialMetrics": {
      "totalTaxDebtManaged": 15670000,
      "totalSavingsGenerated": 9800000,
      "averageFeePerCase": 3200
    }
  }
}
```

### 11.6 Communications Management
**GET** `/admin/communications`
**POST** `/admin/communications/broadcast`
**POST** `/admin/communications/templates`

---

## 12. Webhooks

### 12.1 Stripe Webhooks
**POST** `/webhooks/stripe`
- **Headers**: `Stripe-Signature: string`
- **Events**: payment_intent.succeeded, payment_intent.failed, subscription.created, subscription.updated, subscription.deleted

### 12.2 Document Processing Webhooks
**POST** `/webhooks/documents`
- **Events**: document.processed, document.ocr_complete, document.validation_failed

---

## Error Codes and Handling

### Standard HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created
- `204 No Content`: Successful delete
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Application Error Codes
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Token invalid
- `USER_001`: User not found
- `USER_002`: Email already exists
- `CASE_001`: Case not found
- `CASE_002`: Invalid case status transition
- `DOC_001`: Document upload failed
- `DOC_002`: Invalid document type
- `PAY_001`: Payment failed
- `PAY_002`: Invalid payment method

---

## Security Requirements

1. **HTTPS Only**: All production APIs must use TLS 1.2+
2. **Authentication**: JWT with RS256 algorithm
3. **Rate Limiting**:
   - Public endpoints: 100 req/hour per IP
   - Authenticated: 1000 req/hour per user
   - Admin: 5000 req/hour per admin
4. **Input Validation**: All inputs must be validated and sanitized
5. **SQL Injection Prevention**: Use parameterized queries
6. **XSS Prevention**: Escape all output
7. **CORS**: Whitelist allowed origins
8. **File Upload Security**:
   - Max size: 10MB
   - Allowed types: PDF, JPG, PNG, DOC, DOCX
   - Virus scanning required
   - Store in secure S3 bucket
9. **PII Encryption**: SSN, bank accounts must be encrypted at rest
10. **Audit Logging**: Log all data access and modifications

---

## Implementation Notes

1. **API Versioning**: Use URL versioning (/v1/)
2. **Pagination**: Use offset-based pagination with page/limit
3. **Sorting**: Support sort parameter with format "field:asc|desc"
4. **Filtering**: Support multiple filters as query parameters
5. **Partial Updates**: PATCH endpoints should accept partial objects
6. **Idempotency**: POST requests should support idempotency keys
7. **Webhooks**: Implement retry logic with exponential backoff
8. **Caching**: 
   - Cache GET responses with ETags
   - User profiles: 5 minutes
   - Static data: 1 hour
9. **Background Jobs**:
   - Document processing
   - Email notifications
   - IRS form generation
   - Payment processing
10. **Monitoring**: Log response times, error rates, and usage metrics

---

This specification covers all API endpoints required by the OwlTax frontend application. Each endpoint is designed to support the specific UI/UX requirements while maintaining security, performance, and scalability best practices.