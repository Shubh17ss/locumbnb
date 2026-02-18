import { useState } from 'react';
import { MarketplaceContract } from '../../types/contract';
import { createMarketplaceContract } from '../../utils/contractManager';

interface NonCircumventionAgreementProps {
  userType: 'physician' | 'facility' | 'vendor';
  userId: string;
  onAccept: (contract: MarketplaceContract) => void;
  onDecline: () => void;
}

const NonCircumventionAgreement = ({ userType, userId, onAccept, onDecline }: NonCircumventionAgreementProps) => {
  const [legalName, setLegalName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = () => {
    if (!legalName.trim() || !agreed) return;

    setLoading(true);

    // Capture device info
    const deviceInfo = navigator.userAgent;
    const ipAddress = 'captured-by-backend'; // In production, capture from backend

    // Create contract
    const contract = createMarketplaceContract(
      userId,
      userType,
      legalName,
      legalName,
      ipAddress,
      deviceInfo
    );

    setTimeout(() => {
      setLoading(false);
      onAccept(contract);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-shield-check-line text-2xl text-red-600"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Non-Circumvention Agreement</h2>
              <p className="text-sm text-gray-600">Required for platform access</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <i className="ri-error-warning-line text-xl text-red-600 flex-shrink-0 mt-0.5"></i>
              <div>
                <p className="text-sm font-semibold text-red-900">Legally Binding Agreement</p>
                <p className="text-sm text-red-700 mt-1">
                  This agreement is legally enforceable. Violations may result in penalties up to $25,000 per incident.
                </p>
              </div>
            </div>
          </div>

          {/* Agreement Text */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-900 max-h-96 overflow-y-auto border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900">NON-CIRCUMVENTION AND PLATFORM EXCLUSIVITY AGREEMENT</h3>
            
            <p className="font-semibold">Effective Date: {new Date().toLocaleDateString()}</p>

            <div className="space-y-3">
              <p><strong>1. PARTIES</strong></p>
              <p>This Non-Circumvention Agreement ("Agreement") is entered into between:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Platform:</strong> [Platform Name] ("Platform")</li>
                <li><strong>User:</strong> You, the {userType} ("User")</li>
              </ul>

              <p><strong>2. PURPOSE</strong></p>
              <p>
                The Platform facilitates connections between healthcare facilities and healthcare professionals. 
                This Agreement ensures all parties conduct business exclusively through the Platform for matches 
                made via the Platform.
              </p>

              <p><strong>3. RESTRICTION PERIOD</strong></p>
              <p>
                User agrees that for a period of <strong>twenty-four (24) months</strong> from the date of any 
                introduction, match, or connection made through the Platform, User shall not:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Contact the other party directly outside the Platform</li>
                <li>Arrange assignments or bookings outside the Platform</li>
                <li>Process payments outside the Platform's escrow system</li>
                <li>Share contact information for the purpose of circumventing the Platform</li>
                <li>Engage in any business relationship that bypasses Platform fees or oversight</li>
              </ul>

              <p><strong>4. PERMITTED COMMUNICATIONS</strong></p>
              <p>All communications regarding assignments matched through the Platform must occur:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Within the Platform's messaging system</li>
                <li>Through Platform-approved channels</li>
                <li>With full visibility and audit trail maintained by the Platform</li>
              </ul>

              <p><strong>5. PENALTIES FOR VIOLATION</strong></p>
              <p>User acknowledges and agrees that violation of this Agreement will result in:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Monetary Penalty:</strong> $25,000 USD per violation</li>
                <li><strong>Immediate Account Suspension:</strong> Access to the Platform will be suspended</li>
                <li><strong>Legal Action:</strong> Platform reserves the right to pursue additional legal remedies</li>
                <li><strong>Collections:</strong> Unpaid penalties will be sent to collections agencies</li>
              </ul>

              <p><strong>6. VIOLATION DETECTION</strong></p>
              <p>User acknowledges that the Platform employs automated and manual monitoring systems including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Email pattern analysis</li>
                <li>Communication metadata tracking</li>
                <li>Payment anomaly detection</li>
                <li>User-reported violations</li>
              </ul>

              <p><strong>7. INVESTIGATION PROCESS</strong></p>
              <p>Upon detection or report of a potential violation:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Platform will conduct a formal investigation</li>
                <li>User will be notified and given opportunity to respond</li>
                <li>Evidence will be reviewed by compliance team</li>
                <li>Decision will be made within 14 business days</li>
                <li>All actions will be logged and auditable</li>
              </ul>

              <p><strong>8. PAYMENT OF PENALTIES</strong></p>
              <p>If a violation is confirmed:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Penalty invoice will be issued immediately</li>
                <li>Payment is due within 30 days of invoice date</li>
                <li>Failure to pay within 60 days results in collections referral</li>
                <li>User remains liable for all collection costs and legal fees</li>
              </ul>

              <p><strong>9. PLATFORM FEES</strong></p>
              <p>User acknowledges that all transactions facilitated through the Platform are subject to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>15% platform fee on all assignment payments</li>
                <li>15% platform fee on all third-party vendor services</li>
                <li>Fees are automatically calculated and deducted during escrow flow</li>
              </ul>

              <p><strong>10. AUDIT TRAIL</strong></p>
              <p>User acknowledges that:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>All Platform actions are logged with timestamp and IP address</li>
                <li>Digital signatures are legally binding</li>
                <li>Audit logs may be used as evidence in enforcement actions</li>
                <li>Platform maintains records for minimum of 7 years</li>
              </ul>

              <p><strong>11. DISPUTE RESOLUTION</strong></p>
              <p>Any disputes regarding this Agreement shall be:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>First addressed through Platform's internal dispute resolution process</li>
                <li>Subject to binding arbitration if unresolved</li>
                <li>Governed by the laws of [Jurisdiction]</li>
              </ul>

              <p><strong>12. SEVERABILITY</strong></p>
              <p>
                If any provision of this Agreement is found to be unenforceable, the remaining provisions 
                shall remain in full force and effect.
              </p>

              <p><strong>13. ENTIRE AGREEMENT</strong></p>
              <p>
                This Agreement constitutes the entire agreement between the parties regarding non-circumvention 
                and supersedes all prior agreements or understandings.
              </p>

              <p><strong>14. ACKNOWLEDGMENT</strong></p>
              <p>By signing below, User acknowledges that they have:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Read and understood this entire Agreement</li>
                <li>Had opportunity to seek legal counsel</li>
                <li>Voluntarily agree to all terms and conditions</li>
                <li>Understand the penalties for violation</li>
                <li>Agree to conduct all Platform-matched business exclusively through the Platform</li>
              </ul>
            </div>
          </div>

          {/* Digital Signature Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Digital Signature</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Legal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Type your full legal name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-600 mt-2">
                By typing your name, you are creating a legally binding digital signature
              </p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
              />
              <label htmlFor="agree" className="text-sm text-gray-900 cursor-pointer">
                I have read, understood, and agree to be bound by this Non-Circumvention Agreement. 
                I understand that violations may result in penalties up to $25,000 per incident and 
                immediate account suspension.
              </label>
            </div>

            <div className="bg-white border border-blue-300 rounded-lg p-4">
              <p className="text-xs text-gray-600">
                <strong>Timestamp:</strong> {new Date().toLocaleString()}<br />
                <strong>IP Address:</strong> Will be captured upon submission<br />
                <strong>Device:</strong> {navigator.userAgent.split(' ').slice(0, 3).join(' ')}...
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onDecline}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 whitespace-nowrap"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={!legalName.trim() || !agreed || loading}
              className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-loader-4-line animate-spin"></i>
                  Processing...
                </span>
              ) : (
                'Accept & Sign'
              )}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Declining this agreement will prevent you from accessing the Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default NonCircumventionAgreement;
