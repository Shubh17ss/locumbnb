export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userRole: 'physician' | 'crna' | 'facility' | 'vendor';
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  details: Record<string, any>;
  ipAddress?: string;
  deviceInfo?: string;
  version?: number;
}

export type AuditAction =
  | 'profile_created'
  | 'profile_updated'
  | 'profile_completed'
  | 'document_uploaded'
  | 'document_updated'
  | 'document_deleted'
  | 'signature_created'
  | 'signature_updated'
  | 'application_submitted'
  | 'application_withdrawn'
  | 'assignment_accepted'
  | 'assignment_declined'
  | 'communication_sent'
  | 'communication_received'
  | 'data_transmitted'
  | 'consent_given'
  | 'consent_revoked'
  | 'terms_accepted'
  | 'invoice_uploaded'
  | 'quote_accepted'
  | 'quote_declined'
  | 'service_requested'
  | 'login'
  | 'logout';

export type AuditEntityType =
  | 'profile'
  | 'document'
  | 'signature'
  | 'application'
  | 'assignment'
  | 'message'
  | 'invoice'
  | 'quote'
  | 'service_request'
  | 'consent';

export interface VersionedDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  version: number;
  uploadedAt: string;
  uploadedBy: string;
  ipAddress?: string;
  deviceInfo?: string;
  checksum?: string;
  previousVersionId?: string;
  status: 'active' | 'superseded' | 'deleted';
}

export interface VersionedSignature {
  id: string;
  signatureType: 'digital_attestation' | 'facility_agreement' | 'platform_terms';
  fullLegalName: string;
  signedAt: string;
  signedBy: string;
  ipAddress: string;
  deviceInfo: string;
  version: number;
  attestationText: string;
  relatedEntityType: string;
  relatedEntityId: string;
  status: 'active' | 'superseded' | 'revoked';
}

export interface DataTransmissionLog {
  id: string;
  transmissionType: 'application_submission' | 'document_share' | 'profile_share';
  fromUserId: string;
  fromUserRole: string;
  toUserId: string;
  toUserRole: string;
  dataPackage: {
    profileData?: boolean;
    documents?: string[];
    signatures?: string[];
    questionnaires?: string[];
  };
  transmittedAt: string;
  consentId: string;
  applicationId?: string;
  assignmentId?: string;
  ipAddress: string;
  status: 'pending' | 'transmitted' | 'failed';
}

export interface ComplianceCheck {
  id: string;
  checkType: 'non_circumvention' | 'data_consent' | 'profile_completeness' | 'signature_validity';
  entityType: string;
  entityId: string;
  performedAt: string;
  performedBy: string;
  result: 'passed' | 'failed' | 'warning';
  details: Record<string, any>;
  actionTaken?: string;
}
