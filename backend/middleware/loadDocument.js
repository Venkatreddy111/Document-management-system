const Document = require('../models/Document');

module.exports = async (req, res, next) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }
        req.document = doc;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
