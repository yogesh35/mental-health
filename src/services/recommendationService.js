// Mental Health Recommendation System
// Provides personalized recommendations based on assessment results

export const getRecommendations = (assessmentType, score, stressLevel) => {
  const baseRecommendations = {
    low: {
      title: "🌟 Great Mental Health!",
      subtitle: "Keep up the excellent work with your mental wellness",
      color: "#10B981", // Green
      icon: "🌟",
      priority: "maintenance",
      recommendations: [
        {
          category: "Maintain Wellness",
          items: [
            "Continue your current self-care routine",
            "Practice gratitude daily - write down 3 things you're grateful for",
            "Maintain regular sleep schedule (7-9 hours)",
            "Keep up with regular physical activity",
            "Stay connected with friends and family"
          ]
        },
        {
          category: "Prevention & Growth",
          items: [
            "Learn new stress management techniques",
            "Practice mindfulness or meditation for 10 minutes daily",
            "Set healthy boundaries in relationships and work",
            "Engage in hobbies and activities you enjoy",
            "Consider volunteering to help others and boost mood"
          ]
        },
        {
          category: "Campus Resources",
          items: [
            "Join wellness workshops offered by the counseling center",
            "Participate in campus fitness classes or recreational activities",
            "Connect with student support groups",
            "Explore peer mentoring programs",
            "Attend stress management seminars"
          ]
        }
      ]
    },
    medium: {
      title: "⚠️ Moderate Stress Level",
      subtitle: "Time to focus on stress management and self-care",
      color: "#F59E0B", // Amber
      icon: "⚠️",
      priority: "intervention",
      recommendations: [
        {
          category: "Immediate Actions",
          items: [
            "Take regular breaks throughout your day (5-10 minutes every hour)",
            "Practice deep breathing exercises when feeling overwhelmed",
            "Prioritize 7-8 hours of sleep each night",
            "Limit caffeine and alcohol consumption",
            "Reach out to a trusted friend or family member"
          ]
        },
        {
          category: "Stress Management Techniques",
          items: [
            "Try progressive muscle relaxation before bed",
            "Use time management tools to organize tasks",
            "Practice saying 'no' to additional commitments",
            "Engage in regular physical exercise (even 20 minutes walking)",
            "Keep a stress diary to identify triggers"
          ]
        },
        {
          category: "Professional Support",
          items: [
            "Consider scheduling a session with campus counseling services",
            "Attend stress management workshops",
            "Join a support group for students",
            "Speak with academic advisors about workload management",
            "Utilize campus mental health resources and apps"
          ]
        },
        {
          category: "Lifestyle Adjustments",
          items: [
            "Create a structured daily routine",
            "Limit social media and news consumption",
            "Practice mindfulness or meditation apps (Headspace, Calm)",
            "Maintain healthy eating habits",
            "Schedule regular 'me time' activities"
          ]
        }
      ]
    },
    high: {
      title: "🚨 High Stress Level - Immediate Support Needed",
      subtitle: "Please prioritize seeking support and implementing coping strategies",
      color: "#DC2626", // Red
      icon: "🚨",
      priority: "urgent",
      recommendations: [
        {
          category: "Immediate Support",
          items: [
            "🔥 URGENT: Contact campus counseling center today",
            "Reach out to a trusted friend, family member, or mentor immediately",
            "Consider contacting a mental health crisis hotline if needed",
            "Inform a trusted professor or academic advisor about your situation",
            "Don't isolate yourself - stay connected with your support network"
          ]
        },
        {
          category: "Crisis Resources",
          items: [
            "Campus Counseling Center: Call during business hours",
            "National Suicide Prevention Lifeline: 988",
            "Crisis Text Line: Text HOME to 741741",
            "Campus Safety/Security: Available 24/7",
            "Local emergency services: 911 (if in immediate danger)"
          ]
        },
        {
          category: "Daily Coping Strategies",
          items: [
            "Focus on basic needs: eat regular meals, stay hydrated",
            "Try to maintain minimal sleep routine (even if difficult)",
            "Practice grounding techniques (5-4-3-2-1 sensory method)",
            "Limit overwhelming activities and commitments",
            "Use breathing exercises during panic or anxiety episodes"
          ]
        },
        {
          category: "Academic Support",
          items: [
            "Contact your academic advisor about temporary accommodations",
            "Explore incomplete grades or medical withdrawal options if needed",
            "Request extensions on assignments through disability services",
            "Consider reducing course load if necessary",
            "Access tutoring services to reduce academic pressure"
          ]
        },
        {
          category: "Professional Help",
          items: [
            "Schedule regular counseling sessions",
            "Ask about group therapy options",
            "Inquire about psychiatric evaluation if recommended",
            "Explore intensive outpatient programs if available",
            "Consider family therapy if family issues are contributing"
          ]
        }
      ]
    }
  };

  // Get base recommendations for stress level
  const baseRec = baseRecommendations[stressLevel] || baseRecommendations.medium;

  // Add assessment-specific recommendations
  const specificRecommendations = getAssessmentSpecificRecommendations(assessmentType, score, stressLevel);

  return {
    ...baseRec,
    score: score,
    assessmentType: assessmentType,
    stressLevel: stressLevel,
    timestamp: new Date().toISOString(),
    specificRecommendations: specificRecommendations,
    nextSteps: getNextSteps(stressLevel),
    followUpTimeline: getFollowUpTimeline(stressLevel)
  };
};

const getAssessmentSpecificRecommendations = (assessmentType, score, stressLevel) => {
  const specific = {
    'phq-9': {
      name: 'Depression (PHQ-9)',
      recommendations: {
        low: [
          "Continue activities that bring you joy and fulfillment",
          "Maintain social connections and meaningful relationships",
          "Keep a mood journal to track positive patterns"
        ],
        medium: [
          "Consider cognitive behavioral therapy (CBT) techniques",
          "Increase physical activity - even light exercise helps mood",
          "Practice positive self-talk and challenge negative thoughts",
          "Establish a consistent daily routine"
        ],
        high: [
          "Seek immediate professional help for depression screening",
          "Consider antidepressant medication evaluation",
          "Engage in intensive therapy or counseling",
          "Inform trusted people about your feelings for support"
        ]
      }
    },
    'gad-7': {
      name: 'Anxiety (GAD-7)',
      recommendations: {
        low: [
          "Practice relaxation techniques to maintain low anxiety",
          "Continue healthy lifestyle choices that support calmness",
          "Learn anxiety prevention strategies"
        ],
        medium: [
          "Try anxiety management apps (Calm, Headspace, Insight Timer)",
          "Practice progressive muscle relaxation daily",
          "Consider limiting caffeine intake",
          "Learn and practice grounding techniques"
        ],
        high: [
          "Seek evaluation for anxiety disorders",
          "Consider anti-anxiety medication consultation",
          "Learn panic attack management techniques",
          "Practice daily anxiety-reduction exercises"
        ]
      }
    },
    'ghq-12': {
      name: 'General Mental Health (GHQ-12)',
      recommendations: {
        low: [
          "Maintain your current healthy lifestyle",
          "Continue positive coping strategies",
          "Stay engaged in activities you enjoy"
        ],
        medium: [
          "Focus on overall wellness and life balance",
          "Address specific areas of concern identified in assessment",
          "Develop better work-life balance"
        ],
        high: [
          "Comprehensive mental health evaluation recommended",
          "Address multiple areas of psychological distress",
          "Consider holistic treatment approach"
        ]
      }
    }
  };

  return specific[assessmentType]?.recommendations[stressLevel] || [];
};

const getNextSteps = (stressLevel) => {
  const steps = {
    low: [
      "Retake assessment in 1 week to monitor wellness",
      "Continue current positive practices",
      "Explore new wellness activities"
    ],
    medium: [
      "Implement 2-3 recommended strategies immediately",
      "Schedule counseling appointment within 1 week",
      "Retake assessment in 1 week to track progress"
    ],
    high: [
      "Contact counseling services TODAY",
      "Implement crisis coping strategies immediately",
      "Follow up with professional within 24-48 hours",
      "Retake assessment in 3-5 days to monitor status"
    ]
  };

  return steps[stressLevel] || steps.medium;
};

const getFollowUpTimeline = (stressLevel) => {
  const timelines = {
    low: {
      nextAssessment: "1 week",
      checkIn: "2-3 days",
      professionalFollow: "As needed"
    },
    medium: {
      nextAssessment: "1 week", 
      checkIn: "Daily self-check",
      professionalFollow: "1 week"
    },
    high: {
      nextAssessment: "3-5 days",
      checkIn: "Multiple times daily",
      professionalFollow: "24-48 hours"
    }
  };

  return timelines[stressLevel] || timelines.medium;
};

export default getRecommendations;