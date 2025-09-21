const db = require('../config/database');

class Resource {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.content = data.content;
        this.resourceType = data.type;
        this.categoryId = data.category_id;
        this.url = data.url;
        this.thumbnail = data.thumbnail;
        this.author = data.author;
        this.durationMinutes = data.duration_minutes;
        this.difficultyLevel = data.difficulty_level;
        this.severityMatch = data.severity_match;
        this.viewsCount = data.views_count;
        this.ratingAverage = data.rating_average;
        this.ratingCount = data.rating_count;
        this.isFeatured = data.is_featured;
        this.isActive = data.is_active;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
    }

    // Get all resources with optional filters
    static async findAll(filters = {}) {
        try {
            let query = `
                SELECT r.*, 
                       c.name as category_name,
                       c.color as category_color,
                       COUNT(ui.id) as interaction_count
                FROM resources r 
                LEFT JOIN categories c ON r.category_id = c.id
                LEFT JOIN user_interactions ui ON r.id = ui.resource_id
                WHERE r.is_active = true
            `;
            const params = [];

            // Apply filters
            if (filters.category_id) {
                query += ' AND r.category_id = ?';
                params.push(filters.category_id);
            }

            if (filters.type) {
                query += ' AND r.type = ?';
                params.push(filters.type);
            }

            if (filters.severity_match) {
                query += ' AND (r.severity_match = ? OR r.severity_match = "all")';
                params.push(filters.severity_match);
            }

            if (filters.difficulty_level) {
                query += ' AND r.difficulty_level = ?';
                params.push(filters.difficulty_level);
            }

            if (filters.is_featured !== undefined) {
                query += ' AND r.is_featured = ?';
                params.push(filters.is_featured);
            }

            if (filters.search) {
                query += ' AND (r.title LIKE ? OR r.description LIKE ? OR r.content LIKE ?)';
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }

            // Group by resource id for interaction count
            query += ' GROUP BY r.id';

            // Apply sorting
            const orderBy = filters.sort_by || 'created_at';
            const order = filters.order || 'DESC';
            
            if (orderBy === 'popularity') {
                query += ' ORDER BY interaction_count DESC, r.rating_average DESC';
            } else if (orderBy === 'rating') {
                query += ' ORDER BY r.rating_average DESC';
            } else {
                query += ` ORDER BY r.${orderBy} ${order}`;
            }

            // Apply pagination
            if (filters.limit) {
                query += ' LIMIT ?';
                params.push(parseInt(filters.limit));

                if (filters.offset) {
                    query += ' OFFSET ?';
                    params.push(parseInt(filters.offset));
                }
            }

            const [rows] = await db.execute(query, params);
            return rows.map(row => new Resource(row));
        } catch (error) {
            console.error('Error finding resources:', error);
            throw error;
        }
    }

    // Get resource by ID with tags
    static async findById(id) {
        try {
            const [rows] = await db.execute(`
                SELECT r.*, 
                       c.name as category_name,
                       c.color as category_color
                FROM resources r 
                LEFT JOIN categories c ON r.category_id = c.id
                WHERE r.id = ? AND r.is_active = true
            `, [id]);

            if (rows.length === 0) {
                return null;
            }

            const resource = new Resource(rows[0]);

            // Get tags
            const [tagRows] = await db.execute(`
                SELECT rt.name, rt.color
                FROM resource_tags rt
                JOIN resource_tag_relations rtr ON rt.id = rtr.tag_id
                WHERE rtr.resource_id = ?
            `, [id]);

            resource.tags = tagRows;
            return resource;
        } catch (error) {
            console.error('Error finding resource by ID:', error);
            throw error;
        }
    }

    // Get resources by severity level for recommendations
    static async findBySeverity(severityLevel, limit = 10) {
        try {
            const [rows] = await db.execute(`
                SELECT r.*, 
                       rc.name as category_name,
                       rc.color as category_color
                FROM resources r 
                LEFT JOIN resource_categories rc ON r.category_id = rc.id
                WHERE r.is_active = true 
                AND (r.severity_match = ? OR r.severity_match = 'all')
                ORDER BY r.is_featured DESC, r.rating_average DESC, r.views_count DESC
                LIMIT ?
            `, [severityLevel, limit]);

            return rows.map(row => new Resource(row));
        } catch (error) {
            console.error('Error finding resources by severity:', error);
            throw error;
        }
    }

    // Get featured resources
    static async getFeatured(limit = 6) {
        try {
            const [rows] = await db.execute(`
                SELECT r.*, 
                       c.name as category_name,
                       c.color as category_color
                FROM resources r 
                LEFT JOIN categories c ON r.category_id = c.id
                WHERE r.is_active = true AND r.is_featured = true
                ORDER BY r.rating_average DESC, r.views_count DESC
                LIMIT ?
            `, [limit]);

            return rows.map(row => new Resource(row));
        } catch (error) {
            console.error('Error finding featured resources:', error);
            throw error;
        }
    }

    // Increment view count
    static async incrementViewCount(id) {
        try {
            await db.execute(`
                UPDATE resources 
                SET views_count = views_count + 1 
                WHERE id = ?
            `, [id]);
        } catch (error) {
            console.error('Error incrementing view count:', error);
            throw error;
        }
    }

    // Get user favorites
    static async getUserFavorites(userId) {
        try {
            const [rows] = await db.execute(`
                SELECT r.*, 
                       c.name as category_name,
                       c.color as category_color
                FROM resources r 
                LEFT JOIN categories c ON r.category_id = c.id
                JOIN user_interactions ui ON r.id = ui.resource_id
                WHERE ui.user_id = ? AND ui.interaction_type = 'favorite'
                AND r.is_active = true
                ORDER BY ui.created_at DESC
            `, [userId]);

            return rows.map(row => new Resource(row));
        } catch (error) {
            console.error('Error getting user favorites:', error);
            throw error;
        }
    }

    // Get total count for pagination
    static async getTotalCount(filters = {}) {
        try {
            let query = 'SELECT COUNT(*) as total FROM resources WHERE is_active = true';
            const params = [];

            if (filters.category_id) {
                query += ' AND category_id = ?';
                params.push(filters.category_id);
            }

            if (filters.resource_type) {
                query += ' AND resource_type = ?';
                params.push(filters.resource_type);
            }

            if (filters.severity_match) {
                query += ' AND (severity_match = ? OR severity_match = "all")';
                params.push(filters.severity_match);
            }

            if (filters.search) {
                query += ' AND (title LIKE ? OR description LIKE ? OR content LIKE ?)';
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }

            const [rows] = await db.execute(query, params);
            return rows[0].total;
        } catch (error) {
            console.error('Error getting total count:', error);
            throw error;
        }
    }
}

module.exports = Resource;