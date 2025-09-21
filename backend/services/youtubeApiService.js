const axios = require('axios');
const AIContentFilterService = require('./aiContentFilterService');
const cacheService = require('./cacheService');

class YouTubeApiService {
    constructor() {
        this.apiKey = process.env.YOUTUBE_API_KEY;
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
        this.fallbackImage = process.env.DEFAULT_VIDEO_IMAGE;
        this.aiFilter = new AIContentFilterService();
        console.log('YouTube Service initialized with API key:', this.apiKey ? 'Present' : 'Missing');
    }

    async getMentalHealthVideos(limit = 15) {
        const cacheKey = cacheService.generateKey('videos', { limit });
        
        // Check cache first
        const cachedVideos = cacheService.get(cacheKey);
        if (cachedVideos) {
            console.log('Returning cached videos - instant load!');
            return cachedVideos;
        }

        try {
            console.log('getMentalHealthVideos called with limit:', limit);
            console.log('YouTube API Key available:', this.apiKey ? 'Yes' : 'No');
            
            if (!this.apiKey) {
                console.log('YouTube API key not configured, returning enhanced mock data');
                return this.getEnhancedMockVideos(limit);
            }

            console.log('Calling YouTube API with AI-optimized queries...');
            
            // Get AI-optimized search queries
            const searchQueries = this.aiFilter.generateOptimizedVideoQueries();
            let allVideos = [];

            // Fetch videos using optimized queries for higher throughput
            const queryLimit = limit > 12 ? 6 : 4; // Use more queries for larger requests
            for (let i = 0; i < Math.min(queryLimit, searchQueries.length); i++) {
                try {
                    const response = await axios.get(`${this.baseUrl}/search`, {
                        params: {
                            part: 'snippet',
                            q: searchQueries[i],
                            type: 'video',
                            order: 'relevance',
                            maxResults: Math.ceil(limit / queryLimit * 1.3), // Dynamic results per query
                            key: this.apiKey,
                            videoDuration: 'medium',
                            safeSearch: 'strict'
                        },
                        timeout: 8000 // Increased timeout for larger requests
                    });

                    if (response.data.items) {
                        allVideos = allVideos.concat(response.data.items);
                    }
                } catch (queryError) {
                    console.error(`Error with query "${searchQueries[i]}":`, queryError.message);
                }
            }

            console.log('Total videos fetched:', allVideos.length);

            // Remove duplicates
            const uniqueVideos = this.removeDuplicates(allVideos);
            console.log('Unique videos after deduplication:', uniqueVideos.length);

            // Format videos
            const formattedVideos = this.formatVideoData(uniqueVideos);

            // Filter and rank using AI
            const filteredVideos = await this.aiFilter.filterAndRankContent(formattedVideos, 50);
            console.log('Videos after AI filtering:', filteredVideos.length);

            // Return top videos up to limit
            const result = filteredVideos.slice(0, limit);
            
            // Cache the result for next time
            cacheService.set(cacheKey, result);
            
            return result;
        } catch (error) {
            console.error('Error fetching YouTube videos:', error.message);
            return this.getEnhancedMockVideos(limit);
        }
    }

    formatVideoData(videos) {
        return videos.map(video => ({
            id: `youtube_${video.id.videoId}`,
            title: video.snippet.title,
            description: video.snippet.description.substring(0, 200) + '...',
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            embedUrl: `https://www.youtube.com/embed/${video.id.videoId}`,
            imageUrl: video.snippet.thumbnails.medium?.url || this.fallbackImage,
            publishedAt: video.snippet.publishedAt,
            channelTitle: video.snippet.channelTitle,
            type: 'video',
            category: 'mental-health-videos'
        }));
    }

    removeDuplicates(videos) {
        const seen = new Set();
        return videos.filter(video => {
            const key = video.id.videoId;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    getEnhancedMockVideos(limit) {
        const mockVideos = [
            {
                id: { videoId: 'mock_meditation_1' },
                snippet: {
                    title: "10-Minute Guided Meditation for Anxiety Relief - Perfect for Students",
                    description: "A calming guided meditation specifically designed to help students manage anxiety and stress. Features breathing techniques and mindfulness practices that can be done anywhere on campus.",
                    thumbnails: { medium: { url: this.fallbackImage } },
                    publishedAt: new Date().toISOString(),
                    channelTitle: "Student Wellness Center"
                }
            },
            {
                id: { videoId: 'mock_cbt_1' },
                snippet: {
                    title: "Understanding Depression: A Student's Guide to Cognitive Behavioral Therapy",
                    description: "Mental health professionals explain CBT techniques that college students can use to manage depression. Includes practical exercises and real-world applications for academic stress.",
                    thumbnails: { medium: { url: this.fallbackImage } },
                    publishedAt: new Date().toISOString(),
                    channelTitle: "Psychology Education Hub"
                }
            },
            {
                id: { videoId: 'mock_stress_1' },
                snippet: {
                    title: "5-Minute Stress Relief Techniques for Exam Season",
                    description: "Quick and effective stress management techniques that students can use during exam periods. Includes breathing exercises, progressive muscle relaxation, and mindfulness tips.",
                    thumbnails: { medium: { url: this.fallbackImage } },
                    publishedAt: new Date().toISOString(),
                    channelTitle: "Campus Mental Health"
                }
            },
            {
                id: { videoId: 'mock_sleep_1' },
                snippet: {
                    title: "Sleep Meditation for Better Mental Health - Student Edition",
                    description: "A soothing sleep meditation designed to help students improve sleep quality and mental wellness. Perfect for dealing with insomnia and racing thoughts before bedtime.",
                    thumbnails: { medium: { url: this.fallbackImage } },
                    publishedAt: new Date().toISOString(),
                    channelTitle: "Wellness for Students"
                }
            },
            {
                id: { videoId: 'mock_mindfulness_1' },
                snippet: {
                    title: "Daily Mindfulness Practice for College Students",
                    description: "Learn how to incorporate mindfulness into your daily routine as a student. Covers techniques for staying present during lectures, studying, and social situations.",
                    thumbnails: { medium: { url: this.fallbackImage } },
                    publishedAt: new Date().toISOString(),
                    channelTitle: "Mindful Campus Life"
                }
            }
        ];

        return this.formatVideoData(mockVideos.slice(0, limit));
    }

    getMockVideos(limit) {
        const mockVideos = [
            {
                title: "10 Minute Guided Meditation for Anxiety Relief",
                description: "A calming guided meditation session designed to help reduce anxiety and promote relaxation.",
                url: "https://www.youtube.com/watch?v=example1",
                embedUrl: "https://www.youtube.com/embed/example1",
                imageUrl: this.fallbackImage,
                publishedAt: new Date().toISOString(),
                channelTitle: "Mindful Living",
                type: "video",
                category: "mental-health-videos"
            },
            {
                title: "Breathing Exercises for Stress Management",
                description: "Learn effective breathing techniques to manage stress and improve mental well-being.",
                url: "https://www.youtube.com/watch?v=example2",
                embedUrl: "https://www.youtube.com/embed/example2",
                imageUrl: this.fallbackImage,
                publishedAt: new Date(Date.now() - 3600000).toISOString(),
                channelTitle: "Wellness Guide",
                type: "video",
                category: "mental-health-videos"
            },
            {
                title: "Understanding Depression: Expert Insights",
                description: "Mental health professionals discuss depression, its symptoms, and treatment options.",
                url: "https://www.youtube.com/watch?v=example3",
                embedUrl: "https://www.youtube.com/embed/example3",
                imageUrl: this.fallbackImage,
                publishedAt: new Date(Date.now() - 7200000).toISOString(),
                channelTitle: "Mental Health Hub",
                type: "video",
                category: "mental-health-videos"
            }
        ];

        return mockVideos.slice(0, limit).map((video, index) => ({
            ...video,
            id: `mock_video_${index}`
        }));
    }
}

module.exports = YouTubeApiService;