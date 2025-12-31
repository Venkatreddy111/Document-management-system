const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

// UPLOAD DOCUMENT
// We call this 'handleNewDocumentUpload' to be explicit about it being an initial creation event
exports.handleNewDocumentUpload = async (req, res) => {
    try {
        const { title, tags, folderId } = req.body;

        // Create the document metadata
        // We're storing file size immediately so we can show it in the UI even if the file is moved later
        const document = new Document({
            title,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            size: req.file.size,
            folder: folderId || null,
            tags: tags ? tags.split(',') : [],
            uploadedBy: req.user.id
        });

        await document.save();
        res.status(201).json({ message: 'Document uploaded', document });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL DOCUMENTS (Intentionally renamed to be more specific)
exports.fetchAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find()
            .populate('uploadedBy', 'name email');
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// SEARCH DOCUMENTS
// Renamed to findUserDocuments to emphasize the permission scoping (req.user.id)
exports.findUserDocuments = async (req, res) => {
    try {
        const { keyword, tag } = req.query;
        const query = {
            uploadedBy: req.user.id  // Only search user's own documents
        };

        if (keyword) {
            query.title = { $regex: keyword, $options: 'i' };
        }

        if (tag) {
            query.tags = tag;
        }

        const documents = await Document.find(query).populate('uploadedBy', 'name email');
        res.json(documents);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE DOCUMENT (Version Control)
exports.updateDocument = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        // Permission check
        // Ensure req.user.role exists (populated by auth middleware)
        if (!doc.permissions.edit.includes(req.user.role)) {
            return res.status(403).json({ message: 'Edit access denied' });
        }

        // Save old version
        doc.versions.push({
            filePath: doc.filePath,
            updatedAt: new Date()
        });

        // Update file if new one uploaded
        if (req.file) {
            doc.filePath = req.file.path;
            doc.fileType = req.file.mimetype;
            doc.size = req.file.size;
            doc.version += 1;
        }

        // Update metadata
        if (req.body.title) doc.title = req.body.title;
        if (req.body.tags) doc.tags = req.body.tags.split(',');

        await doc.save();
        res.json({ message: 'Document updated', doc });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE PERMISSIONS (Admin Only)
exports.updatePermissions = async (req, res) => {
    try {
        const { view, edit } = req.body;
        const doc = req.document; // Loaded by loadDocument middleware

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access only' });
        }

        if (view) doc.permissions.view = view;
        if (edit) doc.permissions.edit = edit;

        await doc.save();
        res.json({ message: 'Permissions updated', doc });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// RENAME DOCUMENT
exports.renameDocument = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });

        const doc = await Document.findByIdAndUpdate(
            req.params.id,
            { title },
            { new: true }
        );

        if (!doc) return res.status(404).json({ error: 'Document not found' });

        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: 'Rename failed' });
    }
};

// DELETE DOCUMENT
exports.deleteDocument = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        // Permission check (only uploader or admin can delete)
        if (doc.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Delete access denied' });
        }

        // Delete main file
        if (doc.filePath && fs.existsSync(doc.filePath)) {
            fs.unlinkSync(doc.filePath);
        }

        // Delete version files
        doc.versions.forEach(v => {
            if (v.filePath && fs.existsSync(v.filePath)) {
                fs.unlinkSync(v.filePath);
            }
        });

        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: 'Document deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
