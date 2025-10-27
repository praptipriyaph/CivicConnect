import React from 'react';
import { User, X } from 'lucide-react';

const ProfileDropdown = ({ user, onClose }) => {
  if (!user) return null;

  return (
    // Position fixed, top-right, adjust styling as needed
    <div className="fixed top-16 right-4 z-50 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1">
         <div className="flex justify-between items-center px-4 py-2 border-b">
           <h3 className="text-sm font-medium text-gray-900">Profile</h3>
           <button
             onClick={onClose}
             className="text-gray-400 hover:text-gray-600 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
             aria-label="Close profile"
           >
             <X className="w-4 h-4" />
           </button>
         </div>
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3 mb-2">
             <User className="w-8 h-8 text-gray-500 rounded-full bg-gray-100 p-1" />
             <div>
               <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
               <p className="text-xs text-gray-500">{user.role}</p>
             </div>
          </div>
          <p className="text-xs text-gray-500">ID: {user.id}</p>
        </div>
        {/* Add more profile links/actions here if needed */}
         {/* <div className="border-t border-gray-100"></div>
         <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account settings</a> */}
      </div>
    </div>
  );
};

export default ProfileDropdown;