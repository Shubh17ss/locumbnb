
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
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

        {/* Success Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-mail-send-line text-4xl text-teal-600"></i>
            </div>

            {/* Header */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Check your email</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>

            {/* Info Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                Didn't receive the email? Check your spam folder or try again in a few minutes.
              </p>
            </div>

            {/* Back to Login */}
            <Link
              to="/login"
              className="inline-block w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold whitespace-nowrap cursor-pointer"
            >
              Back to Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Forgot Password Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h1>
            <p className="text-gray-600 text-sm">Enter your email and we'll send you reset instructions</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-teal-500 text-sm ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="you@example.com"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>Sending...
                </span>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-teal-600 hover:text-teal-700 transition-colors cursor-pointer">
              ← Back to log in
            </Link>
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
