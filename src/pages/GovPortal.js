import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import { departments } from '../utils/mockData';

const GovPortal = ({ complaints, onUpdateComplaint }) => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updateNote, setUpdateNote] = useState('');

  const assignedComplaints = complaints.filter(c => c.assignedTo);
  const unassignedComplaints = complaints.filter(c => !c.assignedTo && c.status !== 'Resolved');

  const handleAssignIssue = (complaintId, assignTo) => {
    onUpdateComplaint(complaintId, { 
      assignedTo: assignTo,
      status: 'In Progress' 
    });
  };

  const handleUpdateStatus = (complaintId) => {
    onUpdateComplaint(complaintId, { 
      status: newStatus,
      updateNote: updateNote,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setSelectedComplaint(null);
    setNewStatus('');
    setUpdateNote('');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Government Portal</h1>
        <p className="text-gray-600">Assign and manage citizen complaints</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Issues */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Unassigned Issues ({unassignedComplaints.length})</h2>
          <div className="space-y-4">
            {unassignedComplaints.map(complaint => (
              <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{complaint.title}</h3>
                  <PriorityBadge priority={complaint.priority} />
                </div>
                <p className="text-gray-600 text-sm mb-2">{complaint.description}</p>
                <p className="text-gray-500 text-sm mb-3">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  {complaint.location}
                </p>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md mb-2"
                  onChange={(e) => e.target.value && handleAssignIssue(complaint.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="">Assign to department...</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            ))}
            {unassignedComplaints.length === 0 && (
              <p className="text-gray-500 text-center py-8">No unassigned issues</p>
            )}
          </div>
        </div>

        {/* Assigned Issues */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Assigned Issues ({assignedComplaints.length})</h2>
          <div className="space-y-4">
            {assignedComplaints.map(complaint => (
              <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{complaint.title}</h3>
                  <StatusBadge status={complaint.status} />
                </div>
                <p className="text-gray-600 text-sm mb-2">{complaint.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span><MapPin className="inline w-4 h-4 mr-1" />{complaint.location}</span>
                  <span>Assigned to: {complaint.assignedTo}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedComplaint(complaint);
                    setNewStatus(complaint.status);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Update Status
                </button>
              </div>
            ))}
            {assignedComplaints.length === 0 && (
              <p className="text-gray-500 text-center py-8">No assigned issues</p>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Update Status - {selectedComplaint.title}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Note</label>
                <textarea
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Add a note about this update..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => handleUpdateStatus(selectedComplaint.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setNewStatus('');
                  setUpdateNote('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
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