import { useState } from 'react';
import { adminAuditLogger } from '../../../utils/adminAuditLogger';

interface FlaggedContent {
  id: string;
  type: 'job_posting' | 'profile' | 'message' | 'document';
  contentId: string;
  reportedBy: string;
  reportedAt: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  details: {
    title?: string;
    description?: string;
    facilityName?: string;
    physicianName?: string;
    specialty?: string;
    flagCount: number;
    autoFlagged: boolean;
    fraudScore?: number;
  };
  reviewedBy?: string;
  reviewedAt?: string;
  resolution?: string;
}

interface AdminSession {
  sessionId: string;
  adminId: string;
  adminEmail: string;
  adminRole: string;
  permissions: any;
}

interface ContentModerationProps {
  session: AdminSession | null;
}

export default function ContentModeration({ session }: ContentModerationProps) {
  const [activeTab, setActiveTab] = useState<'flagged' | 'fraud_detection'>('flagged');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'job_posting' | 'profile' | 'message' | 'document'>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'under_review' | 'resolved' | 'dismissed'>('all');
  const [selectedContent, setSelectedContent] = useState<FlaggedContent | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'remove' | 'suspend_user' | 'dismiss'>('approve');
  const [actionJustification, setActionJustification] = useState('');

  // Mock flagged content data
  const [flaggedContent] = useState<FlaggedContent[]>([
    {
      id: 'FLAG-001',
      type: 'job_posting',
      contentId: 'POST-1247',
      reportedBy: 'Auto-Detection System',
      reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      reason: 'Suspicious compensation rate - significantly above market average',
      severity: 'high',
      status: 'pending',
      details: {
        title: 'Emergency Medicine Physician - Urgent Need',
        description: 'Offering $15,000/day for 7-day assignment',
        facilityName: 'Metro General Hospital',
        specialty: 'Emergency Medicine',
        flagCount: 1,
        autoFlagged: true,
        fraudScore: 78,
      },
    },
    {
      id: 'FLAG-002',
      type: 'profile',
      contentId: 'PHY-892',
      reportedBy: 'Facility Admin (FAC-445)',
      reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      reason: 'Inconsistent credentials - license number does not match state records',
      severity: 'critical',
      status: 'under_review',
      details: {
        physicianName: 'Dr. John Smith',
        specialty: 'Cardiology',
        flagCount: 3,
        autoFlagged: false,
        fraudScore: 92,
      },
    },
    {
      id: 'FLAG-003',
      type: 'job_posting',
      contentId: 'POST-1189',
      reportedBy: 'Physician (PHY-334)',
      reportedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      reason: 'Misleading job description - actual duties differ from posting',
      severity: 'medium',
      status: 'pending',
      details: {
        title: 'Hospitalist - Day Shift',
        description: 'Standard hospitalist duties, 12-hour shifts',
        facilityName: 'Riverside Medical Center',
        specialty: 'Internal Medicine',
        flagCount: 2,
        autoFlagged: false,
      },
    },
    {
      id: 'FLAG-004',
      type: 'profile',
      contentId: 'FAC-223',
      reportedBy: 'Auto-Detection System',
      reportedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      reason: 'Multiple failed payment attempts - potential fraud',
      severity: 'critical',
      status: 'under_review',
      details: {
        facilityName: 'QuickCare Urgent Center',
        flagCount: 5,
        autoFlagged: true,
        fraudScore: 95,
      },
    },
    {
      id: 'FLAG-005',
      type: 'message',
      contentId: 'MSG-5621',
      reportedBy: 'Physician (PHY-778)',
      reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      reason: 'Attempt to bypass platform - facility requesting direct contact',
      severity: 'high',
      status: 'pending',
      details: {
        facilityName: 'Lakeside Hospital',
        physicianName: 'Dr. Sarah Johnson',
        flagCount: 1,
        autoFlagged: false,
      },
    },
    {
      id: 'FLAG-006',
      type: 'job_posting',
      contentId: 'POST-1056',
      reportedBy: 'Compliance System',
      reportedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      reason: 'Missing required compliance documentation',
      severity: 'low',
      status: 'resolved',
      details: {
        title: 'Anesthesiologist - Surgical Center',
        facilityName: 'Precision Surgery Center',
        specialty: 'Anesthesiology',
        flagCount: 1,
        autoFlagged: true,
      },
      reviewedBy: 'admin@platform.com',
      reviewedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      resolution: 'Facility uploaded missing documentation. Issue resolved.',
    },
  ]);

  // Fraud detection alerts
  const [fraudAlerts] = useState([
    {
      id: 'FRAUD-001',
      type: 'credential_mismatch',
      severity: 'critical',
      score: 95,
      entity: 'Physician Profile',
      entityId: 'PHY-892',
      name: 'Dr. John Smith',
      details: 'License number verification failed across 3 state databases',
      detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    },
    {
      id: 'FRAUD-002',
      type: 'payment_fraud',
      severity: 'critical',
      score: 95,
      entity: 'Facility Account',
      entityId: 'FAC-223',
      name: 'QuickCare Urgent Center',
      details: '5 failed payment attempts with different cards in 24 hours',
      detectedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    },
    {
      id: 'FRAUD-003',
      type: 'suspicious_pricing',
      severity: 'high',
      score: 78,
      entity: 'Job Posting',
      entityId: 'POST-1247',
      name: 'Emergency Medicine Physician - Urgent Need',
      details: 'Compensation 300% above market average for specialty and location',
      detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    },
    {
      id: 'FRAUD-004',
      type: 'duplicate_account',
      severity: 'medium',
      score: 65,
      entity: 'Physician Profile',
      entityId: 'PHY-1034',
      name: 'Dr. Michael Chen',
      details: 'Similar profile information to existing account PHY-445',
      detectedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      status: 'investigating',
    },
    {
      id: 'FRAUD-005',
      type: 'platform_bypass',
      severity: 'high',
      score: 82,
      entity: 'Message Thread',
      entityId: 'MSG-5621',
      name: 'Lakeside Hospital <> Dr. Sarah Johnson',
      details: 'Detected exchange of personal contact information and direct payment discussion',
      detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    },
  ]);

  const filteredContent = flaggedContent.filter(content => {
    const matchesSearch = content.contentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.details.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.details.facilityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.details.physicianName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || content.type === filterType;
    const matchesSeverity = filterSeverity === 'all' || content.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  const handleContentAction = (content: FlaggedContent, action: 'approve' | 'remove' | 'suspend_user' | 'dismiss') => {
    setSelectedContent(content);
    setActionType(action);
    setShowActionModal(true);
    setActionJustification('');
  };

  const executeContentAction = () => {
    if (!selectedContent || !session || !actionJustification.trim()) return;

    const actionLabels = {
      approve: 'CONTENT_APPROVED',
      remove: 'CONTENT_REMOVED',
      suspend_user: 'USER_SUSPENDED',
      dismiss: 'FLAG_DISMISSED',
    };

    adminAuditLogger.log(
      session.adminId,
      session.adminEmail,
      session.adminRole,
      actionLabels[actionType],
      'content_moderation',
      selectedContent.id,
      {
        contentType: selectedContent.type,
        contentId: selectedContent.contentId,
        action: actionType,
        reason: selectedContent.reason,
        severity: selectedContent.severity,
        justification: actionJustification,
        timestamp: new Date().toISOString(),
      },
      session.sessionId
    );

    setShowActionModal(false);
    setSelectedContent(null);
    setActionJustification('');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'amber';
      case 'low':
        return 'blue';
      default:
        return 'slate';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'green';
      case 'under_review':
        return 'blue';
      case 'pending':
        return 'amber';
      case 'dismissed':
        return 'slate';
      case 'active':
        return 'red';
      case 'investigating':
        return 'purple';
      default:
        return 'slate';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job_posting':
        return 'ri-file-list-3-line';
      case 'profile':
        return 'ri-user-line';
      case 'message':
        return 'ri-message-3-line';
      case 'document':
        return 'ri-file-text-line';
      default:
        return 'ri-flag-line';
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-2 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('flagged')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'flagged'
                ? 'bg-red-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <i className="ri-flag-line mr-2"></i>
            Flagged Content
          </button>
          <button
            onClick={() => setActiveTab('fraud_detection')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'fraud_detection'
                ? 'bg-red-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <i className="ri-shield-cross-line mr-2"></i>
            Fraud Detection
          </button>
        </div>
      </div>

      {/* Flagged Content Tab */}
      {activeTab === 'flagged' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-time-line text-2xl text-amber-400"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {flaggedContent.filter(c => c.status === 'pending').length}
              </h3>
              <p className="text-sm text-slate-400">Pending Review</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-search-eye-line text-2xl text-blue-400"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {flaggedContent.filter(c => c.status === 'under_review').length}
              </h3>
              <p className="text-sm text-slate-400">Under Review</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-error-warning-line text-2xl text-red-400"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {flaggedContent.filter(c => c.severity === 'critical' || c.severity === 'high').length}
              </h3>
              <p className="text-sm text-slate-400">High Priority</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-checkbox-circle-line text-2xl text-green-400"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {flaggedContent.filter(c => c.status === 'resolved').length}
              </h3>
              <p className="text-sm text-slate-400">Resolved</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Search Content</label>
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, title, name..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Content Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Types</option>
                  <option value="job_posting">Job Postings</option>
                  <option value="profile">Profiles</option>
                  <option value="message">Messages</option>
                  <option value="document">Documents</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Severity</label>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value as any)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
            </div>

            <p className="text-sm text-slate-400 mt-4">
              Showing {filteredContent.length} of {flaggedContent.length} flagged items
            </p>
          </div>

          {/* Flagged Content Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Reported
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredContent.map((content) => (
                    <tr key={content.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">
                            {content.details.title || content.details.physicianName || content.details.facilityName || content.contentId}
                          </p>
                          <p className="text-sm text-slate-400">{content.id}</p>
                          {content.details.autoFlagged && (
                            <span className="inline-flex items-center gap-1 text-xs text-purple-400 mt-1">
                              <i className="ri-robot-line"></i>
                              Auto-detected
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <i className={`${getTypeIcon(content.type)} text-slate-400`}></i>
                          <span className="text-slate-300 capitalize">{content.type.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-300 text-sm max-w-xs truncate">{content.reason}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getSeverityColor(content.severity)}-500/20 text-${getSeverityColor(content.severity)}-300 whitespace-nowrap`}>
                          {content.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(content.status)}-500/20 text-${getStatusColor(content.status)}-300 whitespace-nowrap`}>
                          {content.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-slate-300 text-sm">{content.reportedBy}</p>
                          <p className="text-xs text-slate-500">{new Date(content.reportedAt).toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedContent(content);
                              setShowDetailsModal(true);
                            }}
                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors whitespace-nowrap"
                          >
                            View Details
                          </button>
                          {content.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleContentAction(content, 'approve')}
                                className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm transition-colors whitespace-nowrap"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleContentAction(content, 'remove')}
                                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors whitespace-nowrap"
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Fraud Detection Tab */}
      {activeTab === 'fraud_detection' && (
        <>
          {/* Fraud Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-shield-cross-line text-2xl text-red-400"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {fraudAlerts.filter(a => a.status === 'active').length}
              </h3>
              <p className="text-sm text-slate-400">Active Alerts</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-error-warning-line text-2xl text-red-400"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {fraudAlerts.filter(a => a.severity === 'critical').length}
              </h3>
              <p className="text-sm text-slate-400">Critical Threats</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-search-eye-line text-2xl text-purple-400"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {fraudAlerts.filter(a => a.status === 'investigating').length}
              </h3>
              <p className="text-sm text-slate-400">Investigating</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-percent-line text-2xl text-amber-400"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {Math.round(fraudAlerts.reduce((sum, a) => sum + a.score, 0) / fraudAlerts.length)}
              </h3>
              <p className="text-sm text-slate-400">Avg Fraud Score</p>
            </div>
          </div>

          {/* Fraud Detection Info */}
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-shield-cross-line text-2xl text-red-400"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Automated Fraud Detection System</h3>
                <p className="text-slate-300 text-sm mb-3">
                  Our AI-powered fraud detection system continuously monitors platform activity for suspicious patterns, 
                  credential mismatches, payment anomalies, and policy violations. High-risk alerts are automatically 
                  flagged for immediate admin review.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <i className="ri-checkbox-circle-line text-green-400"></i>
                    <span>Real-time monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <i className="ri-checkbox-circle-line text-green-400"></i>
                    <span>Multi-database verification</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <i className="ri-checkbox-circle-line text-green-400"></i>
                    <span>Behavioral analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <i className="ri-checkbox-circle-line text-green-400"></i>
                    <span>Pattern recognition</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fraud Alerts Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">Fraud Detection Alerts</h3>
              <p className="text-sm text-slate-400 mt-1">Automatically detected suspicious activity requiring review</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Alert
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Fraud Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {fraudAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium capitalize">{alert.type.replace('_', ' ')}</p>
                          <p className="text-sm text-slate-400">{alert.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white text-sm">{alert.name}</p>
                          <p className="text-xs text-slate-400">{alert.entity} • {alert.entityId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-300 text-sm max-w-xs">{alert.details}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-[100px]">
                            <div
                              className={`h-2 rounded-full ${
                                alert.score >= 90 ? 'bg-red-500' :
                                alert.score >= 70 ? 'bg-orange-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${alert.score}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-sm font-medium">{alert.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getSeverityColor(alert.severity)}-500/20 text-${getSeverityColor(alert.severity)}-300 whitespace-nowrap`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(alert.status)}-500/20 text-${getStatusColor(alert.status)}-300 whitespace-nowrap`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors whitespace-nowrap">
                            Investigate
                          </button>
                          <button className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors whitespace-nowrap">
                            Suspend
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Content Details Modal */}
      {showDetailsModal && selectedContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
              <div>
                <h3 className="text-xl font-bold text-white">Flagged Content Details</h3>
                <p className="text-sm text-slate-400">{selectedContent.id}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Content Info */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Content Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Content Type</p>
                    <p className="text-white capitalize">{selectedContent.type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Content ID</p>
                    <p className="text-white">{selectedContent.contentId}</p>
                  </div>
                  {selectedContent.details.title && (
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500 mb-1">Title</p>
                      <p className="text-white">{selectedContent.details.title}</p>
                    </div>
                  )}
                  {selectedContent.details.facilityName && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Facility</p>
                      <p className="text-white">{selectedContent.details.facilityName}</p>
                    </div>
                  )}
                  {selectedContent.details.physicianName && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Physician</p>
                      <p className="text-white">{selectedContent.details.physicianName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Flag Details */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Flag Details</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Reason</p>
                    <p className="text-white">{selectedContent.reason}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Severity</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getSeverityColor(selectedContent.severity)}-500/20 text-${getSeverityColor(selectedContent.severity)}-300 whitespace-nowrap`}>
                        {selectedContent.severity}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(selectedContent.status)}-500/20 text-${getStatusColor(selectedContent.status)}-300 whitespace-nowrap`}>
                        {selectedContent.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Flag Count</p>
                      <p className="text-white">{selectedContent.details.flagCount}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Reported By</p>
                      <p className="text-white">{selectedContent.reportedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Reported At</p>
                      <p className="text-white">{new Date(selectedContent.reportedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedContent.details.autoFlagged && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <i className="ri-robot-line text-purple-400"></i>
                        <span className="text-purple-300 text-sm font-medium">Automatically Detected</span>
                      </div>
                      {selectedContent.details.fraudScore && (
                        <p className="text-sm text-purple-200 mt-1">
                          Fraud Score: {selectedContent.details.fraudScore}/100
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution Info */}
              {selectedContent.status === 'resolved' && selectedContent.resolution && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Resolution</h4>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-300 mb-2">{selectedContent.resolution}</p>
                    <div className="text-xs text-green-200/80">
                      <p>Reviewed by: {selectedContent.reviewedBy}</p>
                      <p>Reviewed at: {selectedContent.reviewedAt && new Date(selectedContent.reviewedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedContent.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleContentAction(selectedContent, 'approve');
                    }}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors whitespace-nowrap"
                  >
                    <i className="ri-checkbox-circle-line mr-2"></i>
                    Approve Content
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleContentAction(selectedContent, 'remove');
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors whitespace-nowrap"
                  >
                    <i className="ri-delete-bin-line mr-2"></i>
                    Remove Content
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleContentAction(selectedContent, 'dismiss');
                    }}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors whitespace-nowrap"
                  >
                    <i className="ri-close-circle-line mr-2"></i>
                    Dismiss Flag
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {showActionModal && selectedContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">
                {actionType === 'approve' && 'Approve Content'}
                {actionType === 'remove' && 'Remove Content'}
                {actionType === 'suspend_user' && 'Suspend User'}
                {actionType === 'dismiss' && 'Dismiss Flag'}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-alert-line text-amber-400 text-xl mt-0.5"></i>
                  <div>
                    <p className="text-amber-300 font-medium mb-1">Action Requires Justification</p>
                    <p className="text-sm text-amber-200/80">
                      This action will be logged with your admin identity, timestamp, and IP address.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-2">Content: <span className="text-white font-medium">{selectedContent.contentId}</span></p>
                <p className="text-sm text-slate-400 mb-2">Type: <span className="text-white font-medium capitalize">{selectedContent.type.replace('_', ' ')}</span></p>
                <p className="text-sm text-slate-400 mb-2">Severity: <span className="text-white font-medium capitalize">{selectedContent.severity}</span></p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Justification <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={actionJustification}
                  onChange={(e) => setActionJustification(e.target.value)}
                  placeholder="Provide detailed justification for this action..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p>Admin: {session?.adminEmail}</p>
                <p>Session ID: {session?.sessionId.substring(0, 20)}...</p>
                <p>Timestamp: {new Date().toISOString()}</p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setActionJustification('');
                }}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={executeContentAction}
                disabled={!actionJustification.trim()}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  actionType === 'approve' || actionType === 'dismiss'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
