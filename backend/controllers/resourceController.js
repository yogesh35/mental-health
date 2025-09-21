const Resource = require('../models/SimpleResource');
const Category = require('../models/Category');
const UserInteraction = require('../models/UserInteraction');
const { validationResult } = require('express-validator');

class ResourceController {
    // Get all resources with filtering and pagination
    static async getAllResources(req, res) {
        try {
            const {
                category_id,
                type,
                severity_match,
                difficulty_level,
                is_featured,
                search,
                sort_by = 'created_at',
                order = 'DESC',
                page = 1,
                limit = 12
            } = req.query;

            // Calculate pagination
            const offset = (parseInt(page) - 1) * parseInt(limit);

            // Build filters
            const filters = {
                category_id,
                type,
                severity_match,
                difficulty_level,
                is_featured: is_featured !== undefined ? is_featured === 'true' : undefined,
                search,
                sort_by,
                order,
                limit: parseInt(limit),
                offset
            };

            // Get resources and total count
            const [resources, totalCount] = await Promise.all([
                Resource.findAll(filters),
                Resource.getTotalCount(filters)
            ]);

            // Calculate pagination info
            const totalPages = Math.ceil(totalCount / parseInt(limit));
            const hasNext = parseInt(page) < totalPages;
            const hasPrev = parseInt(page) > 1;

            res.json({
                success: true,
                data: {
                    resources,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages,
                        totalItems: totalCount,
                        itemsPerPage: parseInt(limit),
                        hasNext,
                        hasPrev
                    }
                }
            });
        } catch (error) {
            console.error('Error getting resources:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch resources',
                error: error.message
            });
        }
    }

    // Get single resource by ID
    static async getResourceById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id; // From auth middleware

            const resource = await Resource.findById(id);
            
            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Resource not found'
                });
            }

            // Increment view count
            await Resource.incrementViewCount(id);

            // Add user interaction data if user is authenticated
            if (userId) {
                const [isFavorited, userRating] = await Promise.all([
                    UserInteraction.hasInteraction(userId, id, 'favorite'),
                    UserInteraction.getUserRating(userId, id)
                ]);

                resource.isFavorited = isFavorited;
                resource.userRating = userRating;
            }

            res.json({
                success: true,
                data: resource
            });
        } catch (error) {
            console.error('Error getting resource:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch resource',
                error: error.message
            });
        }
    }

    // Get featured resources
    static async getFeaturedResources(req, res) {
        try {
            const { limit = 6 } = req.query;
            
            const resources = await Resource.getFeatured(parseInt(limit));

            res.json({
                success: true,
                data: resources
            });
        } catch (error) {
            console.error('Error getting featured resources:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch featured resources',
                error: error.message
            });
        }
    }

    // Get resources by severity level (for recommendations)
    static async getResourcesBySeverity(req, res) {
        try {
            const { severity } = req.params;
            const { limit = 10 } = req.query;

            if (!['low', 'mild', 'moderate', 'severe'].includes(severity)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid severity level'
                });
            }

            const resources = await Resource.findBySeverity(severity, parseInt(limit));

            res.json({
                success: true,
                data: resources
            });
        } catch (error) {
            console.error('Error getting resources by severity:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch resources by severity',
                error: error.message
            });
        }
    }

    // Get all categories
    static async getCategories(req, res) {
        try {
            const categories = await Category.findAll();

            res.json({
                success: true,
                data: categories
            });
        } catch (error) {
            console.error('Error getting categories:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch categories',
                error: error.message
            });
        }
    }

    // Toggle favorite status
    static async toggleFavorite(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Check if resource exists
            const resource = await Resource.findById(id);
            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Resource not found'
                });
            }

            // Check current favorite status
            const isFavorited = await UserInteraction.hasInteraction(userId, id, 'favorite');

            if (isFavorited) {
                // Remove favorite
                await UserInteraction.remove(userId, id, 'favorite');
                res.json({
                    success: true,
                    message: 'Removed from favorites',
                    data: { isFavorited: false }
                });
            } else {
                // Add favorite
                await UserInteraction.upsert(userId, id, 'favorite');
                res.json({
                    success: true,
                    message: 'Added to favorites',
                    data: { isFavorited: true }
                });
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to toggle favorite',
                error: error.message
            });
        }
    }

    // Rate a resource
    static async rateResource(req, res) {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const { rating } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Check if resource exists
            const resource = await Resource.findById(id);
            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Resource not found'
                });
            }

            // Add/update rating
            await UserInteraction.upsert(userId, id, 'rating', rating);

            // Get updated resource with new rating
            const updatedResource = await Resource.findById(id);

            res.json({
                success: true,
                message: 'Rating submitted successfully',
                data: {
                    userRating: rating,
                    averageRating: updatedResource.rating
                }
            });
        } catch (error) {
            console.error('Error rating resource:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to rate resource',
                error: error.message
            });
        }
    }

    // Get user's favorite resources
    static async getUserFavorites(req, res) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const favorites = await Resource.getUserFavorites(userId);

            res.json({
                success: true,
                data: favorites
            });
        } catch (error) {
            console.error('Error getting user favorites:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch favorites',
                error: error.message
            });
        }
    }

    // Get user and resource statistics
    static async getStats(req, res) {
        try {
            const userId = req.user?.id;
            const { resourceId } = req.query;

            let stats = {};

            if (userId) {
                stats.userStats = await UserInteraction.getUserStats(userId);
            }

            if (resourceId) {
                stats.resourceStats = await UserInteraction.getResourceStats(resourceId);
            }

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error getting stats:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch statistics',
                error: error.message
            });
        }
    }

    // Search resources
    static async searchResources(req, res) {
        try {
            const { q: search, category_id, resource_type, limit = 20 } = req.query;

            if (!search || search.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query must be at least 2 characters long'
                });
            }

            const filters = {
                search: search.trim(),
                category_id,
                resource_type,
                limit: parseInt(limit),
                sort_by: 'rating',
                order: 'DESC'
            };

            const resources = await Resource.findAll(filters);

            res.json({
                success: true,
                data: resources
            });
        } catch (error) {
            console.error('Error searching resources:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to search resources',
                error: error.message
            });
        }
    }
}

module.exports = ResourceController;