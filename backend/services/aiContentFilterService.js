const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIContentFilterService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Mental health keywords with weights for better filtering
        this.mentalHealthKeywords = {
            primary: [
                'mental health', 'depression', 'anxiety', 'stress', 'mindfulness',
                'therapy', 'counseling', 'psychological', 'psychiatry', 'wellness',
                'meditation', 'self-care', 'emotional health', 'bipolar', 'PTSD',
                'panic disorder', 'OCD', 'eating disorder', 'addiction recovery',
                'suicide prevention', 'grief counseling', 'trauma therapy'
            ],
            secondary: [
                'coping strategies', 'mental wellness', 'emotional support',
                'stress management', 'relaxation techniques', 'breathing exercises',
                'positive psychology', 'resilience', 'emotional intelligence',
                'work-life balance', 'sleep hygiene', 'social anxiety'
            ],
            therapeutic: [
                'CBT', 'cognitive behavioral therapy', 'DBT', 'EMDR',
                'psychotherapy', 'group therapy', 'family therapy',
                'art therapy', 'music therapy', 'exposure therapy'
            ]
        };

        // Irrelevant content indicators
        this.irrelevantKeywords = [
            'football', 'sports', 'politics', 'business', 'technology',
            'entertainment', 'celebrity', 'movie', 'gaming', 'shopping',
            'travel', 'fashion', 'cooking', 'automotive'
        ];
    }

    // Enhanced news search queries with AI optimization
    generateOptimizedNewsQueries() {
        return [
            // Primary mental health topics
            'mental health support depression anxiety therapy',
            'mindfulness meditation stress relief wellness',
            'psychological counseling emotional health',
            'suicide prevention mental health awareness',
            'PTSD trauma therapy recovery',
            
            // Specific conditions
            'bipolar disorder treatment support',
            'eating disorder recovery mental health',
            'addiction recovery mental wellness',
            'panic disorder anxiety management',
            'OCD obsessive compulsive disorder treatment',
            'social anxiety disorder therapy',
            'seasonal affective disorder SAD',
            
            // Therapeutic approaches
            'cognitive behavioral therapy CBT mental health',
            'group therapy support mental wellness',
            'art therapy music therapy healing',
            'EMDR therapy trauma treatment',
            'dialectical behavior therapy DBT',
            
            // Student-specific
            'student mental health college anxiety',
            'academic stress management university',
            'exam anxiety study stress relief',
            'campus mental health resources',
            
            // Workplace and lifestyle
            'workplace mental health stress',
            'work life balance mental wellness',
            'burnout prevention recovery',
            'digital wellness mental health',
            
            // Research and breakthroughs
            'mental health research breakthrough',
            'new therapy techniques mental health',
            'psychology research depression anxiety',
            'mental health treatment innovation'
        ];
    }

    // Enhanced YouTube search queries
    generateOptimizedVideoQueries() {
        return [
            // Meditation and mindfulness
            'guided meditation anxiety relief',
            'mindfulness exercises stress reduction',
            'breathing techniques panic attacks',
            'body scan meditation relaxation',
            
            // Educational content
            'mental health education awareness',
            'depression understanding symptoms',
            'anxiety coping strategies techniques',
            'therapy explained mental health',
            
            // Wellness practices
            'yoga mental health stress relief',
            'progressive muscle relaxation',
            'sleep meditation anxiety relief',
            'positive affirmations mental wellness',
            
            // Student-focused
            'student mental health tips',
            'study stress management techniques',
            'college anxiety support',
            'academic pressure coping strategies'
        ];
    }

    // Enhanced Spotify search queries for mental health playlists
    generateOptimizedMusicQueries() {
        return [
            // Relaxation and calm
            'meditation music anxiety relief',
            'calming music stress reduction',
            'ambient music relaxation',
            'nature sounds mental wellness',
            
            // Sleep and rest
            'sleep music anxiety relief',
            'bedtime relaxation music',
            'deep sleep meditation music',
            
            // Focus and study
            'focus music anxiety relief',
            'study music stress relief',
            'concentration music mental health',
            
            // Therapy and healing
            'therapy music emotional healing',
            'mental health playlist',
            'healing frequencies anxiety',
            'binaural beats stress relief'
        ];
    }

    // AI-based content relevance scoring
    async scoreContentRelevance(title, description) {
        try {
            const prompt = `
Rate the relevance of this content to mental health support for students on a scale of 0-100:

Title: "${title}"
Description: "${description}"

Consider:
- Mental health topics (depression, anxiety, stress, therapy, wellness)
- Student-specific mental health concerns
- Educational value for mental wellness
- Therapeutic or supportive content
- Exclude: sports, politics, entertainment, unrelated news

Return only a number between 0-100 where:
- 90-100: Highly relevant mental health content
- 70-89: Moderately relevant wellness content  
- 50-69: Somewhat related to mental wellness
- 30-49: Tangentially related
- 0-29: Not relevant to mental health

Score:`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const score = parseInt(response.text().trim());
            
            return isNaN(score) ? 0 : Math.max(0, Math.min(100, score));
        } catch (error) {
            console.error('Error scoring content with AI:', error);
            return this.scoreContentFallback(title, description);
        }
    }

    // Fallback scoring method using keyword matching
    scoreContentFallback(title, description) {
        const text = `${title} ${description}`.toLowerCase();
        let score = 0;

        // Check for irrelevant content first
        for (const keyword of this.irrelevantKeywords) {
            if (text.includes(keyword)) {
                return Math.max(0, score - 30);
            }
        }

        // Primary keywords (high weight)
        for (const keyword of this.mentalHealthKeywords.primary) {
            if (text.includes(keyword)) {
                score += 25;
            }
        }

        // Secondary keywords (medium weight)
        for (const keyword of this.mentalHealthKeywords.secondary) {
            if (text.includes(keyword)) {
                score += 15;
            }
        }

        // Therapeutic keywords (high weight)
        for (const keyword of this.mentalHealthKeywords.therapeutic) {
            if (text.includes(keyword)) {
                score += 20;
            }
        }

        return Math.min(100, score);
    }

    // Filter and rank content based on relevance
    async filterAndRankContent(content, minScore = 50) {
        const scoredContent = [];

        for (const item of content) {
            const score = await this.scoreContentRelevance(
                item.title || '',
                item.description || ''
            );

            if (score >= minScore) {
                scoredContent.push({
                    ...item,
                    relevanceScore: score
                });
            }
        }

        // Sort by relevance score (highest first)
        return scoredContent.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    // Generate AI-enhanced content descriptions
    async enhanceContentDescription(title, originalDescription) {
        try {
            const prompt = `
Enhance this mental health content description to be more informative and supportive:

Title: "${title}"
Original: "${originalDescription}"

Create a brief, empathetic description (max 150 characters) that:
- Highlights mental health benefits
- Uses supportive language
- Indicates target audience (students/young adults)
- Maintains professional tone

Enhanced description:`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const enhanced = response.text().trim().replace(/"/g, '');
            
            return enhanced || originalDescription;
        } catch (error) {
            console.error('Error enhancing description:', error);
            return originalDescription;
        }
    }

    // Generate personalized content recommendations
    async generatePersonalizedRecommendations(userProfile = {}) {
        const { interests = [], concerns = [], preferredContent = [] } = userProfile;
        
        const baseQueries = {
            news: this.generateOptimizedNewsQueries(),
            videos: this.generateOptimizedVideoQueries(),
            music: this.generateOptimizedMusicQueries()
        };

        // Customize queries based on user profile
        if (concerns.includes('anxiety')) {
            baseQueries.news.unshift('anxiety management techniques students');
            baseQueries.videos.unshift('anxiety relief meditation guided');
            baseQueries.music.unshift('anxiety relief calming music');
        }

        if (concerns.includes('depression')) {
            baseQueries.news.unshift('depression support recovery mental health');
            baseQueries.videos.unshift('depression understanding support recovery');
            baseQueries.music.unshift('uplifting music depression support');
        }

        if (concerns.includes('stress')) {
            baseQueries.news.unshift('stress management college students');
            baseQueries.videos.unshift('stress relief techniques mindfulness');
            baseQueries.music.unshift('stress relief meditation music');
        }

        return baseQueries;
    }
}

module.exports = AIContentFilterService;