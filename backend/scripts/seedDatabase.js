const db = require('../config/database');

const sampleCategories = [
    {
        name: 'Stress Management',
        description: 'Resources to help manage stress and build resilience',
        color: '#e74c3c',
        icon: 'stress',
        sort_order: 1
    },
    {
        name: 'Anxiety Support',
        description: 'Tools and techniques for anxiety relief and management',
        color: '#f39c12',
        icon: 'anxiety',
        sort_order: 2
    },
    {
        name: 'Depression Recovery',
        description: 'Resources for understanding and managing depression',
        color: '#3498db',
        icon: 'depression',
        sort_order: 3
    },
    {
        name: 'Mindfulness & Meditation',
        description: 'Mindfulness practices and meditation guides',
        color: '#9b59b6',
        icon: 'mindfulness',
        sort_order: 4
    },
    {
        name: 'Sleep & Wellness',
        description: 'Improve sleep quality and overall wellness',
        color: '#2ecc71',
        icon: 'sleep',
        sort_order: 5
    },
    {
        name: 'Relationships & Social Health',
        description: 'Building healthy relationships and social connections',
        color: '#e67e22',
        icon: 'relationships',
        sort_order: 6
    }
];

const sampleTags = [
    { name: 'beginner-friendly', description: 'Easy to start, no prior experience needed', color: '#28a745' },
    { name: 'evidence-based', description: 'Backed by scientific research', color: '#007bff' },
    { name: 'quick-relief', description: 'For immediate stress relief', color: '#dc3545' },
    { name: 'long-term', description: 'For building lasting habits', color: '#6c757d' },
    { name: 'interactive', description: 'Hands-on exercises and activities', color: '#17a2b8' },
    { name: 'self-help', description: 'Self-guided resources', color: '#28a745' },
    { name: 'professional', description: 'Created by mental health professionals', color: '#6f42c1' },
    { name: 'free', description: 'No cost resources', color: '#20c997' },
    { name: 'premium', description: 'Paid or subscription-based', color: '#fd7e14' },
    { name: 'crisis-support', description: 'For urgent mental health support', color: '#dc3545' }
];

const sampleResources = [
    // Stress Management Resources
    {
        title: 'Deep Breathing Techniques for Instant Stress Relief',
        description: 'Learn powerful breathing exercises that can calm your nervous system in just 5 minutes. Perfect for workplace stress or overwhelming moments.',
        content: 'This comprehensive guide covers 5 different breathing techniques including 4-7-8 breathing, box breathing, and belly breathing. Each technique is explained with step-by-step instructions and includes audio guidance.',
        resource_type: 'article',
        category_id: 1,
        url: 'https://example.com/breathing-techniques',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
        author: 'Dr. Sarah Johnson, Stress Management Specialist',
        duration_minutes: 10,
        difficulty_level: 'beginner',
        severity_match: 'all',
        is_featured: true,
        tags: ['beginner-friendly', 'quick-relief', 'evidence-based']
    },
    {
        title: 'Progressive Muscle Relaxation Audio Guide',
        description: 'A 20-minute guided audio session that helps you release physical tension and mental stress through systematic muscle relaxation.',
        content: 'This audio guide takes you through a complete progressive muscle relaxation session, helping you identify and release tension from head to toe.',
        resource_type: 'audio',
        category_id: 1,
        url: 'https://example.com/pmr-audio',
        image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500',
        author: 'Mindful Living Institute',
        duration_minutes: 20,
        difficulty_level: 'beginner',
        severity_match: 'mild',
        is_featured: false,
        tags: ['beginner-friendly', 'evidence-based', 'long-term']
    },
    {
        title: 'Stress Management Workbook',
        description: 'A comprehensive 50-page workbook with exercises, worksheets, and strategies for long-term stress management.',
        content: 'This workbook includes cognitive behavioral therapy techniques, stress tracking sheets, and practical exercises for building resilience.',
        resource_type: 'pdf',
        category_id: 1,
        url: 'https://example.com/stress-workbook.pdf',
        image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500',
        author: 'Mental Health Foundation',
        duration_minutes: 120,
        difficulty_level: 'intermediate',
        severity_match: 'moderate',
        is_featured: true,
        tags: ['evidence-based', 'long-term', 'interactive', 'self-help']
    },

    // Anxiety Support Resources
    {
        title: '5-4-3-2-1 Grounding Technique Video',
        description: 'Learn the popular grounding technique that helps reduce anxiety by engaging your five senses. Perfect for panic attacks and overwhelming feelings.',
        content: 'This video demonstrates the 5-4-3-2-1 technique step by step, showing how to identify 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste.',
        resource_type: 'video',
        category_id: 2,
        url: 'https://example.com/grounding-technique',
        image_url: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=500',
        author: 'Anxiety Relief Center',
        duration_minutes: 8,
        difficulty_level: 'beginner',
        severity_match: 'all',
        is_featured: true,
        tags: ['beginner-friendly', 'quick-relief', 'evidence-based']
    },
    {
        title: 'Cognitive Behavioral Therapy for Anxiety Online Course',
        description: 'A structured 8-week online course teaching CBT techniques specifically designed for anxiety management.',
        content: 'Learn to identify negative thought patterns, challenge anxious thoughts, and develop healthier coping strategies through interactive lessons and exercises.',
        resource_type: 'link',
        category_id: 2,
        url: 'https://example.com/cbt-anxiety-course',
        image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500',
        author: 'CBT Institute',
        duration_minutes: 480,
        difficulty_level: 'intermediate',
        severity_match: 'moderate',
        is_featured: false,
        tags: ['evidence-based', 'long-term', 'professional', 'interactive']
    },

    // Depression Recovery Resources  
    {
        title: 'Daily Mood Tracker and Journal',
        description: 'A digital tool to track your mood, identify patterns, and monitor your mental health progress over time.',
        content: 'This interactive tool helps you log daily moods, identify triggers, track sleep and activities, and generate insights about your mental health patterns.',
        resource_type: 'tool',
        category_id: 3,
        url: 'https://example.com/mood-tracker',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
        author: 'Digital Wellness Labs',
        duration_minutes: 5,
        difficulty_level: 'beginner',
        severity_match: 'all',
        is_featured: true,
        tags: ['beginner-friendly', 'long-term', 'interactive', 'self-help']
    },
    {
        title: 'Understanding Depression: A Complete Guide',
        description: 'Comprehensive resource explaining depression symptoms, causes, treatment options, and recovery strategies.',
        content: 'This guide covers everything from recognizing depression signs to finding professional help, with sections on medication, therapy, and lifestyle changes.',
        resource_type: 'article',
        category_id: 3,
        url: 'https://example.com/depression-guide',
        image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
        author: 'Dr. Michael Chen, Clinical Psychologist',
        duration_minutes: 45,
        difficulty_level: 'beginner',
        severity_match: 'moderate',
        is_featured: false,
        tags: ['evidence-based', 'professional', 'long-term']
    },

    // Mindfulness & Meditation Resources
    {
        title: '10-Minute Morning Meditation',
        description: 'Start your day with this calming guided meditation designed to center your mind and reduce anxiety.',
        content: 'A gentle morning meditation focusing on breath awareness, gratitude, and setting positive intentions for the day ahead.',
        resource_type: 'audio',
        category_id: 4,
        url: 'https://example.com/morning-meditation',
        image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
        author: 'Peaceful Mind Studio',
        duration_minutes: 10,
        difficulty_level: 'beginner',
        severity_match: 'all',
        is_featured: true,
        tags: ['beginner-friendly', 'quick-relief', 'self-help']
    },
    {
        title: 'Mindfulness-Based Stress Reduction Course',
        description: 'An 8-week evidence-based program combining mindfulness meditation with yoga and stress reduction techniques.',
        content: 'This comprehensive course includes weekly sessions, home practice materials, and guided meditations for building long-term mindfulness skills.',
        resource_type: 'link',
        category_id: 4,
        url: 'https://example.com/mbsr-course',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
        author: 'Mindfulness Center',
        duration_minutes: 600,
        difficulty_level: 'intermediate',
        severity_match: 'mild',
        is_featured: false,
        tags: ['evidence-based', 'long-term', 'professional', 'interactive']
    },

    // Sleep & Wellness Resources
    {
        title: 'Sleep Hygiene Checklist',
        description: 'A practical checklist of habits and environmental factors that promote better sleep quality and duration.',
        content: 'This checklist covers bedroom environment, bedtime routines, diet considerations, and lifestyle factors that impact sleep quality.',
        resource_type: 'pdf',
        category_id: 5,
        url: 'https://example.com/sleep-hygiene.pdf',
        image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500',
        author: 'Sleep Foundation',
        duration_minutes: 15,
        difficulty_level: 'beginner',
        severity_match: 'all',
        is_featured: true,
        tags: ['beginner-friendly', 'evidence-based', 'self-help']
    },
    {
        title: 'Bedtime Relaxation Audio',
        description: 'A soothing 30-minute audio designed to help you wind down and prepare for restful sleep.',
        content: 'This relaxation audio combines gentle music, nature sounds, and guided relaxation techniques to promote deep, restful sleep.',
        resource_type: 'audio',
        category_id: 5,
        url: 'https://example.com/bedtime-audio',
        image_url: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=500',
        author: 'Sleep Better Studios',
        duration_minutes: 30,
        difficulty_level: 'beginner',
        severity_match: 'mild',
        is_featured: false,
        tags: ['beginner-friendly', 'quick-relief', 'self-help']
    },

    // Relationships & Social Health Resources
    {
        title: 'Building Healthy Relationships Workshop',
        description: 'Learn communication skills, boundary setting, and conflict resolution techniques for stronger relationships.',
        content: 'This workshop covers active listening, expressing needs clearly, managing relationship conflicts, and building emotional intimacy.',
        resource_type: 'video',
        category_id: 6,
        url: 'https://example.com/relationship-workshop',
        image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500',
        author: 'Dr. Lisa Rodriguez, Relationship Therapist',
        duration_minutes: 90,
        difficulty_level: 'intermediate',
        severity_match: 'mild',
        is_featured: true,
        tags: ['evidence-based', 'professional', 'interactive', 'long-term']
    },
    {
        title: 'Social Anxiety Support Group Guide',
        description: 'Find and connect with local and online support groups for social anxiety and social skill building.',
        content: 'Directory of support groups, online communities, and social skill building resources for people experiencing social anxiety.',
        resource_type: 'link',
        category_id: 6,
        url: 'https://example.com/social-anxiety-groups',
        image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500',
        author: 'Social Anxiety Association',
        duration_minutes: 20,
        difficulty_level: 'beginner',
        severity_match: 'moderate',
        is_featured: false,
        tags: ['beginner-friendly', 'long-term', 'self-help', 'free']
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Clear existing data (optional)
        await db.execute('DELETE FROM resource_tag_relations');
        await db.execute('DELETE FROM user_resource_interactions');
        await db.execute('DELETE FROM resources');
        await db.execute('DELETE FROM resource_tags');
        await db.execute('DELETE FROM resource_categories');
        
        console.log('🧹 Cleared existing data');

        // Insert categories
        console.log('📁 Inserting categories...');
        for (const category of sampleCategories) {
            await db.execute(
                `INSERT INTO resource_categories (name, description, color, icon, sort_order) 
                 VALUES (?, ?, ?, ?, ?)`,
                [category.name, category.description, category.color, category.icon, category.sort_order]
            );
        }

        // Insert tags
        console.log('🏷️ Inserting tags...');
        for (const tag of sampleTags) {
            await db.execute(
                `INSERT INTO resource_tags (name, description, color) 
                 VALUES (?, ?, ?)`,
                [tag.name, tag.description, tag.color]
            );
        }

        // Insert resources
        console.log('📚 Inserting resources...');
        for (const resource of sampleResources) {
            const [result] = await db.execute(
                `INSERT INTO resources (title, description, content, resource_type, category_id, url, image_url, author, duration_minutes, difficulty_level, severity_match, is_featured) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    resource.title,
                    resource.description, 
                    resource.content,
                    resource.resource_type,
                    resource.category_id,
                    resource.url,
                    resource.image_url,
                    resource.author,
                    resource.duration_minutes,
                    resource.difficulty_level,
                    resource.severity_match,
                    resource.is_featured
                ]
            );

            const resourceId = result.insertId;

            // Add tags to resources
            if (resource.tags) {
                for (const tagName of resource.tags) {
                    const [tagResult] = await db.execute(
                        'SELECT id FROM resource_tags WHERE name = ?',
                        [tagName]
                    );
                    
                    if (tagResult.length > 0) {
                        await db.execute(
                            'INSERT INTO resource_tag_relations (resource_id, tag_id) VALUES (?, ?)',
                            [resourceId, tagResult[0].id]
                        );
                    }
                }
            }
        }

        // Add some sample ratings and interactions
        console.log('⭐ Adding sample ratings...');
        const [resources] = await db.execute('SELECT id FROM resources');
        
        for (const resource of resources) {
            // Add random ratings between 3.5 and 5.0
            const rating = 3.5 + Math.random() * 1.5;
            await db.execute(
                'UPDATE resources SET rating = ?, view_count = ? WHERE id = ?',
                [rating.toFixed(1), Math.floor(Math.random() * 1000) + 50, resource.id]
            );
        }

        console.log('✅ Database seeding completed successfully!');
        console.log(`📊 Seeded: ${sampleCategories.length} categories, ${sampleTags.length} tags, ${sampleResources.length} resources`);
        
        return {
            success: true,
            message: 'Database seeded successfully',
            stats: {
                categories: sampleCategories.length,
                tags: sampleTags.length,
                resources: sampleResources.length
            }
        };

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
};

// Run seeding if called directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('🎉 Seeding completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Seeding failed:', error);
            process.exit(1);
        });
}

module.exports = { seedDatabase };