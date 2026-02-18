
import React, { useState } from 'react';
import PendingApplications from './PendingApplications';
import { InvitedAssignments } from './InvitedAssignments';
import { UpcomingAssignments } from './UpcomingAssignments';
import { CompletedAssignments } from './CompletedAssignments';
import { FacilityRequests } from './FacilityRequests';
import InsuranceQuestions from './InsuranceQuestions';
import ThirdPartyServices from './ThirdPartyServices';
import JobBrowse from './JobBrowse';
import PhysicianCalendar from './PhysicianCalendar';

interface AssignmentTabsProps {
  onFileDispute?: (assignmentId: string) => void;
}

export default function AssignmentTabs({ onFileDispute }: AssignmentTabsProps) {
  const [activeTab, setActiveTab] = useState<
    'browse' | 'calendar' | 'pending' | 'invited' | 'upcoming' | 'completed' | 'requests' | 'insurance' | 'services'
  >('browse');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <div className="flex border-b border-gray-200 min-w-max">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'browse'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="ri-search-line mr-2"></i>
            Browse Jobs
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'calendar'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="ri-calendar-2-line mr-2"></i>
            My Calendar
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'pending'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="ri-time-line mr-2"></i>
            Pending Applications
          </button>
          <button
            onClick={() => setActiveTab('invited')}
            className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'invited'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="ri-mail-check-line mr-2"></i>
            Invited / Accepted
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'upcoming'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="ri-calendar-check-line mr-2"></i>
            Upcoming Confirmed
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'completed'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="ri-checkbox-circle-line mr-2"></i>
            Completed
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'requests'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="ri-message-3-line mr-2"></i>
            Facility Requests
          </button>
          <button
            onClick={() => setActiveTab('insurance')}
            className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'insurance'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="ri-shield-check-line mr-2"></i>
            Insurance
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'services'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <i className="ri-customer-service-2-line mr-2"></i>
            Third-Party Services
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'browse' && <JobBrowse physicianId="phy-001" />}
        {activeTab === 'calendar' && <PhysicianCalendar physicianId="phy-001" />}
        {activeTab === 'pending' && <PendingApplications />}
        {activeTab === 'invited' && <InvitedAssignments />}
        {activeTab === 'upcoming' && <UpcomingAssignments />}
        {activeTab === 'completed' && <CompletedAssignments />}
        {activeTab === 'requests' && <FacilityRequests />}
        {activeTab === 'insurance' && <InsuranceQuestions />}
        {activeTab === 'services' && <ThirdPartyServices />}
      </div>
    </div>
  );
}
