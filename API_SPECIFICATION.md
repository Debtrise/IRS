# OwlTax API Specification

## Base URL
```
Production: https://api.taxreliefpro.com/v1
Development: http://localhost:8000/v1
```

## Authentication
All API requests require authentication via JWT tokens in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All responses follow this structure:
```json
{
  "success": boolean,
  "data": object|array|null,
  "message": string,
  "errors": array|null,
  "meta": {
    "timestamp": "ISO8601",
    "version": "1.0",
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    }
  }
}
```

---

## 1. Authentication Endpoints

### POST /auth/register
**Purpose**: User registration (3-step signup flow)

**Request Body**:
```json
{
  "firstName": "string", // required
  "lastName": "string", // required
  "email": "string", // required, valid email
  "phone": "string", // required
  "taxDebt": "string", // required, debt range
  "taxYears": "string", // required
  "hasNotices": boolean, // required
  "password": "string", // required, min 8 chars
  "agreeToTerms": boolean, // required, must be true
  "agreeToPrivacy": boolean // required, must be true
}
```

**Response**:
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
      "createdAt": "ISO8601"
    },
    "tokens": {
      "accessToken": "jwt_string",
      "refreshToken": "jwt_string",
      "expiresIn": 3600
    }
  }
}
```

### POST /auth/login
**Purpose**: User authentication

**Request Body**:
```json
{
  "email": "string", // required
  "password": "string", // required
  "rememberMe": boolean // optional
}
```

### POST /auth/forgot-password
**Purpose**: Password reset request

**Request Body**:
```json
{
  "email": "string" // required
}
```

### POST /auth/reset-password
**Purpose**: Password reset with token

**Request Body**:
```json
{
  "token": "string", // required, reset token
  "password": "string", // required, min 8 chars
  "confirmPassword": "string" // required, must match password
}
```

### POST /auth/refresh
**Purpose**: Refresh access token

**Request Body**:
```json
{
  "refreshToken": "string" // required
}
```

### POST /auth/logout
**Purpose**: User logout (invalidate tokens)

---

## 2. User Management Endpoints

### GET /users/profile
**Purpose**: Get current user profile

**Response**:
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
    "taxDebt": "string",
    "taxYears": "string",
    "hasNotices": boolean,
    "createdAt": "ISO8601",
    "lastLoginAt": "ISO8601",
    "cases": {
      "total": number,
      "active": number,
      "completed": number
    }
  }
}
```

### PUT /users/profile
**Purpose**: Update user profile

**Request Body**:
```json
{
  "firstName": "string", // optional
  "lastName": "string", // optional
  "phone": "string", // optional
  "taxDebt": "string", // optional
  "taxYears": "string" // optional
}
```

### PUT /users/password
**Purpose**: Change password

**Request Body**:
```json
{
  "currentPassword": "string", // required
  "newPassword": "string", // required, min 8 chars
  "confirmPassword": "string" // required, must match newPassword
}
```

---

## 3. Assessment Endpoints

### POST /assessments
**Purpose**: Submit tax assessment questionnaire

**Request Body**:
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
    "otherAssets": number
  },
  "taxInfo": {
    "totalDebt": "string", // debt range
    "taxYears": "string",
    "hasUnfiledReturns": boolean,
    "currentWithFilings": boolean,
    "hasNotices": boolean,
    "noticeTypes": ["string"],
    "hasLiens": boolean,
    "hasLevies": boolean
  },
  "circumstances": {
    "emergencyStatus": "no-emergency|medical|job-loss|disability|divorce|other",
    "specialCircumstances": ["medical", "disability", "unemployment", "divorce", "firstTime", "levy", "lien", "business", "covid", "retirement"]
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "assessmentId": "uuid",
    "eligibility": {
      "installmentAgreement": {
        "eligible": boolean,
        "confidence": number, // 0-100
        "estimatedMonthlyPayment": number,
        "timeline": "string"
      },
      "offerInCompromise": {
        "eligible": boolean,
        "confidence": number,
        "estimatedOffer": number,
        "timeline": "string"
      },
      "currentlyNotCollectible": {
        "eligible": boolean,
        "confidence": number,
        "timeline": "string"
      },
      "penaltyAbatement": {
        "eligible": boolean,
        "confidence": number,
        "estimatedSavings": number,
        "timeline": "string"
      },
      "innocentSpouse": {
        "eligible": boolean,
        "confidence": number,
        "timeline": "string"
      }
    },
    "recommendations": {
      "primary": "string", // program name
      "alternatives": ["string"],
      "reasoning": "string"
    },
    "estimatedSavings": number,
    "ourFee": number, // 10% of total debt
    "netSavings": number
  }
}
```

### GET /assessments/{id}
**Purpose**: Get assessment results

---

## 4. Case Management Endpoints

### GET /cases
**Purpose**: Get user's cases

**Query Parameters**:
```
status: string (optional) - filter by status
program: string (optional) - filter by program
page: number (optional) - pagination
limit: number (optional) - items per page
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "caseNumber": "CASE-001",
      "program": "offer-in-compromise",
      "status": "new|in-review|approved|pending-docs|irs-submitted|completed|rejected",
      "priority": "low|medium|high|urgent",
      "taxDebt": number,
      "estimatedSavings": number,
      "progress": number, // 0-100
      "assignedSpecialist": {
        "name": "string",
        "email": "string",
        "phone": "string"
      },
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601",
      "timeline": {
        "estimatedCompletion": "ISO8601",
        "milestones": [
          {
            "name": "string",
            "status": "pending|in-progress|completed",
            "completedAt": "ISO8601"
          }
        ]
      }
    }
  ]
}
```

### POST /cases
**Purpose**: Create new case

**Request Body**:
```json
{
  "program": "installment-agreement|offer-in-compromise|currently-not-collectible|penalty-abatement|innocent-spouse",
  "assessmentId": "uuid", // optional, link to assessment
  "formData": "object" // program-specific form data
}
```

### GET /cases/{id}
**Purpose**: Get specific case details

### PUT /cases/{id}
**Purpose**: Update case information

### GET /cases/{id}/timeline
**Purpose**: Get case timeline and milestones

---

## 5. Document Management Endpoints

### GET /documents
**Purpose**: Get user's documents

**Query Parameters**:
```
caseId: uuid (optional) - filter by case
type: string (optional) - filter by document type
status: string (optional) - filter by status
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "type": "w2|1099|bank-statement|tax-return|irs-notice|other",
      "filename": "string",
      "size": number,
      "mimeType": "string",
      "status": "pending|approved|rejected|needs-review",
      "caseId": "uuid",
      "uploadedAt": "ISO8601",
      "reviewedAt": "ISO8601",
      "reviewedBy": "string",
      "notes": "string",
      "downloadUrl": "string" // signed URL
    }
  ]
}
```

### POST /documents/upload
**Purpose**: Upload document

**Request Body** (multipart/form-data):
```
file: File (required)
title: string (required)
type: string (required)
caseId: uuid (optional)
description: string (optional)
```

### GET /documents/{id}/download
**Purpose**: Download document (returns signed URL)

### DELETE /documents/{id}
**Purpose**: Delete document

---

## 6. Payment Endpoints

### GET /payments/methods
**Purpose**: Get user's payment methods

### POST /payments/methods
**Purpose**: Add payment method

**Request Body**:
```json
{
  "type": "card|bank",
  "card": {
    "token": "string", // Stripe token
    "last4": "string",
    "brand": "string",
    "expiryMonth": number,
    "expiryYear": number
  },
  "bank": {
    "accountType": "checking|savings",
    "routingNumber": "string",
    "accountNumber": "string", // encrypted
    "bankName": "string"
  },
  "isDefault": boolean
}
```

### GET /payments/invoices
**Purpose**: Get payment history and invoices

### POST /payments/process
**Purpose**: Process payment

**Request Body**:
```json
{
  "amount": number,
  "paymentMethodId": "uuid",
  "caseId": "uuid",
  "description": "string"
}
```

---

## 7. Communications Endpoints

### GET /communications/messages
**Purpose**: Get messages/notifications

### POST /communications/messages
**Purpose**: Send message to admin

**Request Body**:
```json
{
  "subject": "string",
  "message": "string",
  "caseId": "uuid", // optional
  "priority": "low|normal|high"
}
```

### GET /communications/notifications
**Purpose**: Get system notifications

### PUT /communications/notifications/{id}/read
**Purpose**: Mark notification as read

---

## 8. IRS Notices Endpoints

### GET /notices
**Purpose**: Get IRS notices

### POST /notices
**Purpose**: Upload IRS notice

**Request Body**:
```json
{
  "noticeType": "CP14|CP501|CP503|CP504|other",
  "noticeDate": "ISO8601",
  "amount": number,
  "description": "string",
  "documentId": "uuid" // uploaded document
}
```

---

## 9. Program-Specific Endpoints

### POST /programs/installment-agreement
**Purpose**: Submit IA application

**Request Body**:
```json
{
  "agreementType": "guaranteed|streamlined|non-streamlined",
  "monthlyPayment": number,
  "paymentDate": number, // day of month
  "bankAccount": {
    "accountType": "checking|savings",
    "routingNumber": "string",
    "accountNumber": "string",
    "bankName": "string"
  },
  "financialInfo": {
    "monthlyIncome": number,
    "monthlyExpenses": number,
    "assets": number
  }
}
```

### POST /programs/offer-in-compromise
**Purpose**: Submit OIC application

**Request Body**:
```json
{
  "offerType": "doubt-collectibility|doubt-liability|effective-tax-administration",
  "offerAmount": number,
  "paymentOption": "lump-sum|periodic",
  "periodicPayments": {
    "amount": number,
    "frequency": "monthly|quarterly"
  },
  "financialInfo": {
    "monthlyIncome": number,
    "monthlyExpenses": {
      "housing": number,
      "utilities": number,
      "food": number,
      "transportation": number,
      "healthcare": number,
      "insurance": number,
      "taxes": number,
      "other": number
    },
    "assets": {
      "realEstate": [
        {
          "description": "string",
          "value": number,
          "loan": number,
          "equity": number
        }
      ],
      "vehicles": [
        {
          "description": "string",
          "value": number,
          "loan": number,
          "equity": number
        }
      ],
      "bankAccounts": number,
      "investments": number,
      "retirement": number,
      "lifeInsurance": number,
      "otherAssets": number
    }
  }
}
```

### POST /programs/currently-not-collectible
**Purpose**: Submit CNC application

**Request Body**:
```json
{
  "hardshipType": "unemployment|medical|fixed-income|other",
  "monthlyIncome": number,
  "monthlyExpenses": number,
  "employmentStatus": "unemployed|disabled|retired|student",
  "dependents": number,
  "healthIssues": boolean,
  "supportingDocuments": ["uuid"] // document IDs
}
```

### POST /programs/penalty-abatement
**Purpose**: Submit penalty abatement request

**Request Body**:
```json
{
  "penaltyType": "first-time|reasonable-cause",
  "taxYear": number,
  "penaltyAmount": number,
  "reasonCategory": "death|illness|disaster|inability|ignorance|reliance",
  "explanation": "string",
  "priorCompliance": boolean,
  "circumstances": "string"
}
```

### POST /programs/innocent-spouse
**Purpose**: Submit innocent spouse relief

**Request Body**:
```json
{
  "reliefType": "traditional|separation|equitable",
  "taxYears": [number],
  "spouseInfo": {
    "name": "string",
    "ssn": "string", // encrypted
    "currentAddress": "object"
  },
  "marriageInfo": {
    "marriageDate": "ISO8601",
    "divorceDate": "ISO8601", // optional
    "separated": boolean,
    "separationDate": "ISO8601" // optional
  },
  "circumstances": "string",
  "knowledgeOfError": boolean,
  "benefit": number
}
```

---

## 10. Admin Endpoints

### Authentication
```
POST /admin/auth/login
POST /admin/auth/logout
```

### User Management
```
GET /admin/users
GET /admin/users/{id}
PUT /admin/users/{id}
PUT /admin/users/{id}/status
```

### Case Management
```
GET /admin/cases
GET /admin/cases/{id}
PUT /admin/cases/{id}
PUT /admin/cases/{id}/status
PUT /admin/cases/{id}/assign
POST /admin/cases/{id}/notes
```

### Document Management
```
GET /admin/documents
PUT /admin/documents/{id}/review
```

### Analytics
```
GET /admin/analytics/dashboard
GET /admin/analytics/users
GET /admin/analytics/cases
GET /admin/analytics/revenue
```

---

## 11. Webhook Endpoints (for external integrations)

### POST /webhooks/stripe
**Purpose**: Handle Stripe payment webhooks

### POST /webhooks/irs
**Purpose**: Handle IRS system updates (future)

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation errors |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limiting
- Public endpoints: 100 requests/hour per IP
- Authenticated endpoints: 1000 requests/hour per user
- Admin endpoints: 5000 requests/hour per admin
- File uploads: 10 uploads/hour per user

## File Upload Limits
- Maximum file size: 10MB
- Allowed types: PDF, JPG, PNG, DOC, DOCX
- Maximum files per case: 50