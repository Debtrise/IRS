import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../../theme';

const Section = styled.section`
  padding: ${spacing['4xl']} ${spacing.lg};
  max-width: 1280px;
  margin: 0 auto;
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing['5xl']} ${spacing.xl};
  }
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

const StepsContainer = styled.div`
  display: grid;
  gap: ${spacing['2xl']};
  margin-bottom: ${spacing['4xl']};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
    gap: ${spacing.lg};
  }
`;

const StepCard = styled(motion.div)`
  background: ${colors.white};
  border-radius: ${radius.lg};
  padding: ${spacing.xl};
  box-shadow: ${shadows.sm};
  border: 1px solid ${colors.border.light};
  position: relative;
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing['2xl']};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -${spacing.xl};
    width: ${spacing.xl};
    height: 2px;
    background: ${colors.primary[200]};
    display: none;
    
    @media (min-width: ${breakpoints.md}) {
      display: block;
    }
  }
  
  &:last-child::after {
    display: none;
  }
`;

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  background: ${colors.primary[100]};
  color: ${colors.primary[700]};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  margin-bottom: ${spacing.lg};
`;

const StepTitle = styled.h3`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.md};
`;

const StepDescription = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
`;

const TimelineContainer = styled.div`
  background: ${colors.gray[50]};
  border-radius: ${radius.xl};
  padding: ${spacing['3xl']};
  margin-top: ${spacing['4xl']};
`;

const TimelineTitle = styled.h3`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  text-align: center;
  margin-bottom: ${spacing['3xl']};
`;

const TimelineGrid = styled.div`
  display: grid;
  gap: ${spacing.xl};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TimelineItem = styled.div`
  text-align: center;
`;

const TimelineIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${colors.white};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${spacing.lg};
  box-shadow: ${shadows.md};
  font-size: 28px;
`;

const TimelineItemTitle = styled.h4`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const TimelineItemText = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Free Assessment',
      description: 'Complete our comprehensive questionnaire to evaluate your tax situation and identify relief options.',
    },
    {
      number: 2,
      title: 'Expert Analysis',
      description: 'Our AI-powered system and tax experts analyze your case to determine the best relief programs.',
    },
    {
      number: 3,
      title: 'Document Preparation',
      description: 'We help you gather and prepare all necessary documents for your chosen relief program.',
    },
    {
      number: 4,
      title: 'IRS Submission',
      description: 'Your case is professionally prepared and submitted to the IRS with ongoing support.',
    },
  ];

  const timeline = [
    {
      icon: '📊',
      title: 'Week 1-2',
      text: 'Initial assessment and program selection',
    },
    {
      icon: '📄',
      title: 'Week 3-4',
      text: 'Document collection and case preparation',
    },
    {
      icon: '✅',
      title: 'Week 5+',
      text: 'IRS submission and resolution tracking',
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
    <Section id="how-it-works">
      <SectionHeader>
        <SectionTitle>How It Works</SectionTitle>
        <SectionSubtitle>
          From assessment to resolution, we guide you through every step of the tax relief process
        </SectionSubtitle>
      </SectionHeader>

      <StepsContainer>
        {steps.map((step, index) => (
          <StepCard
            key={step.number}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            <StepNumber>{step.number}</StepNumber>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </StepCard>
        ))}
      </StepsContainer>

      <TimelineContainer>
        <TimelineTitle>Typical Resolution Timeline</TimelineTitle>
        <TimelineGrid>
          {timeline.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineIcon>{item.icon}</TimelineIcon>
              <TimelineItemTitle>{item.title}</TimelineItemTitle>
              <TimelineItemText>{item.text}</TimelineItemText>
            </TimelineItem>
          ))}
        </TimelineGrid>
      </TimelineContainer>
    </Section>
  );
};

export default HowItWorks;