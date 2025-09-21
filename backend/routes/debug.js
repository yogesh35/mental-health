const express = require('express');
const router = express.Router();
const db = require('../config/database');
const axios = require('axios');

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

        // Disable foreign key checks temporarily
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');

        // Drop existing tables if they exist and recreate them
        await db.execute('DROP TABLE IF EXISTS user_interactions');
        await db.execute('DROP TABLE IF EXISTS resource_tags');
        await db.execute('DROP TABLE IF EXISTS resources');
        await db.execute('DROP TABLE IF EXISTS categories');
        await db.execute('DROP TABLE IF EXISTS tags');

        // Re-enable foreign key checks
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

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

// Seed database with real API data
router.get('/seed-real', async (req, res) => {
    try {
        console.log('Starting real data seed from APIs...');

        // Disable foreign key checks temporarily
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');

        // Drop existing tables if they exist and recreate them
        await db.execute('DROP TABLE IF EXISTS user_interactions');
        await db.execute('DROP TABLE IF EXISTS resource_tags');
        await db.execute('DROP TABLE IF EXISTS resources');
        await db.execute('DROP TABLE IF EXISTS categories');
        await db.execute('DROP TABLE IF EXISTS tags');

        // Re-enable foreign key checks
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

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
            { name: 'Mental Health News', description: 'Latest news and articles about mental health', color: '#e74c3c', icon: 'news' },
            { name: 'Educational Videos', description: 'Mental health educational content from YouTube', color: '#3498db', icon: 'video' },
            { name: 'Stress Management', description: 'Resources for managing stress and anxiety', color: '#2ecc71', icon: 'stress' },
            { name: 'Depression Support', description: 'Support resources for depression', color: '#f39c12', icon: 'heart' },
            { name: 'Mindfulness & Meditation', description: 'Mindfulness and meditation resources', color: '#9b59b6', icon: 'leaf' }
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
            'mental health', 'anxiety', 'depression', 'stress', 'mindfulness', 'meditation', 
            'therapy', 'wellness', 'self-care', 'psychology', 'counseling', 'support',
            'research', 'treatment', 'awareness', 'prevention'
        ];

        console.log('Inserting tags...');
        for (const tag of tags) {
            await db.execute(
                'INSERT INTO tags (name) VALUES (?)',
                [tag]
            );
        }

        // Fetch real data from News API
        console.log('Fetching mental health news from News API...');
        let newsArticles = [];
        try {
            const newsResponse = await axios.get('https://newsapi.org/v2/everything', {
                params: {
                    q: 'mental health OR depression OR anxiety OR therapy OR psychology',
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 10,
                    apiKey: process.env.NEWS_API_KEY
                }
            });

            if (newsResponse.data.articles) {
                newsArticles = newsResponse.data.articles.filter(article => 
                    article.title && 
                    article.description && 
                    article.url &&
                    !article.title.toLowerCase().includes('[removed]') &&
                    !article.description.toLowerCase().includes('[removed]')
                ).slice(0, 8);
            }
        } catch (error) {
            console.log('News API error:', error.message);
        }

        // Fetch mental health videos from YouTube API
        console.log('Fetching mental health videos from YouTube API...');
        let youtubeVideos = [];
        try {
            const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: 'mental health education therapy mindfulness meditation',
                    type: 'video',
                    order: 'relevance',
                    maxResults: 8,
                    key: process.env.YOUTUBE_API_KEY,
                    safeSearch: 'strict',
                    videoDuration: 'medium'
                }
            });

            if (youtubeResponse.data.items) {
                youtubeVideos = youtubeResponse.data.items.filter(video => 
                    video.snippet.title && 
                    video.snippet.description
                );
            }
        } catch (error) {
            console.log('YouTube API error:', error.message);
        }

        // Insert news articles
        console.log(`Inserting ${newsArticles.length} news articles...`);
        for (const article of newsArticles) {
            try {
                const publishedDate = article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : null;
                const [result] = await db.execute(
                    `INSERT INTO resources 
                    (title, description, content, type, category_id, url, thumbnail, author, source, published_date, is_featured) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        article.title.substring(0, 255),
                        article.description ? article.description.substring(0, 500) : '',
                        article.content || article.description || '',
                        'article',
                        1, // Mental Health News category
                        article.url,
                        article.urlToImage || process.env.DEFAULT_ARTICLE_IMAGE,
                        article.author ? article.author.substring(0, 255) : 'Unknown',
                        article.source?.name || 'News Source',
                        publishedDate,
                        Math.random() > 0.7 // Randomly feature some articles
                    ]
                );
                console.log(`Inserted news article: ${article.title.substring(0, 50)}... (ID: ${result.insertId})`);
            } catch (error) {
                console.log(`Error inserting article: ${error.message}`);
            }
        }

        // Insert YouTube videos
        console.log(`Inserting ${youtubeVideos.length} YouTube videos...`);
        for (const video of youtubeVideos) {
            try {
                const publishedDate = video.snippet.publishedAt ? new Date(video.snippet.publishedAt).toISOString().split('T')[0] : null;
                const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
                const thumbnail = video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url || process.env.DEFAULT_VIDEO_IMAGE;
                
                const [result] = await db.execute(
                    `INSERT INTO resources 
                    (title, description, content, type, category_id, url, thumbnail, author, source, published_date, is_featured) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        video.snippet.title.substring(0, 255),
                        video.snippet.description ? video.snippet.description.substring(0, 500) : '',
                        video.snippet.description || '',
                        'video',
                        2, // Educational Videos category
                        videoUrl,
                        thumbnail,
                        video.snippet.channelTitle ? video.snippet.channelTitle.substring(0, 255) : 'YouTube Channel',
                        'YouTube',
                        publishedDate,
                        Math.random() > 0.6 // Randomly feature some videos
                    ]
                );
                console.log(`Inserted YouTube video: ${video.snippet.title.substring(0, 50)}... (ID: ${result.insertId})`);
            } catch (error) {
                console.log(`Error inserting video: ${error.message}`);
            }
        }

        // Add some curated mental health resources
        const curatedResources = [
            {
                title: 'National Suicide Prevention Lifeline',
                description: '24/7 free and confidential support for people in distress, prevention and crisis resources.',
                content: 'The 988 Suicide & Crisis Lifeline provides 24/7, free and confidential support for people in distress, prevention and crisis resources for you or your loved ones, and best practices for professionals in the United States.',
                type: 'external',
                category_id: 4,
                url: 'https://988lifeline.org/',
                thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
                author: 'SAMHSA',
                source: '988 Lifeline',
                is_featured: true
            },
            {
                title: 'Mindfulness-Based Stress Reduction (MBSR)',
                description: 'Evidence-based program that teaches mindfulness meditation to help with stress, anxiety, depression and pain.',
                content: 'MBSR is a secular, research-based program that incorporates mindfulness to assist people with pain and a range of conditions and life issues that are initially difficult to treat in a hospital setting.',
                type: 'document',
                category_id: 5,
                url: 'https://www.mindfulnesscds.com/pages/about-mbsr',
                thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                author: 'Jon Kabat-Zinn',
                source: 'MBSR Program',
                is_featured: true
            },
            {
                title: 'Mental Health America Resources',
                description: 'Comprehensive mental health information, resources, and tools for mental wellness.',
                content: 'Mental Health America is the nation\'s leading community-based nonprofit dedicated to addressing the needs of those living with mental illness and promoting overall mental health.',
                type: 'external',
                category_id: 3,
                url: 'https://www.mhanational.org/',
                thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
                author: 'Mental Health America',
                source: 'MHA',
                is_featured: true
            }
        ];

        console.log('Inserting curated resources...');
        for (const resource of curatedResources) {
            try {
                const [result] = await db.execute(
                    `INSERT INTO resources 
                    (title, description, content, type, category_id, url, thumbnail, author, source, is_featured) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        resource.title,
                        resource.description,
                        resource.content,
                        resource.type,
                        resource.category_id,
                        resource.url,
                        resource.thumbnail,
                        resource.author,
                        resource.source,
                        resource.is_featured
                    ]
                );
                console.log(`Inserted curated resource: ${resource.title} (ID: ${result.insertId})`);
            } catch (error) {
                console.log(`Error inserting curated resource: ${error.message}`);
            }
        }

        // Test query to verify data
        const [resourceCount] = await db.execute('SELECT COUNT(*) as count FROM resources');
        const [categoryCount] = await db.execute('SELECT COUNT(*) as count FROM categories');
        const [newsCount] = await db.execute('SELECT COUNT(*) as count FROM resources WHERE type = "article"');
        const [videoCount] = await db.execute('SELECT COUNT(*) as count FROM resources WHERE type = "video"');
        
        console.log('✅ Database seeded with real API data successfully!');
        
        res.json({
            success: true,
            message: 'Database seeded with real API data successfully!',
            data: {
                totalResources: resourceCount[0].count,
                categories: categoryCount[0].count,
                newsArticles: newsCount[0].count,
                youtubeVideos: videoCount[0].count,
                curatedResources: curatedResources.length,
                apiSources: ['NewsAPI', 'YouTube API', 'Curated Resources']
            }
        });
        
    } catch (error) {
        console.error('❌ Error seeding database with real data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to seed database with real data',
            error: error.message
        });
    }
});

module.exports = router;