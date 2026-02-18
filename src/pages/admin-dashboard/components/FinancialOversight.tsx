
import { useState } from 'react';

interface EscrowTransaction {
  id: string;
  assignmentId: string;
  physicianName: string;
  physicianId: string;
  facilityName: string;
  facilityId: string;
  specialty: string;
  assignmentDates: string;
  totalAmount: number;
  platformFee: number;
  physicianPayout: number;
  escrowStatus: 'Held' | 'Released' | 'On Hold' | 'Partially Released';
  escrowProvider: 'PayPal' | 'Stripe' | 'Other';
  providerTransactionId: string;
  fundedDate: string;
  releaseDate?: string;
  holdReason?: string;
  holdBy?: string;
  lastAction?: string;
  lastActionBy?: string;
  lastActionDate?: string;
}

interface PlatformFeeRecord {
  id: string;
  assignmentId: string;
  facilityName: string;
  physicianName: string;
  totalAmount: number;
  feePercentage: number;
  feeAmount: number;
  collectedDate: string;
  status: 'Collected' | 'Pending' | 'Failed';
}

interface FinancialAlert {
  id: string;
  type: 'Payment Failure' | 'API Error' | 'Escrow Delay' | 'Fee Collection Failed' | 'Manual Override';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  details: string;
  timestamp: string;
  resolved: boolean;
}

const FinancialOversight = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'escrow' | 'fees' | 'alerts'>('overview');
  const [selectedTransaction, setSelectedTransaction] = useState<EscrowTransaction | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'hold' | 'release' | null>(null);
  const [actionJustification, setActionJustification] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data - Replace with real API calls
  const financialSummary = {
    totalInEscrow: 487500,
    totalReleased: 1245000,
    totalOnHold: 45000,
    platformFeesCollected: 186750,
    activeTransactions: 32,
    pendingReleases: 8,
    failedTransactions: 2,
    averageEscrowTime: 14
  };

  const escrowTransactions: EscrowTransaction[] = [
    {
      id: 'ESC-2024-001',
      assignmentId: 'ASG-2024-156',
      physicianName: 'Dr. Sarah Johnson',
      physicianId: 'PHY-001',
      facilityName: 'Memorial Hospital',
      facilityId: 'FAC-001',
      specialty: 'Emergency Medicine',
      assignmentDates: 'Jan 15-22, 2024',
      totalAmount: 15000,
      platformFee: 2250,
      physicianPayout: 12750,
      escrowStatus: 'Held',
      escrowProvider: 'PayPal',
      providerTransactionId: 'PP-TXN-789456123',
      fundedDate: '2024-01-10T14:30:00Z',
      lastAction: 'Escrow funded',
      lastActionBy: 'System',
      lastActionDate: '2024-01-10T14:30:00Z'
    },
    {
      id: 'ESC-2024-002',
      assignmentId: 'ASG-2024-157',
      physicianName: 'Dr. Michael Chen',
      physicianId: 'PHY-002',
      facilityName: 'City Medical Center',
      facilityId: 'FAC-002',
      specialty: 'Cardiology',
      assignmentDates: 'Jan 8-15, 2024',
      totalAmount: 18000,
      platformFee: 2700,
      physicianPayout: 15300,
      escrowStatus: 'On Hold',
      escrowProvider: 'Stripe',
      providerTransactionId: 'STR-CH-456789012',
      fundedDate: '2024-01-05T10:15:00Z',
      holdReason: 'Dispute filed by facility - quality concerns',
      holdBy: 'Admin: John Smith (Finance Manager)',
      lastAction: 'Payment hold applied',
      lastActionBy: 'John Smith (Finance Manager)',
      lastActionDate: '2024-01-16T09:20:00Z'
    },
    {
      id: 'ESC-2024-003',
      assignmentId: 'ASG-2024-158',
      physicianName: 'Dr. Emily Rodriguez',
      physicianId: 'PHY-003',
      facilityName: 'Regional Health System',
      facilityId: 'FAC-003',
      specialty: 'Anesthesiology',
      assignmentDates: 'Dec 20-27, 2023',
      totalAmount: 22000,
      platformFee: 3300,
      physicianPayout: 18700,
      escrowStatus: 'Released',
      escrowProvider: 'PayPal',
      providerTransactionId: 'PP-TXN-123789456',
      fundedDate: '2023-12-18T16:45:00Z',
      releaseDate: '2024-01-05T11:30:00Z',
      lastAction: 'Payment released to physician',
      lastActionBy: 'System',
      lastActionDate: '2024-01-05T11:30:00Z'
    },
    {
      id: 'ESC-2024-004',
      assignmentId: 'ASG-2024-159',
      physicianName: 'Dr. James Wilson',
      physicianId: 'PHY-004',
      facilityName: 'University Hospital',
      facilityId: 'FAC-004',
      specialty: 'Radiology',
      assignmentDates: 'Jan 10-17, 2024',
      totalAmount: 16500,
      platformFee: 2475,
      physicianPayout: 14025,
      escrowStatus: 'Held',
      escrowProvider: 'Stripe',
      providerTransactionId: 'STR-CH-789012345',
      fundedDate: '2024-01-08T13:20:00Z',
      lastAction: 'Escrow funded',
      lastActionBy: 'System',
      lastActionDate: '2024-01-08T13:20:00Z'
    }
  ];

  const platformFees: PlatformFeeRecord[] = [
    {
      id: 'FEE-2024-001',
      assignmentId: 'ASG-2024-158',
      facilityName: 'Regional Health System',
      physicianName: 'Dr. Emily Rodriguez',
      totalAmount: 22000,
      feePercentage: 15,
      feeAmount: 3300,
      collectedDate: '2023-12-18T16:45:00Z',
      status: 'Collected'
    },
    {
      id: 'FEE-2024-002',
      assignmentId: 'ASG-2024-156',
      facilityName: 'Memorial Hospital',
      physicianName: 'Dr. Sarah Johnson',
      totalAmount: 15000,
      feePercentage: 15,
      feeAmount: 2250,
      collectedDate: '2024-01-10T14:30:00Z',
      status: 'Collected'
    },
    {
      id: 'FEE-2024-003',
      assignmentId: 'ASG-2024-157',
      facilityName: 'City Medical Center',
      physicianName: 'Dr. Michael Chen',
      totalAmount: 18000,
      feePercentage: 15,
      feeAmount: 2700,
      collectedDate: '2024-01-05T10:15:00Z',
      status: 'Collected'
    },
    {
      id: 'FEE-2024-004',
      assignmentId: 'ASG-2024-160',
      facilityName: 'Community Hospital',
      physicianName: 'Dr. Lisa Anderson',
      totalAmount: 12000,
      feePercentage: 15,
      feeAmount: 1800,
      collectedDate: '2024-01-12T09:00:00Z',
      status: 'Pending'
    }
  ];

  const financialAlerts: FinancialAlert[] = [
    {
      id: 'ALERT-001',
      type: 'Manual Override',
      severity: 'High',
      message: 'Payment hold applied manually',
      details: 'Finance Manager John Smith placed hold on ESC-2024-002 due to dispute',
      timestamp: '2024-01-16T09:20:00Z',
      resolved: false
    },
    {
      id: 'ALERT-002',
      type: 'API Error',
      severity: 'Medium',
      message: 'Stripe API connection timeout',
      details: 'Temporary connection issue with Stripe API. Retry successful after 2 attempts.',
      timestamp: '2024-01-15T14:35:00Z',
      resolved: true
    },
    {
      id: 'ALERT-003',
      type: 'Escrow Delay',
      severity: 'Low',
      message: 'Escrow release delayed',
      details: 'ESC-2024-005 release delayed by 24 hours due to weekend processing',
      timestamp: '2024-01-14T10:00:00Z',
      resolved: true
    }
  ];

  const currentAdmin = {
    name: 'John Smith',
    role: 'Finance Manager',
    sessionId: 'SESS-789456123'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleActionClick = (transaction: EscrowTransaction, type: 'hold' | 'release') => {
    setSelectedTransaction(transaction);
    setActionType(type);
    setShowActionModal(true);
    setActionJustification('');
  };

  const handleActionSubmit = () => {
    if (!actionJustification.trim() || !selectedTransaction) return;

    // Log the action with full audit trail
    const auditLog = {
      action: actionType === 'hold' ? 'PAYMENT_HOLD' : 'PAYMENT_RELEASE',
      transactionId: selectedTransaction.id,
      adminName: currentAdmin.name,
      adminRole: currentAdmin.role,
      sessionId: currentAdmin.sessionId,
      timestamp: new Date().toISOString(),
      justification: actionJustification,
      ipAddress: '192.168.1.100', // Would be captured from request
      previousStatus: selectedTransaction.escrowStatus,
      newStatus: actionType === 'hold' ? 'On Hold' : 'Released'
    };

    console.log('Audit Log:', auditLog);

    // In production, this would call the API to execute the action
    alert(`${actionType === 'hold' ? 'Payment Hold' : 'Payment Release'} action logged and executed.\n\nTransaction: ${selectedTransaction.id}\nAdmin: ${currentAdmin.name}\nJustification: ${actionJustification}`);

    setShowActionModal(false);
    setSelectedTransaction(null);
    setActionType(null);
    setActionJustification('');
  };

  const filteredTransactions = escrowTransactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.physicianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.assignmentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.escrowStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Held': return 'bg-blue-100 text-blue-800';
      case 'Released': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      case 'Partially Released': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial & Escrow Oversight</h2>
          <p className="text-slate-600 mt-1">Real-time financial monitoring and platform fee management</p>
        </div>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2">
          <i className="ri-download-line"></i>
          Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-teal-600 text-teal-600 font-medium'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('escrow')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'escrow'
                ? 'border-teal-600 text-teal-600 font-medium'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Escrow Transactions
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'fees'
                ? 'border-teal-600 text-teal-600 font-medium'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Platform Fees
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'alerts'
                ? 'border-teal-600 text-teal-600 font-medium'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Alerts
            {financialAlerts.filter(a => !a.resolved).length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                {financialAlerts.filter(a => !a.resolved).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm">Total in Escrow</span>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-safe-line text-blue-600 text-xl"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(financialSummary.totalInEscrow)}</div>
              <div className="text-sm text-slate-500 mt-1">{financialSummary.activeTransactions} active transactions</div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm">Total Released</span>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-check-double-line text-green-600 text-xl"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(financialSummary.totalReleased)}</div>
              <div className="text-sm text-slate-500 mt-1">{financialSummary.pendingReleases} pending releases</div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm">On Hold</span>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <i className="ri-pause-circle-line text-red-600 text-xl"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(financialSummary.totalOnHold)}</div>
              <div className="text-sm text-slate-500 mt-1">Disputed or held</div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm">Platform Fees</span>
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <i className="ri-money-dollar-circle-line text-teal-600 text-xl"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(financialSummary.platformFeesCollected)}</div>
              <div className="text-sm text-slate-500 mt-1">15% automatic collection</div>
            </div>
          </div>

          {/* Integration Status */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Third-Party Integration Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <i className="ri-paypal-line text-white text-xl"></i>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">PayPal</div>
                    <div className="text-sm text-slate-600">Escrow Provider</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Connected</span>
                  <span className="text-sm text-slate-600">Last sync: 2 min ago</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <i className="ri-bank-card-line text-white text-xl"></i>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Stripe</div>
                    <div className="text-sm text-slate-600">Payment Processor</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Connected</span>
                  <span className="text-sm text-slate-600">Last sync: 5 min ago</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                    <i className="ri-shield-check-line text-white text-xl"></i>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Escrow.com</div>
                    <div className="text-sm text-slate-600">Licensed Escrow Service</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Connected</span>
                  <span className="text-sm text-slate-600">Last sync: 1 min ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Financial Activity</h3>
            <div className="space-y-3">
              {escrowTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                      <i className="ri-exchange-dollar-line text-teal-600"></i>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{transaction.id}</div>
                      <div className="text-sm text-slate-600">{transaction.physicianName} • {transaction.facilityName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-slate-900">{formatCurrency(transaction.totalAmount)}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.escrowStatus)}`}>
                      {transaction.escrowStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Escrow Transactions Tab */}
      {activeTab === 'escrow' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    type="text"
                    placeholder="Search by transaction ID, physician, facility, or assignment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent whitespace-nowrap"
              >
                <option value="all">All Status</option>
                <option value="Held">Held</option>
                <option value="Released">Released</option>
                <option value="On Hold">On Hold</option>
                <option value="Partially Released">Partially Released</option>
              </select>
            </div>
            <div className="mt-3 text-sm text-slate-600">
              Showing {filteredTransactions.length} of {escrowTransactions.length} transactions
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Transaction ID</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Assignment</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Physician</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Facility</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Amount</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Platform Fee</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Provider</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 whitespace-nowrap">{transaction.id}</div>
                        <div className="text-sm text-slate-600 whitespace-nowrap">{transaction.assignmentId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{transaction.specialty}</div>
                        <div className="text-sm text-slate-600 whitespace-nowrap">{transaction.assignmentDates}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{transaction.physicianName}</div>
                        <div className="text-sm text-slate-600 whitespace-nowrap">{transaction.physicianId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{transaction.facilityName}</div>
                        <div className="text-sm text-slate-600 whitespace-nowrap">{transaction.facilityId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 whitespace-nowrap">{formatCurrency(transaction.totalAmount)}</div>
                        <div className="text-sm text-slate-600 whitespace-nowrap">Payout: {formatCurrency(transaction.physicianPayout)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-teal-600 whitespace-nowrap">{formatCurrency(transaction.platformFee)}</div>
                        <div className="text-sm text-slate-600 whitespace-nowrap">15%</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${getStatusColor(transaction.escrowStatus)}`}>
                          {transaction.escrowStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{transaction.escrowProvider}</div>
                        <div className="text-sm text-slate-600 whitespace-nowrap">{transaction.providerTransactionId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedTransaction(transaction)}
                            className="px-3 py-1 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-colors whitespace-nowrap"
                          >
                            View Details
                          </button>
                          {transaction.escrowStatus === 'Held' && (
                            <button
                              onClick={() => handleActionClick(transaction, 'hold')}
                              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
                            >
                              Hold
                            </button>
                          )}
                          {(transaction.escrowStatus === 'Held' || transaction.escrowStatus === 'On Hold') && (
                            <button
                              onClick={() => handleActionClick(transaction, 'release')}
                              className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors whitespace-nowrap"
                            >
                              Release
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction Details Modal */}
          {selectedTransaction && !showActionModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Transaction Details</h3>
                    <button
                      onClick={() => setSelectedTransaction(null)}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Transaction Info */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Transaction Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-600">Transaction ID</div>
                        <div className="font-medium text-slate-900">{selectedTransaction.id}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Assignment ID</div>
                        <div className="font-medium text-slate-900">{selectedTransaction.assignmentId}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Status</div>
                        <span className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusColor(selectedTransaction.escrowStatus)}`}>
                          {selectedTransaction.escrowStatus}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Escrow Provider</div>
                        <div className="font-medium text-slate-900">{selectedTransaction.escrowProvider}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Provider Transaction ID</div>
                        <div className="font-medium text-slate-900">{selectedTransaction.providerTransactionId}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Funded Date</div>
                        <div className="font-medium text-slate-900">{formatDate(selectedTransaction.fundedDate)}</div>
                      </div>
                      {selectedTransaction.releaseDate && (
                        <div>
                          <div className="text-sm text-slate-600">Release Date</div>
                          <div className="font-medium text-slate-900">{formatDate(selectedTransaction.releaseDate)}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Parties */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Parties Involved</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-600 mb-1">Physician</div>
                        <div className="font-medium text-slate-900">{selectedTransaction.physicianName}</div>
                        <div className="text-sm text-slate-600">{selectedTransaction.physicianId}</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-600 mb-1">Facility</div>
                        <div className="font-medium text-slate-900">{selectedTransaction.facilityName}</div>
                        <div className="text-sm text-slate-600">{selectedTransaction.facilityId}</div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Financial Breakdown</h4>
                    <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total Amount</span>
                        <span className="font-medium text-slate-900">{formatCurrency(selectedTransaction.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Platform Fee (15%)</span>
                        <span className="font-medium text-teal-600">-{formatCurrency(selectedTransaction.platformFee)}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-2 flex justify-between">
                        <span className="font-semibold text-slate-900">Physician Payout</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(selectedTransaction.physicianPayout)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hold Information */}
                  {selectedTransaction.escrowStatus === 'On Hold' && selectedTransaction.holdReason && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <i className="ri-alert-line text-red-600 text-xl mt-0.5"></i>
                        <div className="flex-1">
                          <div className="font-semibold text-red-900 mb-1">Payment Hold Active</div>
                          <div className="text-sm text-red-800 mb-2">{selectedTransaction.holdReason}</div>
                          <div className="text-sm text-red-700">Held by: {selectedTransaction.holdBy}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Last Action */}
                  {selectedTransaction.lastAction && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Last Action</h4>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <i className="ri-history-line text-slate-600 text-xl mt-0.5"></i>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">{selectedTransaction.lastAction}</div>
                            <div className="text-sm text-slate-600 mt-1">
                              By: {selectedTransaction.lastActionBy} • {formatDate(selectedTransaction.lastActionDate!)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Close
                  </button>
                  {selectedTransaction.escrowStatus === 'Held' && (
                    <button
                      onClick={() => handleActionClick(selectedTransaction, 'hold')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                    >
                      Hold Payment
                    </button>
                  )}
                  {(selectedTransaction.escrowStatus === 'Held' || selectedTransaction.escrowStatus === 'On Hold') && (
                    <button
                      onClick={() => handleActionClick(selectedTransaction, 'release')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                    >
                      Release Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Platform Fees Tab */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          {/* Fee Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm">Total Fees Collected</span>
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <i className="ri-money-dollar-circle-line text-teal-600 text-xl"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(financialSummary.platformFeesCollected)}</div>
              <div className="text-sm text-slate-500 mt-1">From {platformFees.filter(f => f.status === 'Collected').length} assignments</div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm">Average Fee per Assignment</span>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-percent-line text-blue-600 text-xl"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(financialSummary.platformFeesCollected / platformFees.filter(f => f.status === 'Collected').length)}
              </div>
              <div className="text-sm text-slate-500 mt-1">15% standard rate</div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm">Pending Collection</span>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <i className="ri-time-line text-amber-600 text-xl"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(platformFees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.feeAmount, 0))}
              </div>
              <div className="text-sm text-slate-500 mt-1">{platformFees.filter(f => f.status === 'Pending').length} pending</div>
            </div>
          </div>

          {/* Fee Records Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Platform Fee Records</h3>
              <p className="text-sm text-slate-600 mt-1">Automatic 15% fee collection from all assignments</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Fee ID</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Assignment</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Facility</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Physician</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Total Amount</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Fee %</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Fee Amount</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Collected Date</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {platformFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 whitespace-nowrap">{fee.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{fee.assignmentId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{fee.facilityName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{fee.physicianName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 whitespace-nowrap">{formatCurrency(fee.totalAmount)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{fee.feePercentage}%</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-teal-600 whitespace-nowrap">{formatCurrency(fee.feeAmount)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 whitespace-nowrap">{formatDate(fee.collectedDate)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                          fee.status === 'Collected' ? 'bg-green-100 text-green-800' :
                          fee.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fee Calculation Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-blue-600 text-xl mt-0.5"></i>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Automatic Fee Collection</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Platform fees are automatically calculated and collected during the escrow funding process:
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Standard rate: 15% of total assignment amount</li>
                  <li>Fee is deducted before physician payout calculation</li>
                  <li>Transparent reporting for all parties</li>
                  <li>No manual intervention required</li>
                  <li>All fee transactions are logged and auditable</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Alert Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm">Total Alerts</span>
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <i className="ri-notification-line text-slate-600 text-xl"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{financialAlerts.length}</div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm">Active Alerts</span>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <i className="ri-alert-line text-red-600 text-xl"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{financialAlerts.filter(a => !a.resolved).length}</div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm">Critical</span>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <i className="ri-error-warning-line text-red-600 text-xl"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{financialAlerts.filter(a => a.severity === 'Critical' && !a.resolved).length}</div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm">Resolved</span>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-check-line text-green-600 text-xl"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{financialAlerts.filter(a => a.resolved).length}</div>
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {financialAlerts.map((alert) => (
              <div key={alert.id} className={`bg-white rounded-lg border-2 p-6 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      alert.severity === 'Critical' ? 'bg-red-100' :
                      alert.severity === 'High' ? 'bg-orange-100' :
                      alert.severity === 'Medium' ? 'bg-amber-100' :
                      'bg-blue-100'
                    }`}>
                      <i className={`text-2xl ${
                        alert.severity === 'Critical' ? 'ri-error-warning-line text-red-600' :
                        alert.severity === 'High' ? 'ri-alert-line text-orange-600' :
                        alert.severity === 'Medium' ? 'ri-information-line text-amber-600' :
                        'ri-notification-line text-blue-600'
                      }`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-900">{alert.message}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                          alert.severity === 'Medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.resolved ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {alert.resolved ? 'Resolved' : 'Active'}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">{alert.type}</div>
                      <p className="text-sm text-slate-700 mb-3">{alert.details}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <i className="ri-time-line"></i>
                          <span>{formatDate(alert.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Alert Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-blue-600 text-xl mt-0.5"></i>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Financial Alert System</h4>
                <p className="text-sm text-blue-800 mb-2">
                  The system automatically monitors all financial operations and generates alerts for:
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Payment processing failures or delays</li>
                  <li>API connection issues with payment providers</li>
                  <li>Manual payment holds or releases by admins</li>
                  <li>Escrow funding or release anomalies</li>
                  <li>Fee collection failures</li>
                  <li>Unusual transaction patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {showActionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  {actionType === 'hold' ? 'Hold Payment' : 'Release Payment'}
                </h3>
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setActionType(null);
                    setActionJustification('');
                  }}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Warning */}
              <div className={`p-4 rounded-lg border-2 ${
                actionType === 'hold' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-start gap-3">
                  <i className={`text-xl mt-0.5 ${
                    actionType === 'hold' ? 'ri-alert-line text-red-600' : 'ri-information-line text-green-600'
                  }`}></i>
                  <div>
                    <div className={`font-semibold mb-1 ${
                      actionType === 'hold' ? 'text-red-900' : 'text-green-900'
                    }`}>
                      {actionType === 'hold' ? 'Warning: Payment Hold' : 'Confirm Payment Release'}
                    </div>
                    <p className={`text-sm ${
                      actionType === 'hold' ? 'text-red-800' : 'text-green-800'
                    }`}>
                      {actionType === 'hold' 
                        ? 'This action will prevent the escrowed funds from being released to the physician. This should only be done in cases of disputes or policy violations.'
                        : 'This action will release the escrowed funds to the physician. This action cannot be undone.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Transaction ID:</span>
                  <span className="font-medium text-slate-900">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-medium text-slate-900">{formatCurrency(selectedTransaction.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Physician Payout:</span>
                  <span className="font-medium text-slate-900">{formatCurrency(selectedTransaction.physicianPayout)}</span>
                </div>
              </div>

              {/* Justification */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Justification <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={actionJustification}
                  onChange={(e) => setActionJustification(e.target.value)}
                  placeholder={`Provide detailed justification for this ${actionType === 'hold' ? 'payment hold' : 'payment release'}...`}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
                <p className="text-sm text-slate-600 mt-1">
                  This justification will be permanently logged with your admin identity and timestamp.
                </p>
              </div>

              {/* Admin Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-900">
                  <div className="font-semibold mb-1">Action will be logged as:</div>
                  <div>Admin: {currentAdmin.name}</div>
                  <div>Role: {currentAdmin.role}</div>
                  <div>Session: {currentAdmin.sessionId}</div>
                  <div>Timestamp: {new Date().toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setActionType(null);
                  setActionJustification('');
                }}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleActionSubmit}
                disabled={!actionJustification.trim()}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  actionType === 'hold'
                    ? 'bg-red-600 hover:bg-red-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed'
                }`}
              >
                {actionType === 'hold' ? 'Confirm Hold' : 'Confirm Release'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialOversight;
