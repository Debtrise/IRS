import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { colors, spacing, radius, shadows } from '../../theme';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'small' | 'medium' | 'large';
  hoverable?: boolean;
  clickable?: boolean;
  fullHeight?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  as?: any;
  style?: React.CSSProperties;
}

const getVariantStyles = (variant: CardProps['variant'] = 'default') => {
  const styles = {
    default: css`
      background: ${colors.white};
      border: 1px solid ${colors.border.light};
      box-shadow: ${shadows.sm};
    `,
    elevated: css`
      background: ${colors.white};
      border: 1px solid transparent;
      box-shadow: ${shadows.md};
    `,
    outlined: css`
      background: ${colors.white};
      border: 2px solid ${colors.border.main};
      box-shadow: none;
    `,
    glass: css`
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: ${shadows.lg};
    `,
  };
  
  return styles[variant];
};

const getPaddingStyles = (padding: CardProps['padding'] = 'medium') => {
  const styles = {
    none: css`
      padding: 0;
    `,
    small: css`
      padding: ${spacing.md};
    `,
    medium: css`
      padding: ${spacing.lg};
    `,
    large: css`
      padding: ${spacing.xl};
    `,
  };
  
  return styles[padding];
};

const StyledCard = styled.div<CardProps>`
  border-radius: ${radius.xl};
  transition: all ${require('../../theme').transitions.base};
  position: relative;
  overflow: hidden;
  
  ${props => getVariantStyles(props.variant)}
  ${props => getPaddingStyles(props.padding)}
  
  ${props => props.fullHeight && css`
    height: 100%;
  `}
  
  ${props => props.hoverable && css`
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${shadows.lg};
      
      ${props.variant === 'outlined' && css`
        border-color: ${colors.primary[300]};
      `}
    }
  `}
  
  ${props => props.clickable && css`
    cursor: pointer;
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'medium',
  hoverable = false,
  clickable = false,
  fullHeight = false,
  children,
  onClick,
  className,
  as,
  ...props
}) => {
  const isMotion = as && typeof as === 'object' && 'animate' in as;
  
  return (
    <StyledCard
      as={as}
      variant={variant}
      padding={padding}
      hoverable={hoverable}
      clickable={clickable || !!onClick}
      fullHeight={fullHeight}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

// Card subcomponents
export const CardHeader = styled.div`
  margin-bottom: ${spacing.lg};
  
  ${StyledCard}[padding="none"] & {
    padding: ${spacing.lg} ${spacing.lg} 0;
    margin-bottom: ${spacing.md};
  }
`;

export const CardTitle = styled.h3`
  font-size: ${require('../../theme').typography.fontSize['2xl']};
  font-weight: ${require('../../theme').typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing.sm} 0;
  line-height: ${require('../../theme').typography.lineHeight.tight};
`;

export const CardSubtitle = styled.p`
  font-size: ${require('../../theme').typography.fontSize.base};
  color: ${colors.text.secondary};
  margin: 0;
  line-height: ${require('../../theme').typography.lineHeight.relaxed};
`;

export const CardContent = styled.div`
  ${StyledCard}[padding="none"] & {
    padding: 0 ${spacing.lg} ${spacing.lg};
  }
`;

export const CardFooter = styled.div`
  margin-top: ${spacing.lg};
  padding-top: ${spacing.lg};
  border-top: 1px solid ${colors.border.light};
  
  ${StyledCard}[padding="none"] & {
    padding: ${spacing.lg};
    margin-top: 0;
    background: ${colors.gray[50]};
    border-top: 1px solid ${colors.border.light};
  }
`;

export default Card;