import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  WorkflowContainer,
  Header,
  HeaderContent,
  BackButton,
  MainContent,
  WorkflowHeader,
  WorkflowTitle,
  WorkflowSubtitle,
  ProgressSection,
  ProgressSteps,
  ProgressStep,
  StepNumber,
  StepConnector,
  MobileProgress,
  ProgressBar,
  ProgressFill,
  ProgressText,
  FormSection,
  FormGroup,
  Label,
  RequiredIndicator,
  Input,
  Select,
  TextArea,
  RadioGroup,
  RadioLabel,
  InputRow,
  HelpText,
  ErrorMessage,
  InfoBox,
  InfoIcon,
  InfoContent,
  InfoText,
  NavigationSection,
  SaveDraftButton,
  DocumentUploadSection,
  UploadArea,
  UploadIcon,
  UploadText,
  UploadSubtext,
  DocumentList,
  DocumentItem,
  DocumentIcon,
  DocumentInfo,
  RemoveButton,
  SummarySection,
  SummaryGrid,
  SummaryItem,
  formatCurrency,
  validatePhone,
  validateSSN
} from './BaseWorkflow';
import { Button } from '../common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { colors, spacing, typography } from '../../theme';

interface CNCData {
  // Step 1: Hardship Type
  hardshipType?: 'unemployment' | 'medical' | 'fixed-income' | 'other';
  hardshipDescription?: string;
  
  // Step 2: Income Information
  employmentStatus?: 'unemployed' | 'employed' | 'self-employed' | 'retired' | 'disabled';
  monthlyIncome?: number;
  incomeSource?: string;
  lastEmploymentDate?: string;
  
  // Step 3: Expense Documentation
  housing?: number;
  utilities?: number;
  food?: number;
  transportation?: number;
  medical?: number;
  insurance?: number;
  minimumPayments?: number;
  otherExpenses?: number;
  totalExpenses?: number;
  
  // Step 4: Supporting Evidence
  documents?: File[];
  medicalCondition?: string;
  doctorStatement?: boolean;
  
  // Step 5: Contact Information
  ssn?: string;
  phone?: string;
  bestTimeToCall?: string;
  alternateContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  
  // Step 6: Review
  statementAccuracy?: boolean;
  understandTerms?: boolean;
  signatureName?: string;
}

const CurrentlyNotCollectible: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<CNCData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  
  const steps = [
    'Hardship Type',
    'Income Information',
    'Monthly Expenses',
    'Supporting Evidence',
    'Contact Information',
    'Review & Submit'
  ];
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  const updateData = (field: keyof CNCData | string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setData(prev => ({ ...prev, [field]: value }));
    }
    setErrors(prev => ({ ...prev, [field]: '' }));
    
    // Calculate total expenses
    if (field.includes('Expense') || ['housing', 'utilities', 'food', 'transportation', 'medical', 'insurance', 'minimumPayments', 'otherExpenses'].includes(field)) {
      calculateTotalExpenses();
    }
  };
  
  const calculateTotalExpenses = () => {
    const total = (data.housing || 0) + (data.utilities || 0) + (data.food || 0) +
                  (data.transportation || 0) + (data.medical || 0) + (data.insurance || 0) +
                  (data.minimumPayments || 0) + (data.otherExpenses || 0);
    setData(prev => ({ ...prev, totalExpenses: total }));
  };
  
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 0: // Hardship Type
        if (!data.hardshipType) {
          newErrors.hardshipType = 'Please select a hardship type';
        }
        if (!data.hardshipDescription || data.hardshipDescription.length < 50) {
          newErrors.hardshipDescription = 'Please provide a detailed description (at least 50 characters)';
        }
        break;
        
      case 1: // Income Information
        if (!data.employmentStatus) {
          newErrors.employmentStatus = 'Employment status is required';
        }
        if (data.monthlyIncome === undefined) {
          newErrors.monthlyIncome = 'Monthly income is required (enter 0 if none)';
        }
        if (data.employmentStatus === 'unemployed' && !data.lastEmploymentDate) {
          newErrors.lastEmploymentDate = 'Please provide your last employment date';
        }
        break;
        
      case 2: // Monthly Expenses
        if (!data.totalExpenses || data.totalExpenses === 0) {
          newErrors.expenses = 'Please enter your monthly expenses';
        }
        if ((data.monthlyIncome || 0) >= (data.totalExpenses || 0)) {
          newErrors.expenses = 'Your income exceeds expenses. You may not qualify for CNC status.';
        }
        break;
        
      case 3: // Supporting Evidence
        if (data.hardshipType === 'medical' && !data.medicalCondition) {
          newErrors.medicalCondition = 'Please describe your medical condition';
        }
        if (!data.documents || data.documents.length === 0) {
          newErrors.documents = 'Please upload supporting documentation';
        }
        break;
        
      case 4: // Contact Information
        if (!data.ssn || !validateSSN(data.ssn)) {
          newErrors.ssn = 'Valid SSN is required';
        }
        if (!data.phone || !validatePhone(data.phone)) {
          newErrors.phone = 'Valid phone number is required';
        }
        if (!data.bestTimeToCall) {
          newErrors.bestTimeToCall = 'Please select the best time to call';
        }
        break;
        
      case 5: // Review
        if (!data.statementAccuracy) {
          newErrors.statementAccuracy = 'You must certify the accuracy of your statements';
        }
        if (!data.understandTerms) {
          newErrors.understandTerms = 'You must acknowledge understanding of CNC terms';
        }
        if (!data.signatureName) {
          newErrors.signatureName = 'Electronic signature is required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (!validateStep()) return;
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit CNC request
      console.log('Submitting CNC request:', data);
      navigate('/portal');
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    updateData('documents', [...(data.documents || []), ...files]);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      updateData('documents', [...(data.documents || []), ...files]);
    }
  };
  
  const removeDocument = (index: number) => {
    const newDocs = [...(data.documents || [])];
    newDocs.splice(index, 1);
    updateData('documents', newDocs);
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Hardship Type
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <InfoBox>
              <CardContent>
                <InfoContent>
                  <InfoIcon>ℹ️</InfoIcon>
                  <InfoText>
                    <h4>About Currently Not Collectible Status</h4>
                    <p>
                      CNC status temporarily suspends IRS collection activities when you're experiencing 
                      financial hardship. While in CNC status, the IRS won't levy your wages or bank accounts, 
                      but interest and penalties continue to accrue.
                    </p>
                  </InfoText>
                </InfoContent>
              </CardContent>
            </InfoBox>
            
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Describe Your Hardship</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <Label>
                    Type of Hardship <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="hardshipType"
                        value="unemployment"
                        checked={data.hardshipType === 'unemployment'}
                        onChange={(e) => updateData('hardshipType', e.target.value)}
                      />
                      <div>
                        <strong>Unemployment</strong>
                        <HelpText>
                          Currently unemployed with little to no income
                        </HelpText>
                      </div>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="hardshipType"
                        value="medical"
                        checked={data.hardshipType === 'medical'}
                        onChange={(e) => updateData('hardshipType', e.target.value)}
                      />
                      <div>
                        <strong>Medical Hardship</strong>
                        <HelpText>
                          Serious illness or disability preventing work or causing high medical expenses
                        </HelpText>
                      </div>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="hardshipType"
                        value="fixed-income"
                        checked={data.hardshipType === 'fixed-income'}
                        onChange={(e) => updateData('hardshipType', e.target.value)}
                      />
                      <div>
                        <strong>Fixed Income</strong>
                        <HelpText>
                          Living on Social Security, disability, or pension with no ability to increase income
                        </HelpText>
                      </div>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="hardshipType"
                        value="other"
                        checked={data.hardshipType === 'other'}
                        onChange={(e) => updateData('hardshipType', e.target.value)}
                      />
                      <div>
                        <strong>Other Financial Hardship</strong>
                        <HelpText>
                          Other circumstances causing inability to pay
                        </HelpText>
                      </div>
                    </RadioLabel>
                  </RadioGroup>
                  {errors.hardshipType && <ErrorMessage>{errors.hardshipType}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    Describe Your Situation <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <TextArea
                    placeholder="Please provide details about your financial hardship, how it started, and why you cannot pay your tax debt..."
                    value={data.hardshipDescription || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      updateData('hardshipDescription', e.target.value)
                    }
                    style={{ minHeight: '150px' }}
                  />
                  <HelpText>
                    Be specific about your circumstances. This helps the IRS understand your situation.
                  </HelpText>
                  {errors.hardshipDescription && <ErrorMessage>{errors.hardshipDescription}</ErrorMessage>}
                </FormGroup>
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 1: // Income Information
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Income Information</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <Label>
                    Employment Status <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Select
                    value={data.employmentStatus || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateData('employmentStatus', e.target.value)}
                  >
                    <option value="">Select status</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="retired">Retired</option>
                    <option value="disabled">Disabled</option>
                  </Select>
                  {errors.employmentStatus && <ErrorMessage>{errors.employmentStatus}</ErrorMessage>}
                </FormGroup>
                
                {data.employmentStatus === 'unemployed' && (
                  <FormGroup>
                    <Label>
                      Last Date of Employment <RequiredIndicator>*</RequiredIndicator>
                    </Label>
                    <Input
                      type="date"
                      value={data.lastEmploymentDate || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('lastEmploymentDate', e.target.value)
                      }
                    />
                    {errors.lastEmploymentDate && <ErrorMessage>{errors.lastEmploymentDate}</ErrorMessage>}
                  </FormGroup>
                )}
                
                <FormGroup>
                  <Label>
                    Total Monthly Income <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={data.monthlyIncome || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('monthlyIncome', parseInt(e.target.value) || 0)
                    }
                  />
                  <HelpText>
                    Include all income: wages, unemployment, Social Security, disability, etc.
                  </HelpText>
                  {errors.monthlyIncome && <ErrorMessage>{errors.monthlyIncome}</ErrorMessage>}
                </FormGroup>
                
                {data.monthlyIncome && data.monthlyIncome > 0 && (
                  <FormGroup>
                    <Label>Source of Income</Label>
                    <Input
                      type="text"
                      placeholder="e.g., Social Security, unemployment benefits, part-time work"
                      value={data.incomeSource || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('incomeSource', e.target.value)
                      }
                    />
                  </FormGroup>
                )}
                
                {data.monthlyIncome === 0 && (
                  <Card variant="outlined" style={{ padding: spacing.lg, background: colors.warning[50] }}>
                    <h4 style={{ marginBottom: spacing.sm }}>No Income Verification</h4>
                    <p style={{ fontSize: typography.fontSize.sm }}>
                      You'll need to provide documentation showing how you're meeting basic living expenses 
                      without income (e.g., support from family, food assistance, etc.)
                    </p>
                  </Card>
                )}
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 2: // Monthly Expenses
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Monthly Living Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ marginBottom: spacing.lg, fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  List your actual necessary monthly expenses. The IRS will compare these to national standards.
                </p>
                
                <InputRow>
                  <FormGroup>
                    <Label>Housing (Rent/Mortgage)</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.housing || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('housing', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Utilities</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.utilities || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('utilities', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                </InputRow>
                
                <InputRow>
                  <FormGroup>
                    <Label>Food & Groceries</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.food || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('food', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Transportation</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.transportation || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('transportation', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                </InputRow>
                
                <InputRow>
                  <FormGroup>
                    <Label>Medical Expenses</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.medical || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('medical', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Insurance</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.insurance || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('insurance', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                </InputRow>
                
                <InputRow>
                  <FormGroup>
                    <Label>Minimum Debt Payments</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.minimumPayments || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('minimumPayments', parseInt(e.target.value) || 0)
                      }
                    />
                    <HelpText>Credit cards, loans, etc.</HelpText>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Other Necessary Expenses</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.otherExpenses || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('otherExpenses', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                </InputRow>
                
                <Card variant="outlined" style={{ marginTop: spacing.lg, background: colors.primary[50] }}>
                  <CardContent>
                    <SummaryGrid>
                      <SummaryItem>
                        <h4>Total Monthly Expenses</h4>
                        <p style={{ fontSize: typography.fontSize['2xl'], color: colors.primary[600] }}>
                          {formatCurrency(data.totalExpenses || 0)}
                        </p>
                      </SummaryItem>
                      <SummaryItem>
                        <h4>Monthly Deficit</h4>
                        <p style={{ 
                          fontSize: typography.fontSize['2xl'], 
                          color: colors.error[600]
                        }}>
                          {formatCurrency((data.totalExpenses || 0) - (data.monthlyIncome || 0))}
                        </p>
                      </SummaryItem>
                    </SummaryGrid>
                  </CardContent>
                </Card>
                
                {errors.expenses && <ErrorMessage>{errors.expenses}</ErrorMessage>}
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 3: // Supporting Evidence
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {data.hardshipType === 'medical' && (
              <FormSection variant="elevated">
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormGroup>
                    <Label>
                      Describe Your Medical Condition <RequiredIndicator>*</RequiredIndicator>
                    </Label>
                    <TextArea
                      placeholder="Provide details about your diagnosis, treatment, and how it affects your ability to work..."
                      value={data.medicalCondition || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        updateData('medicalCondition', e.target.value)
                      }
                    />
                    {errors.medicalCondition && <ErrorMessage>{errors.medicalCondition}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <RadioLabel>
                      <input
                        type="checkbox"
                        checked={data.doctorStatement || false}
                        onChange={(e) => updateData('doctorStatement', e.target.checked)}
                      />
                      <span>
                        I will provide a statement from my doctor explaining my condition and prognosis
                      </span>
                    </RadioLabel>
                  </FormGroup>
                </CardContent>
              </FormSection>
            )}
            
            <DocumentUploadSection variant="elevated">
              <CardHeader>
                <CardTitle>Supporting Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ marginBottom: spacing.lg }}>
                  <p style={{ marginBottom: spacing.md }}>
                    Please upload documents that support your hardship claim:
                  </p>
                  <ul style={{ paddingLeft: spacing.lg, fontSize: typography.fontSize.sm }}>
                    {data.hardshipType === 'unemployment' && (
                      <>
                        <li>Unemployment benefit statements</li>
                        <li>Termination letter or layoff notice</li>
                        <li>Job search documentation</li>
                      </>
                    )}
                    {data.hardshipType === 'medical' && (
                      <>
                        <li>Medical records and diagnoses</li>
                        <li>Doctor's statement about condition</li>
                        <li>Medical bills and expenses</li>
                        <li>Disability determination (if applicable)</li>
                      </>
                    )}
                    {data.hardshipType === 'fixed-income' && (
                      <>
                        <li>Social Security award letter</li>
                        <li>Pension statements</li>
                        <li>Disability award letter</li>
                      </>
                    )}
                    <li>Last 3 months bank statements</li>
                    <li>Proof of monthly expenses</li>
                    <li>Any other relevant documentation</li>
                  </ul>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                
                <UploadArea
                  isDragging={isDragging}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon>📤</UploadIcon>
                  <UploadText>
                    {isDragging ? 'Drop files here' : 'Drag and drop or click to browse'}
                  </UploadText>
                  <UploadSubtext>
                    PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
                  </UploadSubtext>
                </UploadArea>
                
                {errors.documents && <ErrorMessage>{errors.documents}</ErrorMessage>}
                
                {data.documents && data.documents.length > 0 && (
                  <DocumentList>
                    <h4 style={{ marginBottom: spacing.sm }}>Uploaded Documents</h4>
                    {data.documents.map((file, index) => (
                      <DocumentItem key={index}>
                        <DocumentIcon>📄</DocumentIcon>
                        <DocumentInfo>
                          <div className="name">{file.name}</div>
                          <div className="size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </DocumentInfo>
                        <RemoveButton onClick={() => removeDocument(index)}>
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </RemoveButton>
                      </DocumentItem>
                    ))}
                  </DocumentList>
                )}
              </CardContent>
            </DocumentUploadSection>
          </motion.div>
        );
        
      case 4: // Contact Information
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <InputRow>
                  <FormGroup>
                    <Label>
                      Social Security Number <RequiredIndicator>*</RequiredIndicator>
                    </Label>
                    <Input
                      type="text"
                      placeholder="XXX-XX-XXXX"
                      value={data.ssn || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('ssn', e.target.value)
                      }
                    />
                    {errors.ssn && <ErrorMessage>{errors.ssn}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>
                      Phone Number <RequiredIndicator>*</RequiredIndicator>
                    </Label>
                    <Input
                      type="tel"
                      placeholder="(555) 555-5555"
                      value={data.phone || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('phone', e.target.value)
                      }
                    />
                    {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                  </FormGroup>
                </InputRow>
                
                <FormGroup>
                  <Label>
                    Best Time to Call <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Select
                    value={data.bestTimeToCall || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateData('bestTimeToCall', e.target.value)}
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning (8 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                    <option value="anytime">Any time during business hours</option>
                  </Select>
                  {errors.bestTimeToCall && <ErrorMessage>{errors.bestTimeToCall}</ErrorMessage>}
                </FormGroup>
                
                <Card variant="outlined" style={{ padding: spacing.lg }}>
                  <h4 style={{ marginBottom: spacing.md }}>Alternative Contact (Optional)</h4>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.md }}>
                    Provide someone we can contact if we cannot reach you
                  </p>
                  
                  <FormGroup>
                    <Label>Contact Name</Label>
                    <Input
                      type="text"
                      placeholder="Jane Doe"
                      value={data.alternateContact?.name || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('alternateContact.name', e.target.value)
                      }
                    />
                  </FormGroup>
                  
                  <InputRow>
                    <FormGroup>
                      <Label>Contact Phone</Label>
                      <Input
                        type="tel"
                        placeholder="(555) 555-5555"
                        value={data.alternateContact?.phone || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          updateData('alternateContact.phone', e.target.value)
                        }
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>Relationship</Label>
                      <Input
                        type="text"
                        placeholder="e.g., Spouse, Child, Friend"
                        value={data.alternateContact?.relationship || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          updateData('alternateContact.relationship', e.target.value)
                        }
                      />
                    </FormGroup>
                  </InputRow>
                </Card>
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 5: // Review & Submit
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <SummarySection variant="elevated">
              <CardHeader>
                <CardTitle>Review Your CNC Request</CardTitle>
              </CardHeader>
              <CardContent>
                <SummaryGrid>
                  <SummaryItem>
                    <h4>Hardship Type</h4>
                    <p>{data.hardshipType?.charAt(0).toUpperCase() + (data.hardshipType?.slice(1).replace('-', ' ') || '')}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Employment Status</h4>
                    <p>{data.employmentStatus?.charAt(0).toUpperCase() + (data.employmentStatus?.slice(1) || '')}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Monthly Income</h4>
                    <p>{formatCurrency(data.monthlyIncome || 0)}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Monthly Expenses</h4>
                    <p>{formatCurrency(data.totalExpenses || 0)}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Monthly Deficit</h4>
                    <p style={{ color: colors.error[600] }}>
                      {formatCurrency((data.totalExpenses || 0) - (data.monthlyIncome || 0))}
                    </p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Documents Uploaded</h4>
                    <p>{data.documents?.length || 0} files</p>
                  </SummaryItem>
                </SummaryGrid>
              </CardContent>
            </SummarySection>
            
            <InfoBox>
              <CardContent>
                <InfoContent>
                  <InfoIcon>⚠️</InfoIcon>
                  <InfoText>
                    <h4>Important Information About CNC Status</h4>
                    <p>
                      While in CNC status:
                    </p>
                    <ul style={{ marginTop: spacing.sm, paddingLeft: spacing.lg }}>
                      <li>The IRS will not levy your wages or bank accounts</li>
                      <li>Interest and penalties continue to accrue on your debt</li>
                      <li>The IRS will keep any tax refunds and apply them to your debt</li>
                      <li>Your case will be reviewed periodically (usually annually)</li>
                      <li>You must continue filing all required tax returns</li>
                    </ul>
                  </InfoText>
                </InfoContent>
              </CardContent>
            </InfoBox>
            
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Certifications & Signature</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <RadioLabel>
                    <input
                      type="checkbox"
                      checked={data.statementAccuracy || false}
                      onChange={(e) => updateData('statementAccuracy', e.target.checked)}
                    />
                    <span>
                      I certify that all information provided is true, correct, and complete to the best of my knowledge
                    </span>
                  </RadioLabel>
                  {errors.statementAccuracy && <ErrorMessage>{errors.statementAccuracy}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <RadioLabel>
                    <input
                      type="checkbox"
                      checked={data.understandTerms || false}
                      onChange={(e) => updateData('understandTerms', e.target.checked)}
                    />
                    <span>
                      I understand the terms of Currently Not Collectible status and my obligations
                    </span>
                  </RadioLabel>
                  {errors.understandTerms && <ErrorMessage>{errors.understandTerms}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    Electronic Signature (Full Legal Name) <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={data.signatureName || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('signatureName', e.target.value)
                    }
                  />
                  {errors.signatureName && <ErrorMessage>{errors.signatureName}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>Today's Date</Label>
                  <Input
                    type="text"
                    value={new Date().toLocaleDateString()}
                    disabled
                  />
                </FormGroup>
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <WorkflowContainer>
      <Header>
        <HeaderContent>
          <BackButton onClick={() => navigate('/portal')}>
            ← Back to Dashboard
          </BackButton>
          <SaveDraftButton variant="ghost" size="small">
            Save Draft
          </SaveDraftButton>
        </HeaderContent>
      </Header>
      
      <MainContent>
        <WorkflowHeader>
          <WorkflowTitle>Currently Not Collectible Request</WorkflowTitle>
          <WorkflowSubtitle>
            Request temporary suspension of IRS collection due to financial hardship
          </WorkflowSubtitle>
        </WorkflowHeader>
        
        <ProgressSection>
          <ProgressSteps>
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <ProgressStep
                  active={index === currentStep}
                  completed={index < currentStep}
                >
                  <StepNumber
                    active={index === currentStep}
                    completed={index < currentStep}
                  >
                    {index < currentStep ? '✓' : index + 1}
                  </StepNumber>
                  <span>{step}</span>
                </ProgressStep>
                {index < steps.length - 1 && (
                  <StepConnector completed={index < currentStep} />
                )}
              </React.Fragment>
            ))}
          </ProgressSteps>
          
          <MobileProgress>
            <ProgressBar>
              <ProgressFill
                progress={progress}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </ProgressBar>
            <ProgressText>
              Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
            </ProgressText>
          </MobileProgress>
        </ProgressSection>
        
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
        
        <NavigationSection>
          {currentStep > 0 && (
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
          )}
          <div style={{ flex: 1 }} />
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Submit Request' : 'Continue'}
          </Button>
        </NavigationSection>
      </MainContent>
    </WorkflowContainer>
  );
};

export default CurrentlyNotCollectible;