// Production: Start with empty contracts - will be created when users sign agreements
export const mockMarketplaceContracts = [];

// Production: Start with empty violations - will be created if violations occur
export const mockCircumventionViolations = [];

// Production: Start with empty penalty invoices - will be created if penalties are issued
export const mockPenaltyInvoices = [];

export const getContractByUser = (userId: string) => {
  return mockMarketplaceContracts.find(c => c.userId === userId);
};

export const getViolationsByUser = (userId: string) => {
  return mockCircumventionViolations.filter(
    v => v.violatorId === userId || v.relatedPartyId === userId
  );
};

export const getPenaltyInvoicesByUser = (userId: string) => {
  return mockPenaltyInvoices.filter(p => p.violatorId === userId);
};

export const getAllActiveViolations = () => {
  return mockCircumventionViolations.filter(
    v => v.status !== 'dismissed' && v.penaltyStatus !== 'paid'
  );
};
