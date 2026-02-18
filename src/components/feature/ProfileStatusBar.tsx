import React from 'react';

interface ProfileStatusBarProps {
  isComplete: boolean;
  completionPercentage: number;
  onCompleteProfile: () => void;
}

export const ProfileStatusBar: React.FC<ProfileStatusBarProps> = ({
  isComplete,
  completionPercentage,
  onCompleteProfile,
}) => {
  return (
    <div
      className={`rounded-lg p-4 mb-6 border-2 ${
        isComplete
          ? 'bg-green-50 border-green-500'
          : 'bg-red-50 border-red-500'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            {isComplete ? (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-white text-sm"></i>
              </div>
            ) : (
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <i className="ri-error-warning-line text-white text-sm"></i>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className={`text-base font-semibold ${
                  isComplete ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {isComplete ? 'Profile Complete' : 'Profile Incomplete'}
              </h3>
              <span
                className={`text-sm font-medium ${
                  isComplete ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {completionPercentage}%
              </span>
            </div>

            <p
              className={`text-sm mb-3 ${
                isComplete ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {isComplete
                ? 'Your profile is complete. You can now apply to assignments.'
                : 'Complete all required sections to apply to assignments. You can browse assignments while your profile is incomplete.'}
            </p>

            {!isComplete && (
              <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {!isComplete && (
          <button
            onClick={onCompleteProfile}
            className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            Complete Profile
          </button>
        )}
      </div>
    </div>
  );
};
