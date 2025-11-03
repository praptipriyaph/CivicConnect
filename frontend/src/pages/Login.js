import React, { useState } from 'react';
import { Building, User, Shield } from 'lucide-react';

const Login = ({ onLogin }) => {
  const handleRoleSelect = (role) => {
    const userData = {
      citizen: { name: 'John Citizen', role: 'Citizen', id: 1 },
      admin: { name: 'Admin User', role: 'Admin', id: 2 },
      government: { name: 'Gov Official', role: 'Government', id: 3 }
    };
    
    onLogin(userData[role]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Building className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Citizen Issue Portal</h1>
          <p className="text-gray-600 mt-2">Select your role to continue</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect('citizen')}
            className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
          >
            <User className="w-5 h-5" />
            <span>Continue as Citizen</span>
          </button>
          
          <button
            onClick={() => handleRoleSelect('admin')}
            className="w-full flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
          >
            <Shield className="w-5 h-5" />
            <span>Continue as Admin</span>
          </button>
          
          <button
            onClick={() => handleRoleSelect('government')}
            className="w-full flex items-center justify-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors"
          >
            <Building className="w-5 h-5" />
            <span>Continue as Government Official</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;