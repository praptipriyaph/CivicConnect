import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { COMPLAINT_STATUS } from "../../utils/constants";

const PreviousComplaints = () => {
  const navigate = useNavigate();

  // 🧩 Mock previous (closed) complaint data
  const mockComplaints = [
    {
      id: 101,
      title: "Potholes fixed on main road",
      description: "Resurfacing done successfully in Ward 5.",
      location: "Ward 5",
      submittedDate: "2025-10-14",
      status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
      category: "road",
    },
    {
      id: 102,
      title: "Streetlight repair completed",
      description: "Streetlights restored near the park area.",
      location: "Sector 7",
      submittedDate: "2025-10-11",
      status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
      category: "electricity",
    },
    {
      id: 103,
      title: "Garbage cleared in Block A",
      description: "Garbage pickup resumed after delay.",
      location: "Block A",
      submittedDate: "2025-09-29",
      status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
      category: "garbage",
    },
    {
      id: 104,
      title: "Drainage unclogged",
      description: "Water flow restored successfully.",
      location: "Sector 12",
      submittedDate: "2025-09-25",
      status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
      category: "water",
    },
    {
      id: 105,
      title: "Park maintenance done",
      description: "Broken benches and lamps fixed.",
      location: "Sector 3",
      submittedDate: "2025-09-20",
      status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
      category: "other",
    },
    {
      id: 106,
      title: "Potholes fixed at crossing",
      description: "City road department completed patchwork.",
      location: "Main Crossing",
      submittedDate: "2025-09-18",
      status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
      category: "road",
    },
    {
      id: 107,
      title: "Power outage resolved",
      description: "Transformer replaced successfully.",
      location: "Ward 8",
      submittedDate: "2025-09-10",
      status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
      category: "electricity",
    },
  ];

  // State for filters & pagination
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateOrder, setDateOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🧠 Filter + Sort logic
  const filteredAndSorted = useMemo(() => {
    let result = [...mockComplaints];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(
        (c) =>
          (c.category || "").toString().trim().toLowerCase() ===
          selectedCategory.trim().toLowerCase()
      );
    }

    // Sort by date safely
    result.sort((a, b) => {
      const dA = new Date(a.submittedDate || 0);
      const dB = new Date(b.submittedDate || 0);
      return dateOrder === "asc" ? dA - dB : dB - dA;
    });

    return result;
  }, [mockComplaints, selectedCategory, dateOrder]);

  // Pagination
  const paginated = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);

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

          {/* Category Filter + Date Sort */}
          <div className="flex gap-3 items-center flex-wrap mt-3 md:mt-0">
            {/* Category Filter */}
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

            {/* Date Sort */}
            <button
              onClick={() =>
                setDateOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white hover:bg-blue-50"
            >
              {dateOrder === "asc" ? (
                <>
                  <SortAsc className="w-4 h-4 mr-1 text-blue-600" />
                  Date ↑
                </>
              ) : (
                <>
                  <SortDesc className="w-4 h-4 mr-1 text-blue-600" />
                  Date ↓
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
              key={c.id}
              className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">
                  {c.title}{" "}
                  <span className="text-gray-500 text-sm">#{c.id}</span>
                </h3>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-sm text-gray-600 mt-1">{c.description}</p>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> {c.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" /> {c.submittedDate}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 capitalize">
                Category: {c.category || "N/A"}
              </p>
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
