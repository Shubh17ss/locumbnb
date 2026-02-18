import React, { useState, useEffect } from 'react';

interface License {
  id: string;
  state: string;
  licenseNumber: string;
  issueDate: string;
  expirationDate: string;
  status: string;
}

interface LicensureData {
  licenses: License[];
}

interface LicensureSectionProps {
  data: LicensureData | null;
  onUpdate: (data: LicensureData, isComplete: boolean) => void;
}

const LicensureSection: React.FC<LicensureSectionProps> = ({ data, onUpdate }) => {
  const [licenses, setLicenses] = useState<License[]>(
    data?.licenses || [
      {
        id: '1',
        state: '',
        licenseNumber: '',
        issueDate: '',
        expirationDate: '',
        status: 'Active',
      },
    ]
  );

  const [errors, setErrors] = useState<Record<string, Partial<Record<keyof License, string>>>>({});

  const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  ];

  const LICENSE_STATUS = ['Active', 'Inactive', 'Pending', 'Expired'];

  const validateLicense = (license: License): Partial<Record<keyof License, string>> => {
    const licenseErrors: Partial<Record<keyof License, string>> = {};

    if (!license.state) {
      licenseErrors.state = 'State is required';
    }

    if (!license.licenseNumber.trim()) {
      licenseErrors.licenseNumber = 'License number is required';
    }

    if (!license.expirationDate) {
      licenseErrors.expirationDate = 'Expiration date is required';
    } else {
      const expDate = new Date(license.expirationDate);
      const today = new Date();
      if (expDate < today && license.status === 'Active') {
        licenseErrors.expirationDate = 'Expired license cannot be marked as Active';
      }
    }

    if (!license.status) {
      licenseErrors.status = 'Status is required';
    }

    return licenseErrors;
  };

  const handleLicenseChange = (
    id: string,
    field: keyof License,
    value: string
  ) => {
    const updatedLicenses = licenses.map((license) =>
      license.id === id ? { ...license, [field]: value } : license
    );
    setLicenses(updatedLicenses);

    // Validate the changed license
    const changedLicense = updatedLicenses.find((l) => l.id === id);
    if (changedLicense) {
      const licenseErrors = validateLicense(changedLicense);
      setErrors((prev) => ({ ...prev, [id]: licenseErrors }));
    }
  };

  const addLicense = () => {
    const newLicense: License = {
      id: Date.now().toString(),
      state: '',
      licenseNumber: '',
      issueDate: '',
      expirationDate: '',
      status: 'Active',
    };
    setLicenses([...licenses, newLicense]);
  };

  const removeLicense = (id: string) => {
    if (licenses.length > 1) {
      setLicenses(licenses.filter((license) => license.id !== id));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const checkCompletion = (licensesData: License[]): boolean => {
    if (licensesData.length === 0) return false;

    // At least one license must be complete and valid
    return licensesData.some((license) => {
      const licenseErrors = validateLicense(license);
      return (
        license.state &&
        license.licenseNumber.trim() &&
        license.expirationDate &&
        license.status &&
        Object.keys(licenseErrors).length === 0
      );
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const isComplete = checkCompletion(licenses);
      onUpdate({ licenses }, isComplete);
    }, 500);

    return () => clearTimeout(timer);
  }, [licenses, onUpdate]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Medical Licensure</h3>
        <p className="text-sm text-gray-600">
          Add all active state medical licenses. Multi-state licenses are supported.
        </p>
      </div>

      <div className="space-y-6">
        {licenses.map((license, index) => (
          <div
            key={license.id}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">
                License {index + 1}
              </h4>
              {licenses.length > 1 && (
                <button
                  onClick={() => removeLicense(license.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line mr-1"></i>
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={license.state}
                  onChange={(e) =>
                    handleLicenseChange(license.id, 'state', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">Select State</option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors[license.id]?.state && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors[license.id].state}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={license.licenseNumber}
                  onChange={(e) =>
                    handleLicenseChange(license.id, 'licenseNumber', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  placeholder="e.g., MD123456"
                />
                {errors[license.id]?.licenseNumber && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors[license.id].licenseNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={license.issueDate}
                  onChange={(e) =>
                    handleLicenseChange(license.id, 'issueDate', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={license.expirationDate}
                  onChange={(e) =>
                    handleLicenseChange(license.id, 'expirationDate', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
                {errors[license.id]?.expirationDate && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors[license.id].expirationDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={license.status}
                  onChange={(e) =>
                    handleLicenseChange(license.id, 'status', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {LICENSE_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {errors[license.id]?.status && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors[license.id].status}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addLicense}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-colors whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>
          Add Another License
        </button>
      </div>

      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          <i className="ri-information-line mr-1"></i>
          Enter your active license details. Facilities will verify independently.
        </p>
      </div>
    </div>
  );
};

export { LicensureSection };