const axios = require('axios');
const AIContentFilterService = require('./aiContentFilterService');
const cacheService = require('./cacheService');

class NewsApiService {
    constructor() {
        this.apiKey = process.env.NEWS_API_KEY;
        this.baseUrl = 'https://newsapi.org/v2';
        this.fallbackImage = process.env.DEFAULT_ARTICLE_IMAGE;
        this.aiFilter = new AIContentFilterService();
        console.log('NewsAPI Service initialized with API key:', this.apiKey ? 'Present' : 'Missing');
    }

    async getMentalHealthNews(limit = 20) {
        const cacheKey = cacheService.generateKey('news', { limit });
        
        // Check cache first
        const cachedNews = cacheService.get(cacheKey);
        if (cachedNews) {
            console.log('Returning cached news - instant load!');
            return cachedNews;
        }

        try {
            console.log('getMentalHealthNews called with limit:', limit);
            console.log('API Key available:', this.apiKey ? 'Yes' : 'No');
            
            if (!this.apiKey) {
                console.log('NewsAPI key not configured, returning enhanced mock data');
                return this.getEnhancedMockNews(limit);
            }

            console.log('Calling NewsAPI with AI-optimized queries...');
            
            // Get AI-optimized search queries
            const searchQueries = this.aiFilter.generateOptimizedNewsQueries();
            let allArticles = [];

            // Fetch articles using optimized queries for higher throughput
            const queryLimit = limit > 15 ? 4 : 3; // Use more queries for larger requests
            for (let i = 0; i < Math.min(queryLimit, searchQueries.length); i++) {
                try {
                    const response = await axios.get(`${this.baseUrl}/everything`, {
                        params: {
                            q: searchQueries[i],
                            language: 'en',
                            sortBy: 'relevance',
                            pageSize: Math.ceil(limit / queryLimit * 1.5), // Dynamic page size based on request
                            apiKey: this.apiKey,
                            domains: 'psychologytoday.com,healthline.com,verywellmind.com,mentalhealth.gov,nami.org,mayoclinic.com'
                        },
                        timeout: 8000 // Increased timeout for larger requests
                    });

                    if (response.data.articles) {
                        allArticles = allArticles.concat(response.data.articles);
                    }
                } catch (queryError) {
                    console.error(`Error with query "${searchQueries[i]}":`, queryError.message);
                }
            }

            console.log('Total articles fetched:', allArticles.length);

            // Remove duplicates
            const uniqueArticles = this.removeDuplicates(allArticles);
            console.log('Unique articles after deduplication:', uniqueArticles.length);

            // Format articles
            const formattedArticles = this.formatNewsData(uniqueArticles);

            // Filter and rank using AI
            const filteredArticles = await this.aiFilter.filterAndRankContent(formattedArticles, 60);
            console.log('Articles after AI filtering:', filteredArticles.length);

            // Return top articles up to limit
            const result = filteredArticles.slice(0, limit);
            
            // Cache the result for next time
            cacheService.set(cacheKey, result);
            
            return result;
        } catch (error) {
            console.error('Error fetching news:', error.message);
            return this.getEnhancedMockNews(limit);
        }
    }

    formatNewsData(articles) {
        return articles.map(article => ({
            id: `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: article.title,
            description: article.description || article.content?.substring(0, 200) + '...',
            url: article.url,
            imageUrl: article.urlToImage || this.fallbackImage,
            publishedAt: article.publishedAt,
            source: article.source.name,
            type: 'article',
            category: 'mental-health-news'
        }));
    }

    removeDuplicates(articles) {
        const seen = new Set();
        return articles.filter(article => {
            const key = article.title || article.url;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    getEnhancedMockNews(limit) {
        const mockArticles = [
            {
                title: "New Study Shows Mindfulness Meditation Reduces Student Anxiety by 40%",
                description: "Researchers at Stanford University found that students who practiced mindfulness meditation for 8 weeks showed significant reductions in anxiety and improved academic performance.",
                url: "https://example.com/mindfulness-study",
                imageUrl: this.fallbackImage,
                publishedAt: new Date().toISOString(),
                source: { name: "Psychology Today" },
                relevanceScore: 95
            },
            {
                title: "College Mental Health Crisis: New Resources and Support Systems",
                description: "Universities nationwide are implementing innovative mental health programs to address the growing crisis among college students, including peer support networks and 24/7 counseling services.",
                url: "https://example.com/college-mental-health",
                imageUrl: this.fallbackImage,
                publishedAt: new Date().toISOString(),
                source: { name: "Mental Health America" },
                relevanceScore: 92
            },
            {
                title: "Cognitive Behavioral Therapy Apps Show Promise for Young Adults",
                description: "Digital mental health interventions are proving effective for treating depression and anxiety in college-aged students, offering accessible alternatives to traditional therapy.",
                url: "https://example.com/cbt-apps",
                imageUrl: this.fallbackImage,
                publishedAt: new Date().toISOString(),
                source: { name: "Journal of Medical Internet Research" },
                relevanceScore: 88
            },
            {
                title: "Sleep Hygiene and Mental Health: Essential Tips for Students",
                description: "Mental health experts share evidence-based strategies for improving sleep quality, which directly impacts mood, anxiety levels, and academic performance in students.",
                url: "https://example.com/sleep-mental-health",
                imageUrl: this.fallbackImage,
                publishedAt: new Date().toISOString(),
                source: { name: "Harvard Health Publishing" },
                relevanceScore: 85
            },
            {
                title: "Breaking the Stigma: Mental Health Awareness Week on Campus",
                description: "Student organizations are leading campus-wide initiatives to normalize conversations about mental health and encourage help-seeking behavior among peers.",
                url: "https://example.com/stigma-awareness",
                imageUrl: this.fallbackImage,
                publishedAt: new Date().toISOString(),
                source: { name: "Campus Mental Health" },
                relevanceScore: 82
            }
        ];

        return this.formatNewsData(mockArticles.slice(0, limit));
    }

    getMockNews(limit) {
        const mockArticles = [
            {
                title: "Understanding Anxiety: A Comprehensive Guide",
                description: "Learn about anxiety disorders, their symptoms, and effective coping strategies for better mental health.",
                url: "https://example.com/anxiety-guide",
                imageUrl: this.fallbackImage,
                publishedAt: new Date().toISOString(),
                source: "Mental Health Today",
                type: "article",
                category: "mental-health-news"
            },
            {
                title: "The Benefits of Mindfulness Meditation",
                description: "Discover how mindfulness meditation can reduce stress and improve overall well-being.",
                url: "https://example.com/mindfulness",
                imageUrl: this.fallbackImage,
                publishedAt: new Date(Date.now() - 3600000).toISOString(),
                source: "Wellness Weekly",
                type: "article",
                category: "mental-health-news"
            },
            {
                title: "Recognizing Signs of Depression",
                description: "Important information about identifying depression symptoms and seeking professional help.",
                url: "https://example.com/depression-signs",
                imageUrl: this.fallbackImage,
                publishedAt: new Date(Date.now() - 7200000).toISOString(),
                source: "Health Central",
                type: "article",
                category: "mental-health-news"
            }
        ];

        return mockArticles.slice(0, limit).map((article, index) => ({
            ...article,
            id: `mock_news_${index}`
        }));
    }
}

module.exports = NewsApiService;