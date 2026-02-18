import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminRole } from '../../types/admin';
import { ROLE_LABELS, ROLE_DESCRIPTIONS } from '../../utils/adminPermissions';
import { adminAuditLogger } from '../../utils/adminAuditLogger';
import { NotificationPanel } from '../../components/feature/NotificationPanel';
import UserManagement from './components/UserManagement';
import ContractEnforcement from './components/ContractEnforcement';
import DisputeResolution from './components/DisputeResolution';
import FinancialOversight from './components/FinancialOversight';
import VendorManagement from './components/VendorManagement';
import ContentModeration from './components/ContentModeration';
import WorkflowMonitoring from './components/WorkflowMonitoring';
import AnalyticsIntelligence from './components/AnalyticsIntelligence';
import PlatformFeeManagement from './components/PlatformFeeManagement';
import BankingInformation from './components/BankingInformation';

interface AdminSession {
  sessionId: string;
  adminId: string;
  adminEmail: string;
  adminRole: AdminRole;
  fullName: string;
  loginTime: string;
  expiresAt: string;
  permissions: any;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'contracts' | 'disputes' | 'financial' | 'vendors' | 'moderation' | 'workflows' | 'analytics' | 'fees' | 'banking'>('users');

  useEffect(() => {
    // Check for valid admin session
    const sessionData = localStorage.getItem('admin_session');
    
    if (!sessionData) {
      navigate('/admin/login');
      return;
    }

    try {
      const parsedSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (new Date(parsedSession.expiresAt) < new Date()) {
        localStorage.removeItem('admin_session');
        navigate('/admin/login');
        return;
      }

      setSession(parsedSession);
      setLoading(false);

      // Log dashboard access
      adminAuditLogger.log(
        parsedSession.adminId,
        parsedSession.adminEmail,
        parsedSession.adminRole,
        'DASHBOARD_ACCESS',
        'admin_dashboard',
        'main',
        { page: 'dashboard' },
        parsedSession.sessionId
      );
    } catch (error) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    if (session) {
      adminAuditLogger.log(
        session.adminId,
        session.adminEmail,
        session.adminRole,
        'ADMIN_LOGOUT',
        'session',
        session.sessionId,
        { logoutTime: new Date().toISOString() },
        session.sessionId
      );
    }
    
    localStorage.removeItem('admin_session');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-red-400 animate-spin"></i>
          <p className="text-slate-400 mt-4">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const quickActions = [
    { icon: 'ri-user-settings-line', label: 'User Management', color: 'blue', permission: session.permissions.canViewUsers },
    { icon: 'ri-money-dollar-circle-line', label: 'Financial Oversight', color: 'green', permission: session.permissions.canViewFinancials },
    { icon: 'ri-scales-line', label: 'Dispute Resolution', color: 'amber', permission: session.permissions.canViewDisputes },
    { icon: 'ri-file-shield-line', label: 'Contract Enforcement', color: 'purple', permission: session.permissions.canViewContracts },
    { icon: 'ri-store-line', label: 'Vendor Management', color: 'teal', permission: session.permissions.canManageVendors },
    { icon: 'ri-bar-chart-box-line', label: 'Analytics Dashboard', color: 'indigo', permission: session.permissions.canViewAnalytics },
  ];

  const recentActivity = [
    { action: 'User verification approved', user: 'Dr. Sarah Johnson', time: '5 minutes ago', icon: 'ri-checkbox-circle-line', color: 'green' },
    { action: 'Payment released', facility: 'Memorial Hospital', time: '12 minutes ago', icon: 'ri-money-dollar-circle-line', color: 'blue' },
    { action: 'Dispute escalated', case: 'DISP-2024-0156', time: '28 minutes ago', icon: 'ri-alert-line', color: 'amber' },
    { action: 'Contract signed', parties: 'Dr. Chen & City Medical', time: '1 hour ago', icon: 'ri-file-text-line', color: 'purple' },
  ];

  const tabs = [
    { id: 'users', label: 'User Management', icon: 'ri-user-line' },
    { id: 'vendors', label: 'Vendor Management', icon: 'ri-store-line' },
    { id: 'content', label: 'Content Moderation', icon: 'ri-shield-check-line' },
    { id: 'workflow', label: 'Workflow Monitoring', icon: 'ri-flow-chart' },
    { id: 'analytics', label: 'Analytics & Intelligence', icon: 'ri-bar-chart-box-line' },
    { id: 'financial', label: 'Financial Oversight', icon: 'ri-money-dollar-circle-line' },
    { id: 'fees', label: 'Platform Fees', icon: 'ri-percent-line' },
    { id: 'banking', label: 'Banking Info', icon: 'ri-bank-line' },
    { id: 'disputes', label: 'Dispute Resolution', icon: 'ri-scales-line' },
    { id: 'contracts', label: 'Contract Enforcement', icon: 'ri-file-shield-line' }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-shield-keyhole-line text-xl text-red-400"></i>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                  <p className="text-xs text-slate-400">Platform Management</p>
                </div>
              </div>
            </button>

            <div className="flex items-center gap-4">
              {/* Notification Button */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors relative"
              >
                <i className="ri-notification-3-line text-xl"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Session Info */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-700/50 rounded-lg">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-red-400"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{session.fullName}</p>
                  <p className="text-xs text-slate-400">{ROLE_LABELS[session.adminRole]}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <i className="ri-logout-box-line"></i>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {session.fullName}</h2>
          <p className="text-slate-400">{ROLE_DESCRIPTIONS[session.adminRole]}</p>
        </div>

        {/* Role Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
          <i className="ri-shield-star-line text-red-400"></i>
          <span className="text-sm font-medium text-red-300">Role: {ROLE_LABELS[session.adminRole]}</span>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-2 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'users'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <i className="ri-user-settings-line mr-2"></i>
              User Management
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'vendors'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <i className="ri-store-line mr-2"></i>
              Vendors
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <i className="ri-bar-chart-box-line mr-2"></i>
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'financial'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <i className="ri-money-dollar-circle-line mr-2"></i>
              Financial
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'fees'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <i className="ri-percent-line mr-2"></i>
              Platform Fees
            </button>
            <button
              onClick={() => setActiveTab('banking')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'banking'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <i className="ri-bank-line mr-2"></i>
              Banking
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'disputes'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <i className="ri-scales-line mr-2"></i>
              Disputes
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'contracts'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <i className="ri-file-shield-line mr-2"></i>
              Contracts
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'moderation'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <i className="ri-shield-check-line mr-2"></i>
              Moderation
            </button>
            <button
              onClick={() => setActiveTab('workflows')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'workflows'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <i className="ri-flow-chart mr-2"></i>
              Workflows
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && <UserManagement session={session} />}
        {activeTab === 'contracts' && <ContractEnforcement session={session} />}
        {activeTab === 'disputes' && <DisputeResolution session={session} />}
        {activeTab === 'financial' && <FinancialOversight session={session} />}
        {activeTab === 'vendors' && <VendorManagement session={session} />}
        {activeTab === 'moderation' && <ContentModeration session={session} />}
        {activeTab === 'workflows' && <WorkflowMonitoring />}
        {activeTab === 'analytics' && <AnalyticsIntelligence />}
        {activeTab === 'fees' && <PlatformFeeManagement />}
        {activeTab === 'banking' && <BankingInformation session={session} />}

        {/* Session Info */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Session Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500 mb-1">Session ID</p>
              <p className="text-slate-300 font-mono text-xs">{session.sessionId.substring(0, 20)}...</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Login Time</p>
              <p className="text-slate-300">{new Date(session.loginTime).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Session Expires</p>
              <p className="text-slate-300">{new Date(session.expiresAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}
