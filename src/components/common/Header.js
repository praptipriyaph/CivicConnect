import React from 'react';
// Import Link for routing
import { Link } from 'react-router-dom';
import { Building, User, Bell, LogIn, LogOut } from 'lucide-react';

// Removed onHome prop
const Header = ({ user, onLogout, onLoginClick, onNotificationClick, onProfileClick }) => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-40"> {/* Added sticky positioning */}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Side: Logo and Title - Use Link */}
        <Link
          to="/" // Link to the home page route
          className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
        >
          <Building className="w-8 h-8" />
          <div className="text-left">
            <h1 className="text-xl font-bold">Civic Connect</h1>
            <p className="text-xs text-blue-200">Government Services</p>
          </div>
        </Link>

        {/* Right Side: Icons and User Info/Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Bell Icon (Logged In) - Toggles NotificationsPanel */}
              <button
                onClick={onNotificationClick} // Directly use the toggle function
                className="p-2 rounded-full hover:bg-blue-700 transition-colors relative" // Added relative for potential badge
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {/* Basic notification indicator example - can be enhanced */}
                {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400"></span> */}
              </button>

              {/* Profile Button (Logged In) - Toggles ProfileDropdown */}
              <button
                onClick={onProfileClick} // Directly use the toggle function
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition-colors"
                aria-label="User Profile"
              >
                <User className="w-5 h-5" />
                {/* Optionally hide name on smaller screens if needed */}
                <span className="hidden sm:inline">{user.name}</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors flex items-center space-x-1"
              >
                 <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* Bell Icon (Logged Out) - Prompts Login */}
               <button
                onClick={onNotificationClick} // Still uses the handler which will prompt login
                className="p-2 rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>

              {/* Profile Button (Logged Out) - Prompts Login */}
              <button
                onClick={onProfileClick} // Still uses the handler which will prompt login
                 className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition-colors"
                aria-label="User Profile"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </button>

              {/* Login Button */}
              <button
                onClick={onLoginClick}
                className="bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-md transition-colors flex items-center space-x-1 font-semibold"
              >
                 <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;