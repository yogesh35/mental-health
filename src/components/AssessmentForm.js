import React, { useState, useEffect } from 'react';
import { useUser } from '@descope/react-sdk';
import { assessmentData, getScoreInterpretation } from '../data/assessmentData';
import { CounselorAlertService } from '../services/counselorAlertService';

const AssessmentForm = ({ type, onComplete, className = "" }) => {
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const { user } = useUser();

  const testData = assessmentData[type];

  useEffect(() => {
    // Reset form when type changes
    setAnswers({});
    setIsSubmitted(false);
    setScore(null);
    setInterpretation(null);
  }, [type]);

  if (!testData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">Assessment type "{type}" not found.</p>
      </div>
    );
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    
    testData.questions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        // For GHQ-12, reverse scoring for positive questions
        if (type === 'GHQ12' && testData.positiveQuestions?.includes(question.id)) {
          // Reverse the score for positive questions (0->3, 1->2, 2->1, 3->0)
          totalScore += (3 - answer);
        } else {
          totalScore += answer;
        }
      }
    });
    
    return totalScore;
  };

  const getStressReductionTips = (scoreLevel) => {
    const commonTips = {
      general: [
        "🧘‍♀️ Practice deep breathing exercises (4-7-8 technique)",
        "🚶‍♂️ Take a 10-15 minute walk in nature",
        "💤 Maintain a regular sleep schedule (7-9 hours)",
        "📱 Limit screen time before bed",
        "🎵 Listen to calming music or nature sounds",
        "📝 Write in a gratitude journal",
        "🤝 Connect with supportive friends or family"
      ],
      mindfulness: [
        "🧘 Try guided meditation apps (Headspace, Calm)",
        "🌱 Practice mindful eating",
        "🔍 Use the 5-4-3-2-1 grounding technique",
        "💭 Practice loving-kindness meditation",
        "🌸 Spend time in nature mindfully"
      ],
      physical: [
        "🏃‍♀️ Engage in regular physical exercise",
        "🧘‍♀️ Try yoga or tai chi",
        "💪 Do progressive muscle relaxation",
        "🏊‍♀️ Swimming or water activities",
        "🚴‍♀️ Cycling or outdoor activities"
      ],
      academic: [
        "📚 Break large tasks into smaller, manageable chunks",
        "⏰ Use time management techniques (Pomodoro)",
        "📋 Create a study schedule and stick to it",
        "🤔 Seek help from tutors or study groups",
        "🎯 Set realistic, achievable goals"
      ],
      social: [
        "👥 Join clubs or organizations that interest you",
        "💬 Practice open communication with friends",
        "🤝 Volunteer for causes you care about",
        "🎭 Engage in group activities or hobbies",
        "📞 Reach out to campus counseling services"
      ]
    };

    const severityBasedTips = {
      minimal: [
        "🌟 You're doing great! Keep up the good work",
        "🔄 Continue your current healthy habits",
        "📈 Consider building resilience through new activities"
      ],
      mild: [
        "🎯 Focus on stress prevention techniques",
        "⚖️ Work on maintaining work-life balance",
        "🧠 Learn new coping strategies"
      ],
      moderate: [
        "🚨 Consider speaking with a counselor",
        "🏥 Explore campus mental health resources",
        "👨‍⚕️ Talk to your healthcare provider",
        "🔄 Implement daily stress management routines"
      ],
      severe: [
        "🆘 Please reach out for professional support",
        "📞 Contact campus crisis resources immediately",
        "👨‍⚕️ Schedule an appointment with a mental health professional",
        "🤝 Don't face this alone - support is available"
      ]
    };

    return {
      general: commonTips.general.slice(0, 4),
      specific: [
        ...commonTips.mindfulness.slice(0, 2),
        ...commonTips.physical.slice(0, 2),
        ...commonTips.academic.slice(0, 2)
      ],
      severity: severityBasedTips[scoreLevel] || severityBasedTips.mild
    };
  };

  const getCrisisResources = () => (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <h6 className="font-semibold text-red-800 mb-2">🆘 Need Immediate Help?</h6>
      <div className="text-sm text-red-700 space-y-1">
        <p><strong>Campus Crisis Line:</strong> (555) 123-4567</p>
        <p><strong>National Suicide Prevention Lifeline:</strong> 988</p>
        <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
        <p><strong>Campus Counseling Center:</strong> (555) 123-HELP</p>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all questions are answered
    const unansweredQuestions = testData.questions.filter(
      question => answers[question.id] === undefined
    );
    
    if (unansweredQuestions.length > 0) {
      alert(`Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`);
      return;
    }

    const calculatedScore = calculateScore();
    const scoreInterpretation = getScoreInterpretation(type, calculatedScore);
    
    setScore(calculatedScore);
    setInterpretation(scoreInterpretation);
    setIsSubmitted(true);

    // Prepare assessment result
    const assessmentResult = {
      type,
      score: calculatedScore,
      interpretation: scoreInterpretation,
      answers,
      timestamp: new Date().toISOString(),
      studentInfo: {
        userId: user?.userId,
        name: user?.name,
        email: user?.email
      }
    };

    // Send counselor alerts in background (hidden from student view)
    try {
      await CounselorAlertService.sendCounselorAlert(assessmentResult);
    } catch (error) {
      console.error('Error sending counselor alert:', error);
    }

    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(assessmentResult);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScore(null);
    setInterpretation(null);
  };

  const getProgress = () => {
    const answeredCount = Object.keys(answers).length;
    const totalCount = testData.questions.length;
    return (answeredCount / totalCount) * 100;
  };

  if (isSubmitted && score !== null && interpretation) {
    const stressTips = getStressReductionTips(interpretation.level.toLowerCase());
    
    return (
      <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{testData.title}</h3>
          <p className="text-gray-600">Assessment Complete</p>
        </div>

        <div className={`rounded-lg p-6 border-2 ${interpretation.borderColor} ${interpretation.bgColor}`}>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold mb-2">
              <span className={interpretation.color}>{score}</span>
              <span className="text-gray-400 text-2xl">/{testData.questions.length * 3}</span>
            </div>
            <h4 className={`text-xl font-semibold ${interpretation.color}`}>
              {interpretation.level}: {interpretation.description}
            </h4>
          </div>
          
          <div className="bg-white rounded-lg p-4 mt-4">
            <h5 className="font-semibold text-gray-800 mb-2">Recommendation:</h5>
            <p className="text-gray-700 leading-relaxed">{interpretation.recommendation}</p>
          </div>
        </div>

        {/* Student-Focused Stress Reduction Tips */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h5 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <span className="mr-2">🌱</span>
            Personalized Well-being Tips
          </h5>
          
          {/* General Tips */}
          <div className="mb-4">
            <h6 className="font-medium text-gray-800 mb-2">💡 Quick Stress Relief Techniques:</h6>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {stressTips.general.map((tip, index) => (
                <li key={index} className="text-sm text-gray-700 bg-white p-2 rounded-md shadow-sm">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Specific Tips */}
          <div className="mb-4">
            <h6 className="font-medium text-gray-800 mb-2">🎯 Recommended Activities:</h6>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {stressTips.specific.map((tip, index) => (
                <li key={index} className="text-sm text-gray-700 bg-white p-2 rounded-md shadow-sm">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Severity-based Tips */}
          <div className={`p-4 rounded-lg border-l-4 ${
            interpretation.level.toLowerCase() === 'severe' 
              ? 'bg-red-50 border-red-400' 
              : interpretation.level.toLowerCase() === 'moderate'
              ? 'bg-orange-50 border-orange-400'
              : 'bg-blue-50 border-blue-400'
          }`}>
            <h6 className="font-medium text-gray-800 mb-2">📋 Priority Actions:</h6>
            <ul className="space-y-1">
              {stressTips.severity.map((tip, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Campus Resources */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h5 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <span className="mr-2">🏫</span>
            Campus Resources & Support
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h6 className="font-medium text-gray-800">📞 Counseling Center</h6>
              <p className="text-gray-600">Free counseling sessions</p>
              <p className="text-blue-600">(555) 123-HELP</p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h6 className="font-medium text-gray-800">🏃‍♀️ Wellness Center</h6>
              <p className="text-gray-600">Fitness classes & activities</p>
              <p className="text-blue-600">wellness@campus.edu</p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h6 className="font-medium text-gray-800">📚 Academic Support</h6>
              <p className="text-gray-600">Tutoring & study groups</p>
              <p className="text-blue-600">studyhelp@campus.edu</p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h6 className="font-medium text-gray-800">🤝 Peer Support</h6>
              <p className="text-gray-600">Student mentors & groups</p>
              <p className="text-blue-600">peerhelp@campus.edu</p>
            </div>
          </div>
        </div>

        {/* Crisis Resources (only for severe cases) */}
        {(interpretation.level.toLowerCase() === 'severe' || interpretation.level.toLowerCase() === 'moderate') && 
          getCrisisResources()
        }

        <div className="mt-6 text-center">
          <button
            onClick={handleRetake}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Retake Assessment
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>This screening tool is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{testData.title}</h3>
        <p className="text-gray-600 mb-4">{testData.description}</p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Object.keys(answers).length} of {testData.questions.length} answered</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-medium">{testData.instructions}</p>
          <p className="text-blue-600 text-sm mt-1">Timeframe: {testData.timeframe}</p>
        </div>
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {testData.questions.map((question, index) => (
          <div key={question.id} className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-2">
              <span className="text-blue-600 font-bold">{index + 1}.</span> {question.text}
            </h4>
            
            {/* Student-friendly explanation */}
            {question.studentFriendly && (
              <p className="text-sm text-gray-600 mb-4 italic bg-blue-50 p-3 rounded-md border-l-4 border-blue-300">
                💡 In other words: {question.studentFriendly}
              </p>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {testData.options.map((option) => (
                <label
                  key={option.value}
                  className={`
                    cursor-pointer rounded-lg border-2 p-4 text-center transition-all duration-200
                    ${answers[question.id] === option.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="sr-only"
                  />
                  <div className={`text-xs font-medium px-2 py-1 rounded-full mb-2 ${option.color}`}>
                    {option.value}
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {option.label}
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div className="text-center pt-6">
          <button
            type="submit"
            disabled={Object.keys(answers).length !== testData.questions.length}
            className={`
              font-semibold py-4 px-12 rounded-lg text-lg transition-all duration-200
              ${Object.keys(answers).length === testData.questions.length
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {Object.keys(answers).length === testData.questions.length
              ? 'Calculate Results'
              : `Answer ${testData.questions.length - Object.keys(answers).length} more question(s)`
            }
          </button>
        </div>
      </form>

      <div className="mt-8 text-xs text-gray-500 text-center">
        <p>This screening tool is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.</p>
      </div>
    </div>
  );
};

export default AssessmentForm;
