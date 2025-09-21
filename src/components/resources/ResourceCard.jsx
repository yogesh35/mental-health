import React, { useState } from 'react';
import { Heart, Star, Clock, ExternalLink, Download, Eye } from 'lucide-react';
import resourceAPI from '../../services/resourceAPI';
import './ResourceCard.css';

const ResourceCard = ({ 
    resource, 
    onFavoriteToggle, 
    onRatingChange, 
    showAIRecommendation = false,
    compact = false 
}) => {
    const [isFavorited, setIsFavorited] = useState(resource.isFavorited || false);
    const [userRating, setUserRating] = useState(resource.userRating || 0);
    const [isLoading, setIsLoading] = useState(false);

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        
        try {
            const response = await resourceAPI.toggleFavorite(resource.id);
            const newFavoriteStatus = response.data.isFavorited;
            setIsFavorited(newFavoriteStatus);
            
            if (onFavoriteToggle) {
                onFavoriteToggle(resource.id, newFavoriteStatus);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRatingClick = async (rating, e) => {
        e.stopPropagation();
        
        try {
            await resourceAPI.rateResource(resource.id, rating);
            setUserRating(rating);
            
            if (onRatingChange) {
                onRatingChange(resource.id, rating);
            }
        } catch (error) {
            console.error('Error rating resource:', error);
        }
    };

    const handleResourceClick = () => {
        // Track view
        resourceAPI.trackView(resource.id);
        
        // Open resource
        if (resource.url) {
            window.open(resource.url, '_blank');
        }
    };

    const handleDownload = async (e) => {
        e.stopPropagation();
        
        try {
            await resourceAPI.trackDownload(resource.id);
            if (resource.file_path) {
                // Handle file download
                const link = document.createElement('a');
                link.href = resource.file_path;
                link.download = true;
                link.click();
            }
        } catch (error) {
            console.error('Error downloading resource:', error);
        }
    };

    const getResourceTypeIcon = (type) => {
        const icons = {
            article: '📄',
            video: '🎥',
            audio: '🎵',
            pdf: '📋',
            link: '🔗',
            tool: '🛠️'
        };
        return icons[type] || '📄';
    };

    const formatDuration = (minutes) => {
        if (!minutes) return null;
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    const getDifficultyColor = (level) => {
        const colors = {
            beginner: '#28a745',
            intermediate: '#ffc107',
            advanced: '#dc3545'
        };
        return colors[level] || '#6c757d';
    };

    const renderStars = (rating, interactive = false) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                size={16}
                className={`star ${index < rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
                fill={index < rating ? '#ffc107' : 'none'}
                color={index < rating ? '#ffc107' : '#e0e0e0'}
                onClick={interactive ? (e) => handleRatingClick(index + 1, e) : undefined}
                style={{ cursor: interactive ? 'pointer' : 'default' }}
            />
        ));
    };

    return (
        <div 
            className={`resource-card ${compact ? 'compact' : ''} ${showAIRecommendation && resource.aiRecommendation ? 'ai-recommended' : ''}`}
            onClick={handleResourceClick}
        >
            {showAIRecommendation && resource.aiRecommendation && (
                <div className="ai-recommendation-badge">
                    <span className="ai-icon">🤖</span>
                    AI Recommended
                </div>
            )}

            {resource.is_featured && (
                <div className="featured-badge">
                    ⭐ Featured
                </div>
            )}

            <div className="resource-header">
                <div className="resource-type">
                    <span className="type-icon">{getResourceTypeIcon(resource.resource_type)}</span>
                    <span className="type-text">{resource.resource_type}</span>
                </div>

                <div className="resource-actions">
                    <button
                        className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
                        onClick={handleFavoriteClick}
                        disabled={isLoading}
                        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <Heart size={18} fill={isFavorited ? '#e74c3c' : 'none'} />
                    </button>
                </div>
            </div>

            {resource.image_url && (
                <div className="resource-image">
                    <img src={resource.image_url} alt={resource.title} />
                </div>
            )}

            <div className="resource-content">
                <h3 className="resource-title">{resource.title}</h3>
                
                {resource.author && (
                    <p className="resource-author">by {resource.author}</p>
                )}

                <p className="resource-description">{resource.description}</p>

                {showAIRecommendation && resource.aiRecommendation?.reason && (
                    <div className="ai-recommendation-reason">
                        <strong>Why this helps:</strong> {resource.aiRecommendation.reason}
                    </div>
                )}

                <div className="resource-meta">
                    {resource.category_name && (
                        <span 
                            className="category-tag"
                            style={{ backgroundColor: resource.category_color }}
                        >
                            {resource.category_name}
                        </span>
                    )}

                    <span 
                        className="difficulty-tag"
                        style={{ backgroundColor: getDifficultyColor(resource.difficulty_level) }}
                    >
                        {resource.difficulty_level}
                    </span>

                    {resource.duration_minutes && (
                        <span className="duration-tag">
                            <Clock size={12} />
                            {formatDuration(resource.duration_minutes)}
                        </span>
                    )}
                </div>

                <div className="resource-stats">
                    <div className="rating-section">
                        <div className="stars">
                            {renderStars(Math.round(resource.rating || 0))}
                        </div>
                        <span className="rating-text">
                            {resource.rating ? resource.rating.toFixed(1) : '0.0'}
                        </span>
                    </div>

                    <div className="view-count">
                        <Eye size={14} />
                        {resource.view_count || 0}
                    </div>
                </div>

                {/* User Rating Section */}
                <div className="user-rating-section">
                    <span className="rating-label">Your rating:</span>
                    <div className="user-stars">
                        {renderStars(userRating, true)}
                    </div>
                </div>
            </div>

            <div className="resource-footer">
                {resource.url && (
                    <button className="action-btn primary" onClick={handleResourceClick}>
                        <ExternalLink size={16} />
                        Open Resource
                    </button>
                )}

                {resource.file_path && (
                    <button className="action-btn secondary" onClick={handleDownload}>
                        <Download size={16} />
                        Download
                    </button>
                )}
            </div>
        </div>
    );
};

export default ResourceCard;