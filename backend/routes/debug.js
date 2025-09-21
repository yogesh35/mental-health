const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Test database connection
router.get('/test', async (req, res) => {
    try {
        console.log('Testing database connection...');
        
        // Simple query to test connection
        const [rows] = await db.execute('SELECT 1 as test');
        console.log('Basic query successful:', rows);
        
        // Test if tables exist
        const [tables] = await db.execute('SHOW TABLES');
        console.log('Available tables:', tables);
        
        // Test categories table
        const [categories] = await db.execute('SELECT COUNT(*) as count FROM categories');
        console.log('Categories count:', categories);
        
        // Test resources table
        const [resources] = await db.execute('SELECT COUNT(*) as count FROM resources');
        console.log('Resources count:', resources);
        
        res.json({
            success: true,
            message: 'Database connection successful',
            data: {
                tables: tables,
                categoriesCount: categories[0].count,
                resourcesCount: resources[0].count
            }
        });
        
    } catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// Simple resources query
router.get('/simple-resources', async (req, res) => {
    try {
        console.log('Fetching resources with simple query...');
        
        const query = 'SELECT * FROM resources WHERE is_active = true LIMIT 10';
        const [rows] = await db.execute(query);
        
        console.log('Simple resources query successful, found:', rows.length);
        
        res.json({
            success: true,
            data: rows,
            count: rows.length
        });
        
    } catch (error) {
        console.error('Simple resources query error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch resources',
            error: error.message
        });
    }
});

module.exports = router;