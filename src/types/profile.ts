export interface ProfileData {
  personalIdentifiers: PersonalIdentifiersData | null;
  professionalInformation: ProfessionalInformationData | null;
  licensure: LicensureData | null;
  documentUploads: DocumentUploadsData | null;
  standardQuestionnaires: StandardQuestionnairesData | null;
  digitalAttestation: DigitalAttestationData | null;
  optionalPreferences: OptionalPreferencesData | null;
}

export interface PersonalIdentifiersData {
  legalFirstName: string;
  legalMiddleName: string;
  legalLastName: string;
  dba: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ProfessionalInformationData {
  specialty: string;
  subspecialty: string;
  boardCertified: string;
  boardName: string;
  certificationDate: string;
  recertificationDate: string;
  yearsOfExperience: string;
  medicalSchool: string;
  graduationYear: string;
  residencyProgram: string;
  residencyCompletionYear: string;
  fellowshipProgram: string;
  fellowshipCompletionYear: string;
}

export interface License {
  id: string;
  state: string;
  licenseNumber: string;
  issueDate: string;
  expirationDate: string;
  status: string;
}

export interface LicensureData {
  licenses: License[];
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  url: string;
}

export interface DocumentUploadsData {
  cv: UploadedDocument | null;
  npdbReport: UploadedDocument | null;
  deaCertificate: UploadedDocument | null;
  boardCertificates: UploadedDocument[];
  otherDocuments: UploadedDocument[];
}

export interface QuestionnaireAnswer {
  questionId: string;
  answer: string;
  details?: string;
}

export interface StandardQuestionnairesData {
  facilityQuestionnaire: QuestionnaireAnswer[];
  insuranceQuestionnaire: QuestionnaireAnswer[];
}

export interface DigitalAttestationData {
  fullLegalName: string;
  attestationDate: string;
  timestamp: string;
  ipAddress: string;
  deviceInfo: string;
  signatureVersion: string;
  agreed: boolean;
}

export interface OptionalPreferencesData {
  travelPreferences: {
    preferredAirlines: string[];
    seatPreference: string;
    mealPreference: string;
    specialNeeds: string;
  };
  loyaltyPrograms: {
    airline: string;
    number: string;
  }[];
  tsaPrecheck: string;
  globalEntry: string;
  hotelPreferences: {
    preferredBrands: string[];
    roomType: string;
    floorPreference: string;
    specialRequests: string;
  };
  optInThirdPartyServices: boolean;
}

export interface SectionCompletion {
  personalIdentifiers: boolean;
  professionalInformation: boolean;
  licensure: boolean;
  documentUploads: boolean;
  standardQuestionnaires: boolean;
  digitalAttestation: boolean;
  optionalPreferences: boolean;
}
