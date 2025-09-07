import React, { useState, useEffect } from 'react';
import { useUser } from '@descope/react-sdk';

const User = () => {
  const { user } = useUser();
  const [stressTestHistory, setStressTestHistory] = useState([]);
  const [profileData, setProfileData] = useState({
    studentId: '',
    program: '',
    year: '',
    emergencyContact: '',
    preferences: {
      notifications: true,
      reminders: true,
      anonymousData: false
    }
  });

  useEffect(() => {
    const loadUserData = () => {
      try {
        // Load student profile from localStorage
        const savedProfile = localStorage.getItem('studentProfile');
        if (savedProfile) {
          setProfileData(prevData => ({
            ...prevData,
            ...JSON.parse(savedProfile)
          }));
        }

        // Load stress test history from localStorage
        const savedHistory = localStorage.getItem('stressTestHistory');
        if (savedHistory) {
          setStressTestHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    if (user?.userId) {
      loadUserData();
    }
  }, [user]);

  const handleProfileUpdate = (field, value) => {
    const updatedProfile = { ...profileData, [field]: value };
    setProfileData(updatedProfile);
    
    // Save to localStorage
    localStorage.setItem('studentProfile', JSON.stringify(updatedProfile));
  };

  const handlePreferenceChange = (preference, value) => {
    const updatedPreferences = { ...profileData.preferences, [preference]: value };
    const updatedProfile = { ...profileData, preferences: updatedPreferences };
    setProfileData(updatedProfile);
    
    // Save to localStorage
    localStorage.setItem('studentProfile', JSON.stringify(updatedProfile));
  };

  const getStressLevel = (score) => {
    if (score <= 5) return { level: 'Low', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' };
    if (score <= 7) return { level: 'Moderate', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
    return { level: 'High', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Student Profile & Health Records
        </h1>
        <p className="text-lg text-gray-600">
          Manage your personal information and view your mental health assessment history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">👤</span>
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={user?.name || user?.givenName || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Managed by your authentication provider</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Managed by your authentication provider</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input
                  type="text"
                  value={profileData.studentId}
                  onChange={(e) => handleProfileUpdate('studentId', e.target.value)}
                  placeholder="Enter your student ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Program</label>
                <select
                  value={profileData.program}
                  onChange={(e) => handleProfileUpdate('program', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your program</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Business Administration">Business Administration</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                <select
                  value={profileData.year}
                  onChange={(e) => handleProfileUpdate('year', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate">Graduate</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={profileData.emergencyContact}
                  onChange={(e) => handleProfileUpdate('emergencyContact', e.target.value)}
                  placeholder="Name and phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Privacy & Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">⚙️</span>
              Privacy & Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive reminders and updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.notifications}
                    onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Assessment Reminders</h3>
                  <p className="text-sm text-gray-500">Get reminders to take regular mental health assessments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.reminders}
                    onChange={(e) => handlePreferenceChange('reminders', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Anonymous Data Sharing</h3>
                  <p className="text-sm text-gray-500">Help improve mental health services with anonymous data</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.anonymousData}
                    onChange={(e) => handlePreferenceChange('anonymousData', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Mental Health History */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">📊</span>
              Mental Health Summary
            </h2>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stressTestHistory.length}</div>
                <div className="text-sm text-gray-600">Assessments Completed</div>
              </div>
              
              {stressTestHistory.length > 0 && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Last Assessment</div>
                  <div className="font-medium text-gray-900">
                    {formatDate(stressTestHistory[stressTestHistory.length - 1].date)}
                  </div>
                  <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStressLevel(stressTestHistory[stressTestHistory.length - 1].score).bgColor} ${getStressLevel(stressTestHistory[stressTestHistory.length - 1].score).textColor}`}>
                    {getStressLevel(stressTestHistory[stressTestHistory.length - 1].score).level} Stress
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assessment History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">📈</span>
              Assessment History
            </h2>
            
            {stressTestHistory.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stressTestHistory.slice().reverse().map((test, index) => {
                  const stressLevel = getStressLevel(test.score);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(test.date)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Score: {test.score}/9
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${stressLevel.bgColor} ${stressLevel.textColor}`}>
                        {stressLevel.level}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-sm">No assessments taken yet</p>
                <p className="text-xs">Take your first mental health assessment to see your history here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
