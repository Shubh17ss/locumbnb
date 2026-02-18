// Application and matching system types

export type ApplicationStatus = 
  | 'pending' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'expired' 
  | 'withdrawn';

export type AssignmentStatus = 
  | 'draft'
  | 'open'
  | 'pending_approval'
  | 'approved_awaiting_signature'
  | 'contract_sent'
  | 'physician_signed'
  | 'facility_signed'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface JobPosting {
  id: string;
  facilityId: string;
  facilityName: string;
  specialty: string;
  subspecialty?: string;
  requiredLicenses: string[];
  startDate: string;
  endDate: string;
  assignmentType: 'fixed_block' | 'rolling_availability';
  blockDuration?: 3 | 5 | 7;
  payAmount: number;
  requirements: string;
  malpracticeIncluded: boolean;
  travelIncluded: boolean;
  lodgingIncluded: boolean;
  flightBudgetCap?: number;
  hotelBudgetCap?: number;
  status: 'draft' | 'open' | 'filled' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  jobPostingId: string;
  physicianId: string;
  physicianName: string;
  physicianSpecialty: string;
  status: ApplicationStatus;
  appliedAt: string;
  reviewDeadline: string; // 48-72 hours from application
  facilityDecisionAt?: string;
  decisionReason?: string;
  calendarBlocked: boolean;
  blockedDates: {
    startDate: string;
    endDate: string;
  };
  profileSnapshot: PhysicianProfileSnapshot;
  notificationsSent: {
    applicationReceived: boolean;
    reminderSent: boolean;
    deadlineWarning: boolean;
    decision: boolean;
  };
}

export interface PhysicianProfileSnapshot {
  personalInfo: {
    legalName: string;
    dba?: string;
    email: string;
    phone: string;
  };
  professionalInfo: {
    specialty: string;
    subspecialty?: string;
    boardStatus: string;
    yearsExperience: number;
  };
  licensure: {
    state: string;
    licenseNumber: string;
    expirationDate: string;
  }[];
  documents: {
    cv: string;
    npdb: string;
    credentials: string[];
  };
  questionnaires: {
    facilityQuestions: Record<string, any>;
    insuranceQuestions: Record<string, any>;
  };
  attestation: {
    signature: string;
    signedAt: string;
    ipAddress: string;
    deviceInfo: string;
  };
  verificationStatus: 'verified' | 'pending' | 'incomplete';
}

export interface CalendarBlock {
  id: string;
  physicianId: string;
  applicationId: string;
  jobPostingId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'released';
  reason: 'pending_application' | 'approved_assignment' | 'scheduled_assignment';
  createdAt: string;
  expiresAt?: string;
  releasedAt?: string;
}

export interface ApplicationNotification {
  id: string;
  recipientId: string;
  recipientType: 'physician' | 'facility';
  type: 'application_received' | 'application_approved' | 'application_rejected' | 'application_expired' | 'deadline_warning';
  applicationId: string;
  title: string;
  message: string;
  read: boolean;
  sentAt: string;
  emailSent: boolean;
  dashboardAlert: boolean;
}

export interface OverlapCheck {
  hasOverlap: boolean;
  overlappingApplications: Application[];
  overlappingAssignments: any[];
  blockedDates: CalendarBlock[];
}
