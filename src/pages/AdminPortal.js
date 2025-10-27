import React, { useState } from 'react';
// Import the new component specifically for scrutiny/assignment
import AdminScrutinyDashboard from '../components/admin/AdminScrutinyDashboard';
import AnalyticsReports from '../components/admin/AnalyticsReports';
import UserManagement from '../components/admin/UserManagement';
// Import constants to filter relevant complaints for the badge count
import { COMPLAINT_STATUS } from '../utils/constants';

// Keep the original name: AdminPortal
const AdminPortal = ({ complaints, onUpdateComplaint, user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Filter complaints relevant to the Admin/Nodal Officer role for the badge
  const relevantComplaints = complaints.filter(c =>
    c.status === COMPLAINT_STATUS.LODGED ||
    c.status === COMPLAINT_STATUS.MORE_INFO_NEEDED
  );
  const newGrievanceCount = relevantComplaints.filter(c=> c.status === COMPLAINT_STATUS.LODGED).length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        {/* Keep the title generic or adjust slightly */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h1>
        <p className="text-gray-600">Review grievances, manage users, and view analytics</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          {/* Update tab label and add count */}
          Grievance Scrutiny ({newGrievanceCount})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'analytics' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Analytics
        </button>
         <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          User Management
        </button>
      </div>

      {/* Render component based on active tab */}
      {activeTab === 'dashboard' && (
        <AdminScrutinyDashboard
          // Pass only the relevant complaints for scrutiny/info needed
          complaints={relevantComplaints}
          onUpdateComplaint={onUpdateComplaint} // Pass handler for assigning/rejecting
          currentUser={user} // Pass current user for logging actions
        />
      )}
      {activeTab === 'analytics' && (
        // Pass all complaints if analytics covers everything
        <AnalyticsReports complaints={complaints} />
      )}
      {activeTab === 'users' && (
        <UserManagement />
      )}
    </div>
  );
};

export default AdminPortal; // Export with original name