
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ProfileCompletionModal from '../../components/feature/ProfileCompletionModal';
import ApplicationConfirmModal from '../../components/feature/ApplicationConfirmModal';

export default function ForPhysiciansPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  // Mock profile status - in real app, this would come from user state
  const profileStatus = {
    cvUploaded: false,
    licenseAdded: false,
    malpracticeDisclosed: false,
    npdbAcknowledged: false,
    termsAccepted: false
  };

  const isProfileComplete = Object.values(profileStatus).every(status => status);

  const handleApplyClick = (assignment: any) => {
    if (!isProfileComplete) {
      setShowProfileModal(true);
    } else {
      setSelectedAssignment(assignment);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmApplication = () => {
    // Handle application submission
    setShowConfirmModal(false);
    setSelectedAssignment(null);
    // Show success message or redirect
  };

  const assignments = [
    {
      id: 1,
      specialty: 'Emergency Medicine',
      pay: '$3,200',
      period: 'per day',
      location: 'LAX',
      radius: '45 miles',
      dates: 'Mar 15 - Mar 22, 2025',
      duration: '7 days',
      shifts: '12-hour shifts',
      type: 'Full Coverage'
    },
    {
      id: 2,
      specialty: 'Internal Medicine',
      pay: '$2,800',
      period: 'per day',
      location: 'ORD',
      radius: '30 miles',
      dates: 'Apr 1 - Apr 14, 2025',
      duration: '14 days',
      shifts: '8-hour shifts',
      type: 'Weekday Coverage'
    },
    {
      id: 3,
      specialty: 'Anesthesiology',
      pay: '$3,500',
      period: 'per day',
      location: 'DFW',
      radius: '50 miles',
      dates: 'Mar 20 - Apr 3, 2025',
      duration: '14 days',
      shifts: '10-hour shifts',
      type: 'Full Coverage'
    },
    {
      id: 4,
      specialty: 'Cardiology',
      pay: '$3,100',
      period: 'per day',
      location: 'ATL',
      radius: '35 miles',
      dates: 'Apr 10 - Apr 17, 2025',
      duration: '7 days',
      shifts: '12-hour shifts',
      type: 'Weekend Coverage'
    },
    {
      id: 5,
      specialty: 'Radiology',
      pay: '$2,900',
      period: 'per day',
      location: 'SEA',
      radius: '40 miles',
      dates: 'May 1 - May 15, 2025',
      duration: '14 days',
      shifts: '8-hour shifts',
      type: 'Full Coverage'
    },
    {
      id: 6,
      specialty: 'Psychiatry',
      pay: '$2,600',
      period: 'per day',
      location: 'MIA',
      radius: '25 miles',
      dates: 'Apr 5 - Apr 19, 2025',
      duration: '14 days',
      shifts: '8-hour shifts',
      type: 'Weekday Coverage'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="https://public.readdy.ai/ai/img_res/21f47418-dbfd-45ca-9905-fafb6edcc45d.png" alt="LOCUM BNB" className="h-10" />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-teal-600 transition-colors text-sm font-medium">Home</Link>
              <Link to="/for-physicians" className="text-teal-600 font-semibold text-sm">For Physicians</Link>
              <Link to="/for-facilities" className="text-gray-700 hover:text-teal-600 transition-colors text-sm font-medium">For Facilities</Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-teal-600 transition-colors text-sm font-medium">How It Works</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-teal-600 transition-colors text-sm font-medium">Pricing</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-teal-600 hover:text-teal-700 transition-colors text-sm font-medium whitespace-nowrap">Log In</Link>
              <Link to="/signup" className="bg-teal-600 text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium whitespace-nowrap">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="pt-32 pb-12 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Browse Assignments. Keep 100%.</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl">No hidden fees. No deductions. What you see is what you earn. Browse transparent locum assignments and apply directly.</p>
          
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setSelectedSpecialty('all')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${selectedSpecialty === 'all' ? 'bg-green-100 text-teal-700' : 'bg-white border border-gray-300 text-gray-700 hover:border-teal-400'}`}
            >
              All Specialties
            </button>
            <button 
              onClick={() => setSelectedSpecialty('emergency')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${selectedSpecialty === 'emergency' ? 'bg-green-100 text-teal-700' : 'bg-white border border-gray-300 text-gray-700 hover:border-teal-400'}`}
            >
              Emergency Medicine
            </button>
            <button 
              onClick={() => setSelectedSpecialty('internal')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${selectedSpecialty === 'internal' ? 'bg-green-100 text-teal-700' : 'bg-white border border-gray-300 text-gray-700 hover:border-teal-400'}`}
            >
              Internal Medicine
            </button>
            <button 
              onClick={() => setSelectedSpecialty('anesthesiology')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${selectedSpecialty === 'anesthesiology' ? 'bg-green-100 text-teal-700' : 'bg-white border border-gray-300 text-gray-700 hover:border-teal-400'}`}
            >
              Anesthesiology
            </button>
            <button 
              onClick={() => setSelectedSpecialty('cardiology')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${selectedSpecialty === 'cardiology' ? 'bg-green-100 text-teal-700' : 'bg-white border border-gray-300 text-gray-700 hover:border-teal-400'}`}
            >
              Cardiology
            </button>
          </div>
        </div>
      </section>

      {/* Assignment Cards Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-green-100 text-teal-700 text-xs font-semibold rounded-full whitespace-nowrap">
                      {assignment.specialty}
                    </span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-teal-600">{assignment.pay}</div>
                      <div className="text-xs text-gray-500">{assignment.period}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <i className="ri-map-pin-line text-teal-600"></i>
                      <span className="text-sm">Near {assignment.location} • within {assignment.radius}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <i className="ri-calendar-line text-teal-600"></i>
                      <span className="text-sm">{assignment.dates}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-900">{assignment.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Shifts:</span>
                      <span className="font-medium text-gray-900">{assignment.shifts}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900">{assignment.type}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApplyClick(assignment)}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-sm whitespace-nowrap cursor-pointer"
                  >
                    Apply to block
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Physicians Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-money-dollar-circle-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% of Your Pay</h3>
              <p className="text-gray-600 leading-relaxed">You receive the full assignment amount. No deductions for travel, lodging, or malpractice. Platform fees are paid separately by facilities.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-eye-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Transparency</h3>
              <p className="text-gray-600 leading-relaxed">See exact pay rates, location details, and assignment requirements upfront. No surprises, no hidden terms.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-shield-check-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h3>
              <p className="text-gray-600 leading-relaxed">Facilities fund assignments in escrow before you start. Your payment is guaranteed upon completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Browse Assignments?</h2>
          <p className="text-xl text-teal-50 mb-10">Join thousands of physicians who trust our transparent marketplace.</p>
          <Link to="/signup" className="inline-block bg-white text-teal-600 px-10 py-4 rounded-xl hover:bg-gray-50 transition-colors text-lg font-semibold whitespace-nowrap shadow-lg cursor-pointer">
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <img src="https://public.readdy.ai/ai/img_res/21f47418-dbfd-45ca-9905-fafb6edcc45d.png" alt="LOCUM BNB" className="h-10 mb-4 brightness-0 invert" />
              <p className="text-gray-400 text-sm leading-relaxed">The transparent healthcare marketplace connecting physicians and facilities.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Home</Link></li>
                <li><Link to="/for-physicians" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">For Physicians</Link></li>
                <li><Link to="/for-facilities" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">For Facilities</Link></li>
                <li><Link to="/how-it-works" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">How It Works</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link to="/optional-services" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Optional Services</Link></li>
                <li><Link to="/payments" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Payments</Link></li>
                <li><Link to="/legal" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Legal & Disclaimers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">© 2025 LOCUM BNB. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/legal" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Privacy Policy</Link>
              <Link to="/legal" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Terms of Service</Link>
              <a href="https://readdy.ai/?ref=logo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Web Design</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProfileCompletionModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profileStatus={profileStatus}
      />

      {selectedAssignment && (
        <ApplicationConfirmModal 
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setSelectedAssignment(null);
          }}
          onConfirm={handleConfirmApplication}
          assignmentDetails={{
            specialty: selectedAssignment.specialty,
            dates: selectedAssignment.dates,
            pay: selectedAssignment.pay
          }}
        />
      )}
    </div>
  );
}
