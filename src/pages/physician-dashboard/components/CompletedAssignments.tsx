import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';

interface CompletedAssignment {
  id: string;
  facilityName: string;
  location: string;
  position: string;
  dateRange: string;
  completedDate: string;
  pay: string;
  paymentStatus: 'pending' | 'paid';
  invoiceUploaded: boolean;
  facilityFeedback: string | null;
  messages: Message[];
}

interface Message {
  id: string;
  sender: 'facility' | 'physician';
  senderName: string;
  content: string;
  timestamp: string;
  type: 'message' | 'document_request' | 'clarification';
}

export function CompletedAssignments() {
  const [assignments, setAssignments] = useState<CompletedAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<CompletedAssignment | null>(null);

  useEffect(() => {
    fetchCompletedAssignments();
  }, []);

  const fetchCompletedAssignments = async () => {
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

      // TODO: Fetch completed assignments from your database when table is created
      // const { data, error } = await supabase
      //   .from('completed_assignments')
      //   .select('*')
      //   .eq('physician_id', profile.id)
      //   .order('completed_date', { ascending: false });

      setAssignments([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching completed assignments:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (assignment: CompletedAssignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  const handleUploadInvoice = (id: string) => {
    // Simulate invoice upload
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx';
    fileInput.onchange = () => {
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === id ? { ...assignment, invoiceUploaded: true } : assignment
        )
      );
      alert('Invoice uploaded successfully!');
    };
    fileInput.click();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <i className="ri-loader-4-line text-4xl text-teal-600 animate-spin"></i>
        <p className="mt-4 text-gray-600">Loading completed assignments...</p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-check-double-line text-3xl text-gray-400"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Assignments</h3>
        <p className="text-gray-600">Your completed assignments will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-check-double-line text-green-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-green-700">Total Completed</p>
                <p className="text-2xl font-bold text-green-900">{assignments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-teal-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-teal-700">Total Earned</p>
                <p className="text-2xl font-bold text-teal-900">
                  ${assignments.reduce((sum, a) => sum + parseInt(a.pay.replace(/[$,]/g, '')), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-text-line text-orange-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-orange-700">Pending Invoices</p>
                <p className="text-2xl font-bold text-orange-900">
                  {assignments.filter((a) => !a.invoiceUploaded).length}
                </p>
              </div>
            </div>
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
                      assignment.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {assignment.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                  </span>
                  {!assignment.invoiceUploaded && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      Invoice Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {assignment.facilityName} • {assignment.location}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <i className="ri-calendar-line"></i>
                    <span>{assignment.dateRange}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-calendar-check-line"></i>
                    <span>
                      Completed {new Date(assignment.completedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-teal-600">
                    <i className="ri-money-dollar-circle-line"></i>
                    <span>{assignment.pay}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleViewDetails(assignment)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                View Details
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              {!assignment.invoiceUploaded && (
                <button
                  onClick={() => handleUploadInvoice(assignment.id)}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <i className="ri-upload-line"></i>
                  Upload Invoice
                </button>
              )}
              {assignment.messages.length > 0 && (
                <button
                  onClick={() => handleViewDetails(assignment)}
                  className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  <i className="ri-message-3-line"></i>
                  {assignment.messages.length} Message{assignment.messages.length > 1 ? 's' : ''}
                </button>
              )}
            </div>

            {/* Facility Feedback */}
            {assignment.facilityFeedback && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                <i className="ri-star-fill text-green-600 mt-0.5"></i>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-green-900 mb-1">Facility Feedback</p>
                  <p className="text-sm text-green-800">{assignment.facilityFeedback}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Assignment Details Modal */}
      {showDetailsModal && selectedAssignment && (
        <CompletedAssignmentModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAssignment(null);
          }}
          onUploadInvoice={handleUploadInvoice}
        />
      )}
    </>
  );
}

// Completed Assignment Details Modal
interface CompletedAssignmentModalProps {
  assignment: CompletedAssignment;
  onClose: () => void;
  onUploadInvoice: (id: string) => void;
}

function CompletedAssignmentModal({ assignment, onClose, onUploadInvoice }: CompletedAssignmentModalProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    alert('Message sent to facility!');
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Completed Assignment Details</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Assignment Summary */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{assignment.position}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Facility</p>
                <p className="font-medium text-gray-900">{assignment.facilityName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-900">{assignment.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Assignment Dates</p>
                <p className="font-medium text-gray-900">{assignment.dateRange}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Compensation</p>
                <p className="font-medium text-teal-600 text-lg">{assignment.pay}</p>
              </div>
            </div>
          </div>

          {/* Payment & Invoice Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-gray-900 mb-3">Payment Status</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Payment Status:</span>
                <span
                  className={`font-medium ${
                    assignment.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'
                  }`}
                >
                  {assignment.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Invoice Status:</span>
                <span
                  className={`font-medium ${
                    assignment.invoiceUploaded ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {assignment.invoiceUploaded ? 'Uploaded' : 'Required'}
                </span>
              </div>
            </div>
            {!assignment.invoiceUploaded && (
              <button
                onClick={() => onUploadInvoice(assignment.id)}
                className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <i className="ri-upload-line"></i>
                Upload Invoice
              </button>
            )}
          </div>

          {/* Facility Feedback */}
          {assignment.facilityFeedback && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <i className="ri-star-fill text-green-600 text-xl mt-0.5"></i>
                <div>
                  <h5 className="text-sm font-semibold text-green-900 mb-1">Facility Feedback</h5>
                  <p className="text-sm text-green-800">{assignment.facilityFeedback}</p>
                </div>
              </div>
            </div>
          )}

          {/* Message History */}
          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-3">Communication History</h5>
            {assignment.messages.length > 0 ? (
              <div className="space-y-3 mb-4">
                {assignment.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.sender === 'physician' ? 'bg-teal-50 ml-8' : 'bg-gray-50 mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-900">{message.senderName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {message.type === 'document_request' && (
                      <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded mb-1">
                        Document Request
                      </span>
                    )}
                    <p className="text-sm text-gray-700">{message.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No messages yet.</p>
            )}

            {/* Send Message */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message to the facility..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
