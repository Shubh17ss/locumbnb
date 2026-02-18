// Cancellation & Penalty System Types

export interface CancellationWindow {
  id: string;
  daysBeforeStart: number;
  penaltyPercentage: number;
  description: string;
}

export interface CancellationPolicy {
  id: string;
  jobPostingId: string;
  windows: CancellationWindow[];
  gracePeriodHours: number;
  applyToFacility: boolean; // Symmetry rule
  applyToPhysician: boolean;
  createdAt: string;
  createdBy: string;
  version: number;
}

export interface CancellationRequest {
  id: string;
  assignmentId: string;
  contractId: string;
  initiatedBy: 'physician' | 'facility';
  initiatorId: string;
  reason: string;
  requestedAt: string;
  assignmentStartDate: string;
  daysBeforeStart: number;
  applicableWindow: CancellationWindow | null;
  penaltyAmount: number;
  penaltyPercentage: number;
  assignmentValue: number;
  status: 'pending' | 'approved' | 'rejected' | 'grace_period';
  gracePeriodEndsAt: string | null;
  processedAt: string | null;
  processedBy: string | null;
  notes: string;
  auditLog: CancellationAuditEntry[];
}

export interface CancellationAuditEntry {
  id: string;
  timestamp: string;
  action: 'requested' | 'approved' | 'rejected' | 'penalty_calculated' | 'penalty_charged' | 'grace_period_started' | 'grace_period_ended';
  performedBy: string;
  performedByRole: 'physician' | 'facility' | 'admin' | 'system';
  details: string;
  metadata: {
    ipAddress?: string;
    deviceInfo?: string;
    previousStatus?: string;
    newStatus?: string;
    penaltyAmount?: number;
  };
}

export interface PenaltyCharge {
  id: string;
  cancellationRequestId: string;
  assignmentId: string;
  chargedTo: 'physician' | 'facility';
  chargedToId: string;
  amount: number;
  percentage: number;
  assignmentValue: number;
  status: 'pending' | 'charged' | 'refunded' | 'waived';
  chargedAt: string;
  paymentMethod: string;
  transactionId: string;
  refundedAt: string | null;
  refundReason: string | null;
  waivedBy: string | null;
  waivedReason: string | null;
}

export interface CancellationStats {
  totalCancellations: number;
  physicianCancellations: number;
  facilityCancellations: number;
  totalPenaltiesCharged: number;
  averagePenaltyAmount: number;
  cancellationRate: number;
  mostCommonReason: string;
}
