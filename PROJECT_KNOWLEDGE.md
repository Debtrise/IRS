# IRS Tax Debt Relief SaaS - Project Knowledge Document

## Project Overview

The IRS Tax Debt Relief SaaS is a comprehensive web application designed to help individuals navigate IRS tax debt relief programs. The application guides users through an assessment process to determine their eligibility for various tax relief programs and assists them in preparing the necessary documentation.

## Key Business Objectives

1. **Simplify Tax Relief Navigation**: Guide users through complex IRS programs with clear, step-by-step processes
2. **Automated Eligibility Assessment**: Analyze user situations to recommend appropriate relief programs
3. **Document Management**: Help users collect, organize, and prepare required documentation
4. **Form Generation**: Automatically fill IRS forms based on user data
5. **Case Management**: Track applications through the entire process

## Core Tax Relief Programs

### 1. Installment Agreements
- **Guaranteed**: For debts ≤ $10,000, automatic approval
- **Streamlined**: For individuals ≤ $50,000, businesses ≤ $25,000
- **Non-Streamlined**: For larger amounts, requires full financial disclosure

### 2. Offer in Compromise (OIC)
- **Doubt as to Collectibility**: When assets + income < tax liability
- **Doubt as to Liability**: Legitimate dispute about assessment
- **Effective Tax Administration**: Can pay but would create hardship

### 3. Currently Not Collectible (CNC)
- For taxpayers with income below necessary living expenses
- Temporary suspension of collection activities
- Automatic for certain situations (Social Security only income, below poverty level)

### 4. Penalty Abatement
- **First-Time Abatement**: No penalties in prior 3 years
- **Reasonable Cause**: Death, illness, disaster, or other qualifying circumstances

### 5. Innocent Spouse Relief
- Relief from spouse's tax liability
- Three types: Traditional, Separation of Liability, Equitable

### 6. Bankruptcy
- Chapter 7 or 13 considerations
- Must meet specific timing requirements

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Context API** for state management

### Backend Architecture (Per Documentation)
- **Node.js** with Express
- **Google Cloud Platform** infrastructure
- **PostgreSQL** (Cloud SQL) for primary database
- **Redis** for caching and sessions
- **Google Cloud Storage** for documents

### Key Services Architecture
1. **Authentication Service**: JWT, OAuth2, 2FA
2. **Document Processing**: OCR, classification, virus scanning
3. **Eligibility Engine**: Rules-based qualification analysis
4. **Form Generation**: PDF creation and filling
5. **Case Management**: Workflow orchestration
6. **Communication Service**: Email, SMS, notifications

## Current Frontend Implementation

### Onboarding Flow Structure
The application uses a multi-step onboarding process:

1. **Welcome Step**: Introduction and getting started
2. **Emergency Step**: Check for immediate IRS actions
3. **Returns Step**: Verify tax return filing status
4. **Debt Step**: Categorize debt amount (under $10k, $10-50k, over $50k)
5. **Financial Step**: Assess financial situation (hardship, tight, stable)
6. **Circumstances Step**: Identify special situations (penalties, spouse issues, etc.)
7. **Results**: Display recommended programs based on assessment

### State Management
- Uses React Context API (`OnboardingContext`)
- Tracks user selections through the flow
- Maintains form state and step progression

### Component Architecture
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── onboarding/      # Onboarding flow components
│       ├── Onboarding.tsx         # Main orchestrator
│       ├── StepCard.tsx           # Step wrapper component
│       ├── Results.tsx            # Results display
│       └── steps/                 # Individual step components
├── context/             # State management
├── theme/              # Design tokens
└── types/              # TypeScript definitions
```

## Key User Flows

### 1. Initial Assessment Flow
- User answers 6 key questions about their tax situation
- System analyzes responses against program eligibility rules
- Presents ranked list of qualified programs

### 2. Document Collection Flow
- System identifies required documents for selected program
- Provides checklist with helpful documents
- Enables secure upload and organization

### 3. Form Preparation Flow
- Auto-fills IRS forms based on collected data
- Generates supporting documentation
- Creates submission package

### 4. Case Management Flow
- Tracks application status
- Manages deadlines and follow-ups
- Handles IRS correspondence

## Business Rules & Logic

### Universal Requirements
- All tax returns must be filed
- Must be current on estimated payments
- No criminal tax investigations
- Must provide accurate information

### Program-Specific Logic
Each program has specific qualifiers and disqualifiers that the eligibility engine evaluates:
- Financial thresholds
- Timing requirements
- Documentation needs
- Special circumstances

## Security Considerations

1. **Data Protection**
   - AES-256 encryption at rest
   - TLS 1.3 in transit
   - PII tokenization
   - Secure document storage

2. **Compliance Requirements**
   - IRS Safeguards Program
   - SOC 2 Type II
   - PCI DSS for payments
   - State privacy laws

3. **Access Control**
   - Role-based permissions
   - Multi-factor authentication
   - Audit logging
   - Session management

## Development Priorities

### Phase 1: Core Assessment (Current Focus)
- Complete onboarding flow
- Basic eligibility determination
- Results presentation
- User account creation

### Phase 2: Document Management
- Secure upload functionality
- Document checklist generation
- OCR integration
- Document organization

### Phase 3: Form Generation
- IRS form templates
- Auto-fill functionality
- PDF generation
- E-signature integration

### Phase 4: Case Management
- Application tracking
- Deadline management
- Status updates
- Communication center

## UI/UX Principles

1. **Clarity**: Complex tax concepts explained simply
2. **Progressive Disclosure**: Information revealed as needed
3. **Trust Building**: Professional design with security indicators
4. **Mobile-First**: Responsive design for all devices
5. **Accessibility**: WCAG 2.1 AA compliance

## Integration Points

### External Services
- IRS e-services API (when available)
- Payment processors (Stripe/Plaid)
- Document services (DocuSign)
- Communication (SendGrid/Twilio)
- Analytics (Segment/Mixpanel)

### Internal APIs
- `/api/auth` - Authentication endpoints
- `/api/eligibility` - Assessment engine
- `/api/documents` - Document management
- `/api/forms` - Form generation
- `/api/cases` - Case tracking

## Performance Targets

- Page load: < 3 seconds
- API response: < 500ms
- Document upload: Handle up to 50MB
- Concurrent users: Support 10,000+
- Uptime: 99.9% availability

## Next Steps for Development

1. **Enhance Current Onboarding**
   - Add form validation
   - Improve error handling
   - Add progress persistence
   - Implement analytics tracking

2. **Build User Dashboard**
   - Case overview
   - Document status
   - Action items
   - Deadline tracking

3. **Implement Authentication**
   - User registration
   - Login/logout
   - Password reset
   - Session management

4. **Create API Integration**
   - Connect frontend to backend services
   - Implement data persistence
   - Add real-time updates

This document serves as the central reference for understanding the project's business logic, technical architecture, and development roadmap. It should be updated as the project evolves.