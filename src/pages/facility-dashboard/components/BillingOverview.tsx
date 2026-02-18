import React, { useState } from 'react';

interface Invoice {
  id: string;
  physicianName: string;
  assignmentTitle: string;
  assignmentDates: string;
  amount: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'disputed';
  invoiceNumber: string;
  notes?: string;
}

interface PaymentRecord {
  id: string;
  physicianName: string;
  assignmentTitle: string;
  amount: string;
  date: string;
  status: 'escrowed' | 'released' | 'held';
  escrowProvider: string;
  transactionId: string;
}

export default function BillingOverview() {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payments'>('overview');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDetails, setDisputeDetails] = useState('');

  const invoices: Invoice[] = [
    {
      id: 'inv-001',
      physicianName: 'Dr. Sarah Mitchell',
      assignmentTitle: 'Emergency Medicine - 7 Day Block',
      assignmentDates: 'Feb 1-7, 2025',
      amount: '$12,000',
      submittedDate: '2025-02-08',
      status: 'pending',
      invoiceNumber: 'INV-2025-001',
      notes: 'Standard assignment completion invoice'
    },
    {
      id: 'inv-002',
      physicianName: 'Dr. James Chen',
      assignmentTitle: 'Cardiology - 5 Day Block',
      assignmentDates: 'Feb 15-19, 2025',
      amount: '$8,500',
      submittedDate: '2025-02-20',
      status: 'pending',
      invoiceNumber: 'INV-2025-002'
    },
    {
      id: 'inv-003',
      physicianName: 'Dr. Emily Rodriguez',
      assignmentTitle: 'Internal Medicine - 5 Day Block',
      assignmentDates: 'Jan 5-9, 2025',
      amount: '$7,200',
      submittedDate: '2025-01-10',
      status: 'approved',
      invoiceNumber: 'INV-2025-003'
    }
  ];

  const payments: PaymentRecord[] = [
    {
      id: 'pay-001',
      physicianName: 'Dr. Sarah Mitchell',
      assignmentTitle: 'Emergency Medicine - 7 Day Block',
      amount: '$12,000',
      date: '2025-01-12',
      status: 'escrowed',
      escrowProvider: 'PayPal',
      transactionId: 'TXN-2025-001'
    },
    {
      id: 'pay-002',
      physicianName: 'Dr. James Chen',
      assignmentTitle: 'Cardiology - 5 Day Block',
      amount: '$8,500',
      date: '2025-01-13',
      status: 'escrowed',
      escrowProvider: 'PayPal',
      transactionId: 'TXN-2025-002'
    },
    {
      id: 'pay-003',
      physicianName: 'Dr. Emily Rodriguez',
      assignmentTitle: 'Internal Medicine - 5 Day Block',
      amount: '$7,200',
      date: '2025-01-05',
      status: 'released',
      escrowProvider: 'PayPal',
      transactionId: 'TXN-2025-003'
    },
    {
      id: 'pay-004',
      physicianName: 'Dr. Robert Kim',
      assignmentTitle: 'Radiology - 5 Day Block',
      amount: '$10,500',
      date: '2025-01-10',
      status: 'held',
      escrowProvider: 'PayPal',
      transactionId: 'TXN-2025-004'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'disputed': return 'bg-red-100 text-red-700';
      case 'escrowed': return 'bg-purple-100 text-purple-700';
      case 'released': return 'bg-green-100 text-green-700';
      case 'held': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleApproveInvoice = (invoice: Invoice) => {
    console.log('Invoice approved:', invoice);
    setShowInvoiceModal(false);
    setSelectedInvoice(null);
  };

  const handleDisputeInvoice = () => {
    if (!selectedInvoice || !disputeReason.trim() || !disputeDetails.trim()) return;

    const disputeData = {
      invoiceId: selectedInvoice.id,
      reason: disputeReason,
      details: disputeDetails,
      timestamp: new Date().toISOString(),
      submittedBy: 'Facility Administrator'
    };

    console.log('Invoice disputed:', disputeData);
    setShowDisputeModal(false);
    setShowInvoiceModal(false);
    setSelectedInvoice(null);
    setDisputeReason('');
    setDisputeDetails('');
  };

  const totalPaid = payments.reduce((sum, p) => {
    const amount = parseFloat(p.amount.replace(/[$,]/g, ''));
    return sum + amount;
  }, 0);

  const totalEscrowed = payments
    .filter(p => p.status === 'escrowed')
    .reduce((sum, p) => {
      const amount = parseFloat(p.amount.replace(/[$,]/g, ''));
      return sum + amount;
    }, 0);

  const totalReleased = payments
    .filter(p => p.status === 'released')
    .reduce((sum, p) => {
      const amount = parseFloat(p.amount.replace(/[$,]/g, ''));
      return sum + amount;
    }, 0);

  const pendingInvoices = invoices.filter(i => i.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Billing &amp; Financials</h2>
        <p className="text-sm text-gray-600 mt-1">Manage payments, invoices, and financial records</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Invoices
            {pendingInvoices > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-200 text-amber-700 text-xs rounded-full">
                {pendingInvoices}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'payments'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Payment History
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">${totalPaid.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-money-dollar-circle-line text-purple-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Escrow</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">${totalEscrowed.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <i className="ri-shield-check-line text-amber-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Released</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">${totalReleased.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-check-double-line text-green-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Invoices</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{pendingInvoices}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-file-list-line text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Financial Activity</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                { icon: 'ri-file-list-line', color: 'text-amber-600', bg: 'bg-amber-100', text: 'New invoice received from Dr. Sarah Mitchell - $12,000', time: '2 hours ago' },
                { icon: 'ri-check-double-line', color: 'text-green-600', bg: 'bg-green-100', text: 'Payment released to Dr. Emily Rodriguez - $7,200', time: '1 day ago' },
                { icon: 'ri-shield-check-line', color: 'text-purple-600', bg: 'bg-purple-100', text: 'Payment escrowed for Dr. James Chen - $8,500', time: '3 days ago' },
                { icon: 'ri-alert-line', color: 'text-red-600', bg: 'bg-red-100', text: 'Payment hold initiated for disputed assignment', time: '5 days ago' }
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

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <i className="ri-information-line text-blue-600 text-lg mt-0.5"></i>
              <div>
                <p className="text-sm text-blue-900 font-medium">Invoice Review Process</p>
                <p className="text-sm text-blue-800 mt-1">
                  Review submitted invoices carefully. Approve to release escrowed payment, or dispute if there are discrepancies. All actions are logged and timestamped.
                </p>
              </div>
            </div>
          </div>

          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{invoice.physicianName}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{invoice.assignmentTitle}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Invoice Number</p>
                      <p className="text-gray-900 font-medium mt-1">{invoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Assignment Dates</p>
                      <p className="text-gray-900 font-medium mt-1">{invoice.assignmentDates}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-gray-900 font-medium mt-1">{invoice.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Submitted</p>
                      <p className="text-gray-900 font-medium mt-1">{new Date(invoice.submittedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {invoice.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">{invoice.notes}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 ml-6">
                  <button
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setShowInvoiceModal(true);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center gap-2"
                  >
                    <i className="ri-eye-line"></i>
                    View Details
                  </button>
                  {invoice.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveInvoice(invoice)}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap flex items-center gap-2"
                      >
                        <i className="ri-check-line"></i>
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowDisputeModal(true);
                        }}
                        className="px-4 py-2 bg-white border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap flex items-center gap-2"
                      >
                        <i className="ri-alert-line"></i>
                        Dispute
                      </button>
                    </>
                  )}
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2">
                    <i className="ri-message-3-line"></i>
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Physician
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Transaction ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {payment.physicianName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payment.assignmentTitle}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {payment.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                        {payment.transactionId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Invoice Details</h3>
                <button
                  onClick={() => {
                    setShowInvoiceModal(false);
                    setSelectedInvoice(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(selectedInvoice.status)}`}>
                    {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Physician</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedInvoice.physicianName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedInvoice.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Assignment</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedInvoice.assignmentTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Assignment Dates</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedInvoice.assignmentDates}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted Date</p>
                  <p className="text-sm text-gray-900 mt-1">{new Date(selectedInvoice.submittedDate).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Notes</p>
                  <p className="text-sm text-gray-700">{selectedInvoice.notes}</p>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-600">
                  <i className="ri-information-line mr-1"></i>
                  All invoice approvals and disputes are logged with timestamp and user identity for audit purposes.
                </p>
              </div>
            </div>

            {selectedInvoice.status === 'pending' && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowInvoiceModal(false);
                      setShowDisputeModal(true);
                    }}
                    className="px-6 py-2 bg-white border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-alert-line mr-2"></i>
                    Dispute Invoice
                  </button>
                  <button
                    onClick={() => handleApproveInvoice(selectedInvoice)}
                    className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-check-line mr-2"></i>
                    Approve &amp; Release Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Dispute Invoice</h3>
                <button
                  onClick={() => {
                    setShowDisputeModal(false);
                    setDisputeReason('');
                    setDisputeDetails('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <i className="ri-alert-line text-amber-600 text-lg mt-0.5"></i>
                  <div>
                    <p className="text-sm text-amber-900 font-medium">Important Notice</p>
                    <p className="text-sm text-amber-800 mt-1">
                      Disputing an invoice will hold the escrowed payment and initiate a formal dispute process. All communications will be logged and timestamped.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Invoice: {selectedInvoice.invoiceNumber}</p>
                <p className="text-sm text-gray-600">Physician: {selectedInvoice.physicianName}</p>
                <p className="text-sm text-gray-600">Amount: {selectedInvoice.amount}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dispute Reason <span className="text-red-500">*</span>
                </label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a reason</option>
                  <option value="billing_discrepancy">Billing Discrepancy</option>
                  <option value="incorrect_amount">Incorrect Amount</option>
                  <option value="services_not_rendered">Services Not Rendered</option>
                  <option value="quality_concerns">Quality Concerns</option>
                  <option value="contract_violation">Contract Violation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={disputeDetails}
                  onChange={(e) => setDisputeDetails(e.target.value)}
                  rows={6}
                  placeholder="Provide a detailed explanation of the dispute. Include specific dates, amounts, or incidents."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This information will be shared with the physician and logged for audit purposes.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600 space-y-1">
                <p><strong>Dispute Process:</strong></p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Payment will be held in escrow pending resolution</li>
                  <li>Physician will be notified and given opportunity to respond</li>
                  <li>All communications are logged with timestamp and user identity</li>
                  <li>Formal dispute resolution process will be initiated</li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDisputeModal(false);
                    setDisputeReason('');
                    setDisputeDetails('');
                  }}
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisputeInvoice}
                  disabled={!disputeReason || !disputeDetails.trim()}
                  className="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <i className="ri-alert-line mr-2"></i>
                  Submit Dispute
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
