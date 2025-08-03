import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, typography, breakpoints, transitions } from '../../../theme';

const FooterSection = styled.footer`
  background: ${colors.gray[900]};
  color: ${colors.white};
  padding: ${spacing['4xl']} ${spacing.lg} ${spacing['2xl']};
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing['5xl']} ${spacing.xl} ${spacing['3xl']};
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  gap: ${spacing['3xl']};
  margin-bottom: ${spacing['4xl']};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: ${spacing['4xl']};
  }
`;

const FooterColumn = styled.div``;

const BrandSection = styled.div``;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  margin-bottom: ${spacing.lg};
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const BrandDescription = styled.p`
  font-size: ${typography.fontSize.base};
  line-height: ${typography.lineHeight.relaxed};
  color: ${colors.gray[400]};
  margin-bottom: ${spacing.xl};
  max-width: 350px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${spacing.md};
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  background: ${colors.gray[800]};
  border-radius: ${radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${transitions.base};
  
  &:hover {
    background: ${colors.primary[600]};
    transform: translateY(-2px);
  }
  
  svg {
    width: 20px;
    height: 20px;
    fill: ${colors.white};
  }
`;

const ColumnTitle = styled.h4`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  margin-bottom: ${spacing.lg};
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LinkItem = styled.li`
  margin-bottom: ${spacing.md};
`;

const FooterLink = styled.a`
  color: ${colors.gray[400]};
  text-decoration: none;
  font-size: ${typography.fontSize.base};
  transition: color ${transitions.base};
  cursor: pointer;
  
  &:hover {
    color: ${colors.white};
  }
`;

const Divider = styled.div`
  border-top: 1px solid ${colors.gray[800]};
  margin: ${spacing['3xl']} 0;
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  align-items: center;
  text-align: center;
  
  @media (min-width: ${breakpoints.md}) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
`;

const Copyright = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.gray[500]};
`;

const LegalLinks = styled.div`
  display: flex;
  gap: ${spacing.xl};
  flex-wrap: wrap;
  justify-content: center;
  
  @media (min-width: ${breakpoints.md}) {
    justify-content: flex-start;
  }
`;

const LegalLink = styled.a`
  color: ${colors.gray[500]};
  font-size: ${typography.fontSize.sm};
  text-decoration: none;
  transition: color ${transitions.base};
  
  &:hover {
    color: ${colors.white};
  }
`;

const TrustBadges = styled.div`
  display: flex;
  gap: ${spacing.lg};
  margin-top: ${spacing.xl};
  flex-wrap: wrap;
  justify-content: center;
  
  @media (min-width: ${breakpoints.md}) {
    justify-content: flex-start;
  }
`;

const Badge = styled.div`
  background: ${colors.gray[800]};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.xs};
  color: ${colors.gray[400]};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const footerLinks = {
    services: [
      { label: 'Tax Assessment', onClick: () => navigate('/assessment-v2') },
      { label: 'IRS Programs', onClick: () => navigate('/programs') },
      { label: 'Document Hub', onClick: () => navigate('/documents') },
      { label: 'Case Tracking', onClick: () => navigate('/status') },
    ],
    resources: [
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Success Stories', href: '#testimonials' },
      { label: 'Tax Blog', href: '/blog' },
      { label: 'IRS Resources', href: '/resources' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '#contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Admin Portal', onClick: () => navigate('/admin/login') },
    ],
  };

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ];

  const badges = [
    '🔒 SSL Secured',
    '✓ SOC 2 Compliant',
    '🛡️ A+ BBB Rating',
    '🏆 IRS Authorized',
  ];

  return (
    <FooterSection>
      <Container>
        <FooterGrid>
          <FooterColumn>
            <BrandSection>
              <Logo>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                OwlTax
              </Logo>
              <BrandDescription>
                Your trusted partner in IRS tax debt resolution. We've helped thousands of Americans 
                find relief and get back on track.
              </BrandDescription>
              <SocialLinks>
                {socialLinks.map((social) => (
                  <SocialLink
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </SocialLink>
                ))}
              </SocialLinks>
              <TrustBadges>
                {badges.map((badge, index) => (
                  <Badge key={index}>{badge}</Badge>
                ))}
              </TrustBadges>
            </BrandSection>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Services</ColumnTitle>
            <LinkList>
              {footerLinks.services.map((link, index) => (
                <LinkItem key={index}>
                  <FooterLink onClick={link.onClick}>
                    {link.label}
                  </FooterLink>
                </LinkItem>
              ))}
            </LinkList>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Resources</ColumnTitle>
            <LinkList>
              {footerLinks.resources.map((link, index) => (
                <LinkItem key={index}>
                  <FooterLink href={link.href}>
                    {link.label}
                  </FooterLink>
                </LinkItem>
              ))}
            </LinkList>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Company</ColumnTitle>
            <LinkList>
              {footerLinks.company.map((link, index) => (
                <LinkItem key={index}>
                  <FooterLink href={link.href}>
                    {link.label}
                  </FooterLink>
                </LinkItem>
              ))}
            </LinkList>
          </FooterColumn>
        </FooterGrid>

        <Divider />

        <BottomSection>
          <Copyright>
            © {new Date().getFullYear()} OwlTax. All rights reserved.
          </Copyright>
          <LegalLinks>
            <LegalLink href="/privacy">Privacy Policy</LegalLink>
            <LegalLink href="/terms">Terms of Service</LegalLink>
            <LegalLink href="/disclaimer">Disclaimer</LegalLink>
            <LegalLink href="/accessibility">Accessibility</LegalLink>
          </LegalLinks>
        </BottomSection>
      </Container>
    </FooterSection>
  );
};

export default Footer;