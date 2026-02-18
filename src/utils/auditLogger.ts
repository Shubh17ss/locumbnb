import type { AuditEntry, AuditAction, AuditEntityType } from '../types/audit';

class AuditLogger {
  private static instance: AuditLogger;
  private auditLog: AuditEntry[] = [];

  private constructor() {
    // Load existing audit log from storage
    this.loadAuditLog();
  }

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  private loadAuditLog(): void {
    try {
      const stored = localStorage.getItem('audit_log');
      if (stored) {
        this.auditLog = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load audit log:', error);
    }
  }

  private saveAuditLog(): void {
    try {
      localStorage.setItem('audit_log', JSON.stringify(this.auditLog));
    } catch (error) {
      console.error('Failed to save audit log:', error);
    }
  }

  private async getDeviceInfo(): Promise<string> {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    return `${platform} - ${userAgent}`;
  }

  private async getIPAddress(): Promise<string> {
    // In production, this would be captured server-side
    // For now, return a placeholder
    return 'client-side-capture';
  }

  public async log(
    userId: string,
    userRole: 'physician' | 'crna' | 'facility' | 'vendor',
    action: AuditAction,
    entityType: AuditEntityType,
    entityId: string,
    details: Record<string, any> = {},
    version?: number
  ): Promise<void> {
    const ipAddress = await this.getIPAddress();
    const deviceInfo = await this.getDeviceInfo();

    const entry: AuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId,
      userRole,
      action,
      entityType,
      entityId,
      details,
      ipAddress,
      deviceInfo,
      version,
    };

    this.auditLog.push(entry);
    this.saveAuditLog();

    // In production, also send to backend
    console.log('Audit Entry:', entry);
  }

  public getEntriesByUser(userId: string): AuditEntry[] {
    return this.auditLog.filter(entry => entry.userId === userId);
  }

  public getEntriesByEntity(entityType: AuditEntityType, entityId: string): AuditEntry[] {
    return this.auditLog.filter(
      entry => entry.entityType === entityType && entry.entityId === entityId
    );
  }

  public getEntriesByAction(action: AuditAction): AuditEntry[] {
    return this.auditLog.filter(entry => entry.action === action);
  }

  public getEntriesByDateRange(startDate: string, endDate: string): AuditEntry[] {
    return this.auditLog.filter(
      entry => entry.timestamp >= startDate && entry.timestamp <= endDate
    );
  }

  public getAllEntries(): AuditEntry[] {
    return [...this.auditLog];
  }
}

export const auditLogger = AuditLogger.getInstance();
