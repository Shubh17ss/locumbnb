import type { VersionedDocument, VersionedSignature } from '../types/audit';
import { auditLogger } from './auditLogger';

class VersionControl {
  private static instance: VersionControl;
  private documents: Map<string, VersionedDocument[]> = new Map();
  private signatures: Map<string, VersionedSignature[]> = new Map();

  private constructor() {
    this.loadVersionData();
  }

  public static getInstance(): VersionControl {
    if (!VersionControl.instance) {
      VersionControl.instance = new VersionControl();
    }
    return VersionControl.instance;
  }

  private loadVersionData(): void {
    try {
      const docsData = localStorage.getItem('versioned_documents');
      const sigsData = localStorage.getItem('versioned_signatures');

      if (docsData) {
        const parsed = JSON.parse(docsData);
        this.documents = new Map(Object.entries(parsed));
      }

      if (sigsData) {
        const parsed = JSON.parse(sigsData);
        this.signatures = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Failed to load version data:', error);
    }
  }

  private saveVersionData(): void {
    try {
      const docsObj = Object.fromEntries(this.documents);
      const sigsObj = Object.fromEntries(this.signatures);

      localStorage.setItem('versioned_documents', JSON.stringify(docsObj));
      localStorage.setItem('versioned_signatures', JSON.stringify(sigsObj));
    } catch (error) {
      console.error('Failed to save version data:', error);
    }
  }

  private async getDeviceInfo(): Promise<string> {
    return `${navigator.platform} - ${navigator.userAgent}`;
  }

  private async getIPAddress(): Promise<string> {
    return 'client-side-capture';
  }

  private async calculateChecksum(file: File): Promise<string> {
    // Simple checksum calculation
    const text = await file.text();
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  public async addDocument(
    documentType: string,
    fileName: string,
    fileUrl: string,
    uploadedBy: string,
    file?: File
  ): Promise<VersionedDocument> {
    const key = `${uploadedBy}_${documentType}`;
    const existingVersions = this.documents.get(key) || [];

    // Mark previous version as superseded
    if (existingVersions.length > 0) {
      const latest = existingVersions[existingVersions.length - 1];
      latest.status = 'superseded';
    }

    const ipAddress = await this.getIPAddress();
    const deviceInfo = await this.getDeviceInfo();
    const checksum = file ? await this.calculateChecksum(file) : undefined;

    const newVersion: VersionedDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      documentType,
      fileName,
      fileUrl,
      version: existingVersions.length + 1,
      uploadedAt: new Date().toISOString(),
      uploadedBy,
      ipAddress,
      deviceInfo,
      checksum,
      previousVersionId: existingVersions.length > 0 ? existingVersions[existingVersions.length - 1].id : undefined,
      status: 'active',
    };

    existingVersions.push(newVersion);
    this.documents.set(key, existingVersions);
    this.saveVersionData();

    // Log to audit trail
    await auditLogger.log(
      uploadedBy,
      'physician',
      existingVersions.length === 1 ? 'document_uploaded' : 'document_updated',
      'document',
      newVersion.id,
      {
        documentType,
        fileName,
        version: newVersion.version,
        checksum,
      },
      newVersion.version
    );

    return newVersion;
  }

  public async addSignature(
    signatureType: 'digital_attestation' | 'facility_agreement' | 'platform_terms',
    fullLegalName: string,
    signedBy: string,
    attestationText: string,
    relatedEntityType: string,
    relatedEntityId: string
  ): Promise<VersionedSignature> {
    const key = `${signedBy}_${signatureType}_${relatedEntityId}`;
    const existingVersions = this.signatures.get(key) || [];

    // Mark previous version as superseded
    if (existingVersions.length > 0) {
      const latest = existingVersions[existingVersions.length - 1];
      latest.status = 'superseded';
    }

    const ipAddress = await this.getIPAddress();
    const deviceInfo = await this.getDeviceInfo();

    const newSignature: VersionedSignature = {
      id: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      signatureType,
      fullLegalName,
      signedAt: new Date().toISOString(),
      signedBy,
      ipAddress,
      deviceInfo,
      version: existingVersions.length + 1,
      attestationText,
      relatedEntityType,
      relatedEntityId,
      status: 'active',
    };

    existingVersions.push(newSignature);
    this.signatures.set(key, existingVersions);
    this.saveVersionData();

    // Log to audit trail
    await auditLogger.log(
      signedBy,
      'physician',
      existingVersions.length === 1 ? 'signature_created' : 'signature_updated',
      'signature',
      newSignature.id,
      {
        signatureType,
        fullLegalName,
        version: newSignature.version,
        relatedEntityType,
        relatedEntityId,
      },
      newSignature.version
    );

    return newSignature;
  }

  public getDocumentVersions(uploadedBy: string, documentType: string): VersionedDocument[] {
    const key = `${uploadedBy}_${documentType}`;
    return this.documents.get(key) || [];
  }

  public getLatestDocument(uploadedBy: string, documentType: string): VersionedDocument | null {
    const versions = this.getDocumentVersions(uploadedBy, documentType);
    return versions.find(v => v.status === 'active') || null;
  }

  public getSignatureVersions(
    signedBy: string,
    signatureType: string,
    relatedEntityId: string
  ): VersionedSignature[] {
    const key = `${signedBy}_${signatureType}_${relatedEntityId}`;
    return this.signatures.get(key) || [];
  }

  public getLatestSignature(
    signedBy: string,
    signatureType: string,
    relatedEntityId: string
  ): VersionedSignature | null {
    const versions = this.getSignatureVersions(signedBy, signatureType, relatedEntityId);
    return versions.find(v => v.status === 'active') || null;
  }

  public getAllActiveDocuments(uploadedBy: string): VersionedDocument[] {
    const allDocs: VersionedDocument[] = [];
    this.documents.forEach((versions, key) => {
      if (key.startsWith(uploadedBy)) {
        const active = versions.find(v => v.status === 'active');
        if (active) allDocs.push(active);
      }
    });
    return allDocs;
  }

  public getAllActiveSignatures(signedBy: string): VersionedSignature[] {
    const allSigs: VersionedSignature[] = [];
    this.signatures.forEach((versions, key) => {
      if (key.startsWith(signedBy)) {
        const active = versions.find(v => v.status === 'active');
        if (active) allSigs.push(active);
      }
    });
    return allSigs;
  }
}

export const versionControl = VersionControl.getInstance();
