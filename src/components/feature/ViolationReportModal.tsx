import { useState } from 'react';
import { CircumventionViolation, ViolationEvidence } from '../../types/contract';
import { reportViolation } from '../../utils/contractManager';

interface ViolationReportModalProps {
  reporterUserId: string;
  reporterUserType: 'physician' | 'facility' | 'admin';
  onClose: () => void;
  onSubmit: (violation: CircumventionViolation) => void;
}

const ViolationReportModal = ({ reporterUserId, reporterUserType, onClose, onSubmit }: ViolationReportModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [violatorId, setViolatorId] = useState('');
  const [violatorType, setViolatorType] = useState<'physician' | 'facility'>('physician');
  const [relatedPartyId, setRelatedPartyId] = useState('');
  const [relatedPartyType, setRelatedPartyType] = useState<'physician' | 'facility'>('facility');
  const [assignmentId, setAssignmentId] = useState('');
  const [violationType, setViolationType] = useState<'off_platform_contact' | 'direct_booking' | 'payment_bypass' | 'other'>('off_platform_contact');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<Omit<ViolationEvidence, 'id' | 'uploadedAt' | 'uploadedBy'>[]>([]);

  const addEvidence = () => {
    setEvidence([...evidence, {
      type: 'document',
      description: '',
      fileUrl: ''
    }]);
  };

  const updateEvidence = (index: number, field: string, value: string) => {
    const updated = [...evidence];
    updated[index] = { ...updated[index], [field]: value };
    setEvidence(updated);
  };

  const removeEvidence = (index: number) => {
    setEvidence(evidence.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!violatorId || !relatedPartyId || !description) return;

    setLoading(true);

    const violation = reportViolation(
      reporterUserId,
      reporterUserType,
      violatorId,
      violatorType,
      relatedPartyId,
      relatedPartyType,
      violationType,
      description,
      evidence.map(e => ({ ...e, uploadedBy: reporterUserId })),
      assignmentId || undefined,
      'captured-by-backend'
    );

    setTimeout(() => {
      setLoading(false);
      onSubmit(violation);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-alert-line text-2xl text-red-600"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Report Violation</h2>
              <p className="text-sm text-gray-600">Non-circumvention policy violation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="ri-close-line text-xl text-gray-600"></i>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= 1 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="text-sm font-medium text-gray-700">Details</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= 2 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="text-sm font-medium text-gray-700">Evidence</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= 3 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className="text-sm font-medium text-gray-700">Review</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Violation Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <i className="ri-information-line text-xl text-amber-600 flex-shrink-0"></i>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Important Notice</p>
                    <p className="text-sm text-amber-700 mt-1">
                      False reports may result in penalties. Please ensure all information is accurate and truthful.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Violator ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={violatorId}
                    onChange={(e) => setViolatorId(e.target.value)}
                    placeholder="e.g., physician-003"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Violator Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={violatorType}
                    onChange={(e) => setViolatorType(e.target.value as 'physician' | 'facility')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="physician">Physician</option>
                    <option value="facility">Facility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Party ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={relatedPartyId}
                    onChange={(e) => setRelatedPartyId(e.target.value)}
                    placeholder="e.g., facility-002"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Party Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={relatedPartyType}
                    onChange={(e) => setRelatedPartyType(e.target.value as 'physician' | 'facility')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="physician">Physician</option>
                    <option value="facility">Facility</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment ID (Optional)
                </label>
                <input
                  type="text"
                  value={assignmentId}
                  onChange={(e) => setAssignmentId(e.target.value)}
                  placeholder="e.g., assignment-045"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Violation Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={violationType}
                  onChange={(e) => setViolationType(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="off_platform_contact">Off-Platform Contact</option>
                  <option value="direct_booking">Direct Booking</option>
                  <option value="payment_bypass">Payment Bypass</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Provide detailed description of the violation, including dates, methods of contact, and any relevant context..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Be as specific as possible. Include dates, times, and methods of communication.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!violatorId || !relatedPartyId || !description}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Next: Add Evidence
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Evidence */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <i className="ri-information-line text-xl text-blue-600 flex-shrink-0"></i>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Evidence Strengthens Your Report</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Screenshots, emails, messages, or witness statements help verify the violation.
                    </p>
                  </div>
                </div>
              </div>

              {evidence.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <i className="ri-file-add-line text-4xl text-gray-400"></i>
                  <p className="text-gray-600 mt-3">No evidence added yet</p>
                  <p className="text-sm text-gray-500 mt-1">Click below to add supporting evidence</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {evidence.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Evidence #{index + 1}</span>
                        <button
                          onClick={() => removeEvidence(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                          <select
                            value={item.type}
                            onChange={(e) => updateEvidence(index, 'type', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          >
                            <option value="screenshot">Screenshot</option>
                            <option value="email">Email</option>
                            <option value="message">Message</option>
                            <option value="document">Document</option>
                            <option value="witness_statement">Witness Statement</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateEvidence(index, 'description', e.target.value)}
                            placeholder="Brief description of this evidence"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">File URL (Optional)</label>
                          <input
                            type="text"
                            value={item.fileUrl}
                            onChange={(e) => updateEvidence(index, 'fileUrl', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={addEvidence}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
              >
                <i className="ri-add-line mr-2"></i>
                Add Evidence
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium whitespace-nowrap"
                >
                  Next: Review
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <i className="ri-error-warning-line text-xl text-red-600 flex-shrink-0"></i>
                  <div>
                    <p className="text-sm font-semibold text-red-900">Review Before Submitting</p>
                    <p className="text-sm text-red-700 mt-1">
                      This report will be escalated to the compliance team for investigation. Ensure all information is accurate.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-gray-900">Violation Details</h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Violator:</span>
                    <p className="font-medium text-gray-900">{violatorId} ({violatorType})</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Related Party:</span>
                    <p className="font-medium text-gray-900">{relatedPartyId} ({relatedPartyType})</p>
                  </div>
                  {assignmentId && (
                    <div>
                      <span className="text-gray-600">Assignment:</span>
                      <p className="font-medium text-gray-900">{assignmentId}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Violation Type:</span>
                    <p className="font-medium text-gray-900 capitalize">{violationType.replace(/_/g, ' ')}</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Description:</span>
                  <p className="text-sm text-gray-900 mt-2 bg-gray-50 p-3 rounded-lg">{description}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Evidence Attached:</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">{evidence.length} item(s)</p>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-900">
                  <strong>What happens next:</strong>
                </p>
                <ul className="text-sm text-purple-800 mt-2 space-y-1 list-disc pl-5">
                  <li>Report is immediately escalated to compliance team</li>
                  <li>Investigation begins within 24 hours</li>
                  <li>You will be notified of investigation progress</li>
                  <li>If confirmed, violator faces $25,000 penalty</li>
                  <li>All actions are logged and auditable</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 whitespace-nowrap"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="ri-loader-4-line animate-spin"></i>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViolationReportModal;
