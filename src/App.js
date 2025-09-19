import React, { memo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useSession } from '@descope/react-sdk';
import { getDescopeConfig, logDescopeStatus } from './config/descopeConfig';
import { runDescopeDiagnostics } from './utils/descopeDiagnostics';
import Home from './pages/Home';
import Auth from './pages/Auth';
import RoleSelection from './pages/RoleSelection';
import Dashboard from './pages/Dashboard';
import User from './pages/User';
import TestPage from './pages/TestPage';
import MentalHealthAssessments from './pages/MentalHealthAssessments';
import CounselorDashboard from './pages/CounselorDashboard';
import ChatBot from './ChatBot';
import Navbar from './components/Navbar';
import './styles/enhanced-ui.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSession();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const AppContent = memo(() => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/' && location.pathname !== '/auth' && location.pathname !== '/role-selection';

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      {showNavbar ? (
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user" 
              element={
                <ProtectedRoute>
                  <User />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mental-health-test" 
              element={
                <ProtectedRoute>
                  <TestPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assessments" 
              element={
                <ProtectedRoute>
                  <MentalHealthAssessments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counselor-dashboard" 
              element={
                <ProtectedRoute>
                  <CounselorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chatbot" 
              element={
                <ProtectedRoute>
                  <ChatBot />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user" 
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mental-health-test" 
            element={
              <ProtectedRoute>
                <TestPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assessments" 
            element={
              <ProtectedRoute>
                <MentalHealthAssessments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/counselor-dashboard" 
            element={
              <ProtectedRoute>
                <CounselorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chatbot" 
            element={
              <ProtectedRoute>
                <ChatBot />
              </ProtectedRoute>
            } 
          />
        </Routes>
      )}
    </div>
  );
});

function App() {
  const descopeConfig = getDescopeConfig();
  
  // Log configuration status and run diagnostics
  useEffect(() => {
    logDescopeStatus();
    
    // Run comprehensive diagnostics
    if (typeof window !== 'undefined') {
      console.log('🚀 Mental Health Support System - Authentication Diagnostics');
      setTimeout(() => {
        runDescopeDiagnostics();
      }, 2000);
    }
  }, []);
  
  if (!descopeConfig.projectId) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4">Configuration Error</h2>
          <p className="text-gray-700">
            Missing Descope Project ID. Please check your environment configuration.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Environment: {descopeConfig.isProduction ? 'Production' : 'Development'}
          </p>
          <p className="text-sm text-gray-500">
            Domain: {typeof window !== 'undefined' ? window.location.origin : 'Unknown'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider 
      projectId={descopeConfig.projectId}
      persistTokens={true}
      autoRefresh={true}
      theme="light"
      locale="en"
      sessionTokenViaCookie={descopeConfig.sessionConfig.sessionTokenViaCookie}
      cookieSameSite={descopeConfig.sessionConfig.cookieSameSite}
      cookieSecure={descopeConfig.sessionConfig.cookieSecure}
      redirectUrl={descopeConfig.redirectUri}
    >
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
