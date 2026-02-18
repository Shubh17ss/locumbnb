
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function SignUpConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role;

  useEffect(() => {
    // Redirect to signup if accessed directly without role
    if (!role) {
      navigate('/signup');
    }
  }, [role, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-teal-50/20 flex items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="absolute top-8 left-8">
        <Link to="/">
          <img 
            src="https://public.readdy.ai/ai/img_res/21f47418-dbfd-45ca-9905-fafb6edcc45d.png" 
            alt="LOCUM BNB" 
            className="h-10"
          />
        </Link>
      </div>

      {/* Confirmation Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-checkbox-circle-fill text-4xl text-teal-600"></i>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Account created successfully</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {role === 'physician' 
              ? 'Please complete your professional profile to start applying to assignments.'
              : 'Please complete your facility profile to start posting assignments.'}
          </p>

          {/* CTA Button */}
          <Link
            to={role === 'physician' ? '/profile-completion' : '/facility-setup'}
            className="inline-block w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap mb-4 cursor-pointer"
          >
            Complete Profile
          </Link>

          {/* Skip Link */}
          <Link
            to={role === 'physician' ? '/physician-dashboard' : '/facility-dashboard'}
            className="text-sm text-gray-600 hover:text-teal-600 transition-colors cursor-pointer"
          >
            Skip for now
          </Link>

          {/* Info Box */}
          <div className="mt-8 bg-teal-50 border border-teal-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-teal-600 text-lg mt-0.5"></i>
              <p className="text-sm text-gray-700 text-left leading-relaxed">
                {role === 'physician'
                  ? 'A complete profile is required before you can apply to assignments. This helps facilities review your qualifications.'
                  : 'A complete profile is required before you can post assignments. This helps physicians understand your facility.'}
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-teal-600 transition-colors cursor-pointer">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
