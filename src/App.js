import React, { useState, useEffect } from 'react';
// Import routing components
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginModal from './components/common/LoginModal';
import Header from './components/common/Header';
import ComplaintForm from './components/citizen/ComplaintForm';
import ComplaintTracking from './components/citizen/ComplaintTracking';
import SimpleAdminDashboard from './components/admin/SimpleAdminDashboard';
import GovPortal from './pages/GovPortal';
import ProfileDropdown from './components/common/ProfileDropdown';
import NotificationsPanel from './components/common/NotificationsPanel';
import { mockComplaints } from './utils/mockData';
// Import USER_ROLES if needed for checks
import { USER_ROLES } from './utils/constants';

// AdminLoginPage component remains the same...
const AdminLoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const handleAdminLogin = (userData) => {
    onLogin(userData);
    if (userData.role === USER_ROLES.ADMIN) {
      navigate('/admin-dashboard');
    } else if (userData.role === USER_ROLES.GOVERNMENT) {
      navigate('/gov-portal');
    } else {
      navigate('/');
    }
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

// ProtectedRoute component remains the same...
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


const App = () => {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState(mockComplaints);
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

    // Check if loginPurpose is one of the target paths from landing page
    if (loginPurpose === '/complaint-form' || loginPurpose === '/track-complaint') {
        if (userData.role === USER_ROLES.CITIZEN) {
            navigate(loginPurpose); // Navigate to the originally intended path
        } else {
            // Handle non-citizen login after trying to access citizen routes
            if (userData.role === USER_ROLES.ADMIN) navigate('/admin-dashboard');
            else if (userData.role === USER_ROLES.GOVERNMENT) navigate('/gov-portal');
            else navigate('/');
        }
    }
    // Handle login prompted by header buttons or direct login button
    else if (loginPurpose === 'profile') {
         setShowProfileDropdown(true);
          if (userData.role === USER_ROLES.ADMIN) navigate('/admin-dashboard');
          else if (userData.role === USER_ROLES.GOVERNMENT) navigate('/gov-portal');
          // MODIFICATION: Citizen goes to landing after profile login trigger
          else if (userData.role === USER_ROLES.CITIZEN) navigate('/');
          else navigate('/');
    } else if (loginPurpose === 'notifications') {
         setShowNotificationsPanel(true);
         if (userData.role === USER_ROLES.ADMIN) navigate('/admin-dashboard');
         else if (userData.role === USER_ROLES.GOVERNMENT) navigate('/gov-portal');
         // MODIFICATION: Citizen goes to landing after notification login trigger
         else if (userData.role === USER_ROLES.CITIZEN) navigate('/');
         else navigate('/');
    }
    // Default redirect after login via Login button or unknown purpose
    else {
        switch (userData.role) {
            case USER_ROLES.ADMIN:
              navigate('/admin-dashboard');
              break;
            case USER_ROLES.GOVERNMENT:
              navigate('/gov-portal');
              break;
            case USER_ROLES.CITIZEN:
              // ***MODIFICATION HERE***: Redirect citizen to landing page ('/')
              // instead of '/track-complaint' for general login.
              navigate('/');
              break;
            default:
              navigate('/');
          }
    }
    setLoginPurpose(''); // Clear purpose after handling
  };

  const handleLogout = () => {
    setUser(null);
    setShowProfileDropdown(false);
    setShowNotificationsPanel(false);
    navigate('/');
  };

  const handleSubmitComplaint = (newComplaint) => {
    const complaintWithUser = {
        ...newComplaint,
        submittedById: user ? user.id : null,
        submittedBy: user ? user.name : 'Anonymous'
    };
    setComplaints([...complaints, complaintWithUser]);
    alert('Complaint submitted successfully! Your complaint ID is: ' + complaintWithUser.id);
    navigate('/track-complaint');
  };

  const handleUpdateComplaint = (id, updates) => {
    setComplaints(complaints.map(complaint =>
      complaint.id === id ? { ...complaint, ...updates } : complaint
    ));
  };

  // Header Handlers
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
      if (user.role === USER_ROLES.CITIZEN) {
        navigate(targetPath);
      } else {
        alert("This action is only available for citizens.");
      }
    }
  };

  const handleOutsideClick = (e) => {
    // Basic implementation - needs refinement with refs to avoid unwanted closing
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
                 <ComplaintTracking complaints={complaints.filter(c => user ? c.submittedById === user.id : c.submittedBy === 'Current User')} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={[USER_ROLES.ADMIN]}>
                <SimpleAdminDashboard complaints={complaints} onUpdateComplaint={handleUpdateComplaint}/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/gov-portal"
            element={
              <ProtectedRoute user={user} allowedRoles={[USER_ROLES.GOVERNMENT]}>
                <GovPortal complaints={complaints} onUpdateComplaint={handleUpdateComplaint} />
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