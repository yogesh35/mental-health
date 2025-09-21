require('dotenv').config();
const mysql = require('mysql2/promise');

async function clearTestData() {
    let connection;
    try {
        console.log('🧹 Starting database cleanup...');
        
        // Create database connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '12122004@Yo',
            database: process.env.DB_NAME || 'mental_health_db'
        });

        console.log('✅ Connected to database');

        // First, let's see what's currently in the database
        const [currentResources] = await connection.execute('SELECT id, title, type FROM resources');
        console.log('\n📋 Current resources in database:');
        currentResources.forEach(resource => {
            console.log(`  - ID: ${resource.id}, Title: "${resource.title}", Type: ${resource.type}`);
        });

        if (currentResources.length === 0) {
            console.log('\n✅ Database is already clean - no resources to remove');
            return;
        }

        // Clear all test data
        console.log('\n🗑️  Removing all test resources...');
        
        // Delete resource tags first (foreign key constraint)
        await connection.execute('DELETE FROM resource_tags');
        console.log('  ✅ Cleared resource_tags table');
        
        // Delete user interactions
        await connection.execute('DELETE FROM user_interactions');
        console.log('  ✅ Cleared user_interactions table');
        
        // Delete resources
        await connection.execute('DELETE FROM resources');
        console.log('  ✅ Cleared resources table');
        
        // Delete tags
        await connection.execute('DELETE FROM tags');
        console.log('  ✅ Cleared tags table');
        
        // Delete categories
        await connection.execute('DELETE FROM categories');
        console.log('  ✅ Cleared categories table');

        // Reset auto-increment counters
        await connection.execute('ALTER TABLE resources AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE categories AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE tags AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE resource_tags AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE user_interactions AUTO_INCREMENT = 1');
        console.log('  ✅ Reset auto-increment counters');

        // Verify cleanup
        const [remainingResources] = await connection.execute('SELECT COUNT(*) as count FROM resources');
        const [remainingCategories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
        const [remainingTags] = await connection.execute('SELECT COUNT(*) as count FROM tags');

        console.log('\n📊 Database cleanup verification:');
        console.log(`  - Resources: ${remainingResources[0].count}`);
        console.log(`  - Categories: ${remainingCategories[0].count}`);
        console.log(`  - Tags: ${remainingTags[0].count}`);

        console.log('\n🎉 Database cleanup completed successfully!');
        console.log('💡 The system will now rely purely on real-time API data.');

    } catch (error) {
        console.error('❌ Error during database cleanup:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔒 Database connection closed');
        }
    }
}

// Run the cleanup
clearTestData()
    .then(() => {
        console.log('\n✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error.message);
        process.exit(1);
    });