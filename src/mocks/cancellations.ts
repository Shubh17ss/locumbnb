// Mock Cancellation Policies and Requests

import type { CancellationPolicy, CancellationRequest, PenaltyCharge } from '../types/cancellation';

// Production: Start with empty cancellation policies - will be created when facilities post jobs
export const mockCancellationPolicies: CancellationPolicy[] = [];

// Production: Start with empty cancellation requests - will be created if users request cancellations
export const mockCancellationRequests: CancellationRequest[] = [];

// Production: Start with empty penalty charges - will be created if cancellation penalties are applied
export const mockPenaltyCharges: PenaltyCharge[] = [];
