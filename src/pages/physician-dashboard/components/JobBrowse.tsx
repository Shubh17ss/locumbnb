// Job Browse and Application Component for Physician Dashboard

import { useState, useEffect } from 'react';
import type { JobPosting, Application, OverlapCheck } from '../../../types/application';
import { 
  checkDateOverlap, 
  createProfileSnapshot,
  calculateReviewDeadline,
  createCalendarBlock,
  validateJobRequirements,
  getDeviceInfo,
  getIPAddress
} from '../../../utils/applicationMatcher';
import { mockJobPostings, mockApplications, mockCalendarBlocks } from '../../../mocks/applications';
import { useProfileCompletion } from '../../../hooks/useProfileCompletion';

interface JobBrowseProps {
  physicianId: string;
}

export default function JobBrowse({ physicianId }: JobBrowseProps) {
  const { profile, isProfileComplete, completionPercentage } = useProfileCompletion();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(mockJobPostings);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [calendarBlocks, setCalendarBlocks] = useState(mockCalendarBlocks);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationError, setApplicationError] = useState<string>('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'pay'>('date');

  // Filter and sort job postings
  const filteredJobs = jobPostings
    .filter(job => job.status === 'open')
    .filter(job => filterSpecialty === 'all' || job.specialty === filterSpecialty)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      return b.payAmount - a.payAmount;
    });

  // Get unique specialties for filter
  const specialties = Array.from(new Set(jobPostings.map(job => job.specialty)));

  const handleApplyClick = (job: JobPosting) => {
    setSelectedJob(job);
    setApplicationError('');
    
    // Check profile completion
    if (!isProfileComplete) {
      setApplicationError(`Profile incomplete (${completionPercentage}% complete). You must complete all required sections before applying.`);
      setShowApplicationModal(true);
      return;
    }

    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob || !profile) return;

    try {
      // Final profile check
      if (!isProfileComplete) {
        setApplicationError(`Cannot apply. Profile is only ${completionPercentage}% complete. Please complete all required sections.`);
        return;
      }

      // Check for date overlaps
      const overlapCheck: OverlapCheck = checkDateOverlap(
        physicianId,
        selectedJob.startDate,
        selectedJob.endDate,
        applications,
        calendarBlocks
      );

      if (overlapCheck.hasOverlap) {
        setApplicationError('Cannot apply. You have overlapping applications or assignments for these dates.');
        return;
      }

      // Get IP and device info
      const ipAddress = await getIPAddress();
      const deviceInfo = getDeviceInfo();

      // Create profile snapshot from real profile data
      const profileSnapshot = {
        personalInfo: {
          legalName: profile.personalIdentifiers 
            ? `${profile.personalIdentifiers.firstName} ${profile.personalIdentifiers.lastName}`
            : 'Unknown',
          dateOfBirth: profile.personalIdentifiers?.dateOfBirth || '',
          ssnLastFour: profile.personalIdentifiers?.ssnLastFour || '',
          contactInfo: {
            phone: profile.personalIdentifiers?.phoneNumber || '',
            email: '',
            address: profile.personalIdentifiers?.address || {
              line1: '',
              line2: '',
              city: '',
              state: '',
              zipCode: ''
            }
          }
        },
        professionalInfo: {
          npiNumber: profile.professionalInformation?.npiNumber || '',
          deaNumber: profile.professionalInformation?.deaNumber || '',
          specialty: profile.professionalInformation?.specialty || '',
          subspecialty: profile.professionalInformation?.subspecialty || '',
          yearsExperience: profile.professionalInformation?.yearsExperience || 0,
          boardCertified: profile.professionalInformation?.boardCertified || false
        },
        licenses: profile.licenses || [],
        documents: profile.documents || [],
        questionnaires: profile.questionnaires || [],
        digitalSignature: profile.digitalSignature || null,
        capturedAt: new Date().toISOString(),
        ipAddress,
        deviceInfo
      };

      // Calculate review deadline (72 hours)
      const appliedAt = new Date();
      const reviewDeadline = calculateReviewDeadline(appliedAt, 72);

      // Create application
      const newApplication: Application = {
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        jobPostingId: selectedJob.id,
        physicianId,
        physicianName: profileSnapshot.personalInfo.legalName,
        physicianSpecialty: profileSnapshot.professionalInfo.specialty,
        status: 'pending',
        appliedAt: appliedAt.toISOString(),
        reviewDeadline,
        calendarBlocked: true,
        blockedDates: {
          startDate: selectedJob.startDate,
          endDate: selectedJob.endDate
        },
        profileSnapshot,
        notificationsSent: {
          applicationReceived: false,
          reminderSent: false,
          deadlineWarning: false,
          decision: false
        }
      };

      // Create calendar block
      const calendarBlock = createCalendarBlock(
        physicianId,
        newApplication.id,
        selectedJob.id,
        selectedJob.startDate,
        selectedJob.endDate,
        reviewDeadline
      );

      // Update state
      setApplications([...applications, newApplication]);
      setCalendarBlocks([...calendarBlocks, calendarBlock]);

      // Send notifications (would be handled by backend)
      console.log('Application submitted:', newApplication);
      console.log('Calendar blocked:', calendarBlock);
      console.log('Facility notification sent');
      console.log('Physician confirmation sent');

      // Close modal
      setShowApplicationModal(false);
      setSelectedJob(null);

      // Show success message
      alert('Application submitted successfully! The facility has 72 hours to review. Your calendar has been blocked for these dates.');

    } catch (error) {
      console.error('Application error:', error);
      setApplicationError('An error occurred while submitting your application. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Profile Eligibility Warning */}
      {!isProfileComplete && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <i className="ri-error-warning-line text-xl text-red-600 mt-0.5"></i>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">Profile Incomplete - Cannot Apply</h3>
              <p className="text-sm text-red-700 mb-2">
                You must complete your profile before applying to assignments. Your profile is currently {completionPercentage}% complete.
              </p>
              <p className="text-sm text-red-600 font-medium">
                Complete all required sections to unlock the ability to apply.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Specialty</label>
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'pay')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="date">Start Date</option>
                <option value="pay">Pay Amount</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'assignment' : 'assignments'} available
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-teal-500 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{job.facilityName}</h3>
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full whitespace-nowrap">
                    {job.specialty}
                  </span>
                  {job.subspecialty && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap">
                      {job.subspecialty}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <i className="ri-calendar-line"></i>
                    <span>{formatDate(job.startDate)} - {formatDate(job.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-time-line"></i>
                    <span>{job.blockDuration} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-map-pin-line"></i>
                    <span>{job.requiredLicenses.join(', ')} license required</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-600 mb-1">{formatCurrency(job.payAmount)}</div>
                <div className="text-xs text-gray-500">Total compensation</div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 line-clamp-2">{job.requirements}</p>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <i className={`ri-shield-check-line ${job.malpracticeIncluded ? 'text-green-600' : 'text-gray-400'}`}></i>
                <span className={job.malpracticeIncluded ? 'text-green-700' : 'text-gray-500'}>
                  Malpractice {job.malpracticeIncluded ? 'Included' : 'Not Included'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <i className={`ri-flight-takeoff-line ${job.travelIncluded ? 'text-green-600' : 'text-gray-400'}`}></i>
                <span className={job.travelIncluded ? 'text-green-700' : 'text-gray-500'}>
                  Travel {job.travelIncluded ? 'Included' : 'Not Included'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <i className={`ri-hotel-line ${job.lodgingIncluded ? 'text-green-600' : 'text-gray-400'}`}></i>
                <span className={job.lodgingIncluded ? 'text-green-700' : 'text-gray-500'}>
                  Lodging {job.lodgingIncluded ? 'Included' : 'Not Included'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Posted {formatDate(job.createdAt)}
              </div>
              <button
                onClick={() => handleApplyClick(job)}
                disabled={!isProfileComplete}
                className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isProfileComplete
                    ? 'bg-teal-600 text-white hover:bg-teal-700 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProfileComplete ? 'Apply Now' : 'Complete Profile to Apply'}
              </button>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <i className="ri-briefcase-line text-5xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new opportunities.</p>
          </div>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Apply to Assignment</h2>
                <button
                  onClick={() => {
                    setShowApplicationModal(false);
                    setSelectedJob(null);
                    setApplicationError('');
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Error Message */}
              {applicationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <i className="ri-error-warning-line text-xl text-red-600"></i>
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1">Cannot Submit Application</h4>
                      <p className="text-sm text-red-700">{applicationError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Job Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Assignment Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Facility:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedJob.facilityName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Specialty:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedJob.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dates:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(selectedJob.startDate)} - {formatDate(selectedJob.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Compensation:</span>
                    <span className="text-sm font-medium text-teal-600">{formatCurrency(selectedJob.payAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Application Terms */}
              {isProfileComplete && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Application Terms</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <i className="ri-information-line text-blue-600 mt-0.5"></i>
                      <p className="text-blue-900">
                        <strong>Calendar Block:</strong> These dates will be automatically blocked on your calendar upon submission.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-time-line text-blue-600 mt-0.5"></i>
                      <p className="text-blue-900">
                        <strong>Review Period:</strong> The facility has 72 hours to review your application.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-lock-line text-blue-600 mt-0.5"></i>
                      <p className="text-blue-900">
                        <strong>Temporary Lock:</strong> You cannot apply to overlapping assignments during the review period.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-refresh-line text-blue-600 mt-0.5"></i>
                      <p className="text-blue-900">
                        <strong>Auto-Expiration:</strong> If the facility doesn't respond within 72 hours, your application will expire and dates will be unblocked.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-file-text-line text-blue-600 mt-0.5"></i>
                      <p className="text-blue-900">
                        <strong>Profile Sharing:</strong> Your complete verified profile will be shared with the facility upon submission.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  setSelectedJob(null);
                  setApplicationError('');
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                disabled={!isProfileComplete}
                className={`flex-1 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isProfileComplete
                    ? 'bg-teal-600 text-white hover:bg-teal-700 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
