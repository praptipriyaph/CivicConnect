import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

// Page imports
import LandingPage from './pages/LandingPage';
import AdminPortal from './pages/AdminPortal';
import GovPortal from './pages/GovPortal';

// Component imports
import LoginModal from './components/common/LoginModal';
import Header from './components/common/Header';
import ComplaintForm from './components/citizen/ComplaintForm';
import ComplaintTracking from './components/citizen/ComplaintTracking';
import ProfileDropdown from './components/common/ProfileDropdown';
import NotificationsPanel from './components/common/NotificationsPanel';

// Data and constants
import { mockComplaints as initialMockComplaints } from './utils/mockData';
import { USER_ROLES, COMPLAINT_STATUS } from './utils/constants';

// ---- Helper Components ----

// AdminLoginPage component
const AdminLoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const handleAdminLogin = (userData) => {
    onLogin(userData); // Use the main login handler
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

// ProtectedRoute component
const ProtectedRoute = ({ user, allowedRoles, children }) => {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// ---- Main App Component ----

const App = () => {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState(initialMockComplaints);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPurpose, setLoginPurpose] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setShowProfileDropdown(false);
    setShowNotificationsPanel(false);
  }, [location.pathname]);

  const promptLogin = (purpose) => {
    setLoginPurpose(purpose);
    setShowLoginModal(true);
    setShowProfileDropdown(false);
    setShowNotificationsPanel(false);
  };

   const handleLogin = (userData) => {
    setUser(userData);
    setShowLoginModal(false);

    const origin = location.state?.from?.pathname;
    let redirectTo = '/';

    if (loginPurpose === '/complaint-form' || loginPurpose === '/track-complaint') {
        redirectTo = (userData.role === USER_ROLES.CITIZEN) ? loginPurpose :
                     (userData.role === USER_ROLES.ADMIN) ? '/admin-dashboard' :
                     (userData.role === USER_ROLES.GOVERNMENT) ? '/gov-portal' : '/';
    } else if (origin && origin !== '/') {
         if (origin === '/admin-dashboard' && userData.role !== USER_ROLES.ADMIN) redirectTo = '/';
         else if (origin === '/gov-portal' && userData.role !== USER_ROLES.GOVERNMENT) redirectTo = '/';
         else if ((origin === '/complaint-form' || origin === '/track-complaint') && userData.role !== USER_ROLES.CITIZEN) redirectTo = '/';
         else redirectTo = origin;
    } else {
        switch (userData.role) {
            case USER_ROLES.ADMIN:      redirectTo = '/admin-dashboard'; break;
            case USER_ROLES.GOVERNMENT: redirectTo = '/gov-portal'; break;
            case USER_ROLES.CITIZEN:    redirectTo = '/'; break;
            // ***ADDED DEFAULT CASE***
            default:                    redirectTo = '/'; break; // Default redirect for safety
        }
    }

    if (loginPurpose === 'profile' && redirectTo !== '/') setShowProfileDropdown(true);
    if (loginPurpose === 'notifications' && redirectTo !== '/') setShowNotificationsPanel(true);

    setLoginPurpose('');
    navigate(redirectTo, { replace: true });
  };


  const handleLogout = () => {
    setUser(null);
    setShowProfileDropdown(false);
    setShowNotificationsPanel(false);
    navigate('/');
  };

  const handleSubmitComplaint = (newComplaintData) => {
    const complaintToAdd = {
        ...newComplaintData,
        id: Date.now(),
        status: COMPLAINT_STATUS.LODGED,
        submittedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        submittedById: user ? user.id : null,
        submittedBy: user ? user.name : 'Anonymous',
        assignedByAdmin: null,
        assignedToDept: null,
        actionOfficer: null,
        resolutionDetails: null,
        rating: null,
    };
    setComplaints(prevComplaints => [...prevComplaints, complaintToAdd]);
    alert('Grievance submitted successfully! Your Grievance ID is: #' + complaintToAdd.id);
    navigate('/track-complaint');
  };

  const handleUpdateComplaint = (id, updates) => {
     console.log("App.js: Updating complaint:", id, "with", updates);
    setComplaints(prevComplaints =>
        prevComplaints.map(complaint =>
            complaint.id === id
            ? { ...complaint, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
            : complaint
        )
    );
  };

  const handleLoginClick = () => promptLogin('login-button');

  const handleNotificationClick = () => {
    if (!user) {
      promptLogin('notifications');
    } else {
      setShowNotificationsPanel(prev => !prev);
      setShowProfileDropdown(false);
    }
  };

  const handleProfileClick = () => {
    if (!user) {
      promptLogin('profile');
    } else {
      setShowProfileDropdown(prev => !prev);
      setShowNotificationsPanel(false);
    }
  };

  const handleLandingNavigation = (targetPath) => {
    if (!user) {
      promptLogin(targetPath);
    } else {
      if (user.role === USER_ROLES.CITIZEN && (targetPath === '/complaint-form' || targetPath === '/track-complaint')) {
        navigate(targetPath);
      } else if (user.role !== USER_ROLES.CITIZEN && (targetPath === '/complaint-form' || targetPath === '/track-complaint')) {
         alert("This action is only available for citizens.");
      } else {
         navigate(targetPath);
      }
    }
  };

  const handleOutsideClick = (e) => {
    // Basic implementation - needs refinement with refs
  };

  return (
    <div className="relative min-h-screen">
      <Header
        user={user}
        onLogout={handleLogout}
        onLoginClick={handleLoginClick}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
      />

      {showProfileDropdown && <ProfileDropdown user={user} onClose={() => setShowProfileDropdown(false)} />}
      {showNotificationsPanel && <NotificationsPanel onClose={() => setShowNotificationsPanel(false)} />}

      <main className="pt-4 px-4 sm:px-6 lg:px-8" onClick={handleOutsideClick}>
        <Routes>
          <Route path="/" element={<LandingPage onNavigate={handleLandingNavigation} />} />
          <Route path="/admin-login" element={<AdminLoginPage onLogin={handleLogin} />} />

          {/* Protected Routes */}
          <Route
            path="/complaint-form"
            element={
              <ProtectedRoute user={user} allowedRoles={[USER_ROLES.CITIZEN]}>
                <ComplaintForm onSubmit={handleSubmitComplaint} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-complaint"
            element={
              <ProtectedRoute user={user} allowedRoles={[USER_ROLES.CITIZEN]}>
                 <ComplaintTracking
                    complaints={complaints.filter(c => user && c.submittedById === user.id)}
                    // onUpdateComplaint={handleUpdateComplaint} // Pass if needed for appeal/rating updates
                 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={[USER_ROLES.ADMIN]}>
                <AdminPortal
                    complaints={complaints}
                    onUpdateComplaint={handleUpdateComplaint}
                    user={user}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gov-portal"
            element={
              <ProtectedRoute user={user} allowedRoles={[USER_ROLES.GOVERNMENT]}>
                <GovPortal
                    complaints={complaints}
                    onUpdateComplaint={handleUpdateComplaint}
                    user={user}
                />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <LoginModal
        isOpen={showLoginModal && location.pathname !== '/admin-login'}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        purpose={loginPurpose}
      />
    </div>
  );
};

export default App;