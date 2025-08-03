# Critical API Endpoints for OwlTax Frontend

## Priority 1: Core Authentication & User Flow (Must Have)

### Authentication
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/auth/register` | POST | User sign-up | firstName, lastName, email, phone, taxDebt, taxYears, hasNotices, password, agreeToTerms, agreeToPrivacy |
| `/auth/login` | POST | User login | email, password, rememberMe? |
| `/auth/logout` | POST | User logout | - |
| `/auth/refresh` | POST | Refresh token | refreshToken |
| `/auth/forgot-password` | POST | Password reset request | email |
| `/auth/reset-password` | POST | Password reset | token, password, confirmPassword |

### User Profile
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/users/profile` | GET | Get user info | - |
| `/users/profile` | PUT | Update profile | firstName?, lastName?, phone?, taxDebt?, taxYears? |

## Priority 2: Assessment & Case Creation (Core Business Logic)

### Assessment Flow
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/assessments` | POST | Submit assessment | personalInfo{filingStatus, dependents, age, state}, financialInfo{monthlyGrossIncome, monthlyNetIncome, employmentStatus, homeOwnership}, taxInfo{totalDebt, taxYears, hasUnfiledReturns, hasNotices}, circumstances{emergencyStatus, specialCircumstances} |
| `/assessments/{id}` | GET | Get results | - |

### Case Management
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/cases` | GET | Get user cases | status?, program?, page?, limit? |
| `/cases` | POST | Create new case | program, assessmentId?, formData |
| `/cases/{id}` | GET | Get case details | - |
| `/cases/{id}` | PUT | Update case | (varies by update type) |

## Priority 3: Program Applications (Revenue Generation)

### Installment Agreement
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/programs/installment-agreement` | POST | Submit IA app | agreementType, monthlyPayment, paymentDate, bankAccount{accountType, routingNumber, accountNumber, bankName}, financialInfo{monthlyIncome, monthlyExpenses, assets} |

### Offer in Compromise
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/programs/offer-in-compromise` | POST | Submit OIC app | offerType, offerAmount, paymentOption, periodicPayments?, financialInfo{monthlyIncome, monthlyExpenses{housing, utilities, food, transportation, healthcare, insurance, taxes, other}, assets{realEstate[], vehicles[], bankAccounts, investments, retirement, lifeInsurance, otherAssets}} |

### Currently Not Collectible
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/programs/currently-not-collectible` | POST | Submit CNC app | hardshipType, monthlyIncome, monthlyExpenses, employmentStatus, dependents, healthIssues, supportingDocuments[] |

### Penalty Abatement
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/programs/penalty-abatement` | POST | Submit PA request | penaltyType, taxYear, penaltyAmount, reasonCategory, explanation, priorCompliance, circumstances |

### Innocent Spouse Relief
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/programs/innocent-spouse` | POST | Submit ISR app | reliefType, taxYears[], spouseInfo{name, ssn, currentAddress}, marriageInfo{marriageDate, divorceDate?, separated, separationDate?}, circumstances, knowledgeOfError, benefit |

## Priority 4: Document Management (Critical for Compliance)

### Document Operations
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/documents` | GET | Get user docs | caseId?, type?, status? |
| `/documents/upload` | POST | Upload document | file, title, type, caseId?, description? |
| `/documents/{id}/download` | GET | Download doc | - |
| `/documents/{id}` | DELETE | Delete document | - |

## Priority 5: Admin CRM (Business Operations)

### Admin Authentication
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/admin/auth/login` | POST | Admin login | email, password |
| `/admin/auth/logout` | POST | Admin logout | - |

### User Management
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/admin/users` | GET | Get all users | search?, status?, page?, limit? |
| `/admin/users/{id}` | GET | Get user details | - |
| `/admin/users/{id}/status` | PUT | Update user status | status |

### Case Management
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/admin/cases` | GET | Get all cases | search?, status?, program?, page?, limit? |
| `/admin/cases/{id}` | GET | Get case details | - |
| `/admin/cases/{id}/status` | PUT | Update case status | status, notes? |
| `/admin/cases/{id}/assign` | PUT | Assign specialist | specialistId |

### Document Review
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/admin/documents` | GET | Get pending docs | search?, status?, type?, page?, limit? |
| `/admin/documents/{id}/review` | PUT | Approve/reject doc | action (approve/reject), notes? |

### Analytics
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/admin/analytics/dashboard` | GET | Dashboard metrics | - |

## Priority 6: Payment Processing (Revenue Critical)

### Payment Methods
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/payments/methods` | GET | Get payment methods | - |
| `/payments/methods` | POST | Add payment method | type, card?{token, last4, brand, expiryMonth, expiryYear}, bank?{accountType, routingNumber, accountNumber, bankName}, isDefault |
| `/payments/process` | POST | Process payment | amount, paymentMethodId, caseId, description |
| `/payments/invoices` | GET | Get payment history | - |

## Priority 7: Communications (User Experience)

### Messaging
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/communications/messages` | GET | Get messages | - |
| `/communications/messages` | POST | Send message | subject, message, caseId?, priority |
| `/communications/notifications` | GET | Get notifications | - |
| `/communications/notifications/{id}/read` | PUT | Mark as read | - |

## Priority 8: IRS Notices (Compliance)

### Notice Management
| Endpoint | Method | Purpose | Required Fields |
|----------|---------|---------|-----------------|
| `/notices` | GET | Get IRS notices | - |
| `/notices` | POST | Upload notice | noticeType, noticeDate, amount, description, documentId |

## Data Flow Summary

### User Journey API Calls:
1. **Sign-up**: `POST /auth/register` → `GET /users/profile`
2. **Assessment**: `POST /assessments` → `GET /assessments/{id}` 
3. **Program Application**: `POST /programs/{program-type}` → `POST /cases`
4. **Document Upload**: `POST /documents/upload` (multiple times)
5. **Case Tracking**: `GET /cases` → `GET /cases/{id}`
6. **Payment**: `POST /payments/methods` → `POST /payments/process`

### Admin Journey API Calls:
1. **Admin Login**: `POST /admin/auth/login`
2. **Dashboard**: `GET /admin/analytics/dashboard`
3. **User Review**: `GET /admin/users` → `GET /admin/users/{id}`
4. **Case Management**: `GET /admin/cases` → `PUT /admin/cases/{id}/status`
5. **Document Review**: `GET /admin/documents` → `PUT /admin/documents/{id}/review`

## Required Response Data Structures

### User Object
```json
{
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
  "lastLoginAt": "ISO8601"
}
```

### Case Object
```json
{
  "id": "uuid",
  "caseNumber": "string",
  "program": "string",
  "status": "string",
  "priority": "string",
  "taxDebt": number,
  "estimatedSavings": number,
  "progress": number,
  "assignedSpecialist": object,
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Assessment Results Object
```json
{
  "assessmentId": "uuid",
  "eligibility": {
    "installmentAgreement": {
      "eligible": boolean,
      "confidence": number,
      "estimatedMonthlyPayment": number,
      "timeline": "string"
    },
    "offerInCompromise": {
      "eligible": boolean,
      "confidence": number,
      "estimatedOffer": number,
      "timeline": "string"
    }
    // ... other programs
  },
  "recommendations": {
    "primary": "string",
    "alternatives": ["string"],
    "reasoning": "string"
  },
  "estimatedSavings": number,
  "ourFee": number,
  "netSavings": number
}
```

## Implementation Priority Order

1. **Week 1**: Authentication endpoints (Priority 1)
2. **Week 2**: Assessment and basic case creation (Priority 2)
3. **Week 3**: Program applications (Priority 3)
4. **Week 4**: Document management (Priority 4)
5. **Week 5**: Admin CRM (Priority 5)
6. **Week 6**: Payment processing (Priority 6)
7. **Week 7**: Communications (Priority 7)
8. **Week 8**: IRS notices and polish (Priority 8)