import type { Review, ReviewRequest, TrustScore, VerificationBadge, ReviewStats, SearchRankingFactors } from '../types/review';

/**
 * Calculate trust score based on multiple factors
 */
export const calculateTrustScore = (
  averageRating: number,
  totalReviews: number,
  completionRate: number,
  cancellationRate: number,
  disputeRate: number,
  responseRate: number,
  wouldWorkAgainPercentage: number
): number => {
  // Weighted scoring algorithm
  const ratingScore = (averageRating / 5) * 30; // 30% weight
  const reviewVolumeScore = Math.min((totalReviews / 50) * 15, 15); // 15% weight, cap at 50 reviews
  const completionScore = completionRate * 0.25; // 25% weight
  const cancellationPenalty = cancellationRate * 10; // Penalty
  const disputePenalty = disputeRate * 15; // Higher penalty
  const responseScore = responseRate * 0.15; // 15% weight
  const recommendationScore = (wouldWorkAgainPercentage / 100) * 15; // 15% weight

  const totalScore = Math.max(
    0,
    Math.min(
      100,
      ratingScore + reviewVolumeScore + completionScore + responseScore + recommendationScore - cancellationPenalty - disputePenalty
    )
  );

  return Math.round(totalScore * 10) / 10;
};

/**
 * Calculate search ranking score
 */
export const calculateSearchRanking = (
  trustScore: number,
  averageRating: number,
  completionRate: number,
  responseTime: number, // in hours
  isVerified: boolean
): SearchRankingFactors => {
  const trustScoreWeight = trustScore * 0.35; // 35% weight
  const reviewRatingWeight = (averageRating / 5) * 25; // 25% weight
  const completionRateWeight = completionRate * 0.20; // 20% weight
  const responseTimeWeight = Math.max(0, (48 - responseTime) / 48) * 10; // 10% weight, faster = better
  const verificationWeight = isVerified ? 10 : 0; // 10% weight

  const totalScore = trustScoreWeight + reviewRatingWeight + completionRateWeight + responseTimeWeight + verificationWeight;

  return {
    userId: '',
    baseScore: trustScore,
    trustScoreWeight,
    reviewRatingWeight,
    completionRateWeight,
    responseTimeWeight,
    verificationWeight,
    totalScore: Math.round(totalScore * 10) / 10,
    rank: 0,
    lastCalculated: new Date().toISOString()
  };
};

/**
 * Determine if user should receive verification badge
 */
export const shouldGrantVerification = (
  profileComplete: boolean,
  documentsValidated: boolean,
  identityVerified: boolean,
  licenseVerified: boolean,
  backgroundCheckPassed: boolean
): boolean => {
  return (
    profileComplete &&
    documentsValidated &&
    identityVerified &&
    licenseVerified &&
    backgroundCheckPassed
  );
};

/**
 * Calculate badge level based on criteria
 */
export const calculateBadgeLevel = (
  verificationCriteria: VerificationBadge['verificationCriteria'],
  trustScore: number,
  totalReviews: number
): VerificationBadge['badgeLevel'] => {
  const allCriteriaMet = Object.values(verificationCriteria).every(v => v === true);

  if (allCriteriaMet && trustScore >= 95 && totalReviews >= 20) {
    return 'elite';
  } else if (allCriteriaMet && trustScore >= 90 && totalReviews >= 10) {
    return 'premium';
  } else if (
    verificationCriteria.profileComplete &&
    verificationCriteria.documentsValidated &&
    verificationCriteria.identityVerified
  ) {
    return 'verified';
  }
  return 'basic';
};

/**
 * Trigger review request after payment release
 */
export const triggerReviewRequest = (
  assignmentId: string,
  physicianId: string,
  physicianName: string,
  facilityId: string,
  facilityName: string
): ReviewRequest => {
  const requestedAt = new Date();
  const expiresAt = new Date(requestedAt);
  expiresAt.setDate(expiresAt.getDate() + 14); // 14 days to submit review

  return {
    id: `req-${Date.now()}`,
    assignmentId,
    physicianId,
    physicianName,
    facilityId,
    facilityName,
    requestedAt: requestedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    physicianReviewSubmitted: false,
    facilityReviewSubmitted: false,
    remindersSent: 0
  };
};

/**
 * Submit a review
 */
export const submitReview = (
  assignmentId: string,
  reviewerId: string,
  reviewerName: string,
  reviewerRole: 'physician' | 'facility',
  revieweeId: string,
  revieweeName: string,
  revieweeRole: 'physician' | 'facility',
  rating: number,
  visibility: 'public' | 'anonymous',
  title: string,
  comment: string,
  pros: string[],
  cons: string[],
  wouldWorkAgain: boolean
): Review => {
  const reviewType: Review['reviewType'] =
    reviewerRole === 'physician' ? 'physician_to_facility' : 'facility_to_physician';

  return {
    id: `rev-${Date.now()}`,
    assignmentId,
    reviewType,
    reviewerId,
    reviewerName: visibility === 'anonymous' ? 'Anonymous' : reviewerName,
    reviewerRole,
    revieweeId,
    revieweeName,
    revieweeRole,
    rating,
    visibility,
    title,
    comment,
    pros,
    cons,
    wouldWorkAgain,
    status: 'submitted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    helpfulCount: 0,
    reportCount: 0
  };
};

/**
 * Calculate review statistics for a user
 */
export const calculateReviewStats = (reviews: Review[]): ReviewStats => {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  const ratingDistribution = {
    fiveStar: reviews.filter(r => r.rating === 5).length,
    fourStar: reviews.filter(r => r.rating === 4).length,
    threeStar: reviews.filter(r => r.rating === 3).length,
    twoStar: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length
  };

  const wouldWorkAgainCount = reviews.filter(r => r.wouldWorkAgain).length;
  const wouldWorkAgainPercentage = totalReviews > 0
    ? (wouldWorkAgainCount / totalReviews) * 100
    : 0;

  // Extract top pros and cons
  const allPros: string[] = [];
  const allCons: string[] = [];
  reviews.forEach(r => {
    if (r.pros) allPros.push(...r.pros);
    if (r.cons) allCons.push(...r.cons);
  });

  const prosCount = allPros.reduce((acc, pro) => {
    acc[pro] = (acc[pro] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const consCount = allCons.reduce((acc, con) => {
    acc[con] = (acc[con] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPros = Object.entries(prosCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pro]) => pro);

  const topCons = Object.entries(consCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([con]) => con);

  return {
    userId: reviews[0]?.revieweeId || '',
    userType: reviews[0]?.revieweeRole || 'physician',
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    recentReviews: reviews.slice(0, 5),
    topPros,
    topCons,
    wouldWorkAgainPercentage: Math.round(wouldWorkAgainPercentage * 10) / 10,
    responseToReviews: 0,
    lastReviewDate: reviews[0]?.createdAt
  };
};

/**
 * Check if review should be flagged for moderation
 */
export const shouldFlagReview = (review: Review): boolean => {
  const suspiciousPatterns = [
    /\b(fake|scam|fraud|lie|liar)\b/i,
    /\b(worst|terrible|horrible|awful)\b.*\b(worst|terrible|horrible|awful)\b/i,
    /[A-Z]{10,}/, // Excessive caps
    /(.)\1{5,}/, // Repeated characters
  ];

  const textToCheck = `${review.title} ${review.comment}`;
  return suspiciousPatterns.some(pattern => pattern.test(textToCheck));
};

/**
 * Update trust score after new review
 */
export const updateTrustScoreAfterReview = (
  currentScore: TrustScore,
  newReview: Review
): TrustScore => {
  const totalReviews = currentScore.totalReviews + 1;
  const newAverageRating =
    (currentScore.averageRating * currentScore.totalReviews + newReview.rating) / totalReviews;

  let positiveReviews = currentScore.positiveReviews;
  let neutralReviews = currentScore.neutralReviews;
  let negativeReviews = currentScore.negativeReviews;

  if (newReview.rating >= 4) positiveReviews++;
  else if (newReview.rating === 3) neutralReviews++;
  else negativeReviews++;

  const wouldWorkAgainCount =
    (currentScore.wouldWorkAgainPercentage / 100) * currentScore.totalReviews +
    (newReview.wouldWorkAgain ? 1 : 0);
  const wouldWorkAgainPercentage = (wouldWorkAgainCount / totalReviews) * 100;

  const overallScore = calculateTrustScore(
    newAverageRating,
    totalReviews,
    currentScore.completionRate,
    currentScore.cancellationRate,
    currentScore.disputeRate,
    currentScore.responseRate,
    wouldWorkAgainPercentage
  );

  // Determine trend
  let trend: TrustScore['trend'] = 'stable';
  if (overallScore > currentScore.overallScore + 2) trend = 'improving';
  else if (overallScore < currentScore.overallScore - 2) trend = 'declining';

  return {
    ...currentScore,
    overallScore,
    averageRating: Math.round(newAverageRating * 10) / 10,
    totalReviews,
    positiveReviews,
    neutralReviews,
    negativeReviews,
    wouldWorkAgainPercentage: Math.round(wouldWorkAgainPercentage * 10) / 10,
    lastUpdated: new Date().toISOString(),
    trend
  };
};

/**
 * Send review reminder
 */
export const sendReviewReminder = (reviewRequest: ReviewRequest): ReviewRequest => {
  return {
    ...reviewRequest,
    remindersSent: reviewRequest.remindersSent + 1,
    lastReminderAt: new Date().toISOString()
  };
};

/**
 * Check if review request has expired
 */
export const isReviewRequestExpired = (reviewRequest: ReviewRequest): boolean => {
  return new Date(reviewRequest.expiresAt) < new Date();
};