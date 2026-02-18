// Mock data for job postings and applications

import type { JobPosting, Application, CalendarBlock } from '../types/application';

// Production: Start with empty job postings - facilities will create real postings
export const mockJobPostings: JobPosting[] = [];

// Production: Start with empty applications - physicians will submit real applications
export const mockApplications: Application[] = [];

// Production: Start with empty calendar blocks - will be created when physicians apply
export const mockCalendarBlocks: CalendarBlock[] = [];
