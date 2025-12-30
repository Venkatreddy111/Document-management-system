const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    createFolder,
    getFolderContents,
    getBreadcrumbs,
    getFolderTree,
    deleteFolder
} = require('../controllers/folderController');

router.post('/', authMiddleware, createFolder);
router.get('/tree', authMiddleware, getFolderTree);
router.delete('/:id', authMiddleware, deleteFolder);
router.get('/:id', authMiddleware, getFolderContents);
router.get('/breadcrumbs/:id', authMiddleware, getBreadcrumbs);

module.exports = router;
