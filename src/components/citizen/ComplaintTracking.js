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
      </div>
    </div>
  );
};

export default ComplaintTracking;