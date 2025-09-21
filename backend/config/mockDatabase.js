// Mock database for testing when MySQL is not available
class MockDatabase {
    constructor() {
        this.categories = [];
        this.tags = [];
        this.resources = [];
        this.interactions = [];
        this.nextId = 1;
    }

    async execute(query, params = []) {
        const sql = query.toLowerCase().trim();
        
        if (sql.startsWith('create table') || sql.startsWith('create database')) {
            return [{ affectedRows: 0 }];
        }
        
        if (sql.startsWith('select')) {
            return this.handleSelect(query, params);
        }
        
        if (sql.startsWith('insert')) {
            return this.handleInsert(query, params);
        }
        
        if (sql.startsWith('update')) {
            return this.handleUpdate(query, params);
        }
        
        if (sql.startsWith('delete')) {
            return this.handleDelete(query, params);
        }
        
        return [[]];
    }

    handleSelect(query, params) {
        if (query.includes('resource_categories')) {
            return [this.categories.map(cat => ({
                ...cat,
                resource_count: this.resources.filter(r => r.category_id === cat.id).length
            }))];
        }
        
        if (query.includes('resources r')) {
            let filteredResources = [...this.resources];
            
            // Apply basic filtering based on common patterns
            if (params.length > 0) {
                // Simple parameter matching for featured, category, etc.
                if (query.includes('is_featured')) {
                    filteredResources = filteredResources.filter(r => r.is_featured === params[0]);
                }
                if (query.includes('severity_match')) {
                    const severity = params.find(p => ['low', 'mild', 'moderate', 'severe'].includes(p));
                    if (severity) {
                        filteredResources = filteredResources.filter(r => 
                            r.severity_match === severity || r.severity_match === 'all'
                        );
                    }
                }
            }
            
            return [filteredResources];
        }
        
        if (query.includes('resource_tags')) {
            return [this.tags];
        }
        
        return [[]];
    }

    handleInsert(query, params) {
        const id = this.nextId++;
        
        if (query.includes('resource_categories')) {
            const category = {
                id,
                name: params[0],
                description: params[1],
                color: params[2],
                icon: params[3],
                sort_order: params[4],
                is_active: true,
                created_at: new Date().toISOString()
            };
            this.categories.push(category);
        }
        
        if (query.includes('resource_tags')) {
            const tag = {
                id,
                name: params[0],
                description: params[1],
                color: params[2],
                created_at: new Date().toISOString()
            };
            this.tags.push(tag);
        }
        
        if (query.includes('resources')) {
            const resource = {
                id,
                title: params[0],
                description: params[1],
                content: params[2],
                resource_type: params[3],
                category_id: params[4],
                url: params[5],
                image_url: params[6],
                author: params[7],
                duration_minutes: params[8],
                difficulty_level: params[9],
                severity_match: params[10],
                is_featured: params[11],
                rating: 4.0 + Math.random(),
                view_count: Math.floor(Math.random() * 1000),
                is_active: true,
                created_at: new Date().toISOString()
            };
            this.resources.push(resource);
        }
        
        return [{ insertId: id, affectedRows: 1 }];
    }

    handleUpdate(query, params) {
        return [{ affectedRows: 1 }];
    }

    handleDelete(query, params) {
        if (query.includes('resource_categories')) {
            this.categories = [];
        }
        if (query.includes('resource_tags')) {
            this.tags = [];
        }
        if (query.includes('resources')) {
            this.resources = [];
        }
        return [{ affectedRows: 1 }];
    }
}

module.exports = MockDatabase;