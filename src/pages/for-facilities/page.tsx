
import { Link } from 'react-router-dom';

export default function ForFacilitiesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="https://public.readdy.ai/ai/img_res/21f47418-dbfd-45ca-9905-fafb6edcc45d.png" alt="LOCUM BNB" className="h-10" />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-teal-600 transition-colors text-sm font-medium">Home</Link>
              <Link to="/for-physicians" className="text-gray-700 hover:text-teal-600 transition-colors text-sm font-medium">For Physicians</Link>
              <Link to="/for-facilities" className="text-teal-600 font-semibold text-sm">For Facilities</Link>
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-teal-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find Qualified Physicians Fast
              </h1>
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <i className="ri-checkbox-circle-fill text-3xl text-teal-600 mt-1"></i>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Post Assignments in Minutes</h3>
                    <p className="text-gray-600 leading-relaxed">Create assignment windows and bookable blocks quickly. Set your requirements and let qualified physicians apply.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <i className="ri-checkbox-circle-fill text-3xl text-teal-600 mt-1"></i>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Review Before Contact</h3>
                    <p className="text-gray-600 leading-relaxed">Approve clinicians before any direct communication. You maintain full control over who you work with.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <i className="ri-checkbox-circle-fill text-3xl text-teal-600 mt-1"></i>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent, Fair Pricing</h3>
                    <p className="text-gray-600 leading-relaxed">Clear platform service fees with escrow-style payments. No hidden costs or surprises.</p>
                  </div>
                </div>
              </div>
              <Link to="/signup" className="inline-block bg-teal-600 text-white px-10 py-4 rounded-xl hover:bg-teal-700 transition-colors text-lg font-semibold whitespace-nowrap shadow-lg cursor-pointer">
                Post Your First Assignment
              </Link>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <img 
                  src="https://readdy.ai/api/search-image?query=modern%20healthcare%20facility%20dashboard%20interface%20showing%20physician%20scheduling%20calendar%20with%20clean%20minimalist%20design%2C%20soft%20pistachio%20green%20and%20teal%20accent%20colors%2C%20professional%20medical%20technology%20platform%2C%20bright%20white%20background%20with%20organized%20data%20visualization%20and%20appointment%20blocks&width=600&height=500&seq=facility-dashboard-preview&orientation=landscape" 
                  alt="Facility Dashboard" 
                  className="w-full h-auto rounded-lg object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Facilities Benefit */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">How It Works for Facilities</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gray-200"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="text-center">
                <div className="w-32 h-32 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-5xl font-bold text-white">1</span>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <i className="ri-file-add-line text-3xl text-teal-600"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Post Assignment</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Create your assignment with dates, specialty requirements, and compensation details.</p>
                </div>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-5xl font-bold text-white">2</span>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <i className="ri-user-search-line text-3xl text-teal-600"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Review Applicants</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Qualified physicians apply. Review their profiles and credentials at your convenience.</p>
                </div>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-5xl font-bold text-white">3</span>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <i className="ri-checkbox-circle-line text-3xl text-teal-600"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Approve & Fund</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Approve your chosen physician and fund the assignment in secure escrow.</p>
                </div>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-5xl font-bold text-white">4</span>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <i className="ri-hospital-line text-3xl text-teal-600"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Assignment Complete</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Physician completes the work. Payment is released automatically upon completion.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Transparency */}
      <section className="py-20 px-6 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">No hidden fees. You know exactly what you pay.</p>
          <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Physician Payment</h4>
                  <p className="text-gray-600 text-sm">Full assignment amount goes to physician</p>
                </div>
                <div className="text-3xl font-bold text-teal-600">100%</div>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Platform Service Fee</h4>
                  <p className="text-gray-600 text-sm">Paid separately by facility</p>
                </div>
                <div className="text-3xl font-bold text-teal-600">15%</div>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Payment Processing</h4>
                  <p className="text-gray-600 text-sm">Secure escrow and transaction fees</p>
                </div>
                <div className="text-3xl font-bold text-teal-600">2.9%</div>
              </div>
              <div className="bg-teal-50 rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className="ri-checkbox-circle-fill text-3xl text-teal-600"></i>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Physician Receives</h4>
                    <p className="text-gray-600 text-sm">No deductions from their pay</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-teal-600">100%</div>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-8">Example: For a $10,000 assignment, physician receives $10,000. Facility pays $11,290 total (assignment + fees).</p>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Facilities Trust Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-shield-check-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">You Stay in Control</h3>
              <p className="text-gray-600 leading-relaxed">Review and approve all clinicians before contact. Handle your own credentialing and compliance processes.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-lock-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Escrow</h3>
              <p className="text-gray-600 leading-relaxed">Funds are held safely in escrow. Physicians are paid only upon successful completion of assignments.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-time-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fast Turnaround</h3>
              <p className="text-gray-600 leading-relaxed">Post assignments quickly and receive applications from qualified physicians within hours, not days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Post Your First Assignment?</h2>
          <p className="text-xl text-teal-50 mb-10">Join healthcare facilities nationwide who trust our transparent marketplace.</p>
          <Link to="/signup" className="inline-block bg-white text-teal-600 px-10 py-4 rounded-xl hover:bg-gray-50 transition-colors text-lg font-semibold whitespace-nowrap shadow-lg cursor-pointer">
            Get Started Today
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
              <a href="https://readdy.ai/?ref=logo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Website Builder</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
