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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center py-12 px-4 min-h-screen">
        <div className="text-center max-w-md mx-auto mb-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/role-selection')}
            className="group inline-flex items-center space-x-2 text-white/80 hover:text-white mb-8 transition-colors duration-300"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Role Selection</span>
          </button>

          {/* Header */}
          <div className="text-6xl mb-6 animate-bounce">🎓💙</div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 mb-4 leading-tight">
            Student Portal
          </h2>
          <p className="text-xl text-white/80 mb-2 leading-relaxed font-light">
            Welcome to your mental health support system
          </p>
          <p className="text-sm text-white/60 mb-8">
            Secure authentication • HIPAA compliant • Privacy-first approach
          </p>
        </div>

        <div className="max-w-md mx-auto w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            {error && (
              <div className="mb-6 p-4 text-sm text-red-200 bg-red-500/20 backdrop-blur-sm rounded-2xl border border-red-400/30 flex items-center space-x-3">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            {isLoading && (
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-blue-400"></div>
                </div>
                <p className="text-white/80 text-sm">Preparing secure authentication...</p>
                <div className="mt-3 flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            )}
            
            {/* Enhanced Descope Container */}
            <div className="descope-auth-container rounded-2xl overflow-hidden">
              <SignUpOrInFlow
                flowId="sign-up-or-in"
                onSuccess={onSuccess}
                onError={onError}
                onReady={onReady}
                theme="light"
                debug={false}
              />
            </div>

            {/* Security Features */}
            <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <span className="text-green-400">🔒</span>
                <span>Security Features</span>
              </h4>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>End-to-end encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Multi-factor authentication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>HIPAA compliant infrastructure</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-8 text-white/60 text-sm">
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></span>
                <span>Private</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></span>
                <span>Confidential</span>
              </div>
            </div>
            <p>Your mental health journey starts here. All data is encrypted and secure.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
