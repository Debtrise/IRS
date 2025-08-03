import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../theme';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../common/Card';
import { Button } from '../common/Button';

const StatusContainer = styled.div`
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

const PageHeader = styled.div`
  margin-bottom: ${spacing['2xl']};
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
`;

// Case Overview
const CaseOverview = styled(Card)`
  margin-bottom: ${spacing['2xl']};
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.xl};
  margin-bottom: ${spacing.xl};
`;

const OverviewItem = styled.div`
  text-align: center;
`;

const OverviewLabel = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.xs};
`;

const OverviewValue = styled.div`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
`;

// Timeline
const TimelineSection = styled.div`
  margin-bottom: ${spacing['2xl']};
`;

const Timeline = styled.div`
  position: relative;
  padding-left: ${spacing['2xl']};
  
  &:before {
    content: '';
    position: absolute;
    left: 12px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${colors.border.light};
  }
`;

const TimelineItem = styled(motion.div)<{ status?: 'completed' | 'active' | 'upcoming' }>`
  position: relative;
  margin-bottom: ${spacing.xl};
  
  &:before {
    content: '';
    position: absolute;
    left: -26px;
    top: 4px;
    width: 16px;
    height: 16px;
    border-radius: ${radius.full};
    background: ${props => {
      switch (props.status) {
        case 'completed': return colors.success[500];
        case 'active': return colors.primary[500];
        case 'upcoming': return colors.gray[300];
        default: return colors.gray[300];
      }
    }};
    border: 3px solid ${colors.white};
    box-shadow: ${shadows.sm};
  }
`;

const TimelineCard = styled(Card)<{ status?: 'completed' | 'active' | 'upcoming' }>`
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'completed': return colors.success[500];
      case 'active': return colors.primary[500];
      case 'upcoming': return colors.gray[300];
      default: return colors.gray[300];
    }
  }};
`;

const TimelineDate = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.xs};
`;

const TimelineTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const TimelineDescription = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  line-height: 1.6;
`;

// Activity Log
const ActivitySection = styled.div`
  display: grid;
  gap: ${spacing.xl};
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const ActivityLog = styled(Card)``;
const ActivitySidebar = styled.aside``;

const ActivityItem = styled.div`
  display: flex;
  gap: ${spacing.md};
  padding: ${spacing.md} 0;
  border-bottom: 1px solid ${colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div<{ type?: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${radius.full};
  background: ${props => {
    switch (props.type) {
      case 'document': return colors.info[100];
      case 'message': return colors.primary[100];
      case 'status': return colors.success[100];
      case 'alert': return colors.warning[100];
      default: return colors.gray[100];
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'document': return colors.info[600];
      case 'message': return colors.primary[600];
      case 'status': return colors.success[600];
      case 'alert': return colors.warning[600];
      default: return colors.gray[600];
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize.lg};
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const ActivityTime = styled.div`
  font-size: ${typography.fontSize.xs};
  color: ${colors.text.secondary};
`;

// Next Actions
const ActionCard = styled(Card)`
  border-left: 4px solid ${colors.primary[500]};
`;

const ActionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ActionCheckbox = styled.input`
  margin-top: 2px;
`;

const ActionText = styled.label`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  cursor: pointer;
  flex: 1;
  
  ${ActionCheckbox}:checked + & {
    text-decoration: line-through;
    color: ${colors.text.secondary};
  }
`;

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
}

interface Activity {
  id: string;
  type: 'document' | 'message' | 'status' | 'alert';
  title: string;
  time: string;
  icon: string;
}

const CaseStatus: React.FC = () => {
  const navigate = useNavigate();
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  
  // Mock data
  const caseData = {
    caseNumber: 'OIC-2024-0234',
    program: 'Offer in Compromise',
    startDate: 'January 15, 2024',
    estimatedCompletion: 'July 2024',
    progress: 35,
    status: 'Document Collection'
  };
  
  const timeline: TimelineEvent[] = [
    {
      id: '1',
      date: 'January 15, 2024',
      title: 'Case Initiated',
      description: 'Your Offer in Compromise case was opened and assigned to a specialist.',
      status: 'completed'
    },
    {
      id: '2',
      date: 'January 20, 2024',
      title: 'Initial Assessment Complete',
      description: 'Financial analysis completed. You qualify for the Offer in Compromise program.',
      status: 'completed'
    },
    {
      id: '3',
      date: 'February 1, 2024',
      title: 'Document Collection',
      description: 'Currently gathering required financial documents and forms.',
      status: 'active'
    },
    {
      id: '4',
      date: 'March 2024',
      title: 'Form Preparation',
      description: 'Form 656 and 433-A will be prepared with your financial information.',
      status: 'upcoming'
    },
    {
      id: '5',
      date: 'April 2024',
      title: 'IRS Submission',
      description: 'Your offer package will be submitted to the IRS for review.',
      status: 'upcoming'
    }
  ];
  
  const activities: Activity[] = [
    {
      id: '1',
      type: 'document',
      title: 'You uploaded Bank_Statement_Jan2024.pdf',
      time: '2 hours ago',
      icon: '📄'
    },
    {
      id: '2',
      type: 'message',
      title: 'Sarah Johnson commented on your case',
      time: '5 hours ago',
      icon: '💬'
    },
    {
      id: '3',
      type: 'status',
      title: 'Case status updated to Document Collection',
      time: '1 day ago',
      icon: '✓'
    },
    {
      id: '4',
      type: 'alert',
      title: 'Document deadline approaching (Feb 28)',
      time: '2 days ago',
      icon: '⚠️'
    }
  ];
  
  const nextActions = [
    { id: '1', text: 'Upload last 3 months of bank statements' },
    { id: '2', text: 'Complete Form 433-A Section 5 (Monthly Income/Expenses)' },
    { id: '3', text: 'Provide proof of monthly housing payment' },
    { id: '4', text: 'Submit documentation for claimed medical expenses' }
  ];
  
  const toggleAction = (actionId: string) => {
    setCompletedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };
  
  return (
    <StatusContainer>
      <Header>
        <HeaderContent>
          <BackButton onClick={() => navigate('/portal')}>
            ← Back to Dashboard
          </BackButton>
          <Button variant="secondary" size="small">
            Contact Support
          </Button>
        </HeaderContent>
      </Header>
      
      <MainContent>
        <PageHeader>
          <PageTitle>Case Status</PageTitle>
          <PageSubtitle>Track your progress and stay updated on your tax relief case</PageSubtitle>
        </PageHeader>
        
        {/* Case Overview */}
        <CaseOverview variant="elevated">
          <CardHeader>
            <CardTitle>Case Overview</CardTitle>
            <CardSubtitle>Case #{caseData.caseNumber}</CardSubtitle>
          </CardHeader>
          <CardContent>
            <OverviewGrid>
              <OverviewItem>
                <OverviewLabel>Program</OverviewLabel>
                <OverviewValue style={{ fontSize: typography.fontSize.xl }}>
                  {caseData.program}
                </OverviewValue>
              </OverviewItem>
              <OverviewItem>
                <OverviewLabel>Current Phase</OverviewLabel>
                <OverviewValue style={{ fontSize: typography.fontSize.xl }}>
                  {caseData.status}
                </OverviewValue>
              </OverviewItem>
              <OverviewItem>
                <OverviewLabel>Progress</OverviewLabel>
                <OverviewValue>{caseData.progress}%</OverviewValue>
              </OverviewItem>
              <OverviewItem>
                <OverviewLabel>Est. Completion</OverviewLabel>
                <OverviewValue style={{ fontSize: typography.fontSize.xl }}>
                  {caseData.estimatedCompletion}
                </OverviewValue>
              </OverviewItem>
            </OverviewGrid>
            
            <div style={{ marginTop: spacing.xl }}>
              <div style={{ marginBottom: spacing.sm, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  Overall Progress
                </span>
                <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
                  {caseData.progress}%
                </span>
              </div>
              <div style={{ height: 8, background: colors.gray[200], borderRadius: radius.full, overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: colors.primary[500] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${caseData.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </CardContent>
        </CaseOverview>
        
        {/* Timeline */}
        <TimelineSection>
          <h2 style={{ marginBottom: spacing.xl }}>Case Timeline</h2>
          <Timeline>
            {timeline.map((event, index) => (
              <TimelineItem
                key={event.id}
                status={event.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TimelineCard variant="elevated" status={event.status}>
                  <CardContent>
                    <TimelineDate>{event.date}</TimelineDate>
                    <TimelineTitle>{event.title}</TimelineTitle>
                    <TimelineDescription>{event.description}</TimelineDescription>
                  </CardContent>
                </TimelineCard>
              </TimelineItem>
            ))}
          </Timeline>
        </TimelineSection>
        
        {/* Activity Section */}
        <ActivitySection>
          <ActivityLog variant="elevated">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.map(activity => (
                <ActivityItem key={activity.id}>
                  <ActivityIcon type={activity.type}>
                    {activity.icon}
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityTitle>{activity.title}</ActivityTitle>
                    <ActivityTime>{activity.time}</ActivityTime>
                  </ActivityContent>
                </ActivityItem>
              ))}
            </CardContent>
          </ActivityLog>
          
          <ActivitySidebar>
            <ActionCard variant="elevated">
              <CardHeader>
                <CardTitle>Next Actions Required</CardTitle>
              </CardHeader>
              <CardContent>
                {nextActions.map(action => (
                  <ActionItem key={action.id}>
                    <ActionCheckbox
                      type="checkbox"
                      id={`action-${action.id}`}
                      checked={completedActions.includes(action.id)}
                      onChange={() => toggleAction(action.id)}
                    />
                    <ActionText htmlFor={`action-${action.id}`}>
                      {action.text}
                    </ActionText>
                  </ActionItem>
                ))}
                
                <Button
                  variant="primary"
                  size="small"
                  style={{ width: '100%', marginTop: spacing.lg }}
                  onClick={() => navigate('/documents')}
                >
                  Upload Documents
                </Button>
              </CardContent>
            </ActionCard>
            
            <Card variant="elevated" style={{ marginTop: spacing.lg }}>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.md }}>
                  Your case specialist is available to answer questions.
                </p>
                <Button variant="secondary" size="small" style={{ width: '100%' }}>
                  Message Specialist
                </Button>
              </CardContent>
            </Card>
          </ActivitySidebar>
        </ActivitySection>
      </MainContent>
    </StatusContainer>
  );
};

export default CaseStatus;