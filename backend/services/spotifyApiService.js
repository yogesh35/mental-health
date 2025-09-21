const axios = require('axios');
const AIContentFilterService = require('./aiContentFilterService');
const cacheService = require('./cacheService');

class SpotifyApiService {
    constructor() {
        this.clientId = process.env.SPOTIFY_CLIENT_ID;
        this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        this.baseUrl = 'https://api.spotify.com/v1';
        this.authUrl = 'https://accounts.spotify.com/api/token';
        this.fallbackImage = process.env.DEFAULT_AUDIO_IMAGE;
        this.accessToken = null;
        this.tokenExpiry = null;
        this.aiFilter = new AIContentFilterService();
        console.log('Spotify Service initialized with credentials:', this.clientId ? 'Present' : 'Missing');
    }

    async getAccessToken() {
        try {
            if (!this.clientId || !this.clientSecret) {
                console.log('Spotify credentials not configured');
                return null;
            }

            if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
                return this.accessToken;
            }

            const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
            
            const response = await axios.post(this.authUrl, 'grant_type=client_credentials', {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
            return this.accessToken;
        } catch (error) {
            console.error('Error getting Spotify access token:', error.message);
            return null;
        }
    }

    async getMentalHealthPlaylists(limit = 15) {
        const cacheKey = cacheService.generateKey('music', { limit });
        
        // Check cache first
        const cachedPlaylists = cacheService.get(cacheKey);
        if (cachedPlaylists) {
            console.log('Returning cached playlists - instant load!');
            return cachedPlaylists;
        }

        try {
            const token = await this.getAccessToken();
            if (!token) {
                console.log('Spotify API not available, returning enhanced mock data');
                return this.getEnhancedMockPlaylists(limit);
            }

            console.log('Calling Spotify API with AI-optimized queries...');
            
            // Get AI-optimized search queries
            const searchQueries = this.aiFilter.generateOptimizedMusicQueries();
            let allPlaylists = [];

            // Fetch playlists using optimized queries for higher throughput
            const queryLimit = limit > 10 ? 3 : 2; // Use more queries for larger requests
            for (let i = 0; i < Math.min(queryLimit, searchQueries.length); i++) {
                try {
                    const response = await axios.get(`${this.baseUrl}/search`, {
                        params: {
                            q: searchQueries[i],
                            type: 'playlist',
                            limit: Math.ceil(limit / queryLimit * 1.2), // Dynamic playlists per query
                            market: 'US'
                        },
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        timeout: 8000 // Increased timeout for larger requests
                    });

                    if (response.data.playlists && response.data.playlists.items) {
                        allPlaylists = allPlaylists.concat(response.data.playlists.items);
                    }
                } catch (queryError) {
                    console.error(`Error with Spotify query "${searchQueries[i]}":`, queryError.message);
                }
            }

            console.log('Total playlists fetched:', allPlaylists.length);

            // Remove duplicates
            const uniquePlaylists = this.removeDuplicates(allPlaylists);
            console.log('Unique playlists after deduplication:', uniquePlaylists.length);

            // Format playlists
            const formattedPlaylists = this.formatPlaylistData(uniquePlaylists);

            // Filter and rank using AI
            const filteredPlaylists = await this.aiFilter.filterAndRankContent(formattedPlaylists, 40);
            console.log('Playlists after AI filtering:', filteredPlaylists.length);

            // Return top playlists up to limit
            const result = filteredPlaylists.slice(0, limit);
            
            // Cache the result for next time
            cacheService.set(cacheKey, result);
            
            return result;
        } catch (error) {
            console.error('Error fetching Spotify playlists:', error.message);
            return this.getEnhancedMockPlaylists(limit);
        }
    }

    formatPlaylistData(playlists) {
        return playlists
            .filter(playlist => playlist && playlist.id && playlist.name)
            .map(playlist => ({
                id: `spotify_${playlist.id}`,
                title: playlist.name,
                description: playlist.description || 'A curated playlist for mental wellness',
                url: playlist.external_urls?.spotify || '#',
                imageUrl: playlist.images && playlist.images[0]?.url || this.fallbackImage,
                owner: playlist.owner?.display_name || 'Unknown',
                trackCount: playlist.tracks?.total || 0,
                type: 'playlist',
                category: 'mental-health-audio'
            }));
    }

    removeDuplicates(playlists) {
        const seen = new Set();
        return playlists
            .filter(playlist => playlist && playlist.id)
            .filter(playlist => {
                const key = playlist.id;
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            });
    }

    getEnhancedMockPlaylists(limit) {
        const mockPlaylists = [
            {
                id: 'mock_meditation_1',
                name: "Deep Meditation for Student Anxiety Relief",
                description: "Specially curated meditation music to help students manage anxiety and stress during academic challenges.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock1" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Student Wellness Hub" },
                tracks: { total: 45 }
            },
            {
                id: 'mock_focus_1',
                name: "Focus & Study - Mental Clarity Playlist",
                description: "Instrumental and ambient tracks designed to enhance concentration while reducing study-related stress.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock2" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Academic Success" },
                tracks: { total: 60 }
            },
            {
                id: 'mock_sleep_1',
                name: "Better Sleep for Better Mental Health",
                description: "Calming soundscapes and gentle melodies to improve sleep quality and mental wellness for students.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock3" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Sleep & Wellness" },
                tracks: { total: 40 }
            },
            {
                id: 'mock_anxiety_1',
                name: "Anxiety Relief & Emotional Support",
                description: "Therapeutic music and nature sounds specifically chosen to help manage anxiety and promote emotional healing.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock4" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Mental Health Music" },
                tracks: { total: 35 }
            },
            {
                id: 'mock_stress_1',
                name: "Stress Relief for College Life",
                description: "Uplifting and calming music to help students cope with academic pressure and daily stress.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock5" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Campus Wellness" },
                tracks: { total: 50 }
            },
            {
                id: 'mock_mindfulness_1',
                name: "Mindfulness & Present Moment Awareness",
                description: "Gentle, flowing music perfect for mindfulness practice and staying present during challenging times.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock6" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Mindful Living" },
                tracks: { total: 42 }
            },
            {
                id: 'mock_depression_1',
                name: "Hope & Healing - Depression Support",
                description: "Carefully selected songs that offer hope, comfort, and emotional support during difficult periods.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock7" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Healing Hearts" },
                tracks: { total: 38 }
            },
            {
                id: 'mock_morning_1',
                name: "Morning Mental Health Boost",
                description: "Energizing yet calming music to start your day with a positive mental state and clear mind.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock8" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Daily Wellness" },
                tracks: { total: 30 }
            },
            {
                id: 'mock_therapy_1',
                name: "Therapeutic Soundscapes",
                description: "Professional-grade therapeutic music used in counseling sessions and mental health therapy.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock9" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Therapy Music Hub" },
                tracks: { total: 55 }
            },
            {
                id: 'mock_nature_1',
                name: "Nature Sounds for Mental Peace",
                description: "Pure nature recordings including rain, ocean waves, and forest sounds for deep relaxation.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock10" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Nature Therapy" },
                tracks: { total: 25 }
            },
            {
                id: 'mock_binaural_1',
                name: "Binaural Beats for Mental Balance",
                description: "Scientifically designed binaural beats to help with anxiety, depression, and stress management.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock11" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Sound Therapy Lab" },
                tracks: { total: 20 }
            },
            {
                id: 'mock_positivity_1',
                name: "Positive Affirmations & Music",
                description: "Uplifting songs and guided affirmations to boost self-esteem and mental resilience.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock12" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Positive Mind" },
                tracks: { total: 48 }
            },
            {
                id: 'mock_yoga_1',
                name: "Yoga & Mental Wellness Flow",
                description: "Flowing music perfect for yoga practice, stretching, and mind-body wellness activities.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock13" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Yoga for Mind" },
                tracks: { total: 65 }
            },
            {
                id: 'mock_breathwork_1',
                name: "Breathing Exercises & Relaxation",
                description: "Rhythmic music designed to support breathing exercises and relaxation techniques.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock14" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Breathe Easy" },
                tracks: { total: 28 }
            },
            {
                id: 'mock_trauma_1',
                name: "Trauma Recovery & Gentle Healing",
                description: "Soft, nurturing music to support trauma recovery and emotional healing processes.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock15" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Trauma Recovery" },
                tracks: { total: 33 }
            },
            {
                id: 'mock_adhd_1',
                name: "ADHD Focus & Concentration Aid",
                description: "Specially designed music to help individuals with ADHD improve focus and reduce distractions.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock16" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "ADHD Support" },
                tracks: { total: 40 }
            },
            {
                id: 'mock_exam_1',
                name: "Exam Stress Relief & Study Support",
                description: "Calming background music specifically for exam preparation and test anxiety management.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock17" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Study Success" },
                tracks: { total: 52 }
            },
            {
                id: 'mock_grief_1',
                name: "Grief Support & Emotional Healing",
                description: "Gentle, comforting music to support those dealing with loss and grief.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock18" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Grief Support" },
                tracks: { total: 36 }
            },
            {
                id: 'mock_social_1',
                name: "Social Anxiety Relief & Confidence",
                description: "Empowering music to help build confidence and reduce social anxiety in various situations.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock19" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Social Confidence" },
                tracks: { total: 44 }
            },
            {
                id: 'mock_evening_1',
                name: "Evening Wind-Down & Mental Peace",
                description: "Peaceful evening music to help transition from day stress to nighttime relaxation.",
                external_urls: { spotify: "https://open.spotify.com/playlist/mock20" },
                images: [{ url: this.fallbackImage }],
                owner: { display_name: "Evening Peace" },
                tracks: { total: 38 }
            }
        ];

        return this.formatPlaylistData(mockPlaylists.slice(0, limit));
    }

    getMockPlaylists(limit) {
        const mockPlaylists = [
            {
                title: "Calm & Peaceful Meditation",
                description: "Soothing sounds and music for meditation and relaxation",
                url: "https://open.spotify.com/playlist/example1",
                imageUrl: this.fallbackImage,
                owner: "Wellness Music",
                trackCount: 50,
                type: "playlist",
                category: "mental-health-audio"
            },
            {
                title: "Anxiety Relief & Stress Management",
                description: "Carefully selected tracks to help reduce anxiety and manage stress",
                url: "https://open.spotify.com/playlist/example2",
                imageUrl: this.fallbackImage,
                owner: "Mental Health Hub",
                trackCount: 30,
                type: "playlist",
                category: "mental-health-audio"
            },
            {
                title: "Sleep & Relaxation",
                description: "Peaceful music to help you unwind and get better sleep",
                url: "https://open.spotify.com/playlist/example3",
                imageUrl: this.fallbackImage,
                owner: "Sleep Sounds",
                trackCount: 45,
                type: "playlist",
                category: "mental-health-audio"
            }
        ];

        return mockPlaylists.slice(0, limit).map((playlist, index) => ({
            ...playlist,
            id: `mock_playlist_${index}`
        }));
    }
}

module.exports = SpotifyApiService;