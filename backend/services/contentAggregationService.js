const NewsApiService = require('./newsApiService');
const YouTubeApiService = require('./youtubeApiService');
const SpotifyApiService = require('./spotifyApiService');
const EnhancedGeminiService = require('./enhancedGeminiService');
const cacheService = require('./cacheService');

class ContentAggregationService {
    constructor() {
        this.newsService = new NewsApiService();
        this.youtubeService = new YouTubeApiService();
        this.spotifyService = new SpotifyApiService();
        this.geminiService = new EnhancedGeminiService();
    }

    async getAllMentalHealthContent(limit = 50) {
        const cacheKey = cacheService.generateKey('all_content', { limit });
        
        // Check cache first
        const cachedContent = cacheService.get(cacheKey);
        if (cachedContent) {
            console.log('Returning cached content - instant load!');
            return cachedContent;
        }

        try {
            console.log('Fetching fresh content from APIs...');
            
            // Optimized distribution for larger requests
            const newsLimit = Math.ceil(limit * 0.42); // 42% news 
            const videoLimit = Math.ceil(limit * 0.33); // 33% videos
            const musicLimit = Math.ceil(limit * 0.25); // 25% music

            // Dynamic timeout based on request size
            const timeout = limit > 30 ? 25000 : 15000; // Longer timeout for larger requests
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), timeout)
            );

            const results = await Promise.race([
                Promise.allSettled([
                    this.newsService.getMentalHealthNews(newsLimit),
                    this.youtubeService.getMentalHealthVideos(videoLimit),
                    this.spotifyService.getMentalHealthPlaylists(musicLimit)
                ]),
                timeoutPromise
            ]);

            // Extract successful results or fallback to empty arrays
            const news = results[0].status === 'fulfilled' ? results[0].value : [];
            const videos = results[1].status === 'fulfilled' ? results[1].value : [];
            const playlists = results[2].status === 'fulfilled' ? results[2].value : [];

            // Log any failures
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    const serviceName = ['News', 'YouTube', 'Spotify'][index];
                    console.error(`${serviceName} service failed:`, result.reason);
                }
            });

            const content = {
                articles: news,
                videos: videos,
                audio: playlists,
                totalItems: news.length + videos.length + playlists.length
            };

            // Cache the result for next time
            cacheService.set(cacheKey, content);

            return content;
        } catch (error) {
            console.error('Error aggregating content:', error.message);
            
            // Return fallback content if everything fails
            const fallbackContent = {
                articles: [],
                videos: [],
                audio: [],
                totalItems: 0
            };
        }
    }

    async getPersonalizedContent(userProfile, assessmentResults, limit = 3) {
        try {
            // Get all content
            const allContent = await this.getAllMentalHealthContent(limit);
            
            // Get AI recommendations
            const aiRecommendations = await this.geminiService.generatePersonalizedRecommendations(
                userProfile, 
                assessmentResults, 
                this.formatResourcesForAI(allContent)
            );

            return {
                ...allContent,
                aiRecommendations,
                personalized: true
            };
        } catch (error) {
            console.error('Error getting personalized content:', error.message);
            return await this.getAllMentalHealthContent(limit);
        }
    }

    formatResourcesForAI(content) {
        const resources = [];
        
        content.articles.forEach(article => {
            resources.push({
                title: article.title,
                type: 'article',
                description: article.description
            });
        });

        content.videos.forEach(video => {
            resources.push({
                title: video.title,
                type: 'video',
                description: video.description
            });
        });

        content.audio.forEach(playlist => {
            resources.push({
                title: playlist.title,
                type: 'audio',
                description: playlist.description
            });
        });

        return resources;
    }

    async getContentByCategory(category, limit = 10) {
        switch (category.toLowerCase()) {
            case 'articles':
            case 'news':
                return {
                    type: 'articles',
                    items: await this.newsService.getMentalHealthNews(limit)
                };
            case 'videos':
                return {
                    type: 'videos',
                    items: await this.youtubeService.getMentalHealthVideos(limit)
                };
            case 'audio':
            case 'music':
            case 'playlists':
                return {
                    type: 'audio',
                    items: await this.spotifyService.getMentalHealthPlaylists(limit)
                };
            default:
                return await this.getAllMentalHealthContent(limit);
        }
    }

    async getChatResponse(message, userContext = {}) {
        return await this.geminiService.generateChatResponse(message, userContext);
    }

    async getRecommendations(userProfile, assessmentResults) {
        return await this.geminiService.generatePersonalizedRecommendations(
            userProfile,
            assessmentResults,
            []
        );
    }
}

module.exports = ContentAggregationService;