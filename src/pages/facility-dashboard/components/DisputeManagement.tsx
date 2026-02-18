import React, { useState } from 'react';

interface Dispute {
  id: string;
  type: 'dispute' | 'complaint' | 'payment_hold';
  physicianName: string;
  assignmentTitle: string;
  assignmentDates: string;
  amount: string;
  status: 'open' | 'under_review' | 'resolved' | 'escalated';
  reason: string;
  description: string;
  filedDate: string;
  filedBy: string;
  lastUpdated: string;
  resolutionNotes?: string;
  supportingDocs?: string[];
  auditTrail: AuditEntry[];
}

interface AuditEntry {
  timestamp: string;
  action: string;
  user: string;
  ipAddress: string;
  details: string;
}

export default function DisputeManagement() {
  const [showNewDisputeModal, setShowNewDisputeModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDisputeDetail, setShowDisputeDetail] = useState(false);
  
  // New dispute form state
  const [disputeType, setDisputeType] = useState<'dispute' | 'complaint' | 'payment_hold'>('dispute');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [requestPaymentHold, setRequestPaymentHold] = useState(false);
  const [holdJustification, setHoldJustification] = useState('');

  const disputes: Dispute[] = [
    {
      id: 'disp-001',
      type: 'dispute',
      physicianName: 'Dr. Robert Kim',
      assignmentTitle: 'Radiology - 5 Day Block',
      assignmentDates: 'Jan 10-14, 2025',
      amount: '$10,500',
      status: 'open',
      reason: 'Services Not Rendered',
      description: 'Physician did not complete the full assignment. Left early on day 4 without prior notice or approval.',
      filedDate: '2025-01-15T10:30:00Z',
      filedBy: 'Jane Smith (Facility Administrator)',
      lastUpdated: '2025-01-15T10:30:00Z',
      supportingDocs: ['incident-report.pdf', 'schedule-log.pdf'],
      auditTrail: [
        {
          timestamp: '2025-01-15T10:30:00Z',
          action: 'Dispute Filed',
          user: 'Jane Smith',
          ipAddress: '192.168.1.100',
          details: 'Initial dispute filed with payment hold request'
        }
      ]
    },
    {
      id: 'disp-002',
      type: 'complaint',
      physicianName: 'Dr. Michael Torres',
      assignmentTitle: 'Emergency Medicine - 7 Day Block',
      assignmentDates: 'Dec 20-26, 2024',
      amount: '$12,000',
      status: 'under_review',
      reason: 'Quality Concerns',
      description: 'Multiple patient complaints regarding physician conduct. Formal review initiated by medical director.',
      filedDate: '2024-12-28T14:20:00Z',
      filedBy: 'Dr. Sarah Johnson (Medical Director)',
      lastUpdated: '2025-01-10T09:15:00Z',
      supportingDocs: ['patient-complaints.pdf', 'peer-review.pdf'],
      auditTrail: [
        {
          timestamp: '2024-12-28T14:20:00Z',
          action: 'Complaint Filed',
          user: 'Dr. Sarah Johnson',
          ipAddress: '192.168.1.105',
          details: 'Quality concern complaint filed'
        },
        {
          timestamp: '2025-01-10T09:15:00Z',
          action: 'Status Updated',
          user: 'Platform Administrator',
          ipAddress: '10.0.0.1',
          details: 'Status changed to under_review'
        }
      ]
    },
    {
      id: 'disp-003',
      type: 'payment_hold',
      physicianName: 'Dr. Lisa Anderson',
      assignmentTitle: 'Internal Medicine - 5 Day Block',
      assignmentDates: 'Nov 15-19, 2024',
      amount: '$7,200',
      status: 'resolved',
      reason: 'Billing Discrepancy',
      description: 'Invoice amount did not match agreed contract terms. Discrepancy resolved after clarification.',
      filedDate: '2024-11-22T11:00:00Z',
      filedBy: 'Mark Davis (Billing Manager)',
      lastUpdated: '2024-11-25T16:45:00Z',
      resolutionNotes: 'Discrepancy was due to miscommunication. Correct amount verified and payment released.',
      auditTrail: [
        {
          timestamp: '2024-11-22T11:00:00Z',
          action: 'Payment Hold Requested',
          user: 'Mark Davis',
          ipAddress: '192.168.1.110',
          details: 'Payment hold initiated pending invoice review'
        },
        {
          timestamp: '2024-11-25T16:45:00Z',
          action: 'Dispute Resolved',
          user: 'Mark Davis',
          ipAddress: '192.168.1.110',
          details: 'Issue resolved, payment released'
        }
      ]
    }
  ];

  const availableAssignments = [
    { id: 'assign-001', physician: 'Dr. Sarah Mitchell', title: 'Emergency Medicine - 7 Day Block', dates: 'Feb 1-7, 2025', amount: '$12,000' },
    { id: 'assign-002', physician: 'Dr. James Chen', title: 'Cardiology - 5 Day Block', dates: 'Feb 15-19, 2025', amount: '$8,500' },
    { id: 'assign-003', physician: 'Dr. Emily Rodriguez', title: 'Internal Medicine - 5 Day Block', dates: 'Jan 5-9, 2025', amount: '$7,200' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-amber-100 text-amber-700';
      case 'under_review': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'escalated': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'dispute': return 'bg-red-100 text-red-700';
      case 'complaint': return 'bg-orange-100 text-orange-700';
      case 'payment_hold': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'dispute': return 'Dispute';
      case 'complaint': return 'Complaint';
      case 'payment_hold': return 'Payment Hold';
      default: return type;
    }
  };

  const handleSubmitDispute = () => {
    if (!selectedAssignment || !disputeReason || !disputeDescription.trim()) return;
    if (requestPaymentHold && !holdJustification.trim()) return;

    const newDispute = {
      type: disputeType,
      assignmentId: selectedAssignment,
      reason: disputeReason,
      description: disputeDescription,
      paymentHold: requestPaymentHold,
      holdJustification: requestPaymentHold ? holdJustification : null,
      timestamp: new Date().toISOString(),
      filedBy: 'Current User',
      ipAddress: '192.168.1.xxx'
    };

    console.log('New dispute submitted:', newDispute);

    // Reset form
    setShowNewDisputeModal(false);
    setDisputeType('dispute');
    setSelectedAssignment('');
    setDisputeReason('');
    setDisputeDescription('');
    setRequestPaymentHold(false);
    setHoldJustification('');
  };

  const handleResolveDispute = (dispute: Dispute) => {
    console.log('Resolving dispute:', dispute.id);
    setShowDisputeDetail(false);
    setSelectedDispute(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dispute Management</h2>
          <p className="text-sm text-gray-600 mt-1">File and manage disputes, complaints, and payment holds</p>
        </div>
        <button
          onClick={() => setShowNewDisputeModal(true)}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap flex items-center gap-2"
        >
          <i className="ri-alert-line"></i>
          File New Dispute
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <i className="ri-information-line text-blue-600 text-lg mt-0.5"></i>
          <div>
            <p className="text-sm text-blue-900 font-medium">Dispute Process</p>
            <p className="text-sm text-blue-800 mt-1">
              All disputes, complaints, and payment holds are logged with timestamp and user identity. The physician will be notified and given opportunity to respond. All communications are auditable and legally traceable.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Disputes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {disputes.filter(d => d.status === 'open').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className="ri-alert-line text-amber-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Under Review</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {disputes.filter(d => d.status === 'under_review').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-search-eye-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {disputes.filter(d => d.status === 'resolved').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-double-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Escalated</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {disputes.filter(d => d.status === 'escalated').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-error-warning-line text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {disputes.map((dispute) => (
          <div key={dispute.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(dispute.type)}`}>
                    {getTypeLabel(dispute.type)}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(dispute.status)}`}>
                    {dispute.status.replace('_', ' ').charAt(0).toUpperCase() + dispute.status.slice(1).replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">ID: {dispute.id}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{dispute.physicianName}</h3>
                <p className="text-sm text-gray-600 mb-3">{dispute.assignmentTitle} • {dispute.assignmentDates}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-gray-900 font-medium mt-1">{dispute.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reason</p>
                    <p className="text-gray-900 font-medium mt-1">{dispute.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Filed By</p>
                    <p className="text-gray-900 font-medium mt-1">{dispute.filedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Filed Date</p>
                    <p className="text-gray-900 font-medium mt-1">
                      {new Date(dispute.filedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{dispute.description}</p>
                </div>

                {dispute.supportingDocs && dispute.supportingDocs.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <i className="ri-attachment-line text-gray-500 text-sm"></i>
                    <span className="text-xs text-gray-600">
                      {dispute.supportingDocs.length} supporting document(s) attached
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-6">
                <button
                  onClick={() => {
                    setSelectedDispute(dispute);
                    setShowDisputeDetail(true);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  <i className="ri-eye-line"></i>
                  View Details
                </button>
                {dispute.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolveDispute(dispute)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap flex items-center gap-2"
                  >
                    <i className="ri-check-line"></i>
                    Resolve
                  </button>
                )}
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2">
                  <i className="ri-message-3-line"></i>
                  Message
                </button>
              </div>
            </div>
          </div>
        ))}

        {disputes.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-double-line text-green-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Disputes</h3>
            <p className="text-sm text-gray-600">All assignments are proceeding smoothly with no disputes or complaints.</p>
          </div>
        )}
      </div>

      {/* New Dispute Modal */}
      {showNewDisputeModal && (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">File New Dispute</h3>
                <button
                  onClick={() => setShowNewDisputeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <i className="ri-alert-line text-red-600 text-lg mt-0.5"></i>
                  <div>
                    <p className="text-sm text-red-900 font-medium">Important Notice</p>
                    <p className="text-sm text-red-800 mt-1">
                      Filing a dispute will notify the physician and may result in payment holds. All actions are logged with timestamp, user identity, and IP address for legal traceability.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dispute Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setDisputeType('dispute')}
                    className={`p-4 border-2 rounded-lg text-sm font-medium transition-all ${
                      disputeType === 'dispute'
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <i className="ri-alert-line text-xl mb-2 block"></i>
                    Dispute
                  </button>
                  <button
                    onClick={() => setDisputeType('complaint')}
                    className={`p-4 border-2 rounded-lg text-sm font-medium transition-all ${
                      disputeType === 'complaint'
                        ? 'border-orange-600 bg-orange-50 text-orange-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <i className="ri-feedback-line text-xl mb-2 block"></i>
                    Complaint
                  </button>
                  <button
                    onClick={() => setDisputeType('payment_hold')}
                    className={`p-4 border-2 rounded-lg text-sm font-medium transition-all ${
                      disputeType === 'payment_hold'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <i className="ri-hand-coin-line text-xl mb-2 block"></i>
                    Payment Hold
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Assignment <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedAssignment}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Choose an assignment</option>
                  {availableAssignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.physician} - {assignment.title} ({assignment.dates}) - {assignment.amount}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a reason</option>
                  <option value="Services Not Rendered">Services Not Rendered</option>
                  <option value="Quality Concerns">Quality Concerns</option>
                  <option value="Contract Violation">Contract Violation</option>
                  <option value="Billing Discrepancy">Billing Discrepancy</option>
                  <option value="Professional Conduct">Professional Conduct</option>
                  <option value="Incomplete Assignment">Incomplete Assignment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  rows={6}
                  placeholder="Provide a detailed explanation of the issue. Include specific dates, incidents, and any relevant context."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requestPaymentHold}
                    onChange={(e) => setRequestPaymentHold(e.target.checked)}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Request payment hold on escrowed funds
                  </span>
                </label>
              </div>

              {requestPaymentHold && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Hold Justification <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={holdJustification}
                    onChange={(e) => setHoldJustification(e.target.value)}
                    rows={4}
                    placeholder="Provide justification for holding the payment. This will be reviewed and must meet platform guidelines."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600 space-y-1">
                <p><strong>Audit Trail Information:</strong></p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Timestamp: {new Date().toLocaleString()}</li>
                  <li>Filed by: Current User (Facility Administrator)</li>
                  <li>IP Address: Will be captured automatically</li>
                  <li>All communications will be logged and legally traceable</li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowNewDisputeModal(false)}
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitDispute}
                  disabled={!selectedAssignment || !disputeReason || !disputeDescription.trim() || (requestPaymentHold && !holdJustification.trim())}
                  className="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <i className="ri-alert-line mr-2"></i>
                  Submit Dispute
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Detail Modal */}
      {showDisputeDetail && selectedDispute && (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Dispute Details</h3>
                <button
                  onClick={() => {
                    setShowDisputeDetail(false);
                    setSelectedDispute(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedDispute.type)}`}>
                  {getTypeLabel(selectedDispute.type)}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedDispute.status)}`}>
                  {selectedDispute.status.replace('_', ' ').charAt(0).toUpperCase() + selectedDispute.status.slice(1).replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500">ID: {selectedDispute.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Physician</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedDispute.physicianName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedDispute.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Assignment</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedDispute.assignmentTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Assignment Dates</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedDispute.assignmentDates}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reason</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedDispute.reason}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Filed By</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedDispute.filedBy}</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Description</p>
                <p className="text-sm text-gray-700">{selectedDispute.description}</p>
              </div>

              {selectedDispute.resolutionNotes && (
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-900 mb-2">Resolution Notes</p>
                  <p className="text-sm text-green-800">{selectedDispute.resolutionNotes}</p>
                </div>
              )}

              {selectedDispute.supportingDocs && selectedDispute.supportingDocs.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-3">Supporting Documents</p>
                  <div className="space-y-2">
                    {selectedDispute.supportingDocs.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <i className="ri-file-text-line text-gray-600 text-lg"></i>
                          <span className="text-sm text-gray-900">{doc}</span>
                        </div>
                        <button className="text-teal-600 hover:text-teal-700 text-sm font-medium whitespace-nowrap">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">Audit Trail</p>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {selectedDispute.auditTrail.map((entry, index) => (
                      <div key={index} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{entry.details}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>User: {entry.user}</span>
                          <span>IP: {entry.ipAddress}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDisputeDetail(false);
                    setSelectedDispute(null);
                  }}
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Close
                </button>
                {selectedDispute.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolveDispute(selectedDispute)}
                    className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-check-line mr-2"></i>
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
