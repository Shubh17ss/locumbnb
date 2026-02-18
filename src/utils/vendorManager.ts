import type { 
  Vendor, 
  InsuranceQuote, 
  TravelQuote, 
  ServiceRequest, 
  VendorPerformanceMetrics,
  VendorDataAccess 
} from '../types/vendor';

/**
 * Submit insurance request and share verified profile with approved vendors
 */
export const submitInsuranceRequest = (
  physicianId: string,
  assignmentId: string,
  requestDetails: any
): ServiceRequest => {
  const request: ServiceRequest = {
    id: `request-${Date.now()}`,
    type: 'insurance',
    physicianId,
    physicianName: 'Current Physician',
    assignmentId,
    status: 'submitted',
    requestDetails,
    profileShared: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    auditLog: [
      {
        timestamp: new Date().toISOString(),
        action: 'request_created',
        actor: physicianId,
        details: `Insurance request submitted for assignment ${assignmentId}`
      },
      {
        timestamp: new Date().toISOString(),
        action: 'profile_shared',
        actor: 'system',
        details: 'Verified profile automatically shared with approved insurance vendors'
      }
    ]
  };

  console.log('Insurance request submitted:', request);
  return request;
};

/**
 * Submit travel request tied to specific assignment
 */
export const submitTravelRequest = (
  physicianId: string,
  assignmentId: string,
  requestDetails: any
): ServiceRequest => {
  const request: ServiceRequest = {
    id: `request-${Date.now()}`,
    type: 'travel',
    physicianId,
    physicianName: 'Current Physician',
    assignmentId,
    status: 'submitted',
    requestDetails,
    profileShared: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    auditLog: [
      {
        timestamp: new Date().toISOString(),
        action: 'request_created',
        actor: physicianId,
        details: `Travel request submitted for assignment ${assignmentId}`
      },
      {
        timestamp: new Date().toISOString(),
        action: 'profile_shared',
        actor: 'system',
        details: 'Travel preferences shared with approved travel vendors'
      }
    ]
  };

  console.log('Travel request submitted:', request);
  return request;
};

/**
 * Vendor requests additional information from physician
 */
export const requestAdditionalInfo = (
  requestId: string,
  vendorId: string,
  questions: string[]
): ServiceRequest => {
  const updatedRequest = {
    additionalInfoRequested: {
      requestedAt: new Date().toISOString(),
      requestedBy: vendorId,
      questions
    },
    status: 'vendor_reviewing' as const,
    updatedAt: new Date().toISOString()
  };

  console.log('Additional info requested:', { requestId, vendorId, questions });
  return updatedRequest as any;
};

/**
 * Physician responds to vendor's additional info request
 */
export const respondToAdditionalInfoRequest = (
  requestId: string,
  physicianId: string,
  responses: any
): void => {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    action: 'additional_info_provided',
    actor: physicianId,
    details: 'Physician responded to vendor information request'
  };

  console.log('Additional info provided:', { requestId, responses, auditEntry });
};

/**
 * Vendor submits quote (insurance or travel)
 */
export const submitQuote = (
  requestId: string,
  vendorId: string,
  quoteDetails: Partial<InsuranceQuote | TravelQuote>
): InsuranceQuote | TravelQuote => {
  const quote = {
    id: `quote-${Date.now()}`,
    requestId,
    vendorId,
    status: 'submitted' as const,
    submittedAt: new Date().toISOString(),
    ...quoteDetails
  };

  // Calculate platform fee (15%)
  const serviceCost = (quoteDetails as any).premium || (quoteDetails as any).totalServiceCost || 0;
  const platformFee = serviceCost * 0.15;
  const totalCost = serviceCost + platformFee;

  const finalQuote = {
    ...quote,
    platformFee,
    totalCost
  };

  console.log('Quote submitted:', finalQuote);
  
  // Trigger notification to physician
  notifyPhysicianQuoteReceived(requestId, vendorId);

  return finalQuote as any;
};

/**
 * Physician accepts quote
 */
export const acceptQuote = (
  quoteId: string,
  physicianId: string,
  requestId: string
): void => {
  const timestamp = new Date().toISOString();

  console.log('Quote accepted:', {
    quoteId,
    physicianId,
    requestId,
    timestamp,
    status: 'accepted'
  });

  // Update service request status
  updateServiceRequestStatus(requestId, 'accepted');

  // Log transaction for platform fee collection
  logPlatformFeeTransaction(quoteId, physicianId);

  // Notify vendor of acceptance
  notifyVendorQuoteAccepted(quoteId);
};

/**
 * Physician declines quote
 */
export const declineQuote = (
  quoteId: string,
  physicianId: string,
  reason?: string
): void => {
  console.log('Quote declined:', {
    quoteId,
    physicianId,
    reason,
    timestamp: new Date().toISOString(),
    status: 'declined'
  });

  // Notify vendor of decline
  notifyVendorQuoteDeclined(quoteId, reason);
};

/**
 * Update service request status
 */
export const updateServiceRequestStatus = (
  requestId: string,
  status: ServiceRequest['status']
): void => {
  console.log('Service request status updated:', {
    requestId,
    status,
    timestamp: new Date().toISOString()
  });
};

/**
 * Mark service as completed
 */
export const completeService = (
  requestId: string,
  vendorId: string
): void => {
  const timestamp = new Date().toISOString();

  console.log('Service completed:', {
    requestId,
    vendorId,
    completedAt: timestamp
  });

  // Update vendor performance metrics
  updateVendorPerformance(vendorId, 'service_completed');
};

/**
 * Calculate vendor performance metrics
 */
export const calculateVendorPerformance = (
  vendorId: string,
  quotes: any[],
  services: any[]
): VendorPerformanceMetrics => {
  const totalQuotes = quotes.length;
  const acceptedQuotes = quotes.filter(q => q.status === 'accepted').length;
  const completedServices = services.filter(s => s.status === 'completed').length;
  
  const quoteAcceptanceRate = totalQuotes > 0 ? (acceptedQuotes / totalQuotes) * 100 : 0;
  const serviceCompletionRate = acceptedQuotes > 0 ? (completedServices / acceptedQuotes) * 100 : 0;

  const totalRevenue = services.reduce((sum, s) => sum + (s.totalServiceCost || 0), 0);
  const platformFees = totalRevenue * 0.15;

  const avgResponseTimes = quotes.map(q => {
    const requested = new Date(q.requestedAt || Date.now());
    const submitted = new Date(q.submittedAt);
    return (submitted.getTime() - requested.getTime()) / (1000 * 60 * 60); // hours
  });
  const averageResponseTime = avgResponseTimes.length > 0 
    ? avgResponseTimes.reduce((a, b) => a + b, 0) / avgResponseTimes.length 
    : 0;

  return {
    vendorId,
    vendorName: 'Vendor Name',
    type: 'insurance',
    averageResponseTime,
    quoteAcceptanceRate,
    serviceCompletionRate,
    averageRating: 4.5,
    totalQuotesSubmitted: totalQuotes,
    totalQuotesAccepted: acceptedQuotes,
    totalServicesCompleted: completedServices,
    revenueGenerated: totalRevenue,
    platformFeesCollected: platformFees,
    lastActivityDate: new Date().toISOString(),
    reliabilityTrend: 'stable',
    flaggedIssues: 0,
    customerSatisfaction: 90
  };
};

/**
 * Update vendor performance after action
 */
export const updateVendorPerformance = (
  vendorId: string,
  action: 'quote_submitted' | 'quote_accepted' | 'service_completed' | 'issue_flagged'
): void => {
  console.log('Vendor performance updated:', {
    vendorId,
    action,
    timestamp: new Date().toISOString()
  });
};

/**
 * Log platform fee transaction (15%)
 */
export const logPlatformFeeTransaction = (
  quoteId: string,
  physicianId: string
): void => {
  console.log('Platform fee transaction logged:', {
    quoteId,
    physicianId,
    feePercentage: 15,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track vendor data access
 */
export const logVendorDataAccess = (
  vendorId: string,
  physicianId: string,
  dataAccessed: string[],
  purpose: string
): VendorDataAccess => {
  const access: VendorDataAccess = {
    vendorId,
    physicianId,
    dataShared: dataAccessed,
    sharedAt: new Date().toISOString(),
    sharedBy: 'system',
    purpose,
    accessLog: [
      {
        timestamp: new Date().toISOString(),
        action: 'data_shared',
        dataAccessed
      }
    ]
  };

  console.log('Vendor data access logged:', access);
  return access;
};

/**
 * Revoke vendor data access
 */
export const revokeVendorDataAccess = (
  vendorId: string,
  physicianId: string
): void => {
  console.log('Vendor data access revoked:', {
    vendorId,
    physicianId,
    revokedAt: new Date().toISOString()
  });
};

/**
 * Notification helpers
 */
const notifyPhysicianQuoteReceived = (requestId: string, vendorId: string): void => {
  console.log('Notification sent: Quote received', { requestId, vendorId });
};

const notifyVendorQuoteAccepted = (quoteId: string): void => {
  console.log('Notification sent: Quote accepted', { quoteId });
};

const notifyVendorQuoteDeclined = (quoteId: string, reason?: string): void => {
  console.log('Notification sent: Quote declined', { quoteId, reason });
};

/**
 * Validate vendor eligibility
 */
export const isVendorEligible = (vendor: Vendor): boolean => {
  return (
    vendor.status === 'approved' &&
    vendor.reliabilityScore >= 80 &&
    vendor.averageResponseTime <= 24
  );
};

/**
 * Get vendor reliability trend
 */
export const getVendorReliabilityTrend = (
  currentScore: number,
  previousScore: number
): 'improving' | 'stable' | 'declining' => {
  const difference = currentScore - previousScore;
  if (difference > 2) return 'improving';
  if (difference < -2) return 'declining';
  return 'stable';
};
