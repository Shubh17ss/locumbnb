import type { ComplianceCheck } from '../types/audit';
import { auditLogger } from './auditLogger';
import { versionControl } from './versionControl';
import { dataTransmissionManager } from './dataTransmission';

class ComplianceChecker {
  private static instance: ComplianceChecker;
  private complianceChecks: ComplianceCheck[] = [];

  private constructor() {
    this.loadComplianceChecks();
  }

  public static getInstance(): ComplianceChecker {
    if (!ComplianceChecker.instance) {
      ComplianceChecker.instance = new ComplianceChecker();
    }
    return ComplianceChecker.instance;
  }

  private loadComplianceChecks(): void {
    try {
      const stored = localStorage.getItem('compliance_checks');
      if (stored) {
        this.complianceChecks = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load compliance checks:', error);
    }
  }

  private saveComplianceChecks(): void {
    try {
      localStorage.setItem('compliance_checks', JSON.stringify(this.complianceChecks));
    } catch (error) {
      console.error('Failed to save compliance checks:', error);
    }
  }

  private async recordCheck(
    checkType: ComplianceCheck['checkType'],
    entityType: string,
    entityId: string,
    performedBy: string,
    result: 'passed' | 'failed' | 'warning',
    details: Record<string, any>,
    actionTaken?: string
  ): Promise<ComplianceCheck> {
    const check: ComplianceCheck = {
      id: `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      checkType,
      entityType,
      entityId,
      performedAt: new Date().toISOString(),
      performedBy,
      result,
      details,
      actionTaken,
    };

    this.complianceChecks.push(check);
    this.saveComplianceChecks();

    return check;
  }

  public async checkNonCircumvention(
    userId: string,
    applicationId: string
  ): Promise<ComplianceCheck> {
    // Verify digital attestation exists with non-circumvention clause
    const attestation = versionControl.getLatestSignature(
      userId,
      'digital_attestation',
      'profile'
    );

    const result = attestation && attestation.status === 'active' ? 'passed' : 'failed';

    const check = await this.recordCheck(
      'non_circumvention',
      'application',
      applicationId,
      userId,
      result,
      {
        attestationId: attestation?.id,
        attestationVersion: attestation?.version,
        signedAt: attestation?.signedAt,
      },
      result === 'failed' ? 'Application blocked - attestation required' : undefined
    );

    if (result === 'failed') {
      await auditLogger.log(
        userId,
        'physician',
        'application_submitted',
        'application',
        applicationId,
        {
          complianceCheckId: check.id,
          status: 'blocked',
          reason: 'Missing non-circumvention attestation',
        }
      );
    }

    return check;
  }

  public async checkDataConsent(
    userId: string,
    facilityId: string,
    applicationId: string
  ): Promise<ComplianceCheck> {
    // Verify consent exists for data transmission
    const transmissions = dataTransmissionManager.getTransmissionsByApplication(applicationId);
    const hasValidConsent = transmissions.length > 0 && transmissions[0].consentId;

    const result = hasValidConsent ? 'passed' : 'failed';

    const check = await this.recordCheck(
      'data_consent',
      'application',
      applicationId,
      userId,
      result,
      {
        facilityId,
        consentId: transmissions[0]?.consentId,
        transmissionId: transmissions[0]?.id,
      },
      result === 'failed' ? 'Data transmission blocked - consent required' : undefined
    );

    return check;
  }

  public async checkProfileCompleteness(userId: string): Promise<ComplianceCheck> {
    // Check if all required profile sections are complete
    const profileData = localStorage.getItem(`profile_${userId}`);
    let result: 'passed' | 'failed' | 'warning' = 'failed';
    const details: Record<string, any> = {};

    if (profileData) {
      const profile = JSON.parse(profileData);
      const requiredSections = [
        'personalIdentifiers',
        'professionalInformation',
        'licensure',
        'documentUploads',
        'standardQuestionnaires',
      ];

      const completedSections = requiredSections.filter(
        section => profile[section]?.completed === true
      );

      details.requiredSections = requiredSections.length;
      details.completedSections = completedSections.length;
      details.missingSections = requiredSections.filter(
        section => !completedSections.includes(section)
      );

      result = completedSections.length === requiredSections.length ? 'passed' : 'failed';
    }

    const check = await this.recordCheck(
      'profile_completeness',
      'profile',
      userId,
      userId,
      result,
      details,
      result === 'failed' ? 'Application blocked - profile incomplete' : undefined
    );

    return check;
  }

  public async checkSignatureValidity(
    userId: string,
    signatureId: string
  ): Promise<ComplianceCheck> {
    // Verify signature exists and is active
    const allSignatures = versionControl.getAllActiveSignatures(userId);
    const signature = allSignatures.find(s => s.id === signatureId);

    const result = signature && signature.status === 'active' ? 'passed' : 'failed';

    const check = await this.recordCheck(
      'signature_validity',
      'signature',
      signatureId,
      userId,
      result,
      {
        signatureType: signature?.signatureType,
        version: signature?.version,
        signedAt: signature?.signedAt,
        status: signature?.status,
      },
      result === 'failed' ? 'Signature invalid or superseded' : undefined
    );

    return check;
  }

  public async performPreApplicationChecks(
    userId: string,
    applicationId: string,
    facilityId: string
  ): Promise<{
    passed: boolean;
    checks: ComplianceCheck[];
    blockingIssues: string[];
  }> {
    const checks: ComplianceCheck[] = [];
    const blockingIssues: string[] = [];

    // Check 1: Profile completeness
    const profileCheck = await this.checkProfileCompleteness(userId);
    checks.push(profileCheck);
    if (profileCheck.result === 'failed') {
      blockingIssues.push('Profile must be complete before applying');
    }

    // Check 2: Non-circumvention attestation
    const nonCircumventionCheck = await this.checkNonCircumvention(userId, applicationId);
    checks.push(nonCircumventionCheck);
    if (nonCircumventionCheck.result === 'failed') {
      blockingIssues.push('Digital attestation with non-circumvention agreement required');
    }

    const passed = blockingIssues.length === 0;

    return {
      passed,
      checks,
      blockingIssues,
    };
  }

  public getChecksByEntity(entityType: string, entityId: string): ComplianceCheck[] {
    return this.complianceChecks.filter(
      check => check.entityType === entityType && check.entityId === entityId
    );
  }

  public getChecksByUser(userId: string): ComplianceCheck[] {
    return this.complianceChecks.filter(check => check.performedBy === userId);
  }

  public getFailedChecks(): ComplianceCheck[] {
    return this.complianceChecks.filter(check => check.result === 'failed');
  }

  public getAllChecks(): ComplianceCheck[] {
    return [...this.complianceChecks];
  }
}

export const complianceChecker = ComplianceChecker.getInstance();
