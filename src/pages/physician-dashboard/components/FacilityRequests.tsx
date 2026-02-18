import React, { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabaseClient";

interface FacilityRequest {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  facilityName: string;
  requestType: "clarification" | "document" | "information";
  subject: string;
  message: string;
  requestedDocuments?: string[];
  status: "pending" | "responded" | "resolved";
  createdAt: string;
  responses: RequestResponse[];
}

interface RequestResponse {
  id: string;
  sender: "physician" | "facility";
  message: string;
  attachments?: string[];
  timestamp: string;
}

/**
 * FacilityRequests component
 *
 * - Displays a list of facility requests.
 * - Allows filtering by status.
 * - Shows a detailed thread for the selected request.
 * - Enables the physician to reply with optional file attachments.
 *
 * The component now includes:
 *   • Proper TypeScript generic syntax (`useState<FacilityRequest[]>`).
 *   • Minimal error‑handling for file uploads and reply submission.
 *   • Defensive checks to avoid runtime crashes (e.g., missing timestamps).
 */
export const FacilityRequests: React.FC = () => {
  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------
  const [requests, setRequests] = useState<FacilityRequest[]>([]);

  const [selectedRequest, setSelectedRequest] = useState<FacilityRequest | null>(
    null
  );
  const [replyMessage, setReplyMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "responded" | "resolved"
  >("all");

  // -------------------------------------------------------------------------
  // Fetch facility requests from Supabase
  // -------------------------------------------------------------------------
  useEffect(() => {
    const fetchRequests = async () => {
      // TODO: Replace with actual Supabase query when table is created
      // const { data, error } = await supabase
      //   .from('facility_requests')
      //   .select('*')
      //   .order('created_at', { ascending: false });
      
      // if (data) {
      //   setRequests(data);
      // }
    };

    fetchRequests();
  }, []);

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  const formatTimestamp = (timestamp: string): string => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getRequestTypeIcon = (type: string): string => {
    switch (type) {
      case "clarification":
        return "ri-question-line";
      case "document":
        return "ri-file-text-line";
      case "information":
        return "ri-information-line";
      default:
        return "ri-mail-line";
    }
  };

  const getRequestTypeColor = (type: string): string => {
    switch (type) {
      case "clarification":
        return "bg-blue-100 text-blue-700";
      case "document":
        return "bg-purple-100 text-purple-700";
      case "information":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
            Pending Response
          </span>
        );
      case "responded":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            Responded
          </span>
        );
      case "resolved":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  // -------------------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSendReply = () => {
    if (!selectedRequest || !replyMessage.trim()) return;

    const newResponse: RequestResponse = {
      id: `resp-${Date.now()}`,
      sender: "physician",
      message: replyMessage,
      attachments: uploadedFiles.map((f) => f.name),
      timestamp: new Date().toISOString(),
    };

    // Update the master list
    setRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: "responded",
              responses: [...req.responses, newResponse],
            }
          : req
      )
    );

    // Update the selected request (keeps UI in sync)
    setSelectedRequest((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: "responded",
        responses: [...prev.responses, newResponse],
      };
    });

    // Reset form
    setReplyMessage("");
    setUploadedFiles([]);
  };

  // -------------------------------------------------------------------------
  // Derived data
  // -------------------------------------------------------------------------
  const filteredRequests = requests.filter((req) =>
    filterStatus === "all" ? true : req.status === filterStatus
  );

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Facility Requests</h2>
          <p className="text-sm text-gray-600 mt-1">
            Respond to facility clarifications and document requests
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="px-4 py-2 bg-yellow-100 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">
              <i className="ri-alert-line mr-2"></i>
              {pendingCount} pending {pendingCount === 1 ? "request" : "requests"}
            </p>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        {(["all", "pending", "responded", "resolved"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              filterStatus === status
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== "all" && (
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {requests.filter((r) => r.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-mail-check-line text-gray-400 text-3xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No requests found
          </h3>
          <p className="text-sm text-gray-600">
            {filterStatus === "all"
              ? "You have no facility requests at this time."
              : `You have no ${filterStatus} requests.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Cards */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className={`bg-white rounded-lg border p-4 cursor-pointer transition-all ${
                  selectedRequest?.id === request.id
                    ? "border-teal-300 shadow-md"
                    : "border-gray-200 hover:border-teal-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getRequestTypeColor(
                        request.requestType
                      )}`}
                    >
                      <i className={`${getRequestTypeIcon(request.requestType)} text-lg`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {request.subject}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.facilityName} • {request.assignmentTitle}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {request.message}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                {request.requestedDocuments?.length && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Requested Documents:
                    </p>
                    <ul className="space-y-1">
                      {request.requestedDocuments.map((doc, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-gray-600 flex items-center gap-2"
                        >
                          <i className="ri-file-line text-gray-400"></i>
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    <i className="ri-time-line mr-1"></i>
                    {formatTimestamp(request.createdAt)}
                  </span>
                  {request.responses.length > 0 && (
                    <span>
                      <i className="ri-message-3-line mr-1"></i>
                      {request.responses.length}{" "}
                      {request.responses.length === 1 ? "reply" : "replies"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Thread */}
          {selectedRequest ? (
            <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-[600px] sticky top-4">
              {/* Thread Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {selectedRequest.subject}
                  </h3>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <p className="text-sm text-gray-600">
                  {selectedRequest.facilityName} • {selectedRequest.assignmentTitle}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Initial Request */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-building-line text-gray-600 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {selectedRequest.facilityName}
                      </p>
                      <p className="text-sm text-gray-700">
                        {selectedRequest.message}
                      </p>

                      {selectedRequest.requestedDocuments?.length && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-700 mb-2">
                            Requested Documents:
                          </p>
                          <ul className="space-y-1">
                            {selectedRequest.requestedDocuments.map((doc, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-gray-600 flex items-center gap-2"
                              >
                                <i className="ri-file-line text-gray-400"></i>
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(selectedRequest.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Responses */}
                {selectedRequest.responses.map((response) => (
                  <div
                    key={response.id}
                    className={`flex gap-3 ${
                      response.sender === "physician" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        response.sender === "physician"
                          ? "bg-teal-100"
                          : "bg-gray-200"
                      }`}
                    >
                      <i
                        className={`${
                          response.sender === "physician"
                            ? "ri-user-line text-teal-600"
                            : "ri-building-line text-gray-600"
                        } text-sm`}
                      ></i>
                    </div>
                    <div className="flex-1">
                      <div
                        className={`rounded-lg p-3 ${
                          response.sender === "physician"
                            ? "bg-teal-50"
                            : "bg-gray-50"
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {response.sender === "physician"
                            ? "You"
                            : selectedRequest.facilityName}
                        </p>
                        <p className="text-sm text-gray-700">{response.message}</p>

                        {response.attachments?.length && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              Attachments:
                            </p>
                            <div className="space-y-1">
                              {response.attachments.map((file, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-xs text-gray-600"
                                >
                                  <i className="ri-attachment-line text-gray-400"></i>
                                  {file}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-xs text-gray-500 mt-1 ${
                          response.sender === "physician" ? "text-right" : ""
                        }`}
                      >
                        {formatTimestamp(response.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              {selectedRequest.status !== "resolved" && (
                <div className="p-4 border-t border-gray-200">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  ></textarea>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Attached Files:
                      </p>
                      <div className="space-y-1">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs text-gray-600"
                          >
                            <span>
                              <i className="ri-file-line mr-1"></i>
                              {file.name}
                            </span>
                            <button
                              onClick={() =>
                                setUploadedFiles((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                )
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <span className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                        <i className="ri-attachment-line mr-1"></i>
                        Attach Files
                      </span>
                    </label>
                    <button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim()}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                        replyMessage.trim()
                          ? "bg-teal-600 text-white hover:bg-teal-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <i className="ri-send-plane-fill mr-2"></i>
                      Send Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 flex items-center justify-center h-[600px] sticky top-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-message-3-line text-gray-400 text-3xl"></i>
                </div>
                <p className="text-sm text-gray-600">
                  Select a request to view the conversation
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
