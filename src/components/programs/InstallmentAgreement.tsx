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
import MockDataButton from './MockDataButton';

interface InstallmentAgreementData {
  // Step 1: Agreement Type
  totalDebt?: number;
  agreementType?: 'guaranteed' | 'streamlined' | 'non-streamlined';
  
  // Step 2: Payment Calculation
  monthlyPayment?: number;
  paymentDate?: string;
  downPayment?: number;
  payoffMonths?: number;
  
  // Step 3: Financial Information
  monthlyIncome?: number;
  monthlyExpenses?: number;
  ssn?: string;
  phone?: string;
  bankAccount?: {
    routingNumber: string;
    accountNumber: string;
    accountType: 'checking' | 'savings';
  };
  
  // Step 4: Documents
  documents?: File[];
  
  // Step 5: Review
  termsAccepted?: boolean;
  signatureName?: string;
  signatureDate?: string;
}

const InstallmentAgreement: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<InstallmentAgreementData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  
  const steps = [
    'Agreement Type',
    'Payment Calculation',
    'Financial Information',
    'Document Upload',
    'Review & Submit'
  ];
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  const updateData = (field: keyof InstallmentAgreementData | string, value: any) => {
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
  };
  
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 0: // Agreement Type
        if (!data.totalDebt) {
          newErrors.totalDebt = 'Total debt amount is required';
        }
        if (!data.agreementType) {
          newErrors.agreementType = 'Please select an agreement type';
        }
        break;
        
      case 1: // Payment Calculation
        if (!data.monthlyPayment) {
          newErrors.monthlyPayment = 'Monthly payment amount is required';
        } else if (data.monthlyPayment < 25) {
          newErrors.monthlyPayment = 'Minimum payment is $25';
        }
        if (!data.paymentDate) {
          newErrors.paymentDate = 'Payment date is required';
        }
        break;
        
      case 2: // Financial Information
        if (data.agreementType === 'non-streamlined') {
          if (!data.monthlyIncome) {
            newErrors.monthlyIncome = 'Monthly income is required';
          }
          if (!data.monthlyExpenses) {
            newErrors.monthlyExpenses = 'Monthly expenses are required';
          }
        }
        if (!data.ssn || !validateSSN(data.ssn)) {
          newErrors.ssn = 'Valid SSN is required';
        }
        if (!data.phone || !validatePhone(data.phone)) {
          newErrors.phone = 'Valid phone number is required';
        }
        break;
        
      case 3: // Documents
        if (data.agreementType === 'non-streamlined' && (!data.documents || data.documents.length === 0)) {
          newErrors.documents = 'Financial documents are required for non-streamlined agreements';
        }
        break;
        
      case 4: // Review
        if (!data.termsAccepted) {
          newErrors.terms = 'You must accept the terms';
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
      // Submit the agreement
      console.log('Submitting installment agreement:', data);
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
  
  const handleLoadMockData = (mockData: any) => {
    if (mockData.installmentAgreement) {
      const { totalDebt, monthlyPayment, agreementType } = mockData.installmentAgreement;
      setData(prev => ({
        ...prev,
        totalDebt,
        agreementType,
        monthlyPayment,
        paymentDate: '15',
        monthlyIncome: 5000,
        monthlyExpenses: 3500,
        ssn: '123-45-6789',
        phone: '(555) 123-4567',
        bankAccount: {
          routingNumber: '123456789',
          accountNumber: '9876543210',
          accountType: 'checking'
        }
      }));
    }
  };
  
  const calculatePayoffTime = () => {
    if (data.totalDebt && data.monthlyPayment) {
      const interestRate = 0.05 / 12; // 5% annual interest
      const months = Math.log(data.monthlyPayment / (data.monthlyPayment - data.totalDebt * interestRate)) / Math.log(1 + interestRate);
      return Math.ceil(months);
    }
    return 0;
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Agreement Type
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
                    <h4>Choosing the Right Agreement Type</h4>
                    <p>
                      The type of installment agreement depends on how much you owe and your ability to pay. 
                      We'll help you select the best option based on your situation.
                    </p>
                  </InfoText>
                </InfoContent>
              </CardContent>
            </InfoBox>
            
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Determine Your Agreement Type</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <Label>
                    Total Amount Owed to IRS <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={data.totalDebt || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('totalDebt', parseInt(e.target.value))
                    }
                  />
                  <HelpText>
                    Include all tax, penalties, and interest from your IRS notices
                  </HelpText>
                  {errors.totalDebt && <ErrorMessage>{errors.totalDebt}</ErrorMessage>}
                </FormGroup>
                
                {data.totalDebt && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormGroup>
                      <Label>
                        Recommended Agreement Type <RequiredIndicator>*</RequiredIndicator>
                      </Label>
                      <RadioGroup>
                        {data.totalDebt <= 10000 && (
                          <RadioLabel>
                            <input
                              type="radio"
                              name="agreementType"
                              value="guaranteed"
                              checked={data.agreementType === 'guaranteed'}
                              onChange={(e) => updateData('agreementType', e.target.value)}
                            />
                            <div>
                              <strong>Guaranteed Installment Agreement</strong>
                              <HelpText>
                                For debts $10,000 or less. Automatically approved if you meet basic requirements.
                              </HelpText>
                            </div>
                          </RadioLabel>
                        )}
                        
                        {data.totalDebt <= 50000 && (
                          <RadioLabel>
                            <input
                              type="radio"
                              name="agreementType"
                              value="streamlined"
                              checked={data.agreementType === 'streamlined'}
                              onChange={(e) => updateData('agreementType', e.target.value)}
                            />
                            <div>
                              <strong>Streamlined Installment Agreement</strong>
                              <HelpText>
                                For debts $50,000 or less. Simplified process with minimal financial disclosure.
                              </HelpText>
                            </div>
                          </RadioLabel>
                        )}
                        
                        <RadioLabel>
                          <input
                            type="radio"
                            name="agreementType"
                            value="non-streamlined"
                            checked={data.agreementType === 'non-streamlined'}
                            onChange={(e) => updateData('agreementType', e.target.value)}
                          />
                          <div>
                            <strong>Non-Streamlined Installment Agreement</strong>
                            <HelpText>
                              For debts over $50,000. Requires full financial disclosure and documentation.
                            </HelpText>
                          </div>
                        </RadioLabel>
                      </RadioGroup>
                      {errors.agreementType && <ErrorMessage>{errors.agreementType}</ErrorMessage>}
                    </FormGroup>
                  </motion.div>
                )}
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 1: // Payment Calculation
        const payoffMonths = calculatePayoffTime();
        const minimumPayment = data.totalDebt ? Math.ceil(data.totalDebt / 72) : 25;
        
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Calculate Your Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <Label>
                    Monthly Payment Amount <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={data.monthlyPayment || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('monthlyPayment', parseInt(e.target.value))
                    }
                  />
                  <HelpText>
                    Minimum payment: {formatCurrency(minimumPayment)} (must pay in full within 72 months)
                  </HelpText>
                  {errors.monthlyPayment && <ErrorMessage>{errors.monthlyPayment}</ErrorMessage>}
                </FormGroup>
                
                {data.monthlyPayment && data.monthlyPayment >= minimumPayment && (
                  <Card variant="outlined" style={{ marginBottom: spacing.lg }}>
                    <CardContent>
                      <SummaryGrid>
                        <SummaryItem>
                          <h4>Estimated Payoff Time</h4>
                          <p>{payoffMonths} months</p>
                        </SummaryItem>
                        <SummaryItem>
                          <h4>Total Interest (Est.)</h4>
                          <p>{formatCurrency((payoffMonths * data.monthlyPayment) - (data.totalDebt || 0))}</p>
                        </SummaryItem>
                      </SummaryGrid>
                    </CardContent>
                  </Card>
                )}
                
                <FormGroup>
                  <Label>
                    Payment Date <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Select
                    value={data.paymentDate || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateData('paymentDate', e.target.value)}
                  >
                    <option value="">Select payment date</option>
                    {[...Array(28)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}{i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} of each month
                      </option>
                    ))}
                  </Select>
                  <HelpText>
                    Choose a date that works with your pay schedule
                  </HelpText>
                  {errors.paymentDate && <ErrorMessage>{errors.paymentDate}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>Down Payment (Optional)</Label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={data.downPayment || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('downPayment', parseInt(e.target.value))
                    }
                  />
                  <HelpText>
                    Making a down payment reduces your balance and shows good faith
                  </HelpText>
                </FormGroup>
              </CardContent>
            </FormSection>
            
            <InfoBox>
              <CardContent>
                <InfoContent>
                  <InfoIcon>💡</InfoIcon>
                  <InfoText>
                    <h4>Payment Method</h4>
                    <p>
                      The IRS strongly recommends Direct Debit for installment agreements. 
                      It ensures timely payments and helps you avoid default.
                    </p>
                  </InfoText>
                </InfoContent>
              </CardContent>
            </InfoBox>
          </motion.div>
        );
        
      case 2: // Financial Information
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
              </CardHeader>
              <CardContent>
                {data.agreementType === 'non-streamlined' && (
                  <>
                    <InputRow>
                      <FormGroup>
                        <Label>
                          Monthly Gross Income <RequiredIndicator>*</RequiredIndicator>
                        </Label>
                        <Input
                          type="number"
                          placeholder="$0"
                          value={data.monthlyIncome || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            updateData('monthlyIncome', parseInt(e.target.value))
                          }
                        />
                        {errors.monthlyIncome && <ErrorMessage>{errors.monthlyIncome}</ErrorMessage>}
                      </FormGroup>
                      
                      <FormGroup>
                        <Label>
                          Monthly Expenses <RequiredIndicator>*</RequiredIndicator>
                        </Label>
                        <Input
                          type="number"
                          placeholder="$0"
                          value={data.monthlyExpenses || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            updateData('monthlyExpenses', parseInt(e.target.value))
                          }
                        />
                        {errors.monthlyExpenses && <ErrorMessage>{errors.monthlyExpenses}</ErrorMessage>}
                      </FormGroup>
                    </InputRow>
                  </>
                )}
                
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
                
                <Card variant="outlined" style={{ padding: spacing.lg }}>
                  <h4 style={{ marginBottom: spacing.md }}>Direct Debit Information</h4>
                  
                  <FormGroup>
                    <Label>Bank Routing Number</Label>
                    <Input
                      type="text"
                      placeholder="123456789"
                      value={data.bankAccount?.routingNumber || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('bankAccount.routingNumber', e.target.value)
                      }
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Account Number</Label>
                    <Input
                      type="text"
                      placeholder="1234567890"
                      value={data.bankAccount?.accountNumber || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('bankAccount.accountNumber', e.target.value)
                      }
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Account Type</Label>
                    <Select
                      value={data.bankAccount?.accountType || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateData('bankAccount.accountType', e.target.value)}
                    >
                      <option value="">Select account type</option>
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </Select>
                  </FormGroup>
                </Card>
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 3: // Document Upload
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <DocumentUploadSection variant="elevated">
              <CardHeader>
                <CardTitle>Required Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {data.agreementType === 'non-streamlined' ? (
                  <div style={{ marginBottom: spacing.lg }}>
                    <p style={{ marginBottom: spacing.md }}>
                      For non-streamlined agreements, please upload:
                    </p>
                    <ul style={{ paddingLeft: spacing.lg, fontSize: typography.fontSize.sm }}>
                      <li>Last 3 months of bank statements</li>
                      <li>Last 2 pay stubs</li>
                      <li>Proof of monthly expenses (rent, utilities, etc.)</li>
                      <li>Most recent tax return</li>
                    </ul>
                  </div>
                ) : (
                  <p style={{ marginBottom: spacing.lg }}>
                    Documents are optional for {data.agreementType} agreements, but providing them may help expedite processing.
                  </p>
                )}
                
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
        
      case 4: // Review & Submit
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <SummarySection variant="elevated">
              <CardHeader>
                <CardTitle>Review Your Agreement</CardTitle>
              </CardHeader>
              <CardContent>
                <SummaryGrid>
                  <SummaryItem>
                    <h4>Agreement Type</h4>
                    <p>{data.agreementType ? data.agreementType.charAt(0).toUpperCase() + data.agreementType.slice(1) : ''}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Total Debt</h4>
                    <p>{formatCurrency(data.totalDebt || 0)}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Monthly Payment</h4>
                    <p>{formatCurrency(data.monthlyPayment || 0)}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Payment Date</h4>
                    <p>{data.paymentDate ? `${data.paymentDate}${data.paymentDate === '1' ? 'st' : data.paymentDate === '2' ? 'nd' : data.paymentDate === '3' ? 'rd' : 'th'} of each month` : 'Not set'}</p>
                  </SummaryItem>
                  {data.downPayment && (
                    <>
                      <SummaryItem>
                        <h4>Down Payment</h4>
                        <p>{formatCurrency(data.downPayment)}</p>
                      </SummaryItem>
                      <SummaryItem>
                        <h4>Remaining Balance</h4>
                        <p>{formatCurrency((data.totalDebt || 0) - data.downPayment)}</p>
                      </SummaryItem>
                    </>
                  )}
                  <SummaryItem>
                    <h4>Estimated Payoff</h4>
                    <p>{calculatePayoffTime()} months</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Documents Uploaded</h4>
                    <p>{data.documents?.length || 0} files</p>
                  </SummaryItem>
                </SummaryGrid>
              </CardContent>
            </SummarySection>
            
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Terms & Electronic Signature</CardTitle>
              </CardHeader>
              <CardContent>
                <Card variant="outlined" style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
                  <h4 style={{ marginBottom: spacing.md }}>Agreement Terms</h4>
                  <div style={{ fontSize: typography.fontSize.sm, lineHeight: 1.6, height: '200px', overflowY: 'auto' }}>
                    <p style={{ marginBottom: spacing.md }}>
                      By entering into this installment agreement, you agree to:
                    </p>
                    <ul style={{ paddingLeft: spacing.lg }}>
                      <li>Make all payments on time as scheduled</li>
                      <li>File all required tax returns on time</li>
                      <li>Pay all future taxes in full and on time</li>
                      <li>Provide updated financial information if requested</li>
                      <li>Allow the IRS to keep any refunds and apply them to your debt</li>
                    </ul>
                    <p style={{ marginTop: spacing.md }}>
                      Failure to comply with these terms may result in termination of the agreement 
                      and immediate collection action.
                    </p>
                  </div>
                </Card>
                
                <FormGroup>
                  <RadioLabel>
                    <input
                      type="checkbox"
                      checked={data.termsAccepted || false}
                      onChange={(e) => updateData('termsAccepted', e.target.checked)}
                    />
                    <span>
                      I have read and agree to the terms of this installment agreement
                    </span>
                  </RadioLabel>
                  {errors.terms && <ErrorMessage>{errors.terms}</ErrorMessage>}
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
      <MockDataButton programId="ia" onLoadMockData={handleLoadMockData} />
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
          <WorkflowTitle>Installment Agreement Application</WorkflowTitle>
          <WorkflowSubtitle>
            Set up a payment plan to pay your tax debt over time
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
            {currentStep === steps.length - 1 ? 'Submit Agreement' : 'Continue'}
          </Button>
        </NavigationSection>
      </MainContent>
    </WorkflowContainer>
  );
};

export default InstallmentAgreement;