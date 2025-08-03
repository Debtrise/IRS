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

const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${spacing.lg};
`;

const DocumentCard = styled(Card)`
  padding: ${spacing.lg};
  cursor: pointer;
  transition: all ${transitions.base};
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
  }
`;

const DocumentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing.md};
`;

const DocumentIcon = styled.div<{ $type: string }>`
  width: 48px;
  height: 48px;
  background: ${props => {
    switch (props.$type) {
      case 'w2': return colors.primary[100];
      case '1099': return colors.success[100];
      case 'bank': return colors.info[100];
      case 'tax-return': return colors.warning[100];
      case 'notice': return colors.error[100];
      default: return colors.gray[100];
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'w2': return colors.primary[700];
      case '1099': return colors.success[700];
      case 'bank': return colors.info[700];
      case 'tax-return': return colors.warning[700];
      case 'notice': return colors.error[700];
      default: return colors.gray[700];
    }
  }};
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
`;

const DocumentStatus = styled.span<{ $status: string }>`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${radius.full};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.semibold};
  background: ${props => {
    switch (props.$status) {
      case 'pending': return colors.warning[100];
      case 'approved': return colors.success[100];
      case 'rejected': return colors.error[100];
      case 'needs-review': return colors.info[100];
      default: return colors.gray[100];
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'pending': return colors.warning[700];
      case 'approved': return colors.success[700];
      case 'rejected': return colors.error[700];
      case 'needs-review': return colors.info[700];
      default: return colors.gray[700];
    }
  }};
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

const DocumentInfo = styled.div`
  margin-bottom: ${spacing.md};
`;

const DocumentTitle = styled.div`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const ClientName = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.xs};
`;

const CaseId = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.primary[600]};
  font-weight: ${typography.fontWeight.medium};
`;

const DocumentDetails = styled.div`
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

const DocumentActions = styled.div`
  display: flex;
  gap: ${spacing.xs};
  margin-top: ${spacing.md};
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'success' | 'danger' }>`
  padding: ${spacing.xs} ${spacing.sm};
  border: 1px solid ${props => {
    switch (props.$variant) {
      case 'primary': return colors.primary[500];
      case 'success': return colors.success[500];
      case 'danger': return colors.error[500];
      default: return colors.border.light;
    }
  }};
  border-radius: ${radius.sm};
  background: ${props => {
    switch (props.$variant) {
      case 'primary': return colors.primary[50];
      case 'success': return colors.success[50];
      case 'danger': return colors.error[50];
      default: return colors.white;
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'primary': return colors.primary[700];
      case 'success': return colors.success[700];
      case 'danger': return colors.error[700];
      default: return colors.text.secondary;
    }
  }};
  font-size: ${typography.fontSize.xs};
  cursor: pointer;
  transition: all ${transitions.base};
  
  &:hover {
    background: ${props => {
      switch (props.$variant) {
        case 'primary': return colors.primary[100];
        case 'success': return colors.success[100];
        case 'danger': return colors.error[100];
        default: return colors.gray[50];
      }
    }};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing['3xl']};
  color: ${colors.text.secondary};
`;

interface Document {
  id: string;
  title: string;
  type: string;
  clientName: string;
  caseId: string;
  uploadDate: string;
  size: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs-review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reviewedBy?: string;
  reviewDate?: string;
  notes?: string;
}

const DocumentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock document data
  const allDocuments: Document[] = [
    {
      id: 'DOC-001',
      title: 'W-2 Form 2023',
      type: 'w2',
      clientName: 'John Doe',
      caseId: 'CASE-001',
      uploadDate: '2024-01-15',
      size: '2.3 MB',
      status: 'pending',
      priority: 'urgent'
    },
    {
      id: 'DOC-002',
      title: '1099-MISC Form',
      type: '1099',
      clientName: 'Sarah Johnson',
      caseId: 'CASE-002',
      uploadDate: '2024-01-14',
      size: '1.8 MB',
      status: 'approved',
      priority: 'medium',
      reviewedBy: 'Emily Davis',
      reviewDate: '2024-01-14'
    },
    {
      id: 'DOC-003',
      title: 'Bank Statements - December',
      type: 'bank',
      clientName: 'Michael Chen',
      caseId: 'CASE-003',
      uploadDate: '2024-01-13',
      size: '4.1 MB',
      status: 'needs-review',
      priority: 'high'
    },
    {
      id: 'DOC-004',
      title: 'Tax Return 2022',
      type: 'tax-return',
      clientName: 'Emily Rodriguez',
      caseId: 'CASE-004',
      uploadDate: '2024-01-12',
      size: '3.7 MB',
      status: 'approved',
      priority: 'low',
      reviewedBy: 'Mike Chen',
      reviewDate: '2024-01-13'
    },
    {
      id: 'DOC-005',
      title: 'IRS Notice CP14',
      type: 'notice',
      clientName: 'David Wilson',
      caseId: 'CASE-005',
      uploadDate: '2024-01-11',
      size: '892 KB',
      status: 'rejected',
      priority: 'medium',
      reviewedBy: 'Sarah Wilson',
      reviewDate: '2024-01-12',
      notes: 'Document is blurry and unreadable'
    }
  ];

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.caseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: allDocuments.length,
    pending: allDocuments.filter(d => d.status === 'pending').length,
    needsReview: allDocuments.filter(d => d.status === 'needs-review').length,
    urgent: allDocuments.filter(d => d.priority === 'urgent').length
  };

  const getDocumentIcon = (type: string) => {
    const icons: Record<string, string> = {
      'w2': '📄',
      '1099': '📊',
      'bank': '🏦',
      'tax-return': '📋',
      'notice': '⚠️'
    };
    return icons[type] || '📄';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'w2': 'W-2 Form',
      '1099': '1099 Form',
      'bank': 'Bank Statement',
      'tax-return': 'Tax Return',
      'notice': 'IRS Notice'
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Pending Review',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'needs-review': 'Needs Review'
    };
    return labels[status] || status;
  };

  const handleDocumentAction = (docId: string, action: string) => {
    console.log(`Action ${action} for document ${docId}`);
    // Implement document actions
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
            <PageTitle>Document Management</PageTitle>
            <PageSubtitle>Review and approve client-submitted documents</PageSubtitle>
          </div>
          <Controls>
            <SearchBox
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
            <FilterSelect
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="needs-review">Needs Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </FilterSelect>
            <FilterSelect
              value={typeFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="w2">W-2 Forms</option>
              <option value="1099">1099 Forms</option>
              <option value="bank">Bank Statements</option>
              <option value="tax-return">Tax Returns</option>
              <option value="notice">IRS Notices</option>
            </FilterSelect>
          </Controls>
        </PageHeader>

        <StatsRow>
          <StatCard variant="elevated">
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Documents</StatLabel>
          </StatCard>
          <StatCard variant="elevated">
            <StatValue>{stats.pending}</StatValue>
            <StatLabel>Pending Review</StatLabel>
          </StatCard>
          <StatCard variant="elevated">
            <StatValue>{stats.needsReview}</StatValue>
            <StatLabel>Needs Review</StatLabel>
          </StatCard>
          <StatCard variant="elevated">
            <StatValue>{stats.urgent}</StatValue>
            <StatLabel>Urgent Priority</StatLabel>
          </StatCard>
        </StatsRow>

        {filteredDocuments.length === 0 ? (
          <EmptyState>
            <p>No documents found matching your criteria.</p>
          </EmptyState>
        ) : (
          <DocumentGrid>
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                variant="elevated"
                onClick={() => handleDocumentAction(doc.id, 'view')}
              >
                {doc.priority === 'urgent' && <UrgentBadge>!</UrgentBadge>}
                
                <DocumentHeader>
                  <DocumentIcon $type={doc.type}>
                    {getDocumentIcon(doc.type)}
                  </DocumentIcon>
                  <DocumentStatus $status={doc.status}>
                    {getStatusLabel(doc.status)}
                  </DocumentStatus>
                </DocumentHeader>

                <DocumentInfo>
                  <DocumentTitle>{doc.title}</DocumentTitle>
                  <ClientName>{doc.clientName}</ClientName>
                  <CaseId>{doc.caseId}</CaseId>
                </DocumentInfo>

                <DocumentDetails>
                  <DetailItem>
                    <DetailLabel>Type</DetailLabel>
                    <DetailValue>{getTypeLabel(doc.type)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Size</DetailLabel>
                    <DetailValue>{doc.size}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Upload Date</DetailLabel>
                    <DetailValue>{doc.uploadDate}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Priority</DetailLabel>
                    <DetailValue className="capitalize">{doc.priority}</DetailValue>
                  </DetailItem>
                </DocumentDetails>

                <DocumentActions>
                  <ActionButton 
                    $variant="primary"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleDocumentAction(doc.id, 'download');
                    }}
                  >
                    Download
                  </ActionButton>
                  <ActionButton 
                    $variant="success"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleDocumentAction(doc.id, 'approve');
                    }}
                  >
                    Approve
                  </ActionButton>
                  <ActionButton 
                    $variant="danger"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleDocumentAction(doc.id, 'reject');
                    }}
                  >
                    Reject
                  </ActionButton>
                </DocumentActions>
              </DocumentCard>
            ))}
          </DocumentGrid>
        )}
      </Content>
    </Container>
  );
};

export default DocumentManagement;