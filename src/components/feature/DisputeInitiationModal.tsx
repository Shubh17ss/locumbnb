import { useState } from 'react';
import type { DisputeType, DisputeParty } from '../../types/dispute';
import { createDispute, canFileDispute, processDisputeFee, createDisputeAuditLog } from '../../utils/disputeManager';

interface DisputeInitiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId: string;
  assignmentTitle: string;
  facility: { id: string; name: string };
  physician: { id: string; name: string; specialty: string };
  initiatedBy: DisputeParty;
  initiatorId: string;
  initiatorName: string;
  respondentId: string;
  respondentName: string;
  respondentRole: DisputeParty;
  escrowAmount?: number;
  onDisputeCreated?: (disputeId: string) => void;
}

const DISPUTE_TYPES: { value: DisputeType; label: string; description: string }[] = [
  {
    value: 'payment_dispute',
    label: 'Payment Dispute',
    description: 'Issues with payment amount, timing, or processing',
  },
  {
    value: 'contract_violation',
    label: 'Contract Violation',
    description: 'Breach of contract terms or conditions',
  },
  {
    value: 'quality_complaint',
    label: 'Quality Complaint',
    description: 'Concerns about service quality or performance',
  },
  {
    value: 'cancellation_dispute',
    label: 'Cancellation Dispute',
    description: 'Issues related to assignment cancellation',
  },
  {
    value: 'no_show',
    label: 'No-Show',
    description: 'Physician did not appear for scheduled assignment',
  },
  {
    value: 'credential_misrepresentation',
    label: 'Credential Misrepresentation',
    description: 'False or misleading credential information',
  },
  {
    value: 'facility_breach',
    label: 'Facility Breach',
    description: 'Facility failed to meet contractual obligations',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Other dispute not covered by above categories',
  },
];

export default function DisputeInitiationModal({
  isOpen,
  onClose,
  assignmentId,
  assignmentTitle,
  facility,
  physician,
  initiatedBy,
  initiatorId,
  initiatorName,
  respondentId,
  respondentName,
  respondentRole,
  escrowAmount,
  onDisputeCreated,
}: DisputeInitiationModalProps) {
  const [step, setStep] = useState<'eligibility' | 'details' | 'payment' | 'confirmation'>('eligibility');
  const [disputeType, setDisputeType] = useState<DisputeType>('payment_dispute');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [disputeFee, setDisputeFee] = useState(300);
  const [eligibilityCheck, setEligibilityCheck] = useState<{
    allowed: boolean;
    reason?: string;
    feeAmount?: number;
  } | null>(null);

  const handleEligibilityCheck = () => {
    const check = canFileDispute(initiatorId, initiatedBy);
    setEligibilityCheck(check);
    
    if (check.allowed && check.feeAmount) {
      setDisputeFee(check.feeAmount);
      setStep('details');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEvidenceFiles(Array.from(e.target.files));
    }
  };

  const handleSubmitDetails = () => {
    if (!subject.trim() || !description.trim()) {
      setError('Please provide both subject and description');
      return;
    }
    
    if (description.length < 50) {
      setError('Description must be at least 50 characters');
      return;
    }
    
    setError('');
    setStep('payment');
  };

  const handlePaymentSubmit = async () => {
    if (!paymentMethodId) {
      setError('Please provide payment method');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Process dispute fee payment
      const paymentResult = await processDisputeFee('temp-dispute-id', paymentMethodId);
      
      if (!paymentResult.success) {
        setError(paymentResult.error || 'Payment processing failed');
        setLoading(false);
        return;
      }
      
      // Create dispute
      const dispute = createDispute({
        assignmentId,
        assignmentTitle,
        facility,
        physician,
        initiatedBy,
        initiatorId,
        initiatorName,
        respondentId,
        respondentName,
        respondentRole,
        type: disputeType,
        subject,
        description,
        escrowAmount,
      });
      
      // Update fee with transaction ID
      dispute.fee.transactionId = paymentResult.transactionId;
      dispute.fee.paymentStatus = 'paid';
      dispute.fee.paidAt = new Date().toISOString();
      
      // Create audit log
      createDisputeAuditLog({
        disputeId: dispute.id,
        action: 'dispute_created',
        performedBy: initiatorId,
        performedByRole: initiatedBy,
        details: `Dispute created: ${subject}`,
        metadata: {
          disputeType,
          feeAmount: disputeFee,
          transactionId: paymentResult.transactionId,
        },
      });
      
      setLoading(false);
      setStep('confirmation');
      
      // Notify parent component
      if (onDisputeCreated) {
        onDisputeCreated(dispute.id);
      }
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      setError('Failed to create dispute. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('eligibility');
    setDisputeType('payment_dispute');
    setSubject('');
    setDescription('');
    setEvidenceFiles([]);
    setPaymentMethodId('');
    setError('');
    setEligibilityCheck(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">File a Dispute</h2>
            <p className="text-sm text-slate-600 mt-1">{assignmentTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                step === 'eligibility' ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-600'
              }`}>
                <i className="ri-shield-check-line"></i>
              </div>
              <span className="text-sm font-medium text-slate-700">Eligibility</span>
            </div>
            <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                step === 'details' || step === 'payment' || step === 'confirmation' ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                <i className="ri-file-text-line"></i>
              </div>
              <span className="text-sm font-medium text-slate-700">Details</span>
            </div>
            <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                step === 'payment' || step === 'confirmation' ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                <i className="ri-bank-card-line"></i>
              </div>
              <span className="text-sm font-medium text-slate-700">Payment</span>
            </div>
          </div>

          {/* Eligibility Check */}
          {step === 'eligibility' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <i className="ri-alert-line text-xl text-amber-600 flex-shrink-0"></i>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Important Information</h3>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• A mandatory dispute fee of ${disputeFee} will be charged</li>
                      <li>• The fee is refunded if the dispute is resolved in your favor</li>
                      <li>• Frivolous disputes may result in penalties and restrictions</li>
                      <li>• All disputes are automatically escalated to admin review</li>
                      <li>• Escrow funds will be held until resolution</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-slate-900">Assignment Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Facility:</span>
                    <p className="font-medium text-slate-900">{facility.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Physician:</span>
                    <p className="font-medium text-slate-900">{physician.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Specialty:</span>
                    <p className="font-medium text-slate-900">{physician.specialty}</p>
                  </div>
                  {escrowAmount && (
                    <div>
                      <span className="text-slate-600">Escrow Amount:</span>
                      <p className="font-medium text-slate-900">${escrowAmount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {eligibilityCheck && !eligibilityCheck.allowed && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <i className="ri-error-warning-line text-xl text-red-600 flex-shrink-0"></i>
                    <div>
                      <h3 className="font-semibold text-red-900 mb-1">Cannot File Dispute</h3>
                      <p className="text-sm text-red-800">{eligibilityCheck.reason}</p>
                    </div>
                  </div>
                </div>
              )}

              {eligibilityCheck && eligibilityCheck.allowed && eligibilityCheck.reason && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <i className="ri-information-line text-xl text-blue-600 flex-shrink-0"></i>
                    <div>
                      <p className="text-sm text-blue-800">{eligibilityCheck.reason}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleEligibilityCheck}
                className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors whitespace-nowrap"
              >
                Continue to Dispute Details
              </button>
            </div>
          )}

          {/* Dispute Details */}
          {step === 'details' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dispute Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={disputeType}
                  onChange={(e) => setDisputeType(e.target.value as DisputeType)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {DISPUTE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-slate-600 mt-1">
                  {DISPUTE_TYPES.find(t => t.value === disputeType)?.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of the dispute"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  maxLength={200}
                />
                <p className="text-sm text-slate-500 mt-1">{subject.length}/200 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a detailed explanation of the dispute, including dates, specific incidents, and any relevant context. Minimum 50 characters."
                  rows={6}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  maxLength={2000}
                />
                <p className="text-sm text-slate-500 mt-1">
                  {description.length}/2000 characters {description.length < 50 && `(minimum 50 required)`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Supporting Evidence (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="evidence-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                  />
                  <label htmlFor="evidence-upload" className="cursor-pointer">
                    <i className="ri-upload-cloud-line text-4xl text-slate-400 mb-2"></i>
                    <p className="text-sm text-slate-600 mb-1">Click to upload files</p>
                    <p className="text-xs text-slate-500">PDF, DOC, JPG, PNG, ZIP (max 10MB each)</p>
                  </label>
                </div>
                {evidenceFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {evidenceFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded">
                        <i className="ri-file-line"></i>
                        <span className="flex-1">{file.name}</span>
                        <span className="text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('eligibility')}
                  className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitDetails}
                  className="flex-1 bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors whitespace-nowrap"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Payment */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Dispute Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium text-slate-900">
                      {DISPUTE_TYPES.find(t => t.value === disputeType)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subject:</span>
                    <span className="font-medium text-slate-900">{subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Evidence Files:</span>
                    <span className="font-medium text-slate-900">{evidenceFiles.length} file(s)</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="ri-information-line text-xl text-amber-600 flex-shrink-0"></i>
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Dispute Fee: ${disputeFee}</p>
                    <p>This fee will be refunded if the dispute is resolved in your favor. The fee helps prevent frivolous disputes and covers administrative costs.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(e.target.value)}
                  placeholder="Enter payment method ID (e.g., card_1234...)"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="text-sm text-slate-500 mt-1">
                  In production, this would integrate with Stripe/PayPal payment form
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('details')}
                  disabled={loading}
                  className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={loading}
                  className="flex-1 bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      Processing...
                    </>
                  ) : (
                    `Pay $${disputeFee} & Submit Dispute`
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Confirmation */}
          {step === 'confirmation' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-3xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Dispute Filed Successfully</h3>
              <p className="text-slate-600 mb-6">
                Your dispute has been submitted and automatically escalated to our admin team for review.
              </p>
              <div className="bg-slate-50 rounded-lg p-4 text-left space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600">Dispute Fee:</span>
                  <span className="font-medium text-slate-900">${disputeFee} (Paid)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Escrow Status:</span>
                  <span className="font-medium text-amber-600">Held</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Next Steps:</span>
                  <span className="font-medium text-slate-900">Admin Review</span>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                You will receive email and dashboard notifications as your dispute progresses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
