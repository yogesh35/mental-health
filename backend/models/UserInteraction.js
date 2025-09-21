const db = require('../config/database');

class UserInteraction {
    constructor(data) {
        this.id = data.id;
        this.userId = data.user_id;
        this.resourceId = data.resource_id;
        this.interactionType = data.interaction_type;
        this.ratingValue = data.rating_value;
        this.createdAt = data.created_at;
    }

    // Add or update user interaction
    static async upsert(userId, resourceId, interactionType, ratingValue = null) {
        try {
            if (interactionType === 'rating' && (!ratingValue || ratingValue < 1 || ratingValue > 5)) {
                throw new Error('Rating value must be between 1 and 5');
            }

            // Check if interaction already exists
            const [existing] = await db.execute(`
                SELECT id FROM user_resource_interactions 
                WHERE user_id = ? AND resource_id = ? AND interaction_type = ?
            `, [userId, resourceId, interactionType]);

            if (existing.length > 0) {
                // Update existing interaction
                await db.execute(`
                    UPDATE user_resource_interactions 
                    SET rating_value = ?
                    WHERE user_id = ? AND resource_id = ? AND interaction_type = ?
                `, [ratingValue, userId, resourceId, interactionType]);
            } else {
                // Insert new interaction
                await db.execute(`
                    INSERT INTO user_resource_interactions 
                    (user_id, resource_id, interaction_type, rating_value) 
                    VALUES (?, ?, ?, ?)
                `, [userId, resourceId, interactionType, ratingValue]);
            }

            // Update resource rating if this is a rating interaction
            if (interactionType === 'rating') {
                await this.updateResourceRating(resourceId);
            }

            return true;
        } catch (error) {
            console.error('Error upserting user interaction:', error);
            throw error;
        }
    }

    // Remove user interaction
    static async remove(userId, resourceId, interactionType) {
        try {
            const [result] = await db.execute(`
                DELETE FROM user_resource_interactions 
                WHERE user_id = ? AND resource_id = ? AND interaction_type = ?
            `, [userId, resourceId, interactionType]);

            // Update resource rating if this was a rating interaction
            if (interactionType === 'rating') {
                await this.updateResourceRating(resourceId);
            }

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error removing user interaction:', error);
            throw error;
        }
    }

    // Check if user has specific interaction with resource
    static async hasInteraction(userId, resourceId, interactionType) {
        try {
            const [rows] = await db.execute(`
                SELECT id FROM user_resource_interactions 
                WHERE user_id = ? AND resource_id = ? AND interaction_type = ?
            `, [userId, resourceId, interactionType]);

            return rows.length > 0;
        } catch (error) {
            console.error('Error checking user interaction:', error);
            throw error;
        }
    }

    // Get user's rating for a resource
    static async getUserRating(userId, resourceId) {
        try {
            const [rows] = await db.execute(`
                SELECT rating_value FROM user_resource_interactions 
                WHERE user_id = ? AND resource_id = ? AND interaction_type = 'rating'
            `, [userId, resourceId]);

            return rows.length > 0 ? rows[0].rating_value : null;
        } catch (error) {
            console.error('Error getting user rating:', error);
            throw error;
        }
    }

    // Update resource average rating
    static async updateResourceRating(resourceId) {
        try {
            const [rows] = await db.execute(`
                SELECT AVG(rating_value) as avg_rating 
                FROM user_resource_interactions 
                WHERE resource_id = ? AND interaction_type = 'rating'
            `, [resourceId]);

            const avgRating = rows[0].avg_rating || 0;

            await db.execute(`
                UPDATE resources 
                SET rating = ? 
                WHERE id = ?
            `, [avgRating, resourceId]);
        } catch (error) {
            console.error('Error updating resource rating:', error);
            throw error;
        }
    }

    // Get user interaction statistics
    static async getUserStats(userId) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    interaction_type,
                    COUNT(*) as count
                FROM user_resource_interactions 
                WHERE user_id = ?
                GROUP BY interaction_type
            `, [userId]);

            const stats = {
                views: 0,
                favorites: 0,
                ratings: 0,
                downloads: 0
            };

            rows.forEach(row => {
                stats[row.interaction_type + 's'] = row.count;
            });

            return stats;
        } catch (error) {
            console.error('Error getting user stats:', error);
            throw error;
        }
    }

    // Get resource interaction statistics
    static async getResourceStats(resourceId) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    interaction_type,
                    COUNT(*) as count,
                    AVG(CASE WHEN interaction_type = 'rating' THEN rating_value END) as avg_rating
                FROM user_resource_interactions 
                WHERE resource_id = ?
                GROUP BY interaction_type
            `, [resourceId]);

            const stats = {
                views: 0,
                favorites: 0,
                ratings: 0,
                downloads: 0,
                avgRating: 0
            };

            rows.forEach(row => {
                stats[row.interaction_type + 's'] = row.count;
                if (row.interaction_type === 'rating') {
                    stats.avgRating = row.avg_rating || 0;
                }
            });

            return stats;
        } catch (error) {
            console.error('Error getting resource stats:', error);
            throw error;
        }
    }
}

module.exports = UserInteraction;