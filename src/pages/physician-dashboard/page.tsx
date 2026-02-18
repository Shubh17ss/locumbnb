import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileStatusBar } from '../../components/feature/ProfileStatusBar';
import { NotificationPanel } from '../../components/feature/NotificationPanel';
import { SettingsModal } from '../../components/feature/SettingsModal';
import { ProfileMenu } from '../../components/feature/ProfileMenu';
import AssignmentTabs from './components/AssignmentTabs';
import DisputeInitiationModal from '../../components/feature/DisputeInitiationModal';
import ReviewRequestNotification from '../../components/feature/ReviewRequestNotification';
import { supabase } from '../../utils/supabaseClient';
import { useProfileCompletion } from '../../hooks/useProfileCompletion';

const PhysicianDashboard = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedAssignmentForDispute, setSelectedAssignmentForDispute] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState('Physician');
  const [currentUserId, setCurrentUserId] = useState('');
  const [reviewRequests, setReviewRequests] = useState<any[]>([]);

  // Use profile completion hook
  const { profile, completionPercentage, isProfileComplete, loading } = useProfileCompletion();

  // Get user name and ID from profile or auth metadata
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Set user ID
          setCurrentUserId(user.id);
          
          // First priority: Use completed profile data (user's official data)
          // Check multiple possible field names for compatibility
          if (profile?.personalIdentifiers) {
            const firstName = profile.personalIdentifiers.legalFirstName || 
                            profile.personalIdentifiers.firstName ||
                            profile.personalIdentifiers.first_name;
            
            if (firstName) {
              setCurrentUserName(firstName);
              return;
            }
          }

          // Second priority: Get from Google OAuth metadata if no profile yet
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
          
          if (fullName) {
            // Use just the first name for a friendlier greeting
            const firstName = fullName.split(' ')[0];
            setCurrentUserName(firstName);
          }
        }
      } catch (error) {
        console.error('Error getting user info:', error);
      }
    };

    getUserInfo();
  }, [profile]);

  // Fetch review requests
  useEffect(() => {
    const fetchReviewRequests = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        // TODO: Fetch review requests from database
        // const { data, error } = await supabase
        //   .from('review_requests')
        //   .select('*')
        //   .eq('physician_id', user.user.id)
        //   .eq('status', 'pending')
        //   .order('created_at', { ascending: false });

        // For now, set empty array
        setReviewRequests([]);
      } catch (error) {
        console.error('Error fetching review requests:', error);
      }
    };

    fetchReviewRequests();
  }, []);

  const handleReviewSubmitted = async (reviewRequestId: string) => {
    console.log('Review submitted for request:', reviewRequestId);
    // TODO: Update review request status in database
    // await supabase
    //   .from('review_requests')
    //   .update({ status: 'completed' })
    //   .eq('id', reviewRequestId);
    
    // Refresh review requests
    setReviewRequests(prev => prev.filter(r => r.id !== reviewRequestId));
  };

  const handleFileDispute = (assignmentId: string) => {
    setSelectedAssignmentForDispute(assignmentId);
    setShowDisputeModal(true);
  };

  const handleCompleteProfile = () => {
    navigate('/profile-completion');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-teal-600 animate-spin"></i>
          <p className="mt-4 text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-teal-500 rounded-lg">
                <i className="ri-stethoscope-line text-lg text-white"></i>
              </div>
              <span className="text-xl font-bold text-slate-900">LOCUM BNB</span>
            </button>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap relative"
              >
                <i className="ri-notification-3-line text-xl"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                <i className="ri-settings-3-line text-xl"></i>
              </button>
              <ProfileMenu 
                userName={currentUserName}
                userRole="physician"
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Status Bar */}
        <ProfileStatusBar 
          isComplete={isProfileComplete}
          completionPercentage={completionPercentage}
          onCompleteProfile={handleCompleteProfile}
        />

        {/* Review Request Notifications */}
        <ReviewRequestNotification
          reviewRequests={reviewRequests}
          currentUserId={currentUserId}
          currentUserRole="physician"
          onReviewSubmitted={handleReviewSubmitted}
        />

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {currentUserName}
          </h1>
          <p className="text-slate-600">Manage your assignments and opportunities</p>
        </div>

        {/* Main Content Tabs */}
        <AssignmentTabs onFileDispute={handleFileDispute} />
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        userRole="physician"
      />

      {/* Dispute Initiation Modal */}
      {selectedAssignmentForDispute && (
        <DisputeInitiationModal
          isOpen={showDisputeModal}
          onClose={() => {
            setShowDisputeModal(false);
            setSelectedAssignmentForDispute(null);
          }}
          assignmentId={selectedAssignmentForDispute}
          initiatorId={currentUserId}
          initiatorName={currentUserName}
          initiatorRole="physician"
          respondentId="fac-001"
          respondentName="Memorial Hospital"
          respondentRole="facility"
        />
      )}
    </div>
  );
};

export default PhysicianDashboard;