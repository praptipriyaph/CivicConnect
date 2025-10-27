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
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Grievances</p>
              <p className="text-2xl font-semibold text-blue-600">{stats.new}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Awaiting Info</p>
              <p className="text-2xl font-semibold text-orange-600">{stats.awaitingInfo}</p>
            </div>
            <HelpCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

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
                </button>
              </div>
            </div>
          ))}
          {lodgedComplaints.length === 0 && (
              <p className="text-gray-500 text-center py-8">No new grievances requiring scrutiny.</p>
          )}
        </div>
      </div>

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

    </div>
  );
};

export default AdminScrutinyDashboard;