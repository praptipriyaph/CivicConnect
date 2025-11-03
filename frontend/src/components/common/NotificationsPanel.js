import React from 'react';
import { X } from 'lucide-react';

const NotificationsPanel = ({ onClose }) => {
  return (
     // Position fixed, top-right, adjust styling as needed
    <div className="fixed top-16 right-4 z-50 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1">
         <div className="flex justify-between items-center px-4 py-2 border-b">
           <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
           <button
             onClick={onClose}
             className="text-gray-400 hover:text-gray-600 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
             aria-label="Close notifications"
           >
             <X className="w-4 h-4" />
           </button>
         </div>
        <div className="px-4 py-3">
          {/* Replace with actual notification rendering logic */}
          <p className="text-sm text-gray-500">No new notifications.</p>
          {/* Example Notification Item:
          <div className="py-2 border-b border-gray-100 last:border-b-0">
            <p className="text-sm font-medium text-gray-900">Update on Pothole</p>
            <p className="text-xs text-gray-500">Status changed to 'In Progress'.</p>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;