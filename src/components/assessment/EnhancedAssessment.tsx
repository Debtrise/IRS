import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTransitionNavigation } from '../../hooks/useTransitionNavigation';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../theme';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import Logo from '../common/Logo';

const AssessmentContainer = styled.div`
  min-height: 100vh;
  background: ${colors.white};
`;

const TopHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${colors.gray[100]};
  z-index: 50;
  padding: ${spacing.lg} 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const TopHeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  padding-top: 100px;
  max-width: 900px;
  margin: 0 auto;
  padding: 100px ${spacing.lg} ${spacing['2xl']};
  
  @media (min-width: ${breakpoints.md}) {
    padding: 120px ${spacing.xl} ${spacing['3xl']};
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${spacing['2xl']};
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['4xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.lg};
  font-family: ${typography.fontFamily.heading};
  letter-spacing: -0.02em;
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.fontSize['5xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${typography.fontSize.xl};
  color: ${colors.gray[600]};
  max-width: 700px;
  margin: 0 auto;
  font-family: ${typography.fontFamily.body};
  line-height: 1.6;
`;

const ProgressContainer = styled.div`
  margin-bottom: ${spacing['3xl']};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${colors.gray[100]};
  border-radius: ${radius.full};
  overflow: hidden;
  margin-bottom: ${spacing.lg};
`;

const ProgressFill = styled(motion.div)<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%);
  border-radius: ${radius.full};
  width: ${props => props.progress}%;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.3);
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: ${typography.fontSize.sm};
  color: ${colors.gray[500]};
  font-family: ${typography.fontFamily.body};
  font-weight: ${typography.fontWeight.medium};
`;

const QuestionCard = styled(Card)`
  margin-bottom: ${spacing['2xl']};
  border: 1px solid ${colors.gray[100]};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border-radius: ${radius['2xl']};
  overflow: hidden;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
  }
`;

const QuestionTitle = styled.h2`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing['2xl']};
  font-family: ${typography.fontFamily.heading};
  letter-spacing: -0.01em;
`;

const QuestionGrid = styled.div`
  display: grid;
  gap: ${spacing.lg};
  
  @media (min-width: ${breakpoints.sm}) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
`;

const OptionButton = styled(motion.button)<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  padding: ${spacing.xl};
  border: 2px solid ${props => props.selected ? '#2563EB' : colors.gray[200]};
  background: ${props => props.selected ? '#EFF6FF' : colors.white};
  border-radius: ${radius.xl};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &:hover {
    border-color: ${props => props.selected ? '#2563EB' : '#9CA3AF'};
    background: ${props => props.selected ? '#EFF6FF' : colors.gray[25]};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const OptionIcon = styled.div`
  font-size: ${typography.fontSize['3xl']};
  flex-shrink: 0;
`;

const OptionContent = styled.div`
  flex: 1;
`;

const OptionLabel = styled.div`
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize.lg};
`;

const OptionDescription = styled.div`
  font-size: ${typography.fontSize.base};
  color: ${colors.gray[600]};
  font-family: ${typography.fontFamily.body};
  line-height: 1.5;
`;

const InputGroup = styled.div`
  margin-bottom: ${spacing['2xl']};
`;

const Label = styled.label`
  display: block;
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.md};
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize.base};
`;

const Input = styled.input`
  width: 100%;
  padding: ${spacing.lg};
  border: 2px solid ${colors.gray[200]};
  border-radius: ${radius.lg};
  font-size: ${typography.fontSize.base};
  font-family: ${typography.fontFamily.body};
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  &::placeholder {
    color: ${colors.gray[400]};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${spacing.lg};
  border: 2px solid ${colors.gray[200]};
  border-radius: ${radius.lg};
  font-size: ${typography.fontSize.base};
  font-family: ${typography.fontFamily.body};
  background: ${colors.white};
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${spacing.lg};
  justify-content: space-between;
  margin-top: ${spacing['3xl']};
  padding-top: ${spacing.xl};
  border-top: 1px solid ${colors.gray[100]};
`;

const InfoCard = styled(Card)`
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
  border: 1px solid #BFDBFE;
  margin-bottom: ${spacing['2xl']};
  border-radius: ${radius.xl};
`;

interface AssessmentData {
  totalDebt: string;
  monthlyIncome: string;
  filingStatus: string;
  hasEmergencyIssues: boolean;
  emergencyTypes: string[];
  allReturnsFiled: boolean;
  owesCurrentYear: boolean;
  circumstances: string[];
  previousRelief: boolean;
  bankBalance: string;
  homeEquity: string;
  retirementBalance: string;
}

const EnhancedAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { navigateWithTransition } = useTransitionNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState<Partial<AssessmentData>>({
    emergencyTypes: [],
    circumstances: []
  });

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const updateAssessmentData = useCallback((field: keyof AssessmentData, value: any) => {
    setAssessmentData(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleArrayValue = useCallback((field: 'emergencyTypes' | 'circumstances', value: string) => {
    setAssessmentData(prev => {
      const currentArray = prev[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Navigate to results with assessment data
      navigateWithTransition('/assessment-results');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <QuestionCard>
            <CardContent>
              <QuestionTitle>What's your approximate total tax debt?</QuestionTitle>
              <QuestionGrid>
                {[
                  { value: 'under-10k', label: 'Under $10,000', icon: '💰', description: 'Small debt amount' },
                  { value: '10k-25k', label: '$10,000 - $25,000', icon: '💵', description: 'Moderate debt amount' },
                  { value: '25k-50k', label: '$25,000 - $50,000', icon: '💸', description: 'Substantial debt amount' },
                  { value: '50k-100k', label: '$50,000 - $100,000', icon: '🏦', description: 'Large debt amount' },
                  { value: 'over-100k', label: 'Over $100,000', icon: '🏛️', description: 'Very large debt amount' }
                ].map(option => (
                  <OptionButton
                    key={option.value}
                    selected={assessmentData.totalDebt === option.value}
                    onClick={() => updateAssessmentData('totalDebt', option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <OptionIcon>{option.icon}</OptionIcon>
                    <OptionContent>
                      <OptionLabel>{option.label}</OptionLabel>
                      <OptionDescription>{option.description}</OptionDescription>
                    </OptionContent>
                  </OptionButton>
                ))}
              </QuestionGrid>
            </CardContent>
          </QuestionCard>
        );

      case 2:
        return (
          <QuestionCard>
            <CardContent>
              <QuestionTitle>Do you have any emergency tax issues?</QuestionTitle>
              <InfoCard>
                <CardContent>
                  <p style={{ margin: 0, fontSize: typography.fontSize.sm }}>
                    Emergency issues require immediate attention and may qualify you for expedited relief programs.
                  </p>
                </CardContent>
              </InfoCard>
              <QuestionGrid>
                {[
                  { value: 'yes', label: 'Yes, I have emergency issues', icon: '🚨', description: 'Requires immediate action' },
                  { value: 'no', label: 'No emergency issues', icon: '✅', description: 'Standard processing timeline' }
                ].map(option => (
                  <OptionButton
                    key={option.value}
                    selected={assessmentData.hasEmergencyIssues === (option.value === 'yes')}
                    onClick={() => updateAssessmentData('hasEmergencyIssues', option.value === 'yes')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <OptionIcon>{option.icon}</OptionIcon>
                    <OptionContent>
                      <OptionLabel>{option.label}</OptionLabel>
                      <OptionDescription>{option.description}</OptionDescription>
                    </OptionContent>
                  </OptionButton>
                ))}
              </QuestionGrid>
            </CardContent>
          </QuestionCard>
        );

      case 3:
        if (!assessmentData.hasEmergencyIssues) {
          return renderStep4();
        }
        return (
          <QuestionCard>
            <CardContent>
              <QuestionTitle>What type of emergency issues do you have?</QuestionTitle>
              <p style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>
                Select all that apply:
              </p>
              <QuestionGrid>
                {[
                  { value: 'wage-garnishment', label: 'Wage Garnishment', icon: '💼', description: 'IRS is taking money from your paycheck' },
                  { value: 'bank-levy', label: 'Bank Levy', icon: '🏦', description: 'IRS has frozen or seized your bank account' },
                  { value: 'asset-seizure', label: 'Asset Seizure', icon: '🏠', description: 'IRS has seized property or assets' },
                  { value: 'business-closure', label: 'Business Closure Threat', icon: '🏢', description: 'IRS is threatening to close your business' }
                ].map(option => (
                  <OptionButton
                    key={option.value}
                    selected={assessmentData.emergencyTypes?.includes(option.value) || false}
                    onClick={() => toggleArrayValue('emergencyTypes', option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <OptionIcon>{option.icon}</OptionIcon>
                    <OptionContent>
                      <OptionLabel>{option.label}</OptionLabel>
                      <OptionDescription>{option.description}</OptionDescription>
                    </OptionContent>
                  </OptionButton>
                ))}
              </QuestionGrid>
            </CardContent>
          </QuestionCard>
        );

      case 4:
        return renderStep4();

      case 5:
        return (
          <QuestionCard>
            <CardContent>
              <QuestionTitle>What's your current filing status?</QuestionTitle>
              <InputGroup>
                <Label htmlFor="filingStatus">Filing Status</Label>
                <Select
                  id="filingStatus"
                  value={assessmentData.filingStatus || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateAssessmentData('filingStatus', e.target.value)}
                >
                  <option value="">Select filing status</option>
                  <option value="single">Single</option>
                  <option value="married-filing-jointly">Married Filing Jointly</option>
                  <option value="married-filing-separately">Married Filing Separately</option>
                  <option value="head-of-household">Head of Household</option>
                  <option value="qualifying-widow">Qualifying Widow(er)</option>
                </Select>
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="monthlyIncome">Monthly Net Income</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="Enter your monthly net income"
                  value={assessmentData.monthlyIncome || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAssessmentData('monthlyIncome', e.target.value)}
                />
              </InputGroup>
            </CardContent>
          </QuestionCard>
        );

      case 6:
        return (
          <QuestionCard>
            <CardContent>
              <QuestionTitle>Financial Assets Information</QuestionTitle>
              <p style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>
                This helps us determine your eligibility for certain relief programs:
              </p>
              
              <InputGroup>
                <Label htmlFor="bankBalance">Current Bank Account Balance</Label>
                <Input
                  id="bankBalance"
                  type="number"
                  placeholder="Enter total in all accounts"
                  value={assessmentData.bankBalance || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAssessmentData('bankBalance', e.target.value)}
                />
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="homeEquity">Home Equity (if applicable)</Label>
                <Input
                  id="homeEquity"
                  type="number"
                  placeholder="Estimated equity in your home"
                  value={assessmentData.homeEquity || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAssessmentData('homeEquity', e.target.value)}
                />
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="retirementBalance">Retirement Account Balance</Label>
                <Input
                  id="retirementBalance"
                  type="number"
                  placeholder="401k, IRA, etc."
                  value={assessmentData.retirementBalance || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAssessmentData('retirementBalance', e.target.value)}
                />
              </InputGroup>
            </CardContent>
          </QuestionCard>
        );

      case 7:
        return (
          <QuestionCard>
            <CardContent>
              <QuestionTitle>Special Circumstances</QuestionTitle>
              <p style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>
                Select any that apply to your situation:
              </p>
              <QuestionGrid>
                {[
                  { value: 'divorce', label: 'Recent Divorce/Separation', icon: '💔', description: 'May qualify for innocent spouse relief' },
                  { value: 'medical', label: 'Medical Hardship', icon: '🏥', description: 'Serious illness or medical expenses' },
                  { value: 'unemployment', label: 'Unemployment', icon: '💼', description: 'Job loss or reduced income' },
                  { value: 'disability', label: 'Disability', icon: '♿', description: 'Physical or mental disability' },
                  { value: 'covid', label: 'COVID-19 Impact', icon: '😷', description: 'Pandemic-related financial hardship' },
                  { value: 'business', label: 'Business Closure', icon: '🏢', description: 'Business failed or closed' }
                ].map(option => (
                  <OptionButton
                    key={option.value}
                    selected={assessmentData.circumstances?.includes(option.value) || false}
                    onClick={() => toggleArrayValue('circumstances', option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <OptionIcon>{option.icon}</OptionIcon>
                    <OptionContent>
                      <OptionLabel>{option.label}</OptionLabel>
                      <OptionDescription>{option.description}</OptionDescription>
                    </OptionContent>
                  </OptionButton>
                ))}
              </QuestionGrid>
            </CardContent>
          </QuestionCard>
        );

      case 8:
        return (
          <QuestionCard>
            <CardContent>
              <QuestionTitle>Previous Tax Relief History</QuestionTitle>
              <QuestionGrid>
                {[
                  { value: 'yes', label: 'Yes, I\'ve received relief before', icon: '📋', description: 'Previous penalty abatement, OIC, etc.' },
                  { value: 'no', label: 'No, this is my first time', icon: '🆕', description: 'May qualify for first-time abatement' }
                ].map(option => (
                  <OptionButton
                    key={option.value}
                    selected={assessmentData.previousRelief === (option.value === 'yes')}
                    onClick={() => updateAssessmentData('previousRelief', option.value === 'yes')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <OptionIcon>{option.icon}</OptionIcon>
                    <OptionContent>
                      <OptionLabel>{option.label}</OptionLabel>
                      <OptionDescription>{option.description}</OptionDescription>
                    </OptionContent>
                  </OptionButton>
                ))}
              </QuestionGrid>
            </CardContent>
          </QuestionCard>
        );

      default:
        return null;
    }
  };

  const renderStep4 = () => (
    <QuestionCard>
      <CardContent>
        <QuestionTitle>Tax Return Filing Status</QuestionTitle>
        <QuestionGrid>
          {[
            { value: 'yes', label: 'All returns filed', icon: '✅', description: 'You\'ve filed all required tax returns' },
            { value: 'no', label: 'Missing some returns', icon: '❌', description: 'You have unfiled tax returns' },
            { value: 'partial', label: 'Not sure/Some filed', icon: '❓', description: 'You\'re unsure about your filing status' }
          ].map(option => (
            <OptionButton
              key={option.value}
              selected={assessmentData.allReturnsFiled === (option.value === 'yes')}
              onClick={() => updateAssessmentData('allReturnsFiled', option.value === 'yes')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <OptionIcon>{option.icon}</OptionIcon>
              <OptionContent>
                <OptionLabel>{option.label}</OptionLabel>
                <OptionDescription>{option.description}</OptionDescription>
              </OptionContent>
            </OptionButton>
          ))}
        </QuestionGrid>
      </CardContent>
    </QuestionCard>
  );

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1: return !!assessmentData.totalDebt;
      case 2: return assessmentData.hasEmergencyIssues !== undefined;
      case 3: return !assessmentData.hasEmergencyIssues || (assessmentData.emergencyTypes?.length ?? 0) > 0;
      case 4: return assessmentData.allReturnsFiled !== undefined;
      case 5: return !!assessmentData.filingStatus && !!assessmentData.monthlyIncome;
      case 6: return true; // Optional fields
      case 7: return true; // Optional fields
      case 8: return assessmentData.previousRelief !== undefined;
      default: return false;
    }
  }, [currentStep, assessmentData]);

  return (
    <AssessmentContainer>
      <TopHeader>
        <TopHeaderContent>
          <LogoContainer onClick={() => navigateWithTransition('/')}>
            <Logo variant="owl" size="large" />
          </LogoContainer>
          <Button variant="ghost" onClick={() => navigateWithTransition('/')}>
            Exit Assessment
          </Button>
        </TopHeaderContent>
      </TopHeader>

      <ContentContainer>
        <Header>
          <Title>Enhanced Tax Debt Assessment</Title>
          <Subtitle>
            Help us understand your situation so we can find the best relief options for you
          </Subtitle>
        </Header>

        <ProgressContainer>
          <ProgressBar>
            <ProgressFill
              progress={progress}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </ProgressBar>
          <ProgressText>
            Step {currentStep} of {totalSteps} ({Math.round(progress)}% complete)
          </ProgressText>
        </ProgressContainer>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <ButtonContainer>
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed}
          >
            {currentStep === totalSteps ? 'View Results' : 'Next'}
          </Button>
        </ButtonContainer>
      </ContentContainer>
    </AssessmentContainer>
  );
};

export default EnhancedAssessment;
