import { useState } from 'react';
import type { CancellationPolicy } from '../../types/cancellation';
import { formatCancellationPolicy } from '../../utils/cancellationManager';

interface CancellationPolicyAgreementProps {
  policy: CancellationPolicy;
  assignmentValue: number;
  assignmentDates: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function CancellationPolicyAgreement({
  policy,
  assignmentValue,
  assignmentDates,
  onAccept,
  onDecline
}: CancellationPolicyAgreementProps) {
  const [accepted, setAccepted] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const calculateExamplePenalty = (daysBeforeStart: number): { percentage: number; amount: number } => {
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
    
    return {
      percentage,
      amount: Math.round((assignmentValue * percentage) / 100)
    };
  };

  const exampleScenarios = [
    { days: 35, label: '35 days before' },
    { days: 20, label: '20 days before' },
    { days: 10, label: '10 days before' },
    { days: 5, label: '5 days before' },
    { days: 1, label: '1 day before' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-t-lg">
        <div className="flex items-center">
          <i className="ri-alert-line text-3xl mr-3"></i>
          <div>
            <h3 className="text-xl font-bold">Cancellation Policy Agreement</h3>
            <p className="text-sm text-amber-50 mt-1">Please review and accept before applying</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Assignment Details */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Assignment Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Assignment Dates:</span>
              <p className="font-semibold text-slate-900 mt-1">{assignmentDates}</p>
            </div>
            <div>
              <span className="text-slate-600">Assignment Value:</span>
              <p className="font-semibold text-slate-900 mt-1">${assignmentValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Policy Details */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Cancellation Windows & Penalties</h4>
          <div className="space-y-2">
            {policy.windows
              .sort((a, b) => b.daysBeforeStart - a.daysBeforeStart)
              .map((window, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3"
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      window.penaltyPercentage === 0 ? 'bg-green-500' :
                      window.penaltyPercentage <= 25 ? 'bg-yellow-500' :
                      window.penaltyPercentage <= 50 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-slate-700">{window.description}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-bold ${
                      window.penaltyPercentage === 0 ? 'text-green-600' :
                      window.penaltyPercentage <= 25 ? 'text-yellow-600' :
                      window.penaltyPercentage <= 50 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {window.penaltyPercentage}% penalty
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      (${Math.round((assignmentValue * window.penaltyPercentage) / 100).toLocaleString()})
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Grace Period */}
        {policy.gracePeriodHours > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <i className="ri-time-line text-blue-600 text-xl mr-3 mt-0.5"></i>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Grace Period</h4>
                <p className="text-sm text-blue-700">
                  You have <strong>{policy.gracePeriodHours} hours</strong> after submitting a cancellation request to withdraw it without penalty.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Symmetry Rule */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex items-start">
            <i className="ri-scales-line text-teal-600 text-xl mr-3 mt-0.5"></i>
            <div>
              <h4 className="text-sm font-semibold text-teal-900 mb-1">Symmetry Rule</h4>
              <p className="text-sm text-teal-700">
                This cancellation policy applies equally to both you and the facility. If the facility cancels, they will be subject to the same penalty structure.
              </p>
            </div>
          </div>
        </div>

        {/* Example Scenarios */}
        <div>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center text-sm font-semibold text-slate-900 hover:text-teal-600 transition-colors"
          >
            <i className={`ri-${showExamples ? 'arrow-down' : 'arrow-right'}-s-line mr-1`}></i>
            View Example Scenarios
          </button>
          
          {showExamples && (
            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h5 className="text-sm font-semibold text-slate-900 mb-3">
                If you cancel this ${assignmentValue.toLocaleString()} assignment:
              </h5>
              <div className="space-y-2">
                {exampleScenarios.map((scenario, index) => {
                  const penalty = calculateExamplePenalty(scenario.days);
                  return (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">{scenario.label}:</span>
                      <span className={`font-semibold ${
                        penalty.percentage === 0 ? 'text-green-600' :
                        penalty.percentage <= 25 ? 'text-yellow-600' :
                        penalty.percentage <= 50 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {penalty.percentage}% penalty = ${penalty.amount.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Agreement Checkbox */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 text-teal-600 border-amber-400 rounded focus:ring-2 focus:ring-teal-500 cursor-pointer"
            />
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-slate-900 mb-2">
                I understand and accept the cancellation policy
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                I acknowledge that if I cancel this assignment, I will be subject to the penalties outlined above based on the timing of my cancellation. I understand that the facility is also bound by this same policy. I agree to provide legitimate reasons for any cancellation request and understand that penalties may be waived only in exceptional circumstances with proper documentation.
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
          <button
            onClick={onDecline}
            className="px-6 py-2.5 text-slate-700 bg-slate-100 font-medium rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
          >
            Decline & Go Back
          </button>
          <button
            onClick={onAccept}
            disabled={!accepted}
            className={`px-6 py-2.5 font-medium rounded-lg transition-colors whitespace-nowrap ${
              accepted
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <i className="ri-checkbox-circle-line mr-2"></i>
            Accept & Continue Application
          </button>
        </div>
      </div>
    </div>
  );
}
