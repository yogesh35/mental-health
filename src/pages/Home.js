import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/role-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center py-12 px-4 min-h-screen">
        <div className="text-center max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12 animate-fade-in">
            <div className="text-7xl mb-6 animate-bounce">🧠💙✨</div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 mb-8 leading-tight tracking-tight">
              Digital Mental Health
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-8">
              & Psychological Support System
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
              Comprehensive mental health support designed specifically for students in higher education. 
              Access stress assessments, counseling resources, AI assistance, and professional support - all in one secure platform.
            </p>
          </div>
          
          {/* Call to Action */}
          <div className="flex flex-col items-center space-y-8 mb-16">
            <button
              onClick={handleSignUp}
              className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-5 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 flex items-center space-x-3 border-2 border-white/20"
            >
              <span className="text-2xl group-hover:animate-bounce">🔐</span>
              <span>Start Your Mental Health Journey</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </button>
            
            <div className="flex items-center space-x-6 text-white/70 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Secure Portal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                <span>Confidential Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-500"></div>
                <span>24/7 Available</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:rotate-1">
              <div className="text-4xl mb-4 group-hover:animate-bounce">📊</div>
              <h3 className="text-xl font-bold mb-3 text-blue-200">Stress Assessment</h3>
              <p className="text-white/80 leading-relaxed">Take validated mental health assessments and receive personalized recommendations</p>
              <div className="mt-4 w-full bg-white/20 rounded-full h-1">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-1 rounded-full w-3/4"></div>
              </div>
            </div>
            
            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-rotate-1">
              <div className="text-4xl mb-4 group-hover:animate-spin">🤖</div>
              <h3 className="text-xl font-bold mb-3 text-purple-200">AI Support</h3>
              <p className="text-white/80 leading-relaxed">24/7 AI-powered mental health assistant for immediate guidance and support</p>
              <div className="mt-4 w-full bg-white/20 rounded-full h-1">
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-1 rounded-full w-4/5"></div>
              </div>
            </div>
            
            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:rotate-1">
              <div className="text-4xl mb-4 group-hover:animate-pulse">👥</div>
              <h3 className="text-xl font-bold mb-3 text-pink-200">Counseling</h3>
              <p className="text-white/80 leading-relaxed">Connect with qualified mental health professionals for personalized support</p>
              <div className="mt-4 w-full bg-white/20 rounded-full h-1">
                <div className="bg-gradient-to-r from-pink-400 to-pink-600 h-1 rounded-full w-4/5"></div>
              </div>
            </div>
            
            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-rotate-1">
              <div className="text-4xl mb-4 group-hover:animate-bounce">📚</div>
              <h3 className="text-xl font-bold mb-3 text-green-200">Resources</h3>
              <p className="text-white/80 leading-relaxed">Access curated mental health resources, guides, and educational materials</p>
              <div className="mt-4 w-full bg-white/20 rounded-full h-1">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-1 rounded-full w-3/5"></div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-4xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Supporting Student Mental Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-300 mb-2">24/7</div>
                <div className="text-white/80">Available Support</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-300 mb-2">100%</div>
                <div className="text-white/80">Confidential</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-300 mb-2">∞</div>
                <div className="text-white/80">Resources Available</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-white/50 text-sm">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Secure authentication powered by Descope</span>
          </div>
          <div>HIPAA-compliant platform • Privacy-first approach • Student-focused design</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
