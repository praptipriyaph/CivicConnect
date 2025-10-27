import React, { useState } from 'react';
// Import necessary icons and components
import { MapPin, UserCheck, Calendar, CheckSquare, XSquare } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
// Import status constants
import { COMPLAINT_STATUS } from '../utils/constants';

const GovPortal = ({ complaints, onUpdateComplaint, user }) => { // Assume user prop is passed for filtering/logging
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updateNote, setUpdateNote] = useState(''); // Use this for resolution/rejection details

  // Filter complaints assigned TO THIS department/official AND need action
  // *** Needs refinement: Filter based on logged-in user's department ***
  // For this example, we show FORWARDED and UNDER_PROCESS statuses
  const assignedComplaints = complaints.filter(c =>
        (c.status === COMPLAINT_STATUS.FORWARDED ||
        c.status === COMPLAINT_STATUS.UNDER_PROCESS)
        // && c.assignedToDept === user.department // Uncomment and adapt when user has department info
  );

  // Handler for opening the update modal
  const handleOpenUpdateModal = (complaint) => {
     setSelectedComplaint(complaint);
     // If status is FORWARDED, default next step is UNDER_PROCESS, otherwise keep current
     setNewStatus(complaint.status === COMPLAINT_STATUS.FORWARDED ? COMPLAINT_STATUS.UNDER_PROCESS : complaint.status);
     // Pre-fill note if editing a final status, otherwise clear
     setUpdateNote( (complaint.status === COMPLAINT_STATUS.ACTION_TAKEN || complaint.status === COMPLAINT_STATUS.REJECTED_BY_DEPT) ? complaint.resolutionDetails || '' : '' );
  };

  // Handler for submitting status update from modal
  const handleUpdateStatus = (complaintId) => {
    // Basic validation
    if (!newStatus || newStatus === selectedComplaint.status) {
        alert("Please select a new status to update.");
        return;
    };
    if ((newStatus === COMPLAINT_STATUS.ACTION_TAKEN || newStatus === COMPLAINT_STATUS.REJECTED_BY_DEPT) && !updateNote.trim()) {
        alert("Resolution or rejection details are required to close the grievance.");
        return;
    }

    const updates = {
      status: newStatus,
      lastUpdated: new Date().toISOString().split('T')[0],
      // If resolving/rejecting, add the note as resolution details
      // Otherwise, keep existing details unless overwritten by an optional note
      resolutionDetails: (newStatus === COMPLAINT_STATUS.ACTION_TAKEN || newStatus === COMPLAINT_STATUS.REJECTED_BY_DEPT)
                          ? updateNote
                          : (newStatus === COMPLAINT_STATUS.UNDER_PROCESS && updateNote.trim() ? `Update: ${updateNote}` : selectedComplaint.resolutionDetails),
      actionOfficer: user ? user.name : 'Gov Official' // Log who updated
    };

    // Clear old resolution details only if moving back to Under Process without a new note
    if (newStatus === COMPLAINT_STATUS.UNDER_PROCESS && !updateNote.trim()) {
         updates.resolutionDetails = null;
    }

    onUpdateComplaint(complaintId, updates);
    setSelectedComplaint(null); // Close modal
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Government Department Portal</h1>
        <p className="text-gray-600">Manage assigned citizen grievances</p>
      </div>

      {/* Only show Assigned Issues requiring action */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Grievances Requiring Action ({assignedComplaints.length})</h2>
        <div className="space-y-4">
          {assignedComplaints.map(complaint => (
            <div key={complaint.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                <h3 className="font-medium text-gray-900">{complaint.title} (ID: #{complaint.id})</h3>
                 <div className="flex items-center space-x-2 flex-shrink-0">
                     <PriorityBadge priority={complaint.priority} />
                     <StatusBadge status={complaint.status} />
                 </div>
              </div>
              {/* Details */}
              <p className="text-gray-600 text-sm">{complaint.description || 'No description provided.'}</p>
               <div className="text-sm text-gray-500 space-y-1">
                 <p><MapPin className="inline w-4 h-4 mr-1 -mt-1" />{complaint.location}</p>
                 <p><UserCheck className="inline w-4 h-4 mr-1 -mt-1" />Assigned By: {complaint.assignedByAdmin || 'N/A'}</p>
                 <p><Calendar className="inline w-4 h-4 mr-1 -mt-1" />Submitted: {complaint.submittedDate}</p>
               </div>
               {complaint.evidence && <p className="text-gray-500 text-sm">Evidence: {complaint.evidence}</p>}

              {/* Action Button */}
              <button
                onClick={() => handleOpenUpdateModal(complaint)}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Status / Add Details
              </button>
            </div>
          ))}
          {/* Message if no assigned grievances */}
          {assignedComplaints.length === 0 && (
            <p className="text-gray-500 text-center py-8">No grievances requiring action in your queue.</p>
          )}
        </div>
      </div>


      {/* Status Update Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg"> {/* Increased max-w */}
            <h3 className="text-lg font-semibold mb-4">Update Status - #{selectedComplaint.id}: {selectedComplaint.title}</h3>

            <div className="space-y-4">
              {/* Status Select */}
              <div>
                <label htmlFor="status-update" className="block text-sm font-medium text-gray-700 mb-1">New Status *</label>
                <select
                  id="status-update"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                   {/* Dynamically generate options based on current status */}
                   <option value="" disabled>Select new status...</option>

                   {/* If Forwarded, can move to Under Process */}
                   {selectedComplaint.status === COMPLAINT_STATUS.FORWARDED &&
                      <option value={COMPLAINT_STATUS.UNDER_PROCESS}>{COMPLAINT_STATUS.UNDER_PROCESS}</option>
                   }
                   {/* If Forwarded or Under Process, can move to Action Taken or Rejected */}
                   {(selectedComplaint.status === COMPLAINT_STATUS.FORWARDED || selectedComplaint.status === COMPLAINT_STATUS.UNDER_PROCESS) &&
                     <>
                        <option value={COMPLAINT_STATUS.ACTION_TAKEN}>
                           <CheckSquare className="inline w-4 h-4 mr-1 -mt-1"/> {COMPLAINT_STATUS.ACTION_TAKEN}
                        </option>
                        <option value={COMPLAINT_STATUS.REJECTED_BY_DEPT}>
                            <XSquare className="inline w-4 h-4 mr-1 -mt-1"/> {COMPLAINT_STATUS.REJECTED_BY_DEPT}
                        </option>
                     </>
                   }
                  {/* Option to keep current status if only adding notes */}
                   <option value={selectedComplaint.status}>{selectedComplaint.status} (Keep Current)</option>

                </select>
              </div>

              {/* Notes / Details Textarea */}
              <div>
                <label htmlFor="update-note" className="block text-sm font-medium text-gray-700 mb-1">
                    {(newStatus === COMPLAINT_STATUS.ACTION_TAKEN || newStatus === COMPLAINT_STATUS.REJECTED_BY_DEPT)
                        ? "Resolution / Rejection Details *" // Required for closing statuses
                        : "Update Note (Optional)" // Optional for intermediate statuses
                    }
                </label>
                <textarea
                  id="update-note"
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                     (newStatus === COMPLAINT_STATUS.ACTION_TAKEN)
                        ? "Provide details about the action taken to resolve the grievance..." :
                     (newStatus === COMPLAINT_STATUS.REJECTED_BY_DEPT)
                        ? "Provide the reason why this grievance is being rejected by the department..."
                        : "Add an optional note about this status update (e.g., investigation started, site visit scheduled)..."
                  }
                  required={newStatus === COMPLAINT_STATUS.ACTION_TAKEN || newStatus === COMPLAINT_STATUS.REJECTED_BY_DEPT}
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex space-x-3 mt-6">
              <button
                // Disable button if required fields aren't met or status hasn't changed
                disabled={!newStatus || newStatus === selectedComplaint.status || ((newStatus === COMPLAINT_STATUS.ACTION_TAKEN || newStatus === COMPLAINT_STATUS.REJECTED_BY_DEPT) && !updateNote.trim())}
                onClick={() => handleUpdateStatus(selectedComplaint.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Grievance
              </button>
              <button
                onClick={() => setSelectedComplaint(null)} // Just close modal
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovPortal;