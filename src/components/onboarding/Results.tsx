import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardSubtitle } from '../common/Card';
import { Button } from '../common/Button';
import { colors, spacing, typography, radius, shadows } from '../../theme';
import { Program } from '../../types/onboarding';

interface ResultsProps {
  programs: Program[];
}

const ResultsContainer = styled(motion.div)`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${spacing['2xl']};
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['4xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.md};
`;

const Subtitle = styled.p`
  font-size: ${typography.fontSize.xl};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
`;

const ProgramGrid = styled.div`
  display: grid;
  gap: ${spacing.lg};
  margin-bottom: ${spacing['2xl']};
`;

const ProgramCard = styled(motion.div)`
  position: relative;
`;

const RankBadge = styled.div<{ type: string }>`
  position: absolute;
  top: ${spacing.lg};
  right: ${spacing.lg};
  width: 48px;
  height: 48px;
  background: ${props => {
    switch(props.type) {
      case '!': return colors.error[100];
      case '★': return colors.warning[100];
      default: return colors.primary[100];
    }
  }};
  color: ${props => {
    switch(props.type) {
      case '!': return colors.error[600];
      case '★': return colors.warning[600];
      default: return colors.primary[600];
    }
  }};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  box-shadow: ${shadows.md};
`;

const ProgramName = styled.h3`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
  padding-right: ${spacing['3xl']};
`;

const ProgramBenefit = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
  margin-bottom: ${spacing.lg};
`;

const ActionBar = styled.div`
  display: flex;
  gap: ${spacing.md};
  padding-top: ${spacing.lg};
  border-top: 1px solid ${colors.border.light};
`;

const InfoBox = styled.div`
  background: ${colors.info[50]};
  border: 1px solid ${colors.info[200]};
  border-radius: ${radius.lg};
  padding: ${spacing.lg};
  margin-bottom: ${spacing.xl};
`;

const InfoText = styled.p`
  color: ${colors.info[800]};
  font-size: ${typography.fontSize.base};
  line-height: ${typography.lineHeight.relaxed};
  margin: 0;
  
  strong {
    font-weight: ${typography.fontWeight.semibold};
  }
`;

const CTASection = styled.div`
  text-align: center;
  padding: ${spacing['2xl']} 0;
`;

const CTATitle = styled.h2`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.lg};
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${spacing.md};
  justify-content: center;
  flex-wrap: wrap;
  margin-top: ${spacing.xl};
`;

const Results: React.FC<ResultsProps> = ({ programs }) => {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const hasUrgentAction = programs.some(p => p.rank === '!');

  return (
    <ResultsContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Header>
        <Title>Your Tax Relief Options</Title>
        <Subtitle>
          Based on your situation, here are the programs you may qualify for
        </Subtitle>
      </Header>

      {hasUrgentAction && (
        <InfoBox>
          <InfoText>
            <strong>Important:</strong> You have required actions that must be completed before proceeding with any relief program. Please address these first.
          </InfoText>
        </InfoBox>
      )}

      <ProgramGrid>
        {programs.map((program, index) => (
          <ProgramCard
            key={index}
            variants={itemVariants}
          >
            <Card variant="elevated" padding="large" hoverable>
              <RankBadge type={program.rank}>
                {program.rank}
              </RankBadge>
              <ProgramName>{program.name}</ProgramName>
              <ProgramBenefit>{program.benefit}</ProgramBenefit>
              
              <ActionBar>
                <Button variant="primary" size="small">
                  Learn More
                </Button>
                <Button variant="secondary" size="small">
                  Check Eligibility
                </Button>
              </ActionBar>
            </Card>
          </ProgramCard>
        ))}
      </ProgramGrid>

      <CTASection>
        <CTATitle>Ready to Take the Next Step?</CTATitle>
        <CTAButtons>
          <Button 
            variant="primary" 
            size="large"
            onClick={() => navigate('/dashboard')}
          >
            Create Your Action Plan
          </Button>
          <Button variant="secondary" size="large">
            Save Results & Continue Later
          </Button>
        </CTAButtons>
      </CTASection>
    </ResultsContainer>
  );
};

export default Results;