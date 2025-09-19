// Mental Health Assessment Data - PHQ-9, GAD-7, and GHQ-12

export const assessmentData = {
  PHQ9: {
    title: "PHQ-9 Depression Screening",
    description: "Patient Health Questionnaire-9 (PHQ-9) is a widely used screening tool for depression. This assessment helps identify symptoms of depression over the past two weeks.",
    instructions: "Over the last 2 weeks, how often have you been bothered by any of the following problems? 🤔 Be honest with yourself - this information helps us understand how you've been feeling.",
    timeframe: "Past 2 weeks",
    questions: [
      {
        id: 1,
        text: "Little interest or pleasure in doing things you usually enjoy 🎨🎵🎮",
        studentFriendly: "Have you lost interest in hobbies, games, social media, or activities you normally love?"
      },
      {
        id: 2,
        text: "Feeling down, depressed, or hopeless 😔💭",
        studentFriendly: "Have you been feeling really sad, empty, or like things won't get better?"
      },
      {
        id: 3,
        text: "Trouble falling asleep, staying asleep, or sleeping too much 😴🌙",
        studentFriendly: "Are you having sleep problems - either can't sleep, wake up a lot, or sleeping way too much?"
      },
      {
        id: 4,
        text: "Feeling tired or having little energy ⚡💤",
        studentFriendly: "Do you feel exhausted even after rest, or like you have no energy for daily tasks?"
      },
      {
        id: 5,
        text: "Poor appetite or overeating 🍎🍕",
        studentFriendly: "Has your eating changed - either not feeling hungry or eating way more than usual?"
      },
      {
        id: 6,
        text: "Feeling bad about yourself or that you're a failure 😞💔",
        studentFriendly: "Do you feel like you're not good enough, worthless, or letting people down?"
      },
      {
        id: 7,
        text: "Trouble concentrating on things like reading, studying, or watching TV 📚💻",
        studentFriendly: "Is it hard to focus on schoolwork, conversations, or even entertainment?"
      },
      {
        id: 8,
        text: "Moving or speaking slowly, or being very restless and fidgety 🐌⚡",
        studentFriendly: "Are you moving/talking unusually slow, or feeling so restless you can't sit still?"
      },
      {
        id: 9,
        text: "Thoughts that you would be better off dead or of hurting yourself 🆘❤️",
        studentFriendly: "Have you had thoughts about death or hurting yourself? (If yes, please seek help immediately)"
      }
    ],
    options: [
      { value: 0, label: "Not at all 😌", color: "bg-green-100 text-green-800" },
      { value: 1, label: "Several days 🌤️", color: "bg-yellow-100 text-yellow-800" },
      { value: 2, label: "More than half the days ⛅", color: "bg-orange-100 text-orange-800" },
      { value: 3, label: "Nearly every day ⛈️", color: "bg-red-100 text-red-800" }
    ],
    scoring: {
      ranges: [
        { min: 0, max: 4, level: "Minimal", description: "Minimal depression symptoms", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", severity: "low" },
        { min: 5, max: 9, level: "Mild", description: "Mild depression symptoms", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200", severity: "low" },
        { min: 10, max: 14, level: "Moderate", description: "Moderate depression symptoms", color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200", severity: "moderate" },
        { min: 15, max: 19, level: "Moderately Severe", description: "Moderately severe depression symptoms", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200", severity: "high" },
        { min: 20, max: 27, level: "Severe", description: "Severe depression symptoms", color: "text-red-700", bgColor: "bg-red-100", borderColor: "border-red-300", severity: "critical" }
      ],
      recommendations: {
        minimal: "Your responses suggest minimal depression symptoms. Continue practicing good mental health habits like regular exercise, healthy sleep, and social connections. 🌱",
        mild: "Your responses suggest mild depression symptoms. Consider talking to a mental health professional, campus counselor, or trusted person. Monitor your mood and practice self-care. 💙",
        moderate: "Your responses suggest moderate depression symptoms. We recommend speaking with a mental health professional soon. Campus counseling services can provide support. 🤝",
        "moderately severe": "Your responses suggest significant depression symptoms. Professional help is strongly recommended. Please consider contacting campus mental health services or a healthcare provider. 🆘",
        severe: "Your responses suggest severe depression symptoms. Please seek professional help immediately. Contact campus crisis services, emergency services, or call 988. You don't have to face this alone. ❤️"
      },
      alertThresholds: {
        counselorAlert: 15, // Moderately severe or higher
        emergencyAlert: 20,  // Severe
        suicideRisk: true    // Any positive response to question 9
      }
    }
  },

  GAD7: {
    title: "GAD-7 Anxiety Screening",
    description: "Generalized Anxiety Disorder 7-item (GAD-7) scale is a screening tool for anxiety disorders. This helps identify anxiety symptoms and their impact on your daily life.",
    instructions: "Over the last 2 weeks, how often have you been bothered by the following problems? 😰 Remember, anxiety affects everyone differently - your honest answers help us understand your experience.",
    timeframe: "Past 2 weeks",
    questions: [
      {
        id: 1,
        text: "Feeling nervous, anxious, or on edge 😬⚡",
        studentFriendly: "Do you feel jittery, nervous, or like you're constantly 'wound up'?"
      },
      {
        id: 2,
        text: "Not being able to stop or control worrying 🌪️💭",
        studentFriendly: "Do worrying thoughts keep racing through your mind even when you try to stop them?"
      },
      {
        id: 3,
        text: "Worrying too much about different things 📚🏠💼",
        studentFriendly: "Are you constantly worried about school, relationships, future, or other life areas?"
      },
      {
        id: 4,
        text: "Trouble relaxing or unwinding 🧘‍♀️❌",
        studentFriendly: "Is it hard to chill out, even during free time or when trying to decompress?"
      },
      {
        id: 5,
        text: "Being so restless that it's hard to sit still 🪑⚡",
        studentFriendly: "Do you feel so restless you need to keep moving, fidgeting, or can't sit through classes?"
      },
      {
        id: 6,
        text: "Becoming easily annoyed or irritable 😤💢",
        studentFriendly: "Are you getting frustrated or snapping at people more easily than usual?"
      },
      {
        id: 7,
        text: "Feeling afraid as if something awful might happen 😨🚨",
        studentFriendly: "Do you have a sense of dread or fear that something bad is about to happen?"
      }
    ],
    options: [
      { value: 0, label: "Not at all 😌", color: "bg-green-100 text-green-800" },
      { value: 1, label: "Several days 🌤️", color: "bg-yellow-100 text-yellow-800" },
      { value: 2, label: "More than half the days ⛅", color: "bg-orange-100 text-orange-800" },
      { value: 3, label: "Nearly every day ⛈️", color: "bg-red-100 text-red-800" }
    ],
    scoring: {
      ranges: [
        { min: 0, max: 4, level: "Minimal", description: "Minimal anxiety symptoms", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", severity: "low" },
        { min: 5, max: 9, level: "Mild", description: "Mild anxiety symptoms", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200", severity: "low" },
        { min: 10, max: 14, level: "Moderate", description: "Moderate anxiety symptoms", color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200", severity: "moderate" },
        { min: 15, max: 21, level: "Severe", description: "Severe anxiety symptoms", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200", severity: "high" }
      ],
      recommendations: {
        minimal: "Your responses suggest minimal anxiety symptoms. Keep up your current coping strategies. Practice mindfulness, deep breathing, and maintain healthy routines. 🧘‍♀️",
        mild: "Your responses suggest mild anxiety symptoms. Consider stress management techniques, regular exercise, or speaking with someone you trust. Campus wellness resources can help. 💪",
        moderate: "Your responses suggest moderate anxiety symptoms. We recommend considering professional support. Campus counseling services offer anxiety management strategies and therapy. 🤝",
        severe: "Your responses suggest significant anxiety symptoms. Please consider seeking professional help from campus mental health services or a healthcare provider. You deserve support. ❤️"
      },
      alertThresholds: {
        counselorAlert: 10, // Moderate or higher
        emergencyAlert: 15,  // Severe
        suicideRisk: false
      }
    }
  },

  GHQ12: {
    title: "GHQ-12 General Health Screening",
    description: "General Health Questionnaire-12 (GHQ-12) is a screening tool for general psychological distress and overall mental wellbeing.",
    instructions: "We would like to know if you have had any medical complaints and how your health has been in general, over the past few weeks. 🌡️ Please answer all questions by selecting the response that best applies to you.",
    timeframe: "Past few weeks",
    questions: [
      {
        id: 1,
        text: "Been able to concentrate on whatever you're doing? 🎯📚",
        studentFriendly: "How well can you focus on studying, work, or activities?"
      },
      {
        id: 2,
        text: "Lost much sleep over worry? 😴💭",
        studentFriendly: "Are worries keeping you awake at night or affecting your sleep?"
      },
      {
        id: 3,
        text: "Felt that you were playing a useful part in things? 🤝✨",
        studentFriendly: "Do you feel like you're contributing meaningfully to your community, family, or school?"
      },
      {
        id: 4,
        text: "Felt capable of making decisions about things? 🤔✅",
        studentFriendly: "How confident do you feel when making choices or decisions?"
      },
      {
        id: 5,
        text: "Felt constantly under strain? 😰⚡",
        studentFriendly: "Do you feel like you're always under pressure or stress?"
      },
      {
        id: 6,
        text: "Felt you couldn't overcome your difficulties? 🧗‍♀️❌",
        studentFriendly: "Do your problems feel too big to handle or solve?"
      },
      {
        id: 7,
        text: "Been able to enjoy your normal day-to-day activities? 😊🎉",
        studentFriendly: "Are you still finding pleasure in everyday things like hanging out with friends, hobbies, or entertainment?"
      },
      {
        id: 8,
        text: "Been able to face up to your problems? 💪🎯",
        studentFriendly: "Do you feel able to tackle challenges head-on rather than avoiding them?"
      },
      {
        id: 9,
        text: "Been feeling unhappy and depressed? 😢💙",
        studentFriendly: "Have you been feeling down, sad, or depressed?"
      },
      {
        id: 10,
        text: "Been losing confidence in yourself? 😔⬇️",
        studentFriendly: "Has your self-confidence or belief in yourself decreased?"
      },
      {
        id: 11,
        text: "Been thinking of yourself as a worthless person? 💔😞",
        studentFriendly: "Have you been feeling like you're not valuable or worthless?"
      },
      {
        id: 12,
        text: "Been feeling reasonably happy, all things considered? 😊🌈",
        studentFriendly: "Overall, considering everything in your life, are you feeling reasonably happy?"
      }
    ],
    options: [
      { value: 0, label: "Better than usual 😊", color: "bg-green-100 text-green-800" },
      { value: 1, label: "Same as usual 😐", color: "bg-blue-100 text-blue-800" },
      { value: 2, label: "Worse than usual 😕", color: "bg-orange-100 text-orange-800" },
      { value: 3, label: "Much worse than usual 😰", color: "bg-red-100 text-red-800" }
    ],
    positiveQuestions: [1, 3, 4, 7, 8, 12], // Questions where lower scores are better
    scoring: {
      ranges: [
        { min: 0, max: 11, level: "Normal", description: "No significant psychological distress", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", severity: "low" },
        { min: 12, max: 15, level: "Mild", description: "Mild psychological distress", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200", severity: "low" },
        { min: 16, max: 20, level: "Moderate", description: "Moderate psychological distress", color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200", severity: "moderate" },
        { min: 21, max: 36, level: "Severe", description: "Severe psychological distress", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200", severity: "high" }
      ],
      recommendations: {
        normal: "Your responses suggest good psychological wellbeing. Continue your current healthy practices like balanced study, social connections, and self-care. 🌟",
        mild: "Your responses suggest mild distress. Consider self-care strategies, stress management techniques, and monitor your wellbeing. Talk to friends or family. 💙",
        moderate: "Your responses suggest moderate distress. Consider speaking with a campus counselor or mental health professional. You don't have to handle this alone. 🤝",
        severe: "Your responses suggest significant distress. We strongly recommend seeking professional support from campus mental health services or a healthcare provider immediately. ❤️"
      },
      alertThresholds: {
        counselorAlert: 16, // Moderate or higher
        emergencyAlert: 21,  // Severe
        suicideRisk: false
      }
    }
  }
};

// Helper function to get scoring interpretation
export const getScoreInterpretation = (testType, score) => {
  const test = assessmentData[testType];
  if (!test) return null;

  const range = test.scoring.ranges.find(r => score >= r.min && score <= r.max);
  if (!range) return null;

  const recommendation = test.scoring.recommendations[range.level.toLowerCase()] || 
                        test.scoring.recommendations[range.level.toLowerCase().replace(' ', '')] ||
                        "Please consult with a mental health professional for personalized guidance.";

  return {
    level: range.level,
    description: range.description,
    color: range.color,
    bgColor: range.bgColor,
    borderColor: range.borderColor,
    recommendation
  };
};
