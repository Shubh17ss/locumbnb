
// Calendar management utilities for physician scheduling

import { supabase } from './supabaseClient';

export interface CalendarBlockData {
  physicianId: string;
  startDate: string;
  endDate: string;
  blockType: 'assignment' | 'personal_block' | 'travel_buffer' | 'available';
  visibility?: 'private' | 'public';
  assignmentId?: string;
  facilityId?: string;
  facilityName?: string;
  assignmentTitle?: string;
  notes?: string;
  isBufferDay?: boolean;
  bufferForAssignmentId?: string;
}

export interface AssignmentApprovalData {
  assignmentId: string;
  physicianId: string;
  facilityId: string;
  facilityName: string;
  assignmentTitle: string;
  specialty: string;
  startDate: string;
  endDate: string;
  payRate: number;
}

// Block dates when an assignment is approved by both parties
export async function blockDatesForApprovedAssignment(data: AssignmentApprovalData): Promise<{ success: boolean; error?: string }> {
  try {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    // Calculate buffer days (1 day before and 1 day after)
    const bufferBefore = new Date(startDate);
    bufferBefore.setDate(bufferBefore.getDate() - 1);
    
    const bufferAfter = new Date(endDate);
    bufferAfter.setDate(bufferAfter.getDate() + 1);

    // Create calendar entries for the assignment and buffer days
    const calendarEntries = [
      // Buffer day before
      {
        physician_id: data.physicianId,
        start_date: bufferBefore.toISOString().split('T')[0],
        end_date: bufferBefore.toISOString().split('T')[0],
        block_type: 'travel_buffer',
        visibility: 'private',
        assignment_id: data.assignmentId,
        facility_id: data.facilityId,
        facility_name: data.facilityName,
        assignment_title: `Travel buffer for ${data.assignmentTitle}`,
        is_buffer_day: true,
        buffer_for_assignment_id: data.assignmentId
      },
      // Main assignment dates
      {
        physician_id: data.physicianId,
        start_date: data.startDate,
        end_date: data.endDate,
        block_type: 'assignment',
        visibility: 'private',
        assignment_id: data.assignmentId,
        facility_id: data.facilityId,
        facility_name: data.facilityName,
        assignment_title: data.assignmentTitle,
        is_buffer_day: false
      },
      // Buffer day after
      {
        physician_id: data.physicianId,
        start_date: bufferAfter.toISOString().split('T')[0],
        end_date: bufferAfter.toISOString().split('T')[0],
        block_type: 'travel_buffer',
        visibility: 'private',
        assignment_id: data.assignmentId,
        facility_id: data.facilityId,
        facility_name: data.facilityName,
        assignment_title: `Travel buffer for ${data.assignmentTitle}`,
        is_buffer_day: true,
        buffer_for_assignment_id: data.assignmentId
      }
    ];

    // Insert calendar entries
    const { error: calendarError } = await supabase
      .from('physician_calendar')
      .insert(calendarEntries);

    if (calendarError) {
      console.error('Error blocking calendar dates:', calendarError);
      return { success: false, error: calendarError.message };
    }

    // Schedule automatic reminders
    await scheduleAssignmentReminders(data);

    // Update confirmed assignment record
    const { error: assignmentError } = await supabase
      .from('confirmed_assignments')
      .update({
        calendar_blocked: true,
        buffer_days_blocked: true,
        reminders_scheduled: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.assignmentId);

    if (assignmentError) {
      console.error('Error updating assignment:', assignmentError);
    }

    return { success: true };
  } catch (err) {
    console.error('Error in blockDatesForApprovedAssignment:', err);
    return { success: false, error: 'Failed to block calendar dates' };
  }
}

// Schedule automatic reminders for an assignment
export async function scheduleAssignmentReminders(data: AssignmentApprovalData): Promise<{ success: boolean; error?: string }> {
  try {
    const startDate = new Date(data.startDate);
    
    // Calculate reminder dates: 30 days, 15 days, 3 days before
    const reminder30Days = new Date(startDate);
    reminder30Days.setDate(reminder30Days.getDate() - 30);
    
    const reminder15Days = new Date(startDate);
    reminder15Days.setDate(reminder15Days.getDate() - 15);
    
    const reminder3Days = new Date(startDate);
    reminder3Days.setDate(reminder3Days.getDate() - 3);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminders = [];

    // Only schedule reminders that are in the future
    if (reminder30Days > today) {
      reminders.push({
        assignment_id: data.assignmentId,
        physician_id: data.physicianId,
        facility_id: data.facilityId,
        reminder_type: '30_days',
        scheduled_date: reminder30Days.toISOString().split('T')[0],
        status: 'scheduled'
      });
    }

    if (reminder15Days > today) {
      reminders.push({
        assignment_id: data.assignmentId,
        physician_id: data.physicianId,
        facility_id: data.facilityId,
        reminder_type: '15_days',
        scheduled_date: reminder15Days.toISOString().split('T')[0],
        status: 'scheduled'
      });
    }

    if (reminder3Days > today) {
      reminders.push({
        assignment_id: data.assignmentId,
        physician_id: data.physicianId,
        facility_id: data.facilityId,
        reminder_type: '3_days',
        scheduled_date: reminder3Days.toISOString().split('T')[0],
        status: 'scheduled'
      });
    }

    if (reminders.length > 0) {
      const { error } = await supabase
        .from('assignment_reminders')
        .insert(reminders);

      if (error) {
        console.error('Error scheduling reminders:', error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error in scheduleAssignmentReminders:', err);
    return { success: false, error: 'Failed to schedule reminders' };
  }
}

// Check for date conflicts before allowing application
export async function checkDateConflicts(
  physicianId: string,
  startDate: string,
  endDate: string
): Promise<{ hasConflict: boolean; conflicts: any[] }> {
  try {
    // Include buffer days in conflict check
    const checkStart = new Date(startDate);
    checkStart.setDate(checkStart.getDate() - 1);
    
    const checkEnd = new Date(endDate);
    checkEnd.setDate(checkEnd.getDate() + 1);

    const { data: conflicts, error } = await supabase
      .from('physician_calendar')
      .select('*')
      .eq('physician_id', physicianId)
      .or(`and(start_date.lte.${checkEnd.toISOString().split('T')[0]},end_date.gte.${checkStart.toISOString().split('T')[0]})`);

    if (error) {
      console.error('Error checking conflicts:', error);
      return { hasConflict: false, conflicts: [] };
    }

    // Filter out 'available' blocks as they don't cause conflicts
    const actualConflicts = (conflicts || []).filter(
      c => c.block_type !== 'available'
    );

    return {
      hasConflict: actualConflicts.length > 0,
      conflicts: actualConflicts
    };
  } catch (err) {
    console.error('Error in checkDateConflicts:', err);
    return { hasConflict: false, conflicts: [] };
  }
}

// Release blocked dates when assignment is cancelled
export async function releaseDatesForCancelledAssignment(assignmentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete calendar entries for this assignment
    const { error: calendarError } = await supabase
      .from('physician_calendar')
      .delete()
      .or(`assignment_id.eq.${assignmentId},buffer_for_assignment_id.eq.${assignmentId}`);

    if (calendarError) {
      console.error('Error releasing calendar dates:', calendarError);
      return { success: false, error: calendarError.message };
    }

    // Cancel scheduled reminders
    const { error: reminderError } = await supabase
      .from('assignment_reminders')
      .delete()
      .eq('assignment_id', assignmentId)
      .eq('status', 'scheduled');

    if (reminderError) {
      console.error('Error cancelling reminders:', reminderError);
    }

    return { success: true };
  } catch (err) {
    console.error('Error in releaseDatesForCancelledAssignment:', err);
    return { success: false, error: 'Failed to release calendar dates' };
  }
}

// Get physician's blocked dates for a date range
export async function getBlockedDates(
  physicianId: string,
  startDate: string,
  endDate: string
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('physician_calendar')
      .select('*')
      .eq('physician_id', physicianId)
      .gte('end_date', startDate)
      .lte('start_date', endDate)
      .neq('block_type', 'available');

    if (error) {
      console.error('Error fetching blocked dates:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getBlockedDates:', err);
    return [];
  }
}

// Get physician's available dates (public only for facilities)
export async function getPublicAvailability(
  physicianId: string,
  startDate: string,
  endDate: string
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('physician_calendar')
      .select('*')
      .eq('physician_id', physicianId)
      .eq('block_type', 'available')
      .eq('visibility', 'public')
      .gte('end_date', startDate)
      .lte('start_date', endDate);

    if (error) {
      console.error('Error fetching availability:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getPublicAvailability:', err);
    return [];
  }
}

// Process assignment approval and trigger calendar blocking
export async function processAssignmentApproval(
  assignmentId: string,
  approverType: 'physician' | 'facility'
): Promise<{ success: boolean; bothApproved: boolean; error?: string }> {
  try {
    // Get current assignment status
    const { data: assignment, error: fetchError } = await supabase
      .from('confirmed_assignments')
      .select('*')
      .eq('id', assignmentId)
      .maybeSingle();

    if (fetchError || !assignment) {
      return { success: false, bothApproved: false, error: 'Assignment not found' };
    }

    // Update approval status
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (approverType === 'physician') {
      updateData.physician_approved = true;
      updateData.physician_approved_at = new Date().toISOString();
    } else {
      updateData.facility_approved = true;
      updateData.facility_approved_at = new Date().toISOString();
    }

    // Check if both parties have now approved
    const physicianApproved = approverType === 'physician' ? true : assignment.physician_approved;
    const facilityApproved = approverType === 'facility' ? true : assignment.facility_approved;
    const bothApproved = physicianApproved && facilityApproved;

    if (bothApproved) {
      updateData.both_approved = true;
      updateData.status = 'approved';
    }

    // Update assignment
    const { error: updateError } = await supabase
      .from('confirmed_assignments')
      .update(updateData)
      .eq('id', assignmentId);

    if (updateError) {
      return { success: false, bothApproved: false, error: updateError.message };
    }

    // If both approved, block calendar dates and schedule reminders
    if (bothApproved) {
      await blockDatesForApprovedAssignment({
        assignmentId: assignment.id,
        physicianId: assignment.physician_id,
        facilityId: assignment.facility_id,
        facilityName: assignment.facility_name,
        assignmentTitle: assignment.assignment_title,
        specialty: assignment.specialty,
        startDate: assignment.start_date,
        endDate: assignment.end_date,
        payRate: assignment.pay_rate
      });
    }

    return { success: true, bothApproved };
  } catch (err) {
    console.error('Error in processAssignmentApproval:', err);
    return { success: false, bothApproved: false, error: 'Failed to process approval' };
  }
}
