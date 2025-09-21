const db = require('../config/database');

class Resource {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.content = data.content;
        this.type = data.type;
        this.categoryId = data.category_id;
        this.categoryName = data.category_name;
        this.categoryColor = data.category_color;
        this.url = data.url;
        this.thumbnail = data.thumbnail;
        this.author = data.author;
        this.durationMinutes = data.duration_minutes;
        this.difficultyLevel = data.difficulty_level;
        this.severityMatch = data.severity_match;
        this.viewsCount = data.views_count || 0;
        this.ratingAverage = data.rating_average || 0;
        this.ratingCount = data.rating_count || 0;
        this.isFeatured = data.is_featured;
        this.isActive = data.is_active;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
    }

    // Simple method to get all resources
    static async findAll(filters = {}) {
        try {
            console.log('Resource.findAll called with filters:', filters);
            
            let query = `
                SELECT r.*, 
                       c.name as category_name,
                       c.color as category_color
                FROM resources r 
                LEFT JOIN categories c ON r.category_id = c.id
                WHERE r.is_active = 1
            `;
            const params = [];

            // Apply basic filters
            if (filters.category_id) {
                query += ' AND r.category_id = ?';
                params.push(filters.category_id);
            }

            if (filters.type) {
                query += ' AND r.type = ?';
                params.push(filters.type);
            }

            if (filters.is_featured !== undefined) {
                query += ' AND r.is_featured = ?';
                params.push(filters.is_featured ? 1 : 0);
            }

            // Simple ordering
            query += ' ORDER BY r.created_at DESC';

            // Apply limit
            if (filters.limit) {
                query += ' LIMIT ' + parseInt(filters.limit);
            }

            console.log('Executing query:', query);
            console.log('With parameters:', params);

            const [rows] = await db.execute(query, params);
            console.log('Query returned', rows.length, 'rows');
            
            return rows.map(row => new Resource(row));
        } catch (error) {
            console.error('Error in Resource.findAll:', error);
            throw error;
        }
    }

    // Get featured resources
    static async getFeatured(limit = 6) {
        try {
            console.log('Resource.getFeatured called with limit:', limit);
            
            const query = `
                SELECT r.*, 
                       c.name as category_name,
                       c.color as category_color
                FROM resources r 
                LEFT JOIN categories c ON r.category_id = c.id
                WHERE r.is_active = 1 AND r.is_featured = 1
                ORDER BY r.created_at DESC
                LIMIT ` + parseInt(limit);
            
            console.log('Executing featured query with limit:', limit);
            const [rows] = await db.execute(query);
            console.log('Featured query returned', rows.length, 'rows');
            
            return rows.map(row => new Resource(row));
        } catch (error) {
            console.error('Error in Resource.getFeatured:', error);
            throw error;
        }
    }

    // Get resource by ID
    static async findById(id) {
        try {
            console.log('Resource.findById called with id:', id);
            
            const query = `
                SELECT r.*, 
                       c.name as category_name,
                       c.color as category_color
                FROM resources r 
                LEFT JOIN categories c ON r.category_id = c.id
                WHERE r.id = ? AND r.is_active = 1
            `;
            
            const [rows] = await db.execute(query, [id]);
            console.log('findById returned', rows.length, 'rows');
            
            return rows.length > 0 ? new Resource(rows[0]) : null;
        } catch (error) {
            console.error('Error in Resource.findById:', error);
            throw error;
        }
    }

    // Search resources
    static async search(searchTerm, filters = {}) {
        try {
            console.log('Resource.search called with term:', searchTerm, 'filters:', filters);
            
            let query = `
                SELECT r.*, 
                       c.name as category_name,
                       c.color as category_color
                FROM resources r 
                LEFT JOIN categories c ON r.category_id = c.id
                WHERE r.is_active = 1
                AND (r.title LIKE ? OR r.description LIKE ? OR r.content LIKE ?)
            `;
            
            const searchPattern = `%${searchTerm}%`;
            const params = [searchPattern, searchPattern, searchPattern];

            // Apply filters
            if (filters.category_id) {
                query += ' AND r.category_id = ?';
                params.push(filters.category_id);
            }

            if (filters.type) {
                query += ' AND r.type = ?';
                params.push(filters.type);
            }

            query += ' ORDER BY r.created_at DESC';

            if (filters.limit) {
                query += ' LIMIT ' + parseInt(filters.limit);
            }

            console.log('Executing search query:', query);
            console.log('With parameters:', params);

            const [rows] = await db.execute(query, params);
            console.log('Search returned', rows.length, 'rows');
            
            return rows.map(row => new Resource(row));
        } catch (error) {
            console.error('Error in Resource.search:', error);
            throw error;
        }
    }

    // Get resources by severity
    static async getBySeverity(severity, limit = 10) {
        try {
            console.log('Resource.getBySeverity called with severity:', severity, 'limit:', limit);
            
            const query = `
                SELECT r.*, 
                       c.name as category_name,
                       c.color as category_color
                FROM resources r 
                LEFT JOIN categories c ON r.category_id = c.id
                WHERE r.is_active = 1 
                AND (r.severity_match = ? OR r.severity_match = 'all')
                ORDER BY r.rating_average DESC, r.created_at DESC
                LIMIT ` + parseInt(limit);
            
            const [rows] = await db.execute(query, [severity]);
            console.log('getBySeverity returned', rows.length, 'rows');
            
            return rows.map(row => new Resource(row));
        } catch (error) {
            console.error('Error in Resource.getBySeverity:', error);
            throw error;
        }
    }

    // Get total count of resources with filters
    static async getTotalCount(filters = {}) {
        try {
            console.log('Resource.getTotalCount called with filters:', filters);
            
            let query = `
                SELECT COUNT(*) as total
                FROM resources r 
                WHERE r.is_active = 1
            `;
            const params = [];

            // Apply basic filters
            if (filters.category_id) {
                query += ' AND r.category_id = ?';
                params.push(filters.category_id);
            }

            if (filters.type) {
                query += ' AND r.type = ?';
                params.push(filters.type);
            }

            if (filters.search) {
                query += ' AND (r.title LIKE ? OR r.description LIKE ? OR r.content LIKE ?)';
                const searchPattern = `%${filters.search}%`;
                params.push(searchPattern, searchPattern, searchPattern);
            }

            const [rows] = await db.execute(query, params);
            console.log('getTotalCount returned:', rows[0].total);
            
            return rows[0].total;
        } catch (error) {
            console.error('Error in Resource.getTotalCount:', error);
            throw error;
        }
    }
}

module.exports = Resource;