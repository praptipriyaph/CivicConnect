import React from 'react';
import { Link } from 'react-router-dom';
import { Building, User, Bell } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Header = ({ onNotificationClick, onProfileClick }) => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Side: Logo and Title */}
        <Link
          to="/"
          className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
        >
          <Building className="w-8 h-8" />
          <div className="text-left">
            <h1 className="text-xl font-bold">Civic Connect</h1>
            <p className="text-xs text-blue-200">Government Services</p>
          </div>
        </Link>

        {/* Right Side: Icons and User Actions */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            {/* Notifications Button */}
            <button
              onClick={onNotificationClick}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="hidden sm:inline">Notifications</span>
            </button>

            {/* Clerk User Button */}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </SignedIn>

          <SignedOut>
            {/* Sign In Button */}
            <SignInButton mode="modal">
              <button className="bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-md transition-colors flex items-center space-x-1 font-semibold">
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
