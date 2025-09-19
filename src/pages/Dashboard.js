import React, { useState, useEffect } from 'react';
import { useUser } from '@descope/react-sdk';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [lastTestResult, setLastTestResult] = useState(null);
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = () => {
    try {
      // Load latest test result from localStorage
      const savedResult = localStorage.getItem('lastStressTestResult');
      if (savedResult) {
        setLastTestResult(JSON.parse(savedResult));
      }

      // Check for booked appointments in localStorage
      const appointments = localStorage.getItem('bookedAppointments');
      if (appointments) {
        const appointmentList = JSON.parse(appointments);
        setAppointmentBooked(appointmentList.length > 0);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const resources = [
    {
      id: 1,
      title: "Managing Academic Stress",
      type: "PDF Guide",
      description: "Comprehensive guide to handling academic pressure and deadlines",
      icon: "📚",
      url: "#"
    },
    {
      id: 2,
      title: "Mindfulness Meditation for Students",
      type: "Video Series",
      description: "10-minute daily meditation practices designed for busy students",
      icon: "🧘‍♀️",
      url: "#"
    },
    {
      id: 3,
      title: "Sleep Hygiene for Better Mental Health",
      type: "Article",
      description: "Evidence-based tips for improving sleep quality and mental wellbeing",
      icon: "😴",
      url: "#"
    },
    {
      id: 4,
      title: "Building Resilience in College",
      type: "Webinar",
      description: "Interactive session on developing coping strategies and resilience",
      icon: "💪",
      url: "#"
    }
  ];

  const getTestResultStatus = (score) => {
    if (!score) return null;
    if (score <= 5) return { status: "Good", color: "green", message: "You're doing well!" };
    if (score <= 7) return { status: "Moderate", color: "yellow", message: "Some stress detected" };
    return { status: "High", color: "red", message: "Consider professional help" };
  };

  const testStatus = getTestResultStatus(lastTestResult?.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section with Enhanced Design */}
        <div className="mb-12 text-center">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Mental Health Dashboard
            </h1>
            <div className="absolute -top-4 -right-4 text-3xl animate-bounce">✨</div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome back, <span className="font-semibold text-blue-600">{user?.name || user?.email?.split('@')[0] || 'Student'}</span>! 
            Your mental wellness journey continues here. 🌱
          </p>
        </div>

        {/* Enhanced Quick Stats with Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-8 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl group-hover:animate-pulse">📊</div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">✓</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Last Assessment</h3>
            {testStatus ? (
              <div className="space-y-2">
                <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                  testStatus.color === 'green' ? 'bg-green-100 text-green-800 shadow-green-200' :
                  testStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 shadow-yellow-200' :
                  'bg-red-100 text-red-800 shadow-red-200'
                } shadow-lg`}>
                  {testStatus.status} Level
                </span>
                <p className="text-gray-600 font-medium">{testStatus.message}</p>
                <div className={`w-full bg-gray-200 rounded-full h-2 ${
                  testStatus.color === 'green' ? 'bg-green-200' :
                  testStatus.color === 'yellow' ? 'bg-yellow-200' : 'bg-red-200'
                }`}>
                  <div className={`h-2 rounded-full ${
                    testStatus.color === 'green' ? 'bg-green-500' :
                    testStatus.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} style={{width: `${Math.min((lastTestResult?.score || 0) * 10, 100)}%`}}></div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-500">No assessment taken yet</p>
                <button 
                  onClick={() => navigate('/assessments')}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center space-x-1"
                >
                  <span>Take your first assessment</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-8 border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl group-hover:animate-bounce">📅</div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{appointmentBooked ? '✓' : '+'}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Appointments</h3>
            <div className="space-y-2">
              <p className="text-gray-600 font-medium">
                {appointmentBooked ? "Next session scheduled" : "No upcoming appointments"}
              </p>
              {appointmentBooked ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-semibold">📞 Video session next week</p>
                  <p className="text-green-600 text-xs">Reminder will be sent 24hrs before</p>
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/book-appointment')}
                  className="text-green-600 hover:text-green-800 font-semibold text-sm flex items-center space-x-1"
                >
                  <span>Schedule consultation</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-8 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl group-hover:animate-pulse">🤖</div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Assistant</h3>
            <div className="space-y-2">
              <p className="text-gray-600 font-medium">Available 24/7 for support</p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-purple-800 text-sm font-semibold">Online now</p>
                </div>
                <p className="text-purple-600 text-xs">Ready to help with any concerns</p>
              </div>
              <button 
                onClick={() => navigate('/chatbot')}
                className="text-purple-600 hover:text-purple-800 font-semibold text-sm flex items-center space-x-1"
              >
                <span>Start conversation</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Main Actions with Better Visual Appeal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Stress Assessment with Enhanced Design */}
          <div className="group relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-6 group-hover:animate-bounce">🧠</div>
              <h3 className="text-2xl font-bold mb-3">Mental Health Assessments</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">Take evidence-based screening assessments (PHQ-9, GAD-7, GHQ-12) to understand your mental health and get personalized recommendations</p>
              <button
                onClick={() => navigate('/assessments')}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Take Assessments</span>
                <span className="text-lg">📝</span>
              </button>
            </div>
          </div>

          {/* Counseling with Enhanced Design */}
          <div className="group relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-6 group-hover:animate-bounce">👥</div>
              <h3 className="text-2xl font-bold mb-3">Professional Counseling</h3>
              <p className="text-green-100 mb-6 leading-relaxed">Schedule a confidential one-on-one session with our qualified mental health professionals for personalized support</p>
              <button
                onClick={async () => {
                  try {
                    const appointmentData = {
                      type: 'counseling',
                      requestedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                      reason: 'General mental health consultation',
                      priority: 'normal'
                    };
                    
                    const appointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
                    appointments.push(appointmentData);
                    localStorage.setItem('bookedAppointments', JSON.stringify(appointments));
                    
                    setAppointmentBooked(true);
                    alert('🎉 Appointment request submitted! You\'ll receive confirmation within 24 hours.');
                  } catch (error) {
                    console.error('Error booking appointment:', error);
                    alert('❌ Error booking appointment. Please try again.');
                  }
                }}
                className="bg-white text-green-600 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Book Session</span>
                <span className="text-lg">📞</span>
              </button>
            </div>
          </div>

          {/* AI Chatbot with Enhanced Design */}
          <div className="group relative bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-6 group-hover:animate-pulse">🤖</div>
              <h3 className="text-2xl font-bold mb-3">AI Mental Health Assistant</h3>
              <p className="text-purple-100 mb-6 leading-relaxed">Get immediate support and guidance from our AI-powered mental health assistant, available 24/7 whenever you need help</p>
              <button
                onClick={() => navigate('/chatbot')}
                className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Chat Now</span>
                <span className="text-lg">💬</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Resources Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Mental Health Resources 📚
            </h2>
            <p className="text-gray-600 text-lg">Curated resources to support your mental wellness journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((resource, index) => (
              <div key={resource.id} className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-8 border-l-4 ${
                index % 4 === 0 ? 'border-blue-500' :
                index % 4 === 1 ? 'border-green-500' :
                index % 4 === 2 ? 'border-purple-500' : 'border-pink-500'
              }`}>
                <div className="flex items-start space-x-6">
                  <div className="text-4xl group-hover:animate-bounce">{resource.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {resource.title}
                      </h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        index % 4 === 0 ? 'bg-blue-100 text-blue-800' :
                        index % 4 === 1 ? 'bg-green-100 text-green-800' :
                        index % 4 === 2 ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {resource.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">{resource.description}</p>
                    <button
                      onClick={() => alert('📖 Resource would open here. This is a demo showing the enhanced UI!')}
                      className={`font-semibold text-sm flex items-center space-x-2 ${
                        index % 4 === 0 ? 'text-blue-600 hover:text-blue-800' :
                        index % 4 === 1 ? 'text-green-600 hover:text-green-800' :
                        index % 4 === 2 ? 'text-purple-600 hover:text-purple-800' : 'text-pink-600 hover:text-pink-800'
                      } transition-colors group-hover:translate-x-2 transition-transform`}
                    >
                      <span>Access Resource</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Emergency Support */}
        <div className="bg-gradient-to-r from-red-50 via-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="text-4xl animate-pulse">🚨</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-red-800 mb-3">Need Immediate Help?</h3>
              <p className="text-red-700 mb-4 text-lg">
                If you're experiencing a mental health emergency, help is available immediately:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-red-200 shadow-md">
                  <p className="text-red-800 font-bold text-lg">📞 Campus Crisis</p>
                  <p className="text-red-600 font-semibold">(555) 123-4567</p>
                  <p className="text-red-500 text-sm">24/7 Student Support</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-200 shadow-md">
                  <p className="text-red-800 font-bold text-lg">🆘 Crisis Lifeline</p>
                  <p className="text-red-600 font-semibold">988</p>
                  <p className="text-red-500 text-sm">National Suicide Prevention</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-200 shadow-md">
                  <p className="text-red-800 font-bold text-lg">🚑 Emergency</p>
                  <p className="text-red-600 font-semibold">911</p>
                  <p className="text-red-500 text-sm">Immediate Emergency Services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
