import React, { useState, useEffect } from 'react';
import { SignUpOrInFlow } from '@descope/react-sdk';
import { useNavigate } from 'react-router-dom';
import { useIsMobile, useIsIOS } from '../hooks/useDeviceDetection';

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();
  const isIOS = useIsIOS();

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setError('Authentication is taking too long to load. Please refresh the page.');
        setIsLoading(false);
      }
    }, 20000); // 20 second timeout for mobile

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

        <div className="max-w-md mx-auto w-full px-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-8 border border-white/20 shadow-2xl">
            {error && (
              <div className="mb-6 p-4 text-sm text-red-200 bg-red-500/20 backdrop-blur-sm rounded-2xl border border-red-400/30">
                <div className="flex items-start space-x-3">
                  <span className="text-xl">⚠️</span>
                  <div className="flex-1">
                    <p className="font-semibold mb-2">Authentication Error</p>
                    <p className="mb-3">{error}</p>
                    {isMobile && (
                      <div className="text-xs text-red-100 space-y-1">
                        <p className="font-medium">Mobile troubleshooting tips:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Try refreshing the page</li>
                          <li>Ensure cookies are enabled</li>
                          <li>Try opening in {isIOS ? 'Safari' : 'Chrome'} browser</li>
                          <li>Disable any ad blockers temporarily</li>
                          {isIOS && <li>Allow popups for this site in Safari settings</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-blue-400"></div>
                </div>
                <p className="text-white/80 text-sm">
                  {isMobile ? 'Loading mobile authentication...' : 'Preparing secure authentication...'}
                </p>
                {isMobile && (
                  <p className="text-white/60 text-xs mt-2">
                    {isIOS ? 'Optimizing for iOS Safari...' : 'Optimizing for mobile device...'}
                  </p>
                )}
                <div className="mt-3 flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            )}
            
            {/* Enhanced Descope Container */}
            <div className={`descope-auth-container rounded-2xl overflow-hidden w-full ${isMobile ? 'mobile-auth' : ''}`}>
              <SignUpOrInFlow
                flowId="sign-up-or-in"
                onSuccess={onSuccess}
                onError={onError}
                onReady={onReady}
                theme="light"
                debug={false}
                redirectUrl={`${window.location.origin}/dashboard`}
                validateOnBlur={!isMobile} // Disable blur validation on mobile
                tenant=""
                locale="en"
                // Mobile-optimized configuration
                client={{
                  autoFocusOnFirstInput: !isMobile, // Disable auto-focus on mobile
                  preventAutoComplete: false,
                  // Ensure iframe works on mobile
                  iframeProps: {
                    style: {
                      width: '100%',
                      height: 'auto',
                      minHeight: isMobile ? '450px' : '400px',
                      border: 'none',
                      borderRadius: '16px',
                      ...(isIOS && {
                        // iOS-specific fixes
                        WebkitTransform: 'translate3d(0, 0, 0)',
                        transform: 'translate3d(0, 0, 0)',
                        WebkitOverflowScrolling: 'touch'
                      })
                    },
                    sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals',
                    allow: 'camera; microphone; geolocation',
                    // Mobile-specific iframe attributes
                    ...(isMobile && {
                      scrolling: 'no',
                      frameBorder: '0'
                    })
                  }
                }}
                style={{
                  width: '100%',
                  minHeight: isMobile ? '450px' : '400px',
                  maxWidth: '100%'
                }}
                // Additional mobile optimizations
                onMount={() => {
                  if (isMobile) {
                    // Prevent zoom on input focus for iOS
                    const metaViewport = document.querySelector('meta[name=viewport]');
                    if (metaViewport && isIOS) {
                      metaViewport.setAttribute('content', 
                        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
                      );
                    }
                  }
                }}
              />
            </div>

            {/* Mobile Troubleshooting Section */}
            {isMobile && (
              <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                  <span className="text-blue-400">📱</span>
                  <span>Mobile Authentication</span>
                </h4>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Optimized for {isIOS ? 'iOS Safari' : 'mobile browsers'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Touch-friendly interface</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Auto-zoom prevention enabled</span>
                  </div>
                </div>
                
                {/* Fallback button for severe mobile issues */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/60 mb-3">
                    Having trouble? Try the direct authentication link:
                  </p>
                  <button
                    onClick={() => {
                      const authUrl = `https://auth.descope.io/login?projectId=${process.env.REACT_APP_DESCOPE_PROJECT_ID}&flowId=sign-up-or-in&redirectUrl=${encodeURIComponent(window.location.origin + '/dashboard')}`;
                      window.open(authUrl, '_self');
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
                  >
                    Open Direct Login 🔗
                  </button>
                </div>
              </div>
            )}

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
