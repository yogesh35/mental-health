const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ResourceAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Helper method to get auth headers
    getAuthHeaders() {
        // Temporarily disable authentication for resources
        return {
            'Content-Type': 'application/json'
        };
        // const token = localStorage.getItem('descope-token') || sessionStorage.getItem('descope-token');
        // return {
        //     'Content-Type': 'application/json',
        //     ...(token && { 'Authorization': `Bearer ${token}` })
        // };
    }

    // Helper method to handle API responses
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    // Get all resources with filters
    async getResources(filters = {}) {
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        });

        const url = `${this.baseURL}/resources${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const response = await fetch(url, {
            headers: this.getAuthHeaders()
        });

        return this.handleResponse(response);
    }

    // Get all resources (simplified method for enhanced resource hub)
    async getAllResources(limit = 20) {
        return this.getResources({ limit });
    }

    // Get single resource by ID
    async getResource(id) {
        const response = await fetch(`${this.baseURL}/resources/${id}`, {
            headers: this.getAuthHeaders()
        });

        return this.handleResponse(response);
    }

    // Get featured resources
    async getFeaturedResources(limit = 6) {
        const response = await fetch(`${this.baseURL}/resources/featured?limit=${limit}`, {
            headers: this.getAuthHeaders()
        });

        return this.handleResponse(response);
    }

    // Get resources by severity level
    async getResourcesBySeverity(severity, limit = 10) {
        const response = await fetch(`${this.baseURL}/resources/severity/${severity}?limit=${limit}`, {
            headers: this.getAuthHeaders()
        });

        return this.handleResponse(response);
    }

    // Search resources
    async searchResources(query, filters = {}) {
        const queryParams = new URLSearchParams({
            q: query,
            ...filters
        });

        const response = await fetch(`${this.baseURL}/resources/search?${queryParams.toString()}`, {
            headers: this.getAuthHeaders()
        });

        return this.handleResponse(response);
    }

    // Get all categories
    async getCategories() {
        const response = await fetch(`${this.baseURL}/categories`, {
            headers: this.getAuthHeaders()
        });

        return this.handleResponse(response);
    }

    // Toggle favorite status
    async toggleFavorite(resourceId) {
        const response = await fetch(`${this.baseURL}/resources/${resourceId}/favorite`, {
            method: 'POST',
            headers: this.getAuthHeaders()
        });

        return this.handleResponse(response);
    }

    // Rate a resource
    async rateResource(resourceId, rating) {
        const response = await fetch(`${this.baseURL}/resources/${resourceId}/rate`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ rating })
        });

        return this.handleResponse(response);
    }

    // Get user favorites
    async getUserFavorites() {
        const response = await fetch(`${this.baseURL}/user/favorites`, {
            headers: this.getAuthHeaders()
        });

        return this.handleResponse(response);
    }

    // Get recommendations based on assessment
    async getRecommendations(assessmentResults) {
        const response = await fetch(`${this.baseURL}/recommendations`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ assessmentResults })
        });

        return this.handleResponse(response);
    }

    // Get emergency resources
    async getEmergencyResources() {
        const response = await fetch(`${this.baseURL}/emergency`, {
            headers: this.getAuthHeaders()
        });

        return this.handleResponse(response);
    }

    // Track resource view
    async trackView(resourceId) {
        try {
            await fetch(`${this.baseURL}/analytics/view`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ resourceId })
            });
        } catch (error) {
            console.warn('Failed to track view:', error);
        }
    }

    // Track resource download
    async trackDownload(resourceId) {
        try {
            await fetch(`${this.baseURL}/analytics/download`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ resourceId })
            });
        } catch (error) {
            console.warn('Failed to track download:', error);
        }
    }

    // Get user and resource statistics
    async getStats(resourceId = null) {
        const queryParams = resourceId ? `?resourceId=${resourceId}` : '';
        
        const response = await fetch(`${this.baseURL}/stats${queryParams}`, {
            headers: this.getAuthHeaders()
        });

        return this.handleResponse(response);
    }
}

// Create singleton instance
const resourceAPI = new ResourceAPI();

export default resourceAPI;