import React from 'react';
import styled from 'styled-components';

interface LogoProps {
  variant?: 'primary' | 'secondary' | 'icon' | 'owl';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LogoContainer = styled.div<{ size: string }>`
  display: flex;
  align-items: center;
  
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          height: 32px;
        `;
      case 'large':
        return `
          height: 64px;
        `;
      default: // medium
        return `
          height: 48px;
        `;
    }
  }}
`;

const LogoImage = styled.img`
  height: 100%;
  width: auto;
  object-fit: contain;
`;

const Logo: React.FC<LogoProps> = ({ 
  variant = 'primary', 
  size = 'medium', 
  className 
}) => {
  const getLogoPath = () => {
    switch (variant) {
      case 'secondary':
        return '/logo-secondary.png';
      case 'icon':
        return '/logo-icon.png';
      case 'owl':
        return '/owl-logo.png';
      default:
        return '/logo-primary.png';
    }
  };

  const getAltText = () => {
    return 'OwlTax - Expert Tax Debt Resolution';
  };

  return (
    <LogoContainer size={size} className={className}>
      <LogoImage 
        src={getLogoPath()} 
        alt={getAltText()}
        loading="eager"
      />
    </LogoContainer>
  );
};

export default Logo;