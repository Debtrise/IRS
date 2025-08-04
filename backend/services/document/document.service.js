const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto');
const path = require('path');

const { Document } = require('../../models');

class DocumentService {
  constructor() {
    this.storage = new Storage();
    this.bucketName = process.env.GCS_BUCKET_NAME || 'owltax-documents';
    this.bucket = this.storage.bucket(this.bucketName);
  }

  async uploadDocument(file, userId, caseId, documentType, options = {}) {
    try {
      // Generate secure filename
      const fileId = crypto.randomBytes(16).toString('hex');
      const fileExtension = path.extname(file.originalname);
      const timestamp = Date.now();
      const fileName = `${userId}/${caseId || 'general'}/${documentType}/${timestamp}_${fileId}${fileExtension}`;
      
      // Create file reference
      const blob = this.bucket.file(fileName);
      
      // Create upload stream with metadata
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            userId,
            caseId: caseId || null,
            documentType,
            originalName: file.originalname,
            uploadDate: new Date().toISOString(),
            taxYear: options.taxYear || null,
          },
        },
        resumable: false,
        gzip: true,
      });

      return new Promise((resolve, reject) => {
        blobStream.on('error', (error) => {
          logger.error('GCS upload error:', error);
          reject(new Error('Failed to upload document to storage'));
        });

        blobStream.on('finish', async () => {
          try {
            // Generate signed URL for immediate access
            const [url] = await blob.getSignedUrl({
              version: 'v4',
              action: 'read',
              expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            // Create document record in database
            const document = await Document.create({
              userId,
              caseId: caseId || null,
              documentType,
              fileName,
              originalName: file.originalname,
              fileSize: file.size,
              mimeType: file.mimetype,
              storageLocation: fileName,
              bucketName: this.bucketName,
              status: 'PENDING',
              verificationStatus: 'UNVERIFIED',
              taxYear: options.taxYear || null,
              uploadedBy: userId,
              metadata: {
                uploadTimestamp: new Date().toISOString(),
                ipAddress: options.ipAddress,
                userAgent: options.userAgent,
              },
            });

            // Start document processing in background
            this.processDocumentAsync(document.id);

            resolve({
              document,
              url,
              fileId,
              fileName,
              size: file.size,
              mimeType: file.mimetype,
            });
          } catch (error) {
            logger.error('Database save error:', error);
            reject(new Error('Failed to save document information'));
          }
        });

        // Write file data to stream
        blobStream.end(file.buffer);
      });
    } catch (error) {
      logger.error('Document upload failed:', error);
      throw new Error('Failed to upload document');
    }
  }

  async processDocumentAsync(documentId) {
    try {
      // This would typically be processed by a background job
      // For now, we'll just mark it as processed
      setTimeout(async () => {
        try {
          await Document.update(
            { 
              status: 'PROCESSED',
              processedData: { processedAt: new Date().toISOString() },
            },
            { where: { id: documentId } }
          );
          
          logger.info(`Document ${documentId} processed successfully`);
        } catch (error) {
          logger.error(`Failed to process document ${documentId}:`, error);
          await Document.update(
            { status: 'PROCESSING_FAILED' },
            { where: { id: documentId } }
          );
        }
      }, 5000); // Simulate 5 second processing delay
    } catch (error) {
      logger.error('Process document async failed:', error);
    }
  }

  async validateDocument(file) {
    const errors = [];
    
    // Check file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('File size exceeds 50MB limit');
    }
    
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (!allowedTypes.includes(file.mimetype)) {
      errors.push('Invalid file type. Please upload PDF, image, or Office documents only.');
    }
    
    // Check filename for security
    if (file.originalname.includes('..') || file.originalname.includes('/')) {
      errors.push('Invalid filename');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async getDocumentUrl(document, expirationMinutes = 60) {
    try {
      const file = this.bucket.file(document.storageLocation);
      
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + expirationMinutes * 60 * 1000,
      });
      
      return url;
    } catch (error) {
      logger.error('Get document URL failed:', error);
      throw new Error('Failed to generate document URL');
    }
  }

  async deleteDocument(document) {
    try {
      // Delete from GCS
      const file = this.bucket.file(document.storageLocation);
      await file.delete();
      
      // Update database record
      await Document.update(
        { status: 'DELETED' },
        { where: { id: document.id } }
      );
      
      return { success: true };
    } catch (error) {
      logger.error('Delete document failed:', error);
      throw new Error('Failed to delete document');
    }
  }

  async processIRSTranscript(document) {
    try {
      // This would typically use Google Document AI or another OCR service
      // For now, we'll return mock data
      const mockData = {
        taxYear: 2023,
        filingStatus: 'SINGLE',
        adjustedGrossIncome: 75000,
        taxOwed: 8500,
        penalties: 425,
        interest: 255,
        payments: [
          { date: '2024-01-15', amount: 2000, type: 'ESTIMATED' },
          { date: '2024-04-15', amount: 3000, type: 'WITHHOLDING' },
        ],
        transcriptType: 'ACCOUNT_TRANSCRIPT',
      };
      
      // Update document with processed data
      await Document.update(
        {
          processedData: mockData,
          status: 'PROCESSED',
          verificationStatus: 'AUTO_VERIFIED',
        },
        { where: { id: document.id } }
      );
      
      return mockData;
    } catch (error) {
      logger.error('Process IRS transcript failed:', error);
      throw new Error('Failed to process IRS transcript');
    }
  }

  async extractTextFromDocument(document) {
    try {
      // This would typically use Google Document AI or another OCR service
      // For now, we'll return mock text
      const mockText = `
        Tax Year: ${document.taxYear || 2023}
        Document Type: ${document.documentType}
        File Name: ${document.originalName}
        Upload Date: ${document.createdAt}
        
        [Extracted text would appear here from OCR processing]
      `;
      
      // Update document with OCR text
      await Document.update(
        { ocrText: mockText },
        { where: { id: document.id } }
      );
      
      return mockText;
    } catch (error) {
      logger.error('Extract text failed:', error);
      throw new Error('Failed to extract text from document');
    }
  }

  async validateCaseDocuments(caseId) {
    try {
      const documents = await Document.findAll({
        where: {
          caseId,
          status: { [require('sequelize').Op.notIn]: ['DELETED', 'REJECTED'] },
        },
      });
      
      const validationResults = [];
      
      for (const document of documents) {
        const result = {
          documentId: document.id,
          documentType: document.documentType,
          status: document.status,
          verificationStatus: document.verificationStatus,
          isValid: true,
          issues: [],
        };
        
        // Check if document is verified
        if (document.verificationStatus === 'UNVERIFIED') {
          result.issues.push('Document needs verification');
          result.isValid = false;
        }
        
        // Check if document is processed
        if (document.status === 'PENDING') {
          result.issues.push('Document is still processing');
          result.isValid = false;
        }
        
        // Check if document is rejected
        if (document.status === 'REJECTED') {
          result.issues.push(`Document rejected: ${document.rejectionReason}`);
          result.isValid = false;
        }
        
        // Document-specific validations
        if (document.documentType === 'IRS_TRANSCRIPT') {
          if (!document.processedData || !document.processedData.taxYear) {
            result.issues.push('Unable to extract tax year from transcript');
            result.isValid = false;
          }
        }
        
        validationResults.push(result);
      }
      
      const overallValid = validationResults.every(result => result.isValid);
      
      return {
        isValid: overallValid,
        documentCount: documents.length,
        validDocuments: validationResults.filter(r => r.isValid).length,
        results: validationResults,
      };
    } catch (error) {
      logger.error('Validate case documents failed:', error);
      throw new Error('Failed to validate case documents');
    }
  }

  async getDocumentsByCase(caseId) {
    try {
      return await Document.findAll({
        where: {
          caseId,
          status: { [require('sequelize').Op.ne]: 'DELETED' },
        },
        order: [['created_at', 'DESC']],
      });
    } catch (error) {
      logger.error('Get documents by case failed:', error);
      throw new Error('Failed to fetch case documents');
    }
  }

  async getDocumentsByUser(userId, options = {}) {
    try {
      const where = {
        userId,
        status: { [require('sequelize').Op.ne]: 'DELETED' },
      };
      
      if (options.documentType) {
        where.documentType = options.documentType;
      }
      
      if (options.caseId) {
        where.caseId = options.caseId;
      }
      
      return await Document.findAll({
        where,
        order: [['created_at', 'DESC']],
        limit: options.limit || 100,
      });
    } catch (error) {
      logger.error('Get documents by user failed:', error);
      throw new Error('Failed to fetch user documents');
    }
  }

  getDocumentSecurityLevel(documentType) {
    const highSecurity = ['IRS_TRANSCRIPT', 'TAX_RETURN', 'BANK_STATEMENT'];
    const mediumSecurity = ['W2', '1099', 'PAY_STUB'];
    
    if (highSecurity.includes(documentType)) {
      return 'HIGH';
    } else if (mediumSecurity.includes(documentType)) {
      return 'MEDIUM';
    }
    return 'LOW';
  }
}

module.exports = new DocumentService();