const express = require('express');
const router = express.Router();
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const loadDocument = require('../middleware/loadDocument');
const { canView, canEdit } = require('../middleware/permissionMiddleware');
const {
    uploadDocument,
    getDocuments,
    searchDocuments,
    updateDocument,
    updatePermissions,
    deleteDocument
} = require('../controllers/documentController');

// Search documents
router.get('/search', authMiddleware, searchDocuments);

// Upload document
router.post(
    '/upload',
    authMiddleware,
    upload.single('file'),
    uploadDocument
);

// Get single document (View Permission)
router.get(
    '/:id',
    authMiddleware,
    loadDocument,
    canView,
    (req, res) => {
        res.json(req.document);
    }
);

// Update document (Edit Permission + Version Control)
router.put(
    '/:id',
    authMiddleware,
    loadDocument,
    canEdit,
    upload.single('file'),
    updateDocument
);

// Download document (View Permission)
router.get(
    '/download/:id',
    authMiddleware,
    loadDocument,
    canView,
    (req, res) => {
        res.download(path.resolve(req.document.filePath));
    }
);

// Update permissions (Admin Only, checking inside controller but using loadDocument)
router.put(
    '/permissions/:id',
    authMiddleware,
    loadDocument,
    updatePermissions
);

// Delete document
router.delete('/:id', authMiddleware, deleteDocument);

// Get all documents
router.get('/', authMiddleware, getDocuments);

module.exports = router;
