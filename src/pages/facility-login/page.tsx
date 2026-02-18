import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { validateEmail, validatePhone, formatPhoneForSupabase } from '../../utils/validation';

export default function FacilityLoginPage() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const supportsPasskey = 'credentials' in navigator && 'PublicKeyCredential' in window;
  const supportsBiometric = 'credentials' in navigator;

  const handleSendOTP = async () => {
    setIsLoading(true);
    setError('');

    // Validate contact
    if (loginMethod === 'phone') {
      const phoneValidation = validatePhone(emailOrPhone);
      if (!phoneValidation.valid) {
        setError(phoneValidation.error || "Invalid phone number");
        setIsLoading(false);
        return;
      }
    } else {
      const emailValidation = validateEmail(emailOrPhone);
      if (!emailValidation.valid) {
        setError(emailValidation.error || "Invalid email");
        setIsLoading(false);
        return;
      }
    }

    try {
      if (loginMethod === 'phone') {
        const formattedPhone = formatPhoneForSupabase(emailOrPhone);
        const { error: otpError } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        });
        if (otpError) throw otpError;
      } else {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: emailOrPhone,
        });
        if (otpError) throw otpError;
      }

      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let authData;

      if (authMethod === 'otp') {
        const otpCode = otp.join('');
        
        if (loginMethod === 'phone') {
          const formattedPhone = formatPhoneForSupabase(emailOrPhone);
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            phone: formattedPhone,
            token: otpCode,
            type: 'sms'
          });
          if (verifyError) throw verifyError;
          authData = data;
        } else {
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            email: emailOrPhone,
            token: otpCode,
            type: 'email'
          });
          if (verifyError) throw verifyError;
          authData = data;
        }
      } else {
        // Password login
        if (loginMethod === 'phone') {
          const formattedPhone = formatPhoneForSupabase(emailOrPhone);
          const { data, error: loginError } = await supabase.auth.signInWithPassword({
            phone: formattedPhone,
            password: password,
          });
          if (loginError) throw loginError;
          authData = data;
        } else {
          const { data, error: loginError } = await supabase.auth.signInWithPassword({
            email: emailOrPhone,
            password: password,
          });
          if (loginError) throw loginError;
          authData = data;
        }
      }

      // Verify user role is facility
      const userRole = authData.user?.user_metadata?.role?.toLowerCase();
      
      if (userRole !== 'facility') {
        setError('This login is for facilities only. Please use the correct login page for your account type.');
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      // Navigate to facility dashboard
      navigate('/facility-dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate passkey authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After passkey auth, verify role
      const { data } = await supabase.auth.getUser();
      const userRole = data.user?.user_metadata?.role?.toLowerCase();
      
      if (userRole !== 'facility') {
        setError('This login is for facilities only.');
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }
      
      navigate('/facility-dashboard', { replace: true });
    } catch (err) {
      setError('Passkey authentication failed');
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After biometric auth, verify role
      const { data } = await supabase.auth.getUser();
      const userRole = data.user?.user_metadata?.role?.toLowerCase();
      
      if (userRole !== 'facility') {
        setError('This login is for facilities only.');
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }
      
      navigate('/facility-dashboard', { replace: true });
    } catch (err) {
      setError('Biometric authentication failed');
      setIsLoading(false);
    }
  };

  if (otpSent && authMethod === 'otp') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-mail-send-line text-teal-600 text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter verification code</h2>
              <p className="text-sm text-gray-600">
                We sent a 6-digit code to {emailOrPhone}
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="flex justify-center space-x-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ))}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    <i className="ri-error-warning-line mr-1"></i>
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.some(d => !d)}
                className="w-full px-6 py-3 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Verifying...
                  </>
                ) : (
                  'Verify & Log In'
                )}
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap"
              >
                Use a different method
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Facility Login</h1>
          <p className="text-sm text-gray-600">Access your facility dashboard</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {/* Login Method Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                loginMethod === 'email'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-mail-line mr-2"></i>
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                loginMethod === 'phone'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-phone-line mr-2"></i>
              Phone
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email or Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {loginMethod === 'email' ? 'Email address' : 'Phone number'}
              </label>
              <input
                type={loginMethod === 'email' ? 'email' : 'tel'}
                value={emailOrPhone}
                onChange={(e) => {
                  setEmailOrPhone(e.target.value);
                  setError('');
                }}
                placeholder={loginMethod === 'email' ? 'you@facility.com' : '(555) 123-4567'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {/* Auth Method Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setAuthMethod('password')}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  authMethod === 'password'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  authMethod === 'otp'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                One-time code
              </button>
            </div>

            {/* Password or OTP */}
            {authMethod === 'password' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <a href="/forgot-password" className="text-teal-600 hover:text-teal-700 whitespace-nowrap">
                    Forgot password?
                  </a>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading || !emailOrPhone}
                className="w-full px-6 py-3 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Sending code...
                  </>
                ) : (
                  'Send verification code'
                )}
              </button>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  <i className="ri-error-warning-line mr-1"></i>
                  {error}
                </p>
              </div>
            )}

            {authMethod === 'password' && (
              <button
                type="submit"
                disabled={isLoading || !emailOrPhone || !password}
                className="w-full px-6 py-3 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </button>
            )}
          </form>

          {/* Alternative Login Methods */}
          {(supportsPasskey || supportsBiometric) && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="space-y-2">
                {supportsPasskey && (
                  <button
                    type="button"
                    onClick={handlePasskeyLogin}
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-key-2-line mr-2"></i>
                    Sign in with Passkey
                  </button>
                )}

                {supportsBiometric && (
                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-fingerprint-line mr-2"></i>
                    Sign in with Biometrics
                  </button>
                )}
              </div>
            </>
          )}

          {/* Security Note */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <i className="ri-shield-check-line mr-1"></i>
              Enable 2FA in your account security settings for additional protection.
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup?role=facility" className="text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap">
                Create facility account
              </a>
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Technology marketplace only. Not an employer or staffing agency.
          </p>
        </div>
      </div>
    </div>
  );
}
