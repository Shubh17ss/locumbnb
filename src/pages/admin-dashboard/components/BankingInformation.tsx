import { useState } from 'react';
import { adminAuditLogger } from '../../../utils/adminAuditLogger';

interface BankAccount {
  id: string;
  accountType: 'Operating' | 'Escrow Reserve' | 'Fee Collection' | 'Payout';
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
  currency: string;
  status: 'Active' | 'Inactive' | 'Pending Verification';
  balance?: number;
  lastUpdated: string;
  addedBy: string;
  addedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

interface PaymentProvider {
  id: string;
  providerName: 'PayPal' | 'Stripe' | 'Escrow.com' | 'Other';
  accountEmail?: string;
  apiKeyLast4?: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
  totalTransactions: number;
  totalVolume: number;
}

interface AdminSession {
  sessionId: string;
  adminId: string;
  adminEmail: string;
  adminRole: string;
  fullName: string;
}

interface BankingInformationProps {
  session: AdminSession;
}

const BankingInformation = ({ session }: BankingInformationProps) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'providers' | 'transactions'>('accounts');
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  // Form state for new account
  const [accountType, setAccountType] = useState<string>('Operating');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [currency, setCurrency] = useState('USD');

  // Mock data - Replace with real API calls
  const bankAccounts: BankAccount[] = [
    {
      id: 'BANK-001',
      accountType: 'Operating',
      bankName: 'Chase Bank',
      accountNumber: '****1234',
      routingNumber: '021000021',
      accountHolderName: 'LOCUM BNB LLC',
      currency: 'USD',
      status: 'Active',
      balance: 487500,
      lastUpdated: '2024-03-21T10:30:00Z',
      addedBy: 'John Smith (Super Admin)',
      addedAt: '2024-01-15T09:00:00Z',
      verifiedBy: 'Sarah Johnson (Finance Manager)',
      verifiedAt: '2024-01-15T14:30:00Z'
    },
    {
      id: 'BANK-002',
      accountType: 'Fee Collection',
      bankName: 'Bank of America',
      accountNumber: '****5678',
      routingNumber: '026009593',
      accountHolderName: 'LOCUM BNB LLC',
      currency: 'USD',
      status: 'Active',
      balance: 186750,
      lastUpdated: '2024-03-21T11:15:00Z',
      addedBy: 'John Smith (Super Admin)',
      addedAt: '2024-01-20T10:00:00Z',
      verifiedBy: 'Sarah Johnson (Finance Manager)',
      verifiedAt: '2024-01-20T15:00:00Z'
    },
    {
      id: 'BANK-003',
      accountType: 'Escrow Reserve',
      bankName: 'Wells Fargo',
      accountNumber: '****9012',
      routingNumber: '121000248',
      accountHolderName: 'LOCUM BNB ESCROW LLC',
      currency: 'USD',
      status: 'Active',
      balance: 1245000,
      lastUpdated: '2024-03-21T09:45:00Z',
      addedBy: 'John Smith (Super Admin)',
      addedAt: '2024-01-10T11:30:00Z',
      verifiedBy: 'John Smith (Super Admin)',
      verifiedAt: '2024-01-10T16:00:00Z'
    },
    {
      id: 'BANK-004',
      accountType: 'Payout',
      bankName: 'Citibank',
      accountNumber: '****3456',
      routingNumber: '021000089',
      accountHolderName: 'LOCUM BNB LLC',
      currency: 'USD',
      status: 'Pending Verification',
      lastUpdated: '2024-03-20T14:00:00Z',
      addedBy: 'Sarah Johnson (Finance Manager)',
      addedAt: '2024-03-20T14:00:00Z'
    }
  ];

  const paymentProviders: PaymentProvider[] = [
    {
      id: 'PROV-001',
      providerName: 'PayPal',
      accountEmail: 'payments@locumbnb.com',
      apiKeyLast4: '****7890',
      status: 'Connected',
      lastSync: '2024-03-21T11:30:00Z',
      totalTransactions: 156,
      totalVolume: 2340000
    },
    {
      id: 'PROV-002',
      providerName: 'Stripe',
      accountEmail: 'billing@locumbnb.com',
      apiKeyLast4: '****4567',
      status: 'Connected',
      lastSync: '2024-03-21T11:28:00Z',
      totalTransactions: 89,
      totalVolume: 1567000
    },
    {
      id: 'PROV-003',
      providerName: 'Escrow.com',
      accountEmail: 'escrow@locumbnb.com',
      apiKeyLast4: '****1234',
      status: 'Connected',
      lastSync: '2024-03-21T11:25:00Z',
      totalTransactions: 45,
      totalVolume: 987000
    }
  ];

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

  const handleAddAccount = () => {
    if (!bankName || !accountNumber || !routingNumber || !accountHolderName) {
      alert('Please fill in all required fields');
      return;
    }

    const auditLog = {
      action: 'ADD_BANK_ACCOUNT',
      adminName: session.fullName,
      adminRole: session.adminRole,
      adminId: session.adminId,
      sessionId: session.sessionId,
      timestamp: new Date().toISOString(),
      accountType,
      bankName,
      accountNumber: `****${accountNumber.slice(-4)}`,
      routingNumber,
      accountHolderName,
      currency
    };

    adminAuditLogger.log(
      session.adminId,
      session.adminEmail,
      session.adminRole,
      'ADD_BANK_ACCOUNT',
      'banking',
      'new_account',
      auditLog,
      session.sessionId
    );

    console.log('Bank Account Addition Audit Log:', auditLog);
    alert(`Bank account added successfully!\n\nAccount Type: ${accountType}\nBank: ${bankName}\n\nThis action has been logged with your admin identity.`);

    setShowAddAccountModal(false);
    resetForm();
  };

  const handleUpdateAccount = (account: BankAccount, newStatus: string) => {
    const auditLog = {
      action: 'UPDATE_BANK_ACCOUNT',
      adminName: session.fullName,
      adminRole: session.adminRole,
      adminId: session.adminId,
      sessionId: session.sessionId,
      timestamp: new Date().toISOString(),
      accountId: account.id,
      accountType: account.accountType,
      previousStatus: account.status,
      newStatus
    };

    adminAuditLogger.log(
      session.adminId,
      session.adminEmail,
      session.adminRole,
      'UPDATE_BANK_ACCOUNT',
      'banking',
      account.id,
      auditLog,
      session.sessionId
    );

    console.log('Bank Account Update Audit Log:', auditLog);
    alert(`Account ${account.id} status updated to ${newStatus}\n\nThis action has been logged with your admin identity.`);
  };

  const handleVerifyAccount = (account: BankAccount) => {
    const auditLog = {
      action: 'VERIFY_BANK_ACCOUNT',
      adminName: session.fullName,
      adminRole: session.adminRole,
      adminId: session.adminId,
      sessionId: session.sessionId,
      timestamp: new Date().toISOString(),
      accountId: account.id,
      accountType: account.accountType,
      bankName: account.bankName
    };

    adminAuditLogger.log(
      session.adminId,
      session.adminEmail,
      session.adminRole,
      'VERIFY_BANK_ACCOUNT',
      'banking',
      account.id,
      auditLog,
      session.sessionId
    );

    console.log('Bank Account Verification Audit Log:', auditLog);
    alert(`Account ${account.id} verified successfully!\n\nVerified by: ${session.fullName}\nTimestamp: ${new Date().toLocaleString()}\n\nThis action has been logged.`);
  };

  const resetForm = () => {
    setAccountType('Operating');
    setBankName('');
    setAccountNumber('');
    setRoutingNumber('');
    setAccountHolderName('');
    setCurrency('USD');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Connected':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
      case 'Disconnected':
        return 'bg-slate-100 text-slate-800';
      case 'Pending Verification':
        return 'bg-amber-100 text-amber-800';
      case 'Error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Operating':
        return 'bg-blue-100 text-blue-800';
      case 'Fee Collection':
        return 'bg-teal-100 text-teal-800';
      case 'Escrow Reserve':
        return 'bg-purple-100 text-purple-800';
      case 'Payout':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const totalBalance = bankAccounts
    .filter(acc => acc.status === 'Active' && acc.balance)
    .reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Platform Banking Information</h2>
          <p className="text-slate-400">Manage bank accounts and payment provider integrations</p>
        </div>
        <button
          onClick={() => setShowAddAccountModal(true)}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
        >
          <i className="ri-add-line"></i>
          Add Bank Account
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Total Balance</span>
            <i className="ri-money-dollar-circle-line text-green-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalBalance)}</p>
          <p className="text-xs text-slate-500 mt-1">Across all accounts</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Active Accounts</span>
            <i className="ri-bank-line text-blue-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">
            {bankAccounts.filter(acc => acc.status === 'Active').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Of {bankAccounts.length} total</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Payment Providers</span>
            <i className="ri-links-line text-purple-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">
            {paymentProviders.filter(p => p.status === 'Connected').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">All connected</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Pending Verification</span>
            <i className="ri-time-line text-amber-400"></i>
          </div>
          <p className="text-2xl font-bold text-white">
            {bankAccounts.filter(acc => acc.status === 'Pending Verification').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Requires action</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'accounts'
                ? 'bg-red-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <i className="ri-bank-line mr-2"></i>
            Bank Accounts
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'providers'
                ? 'bg-red-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <i className="ri-links-line mr-2"></i>
            Payment Providers
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'transactions'
                ? 'bg-red-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <i className="ri-exchange-line mr-2"></i>
            Recent Transactions
          </button>
        </div>
      </div>

      {/* Bank Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Account Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Bank Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Account Details</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {bankAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(account.accountType)}`}>
                          {account.accountType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{account.bankName}</div>
                        <div className="text-sm text-slate-400">{account.accountHolderName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">Account: {account.accountNumber}</div>
                        <div className="text-sm text-slate-400">Routing: {account.routingNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        {account.balance !== undefined ? (
                          <div className="font-medium text-white">{formatCurrency(account.balance)}</div>
                        ) : (
                          <div className="text-sm text-slate-500">N/A</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                          {account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-300">{formatDate(account.lastUpdated)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedAccount(account);
                              setShowEditAccountModal(true);
                            }}
                            className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <i className="ri-eye-line"></i>
                          </button>
                          {account.status === 'Pending Verification' && (
                            <button
                              onClick={() => handleVerifyAccount(account)}
                              className="w-8 h-8 flex items-center justify-center bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                              title="Verify Account"
                            >
                              <i className="ri-checkbox-circle-line"></i>
                            </button>
                          )}
                          {account.status === 'Active' && (
                            <button
                              onClick={() => handleUpdateAccount(account, 'Inactive')}
                              className="w-8 h-8 flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                              title="Deactivate"
                            >
                              <i className="ri-close-circle-line"></i>
                            </button>
                          )}
                          {account.status === 'Inactive' && (
                            <button
                              onClick={() => handleUpdateAccount(account, 'Active')}
                              className="w-8 h-8 flex items-center justify-center bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                              title="Activate"
                            >
                              <i className="ri-check-line"></i>
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

          {/* Account Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-blue-400 text-xl mt-0.5"></i>
              <div>
                <h4 className="font-semibold text-blue-300 mb-2">Bank Account Security</h4>
                <ul className="text-sm text-blue-400/80 space-y-1 list-disc list-inside">
                  <li>All bank account additions and modifications are logged with admin identity</li>
                  <li>Account numbers are masked in the interface for security</li>
                  <li>Only Super Admin and Finance Manager roles can add or modify accounts</li>
                  <li>All accounts require verification before becoming active</li>
                  <li>Audit logs are immutable and searchable</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Providers Tab */}
      {activeTab === 'providers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentProviders.map((provider) => (
              <div key={provider.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      provider.providerName === 'PayPal' ? 'bg-blue-600' :
                      provider.providerName === 'Stripe' ? 'bg-purple-600' :
                      'bg-slate-600'
                    }`}>
                      <i className={`text-white text-2xl ${
                        provider.providerName === 'PayPal' ? 'ri-paypal-line' :
                        provider.providerName === 'Stripe' ? 'ri-bank-card-line' :
                        'ri-shield-check-line'
                      }`}></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{provider.providerName}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(provider.status)}`}>
                        {provider.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Account Email</div>
                    <div className="text-sm text-slate-300">{provider.accountEmail}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">API Key</div>
                    <div className="text-sm text-slate-300 font-mono">{provider.apiKeyLast4}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Last Sync</div>
                    <div className="text-sm text-slate-300">{formatDate(provider.lastSync)}</div>
                  </div>
                  <div className="pt-3 border-t border-slate-700">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Total Transactions</span>
                      <span className="text-white font-medium">{provider.totalTransactions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Total Volume</span>
                      <span className="text-white font-medium">{formatCurrency(provider.totalVolume)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm whitespace-nowrap">
                    <i className="ri-refresh-line mr-1"></i>
                    Sync Now
                  </button>
                  <button className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm whitespace-nowrap">
                    <i className="ri-settings-3-line mr-1"></i>
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Provider Info */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-purple-400 text-xl mt-0.5"></i>
              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Payment Provider Integration</h4>
                <ul className="text-sm text-purple-400/80 space-y-1 list-disc list-inside">
                  <li>All payment providers are monitored in real-time</li>
                  <li>API connections are automatically tested every 5 minutes</li>
                  <li>Failed connections trigger immediate alerts to Finance Manager</li>
                  <li>All provider configuration changes are logged with admin identity</li>
                  <li>Transaction data is synced automatically every 15 minutes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Banking Transactions</h3>
            <div className="space-y-3">
              {[
                { type: 'Deposit', amount: 15000, account: 'Fee Collection', date: '2024-03-21T10:30:00Z', status: 'Completed' },
                { type: 'Transfer', amount: 12750, account: 'Payout', date: '2024-03-21T09:15:00Z', status: 'Completed' },
                { type: 'Deposit', amount: 18000, account: 'Escrow Reserve', date: '2024-03-20T16:45:00Z', status: 'Completed' },
                { type: 'Transfer', amount: 15300, account: 'Payout', date: '2024-03-20T14:20:00Z', status: 'Completed' },
                { type: 'Deposit', amount: 22000, account: 'Fee Collection', date: '2024-03-20T11:00:00Z', status: 'Completed' }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'Deposit' ? 'bg-green-500/20' : 'bg-blue-500/20'
                    }`}>
                      <i className={`${
                        transaction.type === 'Deposit' ? 'ri-arrow-down-line text-green-400' : 'ri-arrow-right-line text-blue-400'
                      }`}></i>
                    </div>
                    <div>
                      <div className="font-medium text-white">{transaction.type}</div>
                      <div className="text-sm text-slate-400">{transaction.account}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">{formatCurrency(transaction.amount)}</div>
                    <div className="text-sm text-slate-400">{formatDate(transaction.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Add Bank Account</h3>
              <button
                onClick={() => {
                  setShowAddAccountModal(false);
                  resetForm();
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Warning */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                <i className="ri-alert-line text-amber-400 text-xl mt-0.5"></i>
                <div>
                  <p className="text-amber-300 font-medium mb-1">Important</p>
                  <p className="text-sm text-amber-400/80">
                    Adding a bank account will be logged with your admin identity and timestamp. Ensure all information is accurate.
                  </p>
                </div>
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Account Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Operating">Operating</option>
                  <option value="Fee Collection">Fee Collection</option>
                  <option value="Escrow Reserve">Escrow Reserve</option>
                  <option value="Payout">Payout</option>
                </select>
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Bank Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Chase Bank"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Account Holder Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Account Holder Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="LOCUM BNB LLC"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Account Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="1234567890"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Will be masked after saving</p>
              </div>

              {/* Routing Number */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Routing Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  placeholder="021000021"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Currency <span className="text-red-400">*</span>
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>

              {/* Admin Info */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="text-sm text-blue-300">
                  <div className="font-semibold mb-1">This action will be logged as:</div>
                  <div>Admin: {session.fullName}</div>
                  <div>Role: {session.adminRole}</div>
                  <div>Timestamp: {new Date().toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddAccountModal(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccount}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors whitespace-nowrap"
              >
                Add Bank Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Account Details Modal */}
      {showEditAccountModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Account Details</h3>
              <button
                onClick={() => {
                  setShowEditAccountModal(false);
                  setSelectedAccount(null);
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Account Info */}
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Account Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Account ID</p>
                    <p className="text-white font-mono text-sm">{selectedAccount.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Account Type</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(selectedAccount.accountType)}`}>
                      {selectedAccount.accountType}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Bank Name</p>
                    <p className="text-white">{selectedAccount.bankName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Account Holder</p>
                    <p className="text-white">{selectedAccount.accountHolderName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Account Number</p>
                    <p className="text-white font-mono">{selectedAccount.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Routing Number</p>
                    <p className="text-white font-mono">{selectedAccount.routingNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Currency</p>
                    <p className="text-white">{selectedAccount.currency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAccount.status)}`}>
                      {selectedAccount.status}
                    </span>
                  </div>
                  {selectedAccount.balance !== undefined && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Current Balance</p>
                      <p className="text-white font-semibold">{formatCurrency(selectedAccount.balance)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Trail */}
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Audit Trail</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="ri-add-circle-line text-green-400"></i>
                      <span className="text-sm font-medium text-white">Account Added</span>
                    </div>
                    <div className="text-sm text-slate-400">
                      By: {selectedAccount.addedBy}
                    </div>
                    <div className="text-sm text-slate-500">
                      {formatDate(selectedAccount.addedAt)}
                    </div>
                  </div>
                  {selectedAccount.verifiedBy && (
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="ri-checkbox-circle-line text-blue-400"></i>
                        <span className="text-sm font-medium text-white">Account Verified</span>
                      </div>
                      <div className="text-sm text-slate-400">
                        By: {selectedAccount.verifiedBy}
                      </div>
                      <div className="text-sm text-slate-500">
                        {formatDate(selectedAccount.verifiedAt!)}
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="ri-refresh-line text-purple-400"></i>
                      <span className="text-sm font-medium text-white">Last Updated</span>
                    </div>
                    <div className="text-sm text-slate-500">
                      {formatDate(selectedAccount.lastUpdated)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditAccountModal(false);
                  setSelectedAccount(null);
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors whitespace-nowrap"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankingInformation;
