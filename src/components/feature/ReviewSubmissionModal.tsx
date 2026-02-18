import { useState } from 'react';
import type { Review } from '../../types/review';
import { submitReview } from '../../utils/reviewManager';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'physician' | 'facility';
  revieweeId: string;
  revieweeName: string;
  revieweeRole: 'physician' | 'facility';
  onSubmit: (review: Review) => void;
}

const ReviewSubmissionModal = ({
  isOpen,
  onClose,
  assignmentId,
  reviewerId,
  reviewerName,
  reviewerRole,
  revieweeId,
  revieweeName,
  revieweeRole,
  onSubmit
}: ReviewSubmissionModalProps) => {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [visibility, setVisibility] = useState<'public' | 'anonymous'>('public');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState<string[]>(['']);
  const [cons, setCons] = useState<string[]>(['']);
  const [wouldWorkAgain, setWouldWorkAgain] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAddPro = () => {
    setPros([...pros, '']);
  };

  const handleRemovePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index));
  };

  const handleProChange = (index: number, value: string) => {
    const newPros = [...pros];
    newPros[index] = value;
    setPros(newPros);
  };

  const handleAddCon = () => {
    setCons([...cons, '']);
  };

  const handleRemoveCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index));
  };

  const handleConChange = (index: number, value: string) => {
    const newCons = [...cons];
    newCons[index] = value;
    setCons(newCons);
  };

  const handleSubmit = async () => {
    if (rating === 0 || !title || !comment || wouldWorkAgain === null) {
      alert('Please complete all required fields');
      return;
    }

    setLoading(true);

    try {
      const review = submitReview(
        assignmentId,
        reviewerId,
        reviewerName,
        reviewerRole,
        revieweeId,
        revieweeName,
        revieweeRole,
        rating,
        visibility,
        title,
        comment,
        pros.filter(p => p.trim() !== ''),
        cons.filter(c => c.trim() !== ''),
        wouldWorkAgain
      );

      onSubmit(review);
      setStep(3);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      alert('Failed to submit review. Please try again.');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setRating(0);
    setHoverRating(0);
    setVisibility('public');
    setTitle('');
    setComment('');
    setPros(['']);
    setCons(['']);
    setWouldWorkAgain(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Leave a Review</h2>
            <p className="text-sm text-slate-600 mt-1">
              Share your experience with {revieweeName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Progress Steps */}
        {step < 3 && (
          <div className="px-6 py-4 bg-slate-50 border-b">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="flex items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-slate-700">Rating</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-200 mx-4">
                <div className={`h-full bg-teal-500 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 2 ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-slate-700">Details</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Rating */}
        {step === 1 && (
          <div className="p-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                How would you rate your experience?
              </h3>
              <p className="text-sm text-slate-600">
                Your honest feedback helps others make informed decisions
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="w-12 h-12 flex items-center justify-center transition-transform hover:scale-110 whitespace-nowrap"
                >
                  <i
                    className={`text-4xl ${
                      star <= (hoverRating || rating)
                        ? 'ri-star-fill text-amber-400'
                        : 'ri-star-line text-slate-300'
                    }`}
                  ></i>
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="text-center mb-8">
                <p className="text-lg font-medium text-slate-900">
                  {rating === 5 && 'Excellent!'}
                  {rating === 4 && 'Very Good'}
                  {rating === 3 && 'Good'}
                  {rating === 2 && 'Fair'}
                  {rating === 1 && 'Poor'}
                </p>
              </div>
            )}

            {/* Visibility Toggle */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <label className="text-sm font-medium text-slate-700 mb-3 block">
                Review Visibility
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setVisibility('public')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all whitespace-nowrap ${
                    visibility === 'public'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <i className="ri-user-line text-lg"></i>
                    <span className="font-medium">Public</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Show my name</p>
                </button>
                <button
                  onClick={() => setVisibility('anonymous')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all whitespace-nowrap ${
                    visibility === 'anonymous'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <i className="ri-user-unfollow-line text-lg"></i>
                    <span className="font-medium">Anonymous</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Hide my identity</p>
                </button>
              </div>
            </div>

            {/* Would Work Again */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <label className="text-sm font-medium text-slate-700 mb-3 block">
                Would you work with {revieweeName} again? *
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setWouldWorkAgain(true)}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all whitespace-nowrap ${
                    wouldWorkAgain === true
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <i className="ri-thumb-up-line text-xl text-green-600"></i>
                  <p className="font-medium mt-1">Yes</p>
                </button>
                <button
                  onClick={() => setWouldWorkAgain(false)}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all whitespace-nowrap ${
                    wouldWorkAgain === false
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <i className="ri-thumb-down-line text-xl text-red-600"></i>
                  <p className="font-medium mt-1">No</p>
                </button>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={rating === 0 || wouldWorkAgain === null}
              className="w-full py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="p-6">
            {/* Title */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Review Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                maxLength={200}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">{title.length}/200 characters</p>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Detailed Review *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience in detail..."
                rows={5}
                maxLength={2000}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              ></textarea>
              <p className="text-xs text-slate-500 mt-1">{comment.length}/2000 characters</p>
            </div>

            {/* Pros */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                What went well? (Optional)
              </label>
              {pros.map((pro, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={pro}
                    onChange={(e) => handleProChange(index, e.target.value)}
                    placeholder="e.g., Great communication"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {pros.length > 1 && (
                    <button
                      onClick={() => handleRemovePro(index)}
                      className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  )}
                </div>
              ))}
              {pros.length < 5 && (
                <button
                  onClick={handleAddPro}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
                >
                  + Add another pro
                </button>
              )}
            </div>

            {/* Cons */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                What could be improved? (Optional)
              </label>
              {cons.map((con, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={con}
                    onChange={(e) => handleConChange(index, e.target.value)}
                    placeholder="e.g., Better scheduling"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {cons.length > 1 && (
                    <button
                      onClick={() => handleRemoveCon(index)}
                      className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  )}
                </div>
              ))}
              {cons.length < 5 && (
                <button
                  onClick={handleAddCon}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
                >
                  + Add another con
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!title || !comment || loading}
                className="flex-1 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin"></i>
                    Submitting...
                  </span>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-4">
              <i className="ri-check-line text-3xl text-green-600"></i>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Review Submitted!</h3>
            <p className="text-slate-600 mb-6">
              Thank you for sharing your feedback. Your review helps build trust in our community.
            </p>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">
                Your review will be visible on {revieweeName}'s profile shortly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmissionModal;