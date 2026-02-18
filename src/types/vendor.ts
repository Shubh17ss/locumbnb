export type VendorType = 'insurance' | 'travel' | 'lodging' | 'other';

export type VendorStatus = 'pending_approval' | 'approved' | 'suspended' | 'removed';

export type QuoteStatus = 'pending' | 'submitted' | 'accepted' | 'declined' | 'expired';

export type ServiceRequestStatus = 'draft' | 'submitted' | 'vendor_reviewing' | 'quote_received' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  status: VendorStatus;
  email: string;
  phone: string;
  website?: string;
  description: string;
  servicesOffered: string[];
  dataAccessScope: string[];
  assignmentPermissions: string[];
  averageResponseTime: number; // in hours
  reliabilityScore: number; // 0-100
  totalQuotes: number;
  acceptedQuotes: number;
  completedServices: number;
  averageRating: number;
  reviewCount: number;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceQuote {
  id: string;
  vendorId: string;
  vendorName: string;
  physicianId: string;
  requestId: string;
  assignmentId?: string;
  status: QuoteStatus;
  coverageType: string;
  coverageAmount: number;
  premium: number;
  deductible: number;
  policyTerm: string;
  coverageStartDate: string;
  coverageEndDate: string;
  additionalBenefits: string[];
  exclusions: string[];
  termsAndConditions: string;
  quotePdfUrl?: string;
  validUntil: string;
  submittedAt: string;
  respondedAt?: string;
  notes?: string;
  platformFee: number; // 15% of premium
  totalCost: number; // premium + platformFee
}

export interface TravelQuote {
  id: string;
  vendorId: string;
  vendorName: string;
  physicianId: string;
  requestId: string;
  assignmentId: string;
  status: QuoteStatus;
  serviceType: 'flight' | 'hotel' | 'car_rental' | 'full_package';
  flightDetails?: {
    departure: string;
    arrival: string;
    departureDate: string;
    returnDate: string;
    airline: string;
    flightNumber: string;
    class: string;
    price: number;
  };
  hotelDetails?: {
    name: string;
    address: string;
    checkIn: string;
    checkOut: string;
    roomType: string;
    pricePerNight: number;
    totalNights: number;
    totalPrice: number;
  };
  carRentalDetails?: {
    company: string;
    vehicleType: string;
    pickupDate: string;
    returnDate: string;
    price: number;
  };
  totalServiceCost: number;
  platformFee: number; // 15% of totalServiceCost
  totalCost: number; // totalServiceCost + platformFee
  validUntil: string;
  submittedAt: string;
  respondedAt?: string;
  notes?: string;
}

export interface ServiceRequest {
  id: string;
  type: 'insurance' | 'travel';
  physicianId: string;
  physicianName: string;
  assignmentId?: string;
  assignmentDetails?: {
    facilityName: string;
    location: string;
    startDate: string;
    endDate: string;
    specialty: string;
  };
  status: ServiceRequestStatus;
  requestDetails: any; // Specific to request type
  profileShared: boolean;
  sharedProfileData?: {
    name: string;
    specialty: string;
    licenses: string[];
    experience: number;
    documents: string[];
  };
  vendorId?: string;
  vendorName?: string;
  additionalInfoRequested?: {
    requestedAt: string;
    requestedBy: string;
    questions: string[];
    responses?: any;
    respondedAt?: string;
  };
  quoteId?: string;
  purchasedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  auditLog: {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
  }[];
}

export interface VendorPerformanceMetrics {
  vendorId: string;
  vendorName: string;
  type: VendorType;
  averageResponseTime: number; // hours
  quoteAcceptanceRate: number; // percentage
  serviceCompletionRate: number; // percentage
  averageRating: number;
  totalQuotesSubmitted: number;
  totalQuotesAccepted: number;
  totalServicesCompleted: number;
  revenueGenerated: number;
  platformFeesCollected: number;
  lastActivityDate: string;
  reliabilityTrend: 'improving' | 'stable' | 'declining';
  flaggedIssues: number;
  customerSatisfaction: number; // 0-100
}

export interface VendorDataAccess {
  vendorId: string;
  physicianId: string;
  assignmentId?: string;
  dataShared: string[];
  sharedAt: string;
  sharedBy: string;
  purpose: string;
  expiresAt?: string;
  revokedAt?: string;
  accessLog: {
    timestamp: string;
    action: string;
    dataAccessed: string[];
  }[];
}
