import React, { useState } from 'react';
import { EscrowPayment } from '../../../types/payment';
import {
  getPaymentStatusColor,
  getPaymentStatusLabel,
  isInDisputeWindow,
  canInitiateDispute,
  formatPaymentTimeline,
  calculatePaymentSchedule
} from '../../../utils/paymentManager';

interface PaymentEscrowManagementProps {
  payments: EscrowPayment[];
  userRole: 'physician' | 'facility' | 'admin';
  userId: string;
  onFundEscrow?: (paymentId: string) => void;
  onInitiateDispute?: (paymentId: string, reason: string) => void;
  onReleasePayment?: (paymentId: string) => void;
}

const PaymentEscrowManagement: React.FC<PaymentEscrowManagementProps> = ({
  payments,
  userRole,
  userId,
  onFundEscrow,
  onInitiateDispute,
  onReleasePayment
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'escrowed' | 'released' | 'held'>('all');
  const [selectedPayment, setSelectedPayment] = useState<EscrowPayment | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const filteredPayments = payments.filter(payment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return payment.status === 'pending_funding';
    if (activeTab === 'escrowed') return payment.status === 'escrowed';
    if (activeTab === 'released') return payment.status === 'released';
    if (activeTab === 'held') return payment.status === 'held';
    return true;
  });

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending_funding').length,
    escrowed: payments.filter(p => p.status === 'escrowed').length,
    released: payments.filter(p => p.status === 'released').length,
    held: payments.filter(p => p.status === 'held').length,
    totalValue: payments.reduce((sum, p) => sum + p.assignmentValue, 0),
    totalEscrowed: payments.filter(p => p.status === 'escrowed').reduce((sum, p) => sum + p.physicianPayout, 0),
    totalReleased: payments.filter(p => p.status === 'released').reduce((sum, p) => sum + p.physicianPayout, 0)
  };

  const handleInitiateDispute = () => {
    if (selectedPayment && disputeReason.trim() && onInitiateDispute) {
      onInitiateDispute(selectedPayment.id, disputeReason);
      setShowDisputeModal(false);
      setDisputeReason('');
      setSelectedPayment(null);
    }
  };

  const openDisputeModal = (payment: EscrowPayment) => {
    const disputeCheck = canInitiateDispute(payment);
    if (disputeCheck.canDispute) {
      setSelectedPayment(payment);
      setShowDisputeModal(true);
    } else {
      alert(disputeCheck.reason || 'Cannot initiate dispute');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Total Payments</span>
            <i className="ri-money-dollar-circle-line text-2xl text-blue-500"></i>
          </div>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
          <div className="text-sm text-blue-600 mt-1">
            ${stats.totalValue.toLocaleString()} total value
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-amber-600">Pending Funding</span>
            <i className="ri-time-line text-2xl text-amber-500"></i>
          </div>
          <div className="text-3xl font-bold text-amber-900">{stats.pending}</div>
          <div className="text-sm text-amber-600 mt-1">Awaiting escrow funding</div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-teal-600">In Escrow</span>
            <i className="ri-safe-2-line text-2xl text-teal-500"></i>
          </div>
          <div className="text-3xl font-bold text-teal-900">{stats.escrowed}</div>
          <div className="text-sm text-teal-600 mt-1">
            ${stats.totalEscrowed.toLocaleString()} secured
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-600">Released</span>
            <i className="ri-check-double-line text-2xl text-green-500"></i>
          </div>
          <div className="text-3xl font-bold text-green-900">{stats.released}</div>
          <div className="text-sm text-green-600 mt-1">
            ${stats.totalReleased.toLocaleString()} paid out
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { key: 'all', label: 'All Payments', count: stats.total },
              { key: 'pending', label: 'Pending', count: stats.pending },
              { key: 'escrowed', label: 'In Escrow', count: stats.escrowed },
              { key: 'released', label: 'Released', count: stats.released },
              { key: 'held', label: 'On Hold', count: stats.held }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'border-b-2 border-teal-500 text-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Payments List */}
        <div className="p-6">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-inbox-line text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No payments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map(payment => {
                const schedule = calculatePaymentSchedule(
                  payment.metadata.assignmentStartDate,
                  payment.metadata.assignmentEndDate
                );
                const inDisputeWindow = isInDisputeWindow(payment);
                const disputeCheck = canInitiateDispute(payment);

                return (
                  <div
                    key={payment.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {payment.metadata.facilityName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                            {getPaymentStatusLabel(payment.status)}
                          </span>
                          {inDisputeWindow && payment.status === 'escrowed' && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              <i className="ri-alarm-warning-line mr-1"></i>
                              Dispute Window Open
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            <i className="ri-user-line mr-1"></i>
                            {payment.metadata.physicianName}
                          </span>
                          <span>
                            <i className="ri-stethoscope-line mr-1"></i>
                            {payment.metadata.specialty}
                          </span>
                          <span>
                            <i className="ri-calendar-line mr-1"></i>
                            {new Date(payment.metadata.assignmentStartDate).toLocaleDateString()} - {new Date(payment.metadata.assignmentEndDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ${payment.assignmentValue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Platform Fee: ${payment.platformFee.amount.toLocaleString()} ({payment.platformFee.percentage}%)
                        </div>
                        <div className="text-sm font-medium text-teal-600">
                          Payout: ${payment.physicianPayout.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-2">Payment Provider</div>
                        <div className="flex items-center gap-2">
                          <i className={`text-lg ${payment.provider === 'stripe' ? 'ri-bank-card-line text-blue-600' : 'ri-paypal-line text-blue-500'}`}></i>
                          <span className="font-medium capitalize">{payment.provider}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {payment.providerTransactionId}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-2">Timeline</div>
                        {payment.fundedAt && (
                          <div className="text-sm text-gray-700">
                            <i className="ri-check-line text-green-600 mr-1"></i>
                            Funded: {new Date(payment.fundedAt).toLocaleDateString()}
                          </div>
                        )}
                        {payment.releaseScheduledAt && payment.status === 'escrowed' && (
                          <div className="text-sm text-gray-700">
                            <i className="ri-calendar-check-line text-blue-600 mr-1"></i>
                            Release: {new Date(payment.releaseScheduledAt).toLocaleDateString()}
                          </div>
                        )}
                        {payment.releasedAt && (
                          <div className="text-sm text-green-700">
                            <i className="ri-check-double-line text-green-600 mr-1"></i>
                            Released: {new Date(payment.releasedAt).toLocaleDateString()}
                          </div>
                        )}
                        {payment.disputeInitiatedAt && (
                          <div className="text-sm text-red-700">
                            <i className="ri-alert-line text-red-600 mr-1"></i>
                            Disputed: {new Date(payment.disputeInitiatedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dispute Window Info */}
                    {payment.status === 'escrowed' && payment.disputeWindowStart && payment.disputeWindowEnd && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <i className="ri-information-line text-blue-600 mt-0.5"></i>
                          <div className="flex-1 text-sm">
                            <div className="font-medium text-blue-900 mb-1">Dispute Window</div>
                            <div className="text-blue-700">
                              You can initiate a dispute from {new Date(payment.disputeWindowStart).toLocaleDateString()} until {new Date(payment.disputeWindowEnd).toLocaleDateString()} (48 hours before scheduled release)
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {payment.status === 'pending_funding' && userRole === 'facility' && onFundEscrow && (
                        <button
                          onClick={() => onFundEscrow(payment.id)}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          <i className="ri-safe-2-line mr-2"></i>
                          Fund Escrow
                        </button>
                      )}

                      {payment.status === 'escrowed' && disputeCheck.canDispute && userRole === 'facility' && (
                        <button
                          onClick={() => openDisputeModal(payment)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          <i className="ri-alert-line mr-2"></i>
                          Initiate Dispute
                        </button>
                      )}

                      {payment.status === 'escrowed' && userRole === 'admin' && onReleasePayment && (
                        <button
                          onClick={() => onReleasePayment(payment.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          <i className="ri-check-line mr-2"></i>
                          Release Payment
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedPayment(selectedPayment?.id === payment.id ? null : payment)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap"
                      >
                        <i className="ri-eye-line mr-2"></i>
                        {selectedPayment?.id === payment.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {selectedPayment?.id === payment.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Payment Timeline</h4>
                        <div className="space-y-2">
                          {formatPaymentTimeline(schedule).map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <i className="ri-arrow-right-s-line text-gray-400"></i>
                              {item}
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Created:</span>
                            <span className="ml-2 font-medium">{new Date(payment.createdAt).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Last Updated:</span>
                            <span className="ml-2 font-medium">{new Date(payment.updatedAt).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Created By:</span>
                            <span className="ml-2 font-medium">{payment.createdBy}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Last Modified By:</span>
                            <span className="ml-2 font-medium">{payment.lastModifiedBy}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Initiate Payment Dispute</h3>
                <button
                  onClick={() => {
                    setShowDisputeModal(false);
                    setDisputeReason('');
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <i className="ri-alert-line text-red-600 text-xl mt-0.5"></i>
                  <div className="flex-1">
                    <div className="font-semibold text-red-900 mb-1">Important Notice</div>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• A mandatory $300 dispute fee will be charged immediately</li>
                      <li>• Payment will be held until dispute is resolved</li>
                      <li>• All disputes are reviewed by platform administrators</li>
                      <li>• Abuse of the dispute system may result in penalties</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Assignment:</span>
                    <span className="ml-2 font-medium">{selectedPayment.metadata.facilityName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <span className="ml-2 font-medium">${selectedPayment.assignmentValue.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Physician:</span>
                    <span className="ml-2 font-medium">{selectedPayment.metadata.physicianName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Scheduled Release:</span>
                    <span className="ml-2 font-medium">
                      {selectedPayment.releaseScheduledAt && new Date(selectedPayment.releaseScheduledAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dispute Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Provide a detailed explanation for this dispute..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  rows={6}
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {disputeReason.length}/1000 characters
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleInitiateDispute}
                  disabled={disputeReason.trim().length < 50}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
                >
                  <i className="ri-alert-line mr-2"></i>
                  Initiate Dispute ($300 Fee)
                </button>
                <button
                  onClick={() => {
                    setShowDisputeModal(false);
                    setDisputeReason('');
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentEscrowManagement;
