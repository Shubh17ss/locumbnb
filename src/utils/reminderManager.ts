import type {
  AssignmentReminder,
  ReminderType,
  ReminderStatus,
  ReminderLog,
  ReminderTemplate,
  ReminderSchedule,
  ReminderAcknowledgment,
  DeliveryChannel,
  ReminderRecipient
} from '../types/reminder';

// Reminder Templates
export const reminderTemplates: Record<ReminderType, ReminderTemplate> = {
  assignment_14_days: {
    type: 'assignment_14_days',
    subject: 'Upcoming Assignment in 14 Days',
    emailBody: 'Your assignment at {facilityName} starts in 14 days on {startDate}. Please ensure all preparations are complete.',
    dashboardMessage: 'Assignment at {facilityName} starts in 14 days',
    smsBody: 'Reminder: Assignment at {facilityName} starts {startDate} (14 days)',
    priority: 'low',
    requiresAcknowledgment: false
  },
  assignment_7_days: {
    type: 'assignment_7_days',
    subject: 'Upcoming Assignment in 7 Days',
    emailBody: 'Your assignment at {facilityName} starts in 7 days on {startDate}. Please confirm your travel arrangements and review assignment details.',
    dashboardMessage: 'Assignment at {facilityName} starts in 7 days',
    smsBody: 'Reminder: Assignment at {facilityName} starts {startDate} (7 days)',
    priority: 'medium',
    requiresAcknowledgment: true
  },
  assignment_2_days: {
    type: 'assignment_2_days',
    subject: 'Assignment Starting in 2 Days - Action Required',
    emailBody: 'Your assignment at {facilityName} starts in 2 days on {startDate}. Please acknowledge receipt and confirm your attendance.',
    dashboardMessage: 'URGENT: Assignment at {facilityName} starts in 2 days',
    smsBody: 'URGENT: Assignment at {facilityName} starts {startDate} (2 days) - Please confirm',
    priority: 'high',
    requiresAcknowledgment: true
  },
  assignment_start: {
    type: 'assignment_start',
    subject: 'Assignment Starts Today',
    emailBody: 'Your assignment at {facilityName} starts today. Good luck!',
    dashboardMessage: 'Your assignment at {facilityName} starts today',
    smsBody: 'Your assignment at {facilityName} starts today',
    priority: 'high',
    requiresAcknowledgment: false
  },
  assignment_completion: {
    type: 'assignment_completion',
    subject: 'Assignment Completed',
    emailBody: 'Your assignment at {facilityName} has been completed. Payment will be released in 4 days unless a dispute is filed.',
    dashboardMessage: 'Assignment at {facilityName} completed',
    smsBody: 'Assignment at {facilityName} completed. Payment releasing in 4 days.',
    priority: 'medium',
    requiresAcknowledgment: false
  },
  contract_signature_pending: {
    type: 'contract_signature_pending',
    subject: 'Contract Signature Required',
    emailBody: 'Your contract for the assignment at {facilityName} requires your digital signature.',
    dashboardMessage: 'Contract signature required for {facilityName}',
    smsBody: 'Contract signature required for {facilityName} assignment',
    priority: 'high',
    requiresAcknowledgment: true
  },
  escrow_funding_required: {
    type: 'escrow_funding_required',
    subject: 'Escrow Funding Required',
    emailBody: 'Please fund the escrow for the upcoming assignment with {physicianName}.',
    dashboardMessage: 'Escrow funding required for assignment with {physicianName}',
    smsBody: 'Escrow funding required for assignment with {physicianName}',
    priority: 'high',
    requiresAcknowledgment: true
  },
  payment_release_pending: {
    type: 'payment_release_pending',
    subject: 'Payment Release in 48 Hours',
    emailBody: 'Payment for the assignment will be released in 48 hours. This is your final window to file a dispute if needed.',
    dashboardMessage: 'Payment releasing in 48 hours - Final dispute window',
    smsBody: 'Payment releasing in 48hrs. Final dispute window.',
    priority: 'medium',
    requiresAcknowledgment: false
  },
  profile_incomplete: {
    type: 'profile_incomplete',
    subject: 'Complete Your Profile',
    emailBody: 'Your profile is incomplete. Please complete all required sections to apply for assignments.',
    dashboardMessage: 'Your profile is incomplete',
    smsBody: 'Complete your profile to apply for assignments',
    priority: 'medium',
    requiresAcknowledgment: false
  },
  document_expiring: {
    type: 'document_expiring',
    subject: 'Document Expiring Soon',
    emailBody: 'One or more of your documents will expire soon. Please upload updated versions.',
    dashboardMessage: 'Document expiring soon - Update required',
    smsBody: 'Document expiring soon. Please update.',
    priority: 'high',
    requiresAcknowledgment: true
  }
};

// Calculate reminder schedule for an assignment
export function calculateReminderSchedule(
  assignmentId: string,
  startDate: string
): ReminderSchedule {
  const start = new Date(startDate);
  const now = new Date();

  const reminders: ReminderSchedule['reminders'] = [];

  // 14 days before
  const fourteenDaysBefore = new Date(start);
  fourteenDaysBefore.setDate(start.getDate() - 14);
  if (fourteenDaysBefore > now) {
    reminders.push({
      type: 'assignment_14_days',
      scheduledFor: fourteenDaysBefore.toISOString(),
      daysBeforeStart: 14
    });
  }

  // 7 days before
  const sevenDaysBefore = new Date(start);
  sevenDaysBefore.setDate(start.getDate() - 7);
  if (sevenDaysBefore > now) {
    reminders.push({
      type: 'assignment_7_days',
      scheduledFor: sevenDaysBefore.toISOString(),
      daysBeforeStart: 7
    });
  }

  // 2 days before
  const twoDaysBefore = new Date(start);
  twoDaysBefore.setDate(start.getDate() - 2);
  if (twoDaysBefore > now) {
    reminders.push({
      type: 'assignment_2_days',
      scheduledFor: twoDaysBefore.toISOString(),
      daysBeforeStart: 2
    });
  }

  // Assignment start day
  if (start > now) {
    reminders.push({
      type: 'assignment_start',
      scheduledFor: start.toISOString(),
      daysBeforeStart: 0
    });
  }

  return {
    assignmentId,
    startDate,
    reminders
  };
}

// Create a reminder
export function createReminder(
  assignmentId: string,
  assignmentTitle: string,
  facilityName: string,
  physicianName: string,
  specialty: string,
  startDate: string,
  endDate: string,
  reminderType: ReminderType,
  scheduledFor: string,
  recipients: ReminderRecipient[]
): AssignmentReminder {
  const template = reminderTemplates[reminderType];
  const daysUntilAssignment = Math.ceil(
    (new Date(startDate).getTime() - new Date(scheduledFor).getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    id: `REM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    assignmentId,
    assignmentTitle,
    facilityName,
    physicianName,
    specialty,
    startDate,
    endDate,
    reminderType,
    scheduledFor,
    status: 'scheduled',
    recipients,
    deliveryChannels: determineDeliveryChannels(recipients, reminderType),
    retryCount: 0,
    metadata: {
      daysUntilAssignment,
      urgency: template.priority
    }
  };
}

// Determine delivery channels based on recipient preferences
function determineDeliveryChannels(
  recipients: ReminderRecipient[],
  reminderType: ReminderType
): DeliveryChannel[] {
  const channels = new Set<DeliveryChannel>();

  recipients.forEach(recipient => {
    const prefs = recipient.preferences;
    const typeEnabled = prefs.reminderTypes[reminderType] !== false;

    if (typeEnabled) {
      if (prefs.email) channels.add('email');
      if (prefs.dashboard) channels.add('dashboard');
      if (prefs.sms && recipient.phone) channels.add('sms');
      if (prefs.push) channels.add('push');
    }
  });

  // Always include dashboard as fallback
  channels.add('dashboard');

  return Array.from(channels);
}

// Send reminder (simulated - would integrate with actual email/SMS services)
export async function sendReminder(reminder: AssignmentReminder): Promise<boolean> {
  try {
    const template = reminderTemplates[reminder.reminderType];

    // Replace placeholders in template
    const replacements = {
      '{facilityName}': reminder.facilityName,
      '{physicianName}': reminder.physicianName,
      '{startDate}': new Date(reminder.startDate).toLocaleDateString(),
      '{endDate}': new Date(reminder.endDate).toLocaleDateString(),
      '{specialty}': reminder.specialty
    };

    const subject = replaceTemplateVars(template.subject, replacements);
    const emailBody = replaceTemplateVars(template.emailBody, replacements);
    const dashboardMessage = replaceTemplateVars(template.dashboardMessage, replacements);
    const smsBody = replaceTemplateVars(template.smsBody, replacements);

    // Send via each channel
    for (const channel of reminder.deliveryChannels) {
      for (const recipient of reminder.recipients) {
        await sendViaChannel(channel, recipient, {
          subject,
          emailBody,
          dashboardMessage,
          smsBody
        });
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to send reminder:', error);
    return false;
  }
}

// Replace template variables
function replaceTemplateVars(template: string, replacements: Record<string, string>): string {
  let result = template;
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, 'g'), value);
  });
  return result;
}

// Send via specific channel (simulated)
async function sendViaChannel(
  channel: DeliveryChannel,
  recipient: ReminderRecipient,
  content: {
    subject: string;
    emailBody: string;
    dashboardMessage: string;
    smsBody: string;
  }
): Promise<void> {
  // Simulate API calls to email/SMS services
  console.log(`Sending ${channel} to ${recipient.userName}:`, content);
  
  // In production, integrate with:
  // - Email: SendGrid, AWS SES, etc.
  // - SMS: Twilio, AWS SNS, etc.
  // - Push: Firebase Cloud Messaging, OneSignal, etc.
  
  return Promise.resolve();
}

// Create reminder log entry
export function createReminderLog(
  reminderId: string,
  action: ReminderLog['action'],
  channel: DeliveryChannel,
  recipientId: string,
  recipientType: 'physician' | 'facility',
  success: boolean,
  errorMessage?: string
): ReminderLog {
  return {
    id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    reminderId,
    timestamp: new Date().toISOString(),
    action,
    channel,
    recipientId,
    recipientType,
    success,
    errorMessage,
    metadata: {
      ipAddress: '0.0.0.0', // Would be captured from request
      userAgent: navigator.userAgent,
      deviceType: /Mobile/.test(navigator.userAgent) ? 'mobile' : 'desktop'
    }
  };
}

// Acknowledge reminder
export function acknowledgeReminder(
  reminderId: string,
  userId: string,
  userName: string,
  notes?: string
): ReminderAcknowledgment {
  return {
    reminderId,
    userId,
    userName,
    acknowledgedAt: new Date().toISOString(),
    ipAddress: '0.0.0.0', // Would be captured from request
    userAgent: navigator.userAgent,
    notes
  };
}

// Check if reminder should be sent
export function shouldSendReminder(reminder: AssignmentReminder): boolean {
  const now = new Date();
  const scheduledFor = new Date(reminder.scheduledFor);

  return (
    reminder.status === 'scheduled' &&
    scheduledFor <= now &&
    reminder.retryCount < 3
  );
}

// Retry failed reminder
export function retryReminder(reminder: AssignmentReminder): AssignmentReminder {
  return {
    ...reminder,
    status: 'scheduled',
    retryCount: reminder.retryCount + 1,
    scheduledFor: new Date(Date.now() + 5 * 60 * 1000).toISOString() // Retry in 5 minutes
  };
}

// Get reminders due for sending
export function getDueReminders(reminders: AssignmentReminder[]): AssignmentReminder[] {
  return reminders.filter(shouldSendReminder);
}

// Update reminder status
export function updateReminderStatus(
  reminder: AssignmentReminder,
  status: ReminderStatus,
  sentAt?: string,
  deliveredAt?: string,
  failureReason?: string
): AssignmentReminder {
  return {
    ...reminder,
    status,
    sentAt,
    deliveredAt,
    failureReason
  };
}
