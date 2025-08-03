import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import MotionCard from '../../common/MotionCard';
import { Button } from '../../common/Button';
import { colors, spacing, typography, radius, shadows } from '../../../theme';

const WelcomeContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const IconContainer = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, ${colors.primary[100]} 0%, ${colors.primary[200]} 100%);
  border-radius: ${radius['2xl']};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${spacing['2xl']};
  box-shadow: ${shadows.lg};
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['4xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.lg};
  line-height: ${typography.lineHeight.tight};
`;

const Subtitle = styled.p`
  font-size: ${typography.fontSize.xl};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
  margin-bottom: ${spacing['2xl']};
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${spacing['2xl']} 0;
  text-align: left;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.sm} 0;
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
`;

const CheckIcon = styled.div`
  width: 24px;
  height: 24px;
  background: ${colors.success[100]};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${colors.success[600]};
`;

const TimeEstimate = styled.div`
  background: ${colors.gray[100]};
  border-radius: ${radius.full};
  padding: ${spacing.sm} ${spacing.lg};
  display: inline-flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing['2xl']};
`;

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const
      }
    }
  };

  return (
    <MotionCard
      variant="elevated"
      padding="large"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <WelcomeContainer>
        <IconContainer>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <path 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              stroke={colors.primary[600]}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </IconContainer>

        <Title>Welcome to Your Tax Relief Journey</Title>
        <Subtitle>
          Let's find the best IRS relief program for your situation. Our assessment takes just 5 minutes.
        </Subtitle>

        <TimeEstimate>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Estimated time: 5 minutes
        </TimeEstimate>

        <FeatureList>
          <FeatureItem>
            <CheckIcon>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </CheckIcon>
            Get personalized recommendations
          </FeatureItem>
          <FeatureItem>
            <CheckIcon>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </CheckIcon>
            Understand your eligibility instantly
          </FeatureItem>
          <FeatureItem>
            <CheckIcon>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </CheckIcon>
            No commitment required
          </FeatureItem>
        </FeatureList>

        <Button 
          variant="primary" 
          size="large" 
          onClick={onNext}
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          }
          iconPosition="right"
        >
          Start Assessment
        </Button>
      </WelcomeContainer>
    </MotionCard>
  );
};

export default WelcomeStep;