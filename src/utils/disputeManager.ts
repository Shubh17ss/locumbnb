import type { 
  Dispute, 
  DisputeType, 
  DisputeParty, 
  DisputeEvidence,
  DisputeMessage,
  DisputeFee,
  DisputeResolution,
  DisputeAbuseFlag
} from '../types/dispute';

// Dispute fee configuration
const DISPUTE_FEE_BASE = 300;
const DISPUTE_FEE_CURRENCY = 'USD';

// Abuse detection thresholds
const ABUSE_THRESHOLDS = {
  MAX_DISPUTES_PER_MONTH: 3,
  FRIVOLOUS_RATE_THRESHOLD: 0.5, // 50% of disputes dismissed
  ABUSE_SCORE_WARNING: 60,
  ABUSE_SCORE_RESTRICTION: 80,
};

/**
 * Calculate dispute fee based on user's abuse history
 */
export const calculateDisputeFee = (userId: string, userRole: DisputeParty): number => {
  const abuseFlag = checkAbuseFlag(userId, userRole);
  
  if (abuseFlag?.restrictions?.disputeFeeMultiplier) {
    return DISPUTE_FEE_BASE * abuseFlag.restrictions.disputeFeeMultiplier;
  }
  
  return DISPUTE_FEE_BASE;
};

/**
 * Check if user has abuse flags
 */
export const checkAbuseFlag = (userId: string, userRole: DisputeParty): DisputeAbuseFlag | null => {
  // In production, this would query the database
  // For now, return null (no abuse flags)
  return null;
};

/**
 * Create a new dispute
 */
export const createDispute = (params: {
  assignmentId: string;
  assignmentTitle: string;
  facility: { id: string; name: string };
  physician: { id: string; name: string; specialty: string };
  initiatedBy: DisputeParty;
  initiatorId: string;
  initiatorName: string;
  respondentId: string;
  respondentName: string;
  respondentRole: DisputeParty;
  type: DisputeType;
  subject: string;
  description: string;
  escrowAmount?: number;
}): Dispute => {
  const disputeId = `DSP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const feeAmount = calculateDisputeFee(params.initiatorId, params.initiatedBy);
  
  const dispute: Dispute = {
    id: disputeId,
    assignmentId: params.assignmentId,
    assignmentTitle: params.assignmentTitle,
    facility: params.facility,
    physician: params.physician,
    initiatedBy: params.initiatedBy,
    initiatorId: params.initiatorId,
    initiatorName: params.initiatorName,
    respondentId: params.respondentId,
    respondentName: params.respondentName,
    respondentRole: params.respondentRole,
    type: params.type,
    status: 'open',
    priority: determinePriority(params.type),
    subject: params.subject,
    description: params.description,
    evidence: [],
    messages: [],
    fee: {
      id: `FEE-${disputeId}`,
      disputeId,
      amount: feeAmount,
      currency: DISPUTE_FEE_CURRENCY,
      paidBy: params.initiatorId,
      paidByRole: params.initiatedBy,
      paymentStatus: 'pending',
    },
    escrowHeld: true,
    escrowAmount: params.escrowAmount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      ipAddress: '0.0.0.0', // Captured from request in production
      userAgent: navigator.userAgent,
      deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    },
  };
  
  // Auto-escalate to admin panel
  escalateToAdmin(dispute);
  
  return dispute;
};

/**
 * Determine dispute priority based on type
 */
const determinePriority = (type: DisputeType): 'low' | 'medium' | 'high' | 'urgent' => {
  const priorityMap: Record<DisputeType, 'low' | 'medium' | 'high' | 'urgent'> = {
    payment_dispute: 'high',
    contract_violation: 'high',
    quality_complaint: 'medium',
    cancellation_dispute: 'medium',
    no_show: 'urgent',
    credential_misrepresentation: 'urgent',
    facility_breach: 'high',
    other: 'low',
  };
  
  return priorityMap[type];
};

/**
 * Auto-escalate dispute to admin panel
 */
export const escalateToAdmin = (dispute: Dispute): void => {
  dispute.status = 'escalated';
  dispute.escalatedAt = new Date().toISOString();
  dispute.updatedAt = new Date().toISOString();
  
  // In production, this would:
  // 1. Create admin notification
  // 2. Send email to admin team
  // 3. Update database
  // 4. Trigger webhook for external systems
  
  console.log(`Dispute ${dispute.id} auto-escalated to admin panel`);
};

/**
 * Add evidence to dispute
 */
export const addEvidence = (
  disputeId: string,
  file: File,
  uploadedBy: DisputeParty,
  description?: string
): DisputeEvidence => {
  const evidence: DisputeEvidence = {
    id: `EVD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    fileName: file.name,
    fileUrl: URL.createObjectURL(file), // In production, upload to cloud storage
    fileType: file.type,
    uploadedAt: new Date().toISOString(),
    uploadedBy,
    description,
  };
  
  return evidence;
};

/**
 * Add message to dispute
 */
export const addDisputeMessage = (
  disputeId: string,
  senderId: string,
  senderName: string,
  senderRole: DisputeParty,
  message: string,
  isInternal: boolean = false
): DisputeMessage => {
  const disputeMessage: DisputeMessage = {
    id: `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    disputeId,
    senderId,
    senderName,
    senderRole,
    message,
    timestamp: new Date().toISOString(),
    isInternal,
  };
  
  return disputeMessage;
};

/**
 * Process dispute fee payment
 */
export const processDisputeFee = async (
  disputeId: string,
  paymentMethodId: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    // In production, integrate with Stripe/PayPal
    // For now, simulate payment processing
    
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      transactionId,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Payment processing failed',
    };
  }
};

/**
 * Resolve dispute
 */
export const resolveDispute = (params: {
  disputeId: string;
  resolvedBy: string;
  resolvedByName: string;
  outcome: 'favor_physician' | 'favor_facility' | 'favor_vendor' | 'split' | 'dismissed' | 'settled';
  resolution: string;
  feeRefunded: boolean;
  penaltyApplied?: {
    party: DisputeParty;
    amount: number;
    reason: string;
  };
  escrowAction?: 'release_to_physician' | 'release_to_facility' | 'split' | 'hold';
  notes?: string;
}): DisputeResolution => {
  const resolution: DisputeResolution = {
    id: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    disputeId: params.disputeId,
    resolvedBy: params.resolvedBy,
    resolvedByName: params.resolvedByName,
    resolvedAt: new Date().toISOString(),
    outcome: params.outcome,
    resolution: params.resolution,
    feeRefunded: params.feeRefunded,
    penaltyApplied: params.penaltyApplied,
    escrowAction: params.escrowAction,
    notes: params.notes,
  };
  
  return resolution;
};

/**
 * Calculate abuse score for user
 */
export const calculateAbuseScore = (
  totalDisputes: number,
  frivolousDisputes: number,
  monthlyDisputes: number
): number => {
  let score = 0;
  
  // Factor 1: Frivolous dispute rate (0-40 points)
  const frivolousRate = totalDisputes > 0 ? frivolousDisputes / totalDisputes : 0;
  score += frivolousRate * 40;
  
  // Factor 2: Monthly dispute frequency (0-30 points)
  if (monthlyDisputes > ABUSE_THRESHOLDS.MAX_DISPUTES_PER_MONTH) {
    score += Math.min(30, (monthlyDisputes - ABUSE_THRESHOLDS.MAX_DISPUTES_PER_MONTH) * 10);
  }
  
  // Factor 3: Total dispute volume (0-30 points)
  if (totalDisputes > 5) {
    score += Math.min(30, (totalDisputes - 5) * 3);
  }
  
  return Math.min(100, Math.round(score));
};

/**
 * Update abuse flag for user
 */
export const updateAbuseFlag = (
  userId: string,
  userRole: DisputeParty,
  totalDisputes: number,
  frivolousDisputes: number,
  monthlyDisputes: number
): DisputeAbuseFlag => {
  const abuseScore = calculateAbuseScore(totalDisputes, frivolousDisputes, monthlyDisputes);
  const flagged = abuseScore >= ABUSE_THRESHOLDS.ABUSE_SCORE_WARNING;
  
  const abuseFlag: DisputeAbuseFlag = {
    userId,
    userRole,
    totalDisputes,
    frivolousDisputes,
    abuseScore,
    flagged,
    flaggedAt: flagged ? new Date().toISOString() : undefined,
  };
  
  // Apply restrictions based on abuse score
  if (abuseScore >= ABUSE_THRESHOLDS.ABUSE_SCORE_RESTRICTION) {
    abuseFlag.restrictions = {
      disputeFeeMultiplier: 2, // Double the fee
      requiresAdminApproval: true,
      temporaryBan: abuseScore >= 90,
      banUntil: abuseScore >= 90 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    };
  } else if (abuseScore >= ABUSE_THRESHOLDS.ABUSE_SCORE_WARNING) {
    abuseFlag.restrictions = {
      disputeFeeMultiplier: 1.5, // 1.5x fee
      requiresAdminApproval: false,
      temporaryBan: false,
    };
  }
  
  return abuseFlag;
};

/**
 * Check if user can file dispute
 */
export const canFileDispute = (userId: string, userRole: DisputeParty): {
  allowed: boolean;
  reason?: string;
  feeAmount?: number;
} => {
  const abuseFlag = checkAbuseFlag(userId, userRole);
  
  if (abuseFlag?.restrictions?.temporaryBan) {
    return {
      allowed: false,
      reason: `Your account is temporarily restricted from filing disputes until ${new Date(abuseFlag.restrictions.banUntil!).toLocaleDateString()}`,
    };
  }
  
  const feeAmount = calculateDisputeFee(userId, userRole);
  
  if (abuseFlag?.restrictions?.requiresAdminApproval) {
    return {
      allowed: true,
      reason: 'Your dispute will require admin approval before processing',
      feeAmount,
    };
  }
  
  return {
    allowed: true,
    feeAmount,
  };
};

/**
 * Create dispute audit log
 */
export const createDisputeAuditLog = (params: {
  disputeId: string;
  action: string;
  performedBy: string;
  performedByRole: DisputeParty;
  details: string;
  metadata?: Record<string, any>;
}): void => {
  const log = {
    id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    disputeId: params.disputeId,
    action: params.action,
    performedBy: params.performedBy,
    performedByRole: params.performedByRole,
    details: params.details,
    timestamp: new Date().toISOString(),
    ipAddress: '0.0.0.0', // Captured from request in production
    userAgent: navigator.userAgent,
    metadata: params.metadata,
  };
  
  // In production, store in database
  console.log('Dispute audit log:', log);
};
