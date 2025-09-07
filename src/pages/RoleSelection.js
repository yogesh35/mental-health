import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Access mental health resources, assessments, and support',
      icon: '🎓',
      color: 'from-blue-500 to-purple-600',
      hoverColor: 'from-blue-600 to-purple-700',
      available: true,
      features: ['Mental health assessments', 'AI chatbot support', 'Resource library', 'Progress tracking']
    },
    {
      id: 'counselor',
      title: 'Counselor',
      description: 'Manage student sessions and provide professional support',
      icon: '👨‍⚕️',
      color: 'from-green-500 to-teal-600',
      hoverColor: 'from-green-600 to-teal-700',
      available: false,
      features: ['Student dashboard', 'Session management', 'Progress reports', 'Resource management']
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'System administration and analytics overview',
      icon: '⚙️',
      color: 'from-orange-500 to-red-600',
      hoverColor: 'from-orange-600 to-red-700',
      available: false,
      features: ['System analytics', 'User management', 'Content management', 'Reports & insights']
    }
  ];

  const handleRoleSelect = (role) => {
    if (role.available) {
      navigate('/auth');
    } else {
      // Show under development message
      alert(`${role.title} portal is under development. Coming soon! 🚧`);
    }
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
          {/* Header Section */}
          <div className="mb-16 animate-fade-in">
            <div className="text-6xl mb-6 animate-bounce">🧠💙✨</div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 mb-8 leading-tight tracking-tight">
              Choose Your Portal
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
              Select your role to access the appropriate mental health support portal
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {roles.map((role, index) => (
              <div
                key={role.id}
                className={`group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 transition-all duration-500 transform hover:scale-105 ${
                  role.available 
                    ? 'hover:bg-white/20 cursor-pointer hover:shadow-2xl hover:shadow-white/10' 
                    : 'opacity-75 cursor-not-allowed'
                }`}
                onClick={() => handleRoleSelect(role)}
              >
                {/* Availability Badge */}
                <div className="absolute top-4 right-4">
                  {role.available ? (
                    <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Available
                    </div>
                  ) : (
                    <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Coming Soon
                    </div>
                  )}
                </div>

                {/* Role Icon */}
                <div className="text-6xl mb-6 group-hover:animate-bounce transition-all duration-300">
                  {role.icon}
                </div>

                {/* Role Title */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                  {role.title}
                </h3>

                {/* Role Description */}
                <p className="text-white/80 mb-6 leading-relaxed">
                  {role.description}
                </p>

                {/* Features List */}
                <div className="space-y-2 mb-8">
                  {role.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-white/70 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:animate-pulse"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 ${
                    role.available
                      ? `bg-gradient-to-r ${role.color} hover:${role.hoverColor} text-white shadow-lg hover:shadow-xl transform hover:scale-105`
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                  disabled={!role.available}
                >
                  {role.available ? (
                    <span className="flex items-center justify-center space-x-2">
                      <span>Enter Portal</span>
                      <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>🚧</span>
                      <span>Under Development</span>
                    </span>
                  )}
                </button>

                {/* Hover Effect Overlay */}
                {role.available && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="group bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 flex items-center space-x-3"
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-center text-white/50 text-sm">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Secure authentication • Privacy-first approach • Student-focused design</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
