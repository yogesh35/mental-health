import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ChevronDown, Loader } from 'lucide-react';
import ResourceCard from './ResourceCard';
import resourceAPI from '../../services/resourceAPI';
import './ResourceList.css';

const ResourceList = ({ 
    initialFilters = {}, 
    showFilters = true, 
    showSearch = true,
    gridColumns = 3,
    showAIRecommendations = false,
    title = "Resources"
}) => {
    const [resources, setResources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        category_id: '',
        type: '',
        difficulty_level: '',
        sort_by: 'created_at',
        order: 'DESC',
        page: 1,
        limit: 12,
        ...initialFilters
    });
    const [viewMode, setViewMode] = useState('grid');
    const [showFiltersPanel, setShowFiltersPanel] = useState(false);
    const [pagination, setPagination] = useState({});
    const [error, setError] = useState(null);

    // Resource types for filtering
    const resourceTypes = [
        { value: '', label: 'All Types' },
        { value: 'article', label: 'Articles' },
        { value: 'video', label: 'Videos' },
        { value: 'audio', label: 'Audio' },
        { value: 'pdf', label: 'PDFs' },
        { value: 'link', label: 'Links' },
        { value: 'tool', label: 'Tools' }
    ];

    const difficultyLevels = [
        { value: '', label: 'All Levels' },
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
    ];

    const sortOptions = [
        { value: 'created_at', label: 'Newest First' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'popularity', label: 'Most Popular' },
        { value: 'title', label: 'Alphabetical' }
    ];

    // Load initial data
    useEffect(() => {
        loadCategories();
        loadResources();
    }, []);

    // Reload resources when filters change
    useEffect(() => {
        loadResources();
    }, [filters]);

    const loadCategories = async () => {
        try {
            const response = await resourceAPI.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadResources = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔄 Loading resources with filters:', filters);
            const response = await resourceAPI.getResources(filters);
            console.log('✅ API Response:', response);
            
            if (response.success && response.data) {
                setResources(response.data.resources || []);
                setPagination(response.data.pagination || {});
                console.log('📚 Loaded resources:', response.data.resources?.length || 0);
            } else {
                console.error('❌ Invalid response format:', response);
                setError('Invalid response format from server');
            }
        } catch (error) {
            console.error('❌ Error loading resources:', error);
            setError('Failed to load resources. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            performSearch();
        } else {
            // Reset to show all resources
            setFilters(prev => {
                const { search, ...rest } = prev;
                return { ...rest, page: 1 };
            });
        }
    };

    const performSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await resourceAPI.searchResources(searchQuery, {
                category_id: filters.category_id,
                type: filters.type
            });
            setResources(response.data);
            setPagination({}); // Search doesn't return pagination
        } catch (error) {
            console.error('Error searching resources:', error);
            setError('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filters change
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
        
        // Scroll to top of resource list
        document.querySelector('.resource-list-container')?.scrollIntoView({ 
            behavior: 'smooth' 
        });
    };

    const handleFavoriteToggle = (resourceId, isFavorited) => {
        setResources(prev => 
            prev.map(resource => 
                resource.id === resourceId 
                    ? { ...resource, isFavorited }
                    : resource
            )
        );
    };

    const handleRatingChange = (resourceId, rating) => {
        setResources(prev => 
            prev.map(resource => 
                resource.id === resourceId 
                    ? { ...resource, userRating: rating }
                    : resource
            )
        );
    };

    const clearFilters = () => {
        setFilters({
            category_id: '',
            resource_type: '',
            difficulty_level: '',
            sort_by: 'created_at',
            order: 'DESC',
            page: 1,
            limit: 12,
            ...initialFilters
        });
        setSearchQuery('');
    };

    if (loading && resources.length === 0) {
        return (
            <div className="resource-list-loading">
                <Loader className="spinner" size={32} />
                <p>Loading resources...</p>
            </div>
        );
    }

    return (
        <div className="resource-list-container">
            <div className="resource-list-header">
                <h2 className="resource-list-title">{title}</h2>
                
                {showSearch && (
                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-input-group">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-btn">
                                Search
                            </button>
                        </div>
                    </form>
                )}

                <div className="list-controls">
                    {showFilters && (
                        <button
                            className={`filter-toggle ${showFiltersPanel ? 'active' : ''}`}
                            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                        >
                            <Filter size={18} />
                            Filters
                            <ChevronDown 
                                size={16} 
                                className={`chevron ${showFiltersPanel ? 'rotated' : ''}`} 
                            />
                        </button>
                    )}

                    <div className="view-mode-toggle">
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid view"
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List view"
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {showFilters && showFiltersPanel && (
                <div className="filters-panel">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>Category</label>
                            <select
                                value={filters.category_id}
                                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Type</label>
                            <select
                                value={filters.resource_type}
                                onChange={(e) => handleFilterChange('resource_type', e.target.value)}
                            >
                                {resourceTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Difficulty</label>
                            <select
                                value={filters.difficulty_level}
                                onChange={(e) => handleFilterChange('difficulty_level', e.target.value)}
                            >
                                {difficultyLevels.map(level => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Sort by</label>
                            <select
                                value={filters.sort_by}
                                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={loadResources} className="retry-btn">
                        Try Again
                    </button>
                </div>
            )}

            {resources.length === 0 && !loading && !error && (
                <div className="no-resources">
                    <p>No resources found matching your criteria.</p>
                    <button onClick={clearFilters} className="clear-filters-btn">
                        Clear Filters
                    </button>
                </div>
            )}

            {resources.length > 0 && (
                <>
                    <div className={`resources-grid ${viewMode} columns-${gridColumns}`}>
                        {resources.map(resource => (
                            <ResourceCard
                                key={resource.id}
                                resource={resource}
                                onFavoriteToggle={handleFavoriteToggle}
                                onRatingChange={handleRatingChange}
                                showAIRecommendation={showAIRecommendations}
                                compact={viewMode === 'list'}
                            />
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="page-btn"
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={!pagination.hasPrev}
                            >
                                Previous
                            </button>

                            <div className="page-numbers">
                                {[...Array(pagination.totalPages)].map((_, index) => {
                                    const pageNum = index + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            className={`page-btn ${pageNum === pagination.currentPage ? 'active' : ''}`}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                className="page-btn"
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={!pagination.hasNext}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {loading && resources.length > 0 && (
                <div className="loading-overlay">
                    <Loader className="spinner" size={24} />
                </div>
            )}
        </div>
    );
};

export default ResourceList;