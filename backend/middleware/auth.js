const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and extract user info
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        // For optional authentication, continue without user
        req.user = null;
        return next();
    }

    try {
        // For Descope tokens, we'll extract user info differently
        // This is a simplified version - in production, you'd verify with Descope
        const decoded = jwt.decode(token);
        
        if (decoded && decoded.sub) {
            req.user = {
                id: decoded.sub,
                email: decoded.email,
                name: decoded.name
            };
        } else {
            req.user = null;
        }
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        req.user = null;
        next();
    }
};

// Middleware to require authentication
const requireAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    try {
        const decoded = jwt.decode(token);
        
        if (!decoded || !decoded.sub) {
            return res.status(401).json({
                success: false,
                message: 'Invalid access token'
            });
        }

        req.user = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name
        };
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid access token'
        });
    }
};

module.exports = {
    authenticateToken,
    requireAuth
};