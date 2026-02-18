import { useState } from 'react';
import type { CancellationRequest, CancellationPolicy } from '../../types/cancellation';
import {
  createCancellationRequest,
  processCancellationRequest,
  chargeCancellationPenalty
} from '../../utils/cancellationManager';

interface CancellationRequestModalProps {
  assignmentId: string;
  contractId: string;
  assignmentStartDate: string;
  assignmentValue: number;
  policy: CancellationPolicy;
  userType: 'physician' | 'facility';
  userId: string;
  onClose: () => void;
  onSubmit: (request: CancellationRequest) => void;
}

export default function CancellationRequestModal({
  assignmentId,
  contractId,
  assignmentStartDate,
  assignmentValue,
  policy,
  userType,
  userId,
  onClose,
  onSubmit
}: CancellationRequestModalProps) {
  const [reason, setReason] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [calculatedPenalty, setCalculatedPenalty] = useState<{
    percentage: number;
    amount: number;
    daysBeforeStart: number;
  } | null>(null);

  const reasonCategories = [
    { value: 'medical_emergency', label: 'Medical Emergency', icon: 'ri-hospital-line' },
    { value: 'family_emergency', label: 'Family Emergency', icon: 'ri-heart-pulse-line' },
    { value: 'scheduling_conflict', label: 'Scheduling Conflict', icon: 'ri-calendar-close-line' },
    { value: 'personal_reasons', label: 'Personal Reasons', icon: 'ri-user-line' },
    { value: 'business_reasons', label: 'Business Reasons', icon: 'ri-briefcase-line' },
    { value: 'other', label: 'Other', icon: 'ri-more-line' }
  ];

  const calculatePenalty = () => {
    const startDate = new Date(assignmentStartDate);
    const now = new Date();
    const daysBeforeStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let percentage = 0;
    for (const window of policy.windows) {
      if (daysBeforeStart >= window.daysBeforeStart) {
        percentage = window.penaltyPercentage;
        break;
      }
    }

    if (percentage === 0 && policy.windows.length > 0) {
      percentage = policy.windows[policy.windows.length - 1].penaltyPercentage;
    }

    const amount = Math.round((assignmentValue * percentage) / 100);

    setCalculatedPenalty({ percentage, amount, daysBeforeStart });
  };

  const handleSubmit = () => {
    if (!selectedCategory || !reason.trim()) {
      return;
    }

    calculatePenalty();
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setLoading(true);

    const request = createCancellationRequest(
      assignmentId,
      contractId,
      userType,
      userId,
      `[${selectedCategory}] ${reason}`,
      assignmentStartDate,
      assignmentValue,
      policy
    );

    // Simulate API call
    setTimeout(() => {
      onSubmit(request);
      setLoading(false);
    }, 1000);
  };

  if (showConfirmation && calculatedPenalty) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-t-lg">
            <div className="flex items-center">
              <i className="ri-error-warning-line text-3xl mr-3"></i>
              <div>
                <h3 className="text-xl font-bold">Confirm Cancellation</h3>
                <p className="text-sm text-red-50 mt-1">Review penalty before submitting</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Penalty Summary */}
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-red-900 mb-3">Cancellation Penalty</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">Days before assignment:</span>
                  <span className="font-semibold text-slate-900">{calculatedPenalty.daysBeforeStart} days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">Assignment value:</span>
                  <span className="font-semibold text-slate-900">${assignmentValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">Penalty percentage:</span>
                  <span className="font-bold text-red-600">{calculatedPenalty.percentage}%</span>
                </div>
                <div className="pt-2 border-t border-red-200 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Total penalty:</span>
                  <span className="text-2xl font-bold text-red-600">${calculatedPenalty.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Grace Period Notice */}
            {policy.gracePeriodHours > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <i className="ri-time-line text-blue-600 text-xl mr-3 mt-0.5"></i>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Grace Period Available</h4>
                    <p className="text-sm text-blue-700">
                      You have <strong>{policy.gracePeriodHours} hours</strong> to withdraw this cancellation request without penalty.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reason Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Cancellation Reason</h4>
              <p className="text-sm text-slate-700 italic">&quot;{reason}&quot;</p>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <i className="ri-alert-line text-amber-600 text-xl mr-3 mt-0.5"></i>
                <p className="text-sm text-amber-800">
                  This action cannot be undone after the grace period expires. The penalty will be automatically charged to your account.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
                className="px-6 py-2.5 text-slate-700 bg-slate-100 font-medium rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="ri-close-circle-line mr-2"></i>
                    Confirm Cancellation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-4 rounded-t-lg sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="ri-close-circle-line text-3xl mr-3"></i>
              <div>
                <h3 className="text-xl font-bold">Request Cancellation</h3>
                <p className="text-sm text-slate-300 mt-1">Assignment #{assignmentId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-slate-300 transition-colors"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Assignment Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Assignment Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Start Date:</span>
                <p className="font-semibold text-slate-900 mt-1">
                  {new Date(assignmentStartDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <span className="text-slate-600">Assignment Value:</span>
                <p className="font-semibold text-slate-900 mt-1">${assignmentValue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Reason Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Cancellation Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {reasonCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    selectedCategory === category.value
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <i className={`${category.icon} text-2xl ${
                    selectedCategory === category.value ? 'text-teal-600' : 'text-slate-400'
                  }`}></i>
                  <p className={`text-xs font-medium mt-2 ${
                    selectedCategory === category.value ? 'text-teal-900' : 'text-slate-700'
                  }`}>
                    {category.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Reason */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Detailed Explanation <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-600 mb-3">
              Please provide a detailed explanation for your cancellation request. This will be reviewed by the platform administrators.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              maxLength={500}
              placeholder="Explain the circumstances requiring cancellation..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-500">
                {reason.length}/500 characters
              </p>
              {reason.length < 50 && reason.length > 0 && (
                <p className="text-xs text-amber-600">
                  <i className="ri-alert-line mr-1"></i>
                  Please provide more detail (minimum 50 characters)
                </p>
              )}
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <i className="ri-information-line text-amber-600 text-xl mr-3 mt-0.5"></i>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-amber-900 mb-2">Important Information</h4>
                <ul className="space-y-1 text-sm text-amber-800">
                  <li>• Cancellation penalties are calculated based on the timing of your request</li>
                  <li>• You will see the exact penalty amount before final confirmation</li>
                  <li>• Grace period of {policy.gracePeriodHours} hours allows withdrawal without penalty</li>
                  <li>• All cancellation requests are logged and reviewed</li>
                  <li>• Frequent cancellations may affect your account standing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-slate-700 bg-slate-100 font-medium rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedCategory || reason.trim().length < 50}
              className={`px-6 py-2.5 font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory && reason.trim().length >= 50
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <i className="ri-arrow-right-line mr-2"></i>
              Continue to Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
