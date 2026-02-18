import { useState } from 'react';
import { CircumventionViolation, ViolationEvidence } from '../../../types/contract';
import { mockCircumventionViolations } from '../../../mocks/contracts';
import { updateViolationStatus, dismissViolation, issuePenaltyInvoice } from '../../../utils/contractManager';

const ContractEnforcement = () => {
  const [violations, setViolations] = useState<CircumventionViolation[]>(mockCircumventionViolations);
  const [selectedViolation, setSelectedViolation] = useState<CircumventionViolation | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'confirm' | 'dismiss' | 'invoice' | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  const filteredViolations = violations.filter(v => {
    if (filterStatus === 'all') return true;
    return v.status === filterStatus;
  });

  const getStatusColor = (status: CircumventionViolation['status']) => {
    switch (status) {
      case 'pending_review': return 'bg-amber-100 text-amber-800';
      case 'under_investigation': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-red-100 text-red-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      case 'penalty_applied': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPenaltyStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'invoiced': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-teal-100 text-teal-800';
      case 'in_collection': return 'bg-red-100 text-red-800';
      case 'waived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (type: 'confirm' | 'dismiss' | 'invoice', violation: CircumventionViolation) => {
    setSelectedViolation(violation);
    setActionType(type);
    setActionNotes('');
    setShowActionModal(true);
  };

  const executeAction = () => {
    if (!selectedViolation || !actionType) return;

    const adminId = 'admin-compliance-001';
    const adminRole = 'Compliance Manager';
    const ipAddress = '10.0.0.50';

    let updatedViolation: CircumventionViolation;

    switch (actionType) {
      case 'confirm':
        updatedViolation = updateViolationStatus(
          selectedViolation,
          'confirmed',
          adminId,
          adminRole,
          actionNotes || 'Violation confirmed after investigation',
          ipAddress
        );
        break;
      case 'dismiss':
        updatedViolation = dismissViolation(
          selectedViolation,
          actionNotes || 'Insufficient evidence',
          adminId,
          adminRole,
          ipAddress
        );
        break;
      case 'invoice':
        const result = issuePenaltyInvoice(selectedViolation, adminId, adminRole, ipAddress);
        updatedViolation = result.violation;
        break;
      default:
        return;
    }

    setViolations(violations.map(v => v.id === updatedViolation.id ? updatedViolation : v));
    setShowActionModal(false);
    setSelectedViolation(null);
    setActionType(null);
  };

  const stats = {
    total: violations.length,
    pending: violations.filter(v => v.status === 'pending_review').length,
    investigating: violations.filter(v => v.status === 'under_investigation').length,
    confirmed: violations.filter(v => v.status === 'confirmed').length,
    totalPenalties: violations
      .filter(v => v.status === 'confirmed' || v.status === 'penalty_applied')
      .reduce((sum, v) => sum + v.penaltyAmount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Contract Enforcement</h2>
        <p className="text-gray-600 mt-1">Non-circumvention violation tracking and penalty management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Violations</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
              <i className="ri-alert-line text-xl text-slate-700"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600">Pending Review</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-amber-200 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-xl text-amber-700"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Investigating</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.investigating}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <i className="ri-search-line text-xl text-blue-700"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Confirmed</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{stats.confirmed}</p>
            </div>
            <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center">
              <i className="ri-error-warning-line text-xl text-red-700"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Total Penalties</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">${(stats.totalPenalties / 1000).toFixed(0)}K</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-xl text-purple-700"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'pending_review', label: 'Pending' },
            { value: 'under_investigation', label: 'Investigating' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'dismissed', label: 'Dismissed' }
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterStatus === filter.value
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Violations Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Violation ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Violator</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Reported</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Penalty</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredViolations.map(violation => (
                <tr key={violation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-900">{violation.id.slice(0, 16)}...</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{violation.violatorId}</p>
                      <p className="text-xs text-gray-500 capitalize">{violation.violatorType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 capitalize">{violation.violationType.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{new Date(violation.reportedAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(violation.status)}`}>
                      {violation.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">${violation.penaltyAmount.toLocaleString()}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPenaltyStatusColor(violation.penaltyStatus)}`}>
                        {violation.penaltyStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedViolation(violation);
                          setShowDetailsModal(true);
                        }}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <i className="ri-eye-line text-lg"></i>
                      </button>
                      {violation.status === 'pending_review' && (
                        <button
                          onClick={() => handleAction('confirm', violation)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Confirm Violation"
                        >
                          <i className="ri-check-line text-lg"></i>
                        </button>
                      )}
                      {(violation.status === 'pending_review' || violation.status === 'under_investigation') && (
                        <button
                          onClick={() => handleAction('dismiss', violation)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Dismiss"
                        >
                          <i className="ri-close-line text-lg"></i>
                        </button>
                      )}
                      {violation.status === 'confirmed' && violation.penaltyStatus === 'pending' && (
                        <button
                          onClick={() => handleAction('invoice', violation)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Issue Invoice"
                        >
                          <i className="ri-file-list-line text-lg"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedViolation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Violation Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Violation ID</label>
                  <p className="text-sm text-gray-900 mt-1 font-mono">{selectedViolation.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Reported Date</label>
                  <p className="text-sm text-gray-900 mt-1">{new Date(selectedViolation.reportedAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Violator</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedViolation.violatorId} ({selectedViolation.violatorType})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Related Party</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedViolation.relatedPartyId} ({selectedViolation.relatedPartyType})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Violation Type</label>
                  <p className="text-sm text-gray-900 mt-1 capitalize">{selectedViolation.violationType.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 whitespace-nowrap ${getStatusColor(selectedViolation.status)}`}>
                    {selectedViolation.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-4 rounded-lg">{selectedViolation.description}</p>
              </div>

              {/* Evidence */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Evidence ({selectedViolation.evidence.length})</label>
                <div className="space-y-3">
                  {selectedViolation.evidence.map(evidence => (
                    <div key={evidence.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="ri-file-line text-lg text-teal-600"></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 capitalize">{evidence.type.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-gray-600 mt-1">{evidence.description}</p>
                          <p className="text-xs text-gray-500 mt-2">Uploaded: {new Date(evidence.uploadedAt).toLocaleString()}</p>
                          {evidence.fileUrl && (
                            <img src={evidence.fileUrl} alt="Evidence" className="mt-3 rounded-lg border border-gray-200 max-w-md" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Penalty Info */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="ri-money-dollar-circle-line text-lg text-red-600"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-900">Penalty Amount</p>
                    <p className="text-2xl font-bold text-red-900">${selectedViolation.penaltyAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-700">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getPenaltyStatusColor(selectedViolation.penaltyStatus)}`}>
                    {selectedViolation.penaltyStatus}
                  </span>
                </div>
                {selectedViolation.penaltyDueDate && (
                  <p className="text-sm text-red-700 mt-2">Due Date: {new Date(selectedViolation.penaltyDueDate).toLocaleDateString()}</p>
                )}
              </div>

              {/* Investigation Notes */}
              {selectedViolation.investigationNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Investigation Notes</label>
                  <p className="text-sm text-gray-900 mt-2 bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">{selectedViolation.investigationNotes}</p>
                </div>
              )}

              {/* Audit Log */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Audit Log</label>
                <div className="space-y-3">
                  {selectedViolation.auditLog.map((entry, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{entry.action}</span>
                          <span className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                        <p className="text-xs text-gray-500 mt-1">By: {entry.performedBy} ({entry.performedByRole})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedViolation && actionType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-gray-900">
                {actionType === 'confirm' && 'Confirm Violation'}
                {actionType === 'dismiss' && 'Dismiss Violation'}
                {actionType === 'invoice' && 'Issue Penalty Invoice'}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={4}
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder={
                    actionType === 'confirm' ? 'Explain why this violation is confirmed...' :
                    actionType === 'dismiss' ? 'Explain why this violation is dismissed...' :
                    'Add any notes about this invoice...'
                  }
                />
              </div>

              {actionType === 'invoice' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-900">
                    <strong>Penalty Amount:</strong> ${selectedViolation.penaltyAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-900 mt-2">
                    <strong>Payment Terms:</strong> 30 days from invoice date
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={executeAction}
                  className={`flex-1 px-6 py-3 rounded-lg text-white font-medium transition-colors whitespace-nowrap ${
                    actionType === 'confirm' ? 'bg-red-600 hover:bg-red-700' :
                    actionType === 'dismiss' ? 'bg-gray-600 hover:bg-gray-700' :
                    'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {actionType === 'confirm' && 'Confirm Violation'}
                  {actionType === 'dismiss' && 'Dismiss Violation'}
                  {actionType === 'invoice' && 'Issue Invoice'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractEnforcement;
