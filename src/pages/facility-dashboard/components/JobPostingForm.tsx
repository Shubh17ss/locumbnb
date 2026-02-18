import React, { useState } from 'react';

interface JobPostingFormData {
  specialty: string;
  subspecialty: string;
  stateLicenses: string[];
  startDate: string;
  endDate: string;
  assignmentType: 'fixed-3' | 'fixed-5' | 'fixed-7' | 'rolling';
  payAmount: string;
  requirements: string;
  malpracticeIncluded: boolean;
  travelLodging: 'included' | 'separate' | 'budget-cap';
  flightBudget: string;
  hotelBudget: string;
  otherTravelBudget: string;
  contractFile: File | null;
  termsAccepted: boolean;
  signerName: string;
}

const SPECIALTIES = [
  'Anesthesiology',
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Family Medicine',
  'Internal Medicine',
  'Neurology',
  'Obstetrics & Gynecology',
  'Orthopedic Surgery',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery',
  'Urology'
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

interface JobPostingFormProps {
  onClose: () => void;
  onSubmit: (data: JobPostingFormData) => void;
}

export default function JobPostingForm({ onClose, onSubmit }: JobPostingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const [formData, setFormData] = useState<JobPostingFormData>({
    specialty: '',
    subspecialty: '',
    stateLicenses: [],
    startDate: '',
    endDate: '',
    assignmentType: 'fixed-3',
    payAmount: '',
    requirements: '',
    malpracticeIncluded: true,
    travelLodging: 'separate',
    flightBudget: '',
    hotelBudget: '',
    otherTravelBudget: '',
    contractFile: null,
    termsAccepted: false,
    signerName: ''
  });

  const handleLicenseToggle = (state: string) => {
    setFormData(prev => ({
      ...prev,
      stateLicenses: prev.stateLicenses.includes(state)
        ? prev.stateLicenses.filter(s => s !== state)
        : [...prev.stateLicenses, state]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, contractFile: file }));
    }
  };

  const handleSubmitPosting = async () => {
    setIsSubmitting(true);
    
    // Capture metadata
    const metadata = {
      timestamp: new Date().toISOString(),
      ipAddress: 'Captured', // In production, capture actual IP
      userAgent: navigator.userAgent,
      signerName: formData.signerName
    };

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit({ ...formData, ...metadata } as any);
    setIsSubmitting(false);
  };

  const isStep1Valid = formData.specialty && formData.stateLicenses.length > 0 && 
                       formData.startDate && formData.endDate && formData.payAmount;
  
  const isStep2Valid = formData.contractFile !== null;
  
  const isStep3Valid = formData.termsAccepted && formData.signerName.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create Job Posting</h2>
              <p className="text-sm text-gray-600 mt-1">Step {currentStep} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 flex items-center space-x-2">
            {[1, 2, 3].map(step => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-teal-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Assignment Details */}
        {currentStep === 1 && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specialty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Select specialty</option>
                  {SPECIALTIES.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Subspecialty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subspecialty (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subspecialty}
                  onChange={(e) => setFormData(prev => ({ ...prev, subspecialty: e.target.value }))}
                  placeholder="e.g., Interventional Cardiology"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* State Licenses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required State License(s) <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-5 gap-2">
                  {US_STATES.map(state => (
                    <button
                      key={state}
                      type="button"
                      onClick={() => handleLicenseToggle(state)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                        formData.stateLicenses.includes(state)
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Selected: {formData.stateLicenses.length > 0 ? formData.stateLicenses.join(', ') : 'None'}
              </p>
            </div>

            {/* Assignment Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            {/* Assignment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'fixed-3', label: '3-Day Block' },
                  { value: 'fixed-5', label: '5-Day Block' },
                  { value: 'fixed-7', label: '7-Day Block' },
                  { value: 'rolling', label: 'Rolling Availability' }
                ].map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, assignmentType: type.value as any }))}
                    className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-colors whitespace-nowrap ${
                      formData.assignmentType === type.value
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pay Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pay Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.payAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, payAmount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">This amount will be visible to physicians</p>
            </div>

            {/* Malpractice Coverage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Malpractice Coverage
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.malpracticeIncluded}
                    onChange={() => setFormData(prev => ({ ...prev, malpracticeIncluded: true }))}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Included</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={!formData.malpracticeIncluded}
                    onChange={() => setFormData(prev => ({ ...prev, malpracticeIncluded: false }))}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Not Included</span>
                </label>
              </div>
            </div>

            {/* Travel & Lodging */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel & Lodging
              </label>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.travelLodging === 'included'}
                    onChange={() => setFormData(prev => ({ ...prev, travelLodging: 'included' }))}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Included (facility covers all)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.travelLodging === 'separate'}
                    onChange={() => setFormData(prev => ({ ...prev, travelLodging: 'separate' }))}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Physician bills separately</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.travelLodging === 'budget-cap'}
                    onChange={() => setFormData(prev => ({ ...prev, travelLodging: 'budget-cap' }))}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Budget caps apply</span>
                </label>
              </div>

              {formData.travelLodging === 'budget-cap' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Flight Budget
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={formData.flightBudget}
                        onChange={(e) => setFormData(prev => ({ ...prev, flightBudget: e.target.value }))}
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Hotel Budget
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={formData.hotelBudget}
                        onChange={(e) => setFormData(prev => ({ ...prev, hotelBudget: e.target.value }))}
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Other Travel
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={formData.otherTravelBudget}
                        onChange={(e) => setFormData(prev => ({ ...prev, otherTravelBudget: e.target.value }))}
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Assignment Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment-Specific Requirements
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="Describe any specific requirements, certifications, or expectations for this assignment..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Contract Upload */}
        {currentStep === 2 && (
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <i className="ri-information-line text-blue-600 text-lg mt-0.5"></i>
                <div>
                  <p className="text-sm text-blue-900 font-medium">Contract Privacy</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Your contract template will remain private until a physician is approved for this assignment.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Contract Template <span className="text-red-500">*</span>
              </label>
              
              {!formData.contractFile ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <i className="ri-upload-cloud-2-line text-4xl text-gray-400 mb-3"></i>
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </label>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <i className="ri-file-text-line text-teal-600 text-xl"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formData.contractFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(formData.contractFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, contractFile: null }))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <i className="ri-delete-bin-line text-xl"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Version Control</h4>
              <p className="text-xs text-gray-600">
                All contract uploads are automatically versioned and timestamped. Previous versions remain accessible for audit purposes.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Legal Attestation */}
        {currentStep === 3 && (
          <div className="p-6 space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <i className="ri-alert-line text-amber-600 text-lg mt-0.5"></i>
                <div>
                  <p className="text-sm text-amber-900 font-medium">Legal Attestation Required</p>
                  <p className="text-sm text-amber-800 mt-1">
                    Your digital signature will be legally binding for this job posting.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Facility Terms & Conditions</h3>
              
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm text-gray-700 space-y-3">
                <p className="font-medium">By submitting this job posting, I hereby attest and agree to the following:</p>
                
                <ol className="list-decimal list-inside space-y-2 pl-2">
                  <li>All information provided in this job posting is accurate and complete to the best of my knowledge.</li>
                  <li>I am authorized to create job postings and enter into agreements on behalf of the facility.</li>
                  <li>I understand that this platform is a technology marketplace only and is not an employer, staffing agency, healthcare provider, or credentialing authority.</li>
                  <li>The facility is solely responsible for all credentialing, verification, and compliance requirements.</li>
                  <li>Payment will be submitted to third-party escrow upon contract execution and released according to platform terms.</li>
                  <li>All communications with physicians must occur within the platform for active or past assignments.</li>
                  <li>I agree to respond to physician applications within two business days.</li>
                  <li>I acknowledge that violations of platform terms may result in account suspension or removal.</li>
                </ol>

                <p className="mt-4 text-xs text-gray-600">
                  This attestation will be timestamped and stored with IP address and device metadata for legal and audit purposes.
                </p>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                  className="w-5 h-5 text-teal-600 focus:ring-teal-500 rounded mt-0.5"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the Facility Terms & Conditions and understand that my digital signature will be legally binding.
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authorized Signer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.signerName}
                onChange={(e) => setFormData(prev => ({ ...prev, signerName: e.target.value }))}
                placeholder="Type your full legal name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                By typing your name, you are providing a legally binding digital signature
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600 space-y-1">
              <p><strong>Signature Metadata:</strong></p>
              <p>• Timestamp: {new Date().toLocaleString()}</p>
              <p>• IP Address: Will be captured upon submission</p>
              <p>• Device: {navigator.userAgent.split(' ').slice(0, 3).join(' ')}</p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(currentStep - 1);
                } else {
                  onClose();
                }
              }}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid)
                }
                className="px-6 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Continue
                <i className="ri-arrow-right-line ml-2"></i>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitPosting}
                disabled={!isStep3Valid || isSubmitting}
                className="px-6 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="ri-check-line mr-2"></i>
                    Submit Job Posting
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
