const { GoogleGenerativeAI } = require('@google/generative-ai');

class EnhancedGeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.model = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
        this.maxTokens = parseInt(process.env.GEMINI_MAX_TOKENS) || 1000;
        
        if (this.apiKey) {
            this.genAI = new GoogleGenerativeAI(this.apiKey);
            this.generativeModel = this.genAI.getGenerativeModel({ model: this.model });
        }
    }

    async generatePersonalizedRecommendations(userProfile, assessmentResults, availableResources) {
        try {
            if (!this.genAI) {
                console.log('Gemini AI not configured, returning basic recommendations');
                return this.getBasicRecommendations(assessmentResults);
            }

            const prompt = this.buildRecommendationPrompt(userProfile, assessmentResults, availableResources);
            
            const result = await this.generativeModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return this.parseRecommendations(text);
        } catch (error) {
            console.error('Error generating AI recommendations:', error.message);
            return this.getBasicRecommendations(assessmentResults);
        }
    }

    buildRecommendationPrompt(userProfile, assessmentResults, availableResources) {
        return `
As a mental health AI assistant, analyze the following user data and provide personalized recommendations:

User Profile:
- Age: ${userProfile?.age || 'Not specified'}
- Mental Health Concerns: ${assessmentResults?.primaryConcerns || 'General wellness'}
- Severity Level: ${assessmentResults?.severityLevel || 'Mild'}
- Preferred Activities: ${userProfile?.preferences || 'Not specified'}

Assessment Results:
- Anxiety Level: ${assessmentResults?.anxietyScore || 'Not assessed'}/10
- Stress Level: ${assessmentResults?.stressScore || 'Not assessed'}/10
- Depression Indicators: ${assessmentResults?.depressionScore || 'Not assessed'}/10

Available Resources:
${availableResources?.map(r => `- ${r.title} (${r.type}): ${r.description}`).join('\n') || 'Standard mental health resources'}

Please provide:
1. 3-5 specific resource recommendations with reasoning
2. Personalized coping strategies
3. Suggested daily activities
4. Professional help recommendations if needed

Format as JSON with the following structure:
{
  "recommendations": [
    {
      "type": "resource",
      "title": "Resource Title",
      "reason": "Why this is recommended",
      "priority": "high/medium/low"
    }
  ],
  "copingStrategies": ["strategy1", "strategy2"],
  "dailyActivities": ["activity1", "activity2"],
  "professionalHelp": "recommendation or null"
}
`;
    }

    parseRecommendations(aiResponse) {
        try {
            // Try to extract JSON from the response
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            // Fallback parsing if JSON isn't found
            return this.parseTextResponse(aiResponse);
        } catch (error) {
            console.error('Error parsing AI response:', error.message);
            return this.getBasicRecommendations();
        }
    }

    parseTextResponse(text) {
        // Basic text parsing for non-JSON responses
        return {
            recommendations: [
                {
                    type: "general",
                    title: "AI-Generated Recommendation",
                    reason: text.substring(0, 200) + "...",
                    priority: "medium"
                }
            ],
            copingStrategies: ["Practice mindfulness", "Deep breathing exercises"],
            dailyActivities: ["Regular exercise", "Adequate sleep"],
            professionalHelp: "Consider consulting a mental health professional if symptoms persist"
        };
    }

    getBasicRecommendations(assessmentResults = {}) {
        const { severityLevel = 'mild', primaryConcerns = 'general' } = assessmentResults;

        const recommendations = {
            high: [
                {
                    type: "resource",
                    title: "Professional Counseling",
                    reason: "High severity indicators suggest professional support would be beneficial",
                    priority: "high"
                },
                {
                    type: "resource",
                    title: "Crisis Support Hotline",
                    reason: "Immediate support available when needed",
                    priority: "high"
                }
            ],
            medium: [
                {
                    type: "resource",
                    title: "Guided Meditation Apps",
                    reason: "Regular meditation can help manage stress and anxiety",
                    priority: "medium"
                },
                {
                    type: "resource",
                    title: "Cognitive Behavioral Therapy Resources",
                    reason: "CBT techniques are effective for managing various mental health concerns",
                    priority: "medium"
                }
            ],
            mild: [
                {
                    type: "resource",
                    title: "Mindfulness Exercises",
                    reason: "Simple mindfulness practices can improve overall well-being",
                    priority: "low"
                },
                {
                    type: "resource",
                    title: "Exercise and Physical Activity",
                    reason: "Regular physical activity supports mental health",
                    priority: "low"
                }
            ]
        };

        return {
            recommendations: recommendations[severityLevel] || recommendations.mild,
            copingStrategies: [
                "Practice deep breathing exercises",
                "Maintain a regular sleep schedule",
                "Engage in physical activity",
                "Connect with supportive friends and family"
            ],
            dailyActivities: [
                "Morning mindfulness session (10 minutes)",
                "Physical exercise (30 minutes)",
                "Journaling before bed",
                "Limit screen time before sleep"
            ],
            professionalHelp: severityLevel === 'high' 
                ? "Strongly recommend consulting with a mental health professional"
                : "Consider professional support if symptoms worsen or persist"
        };
    }

    async generateChatResponse(userMessage, context = {}) {
        try {
            if (!this.genAI) {
                return "I'm here to help with mental health support. Could you tell me more about what you're experiencing?";
            }

            const prompt = `
You are a compassionate mental health support chatbot. Respond helpfully and empathetically to the user's message.

User Message: "${userMessage}"

Context: ${JSON.stringify(context)}

Guidelines:
- Be supportive and non-judgmental
- Provide practical suggestions when appropriate
- Encourage professional help for serious concerns
- Keep responses concise but caring
- Do not provide medical diagnoses

Response:`;

            const result = await this.generativeModel.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating chat response:', error.message);
            return "I understand you're reaching out for support. While I'm experiencing some technical difficulties, please know that help is available. Consider speaking with a mental health professional or calling a crisis helpline if you need immediate support.";
        }
    }
}

module.exports = EnhancedGeminiService;