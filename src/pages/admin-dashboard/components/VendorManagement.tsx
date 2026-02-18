import { useState } from 'react';
import type { Vendor, VendorPerformanceMetrics } from '../../../types/vendor';
import { mockVendors, mockVendorPerformance } from '../../../mocks/vendors';

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const performanceMetrics = mockVendorPerformance;

  const handleApproveVendor = (vendorId: string) => {
    setVendors(prev => prev.map(v => 
      v.id === vendorId 
        ? { ...v, status: 'approved', approvedAt: new Date().toISOString(), approvedBy: 'admin-001' }
        : v
    ));
    alert('Vendor approved successfully');
  };

  const handleSuspendVendor = (vendorId: string) => {
    const reason = prompt('Enter reason for suspension:');
    if (!reason) return;

    setVendors(prev => prev.map(v => 
      v.id === vendorId 
        ? { ...v, status: 'suspended', updatedAt: new Date().toISOString() }
        : v
    ));
    alert('Vendor suspended');
  };

  const handleRemoveVendor = (vendorId: string) => {
    if (!confirm('Are you sure you want to remove this vendor? This action cannot be undone.')) return;

    setVendors(prev => prev.map(v => 
      v.id === vendorId 
        ? { ...v, status: 'removed', updatedAt: new Date().toISOString() }
        : v
    ));
    alert('Vendor removed from platform');
  };

  const handleUpdateDataAccess = (vendorId: string) => {
    alert('Data access scope updated. All changes are logged and auditable.');
  };

  const getVendorTypeIcon = (type: string) => {
    switch (type) {
      case 'insurance': return 'ri-shield-check-line';
      case 'travel': return 'ri-flight-takeoff-line';
      case 'lodging': return 'ri-hotel-line';
      default: return 'ri-service-line';
    }
  };

  const getVendorTypeLabel = (type: string) => {
    switch (type) {
      case 'insurance': return 'Insurance';
      case 'travel': return 'Travel';
      case 'lodging': return 'Lodging';
      default: return 'Other';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending_approval': return 'bg-amber-100 text-amber-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      case 'removed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 90) return 'text-teal-600';
    if (score >= 85) return 'text-blue-600';
    if (score >= 80) return 'text-amber-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return 'ri-arrow-up-line text-green-600';
      case 'declining': return 'ri-arrow-down-line text-red-600';
      default: return 'ri-subtract-line text-gray-600';
    }
  };

  const filteredVendors = vendors.filter(v => {
    if (filterType !== 'all' && v.type !== filterType) return false;
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    return true;
  });

  const getPerformanceMetrics = (vendorId: string): VendorPerformanceMetrics | undefined => {
    return performanceMetrics.find(p => p.vendorId === vendorId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vendor Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Approve, monitor, and manage third-party service vendors
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedVendor(null);
            setShowVendorModal(true);
          }}
          className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>
          Add Vendor
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vendors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{vendors.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-store-line text-2xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {vendors.filter(v => v.status === 'approved').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-checkbox-circle-line text-2xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">
                {vendors.filter(v => v.status === 'pending_approval').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-2xl text-amber-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-3xl font-bold text-teal-600 mt-2">
                {(vendors.reduce((sum, v) => sum + v.averageResponseTime, 0) / vendors.length).toFixed(1)}h
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <i className="ri-timer-line text-2xl text-teal-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-2">Vendor Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="insurance">Insurance</option>
              <option value="travel">Travel</option>
              <option value="lodging">Lodging</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="suspended">Suspended</option>
              <option value="removed">Removed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Reliability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVendors.map((vendor) => {
                const metrics = getPerformanceMetrics(vendor.id);
                return (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          vendor.status === 'approved' ? 'bg-teal-100' : 'bg-gray-100'
                        }`}>
                          <i className={`${getVendorTypeIcon(vendor.type)} text-xl ${
                            vendor.status === 'approved' ? 'text-teal-600' : 'text-gray-400'
                          }`}></i>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-semibold text-gray-900">{vendor.name}</p>
                          <p className="text-xs text-gray-600">{vendor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{getVendorTypeLabel(vendor.type)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(vendor.status)}`}>
                        {vendor.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`text-lg font-bold ${getReliabilityColor(vendor.reliabilityScore)}`}>
                          {vendor.reliabilityScore}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">/100</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              vendor.reliabilityScore >= 95 ? 'bg-green-600' :
                              vendor.reliabilityScore >= 90 ? 'bg-teal-600' :
                              vendor.reliabilityScore >= 85 ? 'bg-blue-600' :
                              vendor.reliabilityScore >= 80 ? 'bg-amber-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${vendor.reliabilityScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {metrics ? (
                        <div className="space-y-1">
                          <div className="flex items-center text-xs">
                            <span className="text-gray-600 w-20">Response:</span>
                            <span className="font-medium text-gray-900">{metrics.averageResponseTime.toFixed(1)}h</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <span className="text-gray-600 w-20">Accept Rate:</span>
                            <span className="font-medium text-gray-900">{metrics.quoteAcceptanceRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <span className="text-gray-600 w-20">Trend:</span>
                            <i className={`${getTrendIcon(metrics.reliabilityTrend)} text-sm`}></i>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No data</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setShowVendorModal(true);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <i className="ri-eye-line text-lg"></i>
                        </button>

                        {vendor.status === 'pending_approval' && (
                          <button
                            onClick={() => handleApproveVendor(vendor.id)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve Vendor"
                          >
                            <i className="ri-check-line text-lg"></i>
                          </button>
                        )}

                        {vendor.status === 'approved' && (
                          <button
                            onClick={() => handleSuspendVendor(vendor.id)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Suspend Vendor"
                          >
                            <i className="ri-pause-circle-line text-lg"></i>
                          </button>
                        )}

                        <button
                          onClick={() => handleRemoveVendor(vendor.id)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Vendor"
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Details Modal */}
      {showVendorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedVendor ? 'Vendor Details' : 'Add New Vendor'}
              </h3>
              <button
                onClick={() => setShowVendorModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            {selectedVendor && (
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Vendor Name</label>
                      <p className="text-sm text-gray-900">{selectedVendor.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <p className="text-sm text-gray-900">{getVendorTypeLabel(selectedVendor.type)}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-900">{selectedVendor.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-sm text-gray-900">{selectedVendor.phone}</p>
                    </div>
                    {selectedVendor.website && (
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
                        <a href={selectedVendor.website} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:underline">
                          {selectedVendor.website}
                        </a>
                      </div>
                    )}
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <p className="text-sm text-gray-900">{selectedVendor.description}</p>
                    </div>
                  </div>
                </div>

                {/* Services Offered */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Services Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVendor.servicesOffered.map((service, idx) => (
                      <span key={idx} className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Data Access Scope */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Data Access Scope</h4>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <i className="ri-shield-keyhole-line text-amber-600 mt-0.5 mr-3"></i>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-amber-900 mb-2">Authorized Data Access</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedVendor.dataAccessScope.map((scope, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white border border-amber-300 text-amber-800 text-xs rounded">
                              {scope.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleUpdateDataAccess(selectedVendor.id)}
                          className="mt-3 text-xs text-amber-700 hover:text-amber-900 font-medium"
                        >
                          <i className="ri-edit-line mr-1"></i>
                          Update Access Scope
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                {(() => {
                  const metrics = getPerformanceMetrics(selectedVendor.id);
                  return metrics ? (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 mb-1">Avg Response Time</p>
                          <p className="text-2xl font-bold text-gray-900">{metrics.averageResponseTime.toFixed(1)}h</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 mb-1">Quote Accept Rate</p>
                          <p className="text-2xl font-bold text-gray-900">{metrics.quoteAcceptanceRate.toFixed(1)}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 mb-1">Completion Rate</p>
                          <p className="text-2xl font-bold text-gray-900">{metrics.serviceCompletionRate.toFixed(1)}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 mb-1">Total Quotes</p>
                          <p className="text-2xl font-bold text-gray-900">{metrics.totalQuotesSubmitted}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 mb-1">Revenue Generated</p>
                          <p className="text-2xl font-bold text-gray-900">${(metrics.revenueGenerated / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 mb-1">Platform Fees</p>
                          <p className="text-2xl font-bold text-teal-600">${(metrics.platformFeesCollected / 1000).toFixed(0)}K</p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Approval Info */}
                {selectedVendor.approvedAt && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <i className="ri-checkbox-circle-line text-green-600 mt-0.5 mr-3"></i>
                      <div>
                        <p className="text-xs font-medium text-green-900">Approved Vendor</p>
                        <p className="text-xs text-green-700 mt-1">
                          Approved on {new Date(selectedVendor.approvedAt).toLocaleDateString()} by {selectedVendor.approvedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="p-6 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowVendorModal(false)}
                className="flex-1 px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Close
              </button>
              {selectedVendor && selectedVendor.status === 'approved' && (
                <button
                  onClick={() => {
                    handleSuspendVendor(selectedVendor.id);
                    setShowVendorModal(false);
                  }}
                  className="flex-1 px-6 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
                >
                  Suspend Vendor
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
