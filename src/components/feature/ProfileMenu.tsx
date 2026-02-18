import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileMenuProps {
  userName: string;
  userRole: 'physician' | 'facility' | 'admin';
  onLogout: () => void;
}

export const ProfileMenu = ({ userName, userRole, onLogout }: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  const getDashboardPath = () => {
    switch (userRole) {
      case 'physician': return '/physician-dashboard';
      case 'facility': return '/facility-dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center bg-teal-100 rounded-full hover:bg-teal-200 transition-colors"
      >
        <i className="ri-user-line text-xl text-teal-600"></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="font-semibold text-gray-900">{userName}</p>
            <p className="text-sm text-gray-600 capitalize">{userRole}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => handleNavigation(getDashboardPath())}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
            >
              <i className="ri-dashboard-line text-lg"></i>
              <span>Dashboard</span>
            </button>

            {userRole !== 'admin' && (
              <button
                onClick={() => handleNavigation('/profile-completion')}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
              >
                <i className="ri-user-settings-line text-lg"></i>
                <span>My Profile</span>
              </button>
            )}

            <button
              onClick={() => handleNavigation('/')}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
            >
              <i className="ri-home-line text-lg"></i>
              <span>Home</span>
            </button>

            {userRole !== 'admin' && (
              <>
                <button
                  onClick={() => handleNavigation('/how-it-works')}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <i className="ri-question-line text-lg"></i>
                  <span>How It Works</span>
                </button>

                <button
                  onClick={() => handleNavigation('/pricing')}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <i className="ri-price-tag-3-line text-lg"></i>
                  <span>Pricing</span>
                </button>
              </>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={handleLogoutClick}
              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <i className="ri-logout-box-line text-lg"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
