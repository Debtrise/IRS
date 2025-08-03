import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../theme';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../common/Card';
import { Button } from '../common/Button';

const PortalContainer = styled.div`
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

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[700]};
  cursor: pointer;
  
  svg {
    width: 32px;
    height: 32px;
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

// Key Metrics Section
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.lg};
  margin-bottom: ${spacing['2xl']};
  
  @media (min-width: ${breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const MetricCard = styled(Card)`
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.lg};
  }
`;

const MetricValue = styled.div`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
  margin-bottom: ${spacing.xs};
`;

const MetricLabel = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const MetricTrend = styled.div<{ positive?: boolean }>`
  font-size: ${typography.fontSize.xs};
  color: ${props => props.positive ? colors.success[600] : colors.error[600]};
  margin-top: ${spacing.xs};
`;

// Quick Actions Panel
const QuickActionsSection = styled.section`
  margin-bottom: ${spacing['2xl']};
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${spacing.md};
`;

const QuickActionCard = styled(motion.div)`
  background: ${colors.white};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.lg};
  padding: ${spacing.lg};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.primary[300]};
    box-shadow: ${shadows.md};
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${colors.primary[100]};
  color: ${colors.primary[600]};
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${spacing.sm};
  font-size: ${typography.fontSize['2xl']};
`;

const ActionTitle = styled.div`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
`;

// Cases Section
const CasesSection = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.xl};
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const CaseCard = styled(Card)`
  margin-bottom: ${spacing.lg};
`;

const CaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.lg};
`;

const CaseInfo = styled.div``;

const CaseProgram = styled.h3`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const CasePhase = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const CaseStatus = styled.div<{ status: 'active' | 'pending' | 'review' | 'completed' }>`
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
      case 'review':
        return `
          background: ${colors.info[100]};
          color: ${colors.info[700]};
        `;
      case 'completed':
        return `
          background: ${colors.gray[100]};
          color: ${colors.gray[700]};
        `;
    }
  }}
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${colors.gray[200]};
  border-radius: ${radius.full};
  overflow: hidden;
  margin-bottom: ${spacing.lg};
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${props => props.progress}%;
  background: ${colors.primary[500]};
  transition: width 0.3s ease;
`;

const NextSteps = styled.div`
  background: ${colors.primary[50]};
  border: 1px solid ${colors.primary[200]};
  border-radius: ${radius.md};
  padding: ${spacing.md};
  margin-top: ${spacing.lg};
`;

const NextStepTitle = styled.div`
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.primary[700]};
  margin-bottom: ${spacing.xs};
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const NextStepsList = styled.ul`
  margin: 0;
  padding-left: ${spacing.lg};
  color: ${colors.primary[600]};
  font-size: ${typography.fontSize.sm};
  
  li {
    margin-bottom: ${spacing.xs};
  }
`;

// Sidebar
const Sidebar = styled.aside``;

const DeadlineCard = styled(Card)`
  border-left: 4px solid ${colors.warning[500]};
`;

const DeadlineItem = styled.div`
  padding: ${spacing.md} 0;
  border-bottom: 1px solid ${colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const DeadlineDate = styled.div`
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.warning[700]};
  margin-bottom: ${spacing.xs};
`;

const DeadlineTitle = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
`;

const ClientPortal: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data - would come from API
  const metrics = {
    totalDebt: 45000,
    potentialSavings: 18000,
    caseStatus: 'active',
    documentsRequired: 8,
    deadlinesUpcoming: 3
  };
  
  const quickActions = [
    { icon: '📄', title: 'Upload Documents', route: '/documents' },
    { icon: '✓', title: 'Check Status', route: '/status' },
    { icon: '💳', title: 'Make Payment', route: '/payment' },
    { icon: '📅', title: 'Schedule Call', route: '/consultation' },
    { icon: '📨', title: 'View IRS Notices', route: '/notices' },
    { icon: '📋', title: 'Apply for Program', route: '/programs' },
  ];
  
  const activeCases = [
    {
      id: 1,
      program: 'Offer in Compromise',
      phase: 'Document Collection',
      status: 'active' as const,
      progress: 35,
      nextSteps: [
        'Upload Form 433-A (Collection Information Statement)',
        'Provide last 3 months bank statements',
        'Submit proof of monthly expenses'
      ],
      assignedProfessional: 'Sarah Johnson, EA'
    },
    {
      id: 2,
      program: 'Penalty Abatement',
      phase: 'Under Review',
      status: 'review' as const,
      progress: 80,
      nextSteps: [
        'IRS reviewing submitted documentation',
        'Expected response within 30 days'
      ],
      assignedProfessional: 'Michael Chen, CPA'
    }
  ];
  
  const upcomingDeadlines = [
    { date: 'Feb 15, 2024', title: 'Submit Form 433-A' },
    { date: 'Feb 28, 2024', title: 'Quarterly payment due' },
    { date: 'Mar 10, 2024', title: 'Document expiration' }
  ];

  return (
    <PortalContainer>
      <Header>
        <HeaderContent>
          <Logo onClick={() => navigate('/')}>
            <svg viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill={colors.primary[600]} />
              <path d="M16 8L8 16L16 24L24 16L16 8Z" fill="white" opacity="0.9" />
            </svg>
            OwlTax
          </Logo>
          <Button variant="ghost" size="small" onClick={() => navigate('/profile')}>
            My Account
          </Button>
        </HeaderContent>
      </Header>

      <MainContent>
        {/* Key Metrics */}
        <MetricsGrid>
          <MetricCard variant="elevated">
            <CardContent>
              <MetricValue>${metrics.totalDebt.toLocaleString()}</MetricValue>
              <MetricLabel>Total Tax Debt</MetricLabel>
            </CardContent>
          </MetricCard>
          
          <MetricCard variant="elevated">
            <CardContent>
              <MetricValue>Active</MetricValue>
              <MetricLabel>Case Status</MetricLabel>
              <MetricTrend positive>On Track</MetricTrend>
            </CardContent>
          </MetricCard>
          
          <MetricCard variant="elevated">
            <CardContent>
              <MetricValue>{metrics.deadlinesUpcoming}</MetricValue>
              <MetricLabel>Upcoming Deadlines</MetricLabel>
            </CardContent>
          </MetricCard>
          
          <MetricCard variant="elevated">
            <CardContent>
              <MetricValue>{metrics.documentsRequired}</MetricValue>
              <MetricLabel>Documents Required</MetricLabel>
            </CardContent>
          </MetricCard>
          
          <MetricCard variant="elevated">
            <CardContent>
              <MetricValue>${metrics.potentialSavings.toLocaleString()}</MetricValue>
              <MetricLabel>Potential Savings</MetricLabel>
              <MetricTrend positive>Est. 40% reduction</MetricTrend>
            </CardContent>
          </MetricCard>
        </MetricsGrid>

        {/* Quick Actions */}
        <QuickActionsSection>
          <h2 style={{ marginBottom: spacing.lg }}>Quick Actions</h2>
          <QuickActionsGrid>
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(action.route)}
              >
                <ActionIcon>{action.icon}</ActionIcon>
                <ActionTitle>{action.title}</ActionTitle>
              </QuickActionCard>
            ))}
          </QuickActionsGrid>
        </QuickActionsSection>

        {/* Cases and Sidebar */}
        <CasesSection>
          <div>
            <h2 style={{ marginBottom: spacing.lg }}>Active Cases</h2>
            {activeCases.map(caseItem => (
              <CaseCard key={caseItem.id} variant="elevated">
                <CardContent>
                  <CaseHeader>
                    <CaseInfo>
                      <CaseProgram>{caseItem.program}</CaseProgram>
                      <CasePhase>Phase: {caseItem.phase}</CasePhase>
                    </CaseInfo>
                    <CaseStatus status={caseItem.status}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
                      {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                    </CaseStatus>
                  </CaseHeader>
                  
                  <ProgressBar>
                    <ProgressFill progress={caseItem.progress} />
                  </ProgressBar>
                  
                  <div style={{ marginBottom: spacing.md }}>
                    <strong>Progress:</strong> {caseItem.progress}% Complete
                  </div>
                  
                  <div style={{ marginBottom: spacing.lg }}>
                    <strong>Assigned Professional:</strong> {caseItem.assignedProfessional}
                  </div>
                  
                  <NextSteps>
                    <NextStepTitle>
                      <span>🎯</span> Next Steps Required
                    </NextStepTitle>
                    <NextStepsList>
                      {caseItem.nextSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </NextStepsList>
                  </NextSteps>
                </CardContent>
              </CaseCard>
            ))}
          </div>

          <Sidebar>
            <DeadlineCard>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingDeadlines.map((deadline, index) => (
                  <DeadlineItem key={index}>
                    <DeadlineDate>{deadline.date}</DeadlineDate>
                    <DeadlineTitle>{deadline.title}</DeadlineTitle>
                  </DeadlineItem>
                ))}
              </CardContent>
            </DeadlineCard>
          </Sidebar>
        </CasesSection>
      </MainContent>
    </PortalContainer>
  );
};

export default ClientPortal;