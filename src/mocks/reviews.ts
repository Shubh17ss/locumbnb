import type { Review, ReviewRequest, TrustScore, VerificationBadge, ReviewStats } from '../types/review';

// Production: Start with empty reviews - will be created after assignments complete
export const mockReviews: Review[] = [];

// Production: Start with empty review requests - will be created after payment release
export const mockReviewRequests: ReviewRequest[] = [];

// Production: Start with empty trust scores - will be calculated as users complete assignments
export const mockTrustScores: TrustScore[] = [];

// Production: Start with empty verification badges - will be assigned after profile verification
export const mockVerificationBadges: VerificationBadge[] = [];

export const getReviewsByUser = (userId: string): Review[] => {
  return mockReviews.filter(r => r.revieweeId === userId);
};

export const getReviewsByAssignment = (assignmentId: string): Review[] => {
  return mockReviews.filter(r => r.assignmentId === assignmentId);
};

export const getTrustScore = (userId: string): TrustScore | undefined => {
  return mockTrustScores.find(ts => ts.userId === userId);
};

export const getVerificationBadge = (userId: string): VerificationBadge | undefined => {
  return mockVerificationBadges.find(vb => vb.userId === userId);
};

export const getPendingReviewRequests = (): ReviewRequest[] => {
  return mockReviewRequests.filter(
    rr => !rr.physicianReviewSubmitted || !rr.facilityReviewSubmitted
  );
};
