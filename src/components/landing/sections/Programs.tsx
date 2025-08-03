import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints, transitions } from '../../../theme';
import Button from '../../common/Button';

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

const ProgramsGrid = styled.div`
  display: grid;
  gap: ${spacing.xl};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${spacing['2xl']};
  }
`;

const ProgramCard = styled(motion.div)`
  background: ${colors.white};
  border-radius: ${radius.xl};
  overflow: hidden;
  box-shadow: ${shadows.md};
  border: 1px solid ${colors.border.light};
  transition: all ${transitions.base};
  
  &:hover {
    box-shadow: ${shadows.lg};
    transform: translateY(-4px);
  }
`;

const ProgramHeader = styled.div<{ $color: string }>`
  background: ${props => props.$color};
  padding: ${spacing['2xl']};
  color: ${colors.white};
`;

const ProgramTitle = styled.h3`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  margin-bottom: ${spacing.sm};
`;

const ProgramTagline = styled.p`
  font-size: ${typography.fontSize.base};
  opacity: 0.9;
`;

const ProgramContent = styled.div`
  padding: ${spacing['2xl']};
`;

const ProgramDescription = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
  margin-bottom: ${spacing.lg};
`;

const ProgramBenefits = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${spacing.xl};
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.md};
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  
  &::before {
    content: '✓';
    color: ${colors.success[600]};
    font-weight: ${typography.fontWeight.bold};
    flex-shrink: 0;
  }
`;

const ProgramStats = styled.div`
  display: flex;
  gap: ${spacing.xl};
  margin: ${spacing.xl} 0;
  padding: ${spacing.lg} 0;
  border-top: 1px solid ${colors.border.light};
  border-bottom: 1px solid ${colors.border.light};
`;

const StatItem = styled.div`
  flex: 1;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[700]};
  margin-bottom: ${spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${typography.fontSize.xs};
  color: ${colors.text.secondary};
`;

const ComparisonTable = styled.div`
  background: ${colors.gray[50]};
  border-radius: ${radius.xl};
  padding: ${spacing['3xl']};
  margin-top: ${spacing['4xl']};
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: ${spacing.md};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  border-bottom: 2px solid ${colors.border.light};
  
  &:first-child {
    width: 40%;
  }
`;

const TableCell = styled.td`
  padding: ${spacing.md};
  border-bottom: 1px solid ${colors.border.light};
  color: ${colors.text.secondary};
  
  &:first-child {
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.text.primary};
  }
`;

const CheckMark = styled.span`
  color: ${colors.success[600]};
  font-weight: ${typography.fontWeight.bold};
`;

const Programs: React.FC = () => {
  const navigate = useNavigate();

  const programs = [
    {
      id: 'ia',
      title: 'Installment Agreement',
      tagline: 'Pay your tax debt over time',
      color: colors.primary[600],
      description: 'Set up a monthly payment plan that fits your budget and helps you become compliant with the IRS.',
      benefits: [
        'Flexible payment terms up to 72 months',
        'Stop aggressive collection actions',
        'Avoid property liens and levies',
        'Restore your good standing with the IRS',
      ],
      stats: [
        { value: '6-72', label: 'Months' },
        { value: '$50k+', label: 'Max Debt' },
        { value: '95%', label: 'Approval Rate' },
      ],
    },
    {
      id: 'oic',
      title: 'Offer in Compromise',
      tagline: 'Settle for less than you owe',
      color: colors.info[600],
      description: 'Potentially settle your tax debt for pennies on the dollar if you qualify based on your financial situation.',
      benefits: [
        'Reduce debt by up to 90% or more',
        'One-time payment or short-term plan',
        'Fresh start with the IRS',
        'Remove tax liens after completion',
      ],
      stats: [
        { value: '90%+', label: 'Reduction' },
        { value: '24', label: 'Month Terms' },
        { value: '33%', label: 'Acceptance' },
      ],
    },
    {
      id: 'cnc',
      title: 'Currently Not Collectible',
      tagline: 'Temporary hardship relief',
      color: colors.info[600],
      description: 'Pause IRS collections if you\'re experiencing financial hardship and cannot afford payments.',
      benefits: [
        'Immediate collection relief',
        'No monthly payments required',
        'Protection from levies and garnishments',
        'Time to improve financial situation',
      ],
      stats: [
        { value: 'Immediate', label: 'Relief' },
        { value: '2-3', label: 'Year Review' },
        { value: '85%', label: 'Success Rate' },
      ],
    },
    {
      id: 'penalty',
      title: 'Penalty Abatement',
      tagline: 'Remove penalties and interest',
      color: colors.warning[600],
      description: 'Eliminate or reduce penalties if you have reasonable cause or qualify for first-time abatement.',
      benefits: [
        'Remove failure-to-file penalties',
        'Eliminate failure-to-pay penalties',
        'Reduce overall tax debt significantly',
        'Available for first-time offenders',
      ],
      stats: [
        { value: '100%', label: 'Penalty Relief' },
        { value: '3', label: 'Year Clean Record' },
        { value: '70%', label: 'Approval Rate' },
      ],
    },
  ];

  const comparisonData = [
    { feature: 'Debt Reduction', ia: 'Interest only', oic: 'Up to 90%+', cnc: 'None initially', penalty: 'Penalties only' },
    { feature: 'Monthly Payments', ia: 'Required', oic: 'Optional', cnc: 'None', penalty: 'Varies' },
    { feature: 'Qualification', ia: 'Moderate', oic: 'Strict', cnc: 'Hardship-based', penalty: 'Cause-based' },
    { feature: 'Timeline', ia: '1-2 weeks', oic: '6-12 months', cnc: '2-4 weeks', penalty: '2-8 weeks' },
    { feature: 'Collection Stop', ia: '✓', oic: '✓', cnc: '✓', penalty: 'Partial' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    }),
  };

  return (
    <Section id="programs">
      <SectionHeader>
        <SectionTitle>IRS Tax Relief Programs</SectionTitle>
        <SectionSubtitle>
          Explore your options for resolving tax debt and finding the best path to financial freedom
        </SectionSubtitle>
      </SectionHeader>

      <ProgramsGrid>
        {programs.map((program, index) => (
          <ProgramCard
            key={program.id}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            <ProgramHeader $color={program.color}>
              <ProgramTitle>{program.title}</ProgramTitle>
              <ProgramTagline>{program.tagline}</ProgramTagline>
            </ProgramHeader>
            <ProgramContent>
              <ProgramDescription>{program.description}</ProgramDescription>
              
              <ProgramStats>
                {program.stats.map((stat, statIndex) => (
                  <StatItem key={statIndex}>
                    <StatValue>{stat.value}</StatValue>
                    <StatLabel>{stat.label}</StatLabel>
                  </StatItem>
                ))}
              </ProgramStats>
              
              <ProgramBenefits>
                {program.benefits.map((benefit, benefitIndex) => (
                  <BenefitItem key={benefitIndex}>{benefit}</BenefitItem>
                ))}
              </ProgramBenefits>
              
              <Button fullWidth onClick={() => navigate('/assessment-v2')}>
                Check Eligibility
              </Button>
            </ProgramContent>
          </ProgramCard>
        ))}
      </ProgramsGrid>

      <ComparisonTable>
        <SectionTitle style={{ fontSize: typography.fontSize['2xl'], marginBottom: spacing['2xl'] }}>
          Program Comparison
        </SectionTitle>
        <Table>
          <thead>
            <tr>
              <TableHeader>Feature</TableHeader>
              <TableHeader>Installment</TableHeader>
              <TableHeader>OIC</TableHeader>
              <TableHeader>CNC</TableHeader>
              <TableHeader>Penalty</TableHeader>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr key={index}>
                <TableCell>{row.feature}</TableCell>
                <TableCell>{row.ia === '✓' ? <CheckMark>✓</CheckMark> : row.ia}</TableCell>
                <TableCell>{row.oic === '✓' ? <CheckMark>✓</CheckMark> : row.oic}</TableCell>
                <TableCell>{row.cnc === '✓' ? <CheckMark>✓</CheckMark> : row.cnc}</TableCell>
                <TableCell>{row.penalty === '✓' ? <CheckMark>✓</CheckMark> : row.penalty}</TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </ComparisonTable>
    </Section>
  );
};

export default Programs;