import React, { useState } from 'react';

interface FacilityProfileData {
  organizationName: string;
  facilityType: string;
  taxId: string;
  addresses: {
    id: string;
    type: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    isPrimary: boolean;
  }[];
  contacts: {
    primary: { name: string; email: string; phone: string; };
    billing: { name: string; email: string; phone: string; };
    compliance: { name: string; email: string; phone: string; };
  };
}

export default function FacilityProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<FacilityProfileData>({
    organizationName: 'Memorial Hospital',
    facilityType: 'Acute Care Hospital',
    taxId: '**-***4567',
    addresses: [
      {
        id: '1',
        type: 'Main Campus',
        street: '123 Medical Center Drive',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
        isPrimary: true
      }
    ],
    contacts: {
      primary: {
        name: 'John Administrator',
        email: 'john.admin@memorial.com',
        phone: '(555) 123-4567'
      },
      billing: {
        name: 'Sarah Finance',
        email: 'sarah.finance@memorial.com',
        phone: '(555) 123-4568'
      },
      compliance: {
        name: 'Michael Compliance',
        email: 'michael.compliance@memorial.com',
        phone: '(555) 123-4569'
      }
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Facility Profile</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your organization details and contacts</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
          >
            <i className="ri-edit-line mr-2"></i>
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-300 whitespace-nowrap"
            >
              {isSaving ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="ri-save-line mr-2"></i>
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Organization Details */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Organization Details</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.organizationName}
                  onChange={(e) => setProfile({ ...profile, organizationName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.organizationName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facility Type
              </label>
              {isEditing ? (
                <select
                  value={profile.facilityType}
                  onChange={(e) => setProfile({ ...profile, facilityType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option>Acute Care Hospital</option>
                  <option>Critical Access Hospital</option>
                  <option>Specialty Hospital</option>
                  <option>Outpatient Clinic</option>
                  <option>Urgent Care Center</option>
                </select>
              ) : (
                <p className="text-sm text-gray-900">{profile.facilityType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax ID (EIN)
              </label>
              <p className="text-sm text-gray-900">{profile.taxId}</p>
              <p className="text-xs text-gray-500 mt-1">Contact support to update</p>
            </div>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Facility Addresses</h3>
          {isEditing && (
            <button className="px-3 py-1.5 bg-teal-600 text-white text-xs font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
              <i className="ri-add-line mr-1"></i>
              Add Address
            </button>
          )}
        </div>
        <div className="p-6 space-y-4">
          {profile.addresses.map((address) => (
            <div key={address.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{address.type}</span>
                  {address.isPrimary && (
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                {isEditing && (
                  <button className="text-gray-400 hover:text-gray-600">
                    <i className="ri-edit-line"></i>
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700">{address.street}</p>
              <p className="text-sm text-gray-700">{address.city}, {address.state} {address.zip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contacts */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Key Contacts</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Primary Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Primary Administrator</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.contacts.primary.name}
                    onChange={(e) => setProfile({
                      ...profile,
                      contacts: { ...profile.contacts, primary: { ...profile.contacts.primary, name: e.target.value } }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{profile.contacts.primary.name}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.contacts.primary.email}
                    onChange={(e) => setProfile({
                      ...profile,
                      contacts: { ...profile.contacts, primary: { ...profile.contacts.primary, email: e.target.value } }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{profile.contacts.primary.email}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.contacts.primary.phone}
                    onChange={(e) => setProfile({
                      ...profile,
                      contacts: { ...profile.contacts, primary: { ...profile.contacts.primary, phone: e.target.value } }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{profile.contacts.primary.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Billing Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Billing Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.contacts.billing.name}
                    onChange={(e) => setProfile({
                      ...profile,
                      contacts: { ...profile.contacts, billing: { ...profile.contacts.billing, name: e.target.value } }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{profile.contacts.billing.name}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.contacts.billing.email}
                    onChange={(e) => setProfile({
                      ...profile,
                      contacts: { ...profile.contacts, billing: { ...profile.contacts.billing, email: e.target.value } }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{profile.contacts.billing.email}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.contacts.billing.phone}
                    onChange={(e) => setProfile({
                      ...profile,
                      contacts: { ...profile.contacts, billing: { ...profile.contacts.billing, phone: e.target.value } }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{profile.contacts.billing.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Compliance Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Compliance Contact (Optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.contacts.compliance.name}
                    onChange={(e) => setProfile({
                      ...profile,
                      contacts: { ...profile.contacts, compliance: { ...profile.contacts.compliance, name: e.target.value } }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{profile.contacts.compliance.name}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.contacts.compliance.email}
                    onChange={(e) => setProfile({
                      ...profile,
                      contacts: { ...profile.contacts, compliance: { ...profile.contacts.compliance, email: e.target.value } }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{profile.contacts.compliance.email}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.contacts.compliance.phone}
                    onChange={(e) => setProfile({
                      ...profile,
                      contacts: { ...profile.contacts, compliance: { ...profile.contacts.compliance, phone: e.target.value } }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{profile.contacts.compliance.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
