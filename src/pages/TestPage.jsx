import React, { useState } from "react";

export default function TestPage() {
  const questions = [
    {
      question: "How often do you feel stressed?",
      options: [
        { text: "Rarely", value: 1 },
        { text: "Sometimes", value: 2 },
        { text: "Often", value: 3 }
      ]
    },
    {
      question: "How well do you sleep?",
      options: [
        { text: "Very well", value: 1 },
        { text: "Okay", value: 2 },
        { text: "Poorly", value: 3 }
      ]
    },
    {
      question: "Do you find it hard to relax?",
      options: [
        { text: "No", value: 1 },
        { text: "Sometimes", value: 2 },
        { text: "Yes", value: 3 }
      ]
    }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (value) => {
    const newScore = score + value;
    setScore(newScore);
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setFinished(true);
      // Save to localStorage when test is completed
      saveTestResult(newScore);
    }
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
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          🧠 Mental Health Self-Assessment
        </h2>

        {!finished ? (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Question {currentQ + 1} of {questions.length}
                </span>
                <div className="w-full bg-gray-200 rounded-full h-2 ml-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {questions[currentQ].question}
              </h3>
            </div>
            
            <div className="space-y-3">
              {questions[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 transform hover:scale-105"
                  onClick={() => handleAnswer(opt.value)}
                >
                  <span className="text-gray-800 font-medium">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Your Assessment Results
            </h3>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {score} / {questions.length * 3}
              </div>
              <div className="text-lg">
                {score <= 5 ? (
                  <div className="text-green-600">
                    <span className="text-2xl mb-2 block">✅</span>
                    <p className="font-semibold">Great! You seem to be doing well!</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Keep up the good work with your mental health practices.
                    </p>
                  </div>
                ) : score <= 7 ? (
                  <div className="text-yellow-600">
                    <span className="text-2xl mb-2 block">⚠️</span>
                    <p className="font-semibold">Mild stress detected.</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Consider incorporating relaxation techniques, regular exercise, or mindfulness practices into your routine.
                    </p>
                  </div>
                ) : (
                  <div className="text-red-600">
                    <span className="text-2xl mb-2 block">🚨</span>
                    <p className="font-semibold">High stress levels detected.</p>
                    <p className="text-sm text-gray-600 mt-2">
                      We recommend reaching out to a mental health professional or counselor for support.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={resetTest}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Take Test Again
            </button>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Disclaimer:</strong> This is a basic self-assessment tool and not a substitute for professional medical advice. 
                If you're experiencing persistent mental health concerns, please consult with a healthcare professional.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
