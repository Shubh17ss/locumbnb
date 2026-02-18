import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../utils/supabaseClient';

interface CalendarEvent {
  id: string;
  startDate: Date;
  endDate: Date;
  blockType: 'assignment' | 'personal_block' | 'travel_buffer' | 'available';
  visibility: 'private' | 'public';
  assignmentId?: string;
  facilityName?: string;
  assignmentTitle?: string;
  notes?: string;
  isBufferDay?: boolean;
}

interface PhysicianCalendarProps {
  physicianId: string;
}

export default function PhysicianCalendar({ physicianId }: PhysicianCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [blockForm, setBlockForm] = useState({
    startDate: '',
    endDate: '',
    blockType: 'personal_block' as 'personal_block' | 'available',
    visibility: 'private' as 'private' | 'public',
    notes: ''
  });
  const [saving, setSaving] = useState(false);

  // Fetch calendar events
  useEffect(() => {
    fetchCalendarEvents();
  }, [physicianId]);

  const fetchCalendarEvents = async () => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

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

      // Fetch calendar entries
      const { data: calendarData, error } = await supabase
        .from('physician_calendar')
        .select('*')
        .eq('physician_id', profile.id)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching calendar:', error);
        setLoading(false);
        return;
      }

      const mappedEvents: CalendarEvent[] = (calendarData || []).map(item => ({
        id: item.id,
        startDate: new Date(item.start_date),
        endDate: new Date(item.end_date),
        blockType: item.block_type,
        visibility: item.visibility,
        assignmentId: item.assignment_id,
        facilityName: item.facility_name,
        assignmentTitle: item.assignment_title,
        notes: item.notes,
        isBufferDay: item.is_buffer_day
      }));

      setEvents(mappedEvents);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get events for a specific date - MOVED BEFORE useMemo
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(23, 59, 59, 999);
      const checkDate = new Date(date);
      checkDate.setHours(12, 0, 0, 0);
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: { date: Date; isCurrentMonth: boolean; events: CalendarEvent[] }[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date, isCurrentMonth: false, events: getEventsForDate(date) });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true, events: getEventsForDate(date) });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false, events: getEventsForDate(date) });
    }

    return days;
  }, [currentDate, events]);

  // Get color for event type (for event tags)
  const getEventColor = (event: CalendarEvent) => {
    if (event.blockType === 'assignment') {
      return 'bg-teal-500 text-white';
    }
    if (event.blockType === 'travel_buffer') {
      return 'bg-amber-400 text-amber-900';
    }
    if (event.blockType === 'personal_block') {
      return 'bg-red-400 text-white';
    }
    if (event.blockType === 'available') {
      return event.visibility === 'public' ? 'bg-green-500 text-white' : 'bg-green-200 text-green-800';
    }
    return 'bg-gray-300 text-gray-800';
  };

  // Get background color for calendar day cell based on highest priority event
  const getDayBackgroundColor = (dayEvents: CalendarEvent[]) => {
    if (dayEvents.length === 0) return '';
    
    // Priority order: assignment > personal_block > travel_buffer > available
    const hasAssignment = dayEvents.some(e => e.blockType === 'assignment');
    const hasPersonalBlock = dayEvents.some(e => e.blockType === 'personal_block');
    const hasTravelBuffer = dayEvents.some(e => e.blockType === 'travel_buffer');
    const hasAvailablePublic = dayEvents.some(e => e.blockType === 'available' && e.visibility === 'public');
    const hasAvailablePrivate = dayEvents.some(e => e.blockType === 'available' && e.visibility === 'private');
    
    if (hasAssignment) {
      return 'bg-teal-100 border-l-4 border-teal-500';
    }
    if (hasPersonalBlock) {
      return 'bg-red-100 border-l-4 border-red-500';
    }
    if (hasTravelBuffer) {
      return 'bg-amber-100 border-l-4 border-amber-500';
    }
    if (hasAvailablePublic) {
      return 'bg-green-100 border-l-4 border-green-500';
    }
    if (hasAvailablePrivate) {
      return 'bg-green-50 border-l-4 border-green-300';
    }
    
    return '';
  };

  // Handle date click
  const handleDateClick = (date: Date, dayEvents: CalendarEvent[]) => {
    setSelectedDate(date);
    if (dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0]);
      setShowEventDetails(true);
    } else {
      // Open block modal for empty dates
      const dateStr = date.toISOString().split('T')[0];
      setBlockForm({
        startDate: dateStr,
        endDate: dateStr,
        blockType: 'personal_block',
        visibility: 'private',
        notes: ''
      });
      setShowBlockModal(true);
    }
  };

  // Save calendar block
  const handleSaveBlock = async () => {
    setSaving(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: profile } = await supabase
        .from('physician_profiles')
        .select('id')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (!profile) return;

      const { error } = await supabase
        .from('physician_calendar')
        .insert({
          physician_id: profile.id,
          start_date: blockForm.startDate,
          end_date: blockForm.endDate,
          block_type: blockForm.blockType,
          visibility: blockForm.visibility,
          notes: blockForm.notes
        });

      if (error) {
        console.error('Error saving block:', error);
        return;
      }

      await fetchCalendarEvents();
      setShowBlockModal(false);
      setBlockForm({
        startDate: '',
        endDate: '',
        blockType: 'personal_block',
        visibility: 'private',
        notes: ''
      });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Delete calendar block
  const handleDeleteBlock = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('physician_calendar')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting block:', error);
        return;
      }

      await fetchCalendarEvents();
      setShowEventDetails(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Toggle visibility
  const handleToggleVisibility = async (eventId: string, currentVisibility: string) => {
    try {
      const newVisibility = currentVisibility === 'private' ? 'public' : 'private';
      const { error } = await supabase
        .from('physician_calendar')
        .update({ visibility: newVisibility })
        .eq('id', eventId);

      if (error) {
        console.error('Error updating visibility:', error);
        return;
      }

      await fetchCalendarEvents();
      if (selectedEvent) {
        setSelectedEvent({ ...selectedEvent, visibility: newVisibility as 'private' | 'public' });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <i className="ri-loader-4-line text-4xl text-teal-600 animate-spin"></i>
        <p className="mt-4 text-gray-600">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Calendar</h2>
          <p className="text-gray-600 mt-1">Manage your assignments and availability</p>
        </div>
        <button
          onClick={() => {
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0];
            setBlockForm({
              startDate: dateStr,
              endDate: dateStr,
              blockType: 'personal_block',
              visibility: 'private',
              notes: ''
            });
            setShowBlockModal(true);
          }}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line"></i>
          Block Dates
        </button>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="space-y-3">
          <span className="text-sm font-semibold text-gray-900">Calendar Color Legend:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-teal-100 border-l-4 border-teal-500"></div>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Confirmed Assignment</span>
                <p className="text-xs text-gray-500">Booked shifts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-100 border-l-4 border-red-500"></div>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Personal Block</span>
                <p className="text-xs text-gray-500">Unavailable dates</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-100 border-l-4 border-amber-500"></div>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Travel Buffer</span>
                <p className="text-xs text-gray-500">Auto-added between assignments</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-100 border-l-4 border-green-500"></div>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Available (Public)</span>
                <p className="text-xs text-gray-500">Visible to facilities</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-50 border-l-4 border-green-300"></div>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Available (Private)</span>
                <p className="text-xs text-gray-500">Only visible to you</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-teal-50 ring-2 ring-inset ring-teal-400"></div>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Today</span>
                <p className="text-xs text-gray-500">Current date</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-s-line text-xl text-gray-600"></i>
            </button>
            <button
              onClick={goToNextMonth}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <i className="ri-arrow-right-s-line text-xl text-gray-600"></i>
            </button>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Today
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayBgColor = getDayBackgroundColor(day.events);
            return (
              <div
                key={index}
                onClick={() => handleDateClick(day.date, day.events)}
                className={`min-h-[100px] p-2 border-b border-r border-gray-100 cursor-pointer transition-colors hover:bg-opacity-80 ${
                  !day.isCurrentMonth ? 'bg-gray-50 opacity-60' : ''
                } ${isToday(day.date) && !dayBgColor ? 'bg-teal-50 ring-2 ring-inset ring-teal-400' : ''} ${dayBgColor}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  !day.isCurrentMonth ? 'text-gray-400' : 
                  isToday(day.date) ? 'text-teal-700 font-bold' : 'text-gray-900'
                }`}>
                  {day.date.getDate()}
                </div>
                <div className="space-y-1">
                  {day.events.slice(0, 2).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs px-2 py-1 rounded truncate ${getEventColor(event)}`}
                      title={event.assignmentTitle || event.notes || event.blockType}
                    >
                      {event.blockType === 'assignment' && event.assignmentTitle
                        ? event.assignmentTitle
                        : event.blockType === 'travel_buffer'
                        ? 'Travel Buffer'
                        : event.blockType === 'personal_block'
                        ? 'Blocked'
                        : event.blockType === 'available'
                        ? `Available ${event.visibility === 'public' ? '(Public)' : ''}`
                        : event.blockType}
                    </div>
                  ))}
                  {day.events.length > 2 && (
                    <div className="text-xs text-gray-500 px-2">
                      +{day.events.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i className="ri-notification-3-line text-teal-600"></i>
          Automatic Reminders
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <i className="ri-information-line text-xl text-blue-600 mt-0.5"></i>
            <div>
              <p className="text-sm text-blue-800 font-medium mb-2">
                Automatic reminders are sent to both you and the facility:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-center gap-2">
                  <i className="ri-checkbox-circle-fill text-blue-500"></i>
                  30 days before assignment start
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-checkbox-circle-fill text-blue-500"></i>
                  15 days before assignment start
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-checkbox-circle-fill text-blue-500"></i>
                  3 days before assignment start
                </li>
              </ul>
              <p className="text-xs text-blue-600 mt-3">
                Reminders are sent via email and dashboard notifications. All reminders are logged for compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Block Dates Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Block Dates</h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl text-gray-600"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={blockForm.startDate}
                  onChange={(e) => setBlockForm({ ...blockForm, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={blockForm.endDate}
                  onChange={(e) => setBlockForm({ ...blockForm, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Block Type</label>
                <select
                  value={blockForm.blockType}
                  onChange={(e) => setBlockForm({ ...blockForm, blockType: e.target.value as 'personal_block' | 'available' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="personal_block">Personal Block (Unavailable)</option>
                  <option value="available">Available for Work</option>
                </select>
              </div>

              {blockForm.blockType === 'available' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <select
                    value={blockForm.visibility}
                    onChange={(e) => setBlockForm({ ...blockForm, visibility: e.target.value as 'private' | 'public' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="private">Private (Only visible to you)</option>
                    <option value="public">Public (Visible to facilities)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Public availability will be shown to facilities looking for physicians.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={blockForm.notes}
                  onChange={(e) => setBlockForm({ ...blockForm, notes: e.target.value })}
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder="Add any notes about this block..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBlock}
                disabled={saving || !blockForm.startDate || !blockForm.endDate}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
              >
                {saving ? 'Saving...' : 'Save Block'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedEvent.blockType === 'assignment' ? 'Assignment Details' :
                 selectedEvent.blockType === 'travel_buffer' ? 'Travel Buffer' :
                 selectedEvent.blockType === 'personal_block' ? 'Personal Block' :
                 'Available Dates'}
              </h3>
              <button
                onClick={() => {
                  setShowEventDetails(false);
                  setSelectedEvent(null);
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl text-gray-600"></i>
              </button>
            </div>

            <div className="space-y-4">
              {selectedEvent.assignmentTitle && (
                <div>
                  <label className="text-sm text-gray-500">Assignment</label>
                  <p className="font-medium text-gray-900">{selectedEvent.assignmentTitle}</p>
                </div>
              )}

              {selectedEvent.facilityName && (
                <div>
                  <label className="text-sm text-gray-500">Facility</label>
                  <p className="font-medium text-gray-900">{selectedEvent.facilityName}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Start Date</label>
                  <p className="font-medium text-gray-900">
                    {selectedEvent.startDate.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">End Date</label>
                  <p className="font-medium text-gray-900">
                    {selectedEvent.endDate.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Type</label>
                <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEventColor(selectedEvent)}`}>
                  {selectedEvent.blockType === 'assignment' ? 'Confirmed Assignment' :
                   selectedEvent.blockType === 'travel_buffer' ? 'Travel Buffer Day' :
                   selectedEvent.blockType === 'personal_block' ? 'Personal Block' :
                   'Available for Work'}
                </p>
              </div>

              {selectedEvent.blockType === 'available' && (
                <div>
                  <label className="text-sm text-gray-500">Visibility</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedEvent.visibility === 'public' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedEvent.visibility === 'public' ? 'Public' : 'Private'}
                    </span>
                    <button
                      onClick={() => handleToggleVisibility(selectedEvent.id, selectedEvent.visibility)}
                      className="text-sm text-teal-600 hover:text-teal-700 cursor-pointer"
                    >
                      {selectedEvent.visibility === 'public' ? 'Make Private' : 'Make Public'}
                    </button>
                  </div>
                </div>
              )}

              {selectedEvent.notes && (
                <div>
                  <label className="text-sm text-gray-500">Notes</label>
                  <p className="text-gray-900">{selectedEvent.notes}</p>
                </div>
              )}

              {selectedEvent.isBufferDay && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    <i className="ri-information-line mr-1"></i>
                    This is an automatic travel buffer day to allow time between assignments.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEventDetails(false);
                  setSelectedEvent(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Close
              </button>
              {(selectedEvent.blockType === 'personal_block' || selectedEvent.blockType === 'available') && (
                <button
                  onClick={() => handleDeleteBlock(selectedEvent.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Delete Block
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}