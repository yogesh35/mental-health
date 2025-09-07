import React, { useEffect, useState } from 'react';
import { useSession, SignUpOrInFlow } from '@descope/react-sdk';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { isAuthenticated } = useSession();
  const navigate = useNavigate();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSuccess = () => {
    console.log('Authentication successful');
    navigate('/dashboard');
  };

  const onError = (error) => {
    console.error('Authentication error:', error);
    setShowFallback(true);
  };

  const handleFallbackLogin = () => {
    // For demo purposes, simulate successful login
    console.log('Demo login successful');
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to Mental Health Support System</h2>
        
        {!showFallback ? (
          <div>
            <SignUpOrInFlow
              onSuccess={onSuccess}
              onError={onError}
            />
            <button 
              onClick={() => setShowFallback(true)}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Use Demo Login
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Demo Mode - Click below to continue
            </p>
            <button 
              onClick={handleFallbackLogin}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
