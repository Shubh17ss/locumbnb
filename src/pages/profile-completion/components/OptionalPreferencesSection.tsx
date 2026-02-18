import React, { useState, useEffect } from 'react';

interface OptionalPreferencesData {
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

interface OptionalPreferencesSectionProps {
  data: OptionalPreferencesData | null;
  onUpdate: (data: OptionalPreferencesData, isComplete: boolean) => void;
}

export const OptionalPreferencesSection: React.FC<OptionalPreferencesSectionProps> = ({
  data,
  onUpdate,
}) => {
  const EMPTY_PREFERENCES: OptionalPreferencesData = {
    travelPreferences: {
      preferredAirlines: [],
      seatPreference: '',
      mealPreference: '',
      specialNeeds: '',
    },
    loyaltyPrograms: [],
    tsaPrecheck: '',
    globalEntry: '',
    hotelPreferences: {
      preferredBrands: [],
      roomType: '',
      floorPreference: '',
      specialRequests: '',
    },
    optInThirdPartyServices: false,
  };

  // Deep-merge so partial/missing nested keys from DB never crash the component
  const mergeWithDefaults = (d: any): OptionalPreferencesData => ({
    ...EMPTY_PREFERENCES,
    ...d,
    travelPreferences: {
      ...EMPTY_PREFERENCES.travelPreferences,
      ...(d?.travelPreferences ?? {}),
    },
    hotelPreferences: {
      ...EMPTY_PREFERENCES.hotelPreferences,
      ...(d?.hotelPreferences ?? {}),
    },
    loyaltyPrograms: Array.isArray(d?.loyaltyPrograms) ? d.loyaltyPrograms : [],
  });

  const [preferences, setPreferences] = useState<OptionalPreferencesData>(
    mergeWithDefaults(data)
  );

  const [newLoyaltyProgram, setNewLoyaltyProgram] = useState({ airline: '', number: '' });

  // Re-hydrate if data arrives after initial render (e.g. loaded from DB async)
  const hydratedRef = React.useRef(false);
  useEffect(() => {
    if (!data || hydratedRef.current) return;
    hydratedRef.current = true;
    setPreferences(mergeWithDefaults(data));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const airlineOptions = [
    'American Airlines',
    'Delta Air Lines',
    'United Airlines',
    'Southwest Airlines',
    'JetBlue Airways',
    'Alaska Airlines',
    'Spirit Airlines',
    'Frontier Airlines',
  ];

  const hotelBrandOptions = [
    'Marriott',
    'Hilton',
    'Hyatt',
    'IHG (Holiday Inn, etc.)',
    'Choice Hotels',
    'Wyndham',
    'Best Western',
    'Independent Hotels',
  ];

  const seatPreferences = ['Window', 'Aisle', 'Middle', 'No Preference'];
  const mealPreferences = ['Standard', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal', 'No Preference'];
  const roomTypes = ['King Bed', 'Queen Bed', 'Two Queens', 'Suite', 'No Preference'];
  const floorPreferences = ['High Floor', 'Low Floor', 'Ground Floor', 'No Preference'];

  const handleAirlineToggle = (airline: string) => {
    setPreferences((prev) => {
      const current = prev.travelPreferences.preferredAirlines;
      const updated = current.includes(airline)
        ? current.filter((a) => a !== airline)
        : [...current, airline];
      return {
        ...prev,
        travelPreferences: { ...prev.travelPreferences, preferredAirlines: updated },
      };
    });
  };

  const handleHotelBrandToggle = (brand: string) => {
    setPreferences((prev) => {
      const current = prev.hotelPreferences.preferredBrands;
      const updated = current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand];
      return {
        ...prev,
        hotelPreferences: { ...prev.hotelPreferences, preferredBrands: updated },
      };
    });
  };

  const handleAddLoyaltyProgram = () => {
    if (newLoyaltyProgram.airline.trim() && newLoyaltyProgram.number.trim()) {
      setPreferences((prev) => ({
        ...prev,
        loyaltyPrograms: [...prev.loyaltyPrograms, { ...newLoyaltyProgram }],
      }));
      setNewLoyaltyProgram({ airline: '', number: '' });
    }
  };

  const handleRemoveLoyaltyProgram = (index: number) => {
    setPreferences((prev) => ({
      ...prev,
      loyaltyPrograms: prev.loyaltyPrograms.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    // Optional sections are always "complete" - they don't block profile submission
    onUpdate(preferences, true);
  }, [preferences]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header with Optional Badge */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-gray-900">Travel &amp; Accommodation Preferences</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            OPTIONAL
          </span>
        </div>
        <p className="text-sm text-gray-600">
          These preferences help third‑party vendors provide better service. This information is only
          shared if you opt in to third‑party services.
        </p>
      </div>

      {/* Opt‑In Toggle */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="opt-in-services"
            checked={preferences.optInThirdPartyServices}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, optInThirdPartyServices: e.target.checked }))
            }
            className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-0.5 cursor-pointer"
          />
          <label htmlFor="opt-in-services" className="text-sm text-gray-700 cursor-pointer">
            <strong>I want to share these preferences with third‑party service providers</strong>
            <br />
            <span className="text-xs text-gray-600">
              Your preferences will only be transmitted when you request travel or accommodation
              services for specific assignments.
            </span>
          </label>
        </div>
      </div>

      {/* Travel Preferences */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          <i className="ri-flight-takeoff-line mr-2 text-teal-600"></i>
          Flight Preferences
        </h4>

        {/* Preferred Airlines */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Airlines</label>
          <div className="grid grid-cols-2 gap-2">
            {airlineOptions.map((airline) => (
              <button
                key={airline}
                type="button"
                onClick={() => handleAirlineToggle(airline)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                  preferences.travelPreferences.preferredAirlines.includes(airline)
                    ? 'bg-teal-50 border-teal-500 text-teal-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {preferences.travelPreferences.preferredAirlines.includes(airline) && (
                  <i className="ri-checkbox-circle-fill mr-2"></i>
                )}
                {airline}
              </button>
            ))}
          </div>
        </div>

        {/* Seat Preference */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Seat Preference</label>
          <select
            value={preferences.travelPreferences.seatPreference}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                travelPreferences: { ...prev.travelPreferences, seatPreference: e.target.value },
              }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select preference</option>
            {seatPreferences.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>

        {/* Meal Preference */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Meal Preference</label>
          <select
            value={preferences.travelPreferences.mealPreference}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                travelPreferences: { ...prev.travelPreferences, mealPreference: e.target.value },
              }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select preference</option>
            {mealPreferences.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>

        {/* Special Needs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Travel Needs</label>
          <textarea
            value={preferences.travelPreferences.specialNeeds}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                travelPreferences: { ...prev.travelPreferences, specialNeeds: e.target.value },
              }))
            }
            placeholder="E.g., wheelchair assistance, extra legroom, etc."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          ></textarea>
        </div>
      </div>

      {/* Loyalty Programs */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          <i className="ri-vip-crown-line mr-2 text-teal-600"></i>
          Airline Loyalty Programs
        </h4>

        {/* Existing Programs */}
        {preferences.loyaltyPrograms.length > 0 && (
          <div className="mb-4 space-y-2">
            {preferences.loyaltyPrograms.map((program, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{program.airline}</p>
                  <p className="text-xs text-gray-600">{program.number}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLoyaltyProgram(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <i className="ri-delete-bin-line text-lg"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Program */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={newLoyaltyProgram.airline}
            onChange={(e) => setNewLoyaltyProgram((prev) => ({ ...prev, airline: e.target.value }))}
            placeholder="Airline name"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newLoyaltyProgram.number}
              onChange={(e) => setNewLoyaltyProgram((prev) => ({ ...prev, number: e.target.value }))}
              placeholder="Loyalty number"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={handleAddLoyaltyProgram}
              disabled={!newLoyaltyProgram.airline.trim() || !newLoyaltyProgram.number.trim()}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                newLoyaltyProgram.airline.trim() && newLoyaltyProgram.number.trim()
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <i className="ri-add-line"></i>
            </button>
          </div>
        </div>
      </div>

      {/* TSA PreCheck / Global Entry */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          <i className="ri-shield-check-line mr-2 text-teal-600"></i>
          Trusted Traveler Programs
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">TSA PreCheck Number</label>
            <input
              type="text"
              value={preferences.tsaPrecheck}
              onChange={(e) => setPreferences((prev) => ({ ...prev, tsaPrecheck: e.target.value }))}
              placeholder="Enter TSA PreCheck number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Global Entry Number</label>
            <input
              type="text"
              value={preferences.globalEntry}
              onChange={(e) => setPreferences((prev) => ({ ...prev, globalEntry: e.target.value }))}
              placeholder="Enter Global Entry number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Hotel Preferences */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          <i className="ri-hotel-line mr-2 text-teal-600"></i>
          Hotel Preferences
        </h4>

        {/* Preferred Hotel Brands */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Hotel Brands</label>
          <div className="grid grid-cols-2 gap-2">
            {hotelBrandOptions.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => handleHotelBrandToggle(brand)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                  preferences.hotelPreferences.preferredBrands.includes(brand)
                    ? 'bg-teal-50 border-teal-500 text-teal-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {preferences.hotelPreferences.preferredBrands.includes(brand) && (
                  <i className="ri-checkbox-circle-fill mr-2"></i>
                )}
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Room Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
          <select
            value={preferences.hotelPreferences.roomType}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                hotelPreferences: { ...prev.hotelPreferences, roomType: e.target.value },
              }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select preference</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Floor Preference */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Floor Preference</label>
          <select
            value={preferences.hotelPreferences.floorPreference}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                hotelPreferences: { ...prev.hotelPreferences, floorPreference: e.target.value },
              }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select preference</option>
            {floorPreferences.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
          <textarea
            value={preferences.hotelPreferences.specialRequests}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                hotelPreferences: { ...prev.hotelPreferences, specialRequests: e.target.value },
              }))
            }
            placeholder="E.g., quiet room, away from elevator, hypoallergenic bedding, etc."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          ></textarea>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <i className="ri-information-line mr-1"></i>
          <strong>Privacy Notice:</strong> These preferences are stored securely and will only be
          shared with third‑party service providers when you explicitly request travel or
          accommodation services for a specific assignment. You can update or remove these
          preferences at any time.
        </p>
      </div>
    </div>
  );
};