import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { colors, spacing, radius, shadows, typography, transitions } from '../../theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  className?: string;
}

const getVariantStyles = (variant: ButtonProps['variant'] = 'primary') => {
  const styles = {
    primary: css`
      background: ${colors.primary[600]};
      color: ${colors.white};
      border: 2px solid transparent;
      
      &:hover:not(:disabled) {
        background: ${colors.primary[700]};
        transform: translateY(-1px);
        box-shadow: ${shadows.lg}, ${shadows.primary};
      }
      
      &:active:not(:disabled) {
        background: ${colors.primary[800]};
        transform: translateY(0);
      }
    `,
    secondary: css`
      background: ${colors.white};
      color: ${colors.primary[600]};
      border: 2px solid ${colors.border.main};
      
      &:hover:not(:disabled) {
        background: ${colors.gray[50]};
        border-color: ${colors.primary[300]};
        color: ${colors.primary[700]};
      }
      
      &:active:not(:disabled) {
        background: ${colors.gray[100]};
      }
    `,
    ghost: css`
      background: transparent;
      color: ${colors.primary[600]};
      border: 2px solid transparent;
      
      &:hover:not(:disabled) {
        background: ${colors.primary[50]};
        color: ${colors.primary[700]};
      }
      
      &:active:not(:disabled) {
        background: ${colors.primary[100]};
      }
    `,
    danger: css`
      background: ${colors.error[600]};
      color: ${colors.white};
      border: 2px solid transparent;
      
      &:hover:not(:disabled) {
        background: ${colors.error[700]};
        transform: translateY(-1px);
        box-shadow: ${shadows.lg}, ${shadows.error};
      }
      
      &:active:not(:disabled) {
        background: ${colors.error[800]};
        transform: translateY(0);
      }
    `,
  };
  
  return styles[variant];
};

const getSizeStyles = (size: ButtonProps['size'] = 'medium') => {
  const styles = {
    small: css`
      padding: ${spacing.sm} ${spacing.md};
      font-size: ${typography.fontSize.sm};
      gap: ${spacing.xs};
    `,
    medium: css`
      padding: ${spacing.md} ${spacing.lg};
      font-size: ${typography.fontSize.base};
      gap: ${spacing.sm};
    `,
    large: css`
      padding: ${spacing.md} ${spacing.xl};
      font-size: ${typography.fontSize.lg};
      gap: ${spacing.sm};
    `,
  };
  
  return styles[size];
};

const StyledButton = styled(motion.button)<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${typography.fontFamily.body};
  font-weight: ${typography.fontWeight.medium};
  line-height: ${typography.lineHeight.tight};
  border-radius: ${radius.lg};
  cursor: pointer;
  transition: all ${transitions.base};
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  position: relative;
  overflow: hidden;
  
  ${props => getVariantStyles(props.variant)}
  ${props => getSizeStyles(props.size)}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.iconPosition === 'right' && css`
    flex-direction: row-reverse;
  `}
  
  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.loading && css`
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid ${props.variant === 'primary' || props.variant === 'danger' ? colors.white : colors.primary[600]};
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 0.8s linear infinite;
    }
  `}
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      loading={loading}
      iconPosition={iconPosition}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {children}
    </StyledButton>
  );
};

export default Button;