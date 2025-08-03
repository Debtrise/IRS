import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints, transitions } from '../../../theme';
import Button from '../../common/Button';

const Section = styled.section`
  padding: ${spacing['4xl']} ${spacing.lg};
  background: ${colors.white};
  
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

const BillingToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.lg};
  margin-bottom: ${spacing['3xl']};
`;

const BillingOption = styled.span<{ $active: boolean }>`
  font-weight: ${typography.fontWeight.medium};
  color: ${props => props.$active ? colors.text.primary : colors.text.secondary};
`;

const Toggle = styled.button`
  width: 56px;
  height: 28px;
  background: ${colors.gray[200]};
  border-radius: ${radius.full};
  border: none;
  cursor: pointer;
  position: relative;
  transition: background ${transitions.base};
  
  &::after {
    content: '';
    position: absolute;
    top: 4px;
    left: ${(props: any) => props['data-annual'] === 'true' ? '32px' : '4px'};
    width: 20px;
    height: 20px;
    background: ${colors.white};
    border-radius: ${radius.full};
    transition: left ${transitions.base};
    box-shadow: ${shadows.sm};
  }
  
  &[data-annual="true"] {
    background: ${colors.primary[600]};
  }
`;

const PricingGrid = styled.div`
  display: grid;
  gap: ${spacing.xl};
  margin-bottom: ${spacing['4xl']};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${spacing['2xl']};
  }
`;

const PricingCard = styled(motion.div)<{ $featured?: boolean }>`
  background: ${colors.white};
  border-radius: ${radius.xl};
  padding: ${spacing['2xl']};
  box-shadow: ${props => props.$featured ? shadows.lg : shadows.md};
  border: 2px solid ${props => props.$featured ? colors.primary[600] : colors.border.light};
  position: relative;
  
  ${props => props.$featured && `
    @media (min-width: ${breakpoints.md}) {
      transform: scale(1.05);
    }
  `}
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${colors.primary[600]};
  color: ${colors.white};
  padding: ${spacing.xs} ${spacing.lg};
  border-radius: ${radius.full};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
`;

const PlanName = styled.h3`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const PlanDescription = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.xl};
  line-height: ${typography.lineHeight.relaxed};
`;

const Price = styled.div`
  margin-bottom: ${spacing.xl};
`;

const PriceAmount = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${spacing.xs};
  margin-bottom: ${spacing.sm};
`;

const Currency = styled.span`
  font-size: ${typography.fontSize.xl};
  color: ${colors.text.secondary};
`;

const Amount = styled.span`
  font-size: ${typography.fontSize['4xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
`;

const Period = styled.span`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
`;

const Savings = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.success[600]};
  font-weight: ${typography.fontWeight.medium};
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${spacing['2xl']};
`;

const Feature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.md};
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  
  &::before {
    content: '✓';
    color: ${colors.success[600]};
    font-weight: ${typography.fontWeight.bold};
    flex-shrink: 0;
  }
`;

const FAQSection = styled.div`
  max-width: 800px;
  margin: ${spacing['5xl']} auto 0;
`;

const FAQTitle = styled.h3`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  text-align: center;
  margin-bottom: ${spacing['3xl']};
`;

const FAQItem = styled.div`
  margin-bottom: ${spacing.xl};
  padding-bottom: ${spacing.xl};
  border-bottom: 1px solid ${colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const Question = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
`;

const Answer = styled(motion.div)`
  margin-top: ${spacing.md};
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
`;

const MoneyBackGuarantee = styled.div`
  background: ${colors.primary[50]};
  border-radius: ${radius.xl};
  padding: ${spacing['3xl']};
  text-align: center;
  margin-top: ${spacing['4xl']};
`;

const GuaranteeTitle = styled.h3`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[700]};
  margin-bottom: ${spacing.md};
`;

const GuaranteeText = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  max-width: 600px;
  margin: 0 auto;
  line-height: ${typography.lineHeight.relaxed};
`;

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const plans = [
    {
      name: 'AI Success Model',
      description: 'Our revolutionary pay-only-for-results approach',
      monthlyPrice: null,
      annualPrice: null,
      successFee: '10%',
      featured: true,
      features: [
        'FREE comprehensive AI analysis',
        'NO upfront costs or retainer fees',
        'NO investigation fees (save $3,000+)',
        'Pay only 10% of your TOTAL tax debt',
        'Only pay if we save you money',
        '100% money-back guarantee',
        'Expert case specialists',
        'IRS negotiation & representation',
        'Document preparation & filing',
        '24/7 AI-powered case tracking',
        'Priority customer support',
        'Real-time progress updates',
      ],
    },
  ];

  const faqs = [
    {
      question: 'How does the 10% success fee work?',
      answer: 'You pay only 10% of your TOTAL tax debt – not our savings. For example, if you owe $50,000, our fee is $5,000 regardless of whether we save you $30,000 or $45,000. You only pay if we successfully reduce your debt. No upfront costs, no retainer fees, no investigation charges.',
    },
    {
      question: 'What if you can\'t save me money?',
      answer: 'If our AI analysis and expert team cannot reduce your tax debt, you pay nothing. Our 100% money-back guarantee means no savings = no fee. We only succeed when you succeed.',
    },
    {
      question: 'What\'s included in the free AI analysis?',
      answer: 'Our free AI analysis includes: comprehensive review of your tax situation, eligibility check for all IRS relief programs, estimated savings calculations, personalized strategy recommendations, and timeline projections. No credit card required.',
    },
    {
      question: 'How is this different from other tax relief companies?',
      answer: 'Most companies charge $3,000-$15,000 upfront with no guarantee of results. We charge nothing upfront and only get paid if we save you money. Our AI-first approach also provides faster, more accurate analysis than traditional methods.',
    },
    {
      question: 'When do I pay the 10% fee?',
      answer: 'You only pay after we successfully negotiate a reduction in your tax debt and you approve the settlement. The fee is calculated as 10% of your original total debt amount, not the amount saved.',
    },
    {
      question: 'What if I don\'t qualify for tax relief?',
      answer: 'If our assessment shows you don\'t qualify for relief programs, we\'ll provide alternative strategies and won\'t charge you. We only recommend services that will genuinely help your situation.',
    },
    {
      question: 'How long does the process take?',
      answer: 'Timeline varies by program: Installment Agreements (1-2 weeks), Penalty Abatement (2-8 weeks), Currently Not Collectible (2-4 weeks), and Offer in Compromise (6-12 months). We\'ll provide specific timelines during your assessment.',
    },
  ];

  const calculatePrice = (monthlyPrice: number | null, annualPrice: number | null) => {
    if (!monthlyPrice || !annualPrice) return 0;
    return isAnnual ? Math.round(annualPrice / 12) : monthlyPrice;
  };

  const calculateSavings = (monthlyPrice: number | null, annualPrice: number | null) => {
    if (!monthlyPrice || !annualPrice) return 0;
    const monthlyCost = monthlyPrice * 12;
    const savings = monthlyCost - annualPrice;
    return Math.round((savings / monthlyCost) * 100);
  };

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
    <Section id="pricing">
      <Container>
        <SectionHeader>
          <SectionTitle>Revolutionary Pay-Only-For-Results Pricing</SectionTitle>
          <SectionSubtitle>
            No upfront costs. No retainer fees. No investigation charges. Pay only 10% of your tax debt, and only if we save you money.
          </SectionSubtitle>
        </SectionHeader>

        <PricingGrid>
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              $featured={plan.featured}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              {plan.featured && <PopularBadge>Most Popular</PopularBadge>}
              <PlanName>{plan.name}</PlanName>
              <PlanDescription>{plan.description}</PlanDescription>
              
              <Price>
                {plan.successFee ? (
                  <>
                    <PriceAmount>
                      <Amount style={{ fontSize: typography.fontSize['5xl'] }}>{plan.successFee}</Amount>
                      <Period style={{ fontSize: typography.fontSize.xl }}>of your tax debt</Period>
                    </PriceAmount>
                    <Savings style={{ color: colors.primary[600], fontSize: typography.fontSize.base }}>
                      Only pay if we save you money
                    </Savings>
                  </>
                ) : (
                  <>
                    <PriceAmount>
                      <Currency>$</Currency>
                      <Amount>{calculatePrice(plan.monthlyPrice, plan.annualPrice)}</Amount>
                      <Period>/month</Period>
                    </PriceAmount>
                    {isAnnual && (
                      <Savings>
                        Save {calculateSavings(plan.monthlyPrice, plan.annualPrice)}% annually
                      </Savings>
                    )}
                  </>
                )}
              </Price>
              
              <FeatureList>
                {plan.features.map((feature, featureIndex) => (
                  <Feature key={featureIndex}>{feature}</Feature>
                ))}
              </FeatureList>
              
              <Button
                fullWidth
                variant={plan.featured ? 'primary' : 'secondary'}
                onClick={() => navigate('/signup')}
              >
                Get Started
              </Button>
            </PricingCard>
          ))}
        </PricingGrid>

        <MoneyBackGuarantee>
          <GuaranteeTitle>🛡️ 100% Money-Back Guarantee</GuaranteeTitle>
          <GuaranteeText>
            We're so confident in our AI-powered approach that we guarantee results. 
            If we can't reduce your tax debt, you pay nothing. No savings = no fee. It's that simple.
          </GuaranteeText>
        </MoneyBackGuarantee>

        <FAQSection>
          <FAQTitle>Frequently Asked Questions</FAQTitle>
          {faqs.map((faq, index) => (
            <FAQItem key={index}>
              <Question onClick={() => setOpenFAQ(openFAQ === index ? null : index)}>
                {faq.question}
                <span>{openFAQ === index ? '−' : '+'}</span>
              </Question>
              {openFAQ === index && (
                <Answer
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.answer}
                </Answer>
              )}
            </FAQItem>
          ))}
        </FAQSection>
      </Container>
    </Section>
  );
};

export default Pricing;