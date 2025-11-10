import React, { useState } from 'react';
import { User, Shield, Building } from 'lucide-react';
import { useApiService } from '../../services/api';
import toast from 'react-hot-toast';

const RoleSelectionModal = ({ isOpen, onRoleSelected }) => {
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [loading, setLoading] = useState(false);
  const apiService = useApiService();

  const roles = [
    {
      value: 'citizen',
      label: 'Citizen',
      icon: User,
      description: 'Report and track civic issues in your area',
      color: 'blue'
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: Shield,
      description: 'Review, assign and manage all complaints',
      color: 'green'
    },
    {
      value: 'official',
      label: 'Government Official',
      icon: Building,
      description: 'Handle complaints assigned to your department',
      color: 'purple'
    }
  ];

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await apiService.updateUserRole(selectedRole);
      toast.success('Profile created successfully!');
      onRoleSelected(selectedRole);
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Failed to save role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to Civic Connect!
          </h2>
          <p className="text-gray-600">
            Please select your role to continue
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;
            
            return (
              <button
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className={`w-full p-5 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    isSelected ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-7 h-7 ${
                      isSelected ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {role.label}
                    </h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          You can change your role later from your profile settings
        </p>
      </div>
    </div>
  );
};

export default RoleSelectionModal;

