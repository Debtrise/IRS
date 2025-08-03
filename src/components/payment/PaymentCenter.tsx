import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../theme';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../common/Card';
import { Button } from '../common/Button';

const PaymentContainer = styled.div`
  min-height: 100vh;
  background: ${colors.gray[50]};
`;

const Header = styled.header`
  background: ${colors.white};
  border-bottom: 1px solid ${colors.border.light};
  box-shadow: ${shadows.sm};
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${spacing.md} ${spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing.lg} ${spacing.xl};
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  background: none;
  border: none;
  color: ${colors.text.secondary};
  font-size: ${typography.fontSize.sm};
  cursor: pointer;
  
  &:hover {
    color: ${colors.primary[600]};
  }
`;

const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${spacing.xl} ${spacing.lg};
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing['2xl']} ${spacing.xl};
  }
`;

const PageTitle = styled.h1`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.fontSize['3xl']};
  }
`;

const PageSubtitle = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing['2xl']};
`;

// Payment Overview
const OverviewGrid = styled.div`
  display: grid;
  gap: ${spacing.lg};
  margin-bottom: ${spacing['2xl']};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const OverviewCard = styled(Card)<{ highlight?: boolean }>`
  ${props => props.highlight && `
    border: 2px solid ${colors.primary[500]};
    background: ${colors.primary[50]};
  `}
`;

const OverviewAmount = styled.div`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
  margin-bottom: ${spacing.xs};
`;

const OverviewLabel = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

// Payment Methods
const PaymentSection = styled.div`
  display: grid;
  gap: ${spacing.xl};
  margin-bottom: ${spacing['2xl']};
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const PaymentMethodCard = styled(Card)``;
const PaymentSidebar = styled.aside``;

const MethodOption = styled.div<{ selected?: boolean }>`
  padding: ${spacing.lg};
  border: 2px solid ${props => props.selected ? colors.primary[500] : colors.border.main};
  border-radius: ${radius.lg};
  background: ${props => props.selected ? colors.primary[50] : colors.white};
  margin-bottom: ${spacing.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.primary[300]};
  }
`;

const MethodHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.sm};
`;

const MethodTitle = styled.div`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
`;

const MethodBadge = styled.span`
  padding: ${spacing.xs} ${spacing.sm};
  background: ${colors.success[100]};
  color: ${colors.success[700]};
  border-radius: ${radius.full};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.semibold};
`;

const MethodDescription = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

// Payment Form
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
`;

const Select = styled.select`
  width: 100%;
  padding: ${spacing.md};
  border: 1px solid ${colors.border.main};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.base};
  background: ${colors.white};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

const InputRow = styled.div`
  display: grid;
  gap: ${spacing.md};
  
  @media (min-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr 1fr;
  }
`;

// Payment History
const HistoryTable = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: ${spacing.md};
  border-bottom: 2px solid ${colors.border.light};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.secondary};
`;

const Td = styled.td`
  padding: ${spacing.md};
  border-bottom: 1px solid ${colors.border.light};
  font-size: ${typography.fontSize.sm};
`;

const StatusBadge = styled.span<{ status: 'completed' | 'pending' | 'failed' }>`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${radius.full};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  
  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background: ${colors.success[100]};
          color: ${colors.success[700]};
        `;
      case 'pending':
        return `
          background: ${colors.warning[100]};
          color: ${colors.warning[700]};
        `;
      case 'failed':
        return `
          background: ${colors.error[100]};
          color: ${colors.error[700]};
        `;
    }
  }}
  
  &:before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: ${radius.full};
    background: currentColor;
  }
`;

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

const PaymentCenter: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank' | 'check'>('card');
  const [paymentAmount, setPaymentAmount] = useState('');
  
  // Mock data
  const subscriptionData = {
    plan: 'Standard',
    amount: 99,
    nextBilling: 'March 15, 2024',
    totalPaid: 297,
    balance: 0
  };
  
  const paymentHistory: PaymentHistory[] = [
    {
      id: '1',
      date: '2024-02-15',
      amount: 99,
      method: 'Credit Card',
      status: 'completed',
      description: 'Monthly subscription - Standard Plan'
    },
    {
      id: '2',
      date: '2024-01-15',
      amount: 99,
      method: 'Credit Card',
      status: 'completed',
      description: 'Monthly subscription - Standard Plan'
    },
    {
      id: '3',
      date: '2023-12-15',
      amount: 99,
      method: 'Credit Card',
      status: 'completed',
      description: 'Monthly subscription - Standard Plan'
    }
  ];
  
  const handlePayment = () => {
    // Mock payment processing
    console.log('Processing payment:', { method: selectedMethod, amount: paymentAmount });
  };
  
  return (
    <PaymentContainer>
      <Header>
        <HeaderContent>
          <BackButton onClick={() => navigate('/portal')}>
            ← Back to Dashboard
          </BackButton>
        </HeaderContent>
      </Header>
      
      <MainContent>
        <PageTitle>Payment Center</PageTitle>
        <PageSubtitle>Manage your subscription and view payment history</PageSubtitle>
        
        {/* Overview Cards */}
        <OverviewGrid>
          <OverviewCard variant="elevated">
            <CardContent>
              <OverviewAmount>${subscriptionData.amount}/mo</OverviewAmount>
              <OverviewLabel>{subscriptionData.plan} Plan</OverviewLabel>
            </CardContent>
          </OverviewCard>
          
          <OverviewCard variant="elevated">
            <CardContent>
              <OverviewAmount>
                {new Date(subscriptionData.nextBilling).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </OverviewAmount>
              <OverviewLabel>Next Billing Date</OverviewLabel>
            </CardContent>
          </OverviewCard>
          
          <OverviewCard variant="elevated">
            <CardContent>
              <OverviewAmount>${subscriptionData.totalPaid}</OverviewAmount>
              <OverviewLabel>Total Paid</OverviewLabel>
            </CardContent>
          </OverviewCard>
        </OverviewGrid>
        
        {/* Payment Section */}
        <PaymentSection>
          <PaymentMethodCard variant="elevated">
            <CardHeader>
              <CardTitle>Update Payment Method</CardTitle>
              <CardSubtitle>Choose your preferred payment method</CardSubtitle>
            </CardHeader>
            <CardContent>
              <MethodOption
                selected={selectedMethod === 'card'}
                onClick={() => setSelectedMethod('card')}
              >
                <MethodHeader>
                  <MethodTitle>Credit or Debit Card</MethodTitle>
                  <MethodBadge>Most Popular</MethodBadge>
                </MethodHeader>
                <MethodDescription>
                  Pay securely with Visa, Mastercard, American Express, or Discover
                </MethodDescription>
              </MethodOption>
              
              <MethodOption
                selected={selectedMethod === 'bank'}
                onClick={() => setSelectedMethod('bank')}
              >
                <MethodHeader>
                  <MethodTitle>Bank Account (ACH)</MethodTitle>
                </MethodHeader>
                <MethodDescription>
                  Connect your bank account for automatic payments with lower fees
                </MethodDescription>
              </MethodOption>
              
              <MethodOption
                selected={selectedMethod === 'check'}
                onClick={() => setSelectedMethod('check')}
              >
                <MethodHeader>
                  <MethodTitle>Check by Mail</MethodTitle>
                </MethodHeader>
                <MethodDescription>
                  Mail a check to our payment processing center
                </MethodDescription>
              </MethodOption>
              
              {selectedMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  style={{ marginTop: spacing.xl }}
                >
                  <FormGroup>
                    <Label>Card Number</Label>
                    <Input type="text" placeholder="1234 5678 9012 3456" />
                  </FormGroup>
                  
                  <InputRow>
                    <FormGroup>
                      <Label>Expiration Date</Label>
                      <Input type="text" placeholder="MM/YY" />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>CVV</Label>
                      <Input type="text" placeholder="123" />
                    </FormGroup>
                  </InputRow>
                  
                  <FormGroup>
                    <Label>Name on Card</Label>
                    <Input type="text" placeholder="John Doe" />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Billing ZIP Code</Label>
                    <Input type="text" placeholder="12345" />
                  </FormGroup>
                  
                  <Button onClick={handlePayment} style={{ width: '100%' }}>
                    Update Payment Method
                  </Button>
                </motion.div>
              )}
              
              {selectedMethod === 'bank' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  style={{ marginTop: spacing.xl }}
                >
                  <FormGroup>
                    <Label>Routing Number</Label>
                    <Input type="text" placeholder="123456789" />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Account Number</Label>
                    <Input type="text" placeholder="1234567890" />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Account Type</Label>
                    <Select>
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </Select>
                  </FormGroup>
                  
                  <Button onClick={handlePayment} style={{ width: '100%' }}>
                    Connect Bank Account
                  </Button>
                </motion.div>
              )}
              
              {selectedMethod === 'check' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  style={{ marginTop: spacing.xl }}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <p style={{ marginBottom: spacing.md }}>
                        <strong>Make checks payable to:</strong><br />
                        OwlTax, LLC
                      </p>
                      <p style={{ marginBottom: spacing.md }}>
                        <strong>Mail to:</strong><br />
                        OwlTax<br />
                        PO Box 12345<br />
                        New York, NY 10001
                      </p>
                      <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                        Please include your account number on the check memo line.
                        Allow 5-7 business days for processing.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </CardContent>
          </PaymentMethodCard>
          
          <PaymentSidebar>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Billing Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ marginBottom: spacing.lg }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                    <span>Current Plan</span>
                    <strong>{subscriptionData.plan}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                    <span>Monthly Amount</span>
                    <strong>${subscriptionData.amount}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Next Billing</span>
                    <strong>{subscriptionData.nextBilling}</strong>
                  </div>
                </div>
                
                <Button variant="secondary" size="small" style={{ width: '100%', marginBottom: spacing.sm }}>
                  Change Plan
                </Button>
                <Button variant="ghost" size="small" style={{ width: '100%' }}>
                  Cancel Subscription
                </Button>
              </CardContent>
            </Card>
            
            <Card variant="elevated" style={{ marginTop: spacing.lg }}>
              <CardHeader>
                <CardTitle>Save with Annual</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.md }}>
                  Switch to annual billing and save 20% on your subscription.
                </p>
                <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.success[600], marginBottom: spacing.md }}>
                  $950/year
                </div>
                <Button variant="primary" size="small" style={{ width: '100%' }}>
                  Switch to Annual
                </Button>
              </CardContent>
            </Card>
          </PaymentSidebar>
        </PaymentSection>
        
        {/* Payment History */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <HistoryTable>
              <Table>
                <thead>
                  <tr>
                    <Th>Date</Th>
                    <Th>Description</Th>
                    <Th>Method</Th>
                    <Th>Amount</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map(payment => (
                    <tr key={payment.id}>
                      <Td>{new Date(payment.date).toLocaleDateString()}</Td>
                      <Td>{payment.description}</Td>
                      <Td>{payment.method}</Td>
                      <Td>${payment.amount}</Td>
                      <Td>
                        <StatusBadge status={payment.status}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </StatusBadge>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </HistoryTable>
          </CardContent>
        </Card>
      </MainContent>
    </PaymentContainer>
  );
};

export default PaymentCenter;