import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../theme';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../common/Card';
import { Button } from '../common/Button';

const SchedulerContainer = styled.div`
  min-height: 100vh;
  background: ${colors.gray[50]};
`;

const Header = styled.header`
  background: ${colors.white};
  border-bottom: 1px solid ${colors.border.light};
  box-shadow: ${shadows.sm};
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${spacing.md} ${spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing.lg} ${spacing.xl};
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  background: none;
  border: none;
  color: ${colors.text.secondary};
  font-size: ${typography.fontSize.sm};
  cursor: pointer;
  
  &:hover {
    color: ${colors.primary[600]};
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing.xl} ${spacing.lg};
  
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing['2xl']} ${spacing.xl};
  }
`;

const PageTitle = styled.h1`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
  
  @media (min-width: ${breakpoints.md}) {
    font-size: ${typography.fontSize['3xl']};
  }
`;

const PageSubtitle = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing['2xl']};
`;

// Consultation Types
const TypesGrid = styled.div`
  display: grid;
  gap: ${spacing.lg};
  margin-bottom: ${spacing['2xl']};
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TypeCard = styled(Card)<{ selected?: boolean }>`
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.selected ? colors.primary[500] : 'transparent'};
  background: ${props => props.selected ? colors.primary[50] : colors.white};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
  }
`;

const TypeIcon = styled.div`
  width: 56px;
  height: 56px;
  background: ${colors.primary[100]};
  color: ${colors.primary[600]};
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize['2xl']};
  margin-bottom: ${spacing.md};
`;

const TypeTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const TypeDescription = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.md};
`;

const TypeDuration = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.primary[600]};
  font-weight: ${typography.fontWeight.medium};
`;

// Calendar Section
const SchedulingSection = styled.div`
  display: grid;
  gap: ${spacing.xl};
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CalendarCard = styled(Card)``;
const TimeSlotCard = styled(Card)``;

// Calendar Styles
const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.lg};
`;

const MonthTitle = styled.h3`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
`;

const CalendarNav = styled.div`
  display: flex;
  gap: ${spacing.sm};
`;

const NavButton = styled.button`
  padding: ${spacing.sm};
  background: none;
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.md};
  color: ${colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.primary[300]};
    color: ${colors.primary[600]};
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${spacing.xs};
`;

const DayHeader = styled.div`
  text-align: center;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.secondary};
  padding: ${spacing.sm} 0;
`;

const DayCell = styled.button<{ 
  isToday?: boolean; 
  isSelected?: boolean; 
  isAvailable?: boolean;
  isCurrentMonth?: boolean;
}>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.sm};
  cursor: ${props => props.isAvailable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  
  ${props => {
    if (props.isSelected) {
      return `
        background: ${colors.primary[500]};
        color: ${colors.white};
      `;
    }
    if (props.isToday) {
      return `
        background: ${colors.primary[100]};
        color: ${colors.primary[700]};
        font-weight: ${typography.fontWeight.semibold};
      `;
    }
    if (!props.isCurrentMonth) {
      return `
        color: ${colors.text.tertiary};
        background: transparent;
      `;
    }
    if (!props.isAvailable) {
      return `
        color: ${colors.text.tertiary};
        background: ${colors.gray[50]};
      `;
    }
    return `
      background: transparent;
      color: ${colors.text.primary};
      
      &:hover {
        background: ${colors.gray[100]};
      }
    `;
  }}
`;

// Time Slots
const TimeSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: ${spacing.sm};
  margin-bottom: ${spacing.lg};
`;

const TimeSlot = styled.button<{ selected?: boolean; available?: boolean }>`
  padding: ${spacing.md};
  border: 1px solid ${props => props.selected ? colors.primary[500] : colors.border.light};
  border-radius: ${radius.md};
  background: ${props => {
    if (props.selected) return colors.primary[50];
    if (!props.available) return colors.gray[50];
    return colors.white;
  }};
  color: ${props => {
    if (props.selected) return colors.primary[700];
    if (!props.available) return colors.text.tertiary;
    return colors.text.primary;
  }};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  cursor: ${props => props.available ? 'pointer' : 'not-allowed'};
  transition: all 0.2s ease;
  
  &:hover:enabled {
    border-color: ${colors.primary[300]};
  }
`;

// Confirmation Form
const FormGroup = styled.div`
  margin-bottom: ${spacing.lg};
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
  border: 1px solid ${colors.border.main};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.base};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${spacing.md};
  border: 1px solid ${colors.border.main};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.base};
  font-family: inherit;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

const ConsultationScheduler: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>('initial');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const consultationTypes = [
    {
      id: 'initial',
      icon: '📞',
      title: 'Initial Consultation',
      description: 'First-time consultation to discuss your tax situation and relief options',
      duration: '30 minutes',
      price: 'Free'
    },
    {
      id: 'followup',
      icon: '🔄',
      title: 'Follow-up Call',
      description: 'Review case progress and address any questions or concerns',
      duration: '15 minutes',
      price: 'Included'
    },
    {
      id: 'specialist',
      icon: '👨‍💼',
      title: 'Specialist Meeting',
      description: 'In-depth discussion with a tax relief specialist about your case',
      duration: '60 minutes',
      price: '$99'
    }
  ];
  
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM'
  ];
  
  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 weeks
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  const isSameDay = (date1: Date, date2: Date | null) => {
    if (!date2) return false;
    return date1.toDateString() === date2.toDateString();
  };
  
  const isAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && date.getDay() !== 0 && date.getDay() !== 6; // Weekdays only
  };
  
  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };
  
  const handleSchedule = () => {
    console.log('Scheduling consultation:', {
      type: selectedType,
      date: selectedDate,
      time: selectedTime
    });
    // Navigate to confirmation
  };
  
  const days = getDaysInMonth(currentMonth);
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <SchedulerContainer>
      <Header>
        <HeaderContent>
          <BackButton onClick={() => navigate('/portal')}>
            ← Back to Dashboard
          </BackButton>
        </HeaderContent>
      </Header>
      
      <MainContent>
        <PageTitle>Schedule Consultation</PageTitle>
        <PageSubtitle>Book a time to speak with our tax relief experts</PageSubtitle>
        
        {/* Consultation Types */}
        <h2 style={{ marginBottom: spacing.lg }}>Select Consultation Type</h2>
        <TypesGrid>
          {consultationTypes.map(type => (
            <TypeCard
              key={type.id}
              variant="elevated"
              selected={selectedType === type.id}
              onClick={() => setSelectedType(type.id)}
            >
              <CardContent>
                <TypeIcon>{type.icon}</TypeIcon>
                <TypeTitle>{type.title}</TypeTitle>
                <TypeDescription>{type.description}</TypeDescription>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TypeDuration>{type.duration}</TypeDuration>
                  <strong style={{ color: type.price === 'Free' ? colors.success[600] : colors.text.primary }}>
                    {type.price}
                  </strong>
                </div>
              </CardContent>
            </TypeCard>
          ))}
        </TypesGrid>
        
        {/* Scheduling Section */}
        <SchedulingSection>
          <CalendarCard variant="elevated">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarHeader>
                <MonthTitle>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </MonthTitle>
                <CalendarNav>
                  <NavButton onClick={() => handleMonthChange('prev')}>
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </NavButton>
                  <NavButton onClick={() => handleMonthChange('next')}>
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </NavButton>
                </CalendarNav>
              </CalendarHeader>
              
              <CalendarGrid>
                {dayHeaders.map(day => (
                  <DayHeader key={day}>{day}</DayHeader>
                ))}
                {days.map((day, index) => (
                  <DayCell
                    key={index}
                    isToday={isToday(day.date)}
                    isSelected={isSameDay(day.date, selectedDate)}
                    isAvailable={day.isCurrentMonth && isAvailable(day.date)}
                    isCurrentMonth={day.isCurrentMonth}
                    onClick={() => {
                      if (day.isCurrentMonth && isAvailable(day.date)) {
                        setSelectedDate(day.date);
                      }
                    }}
                  >
                    {day.date.getDate()}
                  </DayCell>
                ))}
              </CalendarGrid>
            </CardContent>
          </CalendarCard>
          
          <TimeSlotCard variant="elevated">
            <CardHeader>
              <CardTitle>Select Time</CardTitle>
              <CardSubtitle>
                {selectedDate 
                  ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'Please select a date first'}
              </CardSubtitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <>
                  <h4 style={{ marginBottom: spacing.md }}>Available Times</h4>
                  <TimeSlotsGrid>
                    {timeSlots.map(time => (
                      <TimeSlot
                        key={time}
                        selected={selectedTime === time}
                        available={!['10:30 AM', '2:00 PM', '4:30 PM'].includes(time)} // Mock unavailable
                        disabled={['10:30 AM', '2:00 PM', '4:30 PM'].includes(time)}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </TimeSlot>
                    ))}
                  </TimeSlotsGrid>
                  
                  {selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 style={{ marginBottom: spacing.md }}>Contact Information</h4>
                      <FormGroup>
                        <Label>Name</Label>
                        <Input type="text" placeholder="John Doe" />
                      </FormGroup>
                      
                      <FormGroup>
                        <Label>Phone Number</Label>
                        <Input type="tel" placeholder="(555) 555-5555" />
                      </FormGroup>
                      
                      <FormGroup>
                        <Label>Email (for confirmation)</Label>
                        <Input type="email" placeholder="john@example.com" />
                      </FormGroup>
                      
                      <FormGroup>
                        <Label>What would you like to discuss? (Optional)</Label>
                        <TextArea placeholder="Brief description of your tax situation..." />
                      </FormGroup>
                      
                      <Button onClick={handleSchedule} style={{ width: '100%' }}>
                        Schedule Consultation
                      </Button>
                    </motion.div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: spacing['3xl'], color: colors.text.secondary }}>
                  <p>Please select a date to view available time slots</p>
                </div>
              )}
            </CardContent>
          </TimeSlotCard>
        </SchedulingSection>
      </MainContent>
    </SchedulerContainer>
  );
};

export default ConsultationScheduler;