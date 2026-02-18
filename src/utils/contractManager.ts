import {
  MarketplaceContract,
  CircumventionViolation,
  PenaltyInvoice,
  ViolationEvidence,
  ViolationAuditEntry,
  DEFAULT_ENFORCEMENT_SETTINGS
} from '../types/contract';

/**
 * Contract Manager - Handles non-circumvention enforcement
 */

// Create marketplace contract on signup
export const createMarketplaceContract = (
  userId: string,
  userType: 'physician' | 'facility' | 'vendor',
  legalName: string,
  digitalSignature: string,
  ipAddress: string,
  deviceInfo: string
): MarketplaceContract => {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setMonth(expiresAt.getMonth() + DEFAULT_ENFORCEMENT_SETTINGS.restrictionPeriodMonths);

  const contract: MarketplaceContract = {
    id: `contract-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userType,
    contractType: 'non_circumvention',
    version: '1.0',
    acceptedAt: now,
    ipAddress,
    deviceInfo,
    digitalSignature,
    legalName,
    expiresAt,
    status: 'active'
  };

  console.log('✅ Marketplace contract created:', contract.id);
  return contract;
};

// Report a violation
export const reportViolation = (
  reportedBy: string,
  reportedByType: 'physician' | 'facility' | 'admin' | 'system',
  violatorId: string,
  violatorType: 'physician' | 'facility',
  relatedPartyId: string,
  relatedPartyType: 'physician' | 'facility',
  violationType: 'off_platform_contact' | 'direct_booking' | 'payment_bypass' | 'other',
  description: string,
  evidence: Omit<ViolationEvidence, 'id' | 'uploadedAt'>[],
  assignmentId?: string,
  ipAddress?: string
): CircumventionViolation => {
  const now = new Date();
  
  const violation: CircumventionViolation = {
    id: `violation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    reportedBy,
    reportedByType,
    violatorId,
    violatorType,
    relatedPartyId,
    relatedPartyType,
    assignmentId,
    violationType,
    description,
    evidence: evidence.map(e => ({
      ...e,
      id: `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: now
    })),
    reportedAt: now,
    status: 'pending_review',
    investigationNotes: '',
    penaltyAmount: DEFAULT_ENFORCEMENT_SETTINGS.penaltyAmount,
    penaltyStatus: 'pending',
    resolutionNotes: '',
    auditLog: [
      {
        timestamp: now,
        action: 'Violation Reported',
        performedBy: reportedBy,
        performedByRole: reportedByType === 'system' ? 'Automated System' : reportedByType,
        details: `Violation reported: ${violationType}`,
        ipAddress: ipAddress || 'unknown'
      }
    ]
  };

  console.log('🚨 Violation reported:', violation.id);
  
  // Auto-escalate to admin panel
  console.log('📤 Violation escalated to admin panel for review');
  
  return violation;
};

// Add evidence to existing violation
export const addViolationEvidence = (
  violation: CircumventionViolation,
  evidence: Omit<ViolationEvidence, 'id' | 'uploadedAt'>,
  uploadedBy: string
): CircumventionViolation => {
  const newEvidence: ViolationEvidence = {
    ...evidence,
    id: `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    uploadedAt: new Date(),
    uploadedBy
  };

  const updatedViolation = {
    ...violation,
    evidence: [...violation.evidence, newEvidence]
  };

  console.log('📎 Evidence added to violation:', violation.id);
  return updatedViolation;
};

// Update violation status (admin action)
export const updateViolationStatus = (
  violation: CircumventionViolation,
  newStatus: CircumventionViolation['status'],
  performedBy: string,
  performedByRole: string,
  notes: string,
  ipAddress: string
): CircumventionViolation => {
  const now = new Date();
  
  const auditEntry: ViolationAuditEntry = {
    timestamp: now,
    action: `Status Updated: ${newStatus}`,
    performedBy,
    performedByRole,
    details: notes,
    ipAddress
  };

  const updatedViolation = {
    ...violation,
    status: newStatus,
    investigationNotes: violation.investigationNotes + `\n[${now.toISOString()}] ${notes}`,
    auditLog: [...violation.auditLog, auditEntry]
  };

  if (newStatus === 'confirmed') {
    updatedViolation.resolutionDate = now;
  }

  console.log(`✅ Violation ${violation.id} status updated to: ${newStatus}`);
  return updatedViolation;
};

// Issue penalty invoice
export const issuePenaltyInvoice = (
  violation: CircumventionViolation,
  performedBy: string,
  performedByRole: string,
  ipAddress: string
): { violation: CircumventionViolation; invoice: PenaltyInvoice } => {
  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + DEFAULT_ENFORCEMENT_SETTINGS.penaltyPaymentTermDays);

  const invoice: PenaltyInvoice = {
    id: `invoice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    violationId: violation.id,
    violatorId: violation.violatorId,
    violatorType: violation.violatorType,
    amount: violation.penaltyAmount,
    issuedAt: now,
    dueDate,
    status: 'pending',
    notes: `Penalty for confirmed non-circumvention violation. Payment required within ${DEFAULT_ENFORCEMENT_SETTINGS.penaltyPaymentTermDays} days.`
  };

  const auditEntry: ViolationAuditEntry = {
    timestamp: now,
    action: 'Penalty Invoice Issued',
    performedBy,
    performedByRole,
    details: `Invoice ${invoice.id} issued for $${invoice.amount.toLocaleString()}`,
    ipAddress
  };

  const updatedViolation = {
    ...violation,
    penaltyStatus: 'invoiced' as const,
    penaltyDueDate: dueDate,
    auditLog: [...violation.auditLog, auditEntry]
  };

  console.log(`💰 Penalty invoice issued: ${invoice.id} for $${invoice.amount.toLocaleString()}`);
  return { violation: updatedViolation, invoice };
};

// Record penalty payment
export const recordPenaltyPayment = (
  invoice: PenaltyInvoice,
  violation: CircumventionViolation,
  paymentMethod: string,
  transactionId: string,
  performedBy: string,
  performedByRole: string,
  ipAddress: string
): { invoice: PenaltyInvoice; violation: CircumventionViolation } => {
  const now = new Date();

  const updatedInvoice: PenaltyInvoice = {
    ...invoice,
    status: 'paid',
    paymentMethod,
    transactionId,
    paidAt: now
  };

  const auditEntry: ViolationAuditEntry = {
    timestamp: now,
    action: 'Penalty Payment Received',
    performedBy,
    performedByRole,
    details: `Payment of $${invoice.amount.toLocaleString()} received via ${paymentMethod}. Transaction ID: ${transactionId}`,
    ipAddress
  };

  const updatedViolation = {
    ...violation,
    penaltyStatus: 'paid' as const,
    penaltyPaidAt: now,
    auditLog: [...violation.auditLog, auditEntry]
  };

  console.log(`✅ Penalty payment recorded: ${invoice.id}`);
  return { invoice: updatedInvoice, violation: updatedViolation };
};

// Dismiss violation (admin action)
export const dismissViolation = (
  violation: CircumventionViolation,
  reason: string,
  performedBy: string,
  performedByRole: string,
  ipAddress: string
): CircumventionViolation => {
  const now = new Date();

  const auditEntry: ViolationAuditEntry = {
    timestamp: now,
    action: 'Violation Dismissed',
    performedBy,
    performedByRole,
    details: `Violation dismissed. Reason: ${reason}`,
    ipAddress
  };

  const updatedViolation = {
    ...violation,
    status: 'dismissed' as const,
    penaltyStatus: 'waived' as const,
    resolutionDate: now,
    resolutionNotes: reason,
    auditLog: [...violation.auditLog, auditEntry]
  };

  console.log(`✅ Violation dismissed: ${violation.id}`);
  return updatedViolation;
};

// Check if user is in restriction period with another party
export const isInRestrictionPeriod = (
  userId: string,
  otherPartyId: string,
  lastInteractionDate: Date
): boolean => {
  const now = new Date();
  const restrictionEndDate = new Date(lastInteractionDate);
  restrictionEndDate.setMonth(
    restrictionEndDate.getMonth() + DEFAULT_ENFORCEMENT_SETTINGS.restrictionPeriodMonths
  );

  return now < restrictionEndDate;
};

// Calculate restriction end date
export const calculateRestrictionEndDate = (interactionDate: Date): Date => {
  const endDate = new Date(interactionDate);
  endDate.setMonth(endDate.getMonth() + DEFAULT_ENFORCEMENT_SETTINGS.restrictionPeriodMonths);
  return endDate;
};

// Auto-detect potential violations (system monitoring)
export const detectPotentialViolation = (
  userId: string,
  userType: 'physician' | 'facility',
  relatedPartyId: string,
  relatedPartyType: 'physician' | 'facility',
  detectionType: 'email_pattern' | 'direct_contact' | 'payment_anomaly',
  details: string,
  assignmentId?: string
): CircumventionViolation | null => {
  if (!DEFAULT_ENFORCEMENT_SETTINGS.autoDetectionEnabled) {
    return null;
  }

  console.log('🔍 Auto-detection triggered:', detectionType);

  const violation = reportViolation(
    'system-auto-detect',
    'system',
    userId,
    userType,
    relatedPartyId,
    relatedPartyType,
    detectionType === 'email_pattern' ? 'off_platform_contact' : 'direct_booking',
    `Automated detection: ${details}`,
    [],
    assignmentId,
    'system'
  );

  return violation;
};

// Track violation frequency for abuse prevention
export const getViolationFrequency = (userId: string, violations: CircumventionViolation[]): {
  totalReports: number;
  confirmedViolations: number;
  dismissedReports: number;
  isAbusive: boolean;
} => {
  const userViolations = violations.filter(v => v.reportedBy === userId);
  
  const totalReports = userViolations.length;
  const confirmedViolations = userViolations.filter(v => v.status === 'confirmed').length;
  const dismissedReports = userViolations.filter(v => v.status === 'dismissed').length;
  
  // Flag as abusive if more than 50% of reports are dismissed and total reports > 3
  const isAbusive = totalReports > 3 && (dismissedReports / totalReports) > 0.5;

  return {
    totalReports,
    confirmedViolations,
    dismissedReports,
    isAbusive
  };
};

// Send to collections (overdue penalties)
export const sendToCollections = (
  invoice: PenaltyInvoice,
  violation: CircumventionViolation,
  performedBy: string,
  performedByRole: string,
  ipAddress: string
): { invoice: PenaltyInvoice; violation: CircumventionViolation } => {
  const now = new Date();

  const updatedInvoice: PenaltyInvoice = {
    ...invoice,
    status: 'in_collection',
    notes: invoice.notes + `\n[${now.toISOString()}] Sent to collections agency due to non-payment.`
  };

  const auditEntry: ViolationAuditEntry = {
    timestamp: now,
    action: 'Sent to Collections',
    performedBy,
    performedByRole,
    details: `Invoice sent to collections agency. Amount: $${invoice.amount.toLocaleString()}`,
    ipAddress
  };

  const updatedViolation = {
    ...violation,
    penaltyStatus: 'in_collection' as const,
    auditLog: [...violation.auditLog, auditEntry]
  };

  console.log(`⚠️ Invoice sent to collections: ${invoice.id}`);
  return { invoice: updatedInvoice, violation: updatedViolation };
};

// Check for overdue invoices
export const checkOverdueInvoices = (invoices: PenaltyInvoice[]): PenaltyInvoice[] => {
  const now = new Date();
  const collectionThreshold = new Date(now);
  collectionThreshold.setDate(
    collectionThreshold.getDate() - DEFAULT_ENFORCEMENT_SETTINGS.collectionAgencyThresholdDays
  );

  return invoices.filter(invoice => {
    if (invoice.status !== 'pending' && invoice.status !== 'overdue') {
      return false;
    }
    
    const isOverdue = now > invoice.dueDate;
    const shouldCollect = invoice.dueDate < collectionThreshold;
    
    return isOverdue || shouldCollect;
  });
};
