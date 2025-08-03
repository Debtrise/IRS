import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, spacing, radius, shadows, typography, breakpoints, transitions } from '../../../theme';
import Button from '../../common/Button';

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

const ContactGrid = styled.div`
  display: grid;
  gap: ${spacing['3xl']};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
    gap: ${spacing['4xl']};
  }
`;

const ContactInfo = styled.div``;

const InfoCard = styled(motion.div)`
  background: ${colors.white};
  border-radius: ${radius.lg};
  padding: ${spacing['2xl']};
  box-shadow: ${shadows.sm};
  border: 1px solid ${colors.border.light};
  margin-bottom: ${spacing.xl};
`;

const InfoTitle = styled.h3`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.lg};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${colors.primary[100]};
  border-radius: ${radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
`;

const InfoText = styled.div``;

const InfoLabel = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.xs};
`;

const InfoValue = styled.div`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeight.medium};
`;

const ContactForm = styled(motion.form)`
  background: ${colors.white};
  border-radius: ${radius.xl};
  padding: ${spacing['3xl']};
  box-shadow: ${shadows.md};
  border: 1px solid ${colors.border.light};
`;

const FormGrid = styled.div`
  display: grid;
  gap: ${spacing.lg};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormGroup = styled.div<{ $fullWidth?: boolean }>`
  ${props => props.$fullWidth && `
    @media (min-width: ${breakpoints.md}) {
      grid-column: 1 / -1;
    }
  `}
`;

const Label = styled.label`
  display: block;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  background: ${colors.white};
  transition: all ${transitions.base};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
  
  &::placeholder {
    color: ${colors.text.tertiary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  background: ${colors.white};
  transition: all ${transitions.base};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  background: ${colors.white};
  transition: all ${transitions.base};
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
  
  &::placeholder {
    color: ${colors.text.tertiary};
  }
`;

const SuccessMessage = styled(motion.div)`
  background: ${colors.success[50]};
  border: 1px solid ${colors.success[200]};
  border-radius: ${radius.md};
  padding: ${spacing.lg};
  margin-bottom: ${spacing.xl};
  text-align: center;
  color: ${colors.success[700]};
`;

const OfficeHours = styled.div`
  margin-top: ${spacing['3xl']};
`;

const HoursGrid = styled.div`
  display: grid;
  gap: ${spacing.md};
  margin-top: ${spacing.lg};
`;

const HoursRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${spacing.sm} 0;
  border-bottom: 1px solid ${colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const Day = styled.span`
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
`;

const Time = styled.span`
  color: ${colors.text.secondary};
`;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    taxDebt: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: '📞',
      label: 'Phone',
      value: '1-800-TAX-HELP',
      subValue: 'Mon-Fri 8AM-8PM EST',
    },
    {
      icon: '✉️',
      label: 'Email',
      value: 'support@taxrelief.com',
      subValue: 'Response within 24 hours',
    },
    {
      icon: '💬',
      label: 'Live Chat',
      value: 'Available 24/7',
      subValue: 'Average wait time: 2 min',
    },
    {
      icon: '📍',
      label: 'Office',
      value: '123 Tax Relief Blvd',
      subValue: 'New York, NY 10001',
    },
  ];

  const officeHours = [
    { day: 'Monday - Friday', time: '8:00 AM - 8:00 PM EST' },
    { day: 'Saturday', time: '9:00 AM - 5:00 PM EST' },
    { day: 'Sunday', time: '10:00 AM - 4:00 PM EST' },
    { day: 'Holidays', time: 'Limited Hours' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <Section id="contact">
      <Container>
        <SectionHeader>
          <SectionTitle>Get in Touch</SectionTitle>
          <SectionSubtitle>
            Have questions? Our tax relief experts are here to help you find the best solution
          </SectionSubtitle>
        </SectionHeader>

        <ContactGrid>
          <ContactInfo>
            <InfoCard
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <InfoTitle>Contact Information</InfoTitle>
              {contactInfo.map((info, index) => (
                <InfoItem key={index}>
                  <InfoIcon>{info.icon}</InfoIcon>
                  <InfoText>
                    <InfoLabel>{info.label}</InfoLabel>
                    <InfoValue>{info.value}</InfoValue>
                    {info.subValue && (
                      <InfoLabel style={{ marginTop: spacing.xs }}>
                        {info.subValue}
                      </InfoLabel>
                    )}
                  </InfoText>
                </InfoItem>
              ))}
            </InfoCard>

            <OfficeHours>
              <InfoTitle>Office Hours</InfoTitle>
              <HoursGrid>
                {officeHours.map((hours, index) => (
                  <HoursRow key={index}>
                    <Day>{hours.day}</Day>
                    <Time>{hours.time}</Time>
                  </HoursRow>
                ))}
              </HoursGrid>
            </OfficeHours>
          </ContactInfo>

          <ContactForm
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            {submitted && (
              <SuccessMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Thank you! We'll contact you within 24 hours.
              </SuccessMessage>
            )}
            
            <FormGrid>
              <FormGroup>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                />
              </FormGroup>
              
              <FormGroup $fullWidth>
                <Label htmlFor="taxDebt">Estimated Tax Debt</Label>
                <Select
                  id="taxDebt"
                  name="taxDebt"
                  value={formData.taxDebt}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select amount</option>
                  <option value="under10k">Under $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="over100k">Over $100,000</option>
                </Select>
              </FormGroup>
              
              <FormGroup $fullWidth>
                <Label htmlFor="message">How can we help?</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your tax situation..."
                  required
                />
              </FormGroup>
            </FormGrid>
            
            <Button type="submit" fullWidth style={{ marginTop: spacing.xl }}>
              Send Message
            </Button>
          </ContactForm>
        </ContactGrid>
      </Container>
    </Section>
  );
};

export default Contact;