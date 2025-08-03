import React, { useState } from 'react';
import Logo from '../common/Logo';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTransitionNavigation } from '../../hooks/useTransitionNavigation';
import { colors, spacing, radius, shadows, typography, transitions, breakpoints } from '../../theme';
import MobileNav from '../common/MobileNav';
import HowItWorks from './sections/HowItWorks';
import Features from './sections/Features';
import Programs from './sections/Programs';
import Testimonials from './sections/Testimonials';
import Pricing from './sections/Pricing';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.cream.main} 0%, ${colors.cream[200]} 100%);
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${colors.gray[100]};
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${spacing.md} ${spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing.md} ${spacing.xl};
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: #2C3E50; /* Night Navy from brand book */
  font-family: ${typography.fontFamily.heading};
  cursor: pointer;
  
  @media (min-width: ${breakpoints.md}) {
    gap: ${spacing.sm};
    font-size: ${typography.fontSize['2xl']};
  }
  
  svg {
    width: 24px;
    height: 24px;
    
    @media (min-width: ${breakpoints.md}) {
      width: 32px;
      height: 32px;
    }
  }
`;

const Nav = styled.nav`
  display: none;
  
  @media (min-width: ${breakpoints.md}) {
    display: flex;
    gap: ${spacing.xl};
  }
`;

const NavLink = styled.a`
  color: #95A5A6; /* Soft Gray from brand book */
  font-weight: ${typography.fontWeight.medium};
  text-decoration: none;
  transition: color ${transitions.base};
  font-family: ${typography.fontFamily.body};
  
  &:hover {
    color: #5A9FD4; /* Medium blue for better readability */
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.sm};
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors.text.primary};
  
  @media (min-width: ${breakpoints.md}) {
    display: none;
  }
  
  &:hover {
    color: ${colors.primary[600]};
  }
`;

const HeaderButtons = styled.div`
  display: none;
  align-items: center;
  gap: ${spacing.md};
  
  @media (min-width: ${breakpoints.md}) {
    display: flex;
  }
`;

const HeaderButton = styled.button<{ variant?: 'ghost' | 'primary' }>`
  padding: ${spacing.sm} ${spacing.lg};
  border-radius: ${radius.md};
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.sm};
  transition: all ${transitions.base};
  cursor: pointer;
  
  ${props => props.variant === 'primary' ? `
    background: #5A9FD4; /* Medium blue */
    color: ${colors.white};
    border: none;
    font-family: ${typography.fontFamily.heading};
    
    &:hover {
      background: #4A8BC7; /* Darker blue */
      transform: translateY(-1px);
    }
  ` : `
    background: transparent;
    color: #2C3E50; /* Night Navy from brand book */
    border: 1px solid #95A5A6; /* Soft Gray border */
    font-family: ${typography.fontFamily.body};
    
    &:hover {
      border-color: #5A9FD4; /* Medium blue */
      color: #5A9FD4;
    }
  `}
`;

const HeroSection = styled.section`
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: calc(80px + ${spacing.xl}) 0 ${spacing.xl};
  background-image: url('/hero-owl-background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 400px;
  height: 50vh;
  max-height: 600px;
  display: flex;
  align-items: center;
  position: relative;
  
  @media (min-width: ${breakpoints.md}) {
    height: 60vh;
    padding: calc(120px + ${spacing.xl}) 0 ${spacing.xl};
  }
  
  @media (min-width: ${breakpoints.lg}) {
    height: 70vh;
    max-height: 700px;
  }
`;

const HeroContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${spacing.lg};
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  
  @media (min-width: ${breakpoints.md}) {
    padding: 0 ${spacing.xl};
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
`;

const TextContainer = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: ${radius['2xl']};
  padding: ${spacing.xl};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (min-width: ${breakpoints.md}) {
    text-align: left;
    max-width: 500px;
    margin-left: auto;
    padding: ${spacing['2xl']};
  }
  
  @media (min-width: ${breakpoints.lg}) {
    max-width: 600px;
    padding: ${spacing['3xl']};
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  line-height: ${typography.lineHeight.tight};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.md};
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.fontSize['3xl']};
  }
  
  @media (min-width: ${breakpoints.lg}) {
    font-size: ${typography.fontSize['4xl']};
    margin-bottom: ${spacing.lg};
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
  margin-bottom: ${spacing.lg};
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.fontSize.lg};
    margin: 0 0 ${spacing.lg};
  }
  
  @media (min-width: ${breakpoints.lg}) {
    font-size: ${typography.fontSize.xl};
    margin-bottom: ${spacing.xl};
  }
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  
  @media (min-width: ${breakpoints.sm}) {
    flex-direction: row;
    gap: ${spacing.md};
  }
  
  @media (min-width: ${breakpoints.md}) {
    justify-content: flex-start;
  }
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' }>`
  padding: ${spacing.md} ${spacing.lg};
  border-radius: ${radius.lg};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${transitions.base};
  border: none;
  width: 100%;
  
  @media (min-width: ${breakpoints.sm}) {
    width: auto;
    padding: ${spacing.md} ${spacing.xl};
    font-size: ${typography.fontSize.lg};
  }
  
  ${props => props.variant === 'primary' ? `
    background: ${colors.primary[600]};
    color: ${colors.white};
    box-shadow: ${shadows.md}, ${shadows.primary};
    
    &:hover {
      background: ${colors.primary[700]};
      transform: translateY(-2px);
      box-shadow: ${shadows.lg}, ${shadows.primary};
    }
  ` : `
    background: ${colors.white};
    color: #5A9FD4; /* Medium blue */
    border: 2px solid #E8F3FC; /* Light blue border */
    font-family: ${typography.fontFamily.body};
    
    &:hover {
      background: #E8F3FC; /* Light blue background on hover */
      border-color: #5A9FD4;
    }
  `}
`;

const TrustBadges = styled(motion.div)`
  margin-top: ${spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  
  @media (min-width: ${breakpoints.sm}) {
    flex-direction: row;
    gap: ${spacing.md};
    margin-top: ${spacing.xl};
  }
  
  @media (min-width: ${breakpoints.md}) {
    justify-content: flex-start;
  }
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  color: ${colors.text.secondary};
  font-size: ${typography.fontSize.sm};
`;

const FeaturesSection = styled.section`
  padding: ${spacing.xl} ${spacing.lg};
  background: ${colors.white};
  border-top: 1px solid ${colors.border.light};
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing['3xl']} ${spacing.xl};
  }
`;

const FeaturesContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.semibold};
  text-align: center;
  margin-bottom: ${spacing.xl};
  color: ${colors.text.primary};
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.fontSize['4xl']};
    margin-bottom: ${spacing['2xl']};
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.lg};
  
  @media (min-width: ${breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${spacing.xl};
  }
`;

const FeatureCard = styled(motion.div)`
  background: ${colors.gray[50]};
  padding: ${spacing.lg};
  border-radius: ${radius.xl};
  border: 1px solid ${colors.border.light};
  transition: all ${transitions.base};
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing.xl};
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.lg};
    border-color: ${colors.primary[200]};
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${colors.primary[100]};
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.md};
  color: ${colors.primary[600]};
`;

const FeatureTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  margin-bottom: ${spacing.sm};
  color: ${colors.text.primary};
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.fontSize.xl};
  }
`;

const FeatureDescription = styled.p`
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
  font-size: ${typography.fontSize.sm};
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.fontSize.base};
  }
`;

const LandingPageResponsive: React.FC = () => {
  const navigate = useNavigate();
  const { navigateWithTransition } = useTransitionNavigation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleStartAssessment = () => {
    navigateWithTransition('/assessment-v2');
  };

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#programs', label: 'Programs' },
    { href: '#testimonials', label: 'Success Stories' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <LogoContainer
            onClick={() => navigate('/')}
          >
            <Logo variant="owl" size="medium" />
            OwlTax
          </LogoContainer>
          <Nav>
            {navLinks.map(link => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </Nav>
          <HeaderButtons>
            <HeaderButton variant="ghost" onClick={() => navigateWithTransition('/login')}>
              Login
            </HeaderButton>
            <HeaderButton variant="primary" onClick={() => navigateWithTransition('/signup')}>
              Get Started
            </HeaderButton>
          </HeaderButtons>
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </MobileMenuButton>
        </HeaderContent>
      </Header>

      <MobileNav 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
      />

      <HeroSection>
        <HeroContent>
                    <div></div> {/* Empty space for image on desktop */}
          <TextContainer>
            <HeroTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Find Your Path to IRS Tax Relief
            </HeroTitle>
            <HeroSubtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Navigate complex IRS programs with confidence. Our expert system analyzes your situation and recommends the best relief options for you.
            </HeroSubtitle>
            <CTAContainer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button variant="primary" onClick={handleStartAssessment}>
                Start Free Assessment
              </Button>
              <Button variant="secondary">
                Learn More
              </Button>
            </CTAContainer>
            <TrustBadges
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Badge>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                IRS Compliant
              </Badge>
              <Badge>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure & Confidential
              </Badge>
              <Badge>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.9/5 User Rating
              </Badge>
            </TrustBadges>
          </TextContainer>
        </HeroContent>
      </HeroSection>

      <FeaturesSection id="features">
        <FeaturesContainer>
          <SectionTitle>Everything You Need for Tax Relief Success</SectionTitle>
          <FeatureGrid>
            <FeatureCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FeatureIcon>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Smart Assessment</FeatureTitle>
              <FeatureDescription>
                Our intelligent questionnaire analyzes your unique situation to identify all available relief options.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FeatureIcon>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 4c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 16c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Personalized Recommendations</FeatureTitle>
              <FeatureDescription>
                Get a ranked list of programs you qualify for, with success probabilities and estimated savings.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FeatureIcon>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Document Guidance</FeatureTitle>
              <FeatureDescription>
                Know exactly what documents you need and get help organizing them for your application.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FeatureIcon>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 3v4a2 2 0 002 2h4m-6-6h-5a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V9m-6-6l6 6m-3 4h-6m6 4h-6m2-8H9" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Form Preparation</FeatureTitle>
              <FeatureDescription>
                We'll help you fill out the right IRS forms correctly, reducing errors and delays.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FeatureIcon>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Progress Tracking</FeatureTitle>
              <FeatureDescription>
                Monitor your application status, deadlines, and next steps all in one place.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FeatureIcon>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Expert Support</FeatureTitle>
              <FeatureDescription>
                Access to tax professionals who can answer questions and guide you through the process.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <HowItWorks />
      <Features />
      <Programs />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />
    </PageContainer>
  );
};

export default LandingPageResponsive;