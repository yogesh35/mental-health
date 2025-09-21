import React, { useState, useEffect } from 'react';

const EnhancedResourcesHub = () => {
    const [newsArticles, setNewsArticles] = useState([]);
    const [youtubeVideos, setYoutubeVideos] = useState([]);
    const [musicPlaylists, setMusicPlaylists] = useState([]);
    const [loadingStates, setLoadingStates] = useState({
        news: true,
        videos: true,
        music: true
    });
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const loadContentProgressively = async () => {
            try {
                setError(null);
                console.log('� Loading content progressively...');

                // Load all content types in parallel with individual loading states
                const loadNews = async () => {
                    try {
                        console.log('📰 Fetching mental health news articles...');
                        const newsResponse = await fetch('http://localhost:5000/api/external/news?limit=25', {
                            timeout: 15000 // 15 second timeout for larger requests
                        });
                        if (newsResponse.ok) {
                            const newsData = await newsResponse.json();
                            if (newsData.success && Array.isArray(newsData.data)) {
                                setNewsArticles(newsData.data);
                                console.log('✅ Loaded news articles:', newsData.data.length);
                            }
                        }
                    } catch (newsError) {
                        console.log('❌ News API failed:', newsError.message);
                        setNewsArticles([]);
                    } finally {
                        setLoadingStates(prev => ({ ...prev, news: false }));
                    }
                };

                const loadVideos = async () => {
                    try {
                        console.log('🎥 Fetching mental health videos...');
                        const videoResponse = await fetch('http://localhost:5000/api/external/videos?limit=20', {
                            timeout: 15000 // 15 second timeout for larger requests
                        });
                        if (videoResponse.ok) {
                            const videoData = await videoResponse.json();
                            if (videoData.success && Array.isArray(videoData.data)) {
                                setYoutubeVideos(videoData.data);
                                console.log('✅ Loaded videos:', videoData.data.length);
                            }
                        }
                    } catch (videoError) {
                        console.log('❌ Video API failed:', videoError.message);
                        setYoutubeVideos([]);
                    } finally {
                        setLoadingStates(prev => ({ ...prev, videos: false }));
                    }
                };

                const loadMusic = async () => {
                    try {
                        console.log('🎵 Fetching mental health music playlists...');
                        const musicResponse = await fetch('http://localhost:5000/api/external/music?limit=15', {
                            timeout: 15000 // 15 second timeout for larger requests
                        });
                        if (musicResponse.ok) {
                            const musicData = await musicResponse.json();
                            if (musicData.success && Array.isArray(musicData.data)) {
                                setMusicPlaylists(musicData.data);
                                console.log('✅ Loaded music:', musicData.data.length);
                            }
                        }
                    } catch (musicError) {
                        console.log('❌ Music API failed:', musicError.message);
                        setMusicPlaylists([]);
                    } finally {
                        setLoadingStates(prev => ({ ...prev, music: false }));
                    }
                };

                // Load all content types simultaneously for faster experience
                Promise.all([loadNews(), loadVideos(), loadMusic()]);

            } catch (err) {
                console.error('Error loading content:', err);
                setError('Failed to load content. Please check your internet connection.');
                setLoadingStates({ news: false, videos: false, music: false });
            }
        };

        loadContentProgressively();
    }, []);

    const renderNewsArticles = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {newsArticles.map((article, index) => (
                <div key={article.id || index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    {article.imageUrl && (
                        <img 
                            src={article.imageUrl} 
                            alt={article.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    )}
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 bg-green-500 text-white">
                                Latest News
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{article.description}</p>
                        </div>
                        <div className="space-y-2">
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                Read Article
                            </a>
                            <div className="text-xs text-gray-500 mt-3">
                                <div>Source: {article.source}</div>
                                <div>Published: {new Date(article.publishedAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderYouTubeVideos = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {youtubeVideos.map((video, index) => (
                <div key={video.id || index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    {video.imageUrl && (
                        <img 
                            src={video.imageUrl} 
                            alt={video.title}
                            className="w-full h-48 object-cover"
                        />
                    )}
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 bg-red-500 text-white">
                                Video Content
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{video.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{video.description}</p>
                        </div>
                        <div className="space-y-2">
                            <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                                Watch Video
                            </a>
                            <div className="text-xs text-gray-500 mt-3">
                                <div>Channel: {video.channelTitle}</div>
                                <div>Published: {new Date(video.publishedAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderMusicPlaylists = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {musicPlaylists.map((playlist, index) => (
                <div key={playlist.id || index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    {playlist.imageUrl && (
                        <img 
                            src={playlist.imageUrl} 
                            alt={playlist.title}
                            className="w-full h-48 object-cover"
                        />
                    )}
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 bg-purple-500 text-white">
                                Music Playlist
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{playlist.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{playlist.description}</p>
                        </div>
                        <div className="space-y-2">
                            <a
                                href={playlist.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                            >
                                Listen on Spotify
                            </a>
                            <div className="text-xs text-gray-500 mt-3">
                                <div>By: {playlist.owner}</div>
                                <div>Tracks: {playlist.trackCount}</div>
                                {playlist.relevanceScore && (
                                    <div>Relevance: {playlist.relevanceScore}%</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const isAnyLoading = loadingStates.news || loadingStates.videos || loadingStates.music;
    const totalResources = newsArticles.length + youtubeVideos.length + musicPlaylists.length;

    const renderLoadingSection = (type, isLoading) => {
        if (!isLoading) return null;
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
                    <span className="ml-3 text-gray-600">Loading {type}...</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Mental Health Resources</h1>
                <p className="text-gray-600 text-center mb-8">
                    Discover the latest mental health news, educational videos, and therapeutic music from trusted sources
                </p>

                {error && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg mb-6 text-center">
                        <h3 className="font-semibold mb-2">Partial Content Load</h3>
                        <p>{error}</p>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg p-1 shadow-md">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                activeTab === 'all' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'text-gray-600 hover:text-purple-600'
                            }`}
                        >
                            All Content ({totalResources})
                        </button>
                        <button
                            onClick={() => setActiveTab('news')}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                activeTab === 'news' 
                                    ? 'bg-green-600 text-white' 
                                    : 'text-gray-600 hover:text-green-600'
                            }`}
                        >
                            Latest News ({newsArticles.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                activeTab === 'videos' 
                                    ? 'bg-red-600 text-white' 
                                    : 'text-gray-600 hover:text-red-600'
                            }`}
                        >
                            Videos ({youtubeVideos.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('music')}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                activeTab === 'music' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'text-gray-600 hover:text-purple-600'
                            }`}
                        >
                            Music ({musicPlaylists.length})
                        </button>
                    </div>
                </div>

                {/* Progressive Loading Indicators and Content Sections */}
                {(activeTab === 'all' || activeTab === 'news') && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            📰 Latest Mental Health News
                        </h2>
                        {loadingStates.news && renderLoadingSection('news articles', true)}
                        {newsArticles.length > 0 && renderNewsArticles()}
                    </div>
                )}

                {(activeTab === 'all' || activeTab === 'videos') && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            🎥 Educational Videos
                        </h2>
                        {loadingStates.videos && renderLoadingSection('videos', true)}
                        {youtubeVideos.length > 0 && renderYouTubeVideos()}
                    </div>
                )}

                {(activeTab === 'all' || activeTab === 'music') && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            🎵 Therapeutic Music Playlists
                        </h2>
                        {loadingStates.music && renderLoadingSection('music playlists', true)}
                        {musicPlaylists.length > 0 && renderMusicPlaylists()}
                    </div>
                )}

                {totalResources === 0 && !isAnyLoading && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg text-center">
                        <h3 className="font-semibold mb-2">No Content Available</h3>
                        <p>Unable to load resources at this time. Please try again later.</p>
                    </div>
                )}

                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>
                        Real-time content: {totalResources} resources | 
                        News: {newsArticles.length} | 
                        Videos: {youtubeVideos.length} |
                        Music: {musicPlaylists.length}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                        All content fetched live from external APIs ✨
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EnhancedResourcesHub;