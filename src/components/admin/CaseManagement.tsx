import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints, transitions } from '../../theme';
import Button from '../common/Button';
import Card from '../common/Card';

const Container = styled.div`
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
  cursor: pointer;
  
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

const Content = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${spacing['2xl']} ${spacing.lg};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing['2xl']};
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
`;

const Controls = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBox = styled.input`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.sm};
  min-width: 250px;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

const FilterSelect = styled.select`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.md};
  font-size: ${typography.fontSize.sm};
  background: ${colors.white};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.lg};
  margin-bottom: ${spacing['2xl']};
`;

const StatCard = styled(Card)`
  padding: ${spacing.lg};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const CaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${spacing.lg};
`;

const CaseCard = styled(Card)`
  padding: ${spacing.lg};
  cursor: pointer;
  transition: all ${transitions.base};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
  }
`;

const CaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.md};
`;

const CaseId = styled.div`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
`;

const CaseStatus = styled.span<{ $status: string }>`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${radius.full};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.semibold};
  background: ${props => {
    switch (props.$status) {
      case 'new': return colors.info[100];
      case 'in-review': return colors.warning[100];
      case 'approved': return colors.success[100];
      case 'pending-docs': return colors.orange[100];
      case 'irs-submitted': return colors.purple[100];
      case 'completed': return colors.success[100];
      case 'rejected': return colors.error[100];
      default: return colors.gray[100];
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'new': return colors.info[700];
      case 'in-review': return colors.warning[700];
      case 'approved': return colors.success[700];
      case 'pending-docs': return colors.orange[700];
      case 'irs-submitted': return colors.purple[700];
      case 'completed': return colors.success[700];
      case 'rejected': return colors.error[700];
      default: return colors.gray[700];
    }
  }};
`;

const ClientInfo = styled.div`
  margin-bottom: ${spacing.md};
`;

const ClientName = styled.div`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const ClientEmail = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const CaseDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.md};
  margin-bottom: ${spacing.md};
`;

const DetailItem = styled.div``;

const DetailLabel = styled.div`
  font-size: ${typography.fontSize.xs};
  color: ${colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${spacing.xs};
`;

const DetailValue = styled.div`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${colors.gray[200]};
  border-radius: ${radius.full};
  margin-bottom: ${spacing.sm};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number; $color: string }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background: ${props => props.$color};
  transition: width ${transitions.base};
`;

const ProgressLabel = styled.div`
  font-size: ${typography.fontSize.xs};
  color: ${colors.text.secondary};
  text-align: center;
`;

const CaseActions = styled.div`
  display: flex;
  gap: ${spacing.xs};
  margin-top: ${spacing.md};
`;

const ActionButton = styled.button`
  padding: ${spacing.xs} ${spacing.sm};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.sm};
  background: ${colors.white};
  color: ${colors.text.secondary};
  font-size: ${typography.fontSize.xs};
  cursor: pointer;
  transition: all ${transitions.base};
  
  &:hover {
    background: ${colors.gray[50]};
    color: ${colors.text.primary};
  }
`;

const UrgentBadge = styled.div`
  position: absolute;
  top: ${spacing.sm};
  right: ${spacing.sm};
  background: ${colors.error[600]};
  color: ${colors.white};
  padding: ${spacing.xs};
  border-radius: ${radius.full};
  font-size: 10px;
  font-weight: ${typography.fontWeight.bold};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing['3xl']};
  color: ${colors.text.secondary};
`;

interface Case {
  id: string;
  clientName: string;
  clientEmail: string;
  program: string;
  status: string;
  taxDebt: number;
  estimatedSavings: number;
  createdDate: string;
  lastUpdate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  assignedTo: string;
}

const CaseManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');

  // Mock case data
  const allCases: Case[] = [
    {
      id: 'CASE-001',
      clientName: 'John Doe',
      clientEmail: 'john.doe@email.com',
      program: 'Offer in Compromise',
      status: 'new',
      taxDebt: 45000,
      estimatedSavings: 27000,
      createdDate: '2024-01-15',
      lastUpdate: '2024-01-15',
      priority: 'high',
      progress: 10,
      assignedTo: 'Sarah Wilson'
    },
    {
      id: 'CASE-002',
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah.j@email.com',
      program: 'Installment Agreement',
      status: 'in-review',
      taxDebt: 78500,
      estimatedSavings: 0,
      createdDate: '2024-01-10',
      lastUpdate: '2024-01-14',
      priority: 'medium',
      progress: 45,
      assignedTo: 'Mike Chen'
    },
    {
      id: 'CASE-003',
      clientName: 'Michael Chen',
      clientEmail: 'mchen@email.com',
      program: 'Currently Not Collectible',
      status: 'pending-docs',
      taxDebt: 125000,
      estimatedSavings: 125000,
      createdDate: '2024-01-12',
      lastUpdate: '2024-01-13',
      priority: 'urgent',
      progress: 25,
      assignedTo: 'Emily Davis'
    },
    {
      id: 'CASE-004',
      clientName: 'Emily Rodriguez',
      clientEmail: 'emily.r@email.com',
      program: 'Penalty Abatement',
      status: 'approved',
      taxDebt: 32000,
      estimatedSavings: 8000,
      createdDate: '2024-01-08',
      lastUpdate: '2024-01-14',
      priority: 'low',
      progress: 80,
      assignedTo: 'Sarah Wilson'
    },
    {
      id: 'CASE-005',
      clientName: 'David Wilson',
      clientEmail: 'dwilson@email.com',
      program: 'Innocent Spouse Relief',
      status: 'irs-submitted',
      taxDebt: 156000,
      estimatedSavings: 93600,
      createdDate: '2024-01-05',
      lastUpdate: '2024-01-12',
      priority: 'medium',
      progress: 70,
      assignedTo: 'Mike Chen'
    },
    {
      id: 'CASE-006',
      clientName: 'Lisa Martinez',
      clientEmail: 'lisa.m@email.com',
      program: 'Offer in Compromise',
      status: 'completed',
      taxDebt: 89000,
      estimatedSavings: 62300,
      createdDate: '2023-12-20',
      lastUpdate: '2024-01-10',
      priority: 'low',
      progress: 100,
      assignedTo: 'Emily Davis'
    }
  ];

  const filteredCases = allCases.filter(case_ => {
    const matchesSearch = case_.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
    const matchesProgram = programFilter === 'all' || case_.program === programFilter;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const stats = {
    total: allCases.length,
    new: allCases.filter(c => c.status === 'new').length,
    inReview: allCases.filter(c => c.status === 'in-review').length,
    pending: allCases.filter(c => c.status === 'pending-docs').length,
    completed: allCases.filter(c => c.status === 'completed').length
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'new': 'New',
      'in-review': 'In Review',
      'approved': 'Approved',
      'pending-docs': 'Pending Docs',
      'irs-submitted': 'IRS Submitted',
      'completed': 'Completed',
      'rejected': 'Rejected'
    };
    return labels[status] || status;
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'new': return colors.info[500];
      case 'in-review': return colors.warning[500];
      case 'approved': return colors.success[500];
      case 'pending-docs': return colors.orange[500];
      case 'irs-submitted': return colors.purple[500];
      case 'completed': return colors.success[600];
      case 'rejected': return colors.error[500];
      default: return colors.gray[400];
    }
  };

  const handleCaseAction = (caseId: string, action: string) => {
    console.log(`Action ${action} for case ${caseId}`);
    // Implement case actions
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo onClick={() => navigate('/admin/dashboard')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.9 16 12.4 16 13V16C16 17.1 15.1 18 14 18H10C8.9 18 8 17.1 8 16V13C8 12.4 8.6 11.9 9.2 11.5V10C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.5 8.7 10.5 10V11.5H13.5V10C13.5 8.7 12.8 8.2 12 8.2Z"/>
            </svg>
            OwlTax
            <AdminBadge>ADMIN</AdminBadge>
          </Logo>
          
          <Button variant="ghost" size="small" onClick={() => navigate('/admin/login')}>
            Logout
          </Button>
        </HeaderContent>
      </Header>

      <Content>
        <PageHeader>
          <div>
            <PageTitle>Case Management</PageTitle>
            <PageSubtitle>Monitor all cases, track progress, and manage client workflows</PageSubtitle>
          </div>
          <Controls>
            <SearchBox
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
            <FilterSelect
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in-review">In Review</option>
              <option value="approved">Approved</option>
              <option value="pending-docs">Pending Docs</option>
              <option value="irs-submitted">IRS Submitted</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </FilterSelect>
            <FilterSelect
              value={programFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProgramFilter(e.target.value)}
            >
              <option value="all">All Programs</option>
              <option value="Offer in Compromise">Offer in Compromise</option>
              <option value="Installment Agreement">Installment Agreement</option>
              <option value="Currently Not Collectible">Currently Not Collectible</option>
              <option value="Penalty Abatement">Penalty Abatement</option>
              <option value="Innocent Spouse Relief">Innocent Spouse Relief</option>
            </FilterSelect>
          </Controls>
        </PageHeader>

        <StatsRow>
          <StatCard variant="elevated">
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Cases</StatLabel>
          </StatCard>
          <StatCard variant="elevated">
            <StatValue>{stats.new}</StatValue>
            <StatLabel>New Cases</StatLabel>
          </StatCard>
          <StatCard variant="elevated">
            <StatValue>{stats.inReview}</StatValue>
            <StatLabel>In Review</StatLabel>
          </StatCard>
          <StatCard variant="elevated">
            <StatValue>{stats.pending}</StatValue>
            <StatLabel>Pending Docs</StatLabel>
          </StatCard>
          <StatCard variant="elevated">
            <StatValue>{stats.completed}</StatValue>
            <StatLabel>Completed</StatLabel>
          </StatCard>
        </StatsRow>

        {filteredCases.length === 0 ? (
          <EmptyState>
            <p>No cases found matching your criteria.</p>
          </EmptyState>
        ) : (
          <CaseGrid>
            {filteredCases.map((case_) => (
              <CaseCard
                key={case_.id}
                variant="elevated"
                onClick={() => handleCaseAction(case_.id, 'view')}
              >
                {case_.priority === 'urgent' && <UrgentBadge>!</UrgentBadge>}
                
                <CaseHeader>
                  <CaseId>{case_.id}</CaseId>
                  <CaseStatus $status={case_.status}>
                    {getStatusLabel(case_.status)}
                  </CaseStatus>
                </CaseHeader>

                <ClientInfo>
                  <ClientName>{case_.clientName}</ClientName>
                  <ClientEmail>{case_.clientEmail}</ClientEmail>
                </ClientInfo>

                <CaseDetails>
                  <DetailItem>
                    <DetailLabel>Program</DetailLabel>
                    <DetailValue>{case_.program}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Assigned To</DetailLabel>
                    <DetailValue>{case_.assignedTo}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Tax Debt</DetailLabel>
                    <DetailValue>${case_.taxDebt.toLocaleString()}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Est. Savings</DetailLabel>
                    <DetailValue>${case_.estimatedSavings.toLocaleString()}</DetailValue>
                  </DetailItem>
                </CaseDetails>

                <ProgressBar>
                  <ProgressFill 
                    $progress={case_.progress} 
                    $color={getProgressColor(case_.status)}
                  />
                </ProgressBar>
                <ProgressLabel>{case_.progress}% Complete</ProgressLabel>

                <CaseActions>
                  <ActionButton onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleCaseAction(case_.id, 'view');
                  }}>
                    View Details
                  </ActionButton>
                  <ActionButton onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleCaseAction(case_.id, 'update');
                  }}>
                    Update Status
                  </ActionButton>
                  <ActionButton onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleCaseAction(case_.id, 'contact');
                  }}>
                    Contact Client
                  </ActionButton>
                </CaseActions>
              </CaseCard>
            ))}
          </CaseGrid>
        )}
      </Content>
    </Container>
  );
};

export default CaseManagement;