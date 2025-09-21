const { GoogleGenerativeAI } = require('@google/generative-ai');
const Resource = require('../models/Resource');
const Category = require('../models/Category');

class RecommendationService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    // Main function to get recommendations based on assessment results
    async getRecommendations(assessmentResults, userId = null) {
        try {
            const { scores, dominantCondition, severityLevel, responses } = assessmentResults;

            // Get severity-matched resources from database
            const resources = await Resource.findBySeverity(severityLevel, 20);
            
            // Get categories for context
            const categories = await Category.findAll();

            // Generate AI-powered personalized recommendations
            const aiRecommendations = await this.generateAIRecommendations(
                scores, 
                dominantCondition, 
                severityLevel, 
                responses,
                resources,
                categories
            );

            // Combine database resources with AI insights
            const finalRecommendations = await this.combineRecommendations(
                resources,
                aiRecommendations,
                severityLevel,
                dominantCondition
            );

            return {
                success: true,
                data: {
                    severityLevel,
                    dominantCondition,
                    totalResources: finalRecommendations.length,
                    aiInsights: aiRecommendations.insights,
                    immediateActions: aiRecommendations.immediateActions,
                    resources: finalRecommendations,
                    categories: this.categorizerecommendations(finalRecommendations)
                }
            };
        } catch (error) {
            console.error('Error generating recommendations:', error);
            throw error;
        }
    }

    // Generate AI-powered recommendations using Gemini
    async generateAIRecommendations(scores, dominantCondition, severityLevel, responses, resources, categories) {
        try {
            const prompt = this.buildRecommendationPrompt(
                scores, 
                dominantCondition, 
                severityLevel, 
                responses, 
                resources,
                categories
            );

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse AI response
            return this.parseAIResponse(text);
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            // Fallback to rule-based recommendations
            return this.getFallbackRecommendations(dominantCondition, severityLevel);
        }
    }

    // Build detailed prompt for AI recommendations
    buildRecommendationPrompt(scores, dominantCondition, severityLevel, responses, resources, categories) {
        const resourceTitles = resources.map(r => `- ${r.title} (${r.resourceType}, ${r.category_name})`).join('\n');
        const categoryList = categories.map(c => `- ${c.name}: ${c.description}`).join('\n');

        return `
You are a mental health recommendation AI. Based on the assessment results below, provide personalized recommendations.

ASSESSMENT RESULTS:
- Dominant Condition: ${dominantCondition}
- Severity Level: ${severityLevel}
- Scores: ${JSON.stringify(scores)}
- User Responses: ${JSON.stringify(responses)}

AVAILABLE RESOURCES:
${resourceTitles}

AVAILABLE CATEGORIES:
${categoryList}

Please provide recommendations in the following JSON format:
{
    "insights": "Brief analysis of the user's mental health state and what they should focus on",
    "immediateActions": [
        "Specific immediate action 1",
        "Specific immediate action 2",
        "Specific immediate action 3"
    ],
    "resourcePriority": [
        {
            "title": "Resource title from the available list",
            "reason": "Why this resource is specifically recommended for this user",
            "urgency": "high|medium|low"
        }
    ],
    "additionalTips": [
        "Personalized tip 1",
        "Personalized tip 2",
        "Personalized tip 3"
    ],
    "warningFlags": "Any concerning patterns or recommendations for professional help if needed"
}

Focus on:
1. Personalization based on specific scores and responses
2. Severity-appropriate recommendations
3. Actionable and practical advice
4. Resource prioritization based on user's specific needs
5. Professional help recommendations if severity is concerning

Respond only with valid JSON.
        `;
    }

    // Parse AI response and handle errors
    parseAIResponse(text) {
        try {
            // Clean up the response to extract JSON
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('No valid JSON found in AI response');
        } catch (error) {
            console.error('Error parsing AI response:', error);
            return this.getFallbackRecommendations();
        }
    }

    // Fallback recommendations when AI fails
    getFallbackRecommendations(dominantCondition = 'general', severityLevel = 'mild') {
        const fallbackMap = {
            anxiety: {
                insights: "Your assessment indicates elevated anxiety levels. Focus on relaxation techniques and stress management.",
                immediateActions: [
                    "Practice deep breathing exercises",
                    "Try progressive muscle relaxation",
                    "Limit caffeine intake"
                ],
                additionalTips: [
                    "Maintain a regular sleep schedule",
                    "Consider journaling your thoughts",
                    "Engage in light physical activity"
                ]
            },
            depression: {
                insights: "Your responses suggest symptoms of depression. Building positive activities and social connections is important.",
                immediateActions: [
                    "Reach out to a trusted friend or family member",
                    "Engage in one enjoyable activity today",
                    "Establish a morning routine"
                ],
                additionalTips: [
                    "Set small, achievable daily goals",
                    "Spend time outdoors when possible",
                    "Consider mindfulness practices"
                ]
            },
            stress: {
                insights: "Your stress levels appear elevated. Focus on stress management and self-care strategies.",
                immediateActions: [
                    "Take breaks throughout your day",
                    "Practice mindfulness meditation",
                    "Organize your priorities"
                ],
                additionalTips: [
                    "Learn to say no to excessive commitments",
                    "Exercise regularly",
                    "Maintain work-life balance"
                ]
            }
        };

        const condition = fallbackMap[dominantCondition] || fallbackMap.anxiety;
        
        return {
            insights: condition.insights,
            immediateActions: condition.immediateActions,
            resourcePriority: [],
            additionalTips: condition.additionalTips,
            warningFlags: severityLevel === 'severe' ? 
                "Your assessment indicates severe symptoms. Please consider speaking with a mental health professional immediately." : 
                null
        };
    }

    // Combine database resources with AI recommendations
    async combineRecommendations(resources, aiRecommendations, severityLevel, dominantCondition) {
        try {
            // Create priority map from AI recommendations
            const priorityMap = new Map();
            if (aiRecommendations.resourcePriority) {
                aiRecommendations.resourcePriority.forEach((rec, index) => {
                    priorityMap.set(rec.title, {
                        priority: index + 1,
                        reason: rec.reason,
                        urgency: rec.urgency
                    });
                });
            }

            // Enhance resources with AI insights
            const enhancedResources = resources.map(resource => {
                const aiInfo = priorityMap.get(resource.title);
                return {
                    ...resource,
                    aiRecommendation: aiInfo ? {
                        priority: aiInfo.priority,
                        reason: aiInfo.reason,
                        urgency: aiInfo.urgency,
                        isAIRecommended: true
                    } : null,
                    relevanceScore: this.calculateRelevanceScore(resource, dominantCondition, severityLevel)
                };
            });

            // Sort by AI priority first, then by relevance score
            return enhancedResources.sort((a, b) => {
                if (a.aiRecommendation && b.aiRecommendation) {
                    return a.aiRecommendation.priority - b.aiRecommendation.priority;
                }
                if (a.aiRecommendation && !b.aiRecommendation) return -1;
                if (!a.aiRecommendation && b.aiRecommendation) return 1;
                return b.relevanceScore - a.relevanceScore;
            });
        } catch (error) {
            console.error('Error combining recommendations:', error);
            return resources;
        }
    }

    // Calculate relevance score for resources
    calculateRelevanceScore(resource, dominantCondition, severityLevel) {
        let score = 0;

        // Base score from resource quality metrics
        score += resource.rating * 20;
        score += Math.min(resource.view_count / 100, 10);
        
        // Severity matching bonus
        if (resource.severity_match === severityLevel) {
            score += 30;
        } else if (resource.severity_match === 'all') {
            score += 15;
        }

        // Featured resource bonus
        if (resource.is_featured) {
            score += 25;
        }

        // Resource type bonuses based on condition
        const typeBonus = {
            anxiety: { article: 10, tool: 15, audio: 20 },
            depression: { article: 15, video: 20, tool: 10 },
            stress: { tool: 20, article: 10, audio: 15 }
        };

        const bonus = typeBonus[dominantCondition]?.[resource.resource_type] || 5;
        score += bonus;

        return score;
    }

    // Categorize recommendations for better organization
    categorizerecommendations(resources) {
        const categories = {};
        
        resources.forEach(resource => {
            const categoryName = resource.category_name || 'Other';
            if (!categories[categoryName]) {
                categories[categoryName] = {
                    name: categoryName,
                    color: resource.category_color || '#6c757d',
                    resources: []
                };
            }
            categories[categoryName].resources.push(resource);
        });

        return Object.values(categories);
    }

    // Get quick emergency resources for severe cases
    async getEmergencyResources() {
        try {
            const resources = await Resource.findAll({
                severity_match: 'severe',
                is_featured: true,
                limit: 5
            });

            return {
                hotlines: [
                    {
                        name: "National Suicide Prevention Lifeline",
                        number: "988",
                        description: "24/7 free and confidential support"
                    },
                    {
                        name: "Crisis Text Line",
                        number: "Text HOME to 741741",
                        description: "24/7 crisis support via text"
                    }
                ],
                resources
            };
        } catch (error) {
            console.error('Error getting emergency resources:', error);
            return {
                hotlines: [],
                resources: []
            };
        }
    }
}

module.exports = RecommendationService;