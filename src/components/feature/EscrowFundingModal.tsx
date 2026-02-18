import React, { useState } from 'react';
import { EscrowPayment } from '../../../types/payment';
import {
  calculatePlatformFee,
  calculatePaymentSchedule,
  formatPaymentTimeline
} from '../../../utils/paymentManager';

interface EscrowFundingModalProps {
  payment: EscrowPayment;
  onClose: () => void;
  onConfirm: (paymentId: string, provider: 'stripe' | 'paypal') => void;
}

const EscrowFundingModal: React.FC<EscrowFundingModalProps> = ({
  payment,
  onClose,
  onConfirm
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'stripe' | 'paypal'>('stripe');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const schedule = calculatePaymentSchedule(
    payment.metadata.assignmentStartDate,
    payment.metadata.assignmentEndDate
  );

  const handleConfirm = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the escrow terms');
      return;
    }

    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onConfirm(payment.id, selectedProvider);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Fund Escrow Payment</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Assignment Details */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Assignment Details</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Facility:</span>
                <span className="font-medium">{payment.metadata.facilityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Physician:</span>
                <span className="font-medium">{payment.metadata.physicianName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Specialty:</span>
                <span className="font-medium">{payment.metadata.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assignment Dates:</span>
                <span className="font-medium">
                  {new Date(payment.metadata.assignmentStartDate).toLocaleDateString()} - {new Date(payment.metadata.assignmentEndDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Payment Breakdown</h4>
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-gray-700">Assignment Value:</span>
                <span className="font-bold text-gray-900">${payment.assignmentValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-teal-200 pt-2">
                <span className="text-gray-600">Platform Fee ({payment.platformFee.percentage}%):</span>
                <span className="font-medium text-gray-700">-${payment.platformFee.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Physician Payout:</span>
                <span className="font-medium text-teal-700">${payment.physicianPayout.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t-2 border-teal-300 pt-3">
                <span className="text-gray-900">Total to Fund:</span>
                <span className="text-teal-600">${payment.assignmentValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Timeline */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Payment Timeline</h4>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Escrow Funded</div>
                    <div className="text-sm text-gray-600">Payment secured in third-party escrow (today)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Assignment Completion</div>
                    <div className="text-sm text-gray-600">
                      {new Date(payment.metadata.assignmentEndDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Dispute Window</div>
                    <div className="text-sm text-gray-600">
                      48-hour window to file disputes (ends {schedule.disputeWindowEnd && new Date(schedule.disputeWindowEnd).toLocaleDateString()})
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Automatic Release</div>
                    <div className="text-sm text-gray-600">
                      Payment released to physician 4 days after completion ({schedule.scheduledReleaseDate && new Date(schedule.scheduledReleaseDate).toLocaleDateString()})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Provider Selection */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Select Payment Provider</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedProvider('stripe')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedProvider === 'stripe'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <i className="ri-bank-card-line text-4xl text-blue-600"></i>
                </div>
                <div className="text-center font-medium">Stripe</div>
                <div className="text-xs text-gray-500 text-center mt-1">Credit/Debit Card</div>
              </button>

              <button
                onClick={() => setSelectedProvider('paypal')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedProvider === 'paypal'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <i className="ri-paypal-line text-4xl text-blue-500"></i>
                </div>
                <div className="text-center font-medium">PayPal</div>
                <div className="text-xs text-gray-500 text-center mt-1">PayPal Account</div>
              </button>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-amber-600 text-xl mt-0.5"></i>
              <div className="flex-1">
                <div className="font-semibold text-amber-900 mb-2">Important Information</div>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Funds are held by licensed third-party escrow provider ({selectedProvider === 'stripe' ? 'Stripe' : 'PayPal'})</li>
                  <li>• Platform never directly holds your funds</li>
                  <li>• Payment automatically releases 4 days after assignment completion</li>
                  <li>• You have 48 hours before release to file a dispute if needed</li>
                  <li>• Disputes pause automatic release until resolved</li>
                  <li>• All transactions are fully audited and traceable</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">
                I agree to fund ${payment.assignmentValue.toLocaleString()} into escrow for this assignment. I understand that:
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Funds will be held securely by {selectedProvider === 'stripe' ? 'Stripe' : 'PayPal'}</li>
                  <li>• Payment will automatically release to the physician 4 days after assignment completion</li>
                  <li>• I can dispute within 48 hours before scheduled release if issues arise</li>
                  <li>• Platform fee of ${payment.platformFee.amount.toLocaleString()} ({payment.platformFee.percentage}%) is included</li>
                </ul>
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleConfirm}
              disabled={!agreedToTerms || loading}
              className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="ri-safe-2-line mr-2"></i>
                  Fund ${payment.assignmentValue.toLocaleString()} via {selectedProvider === 'stripe' ? 'Stripe' : 'PayPal'}
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowFundingModal;
