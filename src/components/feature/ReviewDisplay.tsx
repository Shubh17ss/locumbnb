import { useState } from 'react';
import type { Review } from '../../types/review';

interface ReviewDisplayProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  showFilters?: boolean;
}

const ReviewDisplay = ({
  reviews,
  averageRating,
  totalReviews,
  showFilters = true
}: ReviewDisplayProps) => {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');

  // Calculate rating distribution
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  // Filter and sort reviews
  let filteredReviews = filterRating
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  filteredReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'highest') {
      return b.rating - a.rating;
    } else {
      return a.rating - b.rating;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-slate-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`text-xl ${
                    star <= Math.round(averageRating)
                      ? 'ri-star-fill text-amber-400'
                      : 'ri-star-line text-slate-300'
                  }`}
                ></i>
              ))}
            </div>
            <p className="text-sm text-slate-600">{totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating as keyof typeof ratingDistribution];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <button
                  key={rating}
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                  className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap ${
                    filterRating === rating ? 'bg-teal-50' : ''
                  }`}
                >
                  <span className="text-sm font-medium text-slate-700 w-12">
                    {rating} star
                  </span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-600 w-12 text-right">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      {showFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {filterRating && (
              <button
                onClick={() => setFilterRating(null)}
                className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-teal-200 transition-colors whitespace-nowrap"
              >
                {filterRating} star
                <i className="ri-close-line"></i>
              </button>
            )}
            <span className="text-sm text-slate-600">
              Showing {filteredReviews.length} of {totalReviews} reviews
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <i className="ri-chat-3-line text-4xl text-slate-300 mb-3"></i>
            <p className="text-slate-600">No reviews found matching your filters.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full">
                    <i className="ri-user-line text-xl text-slate-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {review.visibility === 'anonymous' ? 'Anonymous' : review.reviewerName}
                    </h4>
                    <p className="text-sm text-slate-600">{formatDate(review.createdAt)}</p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`text-lg ${
                        star <= review.rating
                          ? 'ri-star-fill text-amber-400'
                          : 'ri-star-line text-slate-300'
                      }`}
                    ></i>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <h5 className="font-semibold text-slate-900 mb-2">{review.title}</h5>

              {/* Review Comment */}
              <p className="text-slate-700 mb-4">{review.comment}</p>

              {/* Pros and Cons */}
              {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {review.pros && review.pros.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="ri-thumb-up-line text-green-600"></i>
                        <span className="text-sm font-semibold text-green-900">Pros</span>
                      </div>
                      <ul className="space-y-1">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                            <i className="ri-check-line text-green-600 mt-0.5"></i>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.cons && review.cons.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="ri-thumb-down-line text-amber-600"></i>
                        <span className="text-sm font-semibold text-amber-900">Cons</span>
                      </div>
                      <ul className="space-y-1">
                        {review.cons.map((con, index) => (
                          <li key={index} className="text-sm text-amber-800 flex items-start gap-2">
                            <i className="ri-close-line text-amber-600 mt-0.5"></i>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Would Work Again Badge */}
              {review.wouldWorkAgain && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium">
                  <i className="ri-repeat-line"></i>
                  Would work together again
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200">
                <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 transition-colors whitespace-nowrap">
                  <i className="ri-thumb-up-line"></i>
                  Helpful ({review.helpfulCount})
                </button>
                <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition-colors whitespace-nowrap">
                  <i className="ri-flag-line"></i>
                  Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewDisplay;