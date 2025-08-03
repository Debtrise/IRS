import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints, transitions } from '../../theme';
import Button from '../common/Button';
import Card from '../common/Card';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.gray[900]} 0%, ${colors.gray[800]} 50%, ${colors.gray[700]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg};
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 480px;
`;

const AdminBrand = styled.div`
  text-align: center;
  margin-bottom: ${spacing['3xl']};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.white};
  margin-bottom: ${spacing.md};
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const AdminLabel = styled.div`
  background: ${colors.error[600]};
  color: ${colors.white};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${radius.full};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  display: inline-block;
`;

const FormCard = styled(Card)`
  padding: ${spacing['3xl']};
  width: 100%;
  background: ${colors.white};
  box-shadow: ${shadows.xl};
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

const SecurityNote = styled(Card)`
  background: ${colors.warning[50]};
  border: 1px solid ${colors.warning[200]};
  padding: ${spacing.lg};
  margin-bottom: ${spacing.xl};
`;

const SecurityTitle = styled.h4`
  color: ${colors.warning[700]};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  margin-bottom: ${spacing.sm};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const SecurityText = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.warning[700]};
  line-height: ${typography.lineHeight.relaxed};
`;

const DemoCredentials = styled(Card)`
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

const DemoText = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.info[700]};
  
  code {
    background: ${colors.info[100]};
    padding: ${spacing.xs};
    border-radius: ${radius.sm};
    font-family: ${typography.fontFamily.mono};
  }
`;

const BackToSite = styled.a`
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

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
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
      // Demo admin credentials check
      if (formData.email === 'admin@taxreliefpro.com' && formData.password === 'admin123') {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials. Try the demo credentials above.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <AdminBrand>
          <Logo>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.9 16 12.4 16 13V16C16 17.1 15.1 18 14 18H10C8.9 18 8 17.1 8 16V13C8 12.4 8.6 11.9 9.2 11.5V10C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.5 8.7 10.5 10V11.5H13.5V10C13.5 8.7 12.8 8.2 12 8.2Z"/>
            </svg>
            OwlTax
          </Logo>
          <AdminLabel>ADMIN PORTAL</AdminLabel>
        </AdminBrand>

        <FormCard variant="elevated">
          <FormTitle>Admin Access</FormTitle>
          <FormSubtitle>
            Secure access to the OwlTax administrative dashboard
          </FormSubtitle>
          
          <SecurityNote variant="outlined">
            <SecurityTitle>
              <span>🔒</span> Security Notice
            </SecurityTitle>
            <SecurityText>
              This is a restricted area. All access attempts are logged and monitored. 
              Unauthorized access is prohibited and may be subject to legal action.
            </SecurityText>
          </SecurityNote>

          <DemoCredentials variant="outlined">
            <DemoTitle>🎯 Demo Admin Access</DemoTitle>
            <DemoText>
              Email: <code>admin@taxreliefpro.com</code><br />
              Password: <code>admin123</code>
            </DemoText>
          </DemoCredentials>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Admin Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
                placeholder="admin@taxreliefpro.com"
                autoComplete="email"
              />
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('password', e.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
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
              variant="primary"
            >
              {isLoading ? 'Authenticating...' : 'Access Admin Dashboard'}
            </Button>
          </Form>

          <BackToSite href="/">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Main Site
          </BackToSite>
        </FormCard>
      </ContentWrapper>
    </PageContainer>
  );
};

export default AdminLogin;