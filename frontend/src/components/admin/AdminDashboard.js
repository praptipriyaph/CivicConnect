import React, { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  TrendingUp,
  CheckCircle,
  Search,
  Filter,
  Loader,
} from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { useApiService } from "../../services/api";

const AdminDashboard = () => {
  const apiService = useApiService();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getAdminComplaints();
        console.log("Fetched complaints:", data);
        setComplaints(data || []);
      } catch (err) {
        console.error("Error loading admin complaints:", err);
        setError("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
    setTimeout(() => setSlideIn(true), 100);
  }, []);

  // Stats
  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "open").length,
    assigned: complaints.filter((c) => c.status === "assigned").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    reopened: complaints.filter((c) => c.status === "reopened").length,
  };

  // Filter + Search logic
  const filteredComplaints = complaints.filter((c) => {
    const status = c.status?.toLowerCase() || "";
    const tag = c.tag?.toLowerCase() || "";
    const title = c.title?.toLowerCase() || "";
    const id = String(c.complaint_id || "");

    const matchesStatus =
      filterStatus === "all" || status === filterStatus.toLowerCase();

    const matchesSearch =
      title.includes(searchQuery.toLowerCase()) ||
      tag.includes(searchQuery.toLowerCase()) ||
      id.includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
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
          {[
            { label: "Total Complaints", value: stats.total, icon: FileText, color: "blue" },
            { label: "Open", value: stats.open, icon: Clock, color: "yellow" },
            { label: "Assigned", value: stats.assigned, icon: TrendingUp, color: "orange" },
            { label: "In Progress", value: stats.inProgress, icon: CheckCircle, color: "green" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-sm border border-gray-100 p-5 rounded-xl hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{item.label}</p>
                  <h2 className={`text-3xl font-semibold text-${item.color}-600 mt-1`}>
                    {item.value}
                  </h2>
                </div>
                <item.icon className={`w-9 h-9 text-${item.color}-400`} />
              </div>
            </div>
          ))}
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
                  <option value="open">Open</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="reopened">Reopened</option>
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
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                      No complaints found.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint, index) => (
                    <tr
                      key={complaint.complaint_id}
                      className={`border-t hover:bg-blue-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-2 font-medium text-gray-700">
                        #{complaint.complaint_id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-2">{complaint.title}</td>
                      <td className="px-4 py-2">{complaint.tag}</td>
                      <td className="px-4 py-2">
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td className="px-4 py-2">
                        {complaint.image ? (
                          <img
                            src={complaint.image}
                            alt="Evidence"
                            className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition"
                            onClick={() => window.open(complaint.image, "_blank")}
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">No image</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {new Date(complaint.created_at).toLocaleString()}
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
