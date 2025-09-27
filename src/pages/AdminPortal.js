import React, { useState } from 'react';
import AdminDashboard from '../components/admin/SimpleAdminDashboard';
import AnalyticsReports from '../components/admin/AnalyticsReports';
import UserManagement from '../components/admin/UserManagement';

const AdminPortal = ({ complaints, onUpdateComplaint }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h1>
        <p className="text-gray-600">Manage complaints, users, and system analytics</p>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Dashboard
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

      {activeTab === 'dashboard' && (
        <AdminDashboard 
          complaints={complaints} 
          onUpdateComplaint={onUpdateComplaint} 
        />
      )}
      {activeTab === 'analytics' && (
        <AnalyticsReports complaints={complaints} />
      )}
      {activeTab === 'users' && (
        <UserManagement />
      )}
    </div>
  );
};

export default AdminPortal;