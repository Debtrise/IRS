import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
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
  max-width: 480px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[700]};
  margin-bottom: ${spacing['3xl']};
  text-decoration: none;
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const FormCard = styled(Card)`
  padding: ${spacing['3xl']};
  width: 100%;
`;

const FormTitle = styled.h1`
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
  line-height: ${typography.lineHeight.relaxed};
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

const SuccessMessage = styled(motion.div)`
  padding: ${spacing.lg};
  background: ${colors.success[50]};
  border: 1px solid ${colors.success[200]};
  border-radius: ${radius.md};
  text-align: center;
  margin-bottom: ${spacing.xl};
`;

const SuccessIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${colors.success[100]};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${spacing.md};
  font-size: 24px;
`;

const SuccessTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.success[700]};
  margin-bottom: ${spacing.sm};
`;

const SuccessText = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.success[700]};
  line-height: ${typography.lineHeight.relaxed};
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.xs};
  margin-top: ${spacing['2xl']};
  padding-top: ${spacing.lg};
  border-top: 1px solid ${colors.border.light};
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  text-decoration: none;
  transition: color ${transitions.base};
  
  &:hover {
    color: ${colors.primary[600]};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const InfoCard = styled(Card)`
  background: ${colors.info[50]};
  border: 1px solid ${colors.info[200]};
  padding: ${spacing.lg};
  margin-top: ${spacing.xl};
`;

const InfoTitle = styled.h4`
  color: ${colors.info[700]};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  margin-bottom: ${spacing.sm};
`;

const InfoText = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.info[700]};
  line-height: ${typography.lineHeight.relaxed};
`;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate email
    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <PageContainer>
        <ContentWrapper>
          <Logo to="/">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
            OwlTax
          </Logo>

          <FormCard variant="elevated">
            <SuccessMessage
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SuccessIcon>✓</SuccessIcon>
              <SuccessTitle>Check Your Email</SuccessTitle>
              <SuccessText>
                We've sent password reset instructions to {email}. 
                Please check your inbox and follow the link to reset your password.
              </SuccessText>
            </SuccessMessage>

            <InfoCard variant="outlined">
              <InfoTitle>Didn't receive the email?</InfoTitle>
              <InfoText>
                • Check your spam or junk folder<br />
                • Make sure you entered the correct email<br />
                • Wait a few minutes and try again
              </InfoText>
            </InfoCard>

            <BackLink to="/login">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Sign In
            </BackLink>
          </FormCard>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <Logo to="/">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          OwlTax
        </Logo>

        <FormCard variant="elevated">
          <FormTitle>Reset Your Password</FormTitle>
          <FormSubtitle>
            Enter your email address and we'll send you instructions to reset your password.
          </FormSubtitle>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="john.doe@example.com"
                autoComplete="email"
                autoFocus
              />
            </FormGroup>

            {error && (
              <ErrorMessage>
                <span>⚠️</span> {error}
              </ErrorMessage>
            )}

            <Button 
              type="submit" 
              fullWidth 
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </Form>

          <BackLink to="/login">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Sign In
          </BackLink>
        </FormCard>
      </ContentWrapper>
    </PageContainer>
  );
};

export default ForgotPassword;