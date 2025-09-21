import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TemporaryAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = () => {
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 2000);
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
            Development Mode
          </h2>
          <p className="text-xl text-white/80 mb-2 leading-relaxed font-light">
            Temporary authentication bypass
          </p>
        </div>

        <div className="max-w-md mx-auto w-full px-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-8 border border-white/20 shadow-2xl">
            
            {/* Configuration Status */}
            <div className="mb-6 p-4 bg-yellow-500/20 backdrop-blur-sm rounded-2xl border border-yellow-400/30">
              <div className="flex items-start space-x-3">
                <span className="text-xl">⚠️</span>
                <div className="text-yellow-200">
                  <div className="font-semibold mb-1">Descope Configuration Issue</div>
                  <div className="text-sm">The authentication system needs configuration:</div>
                  <ul className="list-disc list-inside mt-2 text-xs space-y-1">
                    <li>Add localhost:3000 to allowed domains in Descope</li>
                    <li>Verify the 'sign-up-or-in' flow exists</li>
                    <li>Check project configuration</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Demo Login Button */}
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Continue with Demo Login</span>
                </>
              )}
            </button>

            <div className="mt-4 text-center text-white/60 text-sm">
              <p>This is a temporary solution for development</p>
            </div>

            {/* Configuration Details */}
            <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <span className="text-blue-400">🔧</span>
                <span>Configuration Details</span>
              </h4>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>Project ID:</span>
                  <span className="text-green-400">P32zc...EaQ (Updated)</span>
                </div>
                <div className="flex justify-between">
                  <span>Management Key:</span>
                  <span className="text-green-400">Present (Updated)</span>
                </div>
                <div className="flex justify-between">
                  <span>Flow ID:</span>
                  <span className="text-yellow-400">sign-up-or-in</span>
                </div>
                <div className="flex justify-between">
                  <span>Domain:</span>
                  <span className="text-yellow-400">localhost:3000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center mt-8 text-white/60 text-sm">
            <div className="mb-3">
              <p className="font-semibold text-white/80">To fix Descope authentication:</p>
            </div>
            <div className="text-left bg-white/5 rounded-2xl p-4">
              <ol className="list-decimal list-inside space-y-2">
                <li>Log into your Descope console</li>
                <li>Go to Project Settings → Domains</li>
                <li>Add "localhost:3000" to allowed domains</li>
                <li>Verify the "sign-up-or-in" flow exists</li>
                <li>Save and refresh this page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemporaryAuth;