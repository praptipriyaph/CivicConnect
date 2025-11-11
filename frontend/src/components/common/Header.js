import React from 'react';
import { Link } from 'react-router-dom';
import { Building, User, Bell } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Header = ({ onProfileClick }) => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-[9999]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
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

        <div className="flex items-center space-x-4">
          <SignedIn>

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
