import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../theme';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../common/Card';
import { Button } from '../common/Button';

const STEPS = [
  { id: 'account-type', title: 'Account Type', subtitle: 'Choose how you\'ll use OwlTax' },
  { id: 'basic-info', title: 'Basic Information', subtitle: 'Create your account' },
  { id: 'organization', title: 'Organization Setup', subtitle: 'Set up your professional account' },
  { id: 'plan', title: 'Choose Your Plan', subtitle: 'Select the best option for your needs' },
  { id: 'payment', title: 'Payment Setup', subtitle: 'Start your journey to tax relief' }
];

const RegistrationContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.gray[50]} 100%);
  padding: ${spacing.xl} ${spacing.lg};
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing['2xl']} ${spacing.xl};
  }
`;

const Header = styled.div`
  max-width: 600px;
  margin: 0 auto ${spacing['2xl']};
  text-align: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[700]};
  margin-bottom: ${spacing.xl};
  cursor: pointer;
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

const ProgressBar = styled.div`
  max-width: 600px;
  margin: 0 auto ${spacing.xl};
  height: 8px;
  background: ${colors.gray[200]};
  border-radius: ${radius.full};
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${colors.primary[500]};
`;

const FormCard = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
`;

const AccountTypeGrid = styled.div`
  display: grid;
  gap: ${spacing.lg};
  margin-bottom: ${spacing.xl};
`;

const AccountTypeCard = styled.button<{ selected?: boolean }>`
  width: 100%;
  padding: ${spacing.xl};
  border: 2px solid ${props => props.selected ? colors.primary[500] : colors.border.main};
  border-radius: ${radius.lg};
  background: ${props => props.selected ? colors.primary[50] : colors.white};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.primary[300]};
    transform: translateY(-2px);
  }
`;

const AccountTypeIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${colors.primary[100]};
  color: ${colors.primary[600]};
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize['2xl']};
  margin-bottom: ${spacing.md};
`;

const AccountTypeTitle = styled.h3`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const AccountTypeDescription = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const FormGroup = styled.div`
  margin-bottom: ${spacing.lg};
`;

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
  border: 1px solid ${colors.border.main};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.base};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
  
  &:disabled {
    background: ${colors.gray[50]};
    cursor: not-allowed;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: ${spacing.sm};
`;

const VerificationButton = styled(Button)`
  white-space: nowrap;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm};
  cursor: pointer;
  font-size: ${typography.fontSize.sm};
  
  input[type="checkbox"] {
    margin-top: 2px;
  }
`;

const PlanGrid = styled.div`
  display: grid;
  gap: ${spacing.lg};
  margin-bottom: ${spacing.xl};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PlanCard = styled.div<{ selected?: boolean; popular?: boolean }>`
  position: relative;
  padding: ${spacing.xl};
  border: 2px solid ${props => props.selected ? colors.primary[500] : colors.border.main};
  border-radius: ${radius.lg};
  background: ${props => props.selected ? colors.primary[50] : colors.white};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.primary[300]};
    transform: translateY(-2px);
  }
  
  ${props => props.popular && `
    border-color: ${colors.primary[300]};
    box-shadow: ${shadows.lg};
  `}
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${colors.primary[600]};
  color: ${colors.white};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${radius.full};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.semibold};
`;

const PlanName = styled.h3`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const PlanPrice = styled.div`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
  margin-bottom: ${spacing.xs};
  
  span {
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.normal};
    color: ${colors.text.secondary};
  }
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${spacing.lg} 0;
`;

const PlanFeature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.sm};
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  
  &:before {
    content: '✓';
    color: ${colors.success[500]};
    font-weight: bold;
    margin-top: 2px;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${spacing['2xl']};
`;

const ErrorMessage = styled.div`
  color: ${colors.error[600]};
  font-size: ${typography.fontSize.sm};
  margin-top: ${spacing.xs};
`;

interface RegistrationData {
  accountType?: 'individual' | 'professional' | 'firm';
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  firmName?: string;
  ein?: string;
  credentials?: string[];
  teamSize?: number;
  subdomain?: string;
  plan?: string;
  paymentMethod?: 'card' | 'ach';
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
}

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<RegistrationData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationCode, setVerificationCode] = useState('');
  
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  
  const updateData = (field: keyof RegistrationData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };
  
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    switch (STEPS[currentStep].id) {
      case 'basic-info':
        if (!data.email) newErrors.email = 'Email is required';
        if (!data.emailVerified) newErrors.email = 'Please verify your email';
        if (!data.phone) newErrors.phone = 'Phone number is required';
        if (!data.phoneVerified) newErrors.phone = 'Please verify your phone';
        if (!data.password) newErrors.password = 'Password is required';
        if (data.password && data.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        if (data.password !== data.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!data.termsAccepted) newErrors.terms = 'You must accept the terms';
        if (!data.privacyAccepted) newErrors.privacy = 'You must accept the privacy policy';
        break;
        
      case 'organization':
        if (data.accountType !== 'individual') {
          if (!data.firmName) newErrors.firmName = 'Firm name is required';
          if (!data.ein) newErrors.ein = 'EIN is required';
          if (!data.subdomain) newErrors.subdomain = 'Subdomain is required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (!validateStep()) return;
    
    if (currentStep < STEPS.length - 1) {
      // Skip organization step for individual accounts
      if (STEPS[currentStep + 1].id === 'organization' && data.accountType === 'individual') {
        setCurrentStep(currentStep + 2);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Complete registration
      navigate('/portal');
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      // Skip organization step when going back for individual accounts
      if (STEPS[currentStep - 1].id === 'organization' && data.accountType === 'individual') {
        setCurrentStep(currentStep - 2);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };
  
  const sendVerification = (type: 'email' | 'phone') => {
    // Mock verification - in real app would send to backend
    console.log(`Sending ${type} verification`);
  };
  
  const verifyCode = (type: 'email' | 'phone') => {
    // Mock verification - in real app would verify with backend
    if (verificationCode === '123456') {
      updateData(type === 'email' ? 'emailVerified' : 'phoneVerified', true);
      setVerificationCode('');
    } else {
      setErrors({ ...errors, verification: 'Invalid code' });
    }
  };
  
  const renderStep = () => {
    const step = STEPS[currentStep];
    
    switch (step.id) {
      case 'account-type':
        return (
          <div>
            <AccountTypeGrid>
              <AccountTypeCard
                selected={data.accountType === 'individual'}
                onClick={() => updateData('accountType', 'individual')}
              >
                <AccountTypeIcon>👤</AccountTypeIcon>
                <AccountTypeTitle>Individual Taxpayer</AccountTypeTitle>
                <AccountTypeDescription>
                  Get help with your personal tax debt. Access all relief programs 
                  and work directly with our experts.
                </AccountTypeDescription>
              </AccountTypeCard>
              
              <AccountTypeCard
                selected={data.accountType === 'professional'}
                onClick={() => updateData('accountType', 'professional')}
              >
                <AccountTypeIcon>💼</AccountTypeIcon>
                <AccountTypeTitle>Tax Professional</AccountTypeTitle>
                <AccountTypeDescription>
                  Manage multiple clients, access professional tools, and grow 
                  your practice with our platform.
                </AccountTypeDescription>
              </AccountTypeCard>
              
              <AccountTypeCard
                selected={data.accountType === 'firm'}
                onClick={() => updateData('accountType', 'firm')}
              >
                <AccountTypeIcon>🏢</AccountTypeIcon>
                <AccountTypeTitle>Tax Firm</AccountTypeTitle>
                <AccountTypeDescription>
                  Multi-user organization account with team management, white-label 
                  options, and enterprise features.
                </AccountTypeDescription>
              </AccountTypeCard>
            </AccountTypeGrid>
          </div>
        );
        
      case 'basic-info':
        return (
          <div>
            <FormGroup>
              <Label>Email Address</Label>
              <InputGroup>
                <Input
                  type="email"
                  value={data.email || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData('email', e.target.value)}
                  placeholder="you@example.com"
                  disabled={data.emailVerified}
                />
                {!data.emailVerified && (
                  <VerificationButton
                    variant="secondary"
                    size="small"
                    onClick={() => sendVerification('email')}
                  >
                    Send Code
                  </VerificationButton>
                )}
              </InputGroup>
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
            
            {data.email && !data.emailVerified && (
              <FormGroup>
                <Label>Email Verification Code</Label>
                <InputGroup>
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                  />
                  <VerificationButton
                    variant="primary"
                    size="small"
                    onClick={() => verifyCode('email')}
                  >
                    Verify
                  </VerificationButton>
                </InputGroup>
                {errors.verification && <ErrorMessage>{errors.verification}</ErrorMessage>}
              </FormGroup>
            )}
            
            <FormGroup>
              <Label>Phone Number</Label>
              <InputGroup>
                <Input
                  type="tel"
                  value={data.phone || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData('phone', e.target.value)}
                  placeholder="(555) 555-5555"
                  disabled={data.phoneVerified}
                />
                {!data.phoneVerified && (
                  <VerificationButton
                    variant="secondary"
                    size="small"
                    onClick={() => sendVerification('phone')}
                  >
                    Send SMS
                  </VerificationButton>
                )}
              </InputGroup>
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </FormGroup>
            
            {data.phone && !data.phoneVerified && (
              <FormGroup>
                <Label>SMS Verification Code</Label>
                <InputGroup>
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                  />
                  <VerificationButton
                    variant="primary"
                    size="small"
                    onClick={() => verifyCode('phone')}
                  >
                    Verify
                  </VerificationButton>
                </InputGroup>
              </FormGroup>
            )}
            
            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                value={data.password || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData('password', e.target.value)}
                placeholder="Minimum 8 characters"
              />
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={data.confirmPassword || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData('confirmPassword', e.target.value)}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={data.termsAccepted || false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData('termsAccepted', e.target.checked)}
                />
                <span>
                  I accept the <a href="/terms" target="_blank">Terms of Service</a>
                </span>
              </CheckboxLabel>
              {errors.terms && <ErrorMessage>{errors.terms}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={data.privacyAccepted || false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData('privacyAccepted', e.target.checked)}
                />
                <span>
                  I accept the <a href="/privacy" target="_blank">Privacy Policy</a>
                </span>
              </CheckboxLabel>
              {errors.privacy && <ErrorMessage>{errors.privacy}</ErrorMessage>}
            </FormGroup>
          </div>
        );
        
      case 'organization':
        return (
          <div>
            <FormGroup>
              <Label>Firm Name</Label>
              <Input
                type="text"
                value={data.firmName || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData('firmName', e.target.value)}
                placeholder="Your Tax Firm LLC"
              />
              {errors.firmName && <ErrorMessage>{errors.firmName}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label>EIN (Employer Identification Number)</Label>
              <Input
                type="text"
                value={data.ein || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData('ein', e.target.value)}
                placeholder="12-3456789"
              />
              {errors.ein && <ErrorMessage>{errors.ein}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label>Professional Credentials</Label>
              <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
                {['CPA', 'EA', 'Attorney'].map(cred => (
                  <CheckboxLabel key={cred}>
                    <input
                      type="checkbox"
                      checked={data.credentials?.includes(cred) || false}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const creds = data.credentials || [];
                        if (e.target.checked) {
                          updateData('credentials', [...creds, cred]);
                        } else {
                          updateData('credentials', creds.filter(c => c !== cred));
                        }
                      }}
                    />
                    <span>{cred}</span>
                  </CheckboxLabel>
                ))}
              </div>
            </FormGroup>
            
            <FormGroup>
              <Label>Number of Team Members</Label>
              <Input
                type="number"
                value={data.teamSize || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData('teamSize', parseInt(e.target.value))}
                placeholder="5"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Preferred Subdomain</Label>
              <InputGroup>
                <Input
                  type="text"
                  value={data.subdomain || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateData('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="yourfirm"
                />
                <div style={{ display: 'flex', alignItems: 'center', color: colors.text.secondary }}>
                  .taxreliefpro.com
                </div>
              </InputGroup>
              {errors.subdomain && <ErrorMessage>{errors.subdomain}</ErrorMessage>}
            </FormGroup>
          </div>
        );
        
      case 'plan':
        const plans = data.accountType === 'individual' ? [
          { id: 'basic', name: 'Basic', price: 49, features: ['Single case', 'Basic documents', 'Email support'] },
          { id: 'standard', name: 'Standard', price: 99, popular: true, features: ['Multiple cases', 'All programs', 'Priority support', 'Document templates'] },
          { id: 'premium', name: 'Premium', price: 199, features: ['Unlimited cases', 'Expedited processing', 'Phone support', 'Professional review'] }
        ] : [
          { id: 'starter', name: 'Starter', price: 299, features: ['Up to 10 clients', 'Basic tools', 'Email support'] },
          { id: 'growth', name: 'Growth', price: 599, popular: true, features: ['Up to 50 clients', 'Advanced tools', 'Priority support', 'White-label options'] },
          { id: 'enterprise', name: 'Enterprise', price: 1299, features: ['Unlimited clients', 'API access', 'Dedicated support', 'Custom integrations'] }
        ];
        
        return (
          <div>
            <PlanGrid>
              {plans.map(plan => (
                <PlanCard
                  key={plan.id}
                  selected={data.plan === plan.id}
                  popular={plan.popular}
                  onClick={() => updateData('plan', plan.id)}
                >
                  {plan.popular && <PopularBadge>Most Popular</PopularBadge>}
                  <PlanName>{plan.name}</PlanName>
                  <PlanPrice>
                    ${plan.price}<span>/month</span>
                  </PlanPrice>
                  <PlanFeatures>
                    {plan.features.map((feature, idx) => (
                      <PlanFeature key={idx}>{feature}</PlanFeature>
                    ))}
                  </PlanFeatures>
                  <Button
                    variant={data.plan === plan.id ? 'primary' : 'secondary'}
                    size="small"
                    style={{ width: '100%' }}
                  >
                    {data.plan === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </PlanCard>
              ))}
            </PlanGrid>
            
            <div style={{ textAlign: 'center', marginTop: spacing.lg }}>
              <p style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
                {data.accountType === 'professional' || data.accountType === 'firm' 
                  ? '14-day free trial • No credit card required'
                  : 'Cancel anytime • 30-day money-back guarantee'}
              </p>
              <p style={{ color: colors.success[600], fontWeight: typography.fontWeight.semibold }}>
                Save 20% with annual billing
              </p>
            </div>
          </div>
        );
        
      case 'payment':
        return (
          <div>
            <div style={{ textAlign: 'center', marginBottom: spacing['2xl'] }}>
              <h3 style={{ fontSize: typography.fontSize['2xl'], marginBottom: spacing.md }}>
                Payment Setup
              </h3>
              <p style={{ color: colors.text.secondary }}>
                {data.accountType === 'professional' || data.accountType === 'firm'
                  ? 'Start your 14-day free trial. Cancel anytime.'
                  : 'Secure payment. Cancel anytime.'}
              </p>
            </div>
            
            <Card variant="outlined" style={{ padding: spacing.xl, textAlign: 'center' }}>
              <p style={{ marginBottom: spacing.lg }}>
                Stripe payment integration would go here
              </p>
              <Button onClick={handleNext}>
                {data.accountType === 'professional' || data.accountType === 'firm'
                  ? 'Start Free Trial'
                  : 'Complete Registration'}
              </Button>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const currentStepConfig = STEPS[currentStep];
  
  return (
    <RegistrationContainer>
      <Header>
        <Logo onClick={() => navigate('/')}>
          <svg viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill={colors.primary[600]} />
            <path d="M16 8L8 16L16 24L24 16L16 8Z" fill="white" opacity="0.9" />
          </svg>
          OwlTax
        </Logo>
      </Header>
      
      <ProgressBar>
        <ProgressFill
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </ProgressBar>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <FormCard variant="elevated">
            <CardHeader>
              <CardTitle>{currentStepConfig.title}</CardTitle>
              <CardSubtitle>{currentStepConfig.subtitle}</CardSubtitle>
            </CardHeader>
            <CardContent>
              {renderStep()}
              
              <NavigationButtons>
                {currentStep > 0 && (
                  <Button variant="ghost" onClick={handleBack}>
                    Back
                  </Button>
                )}
                <div style={{ flex: 1 }} />
                <Button 
                  onClick={handleNext}
                  disabled={currentStep === 0 && !data.accountType}
                >
                  {currentStep === STEPS.length - 1 ? 'Complete' : 'Continue'}
                </Button>
              </NavigationButtons>
            </CardContent>
          </FormCard>
        </motion.div>
      </AnimatePresence>
    </RegistrationContainer>
  );
};

export default Registration;