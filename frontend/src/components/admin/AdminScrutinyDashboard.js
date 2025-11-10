import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  CheckCircle,
  Filter,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  Loader,
} from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { useApiService } from "../../services/api";

const departments = ["Roads", "Water", "Waste", "Electricity", "Health"];

const AdminScrutinyDashboard = () => {
  const apiService = useApiService();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterCategory, setFilterCategory] = useState("all"); // ✅ start as "all"
  const [filterStatus, setFilterStatus] = useState("assigned");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Format date safely
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "—" : d.toLocaleString();
  };

  // ✅ Load complaints
  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getAdminComplaints();
        console.log("Fetched complaints:", data);
        setComplaints(data || []);
      } catch (err) {
        console.error("Error loading complaints:", err);
        setError("Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };
    loadComplaints();
  }, []);

  // ✅ Assign complaint
  const handleAssign = async (complaintId, dept) => {
    const selectedDept =
      dept || complaints.find((c) => c.complaint_id === complaintId)?.tag;

    if (!selectedDept) {
      alert("Please select a department before assigning.");
      return;
    }

    try {
      await apiService.adminUpdateComplaint({
        complaint_id: complaintId,
        description: `Assigned to ${selectedDept} department.`,
      });

      alert(`Complaint forwarded to ${selectedDept} successfully.`);
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaint_id === complaintId
            ? { ...c, status: "assigned", assigned_department: selectedDept }
            : c
        )
      );
    } catch (error) {
      console.error("Error assigning complaint:", error);
      alert("Failed to forward complaint.");
    }
  };

  // ✅ Close complaint
  const handleClose = async (complaintId) => {
    const reason = prompt("Enter reason for closing this complaint:");
    if (!reason || !reason.trim())
      return alert("Closing reason cannot be empty.");

    try {
      await apiService.closeComplaint({
        complaint_id: complaintId,
        description: reason,
      });
      alert("Complaint closed successfully.");
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaint_id === complaintId ? { ...c, status: "closed" } : c
        )
      );
    } catch (error) {
      console.error("Error closing complaint:", error);
      alert("Failed to close complaint.");
    }
  };

  // ✅ Filter + Sort
  const filteredAndSorted = useMemo(() => {
    if (!complaints || complaints.length === 0) return [];

    let result = [...complaints];

    // Filter by category
    if (filterCategory && filterCategory !== "all") {
      result = result.filter(
        (c) => c.tag?.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    // Filter by status
    if (filterStatus && filterStatus !== "all") {
      result = result.filter(
        (c) => c.status?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Sort
    result.sort((a, b) => {
      const dA = new Date(a.created_at || 0);
      const dB = new Date(b.created_at || 0);
      return sortOrder === "asc" ? dA - dB : dB - dA;
    });

    return result;
  }, [complaints, filterCategory, filterStatus, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedComplaints = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openComplaints = complaints.filter(
    (c) => c.status === "open" || c.status === "reopened"
  );

  // 🌀 Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  // ✅ Render
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Complaints</p>
              <p className="text-2xl font-semibold text-blue-600">
                {openComplaints.length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Complaints</p>
              <p className="text-2xl font-semibold text-green-600">
                {complaints.length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Open Complaints */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Open Complaints ({openComplaints.length})
        </h2>
        <div className="space-y-4">
          {openComplaints.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No new grievances pending assignment.
            </p>
          ) : (
            openComplaints.map((complaint) => (
              <div
                key={complaint.complaint_id}
                className="border border-gray-200 rounded-lg p-4 space-y-2"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                  <h3 className="font-medium text-gray-900">
                    {complaint.title} (#{complaint.complaint_id.slice(0, 8)})
                  </h3>
                  <StatusBadge status={complaint.status} />
                </div>

                <p className="text-gray-600 text-sm">{complaint.description}</p>
                <p className="text-gray-500 text-sm">
                  Category: {complaint.tag}
                </p>

                {complaint.image && (
                  <div className="mt-2">
                    <img
                      src={
                        complaint.image.startsWith("http")
                          ? complaint.image
                          : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/complaint_images/${complaint.image}`
                      }
                      alt="Complaint"
                      className="w-40 h-40 object-cover rounded-md border cursor-pointer hover:opacity-90 transition"
                      onClick={() =>
                        window.open(
                          complaint.image.startsWith("http")
                            ? complaint.image
                            : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/complaint_images/${complaint.image}`,
                          "_blank"
                        )
                      }
                    />
                  </div>
                )}

                <p className="text-gray-500 text-sm">
                  Submitted: {formatDate(complaint.created_at)}
                </p>

                <div className="flex flex-col sm:flex-row sm:space-x-2 pt-2 border-t mt-2">
                  <select
                    id={`dept-${complaint.complaint_id}`}
                    className="flex-grow p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-green-500"
                    defaultValue={complaint.tag || ""}
                  >
                    <option value="" disabled>
                      Choose a Category
                    </option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      handleAssign(
                        complaint.complaint_id,
                        document.getElementById(`dept-${complaint.complaint_id}`)
                          .value
                      )
                    }
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm flex-shrink-0 mt-2 sm:mt-0"
                  >
                    Assign
                  </button>
                  <button
                    onClick={() => handleClose(complaint.complaint_id)}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm flex-shrink-0 mt-2 sm:mt-0"
                  >
                    Close
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Complaints */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="w-5 h-5 text-green-600" /> Active Complaints
          </h2>
          <div className="flex flex-wrap gap-3 mt-3 md:mt-0">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="all">All Categories</option>
              {departments.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              {/* <option value="all">All Status</option> */}
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
            </select>

            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="flex items-center border border-gray-300 rounded-md px-3 py-2 text-sm bg-white hover:bg-green-50"
            >
              {sortOrder === "asc" ? (
                <>
                  <SortAsc className="w-4 h-4 mr-1 text-green-600" />
                  Date ↑
                </>
              ) : (
                <>
                  <SortDesc className="w-4 h-4 mr-1 text-green-600" />
                  Date ↓
                </>
              )}
            </button>
          </div>
        </div>

        {paginatedComplaints.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No complaints found.</p>
        ) : (
          paginatedComplaints.map((complaint) => (
            <div
              key={complaint.complaint_id}
              className="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">
                  {complaint.title} (#{complaint.complaint_id.slice(0, 8)})
                </h3>
                <StatusBadge status={complaint.status} />
              </div>
              <p className="text-gray-600 text-sm mt-1">
                {complaint.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Category: {complaint.tag}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Submitted on {formatDate(complaint.created_at)}
              </p>

              {complaint.image && (
                <img
                  src={
                    complaint.image.startsWith("http")
                      ? complaint.image
                      : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/complaint_images/${complaint.image}`
                  }
                  alt="Complaint"
                  className="w-32 h-32 mt-2 object-cover rounded cursor-pointer hover:opacity-90 transition"
                  onClick={() =>
                    window.open(
                      complaint.image.startsWith("http")
                        ? complaint.image
                        : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/complaint_images/${complaint.image}`,
                      "_blank"
                    )
                  }
                />
              )}

              {complaint.assigned_to && (
                <p className="text-xs text-gray-500 mt-1 italic">
                  Assigned To: {complaint.assigned_to}
                </p>
              )}
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-blue-100 rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 text-blue-600" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 bg-blue-100 rounded disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScrutinyDashboard;
