import React, { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  TrendingUp,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";

const AdminDashboard = ({ complaints = [], onUpdateComplaint = () => {} }) => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [slideIn, setSlideIn] = useState(false);

  // Trigger slide animation when page loads
  useEffect(() => {
    setTimeout(() => setSlideIn(true), 100);
  }, []);

  // Stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  // Filter + Search logic
  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus =
      filterStatus === "all" ||
      c.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(c.id).includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Bar */}
      <div className="bg-blue-600 text-white px-8 py-4 shadow-md">
        <h1 className="text-2xl font-semibold tracking-wide">
          Grievance Scrutiny Dashboard
        </h1>
        <p className="text-blue-100 text-sm">
          Admin panel for reviewing and monitoring all civic complaints
        </p>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-700 ease-out transform ${
          slideIn ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
        } p-6 space-y-8`}
      >
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-sm border border-gray-100 p-5 rounded-xl hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Complaints</p>
                <h2 className="text-3xl font-semibold text-blue-600 mt-1">
                  {stats.total}
                </h2>
              </div>
              <FileText className="w-9 h-9 text-blue-400" />
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 p-5 rounded-xl hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <h2 className="text-3xl font-semibold text-yellow-500 mt-1">
                  {stats.pending}
                </h2>
              </div>
              <Clock className="w-9 h-9 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 p-5 rounded-xl hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">In Progress</p>
                <h2 className="text-3xl font-semibold text-blue-500 mt-1">
                  {stats.inProgress}
                </h2>
              </div>
              <TrendingUp className="w-9 h-9 text-blue-400" />
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 p-5 rounded-xl hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Resolved</p>
                <h2 className="text-3xl font-semibold text-green-500 mt-1">
                  {stats.resolved}
                </h2>
              </div>
              <CheckCircle className="w-9 h-9 text-green-400" />
            </div>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                All Complaints
              </h2>
              <p className="text-sm text-gray-500">
                Manage, track and review submitted grievances
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search complaint..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 bg-gray-50">
                <Filter className="w-4 h-4 text-gray-400 mr-1" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent text-sm text-gray-700 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="overflow-x-auto mt-6 rounded-lg border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No complaints found.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint, index) => (
                    <tr
                      key={complaint.id}
                      className={`border-t hover:bg-blue-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-2 font-medium text-gray-700">
                        #{complaint.id}
                      </td>
                      <td className="px-4 py-2">{complaint.title}</td>
                      <td className="px-4 py-2">{complaint.category}</td>
                      <td className="px-4 py-2">
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td className="px-4 py-2">
                        <PriorityBadge priority={complaint.priority} />
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {complaint.submittedDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
