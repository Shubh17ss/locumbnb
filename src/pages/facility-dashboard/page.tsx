import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationPanel } from '../../components/feature/NotificationPanel';
import { SettingsModal } from '../../components/feature/SettingsModal';
import { ProfileMenu } from '../../components/feature/ProfileMenu';
import { supabase } from '../../utils/supabaseClient';
import FacilityProfile from './components/FacilityProfile';
import StaffAccessManagement from './components/StaffAccessManagement';
import JobPostingForm from './components/JobPostingForm';
import ApplicationReview from './components/ApplicationReview';
import ContractExecution from './components/ContractExecution';
import BillingOverview from './components/BillingOverview';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import DisputeManagement from './components/DisputeManagement';

type TabType = 'overview' | 'drafts' | 'pending-review' | 'awaiting-signature' | 'confirmed' | 'completed' | 'disputed' | 'billing' | 'analytics' | 'profile' | 'staff';

export default function FacilityDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showJobPostingForm, setShowJobPostingForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [jobPostings, setJobPostings] = useState([
    {
      id: 1,
      specialty: 'Cardiology',
      assignmentType: '5-Day Block',
      startDate: '2024-02-15',
      endDate: '2024-02-19',
      payAmount: '$8,500',
      status: 'Active',
      applications: 5
    },
    {
      id: 2,
      specialty: 'Emergency Medicine',
      assignmentType: '7-Day Block',
      startDate: '2024-02-20',
      endDate: '2024-02-26',
      payAmount: '$12,000',
      status: 'Active',
      applications: 8
    }
  ]);

  // Mock data for different assignment states
  const draftPostings = [
    {
      id: 'draft-001',
      specialty: 'Orthopedic Surgery',
      assignmentType: '5-Day Block',
      startDate: '2025-03-01',
      endDate: '2025-03-05',
      payAmount: '$15,000',
      status: 'Draft',
      lastEdited: '2025-01-16'
    }
  ];

  const awaitingSignature = [
    {
      id: 'await-001',
      specialty: 'Anesthesiology',
      physicianName: 'Dr. Michael Torres',
      startDate: '2025-02-10',
      endDate: '2025-02-14',
      payAmount: '$9,500',
      status: 'Awaiting Physician Signature',
      approvedDate: '2025-01-14'
    }
  ];

  const confirmedAssignments = [
    {
      id: 'conf-001',
      specialty: 'Emergency Medicine',
      physicianName: 'Dr. Sarah Mitchell',
      startDate: '2025-02-01',
      endDate: '2025-02-07',
      payAmount: '$12,000',
      status: 'Confirmed',
      paymentState: 'Escrowed',
      contractSigned: '2025-01-12'
    },
    {
      id: 'conf-002',
      specialty: 'Cardiology',
      physicianName: 'Dr. James Chen',
      startDate: '2025-02-15',
      endDate: '2025-02-19',
      payAmount: '$8,500',
      status: 'Confirmed',
      paymentState: 'Escrowed',
      contractSigned: '2025-01-13'
    }
  ];

  const completedAssignments = [
    {
      id: 'comp-001',
      specialty: 'Internal Medicine',
      physicianName: 'Dr. Emily Rodriguez',
      startDate: '2025-01-05',
      endDate: '2025-01-09',
      payAmount: '$7,200',
      status: 'Completed',
      paymentState: 'Released',
      completedDate: '2025-01-09',
      invoiceStatus: 'Approved'
    }
  ];

  const disputedAssignments = [
    {
      id: 'disp-001',
      specialty: 'Radiology',
      physicianName: 'Dr. Robert Kim',
      startDate: '2025-01-10',
      endDate: '2025-01-14',
      payAmount: '$10,500',
      status: 'Disputed',
      paymentState: 'Held',
      disputeReason: 'Billing discrepancy',
      disputeDate: '2025-01-15'
    }
  ];

  const handleJobPostingSubmit = (data: any) => {
    console.log('Job posting submitted:', data);
    
    const newPosting = {
      id: jobPostings.length + 1,
      specialty: data.specialty,
      assignmentType: data.assignmentType === 'fixed-3' ? '3-Day Block' : 
                      data.assignmentType === 'fixed-5' ? '5-Day Block' :
                      data.assignmentType === 'fixed-7' ? '7-Day Block' : 'Rolling',
      startDate: data.startDate,
      endDate: data.endDate,
      payAmount: `$${parseFloat(data.payAmount).toLocaleString()}`,
      status: 'Active',
      applications: 0
    };
    
    setJobPostings([...jobPostings, newPosting]);
    setShowJobPostingForm(false);
    setActiveTab('drafts');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/facility-login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Awaiting Physician Signature': return 'bg-amber-100 text-amber-700';
      case 'Confirmed': return 'bg-teal-100 text-teal-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      case 'Disputed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStateColor = (state: string) => {
    switch (state) {
      case 'Escrowed': return 'bg-purple-100 text-purple-700';
      case 'Released': return 'bg-green-100 text-green-700';
      case 'Held': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button 
                onClick={() => navigate('/')}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <h1 className="text-2xl font-bold text-gray-900">LOCUM BNB</h1>
              </button>
              <p className="text-sm text-gray-600 mt-1">Memorial Hospital</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <i className="ri-notification-3-line text-xl"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-settings-3-line text-xl"></i>
              </button>
              <ProfileMenu 
                userName="Memorial Hospital"
                userRole="facility"
                onLogout={handleLogout}
              />
              <button 
                onClick={() => setShowJobPostingForm(true)}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-add-line mr-2"></i>
                Post Assignment
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'drafts'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Draft Postings
              {draftPostings.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                  {draftPostings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('pending-review')}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'pending-review'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending Review
              <span className="ml-2 px-2 py-0.5 bg-amber-200 text-amber-700 text-xs rounded-full">
                3
              </span>
            </button>
            <button
              onClick={() => setActiveTab('awaiting-signature')}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'awaiting-signature'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Awaiting Signature
              {awaitingSignature.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-200 text-blue-700 text-xs rounded-full">
                  {awaitingSignature.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'confirmed'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Confirmed
              {confirmedAssignments.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-teal-200 text-teal-700 text-xs rounded-full">
                  {confirmedAssignments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('disputed')}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'disputed'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Disputed
              {disputedAssignments.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-200 text-red-700 text-xs rounded-full">
                  {disputedAssignments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'billing'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Billing
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Facility Profile
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'staff'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Staff Access
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Postings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{jobPostings.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <i className="ri-file-list-3-line text-teal-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Applications</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <i className="ri-user-search-line text-amber-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Confirmed Assignments</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{confirmedAssignments.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-checkbox-circle-line text-green-600 text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">$124K</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="ri-money-dollar-circle-line text-purple-600 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { icon: 'ri-user-add-line', color: 'text-green-600', bg: 'bg-green-100', text: 'Dr. Sarah Johnson applied to Cardiology - 3 Day Block', time: '2 hours ago' },
                  { icon: 'ri-file-text-line', color: 'text-blue-600', bg: 'bg-blue-100', text: 'Contract signed for Emergency Medicine assignment', time: '5 hours ago' },
                  { icon: 'ri-money-dollar-circle-line', color: 'text-purple-600', bg: 'bg-purple-100', text: 'Payment released for completed assignment', time: '1 day ago' },
                  { icon: 'ri-user-follow-line', color: 'text-teal-600', bg: 'bg-teal-100', text: 'New staff member added: Jane Smith (Credential Reviewer)', time: '2 days ago' }
                ].map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 ${activity.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <i className={`${activity.icon} ${activity.color} text-lg`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Draft Postings Tab */}
        {activeTab === 'drafts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Draft & Open Postings</h2>
                <p className="text-sm text-gray-600 mt-1">Manage your draft and active job postings</p>
              </div>
              <button 
                onClick={() => setShowJobPostingForm(true)}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-add-line mr-2"></i>
                Create New Posting
              </button>
            </div>

            {/* Draft Postings */}
            {draftPostings.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Drafts</h3>
                <div className="space-y-3">
                  {draftPostings.map((posting) => (
                    <div key={posting.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">{posting.specialty}</h3>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(posting.status)}`}>
                              {posting.status}
                            </span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Assignment Type</p>
                              <p className="text-sm font-medium text-gray-900 mt-1">{posting.assignmentType}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Dates</p>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                {new Date(posting.startDate).toLocaleDateString()} - {new Date(posting.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Pay Amount</p>
                              <p className="text-sm font-medium text-gray-900 mt-1">{posting.payAmount}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Last Edited</p>
                              <p className="text-sm font-medium text-gray-900 mt-1">{new Date(posting.lastEdited).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <i className="ri-edit-line text-lg"></i>
                          </button>
                          <button className="px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
                            Publish
                          </button>
                          <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                            <i className="ri-delete-bin-line text-lg"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Postings */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Active Postings</h3>
              <div className="space-y-3">
                {jobPostings.map((posting) => (
                  <div key={posting.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">{posting.specialty}</h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(posting.status)}`}>
                            {posting.status}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Assignment Type</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{posting.assignmentType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Dates</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {new Date(posting.startDate).toLocaleDateString()} - {new Date(posting.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Pay Amount</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{posting.payAmount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Applications</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{posting.applications} received</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <i className="ri-edit-line text-lg"></i>
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <i className="ri-eye-line text-lg"></i>
                        </button>
                        <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pending Review Tab */}
        {activeTab === 'pending-review' && <ApplicationReview />}

        {/* Awaiting Signature Tab */}
        {activeTab === 'awaiting-signature' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Awaiting Physician Signature</h2>
              <p className="text-sm text-gray-600 mt-1">Approved assignments waiting for physician to sign contract</p>
            </div>

            <div className="space-y-4">
              {awaitingSignature.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.physicianName}</h3>
                        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                          {assignment.specialty}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <i className="ri-calendar-line"></i>
                          {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-money-dollar-circle-line"></i>
                          {assignment.payAmount}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-check-line"></i>
                          Approved {new Date(assignment.approvedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          <i className="ri-information-line mr-1"></i>
                          Physician has been notified and has access to the contract. Waiting for their signature.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-6">
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center gap-2">
                        <i className="ri-file-text-line"></i>
                        View Contract
                      </button>
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2">
                        <i className="ri-message-3-line"></i>
                        Send Reminder
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmed Assignments Tab */}
        {activeTab === 'confirmed' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Confirmed Assignments</h2>
              <p className="text-sm text-gray-600 mt-1">Fully executed contracts with payment in escrow</p>
            </div>

            <div className="space-y-4">
              {confirmedAssignments.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.physicianName}</h3>
                        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                          {assignment.specialty}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPaymentStateColor(assignment.paymentState)}`}>
                          <i className="ri-shield-check-line mr-1"></i>
                          {assignment.paymentState}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <i className="ri-calendar-line"></i>
                          {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-money-dollar-circle-line"></i>
                          {assignment.payAmount}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-file-text-line"></i>
                          Signed {new Date(assignment.contractSigned).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                        <p className="text-sm text-teal-800">
                          <i className="ri-checkbox-circle-line mr-1"></i>
                          Contract fully executed. Payment held securely in escrow until assignment completion.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-6">
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center gap-2">
                        <i className="ri-file-text-line"></i>
                        View Contract
                      </button>
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2">
                        <i className="ri-message-3-line"></i>
                        Message Physician
                      </button>
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2">
                        <i className="ri-calendar-check-line"></i>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Assignments Tab */}
        {activeTab === 'completed' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Completed Assignments</h2>
              <p className="text-sm text-gray-600 mt-1">Past assignments with payment released</p>
            </div>

            <div className="space-y-4">
              {completedAssignments.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.physicianName}</h3>
                        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                          {assignment.specialty}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPaymentStateColor(assignment.paymentState)}`}>
                          <i className="ri-check-double-line mr-1"></i>
                          {assignment.paymentState}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <i className="ri-calendar-line"></i>
                          {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-money-dollar-circle-line"></i>
                          {assignment.payAmount}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-check-line"></i>
                          Completed {new Date(assignment.completedDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-file-list-line"></i>
                          Invoice: {assignment.invoiceStatus}
                        </span>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          <i className="ri-checkbox-circle-line mr-1"></i>
                          Assignment completed successfully. Payment has been released to physician.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-6">
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center gap-2">
                        <i className="ri-file-text-line"></i>
                        View Contract
                      </button>
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2">
                        <i className="ri-file-list-line"></i>
                        View Invoice
                      </button>
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2">
                        <i className="ri-download-line"></i>
                        Download Records
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disputed Assignments Tab */}
        {activeTab === 'disputed' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Disputed & On Hold</h2>
              <p className="text-sm text-gray-600 mt-1">Assignments with active disputes or payment holds</p>
            </div>

            {disputedAssignments.length > 0 ? (
              <div className="space-y-4">
                {disputedAssignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white rounded-lg border border-red-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{assignment.physicianName}</h3>
                          <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                            {assignment.specialty}
                          </span>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPaymentStateColor(assignment.paymentState)}`}>
                            <i className="ri-lock-line mr-1"></i>
                            {assignment.paymentState}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <i className="ri-calendar-line"></i>
                            {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="ri-money-dollar-circle-line"></i>
                            {assignment.payAmount}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="ri-alert-line"></i>
                            Disputed {new Date(assignment.disputeDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <p className="text-sm font-medium text-red-900 mb-1">Dispute Reason:</p>
                          <p className="text-sm text-red-800">{assignment.disputeReason}</p>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-sm text-amber-800">
                            <i className="ri-information-line mr-1"></i>
                            Payment is held in escrow pending dispute resolution. All communications are logged.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-6">
                        <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap flex items-center gap-2">
                          <i className="ri-file-list-line"></i>
                          View Dispute Details
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2">
                          <i className="ri-message-3-line"></i>
                          Message Physician
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2">
                          <i className="ri-file-text-line"></i>
                          View Contract
                        </button>
                        <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2">
                          <i className="ri-check-line"></i>
                          Resolve Dispute
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-checkbox-circle-line text-green-600 text-3xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Disputes</h3>
                <p className="text-sm text-gray-600">All assignments are proceeding smoothly with no active disputes.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'billing' && <BillingOverview />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        
        {activeTab === 'profile' && <FacilityProfile />}
        {activeTab === 'staff' && <StaffAccessManagement />}
      </main>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        userRole="facility"
      />

      {/* Job Posting Form Modal */}
      {showJobPostingForm && (
        <JobPostingForm
          onClose={() => setShowJobPostingForm(false)}
          onSubmit={handleJobPostingSubmit}
        />
      )}
    </div>
  );
}
