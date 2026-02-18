import type { AssignmentReminder, ReminderRecipient } from '../types/reminder';

// Production: Start with empty reminders - will be created automatically by the system
export const mockReminders: AssignmentReminder[] = [];

// Helper functions
export function getRemindersByStatus(status: AssignmentReminder['status']): AssignmentReminder[] {
  return mockReminders.filter(r => r.status === status);
}

export function getRemindersByType(type: AssignmentReminder['reminderType']): AssignmentReminder[] {
  return mockReminders.filter(r => r.reminderType === type);
}

export function getRemindersByAssignment(assignmentId: string): AssignmentReminder[] {
  return mockReminders.filter(r => r.assignmentId === assignmentId);
}

export function getReminderById(id: string): AssignmentReminder | undefined {
  return mockReminders.find(r => r.id === id);
}

export function getUpcomingReminders(): AssignmentReminder[] {
  const now = new Date();
  return mockReminders.filter(r => 
    r.status === 'scheduled' && new Date(r.scheduledFor) > now
  ).sort((a, b) => 
    new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
  );
}

export function getRecentReminders(hours: number = 24): AssignmentReminder[] {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  return mockReminders.filter(r => 
    r.sentAt && new Date(r.sentAt) > cutoff
  ).sort((a, b) => 
    new Date(b.sentAt!).getTime() - new Date(a.sentAt!).getTime()
  );
}
