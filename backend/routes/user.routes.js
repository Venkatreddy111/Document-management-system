const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

// Get user profile
router.get('/profile/:id', authMiddleware, getProfile);

// Update user profile
router.put('/profile/:id', authMiddleware, updateProfile);

module.exports = router;
