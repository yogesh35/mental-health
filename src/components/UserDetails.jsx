import React, { useState, useEffect } from 'react';
import Header from './Header';
import { userService } from '../services/userService';

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const users = await userService.getAllUsers();
      setUsers(users);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="user-details">
        <Header />
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-details">
      <Header />
      
      <h2>Registered Users</h2>
      {error && (
        <div style={{ 
          background: '#fff3cd', 
          color: '#856404', 
          padding: '1rem', 
          borderRadius: '5px', 
          marginBottom: '1rem',
          border: '1px solid #ffeaa7'
        }}>
          {error}
        </div>
      )}
      
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.userId} className="user-card">
            <h3>{user.name || 'Anonymous User'}</h3>
            <div className="user-info">
              <div className="user-info-item">
                <span className="user-info-label">Email:</span>
                <span className="user-info-value">{user.email}</span>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">User ID:</span>
                <span className="user-info-value">{user.userId}</span>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">Status:</span>
                <span className={`status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                  {user.status}
                </span>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">Created:</span>
                <span className="user-info-value">{formatDate(user.createdTime)}</span>
              </div>
              {user.lastLoginTime && (
                <div className="user-info-item">
                  <span className="user-info-label">Last Login:</span>
                  <span className="user-info-value">{formatDate(user.lastLoginTime)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No users found.</p>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
