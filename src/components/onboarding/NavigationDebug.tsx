import React from 'react';
import styled from 'styled-components';
import { useOnboarding } from '../../context/OnboardingContext';
import { colors, spacing, radius, typography, shadows } from '../../theme';

const DebugContainer = styled.div`
  position: fixed;
  bottom: ${spacing.xl};
  left: ${spacing.xl};
  background: ${colors.white};
  border-radius: ${radius.lg};
  padding: ${spacing.md};
  box-shadow: ${shadows.lg};
  display: flex;
  gap: ${spacing.sm};
  align-items: center;
  z-index: 50;
`;

const StepInfo = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin-right: ${spacing.md};
  font-weight: ${typography.fontWeight.medium};
`;

const NavButton = styled.button`
  padding: ${spacing.xs} ${spacing.sm};
  background: ${colors.primary[600]};
  color: ${colors.white};
  border: none;
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: ${colors.primary[700]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const NavigationDebug: React.FC = () => {
  const { state, dispatch } = useOnboarding();
  
  const goToStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };
  
  return (
    <DebugContainer>
      <StepInfo>Step {state.currentStep}/6</StepInfo>
      <NavButton 
        onClick={() => goToStep(1)}
        disabled={state.currentStep === 1}
      >
        1
      </NavButton>
      <NavButton 
        onClick={() => goToStep(2)}
        disabled={state.currentStep === 2}
      >
        2
      </NavButton>
      <NavButton 
        onClick={() => goToStep(3)}
        disabled={state.currentStep === 3}
      >
        3
      </NavButton>
      <NavButton 
        onClick={() => goToStep(4)}
        disabled={state.currentStep === 4}
      >
        4
      </NavButton>
      <NavButton 
        onClick={() => goToStep(5)}
        disabled={state.currentStep === 5}
      >
        5
      </NavButton>
      <NavButton 
        onClick={() => goToStep(6)}
        disabled={state.currentStep === 6}
      >
        6
      </NavButton>
    </DebugContainer>
  );
};

export default NavigationDebug;