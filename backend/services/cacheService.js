class CacheService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 7 * 60 * 1000; // 7 minutes cache for larger datasets
        this.maxCacheSize = 50; // Limit cache size to prevent memory issues
    }

    set(key, data) {
        // Clean up if cache is getting too large
        if (this.cache.size >= this.maxCacheSize) {
            this.cleanup();
        }

        const cacheEntry = {
            data: data,
            timestamp: Date.now(),
            expiresAt: Date.now() + this.cacheTimeout,
            size: JSON.stringify(data).length // Track data size
        };
        this.cache.set(key, cacheEntry);
        console.log(`Cached data for key: ${key} (size: ${(cacheEntry.size / 1024).toFixed(1)}KB)`);
    }

    get(key) {
        const cacheEntry = this.cache.get(key);
        
        if (!cacheEntry) {
            return null;
        }

        // Check if cache has expired
        if (Date.now() > cacheEntry.expiresAt) {
            this.cache.delete(key);
            console.log(`Cache expired for key: ${key}`);
            return null;
        }

        console.log(`Cache hit for key: ${key}`);
        return cacheEntry.data;
    }

    clear() {
        this.cache.clear();
        console.log('Cache cleared');
    }

    // Clean expired entries
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
            }
        }
    }

    // Generate cache key for API requests
    generateKey(service, params = {}) {
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}:${params[key]}`)
            .join('|');
        return `${service}_${sortedParams}`;
    }
}

module.exports = new CacheService();