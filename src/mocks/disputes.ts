import type { Dispute } from '../types/dispute';

// Production: Start with empty disputes - will be created if users initiate disputes
export const mockDisputes: Dispute[] = [];

// Helper functions
export const getDisputeById = (id: string): Dispute | undefined => {
  return mockDisputes.find(dispute => dispute.id === id);
};

export const getDisputesByStatus = (status: string): Dispute[] => {
  return mockDisputes.filter(dispute => dispute.status === status);
};

export const getDisputesByAssignment = (assignmentId: string): Dispute[] => {
  return mockDisputes.filter(dispute => dispute.assignmentId === assignmentId);
};

export const getDisputesByUser = (userId: string): Dispute[] => {
  return mockDisputes.filter(
    dispute => dispute.initiatorId === userId || dispute.respondentId === userId
  );
};

export const getDisputesByPriority = (priority: string): Dispute[] => {
  return mockDisputes.filter(dispute => dispute.priority === priority);
};

export const getOpenDisputes = (): Dispute[] => {
  return mockDisputes.filter(dispute => 
    dispute.status === 'open' || dispute.status === 'under_review' || dispute.status === 'escalated'
  );
};

export const getResolvedDisputes = (): Dispute[] => {
  return mockDisputes.filter(dispute => dispute.status === 'resolved' || dispute.status === 'closed');
};
