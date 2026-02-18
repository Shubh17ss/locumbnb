
import { Link } from 'react-router-dom';

export default function PaymentsPage() {
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
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Payments & Escrow</h1>
          <p className="text-xl text-gray-600 leading-relaxed">Secure, transparent payment processing that protects both physicians and facilities.</p>
        </div>
      </section>

      {/* Payment Flow Diagram */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How Payments Work</h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Facility Funds Escrow</h3>
                <p className="text-gray-600 leading-relaxed mb-4">After approving a physician, the facility funds the full assignment amount plus platform fees into a secure escrow account. This guarantees payment to the physician upon successful completion.</p>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <i className="ri-shield-check-line text-teal-600 text-xl"></i>
                    <span className="text-sm font-medium text-gray-700">Funds are held securely by a licensed escrow service</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Escrow Held Securely</h3>
                <p className="text-gray-600 leading-relaxed mb-4">The escrow account holds funds throughout the assignment period. Neither party can access the funds until the assignment is completed and confirmed.</p>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <i className="ri-lock-line text-teal-600 text-xl"></i>
                    <span className="text-sm font-medium text-gray-700">Protected by bank-level security and compliance standards</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Assignment Completed</h3>
                <p className="text-gray-600 leading-relaxed mb-4">The physician completes the assignment according to the agreed terms. Both parties confirm completion through the platform.</p>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 text-xl"></i>
                    <span className="text-sm font-medium text-gray-700">Digital confirmation ensures clear documentation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Physician Receives Full Payment</h3>
                <p className="text-gray-600 leading-relaxed mb-4">Upon confirmation, the physician receives 100% of the assignment pay. Funds are typically transferred within 2-3 business days.</p>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <i className="ri-money-dollar-circle-line text-teal-600 text-xl"></i>
                    <span className="text-sm font-medium text-gray-700">No deductions, no hidden fees, no surprises</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">5</span>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Platform Fee Released</h3>
                <p className="text-gray-600 leading-relaxed mb-4">The platform service fee is released separately from the physician payment. This fee is paid entirely by the facility.</p>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <i className="ri-information-line text-teal-600 text-xl"></i>
                    <span className="text-sm font-medium text-gray-700">Physicians never pay platform fees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Information */}
      <section className="py-20 px-6 bg-green-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Tax Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-file-text-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Does Not Withhold Taxes</h3>
              <p className="text-gray-600 leading-relaxed">The platform does not withhold federal, state, or local taxes from physician payments. Physicians are responsible for their own tax obligations as independent contractors.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-file-list-3-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Does Not Issue 1099s</h3>
              <p className="text-gray-600 leading-relaxed">The platform does not issue 1099-NEC forms. Facilities issue 1099-NEC forms directly to physicians for the assignment compensation paid.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-building-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Facilities Issue 1099-NEC</h3>
              <p className="text-gray-600 leading-relaxed">Healthcare facilities are responsible for issuing 1099-NEC forms to physicians for all compensation paid during the tax year. This reflects the direct independent contractor relationship.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-user-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Independent Contractor Status</h3>
              <p className="text-gray-600 leading-relaxed">Physicians operate as independent 1099 contractors. You are responsible for estimated tax payments, self-employment taxes, and maintaining appropriate business records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Security */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Payment Security & Protection</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-shield-check-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bank-Level Security</h3>
              <p className="text-gray-600 leading-relaxed">All transactions are processed through secure, PCI-compliant payment systems with encryption and fraud protection.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-lock-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Licensed Escrow Service</h3>
              <p className="text-gray-600 leading-relaxed">Funds are held by a licensed, regulated escrow service that specializes in secure transaction management.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-file-shield-line text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Clear Documentation</h3>
              <p className="text-gray-600 leading-relaxed">All payments are documented with detailed records, receipts, and transaction histories available to both parties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 px-6 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <i className="ri-information-line text-3xl text-teal-600 flex-shrink-0"></i>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-3">Important Payment Information</h4>
                <ul className="space-y-3 text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Physicians receive 100% of the displayed assignment pay with no deductions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Platform fees are paid separately by facilities and never deducted from physician pay</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Escrow protects both parties by ensuring funds are available before work begins</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Payment processing typically takes 2-3 business days after assignment completion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>All payment disputes are handled through the platform's resolution process</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Questions About Payments?</h2>
          <p className="text-xl text-teal-50 mb-10">Our support team is here to help you understand the payment process.</p>
          <Link to="/signup" className="inline-block bg-white text-teal-600 px-10 py-4 rounded-xl hover:bg-gray-50 transition-colors text-lg font-semibold whitespace-nowrap shadow-lg cursor-pointer">
            Get Started
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
