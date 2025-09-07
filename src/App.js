import React, { memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useSession } from '@descope/react-sdk';
import Home from './pages/Home';
import Auth from './pages/Auth';
import RoleSelection from './pages/RoleSelection';
import Dashboard from './pages/Dashboard';
import User from './pages/User';
import TestPage from './pages/TestPage';
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
  const projectId = process.env.REACT_APP_DESCOPE_PROJECT_ID;
  
  if (!projectId) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4">Configuration Error</h2>
          <p className="text-gray-700">
            Missing Descope Project ID. Please check your environment configuration.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Check the console for detailed configuration status.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider 
      projectId={projectId}
      persistTokens={true}
      autoRefresh={true}
      theme="light"
      locale="en"
    >
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
