import { useState } from 'react';
import { auditLogger } from '../utils/auditLogger';
import { versionControl } from '../utils/versionControl';
import { dataTransmissionManager } from '../utils/dataTransmission';
import { complianceChecker } from '../utils/complianceChecker';
import type { AuditEntry, VersionedDocument, VersionedSignature, DataTransmissionLog, ComplianceCheck } from '../types/audit';

export const useAuditSystem = (userId: string, userRole: 'physician' | 'crna' | 'facility' | 'vendor') => {
  const [isLoading, setIsLoading] = useState(false);

  // Audit logging functions
  const logAction = async (
    action: AuditEntry['action'],
    entityType: AuditEntry['entityType'],
    entityId: string,
    details: Record<string, any> = {},
    version?: number
  ) => {
    try {
      await auditLogger.log(userId, userRole, action, entityType, entityId, details, version);
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  };

  const getAuditHistory = (entityType?: string, entityId?: string): AuditEntry[] => {
    if (entityType && entityId) {
      return auditLogger.getEntriesByEntity(entityType as AuditEntry['entityType'], entityId);
    }
    return auditLogger.getEntriesByUser(userId);
  };

  // Document version control functions
  const uploadDocument = async (
    documentType: string,
    file: File
  ): Promise<VersionedDocument> => {
    setIsLoading(true);
    try {
      // In production, upload to storage service
      const fileUrl = URL.createObjectURL(file);
      
      const versionedDoc = await versionControl.addDocument(
        documentType,
        file.name,
        fileUrl,
        userId,
        file
      );

      return versionedDoc;
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentHistory = (documentType: string): VersionedDocument[] => {
    return versionControl.getDocumentVersions(userId, documentType);
  };

  const getLatestDocument = (documentType: string): VersionedDocument | null => {
    return versionControl.getLatestDocument(userId, documentType);
  };

  const getAllDocuments = (): VersionedDocument[] => {
    return versionControl.getAllActiveDocuments(userId);
  };

  // Signature management functions
  const createSignature = async (
    signatureType: 'digital_attestation' | 'facility_agreement' | 'platform_terms',
    fullLegalName: string,
    attestationText: string,
    relatedEntityType: string,
    relatedEntityId: string
  ): Promise<VersionedSignature> => {
    setIsLoading(true);
    try {
      const signature = await versionControl.addSignature(
        signatureType,
        fullLegalName,
        userId,
        attestationText,
        relatedEntityType,
        relatedEntityId
      );

      return signature;
    } finally {
      setIsLoading(false);
    }
  };

  const getSignatureHistory = (
    signatureType: string,
    relatedEntityId: string
  ): VersionedSignature[] => {
    return versionControl.getSignatureVersions(userId, signatureType, relatedEntityId);
  };

  const getLatestSignature = (
    signatureType: string,
    relatedEntityId: string
  ): VersionedSignature | null => {
    return versionControl.getLatestSignature(userId, signatureType, relatedEntityId);
  };

  const getAllSignatures = (): VersionedSignature[] => {
    return versionControl.getAllActiveSignatures(userId);
  };

  // Data transmission functions
  const transmitApplicationData = async (
    facilityId: string,
    applicationId: string,
    assignmentId: string,
    consentId: string
  ): Promise<DataTransmissionLog> => {
    setIsLoading(true);
    try {
      const transmission = await dataTransmissionManager.transmitApplicationData(
        userId,
        facilityId,
        applicationId,
        assignmentId,
        consentId
      );

      return transmission;
    } finally {
      setIsLoading(false);
    }
  };

  const recordConsent = async (
    consentType: string,
    consentText: string
  ): Promise<string> => {
    try {
      const consentId = await dataTransmissionManager.recordConsent(
        userId,
        consentType,
        consentText
      );

      return consentId;
    } catch (error) {
      console.error('Failed to record consent:', error);
      throw error;
    }
  };

  const getTransmissionHistory = (): DataTransmissionLog[] => {
    return dataTransmissionManager.getTransmissionsByUser(userId);
  };

  // Compliance checking functions
  const checkProfileCompleteness = async (): Promise<ComplianceCheck> => {
    return await complianceChecker.checkProfileCompleteness(userId);
  };

  const checkNonCircumvention = async (applicationId: string): Promise<ComplianceCheck> => {
    return await complianceChecker.checkNonCircumvention(userId, applicationId);
  };

  const checkSignatureValidity = async (signatureId: string): Promise<ComplianceCheck> => {
    return await complianceChecker.checkSignatureValidity(userId, signatureId);
  };

  const performPreApplicationChecks = async (
    applicationId: string,
    facilityId: string
  ): Promise<{
    passed: boolean;
    checks: ComplianceCheck[];
    blockingIssues: string[];
  }> => {
    setIsLoading(true);
    try {
      const result = await complianceChecker.performPreApplicationChecks(
        userId,
        applicationId,
        facilityId
      );

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const getComplianceHistory = (): ComplianceCheck[] => {
    return complianceChecker.getChecksByUser(userId);
  };

  return {
    isLoading,
    // Audit functions
    logAction,
    getAuditHistory,
    // Document functions
    uploadDocument,
    getDocumentHistory,
    getLatestDocument,
    getAllDocuments,
    // Signature functions
    createSignature,
    getSignatureHistory,
    getLatestSignature,
    getAllSignatures,
    // Transmission functions
    transmitApplicationData,
    recordConsent,
    getTransmissionHistory,
    // Compliance functions
    checkProfileCompleteness,
    checkNonCircumvention,
    checkSignatureValidity,
    performPreApplicationChecks,
    getComplianceHistory,
  };
};
