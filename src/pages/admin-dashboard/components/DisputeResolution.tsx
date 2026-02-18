
import { useState } from 'react';
import { AdminSession } from '../../../types/admin';
import { adminAuditLogger } from '../../../utils/adminAuditLogger';

interface Dispute {
  id: string;
  disputeNumber: string;
  status: 'Open' | 'Under Review' | 'Mediation' | 'Resolved' | 'Escalated' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'Payment' | 'Contract' | 'Quality' | 'Conduct' | 'Cancellation' | 'Other';
  
  // Parties
  physicianId: string;
  physicianName: string;
  physicianEmail: string;
  facilityId: string;
  facilityName: string;
  facilityEmail: string;
  
  // Assignment Details
  assignmentId: string;
  assignmentDates: string;
  specialty: string;
  
  // Financial Details
  escrowAmount: number;
  escrowStatus: 'Held' | 'Released' | 'On Hold' | 'Partially Released';
  platformFee: number;
  
  // Dispute Details
  filedBy: 'Physician' | 'Facility';
  filedDate: string;
  description: string;
  supportingDocuments: string[];
  
  // Resolution
  assignedTo?: string;
  assignedToRole?: string;
  resolutionNotes?: string;
  resolutionDate?: string;
  outcome?: string;
  
  // Timeline
  timeline: {
    date: string;
    action: string;
    actor: string;
    actorRole: string;
    notes?: string;
  }[];
  
  // Communication
  messages: {
    id: string;
    from: string;
    fromRole: string;
    to: string;
    date: string;
    message: string;
  }[];
}

interface DisputeResolutionProps {
  session: AdminSession | null;
}

export default function DisputeResolution({ session }: DisputeResolutionProps) {
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'mediate' | 'hold' | 'release' | 'escalate' | 'close' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<'physician' | 'facility' | 'both'>('both');
  const [messageText, setMessageText] = useState('');

  // Filter disputes
  const filteredDisputes = disputes.filter(dispute => {
    const matchesStatus = filterStatus === 'all' || dispute.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || dispute.priority === filterPriority;
    const matchesSearch = searchQuery === '' ||
      dispute.disputeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.physicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Calculate analytics
  const analytics = {
    total: disputes.length,
    open: disputes.filter(d => d.status === 'Open').length,
    underReview: disputes.filter(d => d.status === 'Under Review').length,
    mediation: disputes.filter(d => d.status === 'Mediation').length,
    resolved: disputes.filter(d => d.status === 'Resolved').length,
    escalated: disputes.filter(d => d.status === 'Escalated').length,
    avgResolutionTime: '4.2 days',
    totalEscrowHeld: disputes
      .filter(d => d.escrowStatus === 'On Hold')
      .reduce((sum, d) => sum + d.escrowAmount, 0),
  };

  const handleAction = (type: typeof actionType) => {
    setActionType(type);
    setActionNotes('');
    setShowActionModal(true);
  };

  const executeAction = () => {
    if (!selectedDispute || !actionType || !session) return;

    const actionLabels = {
      mediate: 'DISPUTE_MEDIATION_STARTED',
      hold: 'PAYMENT_HOLD_APPLIED',
      release: 'PAYMENT_RELEASED',
      escalate: 'DISPUTE_ESCALATED',
      close: 'DISPUTE_CLOSED',
    };

    // Log the action
    adminAuditLogger.log(
      session.adminId,
      session.adminEmail,
      session.adminRole,
      actionLabels[actionType],
      'dispute',
      selectedDispute.id,
      {
        disputeNumber: selectedDispute.disputeNumber,
        action: actionType,
        notes: actionNotes,
        physicianId: selectedDispute.physicianId,
        facilityId: selectedDispute.facilityId,
        escrowAmount: selectedDispute.escrowAmount,
        previousStatus: selectedDispute.status,
      },
      session.sessionId
    );

    // Update dispute
    const updatedDisputes = disputes.map(d => {
      if (d.id === selectedDispute.id) {
        const newTimeline = [
          ...d.timeline,
          {
            date: new Date().toISOString(),
            action: actionLabels[actionType],
            actor: session.adminEmail,
            actorRole: session.adminRole,
            notes: actionNotes,
          },
        ];

        let newStatus = d.status;
        let newEscrowStatus = d.escrowStatus;

        if (actionType === 'mediate') newStatus = 'Mediation';
        if (actionType === 'escalate') newStatus = 'Escalated';
        if (actionType === 'close') newStatus = 'Closed';
        if (actionType === 'hold') newEscrowStatus = 'On Hold';
        if (actionType === 'release') newEscrowStatus = 'Released';

        return {
          ...d,
          status: newStatus,
          escrowStatus: newEscrowStatus,
          assignedTo: session.adminEmail,
          assignedToRole: session.adminRole,
          timeline: newTimeline,
        };
      }
      return d;
    });

    setDisputes(updatedDisputes);
    setSelectedDispute(updatedDisputes.find(d => d.id === selectedDispute.id) || null);
    setShowActionModal(false);
    setActionType(null);
    setActionNotes('');
  };

  const sendMessage = () => {
    if (!selectedDispute || !messageText || !session) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      from: session.adminEmail,
      fromRole: session.adminRole,
      to:
        messageRecipient === 'both'
          ? 'Physician & Facility'
          : messageRecipient === 'physician'
          ? selectedDispute.physicianName
          : selectedDispute.facilityName,
      date: new Date().toISOString(),
      message: messageText,
    };

    // Log the message
    adminAuditLogger.log(
      session.adminId,
      session.adminEmail,
      session.adminRole,
      'DISPUTE_MESSAGE_SENT',
      'dispute',
      selectedDispute.id,
      {
        disputeNumber: selectedDispute.disputeNumber,
        recipient: messageRecipient,
        messagePreview: messageText.substring(0, 100),
      },
      session.sessionId
    );

    const updatedDisputes = disputes.map(d => {
      if (d.id === selectedDispute.id) {
        return {
          ...d,
          messages: [...d.messages, newMessage],
        };
      }
      return d;
    });

    setDisputes(updatedDisputes);
    setSelectedDispute(updatedDisputes.find(d => d.id === selectedDispute.id) || null);
    setShowMessageModal(false);
    setMessageText('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'blue';
      case 'Under Review':
        return 'amber';
      case 'Mediation':
        return 'purple';
      case 'Resolved':
        return 'green';
      case 'Escalated':
        return 'red';
      case 'Closed':
        return 'slate';
      default:
        return 'slate';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'blue';
      case 'Medium':
        return 'amber';
      case 'High':
        return 'orange';
      case 'Critical':
        return 'red';
      default:
        return 'slate';
    }
  };

  const canHoldPayment = session?.permissions?.canManagePayments;
  const canReleasePayment = session?.permissions?.canManagePayments;
  const canEscalate = session?.permissions?.canEscalateDisputes;

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <i className="ri-file-list-line text-2xl text-blue-400"></i>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{analytics.total}</h3>
          <p className="text-sm text-slate-400">Total Disputes</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-2xl text-amber-400"></i>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {analytics.open + analytics.underReview + analytics.mediation}
          </h3>
          <p className="text-sm text-slate-400">Active Disputes</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <i className="ri-checkbox-circle-line text-2xl text-green-400"></i>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{analytics.avgResolutionTime}</h3>
          <p className="text-sm text-slate-400">Avg Resolution Time</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-2xl text-purple-400"></i>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            ${(analytics.totalEscrowHeld / 1000).toFixed(1)}K
          </h3>
          <p className="text-sm text-slate-400">Escrow On Hold</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search disputes..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Under Review">Under Review</option>
              <option value="Mediation">Mediation</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterPriority('all');
              }}
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors whitespace-nowrap"
            >
              <i className="ri-refresh-line mr-2"></i>
              Reset Filters
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          Showing {filteredDisputes.length} of {disputes.length} disputes
        </div>
      </div>

      {/* Disputes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List View */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Dispute Queue</h3>

          {filteredDisputes.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
              <i className="ri-inbox-line text-4xl text-slate-600 mb-4"></i>
              <p className="text-slate-400">No disputes found</p>
            </div>
          ) : (
            filteredDisputes.map(dispute => (
              <div
                key={dispute.id}
                onClick={() => setSelectedDispute(dispute)}
                className={`bg-slate-800 border rounded-xl p-6 cursor-pointer transition-all hover:border-red-500 ${
                  selectedDispute?.id === dispute.id ? 'border-red-500' : 'border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold mb-1">{dispute.disputeNumber}</h4>
                    <p className="text-sm text-slate-400">{dispute.type} Dispute</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 bg-${getPriorityColor(
                        dispute.priority
                      )}-500/20 text-${getPriorityColor(dispute.priority)}-400 text-xs font-medium rounded-full whitespace-nowrap`}
                    >
                      {dispute.priority}
                    </span>
                    <span
                      className={`px-3 py-1 bg-${getStatusColor(
                        dispute.status
                      )}-500/20 text-${getStatusColor(dispute.status)}-400 text-xs font-medium rounded-full whitespace-nowrap`}
                    >
                      {dispute.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <i className="ri-user-line text-slate-500"></i>
                    <span className="text-slate-300">{dispute.physicianName}</span>
                    <span className="text-slate-600">vs</span>
                    <span className="text-slate-300">{dispute.facilityName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <i className="ri-calendar-line text-slate-500"></i>
                    <span>{dispute.assignmentDates}</span>
                    <span className="text-slate-600">•</span>
                    <span>{dispute.specialty}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="text-sm">
                    <span className="text-slate-400">Escrow: </span>
                    <span className="text-white font-semibold">
                      ${dispute.escrowAmount.toLocaleString()}
                    </span>
                    <span
                      className={`ml-2 px-2 py-0.5 bg-${
                        dispute.escrowStatus === 'On Hold' ? 'amber' : 'slate'
                      }-500/20 text-${
                        dispute.escrowStatus === 'On Hold' ? 'amber' : 'slate'
                      }-400 text-xs rounded whitespace-nowrap`}
                    >
                      {dispute.escrowStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Filed {new Date(dispute.filedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail View */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {selectedDispute ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{selectedDispute.disputeNumber}</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 bg-${getPriorityColor(
                          selectedDispute.priority
                        )}-500/20 text-${getPriorityColor(selectedDispute.priority)}-400 text-xs font-medium rounded-full whitespace-nowrap`}
                      >
                        {selectedDispute.priority} Priority
                      </span>
                      <span
                        className={`px-3 py-1 bg-${getStatusColor(
                          selectedDispute.status
                        )}-500/20 text-${getStatusColor(selectedDispute.status)}-400 text-xs font-medium rounded-full whitespace-nowrap`}
                      >
                        {selectedDispute.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDispute(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-white font-medium">{selectedDispute.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Filed By:</span>
                    <span className="text-white font-medium">{selectedDispute.filedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Filed Date:</span>
                    <span className="text-white">{new Date(selectedDispute.filedDate).toLocaleString()}</span>
                  </div>
                  {selectedDispute.assignedTo && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Assigned To:</span>
                      <span className="text-white">
                        {selectedDispute.assignedTo} ({selectedDispute.assignedToRole})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Parties */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Parties Involved</h4>
                <div className="space-y-3">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <i className="ri-user-line text-blue-400"></i>
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedDispute.physicianName}</p>
                        <p className="text-xs text-slate-400">Physician</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">{selectedDispute.physicianEmail}</p>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <i className="ri-hospital-line text-purple-400"></i>
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedDispute.facilityName}</p>
                        <p className="text-xs text-slate-400">Facility</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">{selectedDispute.facilityEmail}</p>
                  </div>
                </div>
              </div>

              {/* Assignment Details */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Assignment Details</h4>
                <div className="bg-slate-900/50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assignment ID:</span>
                    <span className="text-white font-mono">{selectedDispute.assignmentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dates:</span>
                    <span className="text-white">{selectedDispute.assignmentDates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Specialty:</span>
                    <span className="text-white">{selectedDispute.specialty}</span>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Financial Details</h4>
                <div className="bg-slate-900/50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Escrow Amount:</span>
                    <span className="text-white font-semibold">
                      ${selectedDispute.escrowAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Platform Fee:</span>
                    <span className="text-white">
                      ${selectedDispute.platformFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Escrow Status:</span>
                    <span
                      className={`px-2 py-1 bg-${
                        selectedDispute.escrowStatus === 'On Hold'
                          ? 'amber'
                          : selectedDispute.escrowStatus === 'Released'
                          ? 'green'
                          : 'slate'
                      }-500/20 text-${
                        selectedDispute.escrowStatus === 'On Hold'
                          ? 'amber'
                          : selectedDispute.escrowStatus === 'Released'
                          ? 'green'
                          : 'slate'
                      }-400 text-xs font-medium rounded whitespace-nowrap`}
                    >
                      {selectedDispute.escrowStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Dispute Description</h4>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">{selectedDispute.description}</p>
                </div>
              </div>

              {/* Supporting Documents */}
              {selectedDispute.supportingDocuments.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Supporting Documents</h4>
                  <div className="space-y-2">
                    {selectedDispute.supportingDocuments.map((doc, index) => (
                      <div key={index} className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <i className="ri-file-text-line text-slate-400"></i>
                          <span className="text-sm text-slate-300">{doc}</span>
                        </div>
                        <button className="text-red-400 hover:text-red-300 text-sm whitespace-nowrap">
                          <i className="ri-download-line mr-1"></i>
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Actions */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Admin Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAction('mediate')}
                    disabled={selectedDispute.status === 'Mediation' || selectedDispute.status === 'Closed'}
                    className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <i className="ri-discuss-line mr-2"></i>
                    Start Mediation
                  </button>

                  {canHoldPayment && (
                    <button
                      onClick={() => handleAction('hold')}
                      disabled={selectedDispute.escrowStatus === 'On Hold' || selectedDispute.status === 'Closed'}
                      className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <i className="ri-pause-circle-line mr-2"></i>
                      Hold Payment
                    </button>
                  )}

                  {canReleasePayment && (
                    <button
                      onClick={() => handleAction('release')}
                      disabled={selectedDispute.escrowStatus === 'Released' || selectedDispute.status === 'Closed'}
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <i className="ri-play-circle-line mr-2"></i>
                      Release Payment
                    </button>
                  )}

                  {canEscalate && (
                    <button
                      onClick={() => handleAction('escalate')}
                      disabled={selectedDispute.status === 'Escalated' || selectedDispute.status === 'Closed'}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <i className="ri-alert-line mr-2"></i>
                      Escalate
                    </button>
                  )}

                  <button
                    onClick={() => handleAction('close')}
                    disabled={selectedDispute.status === 'Closed'}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <i className="ri-check-line mr-2"></i>
                    Close Dispute
                  </button>

                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <i className="ri-message-line mr-2"></i>
                    Send Message
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Timeline</h4>
                <div className="space-y-3">
                  {selectedDispute.timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="ri-time-line text-slate-400 text-sm"></i>
                        </div>
                        {index < selectedDispute.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-700 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm text-white font-medium mb-1">{event.action}</p>
                        <p className="text-xs text-slate-400 mb-1">
                          {event.actor} ({event.actorRole})
                        </p>
                        {event.notes && (
                          <p className="text-xs text-slate-500 mb-1">{event.notes}</p>
                        )}
                        <p className="text-xs text-slate-600">{new Date(event.date).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages */}
              {selectedDispute.messages.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Communication History</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedDispute.messages.map(message => (
                      <div key={message.id} className="bg-slate-900/50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm text-white font-medium">{message.from}</p>
                            <p className="text-xs text-slate-400">
                              {message.fromRole} → {message.to}
                            </p>
                          </div>
                          <span className="text-xs text-slate-600">
                            {new Date(message.date).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">{message.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
              <i className="ri-file-list-line text-5xl text-slate-600 mb-4"></i>
              <p className="text-slate-400">Select a dispute to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && actionType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              {actionType === 'mediate' && 'Start Mediation'}
              {actionType === 'hold' && 'Hold Payment'}
              {actionType === 'release' && 'Release Payment'}
              {actionType === 'escalate' && 'Escalate Dispute'}
              {actionType === 'close' && 'Close Dispute'}
            </h3>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <i className="ri-alert-line text-amber-400 text-lg mt-0.5"></i>
                <div className="text-sm text-amber-300">
                  {actionType === 'hold' &&
                    'This will place the escrow payment on hold. The physician will not receive payment until the hold is released.'}
                  {actionType === 'release' &&
                    'This will release the escrowed payment to the physician. This action cannot be undone.'}
                  {actionType === 'escalate' && 'This will escalate the dispute to senior management or legal review.'}
                  {actionType === 'close' &&
                    'This will close the dispute. Ensure all parties have been notified of the resolution.'}
                  {actionType === 'mediate' && 'This will start the mediation process. Both parties will be notified.'}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Reason / Notes (Required)
              </label>
              <textarea
                value={actionNotes}
                onChange={e => setActionNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Provide detailed justification for this action..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setActionType(null);
                  setActionNotes('');
                }}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                disabled={!actionNotes.trim()}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Send Message</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Recipient</label>
              <select
                value={messageRecipient}
                onChange={e => setMessageRecipient(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="both">Both Parties</option>
                <option value="physician">Physician Only</option>
                <option value="facility">Facility Only</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
              <textarea
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Type your message..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageText('');
                }}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <i className="ri-send-plane-line mr-2"></i>
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mock Data
const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'disp_001',
    disputeNumber: 'DISP-2024-0156',
    status: 'Under Review',
    priority: 'High',
    type: 'Payment',
    physicianId: 'phys_001',
    physicianName: 'Dr. Sarah Johnson',
    physicianEmail: 'sarah.johnson@email.com',
    facilityId: 'fac_001',
    facilityName: 'Memorial Hospital',
    facilityEmail: 'admin@memorial.com',
    assignmentId: 'ASG-2024-0892',
    assignmentDates: 'Jan 15-22, 2024',
    specialty: 'Emergency Medicine',
    escrowAmount: 12500,
    escrowStatus: 'On Hold',
    platformFee: 1875,
    filedBy: 'Physician',
    filedDate: '2024-01-23T10:30:00Z',
    description:
      'Facility has not released payment despite completed assignment. All required documentation was submitted on time. Requesting immediate payment release.',
    supportingDocuments: [
      'Assignment_Completion_Certificate.pdf',
      'Timesheet_Jan_15_22.pdf',
      'Facility_Confirmation_Email.pdf',
    ],
    assignedTo: 'finance@platform.com',
    assignedToRole: 'Finance Manager',
    timeline: [
      {
        date: '2024-01-23T10:30:00Z',
        action: 'Dispute Filed',
        actor: 'Dr. Sarah Johnson',
        actorRole: 'Physician',
        notes: 'Payment not released after 5 business days',
      },
      {
        date: '2024-01-23T14:15:00Z',
        action: 'Assigned to Finance Manager',
        actor: 'System',
        actorRole: 'Automated',
      },
      {
        date: '2024-01-24T09:00:00Z',
        action: 'Under Review',
        actor: 'finance@platform.com',
        actorRole: 'Finance Manager',
        notes: 'Reviewing facility payment records and assignment completion documentation',
      },
    ],
    messages: [
      {
        id: 'msg_001',
        from: 'finance@platform.com',
        fromRole: 'Finance Manager',
        to: 'Memorial Hospital',
        date: '2024-01-24T09:30:00Z',
        message:
          'We are reviewing the payment dispute filed by Dr. Johnson. Please provide any documentation supporting the payment delay.',
      },
    ],
  },
  {
    id: 'disp_002',
    disputeNumber: 'DISP-2024-0157',
    status: 'Mediation',
    priority: 'Critical',
    type: 'Contract',
    physicianId: 'phys_002',
    physicianName: 'Dr. Michael Chen',
    physicianEmail: 'michael.chen@email.com',
    facilityId: 'fac_002',
    facilityName: 'City Medical Center',
    facilityEmail: 'hr@citymedical.com',
    assignmentId: 'ASG-2024-0901',
    assignmentDates: 'Feb 1-7, 2024',
    specialty: 'Cardiology',
    escrowAmount: 18000,
    escrowStatus: 'Held',
    platformFee: 2700,
    filedBy: 'Facility',
    filedDate: '2024-01-25T08:00:00Z',
    description:
      'Physician did not complete the full assignment period. Left 2 days early citing personal emergency. Facility is requesting partial refund.',
    supportingDocuments: [
      'Facility_Incident_Report.pdf',
      'Physician_Departure_Notice.pdf',
      'Schedule_Coverage_Records.pdf',
    ],
    assignedTo: 'compliance@platform.com',
    assignedToRole: 'Compliance Manager',
    timeline: [
      {
        date: '2024-01-25T08:00:00Z',
        action: 'Dispute Filed',
        actor: 'City Medical Center',
        actorRole: 'Facility',
        notes: 'Assignment incomplete - physician left early',
      },
      {
        date: '2024-01-25T10:00:00Z',
        action: 'Payment Hold Applied',
        actor: 'finance@platform.com',
        actorRole: 'Finance Manager',
        notes: 'Escrow placed on hold pending investigation',
      },
      {
        date: '2024-01-26T11:00:00Z',
        action: 'Mediation Started',
        actor: 'compliance@platform.com',
        actorRole: 'Compliance Manager',
        notes: 'Initiating mediation between parties to reach fair resolution',
      },
    ],
    messages: [
      {
        id: 'msg_002',
        from: 'compliance@platform.com',
        fromRole: 'Compliance Manager',
        to: 'Dr. Michael Chen & City Medical Center',
        date: '2024-01-26T11:30:00Z',
        message:
          'We have initiated mediation for this dispute. Both parties will have the opportunity to present their case. Please provide any additional documentation that supports your position.',
      },
    ],
  },
  {
    id: 'disp_003',
    disputeNumber: 'DISP-2024-0158',
    status: 'Open',
    priority: 'Medium',
    type: 'Quality',
    physicianId: 'phys_003',
    physicianName: 'Dr. Emily Rodriguez',
    physicianEmail: 'emily.rodriguez@email.com',
    facilityId: 'fac_003',
    facilityName: 'Regional Health System',
    facilityEmail: 'quality@regional.com',
    assignmentId: 'ASG-2024-0915',
    assignmentDates: 'Jan 20-27, 2024',
    specialty: 'Internal Medicine',
    escrowAmount: 9500,
    escrowStatus: 'Held',
    platformFee: 1425,
    filedBy: 'Facility',
    filedDate: '2024-01-28T14:00:00Z',
    description:
      'Facility reports concerns about physician performance and patient care quality. Requesting review before payment release.',
    supportingDocuments: ['Quality_Assurance_Report.pdf', 'Patient_Feedback_Summary.pdf'],
    timeline: [
      {
        date: '2024-01-28T14:00:00Z',
        action: 'Dispute Filed',
        actor: 'Regional Health System',
        actorRole: 'Facility',
        notes: 'Quality concerns raised by facility',
      },
    ],
    messages: [],
  },
  {
    id: 'disp_004',
    disputeNumber: 'DISP-2024-0145',
    status: 'Resolved',
    priority: 'Low',
    type: 'Cancellation',
    physicianId: 'phys_004',
    physicianName: 'Dr. James Wilson',
    physicianEmail: 'james.wilson@email.com',
    facilityId: 'fac_004',
    facilityName: 'Community Hospital',
    facilityEmail: 'admin@community.com',
    assignmentId: 'ASG-2024-0850',
    assignmentDates: 'Jan 10-14, 2024',
    specialty: 'Anesthesiology',
    escrowAmount: 8000,
    escrowStatus: 'Released',
    platformFee: 1200,
    filedBy: 'Physician',
    filedDate: '2024-01-15T09:00:00Z',
    description:
      'Facility cancelled assignment 48 hours before start date. Physician requesting cancellation fee per contract terms.',
    supportingDocuments: ['Cancellation_Notice.pdf', 'Contract_Terms.pdf'],
    assignedTo: 'operations@platform.com',
    assignedToRole: 'Operations Manager',
    resolutionNotes:
      'Facility agreed to pay 50% cancellation fee as per contract terms. Payment released to physician.',
    resolutionDate: '2024-01-18T16:00:00Z',
    outcome: 'Partial payment released - $4,000 cancellation fee paid to physician',
    timeline: [
      {
        date: '2024-01-15T09:00:00Z',
        action: 'Dispute Filed',
        actor: 'Dr. James Wilson',
        actorRole: 'Physician',
        notes: 'Late cancellation by facility',
      },
      {
        date: '2024-01-16T10:00:00Z',
        action: 'Under Review',
        actor: 'operations@platform.com',
        actorRole: 'Operations Manager',
      },
      {
        date: '2024-01-18T15:00:00Z',
        action: 'Resolution Reached',
        actor: 'operations@platform.com',
        actorRole: 'Operations Manager',
        notes: 'Both parties agreed to 50% cancellation fee',
      },
      {
        date: '2024-01-18T16:00:00Z',
        action: 'Payment Released',
        actor: 'finance@platform.com',
        actorRole: 'Finance Manager',
        notes: '$4,000 released to physician',
      },
      {
        date: '2024-01-18T16:30:00Z',
        action: 'Dispute Closed',
        actor: 'operations@platform.com',
        actorRole: 'Operations Manager',
      },
    ],
    messages: [
      {
        id: 'msg_003',
        from: 'operations@platform.com',
        fromRole: 'Operations Manager',
        to: 'Dr. James Wilson & Community Hospital',
        date: '2024-01-16T11:00:00Z',
        message:
          'We have reviewed the contract terms. The facility cancelled within 48 hours of the assignment start date, which triggers the cancellation fee clause.',
      },
      {
        id: 'msg_004',
        from: 'operations@platform.com',
        fromRole: 'Operations Manager',
        to: 'Dr. James Wilson & Community Hospital',
        date: '2024-01-18T15:30:00Z',
        message:
          'Both parties have agreed to a 50% cancellation fee. Payment of $4,000 will be released to Dr. Wilson. This dispute is now resolved.',
      },
    ],
  },
];
