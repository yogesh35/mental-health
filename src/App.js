import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useSession } from '@descope/react-sdk';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import User from './pages/User';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSession();
  return isAuthenticated ? children : <Navigate to="/" />;
};

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/' && location.pathname !== '/auth';

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      {showNavbar ? (
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
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
          </Routes>
        </main>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
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
        </Routes>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider projectId="P320pek6bTCR9UDC2zhl4bIC9LJg">
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
