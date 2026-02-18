import {
  EscrowPayment,
  PaymentStatus,
  PaymentProvider,
  PlatformFee,
  PaymentSchedule,
  PaymentNotification,
  PaymentNotificationType,
  PaymentAuditEntry,
  DisputePaymentHold,
  VendorPayment
} from '../types/payment';

/**
 * Calculate platform fee (default 15%)
 */
export function calculatePlatformFee(
  amount: number,
  feePercentage: number = 15
): PlatformFee {
  const feeAmount = Math.round((amount * feePercentage) / 100 * 100) / 100;
  
  return {
    percentage: feePercentage,
    amount: feeAmount,
    calculatedAt: new Date().toISOString(),
    appliedTo: 'physician_payment'
  };
}

/**
 * Calculate payment schedule based on assignment dates
 */
export function calculatePaymentSchedule(
  assignmentStartDate: string,
  assignmentEndDate: string
): PaymentSchedule {
  const startDate = new Date(assignmentStartDate);
  const endDate = new Date(assignmentEndDate);
  
  // Funding deadline: 1 day before assignment start
  const fundingDeadline = new Date(startDate);
  fundingDeadline.setDate(fundingDeadline.getDate() - 1);
  
  // Assignment completion date
  const completionDate = new Date(endDate);
  
  // Dispute window: starts at completion, ends 48 hours before release
  const disputeWindowStart = new Date(completionDate);
  
  // Scheduled release: 4 days after completion
  const scheduledReleaseDate = new Date(completionDate);
  scheduledReleaseDate.setDate(scheduledReleaseDate.getDate() + 4);
  
  // Dispute window ends 48 hours before release
  const disputeWindowEnd = new Date(scheduledReleaseDate);
  disputeWindowEnd.setHours(disputeWindowEnd.getHours() - 48);
  
  return {
    assignmentId: '',
    assignmentStartDate: startDate.toISOString(),
    assignmentEndDate: endDate.toISOString(),
    fundingDeadline: fundingDeadline.toISOString(),
    assignmentCompletionDate: completionDate.toISOString(),
    disputeWindowStart: disputeWindowStart.toISOString(),
    disputeWindowEnd: disputeWindowEnd.toISOString(),
    scheduledReleaseDate: scheduledReleaseDate.toISOString(),
    isFunded: false,
    isCompleted: false,
    isInDisputeWindow: false,
    isReleased: false
  };
}

/**
 * Create escrow payment
 */
export function createEscrowPayment(
  assignmentId: string,
  physicianId: string,
  facilityId: string,
  assignmentValue: number,
  provider: PaymentProvider,
  metadata: {
    assignmentStartDate: string;
    assignmentEndDate: string;
    facilityName: string;
    physicianName: string;
    specialty: string;
  },
  createdBy: string
): EscrowPayment {
  const platformFee = calculatePlatformFee(assignmentValue);
  const physicianPayout = assignmentValue - platformFee.amount;
  const schedule = calculatePaymentSchedule(
    metadata.assignmentStartDate,
    metadata.assignmentEndDate
  );
  
  const payment: EscrowPayment = {
    id: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    assignmentId,
    physicianId,
    facilityId,
    assignmentValue,
    platformFee,
    physicianPayout,
    provider,
    providerTransactionId: `${provider.toUpperCase()}-${Date.now()}`,
    status: 'pending_funding',
    releaseScheduledAt: schedule.scheduledReleaseDate,
    disputeWindowStart: schedule.disputeWindowStart,
    disputeWindowEnd: schedule.disputeWindowEnd,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy,
    lastModifiedBy: createdBy,
    metadata
  };
  
  return payment;
}

/**
 * Fund escrow payment
 */
export function fundEscrowPayment(
  payment: EscrowPayment,
  providerTransactionId: string,
  fundedBy: string
): EscrowPayment {
  return {
    ...payment,
    status: 'escrowed',
    providerTransactionId,
    fundedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastModifiedBy: fundedBy
  };
}

/**
 * Check if payment is in dispute window
 */
export function isInDisputeWindow(payment: EscrowPayment): boolean {
  if (!payment.disputeWindowStart || !payment.disputeWindowEnd) {
    return false;
  }
  
  const now = new Date();
  const windowStart = new Date(payment.disputeWindowStart);
  const windowEnd = new Date(payment.disputeWindowEnd);
  
  return now >= windowStart && now <= windowEnd;
}

/**
 * Check if payment can be disputed
 */
export function canInitiateDispute(payment: EscrowPayment): {
  canDispute: boolean;
  reason?: string;
} {
  if (payment.status !== 'escrowed') {
    return {
      canDispute: false,
      reason: 'Payment must be in escrowed status to dispute'
    };
  }
  
  if (!isInDisputeWindow(payment)) {
    return {
      canDispute: false,
      reason: 'Dispute window has closed (must be within 48 hours before scheduled release)'
    };
  }
  
  if (payment.disputeInitiatedAt) {
    return {
      canDispute: false,
      reason: 'Dispute already initiated for this payment'
    };
  }
  
  return { canDispute: true };
}

/**
 * Initiate dispute and hold payment
 */
export function initiateDisputeHold(
  payment: EscrowPayment,
  disputeId: string,
  initiatedBy: string,
  initiatedByRole: 'facility' | 'physician',
  reason: string
): { payment: EscrowPayment; hold: DisputePaymentHold } {
  const hold: DisputePaymentHold = {
    id: `HOLD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    paymentId: payment.id,
    disputeId,
    heldAt: new Date().toISOString(),
    heldBy: initiatedBy,
    heldByRole: initiatedByRole,
    reason,
    originalAmount: payment.physicianPayout,
    heldAmount: payment.physicianPayout
  };
  
  const updatedPayment: EscrowPayment = {
    ...payment,
    status: 'held',
    disputeInitiatedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastModifiedBy: initiatedBy
  };
  
  return { payment: updatedPayment, hold };
}

/**
 * Release payment (automatic or manual)
 */
export function releasePayment(
  payment: EscrowPayment,
  releasedBy: string
): EscrowPayment {
  return {
    ...payment,
    status: 'released',
    releasedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastModifiedBy: releasedBy
  };
}

/**
 * Check if payment should auto-release
 */
export function shouldAutoRelease(payment: EscrowPayment): boolean {
  if (payment.status !== 'escrowed') {
    return false;
  }
  
  if (!payment.releaseScheduledAt) {
    return false;
  }
  
  const now = new Date();
  const scheduledRelease = new Date(payment.releaseScheduledAt);
  
  // Auto-release if scheduled time has passed and no dispute
  return now >= scheduledRelease && !payment.disputeInitiatedAt;
}

/**
 * Create payment notification
 */
export function createPaymentNotification(
  paymentId: string,
  type: PaymentNotificationType,
  recipientId: string,
  recipientType: 'physician' | 'facility' | 'admin',
  relatedAssignmentId: string,
  payment: EscrowPayment
): PaymentNotification {
  const notificationContent = getNotificationContent(type, payment);
  
  return {
    id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    paymentId,
    type,
    recipientId,
    recipientType,
    title: notificationContent.title,
    message: notificationContent.message,
    sentAt: new Date().toISOString(),
    deliveredVia: ['email', 'dashboard'],
    relatedAssignmentId,
    createdAt: new Date().toISOString()
  };
}

/**
 * Get notification content based on type
 */
function getNotificationContent(
  type: PaymentNotificationType,
  payment: EscrowPayment
): { title: string; message: string } {
  const formattedAmount = `$${payment.assignmentValue.toLocaleString()}`;
  
  switch (type) {
    case 'escrow_funded':
      return {
        title: 'Payment Secured in Escrow',
        message: `${formattedAmount} has been secured in escrow for your assignment with ${payment.metadata.facilityName}. Funds will be released 4 days after assignment completion.`
      };
    
    case 'assignment_start':
      return {
        title: 'Assignment Starting Today',
        message: `Your assignment at ${payment.metadata.facilityName} begins today. Payment of ${formattedAmount} is secured in escrow.`
      };
    
    case 'assignment_completion':
      return {
        title: 'Assignment Completed',
        message: `Your assignment at ${payment.metadata.facilityName} is complete. Payment will be released in 4 days unless a dispute is filed within 48 hours.`
      };
    
    case 'payment_release_pending':
      return {
        title: 'Payment Release in 48 Hours',
        message: `Your payment of ${formattedAmount} will be released in 48 hours. This is the final window to initiate a dispute if needed.`
      };
    
    case 'payment_released':
      return {
        title: 'Payment Released',
        message: `${formattedAmount} has been released from escrow. Funds should arrive in your account within 2-3 business days.`
      };
    
    case 'dispute_initiated':
      return {
        title: 'Payment Dispute Initiated',
        message: `A dispute has been filed for your assignment at ${payment.metadata.facilityName}. Payment of ${formattedAmount} is on hold pending resolution.`
      };
    
    case 'payment_held':
      return {
        title: 'Payment On Hold',
        message: `Payment of ${formattedAmount} is currently on hold due to an active dispute. Our team will review and resolve this matter.`
      };
    
    default:
      return {
        title: 'Payment Update',
        message: 'There has been an update to your payment status.'
      };
  }
}

/**
 * Create payment audit entry
 */
export function createPaymentAuditEntry(
  paymentId: string,
  action: string,
  performedBy: string,
  performedByRole: 'physician' | 'facility' | 'admin' | 'system',
  previousStatus?: PaymentStatus,
  newStatus?: PaymentStatus,
  amount?: number,
  reason?: string,
  metadata?: Record<string, any>
): PaymentAuditEntry {
  return {
    id: `AUDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    paymentId,
    action,
    performedBy,
    performedByRole,
    timestamp: new Date().toISOString(),
    previousStatus,
    newStatus,
    amount,
    reason,
    ipAddress: '0.0.0.0', // Backend will capture real IP
    userAgent: navigator.userAgent,
    metadata
  };
}

/**
 * Create vendor payment
 */
export function createVendorPayment(
  vendorId: string,
  vendorType: 'insurance' | 'travel' | 'lodging' | 'other',
  physicianId: string,
  serviceAmount: number,
  provider: PaymentProvider,
  assignmentId?: string
): VendorPayment {
  const platformFee = calculatePlatformFee(serviceAmount);
  const vendorPayout = serviceAmount - platformFee.amount;
  
  return {
    id: `VPAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    vendorId,
    vendorType,
    physicianId,
    assignmentId,
    serviceAmount,
    platformFee: {
      ...platformFee,
      appliedTo: 'vendor_service'
    },
    vendorPayout,
    provider,
    providerTransactionId: `${provider.toUpperCase()}-V-${Date.now()}`,
    status: 'pending_funding',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Format payment timeline for display
 */
export function formatPaymentTimeline(schedule: PaymentSchedule): string[] {
  return [
    `Funding Deadline: ${new Date(schedule.fundingDeadline).toLocaleDateString()}`,
    `Assignment Start: ${new Date(schedule.assignmentStartDate).toLocaleDateString()}`,
    `Assignment End: ${new Date(schedule.assignmentEndDate).toLocaleDateString()}`,
    `Dispute Window: ${new Date(schedule.disputeWindowStart).toLocaleDateString()} - ${new Date(schedule.disputeWindowEnd).toLocaleDateString()}`,
    `Scheduled Release: ${new Date(schedule.scheduledReleaseDate).toLocaleDateString()}`
  ];
}

/**
 * Get payment status badge color
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case 'pending_funding':
      return 'bg-amber-100 text-amber-800';
    case 'escrowed':
      return 'bg-blue-100 text-blue-800';
    case 'released':
      return 'bg-green-100 text-green-800';
    case 'held':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-purple-100 text-purple-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get payment status label
 */
export function getPaymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case 'pending_funding':
      return 'Pending Funding';
    case 'escrowed':
      return 'Secured in Escrow';
    case 'released':
      return 'Released';
    case 'held':
      return 'On Hold';
    case 'refunded':
      return 'Refunded';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}
