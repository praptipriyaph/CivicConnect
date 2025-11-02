<<<<<<< HEAD
import React, { useState, useMemo } from 'react';
import {
  FileText,
  CheckCircle,
  Filter,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { COMPLAINT_STATUS } from '../../utils/constants';

// ✅ Dummy departments
const departments = [
  'Roads & Transport',
  'Water Supply',
  'Electricity',
  'Sanitation',
  'Parks & Recreation',
];

// ✅ Dummy complaints (5 total)
const initialComplaints = [
  {
    id: 101,
    title: 'Potholes on Main Road',
    description: 'Large potholes near the signal causing traffic jams.',
    category: 'Road Maintenance',
    location: 'MG Road, Bangalore',
    submittedDate: '2025-10-20',
    submittedBy: 'Ravi Kumar',
    status: COMPLAINT_STATUS.LODGED,
  },
  {
    id: 102,
    title: 'Streetlight not working',
    description: 'Streetlight near park gate not working for a week.',
    category: 'Public Lighting',
    location: 'JP Nagar, Bangalore',
    submittedDate: '2025-10-21',
    submittedBy: 'Sushma R.',
    status: COMPLAINT_STATUS.LODGED,
  },
  {
    id: 103,
    title: 'Garbage not collected',
    description: 'Garbage pile-up for 3 days near apartment entrance.',
    category: 'Sanitation',
    location: 'Indiranagar, Bangalore',
    submittedDate: '2025-10-23',
    submittedBy: 'Arjun Mehta',
    status: COMPLAINT_STATUS.LODGED,
  },
  {
    id: 104,
    title: 'Broken water pipe',
    description: 'Water leakage near the junction affecting traffic.',
    category: 'Water Supply',
    location: 'Koramangala, Bangalore',
    submittedDate: '2025-10-24',
    submittedBy: 'Priya Sharma',
    status: COMPLAINT_STATUS.LODGED,
  },
  {
    id: 105,
    title: 'Overflowing drainage issue',
    description: 'Drainage overflow causing foul smell in the area.',
    category: 'Sanitation',
    location: 'BTM Layout, Bangalore',
    submittedDate: '2025-10-25',
    submittedBy: 'Rahul Verma',
    status: COMPLAINT_STATUS.LODGED,
  },
];

const AdminScrutinyDashboard = () => {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // ✅ Handle Assign
  const handleAssign = (complaintId, dept) => {
    if (!dept) {
      alert('❌ Please select a department before assigning.');
      return;
    }
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: COMPLAINT_STATUS.FORWARDED,
              assignedToDept: dept,
              assignedByAdmin: 'Admin',
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : c
      )
    );
    alert('✅ Complaint forwarded to department successfully.');
  };

  // ✅ Handle Close Complaint
  const handleClose = (complaintId) => {
    const reason = prompt('Enter reason for closing this complaint:');
    if (reason && reason.trim()) {
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId
            ? {
                ...c,
                status: 'CLOSED',
                resolutionDetails: `Closed by Admin: ${reason}`,
                lastUpdated: new Date().toISOString().split('T')[0],
              }
            : c
        )
      );
      alert('Complaint closed successfully.');
    } else if (reason !== null) {
      alert('❌ Closing reason cannot be empty.');
    }
  };

  const lodgedComplaints = complaints.filter(
    (c) => c.status === COMPLAINT_STATUS.LODGED
  );

  // ✅ Filter + Sort
  const filteredAndSorted = useMemo(() => {
    let result = [...complaints];

    if (filterCategory !== 'all') {
      result = result.filter(
        (c) =>
          (c.category || '').toLowerCase() === filterCategory.toLowerCase()
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(
        (c) => (c.status || '').toLowerCase() === filterStatus.toLowerCase()
      );
    }

    result.sort((a, b) => {
      const dA = new Date(a.submittedDate || 0);
      const dB = new Date(b.submittedDate || 0);
      return sortOrder === 'asc' ? dA - dB : dB - dA;
    });

    return result;
  }, [complaints, filterCategory, filterStatus, sortOrder]);

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedComplaints = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 p-6">
      {/* 🔹 Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
=======
import React from 'react';
// ***REMOVED Send*** from import
import { FileText, HelpCircle, XCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { departments } from '../../utils/mockData';
import { COMPLAINT_STATUS } from '../../utils/constants';

// Component for handling scrutiny tasks
const AdminScrutinyDashboard = ({ complaints, onUpdateComplaint, currentUser }) => {

  const lodgedComplaints = complaints.filter(c => c.status === COMPLAINT_STATUS.LODGED);
  const awaitingInfoComplaints = complaints.filter(c => c.status === COMPLAINT_STATUS.MORE_INFO_NEEDED);

  const stats = {
    new: lodgedComplaints.length,
    awaitingInfo: awaitingInfoComplaints.length,
  };

  const handleAssign = (complaintId, dept) => {
    if (!dept) return;
    onUpdateComplaint(complaintId, {
      status: COMPLAINT_STATUS.FORWARDED,
      assignedToDept: dept,
      assignedByAdmin: currentUser ? currentUser.name : 'Admin',
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleReject = (complaintId) => {
    const reason = prompt("Enter reason for rejection:");
    if (reason && reason.trim()) {
        onUpdateComplaint(complaintId, {
        status: COMPLAINT_STATUS.REJECTED_BY_ADMIN,
        resolutionDetails: `Rejected by Admin: ${reason}`,
        assignedByAdmin: currentUser ? currentUser.name : 'Admin',
        assignedToDept: null,
        lastUpdated: new Date().toISOString().split('T')[0]
        });
    } else if (reason !== null) {
        alert("Rejection reason cannot be empty.");
    }
  };

   const handleRequestInfo = (complaintId) => {
    const requestedInfo = prompt("What specific information is needed from the citizen?");
    if (requestedInfo && requestedInfo.trim()) {
        onUpdateComplaint(complaintId, {
        status: COMPLAINT_STATUS.MORE_INFO_NEEDED,
        resolutionDetails: `Admin requires more info: ${requestedInfo}`,
        assignedByAdmin: currentUser ? currentUser.name : 'Admin',
        lastUpdated: new Date().toISOString().split('T')[0]
        });
    } else if (requestedInfo !== null) {
         alert("Please specify what information is needed.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
>>>>>>> origin/front-end
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Grievances</p>
<<<<<<< HEAD
              <p className="text-2xl font-semibold text-blue-600">
                {lodgedComplaints.length}
              </p>
=======
              <p className="text-2xl font-semibold text-blue-600">{stats.new}</p>
>>>>>>> origin/front-end
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
<<<<<<< HEAD
              <p className="text-sm text-gray-600">Total Complaints</p>
              <p className="text-2xl font-semibold text-green-600">
                {complaints.length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
=======
              <p className="text-sm text-gray-600">Awaiting Info</p>
              <p className="text-2xl font-semibold text-orange-600">{stats.awaitingInfo}</p>
            </div>
            <HelpCircle className="w-8 h-8 text-orange-600" />
>>>>>>> origin/front-end
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* 🔹 New Grievances Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          New Grievances ({lodgedComplaints.length})
        </h2>
        <div className="space-y-4">
          {lodgedComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="border border-gray-200 rounded-lg p-4 space-y-2"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                <h3 className="font-medium text-gray-900">
                  {complaint.title} (ID: #{complaint.id})
                </h3>
                <StatusBadge status={complaint.status} />
              </div>
              <p className="text-gray-600 text-sm">{complaint.description}</p>
              <p className="text-gray-500 text-sm">
                Category: {complaint.category}
              </p>
              <p className="text-gray-500 text-sm">
                Location: {complaint.location}
              </p>
              <p className="text-gray-500 text-sm">
                Submitted: {complaint.submittedDate} by {complaint.submittedBy}
              </p>

              {/* ✅ Assign + Close Buttons */}
              <div className="flex flex-col sm:flex-row sm:space-x-2 pt-2 border-t mt-2">
                <select
                  id={`dept-${complaint.id}`}
                  className="flex-grow p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-green-500"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select department...
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
                      complaint.id,
                      document.getElementById(`dept-${complaint.id}`).value
                    )
                  }
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm flex-shrink-0 mt-2 sm:mt-0"
                >
                  Assign
                </button>
                <button
                  onClick={() => handleClose(complaint.id)}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm flex-shrink-0 mt-2 sm:mt-0"
                >
                  Close Complaint
=======
      {/* New Grievances Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">New Grievances ({lodgedComplaints.length})</h2>
        <div className="space-y-4">
          {lodgedComplaints.map(complaint => (
            <div key={complaint.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                <h3 className="font-medium text-gray-900">{complaint.title} (ID: #{complaint.id})</h3>
                <div className="flex items-center space-x-2 flex-shrink-0">
                     <PriorityBadge priority={complaint.priority} />
                     <StatusBadge status={complaint.status} />
                 </div>
              </div>
              {complaint.description && <p className="text-gray-600 text-sm">{complaint.description}</p>}
              <p className="text-gray-500 text-sm">Category: {complaint.category}</p>
              <p className="text-gray-500 text-sm">Location: {complaint.location}</p>
              <p className="text-gray-500 text-sm">Submitted: {complaint.submittedDate} by {complaint.submittedBy}</p>
              {complaint.evidence && <p className="text-gray-500 text-sm">Evidence: {complaint.evidence}</p>}

              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 pt-2 border-t">
                 <select
                  aria-label={`Assign complaint #${complaint.id}`}
                  className="flex-grow p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleAssign(complaint.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Assign to department...</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                 <button
                    onClick={() => handleRequestInfo(complaint.id)}
                    title="Request More Info from Citizen"
                    className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md flex items-center justify-center space-x-1 text-sm flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                 >
                    <HelpCircle className="w-4 h-4" />
                    <span>Need Info</span>
                </button>
                 <button
                    onClick={() => handleReject(complaint.id)}
                    title="Reject Grievance"
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center space-x-1 text-sm flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                 >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
>>>>>>> origin/front-end
                </button>
              </div>
            </div>
          ))}
          {lodgedComplaints.length === 0 && (
<<<<<<< HEAD
            <p className="text-gray-500 text-center py-6">
              No new grievances pending assignment.
            </p>
=======
              <p className="text-gray-500 text-center py-8">No new grievances requiring scrutiny.</p>
>>>>>>> origin/front-end
          )}
        </div>
      </div>

<<<<<<< HEAD
      {/* 🔹 All Complaints Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="w-5 h-5 text-green-600" /> All Complaints
          </h2>
          <div className="flex flex-wrap gap-3 mt-3 md:mt-0">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="Road Maintenance">Road Maintenance</option>
              <option value="Public Lighting">Public Lighting</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Water Supply">Water Supply</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="lodged">Lodged</option>
              <option value="forwarded">Forwarded</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={() =>
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
              className="flex items-center border border-gray-300 rounded-md px-3 py-2 text-sm bg-white hover:bg-green-50"
            >
              {sortOrder === 'asc' ? (
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

        {/* Complaint List */}
        {paginatedComplaints.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No complaints found.</p>
        ) : (
          paginatedComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">
                  {complaint.title} (#{complaint.id})
                </h3>
                <StatusBadge status={complaint.status} />
              </div>
              <p className="text-gray-600 text-sm mt-1">
                {complaint.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Category: {complaint.category} | Location: {complaint.location}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Submitted on {complaint.submittedDate}
              </p>
              {complaint.assignedToDept && (
                <p className="text-xs text-gray-500 mt-1 italic">
                  Assigned to: {complaint.assignedToDept}
                </p>
              )}
              {complaint.resolutionDetails && (
                <p className="text-xs text-gray-500 mt-2 italic">
                  {complaint.resolutionDetails}
                </p>
              )}
            </div>
          ))
        )}

        {/* Pagination Controls */}
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
=======
       {awaitingInfoComplaints.length > 0 && (
           <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4 text-orange-700">Grievances Awaiting Citizen Information ({awaitingInfoComplaints.length})</h2>
                <div className="space-y-4">
                    {awaitingInfoComplaints.map(complaint => (
                         <div key={complaint.id} className="border border-orange-200 rounded-lg p-4 space-y-2 bg-orange-50">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                                <h3 className="font-medium text-gray-900">{complaint.title} (ID: #{complaint.id})</h3>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <PriorityBadge priority={complaint.priority} />
                                    <StatusBadge status={complaint.status} />
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm">Location: {complaint.location}</p>
                            <p className="text-sm text-orange-800 font-medium">Info Requested: {complaint.resolutionDetails || 'Details not specified.'}</p>
                            <p className="text-gray-500 text-xs">Requested on: {complaint.lastUpdated}</p>
                         </div>
                    ))}
                </div>
           </div>
       )}

>>>>>>> origin/front-end
    </div>
  );
};

<<<<<<< HEAD
export default AdminScrutinyDashboard;
=======
export default AdminScrutinyDashboard;
>>>>>>> origin/front-end
