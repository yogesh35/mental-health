import React, { useState, useEffect } from 'react';
import { useUser } from '@descope/react-sdk';
import { useNavigate } from 'react-router-dom';
import { getRecommendations } from '../services/recommendationService';

const User = () => {
  const { user } = useUser();
  const navigate = useNavigate();
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

  const getStressLevel = (score, maxScore = 27, type = 'PHQ9') => {
    // Calculate percentage based on assessment type
    let percentage = (score / maxScore) * 100;
    
    // Determine level based on assessment type and score
    if (type === 'PHQ9') {
      // PHQ-9 scoring: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe
      if (score <= 4) return { level: 'Minimal', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      if (score <= 9) return { level: 'Mild', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
      if (score <= 14) return { level: 'Moderate', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800' };
      if (score <= 19) return { level: 'Moderately Severe', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' };
      return { level: 'Severe', color: 'red', bgColor: 'bg-red-200', textColor: 'text-red-900' };
    } else if (type === 'GAD7') {
      // GAD-7 scoring: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe
      if (score <= 4) return { level: 'Minimal', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      if (score <= 9) return { level: 'Mild', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
      if (score <= 14) return { level: 'Moderate', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800' };
      return { level: 'Severe', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' };
    } else if (type === 'GHQ12') {
      // GHQ-12 scoring: 0-11 no distress, 12-15 mild, 16-20 moderate, 21+ severe
      if (score <= 11) return { level: 'No Distress', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      if (score <= 15) return { level: 'Mild', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
      if (score <= 20) return { level: 'Moderate', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800' };
      return { level: 'Severe', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' };
    }
    
    // Fallback for unknown types
    if (percentage <= 20) return { level: 'Low', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' };
    if (percentage <= 60) return { level: 'Moderate', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Student Profile & Health Records
            </h1>
            <div className="absolute -top-4 -right-4 text-3xl animate-bounce">👤</div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your personal information and track your mental wellness journey 🌱
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Profile Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information with Enhanced Design */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 p-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-2xl">👤</span>
                </div>
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={user?.name || user?.givenName || ''}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium"
                    />
                    <div className="absolute right-3 top-3 text-gray-400">🔒</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Securely managed by your authentication provider
                  </p>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium"
                    />
                    <div className="absolute right-3 top-3 text-gray-400">🔒</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Securely managed by your authentication provider
                  </p>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">Student ID</label>
                  <input
                    type="text"
                    value={profileData.studentId}
                    onChange={(e) => handleProfileUpdate('studentId', e.target.value)}
                    placeholder="Enter your student ID"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all group-hover:border-blue-300"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">Academic Program</label>
                  <select
                    value={profileData.program}
                    onChange={(e) => handleProfileUpdate('program', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all group-hover:border-blue-300 bg-white"
                  >
                    <option value="">Select your program</option>
                    <option value="Computer Science">🖥️ Computer Science</option>
                    <option value="Psychology">🧠 Psychology</option>
                    <option value="Business Administration">💼 Business Administration</option>
                    <option value="Engineering">⚙️ Engineering</option>
                    <option value="Medicine">🏥 Medicine</option>
                    <option value="Education">📚 Education</option>
                    <option value="Other">📋 Other</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">Academic Year</label>
                  <select
                    value={profileData.year}
                    onChange={(e) => handleProfileUpdate('year', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all group-hover:border-blue-300 bg-white"
                  >
                    <option value="">Select year</option>
                    <option value="1st Year">📖 1st Year</option>
                    <option value="2nd Year">📘 2nd Year</option>
                    <option value="3rd Year">📙 3rd Year</option>
                    <option value="4th Year">📗 4th Year</option>
                    <option value="Graduate">🎓 Graduate</option>
                    <option value="PhD">🔬 PhD</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">Emergency Contact</label>
                  <input
                    type="text"
                    value={profileData.emergencyContact}
                    onChange={(e) => handleProfileUpdate('emergencyContact', e.target.value)}
                    placeholder="Name and phone number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all group-hover:border-blue-300"
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Privacy & Preferences */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 p-8 border border-purple-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-2xl">⚙️</span>
                </div>
                Privacy & Preferences
              </h2>
              
              <div className="space-y-6">
                <div className="group p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">📧</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive reminders and updates via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.notifications}
                        onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-lg"></div>
                    </label>
                  </div>
                </div>

                <div className="group p-4 rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">⏰</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">Assessment Reminders</h3>
                        <p className="text-sm text-gray-600">Get reminders to take regular mental health assessments</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.reminders}
                        onChange={(e) => handlePreferenceChange('reminders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600 shadow-lg"></div>
                    </label>
                  </div>
                </div>

                <div className="group p-4 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">🔒</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Anonymous Data Sharing</h3>
                        <p className="text-sm text-gray-600">Help improve mental health services with anonymous data</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.anonymousData}
                        onChange={(e) => handlePreferenceChange('anonymousData', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600 shadow-lg"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Mental Health History */}
          <div className="space-y-8">
            {/* Enhanced Quick Stats */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 p-8 border border-green-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-2xl">📊</span>
                </div>
                Mental Health Summary
              </h2>
              
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stressTestHistory.length}</div>
                  <div className="text-sm text-gray-700 font-semibold">Assessments Completed</div>
                  <div className="mt-2">
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{width: `${Math.min((stressTestHistory.length / 10) * 100, 100)}%`}}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">Keep tracking your progress! 🌟</p>
                  </div>
                </div>
                
                {stressTestHistory.length > 0 && (
                  <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                    <div className="text-sm text-gray-600 font-semibold mb-2">Last Assessment</div>
                    <div className="text-lg font-bold text-gray-900 mb-2">
                      {formatDate(stressTestHistory[stressTestHistory.length - 1].date)}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {stressTestHistory[stressTestHistory.length - 1].type} Assessment
                    </div>
                    <div className={`inline-flex px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getStressLevel(
                      stressTestHistory[stressTestHistory.length - 1].score,
                      stressTestHistory[stressTestHistory.length - 1].maxScore,
                      stressTestHistory[stressTestHistory.length - 1].type
                    ).bgColor} ${getStressLevel(
                      stressTestHistory[stressTestHistory.length - 1].score,
                      stressTestHistory[stressTestHistory.length - 1].maxScore,
                      stressTestHistory[stressTestHistory.length - 1].type
                    ).textColor}`}>
                      {getStressLevel(
                        stressTestHistory[stressTestHistory.length - 1].score,
                        stressTestHistory[stressTestHistory.length - 1].maxScore,
                        stressTestHistory[stressTestHistory.length - 1].type
                      ).level}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Assessment History */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 p-8 border border-pink-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-2xl">📈</span>
                </div>
                Assessment History
              </h2>
              
              {stressTestHistory.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {stressTestHistory.slice().reverse().map((test, index) => {
                    const stressLevel = getStressLevel(test.score, test.maxScore, test.type);
                    return (
                      <div key={index} className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {test.type === 'PHQ9' ? '🧠' : test.type === 'GAD7' ? '�' : '🌟'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {test.type} Assessment
                            </div>
                            <div className="text-xs text-gray-500 font-semibold">
                              {formatDate(test.date)}
                            </div>
                            <div className="text-xs text-gray-400">
                              Score: {test.score}/{test.maxScore}
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${stressLevel.bgColor} ${stressLevel.textColor}`}>
                          {stressLevel.level}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4 animate-pulse">📋</div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">No assessments yet</h3>
                  <p className="text-sm text-gray-600 mb-4">Take your first mental health assessment to start tracking your wellness journey</p>
                  <button 
                    onClick={() => navigate('/assessments')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Take First Assessment 🚀
                  </button>
                </div>
              )}
            </div>

            {/* Personalized Recommendations */}
            {stressTestHistory.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 p-8 border border-green-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-2xl">💡</span>
                  </div>
                  Personalized Recommendations
                </h2>
                
                {(() => {
                  const latestAssessment = stressTestHistory[stressTestHistory.length - 1];
                  const stressLevel = getStressLevel(latestAssessment.score, latestAssessment.maxScore, latestAssessment.type);
                  const recommendations = getRecommendations(latestAssessment.type, latestAssessment.score, stressLevel.level.toLowerCase());
                  
                  // Safety check to ensure recommendations has the proper structure
                  if (!recommendations || !recommendations.recommendations) {
                    return (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">⚠️</div>
                        <p className="text-gray-600">Unable to load recommendations at this time.</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-6">
                      {/* Current Status */}
                      <div className={`p-4 rounded-2xl border-2 ${stressLevel.bgColor} ${stressLevel.textColor} border-opacity-50`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium opacity-90">Current Stress Level</p>
                            <p className="text-xl font-bold">{stressLevel.level}</p>
                          </div>
                          <div className="text-3xl">
                            {stressLevel.level === 'Low' ? '🌱' : 
                             stressLevel.level === 'Medium' ? '⚠️' : '🚨'}
                          </div>
                        </div>
                      </div>

                      {/* General Recommendations */}
                      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                          <span className="text-xl mr-2">{recommendations.icon}</span>
                          {recommendations.title}
                        </h3>
                        <p className="text-blue-800 mb-4">{recommendations.subtitle}</p>
                        
                        {recommendations.recommendations && recommendations.recommendations.map((category, index) => (
                          <div key={index} className="mb-4">
                            <h4 className="font-bold text-blue-900 mb-2">{category.category}</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {category.items && category.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="bg-white p-3 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300">
                                  <p className="text-sm text-gray-700">{item}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Assessment-Specific Recommendations */}
                      {recommendations.specificRecommendations && recommendations.specificRecommendations.length > 0 && (
                        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
                          <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                            <span className="text-xl mr-2">�</span>
                            Assessment-Specific Guidance
                          </h3>
                          <div className="space-y-2">
                            {recommendations.specificRecommendations.map((recommendation, index) => (
                              <div key={index} className="bg-white p-3 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-300">
                                <p className="text-sm text-gray-700">{recommendation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Next Steps */}
                      {recommendations.nextSteps && recommendations.nextSteps.length > 0 && (
                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                          <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center">
                            <span className="text-xl mr-2">📋</span>
                            Next Steps & Follow-up
                          </h3>
                          <div className="space-y-3">
                            {recommendations.nextSteps.map((step, index) => (
                              <div key={index} className="bg-white p-4 rounded-xl border border-amber-100 hover:shadow-md transition-all duration-300">
                                <div className="flex items-start space-x-3">
                                  <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-700">{step}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-up Timeline */}
                      {recommendations.followUpTimeline && (
                        <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                          <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                            <span className="text-xl mr-2">📅</span>
                            Follow-up Schedule
                          </h3>
                          <div className="bg-white p-4 rounded-xl border border-green-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-sm text-green-600 font-medium">Next Assessment</p>
                                <p className="font-bold text-green-800">{recommendations.followUpTimeline.nextAssessment}</p>
                              </div>
                              <div>
                                <p className="text-sm text-green-600 font-medium">Check-in</p>
                                <p className="font-bold text-green-800">{recommendations.followUpTimeline.checkIn}</p>
                              </div>
                              <div>
                                <p className="text-sm text-green-600 font-medium">Professional Follow-up</p>
                                <p className="font-bold text-green-800">{recommendations.followUpTimeline.professionalFollow}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
