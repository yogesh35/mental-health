const express = require('express');
const router = express.Router();
const externalContentController = require('../controllers/externalContentController');

// Get all external content (news, videos, audio)
router.get('/all', (req, res) => externalContentController.getAllContent(req, res));

// Get mental health news articles
router.get('/news', (req, res) => externalContentController.getNews(req, res));

// Get mental health videos
router.get('/videos', (req, res) => externalContentController.getVideos(req, res));

// Get mental health music/playlists
router.get('/music', (req, res) => externalContentController.getMusic(req, res));

// Get personalized content based on user profile
router.post('/personalized', (req, res) => externalContentController.getPersonalizedContent(req, res));

// Get content by category
router.get('/category/:category', (req, res) => externalContentController.getContentByCategory(req, res));

// AI Chat endpoint
router.post('/chat', (req, res) => externalContentController.chat(req, res));

// Get AI recommendations
router.post('/recommendations', (req, res) => externalContentController.getRecommendations(req, res));

module.exports = router;