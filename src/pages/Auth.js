import React, { useState, useEffect } from 'react';
import { SignUpOrInFlow } from '@descope/react-sdk';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const [error, setError] = useState(null);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setError('Authentication is taking too long to load. Please refresh the page.');
        setIsLoading(false);
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const onSuccess = (e) => {
    console.log('Authentication successful:', e);
    setIsLoading(false);
    navigate('/dashboard');
  };

  const onError = (err) => {
    console.error('Authentication error:', err);
    setError(err.message || 'Authentication failed. Please try again.');
    setIsLoading(false);
  };

  const onReady = () => {
    setIsLoading(false);
    console.log('Descope flow is ready');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Mental Health Support System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your personalized mental health dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          
          {isLoading && (
            <div className="mb-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-600">Loading authentication...</p>
            </div>
          )}
          
          <SignUpOrInFlow
            flowId="sign-up-or-in"
            onSuccess={onSuccess}
            onError={onError}
            onReady={onReady}
            theme="light"
            debug={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
