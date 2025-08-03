import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, spacing, radius, shadows, typography, breakpoints, transitions } from '../../../theme';

const Section = styled.section`
  padding: ${spacing['4xl']} ${spacing.lg};
  background: ${colors.gray[50]};
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing['5xl']} ${spacing.xl};
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${spacing['4xl']};
`;

const SectionTitle = styled.h2`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.lg};
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.fontSize['4xl']};
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: ${typography.lineHeight.relaxed};
`;

const FeaturesGrid = styled.div`
  display: grid;
  gap: ${spacing.xl};
  margin-bottom: ${spacing['4xl']};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${spacing['2xl']};
  }
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled(motion.div)`
  background: ${colors.white};
  border-radius: ${radius.lg};
  padding: ${spacing['2xl']};
  box-shadow: ${shadows.sm};
  border: 1px solid ${colors.border.light};
  transition: all ${transitions.base};
  
  &:hover {
    box-shadow: ${shadows.md};
    transform: translateY(-2px);
  }
`;

const FeatureIcon = styled.div`
  width: 56px;
  height: 56px;
  background: ${colors.primary[100]};
  border-radius: ${radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.lg};
  font-size: 28px;
`;

const FeatureTitle = styled.h3`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.md};
`;

const FeatureDescription = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
  margin-bottom: ${spacing.lg};
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.sm};
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  
  &::before {
    content: '✓';
    color: ${colors.success[600]};
    font-weight: ${typography.fontWeight.bold};
    flex-shrink: 0;
  }
`;



const Features: React.FC = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms analyze your tax situation to identify the best relief programs.',
      items: [
        'Real-time eligibility assessment',
        'Personalized recommendations',
        'Success probability scoring',
      ],
    },
    {
      icon: '👥',
      title: 'Expert Support',
      description: 'Experienced tax professionals guide you through the entire process.',
      items: [
        'Dedicated case specialist',
        'IRS communication handling',
        'Unlimited consultations',
      ],
    },
    {
      icon: '📄',
      title: 'Document Management',
      description: 'Streamlined document collection and preparation for IRS submissions.',
      items: [
        'Secure cloud storage',
        'Automated form filling',
        'Document checklist tracking',
      ],
    },
    {
      icon: '💰',
      title: 'Maximum Savings',
      description: 'Optimize your relief strategy to minimize tax liability and penalties.',
      items: [
        'Penalty abatement strategies',
        'Interest reduction tactics',
        'Payment plan optimization',
      ],
    },
    {
      icon: '🔒',
      title: 'Secure & Confidential',
      description: 'Bank-level security protects your sensitive financial information.',
      items: [
        '256-bit SSL encryption',
        'SOC 2 compliance',
        'Regular security audits',
      ],
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Real-time updates on your case status and IRS communications.',
      items: [
        'Dashboard overview',
        'Milestone notifications',
        'Timeline estimates',
      ],
    },
  ];



  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    }),
  };

  return (
    <Section id="features">
      <Container>
        <SectionHeader>
          <SectionTitle>Powerful Features for Tax Relief</SectionTitle>
          <SectionSubtitle>
            Everything you need to resolve your tax debt and get back on track
          </SectionSubtitle>
        </SectionHeader>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <FeatureList>
                {feature.items.map((item, itemIndex) => (
                  <FeatureListItem key={itemIndex}>{item}</FeatureListItem>
                ))}
              </FeatureList>
            </FeatureCard>
          ))}
        </FeaturesGrid>


      </Container>
    </Section>
  );
};

export default Features;