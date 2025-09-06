import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex flex-col justify-center items-center py-12 px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-white mb-6">
          Photo Gallery
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Discover, organize, and share your amazing photos in a beautiful gallery. 
          Join thousands of users who trust us with their precious memories.
        </p>
        
        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={handleSignUp}
            className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get Started
          </button>
          
          <div className="text-white/80 text-sm">
            Already have an account? Click "Get Started" to sign in
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-white/60 text-sm">
        Secure authentication powered by Descope
      </div>
    </div>
  );
};

export default Home;
