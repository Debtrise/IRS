import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../../theme';

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

const TestimonialsGrid = styled.div`
  display: grid;
  gap: ${spacing.xl};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${spacing['2xl']};
  }
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TestimonialCard = styled(motion.div)`
  background: ${colors.white};
  border-radius: ${radius.lg};
  padding: ${spacing['2xl']};
  box-shadow: ${shadows.sm};
  border: 1px solid ${colors.border.light};
  position: relative;
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: ${spacing.lg};
  right: ${spacing.lg};
  font-size: 48px;
  color: ${colors.primary[100]};
  line-height: 1;
`;

const Stars = styled.div`
  display: flex;
  gap: ${spacing.xs};
  margin-bottom: ${spacing.lg};
  color: ${colors.warning[500]};
`;

const TestimonialText = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  line-height: ${typography.lineHeight.relaxed};
  margin-bottom: ${spacing.xl};
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const AuthorAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${radius.full};
  background: ${colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const AuthorDetails = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const CaseStudySection = styled.div`
  margin-top: ${spacing['5xl']};
`;

const CaseStudyGrid = styled.div`
  display: grid;
  gap: ${spacing['2xl']};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CaseStudyCard = styled(motion.div)`
  background: ${colors.white};
  border-radius: ${radius.xl};
  overflow: hidden;
  box-shadow: ${shadows.md};
  border: 1px solid ${colors.border.light};
`;

const CaseStudyHeader = styled.div`
  background: ${colors.primary[700]};
  color: ${colors.white};
  padding: ${spacing.xl};
`;

const CaseStudyTitle = styled.h3`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  margin-bottom: ${spacing.sm};
`;

const CaseStudySubtitle = styled.p`
  opacity: 0.9;
`;

const CaseStudyContent = styled.div`
  padding: ${spacing.xl};
`;

const CaseStudyStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.lg};
  margin-bottom: ${spacing.xl};
`;

const StatBlock = styled.div`
  text-align: center;
  padding: ${spacing.lg};
  background: ${colors.gray[50]};
  border-radius: ${radius.md};
`;

const StatLabel = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.xs};
`;

const StatValue = styled.div`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[700]};
`;

const CaseStudyDescription = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
`;

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      rating: 5,
      text: "I was drowning in $85,000 of tax debt and didn't know where to turn. This service helped me qualify for an Offer in Compromise, and I settled for just $12,000. Life-changing!",
      author: "Sarah M.",
      details: "Small Business Owner • Los Angeles, CA",
      avatar: "SM",
    },
    {
      id: 2,
      rating: 5,
      text: "The AI assessment quickly identified that I qualified for penalty abatement. Within 3 weeks, $15,000 in penalties were removed. The process was so simple and straightforward.",
      author: "Michael R.",
      details: "Freelance Consultant • Austin, TX",
      avatar: "MR",
    },
    {
      id: 3,
      rating: 5,
      text: "After losing my job, I couldn't pay my taxes. They helped me get Currently Not Collectible status, giving me breathing room to get back on my feet. Incredible support throughout!",
      author: "Jennifer L.",
      details: "Healthcare Worker • Chicago, IL",
      avatar: "JL",
    },
    {
      id: 4,
      rating: 5,
      text: "Setting up an installment agreement seemed impossible on my own. The team handled everything, and now I have manageable monthly payments. No more sleepless nights!",
      author: "David K.",
      details: "Restaurant Owner • Miami, FL",
      avatar: "DK",
    },
    {
      id: 5,
      rating: 5,
      text: "I thought I'd lose my home to a tax lien. They negotiated an incredible deal with the IRS, reduced my debt by 75%, and saved my house. Forever grateful!",
      author: "Patricia G.",
      details: "Retired Teacher • Phoenix, AZ",
      avatar: "PG",
    },
    {
      id: 6,
      rating: 5,
      text: "The document management system made everything so easy. No more scattered paperwork or missed deadlines. My case was resolved in half the expected time!",
      author: "Robert T.",
      details: "IT Professional • Seattle, WA",
      avatar: "RT",
    },
  ];

  const caseStudies = [
    {
      title: "From $120K to $18K",
      subtitle: "Offer in Compromise Success Story",
      stats: [
        { label: "Original Debt", value: "$120,000" },
        { label: "Final Settlement", value: "$18,000" },
        { label: "Savings", value: "$102,000" },
        { label: "Time to Resolution", value: "8 months" },
      ],
      description: "A small business owner facing bankruptcy due to accumulated tax debt from 2018-2021. Through careful financial analysis and expert negotiation, we secured an Offer in Compromise that saved their business and home.",
    },
    {
      title: "5-Year Payment Plan",
      subtitle: "Installment Agreement Victory",
      stats: [
        { label: "Total Debt", value: "$65,000" },
        { label: "Monthly Payment", value: "$875" },
        { label: "Previous Demand", value: "$3,200/mo" },
        { label: "Interest Saved", value: "$12,000" },
      ],
      description: "A family of four struggling with unexpected medical expenses and tax debt. We negotiated a reasonable installment agreement that fit their budget while stopping aggressive collection actions.",
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
    <Section id="testimonials">
      <Container>
        <SectionHeader>
          <SectionTitle>Real Success Stories</SectionTitle>
          <SectionSubtitle>
            Join thousands who have found tax relief and financial freedom
          </SectionSubtitle>
        </SectionHeader>

        <TestimonialsGrid>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <QuoteIcon>"</QuoteIcon>
              <Stars>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </Stars>
              <TestimonialText>{testimonial.text}</TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>{testimonial.avatar}</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>{testimonial.author}</AuthorName>
                  <AuthorDetails>{testimonial.details}</AuthorDetails>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>

        <CaseStudySection>
          <SectionHeader>
            <SectionTitle>Detailed Case Studies</SectionTitle>
            <SectionSubtitle>
              See how we've helped clients achieve remarkable results
            </SectionSubtitle>
          </SectionHeader>

          <CaseStudyGrid>
            {caseStudies.map((study, index) => (
              <CaseStudyCard
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
              >
                <CaseStudyHeader>
                  <CaseStudyTitle>{study.title}</CaseStudyTitle>
                  <CaseStudySubtitle>{study.subtitle}</CaseStudySubtitle>
                </CaseStudyHeader>
                <CaseStudyContent>
                  <CaseStudyStats>
                    {study.stats.map((stat, statIndex) => (
                      <StatBlock key={statIndex}>
                        <StatLabel>{stat.label}</StatLabel>
                        <StatValue>{stat.value}</StatValue>
                      </StatBlock>
                    ))}
                  </CaseStudyStats>
                  <CaseStudyDescription>{study.description}</CaseStudyDescription>
                </CaseStudyContent>
              </CaseStudyCard>
            ))}
          </CaseStudyGrid>
        </CaseStudySection>
      </Container>
    </Section>
  );
};

export default Testimonials;