import { useState, useEffect } from 'react';
import type { ReviewRequest } from '../../types/review';
import ReviewSubmissionModal from './ReviewSubmissionModal';

interface ReviewRequestNotificationProps {
  reviewRequests: ReviewRequest[];
  currentUserId: string;
  currentUserRole: 'physician' | 'facility';
  onReviewSubmitted: (reviewRequestId: string) => void;
}

const ReviewRequestNotification = ({
  reviewRequests,
  currentUserId,
  currentUserRole,
  onReviewSubmitted
}: ReviewRequestNotificationProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ReviewRequest | null>(null);
  const [dismissedRequests, setDismissedRequests] = useState<string[]>([]);

  // Filter pending requests for current user
  const pendingRequests = reviewRequests.filter((req) => {
    if (dismissedRequests.includes(req.id)) return false;

    if (currentUserRole === 'physician') {
      return req.physicianId === currentUserId && !req.physicianReviewSubmitted;
    } else {
      return req.facilityId === currentUserId && !req.facilityReviewSubmitted;
    }
  });

  const handleOpenReviewModal = (request: ReviewRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleDismiss = (requestId: string) => {
    setDismissedRequests([...dismissedRequests, requestId]);
  };

  const handleReviewSubmit = () => {
    if (selectedRequest) {
      onReviewSubmitted(selectedRequest.id);
      setShowModal(false);
      setSelectedRequest(null);
      handleDismiss(selectedRequest.id);
    }
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (pendingRequests.length === 0) return null;

  return (
    <>
      {/* Notification Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg shadow-lg mb-6">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full flex-shrink-0">
              <i className="ri-star-line text-2xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">
                {pendingRequests.length === 1
                  ? 'You have a pending review request'
                  : `You have ${pendingRequests.length} pending review requests`}
              </h3>
              <p className="text-teal-50 mb-4">
                Share your experience to help build trust in our community
              </p>

              {/* Review Request Cards */}
              <div className="space-y-3">
                {pendingRequests.map((request) => {
                  const daysRemaining = getDaysRemaining(request.expiresAt);
                  const isUrgent = daysRemaining <= 3;
                  const revieweeName =
                    currentUserRole === 'physician'
                      ? request.facilityName
                      : request.physicianName;

                  return (
                    <div
                      key={request.id}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{revieweeName}</h4>
                          <p className="text-sm text-teal-50">
                            Assignment ID: {request.assignmentId}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <i className="ri-time-line text-sm"></i>
                            <span className="text-sm">
                              {isUrgent ? (
                                <span className="font-semibold">
                                  {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                                </span>
                              ) : (
                                `${daysRemaining} days remaining`
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenReviewModal(request)}
                            className="px-4 py-2 bg-white text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors whitespace-nowrap"
                          >
                            Leave Review
                          </button>
                          <button
                            onClick={() => handleDismiss(request.id)}
                            className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap"
                          >
                            <i className="ri-close-line text-xl"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      {selectedRequest && (
        <ReviewSubmissionModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedRequest(null);
          }}
          assignmentId={selectedRequest.assignmentId}
          reviewerId={currentUserId}
          reviewerName={
            currentUserRole === 'physician'
              ? selectedRequest.physicianName
              : selectedRequest.facilityName
          }
          reviewerRole={currentUserRole}
          revieweeId={
            currentUserRole === 'physician'
              ? selectedRequest.facilityId
              : selectedRequest.physicianId
          }
          revieweeName={
            currentUserRole === 'physician'
              ? selectedRequest.facilityName
              : selectedRequest.physicianName
          }
          revieweeRole={currentUserRole === 'physician' ? 'facility' : 'physician'}
          onSubmit={handleReviewSubmit}
        />
      )}
    </>
  );
};

export default ReviewRequestNotification;