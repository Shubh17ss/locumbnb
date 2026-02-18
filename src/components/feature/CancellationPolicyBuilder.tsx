import { useState } from 'react';
import type { CancellationWindow } from '../../types/cancellation';
import {
  getDefaultCancellationPolicy,
  validateCancellationWindows
} from '../../utils/cancellationManager';

interface CancellationPolicyBuilderProps {
  onSave: (windows: CancellationWindow[], gracePeriodHours: number) => void;
  initialWindows?: CancellationWindow[];
  initialGracePeriod?: number;
}

export default function CancellationPolicyBuilder({
  onSave,
  initialWindows,
  initialGracePeriod = 24
}: CancellationPolicyBuilderProps) {
  const [windows, setWindows] = useState<CancellationWindow[]>(
    initialWindows || getDefaultCancellationPolicy()
  );
  const [gracePeriodHours, setGracePeriodHours] = useState(initialGracePeriod);
  const [errors, setErrors] = useState<string[]>([]);
  const [useTemplate, setUseTemplate] = useState(true);

  const handleWindowChange = (index: number, field: keyof CancellationWindow, value: string | number) => {
    const newWindows = [...windows];
    newWindows[index] = {
      ...newWindows[index],
      [field]: value
    };
    setWindows(newWindows);
    setErrors([]);
  };

  const addWindow = () => {
    const newWindow: CancellationWindow = {
      id: `window_${Date.now()}`,
      daysBeforeStart: 0,
      penaltyPercentage: 0,
      description: 'New cancellation window'
    };
    setWindows([...windows, newWindow]);
  };

  const removeWindow = (index: number) => {
    if (windows.length > 1) {
      setWindows(windows.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    const validation = validateCancellationWindows(windows);
    
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onSave(windows, gracePeriodHours);
  };

  const loadTemplate = () => {
    setWindows(getDefaultCancellationPolicy());
    setGracePeriodHours(24);
    setUseTemplate(true);
    setErrors([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Cancellation Policy</h3>
          <p className="text-sm text-slate-600 mt-1">
            Define cancellation windows and penalties. This policy applies equally to both physicians and facilities.
          </p>
        </div>
        <button
          onClick={loadTemplate}
          className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors whitespace-nowrap"
        >
          <i className="ri-refresh-line mr-2"></i>
          Load Default Template
        </button>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <i className="ri-error-warning-line text-red-500 text-xl mr-3 mt-0.5"></i>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-2">Validation Errors</h4>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Grace Period */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <i className="ri-time-line text-blue-600 text-xl mr-3 mt-0.5"></i>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              Grace Period (Hours)
            </label>
            <p className="text-sm text-blue-700 mb-3">
              Allow cancellation requests to be withdrawn within this timeframe without penalty.
            </p>
            <input
              type="number"
              min="0"
              max="72"
              value={gracePeriodHours}
              onChange={(e) => setGracePeriodHours(parseInt(e.target.value) || 0)}
              className="w-32 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="ml-2 text-sm text-blue-700">hours</span>
          </div>
        </div>
      </div>

      {/* Cancellation Windows */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">Cancellation Windows</h4>
          <button
            onClick={addWindow}
            className="px-3 py-1.5 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors whitespace-nowrap"
          >
            <i className="ri-add-line mr-1"></i>
            Add Window
          </button>
        </div>

        <div className="space-y-3">
          {windows.map((window, index) => (
            <div key={window.id} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700">Window {index + 1}</span>
                {windows.length > 1 && (
                  <button
                    onClick={() => removeWindow(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <i className="ri-delete-bin-line text-lg"></i>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Days Before Start
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={window.daysBeforeStart}
                    onChange={(e) => handleWindowChange(index, 'daysBeforeStart', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Penalty Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={window.penaltyPercentage}
                      onChange={(e) => handleWindowChange(index, 'penaltyPercentage', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-500">%</span>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={window.description}
                    onChange={(e) => handleWindowChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., 30+ days before: No penalty"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Symmetry Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <i className="ri-scales-line text-amber-600 text-xl mr-3 mt-0.5"></i>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-900 mb-1">Symmetry Rule</h4>
            <p className="text-sm text-amber-700">
              This cancellation policy applies equally to both physicians and facilities. If a facility cancels an assignment, they will be subject to the same penalty structure.
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Policy Preview</h4>
        <div className="space-y-2 text-sm text-slate-700">
          {windows
            .sort((a, b) => b.daysBeforeStart - a.daysBeforeStart)
            .map((window, index) => (
              <div key={index} className="flex items-center">
                <i className="ri-checkbox-circle-line text-teal-500 mr-2"></i>
                <span>{window.description}: <strong>{window.penaltyPercentage}%</strong> penalty</span>
              </div>
            ))}
          {gracePeriodHours > 0 && (
            <div className="flex items-center pt-2 border-t border-slate-300">
              <i className="ri-time-line text-blue-500 mr-2"></i>
              <span>Grace period: <strong>{gracePeriodHours} hours</strong> to withdraw cancellation</span>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
        >
          <i className="ri-save-line mr-2"></i>
          Save Cancellation Policy
        </button>
      </div>
    </div>
  );
}
