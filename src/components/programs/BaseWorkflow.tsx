import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../theme';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../common/Card';
import { Button } from '../common/Button';

export const WorkflowContainer = styled.div`
  min-height: 100vh;
  background: ${colors.gray[50]};
`;

export const Header = styled.header`
  background: ${colors.white};
  border-bottom: 1px solid ${colors.border.light};
  box-shadow: ${shadows.sm};
`;

export const HeaderContent = styled.div`
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

export const BackButton = styled.button`
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

export const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${spacing.xl} ${spacing.lg};
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing['2xl']} ${spacing.xl};
  }
`;

export const WorkflowHeader = styled.div`
  margin-bottom: ${spacing['2xl']};
`;

export const WorkflowTitle = styled.h1`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.fontSize['3xl']};
  }
`;

export const WorkflowSubtitle = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colors.text.secondary};
`;

// Progress Indicator
export const ProgressSection = styled.div`
  margin-bottom: ${spacing['2xl']};
`;

export const ProgressSteps = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
  
  @media (max-width: ${breakpoints.md}) {
    display: none;
  }
`;

export const ProgressStep = styled.div<{ active?: boolean; completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize.sm};
  color: ${props => 
    props.active ? colors.primary[600] : 
    props.completed ? colors.success[600] : 
    colors.text.secondary
  };
  font-weight: ${props => props.active ? typography.fontWeight.semibold : typography.fontWeight.normal};
`;

export const StepNumber = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${typography.fontWeight.semibold};
  transition: all 0.2s ease;
  
  ${props => {
    if (props.completed) {
      return `
        background: ${colors.success[500]};
        color: ${colors.white};
      `;
    }
    if (props.active) {
      return `
        background: ${colors.primary[500]};
        color: ${colors.white};
      `;
    }
    return `
      background: ${colors.gray[200]};
      color: ${colors.text.secondary};
    `;
  }}
`;

export const StepConnector = styled.div<{ completed?: boolean }>`
  flex: 1;
  height: 2px;
  background: ${props => props.completed ? colors.success[500] : colors.gray[200]};
  margin: 0 ${spacing.sm};
`;

export const MobileProgress = styled.div`
  display: none;
  
  @media (max-width: ${breakpoints.md}) {
    display: block;
    margin-bottom: ${spacing.lg};
  }
`;

export const ProgressBar = styled.div`
  height: 8px;
  background: ${colors.gray[200]};
  border-radius: ${radius.full};
  overflow: hidden;
  margin-bottom: ${spacing.sm};
`;

export const ProgressFill = styled(motion.div)<{ progress: number }>`
  height: 100%;
  background: ${colors.primary[500]};
`;

export const ProgressText = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  text-align: center;
`;

// Form Elements
export const FormSection = styled(Card)`
  margin-bottom: ${spacing.xl};
`;

export const FormGroup = styled.div`
  margin-bottom: ${spacing.lg};
`;

export const Label = styled.label`
  display: block;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

export const RequiredIndicator = styled.span`
  color: ${colors.error[600]};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${spacing.md};
  border: 1px solid ${colors.border.main};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.base};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
  
  &:disabled {
    background: ${colors.gray[50]};
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: ${spacing.md};
  border: 1px solid ${colors.border.main};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.base};
  background: ${colors.white};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
  
  &:disabled {
    background: ${colors.gray[50]};
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${spacing.md};
  border: 1px solid ${colors.border.main};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.base};
  font-family: inherit;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  cursor: pointer;
  padding: ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.md};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.primary[300]};
    background: ${colors.primary[50]};
  }
  
  input[type="radio"]:checked + & {
    border-color: ${colors.primary[500]};
    background: ${colors.primary[50]};
  }
`;

export const InputRow = styled.div`
  display: grid;
  gap: ${spacing.md};
  
  @media (min-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const HelpText = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin-top: ${spacing.xs};
`;

export const ErrorMessage = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.error[600]};
  margin-top: ${spacing.xs};
`;

// Info Box
export const InfoBox = styled(Card)`
  background: ${colors.info[50]};
  border: 1px solid ${colors.info[200]};
  margin-bottom: ${spacing.xl};
`;

export const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${colors.info[100]};
  color: ${colors.info[600]};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize.xl};
  flex-shrink: 0;
`;

export const InfoContent = styled.div`
  display: flex;
  gap: ${spacing.md};
`;

export const InfoText = styled.div`
  flex: 1;
  
  h4 {
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.semibold};
    color: ${colors.info[900]};
    margin-bottom: ${spacing.xs};
  }
  
  p {
    font-size: ${typography.fontSize.sm};
    color: ${colors.info[800]};
    line-height: 1.6;
  }
`;

// Navigation
export const NavigationSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${spacing['2xl']};
`;

export const SaveDraftButton = styled(Button)`
  @media (max-width: ${breakpoints.sm}) {
    display: none;
  }
`;

// Document Upload
export const DocumentUploadSection = styled(Card)`
  margin-bottom: ${spacing.xl};
`;

export const UploadArea = styled.div<{ isDragging?: boolean }>`
  border: 2px dashed ${props => props.isDragging ? colors.primary[500] : colors.border.main};
  border-radius: ${radius.lg};
  padding: ${spacing.xl};
  text-align: center;
  background: ${props => props.isDragging ? colors.primary[50] : colors.gray[50]};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${colors.primary[300]};
    background: ${colors.primary[50]};
  }
`;

export const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto ${spacing.md};
  background: ${colors.primary[100]};
  color: ${colors.primary[600]};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize.xl};
`;

export const UploadText = styled.div`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

export const UploadSubtext = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

// Document List
export const DocumentList = styled.div`
  margin-top: ${spacing.lg};
`;

export const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.md};
  margin-bottom: ${spacing.sm};
`;

export const DocumentIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${colors.gray[100]};
  color: ${colors.gray[600]};
  border-radius: ${radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.bold};
`;

export const DocumentInfo = styled.div`
  flex: 1;
  
  .name {
    font-size: ${typography.fontSize.sm};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.text.primary};
  }
  
  .size {
    font-size: ${typography.fontSize.xs};
    color: ${colors.text.secondary};
  }
`;

export const RemoveButton = styled.button`
  padding: ${spacing.xs};
  background: none;
  border: none;
  color: ${colors.text.secondary};
  cursor: pointer;
  border-radius: ${radius.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.error[50]};
    color: ${colors.error[600]};
  }
`;

// Summary Section
export const SummarySection = styled(Card)`
  background: ${colors.primary[50]};
  border: 1px solid ${colors.primary[200]};
`;

export const SummaryGrid = styled.div`
  display: grid;
  gap: ${spacing.lg};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const SummaryItem = styled.div`
  h4 {
    font-size: ${typography.fontSize.sm};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.text.secondary};
    margin-bottom: ${spacing.xs};
  }
  
  p {
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.semibold};
    color: ${colors.text.primary};
  }
`;

// Base Workflow Props
export interface WorkflowStep {
  id: string;
  title: string;
  component: React.ComponentType<any>;
}

export interface BaseWorkflowProps {
  steps: WorkflowStep[];
  title: string;
  subtitle: string;
  onComplete: (data: any) => void;
}

// Export utilities
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return re.test(phone);
};

export const validateSSN = (ssn: string): boolean => {
  const re = /^\d{3}-?\d{2}-?\d{4}$/;
  return re.test(ssn);
};