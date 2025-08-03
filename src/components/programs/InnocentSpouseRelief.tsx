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

interface InnocentSpouseData {
  // Step 1: Relief Type
  reliefType?: 'traditional' | 'separation' | 'equitable';
  taxYears?: string[];
  totalLiability?: number;
  
  // Step 2: Relationship Timeline
  marriageDate?: string;
  filingStatus?: 'joint' | 'separate';
  currentStatus?: 'married' | 'divorced' | 'separated' | 'widowed';
  separationDate?: string;
  divorceDate?: string;
  spouseName?: string;
  
  // Step 3: Knowledge Assessment
  knewOfUnderstatement?: boolean;
  reasonToKnow?: boolean;
  signedUnderDuress?: boolean;
  benefitFromUnderstatement?: boolean;
  knowledgeExplanation?: string;
  
  // Step 4: Financial Control
  handledFinances?: 'self' | 'spouse' | 'both';
  accessToRecords?: boolean;
  reviewedReturns?: boolean;
  questionedItems?: boolean;
  financialControlDetails?: string;
  
  // Step 5: Current Situation
  currentIncome?: number;
  monthlyExpenses?: number;
  sufferHardship?: boolean;
  hardshipExplanation?: string;
  abuseVictim?: boolean;
  
  // Step 6: Supporting Documents
  documents?: File[];
  
  // Step 7: Contact & Review
  ssn?: string;
  phone?: string;
  email?: string;
  currentAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  certifyTruth?: boolean;
  signatureName?: string;
}

const InnocentSpouseRelief: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<InnocentSpouseData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  
  const steps = [
    'Relief Type',
    'Relationship Timeline',
    'Knowledge Assessment',
    'Financial Control',
    'Current Situation',
    'Supporting Documents',
    'Review & Submit'
  ];
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  const updateData = (field: keyof InnocentSpouseData | string, value: any) => {
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
      case 0: // Relief Type
        if (!data.reliefType) {
          newErrors.reliefType = 'Please select a relief type';
        }
        if (!data.taxYears || data.taxYears.length === 0) {
          newErrors.taxYears = 'Please select at least one tax year';
        }
        if (!data.totalLiability) {
          newErrors.totalLiability = 'Total liability amount is required';
        }
        break;
        
      case 1: // Relationship Timeline
        if (!data.marriageDate) {
          newErrors.marriageDate = 'Marriage date is required';
        }
        if (!data.currentStatus) {
          newErrors.currentStatus = 'Current marital status is required';
        }
        if ((data.currentStatus === 'divorced' || data.currentStatus === 'separated') && 
            !data.separationDate) {
          newErrors.separationDate = 'Separation date is required';
        }
        if (!data.spouseName) {
          newErrors.spouseName = 'Spouse name is required';
        }
        break;
        
      case 2: // Knowledge Assessment
        if (data.knewOfUnderstatement === undefined) {
          newErrors.knewOfUnderstatement = 'Please answer this question';
        }
        if (data.reasonToKnow === undefined) {
          newErrors.reasonToKnow = 'Please answer this question';
        }
        if (!data.knowledgeExplanation || data.knowledgeExplanation.length < 50) {
          newErrors.knowledgeExplanation = 'Please provide a detailed explanation (at least 50 characters)';
        }
        break;
        
      case 3: // Financial Control
        if (!data.handledFinances) {
          newErrors.handledFinances = 'Please indicate who handled finances';
        }
        if (data.accessToRecords === undefined) {
          newErrors.accessToRecords = 'Please answer this question';
        }
        if (!data.financialControlDetails || data.financialControlDetails.length < 50) {
          newErrors.financialControlDetails = 'Please provide details (at least 50 characters)';
        }
        break;
        
      case 4: // Current Situation
        if (data.currentIncome === undefined) {
          newErrors.currentIncome = 'Current income is required';
        }
        if (data.monthlyExpenses === undefined) {
          newErrors.monthlyExpenses = 'Monthly expenses are required';
        }
        if (data.sufferHardship && !data.hardshipExplanation) {
          newErrors.hardshipExplanation = 'Please explain the hardship';
        }
        break;
        
      case 5: // Supporting Documents
        if (!data.documents || data.documents.length === 0) {
          newErrors.documents = 'Please upload supporting documentation';
        }
        break;
        
      case 6: // Review
        if (!data.ssn || !validateSSN(data.ssn)) {
          newErrors.ssn = 'Valid SSN is required';
        }
        if (!data.phone || !validatePhone(data.phone)) {
          newErrors.phone = 'Valid phone number is required';
        }
        if (!data.certifyTruth) {
          newErrors.certifyTruth = 'You must certify the truthfulness of your statements';
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
      // Submit innocent spouse relief request
      console.log('Submitting innocent spouse relief request:', data);
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
      case 0: // Relief Type
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
                    <h4>About Innocent Spouse Relief</h4>
                    <p>
                      Innocent Spouse Relief may relieve you from additional tax, interest, and penalties 
                      if your spouse or former spouse failed to report income, reported income improperly, 
                      or claimed improper deductions or credits.
                    </p>
                  </InfoText>
                </InfoContent>
              </CardContent>
            </InfoBox>
            
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Select Relief Type</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <Label>
                    Type of Relief Requested <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="reliefType"
                        value="traditional"
                        checked={data.reliefType === 'traditional'}
                        onChange={(e) => updateData('reliefType', e.target.value)}
                      />
                      <div>
                        <strong>Traditional Relief</strong>
                        <HelpText>
                          For understatement of tax on joint return due to erroneous items of your spouse
                        </HelpText>
                      </div>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="reliefType"
                        value="separation"
                        checked={data.reliefType === 'separation'}
                        onChange={(e) => updateData('reliefType', e.target.value)}
                      />
                      <div>
                        <strong>Separation of Liability</strong>
                        <HelpText>
                          For divorced or separated taxpayers to allocate understatement between spouses
                        </HelpText>
                      </div>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="reliefType"
                        value="equitable"
                        checked={data.reliefType === 'equitable'}
                        onChange={(e) => updateData('reliefType', e.target.value)}
                      />
                      <div>
                        <strong>Equitable Relief</strong>
                        <HelpText>
                          When you don't qualify for other relief but it would be unfair to hold you liable
                        </HelpText>
                      </div>
                    </RadioLabel>
                  </RadioGroup>
                  {errors.reliefType && <ErrorMessage>{errors.reliefType}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    Tax Years Involved <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: spacing.sm }}>
                    {[2023, 2022, 2021, 2020, 2019, 2018].map(year => (
                      <RadioLabel key={year}>
                        <input
                          type="checkbox"
                          checked={data.taxYears?.includes(year.toString()) || false}
                          onChange={(e) => {
                            const years = data.taxYears || [];
                            if (e.target.checked) {
                              updateData('taxYears', [...years, year.toString()]);
                            } else {
                              updateData('taxYears', years.filter(y => y !== year.toString()));
                            }
                          }}
                        />
                        <span>{year}</span>
                      </RadioLabel>
                    ))}
                  </div>
                  {errors.taxYears && <ErrorMessage>{errors.taxYears}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    Total Tax Liability <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={data.totalLiability || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('totalLiability', parseInt(e.target.value))
                    }
                  />
                  <HelpText>
                    Total amount of tax, interest, and penalties for the years in question
                  </HelpText>
                  {errors.totalLiability && <ErrorMessage>{errors.totalLiability}</ErrorMessage>}
                </FormGroup>
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 1: // Relationship Timeline
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Relationship Information</CardTitle>
              </CardHeader>
              <CardContent>
                <InputRow>
                  <FormGroup>
                    <Label>
                      Marriage Date <RequiredIndicator>*</RequiredIndicator>
                    </Label>
                    <Input
                      type="date"
                      value={data.marriageDate || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('marriageDate', e.target.value)
                      }
                    />
                    {errors.marriageDate && <ErrorMessage>{errors.marriageDate}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>
                      Filing Status for Tax Years
                    </Label>
                    <Select
                      value={data.filingStatus || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateData('filingStatus', e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="joint">Married Filing Jointly</option>
                      <option value="separate">Married Filing Separately</option>
                    </Select>
                  </FormGroup>
                </InputRow>
                
                <FormGroup>
                  <Label>
                    Current Marital Status <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="currentStatus"
                        value="married"
                        checked={data.currentStatus === 'married'}
                        onChange={(e) => updateData('currentStatus', e.target.value)}
                      />
                      <span>Still Married</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="currentStatus"
                        value="divorced"
                        checked={data.currentStatus === 'divorced'}
                        onChange={(e) => updateData('currentStatus', e.target.value)}
                      />
                      <span>Divorced</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="currentStatus"
                        value="separated"
                        checked={data.currentStatus === 'separated'}
                        onChange={(e) => updateData('currentStatus', e.target.value)}
                      />
                      <span>Legally Separated</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="currentStatus"
                        value="widowed"
                        checked={data.currentStatus === 'widowed'}
                        onChange={(e) => updateData('currentStatus', e.target.value)}
                      />
                      <span>Widowed</span>
                    </RadioLabel>
                  </RadioGroup>
                  {errors.currentStatus && <ErrorMessage>{errors.currentStatus}</ErrorMessage>}
                </FormGroup>
                
                {(data.currentStatus === 'divorced' || data.currentStatus === 'separated') && (
                  <InputRow>
                    <FormGroup>
                      <Label>
                        Separation Date <RequiredIndicator>*</RequiredIndicator>
                      </Label>
                      <Input
                        type="date"
                        value={data.separationDate || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          updateData('separationDate', e.target.value)
                        }
                      />
                      {errors.separationDate && <ErrorMessage>{errors.separationDate}</ErrorMessage>}
                    </FormGroup>
                    
                    {data.currentStatus === 'divorced' && (
                      <FormGroup>
                        <Label>Divorce Date</Label>
                        <Input
                          type="date"
                          value={data.divorceDate || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            updateData('divorceDate', e.target.value)
                          }
                        />
                      </FormGroup>
                    )}
                  </InputRow>
                )}
                
                <FormGroup>
                  <Label>
                    Spouse/Former Spouse Name <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Full legal name"
                    value={data.spouseName || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('spouseName', e.target.value)
                    }
                  />
                  {errors.spouseName && <ErrorMessage>{errors.spouseName}</ErrorMessage>}
                </FormGroup>
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 2: // Knowledge Assessment
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Knowledge of Tax Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <Label>
                    Did you know about the understatement when you signed the return? <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="knewOfUnderstatement"
                        value="yes"
                        checked={data.knewOfUnderstatement === true}
                        onChange={() => updateData('knewOfUnderstatement', true)}
                      />
                      <span>Yes</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="knewOfUnderstatement"
                        value="no"
                        checked={data.knewOfUnderstatement === false}
                        onChange={() => updateData('knewOfUnderstatement', false)}
                      />
                      <span>No</span>
                    </RadioLabel>
                  </RadioGroup>
                  {errors.knewOfUnderstatement && <ErrorMessage>{errors.knewOfUnderstatement}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    Did you have reason to know about the understatement? <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="reasonToKnow"
                        value="yes"
                        checked={data.reasonToKnow === true}
                        onChange={() => updateData('reasonToKnow', true)}
                      />
                      <span>Yes</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="reasonToKnow"
                        value="no"
                        checked={data.reasonToKnow === false}
                        onChange={() => updateData('reasonToKnow', false)}
                      />
                      <span>No</span>
                    </RadioLabel>
                  </RadioGroup>
                  {errors.reasonToKnow && <ErrorMessage>{errors.reasonToKnow}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>Were you forced or threatened to sign the return?</Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="signedUnderDuress"
                        value="yes"
                        checked={data.signedUnderDuress === true}
                        onChange={() => updateData('signedUnderDuress', true)}
                      />
                      <span>Yes</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="signedUnderDuress"
                        value="no"
                        checked={data.signedUnderDuress === false}
                        onChange={() => updateData('signedUnderDuress', false)}
                      />
                      <span>No</span>
                    </RadioLabel>
                  </RadioGroup>
                </FormGroup>
                
                <FormGroup>
                  <Label>Did you receive any benefit from the understatement?</Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="benefitFromUnderstatement"
                        value="yes"
                        checked={data.benefitFromUnderstatement === true}
                        onChange={() => updateData('benefitFromUnderstatement', true)}
                      />
                      <span>Yes - Beyond normal support</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="benefitFromUnderstatement"
                        value="no"
                        checked={data.benefitFromUnderstatement === false}
                        onChange={() => updateData('benefitFromUnderstatement', false)}
                      />
                      <span>No - Only normal support</span>
                    </RadioLabel>
                  </RadioGroup>
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    Explain Your Knowledge of the Tax Issues <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <TextArea
                    placeholder="Describe what you knew or didn't know about the income, deductions, or credits in question..."
                    value={data.knowledgeExplanation || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      updateData('knowledgeExplanation', e.target.value)
                    }
                    style={{ minHeight: '150px' }}
                  />
                  {errors.knowledgeExplanation && <ErrorMessage>{errors.knowledgeExplanation}</ErrorMessage>}
                </FormGroup>
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 3: // Financial Control
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Financial Control & Involvement</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <Label>
                    Who handled the household finances? <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="handledFinances"
                        value="self"
                        checked={data.handledFinances === 'self'}
                        onChange={(e) => updateData('handledFinances', e.target.value)}
                      />
                      <span>I handled the finances</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="handledFinances"
                        value="spouse"
                        checked={data.handledFinances === 'spouse'}
                        onChange={(e) => updateData('handledFinances', e.target.value)}
                      />
                      <span>My spouse handled the finances</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="handledFinances"
                        value="both"
                        checked={data.handledFinances === 'both'}
                        onChange={(e) => updateData('handledFinances', e.target.value)}
                      />
                      <span>We both handled finances</span>
                    </RadioLabel>
                  </RadioGroup>
                  {errors.handledFinances && <ErrorMessage>{errors.handledFinances}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    Did you have access to financial records? <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="accessToRecords"
                        value="yes"
                        checked={data.accessToRecords === true}
                        onChange={() => updateData('accessToRecords', true)}
                      />
                      <span>Yes - Full access</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="accessToRecords"
                        value="no"
                        checked={data.accessToRecords === false}
                        onChange={() => updateData('accessToRecords', false)}
                      />
                      <span>No - Limited or no access</span>
                    </RadioLabel>
                  </RadioGroup>
                  {errors.accessToRecords && <ErrorMessage>{errors.accessToRecords}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>Did you review the tax returns before signing?</Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="reviewedReturns"
                        value="yes"
                        checked={data.reviewedReturns === true}
                        onChange={() => updateData('reviewedReturns', true)}
                      />
                      <span>Yes - I reviewed them</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="reviewedReturns"
                        value="no"
                        checked={data.reviewedReturns === false}
                        onChange={() => updateData('reviewedReturns', false)}
                      />
                      <span>No - I signed without reviewing</span>
                    </RadioLabel>
                  </RadioGroup>
                </FormGroup>
                
                <FormGroup>
                  <Label>Did you question any items on the return?</Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="questionedItems"
                        value="yes"
                        checked={data.questionedItems === true}
                        onChange={() => updateData('questionedItems', true)}
                      />
                      <span>Yes - I asked questions</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="questionedItems"
                        value="no"
                        checked={data.questionedItems === false}
                        onChange={() => updateData('questionedItems', false)}
                      />
                      <span>No - I didn't question anything</span>
                    </RadioLabel>
                  </RadioGroup>
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    Describe Your Financial Involvement <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <TextArea
                    placeholder="Explain your role in household finances, any restrictions on access to money or records, and why you may not have known about the tax issues..."
                    value={data.financialControlDetails || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      updateData('financialControlDetails', e.target.value)
                    }
                    style={{ minHeight: '120px' }}
                  />
                  {errors.financialControlDetails && <ErrorMessage>{errors.financialControlDetails}</ErrorMessage>}
                </FormGroup>
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 4: // Current Situation
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Current Financial Situation</CardTitle>
              </CardHeader>
              <CardContent>
                <InputRow>
                  <FormGroup>
                    <Label>
                      Current Monthly Income <RequiredIndicator>*</RequiredIndicator>
                    </Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.currentIncome || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('currentIncome', parseInt(e.target.value) || 0)
                      }
                    />
                    {errors.currentIncome && <ErrorMessage>{errors.currentIncome}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>
                      Monthly Living Expenses <RequiredIndicator>*</RequiredIndicator>
                    </Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.monthlyExpenses || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('monthlyExpenses', parseInt(e.target.value) || 0)
                      }
                    />
                    {errors.monthlyExpenses && <ErrorMessage>{errors.monthlyExpenses}</ErrorMessage>}
                  </FormGroup>
                </InputRow>
                
                <FormGroup>
                  <Label>Would paying this tax cause economic hardship?</Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="sufferHardship"
                        value="yes"
                        checked={data.sufferHardship === true}
                        onChange={() => updateData('sufferHardship', true)}
                      />
                      <span>Yes - It would cause hardship</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="sufferHardship"
                        value="no"
                        checked={data.sufferHardship === false}
                        onChange={() => updateData('sufferHardship', false)}
                      />
                      <span>No - I could afford to pay</span>
                    </RadioLabel>
                  </RadioGroup>
                </FormGroup>
                
                {data.sufferHardship && (
                  <FormGroup>
                    <Label>
                      Explain the Hardship <RequiredIndicator>*</RequiredIndicator>
                    </Label>
                    <TextArea
                      placeholder="Describe how paying this tax would affect your ability to meet basic living expenses..."
                      value={data.hardshipExplanation || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        updateData('hardshipExplanation', e.target.value)
                      }
                    />
                    {errors.hardshipExplanation && <ErrorMessage>{errors.hardshipExplanation}</ErrorMessage>}
                  </FormGroup>
                )}
                
                <FormGroup>
                  <Label>Were/are you a victim of spousal abuse or domestic violence?</Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="abuseVictim"
                        value="yes"
                        checked={data.abuseVictim === true}
                        onChange={() => updateData('abuseVictim', true)}
                      />
                      <span>Yes</span>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="abuseVictim"
                        value="no"
                        checked={data.abuseVictim === false}
                        onChange={() => updateData('abuseVictim', false)}
                      />
                      <span>No</span>
                    </RadioLabel>
                  </RadioGroup>
                </FormGroup>
                
                {data.abuseVictim && (
                  <InfoBox>
                    <CardContent>
                      <InfoContent>
                        <InfoIcon>💜</InfoIcon>
                        <InfoText>
                          <h4>Support Available</h4>
                          <p>
                            If you're experiencing abuse, help is available. The National Domestic Violence 
                            Hotline: 1-800-799-7233. Your safety is important, and this information will 
                            be kept confidential.
                          </p>
                        </InfoText>
                      </InfoContent>
                    </CardContent>
                  </InfoBox>
                )}
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 5: // Supporting Documents
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <DocumentUploadSection variant="elevated">
              <CardHeader>
                <CardTitle>Supporting Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ marginBottom: spacing.lg }}>
                  <p style={{ marginBottom: spacing.md }}>
                    Please upload documents that support your request:
                  </p>
                  <ul style={{ paddingLeft: spacing.lg, fontSize: typography.fontSize.sm }}>
                    <li>Tax returns for the years in question</li>
                    <li>Divorce decree or separation agreement</li>
                    <li>Financial records showing lack of knowledge/benefit</li>
                    <li>Court documents</li>
                    <li>Medical records (if claiming abuse or duress)</li>
                    <li>Current financial statements</li>
                    <li>Any correspondence with your spouse about taxes</li>
                    <li>Other relevant documentation</li>
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
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <SummarySection variant="elevated">
              <CardHeader>
                <CardTitle>Review Your Request</CardTitle>
              </CardHeader>
              <CardContent>
                <SummaryGrid>
                  <SummaryItem>
                    <h4>Relief Type</h4>
                    <p>{data.reliefType === 'traditional' ? 'Traditional Relief' :
                        data.reliefType === 'separation' ? 'Separation of Liability' :
                        'Equitable Relief'}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Tax Years</h4>
                    <p>{data.taxYears?.join(', ')}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Total Liability</h4>
                    <p>{formatCurrency(data.totalLiability || 0)}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Current Status</h4>
                    <p>{data.currentStatus?.charAt(0).toUpperCase() + (data.currentStatus?.slice(1) || '')}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Knowledge of Issues</h4>
                    <p>{data.knewOfUnderstatement ? 'Had knowledge' : 'No knowledge'}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Documents</h4>
                    <p>{data.documents?.length || 0} files uploaded</p>
                  </SummaryItem>
                </SummaryGrid>
              </CardContent>
            </SummarySection>
            
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Contact Information & Signature</CardTitle>
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
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={data.email || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('email', e.target.value)
                    }
                  />
                </FormGroup>
                
                <Card variant="outlined" style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
                  <h4 style={{ marginBottom: spacing.md }}>Important Notice</h4>
                  <p style={{ fontSize: typography.fontSize.sm, lineHeight: 1.6 }}>
                    By submitting this request, you understand that:
                  </p>
                  <ul style={{ paddingLeft: spacing.lg, fontSize: typography.fontSize.sm, marginTop: spacing.sm }}>
                    <li>The IRS will notify your spouse/former spouse of this request</li>
                    <li>They have the right to participate in the process</li>
                    <li>You may need to provide additional information</li>
                    <li>The review process typically takes 6-12 months</li>
                  </ul>
                </Card>
                
                <FormGroup>
                  <RadioLabel>
                    <input
                      type="checkbox"
                      checked={data.certifyTruth || false}
                      onChange={(e) => updateData('certifyTruth', e.target.checked)}
                    />
                    <span>
                      I certify under penalty of perjury that all information provided is true and correct
                    </span>
                  </RadioLabel>
                  {errors.certifyTruth && <ErrorMessage>{errors.certifyTruth}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    Electronic Signature (Full Legal Name) <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Your full legal name"
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
          <WorkflowTitle>Innocent Spouse Relief Request</WorkflowTitle>
          <WorkflowSubtitle>
            Request relief from joint tax liability
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
            {currentStep === steps.length - 1 ? 'Submit Request' : 'Continue'}
          </Button>
        </NavigationSection>
      </MainContent>
    </WorkflowContainer>
  );
};

export default InnocentSpouseRelief;