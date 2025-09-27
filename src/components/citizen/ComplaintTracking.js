import React from 'react';
import { MapPin, Calendar, Star } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const ComplaintTracking = ({ complaints }) => {
  const userComplaints = complaints.filter(c => c.submittedBy === 'Current User');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">My Complaints</h2>
      
      <div className="space-y-4">
        {userComplaints.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No complaints submitted yet</p>
        ) : (
          userComplaints.map(complaint => (
            <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{complaint.title}</h3>
                <StatusBadge status={complaint.status} />
              </div>
              <p className="text-gray-600 text-sm mb-2">{complaint.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{complaint.location}</span>
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{complaint.submittedDate}</span>
              </div>
              {complaint.status === 'Resolved' && !complaint.rating && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600 mb-2">Rate this resolution:</p>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="w-5 h-5 text-gray-300 hover:text-yellow-500 cursor-pointer" />
                    ))}
                  </div>
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