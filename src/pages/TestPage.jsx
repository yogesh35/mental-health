import React, { useState } from "react";

export default function TestPage() {
  const questions = [
    {
      question: "How often have you been feeling stressed in the past week?",
      options: [
        { text: "🌱 Rarely - I feel calm and relaxed most of the time", value: 1 },
        { text: "🌤️ Sometimes - I have occasional stressful moments", value: 2 },
        { text: "⛈️ Often - I feel stressed frequently throughout the day", value: 3 }
      ]
    },
    {
      question: "How would you rate your sleep quality recently?",
      options: [
        { text: "😴 Excellent - I sleep soundly and wake up refreshed", value: 1 },
        { text: "😊 Good - Generally sleep well with minor interruptions", value: 2 },
        { text: "😞 Poor - I have trouble falling asleep or staying asleep", value: 3 }
      ]
    },
    {
      question: "How difficult is it for you to relax and unwind?",
      options: [
        { text: "🧘‍♀️ Easy - I can relax and unwind without difficulty", value: 1 },
        { text: "🤔 Moderate - Sometimes I struggle to relax", value: 2 },
        { text: "😰 Difficult - I find it very hard to relax and feel at ease", value: 3 }
      ]
    },
    {
      question: "How often do you feel overwhelmed by your responsibilities?",
      options: [
        { text: "🎯 Rarely - I manage my responsibilities well", value: 1 },
        { text: "⚖️ Sometimes - Occasionally I feel overwhelmed", value: 2 },
        { text: "📚 Frequently - I often feel like I have too much to handle", value: 3 }
      ]
    },
    {
      question: "How is your appetite and eating pattern lately?",
      options: [
        { text: "🍎 Normal - I eat regularly and enjoy my meals", value: 1 },
        { text: "🤷‍♀️ Changed - My appetite has changed but it's manageable", value: 2 },
        { text: "⚠️ Poor - I've lost my appetite or eat when stressed", value: 3 }
      ]
    },
    {
      question: "How connected do you feel to friends and family?",
      options: [
        { text: "🤗 Very connected - I feel supported and maintain good relationships", value: 1 },
        { text: "👥 Somewhat connected - I have some support but could be better", value: 2 },
        { text: "😔 Isolated - I feel disconnected and alone", value: 3 }
      ]
    }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAnswer = (value) => {
    const newScore = score + value;
    setScore(newScore);
    
    // Add a slight delay for better UX
    setTimeout(() => {
      if (currentQ + 1 < questions.length) {
        setCurrentQ(currentQ + 1);
        setSelectedOption(null);
      } else {
        setFinished(true);
        saveTestResult(newScore);
      }
    }, 500);
  };

  const saveTestResult = (finalScore) => {
    const testResult = {
      score: finalScore,
      date: new Date().toISOString(),
      maxScore: questions.length * 3,
      assessmentType: 'stress-test',
      questions: questions.length
    };
    
    // Save to localStorage
    saveToLocalStorage(testResult);
  };

  const saveToLocalStorage = (testResult) => {
    // Save last result
    localStorage.setItem('lastStressTestResult', JSON.stringify(testResult));
    
    // Save to history
    const history = JSON.parse(localStorage.getItem('stressTestHistory') || '[]');
    history.push(testResult);
    localStorage.setItem('stressTestHistory', JSON.stringify(history));
  };

  const resetTest = () => {
    setCurrentQ(0);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Mental Health Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take a moment to check in with yourself. This assessment helps you understand your current mental well-being. 🌱
          </p>
        </div>

        {!finished ? (
          /* Question Section with Enhanced Design */
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-purple-100 transform hover:scale-[1.02] transition-all duration-300">
            {/* Progress Header */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{currentQ + 1}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-700">
                    Question {currentQ + 1} of {questions.length}
                  </span>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {Math.round(((currentQ + 1) / questions.length) * 100)}% Complete
                </div>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 h-3 rounded-full transition-all duration-700 ease-out shadow-lg relative"
                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                  >
                    <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full shadow-md animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Question */}
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed text-center">
                {questions[currentQ].question}
              </h2>
            </div>
            
            {/* Answer Options */}
            <div className="space-y-4">
              {questions[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  className={`group w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedOption === i 
                      ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300 shadow-lg' 
                      : 'bg-white border-gray-200 hover:border-purple-200 hover:shadow-md'
                  }`}
                  onClick={() => {
                    setSelectedOption(i);
                    setTimeout(() => handleAnswer(opt.value), 200);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      selectedOption === i 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600'
                    }`}>
                      <span className="text-xl font-bold">{String.fromCharCode(65 + i)}</span>
                    </div>
                    <span className="text-lg font-medium text-gray-800 group-hover:text-purple-700 transition-colors">
                      {opt.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Results Section with Enhanced Design */
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-green-100">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Assessment Complete!
              </h2>
              <p className="text-xl text-gray-600">Here's your personalized mental health report</p>
            </div>

            {/* Score Display */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border border-blue-100">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  {score} / {questions.length * 3}
                </div>
                <p className="text-gray-600 font-semibold">Overall Wellness Score</p>
              </div>
              
              {/* Results Based on Score */}
              <div className="text-center">
                {score <= 8 ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                    <div className="text-4xl mb-4 animate-pulse">🌟</div>
                    <h3 className="text-2xl font-bold text-green-700 mb-3">Excellent Mental Health!</h3>
                    <p className="text-green-600 font-semibold mb-4">
                      You're demonstrating strong mental wellness practices and resilience.
                    </p>
                    <div className="bg-green-100 rounded-lg p-4">
                      <p className="text-green-800 text-sm font-medium">
                        💡 Keep up the great work! Continue your healthy habits like regular exercise, 
                        good sleep, and maintaining social connections.
                      </p>
                    </div>
                  </div>
                ) : score <= 12 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                    <div className="text-4xl mb-4 animate-pulse">⚖️</div>
                    <h3 className="text-2xl font-bold text-yellow-700 mb-3">Moderate Stress Levels</h3>
                    <p className="text-yellow-600 font-semibold mb-4">
                      You're experiencing some stress that's worth addressing proactively.
                    </p>
                    <div className="bg-yellow-100 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm font-medium">
                        💡 Consider incorporating relaxation techniques, mindfulness practices, 
                        regular exercise, or speaking with a counselor for additional support.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="text-4xl mb-4 animate-pulse">🚨</div>
                    <h3 className="text-2xl font-bold text-red-700 mb-3">High Stress - Support Recommended</h3>
                    <p className="text-red-600 font-semibold mb-4">
                      Your responses indicate significant stress that may benefit from professional support.
                    </p>
                    <div className="bg-red-100 rounded-lg p-4">
                      <p className="text-red-800 text-sm font-medium">
                        💡 We strongly recommend connecting with a mental health professional, 
                        counselor, or your healthcare provider for personalized support and guidance.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={resetTest}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Take Assessment Again</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/chatbot'}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <span>🤖</span>
                <span>Talk to AI Assistant</span>
              </button>
            </div>

            {/* Resources Section */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span>
                Helpful Resources
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <h5 className="font-semibold text-gray-800 mb-2">🧘‍♀️ Mindfulness & Meditation</h5>
                  <p className="text-sm text-gray-600">Practice daily mindfulness to reduce stress and improve focus</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <h5 className="font-semibold text-gray-800 mb-2">💪 Physical Activity</h5>
                  <p className="text-sm text-gray-600">Regular exercise boosts mood and reduces anxiety</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <h5 className="font-semibold text-gray-800 mb-2">👥 Social Support</h5>
                  <p className="text-sm text-gray-600">Connect with friends, family, or support groups</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <h5 className="font-semibold text-gray-800 mb-2">😴 Sleep Hygiene</h5>
                  <p className="text-sm text-gray-600">Maintain consistent sleep schedule for better mental health</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <h5 className="font-bold text-blue-800 mb-2">Important Disclaimer</h5>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    This assessment is a screening tool and not a substitute for professional medical advice, 
                    diagnosis, or treatment. If you're experiencing persistent mental health concerns or thoughts 
                    of self-harm, please consult with a qualified healthcare professional immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
