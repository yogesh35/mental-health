const db = require('./config/database');

async function seedDatabase() {
    try {
        console.log('Starting database seed...');

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
                'INSERT IGNORE INTO categories (name, description, color, icon) VALUES (?, ?, ?, ?)',
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
                'INSERT IGNORE INTO tags (name) VALUES (?)',
                [tag]
            );
        }

        // Insert resources
        const resources = [
            {
                title: 'Breathing Exercises for Anxiety',
                description: 'Simple breathing techniques to help manage anxiety and stress',
                content: 'Deep breathing exercises can help calm your nervous system...',
                type: 'article',
                category_id: 1,
                url: 'https://example.com/breathing-exercises',
                thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                author: 'Dr. Sarah Johnson',
                duration_minutes: 10,
                difficulty_level: 'beginner',
                severity_match: 'mild',
                is_featured: true
            },
            {
                title: 'Understanding Depression',
                description: 'A comprehensive guide to understanding depression symptoms and treatment',
                content: 'Depression is a common mental health condition...',
                type: 'article',
                category_id: 2,
                url: 'https://example.com/understanding-depression',
                thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400',
                author: 'Mental Health Institute',
                duration_minutes: 20,
                difficulty_level: 'intermediate',
                severity_match: 'moderate'
            },
            {
                title: 'Guided Meditation for Beginners',
                description: 'A 15-minute guided meditation session for stress relief',
                content: 'This meditation will help you find peace and calm...',
                type: 'audio',
                category_id: 3,
                url: 'https://example.com/guided-meditation',
                thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                author: 'Mindfulness Center',
                duration_minutes: 15,
                difficulty_level: 'beginner',
                severity_match: 'all',
                is_featured: true
            }
        ];

        console.log('Inserting resources...');
        for (const resource of resources) {
            const [result] = await db.execute(
                `INSERT INTO resources 
                (title, description, content, type, category_id, url, thumbnail, author, 
                 duration_minutes, difficulty_level, severity_match, is_featured) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    resource.title || '', 
                    resource.description || '', 
                    resource.content || '', 
                    resource.type || 'article',
                    resource.category_id || 1, 
                    resource.url || '', 
                    resource.thumbnail || '', 
                    resource.author || '',
                    resource.duration_minutes || 0, 
                    resource.difficulty_level || 'beginner', 
                    resource.severity_match || 'all',
                    resource.is_featured || false
                ]
            );
            console.log(`Inserted resource: ${resource.title} (ID: ${result.insertId})`);
        }

        console.log('✅ Database seeded successfully!');
        
        // Test query
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM resources');
        console.log(`Total resources in database: ${rows[0].count}`);
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();