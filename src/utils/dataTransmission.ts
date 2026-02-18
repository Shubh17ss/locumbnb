import type { DataTransmissionLog } from '../types/audit';
import { auditLogger } from './auditLogger';
import { versionControl } from './versionControl';

class DataTransmissionManager {
  private static instance: DataTransmissionManager;
  private transmissionLogs: DataTransmissionLog[] = [];

  private constructor() {
    this.loadTransmissionLogs();
  }

  public static getInstance(): DataTransmissionManager {
    if (!DataTransmissionManager.instance) {
      DataTransmissionManager.instance = new DataTransmissionManager();
    }
    return DataTransmissionManager.instance;
  }

  private loadTransmissionLogs(): void {
    try {
      const stored = localStorage.getItem('transmission_logs');
      if (stored) {
        this.transmissionLogs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load transmission logs:', error);
    }
  }

  private saveTransmissionLogs(): void {
    try {
      localStorage.setItem('transmission_logs', JSON.stringify(this.transmissionLogs));
    } catch (error) {
      console.error('Failed to save transmission logs:', error);
    }
  }

  private async getIPAddress(): Promise<string> {
    return 'client-side-capture';
  }

  public async transmitApplicationData(
    physicianId: string,
    facilityId: string,
    applicationId: string,
    assignmentId: string,
    consentId: string
  ): Promise<DataTransmissionLog> {
    // Verify consent exists
    const consent = this.verifyConsent(physicianId, consentId);
    if (!consent) {
      throw new Error('Valid consent required for data transmission');
    }

    // Gather all active documents and signatures
    const documents = versionControl.getAllActiveDocuments(physicianId);
    const signatures = versionControl.getAllActiveSignatures(physicianId);

    const ipAddress = await this.getIPAddress();

    const transmissionLog: DataTransmissionLog = {
      id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transmissionType: 'application_submission',
      fromUserId: physicianId,
      fromUserRole: 'physician',
      toUserId: facilityId,
      toUserRole: 'facility',
      dataPackage: {
        profileData: true,
        documents: documents.map(d => d.id),
        signatures: signatures.map(s => s.id),
        questionnaires: [], // Would be populated from actual questionnaire data
      },
      transmittedAt: new Date().toISOString(),
      consentId,
      applicationId,
      assignmentId,
      ipAddress,
      status: 'transmitted',
    };

    this.transmissionLogs.push(transmissionLog);
    this.saveTransmissionLogs();

    // Log to audit trail
    await auditLogger.log(
      physicianId,
      'physician',
      'data_transmitted',
      'application',
      applicationId,
      {
        facilityId,
        assignmentId,
        documentCount: documents.length,
        signatureCount: signatures.length,
        transmissionId: transmissionLog.id,
      }
    );

    return transmissionLog;
  }

  private verifyConsent(userId: string, consentId: string): boolean {
    // In production, this would verify against stored consent records
    // For now, check if consent exists in localStorage
    try {
      const consents = localStorage.getItem('user_consents');
      if (consents) {
        const parsed = JSON.parse(consents);
        return parsed[userId]?.includes(consentId);
      }
    } catch (error) {
      console.error('Failed to verify consent:', error);
    }
    return false;
  }

  public async recordConsent(
    userId: string,
    consentType: string,
    consentText: string
  ): Promise<string> {
    const consentId = `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const consents = localStorage.getItem('user_consents');
      const parsed = consents ? JSON.parse(consents) : {};

      if (!parsed[userId]) {
        parsed[userId] = [];
      }
      parsed[userId].push(consentId);

      localStorage.setItem('user_consents', JSON.stringify(parsed));

      // Log to audit trail
      await auditLogger.log(
        userId,
        'physician',
        'consent_given',
        'consent',
        consentId,
        {
          consentType,
          consentText: consentText.substring(0, 100) + '...',
        }
      );

      return consentId;
    } catch (error) {
      console.error('Failed to record consent:', error);
      throw error;
    }
  }

  public getTransmissionsByUser(userId: string): DataTransmissionLog[] {
    return this.transmissionLogs.filter(
      log => log.fromUserId === userId || log.toUserId === userId
    );
  }

  public getTransmissionsByApplication(applicationId: string): DataTransmissionLog[] {
    return this.transmissionLogs.filter(log => log.applicationId === applicationId);
  }

  public getAllTransmissions(): DataTransmissionLog[] {
    return [...this.transmissionLogs];
  }
}

export const dataTransmissionManager = DataTransmissionManager.getInstance();
