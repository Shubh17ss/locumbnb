
import { Link } from 'react-router-dom';

export default function HowItWorksPage() {
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
              <Link to="/for-facilities" className="text-gray-700 hover:text-teal-600 transition-colors text-sm font-medium">For Facilities</Link>
              <Link to="/how-it-works" className="text-teal-600 font-semibold text-sm">How It Works</Link>
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
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">How It Works</h1>
          <p className="text-xl text-gray-600 leading-relaxed">A transparent marketplace connecting physicians and facilities through a simple, secure process.</p>
        </div>
      </section>

      {/* Step-by-Step Flow */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-teal-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-file-add-line text-2xl text-teal-600"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Facilities Post Assignments</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">Healthcare facilities create assignment listings with defined date windows, specialty requirements, and transparent pay rates. All details are clearly displayed upfront.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-teal-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-search-line text-2xl text-teal-600"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Physicians Browse & Apply</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">Qualified physicians browse available assignments, view complete details including exact compensation, and apply to specific blocks that match their schedule and expertise.</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-teal-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-user-search-line text-2xl text-teal-600"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Facilities Review & Approve</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">Facilities review applicant profiles and credentials, then approve their chosen physician. No direct contact occurs until after facility approval.</p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-teal-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-lock-line text-2xl text-teal-600"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Escrow Payment Funded</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">The facility funds the full assignment amount plus platform fees into secure escrow. This guarantees payment to the physician upon successful completion.</p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-teal-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">5</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-hospital-line text-2xl text-teal-600"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Assignment Completed Off-Platform</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">The physician completes the assignment at the healthcare facility. All clinical work, supervision, and credentialing occur independently of the platform.</p>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-teal-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">6</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-money-dollar-circle-line text-2xl text-teal-600"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Physician Receives 100% of Pay</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">Upon completion, the physician receives 100% of the displayed assignment pay. No deductions, no hidden fees, no surprises. Platform fees are paid separately by the facility.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Callouts */}
      <section className="py-20 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Important Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-price-tag-3-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">No Hidden Fees</h3>
              <p className="text-gray-600 leading-relaxed">All costs are transparent and disclosed upfront. Physicians see exactly what they'll earn. Facilities see exactly what they'll pay.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-hand-coin-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Zero Platform Fees for Physicians</h3>
              <p className="text-gray-600 leading-relaxed">Physicians pay $0 to use the platform. No deductions from your assignment pay. Platform fees are charged only to facilities.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-shield-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Technology Platform Only</h3>
              <p className="text-gray-600 leading-relaxed">The platform does not verify credentials or supervise care. Facilities are responsible for credentialing and compliance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-10">Join our transparent marketplace today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/for-physicians" className="inline-block bg-teal-600 text-white px-10 py-4 rounded-xl hover:bg-teal-700 transition-colors text-lg font-semibold whitespace-nowrap shadow-lg cursor-pointer">
              Browse Assignments
            </Link>
            <Link to="/for-facilities" className="inline-block bg-white text-teal-600 border-2 border-teal-600 px-10 py-4 rounded-xl hover:bg-teal-50 transition-colors text-lg font-semibold whitespace-nowrap cursor-pointer">
              Post an Assignment
            </Link>
          </div>
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
              <Link to="/privacy" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Terms of Service</Link>
              <a href="https://readdy.ai/?ref=logo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Powered by Readdy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
