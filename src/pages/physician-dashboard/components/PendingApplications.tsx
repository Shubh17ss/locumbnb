import { useState, useEffect } from 'react';
import type { Application } from '../../../types/application';
import { supabase } from '../../../utils/supabaseClient';

export default function PendingApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setLoading(false);
        return;
      }

      // Get physician profile
      const { data: profile } = await supabase
        .from('physician_profiles')
        .select('id')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (!profile) {
        setLoading(false);
        return;
      }

      // TODO: Fetch applications from your database when table is created
      // const { data, error } = await supabase
      //   .from('applications')
      //   .select('*')
      //   .eq('physician_id', profile.id)
      //   .order('applied_at', { ascending: false });

      setApplications([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const pendingApps = applications.filter(app => app.status === 'pending');
  const expiredApps = applications.filter(app => app.status === 'expired');

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
      return `${hours}h ${minutes}m remaining`;
    }

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} remaining`;
  };

  const isApplicationExpired = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const handleWithdraw = (applicationId: string) => {
    if (confirm('Are you sure you want to withdraw this application? Your calendar dates will be unblocked.')) {
      setApplications(applications.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'withdrawn' as const, calendarBlocked: false }
          : app
      ));
    }
  };

  const handleViewDetails = (app: Application) => {
    setSelectedApplication(app);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <i className="ri-loader-4-line text-4xl text-teal-600 animate-spin"></i>
        <p className="mt-4 text-gray-600">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Applications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pending Review ({pendingApps.length})
        </h3>

        {pendingApps.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <i className="ri-file-list-3-line text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-600">No pending applications</p>
            <p className="text-sm text-gray-500 mt-1">Applications you submit will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApps.map(app => (
              <div key={app.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {app.profileSnapshot.professionalInfo.specialty}
                      </h4>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full whitespace-nowrap">
                        Under Review
                      </span>
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
                  <div className="text-right">
                    <div className={`text-sm font-medium mb-1 ${
                      isApplicationExpired(app.reviewDeadline) ? 'text-red-600' : 'text-teal-600'
                    }`}>
                      {getTimeRemaining(app.reviewDeadline)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Deadline: {formatDateTime(app.reviewDeadline)}
                    </div>
                  </div>
                </div>

                {/* Calendar Block Notice */}
                {app.calendarBlocked && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-blue-900">
                      <i className="ri-lock-line"></i>
                      <span>
                        <strong>Calendar Blocked:</strong> These dates are temporarily blocked while the facility reviews your application.
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleViewDetails(app)}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleWithdraw(app.id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors whitespace-nowrap"
                  >
                    Withdraw Application
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expired Applications */}
      {expiredApps.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expired ({expiredApps.length})
          </h3>
          <div className="space-y-4">
            {expiredApps.map(app => (
              <div key={app.id} className="bg-gray-50 rounded-lg border border-gray-200 p-6 opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-700">
                        {app.profileSnapshot.professionalInfo.specialty}
                      </h4>
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap">
                        Expired
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
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
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-600 mb-1">
                      No Response
                    </div>
                    <div className="text-xs text-gray-500">
                      Expired {formatDateTime(app.reviewDeadline)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="ri-unlock-line"></i>
                    <span>Calendar dates have been automatically unblocked</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedApplication(null);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Status</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Current Status:</span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      {selectedApplication.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Applied:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDateTime(selectedApplication.appliedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Review Deadline:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDateTime(selectedApplication.reviewDeadline)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignment Dates */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Assignment Dates</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dates:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(selectedApplication.blockedDates.startDate)} - {formatDate(selectedApplication.blockedDates.endDate)}
                    </span>
                  </div>
                  {selectedApplication.calendarBlocked && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-blue-900">
                        <i className="ri-lock-line"></i>
                        <span>Calendar blocked for these dates</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Snapshot */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Submitted Profile</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedApplication.profileSnapshot.personalInfo.legalName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Specialty:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedApplication.profileSnapshot.professionalInfo.specialty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Experience:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedApplication.profileSnapshot.professionalInfo.yearsExperience} years
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Licenses:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedApplication.profileSnapshot.licensure.map(l => l.state).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Verification:</span>
                    <span className={`text-sm font-medium ${
                      selectedApplication.profileSnapshot.verificationStatus === 'verified' 
                        ? 'text-green-600' 
                        : 'text-amber-600'
                    }`}>
                      {selectedApplication.profileSnapshot.verificationStatus === 'verified' ? '✓ Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Notifications</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Application Received:</span>
                    <span className={selectedApplication.notificationsSent.applicationReceived ? 'text-green-600' : 'text-gray-400'}>
                      {selectedApplication.notificationsSent.applicationReceived ? '✓ Sent' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Facility Notified:</span>
                    <span className="text-green-600">✓ Sent</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedApplication(null);
                }}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
