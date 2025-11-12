import React, { useState, useEffect } from "react";
import { LayoutDashboard, BarChart2, Users, ChevronRight } from "lucide-react";
import AdminScrutinyDashboard from "../components/admin/AdminScrutinyDashboard";
import AnalyticsReports from "../components/admin/AnalyticsReports";
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
      c.status === COMPLAINT_STATUS.MORE_INFO_NEEDED,
  );
  const newGrievanceCount = relevantComplaints.filter(
    (c) => c.status === COMPLAINT_STATUS.LODGED,
  ).length;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-blue-700 text-white flex flex-col shadow-lg">
        <div className="p-5 border-b border-blue-600">
          <h1 className="text-lg font-semibold tracking-wide">Admin Control</h1>
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
          {/* <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center w-full text-left px-5 py-3 ${
              activeTab === "users"
                ? "bg-blue-600 text-white"
                : "text-blue-100 hover:bg-blue-600 hover:text-white"
            } transition-all`}
          >
            <Users className="w-5 h-5 mr-3" />
            User Management
          </button> */}
        </nav>
      </aside>

      <main
        className={`flex-1 p-8 transition-all duration-700 ease-out transform ${
          slideIn ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
        }`}
      >
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab === "dashboard"
                ? "Grievance Scrutiny"
                : activeTab === "analytics"
                  ? "Analytics & Reports"
                  : "Grievance Scrutiny"}
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
      </main>
    </div>
  );
};

export default AdminPortal;
