import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';

interface UpcomingAssignment {
  id: string;
  facilityName: string;
  location: string;
  position: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  pay: string;
  status: 'confirmed' | 'in_progress';
  facilityContact: {
    name: string;
    email: string;
    phone: string;
  };
  address: string;
  notes: string;
}

export function UpcomingAssignments() {
  const [assignments, setAssignments] = useState<UpcomingAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<UpcomingAssignment | null>(null);

  useEffect(() => {
    fetchUpcomingAssignments();
  }, []);

  const fetchUpcomingAssignments = async () => {
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

      // Fetch confirmed assignments from database
      const { data, error } = await supabase
        .from('confirmed_assignments')
        .select('*')
        .eq('physician_id', profile.id)
        .gte('end_date', new Date().toISOString().split('T')[0])
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching assignments:', error);
        setLoading(false);
        return;
      }

      // Transform data to match interface
      const transformedAssignments: UpcomingAssignment[] = (data || []).map((item: any) => ({
        id: item.id,
        facilityName: item.facility_name || 'Unknown Facility',
        location: item.location || '',
        position: item.position || '',
        dateRange: `${new Date(item.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${new Date(item.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        startDate: item.start_date,
        endDate: item.end_date,
        pay: item.pay || '$0',
        status: item.status || 'confirmed',
        facilityContact: item.facility_contact || { name: '', email: '', phone: '' },
        address: item.address || '',
        notes: item.notes || '',
      }));

      setAssignments(transformedAssignments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching upcoming assignments:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (assignment: UpcomingAssignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  const getDaysUntilStart = (startDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <i className="ri-loader-4-line text-4xl text-teal-600 animate-spin"></i>
        <p className="mt-4 text-gray-600">Loading upcoming assignments...</p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-calendar-check-line text-3xl text-gray-400"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Assignments</h3>
        <p className="text-gray-600">You don't have any confirmed assignments scheduled.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-calendar-check-line text-purple-600"></i>
          </div>
          <div className="flex-1">
            <p className="text-sm text-purple-900">
              <strong>Confirmed Assignments:</strong> These dates are locked in your calendar and cannot be double-booked. 
              Contact the facility directly if you need to make changes.
            </p>
          </div>
        </div>

        {/* Assignments List */}
        {assignments.map((assignment) => {
          const daysUntil = getDaysUntilStart(assignment.startDate);
          const isStartingSoon = daysUntil <= 7 && daysUntil > 0;

          return (
            <div
              key={assignment.id}
              className="border border-gray-200 rounded-lg p-5 hover:border-teal-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{assignment.position}</h4>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                      Confirmed
                    </span>
                    {isStartingSoon && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                        Starting Soon
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
                    <div className="flex items-center gap-1 font-semibold text-teal-600">
                      <i className="ri-money-dollar-circle-line"></i>
                      <span>{assignment.pay}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetails(assignment)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                >
                  View Details
                </button>
              </div>

              {/* Quick Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <i className="ri-time-line text-gray-400 mt-0.5"></i>
                  <div className="flex-1">
                    <span className="text-gray-600">Starts in: </span>
                    <span className="font-medium text-gray-900">
                      {daysUntil > 0 ? `${daysUntil} days` : daysUntil === 0 ? 'Today' : 'In progress'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <i className="ri-map-pin-line text-gray-400 mt-0.5"></i>
                  <div className="flex-1">
                    <span className="text-gray-600">Location: </span>
                    <span className="font-medium text-gray-900">{assignment.address}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <i className="ri-user-line text-gray-400 mt-0.5"></i>
                  <div className="flex-1">
                    <span className="text-gray-600">Contact: </span>
                    <span className="font-medium text-gray-900">{assignment.facilityContact.name}</span>
                  </div>
                </div>
              </div>

              {/* Calendar Lock Notice */}
              <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
                <i className="ri-lock-line mt-0.5"></i>
                <p>
                  These dates are locked in your calendar. To make changes, please contact the facility directly.
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assignment Details Modal */}
      {showDetailsModal && selectedAssignment && (
        <AssignmentDetailsModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAssignment(null);
          }}
        />
      )}
    </>
  );
}

// Assignment Details Modal Component
interface AssignmentDetailsModalProps {
  assignment: UpcomingAssignment;
  onClose: () => void;
}

function AssignmentDetailsModal({ assignment, onClose }: AssignmentDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Assignment Details</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Assignment Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{assignment.position}</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <i className="ri-building-line text-gray-400 mt-1"></i>
                <div>
                  <p className="text-sm text-gray-600">Facility</p>
                  <p className="font-medium text-gray-900">{assignment.facilityName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <i className="ri-map-pin-line text-gray-400 mt-1"></i>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">{assignment.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <i className="ri-calendar-line text-gray-400 mt-1"></i>
                <div>
                  <p className="text-sm text-gray-600">Assignment Dates</p>
                  <p className="font-medium text-gray-900">{assignment.dateRange}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <i className="ri-money-dollar-circle-line text-gray-400 mt-1"></i>
                <div>
                  <p className="text-sm text-gray-600">Compensation</p>
                  <p className="font-medium text-teal-600 text-lg">{assignment.pay}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Facility Contact */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-gray-900 mb-3">Facility Contact</h5>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <i className="ri-user-line text-gray-400"></i>
                <span className="text-gray-900">{assignment.facilityContact.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <i className="ri-mail-line text-gray-400"></i>
                <a
                  href={`mailto:${assignment.facilityContact.email}`}
                  className="text-teal-600 hover:text-teal-700"
                >
                  {assignment.facilityContact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <i className="ri-phone-line text-gray-400"></i>
                <a
                  href={`tel:${assignment.facilityContact.phone}`}
                  className="text-teal-600 hover:text-teal-700"
                >
                  {assignment.facilityContact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Special Notes */}
          {assignment.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <i className="ri-information-line text-blue-600 mt-0.5"></i>
                <div>
                  <h5 className="text-sm font-semibold text-blue-900 mb-1">Important Notes</h5>
                  <p className="text-sm text-blue-800">{assignment.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors whitespace-nowrap">
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
