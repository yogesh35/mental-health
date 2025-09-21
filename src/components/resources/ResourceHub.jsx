import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BookOpen, Star, Heart, AlertCircle, Sparkles } from 'lucide-react';
import ResourceList from './ResourceList';
import ResourceCard from './ResourceCard';
import resourceAPI from '../../services/resourceAPI';
import './ResourceHub.css';

const ResourceHub = ({ assessmentResults = null, showRecommendations = false }) => {
    const [activeTab, setActiveTab] = useState(showRecommendations ? 'recommendations' : 'all');
    // eslint-disable-next-line no-unused-vars
    const [featuredResources, setFeaturedResources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [recommendations, setRecommendations] = useState(null);
    const [emergencyResources, setEmergencyResources] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInitialData();
        
        // If assessment results are provided, load recommendations
        if (assessmentResults && showRecommendations) {
            loadRecommendations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assessmentResults, showRecommendations]);

    const loadInitialData = async () => {
        try {
            console.log('🔄 Loading ResourceHub initial data...');
            const [featuredResponse, categoriesResponse] = await Promise.all([
                resourceAPI.getFeaturedResources(6),
                resourceAPI.getCategories()
            ]);

            console.log('✅ Featured resources response:', featuredResponse);
            console.log('✅ Categories response:', categoriesResponse);

            setFeaturedResources(featuredResponse.data || []);
            setCategories(categoriesResponse.data || []);
        } catch (error) {
            console.error('❌ Error loading initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRecommendations = async () => {
        if (!assessmentResults) return;

        try {
            const response = await resourceAPI.getRecommendations(assessmentResults);
            setRecommendations(response.data);

            // If severity is high, also load emergency resources
            if (assessmentResults.severityLevel === 'severe') {
                const emergencyResponse = await resourceAPI.getEmergencyResources();
                setEmergencyResources(emergencyResponse.data);
            }
        } catch (error) {
            console.error('Error loading recommendations:', error);
        }
    };

    const getSeverityColor = (severity) => {
        const colors = {
            low: '#28a745',
            mild: '#ffc107',
            moderate: '#fd7e14',
            severe: '#dc3545'
        };
        return colors[severity] || '#6c757d';
    };

    const getSeverityIcon = (severity) => {
        const icons = {
            low: '😌',
            mild: '😐',
            moderate: '😟',
            severe: '😰'
        };
        return icons[severity] || '😐';
    };

    return (
        <div className="resource-hub">
            <div className="resource-hub-header">
                <div className="header-content">
                    <h1 className="hub-title">
                        <BookOpen className="title-icon" />
                        Mental Health Resource Hub
                    </h1>
                    <p className="hub-description">
                        Discover evidence-based resources to support your mental health journey
                    </p>
                </div>

                {/* Assessment Results Summary */}
                {assessmentResults && showRecommendations && (
                    <div className="assessment-summary">
                        <div className="summary-card">
                            <h3>Your Assessment Results</h3>
                            <div className="result-info">
                                <div className="severity-indicator">
                                    <span className="severity-icon">
                                        {getSeverityIcon(assessmentResults.severityLevel)}
                                    </span>
                                    <span 
                                        className="severity-level"
                                        style={{ color: getSeverityColor(assessmentResults.severityLevel) }}
                                    >
                                        {assessmentResults.severityLevel.charAt(0).toUpperCase() + assessmentResults.severityLevel.slice(1)} Level
                                    </span>
                                </div>
                                <div className="dominant-condition">
                                    Primary Focus: <strong>{assessmentResults.dominantCondition}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Alert for Severe Cases */}
                        {assessmentResults.severityLevel === 'severe' && (
                            <div className="emergency-alert">
                                <AlertCircle className="alert-icon" />
                                <div className="alert-content">
                                    <h4>Immediate Support Available</h4>
                                    <p>Your assessment indicates you may benefit from immediate professional support.</p>
                                    {emergencyResources && (
                                        <div className="emergency-hotlines">
                                            {emergencyResources.hotlines.map((hotline, index) => (
                                                <div key={index} className="hotline">
                                                    <strong>{hotline.name}:</strong> {hotline.number}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="resource-tabs">
                <TabsList className="tabs-list">
                    <TabsTrigger value="all" className="tab-trigger">
                        <BookOpen size={18} />
                        All Resources
                    </TabsTrigger>
                    
                    <TabsTrigger value="featured" className="tab-trigger">
                        <Star size={18} />
                        Featured
                    </TabsTrigger>

                    {showRecommendations && recommendations && (
                        <TabsTrigger value="recommendations" className="tab-trigger recommended">
                            <Sparkles size={18} />
                            AI Recommended
                        </TabsTrigger>
                    )}

                    <TabsTrigger value="favorites" className="tab-trigger">
                        <Heart size={18} />
                        My Favorites
                    </TabsTrigger>

                    {categories.map(category => (
                        <TabsTrigger 
                            key={category.id} 
                            value={`category-${category.id}`}
                            className="tab-trigger"
                        >
                            {category.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* All Resources Tab */}
                <TabsContent value="all" className="tab-content">
                    <ResourceList 
                        title="All Resources"
                        showFilters={true}
                        showSearch={true}
                        gridColumns={3}
                    />
                </TabsContent>

                {/* Featured Resources Tab */}
                <TabsContent value="featured" className="tab-content">
                    <ResourceList 
                        title="Featured Resources"
                        initialFilters={{ is_featured: true }}
                        showFilters={false}
                        showSearch={true}
                        gridColumns={3}
                    />
                </TabsContent>

                {/* AI Recommendations Tab */}
                {showRecommendations && recommendations && (
                    <TabsContent value="recommendations" className="tab-content">
                        <div className="recommendations-section">
                            <div className="ai-insights">
                                <h3>
                                    <Sparkles className="insights-icon" />
                                    AI Insights
                                </h3>
                                <p>{recommendations.aiInsights}</p>
                                
                                {recommendations.immediateActions && recommendations.immediateActions.length > 0 && (
                                    <div className="immediate-actions">
                                        <h4>Immediate Actions You Can Take:</h4>
                                        <ul>
                                            {recommendations.immediateActions.map((action, index) => (
                                                <li key={index}>{action}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {recommendations.warningFlags && (
                                    <div className="warning-section">
                                        <AlertCircle className="warning-icon" />
                                        <p>{recommendations.warningFlags}</p>
                                    </div>
                                )}
                            </div>

                            {recommendations.categories && recommendations.categories.length > 0 ? (
                                <div className="categorized-recommendations">
                                    {recommendations.categories.map((category, index) => (
                                        <div key={index} className="recommendation-category">
                                            <h4 
                                                className="category-title"
                                                style={{ borderLeftColor: category.color }}
                                            >
                                                {category.name}
                                            </h4>
                                            <div className="category-resources">
                                                {category.resources.map(resource => (
                                                    <ResourceCard
                                                        key={resource.id}
                                                        resource={resource}
                                                        showAIRecommendation={true}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="simple-recommendations">
                                    <h4>Recommended Resources</h4>
                                    <div className="recommendations-grid">
                                        {recommendations.resources?.map(resource => (
                                            <ResourceCard
                                                key={resource.id}
                                                resource={resource}
                                                showAIRecommendation={true}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                )}

                {/* Favorites Tab */}
                <TabsContent value="favorites" className="tab-content">
                    <FavoritesResourceList />
                </TabsContent>

                {/* Category Tabs */}
                {categories.map(category => (
                    <TabsContent key={category.id} value={`category-${category.id}`} className="tab-content">
                        <ResourceList 
                            title={category.name}
                            initialFilters={{ category_id: category.id }}
                            showFilters={true}
                            showSearch={true}
                            gridColumns={3}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

// Separate component for favorites to handle authentication
const FavoritesResourceList = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const response = await resourceAPI.getUserFavorites();
            setFavorites(response.data);
        } catch (error) {
            console.error('Error loading favorites:', error);
            setError('Please sign in to view your favorites');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-state">Loading your favorites...</div>;
    }

    if (error) {
        return (
            <div className="auth-required">
                <Heart size={48} className="auth-icon" />
                <h3>Sign In Required</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="empty-favorites">
                <Heart size={48} className="empty-icon" />
                <h3>No Favorites Yet</h3>
                <p>Start exploring resources and add your favorites by clicking the heart icon</p>
            </div>
        );
    }

    return (
        <div className="favorites-list">
            <h3>Your Favorite Resources ({favorites.length})</h3>
            <div className="favorites-grid">
                {favorites.map(resource => (
                    <ResourceCard
                        key={resource.id}
                        resource={{ ...resource, isFavorited: true }}
                        onFavoriteToggle={(id, isFavorited) => {
                            if (!isFavorited) {
                                setFavorites(prev => prev.filter(r => r.id !== id));
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ResourceHub;