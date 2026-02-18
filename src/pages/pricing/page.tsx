import { Link } from 'react-router-dom';

export default function PricingPage() {
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
              <Link to="/pricing" className="text-teal-600 font-semibold text-sm">Pricing</Link>
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
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Transparent Pricing</h1>
          <p className="text-xl text-gray-600 leading-relaxed">No hidden fees. No surprises. Just clear, honest pricing for everyone.</p>
        </div>
      </section>

      {/* For Physicians Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">For Physicians</h2>
            <p className="text-xl text-gray-600">Use the platform completely free. Keep 100% of your earnings.</p>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-lg border-2 border-teal-600">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-teal-600 mb-2">$0</div>
              <p className="text-gray-600 text-lg">Platform fees for physicians</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-teal-600 text-lg"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">100% of Assignment Pay</h4>
                  <p className="text-gray-600">You receive the full amount displayed on the assignment listing. No deductions whatsoever.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-teal-600 text-lg"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">No Hidden Fees</h4>
                  <p className="text-gray-600">No skims on travel, lodging, malpractice, or any other expenses. What you see is what you earn.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-teal-600 text-lg"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Independent 1099 Contractor</h4>
                  <p className="text-gray-600">You operate as an independent contractor. Facilities issue 1099-NEC forms directly to you.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-teal-600 text-lg"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Free to Browse & Apply</h4>
                  <p className="text-gray-600">Browse unlimited assignments, apply to as many as you want, and manage your schedule at no cost.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <i className="ri-information-line text-2xl text-teal-600"></i>
                  <p className="text-gray-700 font-medium">Example: If an assignment pays $8,000, you receive $8,000. Zero deductions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Facilities Section */}
      <section className="py-20 px-6 bg-green-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">For Facilities</h2>
            <p className="text-xl text-gray-600">Transparent platform service fees. No hidden costs.</p>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
            <div className="space-y-8">
              <div className="flex items-center justify-between py-6 border-b border-gray-200">
                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-2">Physician Assignment Pay</h4>
                  <p className="text-gray-600">Full amount paid directly to physician</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-teal-600">100%</div>
                  <p className="text-gray-500 text-sm">of listed amount</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-6 border-b border-gray-200">
                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-2">Platform Service Fee</h4>
                  <p className="text-gray-600">Marketplace facilitation and escrow management</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-teal-600">15%</div>
                  <p className="text-gray-500 text-sm">of assignment pay</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-6 border-b border-gray-200">
                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-2">Payment Processing</h4>
                  <p className="text-gray-600">ACH transfers: $0 fee | Credit card: Standard processing fees apply</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-teal-600">$0</div>
                  <div className="text-sm text-gray-500">for ACH transfers</div>
                  <div className="text-sm text-gray-500 mt-1">2.9% + $0.30 for credit cards</div>
                </div>
              </div>

              <div className="bg-teal-50 rounded-2xl p-8">
                <h4 className="font-bold text-gray-900 text-xl mb-6">Pricing Example</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Assignment Pay to Physician</span>
                    <span className="font-bold text-gray-900">$8,000.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Platform Service Fee (15%)</span>
                    <span className="font-bold text-gray-900">$1,200.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Payment Processing (ACH Transfer)</span>
                    <span className="font-bold text-gray-900">$0.00</span>
                  </div>
                  <div className="border-t-2 border-teal-600 pt-4 flex items-center justify-between">
                    <span className="text-gray-900 font-bold text-lg">Total Facility Cost</span>
                    <span className="font-bold text-teal-600 text-2xl">$9,200.00</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <p className="text-sm text-gray-600 italic">
                      * If paying by credit card, add 2.9% + $0.30 processing fee ($266.80 in this example)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-teal-600 text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Escrow Protection</h4>
                    <p className="text-gray-600">Funds held securely until assignment completion. Protects both parties.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-teal-600 text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">No Subscription Fees</h4>
                    <p className="text-gray-600">Pay only when you successfully fill an assignment. No monthly or annual fees.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-teal-600 text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Transparent Billing</h4>
                    <p className="text-gray-600">All fees disclosed upfront. No surprise charges or hidden costs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="flex items-start gap-4">
              <i className="ri-information-line text-3xl text-gray-600 flex-shrink-0"></i>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-3">Important Disclaimer</h4>
                <p className="text-gray-700 leading-relaxed">Platform fees are charged to facilities only. Physicians pay $0 to use the platform and receive 100% of the displayed assignment pay. The platform is a technology marketplace and not an employer or staffing agency. Facilities are responsible for all credentialing, compliance, and clinical supervision.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-teal-50 mb-10">Join our transparent marketplace today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/for-physicians" className="inline-block bg-white text-teal-600 px-10 py-4 rounded-xl hover:bg-gray-50 transition-colors text-lg font-semibold whitespace-nowrap shadow-lg cursor-pointer">
              For Physicians
            </Link>
            <Link to="/for-facilities" className="inline-block bg-teal-800 text-white px-10 py-4 rounded-xl hover:bg-teal-900 transition-colors text-lg font-semibold whitespace-nowrap cursor-pointer">
              For Facilities
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
