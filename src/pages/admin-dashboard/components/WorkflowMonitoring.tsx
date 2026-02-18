
import { useState } from 'react';

interface WorkflowEvent {
  id: string;
  type: 'job_posting' | 'application' | 'approval' | 'rejection' | 'expiration' | 'contract_signature' | 'escrow_funding' | 'escrow_release' | 'profile_update' | 'insurance_quote' | 'vendor_quote' | 'communication';
  title: string;
  description: string;
  timestamp: string;
  userType: 'Physician' | 'Facility' | 'Vendor' | 'System';
  userName: string;
  userId: string;
  assignmentId?: string;
  status: 'completed' | 'pending' | 'failed' | 'in_progress';
  priority: 'low' | 'medium' | 'high' | 'critical';
  metadata?: {
    specialty?: string;
    amount?: number;
    documentType?: string;
    vendorType?: string;
  };
}

interface WorkflowStage {
  id: string;
  assignmentId: string;
  facilityName: string;
  physicianName: string;
  specialty: string;
  dates: string;
  currentStage: 'posted' | 'applied' | 'approved' | 'signed' | 'escrowed' | 'completed' | 'disputed';
  stages: {
    name: string;
    status: 'completed' | 'current' | 'pending' | 'failed';
    timestamp?: string;
    completedBy?: string;
  }[];
  lastUpdate: string;
}

const WorkflowMonitoring = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'workflows'>('events');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedUserType, setSelectedUserType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [selectedEvent, setSelectedEvent] = useState<WorkflowEvent | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowStage | null>(null);

  // Mock workflow events data
  const workflowEvents: WorkflowEvent[] = [
    {
      id: 'evt_001',
      type: 'job_posting',
      title: 'New Job Posting Created',
      description: 'Emergency Medicine position posted for Memorial Hospital',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      userType: 'Facility',
      userName: 'Memorial Hospital',
      userId: 'fac_123',
      assignmentId: 'assign_789',
      status: 'completed',
      priority: 'medium',
      metadata: {
        specialty: 'Emergency Medicine'
      }
    },
    {
      id: 'evt_002',
      type: 'application',
      title: 'Physician Application Submitted',
      description: 'Dr. Sarah Johnson applied to Cardiology position',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      userType: 'Physician',
      userName: 'Dr. Sarah Johnson',
      userId: 'phy_456',
      assignmentId: 'assign_790',
      status: 'completed',
      priority: 'high',
      metadata: {
        specialty: 'Cardiology'
      }
    },
    {
      id: 'evt_003',
      type: 'approval',
      title: 'Application Approved',
      description: 'City General Hospital approved Dr. Michael Chen',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      userType: 'Facility',
      userName: 'City General Hospital',
      userId: 'fac_124',
      assignmentId: 'assign_791',
      status: 'completed',
      priority: 'high',
      metadata: {
        specialty: 'Anesthesiology'
      }
    },
    {
      id: 'evt_004',
      type: 'contract_signature',
      title: 'Contract Signed by Physician',
      description: 'Dr. Emily Rodriguez signed facility contract',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      userType: 'Physician',
      userName: 'Dr. Emily Rodriguez',
      userId: 'phy_457',
      assignmentId: 'assign_792',
      status: 'completed',
      priority: 'high',
      metadata: {
        specialty: 'Radiology',
        documentType: 'Facility Contract'
      }
    },
    {
      id: 'evt_005',
      type: 'escrow_funding',
      title: 'Escrow Payment Funded',
      description: 'Memorial Hospital funded escrow for assignment',
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      userType: 'Facility',
      userName: 'Memorial Hospital',
      userId: 'fac_123',
      assignmentId: 'assign_793',
      status: 'completed',
      priority: 'critical',
      metadata: {
        amount: 15000
      }
    },
    {
      id: 'evt_006',
      type: 'insurance_quote',
      title: 'Insurance Quote Received',
      description: 'Malpractice insurance quote submitted for Dr. Johnson',
      timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
      userType: 'Vendor',
      userName: 'ProMed Insurance',
      userId: 'ven_301',
      assignmentId: 'assign_794',
      status: 'completed',
      priority: 'medium',
      metadata: {
        vendorType: 'Insurance',
        amount: 2500
      }
    },
    {
      id: 'evt_007',
      type: 'vendor_quote',
      title: 'Travel Quote Submitted',
      description: 'Flight and hotel quote for Dr. Chen assignment',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      userType: 'Vendor',
      userName: 'MedTravel Solutions',
      userId: 'ven_302',
      assignmentId: 'assign_791',
      status: 'completed',
      priority: 'low',
      metadata: {
        vendorType: 'Travel',
        amount: 1800
      }
    },
    {
      id: 'evt_008',
      type: 'profile_update',
      title: 'Physician Profile Updated',
      description: 'Dr. Sarah Johnson updated license information',
      timestamp: new Date(Date.now() - 150 * 60000).toISOString(),
      userType: 'Physician',
      userName: 'Dr. Sarah Johnson',
      userId: 'phy_456',
      status: 'completed',
      priority: 'low'
    },
    {
      id: 'evt_009',
      type: 'rejection',
      title: 'Application Rejected',
      description: 'Facility declined application due to scheduling conflict',
      timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
      userType: 'Facility',
      userName: 'Regional Medical Center',
      userId: 'fac_125',
      assignmentId: 'assign_795',
      status: 'completed',
      priority: 'medium',
      metadata: {
        specialty: 'Surgery'
      }
    },
    {
      id: 'evt_010',
      type: 'escrow_release',
      title: 'Escrow Payment Released',
      description: 'Payment released to Dr. Rodriguez after assignment completion',
      timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
      userType: 'System',
      userName: 'Automated System',
      userId: 'sys_001',
      assignmentId: 'assign_796',
      status: 'completed',
      priority: 'critical',
      metadata: {
        amount: 12000
      }
    },
    {
      id: 'evt_011',
      type: 'communication',
      title: 'Three-Way Communication',
      description: 'Facility requested additional documents from physician via vendor',
      timestamp: new Date(Date.now() - 300 * 60000).toISOString(),
      userType: 'Facility',
      userName: 'City General Hospital',
      userId: 'fac_124',
      assignmentId: 'assign_797',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 'evt_012',
      type: 'expiration',
      title: 'Application Expired',
      description: 'No response from facility within 2 business days - dates unblocked',
      timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
      userType: 'System',
      userName: 'Automated System',
      userId: 'sys_001',
      assignmentId: 'assign_798',
      status: 'completed',
      priority: 'low'
    }
  ];

  // Mock workflow stages data
  const workflowStages: WorkflowStage[] = [
    {
      id: 'wf_001',
      assignmentId: 'assign_789',
      facilityName: 'Memorial Hospital',
      physicianName: 'Dr. Sarah Johnson',
      specialty: 'Emergency Medicine',
      dates: 'Jan 15-22, 2025',
      currentStage: 'posted',
      lastUpdate: new Date(Date.now() - 5 * 60000).toISOString(),
      stages: [
        { name: 'Job Posted', status: 'completed', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), completedBy: 'Memorial Hospital' },
        { name: 'Application Received', status: 'pending' },
        { name: 'Facility Approval', status: 'pending' },
        { name: 'Contract Signed', status: 'pending' },
        { name: 'Escrow Funded', status: 'pending' },
        { name: 'Assignment Completed', status: 'pending' }
      ]
    },
    {
      id: 'wf_002',
      assignmentId: 'assign_791',
      facilityName: 'City General Hospital',
      physicianName: 'Dr. Michael Chen',
      specialty: 'Anesthesiology',
      dates: 'Jan 20-27, 2025',
      currentStage: 'approved',
      lastUpdate: new Date(Date.now() - 30 * 60000).toISOString(),
      stages: [
        { name: 'Job Posted', status: 'completed', timestamp: new Date(Date.now() - 120 * 60000).toISOString(), completedBy: 'City General Hospital' },
        { name: 'Application Received', status: 'completed', timestamp: new Date(Date.now() - 90 * 60000).toISOString(), completedBy: 'Dr. Michael Chen' },
        { name: 'Facility Approval', status: 'completed', timestamp: new Date(Date.now() - 30 * 60000).toISOString(), completedBy: 'City General Hospital' },
        { name: 'Contract Signed', status: 'current' },
        { name: 'Escrow Funded', status: 'pending' },
        { name: 'Assignment Completed', status: 'pending' }
      ]
    },
    {
      id: 'wf_003',
      assignmentId: 'assign_792',
      facilityName: 'Regional Medical Center',
      physicianName: 'Dr. Emily Rodriguez',
      specialty: 'Radiology',
      dates: 'Jan 18-25, 2025',
      currentStage: 'signed',
      lastUpdate: new Date(Date.now() - 45 * 60000).toISOString(),
      stages: [
        { name: 'Job Posted', status: 'completed', timestamp: new Date(Date.now() - 180 * 60000).toISOString(), completedBy: 'Regional Medical Center' },
        { name: 'Application Received', status: 'completed', timestamp: new Date(Date.now() - 150 * 60000).toISOString(), completedBy: 'Dr. Emily Rodriguez' },
        { name: 'Facility Approval', status: 'completed', timestamp: new Date(Date.now() - 90 * 60000).toISOString(), completedBy: 'Regional Medical Center' },
        { name: 'Contract Signed', status: 'completed', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), completedBy: 'Dr. Emily Rodriguez' },
        { name: 'Escrow Funded', status: 'current' },
        { name: 'Assignment Completed', status: 'pending' }
      ]
    },
    {
      id: 'wf_004',
      assignmentId: 'assign_793',
      facilityName: 'Memorial Hospital',
      physicianName: 'Dr. James Wilson',
      specialty: 'Cardiology',
      dates: 'Jan 12-19, 2025',
      currentStage: 'escrowed',
      lastUpdate: new Date(Date.now() - 60 * 60000).toISOString(),
      stages: [
        { name: 'Job Posted', status: 'completed', timestamp: new Date(Date.now() - 300 * 60000).toISOString(), completedBy: 'Memorial Hospital' },
        { name: 'Application Received', status: 'completed', timestamp: new Date(Date.now() - 240 * 60000).toISOString(), completedBy: 'Dr. James Wilson' },
        { name: 'Facility Approval', status: 'completed', timestamp: new Date(Date.now() - 180 * 60000).toISOString(), completedBy: 'Memorial Hospital' },
        { name: 'Contract Signed', status: 'completed', timestamp: new Date(Date.now() - 120 * 60000).toISOString(), completedBy: 'Dr. James Wilson' },
        { name: 'Escrow Funded', status: 'completed', timestamp: new Date(Date.now() - 60 * 60000).toISOString(), completedBy: 'Memorial Hospital' },
        { name: 'Assignment Completed', status: 'current' }
      ]
    },
    {
      id: 'wf_005',
      assignmentId: 'assign_796',
      facilityName: 'City General Hospital',
      physicianName: 'Dr. Lisa Martinez',
      specialty: 'Surgery',
      dates: 'Jan 5-12, 2025',
      currentStage: 'completed',
      lastUpdate: new Date(Date.now() - 240 * 60000).toISOString(),
      stages: [
        { name: 'Job Posted', status: 'completed', timestamp: new Date(Date.now() - 600 * 60000).toISOString(), completedBy: 'City General Hospital' },
        { name: 'Application Received', status: 'completed', timestamp: new Date(Date.now() - 540 * 60000).toISOString(), completedBy: 'Dr. Lisa Martinez' },
        { name: 'Facility Approval', status: 'completed', timestamp: new Date(Date.now() - 480 * 60000).toISOString(), completedBy: 'City General Hospital' },
        { name: 'Contract Signed', status: 'completed', timestamp: new Date(Date.now() - 420 * 60000).toISOString(), completedBy: 'Dr. Lisa Martinez' },
        { name: 'Escrow Funded', status: 'completed', timestamp: new Date(Date.now() - 360 * 60000).toISOString(), completedBy: 'City General Hospital' },
        { name: 'Assignment Completed', status: 'completed', timestamp: new Date(Date.now() - 240 * 60000).toISOString(), completedBy: 'Automated System' }
      ]
    }
  ];

  const eventTypeOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'job_posting', label: 'Job Postings' },
    { value: 'application', label: 'Applications' },
    { value: 'approval', label: 'Approvals' },
    { value: 'rejection', label: 'Rejections' },
    { value: 'expiration', label: 'Expirations' },
    { value: 'contract_signature', label: 'Contract Signatures' },
    { value: 'escrow_funding', label: 'Escrow Funding' },
    { value: 'escrow_release', label: 'Escrow Releases' },
    { value: 'profile_update', label: 'Profile Updates' },
    { value: 'insurance_quote', label: 'Insurance Quotes' },
    { value: 'vendor_quote', label: 'Vendor Quotes' },
    { value: 'communication', label: 'Communications' }
  ];

  const userTypeOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'Physician', label: 'Physicians' },
    { value: 'Facility', label: 'Facilities' },
    { value: 'Vendor', label: 'Vendors' },
    { value: 'System', label: 'System' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' }
  ];

  const filteredEvents = workflowEvents.filter(event => {
    const matchesType = selectedEventType === 'all' || event.type === selectedEventType;
    const matchesUser = selectedUserType === 'all' || event.userType === selectedUserType;
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesUser && matchesSearch;
  });

  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      job_posting: 'ri-briefcase-line',
      application: 'ri-file-text-line',
      approval: 'ri-checkbox-circle-line',
      rejection: 'ri-close-circle-line',
      expiration: 'ri-time-line',
      contract_signature: 'ri-quill-pen-line',
      escrow_funding: 'ri-bank-line',
      escrow_release: 'ri-money-dollar-circle-line',
      profile_update: 'ri-user-settings-line',
      insurance_quote: 'ri-shield-check-line',
      vendor_quote: 'ri-store-line',
      communication: 'ri-message-3-line'
    };
    return icons[type] || 'ri-information-line';
  };

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      job_posting: 'text-blue-600 bg-blue-50',
      application: 'text-purple-600 bg-purple-50',
      approval: 'text-green-600 bg-green-50',
      rejection: 'text-red-600 bg-red-50',
      expiration: 'text-gray-600 bg-gray-50',
      contract_signature: 'text-indigo-600 bg-indigo-50',
      escrow_funding: 'text-teal-600 bg-teal-50',
      escrow_release: 'text-emerald-600 bg-emerald-50',
      profile_update: 'text-amber-600 bg-amber-50',
      insurance_quote: 'text-cyan-600 bg-cyan-50',
      vendor_quote: 'text-pink-600 bg-pink-50',
      communication: 'text-violet-600 bg-violet-50'
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      critical: { color: 'bg-red-100 text-red-800', label: 'Critical' },
      high: { color: 'bg-orange-100 text-orange-800', label: 'High' },
      medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      low: { color: 'bg-gray-100 text-gray-800', label: 'Low' }
    };
    return badges[priority] || badges.low;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      in_progress: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' }
    };
    return badges[status] || badges.pending;
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      posted: 'bg-blue-100 text-blue-800',
      applied: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      signed: 'bg-indigo-100 text-indigo-800',
      escrowed: 'bg-teal-100 text-teal-800',
      completed: 'bg-emerald-100 text-emerald-800',
      disputed: 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Workflow Monitoring</h2>
        <p className="text-gray-600 mt-1">Real-time visibility into all platform events and workflows</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'events'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="ri-notification-line mr-2"></i>
            Live Event Feed
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'workflows'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="ri-flow-chart mr-2"></i>
            Workflow Status Tracking
          </button>
        </div>
      </div>

      {/* Live Event Feed Tab */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Events</label>
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, user..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Event Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                >
                  {eventTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* User Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                <select
                  value={selectedUserType}
                  onChange={(e) => setSelectedUserType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                >
                  {userTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                >
                  {dateRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedEventType !== 'all' || selectedUserType !== 'all' || searchQuery !== '') && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedEventType !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                    {eventTypeOptions.find(o => o.value === selectedEventType)?.label}
                    <button onClick={() => setSelectedEventType('all')} className="hover:text-teal-900">
                      <i className="ri-close-line"></i>
                    </button>
                  </span>
                )}
                {selectedUserType !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                    {userTypeOptions.find(o => o.value === selectedUserType)?.label}
                    <button onClick={() => setSelectedUserType('all')} className="hover:text-teal-900">
                      <i className="ri-close-line"></i>
                    </button>
                  </span>
                )}
                {searchQuery !== '' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery('')} className="hover:text-teal-900">
                      <i className="ri-close-line"></i>
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedEventType('all');
                    setSelectedUserType('all');
                    setSearchQuery('');
                  }}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Event Feed */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Events ({filteredEvents.length})
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredEvents.length === 0 ? (
                <div className="p-12 text-center">
                  <i className="ri-inbox-line text-4xl text-gray-300 mb-3"></i>
                  <p className="text-gray-500">No events found matching your filters</p>
                </div>
              ) : (
                filteredEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Event Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getEventColor(event.type)}`}>
                        <i className={`${getEventIcon(event.type)} text-lg`}></i>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">{event.title}</h4>
                            <p className="text-sm text-gray-600">{event.description}</p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">{formatTimestamp(event.timestamp)}</span>
                        </div>

                        {/* Event Metadata */}
                        <div className="flex items-center gap-3 flex-wrap mt-3">
                          <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                            <i className="ri-user-line"></i>
                            {event.userName}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(event.priority).color}`}>
                            {getPriorityBadge(event.priority).label}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(event.status).color}`}>
                            {getStatusBadge(event.status).label}
                          </span>
                          {event.assignmentId && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                              <i className="ri-link"></i>
                              {event.assignmentId}
                            </span>
                          )}
                          {event.metadata?.specialty && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                              <i className="ri-stethoscope-line"></i>
                              {event.metadata.specialty}
                            </span>
                          )}
                          {event.metadata?.amount && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                              <i className="ri-money-dollar-circle-line"></i>
                              ${event.metadata.amount.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Workflow Status Tracking Tab */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          {/* Workflow Cards */}
          <div className="grid grid-cols-1 gap-6">
            {workflowStages.map(workflow => (
              <div
                key={workflow.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedWorkflow(workflow)}
              >
                {/* Workflow Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{workflow.assignmentId}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(workflow.currentStage)}`}>
                        {workflow.currentStage.charAt(0).toUpperCase() + workflow.currentStage.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Facility:</span>
                        <span className="ml-2 text-gray-900 font-medium">{workflow.facilityName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Physician:</span>
                        <span className="ml-2 text-gray-900 font-medium">{workflow.physicianName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Specialty:</span>
                        <span className="ml-2 text-gray-900 font-medium">{workflow.specialty}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Dates:</span>
                        <span className="ml-2 text-gray-900 font-medium">{workflow.dates}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Last Updated</div>
                    <div className="text-sm text-gray-900 font-medium">{formatTimestamp(workflow.lastUpdate)}</div>
                  </div>
                </div>

                {/* Workflow Progress */}
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                    <div
                      className="h-full bg-teal-600 transition-all duration-500"
                      style={{
                        width: `${(workflow.stages.filter(s => s.status === 'completed').length / workflow.stages.length) * 100}%`
                      }}
                    ></div>
                  </div>

                  {/* Stages */}
                  <div className="relative flex justify-between">
                    {workflow.stages.map((stage, index) => (
                      <div key={index} className="flex flex-col items-center" style={{ width: `${100 / workflow.stages.length}%` }}>
                        {/* Stage Icon */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            stage.status === 'completed'
                              ? 'bg-teal-600 border-teal-600 text-white'
                              : stage.status === 'current'
                              ? 'bg-white border-teal-600 text-teal-600'
                              : stage.status === 'failed'
                              ? 'bg-red-600 border-red-600 text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}
                        >
                          {stage.status === 'completed' ? (
                            <i className="ri-check-line text-lg"></i>
                          ) : stage.status === 'current' ? (
                            <i className="ri-time-line text-lg"></i>
                          ) : stage.status === 'failed' ? (
                            <i className="ri-close-line text-lg"></i>
                          ) : (
                            <i className="ri-circle-line text-lg"></i>
                          )}
                        </div>

                        {/* Stage Label */}
                        <div className="mt-3 text-center">
                          <div className={`text-xs font-medium ${
                            stage.status === 'completed' || stage.status === 'current'
                              ? 'text-gray-900'
                              : 'text-gray-500'
                          }`}>
                            {stage.name}
                          </div>
                          {stage.timestamp && (
                            <div className="text-xs text-gray-500 mt-1">
                              {formatTimestamp(stage.timestamp)}
                            </div>
                          )}
                          {stage.completedBy && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              by {stage.completedBy}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getEventColor(selectedEvent.type)}`}>
                    <i className={`${getEventIcon(selectedEvent.type)} text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedEvent.title}</h3>
                    <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Event Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Event ID</div>
                  <div className="text-sm font-medium text-gray-900">{selectedEvent.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Timestamp</div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(selectedEvent.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">User Type</div>
                  <div className="text-sm font-medium text-gray-900">{selectedEvent.userType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">User Name</div>
                  <div className="text-sm font-medium text-gray-900">{selectedEvent.userName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">User ID</div>
                  <div className="text-sm font-medium text-gray-900">{selectedEvent.userId}</div>
                </div>
                {selectedEvent.assignmentId && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Assignment ID</div>
                    <div className="text-sm font-medium text-gray-900">{selectedEvent.assignmentId}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-500 mb-1">Priority</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(selectedEvent.priority).color}`}>
                    {getPriorityBadge(selectedEvent.priority).label}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedEvent.status).color}`}>
                    {getStatusBadge(selectedEvent.status).label}
                  </span>
                </div>
              </div>

              {/* Metadata */}
              {selectedEvent.metadata && Object.keys(selectedEvent.metadata).length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Additional Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {selectedEvent.metadata.specialty && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Specialty</span>
                        <span className="text-sm font-medium text-gray-900">{selectedEvent.metadata.specialty}</span>
                      </div>
                    )}
                    {selectedEvent.metadata.amount && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Amount</span>
                        <span className="text-sm font-medium text-gray-900">${selectedEvent.metadata.amount.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedEvent.metadata.documentType && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Document Type</span>
                        <span className="text-sm font-medium text-gray-900">{selectedEvent.metadata.documentType}</span>
                      </div>
                    )}
                    {selectedEvent.metadata.vendorType && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Vendor Type</span>
                        <span className="text-sm font-medium text-gray-900">{selectedEvent.metadata.vendorType}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-information-line text-blue-600 text-lg mt-0.5"></i>
                  <div>
                    <div className="text-sm font-medium text-blue-900 mb-1">Observation Mode</div>
                    <div className="text-sm text-blue-700">
                      This event was processed automatically. Manual intervention is available if needed through role-restricted admin actions.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Detail Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{selectedWorkflow.assignmentId}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(selectedWorkflow.currentStage)}`}>
                      {selectedWorkflow.currentStage.charAt(0).toUpperCase() + selectedWorkflow.currentStage.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Complete workflow status and timeline</p>
                </div>
                <button
                  onClick={() => setSelectedWorkflow(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Assignment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Facility</div>
                  <div className="text-sm font-medium text-gray-900">{selectedWorkflow.facilityName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Physician</div>
                  <div className="text-sm font-medium text-gray-900">{selectedWorkflow.physicianName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Specialty</div>
                  <div className="text-sm font-medium text-gray-900">{selectedWorkflow.specialty}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Assignment Dates</div>
                  <div className="text-sm font-medium text-gray-900">{selectedWorkflow.dates}</div>
                </div>
              </div>

              {/* Workflow Timeline */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Workflow Timeline</h4>
                <div className="space-y-4">
                  {selectedWorkflow.stages.map((stage, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                          stage.status === 'completed'
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : stage.status === 'current'
                            ? 'bg-white border-teal-600 text-teal-600'
                            : stage.status === 'failed'
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                      >
                        {stage.status === 'completed' ? (
                          <i className="ri-check-line text-lg"></i>
                        ) : stage.status === 'current' ? (
                          <i className="ri-time-line text-lg"></i>
                        ) : stage.status === 'failed' ? (
                          <i className="ri-close-line text-lg"></i>
                        ) : (
                          <i className="ri-circle-line text-lg"></i>
                        )}
                      </div>
                      <div className="flex-1 pb-4 border-b border-gray-200 last:border-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-semibold text-gray-900 mb-1">{stage.name}</div>
                            {stage.completedBy && (
                              <div className="text-sm text-gray-600">Completed by {stage.completedBy}</div>
                            )}
                          </div>
                          {stage.timestamp && (
                            <div className="text-sm text-gray-500">
                              {new Date(stage.timestamp).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Actions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-shield-check-line text-gray-600 text-lg mt-0.5"></i>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">Admin Oversight</div>
                    <div className="text-sm text-gray-600 mb-3">
                      This workflow is progressing automatically. Manual intervention available if needed.
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap">
                        <i className="ri-eye-line mr-2"></i>
                        View Full Details
                      </button>
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap">
                        <i className="ri-message-3-line mr-2"></i>
                        Contact Parties
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowMonitoring;
