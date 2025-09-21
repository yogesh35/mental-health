-- MySQL Database Setup for Mental Health Resource Hub
-- Run this script in MySQL Workbench or command line

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS mental_health_resources 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE mental_health_resources;

-- Create Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categories_name (name)
) ENGINE=InnoDB;

-- Create Tags table
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tags_name (name)
) ENGINE=InnoDB;

-- Create Resources table
CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content LONGTEXT,
    type ENUM('article', 'video', 'audio', 'exercise', 'tool', 'guide') NOT NULL DEFAULT 'article',
    url VARCHAR(500),
    thumbnail VARCHAR(500),
    duration_minutes INT DEFAULT 0,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    category_id INT,
    author VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_resources_category (category_id),
    INDEX idx_resources_type (type),
    INDEX idx_resources_featured (is_featured),
    INDEX idx_resources_active (is_active),
    INDEX idx_resources_rating (rating_average),
    FULLTEXT(title, description)
) ENGINE=InnoDB;

-- Create Resource Tags junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS resource_tags (
    resource_id INT,
    tag_id INT,
    PRIMARY KEY (resource_id, tag_id),
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    INDEX idx_resource_tags_resource (resource_id),
    INDEX idx_resource_tags_tag (tag_id)
) ENGINE=InnoDB;

-- Create User Interactions table
CREATE TABLE IF NOT EXISTS user_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    resource_id INT NOT NULL,
    interaction_type ENUM('view', 'favorite', 'rating', 'bookmark', 'share') NOT NULL,
    rating_value INT CHECK (rating_value >= 1 AND rating_value <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_resource_type (user_id, resource_id, interaction_type),
    INDEX idx_user_interactions_user (user_id),
    INDEX idx_user_interactions_resource (resource_id),
    INDEX idx_user_interactions_type (interaction_type)
) ENGINE=InnoDB;

-- Insert default categories
INSERT IGNORE INTO categories (name, description, icon, color) VALUES
('Anxiety Management', 'Resources to help cope with anxiety and panic disorders', 'heart-pulse', '#EF4444'),
('Depression Support', 'Tools and guidance for managing depression', 'cloud-rain', '#6366F1'),
('Stress Relief', 'Techniques and exercises for stress reduction', 'zap', '#F59E0B'),
('Mindfulness', 'Meditation and mindfulness practices', 'brain', '#10B981'),
('Sleep Health', 'Resources for better sleep and rest', 'moon', '#8B5CF6'),
('Relationship Support', 'Guidance for healthy relationships and communication', 'users', '#EC4899'),
('Self-Care', 'Self-care practices and wellness routines', 'heart', '#06B6D4'),
('Crisis Support', 'Emergency resources and crisis intervention', 'phone', '#DC2626');

-- Insert default tags
INSERT IGNORE INTO tags (name, description) VALUES
('beginner-friendly', 'Suitable for those new to mental health practices'),
('evidence-based', 'Backed by scientific research'),
('quick-help', 'Can be completed in under 10 minutes'),
('daily-practice', 'Designed for regular, ongoing use'),
('crisis-support', 'For immediate help in crisis situations'),
('professional-help', 'Involves working with mental health professionals'),
('self-guided', 'Can be done independently without guidance'),
('interactive', 'Includes interactive elements or exercises'),
('video-content', 'Contains video materials'),
('audio-content', 'Contains audio materials'),
('reading-material', 'Text-based content'),
('mobile-app', 'Available as a mobile application'),
('free-resource', 'Available at no cost'),
('premium-content', 'Paid or subscription-based content'),
('community-support', 'Includes peer support or community features');

-- Create indexes for better performance (MySQL 8.0 compatible)
SET @sql = 'CREATE INDEX idx_resources_search ON resources(title, description)';
SET @index_exists = (SELECT COUNT(*) FROM information_schema.statistics 
                     WHERE table_schema = 'mental_health_resources' 
                     AND table_name = 'resources' 
                     AND index_name = 'idx_resources_search');
SET @sql = IF(@index_exists = 0, @sql, 'SELECT "Index already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = 'CREATE INDEX idx_resources_created ON resources(created_at)';
SET @index_exists = (SELECT COUNT(*) FROM information_schema.statistics 
                     WHERE table_schema = 'mental_health_resources' 
                     AND table_name = 'resources' 
                     AND index_name = 'idx_resources_created');
SET @sql = IF(@index_exists = 0, @sql, 'SELECT "Index already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = 'CREATE INDEX idx_user_interactions_created ON user_interactions(created_at)';
SET @index_exists = (SELECT COUNT(*) FROM information_schema.statistics 
                     WHERE table_schema = 'mental_health_resources' 
                     AND table_name = 'user_interactions' 
                     AND index_name = 'idx_user_interactions_created');
SET @sql = IF(@index_exists = 0, @sql, 'SELECT "Index already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Display setup completion message
SELECT 'Database setup completed successfully!' as Status;
SELECT COUNT(*) as Categories_Count FROM categories;
SELECT COUNT(*) as Tags_Count FROM tags;