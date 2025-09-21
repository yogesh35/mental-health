import React, { useState, useEffect } from 'react';
import { useSession } from '@descope/react-sdk';
import AssessmentForm from '../components/AssessmentForm';
import { CounselorAlertService } from '../services/counselorAlertService';
import { getRecommendations } from '../services/recommendationService';
import { assessmentTimeline } from '../services/assessmentTimelineService';

const MentalHealthAssessments = () => {
  // eslint-disable-next-line no-unused-vars
  const { sessionToken, user } = useSession();
  const [selectedTest, setSelectedTest] = useState(null);
  const [completedTests, setCompletedTests] = useState({});
  const [assessmentStatuses, setAssessmentStatuses] = useState({});
  const [recommendations, setRecommendations] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Load assessment statuses on component mount
  useEffect(() => {
    loadAssessmentStatuses();
  }, []);

  const loadAssessmentStatuses = () => {
    const statuses = assessmentTimeline.getAllAssessmentStatuses();
    setAssessmentStatuses(statuses);
  };

  const handleTestComplete = (result) => {
    // Get stress level from the result
    const stressLevel = getStressLevel(result.type, result.score);
    
    // Update completed tests
    setCompletedTests(prev => ({
      ...prev,
      [result.type]: result
    }));

    // Record assessment in timeline system
    const assessmentType = result.type.toLowerCase().replace('phq9', 'phq-9').replace('gad7', 'gad-7').replace('ghq12', 'ghq-12');
    assessmentTimeline.recordAssessmentTaken(assessmentType, result.score, stressLevel);

    // Generate personalized recommendations
    const userRecommendations = getRecommendations(assessmentType, result.score, stressLevel);
    setRecommendations(userRecommendations);
    setShowRecommendations(true);

    // Check if counselor alert is needed (high stress level)
    if (stressLevel === 'high' && user) {
      const counselorAlert = new CounselorAlertService();
      counselorAlert.generateAlert({
        studentId: user.email || user.loginId,
        assessmentType: result.type,
        score: result.score,
        stressLevel: stressLevel,
        timestamp: new Date().toISOString(),
        recommendations: userRecommendations
      });
    }

    // Save assessment result to localStorage for the User profile page
    try {
      const existingHistory = localStorage.getItem('stressTestHistory');
      let history = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Create a comprehensive assessment record
      const assessmentRecord = {
        id: result.timestamp,
        date: result.timestamp,
        type: result.type,
        score: result.score,
        maxScore: result.type === 'PHQ9' ? 27 : result.type === 'GAD7' ? 21 : 36,
        level: result.interpretation.level,
        description: result.interpretation.description,
        stressLevel: stressLevel,
        recommendations: userRecommendations,
        hasRecommendations: true
      };
      
      // Add the new assessment to history
      history.push(assessmentRecord);
      
      // Keep only the last 50 assessments to prevent localStorage from getting too large
      if (history.length > 50) {
        history = history.slice(-50);
      }
      
      // Save updated history to localStorage
      localStorage.setItem('stressTestHistory', JSON.stringify(history));
      
      console.log('Assessment saved with recommendations:', assessmentRecord);
    } catch (error) {
      console.error('Error saving assessment to localStorage:', error);
    }

    // Reload assessment statuses
    loadAssessmentStatuses();
  };

  const handleBackToSelection = () => {
    setSelectedTest(null);
    setShowRecommendations(false);
  };

  // Helper function to determine stress level based on assessment score
  const getStressLevel = (assessmentType, score) => {
    const thresholds = {
      'PHQ9': { low: 4, medium: 9 },
      'GAD7': { low: 4, medium: 9 },
      'GHQ12': { low: 11, medium: 15 }
    };

    const threshold = thresholds[assessmentType];
    if (!threshold) return 'medium';

    if (score <= threshold.low) return 'low';
    if (score <= threshold.medium) return 'medium';
    return 'high';
  };

  // Check if assessment can be taken
  const canTakeAssessment = (assessmentType) => {
    const typeMap = {
      'PHQ9': 'phq-9',
      'GAD7': 'gad-7', 
      'GHQ12': 'ghq-12'
    };
    const mappedType = typeMap[assessmentType];
    return assessmentTimeline.canTakeAssessment(mappedType);
  };

  // Get time remaining for assessment
  const getTimeRemaining = (assessmentType) => {
    const typeMap = {
      'PHQ9': 'phq-9',
      'GAD7': 'gad-7',
      'GHQ12': 'ghq-12'
    };
    const mappedType = typeMap[assessmentType];
    return assessmentTimeline.getTimeRemainingFormatted(mappedType);
  };

  const testCards = [
    {
      type: 'PHQ9',
      icon: '🧠',
      title: 'PHQ-9 Depression Screening',
      description: 'Assess symptoms of depression over the past 2 weeks',
      duration: '3-5 minutes',
      questions: '9 questions',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      type: 'GAD7',
      icon: '💭',
      title: 'GAD-7 Anxiety Screening',
      description: 'Evaluate anxiety and worry symptoms',
      duration: '2-4 minutes',
      questions: '7 questions',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      type: 'GHQ12',
      icon: '🌟',
      title: 'GHQ-12 General Health',
      description: 'Screen for general psychological distress',
      duration: '3-6 minutes',
      questions: '12 questions',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    }
  ];

  if (selectedTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackToSelection}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Assessment Selection
          </button>

          <AssessmentForm 
            type={selectedTest} 
            onComplete={handleTestComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Mental Health Screening Assessments
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Take these evidence-based screening tools to better understand your mental health. 
            These assessments can help identify areas where you might benefit from additional support.
          </p>
        </div>

        {/* Assessment Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testCards.map((test) => (
            <div
              key={test.type}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${test.color} p-6 text-white`}>
                <div className="text-4xl mb-3">{test.icon}</div>
                <h3 className="text-xl font-bold mb-2">{test.title}</h3>
                <p className="text-blue-100 text-sm">{test.description}</p>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {test.duration}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {test.questions}
                  </span>
                </div>

                {/* Assessment Status and Timeline */}
                {(() => {
                  const canTake = canTakeAssessment(test.type);
                  const timeRemaining = getTimeRemaining(test.type);
                  const status = assessmentStatuses[test.type.toLowerCase().replace('phq9', 'phq-9').replace('gad7', 'gad-7').replace('ghq12', 'ghq-12')];
                  
                  return (
                    <div className="mb-4">
                      {/* Last Assessment Info */}
                      {status?.lastTaken && (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 mb-1">
                            Last Assessment: {new Date(status.lastTaken).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-blue-600">
                            Score: {status.lastScore} | Level: {status.lastStressLevel}
                          </p>
                        </div>
                      )}

                      {/* Assessment Availability */}
                      {!canTake.allowed ? (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm font-medium text-amber-800 mb-1">
                            ⏰ Assessment Limit Reached
                          </p>
                          <p className="text-xs text-amber-600">
                            {timeRemaining.message}
                          </p>
                          <p className="text-xs text-amber-500 mt-1">
                            You can take each assessment once per week
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm font-medium text-green-800">
                            ✅ Available Now
                          </p>
                          <p className="text-xs text-green-600">
                            Ready to take this assessment
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {completedTests[test.type] && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Completed - Score: {completedTests[test.type].score}
                    </p>
                    <p className="text-xs text-green-600">
                      {completedTests[test.type].interpretation.level}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    const canTake = canTakeAssessment(test.type);
                    if (canTake.allowed) {
                      setSelectedTest(test.type);
                    }
                  }}
                  disabled={!canTakeAssessment(test.type).allowed}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform ${
                    canTakeAssessment(test.type).allowed
                      ? `bg-gradient-to-r ${test.color} ${test.hoverColor} text-white hover:scale-105`
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {!canTakeAssessment(test.type).allowed 
                    ? 'Assessment Unavailable' 
                    : completedTests[test.type] 
                      ? 'Retake Assessment' 
                      : 'Start Assessment'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Results Summary */}
        {Object.keys(completedTests).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Assessment Results</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(completedTests).map(([testType, result]) => {
                const testInfo = testCards.find(t => t.type === testType);
                return (
                  <div
                    key={testType}
                    className={`rounded-lg border-2 p-4 ${result.interpretation.borderColor} ${result.interpretation.bgColor}`}
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{testInfo?.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">{testInfo?.title}</h3>
                        <p className="text-sm text-gray-600">Score: {result.score}</p>
                      </div>
                    </div>
                    <p className={`font-medium ${result.interpretation.color}`}>
                      {result.interpretation.level}: {result.interpretation.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {Object.keys(completedTests).length === 3 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">All Assessments Complete!</h3>
                <p className="text-blue-700 text-sm">
                  You've completed all three screening assessments. Consider discussing these results with a mental health professional for personalized guidance.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Personalized Recommendations */}
        {recommendations && showRecommendations && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">{recommendations.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-800" style={{color: recommendations.color}}>
                  {recommendations.title}
                </h2>
                <p className="text-gray-600">{recommendations.subtitle}</p>
              </div>
            </div>

            {/* Recommendations by Category */}
            <div className="space-y-6">
              {recommendations.recommendations.map((category, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    {category.category}
                  </h3>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Assessment-Specific Recommendations */}
            {recommendations.specificRecommendations && recommendations.specificRecommendations.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">
                  Specific Recommendations for {recommendations.assessmentType.toUpperCase()}
                </h3>
                <ul className="space-y-1">
                  {recommendations.specificRecommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-blue-700 text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            {recommendations.nextSteps && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">Next Steps</h3>
                <ul className="space-y-1">
                  {recommendations.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-green-700 text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Follow-up Timeline */}
            {recommendations.followUpTimeline && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-3">Follow-up Schedule</h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-purple-700">Next Assessment:</span>
                    <p className="text-purple-600">{recommendations.followUpTimeline.nextAssessment}</p>
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Self Check-in:</span>
                    <p className="text-purple-600">{recommendations.followUpTimeline.checkIn}</p>
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Professional Follow-up:</span>
                    <p className="text-purple-600">{recommendations.followUpTimeline.professionalFollow}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Campus Resources */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Campus Resources</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700">Counseling Center</h4>
                  <p className="text-gray-600">Phone: (555) 123-HELP</p>
                  <p className="text-gray-600">Hours: Mon-Fri 8AM-5PM</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Crisis Support</h4>
                  <p className="text-gray-600">24/7: Call 988</p>
                  <p className="text-gray-600">Text HOME to 741741</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowRecommendations(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Close Recommendations
              </button>
            </div>
          </div>
        )}

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Important Notice</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                These screening tools are for educational and self-awareness purposes only. They are not diagnostic instruments and cannot replace professional medical advice, diagnosis, or treatment. If you're experiencing mental health concerns, please consult with a qualified mental health professional.
              </p>
              <p className="text-amber-700 text-sm mt-2 font-medium">
                If you're having thoughts of self-harm or suicide, please seek immediate help by calling emergency services or a crisis helpline.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Support?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-medium text-gray-800">Crisis Text Line</h4>
              <p className="text-sm text-gray-600">Text HOME to 741741</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-medium text-gray-800">National Suicide Prevention Lifeline</h4>
              <p className="text-sm text-gray-600">988 or 1-800-273-8255</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-medium text-gray-800">Emergency</h4>
              <p className="text-sm text-gray-600">Call 911</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthAssessments;
