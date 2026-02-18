// Application matching and validation utilities

import type { Application, JobPosting, CalendarBlock, OverlapCheck, PhysicianProfileSnapshot } from '../types/application';
import type { ProfileData } from '../types/profile';

/**
 * Check if physician profile is complete and eligible to apply
 */
export const checkProfileEligibility = (profile: ProfileData): { eligible: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];

  // Check Personal Identifiers
  if (!profile.personalIdentifiers?.legalName) missingFields.push('Legal Name');
  if (!profile.personalIdentifiers?.email) missingFields.push('Email');
  if (!profile.personalIdentifiers?.phone) missingFields.push('Phone');

  // Check Professional Information
  if (!profile.professionalInfo?.specialty) missingFields.push('Specialty');
  if (!profile.professionalInfo?.boardStatus) missingFields.push('Board Status');
  if (!profile.professionalInfo?.yearsExperience) missingFields.push('Years of Experience');

  // Check Licensure
  if (!profile.licensure || profile.licensure.length === 0) missingFields.push('State License');

  // Check Document Uploads
  if (!profile.documents?.cv) missingFields.push('CV/Resume');
  if (!profile.documents?.npdb) missingFields.push('NPDB Report');

  // Check Standard Questionnaires
  if (!profile.questionnaires?.facilityCompleted) missingFields.push('Facility Questionnaire');
  if (!profile.questionnaires?.insuranceCompleted) missingFields.push('Insurance Questionnaire');

  // Check Digital Attestation
  if (!profile.attestation?.signature) missingFields.push('Digital Attestation');

  return {
    eligible: missingFields.length === 0,
    missingFields
  };
};

/**
 * Check for date overlaps with existing applications and assignments
 */
export const checkDateOverlap = (
  physicianId: string,
  startDate: string,
  endDate: string,
  existingApplications: Application[],
  existingBlocks: CalendarBlock[]
): OverlapCheck => {
  const newStart = new Date(startDate);
  const newEnd = new Date(endDate);

  // Check overlapping applications
  const overlappingApplications = existingApplications.filter(app => {
    if (app.status === 'rejected' || app.status === 'expired' || app.status === 'withdrawn') {
      return false;
    }
    const appStart = new Date(app.blockedDates.startDate);
    const appEnd = new Date(app.blockedDates.endDate);
    return (newStart <= appEnd && newEnd >= appStart);
  });

  // Check blocked dates
  const blockedDates = existingBlocks.filter(block => {
    if (block.status !== 'active') return false;
    const blockStart = new Date(block.startDate);
    const blockEnd = new Date(block.endDate);
    return (newStart <= blockEnd && newEnd >= blockStart);
  });

  return {
    hasOverlap: overlappingApplications.length > 0 || blockedDates.length > 0,
    overlappingApplications,
    overlappingAssignments: [], // Will be populated from actual assignment data
    blockedDates
  };
};

/**
 * Create profile snapshot for application
 */
export const createProfileSnapshot = (profile: ProfileData, ipAddress: string, deviceInfo: string): PhysicianProfileSnapshot => {
  return {
    personalInfo: {
      legalName: profile.personalIdentifiers?.legalName || '',
      dba: profile.personalIdentifiers?.dba,
      email: profile.personalIdentifiers?.email || '',
      phone: profile.personalIdentifiers?.phone || ''
    },
    professionalInfo: {
      specialty: profile.professionalInfo?.specialty || '',
      subspecialty: profile.professionalInfo?.subspecialty,
      boardStatus: profile.professionalInfo?.boardStatus || '',
      yearsExperience: profile.professionalInfo?.yearsExperience || 0
    },
    licensure: profile.licensure?.map(lic => ({
      state: lic.state,
      licenseNumber: lic.licenseNumber,
      expirationDate: lic.expirationDate
    })) || [],
    documents: {
      cv: profile.documents?.cv || '',
      npdb: profile.documents?.npdb || '',
      credentials: profile.documents?.credentials || []
    },
    questionnaires: {
      facilityQuestions: profile.questionnaires?.facilityAnswers || {},
      insuranceQuestions: profile.questionnaires?.insuranceAnswers || {}
    },
    attestation: {
      signature: profile.attestation?.signature || '',
      signedAt: profile.attestation?.signedAt || new Date().toISOString(),
      ipAddress,
      deviceInfo
    },
    verificationStatus: profile.completionStatus === 'complete' ? 'verified' : 'incomplete'
  };
};

/**
 * Calculate facility decision deadline (48-72 hours)
 */
export const calculateReviewDeadline = (applicationDate: Date, hours: number = 72): string => {
  const deadline = new Date(applicationDate);
  deadline.setHours(deadline.getHours() + hours);
  return deadline.toISOString();
};

/**
 * Check if application has expired
 */
export const isApplicationExpired = (reviewDeadline: string): boolean => {
  return new Date() > new Date(reviewDeadline);
};

/**
 * Auto-expire applications past deadline
 */
export const autoExpireApplications = (applications: Application[]): Application[] => {
  return applications.map(app => {
    if (app.status === 'pending' && isApplicationExpired(app.reviewDeadline)) {
      return {
        ...app,
        status: 'expired' as const,
        calendarBlocked: false
      };
    }
    return app;
  });
};

/**
 * Create calendar block for application
 */
export const createCalendarBlock = (
  physicianId: string,
  applicationId: string,
  jobPostingId: string,
  startDate: string,
  endDate: string,
  reviewDeadline: string
): CalendarBlock => {
  return {
    id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    physicianId,
    applicationId,
    jobPostingId,
    startDate,
    endDate,
    status: 'active',
    reason: 'pending_application',
    createdAt: new Date().toISOString(),
    expiresAt: reviewDeadline
  };
};

/**
 * Release calendar block
 */
export const releaseCalendarBlock = (block: CalendarBlock): CalendarBlock => {
  return {
    ...block,
    status: 'released',
    releasedAt: new Date().toISOString()
  };
};

/**
 * Validate job posting requirements against physician profile
 */
export const validateJobRequirements = (
  jobPosting: JobPosting,
  profile: PhysicianProfileSnapshot
): { meets: boolean; missingRequirements: string[] } => {
  const missingRequirements: string[] = [];

  // Check specialty match
  if (jobPosting.specialty !== profile.professionalInfo.specialty) {
    missingRequirements.push(`Specialty mismatch: requires ${jobPosting.specialty}`);
  }

  // Check required licenses
  const physicianLicenseStates = profile.licensure.map(lic => lic.state);
  const missingLicenses = jobPosting.requiredLicenses.filter(
    reqLicense => !physicianLicenseStates.includes(reqLicense)
  );
  
  if (missingLicenses.length > 0) {
    missingRequirements.push(`Missing licenses: ${missingLicenses.join(', ')}`);
  }

  // Check license expiration
  const expiredLicenses = profile.licensure.filter(lic => 
    new Date(lic.expirationDate) < new Date()
  );
  
  if (expiredLicenses.length > 0) {
    missingRequirements.push(`Expired licenses: ${expiredLicenses.map(l => l.state).join(', ')}`);
  }

  return {
    meets: missingRequirements.length === 0,
    missingRequirements
  };
};

/**
 * Get device information for audit trail
 */
export const getDeviceInfo = (): string => {
  return JSON.stringify({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
};

/**
 * Get IP address (placeholder - would need backend API)
 */
export const getIPAddress = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
};
