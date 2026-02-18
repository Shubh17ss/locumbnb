// Cancellation & Penalty Management System

import type {
  CancellationPolicy,
  CancellationWindow,
  CancellationRequest,
  CancellationAuditEntry,
  PenaltyCharge
} from '../types/cancellation';

/**
 * Create a cancellation policy for a job posting
 */
export const createCancellationPolicy = (
  jobPostingId: string,
  windows: CancellationWindow[],
  gracePeriodHours: number,
  createdBy: string
): CancellationPolicy => {
  const policy: CancellationPolicy = {
    id: `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    jobPostingId,
    windows: windows.sort((a, b) => b.daysBeforeStart - a.daysBeforeStart), // Sort descending
    gracePeriodHours,
    applyToFacility: true, // Symmetry rule
    applyToPhysician: true,
    createdAt: new Date().toISOString(),
    createdBy,
    version: 1
  };

  console.log('✅ Cancellation policy created:', policy);
  return policy;
};

/**
 * Validate cancellation policy windows
 */
export const validateCancellationWindows = (windows: CancellationWindow[]): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (windows.length === 0) {
    errors.push('At least one cancellation window is required');
  }

  windows.forEach((window, index) => {
    if (window.daysBeforeStart < 0) {
      errors.push(`Window ${index + 1}: Days before start must be positive`);
    }
    if (window.penaltyPercentage < 0 || window.penaltyPercentage > 100) {
      errors.push(`Window ${index + 1}: Penalty percentage must be between 0 and 100`);
    }
  });

  // Check for overlapping windows
  const sortedWindows = [...windows].sort((a, b) => b.daysBeforeStart - a.daysBeforeStart);
  for (let i = 0; i < sortedWindows.length - 1; i++) {
    if (sortedWindows[i].daysBeforeStart === sortedWindows[i + 1].daysBeforeStart) {
      errors.push('Duplicate cancellation windows detected');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Calculate penalty for cancellation based on policy and timing
 */
export const calculateCancellationPenalty = (
  policy: CancellationPolicy,
  assignmentStartDate: string,
  cancellationDate: string,
  assignmentValue: number
): {
  applicableWindow: CancellationWindow | null;
  penaltyPercentage: number;
  penaltyAmount: number;
  daysBeforeStart: number;
} => {
  const startDate = new Date(assignmentStartDate);
  const cancelDate = new Date(cancellationDate);
  
  const daysBeforeStart = Math.ceil((startDate.getTime() - cancelDate.getTime()) / (1000 * 60 * 60 * 24));

  // Find applicable window
  let applicableWindow: CancellationWindow | null = null;
  
  for (const window of policy.windows) {
    if (daysBeforeStart >= window.daysBeforeStart) {
      applicableWindow = window;
      break;
    }
  }

  // If no window matches, use the most restrictive (last window)
  if (!applicableWindow && policy.windows.length > 0) {
    applicableWindow = policy.windows[policy.windows.length - 1];
  }

  const penaltyPercentage = applicableWindow?.penaltyPercentage || 0;
  const penaltyAmount = Math.round((assignmentValue * penaltyPercentage) / 100);

  console.log('💰 Penalty calculated:', {
    daysBeforeStart,
    applicableWindow: applicableWindow?.description,
    penaltyPercentage,
    penaltyAmount
  });

  return {
    applicableWindow,
    penaltyPercentage,
    penaltyAmount,
    daysBeforeStart
  };
};

/**
 * Create a cancellation request
 */
export const createCancellationRequest = (
  assignmentId: string,
  contractId: string,
  initiatedBy: 'physician' | 'facility',
  initiatorId: string,
  reason: string,
  assignmentStartDate: string,
  assignmentValue: number,
  policy: CancellationPolicy
): CancellationRequest => {
  const now = new Date().toISOString();
  
  const penaltyCalc = calculateCancellationPenalty(
    policy,
    assignmentStartDate,
    now,
    assignmentValue
  );

  const gracePeriodEndsAt = new Date(Date.now() + policy.gracePeriodHours * 60 * 60 * 1000).toISOString();

  const auditEntry: CancellationAuditEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: now,
    action: 'requested',
    performedBy: initiatorId,
    performedByRole: initiatedBy,
    details: `Cancellation requested by ${initiatedBy}`,
    metadata: {
      ipAddress: 'Captured by backend',
      deviceInfo: navigator.userAgent,
      penaltyAmount: penaltyCalc.penaltyAmount
    }
  };

  const request: CancellationRequest = {
    id: `cancel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    assignmentId,
    contractId,
    initiatedBy,
    initiatorId,
    reason,
    requestedAt: now,
    assignmentStartDate,
    daysBeforeStart: penaltyCalc.daysBeforeStart,
    applicableWindow: penaltyCalc.applicableWindow,
    penaltyAmount: penaltyCalc.penaltyAmount,
    penaltyPercentage: penaltyCalc.penaltyPercentage,
    assignmentValue,
    status: policy.gracePeriodHours > 0 ? 'grace_period' : 'pending',
    gracePeriodEndsAt: policy.gracePeriodHours > 0 ? gracePeriodEndsAt : null,
    processedAt: null,
    processedBy: null,
    notes: '',
    auditLog: [auditEntry]
  };

  console.log('🚫 Cancellation request created:', request);

  // Start grace period if applicable
  if (policy.gracePeriodHours > 0) {
    addAuditEntry(request, {
      action: 'grace_period_started',
      performedBy: 'system',
      performedByRole: 'system',
      details: `Grace period started: ${policy.gracePeriodHours} hours`,
      metadata: {}
    });
  }

  return request;
};

/**
 * Add audit entry to cancellation request
 */
export const addAuditEntry = (
  request: CancellationRequest,
  entry: Omit<CancellationAuditEntry, 'id' | 'timestamp'>
): void => {
  const auditEntry: CancellationAuditEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    ...entry
  };

  request.auditLog.push(auditEntry);
  console.log('📝 Audit entry added:', auditEntry);
};

/**
 * Process cancellation request (approve/reject)
 */
export const processCancellationRequest = (
  request: CancellationRequest,
  action: 'approve' | 'reject',
  processedBy: string,
  processedByRole: 'admin' | 'system',
  notes: string = ''
): CancellationRequest => {
  const now = new Date().toISOString();

  request.status = action === 'approve' ? 'approved' : 'rejected';
  request.processedAt = now;
  request.processedBy = processedBy;
  request.notes = notes;

  addAuditEntry(request, {
    action: action === 'approve' ? 'approved' : 'rejected',
    performedBy: processedBy,
    performedByRole: processedByRole,
    details: `Cancellation ${action}d: ${notes}`,
    metadata: {
      previousStatus: 'pending',
      newStatus: request.status
    }
  });

  console.log(`✅ Cancellation ${action}d:`, request.id);

  return request;
};

/**
 * Charge penalty for approved cancellation
 */
export const chargeCancellationPenalty = (
  request: CancellationRequest,
  paymentMethod: string = 'escrow_deduction'
): PenaltyCharge => {
  const now = new Date().toISOString();

  const charge: PenaltyCharge = {
    id: `penalty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    cancellationRequestId: request.id,
    assignmentId: request.assignmentId,
    chargedTo: request.initiatedBy,
    chargedToId: request.initiatorId,
    amount: request.penaltyAmount,
    percentage: request.penaltyPercentage,
    assignmentValue: request.assignmentValue,
    status: 'charged',
    chargedAt: now,
    paymentMethod,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    refundedAt: null,
    refundReason: null,
    waivedBy: null,
    waivedReason: null
  };

  addAuditEntry(request, {
    action: 'penalty_charged',
    performedBy: 'system',
    performedByRole: 'system',
    details: `Penalty charged: $${charge.amount} (${charge.percentage}%)`,
    metadata: {
      penaltyAmount: charge.amount
    }
  });

  console.log('💳 Penalty charged:', charge);

  // TODO: Integrate with payment system (Stripe/PayPal)
  console.log('🔗 Payment integration: Deduct from escrow or charge payment method');

  return charge;
};

/**
 * Waive penalty (admin override)
 */
export const waivePenalty = (
  charge: PenaltyCharge,
  waivedBy: string,
  reason: string
): PenaltyCharge => {
  charge.status = 'waived';
  charge.waivedBy = waivedBy;
  charge.waivedReason = reason;

  console.log('🎁 Penalty waived:', {
    chargeId: charge.id,
    amount: charge.amount,
    reason
  });

  return charge;
};

/**
 * Check if grace period has expired
 */
export const checkGracePeriodExpiration = (request: CancellationRequest): boolean => {
  if (request.status !== 'grace_period' || !request.gracePeriodEndsAt) {
    return false;
  }

  const now = new Date();
  const gracePeriodEnd = new Date(request.gracePeriodEndsAt);

  if (now >= gracePeriodEnd) {
    request.status = 'pending';
    
    addAuditEntry(request, {
      action: 'grace_period_ended',
      performedBy: 'system',
      performedByRole: 'system',
      details: 'Grace period expired, cancellation now pending approval',
      metadata: {
        previousStatus: 'grace_period',
        newStatus: 'pending'
      }
    });

    console.log('⏰ Grace period expired for cancellation:', request.id);
    return true;
  }

  return false;
};

/**
 * Get default cancellation policy template
 */
export const getDefaultCancellationPolicy = (): CancellationWindow[] => {
  return [
    {
      id: 'window_1',
      daysBeforeStart: 30,
      penaltyPercentage: 0,
      description: '30+ days before: No penalty'
    },
    {
      id: 'window_2',
      daysBeforeStart: 14,
      penaltyPercentage: 25,
      description: '14-29 days before: 25% penalty'
    },
    {
      id: 'window_3',
      daysBeforeStart: 7,
      penaltyPercentage: 50,
      description: '7-13 days before: 50% penalty'
    },
    {
      id: 'window_4',
      daysBeforeStart: 0,
      penaltyPercentage: 100,
      description: 'Less than 7 days: 100% penalty'
    }
  ];
};

/**
 * Format cancellation policy for display
 */
export const formatCancellationPolicy = (policy: CancellationPolicy): string => {
  const lines = policy.windows.map(window => 
    `• ${window.description}: ${window.penaltyPercentage}% penalty`
  );
  
  if (policy.gracePeriodHours > 0) {
    lines.push(`\n• Grace period: ${policy.gracePeriodHours} hours to withdraw cancellation`);
  }
  
  lines.push('\n• This policy applies equally to both physicians and facilities (symmetry rule)');
  
  return lines.join('\n');
};
