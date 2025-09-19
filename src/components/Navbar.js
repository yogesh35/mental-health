import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSession, useDescope, useUser } from '@descope/react-sdk';

const Navbar = memo(() => {
  const { isAuthenticated } = useSession();
  const { logout } = useDescope();
  const { user } = useUser();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <span className="text-2xl">🧠</span>
              <span>Mental Health Support</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                >
                  <span>🏠</span>
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/user" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                >
                  <span>👤</span>
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/assessments" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                >
                  <span>📋</span>
                  <span>Assessments</span>
                </Link>
                <Link 
                  to="/chatbot" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                >
                  <span>🤖</span>
                  <span>AI Support</span>
                </Link>
                <span className="text-gray-600 text-sm">
                  Hello, {user?.name || user?.email || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
