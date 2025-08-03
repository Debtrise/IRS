# Frontend API Integration Guide

## Overview
This document outlines how the OwlTax frontend should integrate with the backend API, including specific implementation details for each component.

## API Client Setup

### Base Configuration
```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          const { accessToken } = response.data.data.tokens;
          localStorage.setItem('authToken', accessToken);
          // Retry original request
          return apiClient.request(error.config);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

## Component-Specific Integrations

### 1. Sign-Up Flow (`/signup`)

**Step 1 & 2**: Collect data locally, validate on frontend
**Step 3**: Submit complete registration

```typescript
// src/services/authService.ts
export const registerUser = async (formData: SignUpFormData) => {
  const response = await apiClient.post('/auth/register', {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    taxDebt: formData.taxDebt,
    taxYears: formData.taxYears,
    hasNotices: formData.hasNotices,
    password: formData.password,
    agreeToTerms: formData.agreeToTerms,
    agreeToPrivacy: formData.agreeToPrivacy
  });
  
  const { user, tokens } = response.data.data;
  localStorage.setItem('authToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
  localStorage.setItem('user', JSON.stringify(user));
  
  return user;
};
```

### 2. Login (`/login`)

```typescript
export const loginUser = async (email: string, password: string, rememberMe: boolean) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
    rememberMe
  });
  
  const { user, tokens } = response.data.data;
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('authToken', tokens.accessToken);
  storage.setItem('refreshToken', tokens.refreshToken);
  storage.setItem('user', JSON.stringify(user));
  
  return user;
};
```

### 3. Assessment Flow (`/assessment-v2`)

```typescript
// src/services/assessmentService.ts
export const submitAssessment = async (assessmentData: AssessmentFormData) => {
  const response = await apiClient.post('/assessments', {
    personalInfo: {
      filingStatus: assessmentData.filingStatus,
      dependents: parseInt(assessmentData.dependents),
      age: parseInt(assessmentData.age),
      state: assessmentData.state
    },
    financialInfo: {
      monthlyGrossIncome: parseFloat(assessmentData.monthlyGrossIncome),
      monthlyNetIncome: parseFloat(assessmentData.monthlyNetIncome),
      employmentStatus: assessmentData.employmentStatus,
      homeOwnership: assessmentData.homeOwnership,
      homeEquity: parseFloat(assessmentData.homeEquity || '0'),
      vehicles: parseInt(assessmentData.vehicles || '0'),
      bankBalance: parseFloat(assessmentData.bankBalance || '0'),
      investments: parseFloat(assessmentData.investments || '0'),
      otherAssets: parseFloat(assessmentData.otherAssets || '0')
    },
    taxInfo: {
      totalDebt: assessmentData.totalDebt,
      taxYears: assessmentData.taxYears,
      hasUnfiledReturns: assessmentData.hasUnfiledReturns,
      currentWithFilings: assessmentData.currentWithFilings,
      hasNotices: assessmentData.hasNotices,
      noticeTypes: assessmentData.noticeTypes || [],
      hasLiens: assessmentData.hasLiens,
      hasLevies: assessmentData.hasLevies
    },
    circumstances: {
      emergencyStatus: assessmentData.emergencyStatus,
      specialCircumstances: assessmentData.specialCircumstances || []
    }
  });
  
  return response.data.data;
};

export const getAssessmentResults = async (assessmentId: string) => {
  const response = await apiClient.get(`/assessments/${assessmentId}`);
  return response.data.data;
};
```

### 4. Dashboard Components

#### User Profile
```typescript
// src/services/userService.ts
export const getUserProfile = async () => {
  const response = await apiClient.get('/users/profile');
  return response.data.data;
};

export const updateUserProfile = async (profileData: Partial<UserProfile>) => {
  const response = await apiClient.put('/users/profile', profileData);
  return response.data.data;
};
```

#### Cases
```typescript
// src/services/caseService.ts
export const getUserCases = async (filters?: {
  status?: string;
  program?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await apiClient.get('/cases', { params: filters });
  return response.data;
};

export const getCaseDetails = async (caseId: string) => {
  const response = await apiClient.get(`/cases/${caseId}`);
  return response.data.data;
};

export const createCase = async (caseData: CreateCaseData) => {
  const response = await apiClient.post('/cases', caseData);
  return response.data.data;
};
```

#### Documents
```typescript
// src/services/documentService.ts
export const uploadDocument = async (file: File, metadata: {
  title: string;
  type: string;
  caseId?: string;
  description?: string;
}) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', metadata.title);
  formData.append('type', metadata.type);
  if (metadata.caseId) formData.append('caseId', metadata.caseId);
  if (metadata.description) formData.append('description', metadata.description);

  const response = await apiClient.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 1)
      );
      // Update upload progress UI
    }
  });
  
  return response.data.data;
};

export const getUserDocuments = async (filters?: {
  caseId?: string;
  type?: string;
  status?: string;
}) => {
  const response = await apiClient.get('/documents', { params: filters });
  return response.data.data;
};

export const downloadDocument = async (documentId: string) => {
  const response = await apiClient.get(`/documents/${documentId}/download`);
  // Response will contain signed URL
  window.open(response.data.data.downloadUrl, '_blank');
};
```

### 5. Program-Specific Forms

#### Installment Agreement
```typescript
// src/services/programService.ts
export const submitInstallmentAgreement = async (formData: IAFormData) => {
  const response = await apiClient.post('/programs/installment-agreement', {
    agreementType: formData.agreementType,
    monthlyPayment: parseFloat(formData.monthlyPayment),
    paymentDate: parseInt(formData.paymentDate),
    bankAccount: {
      accountType: formData.bankAccount?.accountType,
      routingNumber: formData.bankAccount?.routingNumber,
      accountNumber: formData.bankAccount?.accountNumber, // Should be encrypted
      bankName: formData.bankAccount?.bankName
    },
    financialInfo: {
      monthlyIncome: parseFloat(formData.monthlyIncome || '0'),
      monthlyExpenses: parseFloat(formData.monthlyExpenses || '0'),
      assets: parseFloat(formData.assets || '0')
    }
  });
  
  return response.data.data;
};
```

#### Offer in Compromise
```typescript
export const submitOfferInCompromise = async (formData: OICFormData) => {
  const response = await apiClient.post('/programs/offer-in-compromise', {
    offerType: formData.offerType,
    offerAmount: parseFloat(formData.offerAmount),
    paymentOption: formData.paymentOption,
    periodicPayments: formData.paymentOption === 'periodic' ? {
      amount: parseFloat(formData.periodicPayments?.amount || '0'),
      frequency: formData.periodicPayments?.frequency
    } : undefined,
    financialInfo: {
      monthlyIncome: parseFloat(formData.monthlyIncome || '0'),
      monthlyExpenses: {
        housing: parseFloat(formData.expenses?.housing || '0'),
        utilities: parseFloat(formData.expenses?.utilities || '0'),
        food: parseFloat(formData.expenses?.food || '0'),
        transportation: parseFloat(formData.expenses?.transportation || '0'),
        healthcare: parseFloat(formData.expenses?.healthcare || '0'),
        insurance: parseFloat(formData.expenses?.insurance || '0'),
        taxes: parseFloat(formData.expenses?.taxes || '0'),
        other: parseFloat(formData.expenses?.other || '0')
      },
      assets: {
        realEstate: formData.realEstate?.map(re => ({
          description: re.description,
          value: parseFloat(re.value),
          loan: parseFloat(re.loan || '0'),
          equity: parseFloat(re.equity || '0')
        })) || [],
        vehicles: formData.vehicles?.map(v => ({
          description: v.description,
          value: parseFloat(v.value),
          loan: parseFloat(v.loan || '0'),
          equity: parseFloat(v.equity || '0')
        })) || [],
        bankAccounts: parseFloat(formData.bankAccounts || '0'),
        investments: parseFloat(formData.investments || '0'),
        retirement: parseFloat(formData.retirement || '0'),
        lifeInsurance: parseFloat(formData.lifeInsurance || '0'),
        otherAssets: parseFloat(formData.otherAssets || '0')
      }
    }
  });
  
  return response.data.data;
};
```

### 6. Admin Components

#### Admin Authentication
```typescript
// src/services/adminService.ts
export const adminLogin = async (email: string, password: string) => {
  const response = await apiClient.post('/admin/auth/login', {
    email,
    password
  });
  
  const { admin, tokens } = response.data.data;
  localStorage.setItem('adminToken', tokens.accessToken);
  localStorage.setItem('adminRefreshToken', tokens.refreshToken);
  localStorage.setItem('admin', JSON.stringify(admin));
  
  return admin;
};
```

#### User Management
```typescript
export const getAdminUsers = async (filters?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await apiClient.get('/admin/users', { params: filters });
  return response.data;
};

export const updateUserStatus = async (userId: string, status: string) => {
  const response = await apiClient.put(`/admin/users/${userId}/status`, { status });
  return response.data.data;
};
```

#### Case Management
```typescript
export const getAdminCases = async (filters?: {
  search?: string;
  status?: string;
  program?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await apiClient.get('/admin/cases', { params: filters });
  return response.data;
};

export const updateCaseStatus = async (caseId: string, status: string, notes?: string) => {
  const response = await apiClient.put(`/admin/cases/${caseId}/status`, {
    status,
    notes
  });
  return response.data.data;
};

export const assignCase = async (caseId: string, specialistId: string) => {
  const response = await apiClient.put(`/admin/cases/${caseId}/assign`, {
    specialistId
  });
  return response.data.data;
};
```

#### Document Management
```typescript
export const getAdminDocuments = async (filters?: {
  search?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await apiClient.get('/admin/documents', { params: filters });
  return response.data;
};

export const reviewDocument = async (documentId: string, action: 'approve' | 'reject', notes?: string) => {
  const response = await apiClient.put(`/admin/documents/${documentId}/review`, {
    action,
    notes
  });
  return response.data.data;
};
```

## Error Handling

### Global Error Handler
```typescript
// src/utils/errorHandler.ts
export const handleApiError = (error: any) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return {
          type: 'validation',
          message: data.message || 'Invalid input data',
          errors: data.errors || []
        };
      case 401:
        return {
          type: 'auth',
          message: 'Please sign in to continue'
        };
      case 403:
        return {
          type: 'permission',
          message: 'You don\'t have permission to perform this action'
        };
      case 404:
        return {
          type: 'notFound',
          message: 'The requested resource was not found'
        };
      case 422:
        return {
          type: 'validation',
          message: 'Please check your input and try again',
          errors: data.errors || []
        };
      case 429:
        return {
          type: 'rateLimit',
          message: 'Too many requests. Please try again later'
        };
      default:
        return {
          type: 'server',
          message: 'Something went wrong. Please try again'
        };
    }
  }
  
  return {
    type: 'network',
    message: 'Unable to connect. Please check your internet connection'
  };
};
```

### React Query Integration (Recommended)
```typescript
// src/hooks/useApi.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';

export const useUserProfile = () => {
  return useQuery('userProfile', getUserProfile, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation(updateUserProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries('userProfile');
    },
  });
};

export const useUserCases = (filters?: any) => {
  return useQuery(['userCases', filters], () => getUserCases(filters), {
    keepPreviousData: true,
  });
};
```

## Environment Variables

### Required Environment Variables
```bash
# .env
REACT_APP_API_URL=http://localhost:8000/v1
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_SENTRY_DSN=https://...
REACT_APP_ENVIRONMENT=development
```

### Production Environment
```bash
# .env.production
REACT_APP_API_URL=https://api.taxreliefpro.com/v1
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
REACT_APP_SENTRY_DSN=https://...
REACT_APP_ENVIRONMENT=production
```

## Security Considerations

1. **Token Storage**: Use `localStorage` for persistent sessions, `sessionStorage` for temporary sessions
2. **Data Encryption**: Sensitive data (SSN, account numbers) should be encrypted before sending
3. **File Validation**: Validate file types and sizes on frontend before upload
4. **Input Sanitization**: Sanitize all user inputs before sending to API
5. **Error Messages**: Don't expose sensitive information in error messages
6. **HTTPS**: Always use HTTPS in production
7. **CSRF Protection**: Include CSRF tokens where required
8. **Rate Limiting**: Implement client-side rate limiting for API calls