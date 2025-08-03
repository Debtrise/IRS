import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, radius, shadows, typography, breakpoints } from '../../theme';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../common/Card';
import { Button } from '../common/Button';

const DocumentContainer = styled.div`
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
  max-width: 1280px;
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

// Upload Section
const UploadSection = styled(Card)`
  margin-bottom: ${spacing['2xl']};
`;

const DropZone = styled.div<{ isDragging?: boolean }>`
  border: 2px dashed ${props => props.isDragging ? colors.primary[500] : colors.border.main};
  border-radius: ${radius.lg};
  padding: ${spacing['3xl']};
  text-align: center;
  background: ${props => props.isDragging ? colors.primary[50] : colors.gray[50]};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${colors.primary[300]};
    background: ${colors.primary[50]};
  }
`;

const UploadIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${spacing.lg};
  background: ${colors.primary[100]};
  color: ${colors.primary[600]};
  border-radius: ${radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize['2xl']};
`;

const UploadText = styled.div`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.sm};
`;

const UploadSubtext = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

// Document Categories
const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${spacing.lg};
  margin-bottom: ${spacing['2xl']};
`;

const CategoryCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
`;

const CategoryIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${colors.primary[100]};
  color: ${colors.primary[600]};
  border-radius: ${radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize['xl']};
`;

const CategoryTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.text.primary};
`;

const CategoryCount = styled.div`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.primary[600]};
`;

const CategoryDescription = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
`;

// Document List
const DocumentsSection = styled.div`
  display: grid;
  gap: ${spacing.xl};
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr 300px;
  }
`;

const DocumentsList = styled.div``;
const DocumentsSidebar = styled.aside``;

const FilterBar = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${props => props.active ? colors.primary[500] : colors.border.main};
  border-radius: ${radius.md};
  background: ${props => props.active ? colors.primary[50] : colors.white};
  color: ${props => props.active ? colors.primary[700] : colors.text.secondary};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.primary[300]};
  }
`;

const DocumentItem = styled(motion.div)`
  background: ${colors.white};
  border: 1px solid ${colors.border.light};
  border-radius: ${radius.lg};
  padding: ${spacing.lg};
  margin-bottom: ${spacing.md};
  display: flex;
  gap: ${spacing.lg};
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: ${shadows.md};
    transform: translateX(4px);
  }
`;

const DocumentIcon = styled.div<{ type?: string }>`
  width: 48px;
  height: 48px;
  background: ${props => {
    switch (props.type) {
      case 'pdf': return colors.error[100];
      case 'image': return colors.success[100];
      case 'doc': return colors.info[100];
      default: return colors.gray[100];
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'pdf': return colors.error[600];
      case 'image': return colors.success[600];
      case 'doc': return colors.info[600];
      default: return colors.gray[600];
    }
  }};
  border-radius: ${radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.bold};
`;

const DocumentInfo = styled.div`
  flex: 1;
`;

const DocumentName = styled.div`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const DocumentMeta = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  display: flex;
  gap: ${spacing.lg};
`;

const DocumentActions = styled.div`
  display: flex;
  gap: ${spacing.sm};
`;

const ActionButton = styled.button`
  padding: ${spacing.sm};
  background: none;
  border: none;
  color: ${colors.text.secondary};
  cursor: pointer;
  border-radius: ${radius.md};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.gray[100]};
    color: ${colors.primary[600]};
  }
`;

// Upload Progress
const UploadProgress = styled(Card)`
  position: sticky;
  top: ${spacing.xl};
`;

const ProgressItem = styled.div`
  padding: ${spacing.md} 0;
  border-bottom: 1px solid ${colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.sm};
`;

const ProgressBar = styled.div`
  height: 4px;
  background: ${colors.gray[200]};
  border-radius: ${radius.full};
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)<{ progress: number }>`
  height: 100%;
  background: ${colors.primary[500]};
  width: ${props => props.progress}%;
`;

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: string;
  status: 'processing' | 'complete' | 'error';
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
}

const DocumentHub: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  
  // Mock data
  const categories = [
    { id: 'tax-returns', icon: '📋', title: 'Tax Returns', count: 12, description: 'Form 1040, schedules, and state returns' },
    { id: 'irs-notices', icon: '📨', title: 'IRS Notices', count: 8, description: 'Letters and notices from the IRS' },
    { id: 'financial', icon: '💰', title: 'Financial Statements', count: 24, description: 'Bank statements, pay stubs, expenses' },
    { id: 'supporting', icon: '📎', title: 'Supporting Documents', count: 15, description: 'Medical records, receipts, other evidence' },
    { id: 'correspondence', icon: '✉️', title: 'Correspondence', count: 6, description: 'Letters to/from IRS and professionals' },
    { id: 'forms', icon: '📝', title: 'Completed Forms', count: 9, description: 'Forms ready for submission' }
  ];
  
  const documents: Document[] = [
    { id: '1', name: '2023_Form_1040.pdf', type: 'pdf', size: '2.4 MB', uploadDate: '2024-02-15', category: 'tax-returns', status: 'complete' },
    { id: '2', name: 'Bank_Statement_Jan2024.pdf', type: 'pdf', size: '1.1 MB', uploadDate: '2024-02-14', category: 'financial', status: 'complete' },
    { id: '3', name: 'IRS_Notice_CP2000.pdf', type: 'pdf', size: '458 KB', uploadDate: '2024-02-13', category: 'irs-notices', status: 'complete' },
    { id: '4', name: 'Medical_Expenses_2023.xlsx', type: 'doc', size: '234 KB', uploadDate: '2024-02-12', category: 'supporting', status: 'complete' },
    { id: '5', name: 'W2_Employer_2023.pdf', type: 'pdf', size: '189 KB', uploadDate: '2024-02-11', category: 'tax-returns', status: 'complete' }
  ];
  
  const filteredDocuments = selectedCategory 
    ? documents.filter(doc => doc.category === selectedCategory)
    : documents;
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };
  
  const handleFiles = (files: File[]) => {
    const newUploads: UploadingFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      progress: 0,
      status: 'uploading' as const
    }));
    
    setUploadingFiles(prev => [...prev, ...newUploads]);
    
    // Simulate upload progress
    newUploads.forEach((upload, index) => {
      const interval = setInterval(() => {
        setUploadingFiles(prev => 
          prev.map(file => 
            file.id === upload.id 
              ? { ...file, progress: Math.min(file.progress + 10, 100) }
              : file
          )
        );
      }, 200);
      
      setTimeout(() => {
        clearInterval(interval);
        setUploadingFiles(prev => 
          prev.map(file => 
            file.id === upload.id 
              ? { ...file, status: 'complete', progress: 100 }
              : file
          )
        );
      }, 2000 + index * 500);
    });
  };
  
  const getFileTypeAbbr = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'image': return 'IMG';
      case 'doc': return 'DOC';
      default: return 'FILE';
    }
  };
  
  return (
    <DocumentContainer>
      <Header>
        <HeaderContent>
          <BackButton onClick={() => navigate('/portal')}>
            ← Back to Dashboard
          </BackButton>
          <Button size="small" onClick={() => fileInputRef.current?.click()}>
            <span style={{ marginRight: spacing.xs }}>+</span>
            Upload Document
          </Button>
        </HeaderContent>
      </Header>
      
      <MainContent>
        <PageTitle>Document Management</PageTitle>
        <PageSubtitle>Upload, organize, and manage all your tax-related documents</PageSubtitle>
        
        {/* Upload Section */}
        <UploadSection variant="elevated">
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            />
            <DropZone
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon>📤</UploadIcon>
              <UploadText>
                {isDragging ? 'Drop files here' : 'Drag and drop files or click to browse'}
              </UploadText>
              <UploadSubtext>
                Supports PDF, JPG, PNG, DOC, DOCX, XLS, XLSX (Max 10MB per file)
              </UploadSubtext>
            </DropZone>
          </CardContent>
        </UploadSection>
        
        {/* Categories Grid */}
        <h2 style={{ marginBottom: spacing.lg }}>Document Categories</h2>
        <CategoriesGrid>
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              variant="elevated"
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            >
              <CardContent>
                <CategoryHeader>
                  <CategoryIcon>{category.icon}</CategoryIcon>
                  <CategoryCount>{category.count}</CategoryCount>
                </CategoryHeader>
                <CategoryTitle>{category.title}</CategoryTitle>
                <CategoryDescription>{category.description}</CategoryDescription>
              </CardContent>
            </CategoryCard>
          ))}
        </CategoriesGrid>
        
        {/* Documents Section */}
        <DocumentsSection>
          <DocumentsList>
            <h2 style={{ marginBottom: spacing.lg }}>Recent Documents</h2>
            
            <FilterBar>
              <FilterButton
                active={!selectedCategory}
                onClick={() => setSelectedCategory(null)}
              >
                All Documents
              </FilterButton>
              {categories.map(cat => (
                <FilterButton
                  key={cat.id}
                  active={selectedCategory === cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.title}
                </FilterButton>
              ))}
            </FilterBar>
            
            <AnimatePresence>
              {filteredDocuments.map(doc => (
                <DocumentItem
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <DocumentIcon type={doc.type}>
                    {getFileTypeAbbr(doc.type)}
                  </DocumentIcon>
                  <DocumentInfo>
                    <DocumentName>{doc.name}</DocumentName>
                    <DocumentMeta>
                      <span>{doc.size}</span>
                      <span>{doc.uploadDate}</span>
                      <span>{categories.find(c => c.id === doc.category)?.title}</span>
                    </DocumentMeta>
                  </DocumentInfo>
                  <DocumentActions>
                    <ActionButton title="View">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </ActionButton>
                    <ActionButton title="Download">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </ActionButton>
                    <ActionButton title="Delete">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </ActionButton>
                  </DocumentActions>
                </DocumentItem>
              ))}
            </AnimatePresence>
          </DocumentsList>
          
          <DocumentsSidebar>
            {uploadingFiles.length > 0 && (
              <UploadProgress variant="elevated">
                <CardHeader>
                  <CardTitle>Upload Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {uploadingFiles.map(file => (
                    <ProgressItem key={file.id}>
                      <ProgressHeader>
                        <span style={{ fontSize: typography.fontSize.sm }}>
                          {file.name}
                        </span>
                        <span style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary }}>
                          {file.progress}%
                        </span>
                      </ProgressHeader>
                      <ProgressBar>
                        <ProgressFill
                          progress={file.progress}
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </ProgressBar>
                    </ProgressItem>
                  ))}
                </CardContent>
              </UploadProgress>
            )}
            
            <Card variant="elevated" style={{ marginTop: spacing.lg }}>
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul style={{ paddingLeft: spacing.lg, fontSize: typography.fontSize.sm, color: colors.text.secondary }}>
                  <li style={{ marginBottom: spacing.sm }}>
                    Upload clear, readable copies of all documents
                  </li>
                  <li style={{ marginBottom: spacing.sm }}>
                    Organize documents by tax year
                  </li>
                  <li style={{ marginBottom: spacing.sm }}>
                    Include all pages of multi-page documents
                  </li>
                  <li>
                    Keep original copies for your records
                  </li>
                </ul>
              </CardContent>
            </Card>
          </DocumentsSidebar>
        </DocumentsSection>
      </MainContent>
    </DocumentContainer>
  );
};

export default DocumentHub;