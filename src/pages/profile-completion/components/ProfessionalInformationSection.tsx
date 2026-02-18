import React, { useEffect, useMemo, useRef, useState } from 'react';

interface ProfessionalInformationData {
  npiNumber: string;
  deaNumber: string;
  specialty: string;
  subspecialty: string;
  yearsExperience: string;
  boardCertified: boolean | null;
  boardCertificationDetails: string;
}

interface ProfessionalInformationSectionProps {
  data: ProfessionalInformationData | null;
  onUpdate: (data: ProfessionalInformationData, isComplete: boolean, skipSave?: boolean) => void;
}

const EMPTY_DATA: ProfessionalInformationData = {
  npiNumber: '',
  deaNumber: '',
  specialty: '',
  subspecialty: '',
  yearsExperience: '',
  boardCertified: null,
  boardCertificationDetails: '',
};

const SPECIALTIES = [
  'Anesthesiology',
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Family Medicine',
  'Gastroenterology',
  'General Surgery',
  'Hematology',
  'Hospitalist',
  'Infectious Disease',
  'Internal Medicine',
  'Nephrology',
  'Neurology',
  'Neurosurgery',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedic Surgery',
  'Otolaryngology',
  'Pathology',
  'Pediatrics',
  'Physical Medicine & Rehabilitation',
  'Plastic Surgery',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Rheumatology',
  'Urology',
  'Other',
];

const onlyDigits = (v: string) => v.replace(/\D/g, '');
const clampNpi = (v: string) => onlyDigits(v).slice(0, 10);

const ProfessionalInformationSection: React.FC<ProfessionalInformationSectionProps> = ({
  data,
  onUpdate,
}) => {
  const initial = useMemo<ProfessionalInformationData>(() => {
    return data ? { ...EMPTY_DATA, ...data } : { ...EMPTY_DATA };
  }, []);

  const [formData, setFormData] = useState<ProfessionalInformationData>(initial);
  const dirtyRef = useRef(false);

  // Hydrate once from parent data (don't overwrite user typing)
  useEffect(() => {
    if (!data) return;
    if (dirtyRef.current) return;
    const hydrated = { ...EMPTY_DATA, ...data };
    setFormData(hydrated);
    // Notify parent of completion status after hydrating from DB (skipSave=true so no redundant DB write)
    const isComplete = validate(hydrated);
    onUpdate(hydrated, isComplete, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const validate = (d: ProfessionalInformationData) => {
    const npi = clampNpi(d.npiNumber);
    if (!npi) return false; // required
    if (!d.specialty?.trim()) return false;
    if (String(d.yearsExperience ?? '').trim() === '') return false;
    if (d.boardCertified !== true && d.boardCertified !== false) return false;
    if (d.boardCertified === true && !d.boardCertificationDetails.trim()) return false;
    return true;
  };

  // ✅ IMPORTANT: This updates parent immediately (no waiting 400ms)
  const updateField = <K extends keyof ProfessionalInformationData>(
    key: K,
    value: ProfessionalInformationData[K]
  ) => {
    dirtyRef.current = true;

    setFormData((prev) => {
      const next: ProfessionalInformationData = {
        ...prev,
        [key]: value,
      } as ProfessionalInformationData;

      // If they switch Board Certified to "No", clear details
      if (key === 'boardCertified' && value === false) {
        next.boardCertificationDetails = '';
      }

      const isComplete = validate(next);
      onUpdate(next, isComplete); // ✅ immediate push to parent
      return next;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Professional Information</h3>
        <p className="text-sm text-gray-600">
          Provide your identifiers and specialty information (used for credentialing).
        </p>
      </div>

      <div className="space-y-6">
        {/* Identifiers */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Identifiers</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NPI Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={formData.npiNumber}
                onChange={(e) => updateField('npiNumber', clampNpi(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="10-digit NPI"
              />
              <p className="text-xs text-gray-500 mt-1">Digits only (10 max). Saved as you type.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DEA Number</label>
              <input
                type="text"
                value={formData.deaNumber}
                onChange={(e) => updateField('deaNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        {/* Specialty */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Specialty</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Specialty <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.specialty}
                onChange={(e) => updateField('specialty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Specialty</option>
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subspecialty</label>
              <input
                type="text"
                value={formData.subspecialty}
                onChange={(e) => updateField('subspecialty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        {/* Experience + Board */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Experience & Board Certification</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.yearsExperience}
                onChange={(e) => updateField('yearsExperience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 7"
                min={0}
                max={80}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Board Certified? <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.boardCertified === null ? '' : formData.boardCertified ? 'yes' : 'no'}
                onChange={(e) => {
                  if (e.target.value === '') updateField('boardCertified', null);
                  else updateField('boardCertified', e.target.value === 'yes');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          {formData.boardCertified === true && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Board Certification Details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.boardCertificationDetails}
                onChange={(e) => updateField('boardCertificationDetails', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., American Board of Pediatrics (PCCM), certified 2019"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ProfessionalInformationSection };
export default ProfessionalInformationSection;