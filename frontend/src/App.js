import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';

// Page imports
import LandingPage from './pages/LandingPage';
import AdminPortal from './pages/AdminPortal';
import GovPortal from './pages/GovernmentPortal';
import GovtSelect from './pages/GovtSelect';

// Component imports
import LoginModal from './components/common/LoginModal';
import Header from './components/common/Header';
import ComplaintForm from './components/citizen/ComplaintForm';
import ComplaintTracking from './components/citizen/ComplaintTracking';
import ProfileDropdown from './components/common/ProfileDropdown';
import NotificationsPanel from './components/common/NotificationsPanel';
import ComplaintDetails from './components/citizen/ComplaintDetails';
import PreviousComplaints from "./components/citizen/PreviousComplaints";
import RoleSelectionModal from './components/common/RoleSelectionModal';

// API and constants
import { useApiService } from './services/api';
import { USER_ROLES, COMPLAINT_STATUS } from './utils/constants';

// ---- Helper Components ----
const AdminLoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const handleAdminLogin = (userData) => {
    onLogin(userData);
  };
  return (
    <LoginModal
      isOpen={true}
      onClose={() => navigate('/')}
      onLogin={handleAdminLogin}
      purpose="admin-login"
    />
  );
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!isSignedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Note: Role-based access control will be handled by backend API
  // Frontend routes are protected by authentication only
  return children;
};

// ---- Main App Component ----
const App = () => {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const apiService = useApiService();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPurpose, setLoginPurpose] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Load user data and complaints when authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (!isLoaded || !isSignedIn || !userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Save/update user in database
        if (user) {
          const userData = {
            clerk_id: userId,
            username: user.username || user.primaryEmailAddress?.emailAddress.split('@')[0],
            email: user.primaryEmailAddress?.emailAddress,
            first_name: user.firstName || '',
            last_name: user.lastName || '',
            role: 'citizen', // Default role, will be updated via modal
          };

          try {
            const response = await apiService.saveUser(userData);
            
            // If new user, show role selection modal
            if (response && response.isNewUser) {
              setShowRoleModal(true);
            }
          } catch (saveError) {
            console.error('Error saving user:', saveError);
            // Don't throw - continue even if user save fails
          }
        }

        // Load complaints based on user role
        // This will be handled by individual components

      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, userId]); // Use userId instead of user object to prevent re-runs

  useEffect(() => {
    setShowProfileDropdown(false);
    setShowNotificationsPanel(false);
  }, [location.pathname]);

  // With Clerk, we don't need manual login/logout handling
  const handleLogout = () => {
    setShowProfileDropdown(false);
    setShowNotificationsPanel(false);
    navigate('/');
  };

  const handleSubmitComplaint = async (complaintData) => {
    try {
      setLoading(true);
      setError(null);

      // Transform frontend data to backend format
      const apiComplaintData = {
        user_id: userId,
        username: user?.fullName || 'Anonymous',
        title: complaintData.title || complaintData.issueCategory,
        description: complaintData.description,
        latitude: complaintData.latitude || null,
        longitude: complaintData.longitude || null,
        image: complaintData.image || null,
        tag: complaintData.category || complaintData.issueCategory,
      };

      const response = await apiService.raiseComplaint(apiComplaintData);

      // Success - navigate to tracking page
      navigate('/track-complaint', {
        state: { complaintId: response.complaint_id }
      });

    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError('Failed to submit complaint. Please try again.');
      alert('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComplaint = (id, updates) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id
          ? { ...complaint, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : complaint
      )
    );
  };

  const handleNotificationClick = () => {
    if (!isSignedIn) {
      // Redirect to sign in or show message
      alert('Please sign in to view notifications');
      return;
    }
    setShowNotificationsPanel((prev) => !prev);
    setShowProfileDropdown(false);
  };

  const handleProfileClick = () => {
    if (!isSignedIn) {
      // Redirect to sign in or show message
      alert('Please sign in to view profile');
      return;
    }
    setShowProfileDropdown((prev) => !prev);
    setShowNotificationsPanel(false);
  };

  const handleLandingNavigation = (targetPath) => {
    if (!isSignedIn) {
      // With Clerk, this will redirect to Clerk's sign-in page
      navigate('/sign-in');
      return;
    }

    // For citizen-specific routes, check if user has citizen role
    // This is a simplified check - in production, you'd check user metadata
    if (targetPath === '/complaint-form' || targetPath === '/track-complaint') {
      navigate(targetPath);
    } else {
      navigate(targetPath);
    }
  };


  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen">
      <Header
        user={user}
        isSignedIn={isSignedIn}
        onLogout={handleLogout}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
      />

      {showProfileDropdown && user && (
        <ProfileDropdown user={user} onClose={() => setShowProfileDropdown(false)} />
      )}
      {showNotificationsPanel && (
        <NotificationsPanel onClose={() => setShowNotificationsPanel(false)} />
      )}

      {/* Role Selection Modal for New Users */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        onRoleSelected={(role) => {
          setShowRoleModal(false);
          // Redirect based on selected role
          if (role === 'admin') {
            navigate('/admin-dashboard');
          } else if (role === 'official') {
            navigate('/gov-selection');
          } else {
            navigate('/');
          }
        }}
      />

      <main className="pt-4 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<LandingPage onNavigate={handleLandingNavigation} />} />

          {/* CITIZEN ROUTES */}
          <Route
            path="/complaint-form"
            element={
              <ProtectedRoute>
                <ComplaintForm onSubmitComplaint={handleSubmitComplaint} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/track-complaint"
            element={
              <ProtectedRoute>
                <ComplaintTracking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/previous-complaints"
            element={
              <ProtectedRoute>
                <PreviousComplaints />
              </ProtectedRoute>
            }
          />

          <Route
            path="/complaint/:id"
            element={
              <ProtectedRoute>
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />

          {/* ADMIN & GOV ROUTES */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gov-portal"
            element={
              <ProtectedRoute>
                <GovPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path='/gov-selection'
            element={
              <ProtectedRoute>
                <GovtSelect/>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
