import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginModal from './components/common/LoginModal';
import Header from './components/common/Header';
import ComplaintForm from './components/citizen/ComplaintForm';
import ComplaintTracking from './components/citizen/ComplaintTracking';
import SimpleAdminDashboard from './components/admin/SimpleAdminDashboard';
import GovPortal from './pages/GovPortal';
import ProfileDropdown from './components/common/ProfileDropdown'; // Import ProfileDropdown
import NotificationsPanel from './components/common/NotificationsPanel'; // Import NotificationsPanel
import { mockComplaints } from './utils/mockData';


const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPurpose, setLoginPurpose] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // State for profile dropdown
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false); // State for notifications panel

  const promptLogin = (purpose) => {
    setLoginPurpose(purpose);
    setShowLoginModal(true);
    // Close dropdowns when login is prompted
    setShowProfileDropdown(false);
    setShowNotificationsPanel(false);
  };

  // Simplified navigation, login checks moved to specific handlers
  const handleNavigate = (view) => {
    // Special handling for admin-login routing if clicked from Landing Page
     if (view === 'admin-login') {
      if (!user) {
        promptLogin(view);
      } else {
        if (user.role === 'Admin') setCurrentView('admin-dashboard');
        else if (user.role === 'Government') setCurrentView('gov-portal');
        else setCurrentView('landing'); // Fallback if logged in user isn't admin/gov
      }
    } else if (['complaint-form', 'track-complaint'].includes(view)) {
       // Other views requiring login
       if (!user) {
         promptLogin(view);
       } else {
         setCurrentView(view);
       }
    } else {
      // Public views
      setCurrentView(view);
    }
     // Close dropdowns on any navigation
    setShowProfileDropdown(false);
    setShowNotificationsPanel(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLoginModal(false);

    // Redirect based on the original purpose
    switch (loginPurpose) {
      case 'complaint-form':
        setCurrentView('complaint-form');
        break;
      case 'track-complaint':
        setCurrentView('track-complaint');
        break;
      case 'admin-login':
        if (userData.role === 'Admin') setCurrentView('admin-dashboard');
        else if (userData.role === 'Government') setCurrentView('gov-portal');
        else setCurrentView('landing');
        break;
      case 'profile': // If login was prompted by profile click, show dropdown after login
         setShowProfileDropdown(true);
         // Decide if we should also navigate somewhere, e.g., dashboard
          if (userData.role === 'Admin') setCurrentView('admin-dashboard');
          else if (userData.role === 'Government') setCurrentView('gov-portal');
          else if (userData.role === 'Citizen') setCurrentView('track-complaint');
          else setCurrentView('landing');
         break;
      case 'notifications': // If login was prompted by notification click, show panel after login
         setShowNotificationsPanel(true);
         // Decide if we should also navigate somewhere
          if (userData.role === 'Admin') setCurrentView('admin-dashboard');
          else if (userData.role === 'Government') setCurrentView('gov-portal');
          else if (userData.role === 'Citizen') setCurrentView('track-complaint');
          else setCurrentView('landing');
         break;
      default: // Default redirect after login via Login button
        if (userData.role === 'Admin') setCurrentView('admin-dashboard');
        else if (userData.role === 'Government') setCurrentView('gov-portal');
        else if (userData.role === 'Citizen') setCurrentView('track-complaint');
        else setCurrentView('landing');
    }
    setLoginPurpose('');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
    setShowProfileDropdown(false); // Close dropdown on logout
    setShowNotificationsPanel(false); // Close panel on logout
  };

  const handleSubmitComplaint = (newComplaint) => {
    setComplaints([...complaints, newComplaint]);
    // Consider using a non-alert message system in a real app
    alert('Complaint submitted successfully! Your complaint ID is: ' + newComplaint.id);
    setCurrentView('track-complaint');
  };

  const handleUpdateComplaint = (id, updates) => {
    setComplaints(complaints.map(complaint =>
      complaint.id === id ? { ...complaint, ...updates } : complaint
    ));
  };

  const handleHome = () => {
    setCurrentView('landing');
    setShowProfileDropdown(false); // Close dropdown
    setShowNotificationsPanel(false); // Close panel
  };

  const handleLoginClick = () => {
    promptLogin('login-button');
  };

  // Updated handler: Toggle panel or prompt login
  const handleNotificationClick = () => {
    if (!user) {
      promptLogin('notifications');
    } else {
      setShowNotificationsPanel(prev => !prev); // Toggle visibility
      setShowProfileDropdown(false); // Close profile if open
    }
  };

  // Updated handler: Toggle dropdown or prompt login
  const handleProfileClick = () => {
    if (!user) {
      promptLogin('profile');
    } else {
      setShowProfileDropdown(prev => !prev); // Toggle visibility
      setShowNotificationsPanel(false); // Close notifications if open
    }
  };

  // Close dropdown/panel if clicking outside
  // Note: This is a basic implementation. More robust solutions might use refs or libraries.
  const handleOutsideClick = (e) => {
    // Add checks here if needed to prevent closing when clicking inside the dropdown/panel itself
    // For simplicity, this example closes them on any click in the main content area
    if (showProfileDropdown || showNotificationsPanel) {
        // A more robust check would involve checking if e.target is outside the dropdown/panel elements
        setShowProfileDropdown(false);
        setShowNotificationsPanel(false);
    }
  };


  // Header is now always rendered at the top
  // const showHeader = currentView !== 'landing'; // Or always show header: const showHeader = true;
  const showHeader = true; // Always show the main header


  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        // Pass handleNavigate down, LandingPage no longer needs its own header controls
        return <LandingPage onNavigate={handleNavigate} />;
      case 'complaint-form':
        return <ComplaintForm onSubmit={handleSubmitComplaint} />;
      case 'track-complaint':
        return <ComplaintTracking complaints={complaints} />;
      case 'admin-dashboard':
        return <SimpleAdminDashboard complaints={complaints} />;
      case 'gov-portal':
        return <GovPortal complaints={complaints} onUpdateComplaint={handleUpdateComplaint} />;
      // Removed profile and notifications cases
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="relative min-h-screen"> {/* Ensure relative positioning for dropdowns */}
      {showHeader && (
        <Header
          user={user}
          onLogout={handleLogout}
          onHome={handleHome}
          onLoginClick={handleLoginClick}
          onNotificationClick={handleNotificationClick} // Pass toggle function
          onProfileClick={handleProfileClick}       // Pass toggle function
        />
      )}

      {/* Conditionally render dropdowns/panels */}
      {showProfileDropdown && <ProfileDropdown user={user} onClose={() => setShowProfileDropdown(false)} />}
      {showNotificationsPanel && <NotificationsPanel onClose={() => setShowNotificationsPanel(false)} />}


      {/* Main content area */}
      {/* Added onClick handler to close dropdowns when clicking main content */}
      <main className="pt-4 px-4 sm:px-6 lg:px-8" onClick={handleOutsideClick}>
         {renderCurrentView()}
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        purpose={loginPurpose}
      />
    </div>
  );
};

export default App;