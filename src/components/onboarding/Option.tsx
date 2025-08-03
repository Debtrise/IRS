import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, spacing, radius, shadows, typography, transitions } from '../../theme';

interface OptionProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const OptionContainer = styled(motion.div)<{ selected: boolean }>`
  background: ${props => props.selected ? colors.primary[50] : colors.white};
  border: 2px solid ${props => props.selected ? colors.primary[500] : colors.border.main};
  border-radius: ${radius.lg};
  padding: ${spacing.lg};
  cursor: pointer;
  transition: all ${transitions.base};
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: ${spacing.md};
  
  &:hover {
    border-color: ${props => props.selected ? colors.primary[600] : colors.primary[300]};
    background: ${props => props.selected ? colors.primary[100] : colors.gray[50]};
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const OptionTitle = styled.h4`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing.xs} 0;
  line-height: ${typography.lineHeight.tight};
`;

export const OptionDescription = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  margin: 0;
  line-height: ${typography.lineHeight.relaxed};
`;

export const RadioCustom = styled.div<{ selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${radius.full};
  border: 2px solid ${props => props.selected ? colors.primary[600] : colors.border.dark};
  background: ${props => props.selected ? colors.primary[600] : colors.white};
  position: relative;
  flex-shrink: 0;
  transition: all ${transitions.base};
  margin-top: 2px;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(${props => props.selected ? 1 : 0});
    width: 6px;
    height: 6px;
    border-radius: ${radius.full};
    background: ${colors.white};
    transition: transform ${transitions.base};
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: ${colors.primary[100]};
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${colors.primary[600]};
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const Option: React.FC<OptionProps> = ({ selected, onClick, children, icon }) => {
  return (
    <OptionContainer
      selected={selected}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <ContentWrapper>{children}</ContentWrapper>
      <RadioCustom selected={selected} />
    </OptionContainer>
  );
};

export { Option };
export default Option;