const mysql = require('mysql2/promise');
const MockDatabase = require('./mockDatabase');
require('dotenv').config();

let pool;
let useMockDB = false;

// Check if we should use mock database
if (process.env.DB_TYPE === 'memory') {
    console.log('🧪 Using mock database for testing');
    pool = new MockDatabase();
    useMockDB = true;
} else {
    // Use real MySQL database
    pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'mental_health_resources',
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        timezone: '+00:00'
    });
}

// Test connection and create database if it doesn't exist
const initializeDatabase = async () => {
    try {
        if (useMockDB) {
            console.log('✅ Mock database initialized successfully');
            await createTables();
            return;
        }

        // For real MySQL database
        const tempPool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        const connection = await tempPool.getConnection();
        
        // Create database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'mental_health_resources'}`);
        console.log(`✅ Database '${process.env.DB_NAME || 'mental_health_resources'}' is ready`);
        
        connection.release();
        await tempPool.end();

        // Test the main connection
        const mainConnection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        mainConnection.release();
        
        // Create tables
        await createTables();
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        
        // Fallback to mock database
        console.log('🧪 Falling back to mock database for testing');
        if (pool && !useMockDB) {
            await pool.end().catch(() => {});
        }
        pool = new MockDatabase();
        useMockDB = true;
        console.log('✅ Mock database initialized successfully');
        await createTables();
    }
};

// Create database tables
const createTables = async () => {
    try {
        if (useMockDB) {
            console.log('✅ Mock database tables initialized');
            return;
        }

        const connection = await pool.getConnection();

        // Resource Categories Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                color VARCHAR(7) DEFAULT '#007bff',
                icon VARCHAR(50),
                sort_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Resource Tags Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tags (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(50) NOT NULL UNIQUE,
                description TEXT,
                color VARCHAR(7) DEFAULT '#6c757d',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Resources Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS resources (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                content LONGTEXT,
                type ENUM('article', 'video', 'audio', 'pdf', 'link', 'tool') DEFAULT 'article',
                category_id INT,
                url TEXT,
                thumbnail VARCHAR(500),
                author VARCHAR(100),
                duration_minutes INT,
                difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
                severity_match ENUM('low', 'mild', 'moderate', 'severe', 'all') DEFAULT 'all',
                views_count INT DEFAULT 0,
                rating_average DECIMAL(3,2) DEFAULT 0,
                rating_count INT DEFAULT 0,
                is_featured BOOLEAN DEFAULT false,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
                INDEX idx_resource_type (type),
                INDEX idx_category (category_id),
                INDEX idx_severity (severity_match),
                INDEX idx_active (is_active),
                INDEX idx_featured (is_featured)
            )
        `);

        // Resource Tag Relations Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS resource_tags (
                resource_id INT NOT NULL,
                tag_id INT NOT NULL,
                PRIMARY KEY (resource_id, tag_id),
                FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
            )
        `);

        // User Resource Interactions Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS user_interactions (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id VARCHAR(255) NOT NULL,
                resource_id INT NOT NULL,
                interaction_type ENUM('view', 'favorite', 'rating', 'download') NOT NULL,
                rating_value TINYINT CHECK (rating_value >= 1 AND rating_value <= 5),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
                INDEX idx_user (user_id),
                INDEX idx_resource (resource_id),
                INDEX idx_interaction (interaction_type),
                UNIQUE KEY unique_user_resource_interaction (user_id, resource_id, interaction_type)
            )
        `);

        connection.release();
        console.log('✅ Database tables created successfully');
        
    } catch (error) {
        console.error('❌ Error creating tables:', error.message);
        if (!useMockDB) {
            throw error;
        }
    }
};

// Initialize database on module load
initializeDatabase().catch(console.error);

module.exports = pool;