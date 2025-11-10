import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  SortAsc,
  SortDesc,
  ArrowLeft,
  Loader,
} from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { COMPLAINT_STATUS } from "../../utils/constants";
import { useApiService } from "../../services/api";

const PreviousComplaints = () => {
  const navigate = useNavigate();
  const apiService = useApiService();
  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Load complaints
  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCitizenComplaints();
        setAllComplaints(data);
      } catch (err) {
        console.error("Error loading complaints:", err);
        setError("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };
    loadComplaints();
  }, []);

  // ✅ Filter only closed
  const closedComplaints = useMemo(() => {
    return allComplaints.filter(
      (c) =>
        c.status?.toLowerCase() === COMPLAINT_STATUS.CLOSED.toLowerCase() ||
        c.status?.toLowerCase() === "resolved"
    );
  }, [allComplaints]);

  // Pagination + filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateOrder, setDateOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Unified location resolver
  const resolveLocationText = (c) => {
    if (!c) return "Location not provided";
    if (c.latitude && c.longitude)
      return `${c.latitude}, ${c.longitude}`;
    if (c.location && c.location.trim().length > 0)
      return c.location;
    if (Array.isArray(c.coordinates) && c.coordinates.length === 2)
      return `${c.coordinates[0]}, ${c.coordinates[1]}`;
    return "Location not provided";
  };

  // ✅ Format date safely
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ✅ Filter + sort
  const filteredAndSorted = useMemo(() => {
    let result = [...closedComplaints];

    if (selectedCategory !== "all") {
      result = result.filter(
        (c) =>
          (c.category || "")
            .toString()
            .trim()
            .toLowerCase() === selectedCategory.trim().toLowerCase()
      );
    }

    result.sort((a, b) => {
      const dA = new Date(a.created_at || a.submittedDate || 0);
      const dB = new Date(b.created_at || b.submittedDate || 0);
      return dateOrder === "asc" ? dA - dB : dB - dA;
    });

    return result;
  }, [closedComplaints, selectedCategory, dateOrder]);

  // ✅ Pagination
  const paginated = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);

  // ✅ Loading + Error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading previous complaints...</p>
        </div>
      </div>
    );
  }

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
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl mb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-1 text-blue-600" /> Back
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" /> Previous Complaints
            </h2>
          </div>

          {/* Filters */}
          <div className="flex gap-3 items-center flex-wrap mt-3 md:mt-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
            >
              <option value="all">All Categories</option>
              <option value="road">Road</option>
              <option value="garbage">Garbage</option>
              <option value="water">Water</option>
              <option value="electricity">Electricity</option>
              <option value="other">Other</option>
            </select>

            <button
              onClick={() =>
                setDateOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white hover:bg-blue-50"
            >
              {dateOrder === "asc" ? (
                <>
                  <SortAsc className="w-4 h-4 mr-1 text-blue-600" /> Date ↑
                </>
              ) : (
                <>
                  <SortDesc className="w-4 h-4 mr-1 text-blue-600" /> Date ↓
                </>
              )}
            </button>
          </div>
        </div>

        {/* Complaint List */}
        {paginated.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No previous complaints found.
          </p>
        ) : (
          paginated.map((c) => (
            <div
              key={c.complaint_id || c.id}
              className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow transition cursor-pointer"
              onClick={() =>
                navigate(`/complaint/${c.complaint_id || c.id}`, {
                  state: { complaint: c },
                })
              }
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">
                  {c.title}{" "}
                  <span className="text-gray-500 text-sm">
                    #{c.complaint_id || c.id}
                  </span>
                </h3>
                <StatusBadge status={c.status} />
              </div>

              <p className="text-sm text-gray-600 mt-1">{c.description}</p>

              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />{" "}
                  {resolveLocationText(c)}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />{" "}
                  {formatDate(c.created_at || c.submittedDate)}
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-1 capitalize">
                Category: {c.category || "N/A"}
              </p>

              <div className="mt-2 text-blue-600 text-xs font-medium hover:underline">
                View Details →
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {filteredAndSorted.length > itemsPerPage && (
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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

export default PreviousComplaints;
