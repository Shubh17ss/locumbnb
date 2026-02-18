export type ReviewType = 'physician_to_facility' | 'facility_to_physician';

export type ReviewVisibility = 'public' | 'anonymous';

export type ReviewStatus = 'pending' | 'submitted' | 'moderated' | 'flagged' | 'removed';

export interface Review {
  id: string;
  assignmentId: string;
  reviewType: ReviewType;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'physician' | 'facility';
  revieweeId: string;
  revieweeName: string;
  revieweeRole: 'physician' | 'facility';
  rating: number; // 1-5 stars
  visibility: ReviewVisibility;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  wouldWorkAgain: boolean;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  moderatedBy?: string;
  moderationNotes?: string;
  flaggedReason?: string;
  helpfulCount: number;
  reportCount: number;
}

export interface ReviewRequest {
  id: string;
  assignmentId: string;
  physicianId: string;
  physicianName: string;
  facilityId: string;
  facilityName: string;
  requestedAt: string;
  expiresAt: string;
  physicianReviewSubmitted: boolean;
  facilityReviewSubmitted: boolean;
  remindersSent: number;
  lastReminderAt?: string;
}

export interface TrustScore {
  userId: string;
  userType: 'physician' | 'facility' | 'vendor';
  overallScore: number; // 0-100
  averageRating: number; // 1-5
  totalReviews: number;
  positiveReviews: number;
  neutralReviews: number;
  negativeReviews: number;
  wouldWorkAgainPercentage: number;
  responseRate: number;
  completionRate: number;
  cancellationRate: number;
  disputeRate: number;
  lastUpdated: string;
  trend: 'improving' | 'stable' | 'declining';
}

export interface VerificationBadge {
  userId: string;
  userType: 'physician' | 'facility' | 'vendor';
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationCriteria: {
    profileComplete: boolean;
    documentsValidated: boolean;
    identityVerified: boolean;
    backgroundCheckPassed?: boolean;
    licenseVerified?: boolean;
    insuranceVerified?: boolean;
  };
  badgeLevel: 'basic' | 'verified' | 'premium' | 'elite';
  expiresAt?: string;
  lastReviewedAt: string;
}

export interface ReviewStats {
  userId: string;
  userType: 'physician' | 'facility';
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
  recentReviews: Review[];
  topPros: string[];
  topCons: string[];
  wouldWorkAgainPercentage: number;
  responseToReviews: number;
  lastReviewDate?: string;
}

export interface ReviewModeration {
  reviewId: string;
  flaggedBy: string;
  flaggedAt: string;
  reason: 'inappropriate' | 'spam' | 'fake' | 'offensive' | 'misleading' | 'other';
  description: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: string;
  action?: 'remove' | 'edit' | 'warn_user' | 'no_action';
  notes?: string;
}

export interface SearchRankingFactors {
  userId: string;
  baseScore: number;
  trustScoreWeight: number;
  reviewRatingWeight: number;
  completionRateWeight: number;
  responseTimeWeight: number;
  verificationWeight: number;
  totalScore: number;
  rank: number;
  lastCalculated: string;
}