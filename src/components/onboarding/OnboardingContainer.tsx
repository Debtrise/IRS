import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, spacing, radius, shadows, breakpoints } from '../../theme';

export const OnboardingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.gray[50]} 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing.md};
  position: relative;
  overflow: hidden;
  
  @media (min-width: ${breakpoints.sm}) {
    padding: ${spacing.lg};
  }
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing.xl};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -30%;
    width: 80%;
    height: 80%;
    background: radial-gradient(circle, ${colors.primary[100]}20 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -30%;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, ${colors.primary[200]}15 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
`;

export const ProgressContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: ${spacing['2xl']};
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${colors.gray[200]};
  border-radius: ${radius.full};
  overflow: hidden;
  position: relative;
  box-shadow: ${shadows.inner};
`;

export const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%);
  border-radius: ${radius.full};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  
  @media (max-width: ${breakpoints.sm}) {
    max-width: 100%;
  }
`;

export const LogoContainer = styled.div`
  position: absolute;
  top: ${spacing.md};
  left: ${spacing.md};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: ${require('../../theme').typography.fontSize.lg};
  font-weight: ${require('../../theme').typography.fontWeight.bold};
  color: ${colors.primary[700]};
  z-index: 10;
  
  @media (min-width: ${breakpoints.sm}) {
    top: ${spacing.lg};
    left: ${spacing.lg};
    gap: ${spacing.sm};
    font-size: ${require('../../theme').typography.fontSize.xl};
  }
  
  @media (min-width: ${breakpoints.md}) {
    top: ${spacing.xl};
    left: ${spacing.xl};
  }
  
  svg {
    width: 24px;
    height: 24px;
    
    @media (min-width: ${breakpoints.sm}) {
      width: 32px;
      height: 32px;
    }
  }
`;

export default OnboardingContainer;