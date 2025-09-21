const express = require('express');
const router = express.Router();
const ResourceController = require('../controllers/resourceController');
const RecommendationService = require('../services/recommendationService');
const { authenticateToken, requireAuth } = require('../middleware/auth');
const { rateResource } = require('../middleware/validation');

// Initialize recommendation service
const recommendationService = new RecommendationService();

// Public routes (no authentication required)
router.get('/resources', ResourceController.getAllResources);
router.get('/resources/featured', ResourceController.getFeaturedResources);
router.get('/resources/severity/:severity', ResourceController.getResourcesBySeverity);
router.get('/resources/search', ResourceController.searchResources);
router.get('/resources/:id', ResourceController.getResourceById);
router.get('/categories', ResourceController.getCategories);

// Protected routes (authentication required)
router.post('/resources/:id/favorite', requireAuth, ResourceController.toggleFavorite);
router.delete('/resources/:id/favorite', requireAuth, ResourceController.toggleFavorite);
router.post('/resources/:id/rate', requireAuth, rateResource, ResourceController.rateResource);
router.get('/user/favorites', requireAuth, ResourceController.getUserFavorites);
router.get('/stats', authenticateToken, ResourceController.getStats);

// Recommendation routes
router.post('/recommendations', authenticateToken, async (req, res) => {
    try {
        const { assessmentResults } = req.body;
        const userId = req.user?.id;

        if (!assessmentResults) {
            return res.status(400).json({
                success: false,
                message: 'Assessment results are required'
            });
        }

        const recommendations = await recommendationService.getRecommendations(
            assessmentResults, 
            userId
        );

        res.json(recommendations);
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate recommendations',
            error: error.message
        });
    }
});

router.get('/emergency', async (req, res) => {
    try {
        const emergencyResources = await recommendationService.getEmergencyResources();
        
        res.json({
            success: true,
            data: emergencyResources
        });
    } catch (error) {
        console.error('Error getting emergency resources:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch emergency resources',
            error: error.message
        });
    }
});

// Analytics routes (optional - for tracking usage)
router.post('/analytics/view', authenticateToken, async (req, res) => {
    try {
        const { resourceId } = req.body;
        const userId = req.user?.id;

        if (!resourceId) {
            return res.status(400).json({
                success: false,
                message: 'Resource ID is required'
            });
        }

        if (userId) {
            const UserInteraction = require('../models/UserInteraction');
            await UserInteraction.upsert(userId, resourceId, 'view');
        }

        res.json({
            success: true,
            message: 'View tracked successfully'
        });
    } catch (error) {
        console.error('Error tracking view:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track view',
            error: error.message
        });
    }
});

router.post('/analytics/download', requireAuth, async (req, res) => {
    try {
        const { resourceId } = req.body;
        const userId = req.user.id;

        if (!resourceId) {
            return res.status(400).json({
                success: false,
                message: 'Resource ID is required'
            });
        }

        const UserInteraction = require('../models/UserInteraction');
        await UserInteraction.upsert(userId, resourceId, 'download');

        res.json({
            success: true,
            message: 'Download tracked successfully'
        });
    } catch (error) {
        console.error('Error tracking download:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track download',
            error: error.message
        });
    }
});

module.exports = router;