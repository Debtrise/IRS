import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, transitions } from '../../theme';
import Button from '../common/Button';
import Card from '../common/Card';

const Container = styled.div`
  min-height: 100vh;
  background: ${colors.gray[50]};
`;

const Header = styled.header`
  background: ${colors.white};
  border-bottom: 1px solid ${colors.border.light};
  padding: ${spacing.md} 0;
  box-shadow: ${shadows.sm};
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[700]};
  cursor: pointer;
  
  svg {
    width: 28px;
    height: 28px;
  }
`;

const AdminBadge = styled.span`
  background: ${colors.error[600]};
  color: ${colors.white};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${radius.sm};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.semibold};
  margin-left: ${spacing.sm};
`;

const Content = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${spacing['2xl']} ${spacing.lg};
`;

const PageTitle = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const PageSubtitle = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing['3xl']};
`;

const PlaceholderCard = styled(Card)`
  padding: ${spacing['3xl']};
  text-align: center;
  background: ${colors.white};
`;

const PlaceholderIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${colors.primary[100]};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${spacing.xl};
  font-size: 40px;
`;

const PlaceholderTitle = styled.h2`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.md};
`;

const PlaceholderText = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.xl};
  line-height: ${typography.lineHeight.relaxed};
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${spacing.xl};
  text-align: left;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.md};
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  
  &::before {
    content: '✓';
    color: ${colors.success[600]};
    font-weight: ${typography.fontWeight.bold};
  }
`;

const Communications: React.FC = () => {
  const navigate = useNavigate();

  const plannedFeatures = [
    'Client email templates and automation',
    'SMS notification system',
    'Internal team messaging',
    'Case status notifications',
    'IRS correspondence tracking',
    'Client communication history',
    'Automated follow-up reminders',
    'Document request notifications'
  ];

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo onClick={() => navigate('/admin/dashboard')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.9 16 12.4 16 13V16C16 17.1 15.1 18 14 18H10C8.9 18 8 17.1 8 16V13C8 12.4 8.6 11.9 9.2 11.5V10C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.5 8.7 10.5 10V11.5H13.5V10C13.5 8.7 12.8 8.2 12 8.2Z"/>
            </svg>
            OwlTax
            <AdminBadge>ADMIN</AdminBadge>
          </Logo>
          
          <Button variant="ghost" size="small" onClick={() => navigate('/admin/login')}>
            Logout
          </Button>
        </HeaderContent>
      </Header>

      <Content>
        <PageTitle>Communications Center</PageTitle>
        <PageSubtitle>
          Manage client communications, notifications, and team messaging
        </PageSubtitle>

        <PlaceholderCard variant="elevated">
          <PlaceholderIcon>💬</PlaceholderIcon>
          <PlaceholderTitle>Communications Module Coming Soon</PlaceholderTitle>
          <PlaceholderText>
            The communications center will provide comprehensive tools for managing all client 
            and team communications, including automated notifications, email templates, 
            and message tracking.
          </PlaceholderText>
          
          <FeatureList>
            {plannedFeatures.map((feature, index) => (
              <FeatureItem key={index}>{feature}</FeatureItem>
            ))}
          </FeatureList>
          
          <Button variant="primary" onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </PlaceholderCard>
      </Content>
    </Container>
  );
};

export default Communications;