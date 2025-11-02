import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

// Page imports
import LandingPage from './pages/LandingPage';
import AdminPortal from './pages/AdminPortal';
<<<<<<< HEAD
import GovPortal from './pages/GovernmentPortal';
=======
import GovPortal from './pages/GovPortal';
>>>>>>> origin/front-end

// Component imports
import LoginModal from './components/common/LoginModal';
import Header from './components/common/Header';
import ComplaintForm from './components/citizen/ComplaintForm';
import ComplaintTracking from './components/citizen/ComplaintTracking';
import ProfileDropdown from './components/common/ProfileDropdown';
import NotificationsPanel from './components/common/NotificationsPanel';
<<<<<<< HEAD
import ComplaintDetails from './components/citizen/ComplaintDetails';
import PreviousComplaints from "./components/citizen/PreviousComplaints";
=======
>>>>>>> origin/front-end

// Data and constants
import { mockComplaints as initialMockComplaints } from './utils/mockData';
import { USER_ROLES, COMPLAINT_STATUS } from './utils/constants';

// ---- Helper Components ----
<<<<<<< HEAD
const AdminLoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const handleAdminLogin = (userData) => {
    onLogin(userData);
=======

// AdminLoginPage component
const AdminLoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const handleAdminLogin = (userData) => {
    onLogin(userData); // Use the main login handler
>>>>>>> origin/front-end
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

<<<<<<< HEAD
=======
// ProtectedRoute component
>>>>>>> origin/front-end
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
<<<<<<< HEAD
=======

>>>>>>> origin/front-end
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

<<<<<<< HEAD
  const handleLogin = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
=======
   const handleLogin = (userData) => {
    setUser(userData);
    setShowLoginModal(false);

>>>>>>> origin/front-end
    const origin = location.state?.from?.pathname;
    let redirectTo = '/';

    if (loginPurpose === '/complaint-form' || loginPurpose === '/track-complaint') {
<<<<<<< HEAD
      redirectTo =
        userData.role === USER_ROLES.CITIZEN
          ? loginPurpose
          : userData.role === USER_ROLES.ADMIN
          ? '/admin-dashboard'
          : userData.role === USER_ROLES.GOVERNMENT
          ? '/gov-portal'
          : '/';
    } else if (origin && origin !== '/') {
      if (origin === '/admin-dashboard' && userData.role !== USER_ROLES.ADMIN)
        redirectTo = '/';
      else if (origin === '/gov-portal' && userData.role !== USER_ROLES.GOVERNMENT)
        redirectTo = '/';
      else if (
        (origin === '/complaint-form' || origin === '/track-complaint') &&
        userData.role !== USER_ROLES.CITIZEN
      )
        redirectTo = '/';
      else redirectTo = origin;
    } else {
      switch (userData.role) {
        case USER_ROLES.ADMIN:
          redirectTo = '/admin-dashboard';
          break;
        case USER_ROLES.GOVERNMENT:
          redirectTo = '/gov-portal';
          break;
        case USER_ROLES.CITIZEN:
          redirectTo = '/';
          break;
        default:
          redirectTo = '/';
          break;
      }
    }

    if (loginPurpose === 'profile' && redirectTo !== '/')
      setShowProfileDropdown(true);
    if (loginPurpose === 'notifications' && redirectTo !== '/')
      setShowNotificationsPanel(true);
=======
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
>>>>>>> origin/front-end

    setLoginPurpose('');
    navigate(redirectTo, { replace: true });
  };

<<<<<<< HEAD
=======

>>>>>>> origin/front-end
  const handleLogout = () => {
    setUser(null);
    setShowProfileDropdown(false);
    setShowNotificationsPanel(false);
    navigate('/');
  };

  const handleSubmitComplaint = (newComplaintData) => {
    const complaintToAdd = {
<<<<<<< HEAD
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
    setComplaints((prev) => [...prev, complaintToAdd]);
=======
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
>>>>>>> origin/front-end
    alert('Grievance submitted successfully! Your Grievance ID is: #' + complaintToAdd.id);
    navigate('/track-complaint');
  };

  const handleUpdateComplaint = (id, updates) => {
<<<<<<< HEAD
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id
          ? { ...complaint, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : complaint
      )
=======
     console.log("App.js: Updating complaint:", id, "with", updates);
    setComplaints(prevComplaints =>
        prevComplaints.map(complaint =>
            complaint.id === id
            ? { ...complaint, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
            : complaint
        )
>>>>>>> origin/front-end
    );
  };

  const handleLoginClick = () => promptLogin('login-button');
<<<<<<< HEAD
  const handleNotificationClick = () => {
    if (!user) promptLogin('notifications');
    else {
      setShowNotificationsPanel((prev) => !prev);
      setShowProfileDropdown(false);
    }
  };
  const handleProfileClick = () => {
    if (!user) promptLogin('profile');
    else {
      setShowProfileDropdown((prev) => !prev);
=======

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
>>>>>>> origin/front-end
      setShowNotificationsPanel(false);
    }
  };

  const handleLandingNavigation = (targetPath) => {
    if (!user) {
      promptLogin(targetPath);
    } else {
<<<<<<< HEAD
      if (
        user.role === USER_ROLES.CITIZEN &&
        (targetPath === '/complaint-form' || targetPath === '/track-complaint')
      ) {
        navigate(targetPath);
      } else if (
        user.role !== USER_ROLES.CITIZEN &&
        (targetPath === '/complaint-form' || targetPath === '/track-complaint')
      ) {
        alert('This action is only available for citizens.');
      } else {
        navigate(targetPath);
=======
      if (user.role === USER_ROLES.CITIZEN && (targetPath === '/complaint-form' || targetPath === '/track-complaint')) {
        navigate(targetPath);
      } else if (user.role !== USER_ROLES.CITIZEN && (targetPath === '/complaint-form' || targetPath === '/track-complaint')) {
         alert("This action is only available for citizens.");
      } else {
         navigate(targetPath);
>>>>>>> origin/front-end
      }
    }
  };

<<<<<<< HEAD
  const handleOutsideClick = (e) => {};

  // ✅ Dummy complaints shown to logged-in users
  const loggedInDemoComplaints = [
    {
      id: 9001,
      title: "Streetlight near park flickering",
      description: "Streetlight near the park intermittently turns off.",
      location: "Ward 6",
      category: "electricity",
      submittedDate: "2025-10-20",
      status: COMPLAINT_STATUS.UNDER_PROCESS,
    },
    {
      id: 9002,
      title: "Overflowing garbage bin",
      description: "Garbage bin near market overflowing for 2 days.",
      location: "Sector 11",
      category: "garbage",
      submittedDate: "2025-10-18",
      status: COMPLAINT_STATUS.ACTION_TAKEN,
    },
    {
      id: 9003,
      title: "Water leakage on road",
      description: "Continuous water leakage near temple junction.",
      location: "Ward 2",
      category: "water",
      submittedDate: "2025-10-17",
      status: COMPLAINT_STATUS.UNDER_PROCESS,
    },
  ];

  const loggedInPreviousDemo = [
    {
      id: 9101,
      title: "Potholes repaired successfully",
      description: "Main road repaired within 5 days.",
      location: "Sector 5",
      category: "road",
      submittedDate: "2025-09-25",
      status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
    },
    {
      id: 9102,
      title: "Garbage collection restored",
      description: "Collection resumed regularly now.",
      location: "Ward 8",
      category: "garbage",
      submittedDate: "2025-09-26",
      status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
    },
    {
      id: 9103,
      title: "Broken light fixed",
      description: "Streetlight issue resolved promptly.",
      location: "Sector 10",
      category: "electricity",
      submittedDate: "2025-09-27",
      status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
    },
  ];
=======
  const handleOutsideClick = (e) => {
    // Basic implementation - needs refinement with refs
  };
>>>>>>> origin/front-end

  return (
    <div className="relative min-h-screen">
      <Header
        user={user}
        onLogout={handleLogout}
        onLoginClick={handleLoginClick}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
      />

<<<<<<< HEAD
      {showProfileDropdown && (
        <ProfileDropdown user={user} onClose={() => setShowProfileDropdown(false)} />
      )}
      {showNotificationsPanel && (
        <NotificationsPanel onClose={() => setShowNotificationsPanel(false)} />
      )}
=======
      {showProfileDropdown && <ProfileDropdown user={user} onClose={() => setShowProfileDropdown(false)} />}
      {showNotificationsPanel && <NotificationsPanel onClose={() => setShowNotificationsPanel(false)} />}
>>>>>>> origin/front-end

      <main className="pt-4 px-4 sm:px-6 lg:px-8" onClick={handleOutsideClick}>
        <Routes>
          <Route path="/" element={<LandingPage onNavigate={handleLandingNavigation} />} />
          <Route path="/admin-login" element={<AdminLoginPage onLogin={handleLogin} />} />

<<<<<<< HEAD
          {/* CITIZEN ROUTES */}
=======
          {/* Protected Routes */}
>>>>>>> origin/front-end
          <Route
            path="/complaint-form"
            element={
              <ProtectedRoute user={user} allowedRoles={[USER_ROLES.CITIZEN]}>
<<<<<<< HEAD
                <ComplaintForm onSubmitComplaint={handleSubmitComplaint} />
              </ProtectedRoute>
            }
          />

=======
                <ComplaintForm onSubmit={handleSubmitComplaint} />
              </ProtectedRoute>
            }
          />
>>>>>>> origin/front-end
          <Route
            path="/track-complaint"
            element={
              <ProtectedRoute user={user} allowedRoles={[USER_ROLES.CITIZEN]}>
<<<<<<< HEAD
                <ComplaintTracking
                  complaints={[
                    ...loggedInDemoComplaints,
                    ...(user
                      ? complaints.filter((c) => c.submittedById === user.id)
                      : []),
                  ]}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/previous-complaints"
            element={
              <ProtectedRoute user={user} allowedRoles={[USER_ROLES.CITIZEN]}>
                <PreviousComplaints
                  complaints={[
                    ...loggedInPreviousDemo,
                    ...(user
                      ? complaints.filter(
                          (c) =>
                            c.submittedById === user.id &&
                            (c.status === COMPLAINT_STATUS.CLOSED_CONFIRMED ||
                              c.status === COMPLAINT_STATUS.CLOSED_APPEALED)
                        )
                      : []),
                  ]}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/complaint/:id"
            element={
              <ProtectedRoute user={user} allowedRoles={[USER_ROLES.CITIZEN]}>
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />

          {/* ADMIN & GOV ROUTES */}
=======
                 <ComplaintTracking
                    complaints={complaints.filter(c => user && c.submittedById === user.id)}
                    // onUpdateComplaint={handleUpdateComplaint} // Pass if needed for appeal/rating updates
                 />
              </ProtectedRoute>
            }
          />
>>>>>>> origin/front-end
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={[USER_ROLES.ADMIN]}>
                <AdminPortal
<<<<<<< HEAD
                  complaints={complaints}
                  onUpdateComplaint={handleUpdateComplaint}
                  user={user}
=======
                    complaints={complaints}
                    onUpdateComplaint={handleUpdateComplaint}
                    user={user}
>>>>>>> origin/front-end
                />
              </ProtectedRoute>
            }
          />
<<<<<<< HEAD

=======
>>>>>>> origin/front-end
          <Route
            path="/gov-portal"
            element={
              <ProtectedRoute user={user} allowedRoles={[USER_ROLES.GOVERNMENT]}>
                <GovPortal
<<<<<<< HEAD
                  complaints={complaints}
                  onUpdateComplaint={handleUpdateComplaint}
                  user={user}
=======
                    complaints={complaints}
                    onUpdateComplaint={handleUpdateComplaint}
                    user={user}
>>>>>>> origin/front-end
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

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> origin/front-end
