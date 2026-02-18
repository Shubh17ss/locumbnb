import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Legal Documentation</h1>
          <p className="text-xl text-gray-600 leading-relaxed">Comprehensive legal policies and agreements governing platform use</p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            <button
              onClick={() => scrollToSection('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === 'overview' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Platform Overview
            </button>
            <button
              onClick={() => scrollToSection('cancellation-policy')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === 'cancellation-policy' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancellation Policy
            </button>
            <button
              onClick={() => scrollToSection('dispute-policy')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === 'dispute-policy' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dispute Resolution
            </button>
            <button
              onClick={() => scrollToSection('non-circumvention')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === 'non-circumvention' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Non-Circumvention
            </button>
            <button
              onClick={() => scrollToSection('vendor-terms')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === 'vendor-terms' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vendor Terms
            </button>
          </div>
        </div>
      </section>

      {/* Legal Sections */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Platform Role */}
          <div id="overview" className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-computer-line text-2xl text-teal-600"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Technology Marketplace Only</h2>
                <p className="text-gray-500">Last Updated: January 2025 | Version 1.0</p>
              </div>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>This platform operates exclusively as a technology marketplace that facilitates connections between healthcare facilities and physicians seeking locum tenens assignments.</p>
              <p className="font-semibold">The platform is NOT:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>An employer of physicians or healthcare facilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>A staffing agency or recruitment firm</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>A healthcare provider or medical service organization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>A credentialing or licensing authority</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>A supervisor of clinical care or medical practice</span>
                </li>
              </ul>
              <p>The platform provides technology tools for listing assignments, browsing opportunities, facilitating introductions, and processing payments. All employment relationships, clinical supervision, and medical care occur independently of the platform.</p>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div id="cancellation-policy" className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-calendar-close-line text-2xl text-red-600"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Cancellation & Penalty Policy</h2>
                <p className="text-gray-500">Binding Agreement for All Assignments</p>
              </div>
            </div>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              {/* Overview */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <i className="ri-alert-line text-2xl text-amber-600 mt-1"></i>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-2">Critical Requirement</h4>
                    <p className="text-amber-800">
                      All cancellations are subject to penalties to ensure commitment and reliability. Both Physicians and Facilities are equally bound by this policy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Policy Definition */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Policy Definition at Job Posting</h3>
                <p className="mb-3">
                  Facilities must define cancellation terms when creating each job posting. These terms become binding upon physician application and acceptance.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><strong>Required Elements:</strong></p>
                  <ul className="ml-6 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Cancellation windows (e.g., 30 days, 14 days, 7 days before assignment)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Escalating penalty percentages for each window</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Grace period (if any) with no penalty</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Standard Penalty Structure */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Standard Penalty Structure (Recommended)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-teal-50">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Cancellation Window</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Penalty</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3">30+ days before assignment</td>
                        <td className="border border-gray-300 px-4 py-3 text-green-700 font-medium">0% (No penalty)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">15-29 days before assignment</td>
                        <td className="border border-gray-300 px-4 py-3 text-amber-700 font-medium">25% of total payment</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3">8-14 days before assignment</td>
                        <td className="border border-gray-300 px-4 py-3 text-orange-700 font-medium">50% of total payment</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">1-7 days before assignment</td>
                        <td className="border border-gray-300 px-4 py-3 text-red-700 font-medium">75% of total payment</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3">Day of assignment or no-show</td>
                        <td className="border border-gray-300 px-4 py-3 text-red-900 font-bold">100% of total payment</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Physician Agreement */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Physician Agreement Requirement</h3>
                <p className="mb-3">
                  Before applying to any assignment, physicians must:
                </p>
                <ul className="ml-6 space-y-2">
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span>Review the facility's specific cancellation policy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span>Explicitly accept the cancellation terms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span>Digitally sign acknowledgment of penalties</span>
                  </li>
                </ul>
                <p className="mt-3 font-semibold">
                  This acceptance is legally binding and becomes part of the assignment contract.
                </p>
              </div>

              {/* Symmetry Rule */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Symmetry Rule: Facility Cancellations</h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <p className="text-blue-900 font-semibold mb-2">
                    Facilities are subject to the same penalty structure they define for physicians.
                  </p>
                  <p className="text-blue-800">
                    If a facility cancels an assignment, the physician receives the penalty amount as compensation for lost opportunity and preparation time.
                  </p>
                </div>
              </div>

              {/* Penalty Enforcement */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5. Automated Penalty Enforcement</h3>
                <p className="mb-3">Penalties are enforced automatically through the payment system:</p>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <strong className="text-gray-900">Physician Cancellation:</strong>
                    <p className="text-gray-700 mt-1">Penalty amount is deducted from escrowed payment and transferred to the facility. Remaining balance (if any) is returned to the physician.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <strong className="text-gray-900">Facility Cancellation:</strong>
                    <p className="text-gray-700 mt-1">Penalty amount is deducted from escrowed payment and transferred to the physician. Remaining balance is returned to the facility.</p>
                  </div>
                </div>
              </div>

              {/* Exceptions */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">6. Exceptions & Force Majeure</h3>
                <p className="mb-3">Penalties may be waived in cases of:</p>
                <ul className="ml-6 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Medical emergencies (physician or immediate family)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Natural disasters or extreme weather</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Government-mandated closures or travel restrictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Death in immediate family</span>
                  </li>
                </ul>
                <p className="mt-3 text-sm text-gray-600">
                  <strong>Note:</strong> Exception requests must be submitted with supporting documentation and are subject to platform review.
                </p>
              </div>

              {/* Audit Trail */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">7. Audit Trail & Documentation</h3>
                <p>All cancellations are logged with:</p>
                <ul className="ml-6 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Timestamp of cancellation request</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Reason for cancellation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Penalty amount calculated and applied</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>User identity and IP address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Payment transaction details</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dispute Resolution Policy */}
          <div id="dispute-policy" className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-scales-3-line text-2xl text-purple-600"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Dispute Resolution Policy</h2>
                <p className="text-gray-500">Fair and Transparent Conflict Resolution</p>
              </div>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              {/* Overview */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                <p className="text-purple-900 font-semibold">
                  The Platform provides a structured dispute resolution process to fairly resolve conflicts between Physicians and Facilities.
                </p>
              </div>

              {/* Dispute Initiation */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Dispute Initiation</h3>
                <p className="mb-3">Either party may initiate a dispute through the Platform dashboard.</p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <strong className="text-gray-900">Mandatory Dispute Fee: $300</strong>
                    <p className="text-gray-700 mt-1">Charged immediately upon dispute initiation to prevent frivolous claims. Fee is refundable if dispute is resolved in your favor.</p>
                  </div>
                  <div>
                    <strong className="text-gray-900">Required Information:</strong>
                    <ul className="ml-6 mt-2 space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600">•</span>
                        <span>Assignment details</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600">•</span>
                        <span>Dispute category (payment, quality, conduct, contract breach)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600">•</span>
                        <span>Detailed explanation of the issue</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600">•</span>
                        <span>Supporting documentation (contracts, communications, evidence)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600">•</span>
                        <span>Desired resolution</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dispute Process */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Dispute Resolution Process</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-teal-600">1</span>
                    </div>
                    <div>
                      <strong className="text-gray-900">Automatic Escalation</strong>
                      <p className="text-gray-700 mt-1">Dispute is immediately escalated to Platform admin panel for review.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-teal-600">2</span>
                    </div>
                    <div>
                      <strong className="text-gray-900">Payment Hold</strong>
                      <p className="text-gray-700 mt-1">If dispute involves payment, escrow release is automatically paused until resolution.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-teal-600">3</span>
                    </div>
                    <div>
                      <strong className="text-gray-900">Evidence Collection</strong>
                      <p className="text-gray-700 mt-1">Both parties have 48 hours to submit additional evidence and statements.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-teal-600">4</span>
                    </div>
                    <div>
                      <strong className="text-gray-900">Platform Review</strong>
                      <p className="text-gray-700 mt-1">Admin team reviews all evidence, communications, and contract terms. Review completed within 5-7 business days.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-teal-600">5</span>
                    </div>
                    <div>
                      <strong className="text-gray-900">Mediation Attempt</strong>
                      <p className="text-gray-700 mt-1">Platform facilitates communication between parties to reach mutual resolution.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-teal-600">6</span>
                    </div>
                    <div>
                      <strong className="text-gray-900">Binding Decision</strong>
                      <p className="text-gray-700 mt-1">If mediation fails, Platform issues binding decision based on evidence and contract terms.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dispute Outcomes */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Possible Outcomes</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <strong className="text-gray-900">Full Resolution in Favor of Initiating Party:</strong>
                    <p className="text-gray-700 mt-1">Dispute fee refunded. Requested remedy granted (payment release, penalty waiver, etc.).</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <strong className="text-gray-900">Partial Resolution:</strong>
                    <p className="text-gray-700 mt-1">Compromise solution. Dispute fee may be split or refunded based on outcome.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <strong className="text-gray-900">Resolution in Favor of Responding Party:</strong>
                    <p className="text-gray-700 mt-1">Dispute fee forfeited. Original terms upheld.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <strong className="text-gray-900">Escalation to Arbitration:</strong>
                    <p className="text-gray-700 mt-1">Complex disputes may be escalated to binding arbitration (see Section 5).</p>
                  </div>
                </div>
              </div>

              {/* Abuse Prevention */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Abuse Prevention</h3>
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <p className="text-red-900 font-semibold mb-2">The Platform tracks dispute patterns to prevent abuse:</p>
                  <ul className="ml-6 space-y-2 text-red-800">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Users with 3+ disputes in 12 months are flagged for review</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Frivolous disputes result in warnings and potential account restrictions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Repeated abuse may result in account suspension or termination</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Dispute fees are non-refundable for clearly frivolous claims</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Arbitration */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5. Binding Arbitration</h3>
                <p className="mb-3">
                  If Platform mediation does not resolve the dispute, the matter will be submitted to binding arbitration.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><strong>Arbitration Terms:</strong></p>
                  <ul className="ml-6 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Conducted under American Arbitration Association (AAA) rules</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Single arbitrator selected by mutual agreement or AAA appointment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Arbitration costs split equally between parties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Decision is final and binding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Limited grounds for appeal</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Communication */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">6. Communication During Disputes</h3>
                <p>All dispute-related communication must occur through the Platform:</p>
                <ul className="ml-6 space-y-2 mt-2">
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span>Direct contact between parties is discouraged during active disputes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span>All messages are logged and timestamped</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span>Platform admin team monitors all communications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span>Harassment or abusive language may result in immediate account action</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Non-Circumvention Agreement */}
          <div id="non-circumvention" className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-shield-cross-line text-2xl text-red-600"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Non-Circumvention Agreement</h2>
                <p className="text-gray-500">Mandatory for All Platform Users</p>
              </div>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              {/* Critical Notice */}
              <div className="bg-red-50 border-2 border-red-500 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <i className="ri-error-warning-line text-3xl text-red-600 mt-1"></i>
                  <div>
                    <h4 className="font-bold text-red-900 text-lg mb-2">Legally Binding Agreement</h4>
                    <p className="text-red-800 font-semibold">
                      By using the Platform, you agree not to circumvent the Platform by engaging in direct relationships with parties introduced through the Platform.
                    </p>
                    <p className="text-red-800 mt-2">
                      Violation results in a <strong className="text-red-900">$25,000 penalty per violating party</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Agreement Terms */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Agreement Scope</h3>
                <p className="mb-3">This agreement applies to:</p>
                <ul className="ml-6 space-y-2">
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span><strong>All Physicians</strong> registered on the Platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span><strong>All Facilities</strong> posting assignments on the Platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span><strong>All Third-Party Vendors</strong> providing services through the Platform</span>
                  </li>
                </ul>
                <p className="mt-3">
                  Acceptance occurs automatically upon account creation and is reaffirmed with each application or assignment posting.
                </p>
              </div>

              {/* Restriction Period */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Restriction Period: 24 Months</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="font-semibold text-gray-900 mb-3">
                    For 24 months following any introduction made through the Platform, you agree NOT to:
                  </p>
                  <ul className="ml-6 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Engage in any direct business relationship outside the Platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Enter into employment arrangements without Platform facilitation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Provide or receive services through alternative channels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Share contact information for the purpose of circumvention</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Facilitate introductions to third parties to bypass the Platform</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Penalty Structure */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Penalty for Violation</h3>
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <p className="text-red-900 font-bold text-lg mb-3">
                    $25,000 per violating party
                  </p>
                  <p className="text-red-800 mb-3">
                    This penalty represents liquidated damages, not a penalty clause. It is a reasonable estimate of the Platform's damages resulting from circumvention, including:
                  </p>
                  <ul className="ml-6 space-y-1 text-red-800">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Lost platform fees (15% of transaction value)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Technology infrastructure costs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Marketing and user acquisition expenses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>Administrative and legal costs</span>
                    </li>
                  </ul>
                  <p className="text-red-800 mt-3 font-semibold">
                    Both parties to a circumvention are liable. Total penalty: $50,000 ($25,000 per party).
                  </p>
                </div>
              </div>

              {/* Enforcement */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Enforcement Mechanisms</h3>
                <p className="mb-3">The Platform maintains comprehensive records to enforce this agreement:</p>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <strong className="text-gray-900">Introduction Records:</strong>
                    <p className="text-gray-700 mt-1">All introductions, applications, and communications are logged with timestamps and user identities.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <strong className="text-gray-900">Monitoring:</strong>
                    <p className="text-gray-700 mt-1">Platform monitors for suspicious patterns, including sudden account inactivity after introductions or repeated applications without bookings.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <strong className="text-gray-900">Investigation:</strong>
                    <p className="text-gray-700 mt-1">Users agree to cooperate with any investigation into potential violations, including providing documentation and answering questions.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <strong className="text-gray-900">Legal Action:</strong>
                    <p className="text-gray-700 mt-1">Platform may pursue legal action to enforce this agreement and collect penalties. Violating parties are responsible for all legal fees and costs.</p>
                  </div>
                </div>
              </div>

              {/* Reporting Violations */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5. Reporting Violations</h3>
                <p className="mb-3">
                  If you become aware of a potential violation, you may report it through the Platform's violation reporting system.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <p className="text-blue-900 font-semibold mb-2">Whistleblower Protection:</p>
                  <p className="text-blue-800">
                    Users who report violations in good faith are protected from retaliation. False reports made with malicious intent may result in account penalties.
                  </p>
                </div>
              </div>

              {/* Exceptions */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">6. Limited Exceptions</h3>
                <p className="mb-3">This agreement does NOT prohibit:</p>
                <ul className="ml-6 space-y-2">
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-green-600 mt-1"></i>
                    <span>Relationships that existed prior to Platform introduction (must be documented)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-green-600 mt-1"></i>
                    <span>Relationships formed after the 24-month restriction period expires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-green-600 mt-1"></i>
                    <span>Relationships explicitly approved in writing by the Platform</span>
                  </li>
                </ul>
              </div>

              {/* Digital Signature */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">7. Digital Signature & Acceptance</h3>
                <p className="mb-3">
                  This agreement is digitally signed upon account creation and reaffirmed with each transaction:
                </p>
                <ul className="ml-6 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Timestamp of acceptance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>IP address and device metadata</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>User identity verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Version of agreement accepted</span>
                  </li>
                </ul>
                <p className="mt-3 font-semibold">
                  This digital signature is legally binding and enforceable.
                </p>
              </div>
            </div>
          </div>

          {/* Vendor Terms */}
          <div id="vendor-terms" className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-store-3-line text-2xl text-indigo-600"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Third-Party Vendor Terms</h2>
                <p className="text-gray-500">Requirements for Insurance, Travel & Service Providers</p>
              </div>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              {/* Overview */}
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                <p className="text-indigo-900 font-semibold">
                  Third-party vendors may provide services to Platform users. All vendors must comply with these terms and Platform policies.
                </p>
              </div>

              {/* Vendor Categories */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Approved Vendor Categories</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <i className="ri-shield-check-line text-2xl text-teal-600"></i>
                      <strong className="text-gray-900">Malpractice Insurance</strong>
                    </div>
                    <p className="text-gray-700 text-sm">Licensed insurance providers offering professional liability coverage</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <i className="ri-flight-takeoff-line text-2xl text-teal-600"></i>
                      <strong className="text-gray-900">Travel Services</strong>
                    </div>
                    <p className="text-gray-700 text-sm">Travel agencies, flight booking, hotel accommodations</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <i className="ri-car-line text-2xl text-teal-600"></i>
                      <strong className="text-gray-900">Ground Transportation</strong>
                    </div>
                    <p className="text-gray-700 text-sm">Car rentals, ride services, transportation logistics</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <i className="ri-briefcase-line text-2xl text-teal-600"></i>
                      <strong className="text-gray-900">Professional Services</strong>
                    </div>
                    <p className="text-gray-700 text-sm">Tax preparation, legal services, credentialing assistance</p>
                  </div>
                </div>
              </div>

              {/* Vendor Requirements */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Vendor Requirements</h3>
                <p className="mb-3">All vendors must meet the following requirements:</p>
                <ul className="ml-6 space-y-2">
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span>Valid business license and insurance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span>Industry-specific certifications and credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span>Compliance with all applicable laws and regulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span>Acceptance of Platform terms and vendor agreement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-line text-teal-600 mt-1"></i>
                    <span>Background check and verification (as applicable)</span>
                  </li>
                </ul>
              </div>

              {/* Data Access */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Data Access & Privacy</h3>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-4">
                  <p className="text-amber-900 font-semibold mb-2">Opt-In Only:</p>
                  <p className="text-amber-800">
                    Vendors receive user data ONLY when users explicitly opt-in to receive quotes or services. No data is shared without user consent.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <strong className="text-gray-900">Permitted Data Use:</strong>
                    <ul className="ml-6 mt-2 space-y-1 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600">•</span>
                        <span>Providing requested quotes and services</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600">•</span>
                        <span>Communicating about specific service requests</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600">•</span>
                        <span>Fulfilling contracted services</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <strong className="text-gray-900">Prohibited Data Use:</strong>
                    <ul className="ml-6 mt-2 space-y-1 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600">✗</span>
                        <span>Selling or sharing user data with third parties</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600">✗</span>
                        <span>Marketing unrelated products or services</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600">✗</span>
                        <span>Retaining data beyond service completion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600">✗</span>
                        <span>Contacting users outside the Platform</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Platform Fees */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Platform Fees for Vendor Services</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="font-semibold text-gray-900 mb-3">
                    The Platform charges a 15% service fee on all vendor transactions.
                  </p>
                  <ul className="ml-6 space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Fee calculated on total transaction value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Automatically deducted during payment processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Vendors receive 85% of transaction value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Fee covers platform infrastructure, support, and payment processing</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Service Standards */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5. Service Standards & Response Times</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-teal-50">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Service Type</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Response Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3">Insurance Quotes</td>
                        <td className="border border-gray-300 px-4 py-3">48 hours</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">Travel Booking Requests</td>
                        <td className="border border-gray-300 px-4 py-3">24 hours</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3">Service Inquiries</td>
                        <td className="border border-gray-300 px-4 py-3">24 hours</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">Urgent Requests</td>
                        <td className="border border-gray-300 px-4 py-3">4 hours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Vendors failing to meet response times may be subject to warnings, reduced visibility, or removal from the Platform.
                </p>
              </div>

              {/* Quality Standards */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">6. Quality Standards & Reviews</h3>
                <p className="mb-3">Vendors are subject to user reviews and ratings:</p>
                <ul className="ml-6 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Users may rate vendors after service completion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Ratings visible to all Platform users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Vendors with ratings below 3.5 stars may be reviewed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600">•</span>
                    <span>Repeated poor performance may result in removal</span>
                  </li>
                </ul>
              </div>

              {/* Liability */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">7. Vendor Liability & Platform Role</h3>
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <p className="text-red-900 font-semibold mb-2">
                    The Platform is NOT responsible for vendor service quality, delivery, or performance.
                  </p>
                  <p className="text-red-800 mb-3">
                    Vendors are independent service providers. The Platform facilitates connections but does not guarantee vendor services.
                  </p>
                  <p className="text-red-800">
                    Users agree that disputes with vendors are between the user and vendor. The Platform may assist with mediation but assumes no liability.
                  </p>
                </div>
              </div>

              {/* Termination */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">8. Vendor Removal & Termination</h3>
                <p className="mb-3">The Platform may remove vendors for:</p>
                <ul className="ml-6 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Violation of vendor terms or Platform policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Poor service quality or repeated complaints</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Failure to meet response time requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Misuse of user data or privacy violations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Fraudulent activity or misrepresentation</span>
                  </li>
                </ul>
                <p className="mt-3 text-sm text-gray-600">
                  Removal may be immediate without prior notice for serious violations.
                </p>
              </div>
            </div>
          </div>

          {/* Facility Responsibilities */}
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-hospital-line text-2xl text-teal-600"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Facility Responsibilities</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>Healthcare facilities using this platform are solely responsible for:</p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1 font-bold">•</span>
                  <span><strong>Credentialing and Verification:</strong> Verifying all physician credentials, licenses, certifications, board certifications, DEA registrations, and professional qualifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1 font-bold">•</span>
                  <span><strong>Compliance:</strong> Ensuring compliance with all federal, state, and local healthcare regulations, including HIPAA, Medicare/Medicaid requirements, and state medical board rules</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1 font-bold">•</span>
                  <span><strong>Clinical Supervision:</strong> Providing appropriate clinical supervision, oversight, and quality assurance for all medical services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1 font-bold">•</span>
                  <span><strong>Privileging:</strong> Granting appropriate clinical privileges and ensuring physicians are qualified to perform assigned duties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1 font-bold">•</span>
                  <span><strong>Malpractice Coverage:</strong> Ensuring adequate malpractice insurance coverage is in place</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1 font-bold">•</span>
                  <span><strong>Employment Classification:</strong> Properly classifying physicians as independent contractors and issuing appropriate tax forms (1099-NEC)</span>
                </li>
              </ul>
              <p className="font-semibold mt-6">The platform does not verify, validate, or guarantee any of these responsibilities. Facilities assume all liability for credentialing failures, compliance violations, or clinical care issues.</p>
            </div>
          </div>

          {/* Physician Responsibilities */}
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-user-heart-line text-2xl text-teal-600"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Physician Responsibilities</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>Physicians using this platform are solely responsible for:</p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1 font-bold">•</span>
                  <span><strong>Professional Qualifications:</strong> Maintaining valid medical licenses, board certifications, DEA registrations, and all required credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1 font-bold">•</span>
                  <span><strong>Accurate Information:</strong> Providing truthful, accurate, and complete information about qualifications, experience, and credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1 font-bold">•</span>
                  <span><strong>Clinical Competence:</strong> Ensuring they are qualified and competent to perform assigned clinical duties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1 font-bold">•</span>
                  <span><strong>Independent Contractor Status:</strong> Understanding and accepting their role as independent contractors, not employees</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1 font-bold">•</span>
                  <span><strong>Tax Obligations:</strong> Managing all tax obligations, including estimated tax payments and self-employment taxes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1 font-bold">•</span>
                  <span><strong>Professional Conduct:</strong> Adhering to all applicable medical ethics, standards of care, and professional conduct requirements</span>
                </li>
              </ul>
              <p className="font-semibold mt-6">Physicians operate as independent contractors. The platform does not employ physicians, supervise their work, or assume any liability for their professional conduct or clinical decisions.</p>
            </div>
          </div>

          {/* Links to Full Legal Documents */}
          <div className="bg-teal-50 rounded-2xl p-10 border border-teal-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Legal Documentation</h2>
            <p className="text-gray-700 leading-relaxed mb-6">For complete legal terms and conditions, please review our full legal documents:</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/terms" className="inline-flex items-center justify-center bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap">
                <i className="ri-file-text-line mr-2"></i>
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="inline-flex items-center justify-center bg-white text-teal-600 border-2 border-teal-600 px-8 py-3 rounded-lg hover:bg-teal-50 transition-colors font-semibold whitespace-nowrap">
                <i className="ri-shield-user-line mr-2"></i>
                Privacy Policy
              </Link>
            </div>
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
                <li><Link to="/terms" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">© 2025 LOCUM BNB. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Terms & Conditions</Link>
              <a href="https://readdy.ai/?ref=logo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Powered by Readdy</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors"><i className="ri-twitter-x-line text-xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors"><i className="ri-linkedin-fill text-xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors"><i className="ri-facebook-fill text-xl"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
