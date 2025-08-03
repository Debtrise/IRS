import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../theme';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import Logo from '../common/Logo';

const ResultsContainer = styled.div`
  min-height: 100vh;
  background: ${colors.white};
`;

const TopHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${colors.gray[100]};
  z-index: 50;
  padding: ${spacing.lg} 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const TopHeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  padding-top: 80px;
  padding: 80px ${spacing.lg} ${spacing.xl};
  
  @media (min-width: ${breakpoints.md}) {
    padding: 80px ${spacing.xl} ${spacing['2xl']};
  }
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto ${spacing['2xl']};
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.md};
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.fontSize['4xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
`;

const ResultsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: ${spacing.xl};
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const ProgramsSection = styled.div``;
const SummarySection = styled.aside``;

const ProgramCard = styled(motion.div)`
  background: ${colors.white};
  border-radius: ${radius.xl};
  box-shadow: ${shadows.md};
  padding: ${spacing.xl};
  margin-bottom: ${spacing.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${shadows.lg};
    transform: translateY(-2px);
  }
`;

const ProgramHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.lg};
`;

const ProgramInfo = styled.div``;

const ProgramName = styled.h3`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const ProgramType = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const ConfidenceBadge = styled.div<{ level: 'high' | 'medium' | 'low' }>`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.full};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  
  ${props => {
    switch (props.level) {
      case 'high':
        return `
          background: ${colors.success[100]};
          color: ${colors.success[700]};
        `;
      case 'medium':
        return `
          background: ${colors.warning[100]};
          color: ${colors.warning[700]};
        `;
      case 'low':
        return `
          background: ${colors.gray[100]};
          color: ${colors.gray[700]};
        `;
    }
  }}
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.lg};
  margin-bottom: ${spacing.lg};
`;

const MetricBox = styled.div`
  background: ${colors.gray[50]};
  border-radius: ${radius.lg};
  padding: ${spacing.md};
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
  margin-bottom: ${spacing.xs};
`;

const MetricLabel = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const RequirementsList = styled.div`
  margin-bottom: ${spacing.lg};
`;

const RequirementItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.sm};
  font-size: ${typography.fontSize.sm};
  
  &:before {
    content: '✓';
    color: ${colors.success[500]};
    font-weight: bold;
    margin-top: 2px;
  }
`;

const DisqualifiedCard = styled(Card)`
  border-left: 4px solid ${colors.error[500]};
  margin-bottom: ${spacing.lg};
`;

const DisqualifiedHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.md};
  color: ${colors.error[700]};
`;

const DisqualifiedReason = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.sm};
`;

const SummaryCard = styled(Card)`
  position: sticky;
  top: ${spacing.xl};
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.md} 0;
  border-bottom: 1px solid ${colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const SummaryValue = styled.div`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
`;

const ActionButtons = styled.div`
  margin-top: ${spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

interface ProgramResult {
  id: string;
  name: string;
  type: string;
  qualified: boolean;
  confidence: 'high' | 'medium' | 'low';
  timeline: { min: number; max: number };
  savings: { min: number; max: number };
  successRate: number;
  requirements: string[];
  disqualifyReason?: string;
  description: string;
}

const AssessmentResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const assessmentData = location.state?.assessmentData || {};
  
  // Calculate eligibility based on assessment data
  const programResults = useMemo(() => {
    const results: ProgramResult[] = [];
    const totalDebt = parseInt(assessmentData.totalDebt?.split('-')[0]?.replace(/\D/g, '') || '0');
    const hasUrgentIssues = assessmentData.wageGarnishment || assessmentData.bankLevy || 
                            assessmentData.assetSeizure || assessmentData.businessClosure;
    
    // Installment Agreement evaluation
    if (totalDebt > 0) {
      const iaResult: ProgramResult = {
        id: 'ia',
        name: 'Installment Agreement',
        type: totalDebt <= 10000 ? 'Guaranteed' : totalDebt <= 50000 ? 'Streamlined' : 'Non-Streamlined',
        qualified: true,
        confidence: totalDebt <= 50000 ? 'high' : 'medium',
        timeline: { min: 1, max: 2 },
        savings: { min: 0, max: 0 }, // No savings, just payment plan
        successRate: totalDebt <= 50000 ? 95 : 85,
        requirements: [
          'File all required tax returns',
          'Provide financial information',
          'Set up monthly payments',
          'Stay current with future taxes'
        ],
        description: 'Pay your tax debt over time with manageable monthly payments'
      };
      results.push(iaResult);
    }
    
    // Offer in Compromise evaluation
    const monthlyIncome = parseInt(assessmentData.monthlyNetIncome || '0');
    const assets = parseInt(assessmentData.bankBalance || '0') + 
                   parseInt(assessmentData.homeEquity || '0') +
                   parseInt(assessmentData.retirementBalance || '0');
    
    if (totalDebt > 10000 && monthlyIncome > 0) {
      const rcp = (monthlyIncome * 12) + (assets * 0.8); // Simplified RCP calculation
      const canAffordOIC = rcp < totalDebt;
      
      const oicResult: ProgramResult = {
        id: 'oic',
        name: 'Offer in Compromise',
        type: 'Doubt as to Collectibility',
        qualified: canAffordOIC && assessmentData.allReturnsFiled !== false,
        confidence: canAffordOIC ? 'medium' : 'low',
        timeline: { min: 6, max: 12 },
        savings: { min: totalDebt * 0.5, max: totalDebt * 0.8 },
        successRate: 40,
        requirements: [
          'Complete Form 656 and Form 433-A',
          'Submit all financial documentation',
          'Pay application fee ($205)',
          'Make initial payment (20% for lump sum)',
          'Stay compliant during review'
        ],
        disqualifyReason: !canAffordOIC ? 'Based on your income and assets, you may be able to pay the full amount' : 
                         assessmentData.allReturnsFiled === false ? 'All tax returns must be filed first' : undefined,
        description: 'Settle your tax debt for less than the full amount owed'
      };
      results.push(oicResult);
    }
    
    // Currently Not Collectible evaluation
    const financialHardship = assessmentData.circumstances?.includes('health') || 
                             assessmentData.circumstances?.includes('fixed') ||
                             monthlyIncome < 2000;
    
    if (financialHardship) {
      const cncResult: ProgramResult = {
        id: 'cnc',
        name: 'Currently Not Collectible',
        type: 'Financial Hardship',
        qualified: true,
        confidence: assessmentData.circumstances?.includes('fixed') ? 'high' : 'medium',
        timeline: { min: 1, max: 3 },
        savings: { min: 0, max: 0 }, // Temporary relief, not forgiveness
        successRate: 75,
        requirements: [
          'Prove financial hardship',
          'Submit Form 433-F',
          'Provide income documentation',
          'Show necessary living expenses'
        ],
        description: 'Temporarily suspend IRS collection activities due to financial hardship'
      };
      results.push(cncResult);
    }
    
    // Penalty Abatement evaluation
    const firstTimeAbate = !assessmentData.previousRelief;
    
    const penaltyResult: ProgramResult = {
      id: 'penalty',
      name: 'Penalty Abatement',
      type: firstTimeAbate ? 'First-Time Abatement' : 'Reasonable Cause',
      qualified: true,
      confidence: firstTimeAbate ? 'high' : 'medium',
      timeline: { min: 2, max: 4 },
      savings: { min: totalDebt * 0.1, max: totalDebt * 0.25 },
      successRate: firstTimeAbate ? 80 : 50,
      requirements: firstTimeAbate ? [
        'Clean compliance history (3 years)',
        'All returns filed',
        'No previous penalty abatements'
      ] : [
        'Document reasonable cause',
        'Provide supporting evidence',
        'Write detailed explanation letter'
      ],
      description: 'Remove or reduce IRS penalties on your tax debt'
    };
    results.push(penaltyResult);
    
    // Innocent Spouse Relief evaluation
    if (assessmentData.circumstances?.includes('divorce') || assessmentData.filingStatus?.includes('married')) {
      const spouseResult: ProgramResult = {
        id: 'spouse',
        name: 'Innocent Spouse Relief',
        type: 'Equitable Relief',
        qualified: assessmentData.circumstances?.includes('divorce'),
        confidence: 'low',
        timeline: { min: 6, max: 12 },
        savings: { min: totalDebt * 0.5, max: totalDebt * 1.0 },
        successRate: 30,
        requirements: [
          'Complete Form 8857',
          'Prove lack of knowledge',
          'Show it would be unfair to hold you liable',
          'Submit within time limits'
        ],
        disqualifyReason: !assessmentData.circumstances?.includes('divorce') ? 
          'Typically requires separation, divorce, or spouse death' : undefined,
        description: 'Relief from joint tax liability due to spouse\'s actions'
      };
      results.push(spouseResult);
    }
    
    return results.sort((a, b) => {
      // Sort by qualification status and confidence
      if (a.qualified && !b.qualified) return -1;
      if (!a.qualified && b.qualified) return 1;
      const confidenceOrder = { high: 3, medium: 2, low: 1 };
      return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
    });
  }, [assessmentData]);
  
  const qualifiedPrograms = programResults.filter(p => p.qualified);
  const disqualifiedPrograms = programResults.filter(p => !p.qualified);
  
  const totalPotentialSavings = qualifiedPrograms.reduce((sum, p) => sum + p.savings.max, 0);
  
  return (
    <ResultsContainer>
      <TopHeader>
        <TopHeaderContent>
          <LogoContainer onClick={() => navigate('/')}>
            <Logo variant="owl" size="small" />
          </LogoContainer>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Start Over
          </Button>
        </TopHeaderContent>
      </TopHeader>
      
      <ContentContainer>
        <Header>
          <Title>Your Tax Relief Options</Title>
          <Subtitle>
            Based on your assessment, we've identified {qualifiedPrograms.length} programs 
            you may qualify for with potential savings up to ${totalPotentialSavings.toLocaleString()}
          </Subtitle>
        </Header>
      
      <ResultsGrid>
        <ProgramsSection>
          <h2 style={{ marginBottom: spacing.lg }}>Qualified Programs</h2>
          
          {qualifiedPrograms.map(program => (
            <ProgramCard
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate(`/program/${program.id}`)}
            >
              <ProgramHeader>
                <ProgramInfo>
                  <ProgramName>{program.name}</ProgramName>
                  <ProgramType>{program.type}</ProgramType>
                </ProgramInfo>
                <ConfidenceBadge level={program.confidence}>
                  {program.confidence === 'high' ? '⭐ High Match' : 
                   program.confidence === 'medium' ? '✓ Good Match' : 
                   '• Possible Match'}
                </ConfidenceBadge>
              </ProgramHeader>
              
              <p style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>
                {program.description}
              </p>
              
              <MetricsGrid>
                <MetricBox>
                  <MetricValue>
                    {program.timeline.min}-{program.timeline.max} mo
                  </MetricValue>
                  <MetricLabel>Timeline</MetricLabel>
                </MetricBox>
                
                {program.savings.max > 0 && (
                  <MetricBox>
                    <MetricValue>
                      ${(program.savings.max / 1000).toFixed(0)}k
                    </MetricValue>
                    <MetricLabel>Potential Savings</MetricLabel>
                  </MetricBox>
                )}
                
                <MetricBox>
                  <MetricValue>{program.successRate}%</MetricValue>
                  <MetricLabel>Success Rate</MetricLabel>
                </MetricBox>
              </MetricsGrid>
              
              <RequirementsList>
                <strong style={{ display: 'block', marginBottom: spacing.sm }}>
                  Requirements:
                </strong>
                {program.requirements.map((req, idx) => (
                  <RequirementItem key={idx}>{req}</RequirementItem>
                ))}
              </RequirementsList>
              
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => navigate('/programs', { state: { fromAssessment: true } })}
              >
                Start Application →
              </Button>
            </ProgramCard>
          ))}
          
          {disqualifiedPrograms.length > 0 && (
            <>
              <h2 style={{ marginTop: spacing['2xl'], marginBottom: spacing.lg }}>
                Programs Requiring Action
              </h2>
              
              {disqualifiedPrograms.map(program => (
                <DisqualifiedCard key={program.id}>
                  <CardContent>
                    <DisqualifiedHeader>
                      <span>⚠️</span>
                      <div>
                        <strong>{program.name}</strong>
                        <div style={{ fontSize: typography.fontSize.sm }}>
                          {program.type}
                        </div>
                      </div>
                    </DisqualifiedHeader>
                    
                    <DisqualifiedReason>
                      <strong>Why you don't qualify yet:</strong><br />
                      {program.disqualifyReason}
                    </DisqualifiedReason>
                    
                    <Button 
                      variant="ghost" 
                      size="small"
                      onClick={() => navigate('/programs', { state: { fromAssessment: true } })}
                    >
                      View All Programs →
                    </Button>
                  </CardContent>
                </DisqualifiedCard>
              ))}
            </>
          )}
        </ProgramsSection>
        
        <SummarySection>
          <SummaryCard variant="elevated">
            <CardHeader>
              <CardTitle>Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <SummaryItem>
                <SummaryLabel>Total Tax Debt</SummaryLabel>
                <SummaryValue>{assessmentData.totalDebt || 'Not specified'}</SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>Monthly Income</SummaryLabel>
                <SummaryValue>
                  ${parseInt(assessmentData.monthlyNetIncome || '0').toLocaleString()}
                </SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>Qualified Programs</SummaryLabel>
                <SummaryValue>{qualifiedPrograms.length}</SummaryValue>
              </SummaryItem>
              
              <SummaryItem>
                <SummaryLabel>Max Potential Savings</SummaryLabel>
                <SummaryValue style={{ color: colors.success[600] }}>
                  ${totalPotentialSavings.toLocaleString()}
                </SummaryValue>
              </SummaryItem>
              
              {assessmentData.wageGarnishment || assessmentData.bankLevy ? (
                <SummaryItem>
                  <SummaryLabel>Priority Status</SummaryLabel>
                  <SummaryValue style={{ color: colors.error[600] }}>
                    Expedited
                  </SummaryValue>
                </SummaryItem>
              ) : null}
              
              <ActionButtons>
                <Button onClick={() => navigate('/portal')}>
                  Start My Case
                </Button>
                <Button variant="secondary" onClick={() => navigate('/consultation')}>
                  Schedule Free Consultation
                </Button>
                <Button variant="ghost" size="small" onClick={() => window.print()}>
                  Download Results
                </Button>
              </ActionButtons>
            </CardContent>
          </SummaryCard>
        </SummarySection>
      </ResultsGrid>
      </ContentContainer>
    </ResultsContainer>
  );
};

export default AssessmentResults;