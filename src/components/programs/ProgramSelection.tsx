import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../theme';
import { Card, CardContent } from '../common/Card';
import { Button } from '../common/Button';

const SelectionContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.gray[50]} 100%);
  padding: ${spacing.xl} ${spacing.lg};
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing['2xl']} ${spacing.xl};
  }
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto ${spacing['2xl']};
  text-align: center;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  background: none;
  border: none;
  color: ${colors.text.secondary};
  font-size: ${typography.fontSize.sm};
  cursor: pointer;
  margin-bottom: ${spacing.xl};
  
  &:hover {
    color: ${colors.primary[600]};
  }
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

const ProgramGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: ${spacing.xl};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ProgramCard = styled(motion.div)`
  cursor: pointer;
`;

const ProgramCardInner = styled(Card)`
  height: 100%;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.xl};
    border-color: ${colors.primary[300]};
  }
`;

const ProgramIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${colors.primary[100]};
  color: ${colors.primary[600]};
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize['2xl']};
  margin-bottom: ${spacing.lg};
`;

const ProgramTitle = styled.h3`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const ProgramDescription = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  line-height: 1.6;
  margin-bottom: ${spacing.lg};
`;

const ProgramDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.lg};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  
  &:before {
    content: '✓';
    color: ${colors.success[500]};
    font-weight: bold;
  }
`;

const StartButton = styled(Button)`
  width: 100%;
`;

const programs = [
  {
    id: 'ia',
    route: '/program/installment-agreement',
    icon: '📅',
    title: 'Installment Agreement',
    description: 'Set up a monthly payment plan to pay your tax debt over time.',
    details: [
      'For any amount of tax debt',
      'Flexible payment terms',
      'Stop enforcement actions',
      'Online application available'
    ],
    timeline: '1-2 weeks',
    difficulty: 'Easy'
  },
  {
    id: 'oic',
    route: '/program/offer-in-compromise',
    icon: '💰',
    title: 'Offer in Compromise',
    description: 'Settle your tax debt for less than the full amount you owe.',
    details: [
      'Significant debt reduction',
      'Based on ability to pay',
      'Fresh start opportunity',
      'Requires documentation'
    ],
    timeline: '6-12 months',
    difficulty: 'Complex'
  },
  {
    id: 'cnc',
    route: '/program/currently-not-collectible',
    icon: '⏸️',
    title: 'Currently Not Collectible',
    description: 'Temporarily suspend IRS collection due to financial hardship.',
    details: [
      'Immediate collection relief',
      'For financial hardship',
      'No payments required',
      'Periodic review'
    ],
    timeline: '2-4 weeks',
    difficulty: 'Moderate'
  },
  {
    id: 'penalty',
    route: '/program/penalty-abatement',
    icon: '🎯',
    title: 'Penalty Abatement',
    description: 'Remove or reduce IRS penalties on your tax debt.',
    details: [
      'First-time or reasonable cause',
      'Can save thousands',
      'Quick processing',
      'High approval rate'
    ],
    timeline: '30-60 days',
    difficulty: 'Easy'
  },
  {
    id: 'innocent',
    route: '/program/innocent-spouse',
    icon: '🛡️',
    title: 'Innocent Spouse Relief',
    description: 'Get relief from tax debt caused by your spouse or ex-spouse.',
    details: [
      'Relief from joint liability',
      'For qualifying spouses',
      'Multiple relief types',
      'Protects innocent party'
    ],
    timeline: '6-12 months',
    difficulty: 'Complex'
  }
];

const ProgramSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromAssessment = location.state?.fromAssessment;
  
  return (
    <SelectionContainer>
      <Header>
        <BackButton onClick={() => navigate(fromAssessment ? '/assessment-results' : '/portal')}>
          ← Back {fromAssessment ? 'to Results' : 'to Dashboard'}
        </BackButton>
        <Title>Select Your Tax Relief Program</Title>
        <Subtitle>
          Choose the program that best fits your situation. Each program has different 
          requirements and benefits.
        </Subtitle>
      </Header>
      
      <ProgramGrid>
        {programs.map((program, index) => (
          <ProgramCard
            key={program.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProgramCardInner variant="elevated" onClick={() => navigate(program.route)}>
              <CardContent>
                <ProgramIcon>{program.icon}</ProgramIcon>
                <ProgramTitle>{program.title}</ProgramTitle>
                <ProgramDescription>{program.description}</ProgramDescription>
                
                <ProgramDetails>
                  {program.details.map((detail, idx) => (
                    <DetailItem key={idx}>{detail}</DetailItem>
                  ))}
                </ProgramDetails>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: spacing.lg,
                  fontSize: typography.fontSize.sm
                }}>
                  <div>
                    <strong style={{ color: colors.text.primary }}>Timeline:</strong>{' '}
                    <span style={{ color: colors.text.secondary }}>{program.timeline}</span>
                  </div>
                  <div>
                    <strong style={{ color: colors.text.primary }}>Difficulty:</strong>{' '}
                    <span style={{ 
                      color: program.difficulty === 'Easy' ? colors.success[600] : 
                             program.difficulty === 'Moderate' ? colors.warning[600] : 
                             colors.error[600]
                    }}>
                      {program.difficulty}
                    </span>
                  </div>
                </div>
                
                <StartButton variant="primary" size="small">
                  Start Application →
                </StartButton>
              </CardContent>
            </ProgramCardInner>
          </ProgramCard>
        ))}
      </ProgramGrid>
      
      <Card variant="outlined" style={{ maxWidth: 800, margin: `${spacing['3xl']} auto 0`, textAlign: 'center' }}>
        <CardContent>
          <h3 style={{ marginBottom: spacing.md }}>Not Sure Which Program is Right for You?</h3>
          <p style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>
            Our assessment tool can help determine which programs you qualify for based on your specific situation.
          </p>
          <Button variant="secondary" onClick={() => navigate('/assessment-v2')}>
            Take Assessment
          </Button>
        </CardContent>
      </Card>
    </SelectionContainer>
  );
};

export default ProgramSelection;