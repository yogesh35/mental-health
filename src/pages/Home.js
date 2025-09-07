import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex flex-col justify-center items-center py-12 px-4">
      <div className="text-center max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="text-6xl mb-4">🧠💙</div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Digital Mental Health & Psychological Support System
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Comprehensive mental health support designed specifically for students in higher education. 
            Access stress assessments, counseling resources, AI assistance, and professional support - all in one secure platform.
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={handleSignUp}
            className="bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
          >
            <span>🔐</span>
            <span>Sign Up / Log In</span>
          </button>
          
          <div className="text-white/80 text-sm">
            Secure student portal • Confidential support • Available 24/7
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">Stress Assessment</h3>
            <p className="text-sm text-white/80">Take validated mental health assessments and receive personalized recommendations</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold mb-2">AI Support</h3>
            <p className="text-sm text-white/80">24/7 AI-powered mental health assistant for immediate guidance and support</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-semibold mb-2">Counseling</h3>
            <p className="text-sm text-white/80">Book appointments with qualified mental health professionals</p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-white/60 text-sm">
        Secure authentication powered by Descope • HIPAA-compliant platform
      </div>
    </div>
  );
};

export default Home;
