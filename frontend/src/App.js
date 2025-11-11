import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { useApiService } from './services/api'; 
import LandingPage from './pages/LandingPage';
import AdminPortal from './pages/AdminPortal';
import GovPortal from './pages/GovernmentPortal';
import GovtSelect from './pages/GovtSelect';
import Header from './components/common/Header';
import ComplaintForm from './components/citizen/ComplaintForm';
import ComplaintTracking from './components/citizen/ComplaintTracking';
import ProfileDropdown from './components/common/ProfileDropdown';
import ComplaintDetails from './components/citizen/ComplaintDetails';
import PreviousComplaints from "./components/citizen/PreviousComplaints";
import RoleSelectionModal from './components/common/RoleSelectionModal';
import { roleSelectionAtom } from './state/atoms';


const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const api = useApiService();

  const { data: cu, isLoading: cuLoading, isError: cuError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: api.getCurrentUser,
    enabled: !!isSignedIn,
    staleTime: 60_000,
  });

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <Navigate to="/" state={{ from: location }} replace />;

  if (!allowedRoles || allowedRoles.length === 0) return children;

  if (cuLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (cuError || !cu) return <Navigate to="/" replace />;

  const role = (cu.role || '').toLowerCase();

  if (allowedRoles.map((r) => r.toLowerCase()).includes(role)) {
    return children;
  }

  if (role === 'admin') return <Navigate to="/admin-dashboard" replace />;
  if (role === 'official' || role === 'government' || role === 'gov')
    return <Navigate to={cu.department_id ? "/gov-portal" : "/gov-selection"} replace />;

  return <Navigate to="/" replace />;
};

const App = () => {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const apiService = useApiService();

  const { data: currentUser, isLoading: currentUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: apiService.getCurrentUser,
    enabled: isLoaded && isSignedIn,
    staleTime: 60_000,
  });

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useAtom(roleSelectionAtom);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUserData = async () => {
      if (!isLoaded || !isSignedIn || !userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        if (user) {
          const userData = {
            clerk_id: userId,
            username: user.username || user.primaryEmailAddress?.emailAddress.split('@')[0],
            email: user.primaryEmailAddress?.emailAddress,
            first_name: user.firstName || '',
            last_name: user.lastName || '',
            role: 'citizen', 
          };

          try {
            const response = await apiService.saveUser(userData);
            
            if (response && response.isNewUser) {
              setIsRoleModalOpen(true);
            }
          } catch (saveError) {
            console.error('Error saving user:', saveError);
          }
        }

      } catch (err) {
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isLoaded, isSignedIn, userId]); 

  useEffect(() => {
    setShowProfileDropdown(false);
  }, [location.pathname]); 

  const handleLogout = () => {
    setShowProfileDropdown(false);
    navigate('/');
  };

  const handleUpdateComplaint = (id, updates) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.complaint_id === id || complaint.id === id
          ? { ...complaint, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : complaint
      )
    );
  };

  const handleSubmitComplaint = async (complaintData) => {
    try {
      setLoading(true);
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

      navigate('/track-complaint', {
        state: { complaintId: response.complaint_id }
      });

    } catch (err) {
      console.error('Error submitting complaint:', err);
      alert('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    if (!isSignedIn) {
      alert('Please sign in to view profile');
      return;
    }
    setShowProfileDropdown((prev) => !prev);
  };

  const handleLandingNavigation = (targetPath) => {
    if (!isSignedIn) {
      navigate('/sign-in');
      return;
    }

    if (targetPath === '/complaint-form' || targetPath === '/track-complaint') {
      navigate(targetPath);
    } else {
      navigate(targetPath);
    }
  };

  const LandingRouter = () => {
    if (!isLoaded || !isSignedIn) {
      return <LandingPage onNavigate={handleLandingNavigation} />;
    }

    if (currentUserLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const role = currentUser?.role?.toLowerCase() || null;
    const deptId = currentUser?.department_id || null;

    if (role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (role === 'official' || role === 'government' || role === 'gov')
      return <Navigate to={deptId ? "/gov-portal" : "/gov-selection"} replace />;

    return <LandingPage onNavigate={handleLandingNavigation} />;
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen">
      <Header
        user={user}
        isSignedIn={isSignedIn}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
      />

      {showProfileDropdown && user && (
        <ProfileDropdown user={user} onClose={() => setShowProfileDropdown(false)} />
      )}
    

      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onRoleSelected={(role) => {
          setIsRoleModalOpen(false);
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
          <Route path="/" element={<LandingRouter />} />

          <Route
            path="/complaint-form"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <ComplaintForm onSubmitComplaint={handleSubmitComplaint} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/track-complaint"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <ComplaintTracking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/previous-complaints"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <PreviousComplaints />
              </ProtectedRoute>
            }
          />

          <Route
            path="/complaint/:id"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPortal complaints={complaints} onUpdateComplaint={handleUpdateComplaint} user={currentUser || user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gov-portal"
            element={
              <ProtectedRoute allowedRoles={['official']}>
                <GovPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path='/gov-selection'
            element={
              <ProtectedRoute allowedRoles={['official']}>
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
