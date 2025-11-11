import React, { useState } from "react";
import {
  ClipboardList,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import GovernmentComplaintsDashboard from "../components/government/GovernmentComplaintsDashboard";
import GovernmentAnalytics from "../components/government/GovernmentAnalytics";

const GovernmentPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-blue-800 text-white flex flex-col shadow-lg">
        <div className="p-5 border-b border-blue-700">
          <h1 className="text-lg font-semibold tracking-wide">
            Govt Grievance Portal
          </h1>
          <p className="text-xs text-blue-200 mt-1">Department Officer</p>
        </div>

        <nav className="flex-1 mt-4 space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center w-full text-left px-5 py-3 ${
              activeTab === "dashboard"
                ? "bg-blue-700 text-white"
                : "text-blue-100 hover:bg-blue-700 hover:text-white"
            }`}
          >
            <ClipboardList className="w-5 h-5 mr-3" />
            Complaints
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center w-full text-left px-5 py-3 ${
              activeTab === "analytics"
                ? "bg-blue-700 text-white"
                : "text-blue-100 hover:bg-blue-700 hover:text-white"
            }`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab === "dashboard"
                ? "Government Complaints Dashboard"
                : "Analytics & Reports"}
            </h1>
            <p className="text-gray-500 text-sm">
              {activeTab === "dashboard"
                ? "Track complaints forwarded by admins and manage updates"
                : "Monitor complaint statistics across departments"}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-500" />
        </div>

        {activeTab === "dashboard" && <GovernmentComplaintsDashboard />}
        {activeTab === "analytics" && <GovernmentAnalytics />}
      </main>
    </div>
  );
};

export default GovernmentPortal;
