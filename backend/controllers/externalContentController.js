const ContentAggregationService = require('../services/contentAggregationService');
const NewsApiService = require('../services/newsApiService');
const YouTubeApiService = require('../services/youtubeApiService');
const SpotifyApiService = require('../services/spotifyApiService');

class ExternalContentController {
    constructor() {
        this.contentService = new ContentAggregationService();
        this.newsService = new NewsApiService();
        this.youtubeService = new YouTubeApiService();
        this.spotifyService = new SpotifyApiService();
    }

    // Get all external content (news, videos, audio)
    async getAllContent(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const content = await this.contentService.getAllMentalHealthContent(limit);
            
            res.json({
                success: true,
                data: content,
                message: 'External content retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getAllContent:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve external content',
                error: error.message
            });
        }
    }

    // Get mental health news articles
    async getNews(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 25;
            const news = await this.newsService.getMentalHealthNews(limit);
            
            res.json({
                success: true,
                data: news,
                message: 'Mental health news retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getNews:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve news',
                error: error.message
            });
        }
    }

    // Get mental health videos with increased count
    async getVideos(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 25;
            const videos = await this.youtubeService.getMentalHealthVideos(limit);
            
            res.json({
                success: true,
                data: videos,
                message: 'Mental health videos retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getVideos:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve videos',
                error: error.message
            });
        }
    }

    // Get mental health music/playlists
    async getMusic(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const playlists = await this.spotifyService.getMentalHealthPlaylists(limit);
            
            res.json({
                success: true,
                data: playlists,
                message: 'Mental health music playlists retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getMusic:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve music playlists',
                error: error.message
            });
        }
    }

    // Get personalized content based on user profile and assessment
    async getPersonalizedContent(req, res) {
        try {
            const { userProfile, assessmentResults } = req.body;
            const limit = parseInt(req.query.limit) || 3;
            
            const content = await this.contentService.getPersonalizedContent(
                userProfile, 
                assessmentResults, 
                limit
            );
            
            res.json({
                success: true,
                data: content,
                message: 'Personalized content retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getPersonalizedContent:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve personalized content',
                error: error.message
            });
        }
    }

    // Get content by specific category
    async getContentByCategory(req, res) {
        try {
            const { category } = req.params;
            const limit = parseInt(req.query.limit) || 10;
            
            const content = await this.contentService.getContentByCategory(category, limit);
            
            res.json({
                success: true,
                data: content,
                message: `${category} content retrieved successfully`
            });
        } catch (error) {
            console.error('Error in getContentByCategory:', error);
            res.status(500).json({
                success: false,
                message: `Failed to retrieve ${req.params.category} content`,
                error: error.message
            });
        }
    }

    // AI Chat endpoint
    async chat(req, res) {
        try {
            const { message, userContext } = req.body;
            
            if (!message) {
                return res.status(400).json({
                    success: false,
                    message: 'Message is required'
                });
            }

            const response = await this.contentService.getChatResponse(message, userContext);
            
            res.json({
                success: true,
                data: {
                    response: response,
                    timestamp: new Date().toISOString()
                },
                message: 'Chat response generated successfully'
            });
        } catch (error) {
            console.error('Error in chat:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate chat response',
                error: error.message
            });
        }
    }

    // Get AI recommendations
    async getRecommendations(req, res) {
        try {
            const { userProfile, assessmentResults } = req.body;
            
            const recommendations = await this.contentService.getRecommendations(
                userProfile, 
                assessmentResults
            );
            
            res.json({
                success: true,
                data: recommendations,
                message: 'AI recommendations generated successfully'
            });
        } catch (error) {
            console.error('Error in getRecommendations:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate recommendations',
                error: error.message
            });
        }
    }
}

module.exports = new ExternalContentController();