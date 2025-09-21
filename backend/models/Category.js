const db = require('../config/database');

class Category {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.color = data.color;
        this.icon = data.icon;
        this.sortOrder = data.sort_order;
        this.isActive = data.is_active;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
    }

    // Get all active categories
    static async findAll() {
        try {
            const [rows] = await db.execute(`
                SELECT c.*, 
                       COUNT(r.id) as resource_count
                FROM resource_categories c
                LEFT JOIN resources r ON c.id = r.category_id AND r.is_active = true
                WHERE c.is_active = true
                GROUP BY c.id
                ORDER BY c.sort_order ASC, c.name ASC
            `);

            return rows.map(row => new Category(row));
        } catch (error) {
            console.error('Error finding categories:', error);
            throw error;
        }
    }

    // Get category by ID
    static async findById(id) {
        try {
            const [rows] = await db.execute(`
                SELECT c.*, 
                       COUNT(r.id) as resource_count
                FROM resource_categories c
                LEFT JOIN resources r ON c.id = r.category_id AND r.is_active = true
                WHERE c.id = ? AND c.is_active = true
                GROUP BY c.id
            `, [id]);

            if (rows.length === 0) {
                return null;
            }

            return new Category(rows[0]);
        } catch (error) {
            console.error('Error finding category by ID:', error);
            throw error;
        }
    }
}

module.exports = Category;