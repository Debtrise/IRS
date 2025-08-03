import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints, transitions } from '../../theme';
import Button from '../common/Button';
import Card from '../common/Card';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.cream.main} 0%, ${colors.white} 50%, ${colors.cream[200]} 100%);
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

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing['3xl']};
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
  margin-bottom: ${spacing['3xl']};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.xl};
  margin-bottom: ${spacing['3xl']};
`;

const StatCard = styled(motion.div)`
  background: ${colors.white};
  padding: ${spacing.xl};
  border-radius: ${radius.lg};
  box-shadow: ${shadows.sm};
  border: 1px solid ${colors.border.light};
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[700]};
  margin-bottom: ${spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  
  &::before {
    content: '✓';
    color: ${colors.success[600]};
    font-weight: ${typography.fontWeight.bold};
  }
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
  margin-bottom: ${spacing['3xl']};
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

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  margin-top: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
  background: ${colors.error[50]};
  border: 1px solid ${colors.error[200]};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.sm};
  color: ${colors.error[700]};
`;

const RememberRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  cursor: pointer;
`;

const ForgotLink = styled(Link)`
  font-size: ${typography.fontSize.sm};
  color: ${colors.primary[600]};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DemoInfo = styled(Card)`
  background: ${colors.info[50]};
  border: 1px solid ${colors.info[200]};
  padding: ${spacing.lg};
  margin-bottom: ${spacing.xl};
`;

const DemoTitle = styled.h4`
  color: ${colors.info[700]};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.semibold};
  margin-bottom: ${spacing.sm};
`;

const DemoCredentials = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.info[700]};
  
  code {
    background: ${colors.info[100]};
    padding: ${spacing.xs};
    border-radius: ${radius.sm};
    font-family: ${typography.fontFamily.mono};
  }
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: ${spacing['2xl']} 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${colors.border.light};
  }
  
  span {
    position: relative;
    background: ${colors.white};
    padding: 0 ${spacing.lg};
    font-size: ${typography.fontSize.sm};
    color: ${colors.text.secondary};
  }
`;

const SocialButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.md};
  background: ${colors.white};
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  cursor: pointer;
  transition: all ${transitions.base};
  
  &:hover {
    background: ${colors.gray[50]};
    border-color: ${colors.border.dark};
  }
  
  img {
    width: 20px;
    height: 20px;
  }
`;

const SignUpPrompt = styled.div`
  text-align: center;
  margin-top: ${spacing['2xl']};
  padding-top: ${spacing.lg};
  border-top: 1px solid ${colors.border.light};
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  
  a {
    color: ${colors.primary[600]};
    text-decoration: none;
    font-weight: ${typography.fontWeight.medium};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Demo credentials check
      if (formData.email === 'demo@example.com' && formData.password === 'demo123') {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Try the demo credentials.');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Implement social login
  };

  const stats = [
    { number: '73%', label: 'Average Savings' },
    { number: '10K+', label: 'Cases Resolved' },
    { number: '4.9/5', label: 'Client Rating' },
    { number: '100%', label: 'Money Back' },
  ];

  return (
    <PageContainer>
      <ContentWrapper>
        <BrandSection>
          <LogoContainer>
            <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill={colors.primary[600]} />
              <path d="M16 8L8 16L16 24L24 16L16 8Z" fill="white" opacity="0.9" />
            </svg>
          </LogoContainer>
          
          <Headline>
            Welcome Back to Your Tax Resolution Journey
          </Headline>
          
          <Subheadline>
            Access your AI-powered tax relief dashboard and track your case progress.
          </Subheadline>
          
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
          
          <FeatureList>
            <Feature>AI analyzes your case in real-time</Feature>
            <Feature>Track IRS communications and deadlines</Feature>
            <Feature>Upload documents securely</Feature>
            <Feature>Monitor your savings progress</Feature>
            <Feature>Chat with tax experts 24/7</Feature>
          </FeatureList>
        </BrandSection>

        <FormSection>
          <FormCard variant="elevated">
            <FormTitle>Sign In to Your Account</FormTitle>
            <FormSubtitle>
              Continue where you left off
            </FormSubtitle>
            
            <DemoInfo variant="outlined">
              <DemoTitle>🎯 Demo Account</DemoTitle>
              <DemoCredentials>
                Email: <code>demo@example.com</code><br />
                Password: <code>demo123</code>
              </DemoCredentials>
            </DemoInfo>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
                  placeholder="john.doe@example.com"
                  autoComplete="email"
                />
              </FormGroup>

              <FormGroup>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('password', e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </FormGroup>

              {error && (
                <ErrorMessage>
                  <span>⚠️</span> {error}
                </ErrorMessage>
              )}

              <RememberRow>
                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('rememberMe', e.target.checked)}
                  />
                  <CheckboxLabel htmlFor="rememberMe">
                    Remember me
                  </CheckboxLabel>
                </CheckboxGroup>
                
                <ForgotLink to="/forgot-password">
                  Forgot password?
                </ForgotLink>
              </RememberRow>

              <Button 
                type="submit" 
                fullWidth 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form>

            <Divider>
              <span>or continue with</span>
            </Divider>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <SocialButton onClick={() => handleSocialLogin('google')}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </SocialButton>
              
              <SocialButton onClick={() => handleSocialLogin('apple')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continue with Apple
              </SocialButton>
            </div>

            <SignUpPrompt>
              Don't have an account? {' '}
              <Link to="/signup">
                Start your free AI analysis
              </Link>
            </SignUpPrompt>
          </FormCard>
        </FormSection>
      </ContentWrapper>
    </PageContainer>
  );
};

export default Login;