import type { Vendor, InsuranceQuote, TravelQuote, ServiceRequest, VendorPerformanceMetrics } from '../types/vendor';

// Production: Start with empty vendors - admin will approve real vendors
export const mockVendors: Vendor[] = [];

// Production: Start with empty insurance quotes - will be created when physicians request quotes
export const mockInsuranceQuotes: InsuranceQuote[] = [];

// Production: Start with empty travel quotes - will be created when physicians request travel services
export const mockTravelQuotes: TravelQuote[] = [];

// Production: Start with empty service requests - will be created by physicians
export const mockServiceRequests: ServiceRequest[] = [];

// Production: Start with empty vendor performance metrics - will be calculated as vendors provide services
export const mockVendorPerformance: VendorPerformanceMetrics[] = [];

// Helper functions
export const getVendorsByType = (type: string) => {
  return mockVendors.filter(v => v.type === type && v.status === 'approved');
};

export const getVendorById = (id: string) => {
  return mockVendors.find(v => v.id === id);
};

export const getInsuranceQuotesByRequest = (requestId: string) => {
  return mockInsuranceQuotes.filter(q => q.requestId === requestId);
};

export const getTravelQuotesByRequest = (requestId: string) => {
  return mockTravelQuotes.filter(q => q.requestId === requestId);
};

export const getServiceRequestsByPhysician = (physicianId: string) => {
  return mockServiceRequests.filter(r => r.physicianId === physicianId);
};

export const getServiceRequestsByAssignment = (assignmentId: string) => {
  return mockServiceRequests.filter(r => r.assignmentId === assignmentId);
};

export const getVendorPerformance = (vendorId: string) => {
  return mockVendorPerformance.find(p => p.vendorId === vendorId);
};
