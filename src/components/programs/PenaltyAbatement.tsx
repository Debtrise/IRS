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

interface PenaltyAbatementData {
  // Step 1: Penalty Type
  penaltyType?: 'first-time' | 'reasonable-cause';
  penaltyAmount?: number;
  taxYear?: string;
  penaltyNotice?: string;
  
  // Step 2: Eligibility Check (First-Time)
  priorCompliance?: boolean;
  noPaymentPlans?: boolean;
  noPriorPenalties?: boolean;
  
  // Step 3: Reasonable Cause
  reasonCategory?: 'death' | 'illness' | 'disaster' | 'records' | 'advice' | 'other';
  reasonDetails?: string;
  eventDate?: string;
  impactExplanation?: string;
  
  // Step 4: Supporting Documents
  documents?: File[];
  documentTypes?: string[];
  
  // Step 5: Contact Information
  ssn?: string;
  phone?: string;
  email?: string;
  mailingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  
  // Step 6: Review
  certifyAccuracy?: boolean;
  signatureName?: string;
}

const PenaltyAbatement: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<PenaltyAbatementData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  
  const steps = data.penaltyType === 'first-time' 
    ? ['Penalty Information', 'Eligibility Check', 'Supporting Documents', 'Contact Information', 'Review & Submit']
    : ['Penalty Information', 'Reasonable Cause', 'Supporting Documents', 'Contact Information', 'Review & Submit'];
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  const updateData = (field: keyof PenaltyAbatementData | string, value: any) => {
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
      case 0: // Penalty Information
        if (!data.penaltyType) {
          newErrors.penaltyType = 'Please select a penalty abatement type';
        }
        if (!data.penaltyAmount) {
          newErrors.penaltyAmount = 'Penalty amount is required';
        }
        if (!data.taxYear) {
          newErrors.taxYear = 'Tax year is required';
        }
        break;
        
      case 1: // Eligibility Check or Reasonable Cause
        if (data.penaltyType === 'first-time') {
          if (!data.priorCompliance) {
            newErrors.priorCompliance = 'You must have filed all required returns to qualify';
          }
          if (!data.noPriorPenalties) {
            newErrors.noPriorPenalties = 'You must have no penalties in the prior 3 years to qualify';
          }
        } else {
          if (!data.reasonCategory) {
            newErrors.reasonCategory = 'Please select a reason category';
          }
          if (!data.reasonDetails || data.reasonDetails.length < 100) {
            newErrors.reasonDetails = 'Please provide detailed explanation (at least 100 characters)';
          }
          if (!data.eventDate) {
            newErrors.eventDate = 'Please provide the date of the event';
          }
        }
        break;
        
      case 2: // Supporting Documents
        if (data.penaltyType === 'reasonable-cause' && (!data.documents || data.documents.length === 0)) {
          newErrors.documents = 'Supporting documentation is required for reasonable cause requests';
        }
        break;
        
      case 3: // Contact Information
        if (!data.ssn || !validateSSN(data.ssn)) {
          newErrors.ssn = 'Valid SSN is required';
        }
        if (!data.phone || !validatePhone(data.phone)) {
          newErrors.phone = 'Valid phone number is required';
        }
        if (!data.mailingAddress?.street) {
          newErrors['mailingAddress.street'] = 'Street address is required';
        }
        if (!data.mailingAddress?.city) {
          newErrors['mailingAddress.city'] = 'City is required';
        }
        if (!data.mailingAddress?.state) {
          newErrors['mailingAddress.state'] = 'State is required';
        }
        if (!data.mailingAddress?.zip) {
          newErrors['mailingAddress.zip'] = 'ZIP code is required';
        }
        break;
        
      case 4: // Review
        if (!data.certifyAccuracy) {
          newErrors.certifyAccuracy = 'You must certify the accuracy of your information';
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
      // Submit penalty abatement request
      console.log('Submitting penalty abatement request:', data);
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
    const actualStep = data.penaltyType === 'first-time' ? currentStep : 
                      currentStep === 1 ? 'reasonable-cause' : currentStep;
    
    switch (actualStep) {
      case 0: // Penalty Information
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
                    <h4>About Penalty Abatement</h4>
                    <p>
                      The IRS may remove or reduce penalties if you qualify for First-Time Abatement 
                      or can show reasonable cause for not meeting your tax obligations.
                    </p>
                  </InfoText>
                </InfoContent>
              </CardContent>
            </InfoBox>
            
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Select Penalty Abatement Type</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <Label>
                    Type of Request <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="penaltyType"
                        value="first-time"
                        checked={data.penaltyType === 'first-time'}
                        onChange={(e) => {
                          updateData('penaltyType', e.target.value);
                          setCurrentStep(0); // Reset workflow
                        }}
                      />
                      <div>
                        <strong>First-Time Abatement (FTA)</strong>
                        <HelpText>
                          For taxpayers with a clean compliance history. This is the easiest type to qualify for.
                        </HelpText>
                      </div>
                    </RadioLabel>
                    
                    <RadioLabel>
                      <input
                        type="radio"
                        name="penaltyType"
                        value="reasonable-cause"
                        checked={data.penaltyType === 'reasonable-cause'}
                        onChange={(e) => {
                          updateData('penaltyType', e.target.value);
                          setCurrentStep(0); // Reset workflow
                        }}
                      />
                      <div>
                        <strong>Reasonable Cause</strong>
                        <HelpText>
                          For taxpayers who had circumstances beyond their control that prevented compliance.
                        </HelpText>
                      </div>
                    </RadioLabel>
                  </RadioGroup>
                  {errors.penaltyType && <ErrorMessage>{errors.penaltyType}</ErrorMessage>}
                </FormGroup>
                
                <InputRow>
                  <FormGroup>
                    <Label>
                      Penalty Amount <RequiredIndicator>*</RequiredIndicator>
                    </Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={data.penaltyAmount || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('penaltyAmount', parseInt(e.target.value))
                      }
                    />
                    {errors.penaltyAmount && <ErrorMessage>{errors.penaltyAmount}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>
                      Tax Year <RequiredIndicator>*</RequiredIndicator>
                    </Label>
                    <Select
                      value={data.taxYear || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateData('taxYear', e.target.value)}
                    >
                      <option value="">Select year</option>
                      {[2023, 2022, 2021, 2020, 2019, 2018].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </Select>
                    {errors.taxYear && <ErrorMessage>{errors.taxYear}</ErrorMessage>}
                  </FormGroup>
                </InputRow>
                
                <FormGroup>
                  <Label>IRS Notice Number (if available)</Label>
                  <Input
                    type="text"
                    placeholder="e.g., CP14, CP501"
                    value={data.penaltyNotice || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('penaltyNotice', e.target.value)
                    }
                  />
                  <HelpText>
                    Found at the top right of your IRS notice
                  </HelpText>
                </FormGroup>
              </CardContent>
            </FormSection>
          </motion.div>
        );
        
      case 1: // First-Time Eligibility Check
        if (data.penaltyType === 'first-time') {
          return (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FormSection variant="elevated">
                <CardHeader>
                  <CardTitle>First-Time Abatement Eligibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <InfoBox style={{ marginBottom: spacing.lg }}>
                    <CardContent>
                      <InfoContent>
                        <InfoIcon>✅</InfoIcon>
                        <InfoText>
                          <h4>FTA Requirements</h4>
                          <p>
                            To qualify for First-Time Abatement, you must meet all three requirements below. 
                            The IRS will verify this information automatically.
                          </p>
                        </InfoText>
                      </InfoContent>
                    </CardContent>
                  </InfoBox>
                  
                  <FormGroup>
                    <RadioLabel>
                      <input
                        type="checkbox"
                        checked={data.priorCompliance || false}
                        onChange={(e) => updateData('priorCompliance', e.target.checked)}
                      />
                      <div>
                        <strong>Filing Compliance</strong>
                        <HelpText>
                          I have filed all currently required tax returns or filed an extension
                        </HelpText>
                      </div>
                    </RadioLabel>
                    {errors.priorCompliance && <ErrorMessage>{errors.priorCompliance}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <RadioLabel>
                      <input
                        type="checkbox"
                        checked={data.noPaymentPlans || false}
                        onChange={(e) => updateData('noPaymentPlans', e.target.checked)}
                      />
                      <div>
                        <strong>Payment Compliance</strong>
                        <HelpText>
                          I have paid, or arranged to pay, any tax due
                        </HelpText>
                      </div>
                    </RadioLabel>
                  </FormGroup>
                  
                  <FormGroup>
                    <RadioLabel>
                      <input
                        type="checkbox"
                        checked={data.noPriorPenalties || false}
                        onChange={(e) => updateData('noPriorPenalties', e.target.checked)}
                      />
                      <div>
                        <strong>Clean Penalty History</strong>
                        <HelpText>
                          I have not had any penalties (except estimated tax penalties) for the 3 tax years 
                          prior to the tax year in which I received a penalty
                        </HelpText>
                      </div>
                    </RadioLabel>
                    {errors.noPriorPenalties && <ErrorMessage>{errors.noPriorPenalties}</ErrorMessage>}
                  </FormGroup>
                  
                  {data.priorCompliance && data.noPaymentPlans && data.noPriorPenalties && (
                    <Card variant="outlined" style={{ background: colors.success[50], padding: spacing.lg }}>
                      <h4 style={{ color: colors.success[700], marginBottom: spacing.sm }}>
                        ✅ You appear to qualify for First-Time Abatement!
                      </h4>
                      <p style={{ fontSize: typography.fontSize.sm }}>
                        Based on your responses, you meet the requirements for FTA. This is typically 
                        approved automatically when requested.
                      </p>
                    </Card>
                  )}
                </CardContent>
              </FormSection>
            </motion.div>
          );
        }
        // Fall through to reasonable cause
        
      case 'reasonable-cause': // Reasonable Cause Details
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Reasonable Cause Explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <Label>
                    Reason Category <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Select
                    value={data.reasonCategory || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateData('reasonCategory', e.target.value)}
                  >
                    <option value="">Select reason</option>
                    <option value="death">Death in immediate family</option>
                    <option value="illness">Serious illness or hospitalization</option>
                    <option value="disaster">Natural disaster or fire</option>
                    <option value="records">Unable to obtain records</option>
                    <option value="advice">Erroneous advice from IRS or tax professional</option>
                    <option value="other">Other circumstances</option>
                  </Select>
                  {errors.reasonCategory && <ErrorMessage>{errors.reasonCategory}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    Date of Event <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    type="date"
                    value={data.eventDate || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateData('eventDate', e.target.value)
                    }
                  />
                  <HelpText>
                    When did the circumstances that prevented compliance occur?
                  </HelpText>
                  {errors.eventDate && <ErrorMessage>{errors.eventDate}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    Detailed Explanation <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <TextArea
                    placeholder="Provide a detailed explanation of the circumstances that prevented you from meeting your tax obligations..."
                    value={data.reasonDetails || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      updateData('reasonDetails', e.target.value)
                    }
                    style={{ minHeight: '150px' }}
                  />
                  <HelpText>
                    Be specific about dates, events, and how they directly prevented compliance
                  </HelpText>
                  {errors.reasonDetails && <ErrorMessage>{errors.reasonDetails}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>How did this prevent compliance?</Label>
                  <TextArea
                    placeholder="Explain how the circumstances directly prevented you from filing or paying on time..."
                    value={data.impactExplanation || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      updateData('impactExplanation', e.target.value)
                    }
                    style={{ minHeight: '120px' }}
                  />
                </FormGroup>
                
                {data.reasonCategory === 'disaster' && (
                  <InfoBox>
                    <CardContent>
                      <InfoContent>
                        <InfoIcon>🌪️</InfoIcon>
                        <InfoText>
                          <h4>Disaster Relief</h4>
                          <p>
                            If you were affected by a federally declared disaster, include the 
                            FEMA declaration number and any insurance claim documentation.
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
        
      case 2: // Supporting Documents
        const requiredDocs = {
          death: ['Death certificate', 'Obituary', 'Funeral documents'],
          illness: ['Hospital records', 'Doctor statements', 'Medical bills'],
          disaster: ['Insurance claims', 'FEMA documentation', 'News articles'],
          records: ['Correspondence showing attempts', 'Third-party statements'],
          advice: ['Written advice received', 'Professional engagement letter'],
          other: ['Any relevant documentation']
        };
        
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
                {data.penaltyType === 'reasonable-cause' ? (
                  <div style={{ marginBottom: spacing.lg }}>
                    <p style={{ marginBottom: spacing.md }}>
                      Based on your reason ({data.reasonCategory}), please upload:
                    </p>
                    <ul style={{ paddingLeft: spacing.lg, fontSize: typography.fontSize.sm }}>
                      {requiredDocs[data.reasonCategory as keyof typeof requiredDocs]?.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                      <li>IRS penalty notice</li>
                      <li>Any other supporting evidence</li>
                    </ul>
                  </div>
                ) : (
                  <p style={{ marginBottom: spacing.lg }}>
                    Documentation is optional for First-Time Abatement, but you may upload 
                    your penalty notice or other relevant documents.
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
        
      case 3: // Contact Information
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
                
                <Card variant="outlined" style={{ padding: spacing.lg }}>
                  <h4 style={{ marginBottom: spacing.md }}>Mailing Address</h4>
                  
                  <FormGroup>
                    <Label>
                      Street Address <RequiredIndicator>*</RequiredIndicator>
                    </Label>
                    <Input
                      type="text"
                      placeholder="123 Main St"
                      value={data.mailingAddress?.street || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateData('mailingAddress.street', e.target.value)
                      }
                    />
                    {errors['mailingAddress.street'] && <ErrorMessage>{errors['mailingAddress.street']}</ErrorMessage>}
                  </FormGroup>
                  
                  <InputRow>
                    <FormGroup>
                      <Label>
                        City <RequiredIndicator>*</RequiredIndicator>
                      </Label>
                      <Input
                        type="text"
                        placeholder="New York"
                        value={data.mailingAddress?.city || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          updateData('mailingAddress.city', e.target.value)
                        }
                      />
                      {errors['mailingAddress.city'] && <ErrorMessage>{errors['mailingAddress.city']}</ErrorMessage>}
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>
                        State <RequiredIndicator>*</RequiredIndicator>
                      </Label>
                      <Select
                        value={data.mailingAddress?.state || ''}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateData('mailingAddress.state', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="NY">NY</option>
                        <option value="CA">CA</option>
                        <option value="TX">TX</option>
                        {/* Add all states */}
                      </Select>
                      {errors['mailingAddress.state'] && <ErrorMessage>{errors['mailingAddress.state']}</ErrorMessage>}
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>
                        ZIP Code <RequiredIndicator>*</RequiredIndicator>
                      </Label>
                      <Input
                        type="text"
                        placeholder="10001"
                        value={data.mailingAddress?.zip || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          updateData('mailingAddress.zip', e.target.value)
                        }
                      />
                      {errors['mailingAddress.zip'] && <ErrorMessage>{errors['mailingAddress.zip']}</ErrorMessage>}
                    </FormGroup>
                  </InputRow>
                </Card>
              </CardContent>
            </FormSection>
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
                <CardTitle>Review Your Request</CardTitle>
              </CardHeader>
              <CardContent>
                <SummaryGrid>
                  <SummaryItem>
                    <h4>Request Type</h4>
                    <p>{data.penaltyType === 'first-time' ? 'First-Time Abatement' : 'Reasonable Cause'}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Penalty Amount</h4>
                    <p>{formatCurrency(data.penaltyAmount || 0)}</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Tax Year</h4>
                    <p>{data.taxYear}</p>
                  </SummaryItem>
                  {data.penaltyType === 'reasonable-cause' && (
                    <SummaryItem>
                      <h4>Reason</h4>
                      <p>{data.reasonCategory?.charAt(0).toUpperCase() + (data.reasonCategory?.slice(1) || '')}</p>
                    </SummaryItem>
                  )}
                  <SummaryItem>
                    <h4>Documents</h4>
                    <p>{data.documents?.length || 0} files uploaded</p>
                  </SummaryItem>
                  <SummaryItem>
                    <h4>Contact</h4>
                    <p>{data.phone}</p>
                  </SummaryItem>
                </SummaryGrid>
                
                {data.penaltyType === 'first-time' ? (
                  <Card variant="outlined" style={{ marginTop: spacing.xl, padding: spacing.lg, background: colors.success[50] }}>
                    <h4 style={{ color: colors.success[700], marginBottom: spacing.sm }}>
                      First-Time Abatement Request
                    </h4>
                    <p style={{ fontSize: typography.fontSize.sm }}>
                      Your request will be processed automatically. Most FTA requests are approved 
                      immediately if you meet the requirements. You should receive a notice within 
                      30 days.
                    </p>
                  </Card>
                ) : (
                  <Card variant="outlined" style={{ marginTop: spacing.xl, padding: spacing.lg }}>
                    <h4 style={{ marginBottom: spacing.sm }}>
                      Reasonable Cause Request
                    </h4>
                    <div style={{ fontSize: typography.fontSize.sm, marginBottom: spacing.md }}>
                      <strong>Your explanation:</strong>
                      <p style={{ marginTop: spacing.sm }}>{data.reasonDetails}</p>
                    </div>
                    <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                      The IRS will review your documentation and circumstances. This typically 
                      takes 30-60 days for a decision.
                    </p>
                  </Card>
                )}
              </CardContent>
            </SummarySection>
            
            <FormSection variant="elevated">
              <CardHeader>
                <CardTitle>Certification & Signature</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <RadioLabel>
                    <input
                      type="checkbox"
                      checked={data.certifyAccuracy || false}
                      onChange={(e) => updateData('certifyAccuracy', e.target.checked)}
                    />
                    <span>
                      I certify that all information provided is true, correct, and complete
                    </span>
                  </RadioLabel>
                  {errors.certifyAccuracy && <ErrorMessage>{errors.certifyAccuracy}</ErrorMessage>}
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
          <WorkflowTitle>Penalty Abatement Request</WorkflowTitle>
          <WorkflowSubtitle>
            Apply to have IRS penalties removed or reduced
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

export default PenaltyAbatement;