import type { TrustScore } from '../../types/review';

interface TrustScoreDisplayProps {
  trustScore: TrustScore;
  showDetails?: boolean;
}

const TrustScoreDisplay = ({ trustScore, showDetails = true }: TrustScoreDisplayProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-teal-600 bg-teal-50 border-teal-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTrendIcon = (trend: TrustScore['trend']) => {
    if (trend === 'improving') return 'ri-arrow-up-line text-green-600';
    if (trend === 'declining') return 'ri-arrow-down-line text-red-600';
    return 'ri-subtract-line text-slate-600';
  };

  const getTrendLabel = (trend: TrustScore['trend']) => {
    if (trend === 'improving') return 'Improving';
    if (trend === 'declining') return 'Declining';
    return 'Stable';
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      {/* Trust Score Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Trust Score</h3>
          <p className="text-sm text-slate-600">
            Based on reviews, completion rate, and reliability
          </p>
        </div>
        <div className="flex items-center gap-2">
          <i className={`text-xl ${getTrendIcon(trustScore.trend)}`}></i>
          <span className="text-sm font-medium text-slate-700">
            {getTrendLabel(trustScore.trend)}
          </span>
        </div>
      </div>

      {/* Overall Score */}
      <div className="text-center mb-6">
        <div
          className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 ${getScoreColor(
            trustScore.overallScore
          )}`}
        >
          <div>
            <div className="text-4xl font-bold">{trustScore.overallScore}</div>
            <div className="text-sm font-medium">out of 100</div>
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <i className="ri-star-line text-amber-500"></i>
                <span className="text-sm font-medium text-slate-700">Average Rating</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {trustScore.averageRating.toFixed(1)}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                from {trustScore.totalReviews} reviews
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <i className="ri-repeat-line text-teal-500"></i>
                <span className="text-sm font-medium text-slate-700">Would Work Again</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {trustScore.wouldWorkAgainPercentage.toFixed(1)}%
              </div>
              <p className="text-xs text-slate-600 mt-1">recommendation rate</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <i className="ri-checkbox-circle-line text-green-500"></i>
                <span className="text-sm font-medium text-slate-700">Completion Rate</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {trustScore.completionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-slate-600 mt-1">assignments completed</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <i className="ri-message-3-line text-blue-500"></i>
                <span className="text-sm font-medium text-slate-700">Response Rate</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {trustScore.responseRate.toFixed(1)}%
              </div>
              <p className="text-xs text-slate-600 mt-1">response time</p>
            </div>
          </div>

          {/* Review Distribution */}
          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Review Distribution</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-24">
                  <i className="ri-emotion-happy-line text-green-600"></i>
                  <span className="text-sm text-slate-700">Positive</span>
                </div>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${
                        trustScore.totalReviews > 0
                          ? (trustScore.positiveReviews / trustScore.totalReviews) * 100
                          : 0
                      }%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-slate-900 w-12 text-right">
                  {trustScore.positiveReviews}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-24">
                  <i className="ri-emotion-normal-line text-amber-600"></i>
                  <span className="text-sm text-slate-700">Neutral</span>
                </div>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{
                      width: `${
                        trustScore.totalReviews > 0
                          ? (trustScore.neutralReviews / trustScore.totalReviews) * 100
                          : 0
                      }%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-slate-900 w-12 text-right">
                  {trustScore.neutralReviews}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-24">
                  <i className="ri-emotion-unhappy-line text-red-600"></i>
                  <span className="text-sm text-slate-700">Negative</span>
                </div>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${
                        trustScore.totalReviews > 0
                          ? (trustScore.negativeReviews / trustScore.totalReviews) * 100
                          : 0
                      }%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-slate-900 w-12 text-right">
                  {trustScore.negativeReviews}
                </span>
              </div>
            </div>
          </div>

          {/* Warning Indicators */}
          {(trustScore.cancellationRate > 5 || trustScore.disputeRate > 2) && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <i className="ri-alert-line text-xl text-amber-600 mt-0.5"></i>
                <div>
                  <h5 className="text-sm font-semibold text-amber-900 mb-1">
                    Performance Alerts
                  </h5>
                  <ul className="space-y-1 text-sm text-amber-800">
                    {trustScore.cancellationRate > 5 && (
                      <li>• Cancellation rate is above average ({trustScore.cancellationRate}%)</li>
                    )}
                    {trustScore.disputeRate > 2 && (
                      <li>• Dispute rate requires attention ({trustScore.disputeRate}%)</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Last updated: {new Date(trustScore.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default TrustScoreDisplay;