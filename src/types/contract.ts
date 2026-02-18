export interface MarketplaceContract {
  id: string;
  userId: string;
  userType: 'physician' | 'facility' | 'vendor';
  contractType: 'non_circumvention' | 'platform_terms' | 'vendor_agreement';
  version: string;
  acceptedAt: Date;
  ipAddress: string;
  deviceInfo: string;
  digitalSignature: string;
  legalName: string;
  expiresAt: Date;
  status: 'active' | 'expired' | 'violated' | 'terminated';
}

export interface CircumventionViolation {
  id: string;
  reportedBy: string;
  reportedByType: 'physician' | 'facility' | 'admin' | 'system';
  violatorId: string;
  violatorType: 'physician' | 'facility';
  relatedPartyId: string;
  relatedPartyType: 'physician' | 'facility';
  assignmentId?: string;
  violationType: 'off_platform_contact' | 'direct_booking' | 'payment_bypass' | 'other';
  description: string;
  evidence: ViolationEvidence[];
  reportedAt: Date;
  status: 'pending_review' | 'under_investigation' | 'confirmed' | 'dismissed' | 'penalty_applied';
  investigationNotes: string;
  penaltyAmount: number;
  penaltyStatus: 'pending' | 'invoiced' | 'paid' | 'in_collection' | 'waived';
  penaltyDueDate?: Date;
  penaltyPaidAt?: Date;
  resolutionDate?: Date;
  resolutionNotes: string;
  auditLog: ViolationAuditEntry[];
}

export interface ViolationEvidence {
  id: string;
  type: 'screenshot' | 'email' | 'message' | 'document' | 'witness_statement' | 'other';
  description: string;
  fileUrl?: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface ViolationAuditEntry {
  timestamp: Date;
  action: string;
  performedBy: string;
  performedByRole: string;
  details: string;
  ipAddress: string;
}

export interface PenaltyInvoice {
  id: string;
  violationId: string;
  violatorId: string;
  violatorType: 'physician' | 'facility';
  amount: number;
  issuedAt: Date;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue' | 'in_collection' | 'waived';
  paymentMethod?: string;
  paidAt?: Date;
  transactionId?: string;
  notes: string;
}

export interface ContractEnforcementSettings {
  restrictionPeriodMonths: number;
  penaltyAmount: number;
  autoDetectionEnabled: boolean;
  investigationTimelineDays: number;
  penaltyPaymentTermDays: number;
  collectionAgencyThresholdDays: number;
}

export const DEFAULT_ENFORCEMENT_SETTINGS: ContractEnforcementSettings = {
  restrictionPeriodMonths: 24,
  penaltyAmount: 25000,
  autoDetectionEnabled: true,
  investigationTimelineDays: 14,
  penaltyPaymentTermDays: 30,
  collectionAgencyThresholdDays: 60
};
