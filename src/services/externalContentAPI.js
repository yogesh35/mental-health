const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ExternalContentAPI {
    constructor() {
        this.baseURL = `${API_BASE_URL}/external`;
    }

    // Helper method to get auth headers
    getAuthHeaders() {
        // Temporarily disable authentication for external content
        return {};
        // const token = localStorage.getItem('descope-token') || sessionStorage.getItem('descope-token');
        // return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    // Get all external content (news, videos, audio)
    async getAllContent(limit = 5) {
        try {
            const response = await fetch(`${this.baseURL}/all?limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders()
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error fetching external content:', error);
            return this.getMockContent(limit);
        }
    }

    // Get personalized content based on user profile and assessment
    async getPersonalizedContent(userProfile, assessmentResults, limit = 3) {
        try {
            const response = await fetch(`${this.baseURL}/personalized?limit=${limit}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders()
                },
                body: JSON.stringify({
                    userProfile,
                    assessmentResults
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error fetching personalized content:', error);
            return await this.getAllContent(limit);
        }
    }

    // Get content by category
    async getContentByCategory(category, limit = 10) {
        try {
            const response = await fetch(`${this.baseURL}/category/${category}?limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders()
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error(`Error fetching ${category} content:`, error);
            return this.getMockCategoryContent(category, limit);
        }
    }

    // Chat with AI
    async chat(message, userContext = {}) {
        try {
            const response = await fetch(`${this.baseURL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders()
                },
                body: JSON.stringify({
                    message,
                    userContext
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.success ? data.data.response : "I'm here to help with mental health support. How are you feeling today?";
        } catch (error) {
            console.error('Error in chat:', error);
            return "I'm experiencing some technical difficulties. Please try again later or consider speaking with a mental health professional if you need immediate support.";
        }
    }

    // Get AI recommendations
    async getRecommendations(userProfile, assessmentResults) {
        try {
            const response = await fetch(`${this.baseURL}/recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders()
                },
                body: JSON.stringify({
                    userProfile,
                    assessmentResults
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return this.getMockRecommendations();
        }
    }

    // Mock data for fallback
    getMockContent(limit) {
        return {
            articles: [
                {
                    id: 'mock_article_1',
                    title: 'Understanding Mental Health in the Digital Age',
                    description: 'Exploring how technology impacts our mental well-being...',
                    url: '#',
                    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
                    publishedAt: new Date().toISOString(),
                    source: 'Mental Health Today',
                    type: 'article',
                    category: 'mental-health-news'
                }
            ].slice(0, limit),
            videos: [
                {
                    id: 'mock_video_1',
                    title: '10 Minute Guided Meditation for Stress Relief',
                    description: 'A calming meditation session to help reduce stress...',
                    url: '#',
                    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=480&h=360&fit=crop',
                    type: 'video',
                    category: 'mental-health-videos'
                }
            ].slice(0, limit),
            audio: [
                {
                    id: 'mock_audio_1',
                    title: 'Relaxing Sounds for Better Sleep',
                    description: 'Peaceful audio content for relaxation and sleep...',
                    url: '#',
                    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
                    type: 'playlist',
                    category: 'mental-health-audio'
                }
            ].slice(0, limit),
            totalItems: limit * 3
        };
    }

    getMockCategoryContent(category, limit) {
        const mockContent = this.getMockContent(limit);
        
        switch (category.toLowerCase()) {
            case 'articles':
            case 'news':
                return {
                    type: 'articles',
                    items: mockContent.articles
                };
            case 'videos':
                return {
                    type: 'videos',
                    items: mockContent.videos
                };
            case 'audio':
            case 'music':
            case 'playlists':
                return {
                    type: 'audio',
                    items: mockContent.audio
                };
            default:
                return mockContent;
        }
    }

    getMockRecommendations() {
        return {
            recommendations: [
                {
                    type: "resource",
                    title: "Mindfulness Meditation",
                    reason: "Regular meditation can help reduce stress and anxiety",
                    priority: "high"
                },
                {
                    type: "resource",
                    title: "Physical Exercise",
                    reason: "Exercise releases endorphins that improve mood",
                    priority: "medium"
                }
            ],
            copingStrategies: [
                "Practice deep breathing exercises",
                "Maintain a regular sleep schedule",
                "Connect with supportive friends and family"
            ],
            dailyActivities: [
                "10-minute morning meditation",
                "30-minute walk or exercise",
                "Evening journaling"
            ],
            professionalHelp: "Consider speaking with a mental health professional for personalized support"
        };
    }
}

export default new ExternalContentAPI();