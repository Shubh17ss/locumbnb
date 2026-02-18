import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

type UserRole = 'physician' | 'facility' | 'vendor' | 'crna';

const heroImages = [
  {
    url: 'https://readdy.ai/api/search-image?query=Professional%20medical%20team%20collaboration%20in%20modern%20hospital%20setting%20with%20physicians%20and%20nurses%20discussing%20patient%20care%20together%20in%20bright%20clean%20clinical%20environment%20with%20soft%20natural%20lighting%20and%20teal%20accent%20colors&width=1200&height=600&seq=hero1&orientation=landscape',
    alt: 'Medical team collaboration'
  },
  {
    url: 'https://readdy.ai/api/search-image?query=Healthcare%20professionals%20including%20CRNA%20anesthesiologist%20and%20surgeon%20working%20together%20in%20operating%20room%20with%20modern%20medical%20equipment%20professional%20teamwork%20atmosphere%20soft%20lighting%20clean%20clinical%20aesthetic&width=1200&height=600&seq=hero2&orientation=landscape',
    alt: 'Operating room teamwork'
  },
  {
    url: 'https://readdy.ai/api/search-image?query=Modern%20healthcare%20facility%20administrator%20meeting%20with%20medical%20staff%20in%20contemporary%20hospital%20conference%20room%20professional%20business%20setting%20with%20natural%20light%20and%20clean%20minimalist%20design&width=1200&height=600&seq=hero3&orientation=landscape',
    alt: 'Healthcare facility meeting'
  },
  {
    url: 'https://readdy.ai/api/search-image?query=Diverse%20group%20of%20healthcare%20providers%20physicians%20nurses%20and%20specialists%20standing%20together%20in%20modern%20hospital%20lobby%20professional%20unity%20teamwork%20bright%20clean%20environment%20with%20soft%20teal%20accents&width=1200&height=600&seq=hero4&orientation=landscape',
    alt: 'Healthcare providers team'
  }
];

const roleCards: { role: UserRole; title: string; icon: string; description: string; link: string }[] = [
  {
    role: 'physician',
    title: 'Physician',
    icon: 'ri-stethoscope-line',
    description: 'Browse locum assignments with transparent pay. Keep 100% of what you earn.',
    link: '/signup?role=physician'
  },
  {
    role: 'crna',
    title: 'CRNA / Advanced Provider',
    icon: 'ri-heart-pulse-line',
    description: 'Find anesthesia and advanced practice opportunities with full transparency.',
    link: '/signup?role=crna'
  },
  {
    role: 'facility',
    title: 'Facility',
    icon: 'ri-hospital-line',
    description: 'Post assignments and connect directly with qualified healthcare providers.',
    link: '/signup?role=facility'
  },
  {
    role: 'vendor',
    title: 'Third-Party Vendor',
    icon: 'ri-service-line',
    description: 'Offer malpractice, travel, credentialing, and other services to providers.',
    link: '/signup?role=vendor'
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<UserRole>('physician');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setIsLoggedIn(true);
        
        // Get user name from metadata or profile
        const fullName = session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.name || 
                        session.user.email?.split('@')[0] || 
                        'User';
        const firstName = fullName.split(' ')[0];
        setUserName(firstName);
        
        // Get user role
        const role = session.user.user_metadata?.role || '';
        setUserRole(role);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        const fullName = session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.name || 
                        session.user.email?.split('@')[0] || 
                        'User';
        const firstName = fullName.split(' ')[0];
        setUserName(firstName);
        setUserRole(session.user.user_metadata?.role || '');
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserName('');
        setUserRole('');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTabClick = (role: UserRole) => {
    setActiveTab(role);
    // Navigate to the appropriate page based on role
    switch (role) {
      case 'physician':
        navigate('/for-physicians');
        break;
      case 'facility':
        navigate('/for-facilities');
        break;
      case 'vendor':
        navigate('/optional-services');
        break;
      case 'crna':
        navigate('/for-physicians'); // CRNAs use the same page as physicians
        break;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowProfileDropdown(false);
    navigate('/');
  };

  const handleGoToDashboard = () => {
    setShowProfileDropdown(false);
    if (userRole === 'facility') {
      navigate('/facility-dashboard');
    } else {
      navigate('/physician-dashboard');
    }
  };

  const getSignupLink = (role: UserRole) => `/signup?role=${role}`;
  const getLoginLink = (role: UserRole) => `/login?role=${role}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm transition-all duration-300 border-b border-gray-100">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link to="/" className="flex items-center">
              <img src="https://public.readdy.ai/ai/img_res/21f47418-dbfd-45ca-9905-fafb6edcc45d.png" alt="LOCUM BNB" className="h-10" />
            </Link>
            
            {/* Role Tabs - Desktop */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full p-1">
              <Link
                to="/"
                className="px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer text-gray-600 hover:text-teal-600"
              >
                Home
              </Link>
              <Link
                to="/for-physicians"
                onClick={() => handleTabClick('physician')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'physician' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                Physician
              </Link>
              <Link
                to="/for-facilities"
                onClick={() => handleTabClick('facility')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'facility' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                Facility
              </Link>
              <Link
                to="/optional-services"
                onClick={() => handleTabClick('vendor')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'vendor' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                Third-Party Vendor
              </Link>
              <Link
                to="/for-physicians"
                onClick={() => handleTabClick('crna')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'crna' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                CRNA / Advanced Provider
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span>{userName}</span>
                    <i className={`ri-arrow-down-s-line transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`}></i>
                  </button>

                  {showProfileDropdown && (
                    <>
                      {/* Backdrop to close dropdown when clicking outside */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowProfileDropdown(false)}
                      ></div>
                      
                      {/* Dropdown menu */}
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{userName}</p>
                          <p className="text-xs text-gray-500 capitalize">{userRole || 'User'}</p>
                        </div>
                        
                        <button
                          onClick={handleGoToDashboard}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <i className="ri-dashboard-line"></i>
                          Dashboard
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            navigate('/profile-completion');
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <i className="ri-user-settings-line"></i>
                          Profile Settings
                        </button>
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <i className="ri-logout-box-line"></i>
                          Log Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link to={getLoginLink(activeTab)} className="text-teal-600 hover:text-teal-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer">Log In</Link>
                  <Link to={getSignupLink(activeTab)} className="bg-teal-600 text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Role Tabs - Mobile */}
        <div className="lg:hidden px-4 pb-3 overflow-x-auto">
          <div className="flex items-center bg-gray-100 rounded-full p-1 w-max">
            <Link
              to="/"
              className="px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer text-gray-600"
            >
              Home
            </Link>
            <Link
              to="/for-physicians"
              onClick={() => handleTabClick('physician')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'physician' ? 'bg-teal-600 text-white' : 'text-gray-600'
              }`}
            >
              Physician
            </Link>
            <Link
              to="/for-facilities"
              onClick={() => handleTabClick('facility')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'facility' ? 'bg-teal-600 text-white' : 'text-gray-600'
              }`}
            >
              Facility
            </Link>
            <Link
              to="/optional-services"
              onClick={() => handleTabClick('vendor')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'vendor' ? 'bg-teal-600 text-white' : 'text-gray-600'
              }`}
            >
              Vendor
            </Link>
            <Link
              to="/for-physicians"
              onClick={() => handleTabClick('crna')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'crna' ? 'bg-teal-600 text-white' : 'text-gray-600'
              }`}
            >
              CRNA
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <section className="pt-36 lg:pt-28 pb-16 px-6 bg-gradient-to-b from-white via-green-50/30 to-teal-50/20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Text */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              The Transparent, Fair<br />
              <span className="text-teal-600">Healthcare Marketplace</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Connect directly. No hidden fees. No middlemen. Just transparent healthcare staffing.
            </p>
          </div>

          {/* Image Carousel */}
          <div className="relative w-full max-w-4xl mx-auto mb-10 rounded-2xl overflow-hidden shadow-lg">
            <div className="relative h-64 md:h-80 lg:h-96">
              {heroImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              ))}
            </div>
            
            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Carousel Arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-s-line text-xl text-gray-700"></i>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
            >
              <i className="ri-arrow-right-s-line text-xl text-gray-700"></i>
            </button>
          </div>

          {/* Who Are You? */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Who are you?</h2>
            <p className="text-gray-600">Select your role to get started</p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {roleCards.map((card) => (
              <Link
                key={card.role}
                to={card.link}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-200 transition-all group cursor-pointer"
              >
                <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
                  <i className={`${card.icon} text-2xl text-teal-600`}></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{card.description}</p>
                <div className="flex items-center text-teal-600 text-sm font-medium">
                  Get Started <i className="ri-arrow-right-line ml-1 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </Link>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 bg-gray-100/80 px-6 py-3 rounded-full">
              <i className="ri-information-line text-gray-600"></i>
              <span className="text-sm text-gray-700">Technology marketplace only. Not an employer or staffing agency.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-check-line text-4xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Transparent</h3>
              <p className="text-gray-600 text-sm leading-relaxed">What you see is what you earn. No hidden fees or deductions from provider pay.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <i className="ri-lock-line text-4xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Escrow</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Facilities fund assignments upfront. Providers receive full payment upon completion.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-heart-line text-4xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Connection</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Connect directly with facilities or providers. No middlemen taking a cut.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-16 px-6 bg-teal-50/40">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Process</h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">Whether you're a provider or facility, our platform makes healthcare staffing straightforward.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <i className="ri-search-line text-2xl text-teal-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">Browse</h4>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <i className="ri-file-text-line text-2xl text-teal-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">Apply</h4>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <i className="ri-checkbox-circle-line text-2xl text-teal-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">Approve</h4>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <i className="ri-check-double-line text-2xl text-teal-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">Complete</h4>
            </div>
          </div>

          <Link to="/how-it-works" className="inline-flex items-center gap-2 text-teal-600 font-medium hover:text-teal-700 transition-colors cursor-pointer">
            Learn more about how it works <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <img src="https://public.readdy.ai/ai/img_res/21f47418-dbfd-45ca-9905-fafb6edcc45d.png" alt="LOCUM BNB" className="h-10 mb-4 brightness-0 invert" />
              <p className="text-gray-400 text-sm leading-relaxed">The transparent healthcare marketplace.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">Home</Link></li>
                <li><Link to="/how-it-works" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">How It Works</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">Pricing</Link></li>
                <li><Link to="/for-physicians" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">For Physicians</Link></li>
                <li><Link to="/for-facilities" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">For Facilities</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/optional-services" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">Optional Services</Link></li>
                <li><Link to="/payments" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">Payments</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">Privacy Policy</Link></li>
                <li><Link to="/legal" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">Legal & Disclaimers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm">Support</h4>
              <ul className="space-y-2">
                <li><a href="mailto:support@locumbnb.com" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">Contact Us</a></li>
                <li><a href="mailto:help@locumbnb.com" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">Help Center</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">© 2025 LOCUM BNB. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">Terms & Conditions</Link>
              <Link to="/privacy" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">Privacy Policy</Link>
              <a href="https://readdy.ai/?ref=logo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">Powered by Readdy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
