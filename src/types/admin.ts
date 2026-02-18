export type AdminRole = 
  | 'super' 
  | 'operations_manager' 
  | 'compliance_manager' 
  | 'finance_manager' 
  | 'support_agent';

export interface AdminPermissions {
  // User Management
  canViewUsers: boolean;
  canModifyUsers: boolean;
  canSuspendUsers: boolean;
  canVerifyUsers: boolean;
  
  // Financial
  canViewFinancials: boolean;
  canModifyPayments: boolean;
  canHoldPayments: boolean;
  canReleasePayments: boolean;
  
  // Disputes
  canViewDisputes: boolean;
  canResolveDisputes: boolean;
  canEscalateDisputes: boolean;
  
  // Contracts & Compliance
  canViewContracts: boolean;
  canEnforcePolicy: boolean;
  canApplyPenalties: boolean;
  
  // Vendors
  canManageVendors: boolean;
  canViewVendorData: boolean;
  
  // Content Moderation
  canModerateContent: boolean;
  canRemoveContent: boolean;
  
  // Analytics
  canViewAnalytics: boolean;
  canExportData: boolean;
  
  // System
  canManageAdmins: boolean;
  canViewAuditLogs: boolean;
  hasFullOverride: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  permissions: AdminPermissions;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  createdBy?: string;
}

export interface AdminSession {
  sessionId: string;
  adminId: string;
  adminEmail: string;
  adminRole: AdminRole;
  loginTime: string;
  ipAddress: string;
  deviceInfo: string;
  expiresAt: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminEmail: string;
  adminRole: AdminRole;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, any>;
  ipAddress: string;
  deviceInfo: string;
  sessionId: string;
}
