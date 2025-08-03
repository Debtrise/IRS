import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { CardHeader, CardTitle, CardSubtitle } from '../common/Card';
import MotionCard from '../common/MotionCard';
import { Button } from '../common/Button';
import { colors, spacing, typography, radius } from '../../theme';

interface StepCardProps {
  stepNumber?: number;
  title: string;
  subtitle?: string;
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextText?: string;
  children: React.ReactNode;
}

const StepNumber = styled.div`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.primary[600]};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
  margin-bottom: ${spacing.sm};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${spacing.md};
  justify-content: space-between;
  margin-top: ${spacing.xl};
  padding-top: ${spacing.xl};
  border-top: 1px solid ${colors.border.light};
`;

const ContentWrapper = styled.div`
  min-height: 280px;
  display: flex;
  flex-direction: column;
`;

const ChildrenContainer = styled.div`
  flex: 1;
`;

const cardVariants = {
  enter: {
    x: 300,
    opacity: 0
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: {
    zIndex: 0,
    x: -300,
    opacity: 0
  }
};

const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  title,
  subtitle,
  onNext,
  onBack,
  nextDisabled,
  nextText = 'Next',
  children
}) => {
  return (
    <MotionCard
      variant="elevated"
      padding="large"
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
    >
      <ContentWrapper>
        <CardHeader>
          {stepNumber && (
            <StepNumber>Step {stepNumber} of 6</StepNumber>
          )}
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardHeader>

        <ChildrenContainer>
          {children}
        </ChildrenContainer>

        <ButtonContainer>
          {onBack && (
            <Button 
              variant="ghost" 
              onClick={onBack}
              icon={
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
              }
            >
              Back
            </Button>
          )}
          <div style={{ flex: 1 }} />
          {onNext && (
            <Button 
              onClick={onNext} 
              disabled={nextDisabled}
              icon={
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              }
              iconPosition="right"
            >
              {nextText}
            </Button>
          )}
        </ButtonContainer>
      </ContentWrapper>
    </MotionCard>
  );
};

export default StepCard;