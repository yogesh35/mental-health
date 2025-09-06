import React from 'react';
import { useDescope, useUser } from '@descope/react-sdk';
import { Link } from 'react-router-dom';

const Header = () => {
  const { logout } = useDescope();
  const { user } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <h1>Photo Gallery</h1>
      <nav className="nav-links">
        <Link to="/dashboard" className="nav-link">Gallery</Link>
        <Link to="/users" className="nav-link">Users</Link>
        <span className="nav-link">Hello, {user?.name || user?.email || 'User'}</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
