import React from 'react';
// Import new statuses if needed for direct comparison, or rely on strings
// import { COMPLAINT_STATUS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    // Ensure case-insensitivity
    const lowerStatus = status ? status.toLowerCase() : '';

    switch (lowerStatus) {
      // Citizen
      case 'lodged': return 'bg-gray-100 text-gray-800'; // Initial

      // Admin / Nodal Officer
      case 'under scrutiny': return 'bg-purple-100 text-purple-800';
      case 'forwarded to department': return 'bg-indigo-100 text-indigo-800';
      case 'more information needed': return 'bg-orange-100 text-orange-800';
      case 'rejected by admin': return 'bg-red-100 text-red-800';

      // Government Official
      case 'under process': return 'bg-blue-100 text-blue-800'; // Replaces 'In Progress'
      case 'action taken': return 'bg-green-100 text-green-800'; // Replaces 'Resolved'
      case 'rejected by department': return 'bg-pink-100 text-pink-800';

      // Citizen Final
      case 'closed (confirmed)': return 'bg-emerald-100 text-emerald-800';
      case 'closed (appealed)': return 'bg-amber-100 text-amber-800';

      // Old statuses (optional: keep for transition or remove)
      case 'pending': return 'bg-yellow-100 text-yellow-800'; // Could map to Lodged or Under Scrutiny
      case 'in progress': return 'bg-blue-100 text-blue-800'; // Map to Under Process
      case 'resolved': return 'bg-green-100 text-green-800'; // Map to Action Taken
      case 'rejected': return 'bg-red-100 text-red-800'; // Map to Rejected by Admin/Dept

      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(status)}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;