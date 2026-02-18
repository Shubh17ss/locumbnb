import React, { useState, useEffect } from 'react';
import { EscrowPayment, PaymentNotification, PaymentNotificationType } from '../../../types/payment';
import { createPaymentNotification } from '../../../utils/paymentManager';

interface PaymentNotificationsProps {
  userId: string;
  userRole: 'physician' | 'facility' | 'admin';
  payments: EscrowPayment[];
}

const PaymentNotifications: React.FC<PaymentNotificationsProps> = ({
  userId,
  userRole,
  payments
}) => {
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Generate notifications based on payment states
    const generatedNotifications: PaymentNotification[] = [];

    payments.forEach(payment => {
      // Escrow funded notification
      if (payment.fundedAt && payment.status === 'escrowed') {
        const notif = createPaymentNotification(
          payment.id,
          'escrow_funded',
          userId,
          userRole,
          payment.assignmentId,
          payment
        );
        generatedNotifications.push(notif);
      }

      // Assignment start notification
      const startDate = new Date(payment.metadata.assignmentStartDate);
      const today = new Date();
      if (startDate.toDateString() === today.toDateString() && payment.status === 'escrowed') {
        const notif = createPaymentNotification(
          payment.id,
          'assignment_start',
          userId,
          userRole,
          payment.assignmentId,
          payment
        );
        generatedNotifications.push(notif);
      }

      // Assignment completion notification
      const endDate = new Date(payment.metadata.assignmentEndDate);
      if (endDate < today && payment.status === 'escrowed') {
        const notif = createPaymentNotification(
          payment.id,
          'assignment_completion',
          userId,
          userRole,
          payment.assignmentId,
          payment
        );
        generatedNotifications.push(notif);
      }

      // Payment release pending (48 hours before)
      if (payment.releaseScheduledAt) {
        const releaseDate = new Date(payment.releaseScheduledAt);
        const hoursUntilRelease = (releaseDate.getTime() - today.getTime()) / (1000 * 60 * 60);
        if (hoursUntilRelease <= 48 && hoursUntilRelease > 0 && payment.status === 'escrowed') {
          const notif = createPaymentNotification(
            payment.id,
            'payment_release_pending',
            userId,
            userRole,
            payment.assignmentId,
            payment
          );
          generatedNotifications.push(notif);
        }
      }

      // Payment released notification
      if (payment.releasedAt && payment.status === 'released') {
        const notif = createPaymentNotification(
          payment.id,
          'payment_released',
          userId,
          userRole,
          payment.assignmentId,
          payment
        );
        generatedNotifications.push(notif);
      }

      // Dispute initiated notification
      if (payment.disputeInitiatedAt && payment.status === 'held') {
        const notif = createPaymentNotification(
          payment.id,
          'dispute_initiated',
          userId,
          userRole,
          payment.assignmentId,
          payment
        );
        generatedNotifications.push(notif);
      }
    });

    setNotifications(generatedNotifications);
    setUnreadCount(generatedNotifications.filter(n => !n.readAt).length);
  }, [payments, userId, userRole]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, readAt: new Date().toISOString() } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: PaymentNotificationType): string => {
    switch (type) {
      case 'escrow_funded':
        return 'ri-safe-2-line text-teal-600';
      case 'assignment_start':
        return 'ri-calendar-check-line text-blue-600';
      case 'assignment_completion':
        return 'ri-checkbox-circle-line text-green-600';
      case 'payment_release_pending':
        return 'ri-alarm-warning-line text-orange-600';
      case 'payment_released':
        return 'ri-check-double-line text-green-600';
      case 'dispute_initiated':
        return 'ri-alert-line text-red-600';
      case 'payment_held':
        return 'ri-pause-circle-line text-red-600';
      default:
        return 'ri-notification-line text-gray-600';
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <i className="ri-notification-3-line text-xl"></i>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">Payment Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              {unreadCount > 0 && (
                <div className="text-sm text-gray-600">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <i className="ri-notification-off-line text-5xl text-gray-300 mb-3"></i>
                  <p className="text-gray-500">No payment notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      onClick={() => !notification.readAt && markAsRead(notification.id)}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.readAt ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                          !notification.readAt ? 'bg-white' : 'bg-gray-100'
                        } flex-shrink-0`}>
                          <i className={`${getNotificationIcon(notification.type)} text-xl`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-sm font-semibold ${
                              !notification.readAt ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.readAt && (
                              <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>
                              <i className="ri-time-line mr-1"></i>
                              {getTimeAgo(notification.sentAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              {notification.deliveredVia.includes('email') && (
                                <i className="ri-mail-line" title="Email sent"></i>
                              )}
                              {notification.deliveredVia.includes('dashboard') && (
                                <i className="ri-dashboard-line" title="Dashboard notification"></i>
                              )}
                              {notification.deliveredVia.includes('sms') && (
                                <i className="ri-message-3-line" title="SMS sent"></i>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentNotifications;
