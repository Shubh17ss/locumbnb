import { useState } from 'react';
import type { Dispute, DisputeStatus } from '../../types/dispute';
import { mockDisputes, getDisputesByStatus, getDisputesByPriority } from '../../mocks/disputes';
import { addDisputeMessage, addEvidence, createDisputeAuditLog } from '../../utils/disputeManager';

export default function DisputeTracking() {
  const [disputes] = useState<Dispute[]>(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);

  // Filter disputes
  const filteredDisputes = disputes.filter(dispute => {
    if (filterStatus !== 'all' && dispute.status !== filterStatus) return false;
    if (filterPriority !== 'all' && dispute.priority !== filterPriority) return false;
    return true;
  });

  // Statistics
  const stats = {
    total: disputes.length,
    open: disputes.filter(d => d.status === 'open').length,
    underReview: disputes.filter(d => d.status === 'under_review').length,
    escalated: disputes.filter(d => d.status === 'escalated').length,
    resolved: disputes.filter(d => d.status === 'resolved').length,
  };

  const getStatusBadge = (status: DisputeStatus) => {
    const badges = {
      open: 'bg-blue-100 text-blue-700',
      under_review: 'bg-amber-100 text-amber-700',
      escalated: 'bg-red-100 text-red-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-slate-100 text-slate-700',
    };
    return badges[status] || badges.open;
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      urgent: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-blue-100 text-blue-700',
      low: 'bg-slate-100 text-slate-700',
    };
    return badges[priority] || badges.low;
  };

  const handleSendMessage = () => {
    if (!selectedDispute || !newMessage.trim()) return;

    const message = addDisputeMessage(
      selectedDispute.id,
      'current-user-id',
      'Current User',
      'physician', // This would be dynamic based on logged-in user
      newMessage,
      false
    );

    // In production, update the dispute in database
    selectedDispute.messages.push(message);
    
    createDisputeAuditLog({
      disputeId: selectedDispute.id,
      action: 'message_sent',
      performedBy: 'current-user-id',
      performedByRole: 'physician',
      details: 'Message sent to dispute thread',
    });

    setNewMessage('');
    setShowMessageForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDaysOpen = (createdAt: string, resolvedAt?: string) => {
    const start = new Date(createdAt);
    const end = resolvedAt ? new Date(resolvedAt) : new Date();
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          <div className="text-sm text-slate-600">Total Disputes</div>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="text-2xl font-bold text-blue-700">{stats.open}</div>
          <div className="text-sm text-blue-600">Open</div>
        </div>
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
          <div className="text-2xl font-bold text-amber-700">{stats.underReview}</div>
          <div className="text-sm text-amber-600">Under Review</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <div className="text-2xl font-bold text-red-700">{stats.escalated}</div>
          <div className="text-sm text-red-600">Escalated</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <div className="text-2xl font-bold text-green-700">{stats.resolved}</div>
          <div className="text-sm text-green-600">Resolved</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="under_review">Under Review</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Priority:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-slate-600">
            Showing {filteredDisputes.length} of {disputes.length} disputes
          </div>
        </div>
      </div>

      {/* Disputes List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDisputes.map((dispute) => (
          <div
            key={dispute.id}
            className="bg-white rounded-lg border border-slate-200 hover:border-teal-300 transition-colors cursor-pointer"
            onClick={() => setSelectedDispute(dispute)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusBadge(dispute.status)}`}>
                      {dispute.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getPriorityBadge(dispute.priority)}`}>
                      {dispute.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">ID: {dispute.id}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{dispute.subject}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{dispute.description}</p>
                </div>
                <i className="ri-arrow-right-s-line text-xl text-slate-400 flex-shrink-0"></i>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Assignment:</span>
                  <p className="font-medium text-slate-900">{dispute.assignmentTitle}</p>
                </div>
                <div>
                  <span className="text-slate-600">Initiated By:</span>
                  <p className="font-medium text-slate-900 capitalize">{dispute.initiatedBy}</p>
                </div>
                <div>
                  <span className="text-slate-600">Created:</span>
                  <p className="font-medium text-slate-900">{formatDate(dispute.createdAt)}</p>
                </div>
                <div>
                  <span className="text-slate-600">Days Open:</span>
                  <p className="font-medium text-slate-900">{calculateDaysOpen(dispute.createdAt, dispute.resolvedAt)} days</p>
                </div>
              </div>

              {dispute.escrowHeld && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <i className="ri-lock-line text-amber-600"></i>
                  <span className="text-amber-700 font-medium">
                    Escrow Held: ${dispute.escrowAmount?.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredDisputes.length === 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <i className="ri-file-list-3-line text-5xl text-slate-300 mb-4"></i>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Disputes Found</h3>
            <p className="text-slate-600">No disputes match your current filters.</p>
          </div>
        )}
      </div>

      {/* Dispute Detail Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusBadge(selectedDispute.status)}`}>
                    {selectedDispute.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getPriorityBadge(selectedDispute.priority)}`}>
                    {selectedDispute.priority.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">{selectedDispute.subject}</h2>
                <p className="text-sm text-slate-600 mt-1">Dispute ID: {selectedDispute.id}</p>
              </div>
              <button
                onClick={() => setSelectedDispute(null)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Assignment Details */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Assignment Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Assignment:</span>
                    <p className="font-medium text-slate-900">{selectedDispute.assignmentTitle}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Assignment ID:</span>
                    <p className="font-medium text-slate-900">{selectedDispute.assignmentId}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Facility:</span>
                    <p className="font-medium text-slate-900">{selectedDispute.facility.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Physician:</span>
                    <p className="font-medium text-slate-900">{selectedDispute.physician.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Specialty:</span>
                    <p className="font-medium text-slate-900">{selectedDispute.physician.specialty}</p>
                  </div>
                  {selectedDispute.escrowAmount && (
                    <div>
                      <span className="text-slate-600">Escrow Amount:</span>
                      <p className="font-medium text-slate-900">${selectedDispute.escrowAmount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dispute Information */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Dispute Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-600">Initiated By:</span>
                    <p className="font-medium text-slate-900 capitalize">{selectedDispute.initiatorName} ({selectedDispute.initiatedBy})</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Respondent:</span>
                    <p className="font-medium text-slate-900 capitalize">{selectedDispute.respondentName} ({selectedDispute.respondentRole})</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Description:</span>
                    <p className="text-slate-900 mt-1">{selectedDispute.description}</p>
                  </div>
                </div>
              </div>

              {/* Fee Information */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-3">Dispute Fee</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-amber-700">Amount:</span>
                    <p className="font-medium text-amber-900">${selectedDispute.fee.amount}</p>
                  </div>
                  <div>
                    <span className="text-amber-700">Status:</span>
                    <p className="font-medium text-amber-900 capitalize">{selectedDispute.fee.paymentStatus}</p>
                  </div>
                  <div>
                    <span className="text-amber-700">Paid By:</span>
                    <p className="font-medium text-amber-900 capitalize">{selectedDispute.fee.paidByRole}</p>
                  </div>
                </div>
              </div>

              {/* Evidence */}
              {selectedDispute.evidence.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Evidence ({selectedDispute.evidence.length})</h3>
                  <div className="space-y-2">
                    {selectedDispute.evidence.map((evidence) => (
                      <div key={evidence.id} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                        <i className="ri-file-line text-xl text-slate-600"></i>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 text-sm">{evidence.fileName}</p>
                          {evidence.description && (
                            <p className="text-xs text-slate-600">{evidence.description}</p>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          <p>Uploaded by: {evidence.uploadedBy}</p>
                          <p>{formatDate(evidence.uploadedAt)}</p>
                        </div>
                        <button className="px-3 py-1.5 bg-teal-500 text-white rounded text-sm hover:bg-teal-600 transition-colors whitespace-nowrap">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">Communication ({selectedDispute.messages.length})</h3>
                  <button
                    onClick={() => setShowMessageForm(!showMessageForm)}
                    className="px-3 py-1.5 bg-teal-500 text-white rounded text-sm hover:bg-teal-600 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-message-3-line mr-1"></i>
                    Send Message
                  </button>
                </div>

                {showMessageForm && (
                  <div className="mb-4 bg-slate-50 rounded-lg p-4">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-teal-500 text-white rounded text-sm hover:bg-teal-600 transition-colors whitespace-nowrap"
                      >
                        Send
                      </button>
                      <button
                        onClick={() => {
                          setShowMessageForm(false);
                          setNewMessage('');
                        }}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-50 transition-colors whitespace-nowrap"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {selectedDispute.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-lg p-4 ${
                        message.isInternal
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 text-sm">{message.senderName}</span>
                          <span className="text-xs text-slate-500 capitalize">({message.senderRole})</span>
                          {message.isInternal && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium whitespace-nowrap">
                              Internal
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">{formatDate(message.timestamp)}</span>
                      </div>
                      <p className="text-sm text-slate-700">{message.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution */}
              {selectedDispute.resolution && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-3">Resolution</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-green-700">Outcome:</span>
                      <p className="font-medium text-green-900 capitalize">
                        {selectedDispute.resolution.outcome.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-green-700">Resolution:</span>
                      <p className="text-green-900 mt-1">{selectedDispute.resolution.resolution}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-green-700">Resolved By:</span>
                        <p className="font-medium text-green-900">{selectedDispute.resolution.resolvedByName}</p>
                      </div>
                      <div>
                        <span className="text-green-700">Resolved At:</span>
                        <p className="font-medium text-green-900">{formatDate(selectedDispute.resolution.resolvedAt)}</p>
                      </div>
                      <div>
                        <span className="text-green-700">Fee Refunded:</span>
                        <p className="font-medium text-green-900">{selectedDispute.resolution.feeRefunded ? 'Yes' : 'No'}</p>
                      </div>
                      {selectedDispute.resolution.escrowAction && (
                        <div>
                          <span className="text-green-700">Escrow Action:</span>
                          <p className="font-medium text-green-900 capitalize">
                            {selectedDispute.resolution.escrowAction.replace('_', ' ')}
                          </p>
                        </div>
                      )}
                    </div>
                    {selectedDispute.resolution.notes && (
                      <div>
                        <span className="text-green-700">Notes:</span>
                        <p className="text-green-900 mt-1">{selectedDispute.resolution.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Assigned Admin */}
              {selectedDispute.assignedAdmin && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Assigned Administrator</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-teal-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{selectedDispute.assignedAdmin.name}</p>
                      <p className="text-sm text-slate-600">{selectedDispute.assignedAdmin.role}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
