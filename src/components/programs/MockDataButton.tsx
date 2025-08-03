import React from 'react';
import styled from 'styled-components';
import { colors, spacing, radius, shadows, typography, transitions } from '../../theme';
import { generateProgramMockData } from '../../utils/mockData';

const MockButton = styled.button`
  position: fixed;
  bottom: ${spacing.xl};
  right: ${spacing.xl};
  background: ${colors.warning[500]};
  color: ${colors.white};
  border: none;
  border-radius: ${radius.full};
  padding: ${spacing.sm} ${spacing.lg};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  box-shadow: ${shadows.lg};
  cursor: pointer;
  transition: all ${transitions.base};
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  z-index: 50;
  
  &:hover {
    background: ${colors.warning[600]};
    transform: translateY(-2px);
    box-shadow: ${shadows.xl};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Badge = styled.span`
  background: ${colors.warning[700]};
  padding: 2px 6px;
  border-radius: ${radius.full};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.bold};
`;

interface MockDataButtonProps {
  programId: string;
  onLoadMockData: (data: any) => void;
}

export const MockDataButton: React.FC<MockDataButtonProps> = ({ programId, onLoadMockData }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  const handleClick = () => {
    const mockData = generateProgramMockData(programId);
    onLoadMockData(mockData);
  };
  
  return (
    <MockButton onClick={handleClick}>
      <Badge>DEV</Badge>
      Load Test Data
    </MockButton>
  );
};

export default MockDataButton;