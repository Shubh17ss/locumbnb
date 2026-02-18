import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import { validateEmail } from "../../utils/validation";

type LoginStep = "email" | "otp";

export default function LoginPage() {
  const navigate = useNavigate();

  // UI state
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState<string>("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  // Handle OAuth callback redirect AND existing sessions
  useEffect(() => {
    const handleAuthCheck = async () => {
      console.log('Login page: Checking for OAuth callback...', {
        hash: window.location.hash,
        search: window.location.search,
        pathname: window.location.pathname
      });

      // Check if this is an OAuth callback from Supabase
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hasAccessToken = hashParams.has('access_token');
      const hasRefreshToken = hashParams.has('refresh_token');
      
      console.log('Login OAuth detection:', {
        hasAccessToken,
        hasRefreshToken
      });

      // ALWAYS check for session (whether OAuth callback or not)
      try {
        // Wait a moment for Supabase to process tokens if this is OAuth callback
        if (hasAccessToken || hasRefreshToken) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Check for authenticated session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Login session check:', { hasSession: !!session, error });
        
        if (error) {
          console.error('Session error:', error);
          return;
        }

        if (session?.user) {
          console.log('User is authenticated, redirecting...');
          
          // Save user to database
          await saveUserToDatabase(session.user);

          // Get user role and redirect
          const userRole = session.user.user_metadata?.role?.toLowerCase();

          console.log('Redirecting to dashboard for role:', userRole);

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);

          // Redirect based on role
          if (userRole === 'facility') {
            navigate('/facility-dashboard', { replace: true });
          } else if (userRole === 'physician' || userRole === 'crna' || userRole === 'vendor') {
            navigate('/physician-dashboard', { replace: true });
          } else {
            // User exists but no role - send to profile completion
            navigate('/profile-completion', { replace: true });
          }
        } else {
          console.log('No active session found');
        }
      } catch (error: any) {
        console.error('Auth check error:', error);
      }
    };

    handleAuthCheck();
  }, [navigate]);

  // Cooldown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg("");

    try {
      console.log('Starting Google OAuth login...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      setErrorMsg(error.message || "Failed to sign in with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  // Save user data to database
  const saveUserToDatabase = async (user: any) => {
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error saving user to database:', error);
      }
    } catch (err) {
      console.error('Error in saveUserToDatabase:', err);
    }
  };

  // Send OTP to email
  const handleSendOTP = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setErrorMsg(emailValidation.error || "Invalid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use signInWithOtp to send a 6-digit code to email
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false, // Don't create new users on login - they should sign up first
        }
      });

      if (error) {
        // If user doesn't exist, show helpful message
        if (error.message?.includes('Signups not allowed') || error.message?.includes('not allowed')) {
          throw new Error("No account found with this email. Please sign up first.");
        }
        throw error;
      }

      // Move to OTP verification step
      setStep("otp");
      setSuccessMsg(`A 6-digit code has been sent to ${email}`);
      setResendCooldown(60);
      setOtpDigits(["", "", "", "", "", ""]);
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    setErrorMsg("");
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`login-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`login-otp-${index - 1}`);
      prevInput?.focus();
    }
    // Auto-submit when all digits entered and Enter pressed
    if (e.key === 'Enter' && otpDigits.every(d => d !== '')) {
      handleVerifyOTP();
    }
  };

  // Handle paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || '';
      }
      setOtpDigits(newDigits);
      const focusIndex = Math.min(pastedData.length, 5);
      const input = document.getElementById(`login-otp-${focusIndex}`);
      input?.focus();
    }
  };

  // Verify OTP code
  const handleVerifyOTP = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    const otpCode = otpDigits.join("");
    if (otpCode.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit code");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otpCode,
        type: 'email',
      });

      if (error) throw error;

      if (data.user) {
        // Save user to database
        await saveUserToDatabase(data.user);

        // Get user role and redirect
        const userRole = data.user.user_metadata?.role?.toLowerCase();
        
        setSuccessMsg("Login successful! Redirecting...");
        
        setTimeout(() => {
          if (userRole === 'facility') {
            navigate('/facility-dashboard', { replace: true });
          } else if (userRole === 'physician' || userRole === 'crna') {
            navigate('/physician-dashboard', { replace: true });
          } else {
            // User exists but no role - send to profile completion
            navigate('/profile-completion', { replace: true });
          }
        }, 500);
      }
    } catch (error: any) {
      if (error.message?.includes('expired')) {
        setErrorMsg("Code has expired. Please request a new one.");
      } else if (error.message?.includes('Invalid') || error.message?.includes('invalid')) {
        setErrorMsg("Invalid code. Please check and try again.");
      } else {
        setErrorMsg(error.message || "Verification failed. Please try again.");
      }
      setOtpDigits(["", "", "", "", "", ""]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error) throw error;

      setSuccessMsg("A new code has been sent to your email");
      setResendCooldown(60);
      setOtpDigits(["", "", "", "", "", ""]);
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to resend code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to email step
  const handleBackToEmail = () => {
    setStep("email");
    setOtpDigits(["", "", "", "", "", ""]);
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {step === "email" ? "Log In" : "Enter Verification Code"}
        </h2>
        
        {step === "email" ? (
          <>
            <p className="text-gray-600 text-sm text-center mb-6">
              Enter your email to receive a 6-digit verification code
            </p>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <i className="ri-loader-4-line animate-spin text-lg"></i>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="font-medium text-gray-700">
                {isGoogleLoading ? "Connecting..." : "Continue with Google"}
              </span>
            </button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
              />
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errorMsg}</p>
              </div>
            )}

            {/* Send OTP Button */}
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={isSubmitting || !email.trim()}
              className={`w-full py-2.5 rounded-lg text-white font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isSubmitting || !email.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>Sending code...
                </span>
              ) : (
                "Send Verification Code"
              )}
            </button>

            {/* Links */}
            <div className="flex justify-center mt-4 text-sm">
              <span className="text-gray-600">Don&apos;t have an account?</span>
              <a href="/signup" className="text-teal-600 hover:underline whitespace-nowrap ml-1 cursor-pointer">
                Sign up
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 text-sm text-center mb-2">
              We sent a 6-digit code to
            </p>
            <p className="font-medium text-gray-900 text-center mb-6">{email}</p>

            {/* Success message */}
            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600 flex items-center justify-center">
                  <i className="ri-checkbox-circle-line mr-2"></i>
                  {successMsg}
                </p>
              </div>
            )}

            {/* OTP Input - 6 separate boxes */}
            <div className="flex justify-center gap-2 mb-6" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`login-otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-14 text-center border border-gray-300 rounded-lg text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errorMsg}</p>
              </div>
            )}

            {/* Verify Button */}
            <button
              type="button"
              onClick={handleVerifyOTP}
              disabled={isSubmitting || otpDigits.some(d => d === '')}
              className={`w-full py-2.5 rounded-lg text-white font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isSubmitting || otpDigits.some(d => d === '')
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>Verifying...
                </span>
              ) : (
                "Verify & Log In"
              )}
            </button>

            {/* Resend & Back buttons */}
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={handleBackToEmail}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center cursor-pointer"
              >
                <i className="ri-arrow-left-line mr-1"></i>
                Change email
              </button>
              
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || isSubmitting}
                className={`text-sm whitespace-nowrap cursor-pointer ${
                  resendCooldown > 0 || isSubmitting
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-teal-600 hover:text-teal-700"
                }`}
              >
                {resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  "Resend code"
                )}
              </button>
            </div>

            {/* Help text */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 text-center">
                <i className="ri-information-line mr-1"></i>
                Check your inbox and spam folder for the verification code
              </p>
            </div>
          </>
        )}

        {/* Security note */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center flex items-center justify-center">
            <i className="ri-shield-check-line mr-1 text-teal-600"></i>
            Secure passwordless authentication
          </p>
        </div>
      </div>
    </div>
  );
}
