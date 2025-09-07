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
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to Your Mental Health Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Hello, {user?.name || user?.email?.split('@')[0] || 'Student'}! Here's your mental health overview and available resources.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Last Stress Assessment</h3>
              {testStatus ? (
                <div className="mt-2">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    testStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                    testStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {testStatus.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{testStatus.message}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No assessment taken yet</p>
              )}
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Next Appointment</h3>
              <p className="text-sm text-gray-600 mt-2">
                {appointmentBooked ? "Scheduled for next week" : "No upcoming appointments"}
              </p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-600 mt-2">Available 24/7 for support</p>
            </div>
            <div className="text-3xl">🤖</div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Stress Assessment */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-xl font-bold mb-2">Mental Health Assessment</h3>
          <p className="text-blue-100 mb-4">Take a quick stress and wellbeing assessment to understand your current mental state</p>
          <button
            onClick={() => navigate('/mental-health-test')}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            Take Assessment
          </button>
        </div>

        {/* Counseling Appointment */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-bold mb-2">Book Counseling Session</h3>
          <p className="text-green-100 mb-4">Schedule a one-on-one session with our qualified mental health professionals</p>
          <button
            onClick={async () => {
              try {
                const appointmentData = {
                  type: 'counseling',
                  requestedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
                  reason: 'General mental health consultation',
                  priority: 'normal'
                };
                
                // Save appointment to localStorage
                const appointments = JSON.parse(localStorage.getItem('bookedAppointments') || '[]');
                appointments.push(appointmentData);
                localStorage.setItem('bookedAppointments', JSON.stringify(appointments));
                
                setAppointmentBooked(true);
                alert('Appointment request submitted successfully! You will receive a confirmation email soon.');
              } catch (error) {
                console.error('Error booking appointment:', error);
                alert('Error booking appointment. Please try again.');
              }
            }}
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            Book Appointment
          </button>
        </div>

        {/* AI Chatbot */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2">AI Mental Health Assistant</h3>
          <p className="text-purple-100 mb-4">Get immediate support and guidance from our AI-powered mental health assistant</p>
          <button
            onClick={() => navigate('/chatbot')}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            Chat Now
          </button>
        </div>
      </div>

      {/* Resources Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mental Health Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{resource.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {resource.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                  <button
                    onClick={() => alert('Resource would open here. This is a demo.')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Access Resource →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Support */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🚨</div>
          <div>
            <h3 className="text-lg font-semibold text-red-800">Need Immediate Help?</h3>
            <p className="text-red-700 text-sm">
              If you're experiencing a mental health emergency, please contact:
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <p className="text-red-800 font-medium">• Campus Crisis Hotline: (555) 123-4567</p>
              <p className="text-red-800 font-medium">• National Suicide Prevention Lifeline: 988</p>
              <p className="text-red-800 font-medium">• Emergency Services: 911</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
