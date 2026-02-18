import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminRole } from '../../types/admin';
import { getRolePermissions } from '../../utils/adminPermissions';
import { adminAuditLogger } from '../../utils/adminAuditLogger';
import { supabase } from '@/utils/supabaseClient';



export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find admin user
      // const adminUser = MOCK_ADMIN_USERS.find(
      //   user => user.email === email && user.password === password
      // );
      console.log('Attempting login with:', { email, password });
      const { data: adminUser, error: dbError } = await supabase
        .from('admin')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .maybeSingle();

      console.log('Database query result:', { adminUser, dbError });
      if (dbError || !adminUser) {
        console.log('Login failed:', dbError);
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Create session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const session = {
        sessionId,
        adminId: `admin_${adminUser.email}`,
        adminEmail: adminUser.email,
        adminRole: adminUser.role,
        loginTime: new Date().toISOString(),
        ipAddress: 'Client IP (captured server-side)',
        deviceInfo: navigator.userAgent,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
        permissions: getRolePermissions(adminUser.role),
      };

      // Store session
      localStorage.setItem('admin_session', JSON.stringify(session));

      // Log the login action
      adminAuditLogger.log(
        session.adminId,
        session.adminEmail,
        session.adminRole,
        'ADMIN_LOGIN',
        'session',
        sessionId,
        {
          loginMethod: 'password',
          success: true,
        },
        sessionId
      );

      // Redirect to admin dashboard with replace to prevent back navigation
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError('An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Security Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
            <i className="ri-shield-keyhole-line text-3xl text-red-400"></i>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-slate-400 text-sm">Secure Platform Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-mail-line text-slate-500"></i>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="admin@platform.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-lock-line text-slate-500"></i>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start gap-3">
                <i className="ri-error-warning-line text-red-400 text-lg mt-0.5"></i>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  Authenticating...
                </>
              ) : (
                <>
                  <i className="ri-login-box-line"></i>
                  Secure Login
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="flex items-start gap-3 text-xs text-slate-400">
              <i className="ri-information-line text-slate-500 mt-0.5"></i>
              <p>
                All admin sessions are logged and monitored. Unauthorized access attempts will be reported.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
