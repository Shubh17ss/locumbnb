import { useState } from 'react';
import type { ServiceRequest, InsuranceQuote, TravelQuote } from '../../../types/vendor';
import { 
  mockServiceRequests, 
  mockInsuranceQuotes, 
  mockTravelQuotes,
  getServiceRequestsByPhysician,
  getInsuranceQuotesByRequest,
  getTravelQuotesByRequest
} from '../../../mocks/vendors';
import {
  submitInsuranceRequest,
  submitTravelRequest,
  acceptQuote,
  declineQuote
} from '../../../utils/vendorManager';

export default function ThirdPartyServices() {
  const physicianId = 'physician-001'; // Current logged-in physician
  
  const [requests, setRequests] = useState<ServiceRequest[]>(
    getServiceRequestsByPhysician(physicianId)
  );
  const [insuranceQuotes] = useState<InsuranceQuote[]>(mockInsuranceQuotes);
  const [travelQuotes] = useState<TravelQuote[]>(mockTravelQuotes);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [dataOptIn, setDataOptIn] = useState(true);
  const [requestType, setRequestType] = useState<'insurance' | 'travel'>('insurance');
  
  // Insurance request form
  const [insuranceForm, setInsuranceForm] = useState({
    assignmentId: '',
    coverageType: 'Claims-Made',
    coverageAmount: 1000000,
    specialty: 'Emergency Medicine',
    statesLicensed: [] as string[],
    priorClaims: false,
    additionalRequirements: ''
  });

  // Travel request form
  const [travelForm, setTravelForm] = useState({
    assignmentId: '',
    serviceType: 'full_package' as 'flight' | 'hotel' | 'car_rental' | 'full_package',
    departureCity: '',
    destinationCity: '',
    departureDate: '',
    returnDate: '',
    flightClass: 'Economy Plus',
    hotelType: 'Extended Stay',
    carRental: false,
    airlinePreference: '',
    hotelChain: '',
    specialRequests: ''
  });

  /** ------------------------------------------------------------
   *  Handlers
   * ------------------------------------------------------------ */
  const handleAcceptQuote = (quoteId: string, requestId: string, quoteType: 'insurance' | 'travel') => {
    acceptQuote(quoteId, physicianId, requestId);
    
    // Update request status
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'accepted', quoteId, purchasedAt: new Date().toISOString() } : req
    ));

    alert(`Quote accepted! ${quoteType === 'insurance' ? 'Insurance coverage' : 'Travel arrangements'} will be processed.`);
  };

  const handleDeclineQuote = (quoteId: string, quoteType: 'insurance' | 'travel') => {
    const reason = prompt('Optional: Provide a reason for declining this quote');
    declineQuote(quoteId, physicianId, reason || undefined);
    alert('Quote declined. The vendor has been notified.');
  };

  const handleSubmitInsuranceRequest = () => {
    if (!dataOptIn) {
      alert('Please authorize data sharing with approved vendors');
      return;
    }

    if (!insuranceForm.assignmentId) {
      alert('Please select an assignment');
      return;
    }

    const request = submitInsuranceRequest(
      physicianId,
      insuranceForm.assignmentId,
      insuranceForm
    );

    setRequests(prev => [request, ...prev]);
    setShowNewRequestModal(false);
    
    // Reset form
    setInsuranceForm({
      assignmentId: '',
      coverageType: 'Claims-Made',
      coverageAmount: 1000000,
      specialty: 'Emergency Medicine',
      statesLicensed: [],
      priorClaims: false,
      additionalRequirements: ''
    });

    alert('Insurance request submitted! Approved vendors will review your profile and submit quotes within 24-48 hours.');
  };

  const handleSubmitTravelRequest = () => {
    if (!dataOptIn) {
      alert('Please authorize data sharing with approved vendors');
      return;
    }

    if (!travelForm.assignmentId || !travelForm.departureCity || !travelForm.destinationCity) {
      alert('Please fill in all required fields');
      return;
    }

    const request = submitTravelRequest(
      physicianId,
      travelForm.assignmentId,
      {
        serviceType: travelForm.serviceType,
        departureCity: travelForm.departureCity,
        destinationCity: travelForm.destinationCity,
        travelDates: {
          departure: travelForm.departureDate,
          return: travelForm.returnDate
        },
        preferences: {
          flightClass: travelForm.flightClass,
          hotelType: travelForm.hotelType,
          carRental: travelForm.carRental,
          airlinePreference: travelForm.airlinePreference,
          hotelChain: travelForm.hotelChain,
          specialRequests: travelForm.specialRequests
        }
      }
    );

    setRequests(prev => [request, ...prev]);
    setShowNewRequestModal(false);
    
    // Reset form
    setTravelForm({
      assignmentId: '',
      serviceType: 'full_package',
      departureCity: '',
      destinationCity: '',
      departureDate: '',
      returnDate: '',
      flightClass: 'Economy Plus',
      hotelType: 'Extended Stay',
      carRental: false,
      airlinePreference: '',
      hotelChain: '',
      specialRequests: ''
    });

    alert('Travel request submitted! Approved vendors will review your preferences and submit quotes within 24-48 hours.');
  };

  /** ------------------------------------------------------------
   *  UI helpers
   * ------------------------------------------------------------ */
  const getRequestIcon = (type: 'insurance' | 'travel') => {
    return type === 'insurance' ? 'ri-shield-check-line' : 'ri-flight-takeoff-line';
  };

  const getRequestLabel = (type: 'insurance' | 'travel') => {
    return type === 'insurance' ? 'Malpractice Insurance' : 'Travel & Lodging';
  };

  const getStatusColor = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'vendor_reviewing': return 'bg-purple-100 text-purple-700';
      case 'quote_received': return 'bg-teal-100 text-teal-700';
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-indigo-100 text-indigo-700';
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'submitted': return 'Submitted';
      case 'vendor_reviewing': return 'Under Review';
      case 'quote_received': return 'Quote Received';
      case 'accepted': return 'Accepted';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  /** ------------------------------------------------------------
   *  Render
   * ------------------------------------------------------------ */
  return (
    <div className="space-y-8">
      {/* Privacy Opt‑In Notice */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <i className="ri-shield-check-line text-2xl text-teal-600"></i>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-sm font-semibold text-teal-900 mb-2">
              Secure Data Sharing
            </h3>
            <p className="text-sm text-teal-800 mb-4">
              Your verified profile and preferences are only shared with approved third‑party vendors when you explicitly request services. All vendors are vetted and monitored by the platform.
            </p>
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={dataOptIn}
                onChange={(e) => setDataOptIn(e.target.checked)}
                className="w-4 h-4 text-teal-600 focus:ring-teal-500 rounded mt-0.5"
              />
              <span className="ml-3 text-sm text-teal-900">
                I authorize the platform to securely share my verified profile with approved vendors only when I request services. Platform fee: 15% of service cost.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Request Service Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            setRequestType('insurance');
            setShowNewRequestModal(true);
          }}
          disabled={!dataOptIn}
          className="flex-1 px-6 py-4 bg-white border-2 border-teal-600 text-teal-600 font-medium rounded-lg hover:bg-teal-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <i className="ri-shield-check-line text-xl mr-2"></i>
          Request Insurance Quote
        </button>
        <button
          onClick={() => {
            setRequestType('travel');
            setShowNewRequestModal(true);
          }}
          disabled={!dataOptIn}
          className="flex-1 px-6 py-4 bg-white border-2 border-teal-600 text-teal-600 font-medium rounded-lg hover:bg-teal-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <i className="ri-flight-takeoff-line text-xl mr-2"></i>
          Request Travel Services
        </button>
      </div>

      {/* Service Requests List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Service Requests</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track insurance and travel service requests tied to your assignments
          </p>
        </div>

        <div className="p-6">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-customer-service-2-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No service requests yet
              </h3>
              <p className="text-sm text-gray-600">
                Request malpractice insurance or travel services for your assignments
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((request) => {
                const requestInsuranceQuotes = request.type === 'insurance' 
                  ? getInsuranceQuotesByRequest(request.id)
                  : [];
                const requestTravelQuotes = request.type === 'travel'
                  ? getTravelQuotesByRequest(request.id)
                  : [];

                return (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
                  >
                    {/* Request Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i
                            className={`${getRequestIcon(request.type)} text-2xl text-teal-600`}
                          ></i>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-semibold text-gray-900">
                            {getRequestLabel(request.type)}
                          </h3>
                          {request.assignmentDetails && (
                            <>
                              <p className="text-sm text-gray-600 mt-1">
                                {request.assignmentDetails.facilityName}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {request.assignmentDetails.location} • {request.assignmentDetails.startDate} to {request.assignmentDetails.endDate}
                              </p>
                            </>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Requested: {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                    </div>

                    {/* Profile Shared Notice */}
                    {request.profileShared && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start">
                          <i className="ri-shield-check-line text-blue-600 mt-0.5 mr-2"></i>
                          <div>
                            <p className="text-xs font-medium text-blue-900">
                              Verified Profile Shared Securely
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                              Your profile has been shared with approved {request.type} vendors
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Insurance Quotes */}
                    {request.type === 'insurance' && requestInsuranceQuotes.length > 0 && (
                      <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Insurance Quotes ({requestInsuranceQuotes.length})
                        </h4>
                        {requestInsuranceQuotes.map((quote) => (
                          <div
                            key={quote.id}
                            className="border-2 border-teal-200 rounded-lg p-4 bg-teal-50"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-900">
                                  {quote.vendorName}
                                </h5>
                                <p className="text-xs text-gray-600 mt-1">
                                  {quote.coverageType} • {formatCurrency(quote.coverageAmount)} Coverage
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Submitted: {new Date(quote.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-600">Premium</p>
                                <p className="text-lg font-bold text-teal-600">
                                  {formatCurrency(quote.premium)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  + {formatCurrency(quote.platformFee)} platform fee
                                </p>
                                <p className="text-xs font-semibold text-gray-900 mt-1">
                                  Total: {formatCurrency(quote.totalCost)}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                              <div>
                                <span className="text-gray-600">Policy Term:</span>
                                <span className="ml-2 font-medium text-gray-900">{quote.policyTerm}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Deductible:</span>
                                <span className="ml-2 font-medium text-gray-900">{formatCurrency(quote.deductible)}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-600">Coverage Period:</span>
                                <span className="ml-2 font-medium text-gray-900">
                                  {new Date(quote.coverageStartDate).toLocaleDateString()} - {new Date(quote.coverageEndDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {quote.additionalBenefits.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs font-medium text-gray-900 mb-1">Benefits:</p>
                                <ul className="text-xs text-gray-700 space-y-1">
                                  {quote.additionalBenefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <i className="ri-check-line text-green-600 mr-1 mt-0.5"></i>
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {quote.notes && (
                              <p className="text-xs text-gray-700 mb-3 italic">
                                Note: {quote.notes}
                              </p>
                            )}

                            {quote.status === 'submitted' && (
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleAcceptQuote(quote.id, request.id, 'insurance')}
                                  className="flex-1 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
                                >
                                  <i className="ri-check-line mr-2"></i>
                                  Accept Quote
                                </button>
                                <button
                                  onClick={() => handleDeclineQuote(quote.id, 'insurance')}
                                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                                >
                                  <i className="ri-close-line mr-2"></i>
                                  Decline
                                </button>
                              </div>
                            )}

                            {quote.status === 'accepted' && (
                              <div className="flex items-center text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg">
                                <i className="ri-checkbox-circle-fill mr-2"></i>
                                Coverage purchased - Policy will be active on {new Date(quote.coverageStartDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Travel Quotes */}
                    {request.type === 'travel' && requestTravelQuotes.length > 0 && (
                      <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Travel Quotes ({requestTravelQuotes.length})
                        </h4>
                        {requestTravelQuotes.map((quote) => (
                          <div
                            key={quote.id}
                            className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-900">
                                  {quote.vendorName}
                                </h5>
                                <p className="text-xs text-gray-600 mt-1 capitalize">
                                  {quote.serviceType.replace('_', ' ')} Package
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Submitted: {new Date(quote.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-600">Service Cost</p>
                                <p className="text-lg font-bold text-blue-600">
                                  {formatCurrency(quote.totalServiceCost)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  + {formatCurrency(quote.platformFee)} platform fee
                                </p>
                                <p className="text-xs font-semibold text-gray-900 mt-1">
                                  Total: {formatCurrency(quote.totalCost)}
                                </p>
                              </div>
                            </div>

                            {/* Flight Details */}
                            {quote.flightDetails && (
                              <div className="mb-3 p-3 bg-white rounded-lg">
                                <p className="text-xs font-medium text-gray-900 mb-2 flex items-center">
                                  <i className="ri-flight-takeoff-line mr-1"></i>
                                  Flight Details
                                </p>
                                <div className="text-xs text-gray-700 space-y-1">
                                  <p><span className="font-medium">Route:</span> {quote.flightDetails.departure} → {quote.flightDetails.arrival}</p>
                                  <p><span className="font-medium">Dates:</span> {new Date(quote.flightDetails.departureDate).toLocaleDateString()} - {new Date(quote.flightDetails.returnDate).toLocaleDateString()}</p>
                                  <p><span className="font-medium">Airline:</span> {quote.flightDetails.airline} ({quote.flightDetails.flightNumber})</p>
                                  <p><span className="font-medium">Class:</span> {quote.flightDetails.class} • {formatCurrency(quote.flightDetails.price)}</p>
                                </div>
                              </div>
                            )}

                            {/* Hotel Details */}
                            {quote.hotelDetails && (
                              <div className="mb-3 p-3 bg-white rounded-lg">
                                <p className="text-xs font-medium text-gray-900 mb-2 flex items-center">
                                  <i className="ri-hotel-line mr-1"></i>
                                  Hotel Details
                                </p>
                                <div className="text-xs text-gray-700 space-y-1">
                                  <p><span className="font-medium">Hotel:</span> {quote.hotelDetails.name}</p>
                                  <p><span className="font-medium">Address:</span> {quote.hotelDetails.address}</p>
                                  <p><span className="font-medium">Dates:</span> {new Date(quote.hotelDetails.checkIn).toLocaleDateString()} - {new Date(quote.hotelDetails.checkOut).toLocaleDateString()}</p>
                                  <p><span className="font-medium">Room:</span> {quote.hotelDetails.roomType} • {quote.hotelDetails.totalNights} nights</p>
                                  <p><span className="font-medium">Price:</span> {formatCurrency(quote.hotelDetails.pricePerNight)}/night • Total: {formatCurrency(quote.hotelDetails.totalPrice)}</p>
                                </div>
                              </div>
                            )}

                            {/* Car Rental Details */}
                            {quote.carRentalDetails && (
                              <div className="mb-3 p-3 bg-white rounded-lg">
                                <p className="text-xs font-medium text-gray-900 mb-2 flex items-center">
                                  <i className="ri-car-line mr-1"></i>
                                  Car Rental Details
                                </p>
                                <div className="text-xs text-gray-700 space-y-1">
                                  <p><span className="font-medium">Company:</span> {quote.carRentalDetails.company}</p>
                                  <p><span className="font-medium">Vehicle:</span> {quote.carRentalDetails.vehicleType}</p>
                                  <p><span className="font-medium">Dates:</span> {new Date(quote.carRentalDetails.pickupDate).toLocaleDateString()} - {new Date(quote.carRentalDetails.returnDate).toLocaleDateString()}</p>
                                  <p><span className="font-medium">Price:</span> {formatCurrency(quote.carRentalDetails.price)}</p>
                                </div>
                              </div>
                            )}

                            {quote.notes && (
                              <p className="text-xs text-gray-700 mb-3 italic">
                                Note: {quote.notes}
                              </p>
                            )}

                            {quote.status === 'submitted' && (
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleAcceptQuote(quote.id, request.id, 'travel')}
                                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                                >
                                  <i className="ri-check-line mr-2"></i>
                                  Accept Quote
                                </button>
                                <button
                                  onClick={() => handleDeclineQuote(quote.id, 'travel')}
                                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                                >
                                  <i className="ri-close-line mr-2"></i>
                                  Decline
                                </button>
                              </div>
                            )}

                            {quote.status === 'accepted' && (
                              <div className="flex items-center text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg">
                                <i className="ri-checkbox-circle-fill mr-2"></i>
                                Travel arrangements confirmed - Vendor will fulfill independently
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Audit Log */}
                    {request.auditLog && request.auditLog.length > 0 && (
                      <details className="mt-4 pt-4 border-t border-gray-200">
                        <summary className="text-xs font-medium text-gray-600 cursor-pointer hover:text-gray-900">
                          View Activity Log ({request.auditLog.length} events)
                        </summary>
                        <div className="mt-3 space-y-2">
                          {request.auditLog.map((log, idx) => (
                            <div key={idx} className="text-xs text-gray-600 flex items-start">
                              <i className="ri-time-line mr-2 mt-0.5"></i>
                              <div>
                                <span className="font-medium">{log.action.replace(/_/g, ' ')}</span>
                                <span className="mx-2">•</span>
                                <span>{log.details}</span>
                                <span className="mx-2">•</span>
                                <span className="text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-900">
                {requestType === 'insurance' ? 'Request Insurance Quote' : 'Request Travel Services'}
              </h3>
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Insurance Request Form */}
              {requestType === 'insurance' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Assignment <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={insuranceForm.assignmentId}
                      onChange={(e) => setInsuranceForm(prev => ({ ...prev, assignmentId: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select an assignment</option>
                      <option value="assignment-001">Emergency Medicine - Boston General Hospital (Jul 1 - Sep 30)</option>
                      <option value="assignment-002">Internal Medicine - City Medical Center (Aug 15 - Nov 15)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Coverage Type
                      </label>
                      <select
                        value={insuranceForm.coverageType}
                        onChange={(e) => setInsuranceForm(prev => ({ ...prev, coverageType: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      >
                        <option value="Claims-Made">Claims-Made Policy</option>
                        <option value="Occurrence">Occurrence Policy</option>
                        <option value="Per-Diem">Per-Diem Policy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Coverage Amount
                      </label>
                      <select
                        value={insuranceForm.coverageAmount}
                        onChange={(e) => setInsuranceForm(prev => ({ ...prev, coverageAmount: Number(e.target.value) }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      >
                        <option value={1000000}>$1,000,000</option>
                        <option value={2000000}>$2,000,000</option>
                        <option value={3000000}>$3,000,000</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Prior Claims
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          checked={!insuranceForm.priorClaims}
                          onChange={() => setInsuranceForm(prev => ({ ...prev, priorClaims: false }))}
                          className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">No prior claims</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          checked={insuranceForm.priorClaims}
                          onChange={() => setInsuranceForm(prev => ({ ...prev, priorClaims: true }))}
                          className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Have prior claims</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Additional Requirements
                    </label>
                    <textarea
                      value={insuranceForm.additionalRequirements}
                      onChange={(e) => setInsuranceForm(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                      rows={3}
                      placeholder="e.g., Need tail coverage, multi-state coverage, specific policy features..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                    ></textarea>
                  </div>
                </>
              )}

              {/* Travel Request Form */}
              {requestType === 'travel' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Assignment <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={travelForm.assignmentId}
                      onChange={(e) => setTravelForm(prev => ({ ...prev, assignmentId: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select an assignment</option>
                      <option value="assignment-001">Emergency Medicine - Boston General Hospital (Jul 1 - Sep 30)</option>
                      <option value="assignment-002">Internal Medicine - City Medical Center (Aug 15 - Nov 15)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Service Type
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { value: 'full_package', label: 'Full Package', icon: 'ri-suitcase-line' },
                        { value: 'flight', label: 'Flight Only', icon: 'ri-flight-takeoff-line' },
                        { value: 'hotel', label: 'Hotel Only', icon: 'ri-hotel-line' },
                        { value: 'car_rental', label: 'Car Rental', icon: 'ri-car-line' }
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setTravelForm(prev => ({ ...prev, serviceType: type.value as any }))}
                          className={`p-3 border-2 rounded-lg text-center transition-all ${
                            travelForm.serviceType === type.value
                              ? 'border-teal-600 bg-teal-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <i className={`${type.icon} text-xl ${travelForm.serviceType === type.value ? 'text-teal-600' : 'text-gray-400'}`}></i>
                          <p className={`text-xs font-medium mt-1 ${travelForm.serviceType === type.value ? 'text-teal-900' : 'text-gray-700'}`}>
                            {type.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Departure City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={travelForm.departureCity}
                        onChange={(e) => setTravelForm(prev => ({ ...prev, departureCity: e.target.value }))}
                        placeholder="e.g., Los Angeles"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Destination City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={travelForm.destinationCity}
                        onChange={(e) => setTravelForm(prev => ({ ...prev, destinationCity: e.target.value }))}
                        placeholder="e.g., Boston"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Departure Date
                      </label>
                      <input
                        type="date"
                        value={travelForm.departureDate}
                        onChange={(e) => setTravelForm(prev => ({ ...prev, departureDate: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Return Date
                      </label>
                      <input
                        type="date"
                        value={travelForm.returnDate}
                        onChange={(e) => setTravelForm(prev => ({ ...prev, returnDate: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Flight Class Preference
                      </label>
                      <select
                        value={travelForm.flightClass}
                        onChange={(e) => setTravelForm(prev => ({ ...prev, flightClass: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      >
                        <option value="Economy">Economy</option>
                        <option value="Economy Plus">Economy Plus</option>
                        <option value="Business">Business</option>
                        <option value="First">First Class</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Hotel Type Preference
                      </label>
                      <select
                        value={travelForm.hotelType}
                        onChange={(e) => setTravelForm(prev => ({ ...prev, hotelType: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      >
                        <option value="Standard">Standard</option>
                        <option value="Extended Stay">Extended Stay</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      value={travelForm.specialRequests}
                      onChange={(e) => setTravelForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                      rows={3}
                      placeholder="e.g., Airline loyalty program, hotel chain preference, parking needs, accessibility requirements..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
                    ></textarea>
                  </div>
                </>
              )}

              {/* Information notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <i className="ri-information-line text-blue-600 mt-0.5 mr-3 flex-shrink-0"></i>
                  <div>
                    <p className="text-sm text-blue-900 font-medium mb-1">
                      Vendor Service Notice
                    </p>
                    <p className="text-sm text-blue-800">
                      Services are provided by approved third‑party vendors. The platform monitors vendor performance but does not directly provide, underwrite, or guarantee these services. A 15% platform fee applies to all vendor services.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={requestType === 'insurance' ? handleSubmitInsuranceRequest : handleSubmitTravelRequest}
                className="flex-1 px-6 py-3 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
