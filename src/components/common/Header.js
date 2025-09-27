import React from 'react';
import { Building, User } from 'lucide-react';

const Header = ({ user, onLogout, onHome }) => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button 
          onClick={onHome} 
          className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
        >
          <Building className="w-8 h-8" />
          <div className="text-left">
            <h1 className="text-xl font-bold">Civic Connect</h1>
            <p className="text-xs text-blue-200">Government Services</p>
          </div>
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>{user?.name} ({user?.role})</span>
          </div>
          <button
            onClick={onLogout}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;