import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints, transitions } from '../../theme';
import Button from '../common/Button';
import Card from '../common/Card';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${colors.gray[50]};
`;

const Header = styled.header`
  background: ${colors.white};
  border-bottom: 1px solid ${colors.border.light};
  padding: ${spacing.md} 0;
  box-shadow: ${shadows.sm};
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${spacing.lg};
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
  
  svg {
    width: 28px;
    height: 28px;
  }
`;

const AdminBadge = styled.span`
  background: ${colors.error[600]};
  color: ${colors.white};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${radius.sm};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.semibold};
  margin-left: ${spacing.sm};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
  background: ${colors.gray[100]};
  border-radius: ${radius.md};
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: ${colors.primary[600]};
  color: ${colors.white};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.fontSize.sm};
`;

const UserName = styled.span`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
`;

const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${spacing['2xl']} ${spacing.lg};
`;

const PageTitle = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const PageSubtitle = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing['3xl']};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${spacing.xl};
  margin-bottom: ${spacing['3xl']};
`;

const StatCard = styled(Card)`
  padding: ${spacing.xl};
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.lg};
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  background: ${props => props.$color};
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const StatTrend = styled.div<{ $trend: 'up' | 'down' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: ${typography.fontSize.sm};
  color: ${props => 
    props.$trend === 'up' ? colors.success[600] : 
    props.$trend === 'down' ? colors.error[600] : 
    colors.text.secondary
  };
`;

const StatValue = styled.div`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${spacing.xl};
  margin-bottom: ${spacing['3xl']};
`;

const ActionCard = styled(Card)`
  padding: ${spacing.xl};
  cursor: pointer;
  transition: all ${transitions.base};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
  }
`;

const ActionIcon = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  background: ${props => props.$color};
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: ${spacing.lg};
`;

const ActionTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const ActionDescription = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  line-height: ${typography.lineHeight.relaxed};
  margin-bottom: ${spacing.md};
`;

const ActionBadge = styled.span<{ $variant: 'urgent' | 'warning' | 'info' | 'success' }>`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${radius.full};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.semibold};
  background: ${props => {
    switch (props.$variant) {
      case 'urgent': return colors.error[100];
      case 'warning': return colors.warning[100];
      case 'info': return colors.info[100];
      case 'success': return colors.success[100];
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'urgent': return colors.error[700];
      case 'warning': return colors.warning[700];
      case 'info': return colors.info[700];
      case 'success': return colors.success[700];
    }
  }};
`;

const RecentActivity = styled(Card)`
  padding: ${spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.lg};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: ${colors.gray[50]};
  border-radius: ${radius.md};
`;

const ActivityIcon = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  background: ${props => props.$color};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const ActivityTime = styled.div`
  font-size: ${typography.fontSize.xs};
  color: ${colors.text.secondary};
`;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admin/login');
  };

  const stats = [
    {
      icon: '👥',
      iconColor: colors.primary[100],
      value: '1,247',
      label: 'Total Users',
      trend: 'up' as const,
      change: '+12.5%'
    },
    {
      icon: '📝',
      iconColor: colors.success[100],
      value: '89',
      label: 'New Sign-ups (Today)',
      trend: 'up' as const,
      change: '+23.1%'
    },
    {
      icon: '📋',
      iconColor: colors.warning[100],
      value: '34',
      label: 'Pending Documents',
      trend: 'down' as const,
      change: '-5.2%'
    },
    {
      icon: '💼',
      iconColor: colors.info[100],
      value: '567',
      label: 'Active Cases',
      trend: 'neutral' as const,
      change: 'Stable'
    }
  ];

  const quickActions = [
    {
      icon: '👥',
      iconColor: colors.primary[100],
      title: 'User Management',
      description: 'View new users, manage accounts, and track sign-ups',
      badge: { text: '12 new today', variant: 'info' as const },
      action: () => navigate('/admin/users')
    },
    {
      icon: '📄',
      iconColor: colors.warning[100],
      title: 'Document Review',
      description: 'Review pending documents and approve submissions',
      badge: { text: '2 urgent', variant: 'urgent' as const },
      action: () => navigate('/admin/documents')
    },
    {
      icon: '📊',
      iconColor: colors.success[100],
      title: 'Case Management',
      description: 'Track all cases, update statuses, and manage workflows',
      badge: { text: '567 active', variant: 'success' as const },
      action: () => navigate('/admin/cases')
    },
    {
      icon: '💬',
      iconColor: colors.info[100],
      title: 'Communications',
      description: 'Manage client communications and system notifications',
      badge: { text: '8 pending', variant: 'warning' as const },
      action: () => navigate('/admin/communications')
    }
  ];

  const recentActivity = [
    {
      icon: '👤',
      iconColor: colors.primary[100],
      text: 'New user registration: John Doe',
      time: '2 minutes ago'
    },
    {
      icon: '📄',
      iconColor: colors.warning[100],
      text: 'Document uploaded: W-2 Form for Case #1234',
      time: '15 minutes ago'
    },
    {
      icon: '✅',
      iconColor: colors.success[100],
      text: 'Case approved: OIC settlement for $45,000',
      time: '1 hour ago'
    },
    {
      icon: '💰',
      iconColor: colors.info[100],
      text: 'Payment received: $5,000 success fee',
      time: '2 hours ago'
    },
    {
      icon: '📧',
      iconColor: colors.gray[300],
      text: 'IRS notice processed for Case #5678',
      time: '3 hours ago'
    }
  ];

  return (
    <DashboardContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.9 16 12.4 16 13V16C16 17.1 15.1 18 14 18H10C8.9 18 8 17.1 8 16V13C8 12.4 8.6 11.9 9.2 11.5V10C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.5 8.7 10.5 10V11.5H13.5V10C13.5 8.7 12.8 8.2 12 8.2Z"/>
            </svg>
            OwlTax
            <AdminBadge>ADMIN</AdminBadge>
          </Logo>
          
          <HeaderActions>
            <UserInfo>
              <UserAvatar>AD</UserAvatar>
              <UserName>Admin User</UserName>
            </UserInfo>
            <Button variant="ghost" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </HeaderActions>
        </HeaderContent>
      </Header>

      <MainContent>
        <PageTitle>Admin Dashboard</PageTitle>
        <PageSubtitle>
          Welcome to the OwlTax administrative control panel. Monitor operations, manage users, and track system performance.
        </PageSubtitle>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index} variant="elevated">
              <StatHeader>
                <StatIcon $color={stat.iconColor}>
                  {stat.icon}
                </StatIcon>
                <StatTrend $trend={stat.trend}>
                  {stat.trend === 'up' && '↗'} 
                  {stat.trend === 'down' && '↘'}
                  {stat.trend === 'neutral' && '→'}
                  {stat.change}
                </StatTrend>
              </StatHeader>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <ActionGrid>
          {quickActions.map((action, index) => (
            <ActionCard key={index} variant="elevated" onClick={action.action}>
              <ActionIcon $color={action.iconColor}>
                {action.icon}
              </ActionIcon>
              <ActionTitle>{action.title}</ActionTitle>
              <ActionDescription>{action.description}</ActionDescription>
              <ActionBadge $variant={action.badge.variant}>
                {action.badge.text}
              </ActionBadge>
            </ActionCard>
          ))}
        </ActionGrid>

        <RecentActivity variant="elevated">
          <SectionTitle>Recent Activity</SectionTitle>
          <ActivityList>
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityIcon $color={activity.iconColor}>
                  {activity.icon}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>{activity.text}</ActivityText>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>
        </RecentActivity>
      </MainContent>
    </DashboardContainer>
  );
};

export default AdminDashboard;