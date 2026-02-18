import React from 'react';

interface ApplicationBlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteProfile: () => void;
  completionPercentage: number;
}

export const ApplicationBlockedModal: React.FC<ApplicationBlockedModalProps> = ({
  isOpen,
  onClose,
  onCompleteProfile,
  completionPercentage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-lock-line text-red-600 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Complete Your Profile to Apply
          </h2>
          <p className="text-sm text-gray-600">
            Facilities require a complete professional profile before reviewing applications.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
            <span className="text-sm font-bold text-gray-900">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-500 mb-3">Required sections:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <i className="ri-checkbox-blank-circle-line text-xs"></i>
                <span>Personal Identifiers</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <i className="ri-checkbox-blank-circle-line text-xs"></i>
                <span>Professional Information</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <i className="ri-checkbox-blank-circle-line text-xs"></i>
                <span>Licensure Details</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <i className="ri-checkbox-blank-circle-line text-xs"></i>
                <span>Document Uploads</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <i className="ri-checkbox-blank-circle-line text-xs"></i>
                <span>Standard Questionnaires</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <i className="ri-checkbox-blank-circle-line text-xs"></i>
                <span>Digital Attestation & Signature</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCompleteProfile}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            Complete Profile
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            Not Now
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Self-reported information. Credentialing is completed by the facility.
        </p>
      </div>
    </div>
  );
};
