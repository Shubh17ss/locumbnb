import { useEffect } from 'react';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-pistachio-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
              <i className="ri-arrow-left-line text-xl"></i>
              <span className="font-medium text-sm">Back to Home</span>
            </a>
            <div className="text-xs text-gray-500">
              Last Updated: January 2025 | Version 1.0
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-gray-600">Platform Agreement for All Users</p>
          </div>

          {/* Document Content */}
          <div className="prose prose-gray max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">1</span>
                Agreement to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing or using the LOCUM BNB Platform, you agree to be bound by these Terms & Conditions ("Terms"). If you do not agree to these Terms, you may not access or use the Platform.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms constitute a legally binding agreement between you and LOCUM BNB. Your continued use of the Platform constitutes acceptance of any modifications to these Terms.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">2</span>
                Definitions
              </h2>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <strong className="text-gray-900">Platform:</strong>
                  <span className="text-gray-700"> The healthcare staffing marketplace and all associated services, websites, and applications.</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <strong className="text-gray-900">Physician:</strong>
                  <span className="text-gray-700"> Licensed medical professionals including physicians, CRNAs, and advanced providers registered on the Platform.</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <strong className="text-gray-900">Facility:</strong>
                  <span className="text-gray-700"> Healthcare organizations, hospitals, clinics, and medical practices seeking temporary staffing.</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <strong className="text-gray-900">Vendor:</strong>
                  <span className="text-gray-700"> Third-party service providers including insurance providers, travel agencies, and other approved partners.</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <strong className="text-gray-900">Assignment:</strong>
                  <span className="text-gray-700"> A temporary staffing engagement between a Physician and Facility facilitated through the Platform.</span>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">3</span>
                User Accounts & Registration
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1 Account Creation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You must create an account to use the Platform. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.2 Account Security</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify the Platform of any unauthorized use of your account.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3.3 Profile Completeness</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Physicians must complete all required profile sections before applying to assignments. Facilities must provide complete organizational information before posting assignments.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">4</span>
                Platform Services
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 Marketplace Services</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Platform provides a marketplace connecting Physicians with Facilities for temporary staffing assignments. The Platform facilitates communication, contract execution, payment processing, and dispute resolution.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2 Third-Party Services</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Platform may facilitate connections with approved third-party Vendors for insurance, travel, and other services. The Platform is not responsible for the quality or delivery of third-party services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.3 Platform Role</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Platform acts as a facilitator and intermediary. The Platform does not employ Physicians, does not provide medical services, and is not responsible for the quality of medical care provided during assignments.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">5</span>
                Non-Circumvention Agreement
              </h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-4">
                <div className="flex items-start gap-3">
                  <i className="ri-alert-line text-2xl text-amber-600 mt-1"></i>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-2">Critical Requirement</h4>
                    <p className="text-amber-800 leading-relaxed">
                      All users agree not to circumvent the Platform by engaging in direct relationships with parties introduced through the Platform for a period of 24 months following initial introduction.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">5.1 Restriction Period</h3>
                  <p className="text-gray-700 leading-relaxed">
                    For 24 months following any introduction made through the Platform, you agree not to engage in any direct business relationship, employment arrangement, or service agreement with the introduced party outside of the Platform.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">5.2 Penalty for Violation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Violation of the non-circumvention agreement will result in a penalty of <strong className="text-red-600">$25,000 per violating party</strong>. This penalty is liquidated damages and not a penalty clause, representing a reasonable estimate of the Platform's damages.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">5.3 Enforcement</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Platform maintains comprehensive records of all introductions and may pursue legal action to enforce this agreement. Users agree to cooperate with any investigation into potential violations.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">6</span>
                Payment Terms
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.1 Platform Fees</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Platform charges a service fee of <strong>15%</strong> on all transactions between Facilities and Physicians. This fee is automatically calculated and deducted during the payment process.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.2 Escrow Services</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All payments are processed through licensed third-party escrow providers (Stripe, PayPal, or other approved providers). The Platform does not directly hold funds. Facilities must fund escrow before assignment start dates.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.3 Payment Release</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Payments are automatically released to Physicians 4 days after assignment completion, unless a dispute is filed within 48 hours before the scheduled release.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.4 Refunds</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Refunds are subject to the Cancellation & Penalty Policy. Platform fees are non-refundable except in cases of Platform error or as required by law.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">7</span>
                Cancellation Policy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cancellations are subject to penalties as defined in the Cancellation & Penalty Policy. Both Physicians and Facilities are subject to cancellation penalties to ensure commitment and reliability.
              </p>
              <p className="text-gray-700 leading-relaxed">
                See the complete <a href="/legal#cancellation-policy" className="text-teal-600 hover:text-teal-700 font-medium">Cancellation & Penalty Policy</a> for detailed terms.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">8</span>
                Dispute Resolution
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">8.1 Dispute Process</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Either party may initiate a dispute through the Platform. A mandatory dispute fee of <strong>$300</strong> is charged immediately upon dispute initiation to prevent frivolous claims.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">8.2 Platform Mediation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All disputes are escalated to the Platform's admin panel for review and mediation. The Platform will review evidence, communicate with both parties, and make a binding determination.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">8.3 Arbitration</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If Platform mediation does not resolve the dispute, the matter will be submitted to binding arbitration in accordance with the rules of the American Arbitration Association.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">9</span>
                User Conduct & Prohibited Activities
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">You agree not to:</p>
                <ul className="space-y-2 ml-6">
                  <li className="text-gray-700 flex items-start gap-2">
                    <i className="ri-close-circle-line text-red-500 mt-1"></i>
                    <span>Provide false, inaccurate, or misleading information</span>
                  </li>
                  <li className="text-gray-700 flex items-start gap-2">
                    <i className="ri-close-circle-line text-red-500 mt-1"></i>
                    <span>Circumvent the Platform to engage in direct relationships</span>
                  </li>
                  <li className="text-gray-700 flex items-start gap-2">
                    <i className="ri-close-circle-line text-red-500 mt-1"></i>
                    <span>Use the Platform for any illegal or unauthorized purpose</span>
                  </li>
                  <li className="text-gray-700 flex items-start gap-2">
                    <i className="ri-close-circle-line text-red-500 mt-1"></i>
                    <span>Interfere with or disrupt the Platform's operation</span>
                  </li>
                  <li className="text-gray-700 flex items-start gap-2">
                    <i className="ri-close-circle-line text-red-500 mt-1"></i>
                    <span>Attempt to gain unauthorized access to any portion of the Platform</span>
                  </li>
                  <li className="text-gray-700 flex items-start gap-2">
                    <i className="ri-close-circle-line text-red-500 mt-1"></i>
                    <span>Harass, abuse, or harm other users</span>
                  </li>
                  <li className="text-gray-700 flex items-start gap-2">
                    <i className="ri-close-circle-line text-red-500 mt-1"></i>
                    <span>Upload viruses or malicious code</span>
                  </li>
                  <li className="text-gray-700 flex items-start gap-2">
                    <i className="ri-close-circle-line text-red-500 mt-1"></i>
                    <span>Scrape or collect data from the Platform without permission</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">10</span>
                Intellectual Property
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Platform and its entire contents, features, and functionality are owned by the Platform and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content from the Platform without express written permission.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">11</span>
                Limitation of Liability
              </h2>
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-4">
                <p className="text-red-900 leading-relaxed font-medium">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE PLATFORM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                The Platform's total liability for any claims arising from your use of the Platform shall not exceed the amount of fees paid by you to the Platform in the 12 months preceding the claim.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">12</span>
                Indemnification
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless the Platform and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of the Platform, your violation of these Terms, or your violation of any rights of another party.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">13</span>
                Termination
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Platform may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, for any reason, including breach of these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, your right to use the Platform will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">14</span>
                Modifications to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The Platform reserves the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on the Platform and updating the "Last Updated" date. Your continued use of the Platform after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">15</span>
                Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in the United States.
              </p>
            </section>

            {/* Section 16 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">16</span>
                Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                <p className="text-gray-700"><strong>Email:</strong> legal@locumbnb.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> 1-800-LOCUMBNB</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Healthcare Way, Medical City, HC 12345</p>
              </div>
            </section>

            {/* Acceptance */}
            <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-8 mt-12">
              <div className="flex items-start gap-4">
                <i className="ri-checkbox-circle-line text-3xl text-teal-600 mt-1"></i>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Acceptance of Terms</h3>
                  <p className="text-gray-700 leading-relaxed">
                    By creating an account, accessing the Platform, or using any Platform services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Documents */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related Legal Documents</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/privacy" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <i className="ri-shield-check-line text-2xl text-teal-600"></i>
              <div>
                <div className="font-medium text-gray-900">Privacy Policy</div>
                <div className="text-sm text-gray-600">How we protect your data</div>
              </div>
            </a>
            <a href="/legal#cancellation-policy" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <i className="ri-calendar-close-line text-2xl text-teal-600"></i>
              <div>
                <div className="font-medium text-gray-900">Cancellation Policy</div>
                <div className="text-sm text-gray-600">Penalties and procedures</div>
              </div>
            </a>
            <a href="/legal#dispute-policy" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <i className="ri-scales-3-line text-2xl text-teal-600"></i>
              <div>
                <div className="font-medium text-gray-900">Dispute Resolution</div>
                <div className="text-sm text-gray-600">How disputes are handled</div>
              </div>
            </a>
            <a href="/legal#vendor-terms" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <i className="ri-store-3-line text-2xl text-teal-600"></i>
              <div>
                <div className="font-medium text-gray-900">Vendor Terms</div>
                <div className="text-sm text-gray-600">Third-party provider rules</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
