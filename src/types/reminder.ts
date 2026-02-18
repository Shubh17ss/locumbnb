export type ReminderType = 
  | 'assignment_14_days'
  | 'assignment_7_days'
  | 'assignment_2_days'
  | 'assignment_start'
  | 'assignment_completion'
  | 'contract_signature_pending'
  | 'escrow_funding_required'
  | 'payment_release_pending'
  | 'profile_incomplete'
  | 'document_expiring';

export type ReminderStatus = 'scheduled' | 'sent' | 'delivered' | 'failed' | 'acknowledged';

export type DeliveryChannel = 'email' | 'dashboard' | 'sms' | 'push';

export interface ReminderRecipient {
  userId: string;
  userName: string;
  userType: 'physician' | 'facility' | 'vendor' | 'admin';
  email: string;
  phone?: string;
  preferences: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  dashboard: boolean;
  sms: boolean;
  push: boolean;
  reminderTypes: {
    [key in ReminderType]?: boolean;
  };
}

export interface AssignmentReminder {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  facilityName: string;
  physicianName: string;
  specialty: string;
  startDate: string;
  endDate: string;
  reminderType: ReminderType;
  scheduledFor: string;
  status: ReminderStatus;
  recipients: ReminderRecipient[];
  deliveryChannels: DeliveryChannel[];
  sentAt?: string;
  deliveredAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string[];
  failureReason?: string;
  retryCount: number;
  metadata: {
    daysUntilAssignment: number;
    assignmentValue?: number;
    location?: string;
    urgency: 'low' | 'medium' | 'high';
  };
}

export interface ReminderLog {
  id: string;
  reminderId: string;
  timestamp: string;
  action: 'scheduled' | 'sent' | 'delivered' | 'failed' | 'acknowledged' | 'retry';
  channel: DeliveryChannel;
  recipientId: string;
  recipientType: 'physician' | 'facility';
  success: boolean;
  errorMessage?: string;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    deviceType?: string;
  };
}

export interface ReminderTemplate {
  type: ReminderType;
  subject: string;
  emailBody: string;
  dashboardMessage: string;
  smsBody: string;
  priority: 'low' | 'medium' | 'high';
  requiresAcknowledgment: boolean;
}

export interface ReminderSchedule {
  assignmentId: string;
  startDate: string;
  reminders: {
    type: ReminderType;
    scheduledFor: string;
    daysBeforeStart: number;
  }[];
}

export interface ReminderAcknowledgment {
  reminderId: string;
  userId: string;
  userName: string;
  acknowledgedAt: string;
  ipAddress: string;
  userAgent: string;
  notes?: string;
}

export interface ReminderStatistics {
  totalScheduled: number;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalAcknowledged: number;
  deliveryRate: number;
  acknowledgmentRate: number;
  averageDeliveryTime: number;
  byType: {
    [key in ReminderType]?: {
      sent: number;
      delivered: number;
      acknowledged: number;
    };
  };
  byChannel: {
    [key in DeliveryChannel]?: {
      sent: number;
      delivered: number;
      failed: number;
    };
  };
}
