import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, spacing, radius, shadows, typography, transitions } from '../../theme';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{
    href: string;
    label: string;
  }>;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
`;

const NavContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80%;
  max-width: 320px;
  background: ${colors.white};
  box-shadow: ${shadows.xl};
  z-index: 999;
  overflow-y: auto;
`;

const NavHeader = styled.div`
  padding: ${spacing.lg};
  border-bottom: 1px solid ${colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[700]};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${spacing.sm};
  cursor: pointer;
  color: ${colors.text.secondary};
  
  &:hover {
    color: ${colors.text.primary};
  }
`;

const NavLinks = styled.nav`
  padding: ${spacing.lg} 0;
`;

const NavLink = styled.a`
  display: block;
  padding: ${spacing.md} ${spacing.lg};
  color: ${colors.text.primary};
  text-decoration: none;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  transition: all ${transitions.base};
  
  &:hover {
    background: ${colors.gray[50]};
    color: ${colors.primary[600]};
    padding-left: ${spacing.xl};
  }
`;

const CTASection = styled.div`
  padding: ${spacing.lg};
  border-top: 1px solid ${colors.border.light};
  margin-top: auto;
`;

const CTAButton = styled.button`
  width: 100%;
  padding: ${spacing.md};
  background: ${colors.primary[600]};
  color: ${colors.white};
  border: none;
  border-radius: ${radius.lg};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${transitions.base};
  
  &:hover {
    background: ${colors.primary[700]};
  }
`;

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, links }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <NavContainer
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <NavHeader>
              <Logo>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="currentColor" />
                  <path d="M16 8L8 16L16 24L24 16L16 8Z" fill="white" opacity="0.9" />
                </svg>
                OwlTax
              </Logo>
              <CloseButton onClick={onClose}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </CloseButton>
            </NavHeader>
            
            <NavLinks>
              {links.map(link => (
                <NavLink key={link.href} href={link.href} onClick={onClose}>
                  {link.label}
                </NavLink>
              ))}
            </NavLinks>
            
            <CTASection>
              <CTAButton onClick={onClose}>
                Start Free Assessment
              </CTAButton>
            </CTASection>
          </NavContainer>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;