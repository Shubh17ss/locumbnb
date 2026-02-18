export type PaymentProvider = 'stripe' | 'paypal' | 'other';

export type PaymentStatus = 
  | 'pending_funding'
  | 'escrowed'
  | 'released'
  | 'held'
  | 'refunded'
  | 'cancelled';

export type PaymentNotificationType =
  | 'escrow_funded'
  | 'assignment_start'
  | 'assignment_completion'
  | 'payment_release_pending'
  | 'payment_released'
  | 'dispute_initiated'
  | 'payment_held';

export interface PlatformFee {
  percentage: number; // Default 15%
  amount: number;
  calculatedAt: string;
  appliedTo: 'physician_payment' | 'vendor_service';
}

export interface EscrowPayment {
  id: string;
  assignmentId: string;
  physicianId: string;
  facilityId: string;
  
  // Payment amounts
  assignmentValue: number;
  platformFee: PlatformFee;
  physicianPayout: number; // assignmentValue - platformFee
  
  // Escrow provider
  provider: PaymentProvider;
  providerTransactionId: string;
  providerAccountId?: string;
  
  // Status tracking
  status: PaymentStatus;
  fundedAt?: string;
  releaseScheduledAt?: string; // 4 days after assignment completion
  releasedAt?: string;
  
  // Dispute window
  disputeWindowStart?: string; // Assignment completion date
  disputeWindowEnd?: string; // 48 hours before scheduled release
  disputeInitiatedAt?: string;
  
  // Audit trail
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  
  // Metadata
  metadata: {
    assignmentStartDate: string;
    assignmentEndDate: string;
    facilityName: string;
    physicianName: string;
    specialty: string;
  };
}

export interface PaymentNotification {
  id: string;
  paymentId: string;
  type: PaymentNotificationType;
  recipientId: string;
  recipientType: 'physician' | 'facility' | 'admin';
  
  // Notification content
  title: string;
  message: string;
  
  // Delivery
  sentAt: string;
  deliveredVia: ('email' | 'dashboard' | 'sms')[];
  readAt?: string;
  
  // Related data
  relatedAssignmentId: string;
  relatedDisputeId?: string;
  
  // Audit
  createdAt: string;
}

export interface PaymentAuditEntry {
  id: string;
  paymentId: string;
  action: string;
  performedBy: string;
  performedByRole: 'physician' | 'facility' | 'admin' | 'system';
  timestamp: string;
  
  // Details
  previousStatus?: PaymentStatus;
  newStatus?: PaymentStatus;
  amount?: number;
  reason?: string;
  
  // Metadata
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface DisputePaymentHold {
  id: string;
  paymentId: string;
  disputeId: string;
  
  // Hold details
  heldAt: string;
  heldBy: string;
  heldByRole: 'facility' | 'physician';
  reason: string;
  
  // Resolution
  resolvedAt?: string;
  resolution?: 'released' | 'refunded' | 'split' | 'admin_override';
  resolutionNotes?: string;
  
  // Amounts
  originalAmount: number;
  heldAmount: number;
  releasedAmount?: number;
  refundedAmount?: number;
}

export interface PaymentSchedule {
  assignmentId: string;
  assignmentStartDate: string;
  assignmentEndDate: string;
  
  // Timeline
  fundingDeadline: string; // Before assignment start
  assignmentCompletionDate: string;
  disputeWindowStart: string; // Assignment completion
  disputeWindowEnd: string; // 48 hours before release
  scheduledReleaseDate: string; // 4 days after completion
  
  // Status
  isFunded: boolean;
  isCompleted: boolean;
  isInDisputeWindow: boolean;
  isReleased: boolean;
}

export interface VendorPayment {
  id: string;
  vendorId: string;
  vendorType: 'insurance' | 'travel' | 'lodging' | 'other';
  physicianId: string;
  assignmentId?: string;
  
  // Payment details
  serviceAmount: number;
  platformFee: PlatformFee;
  vendorPayout: number;
  
  // Provider
  provider: PaymentProvider;
  providerTransactionId: string;
  
  // Status
  status: PaymentStatus;
  paidAt?: string;
  
  // Audit
  createdAt: string;
  updatedAt: string;
}
