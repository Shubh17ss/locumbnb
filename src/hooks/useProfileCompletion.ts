import { useState, useEffect } from 'react';
import { PhysicianProfile, ProfileCompletionStatus } from '../types/profile';
import { supabase } from '../utils/supabaseClient';

export const useProfileCompletion = () => {
  const [profile, setProfile] = useState<PhysicianProfile | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const calculateCompletion = (status: ProfileCompletionStatus): number => {
    const sections = Object.values(status);
    const completedSections = sections.filter(Boolean).length;
    return Math.round((completedSections / sections.length) * 100);
  };

  const checkProfileComplete = (status: ProfileCompletionStatus): boolean => {
    return Object.values(status).every(Boolean);
  };

  const cleanDigits = (v: any) => String(v ?? '').replace(/\D/g, '');
  const cleanNpi = (v: any) => cleanDigits(v).slice(0, 10);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('No authenticated user');
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      const { data, error: fetchError } = await supabase
        .from('physician_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (data) {
        const hasProfessionalInfo =
          !!data.npi_number ||
          !!data.dea_number ||
          !!data.specialty ||
          !!data.subspecialty ||
          (data.years_experience !== null && data.years_experience !== undefined && data.years_experience !== '') ||
          typeof data.board_certified === 'boolean' ||
          !!data.board_certification_details;

        const profileData: PhysicianProfile = {
          userId: data.user_id,
          personalIdentifiers: data.first_name
            ? {
                firstName: data.first_name,
                middleName: data.middle_name,
                lastName: data.last_name,
                email: data.email,
                dateOfBirth: data.date_of_birth,
                ssnLastFour: data.ssn_last_four,
                phoneNumber: data.phone_number,
                address: {
                  line1: data.address_line1,
                  line2: data.address_line2,
                  city: data.city,
                  state: data.state,
                  zipCode: data.zip_code,
                },
              }
            : null,

          professionalInformation: hasProfessionalInfo
            ? {
                // ✅ ALWAYS treat NPI as string digits for React inputs
                npiNumber: data.npi_number ? String(data.npi_number) : '',
                deaNumber: data.dea_number || '',
                specialty: data.specialty || '',
                subspecialty: data.subspecialty || '',
                yearsExperience: data.years_experience ?? '',
                boardCertified: typeof data.board_certified === 'boolean' ? data.board_certified : null,
                boardCertificationDetails: data.board_certification_details || '',
              }
            : null,

          travelPreferences: data.travel_preferences || null,
          licenses: data.licenses || [],
          documents: data.documents || [],
          questionnaires: data.questionnaires || [],
          digitalSignature: data.digital_signature
            ? {
                signature: data.digital_signature,
                timestamp: data.signature_timestamp,
                ipAddress: data.signature_ip,
                attestationAgreed: data.attestation_agreed,
              }
            : null,

          completionStatus: (() => {
            const rawStatus = data.completion_status || {};
            return {
              personalIdentifiers: rawStatus.personalIdentifiers || false,
              professionalInformation: rawStatus.professionalInformation || false,
              licensure: rawStatus.licensure || false,
              documentUploads: rawStatus.documentUploads || false,
              questionnaires: rawStatus.standardQuestionnaires || rawStatus.questionnaires || false,
              digitalSignature: rawStatus.digitalAttestation || rawStatus.digitalSignature || false,
            };
          })(),

          isComplete: data.is_complete || false,
          lastUpdated: data.updated_at,
        };

        setProfile(profileData);
        setCompletionPercentage(data.completion_percentage || 0);
      } else {
        const newProfile: PhysicianProfile = {
          userId: user.id,
          personalIdentifiers: null,
          professionalInformation: null,
          travelPreferences: null,
          licenses: [],
          documents: [],
          questionnaires: [],
          digitalSignature: null,
          completionStatus: {
            personalIdentifiers: false,
            professionalInformation: false,
            licensure: false,
            documentUploads: false,
            questionnaires: false,
            digitalSignature: false,
          },
          isComplete: false,
          lastUpdated: new Date().toISOString(),
        };

        console.log('Creating new profile in database for user:', user.id);
        const { error: insertError } = await supabase
          .from('physician_profiles')
          .insert({
            user_id: user.id,
            completion_status: newProfile.completionStatus,
            is_complete: false,
            completion_percentage: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          console.log('New profile created successfully');
        }

        setProfile(newProfile);
        setCompletionPercentage(0);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const updateCompletionStatus = async (
    section: keyof ProfileCompletionStatus,
    isComplete: boolean
  ) => {
    if (!isAuthenticated) {
      console.warn('Cannot update completion status: User not authenticated');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user found when updating completion status');
        return;
      }

      const currentStatus = profile?.completionStatus || {
        personalIdentifiers: false,
        professionalInformation: false,
        licensure: false,
        documentUploads: false,
        questionnaires: false,
        digitalSignature: false,
      };

      const newStatus = { ...currentStatus, [section]: isComplete };

      const dbStatus: any = { ...newStatus };
      if (section === 'questionnaires') dbStatus.standardQuestionnaires = isComplete;
      if (section === 'digitalSignature') dbStatus.digitalAttestation = isComplete;

      const isProfileComplete = checkProfileComplete(newStatus);
      const percentage = calculateCompletion(newStatus);

      console.log('Updating completion status:', { section, isComplete, newStatus, isProfileComplete, percentage });

      const { error: updateError } = await supabase
        .from('physician_profiles')
        .upsert(
          {
            user_id: user.id,
            completion_status: dbStatus,
            is_complete: isProfileComplete,
            completion_percentage: percentage,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (updateError) {
        console.error('Error updating completion status:', updateError);
        return;
      }

      console.log('Completion status updated successfully');

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              completionStatus: newStatus,
              isComplete: isProfileComplete,
              lastUpdated: new Date().toISOString(),
            }
          : null
      );
      setCompletionPercentage(percentage);
    } catch (err) {
      console.error('Error in updateCompletionStatus:', err);
    }
  };

  const updateProfile = async (updates: Partial<PhysicianProfile>) => {
    if (!isAuthenticated) {
      console.warn('Cannot update profile: User not authenticated');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user found when updating profile');
        return;
      }

      const dbUpdates: any = {
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (updates.personalIdentifiers) {
        const pi: any = updates.personalIdentifiers;

        if (pi.legalFirstName || pi.firstName || pi.first_name) {
          dbUpdates.first_name = pi.legalFirstName || pi.firstName || pi.first_name;
        }
        if (pi.legalMiddleName || pi.middleName || pi.middle_name) {
          dbUpdates.middle_name = pi.legalMiddleName || pi.middleName || pi.middle_name;
        }
        if (pi.legalLastName || pi.lastName || pi.last_name) {
          dbUpdates.last_name = pi.legalLastName || pi.lastName || pi.last_name;
        }
        if (pi.dateOfBirth || pi.date_of_birth) {
          dbUpdates.date_of_birth = pi.dateOfBirth || pi.date_of_birth;
        }
        if (pi.ssnLastFour || pi.ssn_last_four) {
          dbUpdates.ssn_last_four = pi.ssnLastFour || pi.ssn_last_four;
        }
        if (pi.phone || pi.phoneNumber || pi.phone_number) {
          dbUpdates.phone_number = pi.phone || pi.phoneNumber || pi.phone_number;
        }
        if (pi.email) {
          dbUpdates.email = pi.email;
        }

        if (pi.address && typeof pi.address === 'object') {
          if (pi.address.line1 || pi.address.address) {
            dbUpdates.address_line1 = pi.address.line1 || pi.address.address;
          }
          if (pi.address.line2) {
            dbUpdates.address_line2 = pi.address.line2;
          }
          if (pi.address.city) {
            dbUpdates.city = pi.address.city;
          }
          if (pi.address.state) {
            dbUpdates.state = pi.address.state;
          }
          if (pi.address.zipCode || pi.address.zip || pi.address.zip_code) {
            dbUpdates.zip_code = pi.address.zipCode || pi.address.zip || pi.address.zip_code;
          }
        } else {
          if (pi.address) dbUpdates.address_line1 = pi.address;
          if (pi.city) dbUpdates.city = pi.city;
          if (pi.state) dbUpdates.state = pi.state;
          if (pi.zipCode || pi.zip_code) dbUpdates.zip_code = pi.zipCode || pi.zip_code;
        }
      }

      if (updates.professionalInformation) {
        const pi: any = updates.professionalInformation;

        // ✅ FIX: normalize + save NPI reliably
        const npi = cleanNpi(pi.npiNumber ?? pi.npi_number);
        if (npi.length > 0) {
          dbUpdates.npi_number = npi; // store as string digits
        }

        const dea = String(pi.deaNumber ?? pi.dea_number ?? '').trim();
        if (dea) dbUpdates.dea_number = dea;

        const specialty = String(pi.specialty ?? '').trim();
        if (specialty) dbUpdates.specialty = specialty;

        const subspecialty = String(pi.subspecialty ?? '').trim();
        if (subspecialty) dbUpdates.subspecialty = subspecialty;

        const years = String(pi.yearsExperience ?? pi.years_experience ?? '').trim();
        if (years !== '') dbUpdates.years_experience = years;

        if (typeof pi.boardCertified === 'boolean') {
          dbUpdates.board_certified = pi.boardCertified;
        } else if (typeof pi.board_certified === 'boolean') {
          dbUpdates.board_certified = pi.board_certified;
        }

        const details = String(pi.boardCertificationDetails ?? pi.board_certification_details ?? '').trim();
        if (details) dbUpdates.board_certification_details = details;
      }

      if ((updates as any).optionalPreferences) {
        dbUpdates.travel_preferences = (updates as any).optionalPreferences;
      }

      if (updates.licenses) dbUpdates.licenses = updates.licenses;
      if (updates.documents) dbUpdates.documents = updates.documents;
      if (updates.questionnaires) dbUpdates.questionnaires = updates.questionnaires;

      if (updates.digitalSignature) {
        dbUpdates.digital_signature = updates.digitalSignature.signature;
        dbUpdates.signature_timestamp = updates.digitalSignature.timestamp;
        dbUpdates.signature_ip = updates.digitalSignature.ipAddress;
        dbUpdates.attestation_agreed = updates.digitalSignature.attestationAgreed;
      }

      console.log('Saving profile updates:', dbUpdates);

      const { error: updateError } = await supabase
        .from('physician_profiles')
        .upsert(dbUpdates, { onConflict: 'user_id' });

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return;
      }

      console.log('Profile updated successfully');

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              ...updates,
              lastUpdated: new Date().toISOString(),
            }
          : null
      );
    } catch (err) {
      console.error('Error in updateProfile:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    completionPercentage,
    updateCompletionStatus,
    updateProfile,
    isProfileComplete: profile?.isComplete || false,
    loading,
    error,
    refetch: fetchProfile,
    isAuthenticated,
  };
};