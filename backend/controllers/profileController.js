const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.id || req.user.id;

        // Authorization: Only allow own profile or admin
        if (userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Calculate stats
        const Document = require('../models/Document');
        const documents = await Document.find({ uploadedBy: userId });

        const totalFiles = documents.length;
        const totalStorage = documents.reduce((sum, doc) => sum + (doc.size || 0), 0);

        res.json({
            ...user.toObject(),
            totalFiles,
            totalStorage
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.id || req.user.id;

        // Authorization: Only allow own profile or admin
        if (userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { name, email, avatar, currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update name, email and avatar
        if (name) user.name = name;
        if (email) user.email = email;
        if (avatar !== undefined) user.avatar = avatar;
        user.isProfileComplete = true;

        // Update password if provided
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Current password is required to set a new password' });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        const updatedUser = await User.findById(userId).select('-password');
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
