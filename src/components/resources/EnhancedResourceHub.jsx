import React, { useState, useEffect } from 'react';
import ResourceCard from './ResourceCard';
import externalContentAPI from '../../services/externalContentAPI';
import resourceAPI from '../../services/resourceAPI';
import './ResourceHub.css';
import './EnhancedResourceHub.css';

const EnhancedResourceHub = () => {
    const [resources, setResources] = useState([]);
    const [externalContent, setExternalContent] = useState({
        articles: [],
        videos: [],
        audio: []
    });
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAllContent();
    }, []);

    const loadAllContent = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load database resources and external content in parallel
            const [dbResources, extContent] = await Promise.all([
                resourceAPI.getAllResources(),
                externalContentAPI.getAllContent(5)
            ]);

            if (dbResources) {
                setResources(dbResources);
            }

            if (extContent) {
                setExternalContent(extContent);
            }

            // Load AI recommendations
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const assessmentResults = JSON.parse(localStorage.getItem('latestAssessment') || '{}');
            
            if (Object.keys(userProfile).length > 0 || Object.keys(assessmentResults).length > 0) {
                const aiRecommendations = await externalContentAPI.getRecommendations(
                    userProfile, 
                    assessmentResults
                );
                setRecommendations(aiRecommendations);
            }

        } catch (error) {
            console.error('Error loading content:', error);
            setError('Failed to load content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'database':
                return (
                    <div className="resource-grid">
                        {resources.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                );
            
            case 'articles':
                return (
                    <div className="external-content-grid">
                        {externalContent.articles.map((article) => (
                            <div key={article.id} className="external-content-card">
                                <img 
                                    src={article.imageUrl} 
                                    alt={article.title}
                                    className="content-image"
                                />
                                <div className="content-info">
                                    <h3>{article.title}</h3>
                                    <p>{article.description}</p>
                                    <div className="content-meta">
                                        <span className="source">{article.source}</span>
                                        <span className="date">{new Date(article.publishedAt).toLocaleDateString()}</span>
                                    </div>
                                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more-btn">
                                        Read Article
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            
            case 'videos':
                return (
                    <div className="external-content-grid">
                        {externalContent.videos.map((video) => (
                            <div key={video.id} className="external-content-card">
                                <img 
                                    src={video.imageUrl} 
                                    alt={video.title}
                                    className="content-image"
                                />
                                <div className="content-info">
                                    <h3>{video.title}</h3>
                                    <p>{video.description}</p>
                                    <div className="content-meta">
                                        <span className="source">{video.channelTitle}</span>
                                    </div>
                                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="watch-btn">
                                        Watch Video
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            
            case 'audio':
                return (
                    <div className="external-content-grid">
                        {externalContent.audio.map((audio) => (
                            <div key={audio.id} className="external-content-card">
                                <img 
                                    src={audio.imageUrl} 
                                    alt={audio.title}
                                    className="content-image"
                                />
                                <div className="content-info">
                                    <h3>{audio.title}</h3>
                                    <p>{audio.description}</p>
                                    <div className="content-meta">
                                        <span className="source">{audio.owner}</span>
                                        <span className="track-count">{audio.trackCount} tracks</span>
                                    </div>
                                    <a href={audio.url} target="_blank" rel="noopener noreferrer" className="listen-btn">
                                        Listen on Spotify
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            
            default:
                return (
                    <div className="all-content">
                        <div className="section">
                            <h3>Featured Resources</h3>
                            <div className="resource-grid">
                                {resources.slice(0, 3).map((resource) => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))}
                            </div>
                        </div>
                        
                        <div className="section">
                            <h3>Latest Articles</h3>
                            <div className="external-content-grid">
                                {externalContent.articles.slice(0, 2).map((article) => (
                                    <div key={article.id} className="external-content-card compact">
                                        <img src={article.imageUrl} alt={article.title} className="content-image" />
                                        <div className="content-info">
                                            <h4>{article.title}</h4>
                                            <p>{article.description.substring(0, 100)}...</p>
                                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more-btn">
                                                Read More
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="section">
                            <h3>Recommended Videos</h3>
                            <div className="external-content-grid">
                                {externalContent.videos.slice(0, 2).map((video) => (
                                    <div key={video.id} className="external-content-card compact">
                                        <img src={video.imageUrl} alt={video.title} className="content-image" />
                                        <div className="content-info">
                                            <h4>{video.title}</h4>
                                            <p>{video.description.substring(0, 100)}...</p>
                                            <a href={video.url} target="_blank" rel="noopener noreferrer" className="watch-btn">
                                                Watch
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="resource-hub">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading resources...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="resource-hub">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={loadAllContent} className="retry-btn">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="resource-hub enhanced">
            <div className="hub-header">
                <h1>Mental Health Resource Hub</h1>
                <p>Comprehensive resources from multiple sources to support your mental wellness journey</p>
            </div>

            {recommendations && (
                <div className="ai-recommendations">
                    <h2>Personalized Recommendations</h2>
                    <div className="recommendations-grid">
                        {recommendations.recommendations?.map((rec, index) => (
                            <div key={index} className={`recommendation-card ${rec.priority}`}>
                                <h4>{rec.title}</h4>
                                <p>{rec.reason}</p>
                                <span className="priority-badge">{rec.priority} priority</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="content-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Resources
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'database' ? 'active' : ''}`}
                    onClick={() => setActiveTab('database')}
                >
                    Database Resources ({resources.length})
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('articles')}
                >
                    Articles ({externalContent.articles.length})
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('videos')}
                >
                    Videos ({externalContent.videos.length})
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
                    onClick={() => setActiveTab('audio')}
                >
                    Audio ({externalContent.audio.length})
                </button>
            </div>

            <div className="content-container">
                {renderTabContent()}
            </div>

            <div className="content-stats">
                <div className="stat">
                    <span className="stat-number">{resources.length}</span>
                    <span className="stat-label">Database Resources</span>
                </div>
                <div className="stat">
                    <span className="stat-number">{externalContent.articles.length}</span>
                    <span className="stat-label">Latest Articles</span>
                </div>
                <div className="stat">
                    <span className="stat-number">{externalContent.videos.length}</span>
                    <span className="stat-label">Video Resources</span>
                </div>
                <div className="stat">
                    <span className="stat-number">{externalContent.audio.length}</span>
                    <span className="stat-label">Audio Playlists</span>
                </div>
            </div>
        </div>
    );
};

export default EnhancedResourceHub;