const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

// Get user profile (Disable Cache)
router.get('/profile/:id', authMiddleware, (req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
    next();
}, getProfile);

// Update user profile
router.put('/profile/:id', authMiddleware, updateProfile);

module.exports = router;
