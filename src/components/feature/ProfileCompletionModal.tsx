import { Link } from 'react-router-dom';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileStatus: {
    cvUploaded: boolean;
    licenseAdded: boolean;
    malpracticeDisclosed: boolean;
    npdbAcknowledged: boolean;
    termsAccepted: boolean;
  };
}

export default function ProfileCompletionModal({ isOpen, onClose, profileStatus }: ProfileCompletionModalProps) {
  if (!isOpen) return null;

  const allComplete = Object.values(profileStatus).every(status => status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Complete your profile to apply</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Facilities require a complete professional profile before reviewing applications. Finish the items below to apply instantly.
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3">
            {profileStatus.cvUploaded ? (
              <i className="ri-checkbox-circle-fill text-xl text-teal-600"></i>
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
            )}
            <span className={profileStatus.cvUploaded ? 'text-gray-900' : 'text-gray-600'}>Upload CV</span>
          </div>
          <div className="flex items-center gap-3">
            {profileStatus.licenseAdded ? (
              <i className="ri-checkbox-circle-fill text-xl text-teal-600"></i>
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
            )}
            <span className={profileStatus.licenseAdded ? 'text-gray-900' : 'text-gray-600'}>Add license details</span>
          </div>
          <div className="flex items-center gap-3">
            {profileStatus.malpracticeDisclosed ? (
              <i className="ri-checkbox-circle-fill text-xl text-teal-600"></i>
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
            )}
            <span className={profileStatus.malpracticeDisclosed ? 'text-gray-900' : 'text-gray-600'}>Malpractice history disclosure</span>
          </div>
          <div className="flex items-center gap-3">
            {profileStatus.npdbAcknowledged ? (
              <i className="ri-checkbox-circle-fill text-xl text-teal-600"></i>
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
            )}
            <span className={profileStatus.npdbAcknowledged ? 'text-gray-900' : 'text-gray-600'}>NPDB acknowledgment</span>
          </div>
          <div className="flex items-center gap-3">
            {profileStatus.termsAccepted ? (
              <i className="ri-checkbox-circle-fill text-xl text-teal-600"></i>
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
            )}
            <span className={profileStatus.termsAccepted ? 'text-gray-900' : 'text-gray-600'}>Accept platform terms</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            to="/profile-completion" 
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-center whitespace-nowrap"
          >
            Finish profile
          </Link>
          <button 
            onClick={onClose}
            className="w-full bg-white text-gray-700 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
          >
            Not now
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Self‑reported information. Credentialing is completed by the facility.
        </p>
      </div>
    </div>
  );
}
