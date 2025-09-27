import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginModal from './components/common/LoginModal';
import Header from './components/common/Header';
import ComplaintForm from './components/citizen/ComplaintForm';
import ComplaintTracking from './components/citizen/ComplaintTracking';
import SimpleAdminDashboard from './components/admin/SimpleAdminDashboard';
import GovPortal from './pages/GovPortal';
import { mockComplaints } from './utils/mockData';

const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPurpose, setLoginPurpose] = useState('');

  const handleNavigate = (view) => {
    if (view === 'complaint-form' || view === 'track-complaint' || view === 'admin-login') {
      setLoginPurpose(view);
      setShowLoginModal(true);
    } else {
      setCurrentView(view);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    
    switch (loginPurpose) {
      case 'complaint-form':
        setCurrentView('complaint-form');
        break;
      case 'track-complaint':
        setCurrentView('track-complaint');
        break;
      case 'admin-login':
        if (userData.role === 'Admin') {
          setCurrentView('admin-dashboard');
        } else if (userData.role === 'Government') {
          setCurrentView('gov-portal');
        }
        break;
      default:
        setCurrentView('landing');
    }
    setLoginPurpose('');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const handleSubmitComplaint = (newComplaint) => {
    setComplaints([...complaints, newComplaint]);
    alert('Complaint submitted successfully! Your complaint ID is: ' + newComplaint.id);
  };

  const handleUpdateComplaint = (id, updates) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id ? { ...complaint, ...updates } : complaint
    ));
  };

  const handleHome = () => {
    setCurrentView('landing');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      
      case 'complaint-form':
        return (
          <div className="min-h-screen bg-gray-50">
            <Header user={user} onLogout={handleLogout} onHome={handleHome} />
            <ComplaintForm onSubmit={handleSubmitComplaint} />
          </div>
        );
      
      case 'track-complaint':
        return (
          <div className="min-h-screen bg-gray-50">
            <Header user={user} onLogout={handleLogout} onHome={handleHome} />
            <ComplaintTracking complaints={complaints} />
          </div>
        );
      
      case 'admin-dashboard':
        return (
          <div className="min-h-screen bg-gray-50">
            <Header user={user} onLogout={handleLogout} onHome={handleHome} />
            <SimpleAdminDashboard complaints={complaints} />
          </div>
        );
      
      case 'gov-portal':
        return (
          <div className="min-h-screen bg-gray-50">
            <Header user={user} onLogout={handleLogout} onHome={handleHome} />
            <GovPortal complaints={complaints} onUpdateComplaint={handleUpdateComplaint} />
          </div>
        );
      
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div>
      {renderCurrentView()}
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