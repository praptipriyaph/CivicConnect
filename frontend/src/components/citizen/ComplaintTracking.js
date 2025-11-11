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
  ArrowRight,
  ArrowLeft,
  Loader,
} from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import LocationDisplay from "../common/LocationDisplay";
import { COMPLAINT_STATUS } from "../../utils/constants";
import { useApiService } from "../../services/api";
import { useQuery } from "@tanstack/react-query";

const ComplaintTracking = () => {
  const navigate = useNavigate();
  const apiService = useApiService();

  const { data: complaints = [], isLoading: loading, error } = useQuery({
    queryKey: ['citizenComplaints'],
    queryFn: apiService.getCitizenComplaints
  });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateOrder, setDateOrder] = useState("desc");

  const [prevCategory, setPrevCategory] = useState("all");
  const [prevDateOrder, setPrevDateOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const activeComplaints = complaints.filter(
    (c) => c.status?.toLowerCase() !== COMPLAINT_STATUS.CLOSED.toLowerCase()
  );
  const previousComplaints = complaints.filter(
    (c) => c.status?.toLowerCase() === COMPLAINT_STATUS.CLOSED.toLowerCase()
  );

  const filteredAndSortedActive = useMemo(() => {
    let result = [...activeComplaints];

    if (selectedCategory !== "all") {
      result = result.filter(
        (c) => c.tag?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedStatus !== "all") {
      result = result.filter(
        (c) => c.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    result.sort((a, b) => {
      const dA = new Date(a.created_at || a.submittedDate || 0);
      const dB = new Date(b.created_at || b.submittedDate || 0);
      return dateOrder === "asc" ? dA - dB : dB - dA;
    });

    return result;
  }, [activeComplaints, selectedCategory, selectedStatus, dateOrder]);

  const filteredAndSortedPrevious = useMemo(() => {
    let result = [...previousComplaints];

    if (prevCategory !== "all") {
      result = result.filter(
        (c) => c.tag?.toLowerCase() === prevCategory.toLowerCase()
      );
    }

    result.sort((a, b) => {
      const dA = new Date(a.created_at || a.submittedDate || 0);
      const dB = new Date(b.created_at || b.submittedDate || 0);
      return prevDateOrder === "asc" ? dA - dB : dB - dA;
    });

    return result;
  }, [previousComplaints, prevCategory, prevDateOrder]);

  const totalPages = Math.ceil(filteredAndSortedActive.length / itemsPerPage);
  const paginatedActive = filteredAndSortedActive.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const resolveLocationText = (c) => {
    if (c.latitude && c.longitude) return `${c.latitude}, ${c.longitude}`;
    if (c.location && c.location.trim().length > 0) return c.location;
    return "Location not provided";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your complaints...</p>
        </div>
      </div>
    );
  }
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

  return (
    <div className="relative flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate("/")}
        className="sticky top-24 left-8 self-start bg-white shadow-md rounded-full p-2 hover:bg-blue-50 transition z-50"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" /> Active Complaints
          </h2>

          <div className="flex gap-3 flex-wrap mt-3 md:mt-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
            >
              <option value="all">All Categories</option>
              <option value="roads">Roads</option>
              <option value="waste">Garbage</option>
              <option value="water">Water</option>
              <option value="electricity">Electricity</option>
              <option value="health">Health</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="reopened">Reopened</option>
            </select>

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

        {paginatedActive.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No active complaints found.
          </p>
        ) : (
          paginatedActive.map((c) => (
            <ComplaintCard key={c.complaint_id} c={c} navigate={navigate} />
          ))
        )}

        {filteredAndSortedActive.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" /> Previous Complaints
          </h2>

          <div className="flex gap-3 flex-wrap mt-3 md:mt-0">
            <select
              value={prevCategory}
              onChange={(e) => setPrevCategory(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
            >
              <option value="all">All Categories</option>
              <option value="roads">Roads</option>
              <option value="waste">Garbage</option>
              <option value="water">Water</option>
              <option value="electricity">Electricity</option>
              <option value="health">Health</option>
            </select>

            <button
              onClick={() =>
                setPrevDateOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white hover:bg-blue-50"
            >
              {prevDateOrder === "asc" ? (
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

        {filteredAndSortedPrevious.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            You have no closed complaints yet.
          </p>
        ) : (
          filteredAndSortedPrevious.slice(0, 3).map((c) => (
            <ComplaintCard key={c.complaint_id} c={c} navigate={navigate} />
          ))
        )}

        {filteredAndSortedPrevious.length > 3 && (
          <div className="mt-3 text-right">
            <button
              onClick={() => navigate("/previous-complaints")}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-end ml-auto"
            >
              More <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ComplaintCard = ({ c, navigate }) => (
  <div className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow transition">
    <div className="flex justify-between items-start">
      <h3 className="font-medium text-gray-900">
        {c.title}{" "}
        <span className="text-gray-500 text-sm">#{c.complaint_id}</span>
      </h3>
      <StatusBadge status={c.status} />
    </div>

    <p className="text-sm text-gray-600 mt-1">{c.description}</p>

    {c.image && (
      <div className="mt-3">
        <img
          src={c.image}
          alt={c.title}
          className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
          onClick={() => window.open(c.image, "_blank")}
        />
      </div>
    )}

    {c.latitude && c.longitude && (
      <div className="mt-3">
        <LocationDisplay latitude={c.latitude} longitude={c.longitude} />
      </div>
    )}

    <div className="flex justify-between text-xs text-gray-500 mt-2">
      <span className="flex items-center">
        <Calendar className="w-4 h-4 mr-1" />{" "}
        {new Date(c.created_at).toLocaleString()}
      </span>
      {/* <span className="flex items-center">
        <MapPin className="w-4 h-4 mr-1" />{" "}
        {c.latitude && c.longitude
          ? `${c.latitude}, ${c.longitude}`
          : c.location || "Not provided"}
      </span> */}
    </div>

    <p className="text-xs text-gray-400 mt-1 capitalize">
      Category: {c.tag || "N/A"}
    </p>

    <div className="mt-3 text-right">
      <button
        onClick={() =>
          navigate(`/complaint/${c.complaint_id}`, { state: { complaint: c } })
        }
        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
      >
        View Details →
      </button>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => (
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
);

export default ComplaintTracking;
