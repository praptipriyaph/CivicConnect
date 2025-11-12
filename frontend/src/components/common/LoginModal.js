import React from "react";
import { User, Shield, Building } from "lucide-react";

const LoginModal = ({ isOpen, onClose, onLogin, purpose }) => {
  if (!isOpen) return null;

  const handleRoleSelect = (role) => {
    const userData = {
      citizen: { name: "John Citizen", role: "Citizen", id: 1 },
      admin: { name: "Admin User", role: "Admin", id: 2 },
      government: { name: "Gov Official", role: "Government", id: 3 },
    };

    onLogin(userData[role]);
  };

  const getLoginTitle = () => {
    switch (purpose) {
      case "/complaint-form":
      case "complaint-form":
        return "Login to Report Issue";
      case "/track-complaint":
      case "track-complaint":
        return "Login to Track Complaints";
      case "admin-login":
        return "Official Login";
      case "profile":
        return "Login to View Profile";
      default:
        return "Login Required";
    }
  };

  const getLoginDescription = () => {
    switch (purpose) {
      case "/complaint-form":
      case "complaint-form":
        return "Please login to submit your complaint";
      case "/track-complaint":
      case "track-complaint":
        return "Please login to track your complaints";
      case "admin-login":
        return "For government officials and administrators";
      case "profile":
        return "Please login to view your profile";
      default:
        return "Please select your role to continue";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {getLoginTitle()}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {getLoginDescription()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {purpose !== "admin-login" && (
              <button
                onClick={() => handleRoleSelect("citizen")}
                className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Continue as Citizen</span>
              </button>
            )}

            {purpose === "admin-login" && (
              <>
                <button
                  onClick={() => handleRoleSelect("admin")}
                  className="w-full flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  <Shield className="w-5 h-5" />
                  <span>Admin Login</span>
                </button>

                <button
                  onClick={() => handleRoleSelect("government")}
                  className="w-full flex items-center justify-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  <Building className="w-5 h-5" />
                  <span>Government Official Login</span>
                </button>
              </>
            )}
          </div>

          {purpose !== "admin-login" && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 text-center mb-4">
                Are you a government official?
              </p>
              <button
                onClick={() => handleRoleSelect("government")}
                className="w-full text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center space-x-1" // Added flex for icon
              >
                <Building className="w-4 h-4 mr-1" />
                <span>Login as Government Official</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
