import type { VerificationBadge } from '../../types/review';

interface TrustBadgeProps {
  badge: VerificationBadge;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

const TrustBadge = ({ badge, size = 'medium', showDetails = false }: TrustBadgeProps) => {
  if (!badge.isVerified) return null;

  const sizeClasses = {
    small: 'w-5 h-5 text-xs',
    medium: 'w-6 h-6 text-sm',
    large: 'w-8 h-8 text-base'
  };

  const badgeColors = {
    basic: 'bg-slate-100 text-slate-600 border-slate-300',
    verified: 'bg-teal-100 text-teal-600 border-teal-300',
    premium: 'bg-blue-100 text-blue-600 border-blue-300',
    elite: 'bg-purple-100 text-purple-600 border-purple-300'
  };

  const badgeLabels = {
    basic: 'Basic',
    verified: 'Verified',
    premium: 'Premium',
    elite: 'Elite'
  };

  return (
    <div className="inline-flex items-center gap-2">
      {/* Badge Icon */}
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-full border-2 ${badgeColors[badge.badgeLevel]}`}
        title={`${badgeLabels[badge.badgeLevel]} - Verified ${badge.userType}`}
      >
        <i className="ri-verified-badge-fill"></i>
      </div>

      {/* Badge Details */}
      {showDetails && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-900">
            {badgeLabels[badge.badgeLevel]}
          </span>
          <span className="text-xs text-slate-600">
            Verified {badge.userType}
          </span>
        </div>
      )}
    </div>
  );
};

export default TrustBadge;