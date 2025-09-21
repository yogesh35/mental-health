const { body } = require('express-validator');

const resourceValidation = {
    // Validate rating input
    rateResource: [
        body('rating')
            .isInt({ min: 1, max: 5 })
            .withMessage('Rating must be an integer between 1 and 5')
    ],

    // Validate search query
    searchQuery: [
        body('query')
            .isLength({ min: 2 })
            .withMessage('Search query must be at least 2 characters long')
            .trim()
            .escape()
    ]
};

module.exports = resourceValidation;