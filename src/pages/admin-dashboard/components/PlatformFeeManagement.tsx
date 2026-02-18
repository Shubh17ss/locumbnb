import { useState } from 'react';

interface FeeConfiguration {
  id: string;
  feePercentage: number;
  effectiveDate: string;
  createdAt: string;
  createdBy: string;
  status: 'active' | 'scheduled' | 'expired';
  notes?: string;
}

interface DiscountOverride {
  id: string;
  facilityId: string;
  facilityName: string;
  discountPercentage: number;
  effectiveFeePercentage: number;
  startDate: string;
  endDate?: string;
  reason: string;
  approvedBy: string;
  approvedAt: string;
  status: 'active' | 'expired' | 'cancelled';
}

const PlatformFeeManagement = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'discounts'>('current');
  const [showNewFeeModal, setShowNewFeeModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [newFeePercentage, setNewFeePercentage] = useState('15');
  const [newFeeEffectiveDate, setNewFeeEffectiveDate] = useState('');
  const [newFeeNotes, setNewFeeNotes] = useState('');
  
  // Discount form state
  const [discountFacilityId, setDiscountFacilityId] = useState('');
  const [discountFacilityName, setDiscountFacilityName] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [discountStartDate, setDiscountStartDate] = useState('');
  const [discountEndDate, setDiscountEndDate] = useState('');
  const [discountReason, setDiscountReason] = useState('');

  const currentAdmin = {
    name: 'John Smith',
    role: 'Super Admin',
    id: 'ADMIN-001'
  };

  // Mock data - Replace with real API calls
  const currentFee: FeeConfiguration = {
    id: 'FEE-2024-001',
    feePercentage: 15,
    effectiveDate: '2024-01-01T00:00:00Z',
    createdAt: '2023-12-15T10:00:00Z',
    createdBy: 'System Administrator',
    status: 'active',
    notes: 'Standard platform fee for all transactions'
  };

  const feeHistory: FeeConfiguration[] = [
    {
      id: 'FEE-2024-001',
      feePercentage: 15,
      effectiveDate: '2024-01-01T00:00:00Z',
      createdAt: '2023-12-15T10:00:00Z',
      createdBy: 'System Administrator',
      status: 'active',
      notes: 'Standard platform fee for all transactions'
    },
    {
      id: 'FEE-2023-002',
      feePercentage: 12,
      effectiveDate: '2023-06-01T00:00:00Z',
      createdAt: '2023-05-20T14:30:00Z',
      createdBy: 'John Smith',
      status: 'expired',
      notes: 'Promotional rate for platform launch'
    },
    {
      id: 'FEE-2023-001',
      feePercentage: 10,
      effectiveDate: '2023-01-01T00:00:00Z',
      createdAt: '2022-12-10T09:00:00Z',
      createdBy: 'System Administrator',
      status: 'expired',
      notes: 'Initial platform fee'
    }
  ];

  const discountOverrides: DiscountOverride[] = [
    {
      id: 'DISC-2024-001',
      facilityId: 'FAC-001',
      facilityName: 'Memorial Hospital',
      discountPercentage: 20,
      effectiveFeePercentage: 12,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      reason: 'High-volume partner - 100+ assignments per year',
      approvedBy: 'John Smith (Super Admin)',
      approvedAt: '2023-12-20T15:30:00Z',
      status: 'active'
    },
    {
      id: 'DISC-2024-002',
      facilityId: 'FAC-002',
      facilityName: 'City Medical Center',
      discountPercentage: 10,
      effectiveFeePercentage: 13.5,
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-06-30T23:59:59Z',
      reason: 'New partner promotional rate - first 6 months',
      approvedBy: 'Sarah Johnson (Operations Manager)',
      approvedAt: '2024-01-25T11:00:00Z',
      status: 'active'
    },
    {
      id: 'DISC-2023-005',
      facilityId: 'FAC-005',
      facilityName: 'Regional Health System',
      discountPercentage: 15,
      effectiveFeePercentage: 12.75,
      startDate: '2023-09-01T00:00:00Z',
      endDate: '2023-12-31T23:59:59Z',
      reason: 'Q4 promotional campaign',
      approvedBy: 'John Smith (Super Admin)',
      approvedAt: '2023-08-28T16:45:00Z',
      status: 'expired'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCreateNewFee = () => {
    if (!newFeePercentage || !newFeeEffectiveDate) {
      alert('Please fill in all required fields');
      return;
    }

    const feeValue = parseFloat(newFeePercentage);
    if (isNaN(feeValue) || feeValue < 0 || feeValue > 100) {
      alert('Fee percentage must be between 0 and 100');
      return;
    }

    const auditLog = {
      action: 'CREATE_FEE_CONFIGURATION',
      adminName: currentAdmin.name,
      adminRole: currentAdmin.role,
      adminId: currentAdmin.id,
      timestamp: new Date().toISOString(),
      previousFee: currentFee.feePercentage,
      newFee: feeValue,
      effectiveDate: newFeeEffectiveDate,
      notes: newFeeNotes
    };

    console.log('Fee Configuration Audit Log:', auditLog);
    alert(`New platform fee of ${feeValue}% scheduled for ${formatDateOnly(newFeeEffectiveDate)}\n\nThis action has been logged with your admin identity.`);

    setShowNewFeeModal(false);
    setNewFeePercentage('15');
    setNewFeeEffectiveDate('');
    setNewFeeNotes('');
  };

  const handleCreateDiscount = () => {
    if (!discountFacilityId || !discountFacilityName || !discountPercentage || !discountStartDate || !discountReason) {
      alert('Please fill in all required fields');
      return;
    }

    const discountValue = parseFloat(discountPercentage);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      alert('Discount percentage must be between 0 and 100');
      return;
    }

    const effectiveFee = currentFee.feePercentage * (1 - discountValue / 100);

    const auditLog = {
      action: 'CREATE_DISCOUNT_OVERRIDE',
      adminName: currentAdmin.name,
      adminRole: currentAdmin.role,
      adminId: currentAdmin.id,
      timestamp: new Date().toISOString(),
      facilityId: discountFacilityId,
      facilityName: discountFacilityName,
      discountPercentage: discountValue,
      effectiveFeePercentage: effectiveFee,
      startDate: discountStartDate,
      endDate: discountEndDate || 'No end date',
      reason: discountReason
    };

    console.log('Discount Override Audit Log:', auditLog);
    alert(`Discount created for ${discountFacilityName}\n\nDiscount: ${discountValue}%\nEffective Fee: ${effectiveFee.toFixed(2)}%\n\nThis action has been logged with your admin identity.`);

    setShowDiscountModal(false);
    setDiscountFacilityId('');
    setDiscountFacilityName('');
    setDiscountPercentage('');
    setDiscountStartDate('');
    setDiscountEndDate('');
    setDiscountReason('');
  };

  const handleCancelDiscount = (discount: DiscountOverride) => {
    if (!confirm(`Are you sure you want to cancel the discount for ${discount.facilityName}?`)) {
      return;
    }

    const auditLog = {
      action: 'CANCEL_DISCOUNT_OVERRIDE',
      adminName: currentAdmin.name,
      adminRole: currentAdmin.role,
      adminId: currentAdmin.id,
      timestamp: new Date().toISOString(),
      discountId: discount.id,
      facilityId: discount.facilityId,
      facilityName: discount.facilityName,
      reason: 'Admin cancellation'
    };

    console.log('Discount Cancellation Audit Log:', auditLog);
    alert(`Discount cancelled for ${discount.facilityName}\n\nThis action has been logged with your admin identity.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Platform Fee Management</h2>
          <p className="text-slate-600 mt-1">Configure platform fees and manage facility discounts</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDiscountModal(true)}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-percent-line"></i>
            Create Discount
          </button>
          <button
            onClick={() => setShowNewFeeModal(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            Update Platform Fee
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'current'
                ? 'border-teal-600 text-teal-600 font-medium'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Current Configuration
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-teal-600 text-teal-600 font-medium'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Fee History
          </button>
          <button
            onClick={() => setActiveTab('discounts')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'discounts'
                ? 'border-teal-600 text-teal-600 font-medium'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Discount Overrides
            {discountOverrides.filter(d => d.status === 'active').length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-800 text-xs rounded-full">
                {discountOverrides.filter(d => d.status === 'active').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Current Configuration Tab */}
      {activeTab === 'current' && (
        <div className="space-y-6">
          {/* Current Fee Display */}
          <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl p-8 border-2 border-teal-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Current Platform Fee</h3>
                <p className="text-slate-600">Applied to all facility transactions</p>
              </div>
              <div className="text-right">
                <div className="text-6xl font-bold text-teal-600">{currentFee.feePercentage}%</div>
                <div className="text-sm text-slate-600 mt-2">Standard Rate</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-teal-200">
              <div>
                <div className="text-sm text-slate-600 mb-1">Effective Date</div>
                <div className="font-medium text-slate-900">{formatDateOnly(currentFee.effectiveDate)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Created By</div>
                <div className="font-medium text-slate-900">{currentFee.createdBy}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-slate-600 mb-1">Notes</div>
                <div className="font-medium text-slate-900">{currentFee.notes}</div>
              </div>
            </div>
          </div>

          {/* Fee Calculation Examples */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Fee Calculation Examples</h3>
            <div className="space-y-4">
              {[5000, 8000, 10000, 15000].map((amount) => {
                const fee = Math.round(amount * (currentFee.feePercentage / 100));
                const total = amount + fee;
                return (
                  <div key={amount} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">Assignment Value: ${amount.toLocaleString()}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Platform Fee ({currentFee.feePercentage}%): ${fee.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-600">Total Facility Cost</div>
                      <div className="text-xl font-bold text-teal-600">${total.toLocaleString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-blue-600 text-xl mt-0.5"></i>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Platform Fee Information</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Platform fee is charged to facilities only</li>
                  <li>Physicians receive 100% of the displayed assignment pay</li>
                  <li>Fee is automatically calculated and collected during escrow funding</li>
                  <li>All fee changes are logged with admin identity and timestamp</li>
                  <li>Fee changes can be scheduled for future effective dates</li>
                  <li>Individual facility discounts can be applied as overrides</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fee History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Platform Fee History</h3>
              <p className="text-sm text-slate-600 mt-1">Complete history of all platform fee configurations</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Fee ID</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Fee Percentage</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Effective Date</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Created By</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Created At</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {feeHistory.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 whitespace-nowrap">{fee.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-2xl font-bold text-teal-600 whitespace-nowrap">{fee.feePercentage}%</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{formatDateOnly(fee.effectiveDate)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{fee.createdBy}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{formatDate(fee.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                          fee.status === 'active' ? 'bg-green-100 text-green-800' :
                          fee.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 max-w-xs">{fee.notes}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Discount Overrides Tab */}
      {activeTab === 'discounts' && (
        <div className="space-y-6">
          {/* Active Discounts */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Active Discount Overrides</h3>
              <p className="text-sm text-slate-600 mt-1">Facility-specific fee discounts currently in effect</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Facility</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Discount</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Effective Fee</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Period</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Reason</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Approved By</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {discountOverrides.map((discount) => (
                    <tr key={discount.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 whitespace-nowrap">{discount.facilityName}</div>
                        <div className="text-sm text-slate-600 whitespace-nowrap">{discount.facilityId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xl font-bold text-teal-600 whitespace-nowrap">{discount.discountPercentage}%</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xl font-bold text-slate-900 whitespace-nowrap">{discount.effectiveFeePercentage}%</div>
                        <div className="text-sm text-slate-600 whitespace-nowrap">vs {currentFee.feePercentage}% standard</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{formatDateOnly(discount.startDate)}</div>
                        <div className="text-sm text-slate-600 whitespace-nowrap">
                          to {discount.endDate ? formatDateOnly(discount.endDate) : 'No end date'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 max-w-xs">{discount.reason}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{discount.approvedBy}</div>
                        <div className="text-sm text-slate-600 whitespace-nowrap">{formatDate(discount.approvedAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                          discount.status === 'active' ? 'bg-green-100 text-green-800' :
                          discount.status === 'expired' ? 'bg-slate-100 text-slate-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {discount.status === 'active' && (
                          <button
                            onClick={() => handleCancelDiscount(discount)}
                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Discount Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-amber-600 text-xl mt-0.5"></i>
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">Discount Override Guidelines</h4>
                <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                  <li>Discounts are applied as a percentage reduction of the standard platform fee</li>
                  <li>All discounts require Super Admin or Operations Manager approval</li>
                  <li>Discounts can be time-limited or ongoing</li>
                  <li>Common reasons: high-volume partners, new facility promotions, strategic partnerships</li>
                  <li>All discount actions are logged with admin identity and timestamp</li>
                  <li>Discounts can be cancelled at any time by authorized admins</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Fee Modal */}
      {showNewFeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Update Platform Fee</h3>
                <button
                  onClick={() => setShowNewFeeModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-alert-line text-amber-600 text-xl mt-0.5"></i>
                  <div>
                    <div className="font-semibold text-amber-900 mb-1">Important</div>
                    <p className="text-sm text-amber-800">
                      Changing the platform fee will affect all future transactions. This action will be logged with your admin identity and timestamp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Fee */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Current Platform Fee</div>
                <div className="text-3xl font-bold text-slate-900">{currentFee.feePercentage}%</div>
              </div>

              {/* New Fee Percentage */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  New Fee Percentage <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={newFeePercentage}
                    onChange={(e) => setNewFeePercentage(e.target.value)}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="15"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">%</div>
                </div>
              </div>

              {/* Effective Date */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Effective Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={newFeeEffectiveDate}
                  onChange={(e) => setNewFeeEffectiveDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="text-sm text-slate-600 mt-1">
                  The date when this fee will become active. Can be set to a future date.
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Notes
                </label>
                <textarea
                  value={newFeeNotes}
                  onChange={(e) => setNewFeeNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder="Reason for fee change, business justification, etc."
                />
              </div>

              {/* Admin Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-900">
                  <div className="font-semibold mb-1">This action will be logged as:</div>
                  <div>Admin: {currentAdmin.name}</div>
                  <div>Role: {currentAdmin.role}</div>
                  <div>Timestamp: {new Date().toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowNewFeeModal(false)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewFee}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
              >
                Update Platform Fee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Create Discount Override</h3>
                <button
                  onClick={() => setShowDiscountModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-information-line text-blue-600 text-xl mt-0.5"></i>
                  <div>
                    <p className="text-sm text-blue-800">
                      Create a custom discount for a specific facility. The discount will be applied as a percentage reduction of the standard {currentFee.feePercentage}% platform fee.
                    </p>
                  </div>
                </div>
              </div>

              {/* Facility ID */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Facility ID <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={discountFacilityId}
                  onChange={(e) => setDiscountFacilityId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="FAC-001"
                />
              </div>

              {/* Facility Name */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Facility Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={discountFacilityName}
                  onChange={(e) => setDiscountFacilityName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Memorial Hospital"
                />
              </div>

              {/* Discount Percentage */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Discount Percentage <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    min="0"
                    max="100"
                    step="1"
                    className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="20"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">%</div>
                </div>
                {discountPercentage && (
                  <p className="text-sm text-slate-600 mt-1">
                    Effective fee will be: {(currentFee.feePercentage * (1 - parseFloat(discountPercentage) / 100)).toFixed(2)}%
                  </p>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Start Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={discountStartDate}
                    onChange={(e) => setDiscountStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={discountEndDate}
                    onChange={(e) => setDiscountEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Reason <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder="High-volume partner, promotional campaign, strategic partnership, etc."
                />
              </div>

              {/* Admin Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-900">
                  <div className="font-semibold mb-1">This action will be logged as:</div>
                  <div>Admin: {currentAdmin.name}</div>
                  <div>Role: {currentAdmin.role}</div>
                  <div>Timestamp: {new Date().toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDiscountModal(false)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDiscount}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
              >
                Create Discount
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformFeeManagement;
