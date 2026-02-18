import React, { useState, useEffect } from 'react';

interface DigitalAttestationData {
  fullLegalName: string;
  attestationDate: string;
  timestamp: string;
  ipAddress: string;
  deviceInfo: string;
  signatureVersion: string;
  agreed: boolean;
}

interface DigitalAttestationSectionProps {
  data: DigitalAttestationData | null;
  onUpdate: (data: DigitalAttestationData, isComplete: boolean) => void;
}

export const DigitalAttestationSection: React.FC<DigitalAttestationSectionProps> = ({
  data,
  onUpdate,
}) => {
  const [attestation, setAttestation] = useState<DigitalAttestationData>(
    data || {
      fullLegalName: '',
      attestationDate: '',
      timestamp: '',
      ipAddress: '',
      deviceInfo: '',
      signatureVersion: '1.0',
      agreed: false,
    }
  );

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Capture device and IP information
  useEffect(() => {
    const captureDeviceInfo = () => {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      const language = navigator.language;
      
      return `${platform} | ${userAgent.substring(0, 100)} | Lang: ${language}`;
    };

    // Simulate IP capture (in production, this would be done server-side)
    const captureIPAddress = async () => {
      try {
        // In production, call your backend API to get the real IP
        // For now, we'll use a placeholder
        return 'IP captured server-side';
      } catch (error) {
        return 'IP capture pending';
      }
    };

    if (!attestation.deviceInfo) {
      const deviceInfo = captureDeviceInfo();
      captureIPAddress().then((ip) => {
        setAttestation((prev) => ({
          ...prev,
          deviceInfo,
          ipAddress: ip,
        }));
      });
    }
  }, []);

  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, fullLegalName: 'Full legal name is required' }));
      return false;
    }
    
    // Check for at least first and last name (2 words minimum)
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      setErrors((prev) => ({ 
        ...prev, 
        fullLegalName: 'Please enter your full legal name (first and last name)' 
      }));
      return false;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.fullLegalName;
      return newErrors;
    });
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setAttestation((prev) => ({ ...prev, fullLegalName: name }));
    
    // Clear error when user starts typing
    if (errors.fullLegalName) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.fullLegalName;
        return newErrors;
      });
    }
  };

  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttestation((prev) => ({ ...prev, agreed: e.target.checked }));
  };

  const handleSign = () => {
    // Validate name
    if (!validateName(attestation.fullLegalName)) {
      return;
    }

    if (!attestation.agreed) {
      setErrors((prev) => ({ ...prev, agreed: 'You must agree to the attestation' }));
      return;
    }

    // Capture timestamp
    const now = new Date();
    const timestamp = now.toISOString();
    const attestationDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });

    const signedAttestation: DigitalAttestationData = {
      ...attestation,
      attestationDate,
      timestamp,
    };

    setAttestation(signedAttestation);
    setShowConfirmation(true);
  };

  const checkCompletion = (data: DigitalAttestationData): boolean => {
    return (
      data.fullLegalName.trim() !== '' &&
      data.agreed &&
      data.timestamp !== '' &&
      data.attestationDate !== ''
    );
  };

  useEffect(() => {
    const isComplete = checkCompletion(attestation);
    onUpdate(attestation, isComplete);
  }, [attestation]);

  if (showConfirmation && attestation.timestamp) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-checkbox-circle-fill text-green-600 text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Digital Attestation Complete
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Your signature has been recorded and will be automatically attached to all applications.
          </p>

          <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg border border-gray-200 p-6 text-left">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Signature Details</h4>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Signed by:</span>
                <span className="font-medium text-gray-900">{attestation.fullLegalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium text-gray-900">{attestation.attestationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Signature Version:</span>
                <span className="font-medium text-gray-900">v{attestation.signatureVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IP Address:</span>
                <span className="font-medium text-gray-900 text-xs">{attestation.ipAddress}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <span className="text-gray-600 block mb-1">Device Information:</span>
                <span className="font-medium text-gray-900 text-xs break-all">
                  {attestation.deviceInfo}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowConfirmation(false)}
            className="mt-6 px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <i className="ri-edit-line mr-2"></i>
            Edit Signature
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Digital Attestation &amp; Signature
        </h3>
        <p className="text-sm text-gray-600">
          This legally binding attestation will be automatically attached to all your applications.
        </p>
      </div>

      {/* Attestation Statements */}
      <div className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          I hereby attest and agree to the following:
        </h4>

        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-checkbox-circle-line text-teal-600 text-lg"></i>
            </div>
            <p>
              <strong>Accuracy:</strong> All information I have provided in my profile is true and
              accurate to the best of my knowledge.
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-checkbox-circle-line text-teal-600 text-lg"></i>
            </div>
            <p>
              <strong>Responsibility to Update:</strong> I am responsible for keeping all
              information in my profile current and accurate. I will promptly update any changes to
              my credentials, licenses, or professional status.
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-checkbox-circle-line text-teal-600 text-lg"></i>
            </div>
            <p>
              <strong>Authorization to Transmit:</strong> I authorize the platform to transmit my
              profile information, credentials, and documents to facilities only upon my submission
              of an application to a specific assignment.
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-checkbox-circle-line text-teal-600 text-lg"></i>
            </div>
            <p>
              <strong>Non-Circumvention Agreement:</strong> I agree not to bypass the platform or
              contact facilities directly outside of the platform for assignments discovered through
              this marketplace. All communications and agreements must be conducted through the
              platform.
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-checkbox-circle-line text-teal-600 text-lg"></i>
            </div>
            <p>
              <strong>Violation Consequences:</strong> I acknowledge that violations of platform
              terms, including circumvention, misrepresentation, or failure to maintain accurate
              credentials, may result in immediate suspension or permanent removal from the
              platform.
            </p>
          </div>
        </div>
      </div>

      {/* Signature Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type your full legal name to sign
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={attestation.fullLegalName}
            onChange={handleNameChange}
            onBlur={() => validateName(attestation.fullLegalName)}
            placeholder="First Middle Last"
            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
              errors.fullLegalName
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-teal-500'
            }`}
          />
          {errors.fullLegalName && (
            <p className="text-xs text-red-600 mt-1">
              <i className="ri-error-warning-line mr-1"></i>
              {errors.fullLegalName}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            This must match your legal name exactly as it appears on your medical license.
          </p>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <input
            type="checkbox"
            id="attestation-agree"
            checked={attestation.agreed}
            onChange={handleAgreeChange}
            className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-0.5 cursor-pointer"
          />
          <label htmlFor="attestation-agree" className="text-sm text-gray-700 cursor-pointer">
            I have read and agree to all statements above. I understand this digital signature is
            legally binding and will be attached to all my applications.
            <span className="text-red-500 ml-1">*</span>
          </label>
        </div>
        {errors.agreed && (
          <p className="text-xs text-red-600 mt-1">
            <i className="ri-error-warning-line mr-1"></i>
            {errors.agreed}
          </p>
        )}

        <button
          onClick={handleSign}
          disabled={!attestation.fullLegalName.trim() || !attestation.agreed}
          className={`w-full px-6 py-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
            attestation.fullLegalName.trim() && attestation.agreed
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <i className="ri-quill-pen-line mr-2"></i>
          Sign Digital Attestation
        </button>
      </div>

      {/* Legal Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <i className="ri-information-line mr-1"></i>
          <strong>Legal Notice:</strong> Your digital signature, including timestamp, IP address,
          and device information, will be securely stored and version-controlled. This signature
          serves as your legally binding agreement and will be automatically appended to all
          facility applications you submit through this platform.
        </p>
      </div>
    </div>
  );
};