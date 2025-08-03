import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints, transitions } from '../../theme';
import Button from '../common/Button';
import Card from '../common/Card';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.white} 50%, ${colors.gray[50]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg};
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  gap: ${spacing['3xl']};
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
    gap: ${spacing['4xl']};
  }
`;

const ValueSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[700]};
  margin-bottom: ${spacing['3xl']};
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const Headline = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  line-height: ${typography.lineHeight.tight};
  margin-bottom: ${spacing.xl};
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.fontSize['4xl']};
  }
`;

const Subheadline = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
  margin-bottom: ${spacing['2xl']};
`;

const ValueProps = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  margin-bottom: ${spacing['3xl']};
`;

const ValueProp = styled(motion.div)`
  display: flex;
  gap: ${spacing.md};
  align-items: flex-start;
`;

const ValueIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${colors.primary[100]};
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 24px;
`;

const ValueContent = styled.div``;

const ValueTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const ValueDescription = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
`;

const GuaranteeCard = styled(Card)`
  background: ${colors.success[50]};
  border: 2px solid ${colors.success[200]};
  padding: ${spacing.xl};
`;

const GuaranteeTitle = styled.h4`
  color: ${colors.success[700]};
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.bold};
  margin-bottom: ${spacing.sm};
`;

const GuaranteeText = styled.p`
  color: ${colors.success[700]};
  font-size: ${typography.fontSize.base};
  line-height: ${typography.lineHeight.relaxed};
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FormCard = styled(Card)`
  padding: ${spacing['3xl']};
  width: 100%;
`;

const FormTitle = styled.h2`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.md};
  text-align: center;
`;

const FormSubtitle = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  text-align: center;
  margin-bottom: ${spacing['2xl']};
`;

const ProgressBar = styled.div`
  display: flex;
  gap: ${spacing.xs};
  margin-bottom: ${spacing['2xl']};
`;

const ProgressStep = styled.div<{ $active: boolean; $completed: boolean }>`
  flex: 1;
  height: 4px;
  background: ${props => 
    props.$completed ? colors.primary[600] : 
    props.$active ? colors.primary[600] : 
    colors.gray[200]
  };
  border-radius: ${radius.full};
  transition: background ${transitions.base};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  background: ${colors.white};
  transition: all ${transitions.base};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
  
  &::placeholder {
    color: ${colors.text.tertiary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  background: ${colors.white};
  transition: all ${transitions.base};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

const ErrorMessage = styled.span`
  display: block;
  font-size: ${typography.fontSize.sm};
  color: ${colors.error[600]};
  margin-top: ${spacing.xs};
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm};
`;

const Checkbox = styled.input`
  margin-top: ${spacing.xs};
`;

const CheckboxLabel = styled.label`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
  
  a {
    color: ${colors.primary[600]};
    text-decoration: underline;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-top: ${spacing.lg};
`;

const TestimonialCard = styled(Card)`
  background: ${colors.gray[50]};
  padding: ${spacing.lg};
  margin-top: ${spacing['2xl']};
`;

const TestimonialText = styled.p`
  font-style: italic;
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.md};
`;

const TestimonialAuthor = styled.p`
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
`;

interface FormData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Step 2
  taxDebt: string;
  taxYears: string;
  hasNotices: boolean;
  
  // Step 3
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  taxDebt?: string;
  taxYears?: string;
  hasNotices?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  agreeToPrivacy?: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    taxDebt: '',
    taxYears: '',
    hasNotices: false,
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof FormErrors]: '' }));
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: FormErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;
      
      case 2:
        if (!formData.taxDebt) newErrors.taxDebt = 'Please select your tax debt amount';
        if (!formData.taxYears.trim()) newErrors.taxYears = 'Please specify the tax years';
        break;
      
      case 3:
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
        if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would send data to your backend
    console.log('Submitting:', formData);
    // Navigate to dashboard or confirmation page
    navigate('/dashboard');
  };

  const calculateSavings = () => {
    const debtAmount = parseInt(formData.taxDebt);
    if (debtAmount) {
      const fee = debtAmount * 0.1;
      const potentialSavings = debtAmount * 0.6; // Assume 60% average savings
      return {
        fee: fee.toLocaleString(),
        savings: potentialSavings.toLocaleString(),
        net: (potentialSavings - fee).toLocaleString()
      };
    }
    return null;
  };

  const valueProps = [
    {
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Our advanced AI analyzes your unique situation to find the best IRS programs and maximize your savings.'
    },
    {
      icon: '💰',
      title: 'Simple 10% Fee',
      description: 'Pay only 10% of your tax debt. No upfront fees, no investigation charges, no hidden costs.'
    },
    {
      icon: '✅',
      title: '100% Money-Back Guarantee',
      description: 'If we can\'t save you money on your tax resolution, we\'ll refund our entire fee. No questions asked.'
    }
  ];

  return (
    <PageContainer>
      <ContentWrapper>
        <ValueSection>
          <Logo>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
            OwlTax
          </Logo>
          
          <Headline>
            AI-Powered Tax Relief with Zero Upfront Costs
          </Headline>
          
          <Subheadline>
            Join thousands who've reduced their tax debt by an average of 73%. 
            Pay only 10% of your total debt – and only if we save you money.
          </Subheadline>
          
          <ValueProps>
            {valueProps.map((prop, index) => (
              <ValueProp
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ValueIcon>{prop.icon}</ValueIcon>
                <ValueContent>
                  <ValueTitle>{prop.title}</ValueTitle>
                  <ValueDescription>{prop.description}</ValueDescription>
                </ValueContent>
              </ValueProp>
            ))}
          </ValueProps>
          
          <GuaranteeCard variant="elevated">
            <GuaranteeTitle>🛡️ Our Iron-Clad Guarantee</GuaranteeTitle>
            <GuaranteeText>
              If our AI-powered analysis and expert team can't reduce your tax debt, 
              you pay nothing. We're so confident in our results that we offer a 
              complete money-back guarantee. No savings = no fee.
            </GuaranteeText>
          </GuaranteeCard>

          <TestimonialCard variant="elevated">
            <TestimonialText>
              "I owed $47,000 to the IRS and felt hopeless. OwlTax's AI found 
              an OIC opportunity I didn't know existed. I settled for $8,500 – and their 
              fee was only $4,700. I saved over $33,000!"
            </TestimonialText>
            <TestimonialAuthor>– Sarah M., Los Angeles</TestimonialAuthor>
          </TestimonialCard>
        </ValueSection>

        <FormSection>
          <FormCard variant="elevated">
            <FormTitle>Start Your Free AI Analysis</FormTitle>
            <FormSubtitle>
              No credit card required • Results in 60 seconds • 100% confidential
            </FormSubtitle>
            
            <ProgressBar>
              <ProgressStep $active={step >= 1} $completed={step > 1} />
              <ProgressStep $active={step >= 2} $completed={step > 2} />
              <ProgressStep $active={step >= 3} $completed={step > 3} />
            </ProgressBar>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Form>
                    <FormGroup>
                      <Label>First Name</Label>
                      <Input
                        type="text"
                        value={formData.firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('firstName', e.target.value)}
                        placeholder="John"
                      />
                      {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Last Name</Label>
                      <Input
                        type="text"
                        value={formData.lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('lastName', e.target.value)}
                        placeholder="Doe"
                      />
                      {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('email', e.target.value)}
                        placeholder="john.doe@example.com"
                      />
                      {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Phone Number</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('phone', e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                    </FormGroup>

                    <ButtonGroup>
                      <Button fullWidth onClick={handleNext}>
                        Continue to Tax Info →
                      </Button>
                    </ButtonGroup>
                  </Form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Form>
                    <FormGroup>
                      <Label>Estimated Tax Debt</Label>
                      <Select
                        value={formData.taxDebt}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('taxDebt', e.target.value)}
                      >
                        <option value="">Select amount</option>
                        <option value="5000">Under $5,000</option>
                        <option value="10000">$5,000 - $10,000</option>
                        <option value="25000">$10,000 - $25,000</option>
                        <option value="50000">$25,000 - $50,000</option>
                        <option value="100000">$50,000 - $100,000</option>
                        <option value="200000">$100,000 - $200,000</option>
                        <option value="500000">Over $200,000</option>
                      </Select>
                      {errors.taxDebt && <ErrorMessage>{errors.taxDebt}</ErrorMessage>}
                    </FormGroup>

                    {formData.taxDebt && calculateSavings() && (
                      <Card variant="outlined" style={{ padding: spacing.lg, background: colors.primary[50] }}>
                        <h4 style={{ marginBottom: spacing.md, color: colors.primary[700] }}>
                          Your Potential Savings
                        </h4>
                        <div style={{ fontSize: typography.fontSize.sm }}>
                          <div style={{ marginBottom: spacing.xs }}>
                            Average savings (60%): <strong>${calculateSavings()!.savings}</strong>
                          </div>
                          <div style={{ marginBottom: spacing.xs }}>
                            Our fee (10%): <strong>${calculateSavings()!.fee}</strong>
                          </div>
                          <div style={{ 
                            marginTop: spacing.sm, 
                            paddingTop: spacing.sm, 
                            borderTop: `1px solid ${colors.primary[200]}`,
                            color: colors.primary[700],
                            fontWeight: typography.fontWeight.semibold
                          }}>
                            Your net savings: <strong>${calculateSavings()!.net}</strong>
                          </div>
                        </div>
                      </Card>
                    )}

                    <FormGroup>
                      <Label>Tax Years Involved</Label>
                      <Input
                        type="text"
                        value={formData.taxYears}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('taxYears', e.target.value)}
                        placeholder="e.g., 2020-2023"
                      />
                      {errors.taxYears && <ErrorMessage>{errors.taxYears}</ErrorMessage>}
                    </FormGroup>

                    <CheckboxGroup>
                      <Checkbox
                        type="checkbox"
                        id="hasNotices"
                        checked={formData.hasNotices}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('hasNotices', e.target.checked)}
                      />
                      <CheckboxLabel htmlFor="hasNotices">
                        I have received notices from the IRS (liens, levies, etc.)
                      </CheckboxLabel>
                    </CheckboxGroup>

                    <ButtonGroup>
                      <Button variant="ghost" onClick={handleBack}>
                        ← Back
                      </Button>
                      <Button fullWidth onClick={handleNext}>
                        Create Account →
                      </Button>
                    </ButtonGroup>
                  </Form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Form>
                    <FormGroup>
                      <Label>Create Password</Label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('password', e.target.value)}
                        placeholder="Minimum 8 characters"
                      />
                      {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Confirm Password</Label>
                      <Input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('confirmPassword', e.target.value)}
                        placeholder="Re-enter password"
                      />
                      {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
                    </FormGroup>

                    <CheckboxGroup>
                      <Checkbox
                        type="checkbox"
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('agreeToTerms', e.target.checked)}
                      />
                      <CheckboxLabel htmlFor="agreeToTerms">
                        I agree to the <a href="/terms" target="_blank">Terms of Service</a> including 
                        the 10% success fee and money-back guarantee
                      </CheckboxLabel>
                    </CheckboxGroup>
                    {errors.agreeToTerms && <ErrorMessage>{errors.agreeToTerms}</ErrorMessage>}

                    <CheckboxGroup>
                      <Checkbox
                        type="checkbox"
                        id="agreeToPrivacy"
                        checked={formData.agreeToPrivacy}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('agreeToPrivacy', e.target.checked)}
                      />
                      <CheckboxLabel htmlFor="agreeToPrivacy">
                        I agree to the <a href="/privacy" target="_blank">Privacy Policy</a>
                      </CheckboxLabel>
                    </CheckboxGroup>
                    {errors.agreeToPrivacy && <ErrorMessage>{errors.agreeToPrivacy}</ErrorMessage>}

                    <ButtonGroup>
                      <Button variant="ghost" onClick={handleBack}>
                        ← Back
                      </Button>
                      <Button fullWidth onClick={handleNext}>
                        Get My AI Analysis →
                      </Button>
                    </ButtonGroup>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ 
              textAlign: 'center', 
              marginTop: spacing['2xl'],
              paddingTop: spacing.lg,
              borderTop: `1px solid ${colors.border.light}`
            }}>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                Already have an account? {' '}
                <a 
                  href="/login" 
                  style={{ color: colors.primary[600], textDecoration: 'underline' }}
                >
                  Sign in here
                </a>
              </p>
            </div>
          </FormCard>
        </FormSection>
      </ContentWrapper>
    </PageContainer>
  );
};

export default SignUp;