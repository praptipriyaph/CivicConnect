import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const UserManagement = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">User Management</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium">John Citizen</h3>
            <p className="text-sm text-gray-600">Citizen • Active</p>
          </div>
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-800">
              <Edit className="w-4 h-4" />
            </button>
            <button className="text-red-600 hover:text-red-800">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium">Gov Official</h3>
            <p className="text-sm text-gray-600">Government • Active</p>
          </div>
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-800">
              <Edit className="w-4 h-4" />
            </button>
            <button className="text-red-600 hover:text-red-800">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;