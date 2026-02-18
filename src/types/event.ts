// Event System Types for Platform-Wide Event-Driven Architecture

export type EventType =
  // Application Events
  | 'application.submitted'
  | 'application.approved'
  | 'application.rejected'
  | 'application.expired'
  | 'application.withdrawn'
  // Contract Events
  | 'contract.sent'
  | 'contract.physician_signed'
  | 'contract.facility_signed'
  | 'contract.executed'
  // Assignment Events
  | 'assignment.scheduled'
  | 'assignment.reminder_14d'
  | 'assignment.reminder_7d'
  | 'assignment.reminder_2d'
  | 'assignment.started'
  | 'assignment.completed'
  | 'assignment.cancelled'
  // Payment Events
  | 'payment.escrow_funded'
  | 'payment.escrow_released'
  | 'payment.escrow_held'
  | 'payment.fee_collected'
  | 'payment.refund_issued'
  // Dispute Events
  | 'dispute.initiated'
  | 'dispute.fee_charged'
  | 'dispute.escalated'
  | 'dispute.resolved'
  | 'dispute.dismissed'
  // Review Events
  | 'review.requested'
  | 'review.submitted'
  | 'review.published'
  // Cancellation Events
  | 'cancellation.requested'
  | 'cancellation.approved'
  | 'cancellation.penalty_applied'
  // Violation Events
  | 'violation.detected'
  | 'violation.reported'
  | 'violation.confirmed'
  | 'violation.penalty_issued'
  // Vendor Events
  | 'vendor.quote_requested'
  | 'vendor.quote_submitted'
  | 'vendor.service_purchased'
  | 'vendor.service_completed'
  // Calendar Events
  | 'calendar.dates_blocked'
  | 'calendar.dates_unblocked'
  | 'calendar.conflict_detected'
  // Notification Events
  | 'notification.email_sent'
  | 'notification.dashboard_created'
  | 'notification.sms_sent';

export interface PlatformEvent {
  id: string;
  type: EventType;
  timestamp: string;
  source: 'system' | 'user' | 'admin' | 'vendor';
  userId?: string;
  userType?: 'physician' | 'facility' | 'vendor' | 'admin';
  data: Record<string, any>;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
  };
  processed: boolean;
  processedAt?: string;
  error?: string;
}

export interface EventHandler {
  eventType: EventType;
  handler: (event: PlatformEvent) => Promise<void>;
  priority: number; // Lower number = higher priority
}

export interface EventSubscription {
  id: string;
  eventTypes: EventType[];
  callback: (event: PlatformEvent) => void;
  active: boolean;
}

export interface WorkflowState {
  assignmentId: string;
  currentStage: WorkflowStage;
  stages: WorkflowStageStatus[];
  startedAt: string;
  completedAt?: string;
  blockedBy?: string;
  errors: WorkflowError[];
}

export type WorkflowStage =
  | 'application_submitted'
  | 'facility_review'
  | 'contract_sent'
  | 'physician_signature'
  | 'facility_signature'
  | 'escrow_funding'
  | 'assignment_scheduled'
  | 'assignment_active'
  | 'assignment_completed'
  | 'payment_release'
  | 'review_period'
  | 'workflow_complete';

export interface WorkflowStageStatus {
  stage: WorkflowStage;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  error?: string;
  data?: Record<string, any>;
}

export interface WorkflowError {
  stage: WorkflowStage;
  error: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface SystemHealthMetrics {
  timestamp: string;
  activeAssignments: number;
  pendingApplications: number;
  escrowedFunds: number;
  activeDisputes: number;
  eventQueueSize: number;
  averageProcessingTime: number;
  errorRate: number;
  systemStatus: 'healthy' | 'degraded' | 'critical';
  components: ComponentHealth[];
}

export interface ComponentHealth {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  lastCheck: string;
  responseTime?: number;
  errorCount: number;
}

export interface IntegrationTest {
  id: string;
  name: string;
  description: string;
  workflow: WorkflowStage[];
  status: 'pending' | 'running' | 'passed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  results?: TestResult[];
}

export interface TestResult {
  stage: WorkflowStage;
  passed: boolean;
  duration: number;
  error?: string;
  data?: Record<string, any>;
}
