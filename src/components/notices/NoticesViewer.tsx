import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../theme';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../common/Card';
import { Button } from '../common/Button';

const NoticesContainer = styled.div`
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

// Alert Banner
const AlertBanner = styled(motion.div)`
  background: ${colors.warning[50]};
  border: 1px solid ${colors.warning[200]};
  border-radius: ${radius.lg};
  padding: ${spacing.lg};
  margin-bottom: ${spacing['2xl']};
  display: flex;
  gap: ${spacing.md};
`;

const AlertIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${colors.warning[100]};
  color: ${colors.warning[600]};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize.xl};
  flex-shrink: 0;
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.warning[900]};
  margin-bottom: ${spacing.xs};
`;

const AlertText = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.warning[800]};
`;

// Notices Layout
const NoticesLayout = styled.div`
  display: grid;
  gap: ${spacing.xl};
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 300px 1fr;
  }
`;

const NoticesSidebar = styled.aside``;
const NoticesContent = styled.div``;

// Notice List
const NoticeListCard = styled(Card)``;

const NoticeItem = styled.div<{ active?: boolean }>`
  padding: ${spacing.md};
  border-radius: ${radius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
  
  ${props => props.active && `
    background: ${colors.primary[50]};
    border-left-color: ${colors.primary[500]};
  `}
  
  &:hover {
    background: ${colors.gray[50]};
  }
`;

const NoticeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.xs};
`;

const NoticeType = styled.div`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
`;

const NoticeBadge = styled.span<{ severity?: 'urgent' | 'important' | 'info' }>`
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${radius.full};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  
  ${props => {
    switch (props.severity) {
      case 'urgent':
        return `
          background: ${colors.error[100]};
          color: ${colors.error[700]};
        `;
      case 'important':
        return `
          background: ${colors.warning[100]};
          color: ${colors.warning[700]};
        `;
      default:
        return `
          background: ${colors.info[100]};
          color: ${colors.info[700]};
        `;
    }
  }}
`;

const NoticeDate = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

// Notice Detail
const NoticeDetailCard = styled(Card)``;

const NoticeDetailHeader = styled.div`
  margin-bottom: ${spacing.xl};
`;

const NoticeTitle = styled.h2`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const NoticeMetadata = styled.div`
  display: flex;
  gap: ${spacing.xl};
  flex-wrap: wrap;
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const MetadataItem = styled.div`
  display: flex;
  gap: ${spacing.xs};
  align-items: center;
  
  strong {
    color: ${colors.text.primary};
  }
`;

const NoticeBody = styled.div`
  margin-bottom: ${spacing.xl};
  line-height: 1.8;
  color: ${colors.text.primary};
`;

const NoticeSummary = styled(Card)`
  background: ${colors.info[50]};
  border: 1px solid ${colors.info[200]};
  margin-bottom: ${spacing.xl};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${spacing.md};
  flex-wrap: wrap;
`;

// Understanding Section
const UnderstandingSection = styled.div`
  margin-top: ${spacing['2xl']};
`;

const FAQ = styled.div`
  margin-bottom: ${spacing.lg};
`;

const Question = styled.h4`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const Answer = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  line-height: 1.6;
`;

interface IRSNotice {
  id: string;
  type: string;
  noticeNumber: string;
  date: string;
  severity: 'urgent' | 'important' | 'info';
  subject: string;
  summary: string;
  deadline?: string;
  amountDue?: number;
  taxYear?: string;
}

const NoticesViewer: React.FC = () => {
  const navigate = useNavigate();
  const [selectedNotice, setSelectedNotice] = useState<string>('1');
  
  // Mock data
  const notices: IRSNotice[] = [
    {
      id: '1',
      type: 'CP2000',
      noticeNumber: 'CP2000-2024-001',
      date: '2024-02-10',
      severity: 'urgent',
      subject: 'Proposed Changes to Your 2022 Tax Return',
      summary: 'The IRS is proposing changes to your 2022 tax return based on information received from third parties that differs from what you reported.',
      deadline: '2024-03-12',
      amountDue: 4500,
      taxYear: '2022'
    },
    {
      id: '2',
      type: 'CP14',
      noticeNumber: 'CP14-2024-002',
      date: '2024-01-15',
      severity: 'important',
      subject: 'Balance Due Notice',
      summary: 'You have a balance due for your 2021 tax return. This is your first notice requesting payment.',
      deadline: '2024-02-15',
      amountDue: 12300,
      taxYear: '2021'
    },
    {
      id: '3',
      type: 'CP501',
      noticeNumber: 'CP501-2024-003',
      date: '2023-12-05',
      severity: 'info',
      subject: 'Reminder Notice - Balance Due',
      summary: 'This is a reminder that you still have a balance due on your account.',
      amountDue: 8750,
      taxYear: '2020'
    }
  ];
  
  const activeNotice = notices.find(n => n.id === selectedNotice);
  
  const getNoticeExplanation = (type: string) => {
    switch (type) {
      case 'CP2000':
        return {
          what: 'A CP2000 notice means the IRS has information from employers, banks, or other sources that doesn\'t match what you reported on your tax return.',
          why: 'This typically happens when income is unreported or there are discrepancies in reported amounts.',
          action: 'Review the proposed changes carefully. You can agree, partially agree, or disagree with the changes.'
        };
      case 'CP14':
        return {
          what: 'A CP14 is the first notice the IRS sends when you have an unpaid balance on your tax account.',
          why: 'You filed your return but didn\'t pay the full amount owed.',
          action: 'Pay the balance immediately to avoid additional penalties and interest.'
        };
      case 'CP501':
        return {
          what: 'A CP501 is a reminder notice about your unpaid tax balance.',
          why: 'You haven\'t responded to previous notices or made payment arrangements.',
          action: 'Pay your balance or set up a payment plan to avoid enforcement actions.'
        };
      default:
        return {
          what: 'This is an official IRS notice regarding your tax account.',
          why: 'Various reasons depending on your specific situation.',
          action: 'Review the notice carefully and respond as directed.'
        };
    }
  };
  
  const explanation = activeNotice ? getNoticeExplanation(activeNotice.type) : null;
  
  return (
    <NoticesContainer>
      <Header>
        <HeaderContent>
          <BackButton onClick={() => navigate('/portal')}>
            ← Back to Dashboard
          </BackButton>
          <Button variant="secondary" size="small" onClick={() => navigate('/documents')}>
            Upload Notice
          </Button>
        </HeaderContent>
      </Header>
      
      <MainContent>
        <PageTitle>IRS Notices</PageTitle>
        <PageSubtitle>View and understand your IRS correspondence</PageSubtitle>
        
        {/* Alert for urgent notices */}
        {notices.some(n => n.severity === 'urgent') && (
          <AlertBanner
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertIcon>⚠️</AlertIcon>
            <AlertContent>
              <AlertTitle>You have urgent notices requiring immediate attention</AlertTitle>
              <AlertText>
                Review and respond to these notices before their deadlines to avoid additional penalties.
              </AlertText>
            </AlertContent>
          </AlertBanner>
        )}
        
        <NoticesLayout>
          <NoticesSidebar>
            <NoticeListCard variant="elevated">
              <CardHeader>
                <CardTitle>Your Notices</CardTitle>
              </CardHeader>
              <CardContent style={{ padding: 0 }}>
                {notices.map(notice => (
                  <NoticeItem
                    key={notice.id}
                    active={selectedNotice === notice.id}
                    onClick={() => setSelectedNotice(notice.id)}
                  >
                    <NoticeHeader>
                      <NoticeType>{notice.type}</NoticeType>
                      <NoticeBadge severity={notice.severity}>
                        {notice.severity === 'urgent' ? 'Urgent' : 
                         notice.severity === 'important' ? 'Important' : 'Info'}
                      </NoticeBadge>
                    </NoticeHeader>
                    <NoticeDate>
                      {new Date(notice.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </NoticeDate>
                    <div style={{ fontSize: typography.fontSize.sm, marginTop: spacing.xs }}>
                      {notice.subject}
                    </div>
                  </NoticeItem>
                ))}
              </CardContent>
            </NoticeListCard>
            
            <Card variant="elevated" style={{ marginTop: spacing.lg }}>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.md }}>
                  Don't understand your notice? Our experts can help explain and guide you through the response process.
                </p>
                <Button variant="primary" size="small" style={{ width: '100%' }}>
                  Get Expert Help
                </Button>
              </CardContent>
            </Card>
          </NoticesSidebar>
          
          <NoticesContent>
            <AnimatePresence mode="wait">
              {activeNotice && (
                <motion.div
                  key={activeNotice.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <NoticeDetailCard variant="elevated">
                    <CardContent>
                      <NoticeDetailHeader>
                        <NoticeTitle>{activeNotice.subject}</NoticeTitle>
                        <NoticeMetadata>
                          <MetadataItem>
                            <strong>Notice:</strong> {activeNotice.type}
                          </MetadataItem>
                          <MetadataItem>
                            <strong>Date:</strong> {new Date(activeNotice.date).toLocaleDateString()}
                          </MetadataItem>
                          {activeNotice.deadline && (
                            <MetadataItem>
                              <strong>Response Due:</strong> 
                              <span style={{ color: colors.error[600] }}>
                                {new Date(activeNotice.deadline).toLocaleDateString()}
                              </span>
                            </MetadataItem>
                          )}
                          {activeNotice.taxYear && (
                            <MetadataItem>
                              <strong>Tax Year:</strong> {activeNotice.taxYear}
                            </MetadataItem>
                          )}
                        </NoticeMetadata>
                      </NoticeDetailHeader>
                      
                      <NoticeSummary>
                        <CardContent>
                          <h4 style={{ marginBottom: spacing.sm }}>Summary</h4>
                          <p>{activeNotice.summary}</p>
                          {activeNotice.amountDue && (
                            <div style={{ 
                              marginTop: spacing.md, 
                              fontSize: typography.fontSize.xl,
                              fontWeight: typography.fontWeight.bold,
                              color: colors.error[600]
                            }}>
                              Amount Due: ${activeNotice.amountDue.toLocaleString()}
                            </div>
                          )}
                        </CardContent>
                      </NoticeSummary>
                      
                      <ActionButtons>
                        <Button onClick={() => navigate('/documents')}>
                          View Full Notice
                        </Button>
                        <Button variant="secondary">
                          Download PDF
                        </Button>
                        <Button variant="ghost">
                          Print Notice
                        </Button>
                      </ActionButtons>
                    </CardContent>
                  </NoticeDetailCard>
                  
                  <UnderstandingSection>
                    <Card variant="elevated">
                      <CardHeader>
                        <CardTitle>Understanding Your {activeNotice.type} Notice</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {explanation && (
                          <>
                            <FAQ>
                              <Question>What does this notice mean?</Question>
                              <Answer>{explanation.what}</Answer>
                            </FAQ>
                            
                            <FAQ>
                              <Question>Why did I receive this?</Question>
                              <Answer>{explanation.why}</Answer>
                            </FAQ>
                            
                            <FAQ>
                              <Question>What should I do?</Question>
                              <Answer>{explanation.action}</Answer>
                            </FAQ>
                            
                            <FAQ>
                              <Question>What happens if I don't respond?</Question>
                              <Answer>
                                Failing to respond can result in additional penalties, interest charges, 
                                and potential enforcement actions such as liens or levies. It's important 
                                to respond by the deadline even if you disagree with the notice.
                              </Answer>
                            </FAQ>
                          </>
                        )}
                        
                        <div style={{ 
                          marginTop: spacing.xl, 
                          padding: spacing.lg,
                          background: colors.primary[50],
                          borderRadius: radius.lg
                        }}>
                          <h4 style={{ marginBottom: spacing.sm }}>Recommended Actions</h4>
                          <ol style={{ paddingLeft: spacing.lg, fontSize: typography.fontSize.sm }}>
                            <li>Review the notice carefully and verify all information</li>
                            <li>Gather any supporting documents</li>
                            <li>Respond by the deadline - even if you need more time</li>
                            <li>Consider professional help if you're unsure how to proceed</li>
                          </ol>
                        </div>
                      </CardContent>
                    </Card>
                  </UnderstandingSection>
                </motion.div>
              )}
            </AnimatePresence>
          </NoticesContent>
        </NoticesLayout>
      </MainContent>
    </NoticesContainer>
  );
};

export default NoticesViewer;