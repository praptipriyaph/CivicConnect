<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BarChart2,
  Users,
  ChevronRight,
} from "lucide-react";
import AdminScrutinyDashboard from "../components/admin/AdminScrutinyDashboard";
import AnalyticsReports from "../components/admin/AnalyticsReports";
import UserManagement from "../components/admin/UserManagement";
import { COMPLAINT_STATUS } from "../utils/constants";

const AdminPortal = ({ complaints = [], onUpdateComplaint, user }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlideIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const relevantComplaints = complaints.filter(
    (c) =>
      c.status === COMPLAINT_STATUS.LODGED ||
      c.status === COMPLAINT_STATUS.MORE_INFO_NEEDED
  );
  const newGrievanceCount = relevantComplaints.filter(
    (c) => c.status === COMPLAINT_STATUS.LODGED
  ).length;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col shadow-lg">
        <div className="p-5 border-b border-blue-600">
          <h1 className="text-lg font-semibold tracking-wide">
            Admin Control
          </h1>
          <p className="text-xs text-blue-200 mt-1">
            {user?.name || "Administrator"}
          </p>
        </div>
        <nav className="flex-1 mt-4 space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center w-full text-left px-5 py-3 ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white"
                : "text-blue-100 hover:bg-blue-600 hover:text-white"
            } transition-all`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Grievance Scrutiny
            {newGrievanceCount > 0 && (
              <span className="ml-auto bg-white text-blue-700 font-semibold text-xs px-2 py-0.5 rounded-full">
                {newGrievanceCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center w-full text-left px-5 py-3 ${
              activeTab === "analytics"
                ? "bg-blue-600 text-white"
                : "text-blue-100 hover:bg-blue-600 hover:text-white"
            } transition-all`}
          >
            <BarChart2 className="w-5 h-5 mr-3" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center w-full text-left px-5 py-3 ${
              activeTab === "users"
                ? "bg-blue-600 text-white"
                : "text-blue-100 hover:bg-blue-600 hover:text-white"
            } transition-all`}
          >
            <Users className="w-5 h-5 mr-3" />
            User Management
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-8 transition-all duration-700 ease-out transform ${
          slideIn ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab === "dashboard"
                ? "Grievance Scrutiny"
                : activeTab === "analytics"
                ? "Analytics & Reports"
                : "User Management"}
            </h1>
            <p className="text-gray-500 text-sm">
              {activeTab === "dashboard"
                ? "Monitor, assign, and resolve complaints efficiently."
                : activeTab === "analytics"
                ? "Track complaint statistics and performance trends."
                : "Manage user roles and permissions."}
            </p>
          </div>
          
        </div>

        {/* Content */}
        {activeTab === "dashboard" && (
          <AdminScrutinyDashboard
            complaints={relevantComplaints}
            onUpdateComplaint={onUpdateComplaint}
            currentUser={user}
          />
        )}
        {activeTab === "analytics" && (
          <AnalyticsReports complaints={complaints} />
        )}
        {activeTab === "users" && <UserManagement />}
      </main>
=======
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
>>>>>>> origin/front-end
    </div>
  );
};

<<<<<<< HEAD
export default AdminPortal;
=======
export default AdminPortal; // Export with original name
>>>>>>> origin/front-end
