import { useEffect } from 'react';

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">How We Collect, Use, and Protect Your Information</p>
          </div>

          {/* Document Content */}
          <div className="prose prose-gray max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">1</span>
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Privacy Policy describes how LOCUM BNB ("Platform") collects, uses, shares, and protects your personal information. By using the Platform, you consent to the data practices described in this policy.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We are committed to protecting your privacy and ensuring the security of your personal information. This policy applies to all users of the Platform, including Physicians, Facilities, Vendors, and Administrators.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">2</span>
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2.1 Information You Provide</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-gray-700"><strong>Account Information:</strong> Name, email address, phone number, password</p>
                    <p className="text-gray-700"><strong>Profile Information:</strong> Professional credentials, licenses, certifications, work history, specialties</p>
                    <p className="text-gray-700"><strong>Documents:</strong> CV/Resume, NPDB reports, license copies, insurance certificates</p>
                    <p className="text-gray-700"><strong>Payment Information:</strong> Bank account details, tax information (processed securely through third-party providers)</p>
                    <p className="text-gray-700"><strong>Communications:</strong> Messages, support requests, dispute submissions</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2.2 Automatically Collected Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-gray-700"><strong>Usage Data:</strong> Pages visited, features used, time spent on Platform</p>
                    <p className="text-gray-700"><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</p>
                    <p className="text-gray-700"><strong>Location Data:</strong> General geographic location based on IP address</p>
                    <p className="text-gray-700"><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2.3 Information from Third Parties</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-gray-700"><strong>Verification Services:</strong> License verification, credential validation</p>
                    <p className="text-gray-700"><strong>Payment Processors:</strong> Transaction status, payment confirmation</p>
                    <p className="text-gray-700"><strong>Background Checks:</strong> Professional history verification (with your consent)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">3</span>
                How We Use Your Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-teal-50 rounded-lg p-4">
                  <i className="ri-check-line text-teal-600 text-xl mt-1"></i>
                  <div>
                    <strong className="text-gray-900">Platform Services:</strong>
                    <span className="text-gray-700"> Facilitate connections between Physicians and Facilities, process applications, execute contracts</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-teal-50 rounded-lg p-4">
                  <i className="ri-check-line text-teal-600 text-xl mt-1"></i>
                  <div>
                    <strong className="text-gray-900">Payment Processing:</strong>
                    <span className="text-gray-700"> Process payments, manage escrow, calculate fees, issue invoices</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-teal-50 rounded-lg p-4">
                  <i className="ri-check-line text-teal-600 text-xl mt-1"></i>
                  <div>
                    <strong className="text-gray-900">Communication:</strong>
                    <span className="text-gray-700"> Send notifications, reminders, updates, and respond to inquiries</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-teal-50 rounded-lg p-4">
                  <i className="ri-check-line text-teal-600 text-xl mt-1"></i>
                  <div>
                    <strong className="text-gray-900">Verification:</strong>
                    <span className="text-gray-700"> Verify credentials, validate licenses, conduct background checks</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-teal-50 rounded-lg p-4">
                  <i className="ri-check-line text-teal-600 text-xl mt-1"></i>
                  <div>
                    <strong className="text-gray-900">Security:</strong>
                    <span className="text-gray-700"> Detect fraud, prevent abuse, enforce Terms & Conditions</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-teal-50 rounded-lg p-4">
                  <i className="ri-check-line text-teal-600 text-xl mt-1"></i>
                  <div>
                    <strong className="text-gray-900">Analytics:</strong>
                    <span className="text-gray-700"> Improve Platform performance, understand user behavior, optimize features</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-teal-50 rounded-lg p-4">
                  <i className="ri-check-line text-teal-600 text-xl mt-1"></i>
                  <div>
                    <strong className="text-gray-900">Legal Compliance:</strong>
                    <span className="text-gray-700"> Comply with legal obligations, respond to legal requests, enforce agreements</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">4</span>
                Information Sharing
              </h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-4">
                <div className="flex items-start gap-3">
                  <i className="ri-information-line text-2xl text-amber-600 mt-1"></i>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-2">Important Notice</h4>
                    <p className="text-amber-800 leading-relaxed">
                      We do not sell your personal information. We share information only as described below and with your consent where required.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 With Other Users</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you apply to an assignment, your complete verified profile is shared with the Facility. When a Facility posts an assignment, basic information is visible to Physicians browsing opportunities.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2 With Third-Party Vendors</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you opt-in to third-party services (insurance, travel), relevant profile information is shared with approved Vendors to facilitate quotes and services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.3 With Service Providers</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We share information with trusted service providers who assist with payment processing, data storage, email delivery, analytics, and customer support. These providers are contractually obligated to protect your information.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.4 For Legal Reasons</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may disclose information when required by law, to respond to legal process, to protect our rights, to prevent fraud or abuse, or to protect the safety of users or the public.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.5 Business Transfers</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If the Platform is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">5</span>
                Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, or destruction.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="ri-lock-line text-2xl text-teal-600"></i>
                    <strong className="text-gray-900">Encryption</strong>
                  </div>
                  <p className="text-gray-700 text-sm">Data encrypted in transit and at rest using industry-standard protocols</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="ri-shield-check-line text-2xl text-teal-600"></i>
                    <strong className="text-gray-900">Access Controls</strong>
                  </div>
                  <p className="text-gray-700 text-sm">Strict role-based access controls and authentication requirements</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="ri-server-line text-2xl text-teal-600"></i>
                    <strong className="text-gray-900">Secure Infrastructure</strong>
                  </div>
                  <p className="text-gray-700 text-sm">Hosted on secure, monitored servers with regular security audits</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="ri-file-shield-line text-2xl text-teal-600"></i>
                    <strong className="text-gray-900">Audit Logging</strong>
                  </div>
                  <p className="text-gray-700 text-sm">Comprehensive logging of all access and modifications to sensitive data</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">6</span>
                Your Rights & Choices
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.1 Access & Correction</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You may access and update your profile information at any time through your account dashboard. You may also request a copy of your personal information by contacting us.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.2 Data Deletion</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You may request deletion of your account and personal information. Note that we may retain certain information as required by law or for legitimate business purposes (e.g., completed transactions, dispute records).
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.3 Marketing Communications</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You may opt out of marketing emails by clicking the unsubscribe link in any marketing email or by updating your notification preferences in your account settings.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.4 Cookies</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You can control cookies through your browser settings. Note that disabling cookies may affect Platform functionality.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.5 Do Not Track</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Some browsers have a "Do Not Track" feature. The Platform does not currently respond to Do Not Track signals.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">7</span>
                Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to provide Platform services, comply with legal obligations, resolve disputes, and enforce agreements.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-gray-700"><strong>Active Accounts:</strong> Information retained while account is active</p>
                <p className="text-gray-700"><strong>Closed Accounts:</strong> Most information deleted within 90 days of account closure</p>
                <p className="text-gray-700"><strong>Transaction Records:</strong> Retained for 7 years for tax and legal compliance</p>
                <p className="text-gray-700"><strong>Dispute Records:</strong> Retained for 7 years or until dispute resolution</p>
                <p className="text-gray-700"><strong>Audit Logs:</strong> Retained for 7 years for security and compliance</p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">8</span>
                Children's Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The Platform is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will delete it immediately.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">9</span>
                International Data Transfers
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using the Platform, you consent to such transfers.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">10</span>
                Changes to Privacy Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on the Platform and updating the "Last Updated" date. Your continued use after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-sm font-bold">11</span>
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                <p className="text-gray-700"><strong>Privacy Officer:</strong> privacy@locumbnb.com</p>
                <p className="text-gray-700"><strong>Email:</strong> support@locumbnb.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> 1-800-LOCUMBNB</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Healthcare Way, Medical City, HC 12345</p>
              </div>
            </section>

            {/* HIPAA Notice */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 mt-12">
              <div className="flex items-start gap-4">
                <i className="ri-hospital-line text-3xl text-blue-600 mt-1"></i>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">HIPAA Compliance Notice</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    The Platform facilitates connections between healthcare professionals and facilities but does not directly provide medical services. We are committed to protecting health information in accordance with applicable privacy laws.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Physicians and Facilities are independently responsible for HIPAA compliance in their provision and receipt of medical services. The Platform provides secure infrastructure to support compliance efforts.
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
            <a href="/terms" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <i className="ri-file-text-line text-2xl text-teal-600"></i>
              <div>
                <div className="font-medium text-gray-900">Terms & Conditions</div>
                <div className="text-sm text-gray-600">Platform usage agreement</div>
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
