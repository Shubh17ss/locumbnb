import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';

interface InvitedAssignment {
  id: string;
  facilityName: string;
  location: string;
  position: string;
  dateRange: string;
  pay: string;
  status: 'invited' | 'accepted_pending_signature' | 'fully_executed';
  invitedDate: string;
  documentsRequired: string[];
  documentsSigned: string[];
}

export function InvitedAssignments() {
  const [assignments, setAssignments] = useState<InvitedAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<InvitedAssignment | null>(null);

  useEffect(() => {
    fetchInvitedAssignments();
  }, []);

  const fetchInvitedAssignments = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setLoading(false);
        return;
      }

      // Get physician profile
      const { data: profile } = await supabase
        .from('physician_profiles')
        .select('id')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (!profile) {
        setLoading(false);
        return;
      }

      // TODO: Fetch invited assignments from your database
      // This is where you'll query your assignments table for invitations
      // const { data, error } = await supabase
      //   .from('assignments')
      //   .select('*')
      //   .eq('physician_id', profile.id)
      //   .in('status', ['invited', 'accepted_pending_signature'])
      //   .order('invited_date', { ascending: false });

      // For now, set empty array until you have real data
      setAssignments([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invited assignments:', error);
      setLoading(false);
    }
  };

  const handleReviewDocuments = (assignment: InvitedAssignment) => {
    setSelectedAssignment(assignment);
    setShowSigningModal(true);
  };

  const handleAcceptInvitation = async (id: string) => {
    try {
      // TODO: Update assignment status in database
      // await supabase
      //   .from('assignments')
      //   .update({ status: 'accepted_pending_signature' })
      //   .eq('id', id);

      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === id
            ? { ...assignment, status: 'accepted_pending_signature' as const }
            : assignment
        )
      );
    } catch (error) {
      console.error('Error accepting invitation:', error);
      alert('Failed to accept invitation. Please try again.');
    }
  };

  const handleDeclineInvitation = async (id: string) => {
    if (!confirm('Are you sure you want to decline this invitation?')) {
      return;
    }

    try {
      // TODO: Update assignment status in database
      // await supabase
      //   .from('assignments')
      //   .update({ status: 'declined' })
      //   .eq('id', id);

      setAssignments((prev) => prev.filter((assignment) => assignment.id !== id));
    } catch (error) {
      console.error('Error declining invitation:', error);
      alert('Failed to decline invitation. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <i className="ri-loader-4-line text-4xl text-teal-600 animate-spin"></i>
        <p className="mt-4 text-gray-600">Loading invited assignments...</p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-checkbox-circle-line text-3xl text-gray-400"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Invited Assignments</h3>
        <p className="text-gray-600">You don't have any facility invitations at this time.</p>
        <p className="text-sm text-gray-500 mt-2">
          When facilities approve your applications, they'll appear here for you to review and accept.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-checkbox-circle-line text-green-600"></i>
          </div>
          <div className="flex-1">
            <p className="text-sm text-green-900">
              <strong>Congratulations!</strong> These facilities have approved your application. 
              Review and sign the required documents to confirm your assignment.
            </p>
          </div>
        </div>

        {/* Assignments List */}
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="border border-gray-200 rounded-lg p-5 hover:border-teal-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{assignment.position}</h4>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      assignment.status === 'invited'
                        ? 'bg-green-100 text-green-700'
                        : assignment.status === 'accepted_pending_signature'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {assignment.status === 'invited'
                      ? 'Invited'
                      : assignment.status === 'accepted_pending_signature'
                      ? 'Pending Signature'
                      : 'Fully Executed'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {assignment.facilityName} • {assignment.location}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <i className="ri-calendar-line"></i>
                    <span>{assignment.dateRange}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-teal-600">
                    <i className="ri-money-dollar-circle-line"></i>
                    <span>{assignment.pay}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Status */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h5 className="text-sm font-semibold text-gray-900 mb-3">Required Documents</h5>
              <div className="space-y-2">
                {assignment.documentsRequired.map((doc) => {
                  const isSigned = assignment.documentsSigned.includes(doc);
                  return (
                    <div key={doc} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{doc}</span>
                      {isSigned ? (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <i className="ri-check-line"></i>
                          Signed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-600 font-medium">
                          <i className="ri-time-line"></i>
                          Pending
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {assignment.status === 'invited' && (
                <>
                  <button
                    onClick={() => handleAcceptInvitation(assignment.id)}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Accept Invitation
                  </button>
                  <button
                    onClick={() => handleDeclineInvitation(assignment.id)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    Decline
                  </button>
                </>
              )}
              {assignment.status === 'accepted_pending_signature' && (
                <button
                  onClick={() => handleReviewDocuments(assignment)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <i className="ri-file-text-line"></i>
                  Review & Sign Documents
                </button>
              )}
            </div>

            {/* Invitation Details */}
            <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
              <i className="ri-information-line mt-0.5"></i>
              <p>
                Invited on {new Date(assignment.invitedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}. 
                Both you and the facility must sign all documents to finalize the assignment.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Document Signing Modal */}
      {showSigningModal && selectedAssignment && (
        <DocumentSigningModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowSigningModal(false);
            setSelectedAssignment(null);
          }}
          onComplete={(id: string, signedDocs: string[]) => {
            setAssignments((prev) =>
              prev.map((assignment) =>
                assignment.id === id
                  ? { ...assignment, documentsSigned: signedDocs }
                  : assignment
              )
            );
            setShowSigningModal(false);
            setSelectedAssignment(null);
          }}
        />
      )}
    </>
  );
}

// Document Signing Modal Component
interface DocumentSigningModalProps {
  assignment: InvitedAssignment;
  onClose: () => void;
  onComplete: (id: string, signedDocs: string[]) => void;
}

function DocumentSigningModal({ assignment, onClose, onComplete }: DocumentSigningModalProps) {
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [signature, setSignature] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [signedDocuments, setSignedDocuments] = useState<string[]>([...assignment.documentsSigned]);

  const currentDoc = assignment.documentsRequired[currentDocIndex];
  const isLastDoc = currentDocIndex === assignment.documentsRequired.length - 1;
  const isCurrentDocSigned = signedDocuments.includes(currentDoc);

  const handleSign = async () => {
    if (!signature.trim() || !agreed) {
      alert('Please enter your full legal name and agree to the terms.');
      return;
    }

    try {
      // TODO: Submit signature to database
      // await supabase
      //   .from('document_signatures')
      //   .insert({
      //     assignment_id: assignment.id,
      //     document_name: currentDoc,
      //     signature: signature,
      //     signed_at: new Date().toISOString()
      //   });

      const updatedSigned = [...signedDocuments, currentDoc];
      setSignedDocuments(updatedSigned);
      setSignature('');
      setAgreed(false);

      if (isLastDoc) {
        onComplete(assignment.id, updatedSigned);
      } else {
        setCurrentDocIndex(currentDocIndex + 1);
      }
    } catch (error) {
      console.error('Error signing document:', error);
      alert('Failed to sign document. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">Review & Sign Documents</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Document {currentDocIndex + 1} of {assignment.documentsRequired.length}
          </p>
        </div>

        <div className="p-6">
          {/* Document Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{currentDoc}</h4>
            <div className="prose prose-sm max-w-none text-gray-700 space-y-3">
              <p>
                Document preview will be displayed here. In production, this would show the actual 
                document content or embed a PDF viewer.
              </p>
              <p>
                <strong>Assignment Details:</strong>
              </p>
              <ul>
                <li>Position: {assignment.position}</li>
                <li>Facility: {assignment.facilityName}</li>
                <li>Dates: {assignment.dateRange}</li>
                <li>Compensation: {assignment.pay}</li>
              </ul>
            </div>
          </div>

          {/* Signature Section */}
          {!isCurrentDocSigned && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type your full legal name to sign
                </label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Your Full Legal Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="agree" className="text-sm text-gray-700">
                  I have reviewed this document and agree to its terms. I understand this is a legally binding signature.
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSign}
                  disabled={!signature.trim() || !agreed}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {isLastDoc ? 'Sign & Complete' : 'Sign & Continue'}
                </button>
                {!isLastDoc && (
                  <button
                    onClick={() => setCurrentDocIndex(currentDocIndex + 1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    Skip for Now
                  </button>
                )}
              </div>
            </div>
          )}

          {isCurrentDocSigned && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <i className="ri-check-circle-fill text-green-600 text-xl"></i>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">Document Signed</p>
                <p className="text-xs text-green-700">This document has been signed and submitted.</p>
              </div>
              {!isLastDoc && (
                <button
                  onClick={() => setCurrentDocIndex(currentDocIndex + 1)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Next Document
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}