import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';

interface PersonalIdentifiersData {
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

interface PersonalIdentifiersSectionProps {
  data: PersonalIdentifiersData | null;
  onUpdate: (data: PersonalIdentifiersData, isComplete: boolean) => void;
}

const EMPTY_DATA: PersonalIdentifiersData = {
  legalFirstName: '',
  legalMiddleName: '',
  legalLastName: '',
  dba: '',
  email: '',
  phone: '',
  alternatePhone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
};

const hasAnyValue = (d: PersonalIdentifiersData | null | undefined) => {
  if (!d) return false;
  return Object.values(d).some((v) => (v ?? '').toString().trim() !== '');
};

const isEffectivelyEmpty = (d: PersonalIdentifiersData) => {
  // Treat "empty" as no meaningful user input yet (so we can safely hydrate/prefill once)
  const keys: (keyof PersonalIdentifiersData)[] = [
    'legalFirstName',
    'legalMiddleName',
    'legalLastName',
    'dba',
    'email',
    'phone',
    'alternatePhone',
    'address',
    'city',
    'state',
    'zipCode',
  ];
  return keys.every((k) => (d[k] ?? '').toString().trim() === '');
};

const PersonalIdentifiersSection: React.FC<PersonalIdentifiersSectionProps> = ({
  data,
  onUpdate,
}) => {
  const initial = useMemo<PersonalIdentifiersData>(() => {
    return data ? { ...EMPTY_DATA, ...data } : { ...EMPTY_DATA };
  }, []); // IMPORTANT: init only once to avoid reset loops

  const [formData, setFormData] = useState<PersonalIdentifiersData>(initial);

  const [errors, setErrors] = useState<
    Partial<Record<keyof PersonalIdentifiersData, string>>
  >({});

  // Prevent "save -> parent reloads data -> child resets fields" loop
  const hydratedFromDbRef = useRef(false);
  const dirtyRef = useRef(false);

  // Hydrate once from DB when data arrives (ONLY if user hasn't typed yet)
  useEffect(() => {
    if (!data || !hasAnyValue(data)) return;

    // If user already typed, do not overwrite their in-progress edits
    if (dirtyRef.current) return;

    // Hydrate only once OR when the form is still empty
    if (!hydratedFromDbRef.current || isEffectivelyEmpty(formData)) {
      setFormData({ ...EMPTY_DATA, ...data });
      hydratedFromDbRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const validateField = (name: keyof PersonalIdentifiersData, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return '';
      case 'phone': {
        const digits = value.replace(/\D/g, '');
        if (!value) return 'Phone number is required';
        if (!/^\d{10}$/.test(digits)) return 'Invalid phone number';
        return '';
      }
      case 'legalFirstName':
      case 'legalLastName':
        if (!value.trim()) return 'This field is required';
        return '';
      case 'address':
      case 'city':
      case 'state':
      case 'zipCode':
        if (!value.trim()) return 'This field is required';
        return '';
      default:
        return '';
    }
  };

  const checkCompletion = (d: PersonalIdentifiersData): boolean => {
    const requiredFields: (keyof PersonalIdentifiersData)[] = [
      'legalFirstName',
      'legalLastName',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'zipCode',
    ];

    return requiredFields.every((field) => {
      const value = (d[field] ?? '').toString();
      return value.trim() !== '' && !validateField(field, value);
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    dirtyRef.current = true;

    setFormData((prev) => {
      const next = { ...prev, [name]: value } as PersonalIdentifiersData;
      return next;
    });

    const error = validateField(name as keyof PersonalIdentifiersData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // ✅ Auto-save to parent (debounced)
  // This is what makes the section actually persist.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const isComplete = checkCompletion(formData);
      onUpdate(formData, isComplete);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [formData, onUpdate]);

  // Pre-fill name and email from Google OAuth if available (only if form is still empty for those)
  useEffect(() => {
    const prefillFromAuth = async () => {
      // If DB data exists, do not prefill
      if (data && (data.legalFirstName || data.email)) return;

      // If user already typed, do not prefill
      if (dirtyRef.current) return;

      // If form already has name/email, skip
      if (formData.legalFirstName || formData.email) return;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const updates: Partial<PersonalIdentifiersData> = {};

        const fullName =
          user.user_metadata?.full_name || user.user_metadata?.name || '';

        if (fullName) {
          const nameParts = fullName.trim().split(/\s+/);
          if (nameParts.length === 1) {
            updates.legalFirstName = nameParts[0];
          } else if (nameParts.length === 2) {
            updates.legalFirstName = nameParts[0];
            updates.legalLastName = nameParts[1];
          } else if (nameParts.length >= 3) {
            updates.legalFirstName = nameParts[0];
            updates.legalMiddleName = nameParts.slice(1, -1).join(' ');
            updates.legalLastName = nameParts[nameParts.length - 1];
          }
        }

        if (user.email) updates.email = user.email;

        if (Object.keys(updates).length > 0) {
          setFormData((prev) => ({ ...prev, ...updates }));
        }
      } catch (error) {
        console.error('Error prefilling from auth:', error);
      }
    };

    const t = window.setTimeout(prefillFromAuth, 800);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Personal Identifiers</h3>
        <p className="text-sm text-gray-600">
          Provide your legal name and contact information as they appear on official documents.
        </p>
      </div>

      <div className="space-y-6">
        {/* Legal Name */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Legal Name</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="legalFirstName"
                value={formData.legalFirstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="John"
              />
              {errors.legalFirstName && (
                <p className="text-xs text-red-600 mt-1">{errors.legalFirstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                name="legalMiddleName"
                value={formData.legalMiddleName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Michael"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="legalLastName"
                value={formData.legalLastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Smith"
              />
              {errors.legalLastName && (
                <p className="text-xs text-red-600 mt-1">{errors.legalLastName}</p>
              )}
            </div>
          </div>
        </div>

        {/* DBA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            DBA (Doing Business As)
          </label>
          <input
            type="text"
            name="dba"
            value={formData.dba}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Optional - if applicable"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter your business name if you operate under a different name
          </p>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="john.smith@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="(555) 123-4567"
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternate Phone
              </label>
              <input
                type="tel"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="(555) 987-6543"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Mailing Address</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="123 Main Street, Apt 4B"
              />
              {errors.address && (
                <p className="text-xs text-red-600 mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="San Francisco"
                />
                {errors.city && (
                  <p className="text-xs text-red-600 mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select State</option>
                  {US_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-xs text-red-600 mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="94102"
                  maxLength={10}
                />
                {errors.zipCode && (
                  <p className="text-xs text-red-600 mt-1">{errors.zipCode}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          <i className="ri-information-line mr-1"></i>
          Information is self-reported and not verified by the platform. Facilities will verify independently.
        </p>
      </div>
    </div>
  );
};

export { PersonalIdentifiersSection };
export default PersonalIdentifiersSection;
