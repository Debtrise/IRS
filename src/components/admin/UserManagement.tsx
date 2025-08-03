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

const TableCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${colors.gray[50]};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${colors.border.light};
  
  &:hover {
    background: ${colors.gray[25]};
  }
`;

const TableHeaderCell = styled.th`
  padding: ${spacing.md} ${spacing.lg};
  text-align: left;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  border-bottom: 1px solid ${colors.border.medium};
`;

const TableCell = styled.td`
  padding: ${spacing.md} ${spacing.lg};
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  vertical-align: middle;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: ${colors.primary[100]};
  color: ${colors.primary[700]};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.fontSize.sm};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const UserDetails = styled.div``;

const UserName = styled.div`
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const UserEmail = styled.div`
  font-size: ${typography.fontSize.xs};
  color: ${colors.text.secondary};
`;

const StatusBadge = styled.span<{ $status: 'active' | 'pending' | 'suspended' | 'new' }>`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${radius.full};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.semibold};
  background: ${props => {
    switch (props.$status) {
      case 'active': return colors.success[100];
      case 'pending': return colors.warning[100];
      case 'suspended': return colors.error[100];
      case 'new': return colors.info[100];
      default: return colors.gray[100];
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active': return colors.success[700];
      case 'pending': return colors.warning[700];
      case 'suspended': return colors.error[700];
      case 'new': return colors.info[700];
      default: return colors.gray[700];
    }
  }};
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

const ActionsGroup = styled.div`
  display: flex;
  gap: ${spacing.xs};
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: ${spacing.lg};
  border-top: 1px solid ${colors.border.light};
`;

const PaginationInfo = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

const PaginationControls = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-left: auto;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: ${spacing.xs} ${spacing.sm};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.sm};
  background: ${props => props.$active ? colors.primary[600] : colors.white};
  color: ${props => props.$active ? colors.white : colors.text.secondary};
  font-size: ${typography.fontSize.sm};
  cursor: pointer;
  transition: all ${transitions.base};
  
  &:hover {
    background: ${props => props.$active ? colors.primary[700] : colors.gray[50]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'suspended' | 'new';
  taxDebt: string;
  signupDate: string;
  lastLogin: string;
  cases: number;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock user data
  const allUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      status: 'new',
      taxDebt: '$45,000',
      signupDate: '2024-01-15',
      lastLogin: '2 minutes ago',
      cases: 1
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 234-5678',
      status: 'active',
      taxDebt: '$78,500',
      signupDate: '2024-01-10',
      lastLogin: '1 hour ago',
      cases: 2
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'mchen@email.com',
      phone: '(555) 345-6789',
      status: 'pending',
      taxDebt: '$125,000',
      signupDate: '2024-01-12',
      lastLogin: '1 day ago',
      cases: 1
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '(555) 456-7890',
      status: 'active',
      taxDebt: '$32,000',
      signupDate: '2024-01-08',
      lastLogin: '3 hours ago',
      cases: 3
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'dwilson@email.com',
      phone: '(555) 567-8901',
      status: 'suspended',
      taxDebt: '$156,000',
      signupDate: '2024-01-05',
      lastLogin: '1 week ago',
      cases: 0
    }
  ];

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: allUsers.length,
    new: allUsers.filter(u => u.status === 'new').length,
    active: allUsers.filter(u => u.status === 'active').length,
    pending: allUsers.filter(u => u.status === 'pending').length
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Action ${action} for user ${userId}`);
    // Implement user actions
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
            <PageTitle>User Management</PageTitle>
            <PageSubtitle>Manage user accounts, view sign-ups, and track user activity</PageSubtitle>
          </div>
          <Controls>
            <SearchBox
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
            <FilterSelect
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </FilterSelect>
          </Controls>
        </PageHeader>

        <StatsRow>
          <StatCard variant="elevated">
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          <StatCard variant="elevated">
            <StatValue>{stats.new}</StatValue>
            <StatLabel>New Today</StatLabel>
          </StatCard>
          <StatCard variant="elevated">
            <StatValue>{stats.active}</StatValue>
            <StatLabel>Active Users</StatLabel>
          </StatCard>
          <StatCard variant="elevated">
            <StatValue>{stats.pending}</StatValue>
            <StatLabel>Pending Review</StatLabel>
          </StatCard>
        </StatsRow>

        <TableCard variant="elevated">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>User</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Tax Debt</TableHeaderCell>
                <TableHeaderCell>Signup Date</TableHeaderCell>
                <TableHeaderCell>Last Login</TableHeaderCell>
                <TableHeaderCell>Cases</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <UserInfo>
                      <UserAvatar>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </UserAvatar>
                      <UserDetails>
                        <UserName>{user.name}</UserName>
                        <UserEmail>{user.email}</UserEmail>
                      </UserDetails>
                    </UserInfo>
                  </TableCell>
                  <TableCell>
                    <StatusBadge $status={user.status}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{user.taxDebt}</TableCell>
                  <TableCell>{user.signupDate}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>{user.cases}</TableCell>
                  <TableCell>
                    <ActionsGroup>
                      <ActionButton onClick={() => handleUserAction(user.id, 'view')}>
                        View
                      </ActionButton>
                      <ActionButton onClick={() => handleUserAction(user.id, 'edit')}>
                        Edit
                      </ActionButton>
                      <ActionButton onClick={() => handleUserAction(user.id, 'suspend')}>
                        Suspend
                      </ActionButton>
                    </ActionsGroup>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          
          <PaginationWrapper>
            <PaginationInfo>
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </PaginationInfo>
            <PaginationControls>
              <PaginationButton 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationButton>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationButton
                  key={page}
                  $active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationButton>
              ))}
              <PaginationButton 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </PaginationButton>
            </PaginationControls>
          </PaginationWrapper>
        </TableCard>
      </Content>
    </Container>
  );
};

export default UserManagement;