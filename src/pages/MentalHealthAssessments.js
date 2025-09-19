import React, { useState } from 'react';
import AssessmentForm from '../components/AssessmentForm';

const MentalHealthAssessments = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [completedTests, setCompletedTests] = useState({});

  const handleTestComplete = (result) => {
    setCompletedTests(prev => ({
      ...prev,
      [result.type]: result
    }));

    // Save assessment result to localStorage for the User profile page
    try {
      const existingHistory = localStorage.getItem('stressTestHistory');
      let history = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Create a simplified assessment record for the User page
      const assessmentRecord = {
        id: result.timestamp,
        date: result.timestamp,
        type: result.type,
        score: result.score,
        maxScore: result.type === 'PHQ9' ? 27 : result.type === 'GAD7' ? 21 : 36,
        level: result.interpretation.level,
        description: result.interpretation.description
      };
      
      // Add the new assessment to history
      history.push(assessmentRecord);
      
      // Keep only the last 50 assessments to prevent localStorage from getting too large
      if (history.length > 50) {
        history = history.slice(-50);
      }
      
      // Save updated history to localStorage
      localStorage.setItem('stressTestHistory', JSON.stringify(history));
      
      console.log('Assessment saved to history:', assessmentRecord);
    } catch (error) {
      console.error('Error saving assessment to localStorage:', error);
    }
  };

  const handleBackToSelection = () => {
    setSelectedTest(null);
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
                  onClick={() => setSelectedTest(test.type)}
                  className={`w-full bg-gradient-to-r ${test.color} ${test.hoverColor} text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105`}
                >
                  {completedTests[test.type] ? 'Retake Assessment' : 'Start Assessment'}
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
