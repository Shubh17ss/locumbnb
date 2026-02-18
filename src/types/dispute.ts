export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'escalated' | 'closed';

export type DisputeType = 
  | 'payment_dispute'
  | 'contract_violation'
  | 'quality_complaint'
  | 'cancellation_dispute'
  | 'no_show'
  | 'credential_misrepresentation'
  | 'facility_breach'
  | 'other';

export type DisputeParty = 'physician' | 'facility' | 'vendor' | 'admin';

export interface DisputeEvidence {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
  uploadedBy: DisputeParty;
  description?: string;
}

export interface DisputeMessage {
  id: string;
  disputeId: string;
  senderId: string;
  senderName: string;
  senderRole: DisputeParty;
  message: string;
  timestamp: string;
  isInternal: boolean; // Admin-only messages
}

export interface DisputeFee {
  id: string;
  disputeId: string;
  amount: number;
  currency: string;
  paidBy: string;
  paidByRole: DisputeParty;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'forfeited';
  transactionId?: string;
  paidAt?: string;
  refundedAt?: string;
}

export interface DisputeResolution {
  id: string;
  disputeId: string;
  resolvedBy: string;
  resolvedByName: string;
  resolvedAt: string;
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
}

export interface DisputeAbuseFlag {
  userId: string;
  userRole: DisputeParty;
  totalDisputes: number;
  frivolousDisputes: number;
  abuseScore: number; // 0-100, higher = more abusive
  flagged: boolean;
  flaggedAt?: string;
  restrictions?: {
    disputeFeeMultiplier: number; // e.g., 2x = $600 instead of $300
    requiresAdminApproval: boolean;
    temporaryBan: boolean;
    banUntil?: string;
  };
}

export interface Dispute {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  facility: {
    id: string;
    name: string;
  };
  physician: {
    id: string;
    name: string;
    specialty: string;
  };
  initiatedBy: DisputeParty;
  initiatorId: string;
  initiatorName: string;
  respondentId: string;
  respondentName: string;
  respondentRole: DisputeParty;
  type: DisputeType;
  status: DisputeStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  evidence: DisputeEvidence[];
  messages: DisputeMessage[];
  fee: DisputeFee;
  resolution?: DisputeResolution;
  escrowHeld: boolean;
  escrowAmount?: number;
  createdAt: string;
  updatedAt: string;
  escalatedAt?: string;
  resolvedAt?: string;
  assignedAdmin?: {
    id: string;
    name: string;
    role: string;
  };
  metadata: {
    ipAddress: string;
    userAgent: string;
    deviceType: string;
  };
}

export interface DisputeStats {
  totalDisputes: number;
  openDisputes: number;
  underReviewDisputes: number;
  resolvedDisputes: number;
  escalatedDisputes: number;
  avgResolutionTime: number; // in days
  totalFeesCollected: number;
  totalFeesRefunded: number;
  outcomeBreakdown: {
    favor_physician: number;
    favor_facility: number;
    favor_vendor: number;
    split: number;
    dismissed: number;
    settled: number;
  };
}
