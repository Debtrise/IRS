import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../theme';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../common/Card';
import { Button } from '../common/Button';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${colors.gray[50]};
`;

const Header = styled.header`
  background: ${colors.white};
  border-bottom: 1px solid ${colors.border.light};
  padding: ${spacing.md} 0;
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${spacing.md};
  
  @media (min-width: ${breakpoints.md}) {
    padding: 0 ${spacing.xl};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[700]};
  cursor: pointer;
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${radius.full};
  background: ${colors.primary[100]};
  color: ${colors.primary[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${typography.fontWeight.semibold};
`;

const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${spacing.xl} ${spacing.lg};
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing['2xl']} ${spacing.xl};
  }
`;

const WelcomeSection = styled.section`
  margin-bottom: ${spacing['2xl']};
`;

const WelcomeTitle = styled.h1`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.fontSize['3xl']};
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colors.text.secondary};
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.lg};
  margin-bottom: ${spacing['2xl']};
  
  @media (min-width: ${breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatusCard = styled(motion.div)``;

const StatusValue = styled.div`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
  margin-bottom: ${spacing.xs};
`;

const StatusLabel = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.xl};
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const CaseSection = styled.section``;

const SidebarSection = styled.aside``;

const CaseCard = styled(Card)`
  margin-bottom: ${spacing.lg};
`;

const CaseStatus = styled.div<{ status: 'active' | 'pending' | 'completed' }>`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${radius.full};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: ${colors.success[100]};
          color: ${colors.success[700]};
        `;
      case 'pending':
        return `
          background: ${colors.warning[100]};
          color: ${colors.warning[700]};
        `;
      case 'completed':
        return `
          background: ${colors.gray[100]};
          color: ${colors.gray[700]};
        `;
    }
  }}
`;

const ActionItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md} 0;
  border-bottom: 1px solid ${colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${radius.lg};
  background: ${colors.primary[100]};
  color: ${colors.primary[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.div`
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const ActionDescription = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data - would come from API/context in real app
  const userData = {
    name: 'John Doe',
    initials: 'JD',
    totalDebt: 45000,
    program: 'Offer in Compromise',
    status: 'active' as const,
    documentsUploaded: 5,
    documentsRequired: 8,
    nextDeadline: '2024-02-15'
  };

  const actionItems = [
    {
      icon: '📄',
      title: 'Upload Form 433-A',
      description: 'Collection Information Statement required for OIC',
      urgent: true
    },
    {
      icon: '💳',
      title: 'Submit Initial Payment',
      description: '20% down payment required to process your offer',
      urgent: true
    },
    {
      icon: '📊',
      title: 'Review Financial Summary',
      description: 'Verify all income and expense information is accurate',
      urgent: false
    }
  ];

  return (
    <DashboardContainer>
      <Header>
        <HeaderContent>
          <Logo onClick={() => navigate('/')}>
            <svg viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill={colors.primary[600]} />
              <path d="M16 8L8 16L16 24L24 16L16 8Z" fill="white" opacity="0.9" />
            </svg>
            OwlTax
          </Logo>
          <UserInfo>
            <Button variant="ghost" size="small">
              Settings
            </Button>
            <Avatar>{userData.initials}</Avatar>
          </UserInfo>
        </HeaderContent>
      </Header>

      <MainContent>
        <WelcomeSection>
          <WelcomeTitle>Welcome back, {userData.name}</WelcomeTitle>
          <WelcomeSubtitle>
            Here's an overview of your tax relief application
          </WelcomeSubtitle>
        </WelcomeSection>

        <StatusGrid>
          <StatusCard
            as={motion.div}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card variant="elevated">
              <CardContent>
                <StatusValue>${userData.totalDebt.toLocaleString()}</StatusValue>
                <StatusLabel>Total Tax Debt</StatusLabel>
              </CardContent>
            </Card>
          </StatusCard>

          <StatusCard
            as={motion.div}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card variant="elevated">
              <CardContent>
                <StatusValue>{userData.program}</StatusValue>
                <StatusLabel>Selected Program</StatusLabel>
              </CardContent>
            </Card>
          </StatusCard>

          <StatusCard
            as={motion.div}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card variant="elevated">
              <CardContent>
                <StatusValue>{userData.documentsUploaded}/{userData.documentsRequired}</StatusValue>
                <StatusLabel>Documents Uploaded</StatusLabel>
              </CardContent>
            </Card>
          </StatusCard>

          <StatusCard
            as={motion.div}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card variant="elevated">
              <CardContent>
                <StatusValue>Feb 15</StatusValue>
                <StatusLabel>Next Deadline</StatusLabel>
              </CardContent>
            </Card>
          </StatusCard>
        </StatusGrid>

        <ContentGrid>
          <CaseSection>
            <CaseCard>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardTitle>Case Overview</CardTitle>
                  <CaseStatus status={userData.status}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
                    Active
                  </CaseStatus>
                </div>
                <CardSubtitle>Application submitted on January 15, 2024</CardSubtitle>
              </CardHeader>
              <CardContent>
                <div style={{ marginBottom: spacing.lg }}>
                  <h4 style={{ marginBottom: spacing.sm }}>Progress Timeline</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                      <div style={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        background: colors.success[500],
                        color: colors.white,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.bold
                      }}>✓</div>
                      <div>
                        <div style={{ fontWeight: typography.fontWeight.medium }}>Initial Assessment Complete</div>
                        <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>January 10, 2024</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                      <div style={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        background: colors.primary[500],
                        color: colors.white,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.bold
                      }}>2</div>
                      <div>
                        <div style={{ fontWeight: typography.fontWeight.medium }}>Document Collection</div>
                        <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>In Progress</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, opacity: 0.5 }}>
                      <div style={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        background: colors.gray[300],
                        color: colors.white,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.bold
                      }}>3</div>
                      <div>
                        <div style={{ fontWeight: typography.fontWeight.medium }}>IRS Submission</div>
                        <div style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="primary" fullWidth>
                  View Full Case Details
                </Button>
              </CardContent>
            </CaseCard>
          </CaseSection>

          <SidebarSection>
            <Card>
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
                <CardSubtitle>{actionItems.filter(item => item.urgent).length} urgent items</CardSubtitle>
              </CardHeader>
              <CardContent>
                {actionItems.map((item, index) => (
                  <ActionItem key={index}>
                    <ActionIcon>{item.icon}</ActionIcon>
                    <ActionContent>
                      <ActionTitle>
                        {item.title}
                        {item.urgent && (
                          <span style={{ 
                            marginLeft: spacing.sm,
                            color: colors.error[600],
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.normal
                          }}>• Urgent</span>
                        )}
                      </ActionTitle>
                      <ActionDescription>{item.description}</ActionDescription>
                    </ActionContent>
                  </ActionItem>
                ))}
              </CardContent>
            </Card>
          </SidebarSection>
        </ContentGrid>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;