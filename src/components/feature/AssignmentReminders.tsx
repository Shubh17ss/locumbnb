import { useState } from 'react';
import type { AssignmentReminder, ReminderStatus, ReminderType } from '../types/reminder';
import { mockReminders, getRemindersByStatus, getRemindersByType } from '../mocks/reminders';
import { reminderTemplates } from '../utils/reminderManager';

export default function AssignmentReminders() {
  const [reminders] = useState<AssignmentReminder[]>(mockReminders);
  const [selectedStatus, setSelectedStatus] = useState<ReminderStatus | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ReminderType | 'all'>('all');
  const [expandedReminder, setExpandedReminder] = useState<string | null>(null);

  // Filter reminders
  const filteredReminders = reminders.filter(reminder => {
    const statusMatch = selectedStatus === 'all' || reminder.status === selectedStatus;
    const typeMatch = selectedType === 'all' || reminder.reminderType === selectedType;
    return statusMatch && typeMatch;
  });

  // Statistics
  const stats = {
    total: reminders.length,
    scheduled: getRemindersByStatus('scheduled').length,
    sent: getRemindersByStatus('sent').length,
    delivered: getRemindersByStatus('delivered').length,
    failed: getRemindersByStatus('failed').length,
    acknowledged: reminders.filter(r => r.acknowledgedAt).length
  };

  const getStatusColor = (status: ReminderStatus) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'acknowledged': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return 'ri-mail-line';
      case 'dashboard': return 'ri-dashboard-line';
      case 'sms': return 'ri-message-3-line';
      case 'push': return 'ri-notification-3-line';
      default: return 'ri-question-line';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleAcknowledge = (reminderId: string) => {
    console.log('Acknowledging reminder:', reminderId);
    // In production: call API to acknowledge reminder
  };

  const handleResend = (reminderId: string) => {
    console.log('Resending reminder:', reminderId);
    // In production: call API to resend reminder
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assignment Reminders</h2>
          <p className="text-gray-600 mt-1">Automated reminder system with multi-channel delivery</p>
        </div>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 whitespace-nowrap">
          <i className="ri-settings-3-line"></i>
          Notification Settings
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
          <div className="text-sm text-blue-700 mt-1">Total Reminders</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="text-2xl font-bold text-purple-900">{stats.scheduled}</div>
          <div className="text-sm text-purple-700 mt-1">Scheduled</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
          <div className="text-2xl font-bold text-indigo-900">{stats.sent}</div>
          <div className="text-sm text-indigo-700 mt-1">Sent</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-900">{stats.delivered}</div>
          <div className="text-sm text-green-700 mt-1">Delivered</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="text-2xl font-bold text-red-900">{stats.failed}</div>
          <div className="text-sm text-red-700 mt-1">Failed</div>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
          <div className="text-2xl font-bold text-teal-900">{stats.acknowledged}</div>
          <div className="text-sm text-teal-700 mt-1">Acknowledged</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ReminderStatus | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="acknowledged">Acknowledged</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ReminderType | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="assignment_14_days">14 Days Before</option>
              <option value="assignment_7_days">7 Days Before</option>
              <option value="assignment_2_days">2 Days Before</option>
              <option value="assignment_start">Assignment Start</option>
              <option value="assignment_completion">Assignment Completion</option>
              <option value="contract_signature_pending">Contract Signature</option>
              <option value="escrow_funding_required">Escrow Funding</option>
              <option value="payment_release_pending">Payment Release</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {filteredReminders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <i className="ri-notification-off-line text-5xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No reminders found matching your filters</p>
          </div>
        ) : (
          filteredReminders.map((reminder) => {
            const template = reminderTemplates[reminder.reminderType];
            const isExpanded = expandedReminder === reminder.id;

            return (
              <div key={reminder.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Reminder Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder.status)}`}>
                          {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                        </span>
                        <span className={`text-sm font-medium ${getUrgencyColor(reminder.metadata.urgency)}`}>
                          <i className="ri-alert-line mr-1"></i>
                          {reminder.metadata.urgency.toUpperCase()} Priority
                        </span>
                        {reminder.acknowledgedAt && (
                          <span className="text-xs text-teal-600 flex items-center gap-1">
                            <i className="ri-checkbox-circle-fill"></i>
                            Acknowledged
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{reminder.assignmentTitle}</h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <i className="ri-hospital-line"></i>
                          {reminder.facilityName}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-user-heart-line"></i>
                          {reminder.physicianName}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-stethoscope-line"></i>
                          {reminder.specialty}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-gray-700">
                          <i className="ri-calendar-line mr-1"></i>
                          {new Date(reminder.startDate).toLocaleDateString()} - {new Date(reminder.endDate).toLocaleDateString()}
                        </span>
                        <span className="text-gray-700">
                          <i className="ri-time-line mr-1"></i>
                          {reminder.metadata.daysUntilAssignment >= 0 
                            ? `${reminder.metadata.daysUntilAssignment} days until start`
                            : 'Assignment completed'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedReminder(isExpanded ? null : reminder.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line text-xl text-gray-600`}></i>
                    </button>
                  </div>

                  {/* Delivery Channels */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Delivery:</span>
                    {reminder.deliveryChannels.map((channel) => (
                      <span key={channel} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                        <i className={getChannelIcon(channel)}></i>
                        {channel.charAt(0).toUpperCase() + channel.slice(1)}
                      </span>
                    ))}
                  </div>

                  {/* Timeline */}
                  {(reminder.sentAt || reminder.deliveredAt || reminder.acknowledgedAt) && (
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 text-sm">
                      {reminder.sentAt && (
                        <span className="text-gray-600">
                          <i className="ri-send-plane-line mr-1"></i>
                          Sent {formatTimeAgo(reminder.sentAt)}
                        </span>
                      )}
                      {reminder.deliveredAt && (
                        <span className="text-green-600">
                          <i className="ri-check-double-line mr-1"></i>
                          Delivered {formatTimeAgo(reminder.deliveredAt)}
                        </span>
                      )}
                      {reminder.acknowledgedAt && (
                        <span className="text-teal-600">
                          <i className="ri-checkbox-circle-line mr-1"></i>
                          Acknowledged {formatTimeAgo(reminder.acknowledgedAt)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Failure Info */}
                  {reminder.status === 'failed' && reminder.failureReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <i className="ri-error-warning-line text-red-600 mt-0.5"></i>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-red-900">Delivery Failed</div>
                          <div className="text-sm text-red-700 mt-1">{reminder.failureReason}</div>
                          <div className="text-xs text-red-600 mt-1">Retry count: {reminder.retryCount}/3</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                    {/* Recipients */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Recipients ({reminder.recipients.length})</h4>
                      <div className="space-y-2">
                        {reminder.recipients.map((recipient) => (
                          <div key={recipient.userId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                            <div>
                              <div className="font-medium text-gray-900">{recipient.userName}</div>
                              <div className="text-sm text-gray-600">{recipient.email}</div>
                              {recipient.phone && (
                                <div className="text-sm text-gray-600">{recipient.phone}</div>
                              )}
                            </div>
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                              {recipient.userType}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Message Preview */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Message Content</h4>
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="text-sm font-medium text-gray-900 mb-2">{template.subject}</div>
                        <div className="text-sm text-gray-700">{template.dashboardMessage}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                      {template.requiresAcknowledgment && !reminder.acknowledgedAt && reminder.status === 'delivered' && (
                        <button
                          onClick={() => handleAcknowledge(reminder.id)}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          <i className="ri-checkbox-circle-line"></i>
                          Acknowledge
                        </button>
                      )}
                      {reminder.status === 'failed' && reminder.retryCount < 3 && (
                        <button
                          onClick={() => handleResend(reminder.id)}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          <i className="ri-refresh-line"></i>
                          Retry Send
                        </button>
                      )}
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap">
                        <i className="ri-file-list-3-line"></i>
                        View Logs
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <i className="ri-information-line text-2xl text-blue-600 mt-0.5"></i>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Automated Reminder System</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Reminders sent automatically at 14, 7, and 2 days before assignment start</li>
              <li>• Multi-channel delivery: Email, Dashboard, SMS, and Push notifications</li>
              <li>• All reminders logged for compliance and audit purposes</li>
              <li>• High-priority reminders require acknowledgment</li>
              <li>• Failed deliveries automatically retry up to 3 times</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
