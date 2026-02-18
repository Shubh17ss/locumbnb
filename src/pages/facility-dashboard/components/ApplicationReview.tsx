// Facility Application Review Component

import { useState, useEffect } from 'react';
import type { Application } from '../../../types/application';
import { mockApplications } from '../../../mocks/applications';
import { isApplicationExpired } from '../../../utils/applicationMatcher';

export default function ApplicationReview() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionType, setDecisionType] = useState<'approve' | 'reject'>('approve');
  const [decisionReason, setDecisionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Filter applications by facility (mock - would filter by actual facility ID)
  const facilityApplications = applications;

  // Filter by status
  const filteredApplications = facilityApplications.filter(app => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const pendingCount = facilityApplications.filter(app => app.status === 'pending').length;
  const approvedCount = facilityApplications.filter(app => app.status === 'approved').length;
  const rejectedCount = facilityApplications.filter(app => app.status === 'rejected').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 24) {
      return `${hours}h ${minutes}m`;
    }

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  const getUrgencyColor = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const hoursRemaining = diff / (1000 * 60 * 60);

    if (hoursRemaining <= 0) return 'text-red-600';
    if (hoursRemaining <= 24) return 'text-red-600';
    if (hoursRemaining <= 48) return 'text-amber-600';
    return 'text-green-600';
  };

  const handleViewDetails = (app: Application) => {
    setSelectedApplication(app);
    setShowDetailsModal(true);
  };

  const handleDecisionClick = (app: Application, type: 'approve' | 'reject') => {
    setSelectedApplication(app);
    setDecisionType(type);
    setDecisionReason('');
    setShowDetailsModal(false);
    setShowDecisionModal(true);
  };

  const handleSubmitDecision = () => {
    if (!selectedApplication) return;

    if (decisionType === 'reject' && !decisionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    // Update application status
    setApplications(applications.map(app => 
      app.id === selectedApplication.id
        ? {
            ...app,
            status: decisionType === 'approve' ? 'approved' : 'rejected',
            facilityDecisionAt: new Date().toISOString(),
            decisionReason: decisionReason || undefined,
            calendarBlocked: decisionType === 'approve' ? true : false,
            notificationsSent: {
              ...app.notificationsSent,
              decision: true
            }
          }
        : app
    ));

    // Log decision
    console.log('Facility Decision:', {
      applicationId: selectedApplication.id,
      decision: decisionType,
      reason: decisionReason,
      timestamp: new Date().toISOString()
    });

    // Send notifications (would be handled by backend)
    if (decisionType === 'approve') {
      console.log('Sending approval notification to physician');
      console.log('Triggering contract workflow');
    } else {
      console.log('Sending rejection notification to physician');
      console.log('Unblocking physician calendar');
    }

    // Close modal and show success
    setShowDecisionModal(false);
    setSelectedApplication(null);
    alert(`Application ${decisionType === 'approve' ? 'approved' : 'rejected'} successfully. Physician has been notified.`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{facilityApplications.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-list-3-line text-2xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-2xl text-amber-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-2xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-close-line text-2xl text-red-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'pending'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'approved'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'rejected'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'all'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({facilityApplications.length})
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <i className="ri-inbox-line text-5xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {filterStatus === 'pending' && 'No applications are currently pending review.'}
              {filterStatus === 'approved' && 'No applications have been approved yet.'}
              {filterStatus === 'rejected' && 'No applications have been rejected.'}
              {filterStatus === 'all' && 'No applications have been received yet.'}
            </p>
          </div>
        ) : (
          filteredApplications.map(app => (
            <div key={app.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {app.physicianName}
                    </h4>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                      app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      app.status === 'approved' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {app.status === 'pending' ? 'Pending Review' :
                       app.status === 'approved' ? 'Approved' :
                       app.status === 'rejected' ? 'Rejected' :
                       app.status}
                    </span>
                    {app.profileSnapshot.verificationStatus === 'verified' && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <i className="ri-verified-badge-fill"></i>
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <i className="ri-stethoscope-line"></i>
                      <span>{app.physicianSpecialty}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="ri-award-line"></i>
                      <span>{app.profileSnapshot.professionalInfo.yearsExperience} years experience</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="ri-map-pin-line"></i>
                      <span>{app.profileSnapshot.licensure.map(l => l.state).join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <i className="ri-calendar-line"></i>
                      <span>
                        {formatDate(app.blockedDates.startDate)} - {formatDate(app.blockedDates.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="ri-time-line"></i>
                      <span>Applied {formatDateTime(app.appliedAt)}</span>
                    </div>
                  </div>
                </div>
                {app.status === 'pending' && (
                  <div className="text-right">
                    <div className={`text-sm font-medium mb-1 ${getUrgencyColor(app.reviewDeadline)}`}>
                      {getTimeRemaining(app.reviewDeadline)} remaining
                    </div>
                    <div className="text-xs text-gray-500">
                      Deadline: {formatDateTime(app.reviewDeadline)}
                    </div>
                  </div>
                )}
              </div>

              {/* Decision Deadline Warning */}
              {app.status === 'pending' && !isApplicationExpired(app.reviewDeadline) && (
                <div className={`rounded-lg p-3 mb-4 ${
                  getUrgencyColor(app.reviewDeadline) === 'text-red-600' 
                    ? 'bg-red-50 border border-red-200' 
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="flex items-center gap-2 text-sm">
                    <i className={`ri-alarm-warning-line ${
                      getUrgencyColor(app.reviewDeadline) === 'text-red-600' 
                        ? 'text-red-600' 
                        : 'text-blue-600'
                    }`}></i>
                    <span className={
                      getUrgencyColor(app.reviewDeadline) === 'text-red-600' 
                        ? 'text-red-900' 
                        : 'text-blue-900'
                    }>
                      <strong>Action Required:</strong> You must approve or reject this application within {getTimeRemaining(app.reviewDeadline)} or it will automatically expire.
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleViewDetails(app)}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap cursor-pointer"
                >
                  View Full Profile
                </button>
                {app.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDecisionClick(app, 'reject')}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleDecisionClick(app, 'approve')}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Physician Profile</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedApplication(null);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Legal Name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedApplication.profileSnapshot.personalInfo.legalName}
                    </span>
                  </div>
                  {selectedApplication.profileSnapshot.personalInfo.dba && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">DBA:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedApplication.profileSnapshot.personalInfo.dba}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedApplication.profileSnapshot.personalInfo.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedApplication.profileSnapshot.personalInfo.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Professional Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Specialty:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedApplication.profileSnapshot.professionalInfo.specialty}
                    </span>
                  </div>
                  {selectedApplication.profileSnapshot.professionalInfo.subspecialty && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Subspecialty:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedApplication.profileSnapshot.professionalInfo.subspecialty}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Board Status:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedApplication.profileSnapshot.professionalInfo.boardStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Years of Experience:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedApplication.profileSnapshot.professionalInfo.yearsExperience} years
                    </span>
                  </div>
                </div>
              </div>

              {/* Licensure */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Licensure</h3>
                <div className="space-y-3">
                  {selectedApplication.profileSnapshot.licensure.map((license, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{license.state} License</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          new Date(license.expirationDate) > new Date()
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {new Date(license.expirationDate) > new Date() ? 'Active' : 'Expired'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">License #:</span>
                        <span className="text-gray-900">{license.licenseNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Expires:</span>
                        <span className="text-gray-900">{formatDate(license.expirationDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CV/Resume:</span>
                    <button className="text-sm text-teal-600 hover:text-teal-700 font-medium cursor-pointer">
                      View Document
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">NPDB Report:</span>
                    <button className="text-sm text-teal-600 hover:text-teal-700 font-medium cursor-pointer">
                      View Document
                    </button>
                  </div>
                  {selectedApplication.profileSnapshot.documents.credentials.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Additional Credentials:</span>
                      <button className="text-sm text-teal-600 hover:text-teal-700 font-medium cursor-pointer">
                        View {selectedApplication.profileSnapshot.documents.credentials.length} Documents
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Digital Attestation */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Digital Attestation</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Signature:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedApplication.profileSnapshot.attestation.signature}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Signed At:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDateTime(selectedApplication.profileSnapshot.attestation.signedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">IP Address:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedApplication.profileSnapshot.attestation.ipAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              {selectedApplication.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleDecisionClick(selectedApplication, 'reject')}
                    className="flex-1 px-6 py-3 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleDecisionClick(selectedApplication, 'approve')}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Approve Application
                  </button>
                </>
              )}
              {selectedApplication.status !== 'pending' && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedApplication(null);
                  }}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {showDecisionModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {decisionType === 'approve' ? 'Approve Application' : 'Reject Application'}
                </h2>
                <button
                  onClick={() => {
                    setShowDecisionModal(false);
                    setSelectedApplication(null);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Physician:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedApplication.physicianName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assignment Dates:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(selectedApplication.blockedDates.startDate)} - {formatDate(selectedApplication.blockedDates.endDate)}
                  </span>
                </div>
              </div>

              {decisionType === 'approve' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Approval Actions</h4>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line mt-0.5"></i>
                      <span>Physician will be notified via email and dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line mt-0.5"></i>
                      <span>Contract will be automatically sent to physician</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line mt-0.5"></i>
                      <span>Digital signature workflow will be initiated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line mt-0.5"></i>
                      <span>Assignment will move to contract execution stage</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Rejection <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={decisionReason}
                    onChange={(e) => setDecisionReason(e.target.value)}
                    placeholder="Please provide a reason for rejecting this application..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-900">
                      <strong>Note:</strong> The physician will be notified of your decision and their calendar dates will be automatically unblocked.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowDecisionModal(false);
                  setSelectedApplication(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDecision}
                className={`flex-1 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  decisionType === 'approve'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Confirm {decisionType === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
