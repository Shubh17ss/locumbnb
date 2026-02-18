import { useState } from 'react';
import type { NotificationPreferences, ReminderType } from '../types/reminder';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPreferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => void;
}

export default function NotificationSettingsModal({
  isOpen,
  onClose,
  currentPreferences,
  onSave
}: NotificationSettingsModalProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(currentPreferences);

  if (!isOpen) return null;

  const reminderTypeLabels: Record<ReminderType, string> = {
    assignment_14_days: '14 Days Before Assignment',
    assignment_7_days: '7 Days Before Assignment',
    assignment_2_days: '2 Days Before Assignment',
    assignment_start: 'Assignment Start Day',
    assignment_completion: 'Assignment Completion',
    contract_signature_pending: 'Contract Signature Required',
    escrow_funding_required: 'Escrow Funding Required',
    payment_release_pending: 'Payment Release Pending',
    profile_incomplete: 'Profile Incomplete',
    document_expiring: 'Document Expiring Soon'
  };

  const handleChannelToggle = (channel: keyof Omit<NotificationPreferences, 'reminderTypes'>) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  const handleReminderTypeToggle = (type: ReminderType) => {
    setPreferences(prev => ({
      ...prev,
      reminderTypes: {
        ...prev.reminderTypes,
        [type]: !prev.reminderTypes[type]
      }
    }));
  };

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  const handleEnableAll = () => {
    const allEnabled: NotificationPreferences = {
      email: true,
      dashboard: true,
      sms: true,
      push: true,
      reminderTypes: Object.keys(reminderTypeLabels).reduce((acc, type) => ({
        ...acc,
        [type]: true
      }), {})
    };
    setPreferences(allEnabled);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Notification Settings</h3>
              <p className="text-gray-600 mt-1">Manage your reminder preferences and delivery channels</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="ri-close-line text-2xl text-gray-600"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Delivery Channels */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Delivery Channels</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-mail-line text-xl text-blue-600"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Email Notifications</div>
                    <div className="text-sm text-gray-600">Receive reminders via email</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.email}
                  onChange={() => handleChannelToggle('email')}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="ri-dashboard-line text-xl text-purple-600"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Dashboard Notifications</div>
                    <div className="text-sm text-gray-600">Show reminders in your dashboard</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.dashboard}
                  onChange={() => handleChannelToggle('dashboard')}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-message-3-line text-xl text-green-600"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">SMS Notifications</div>
                    <div className="text-sm text-gray-600">Receive text messages for urgent reminders</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.sms}
                  onChange={() => handleChannelToggle('sms')}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <i className="ri-notification-3-line text-xl text-amber-600"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Push Notifications</div>
                    <div className="text-sm text-gray-600">Browser and mobile push notifications</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.push}
                  onChange={() => handleChannelToggle('push')}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                />
              </label>
            </div>
          </div>

          {/* Reminder Types */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Reminder Types</h4>
              <button
                onClick={handleEnableAll}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Enable All
              </button>
            </div>
            <div className="space-y-2">
              {(Object.keys(reminderTypeLabels) as ReminderType[]).map((type) => (
                <label
                  key={type}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <span className="text-sm text-gray-900">{reminderTypeLabels[type]}</span>
                  <input
                    type="checkbox"
                    checked={preferences.reminderTypes[type] !== false}
                    onChange={() => handleReminderTypeToggle(type)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <i className="ri-alert-line text-xl text-amber-600 mt-0.5"></i>
              <div className="text-sm text-amber-900">
                <div className="font-semibold mb-1">Important Notice</div>
                <p>Some high-priority reminders (such as contract signatures and escrow funding) may still be sent via dashboard notifications even if other channels are disabled, to ensure critical actions are not missed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
