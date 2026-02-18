import { AdminAuditLog } from '../types/admin';

class AdminAuditLogger {
  private logs: AdminAuditLog[] = [];

  log(
    adminId: string,
    adminEmail: string,
    adminRole: string,
    action: string,
    entityType: string,
    entityId: string,
    details: Record<string, any>,
    sessionId: string
  ): void {
    const auditLog: AdminAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      adminId,
      adminEmail,
      adminRole: adminRole as any,
      action,
      entityType,
      entityId,
      details,
      ipAddress: this.getClientIP(),
      deviceInfo: this.getDeviceInfo(),
      sessionId,
    };

    this.logs.push(auditLog);
    
    // Store in localStorage for persistence (in production, this would go to a database)
    this.persistLog(auditLog);
    
    console.log('[ADMIN AUDIT]', auditLog);
  }

  private persistLog(log: AdminAuditLog): void {
    try {
      const existingLogs = localStorage.getItem('admin_audit_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(log);
      
      // Keep only last 1000 logs in localStorage
      if (logs.length > 1000) {
        logs.shift();
      }
      
      localStorage.setItem('admin_audit_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to persist audit log:', error);
    }
  }

  getLogs(filters?: {
    adminId?: string;
    action?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
  }): AdminAuditLog[] {
    try {
      const storedLogs = localStorage.getItem('admin_audit_logs');
      let logs = storedLogs ? JSON.parse(storedLogs) : [];

      if (filters) {
        if (filters.adminId) {
          logs = logs.filter((log: AdminAuditLog) => log.adminId === filters.adminId);
        }
        if (filters.action) {
          logs = logs.filter((log: AdminAuditLog) => log.action === filters.action);
        }
        if (filters.entityType) {
          logs = logs.filter((log: AdminAuditLog) => log.entityType === filters.entityType);
        }
        if (filters.startDate) {
          logs = logs.filter((log: AdminAuditLog) => log.timestamp >= filters.startDate!);
        }
        if (filters.endDate) {
          logs = logs.filter((log: AdminAuditLog) => log.timestamp <= filters.endDate!);
        }
      }

      return logs.sort((a: AdminAuditLog, b: AdminAuditLog) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Failed to retrieve audit logs:', error);
      return [];
    }
  }

  private getClientIP(): string {
    // In production, this would be captured server-side
    return 'Client IP (captured server-side)';
  }

  private getDeviceInfo(): string {
    const ua = navigator.userAgent;
    const browser = this.getBrowserInfo(ua);
    const os = this.getOSInfo(ua);
    return `${browser} on ${os}`;
  }

  private getBrowserInfo(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
  }

  private getOSInfo(ua: string): string {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown OS';
  }

  exportLogs(format: 'json' | 'csv' = 'json'): string {
    const logs = this.getLogs();
    
    if (format === 'csv') {
      const headers = ['Timestamp', 'Admin Email', 'Role', 'Action', 'Entity Type', 'Entity ID', 'IP Address', 'Device'];
      const rows = logs.map(log => [
        log.timestamp,
        log.adminEmail,
        log.adminRole,
        log.action,
        log.entityType,
        log.entityId,
        log.ipAddress,
        log.deviceInfo,
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    return JSON.stringify(logs, null, 2);
  }
}

export const adminAuditLogger = new AdminAuditLogger();
