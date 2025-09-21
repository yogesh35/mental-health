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

// Seed database endpoint
router.get('/seed', async (req, res) => {
    try {
        console.log('Starting database seed...');

        // Drop existing tables if they exist and recreate them
        await db.execute('DROP TABLE IF EXISTS resource_tags');
        await db.execute('DROP TABLE IF EXISTS resources');
        await db.execute('DROP TABLE IF EXISTS categories');
        await db.execute('DROP TABLE IF EXISTS tags');

        // Create categories table
        await db.execute(`
            CREATE TABLE categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                color VARCHAR(7) DEFAULT '#007bff',
                icon VARCHAR(50) DEFAULT 'folder',
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create tags table
        await db.execute(`
            CREATE TABLE tags (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create resources table
        await db.execute(`
            CREATE TABLE resources (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                content LONGTEXT,
                type ENUM('article', 'video', 'audio', 'document', 'external') DEFAULT 'article',
                category_id INT,
                url VARCHAR(1000),
                thumbnail VARCHAR(1000),
                author VARCHAR(255),
                source VARCHAR(255),
                language VARCHAR(10) DEFAULT 'en',
                duration_minutes INT DEFAULT 0,
                difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
                rating DECIMAL(3,2) DEFAULT 0.00,
                view_count INT DEFAULT 0,
                is_featured BOOLEAN DEFAULT false,
                is_active BOOLEAN DEFAULT true,
                published_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
                INDEX idx_category (category_id),
                INDEX idx_type (type),
                INDEX idx_featured (is_featured),
                INDEX idx_active (is_active)
            )
        `);

        // Create junction table for resource tags
        await db.execute(`
            CREATE TABLE resource_tags (
                resource_id INT,
                tag_id INT,
                PRIMARY KEY (resource_id, tag_id),
                FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
            )
        `);

        // Insert categories
        const categories = [
            { name: 'Stress Management', description: 'Resources for managing stress and anxiety', color: '#e74c3c', icon: 'stress' },
            { name: 'Depression Support', description: 'Support resources for depression', color: '#3498db', icon: 'heart' },
            { name: 'Mindfulness', description: 'Mindfulness and meditation resources', color: '#2ecc71', icon: 'leaf' },
            { name: 'Crisis Support', description: 'Emergency and crisis support resources', color: '#f39c12', icon: 'emergency' },
            { name: 'Self-Care', description: 'Self-care and wellness resources', color: '#9b59b6', icon: 'care' }
        ];

        console.log('Inserting categories...');
        for (const category of categories) {
            await db.execute(
                'INSERT INTO categories (name, description, color, icon) VALUES (?, ?, ?, ?)',
                [category.name, category.description, category.color, category.icon]
            );
        }

        // Insert tags
        const tags = [
            'anxiety', 'depression', 'stress', 'mindfulness', 'meditation', 
            'self-care', 'crisis', 'support', 'therapy', 'wellness'
        ];

        console.log('Inserting tags...');
        for (const tag of tags) {
            await db.execute(
                'INSERT INTO tags (name) VALUES (?)',
                [tag]
            );
        }

        // Insert resources
        const resources = [
            {
                title: 'Breathing Exercises for Anxiety',
                description: 'Simple breathing techniques to help manage anxiety and stress',
                content: 'Deep breathing exercises can help calm your nervous system and reduce anxiety symptoms. Practice these techniques daily for best results.',
                type: 'article',
                category_id: 1,
                url: 'https://example.com/breathing-exercises',
                thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                author: 'Dr. Sarah Johnson',
                duration_minutes: 10,
                difficulty_level: 'beginner',
                is_featured: true
            },
            {
                title: 'Understanding Depression',
                description: 'A comprehensive guide to understanding depression symptoms and treatment',
                content: 'Depression is a common mental health condition that affects millions of people worldwide. Learn about symptoms, causes, and treatment options.',
                type: 'article',
                category_id: 2,
                url: 'https://example.com/understanding-depression',
                thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400',
                author: 'Mental Health Institute',
                duration_minutes: 20,
                difficulty_level: 'intermediate'
            },
            {
                title: 'Guided Meditation for Beginners',
                description: 'A 15-minute guided meditation session for stress relief',
                content: 'This meditation will help you find peace and calm in your daily life. Perfect for beginners who want to start a mindfulness practice.',
                type: 'audio',
                category_id: 3,
                url: 'https://example.com/guided-meditation',
                thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                author: 'Mindfulness Center',
                duration_minutes: 15,
                difficulty_level: 'beginner',
                is_featured: true
            },
            {
                title: 'Crisis Hotline Numbers',
                description: 'Emergency contact numbers for mental health crisis support',
                content: 'If you are in crisis, these numbers can provide immediate support and assistance. Available 24/7.',
                type: 'document',
                category_id: 4,
                url: 'https://example.com/crisis-hotlines',
                thumbnail: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=400',
                author: 'Crisis Support Network',
                duration_minutes: 5,
                difficulty_level: 'beginner',
                is_featured: true
            },
            {
                title: 'Self-Care Checklist',
                description: 'Daily self-care activities to improve your mental wellness',
                content: 'A comprehensive checklist of self-care activities that you can incorporate into your daily routine for better mental health.',
                type: 'document',
                category_id: 5,
                url: 'https://example.com/self-care-checklist',
                thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
                author: 'Wellness Team',
                duration_minutes: 10,
                difficulty_level: 'beginner'
            }
        ];

        console.log('Inserting resources...');
        for (const resource of resources) {
            const [result] = await db.execute(
                `INSERT INTO resources 
                (title, description, content, type, category_id, url, thumbnail, author, 
                 duration_minutes, difficulty_level, is_featured) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    resource.title, 
                    resource.description, 
                    resource.content, 
                    resource.type,
                    resource.category_id, 
                    resource.url, 
                    resource.thumbnail, 
                    resource.author,
                    resource.duration_minutes, 
                    resource.difficulty_level, 
                    resource.is_featured || false
                ]
            );
            console.log(`Inserted resource: ${resource.title} (ID: ${result.insertId})`);
        }

        // Test query to verify data
        const [resourceCount] = await db.execute('SELECT COUNT(*) as count FROM resources');
        const [categoryCount] = await db.execute('SELECT COUNT(*) as count FROM categories');
        
        console.log('✅ Database seeded successfully!');
        
        res.json({
            success: true,
            message: 'Database seeded successfully!',
            data: {
                resourcesCreated: resourceCount[0].count,
                categoriesCreated: categoryCount[0].count,
                tables: ['categories', 'tags', 'resources', 'resource_tags']
            }
        });
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to seed database',
            error: error.message
        });
    }
});

module.exports = router;