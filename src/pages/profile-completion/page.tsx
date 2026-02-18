import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PersonalIdentifiersSection } from './components/PersonalIdentifiersSection';
import { ProfessionalInformationSection } from './components/ProfessionalInformationSection';
import { LicensureSection } from './components/LicensureSection';
import { DocumentUploadsSection } from './components/DocumentUploadsSection';
import { StandardQuestionnairesSection } from './components/StandardQuestionnairesSection';
import { DigitalAttestationSection } from './components/DigitalAttestationSection';
import { OptionalPreferencesSection } from './components/OptionalPreferencesSection';

import { useProfileCompletion } from '../../hooks/useProfileCompletion';
import { supabase } from '../../utils/supabaseClient';

type SectionId =
  | 'personalIdentifiers'
  | 'professionalInformation'
  | 'licensure'
  | 'documentUploads'
  | 'questionnaires'
  | 'digitalSignature'
  | 'optionalPreferences';

interface ProfileData {
  personalIdentifiers: any;
  professionalInformation: any;
  licensure: any;
  documentUploads: any;
  questionnaires: any;
  digitalSignature: any;
  optionalPreferences: any;
}

interface SectionCompletion {
  personalIdentifiers: boolean;
  professionalInformation: boolean;
  licensure: boolean;
  documentUploads: boolean;
  questionnaires: boolean;
  digitalSignature: boolean;
  optionalPreferences: boolean;
}

// Normalize profile.personalIdentifiers into the form fields PersonalIdentifiersSection expects.
// IMPORTANT: supports BOTH shapes:
// 1) DB-loaded shape from useProfileCompletion.fetchProfile(): { firstName, lastName, phoneNumber, address: { line1, city... } }
// 2) locally-updated shape from section autosave: { legalFirstName, legalLastName, phone, address: "string", city, state, zipCode }
function normalizePersonalIdentifiers(pi: any) {
  if (!pi) return null;

  const addressFromObject =
    pi.address && typeof pi.address === 'object'
      ? {
          address: pi.address.line1 ?? '',
          city: pi.address.city ?? '',
          state: pi.address.state ?? '',
          zipCode: pi.address.zipCode ?? '',
        }
      : null;

  const addressFromFlat =
    pi.address && typeof pi.address === 'string'
      ? {
          address: pi.address,
          city: pi.city ?? '',
          state: pi.state ?? '',
          zipCode: pi.zipCode ?? pi.zip_code ?? '',
        }
      : {
          address: pi.address ?? '',
          city: pi.city ?? '',
          state: pi.state ?? '',
          zipCode: pi.zipCode ?? pi.zip_code ?? '',
        };

  return {
    legalFirstName: pi.legalFirstName ?? pi.firstName ?? pi.first_name ?? '',
    legalMiddleName: pi.legalMiddleName ?? pi.middleName ?? pi.middle_name ?? '',
    legalLastName: pi.legalLastName ?? pi.lastName ?? pi.last_name ?? '',
    dba: pi.dba ?? '',
    email: pi.email ?? '',
    phone: pi.phone ?? pi.phoneNumber ?? pi.phone_number ?? '',
    alternatePhone: pi.alternatePhone ?? '',
    ...(addressFromObject ?? addressFromFlat),
  };
}

// Normalize professionalInformation into the shape ProfessionalInformationSection expects.
// Supports BOTH camelCase (UI) and snake_case (DB)
function normalizeProfessionalInformation(pi: any) {
  if (!pi) return null;

  return {
    npiNumber: pi.npiNumber ?? pi.npi_number ?? '',
    deaNumber: pi.deaNumber ?? pi.dea_number ?? '',
    specialty: pi.specialty ?? '',
    subspecialty: pi.subspecialty ?? '',
    yearsExperience: pi.yearsExperience ?? pi.years_experience ?? '',
    boardCertified: pi.boardCertified ?? pi.board_certified ?? null,
    boardCertificationDetails: pi.boardCertificationDetails ?? pi.board_certification_details ?? '',
  };
}

export default function ProfileCompletionPage() {
  const navigate = useNavigate();
  const { profile, updateProfile, updateCompletionStatus, refetch } = useProfileCompletion();

  const [profileData, setProfileData] = useState<ProfileData>({
    personalIdentifiers: null,
    professionalInformation: null,
    licensure: null,
    documentUploads: null,
    questionnaires: null,
    digitalSignature: null,
    optionalPreferences: null,
  });

  const [sectionCompletion, setSectionCompletion] = useState<SectionCompletion>({
    personalIdentifiers: false,
    professionalInformation: false,
    licensure: false,
    documentUploads: false,
    questionnaires: false,
    digitalSignature: false,
    optionalPreferences: true, // optional
  });

  const [activeSection, setActiveSection] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const sections = useMemo(
    () =>
      [
        { id: 'personalIdentifiers', name: 'Personal Identifiers', icon: 'ri-user-line', required: true },
        { id: 'professionalInformation', name: 'Professional Information', icon: 'ri-stethoscope-line', required: true },
        { id: 'licensure', name: 'Licensure', icon: 'ri-shield-check-line', required: true },
        { id: 'documentUploads', name: 'Document Uploads', icon: 'ri-file-upload-line', required: true },
        { id: 'questionnaires', name: 'Standard Questionnaires', icon: 'ri-questionnaire-line', required: true },
        { id: 'digitalSignature', name: 'Digital Attestation & Signature', icon: 'ri-quill-pen-line', required: true },
        { id: 'optionalPreferences', name: 'Travel & Accommodation Preferences', icon: 'ri-flight-takeoff-line', required: false },
      ] as { id: SectionId; name: string; icon: string; required: boolean }[],
    []
  );

  const calculateProgress = (): number => {
    const requiredSections = sections.filter((s) => s.required);
    const completedRequiredSections = requiredSections.filter((s) => sectionCompletion[s.id]).length;
    return Math.round((completedRequiredSections / requiredSections.length) * 100);
  };

  // Auth + role
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate('/login', { replace: true });
        return;
      }

      // Get role safely (avoid 406 single())
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.warn('Role lookup error (non-fatal):', error);
      }

      const role = userData?.role || session.user.user_metadata?.role;
      setUserRole(role);
    };

    checkAuth();
  }, [navigate]);

  // Load existing profile data into the page state
  useEffect(() => {
    if (!profile) return;

    const transformedPersonalIdentifiers = normalizePersonalIdentifiers(profile.personalIdentifiers);
    const transformedProfessionalInformation = normalizeProfessionalInformation(profile.professionalInformation);

    setProfileData({
      personalIdentifiers: transformedPersonalIdentifiers,
      professionalInformation: transformedProfessionalInformation,
      licensure: profile.licenses,
      documentUploads: profile.documents,
      questionnaires: profile.questionnaires,
      digitalSignature: profile.digitalSignature,
      optionalPreferences: (profile as any).travelPreferences || null,
    });

    // profile.completionStatus keys (from useProfileCompletion) are:
    // personalIdentifiers, professionalInformation, licensure, documentUploads, questionnaires, digitalSignature
    setSectionCompletion({
      personalIdentifiers: !!profile.completionStatus?.personalIdentifiers,
      professionalInformation: !!profile.completionStatus?.professionalInformation,
      licensure: !!profile.completionStatus?.licensure,
      documentUploads: !!profile.completionStatus?.documentUploads,
      questionnaires: !!profile.completionStatus?.questionnaires,
      digitalSignature: !!profile.completionStatus?.digitalSignature,
      optionalPreferences: true,
    });
  }, [profile]);

  const handleSectionUpdate = async (sectionId: SectionId, data: any, isComplete: boolean, skipSave = false) => {
    setProfileData((prev) => ({ ...prev, [sectionId]: data }));
    setSectionCompletion((prev) => ({ ...prev, [sectionId]: isComplete }));

    // Skip DB write when called from hydration (data already exists in DB)
    if (skipSave) return;

    try {
      const updates: any = {};

      if (sectionId === 'personalIdentifiers') updates.personalIdentifiers = data;
      if (sectionId === 'professionalInformation') updates.professionalInformation = data;
      if (sectionId === 'licensure') updates.licenses = data;
      if (sectionId === 'documentUploads') updates.documents = data;
      if (sectionId === 'questionnaires') updates.questionnaires = data;
      if (sectionId === 'digitalSignature') updates.digitalSignature = data;
      if (sectionId === 'optionalPreferences') updates.optionalPreferences = data;

      await updateProfile(updates);
      if (sectionId !== 'optionalPreferences') {
        await updateCompletionStatus(sectionId as any, isComplete);
      }
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleNext = async () => {
    // ✅ DO NOT force completion to false.
    // If you want an extra “last save”, do it using the current completion state.
    const currentSectionId = sections[activeSection].id;
    const currentData = profileData[currentSectionId];
    const currentComplete = sectionCompletion[currentSectionId];

    if (currentData) {
      await handleSectionUpdate(currentSectionId, currentData, currentComplete);
    }

    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveAndExit = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsSaving(false);

    if (userRole === 'facility') navigate('/facility-dashboard', { replace: true });
    else navigate('/physician-dashboard', { replace: true });
  };

  const handleSubmitProfile = async () => {
    const progress = calculateProgress();
    if (progress !== 100) return;

    setIsSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error('No user found when submitting profile');
        setIsSaving(false);
        return;
      }

      await supabase
        .from('physician_profiles')
        .update({
          is_complete: true,
          completion_percentage: 100,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      await refetch();

      sessionStorage.removeItem('oauth_login_completed');

      setIsSaving(false);

      if (userRole === 'facility') navigate('/facility-dashboard', { replace: true });
      else navigate('/physician-dashboard', { replace: true });
    } catch (error) {
      console.error('Error submitting profile:', error);
      setIsSaving(false);
    }
  };

  const progress = calculateProgress();
  const currentSection = sections[activeSection];
  const isLastSection = activeSection === sections.length - 1;
  const canSubmit = progress === 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete your professional profile</h1>
              <p className="text-sm text-gray-600 mt-1">
                This information is required before you can apply to assignments.
              </p>
            </div>

            <button
              onClick={handleSaveAndExit}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'Save & Exit'}
            </button>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile completion: {progress}%</span>
              <span className="text-sm text-gray-500">
                {sections.filter((s) => s.required).filter((s) => sectionCompletion[s.id]).length}/
                {sections.filter((s) => s.required).length} required sections complete
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Sections</h2>

              <nav className="space-y-1">
                {sections.map((section, index) => {
                  const completed = sectionCompletion[section.id];

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(index)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors cursor-pointer ${
                        index === activeSection ? 'bg-teal-50 border border-teal-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* Green Checkmark for completed sections */}
                      <div
                        className={`w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 ${
                          completed
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      >
                        {completed && <i className="ri-check-line text-white text-lg"></i>}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-medium truncate ${
                            index === activeSection ? 'text-teal-700' : 'text-gray-900'
                          }`}>
                            {section.name}
                          </span>
                          {!section.required && <span className="text-xs text-blue-600 flex-shrink-0">Optional</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Section Content */}
          <div className="lg:col-span-3">
            {currentSection.id === 'personalIdentifiers' && (
              <PersonalIdentifiersSection
                data={profileData.personalIdentifiers}
                onUpdate={(data, isComplete) => handleSectionUpdate('personalIdentifiers', data, isComplete)}
              />
            )}

            {currentSection.id === 'professionalInformation' && (
              <ProfessionalInformationSection
                data={profileData.professionalInformation}
                onUpdate={(data, isComplete, skipSave) => handleSectionUpdate('professionalInformation', data, isComplete, skipSave)}
              />
            )}

            {currentSection.id === 'licensure' && (
              <LicensureSection
                data={profileData.licensure}
                onUpdate={(data, isComplete) => handleSectionUpdate('licensure', data, isComplete)}
              />
            )}

            {currentSection.id === 'documentUploads' && (
              <DocumentUploadsSection
                data={profileData.documentUploads}
                onUpdate={(data, isComplete) => handleSectionUpdate('documentUploads', data, isComplete)}
              />
            )}

            {currentSection.id === 'questionnaires' && (
              <StandardQuestionnairesSection
                data={profileData.questionnaires}
                onUpdate={(data, isComplete) => handleSectionUpdate('questionnaires', data, isComplete)}
              />
            )}

            {currentSection.id === 'digitalSignature' && (
              <DigitalAttestationSection
                data={profileData.digitalSignature}
                onUpdate={(data, isComplete) => handleSectionUpdate('digitalSignature', data, isComplete)}
              />
            )}

            {currentSection.id === 'optionalPreferences' && (
              <OptionalPreferencesSection
                data={profileData.optionalPreferences}
                onUpdate={(data, isComplete) => handleSectionUpdate('optionalPreferences', data, isComplete)}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handlePrevious}
                disabled={activeSection === 0}
                className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeSection === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Previous
              </button>

              {!isLastSection ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Next
                  <i className="ri-arrow-right-line ml-2"></i>
                </button>
              ) : (
                <button
                  onClick={handleSubmitProfile}
                  disabled={!canSubmit || isSaving}
                  className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    !canSubmit || isSaving
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  {isSaving ? 'Submitting...' : 'Submit Profile'}
                  <i className="ri-check-line ml-2"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}