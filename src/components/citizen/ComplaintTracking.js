<<<<<<< HEAD
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
  ArrowLeft, // ✅ added
} from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { COMPLAINT_STATUS } from "../../utils/constants";

const ComplaintTracking = ({ complaints }) => {
  const navigate = useNavigate();

  const dummyComplaints = [
    {
      id: 1,
      title: "Streetlight not working",
      description: "Streetlight near park is off",
      location: "Ward 5",
      submittedDate: "2025-10-10",
      status: COMPLAINT_STATUS.UNDER_PROCESS,
      category: "electricity",
    },
    {
      id: 2,
      title: "Garbage collection delay",
      description: "Garbage not collected for 3 days",
      location: "Sector 12",
      submittedDate: "2025-10-08",
      status: COMPLAINT_STATUS.ACTION_TAKEN,
      category: "garbage",
    },
    {
      id: 3,
      title: "Broken drainage",
      description: "Drain near main road clogged",
      location: "Block A",
      submittedDate: "2025-10-07",
      status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
      category: "water",
    },
    {
      id: 4,
      title: "Potholes on main road",
      description: "Road needs resurfacing",
      location: "Ward 8",
      submittedDate: "2025-09-28",
      status: COMPLAINT_STATUS.PENDING,
      category: "road",
    },
  ];

  const data =
    !complaints || (Array.isArray(complaints) && complaints.length === 0)
      ? dummyComplaints
      : complaints;

  // Separate active and previous complaints
  const activeComplaints = data.filter(
    (c) =>
      ![
        COMPLAINT_STATUS.CLOSED_CONFIRMED,
        COMPLAINT_STATUS.CLOSED_APPEALED,
      ].includes(c.status)
  );
  const previousComplaints = data.filter((c) =>
    [
      COMPLAINT_STATUS.CLOSED_CONFIRMED,
      COMPLAINT_STATUS.CLOSED_APPEALED,
    ].includes(c.status)
  );

  // Filter and sort states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateOrder, setDateOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Safe filtering and sorting
  const filteredAndSorted = useMemo(() => {
    let result = [...activeComplaints];

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((c) => {
        const cat = (c.category || "").toString().trim().toLowerCase();
        return cat === selectedCategory.trim().toLowerCase();
      });
    }

    // Status filter
    if (selectedStatus && selectedStatus !== "all") {
      result = result.filter((c) => {
        const stat = (c.status || "").toString().trim().toLowerCase();
        return stat === selectedStatus.trim().toLowerCase();
      });
    }

    // Sort by date safely
    result.sort((a, b) => {
      const dA = new Date(a.submittedDate || 0);
      const dB = new Date(b.submittedDate || 0);
      return dateOrder === "asc" ? dA - dB : dB - dA;
    });

    return result;
  }, [activeComplaints, selectedCategory, selectedStatus, dateOrder]);

  const paginatedActive = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);

  return (
    <div className="relative flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      {/* ⬅️ Floating Back Arrow */}
      <button
        onClick={() => navigate("/")}
        className="sticky top-24 left-8 self-start bg-white shadow-md rounded-full p-2 hover:bg-blue-50 transition z-50"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* ACTIVE COMPLAINTS */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 w-full">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" /> Active Complaints
          </h2>

          {/* Filters and Sort */}
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

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_process">Under Process</option>
              <option value="action_taken">Action Taken</option>
              <option value="closed_confirmed">Closed Confirmed</option>
              <option value="closed_appealed">Closed Appealed</option>
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

        {/* Complaint Cards */}
        {paginatedActive.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No active complaints found.
          </p>
        ) : (
          paginatedActive.map((c) => (
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
              <div className="mt-3 text-right">
                <button
                  onClick={() =>
                    navigate(`/complaint/${c.id}`, { state: { complaint: c } })
                  }
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                >
                  View Details →
                </button>
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

      {/* PREVIOUS COMPLAINTS */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Previous Complaints
          </h2>
          {previousComplaints.length > 3 && (
            <button
              onClick={() =>
                navigate("/previous-complaints", {
                  state: { complaints: previousComplaints },
                })
              }
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              More <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>

        {previousComplaints.slice(0, 3).map((c) => (
          <div
            key={c.id}
            className="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow transition"
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
        ))}
=======
import React from 'react';
// Import new icons and statuses
import { MapPin, Calendar, Star, MessageSquare, AlertTriangle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { COMPLAINT_STATUS } from '../../utils/constants';

const ComplaintTracking = ({ complaints }) => {
  // Complaints are assumed to be pre-filtered by user in App.js

  // Placeholder function for rating submission
  const handleRate = (complaintId, rating) => {
    // In a real app: Call API to submit rating for complaintId
    console.log(`Rated complaint ${complaintId} with ${rating} stars.`);
    alert(`Thank you for rating! (Complaint ID: ${complaintId})`);
    // Ideally, update the local complaint state via a prop function passed from App.js
    // e.g., onUpdateComplaint(complaintId, { rating: rating, status: COMPLAINT_STATUS.CLOSED_CONFIRMED });
  };

  // Placeholder function for appealing
  const handleAppeal = (complaintId) => {
    // In a real app: Call API to initiate appeal for complaintId
    console.log(`Appealing complaint ${complaintId}.`);
    alert(`Appeal initiated for Complaint ID: #${complaintId}. You may be contacted for more details.`);
     // Ideally, update the local complaint state via a prop function passed from App.js
     // e.g., onUpdateComplaint(complaintId, { status: COMPLAINT_STATUS.CLOSED_APPEALED });
  };

  // Placeholder function for providing more information
   const handleProvideInfo = (complaintId) => {
    const info = prompt("Please provide the requested information:"); // Use a modal for better UX
     if (info && info.trim()) {
        console.log(`Providing info for complaint ${complaintId}: ${info}`);
        alert(`Information submitted for Complaint ID: #${complaintId}. The department will review it.`);
        // In a real app: Call API to submit the info, potentially updating status
        // e.g., onUpdateComplaint(complaintId, { status: COMPLAINT_STATUS.UNDER_PROCESS, citizenResponse: info, lastUpdated: new Date()... });
     } else if (info !== null) {
         alert("Please enter the requested information.");
     }
   };

  // Helper to check if a status indicates a final resolution/rejection by authorities
  const isFinalStatus = (status) => {
    return [
        COMPLAINT_STATUS.ACTION_TAKEN,
        COMPLAINT_STATUS.REJECTED_BY_ADMIN,
        COMPLAINT_STATUS.REJECTED_BY_DEPT,
        // Add CLOSED_CONFIRMED if you want appeal button hidden after confirmation
        // COMPLAINT_STATUS.CLOSED_CONFIRMED
    ].includes(status);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">My Grievances</h2>

      <div className="space-y-6"> {/* Increased spacing between complaints */}
        {complaints.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No grievances submitted yet.</p>
        ) : (
          // Sort complaints: newest first
          [...complaints].sort((a, b) => b.id - a.id).map(complaint => (
            <div key={complaint.id} className="border border-gray-200 rounded-lg p-4 space-y-2 relative"> {/* Added relative positioning */}
              {/* Complaint Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-2 space-y-1 sm:space-y-0">
                <h3 className="font-medium text-gray-900">{complaint.title} (ID: #{complaint.id})</h3>
                <StatusBadge status={complaint.status} />
              </div>
              {/* Description */}
              {complaint.description &&
                <p className="text-gray-600 text-sm">{complaint.description}</p>
              }
              {/* Location & Date */}
              <div className="flex flex-col sm:flex-row justify-between items-start text-sm text-gray-500">
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 flex-shrink-0" />{complaint.location}</span>
                <span className="flex items-center mt-1 sm:mt-0"><Calendar className="w-4 h-4 mr-1 flex-shrink-0" />Submitted: {complaint.submittedDate}</span>
              </div>
              {/* Last Updated */}
              {complaint.lastUpdated && complaint.lastUpdated !== complaint.submittedDate &&
                 <p className="text-xs text-gray-500">Last Updated: {complaint.lastUpdated}</p>
              }

              {/* Resolution / Rejection / Info Request Details */}
               {(isFinalStatus(complaint.status) || complaint.status === COMPLAINT_STATUS.MORE_INFO_NEEDED) && complaint.resolutionDetails && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                        {complaint.status === COMPLAINT_STATUS.MORE_INFO_NEEDED ? "Information Requested by Admin:" :
                         complaint.status === COMPLAINT_STATUS.REJECTED_BY_ADMIN || complaint.status === COMPLAINT_STATUS.REJECTED_BY_DEPT ? "Reason:" :
                         "Action Taken Details:"}
                    </p>
                    <p className={`text-sm p-3 rounded ${
                        complaint.status === COMPLAINT_STATUS.MORE_INFO_NEEDED ? 'bg-orange-50 text-orange-800 border border-orange-200' :
                        complaint.status === COMPLAINT_STATUS.ACTION_TAKEN ? 'bg-green-50 text-green-800 border border-green-200' :
                        'bg-red-50 text-red-800 border border-red-200' // For rejections
                    }`}>
                        {complaint.resolutionDetails}
                    </p>
                     {/* Button to provide info */}
                     {complaint.status === COMPLAINT_STATUS.MORE_INFO_NEEDED && (
                         <button
                            onClick={() => handleProvideInfo(complaint.id)}
                            className="mt-2 text-sm text-blue-600 hover:underline flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                          >
                             <MessageSquare className="w-4 h-4"/>
                             <span>Provide Requested Information</span>
                        </button>
                     )}
                </div>
              )}

              {/* Rating Section */}
              {complaint.status === COMPLAINT_STATUS.ACTION_TAKEN && (
                <div className="mt-3 pt-3 border-t">
                  {complaint.rating ? (
                    <>
                      <p className="text-sm text-gray-600 mb-1">Your Rating:</p>
                      <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-5 h-5 ${i < complaint.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                          ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-2">Satisfied? Rate this resolution:</p>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => handleRate(complaint.id, star)}
                            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            className="focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-0.5" // Added padding for focus ring
                          >
                             <Star className="w-5 h-5 text-gray-300 hover:text-yellow-500 hover:fill-current cursor-pointer transition-colors" />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Appeal Section */}
              {isFinalStatus(complaint.status) && complaint.status !== COMPLAINT_STATUS.CLOSED_APPEALED && (
                 <div className="mt-3 pt-3 border-t">
                     <p className="text-sm text-gray-600 mb-2">Unsatisfied with the outcome?</p>
                     <button
                        onClick={() => handleAppeal(complaint.id)}
                        className="px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-md flex items-center space-x-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400"
                     >
                         <AlertTriangle className="w-4 h-4" />
                         <span>Appeal / Reopen Grievance</span>
                    </button>
                 </div>
              )}
               {/* Indication if Appealed */}
               {complaint.status === COMPLAINT_STATUS.CLOSED_APPEALED && (
                   <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-orange-700 font-medium flex items-center"><AlertTriangle className="w-4 h-4 mr-1"/> Grievance Appealed / Reopened</p>
                      {/* Optionally add details about the appeal status if available */}
                   </div>
               )}

            </div>
          ))
        )}
>>>>>>> origin/front-end
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ComplaintTracking;
=======
export default ComplaintTracking;
>>>>>>> origin/front-end
