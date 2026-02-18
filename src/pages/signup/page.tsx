import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import { validateEmail, validatePhone, validatePassword, formatPhoneForSupabase } from "../../utils/validation";

type Role = "physician" | "crna" | "facility" | "vendor";

export default function SignUpPage() {
  const navigate = useNavigate();

  // Step handling (1 = role, 2 = details, 3 = OTP, 4 = confirmation)
  const [step, setStep] = useState<number>(1);

  // Common fields
  const [role, setRole] = useState<Role | "">("");
  const [usePhone, setUsePhone] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("");
  const [contact, setContact] = useState<string>(""); // email or phone
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false);

  // Validation errors
  const [contactError, setContactError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [generalError, setGeneralError] = useState<string>("");

  // OTP handling (6-digit)
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [otpAttempts, setOtpAttempts] = useState<number>(0);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  // Store pending user data for after verification
  const pendingUserData = useRef<{
    fullName: string;
    role: string;
    contact: string;
    password: string;
    usePhone: boolean;
  } | null>(null);

  // Handle OAuth callback redirect
  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('Checking for OAuth callback...', {
        hash: window.location.hash,
        search: window.location.search,
        pathname: window.location.pathname
      });

      // Check if this is an OAuth callback from Supabase
      // Method 1: Check URL hash for tokens (Supabase sometimes puts them there)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hasAccessToken = hashParams.has('access_token');
      const hasRefreshToken = hashParams.has('refresh_token');
      
      // Method 2: Check URL query params for role (our custom param)
      const urlParams = new URLSearchParams(window.location.search);
      const urlRole = urlParams.get('role') as Role | null;
      
      // Method 3: Check localStorage for pending role
      const pendingRole = localStorage.getItem('pending_oauth_role') as Role | null;
      
      // Determine the role from any available source
      const detectedRole = urlRole || pendingRole;
      
      console.log('OAuth detection:', {
        hasAccessToken,
        hasRefreshToken,
        urlRole,
        pendingRole,
        detectedRole
      });

      // Check if we should process OAuth callback
      const shouldProcessOAuth = (hasAccessToken || hasRefreshToken) || 
                                  (detectedRole && step === 1); // Has role and still on role selection step

      if (shouldProcessOAuth && detectedRole) {
        console.log('Processing OAuth callback for role:', detectedRole);
        
        try {
          // Wait a moment for Supabase to process the tokens
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Check for authenticated session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          console.log('Session check:', { hasSession: !!session, error });
          
          if (error) {
            console.error('OAuth session error:', error);
            setGeneralError('Authentication failed. Please try again.');
            localStorage.removeItem('pending_oauth_role');
            // Clean up URL
            window.history.replaceState({}, document.title, '/signup');
            return;
          }

          if (session?.user) {
            console.log('User authenticated, updating profile...');
            
            // Update user metadata with role
            await supabase.auth.updateUser({
              data: { role: detectedRole }
            });

            // Save to database - FIXED ERROR HANDLING
            const { error: upsertError } = await supabase.from('users').upsert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
              role: detectedRole,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

            if (upsertError) {
              console.error('Error saving user to database:', upsertError);
            }

            // Clear pending role
            localStorage.removeItem('pending_oauth_role');

            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);

            console.log('Redirecting to dashboard for role:', detectedRole);

            // Redirect based on role
            if (detectedRole === 'facility') {
              navigate('/facility-dashboard', { replace: true });
            } else if (detectedRole === 'physician' || detectedRole === 'crna' || detectedRole === 'vendor') {
              navigate('/physician-dashboard', { replace: true });
            } else {
              navigate('/profile-completion', { replace: true });
            }
          } else {
            console.log('No session found yet, will retry...');
            // No session yet - might still be processing
            setGeneralError('Please wait while we complete your sign in...');
            // Retry after a moment
            setTimeout(handleOAuthCallback, 1000);
          }
        } catch (error: any) {
          console.error('OAuth processing error:', error);
          setGeneralError('Authentication failed. Please try again.');
          localStorage.removeItem('pending_oauth_role');
          window.history.replaceState({}, document.title, '/signup');
        }
      }
    };

    handleOAuthCallback();
  }, [navigate, step]);

  // Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    if (!role) {
      setGeneralError("Please select a role first");
      return;
    }

    setIsGoogleLoading(true);
    setGeneralError("");

    try {
      // Store role in localStorage for after OAuth redirect
      localStorage.setItem('pending_oauth_role', role);
      console.log('Starting Google OAuth for role:', role);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/signup?role=${role}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      setGeneralError(error.message || "Failed to sign in with Google. Please try again.");
      setIsGoogleLoading(false);
      localStorage.removeItem('pending_oauth_role');
    }
  };

  // Send OTP via Supabase
  const sendOtp = async () => {
    setGeneralError("");
    setContactError("");
    setPasswordError("");

    // Validate contact
    if (usePhone) {
      const phoneValidation = validatePhone(contact);
      if (!phoneValidation.valid) {
        setContactError(phoneValidation.error || "Invalid phone number");
        return;
      }
    } else {
      const emailValidation = validateEmail(contact);
      if (!emailValidation.valid) {
        setContactError(emailValidation.error || "Invalid email address. Please include @ and a valid domain.");
        return;
      }
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.error || "Invalid password");
      return;
    }

    setIsSendingOtp(true);

    try {
      // Store user data for after verification
      pendingUserData.current = {
        fullName,
        role: role as string,
        contact,
        password,
        usePhone
      };

      if (usePhone) {
        // For phone, use signUp which sends SMS OTP
        const formattedPhone = formatPhoneForSupabase(contact);
        const { error } = await supabase.auth.signUp({
          phone: formattedPhone,
          password: password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            }
          }
        });

        if (error) {
          if (error.message?.toLowerCase().includes('phone') && 
              (error.message?.toLowerCase().includes('disabled') || 
               error.message?.toLowerCase().includes('not enabled'))) {
            throw new Error('Phone authentication is not yet enabled. Please use email signup or contact support.');
          }
          throw error;
        }
      } else {
        // For email signup with password + email confirmation code
        const { error } = await supabase.auth.signUp({
          email: contact,
          password: password,
          options: {
            emailRedirectTo: undefined, // No magic link redirect
            data: {
              full_name: fullName,
              role: role,
            }
          }
        });

        if (error) {
          throw error;
        }
      }

      setStep(3);
      setResendTimer(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpAttempts(0);
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
        setGeneralError("This email is already registered. Please log in instead.");
      } else if (error.message?.includes('rate limit')) {
        setGeneralError("Too many requests. Please wait a moment before trying again.");
      } else {
        setGeneralError(error.message || "Failed to send verification code. Please try again.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Countdown for resend button
  useEffect(() => {
    if (step !== 3) return;
    if (resendTimer === 0) return;
    const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer, step]);

  // Handle OTP input change – auto-focus next field
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow 0-9
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace to go to previous field
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle paste for OTP
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || '';
      }
      setOtpDigits(newDigits);
      // Focus the last filled input or the next empty one
      const focusIndex = Math.min(pastedData.length, 5);
      const input = document.getElementById(`otp-${focusIndex}`);
      input?.focus();
    }
  };

  const verifyOtp = async () => {
    if (otpDigits.some((d) => d === "")) {
      setGeneralError("Please enter the complete 6-digit code.");
      return;
    }
    
    setIsVerifying(true);
    setGeneralError("");

    try {
      const otpCode = otpDigits.join("");
      const userData = pendingUserData.current;

      if (!userData) {
        throw new Error("Session expired. Please start over.");
      }

      if (usePhone) {
        const formattedPhone = formatPhoneForSupabase(userData.contact);
        const { data, error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: otpCode,
          type: 'sms'
        });

        if (error) throw error;

        // Save user data to users table - FIXED ERROR HANDLING
        if (data.user) {
          const { error: upsertError } = await supabase.from('users').upsert({
            id: data.user.id,
            phone: formattedPhone,
            full_name: userData.fullName,
            role: userData.role,
            phone_verified: true,
            profile_complete: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

          if (upsertError) {
            console.error('Error saving user to database:', upsertError);
          }
        }
      } else {
        // Verify email confirmation code (signup type)
        const { data, error } = await supabase.auth.verifyOtp({
          email: userData.contact,
          token: otpCode,
          type: 'signup'
        });

        if (error) throw error;

        // Save user data to users table - FIXED ERROR HANDLING
        if (data.user) {
          const { error: upsertError } = await supabase.from('users').upsert({
            id: data.user.id,
            email: userData.contact,
            full_name: userData.fullName,
            role: userData.role,
            email_verified: true,
            profile_complete: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

          if (upsertError) {
            console.error('Error saving user to database:', upsertError);
          }
        }
      }

      // Clear pending data
      pendingUserData.current = null;
      setStep(4); // Move to confirmation screen
    } catch (error: any) {
      setOtpAttempts(prev => prev + 1);
      
      if (otpAttempts >= 2) {
        setGeneralError("Too many incorrect attempts. Please request a new code.");
      } else if (error.message?.includes('expired')) {
        setGeneralError("Verification code has expired. Please request a new code.");
      } else if (error.message?.includes('Invalid') || error.message?.includes('invalid')) {
        setGeneralError("Invalid verification code. Please check the code and try again.");
      } else {
        setGeneralError(error.message || "Verification failed. Please try again.");
      }
      setOtpDigits(["", "", "", "", "", ""]);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {/* STEP 1 – ROLE SELECTION */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Who are you?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <RoleCard
                value="physician"
                label="Physician"
                description="Licensed medical doctor"
                role={role}
                setRole={setRole}
              />
              <RoleCard
                value="crna"
                label="CRNA / Advanced Provider"
                description="Certified Registered Nurse Anesthetist"
                role={role}
                setRole={setRole}
              />
              <RoleCard
                value="facility"
                label="Facility"
                description="Hospital or clinic"
                role={role}
                setRole={setRole}
              />
              <RoleCard
                value="vendor"
                label="Third-Party Vendor"
                description="Service provider"
                role={role}
                setRole={setRole}
              />
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!role}
              className={`mt-6 w-full py-2 rounded-lg text-white font-medium transition-colors whitespace-nowrap cursor-pointer ${
                role
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2 – DETAILS & CONSENT */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Create your account
            </h2>

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
                <span className="px-3 bg-white text-gray-500">or sign up with email</span>
              </div>
            </div>

            {/* Toggle Email / Phone */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => setUsePhone(false)}
                className={`px-3 py-1 rounded whitespace-nowrap cursor-pointer ${
                  !usePhone ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setUsePhone(true)}
                className={`px-3 py-1 rounded whitespace-nowrap cursor-pointer ${
                  usePhone ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                Phone
              </button>
            </div>

            {/* Full Name / DBA */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Full Name / DBA
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe or Acme Clinic"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
              />
            </div>

            {/* Email / Phone Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {usePhone ? "Phone Number" : "Email Address"}
              </label>
              <input
                type={usePhone ? "tel" : "email"}
                value={contact}
                onChange={(e) => {
                  setContact(e.target.value);
                  setContactError("");
                }}
                placeholder={usePhone ? "+1 555-123-4567" : "you@example.com"}
                className={`mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm ${
                  contactError ? "border-red-500" : "border-gray-300"
                }`}
              />
              {contactError && (
                <p className="mt-1 text-xs text-red-600">{contactError}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Create a strong password"
                  className={`mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-xs text-red-600">{passwordError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be 8+ characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            {/* Role-specific consent */}
            <div className="mb-4 flex items-start">
              <input
                type="checkbox"
                id="role-consent"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
              />
              <label htmlFor="role-consent" className="ml-2 text-sm text-gray-700 cursor-pointer">
                {role ? ConsentText[role as Role] : "I accept the role-specific consent."}
              </label>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-4 flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700 cursor-pointer">
                I agree to the <a href="/terms" className="text-teal-600 underline">Terms of Service</a> and{" "}
                <a href="/privacy" className="text-teal-600 underline">Privacy Policy</a>.
              </label>
            </div>

            {/* General Error */}
            {generalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{generalError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 whitespace-nowrap cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={sendOtp}
                disabled={
                  !fullName.trim() ||
                  !contact.trim() ||
                  !password.trim() ||
                  !consentAccepted ||
                  !termsAccepted ||
                  isSendingOtp
                }
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  fullName.trim() &&
                  contact.trim() &&
                  password.trim() &&
                  consentAccepted &&
                  termsAccepted &&
                  !isSendingOtp
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSendingOtp ? (
                  <span className="flex items-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>Sending...
                  </span>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </div>
          </>
        )}

        {/* STEP 3 – OTP VERIFICATION */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Enter Verification Code
            </h2>

            <p className="text-sm text-gray-600 mb-4 text-center">
              We sent a 6-digit code to <strong>{contact}</strong>
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-amber-800 text-center">
                <i className="ri-information-line mr-1"></i>
                Check your {usePhone ? "SMS messages" : "email inbox (and spam folder)"} for the 6-digit code
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-6" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-10 h-12 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            {/* General Error */}
            {generalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{generalError}</p>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <button
                type="button"
                onClick={sendOtp}
                disabled={resendTimer > 0 || isSendingOtp}
                className={`px-3 py-1 text-sm rounded whitespace-nowrap cursor-pointer ${
                  resendTimer === 0 && !isSendingOtp
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSendingOtp ? "Sending..." : resendTimer === 0 ? "Resend Code" : `Resend in ${resendTimer}s`}
              </button>

              <button
                type="button"
                onClick={verifyOtp}
                disabled={otpDigits.some((d) => d === "") || isVerifying}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  otpDigits.every((d) => d !== "") && !isVerifying
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isVerifying ? (
                  <span className="flex items-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>Verifying...
                  </span>
                ) : (
                  "Verify & Create Account"
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full text-sm text-gray-600 hover:underline whitespace-nowrap cursor-pointer"
            >
              ← Change contact info
            </button>
          </>
        )}

        {/* STEP 4 – CONFIRMATION */}
        {step === 4 && (
          <>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-3xl text-teal-600"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Account Created!
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Your account is now active. Complete your profile to start using the platform.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/profile-completion")}
                  className="w-full py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Complete Profile Now
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const userData = pendingUserData.current;
                    const userRole = userData?.role?.toLowerCase() || role;
                    if (userRole === 'facility') {
                      navigate('/facility-dashboard');
                    } else {
                      navigate('/physician-dashboard');
                    }
                  }}
                  className="w-full py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Role Card Component
function RoleCard({
  value,
  label,
  description,
  role,
  setRole,
}: {
  value: Role;
  label: string;
  description: string;
  role: Role | "";
  setRole: (role: Role) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => setRole(value)}
      className={`flex flex-col items-center p-4 border rounded-lg transition-colors cursor-pointer ${
        role === value ? "border-teal-600 bg-teal-50" : "border-gray-300 hover:border-teal-400"
      }`}
    >
      <span className="text-lg font-semibold text-gray-800">{label}</span>
      <span className="text-sm text-gray-600 mt-1 text-center">{description}</span>
    </button>
  );
}

const ConsentText: Record<Role, string> = {
  physician: "I acknowledge that this platform is a technology marketplace only and I will be acting as an independent physician.",
  crna: "I acknowledge that this platform is a technology marketplace only and I will be acting as an independent CRNA / advanced provider.",
  facility: "I acknowledge that this platform is a technology marketplace only and I will be representing a healthcare facility.",
  vendor: "I acknowledge that this platform is a technology marketplace only and I will be offering third-party services.",
};
