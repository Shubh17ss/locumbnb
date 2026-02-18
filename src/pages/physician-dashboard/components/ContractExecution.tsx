import { useState, useEffect } from 'react';
import { Contract } from '../../../types/contract';
import { mockContracts } from '../../../mocks/contracts';
import { signContract, validateContractForSigning, getContractAuditTrail } from '../../../utils/contractManager';

const ContractExecution = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [typedSignature, setTypedSignature] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'signed' | 'executed'>('pending');

  // Mock physician data
  const physicianId = 'PHY-001';
  const physicianName = 'Dr. Sarah Johnson';

  useEffect(() => {
    // Load contracts for this physician
    const physicianContracts = mockContracts.filter(c => c.physicianId === physicianId);
    setContracts(physicianContracts);
  }, []);

  const pendingContracts = contracts.filter(c => c.status === 'pending_physician');
  const signedContracts = contracts.filter(c => c.status === 'pending_facility');
  const executedContracts = contracts.filter(c => c.status === 'fully_executed');

  const handleSignClick = (contract: Contract) => {
    setSelectedContract(contract);
    setShowSignModal(true);
    setTypedSignature('');
    setAgreeToTerms(false);
    setError('');
  };

  const handleViewDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setShowDetailsModal(true);
  };

  const handleSign = async () => {
    if (!selectedContract) return;

    setError('');

    // Validate
    const validation = validateContractForSigning(selectedContract, 'physician');
    if (!validation.valid) {
      setError(validation.error || 'Cannot sign contract');
      return;
    }

    if (!typedSignature.trim()) {
      setError('Please type your full legal name');
      return;
    }

    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setSigning(true);

    try {
      // Sign the contract
      const signedContract = await signContract(
        selectedContract,
        'physician',
        physicianId,
        physicianName,
        typedSignature
      );

      // Update contracts list
      setContracts(prev => prev.map(c => 
        c.contractId === signedContract.contractId ? signedContract : c
      ));

      setShowSignModal(false);
      setSelectedContract(null);

      // Show success message
      alert('Contract signed successfully! The facility will be notified.');
    } catch (err: any) {
      setError(err.message || 'Failed to sign contract');
    } finally {
      setSigning(false);
    }
  };

  const getStatusBadge = (status: Contract['status']) => {
    switch (status) {
      case 'pending_physician':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">Awaiting Your Signature</span>;
      case 'pending_facility':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Awaiting Facility Signature</span>;
      case 'fully_executed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Fully Executed</span>;
      case 'expired':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Expired</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderContractCard = (contract: Contract) => {
    const daysUntilExpiry = getDaysUntilExpiry(contract.expiresAt);
    const isUrgent = daysUntilExpiry <= 2 && contract.status !== 'fully_executed';

    return (
      <div key={contract.contractId} className={`bg-white rounded-lg border-2 p-6 ${isUrgent ? 'border-red-300' : 'border-gray-200'}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{contract.title}</h3>
            {getStatusBadge(contract.status)}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-teal-600">${contract.payAmount.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Pay</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Assignment Dates</div>
            <div className="font-medium text-gray-900">
              {formatDate(contract.assignmentDates.startDate)} - {formatDate(contract.assignmentDates.endDate)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Specialty</div>
            <div className="font-medium text-gray-900">{contract.specialty}</div>
          </div>
        </div>

        {contract.status !== 'fully_executed' && (
          <div className={`p-3 rounded-lg mb-4 ${isUrgent ? 'bg-red-50' : 'bg-blue-50'}`}>
            <div className="flex items-center gap-2">
              <i className={`ri-time-line text-lg ${isUrgent ? 'text-red-600' : 'text-blue-600'}`}></i>
              <span className={`text-sm font-medium ${isUrgent ? 'text-red-700' : 'text-blue-700'}`}>
                {daysUntilExpiry > 0 ? `${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} remaining to sign` : 'Expires today'}
              </span>
            </div>
          </div>
        )}

        {contract.physicianSignature && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <i className="ri-checkbox-circle-fill text-green-600"></i>
              <span className="text-sm font-medium text-green-700">You signed on {formatDateTime(contract.physicianSignature.signedAt)}</span>
            </div>
          </div>
        )}

        {contract.facilitySignature && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <i className="ri-checkbox-circle-fill text-green-600"></i>
              <span className="text-sm font-medium text-green-700">Facility signed on {formatDateTime(contract.facilitySignature.signedAt)}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => handleViewDetails(contract)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm whitespace-nowrap"
          >
            <i className="ri-file-text-line mr-2"></i>
            View Contract
          </button>
          {contract.status === 'pending_physician' && (
            <button
              onClick={() => handleSignClick(contract)}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm whitespace-nowrap"
            >
              <i className="ri-quill-pen-line mr-2"></i>
              Sign Contract
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
            <i className="ri-file-text-line text-2xl text-teal-600"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contract Execution</h2>
            <p className="text-gray-600">Review and sign assignment contracts</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border-2 border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'pending'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="ri-time-line mr-2"></i>
            Awaiting Your Signature ({pendingContracts.length})
          </button>
          <button
            onClick={() => setActiveTab('signed')}
            className={`flex-1 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'signed'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="ri-checkbox-line mr-2"></i>
            Awaiting Facility ({signedContracts.length})
          </button>
          <button
            onClick={() => setActiveTab('executed')}
            className={`flex-1 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'executed'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="ri-checkbox-circle-line mr-2"></i>
            Fully Executed ({executedContracts.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingContracts.length === 0 ? (
                <div className="text-center py-12">
                  <i className="ri-file-text-line text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">No contracts awaiting your signature</p>
                </div>
              ) : (
                pendingContracts.map(renderContractCard)
              )}
            </div>
          )}

          {activeTab === 'signed' && (
            <div className="space-y-4">
              {signedContracts.length === 0 ? (
                <div className="text-center py-12">
                  <i className="ri-checkbox-line text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">No contracts awaiting facility signature</p>
                </div>
              ) : (
                signedContracts.map(renderContractCard)
              )}
            </div>
          )}

          {activeTab === 'executed' && (
            <div className="space-y-4">
              {executedContracts.length === 0 ? (
                <div className="text-center py-12">
                  <i className="ri-checkbox-circle-line text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">No fully executed contracts</p>
                </div>
              ) : (
                executedContracts.map(renderContractCard)
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sign Modal */}
      {showSignModal && selectedContract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Sign Contract</h3>
                <button
                  onClick={() => setShowSignModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contract Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">{selectedContract.title}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Assignment Dates:</span>
                    <div className="font-medium text-gray-900">
                      {formatDate(selectedContract.assignmentDates.startDate)} - {formatDate(selectedContract.assignmentDates.endDate)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Pay:</span>
                    <div className="font-medium text-gray-900">${selectedContract.payAmount.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Cancellation Policy</h4>
                <div className="space-y-2 text-sm">
                  {selectedContract.cancellationPolicy.physicianWindows.map((window, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-gray-600">
                        {window.daysBeforeStart > 0 ? `${window.daysBeforeStart}+ days before` : 'Less than 7 days'}:
                      </span>
                      <span className="font-medium text-gray-900">{window.penaltyPercentage}% penalty</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Signature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Signature <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Type your full legal name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-2">
                  By typing your name, you are creating a legally binding digital signature
                </p>
              </div>

              {/* Terms Agreement */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">
                    I have reviewed the contract and agree to all terms and conditions, including the cancellation policy. 
                    I understand this is a legally binding agreement and my signature will be timestamped and recorded with my IP address and device information for audit purposes.
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <i className="ri-error-warning-line text-lg"></i>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowSignModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleSign}
                disabled={signing}
                className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {signing ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Signing...
                  </>
                ) : (
                  <>
                    <i className="ri-quill-pen-line mr-2"></i>
                    Sign Contract
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedContract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Contract Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contract Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Contract Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Contract ID</div>
                      <div className="font-medium text-gray-900">{selectedContract.contractId}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <div>{getStatusBadge(selectedContract.status)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Created</div>
                      <div className="font-medium text-gray-900">{formatDateTime(selectedContract.createdAt)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Version</div>
                      <div className="font-medium text-gray-900">v{selectedContract.currentVersion}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Signatures</h4>
                <div className="space-y-3">
                  {selectedContract.physicianSignature ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="ri-checkbox-circle-fill text-green-600"></i>
                        <span className="font-medium text-green-700">Physician Signature</span>
                      </div>
                      <div className="text-sm space-y-1 text-gray-700">
                        <div><strong>Name:</strong> {selectedContract.physicianSignature.signerName}</div>
                        <div><strong>Signed:</strong> {formatDateTime(selectedContract.physicianSignature.signedAt)}</div>
                        <div><strong>IP Address:</strong> {selectedContract.physicianSignature.ipAddress}</div>
                        <div><strong>Device:</strong> {selectedContract.physicianSignature.deviceInfo.browser} on {selectedContract.physicianSignature.deviceInfo.platform}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <i className="ri-time-line"></i>
                        <span className="font-medium">Physician signature pending</span>
                      </div>
                    </div>
                  )}

                  {selectedContract.facilitySignature ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="ri-checkbox-circle-fill text-green-600"></i>
                        <span className="font-medium text-green-700">Facility Signature</span>
                      </div>
                      <div className="text-sm space-y-1 text-gray-700">
                        <div><strong>Name:</strong> {selectedContract.facilitySignature.signerName}</div>
                        <div><strong>Signed:</strong> {formatDateTime(selectedContract.facilitySignature.signedAt)}</div>
                        <div><strong>IP Address:</strong> {selectedContract.facilitySignature.ipAddress}</div>
                        <div><strong>Device:</strong> {selectedContract.facilitySignature.deviceInfo.browser} on {selectedContract.facilitySignature.deviceInfo.platform}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <i className="ri-time-line"></i>
                        <span className="font-medium">Facility signature pending</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Trail */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Audit Trail</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {getContractAuditTrail(selectedContract).map((log, idx) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{log.action.replace(/_/g, ' ')}</div>
                          <div className="text-gray-600">{log.details}</div>
                          <div className="text-gray-500 text-xs mt-1">
                            {log.formattedTimestamp} • {log.userRole} • IP: {log.ipAddress}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Document Link */}
              <div>
                <a
                  href={selectedContract.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium whitespace-nowrap"
                >
                  <i className="ri-download-line"></i>
                  Download Contract PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractExecution;