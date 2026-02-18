import { useState } from 'react';
import type { CancellationRequest, PenaltyCharge } from '../../../types/cancellation';
import { mockCancellationRequests, mockPenaltyCharges } from '../../../mocks/cancellations';
import {
  processCancellationRequest,
  chargeCancellationPenalty,
  waivePenalty
} from '../../../utils/cancellationManager';

export default function CancellationManagement() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'penalties'>('pending');
  const [requests, setRequests] = useState<CancellationRequest[]>(mockCancellationRequests);
  const [penalties, setPenalties] = useState<PenaltyCharge[]>(mockPenaltyCharges);
  const [selectedRequest, setSelectedRequest] = useState<CancellationRequest | null>(null);
  const [selectedPenalty, setSelectedPenalty] = useState<PenaltyCharge | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [waiveReason, setWaiveReason] = useState('');

  const tabs = [
    { id: 'pending' as const, label: 'Pending Review', icon: 'ri-time-line', count: requests.filter(r => r.status === 'pending' || r.status === 'grace_period').length },
    { id: 'approved' as const, label: 'Approved', icon: 'ri-checkbox-circle-line', count: requests.filter(r => r.status === 'approved').length },
    { id: 'rejected' as const, label: 'Rejected', icon: 'ri-close-circle-line', count: requests.filter(r => r.status === 'rejected').length },
    { id: 'penalties' as const, label: 'Penalties', icon: 'ri-money-dollar-circle-line', count: penalties.length }
  ];

  const handleApprove = (request: CancellationRequest) => {
    const updated = processCancellationRequest(request, 'approve', 'admin_001', 'admin', actionNotes);
    setRequests(requests.map(r => r.id === updated.id ? updated : r));
    
    // Charge penalty
    const penalty = chargeCancellationPenalty(updated);
    setPenalties([...penalties, penalty]);
    
    setShowDetailsModal(false);
    setActionNotes('');
  };

  const handleReject = (request: CancellationRequest) => {
    const updated = processCancellationRequest(request, 'reject', 'admin_001', 'admin', actionNotes);
    setRequests(requests.map(r => r.id === updated.id ? updated : r));
    setShowDetailsModal(false);
    setActionNotes('');
  };

  const handleWaivePenalty = (penalty: PenaltyCharge) => {
    const updated = waivePenalty(penalty, 'admin_001', waiveReason);
    setPenalties(penalties.map(p => p.id === updated.id ? updated : p));
    setShowPenaltyModal(false);
    setWaiveReason('');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700 border-amber-300',
      grace_period: 'bg-blue-100 text-blue-700 border-blue-300',
      approved: 'bg-green-100 text-green-700 border-green-300',
      rejected: 'bg-red-100 text-red-700 border-red-300'
    };
    
    const labels = {
      pending: 'Pending Review',
      grace_period: 'Grace Period',
      approved: 'Approved',
      rejected: 'Rejected'
    };
    
    return (
      <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'pending') return r.status === 'pending' || r.status === 'grace_period';
    if (activeTab === 'approved') return r.status === 'approved';
    if (activeTab === 'rejected') return r.status === 'rejected';
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cancellation Management</h2>
          <p className="text-sm text-slate-600 mt-1">Review and process cancellation requests</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
            <i className="ri-download-line mr-2"></i>
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-100">Pending Review</p>
              <p className="text-3xl font-bold mt-1">
                {requests.filter(r => r.status === 'pending' || r.status === 'grace_period').length}
              </p>
            </div>
            <i className="ri-time-line text-4xl text-amber-200"></i>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Approved</p>
              <p className="text-3xl font-bold mt-1">
                {requests.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <i className="ri-checkbox-circle-line text-4xl text-green-200"></i>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-100">Rejected</p>
              <p className="text-3xl font-bold mt-1">
                {requests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
            <i className="ri-close-circle-line text-4xl text-red-200"></i>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">Total Penalties</p>
              <p className="text-3xl font-bold mt-1">
                ${penalties.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </p>
            </div>
            <i className="ri-money-dollar-circle-line text-4xl text-purple-200"></i>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <i className={`${tab.icon} mr-2`}></i>
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                  activeTab === tab.id ? 'bg-teal-100 text-teal-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab !== 'penalties' ? (
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <i className="ri-inbox-line text-5xl text-slate-400 mb-3"></i>
              <p className="text-slate-600">No cancellation requests in this category</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Assignment #{request.assignmentId}
                      </h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span>
                        <i className="ri-user-line mr-1"></i>
                        Initiated by: <strong className="text-slate-900 capitalize">{request.initiatedBy}</strong>
                      </span>
                      <span>
                        <i className="ri-calendar-line mr-1"></i>
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </span>
                      <span>
                        <i className="ri-time-line mr-1"></i>
                        {request.daysBeforeStart} days before start
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowDetailsModal(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-eye-line mr-2"></i>
                    View Details
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600 mb-1">Assignment Value</p>
                    <p className="text-lg font-bold text-slate-900">${request.assignmentValue.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-red-600 mb-1">Penalty Percentage</p>
                    <p className="text-lg font-bold text-red-600">{request.penaltyPercentage}%</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-red-600 mb-1">Penalty Amount</p>
                    <p className="text-lg font-bold text-red-600">${request.penaltyAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Cancellation Reason:</p>
                  <p className="text-sm text-slate-900 italic">&quot;{request.reason}&quot;</p>
                </div>

                {request.status === 'pending' && (
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowDetailsModal(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap"
                    >
                      <i className="ri-close-line mr-2"></i>
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowDetailsModal(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                    >
                      <i className="ri-check-line mr-2"></i>
                      Approve
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {penalties.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <i className="ri-inbox-line text-5xl text-slate-400 mb-3"></i>
              <p className="text-slate-600">No penalties charged yet</p>
            </div>
          ) : (
            penalties.map((penalty) => (
              <div key={penalty.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Penalty #{penalty.id}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${
                        penalty.status === 'charged' ? 'bg-red-100 text-red-700 border-red-300' :
                        penalty.status === 'waived' ? 'bg-green-100 text-green-700 border-green-300' :
                        'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {penalty.status === 'charged' ? 'Charged' : penalty.status === 'waived' ? 'Waived' : penalty.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span>
                        <i className="ri-user-line mr-1"></i>
                        Charged to: <strong className="text-slate-900 capitalize">{penalty.chargedTo}</strong>
                      </span>
                      <span>
                        <i className="ri-calendar-line mr-1"></i>
                        {new Date(penalty.chargedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {penalty.status === 'charged' && (
                    <button
                      onClick={() => {
                        setSelectedPenalty(penalty);
                        setShowPenaltyModal(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap"
                    >
                      <i className="ri-gift-line mr-2"></i>
                      Waive Penalty
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600 mb-1">Assignment Value</p>
                    <p className="text-lg font-bold text-slate-900">${penalty.assignmentValue.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-red-600 mb-1">Penalty %</p>
                    <p className="text-lg font-bold text-red-600">{penalty.percentage}%</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-red-600 mb-1">Amount Charged</p>
                    <p className="text-lg font-bold text-red-600">${penalty.amount.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 mb-1">Payment Method</p>
                    <p className="text-sm font-semibold text-blue-900">{penalty.paymentMethod.replace('_', ' ')}</p>
                  </div>
                </div>

                {penalty.status === 'waived' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-green-700 mb-2">Waived by: {penalty.waivedBy}</p>
                    <p className="text-sm text-green-900 italic">&quot;{penalty.waivedReason}&quot;</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-4 rounded-t-lg sticky top-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Cancellation Request Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:text-slate-300 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Request ID</p>
                  <p className="font-semibold text-slate-900">{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <div>
                  <p className="text-sm text-slate-600">Initiated By</p>
                  <p className="font-semibold text-slate-900 capitalize">{selectedRequest.initiatedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Requested At</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(selectedRequest.requestedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-900 mb-2">Cancellation Reason:</p>
                <p className="text-sm text-slate-700 italic">&quot;{selectedRequest.reason}&quot;</p>
              </div>

              {/* Audit Trail */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Audit Trail</h4>
                <div className="space-y-3">
                  {selectedRequest.auditLog.map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-3 text-sm">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-slate-900 font-medium">{entry.details}</p>
                        <p className="text-slate-600 text-xs mt-1">
                          {new Date(entry.timestamp).toLocaleString()} • {entry.performedByRole}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Notes */}
              {selectedRequest.status === 'pending' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    rows={3}
                    placeholder="Add notes about your decision..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>
              )}

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => handleReject(selectedRequest)}
                    className="px-6 py-2.5 text-white bg-red-600 font-medium rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-close-line mr-2"></i>
                    Reject Cancellation
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest)}
                    className="px-6 py-2.5 text-white bg-green-600 font-medium rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-check-line mr-2"></i>
                    Approve & Charge Penalty
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Waive Penalty Modal */}
      {showPenaltyModal && selectedPenalty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-xl font-bold">Waive Penalty</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  You are about to waive a penalty of <strong>${selectedPenalty.amount.toLocaleString()}</strong>. This action cannot be undone.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Reason for Waiving <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={waiveReason}
                  onChange={(e) => setWaiveReason(e.target.value)}
                  rows={4}
                  placeholder="Explain why this penalty is being waived..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShowPenaltyModal(false);
                    setWaiveReason('');
                  }}
                  className="px-6 py-2.5 text-slate-700 bg-slate-100 font-medium rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleWaivePenalty(selectedPenalty)}
                  disabled={!waiveReason.trim()}
                  className={`px-6 py-2.5 font-medium rounded-lg transition-colors whitespace-nowrap ${
                    waiveReason.trim()
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <i className="ri-gift-line mr-2"></i>
                  Confirm Waive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
