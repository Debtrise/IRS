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
  validateEmail,
  validatePhone,
  validateSSN
} from './BaseWorkflow';
import { Button } from '../common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { colors, spacing, typography, radius } from '../../theme';

interface OfferInCompromiseData {
  // Step 1: Offer Type
  offerType?: 'doubt-collectibility' | 'doubt-liability' | 'effective-tax-admin';
  totalDebt?: number;
  
  // Step 2: Income Analysis
  wages?: number;
  selfEmployment?: number;
  socialSecurity?: number;
  pension?: number;
  rentalIncome?: number;
  otherIncome?: number;
  totalMonthlyIncome?: number;
  
  // Step 3: Expense Analysis
  nationalStandards?: number;
  housing?: number;
  transportation?: number;
  healthInsurance?: number;
  outOfPocketHealth?: number;
  childcare?: number;
  lifeInsurance?: number;
  taxes?: number;
  otherExpenses?: number;
  totalMonthlyExpenses?: number;
  
  // Step 4: Asset Valuation
  cashOnHand?: number;
  bankAccounts?: number;
  investments?: number;
  realEstate?: { value: number; mortgage: number; equity: number }[];
  vehicles?: { value: number; loan: number; equity: number }[];
  retirement?: number;
  lifeInsuranceCashValue?: number;
  otherAssets?: number;
  totalAssetEquity?: number;
  
  // Step 5: Offer Calculation
  rcp?: number; // Reasonable Collection Potential
  offerAmount?: number;
  paymentOption?: 'lump-sum' | 'periodic';
  
  // Step 6: Documents
  documents?: File[];
  
  // Step 7: Review
  applicationFee?: boolean;
  initialPayment?: boolean;
  termsAccepted?: boolean;
  signatureName?: string;
}

const OfferInCompromise: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OfferInCompromiseData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  
  const steps = [
    'Offer Type',
    'Income Analysis',
    'Expense Analysis',
    'Asset Valuation',
    'Offer Calculation',
    'Document Upload',
    'Review & Submit'
  ];
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  const updateData = (field: keyof OfferInCompromiseData | string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    
    // Auto-calculate totals
    if (field.includes('Income') && field !== 'totalMonthlyIncome') {
      calculateTotalIncome();
    }
    if (field.includes('Expense') || field === 'nationalStandards' || field === 'housing' || field === 'transportation') {
      calculateTotalExpenses();
    }
  };
  
  const calculateTotalIncome = () => {
    const total = (data.wages || 0) + (data.selfEmployment || 0) + (data.socialSecurity || 0) +
                  (data.pension || 0) + (data.rentalIncome || 0) + (data.otherIncome || 0);
    setData(prev => ({ ...prev, totalMonthlyIncome: total }));
  };
  
  const calculateTotalExpenses = () => {
    const total = (data.nationalStandards || 0) + (data.housing || 0) + (data.transportation || 0) +
                  (data.healthInsurance || 0) + (data.outOfPocketHealth || 0) + (data.childcare || 0) +
                  (data.lifeInsurance || 0) + (data.taxes || 0) + (data.otherExpenses || 0);
    setData(prev => ({ ...prev, totalMonthlyExpenses: total }));
  };
  
  const calculateAssetEquity = () => {
    let total = (data.cashOnHand || 0) + (data.bankAccounts || 0) + (data.investments || 0);
    
    // Add real estate equity
    if (data.realEstate) {
      total += data.realEstate.reduce((sum, prop) => sum + prop.equity, 0);
    }
    
    // Add vehicle equity
    if (data.vehicles) {
      total += data.vehicles.reduce((sum, vehicle) => sum + vehicle.equity, 0);
    }
    
    // Add other assets (retirement and life insurance may have exemptions)
    total += (data.otherAssets || 0);
    
    setData(prev => ({ ...prev, totalAssetEquity: total }));
    return total;
  };
  
  const calculateRCP = () => {
    const monthlyDisposable = (data.totalMonthlyIncome || 0) - (data.totalMonthlyExpenses || 0);
    const futureIncome = monthlyDisposable > 0 ? monthlyDisposable * 12 : 0; // 12 months for lump sum
    const assetEquity = calculateAssetEquity();
    const rcp = futureIncome + assetEquity;
    
    setData(prev => ({ ...prev, rcp }));
    return rcp;
  };
  
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 0: // Offer Type
        if (!data.offerType) {
          newErrors.offerType = 'Please select an offer type';
        }
        if (!data.totalDebt) {
          newErrors.totalDebt = 'Total debt amount is required';
        }
        break;
        
      case 1: // Income Analysis
        if (!data.totalMonthlyIncome && data.totalMonthlyIncome !== 0) {
          newErrors.income = 'Please enter all income sources';
        }
        break;
        
      case 2: // Expense Analysis
        if (!data.totalMonthlyExpenses && data.totalMonthlyExpenses !== 0) {
          newErrors.expenses = 'Please enter all expenses';
        }
        break;
        
      case 3: // Asset Valuation
        // Assets are optional but should be disclosed
        break;
        
      case 4: // Offer Calculation
        if (!data.offerAmount) {
          newErrors.offerAmount = 'Please enter your offer amount';
        } else if (data.offerAmount < 1) {
          newErrors.offerAmount = 'Offer must be at least $1';
        }
        if (!data.paymentOption) {
          newErrors.paymentOption = 'Please select a payment option';
        }
        break;
        
      case 5: // Documents
        if (!data.documents || data.documents.length === 0) {
          newErrors.documents = 'Please upload required supporting documents';
        }
        break;
        
      case 6: // Review
        if (!data.applicationFee) {
          newErrors.applicationFee = 'Application fee acknowledgment is required';
        }
        if (!data.initialPayment) {
          newErrors.initialPayment = 'Initial payment acknowledgment is required';
        }
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
    
    if (currentStep === 3) {
      // Calculate RCP before moving to offer calculation
      calculateRCP();
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the offer
      console.log('Submitting offer in compromise:', data);
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
      case 0: // Offer Type
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
                    <h4>About Offer in Compromise</h4>
                    <p>
                      An Offer in Compromise allows you to settle your tax debt for less than the full amount owed. 
                      The IRS will consider your ability to pay, income, expenses, and asset equity.
                    </p>
                  </InfoText>
                </InfoContent>
              </CardContent>
            </InfoBox>
            
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Select Your Offer Type</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <Label>
                    Total Tax Debt <RequiredIndicator>*</RequiredIndicator>
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
                
                <FormGroup>
                  <Label>
                    Reason for Offer <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="offerType"
                        value="doubt-collectibility"
                        checked={data.offerType === 'doubt-collectibility'}
                        onChange={(e) => updateData('offerType', e.target.value)}
                      />
                      <div>
                        <strong>Doubt as to Collectibility</strong>
                        <HelpText>
                          I don't have enough assets and income to pay the full amount
                        </HelpText>
                      </div>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="offerType"
                        value="doubt-liability"
                        checked={data.offerType === 'doubt-liability'}
                        onChange={(e) => updateData('offerType', e.target.value)}
                      />
                      <div>
                        <strong>Doubt as to Liability</strong>
                        <HelpText>
                          I don't believe I owe this amount or there's a dispute about the tax assessed
                        </HelpText>
                      </div>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="offerType"
                        value="effective-tax-admin"
                        checked={data.offerType === 'effective-tax-admin'}
                        onChange={(e) => updateData('offerType', e.target.value)}
                      />
                      <div>
                        <strong>Effective Tax Administration</strong>
                        <HelpText>
                          I could pay but it would create an economic hardship or be unfair due to exceptional circumstances
                        </HelpText>
                      </div>
                    </RadioLabel>
                  </RadioGroup>
                  {errors.offerType && <ErrorMessage>{errors.offerType}</ErrorMessage>}
                </FormGroup>
                
                {data.offerType === 'doubt-liability' && (
                  <Card variant="outlined" style={{ padding: spacing.lg, background: colors.warning[50] }}>
                    <strong>Important:</strong> For Doubt as to Liability offers, you'll need to provide 
                    detailed documentation supporting why you believe the assessed amount is incorrect.
                  </Card>
                )}
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 1: // Income Analysis
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Monthly Income Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ marginBottom: spacing.lg, fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Enter your average monthly income from all sources. Use gross amounts (before taxes).
                </p>
                
                <InputRow>
                  <FormGroup>
                    <Label>Wages & Salaries</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.wages || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('wages', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Self-Employment Income</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.selfEmployment || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('selfEmployment', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                </InputRow>
                
                <InputRow>
                  <FormGroup>
                    <Label>Social Security/Disability</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.socialSecurity || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('socialSecurity', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Pension/Retirement</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.pension || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('pension', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                </InputRow>
                
                <InputRow>
                  <FormGroup>
                    <Label>Rental Income</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.rentalIncome || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('rentalIncome', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Other Income</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.otherIncome || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('otherIncome', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                </InputRow>
                
                <Card variant="outlined" style={{ background: colors.primary[50] }}>
                  <CardContent>
                    <SummaryGrid>
                      <SummaryItem>
                        <h4>Total Monthly Income</h4>
                        <p style={{ fontSize: typography.fontSize['2xl'], color: colors.primary[600] }}>
                          {formatCurrency(data.totalMonthlyIncome || 0)}
                        </p>
                      </SummaryItem>
                    </SummaryGrid>
                  </CardContent>
                </Card>
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 2: // Expense Analysis
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Monthly Expense Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <InfoBox style={{ marginBottom: spacing.lg }}>
                  <CardContent>
                    <InfoContent>
                      <InfoIcon>💡</InfoIcon>
                      <InfoText>
                        <h4>IRS National Standards</h4>
                        <p>
                          The IRS uses national and local standards for certain expense categories. 
                          We'll help you calculate these allowable amounts.
                        </p>
                      </InfoText>
                    </InfoContent>
                  </CardContent>
                </InfoBox>
                
                <FormGroup>
                  <Label>Food, Clothing & Other Items (National Standard)</Label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={data.nationalStandards || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('nationalStandards', parseInt(e.target.value) || 0)
                    }
                  />
                  <HelpText>Based on IRS tables for your household size</HelpText>
                </FormGroup>
                
                <InputRow>
                  <FormGroup>
                    <Label>Housing & Utilities</Label>
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
                    <Label>Health Insurance</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.healthInsurance || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('healthInsurance', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Out-of-Pocket Health Care</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.outOfPocketHealth || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('outOfPocketHealth', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                </InputRow>
                
                <InputRow>
                  <FormGroup>
                    <Label>Child/Dependent Care</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.childcare || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('childcare', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Life Insurance</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.lifeInsurance || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('lifeInsurance', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                </InputRow>
                
                <InputRow>
                  <FormGroup>
                    <Label>Current Year Taxes</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.taxes || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('taxes', parseInt(e.target.value) || 0)
                      }
                    />
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
                
                <Card variant="outlined" style={{ background: colors.primary[50] }}>
                  <CardContent>
                    <SummaryGrid>
                      <SummaryItem>
                        <h4>Total Monthly Expenses</h4>
                        <p style={{ fontSize: typography.fontSize['2xl'], color: colors.primary[600] }}>
                          {formatCurrency(data.totalMonthlyExpenses || 0)}
                        </p>
                      </SummaryItem>
                      <SummaryItem>
                        <h4>Monthly Disposable Income</h4>
                        <p style={{ 
                          fontSize: typography.fontSize['2xl'], 
                          color: (data.totalMonthlyIncome || 0) - (data.totalMonthlyExpenses || 0) >= 0 
                            ? colors.success[600] 
                            : colors.error[600] 
                        }}>
                          {formatCurrency((data.totalMonthlyIncome || 0) - (data.totalMonthlyExpenses || 0))}
                        </p>
                      </SummaryItem>
                    </SummaryGrid>
                  </CardContent>
                </Card>
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 3: // Asset Valuation
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Asset Valuation</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ marginBottom: spacing.lg, fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  List all assets at their quick sale value (typically 80% of fair market value).
                </p>
                
                <InputRow>
                  <FormGroup>
                    <Label>Cash on Hand</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.cashOnHand || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('cashOnHand', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Bank Accounts</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.bankAccounts || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('bankAccounts', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                </InputRow>
                
                <FormGroup>
                  <Label>Investment Accounts</Label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={data.investments || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('investments', parseInt(e.target.value) || 0)
                    }
                  />
                  <HelpText>Stocks, bonds, mutual funds, cryptocurrency</HelpText>
                </FormGroup>
                
                <Card variant="outlined" style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
                  <h4 style={{ marginBottom: spacing.md }}>Real Estate</h4>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.md }}>
                    Include your primary residence and any other properties
                  </p>
                  <Button variant="secondary" size="small">
                    + Add Property
                  </Button>
                </Card>
                
                <Card variant="outlined" style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
                  <h4 style={{ marginBottom: spacing.md }}>Vehicles</h4>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.md }}>
                    Include all cars, trucks, boats, RVs, etc.
                  </p>
                  <Button variant="secondary" size="small">
                    + Add Vehicle
                  </Button>
                </Card>
                
                <InputRow>
                  <FormGroup>
                    <Label>Retirement Accounts</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.retirement || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('retirement', parseInt(e.target.value) || 0)
                      }
                    />
                    <HelpText>May be partially exempt</HelpText>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Life Insurance Cash Value</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.lifeInsurance || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('lifeInsurance', parseInt(e.target.value) || 0)
                      }
                    />
                  </FormGroup>
                </InputRow>
                
                <FormGroup>
                  <Label>Other Assets</Label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={data.otherAssets || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('otherAssets', parseInt(e.target.value) || 0)
                    }
                  />
                  <HelpText>Jewelry, collectibles, business equipment, etc.</HelpText>
                </FormGroup>
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 4: // Offer Calculation
        const monthlyDisposable = (data.totalMonthlyIncome || 0) - (data.totalMonthlyExpenses || 0);
        const futureIncomeMultiplier = data.paymentOption === 'periodic' ? 24 : 12;
        const futureIncome = monthlyDisposable > 0 ? monthlyDisposable * futureIncomeMultiplier : 0;
        
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <InfoBox>
              <CardContent>
                <InfoContent>
                  <InfoIcon>📊</InfoIcon>
                  <InfoText>
                    <h4>Reasonable Collection Potential (RCP)</h4>
                    <p>
                      Your offer must equal or exceed your RCP, which is the sum of your net equity 
                      in assets plus a portion of your future income.
                    </p>
                  </InfoText>
                </InfoContent>
              </CardContent>
            </InfoBox>
            
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Calculate Your Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <Card variant="outlined" style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
                  <h4 style={{ marginBottom: spacing.md }}>RCP Calculation</h4>
                  
                  <div style={{ marginBottom: spacing.md }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                      <span>Net Equity in Assets</span>
                      <strong>{formatCurrency(data.totalAssetEquity || 0)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                      <span>Monthly Disposable Income</span>
                      <strong>{formatCurrency(monthlyDisposable)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                      <span>Future Income Multiplier</span>
                      <strong>× {futureIncomeMultiplier} months</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: spacing.sm, borderTop: `1px solid ${colors.border.light}` }}>
                      <span><strong>Minimum Offer (RCP)</strong></span>
                      <strong style={{ color: colors.primary[600] }}>{formatCurrency(data.rcp || 0)}</strong>
                    </div>
                  </div>
                </Card>
                
                <FormGroup>
                  <Label>
                    Payment Option <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="paymentOption"
                        value="lump-sum"
                        checked={data.paymentOption === 'lump-sum'}
                        onChange={(e) => updateData('paymentOption', e.target.value)}
                      />
                      <div>
                        <strong>Lump Sum Cash Offer</strong>
                        <HelpText>
                          Pay within 5 months of acceptance. 20% down payment required with application.
                        </HelpText>
                      </div>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="paymentOption"
                        value="periodic"
                        checked={data.paymentOption === 'periodic'}
                        onChange={(e) => updateData('paymentOption', e.target.value)}
                      />
                      <div>
                        <strong>Periodic Payment Offer</strong>
                        <HelpText>
                          Pay within 24 months. First payment required with application.
                        </HelpText>
                      </div>
                    </RadioLabel>
                  </RadioGroup>
                  {errors.paymentOption && <ErrorMessage>{errors.paymentOption}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    Your Offer Amount <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={data.offerAmount || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('offerAmount', parseInt(e.target.value))
                    }
                  />
                  <HelpText>
                    Must be at least {formatCurrency(data.rcp || 0)} based on your RCP calculation
                  </HelpText>
                  {errors.offerAmount && <ErrorMessage>{errors.offerAmount}</ErrorMessage>}
                </FormGroup>
                
                {data.offerAmount && data.offerAmount > 0 && (
                  <Card variant="outlined" style={{ background: colors.success[50], padding: spacing.lg }}>
                    <h4 style={{ marginBottom: spacing.sm }}>Payment Details</h4>
                    {data.paymentOption === 'lump-sum' ? (
                      <>
                        <p>Initial payment (20%): <strong>{formatCurrency(data.offerAmount * 0.2)}</strong></p>
                        <p>Remaining balance: <strong>{formatCurrency(data.offerAmount * 0.8)}</strong></p>
                        <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: spacing.sm }}>
                          Due within 5 months of acceptance
                        </p>
                      </>
                    ) : (
                      <>
                        <p>First payment: <strong>{formatCurrency(data.offerAmount / 24)}</strong></p>
                        <p>Monthly payments: <strong>{formatCurrency(data.offerAmount / 24)} × 24 months</strong></p>
                      </>
                    )}
                  </Card>
                )}
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 5: // Document Upload
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
                <div style={{ marginBottom: spacing.lg }}>
                  <p style={{ marginBottom: spacing.md }}>
                    Please upload the following documents to support your offer:
                  </p>
                  <ul style={{ paddingLeft: spacing.lg, fontSize: typography.fontSize.sm }}>
                    <li>Last 3 months of bank statements for all accounts</li>
                    <li>Last 2 pay stubs from all employers</li>
                    <li>Most recent tax return</li>
                    <li>Proof of all expenses claimed</li>
                    <li>Vehicle registrations and values</li>
                    <li>Mortgage statements or lease agreements</li>
                    <li>Investment account statements</li>
                    <li>Any other supporting documentation</li>
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
        
      case 6: // Review & Submit
        const initialPayment = data.paymentOption === 'lump-sum' 
          ? (data.offerAmount || 0) * 0.2 
          : (data.offerAmount || 0) / 24;
          
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <SummarySection variant="elevated">
              <CardHeader>
                <CardTitle>Review Your Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <SummaryGrid>
                  <SummaryItem>
                    <h4>Offer Type</h4>
                    <p>{data.offerType === 'doubt-collectibility' ? 'Doubt as to Collectibility' : 
                        data.offerType === 'doubt-liability' ? 'Doubt as to Liability' : 
                        'Effective Tax Administration'}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Total Tax Debt</h4>
                    <p>{formatCurrency(data.totalDebt || 0)}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Offer Amount</h4>
                    <p style={{ color: colors.primary[600], fontWeight: typography.fontWeight.bold }}>
                      {formatCurrency(data.offerAmount || 0)}
                    </p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Payment Option</h4>
                    <p>{data.paymentOption === 'lump-sum' ? 'Lump Sum (5 months)' : 'Periodic (24 months)'}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Monthly Income</h4>
                    <p>{formatCurrency(data.totalMonthlyIncome || 0)}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Monthly Expenses</h4>
                    <p>{formatCurrency(data.totalMonthlyExpenses || 0)}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Asset Equity</h4>
                    <p>{formatCurrency(data.totalAssetEquity || 0)}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Documents Uploaded</h4>
                    <p>{data.documents?.length || 0} files</p>
                  </SummaryItem>
                </SummaryGrid>
                
                <Card variant="outlined" style={{ marginTop: spacing.xl, padding: spacing.lg, background: colors.warning[50] }}>
                  <h4 style={{ marginBottom: spacing.md }}>Important Fees & Payments</h4>
                  <div style={{ marginBottom: spacing.md }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                      <span>Application Fee</span>
                      <strong>$205</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Initial Payment Required</span>
                      <strong>{formatCurrency(initialPayment)}</strong>
                    </div>
                  </div>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                    Both the application fee and initial payment must be submitted with your offer.
                  </p>
                </Card>
              </CardContent>
            </SummarySection>
            
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Acknowledgments & Signature</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <RadioLabel>
                    <input
                      type="checkbox"
                      checked={data.applicationFee || false}
                      onChange={(e) => updateData('applicationFee', e.target.checked)}
                    />
                    <span>
                      I understand the $205 application fee is required and non-refundable
                    </span>
                  </RadioLabel>
                  {errors.applicationFee && <ErrorMessage>{errors.applicationFee}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <RadioLabel>
                    <input
                      type="checkbox"
                      checked={data.initialPayment || false}
                      onChange={(e) => updateData('initialPayment', e.target.checked)}
                    />
                    <span>
                      I understand the initial payment of {formatCurrency(initialPayment)} is required with my application
                    </span>
                  </RadioLabel>
                  {errors.initialPayment && <ErrorMessage>{errors.initialPayment}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <RadioLabel>
                    <input
                      type="checkbox"
                      checked={data.termsAccepted || false}
                      onChange={(e) => updateData('termsAccepted', e.target.checked)}
                    />
                    <span>
                      I certify that all information provided is true and accurate to the best of my knowledge
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
          <WorkflowTitle>Offer in Compromise Application</WorkflowTitle>
          <WorkflowSubtitle>
            Apply to settle your tax debt for less than the full amount owed
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
                  <span style={{ fontSize: typography.fontSize.sm }}>{step}</span>
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
            {currentStep === steps.length - 1 ? 'Submit Offer' : 'Continue'}
          </Button>
        </NavigationSection>
      </MainContent>
    </WorkflowContainer>
  );
};

export default OfferInCompromise;