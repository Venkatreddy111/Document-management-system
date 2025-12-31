const Folder = require('../models/Folder');
const Document = require('../models/Document');
const fs = require('fs');

// CREATE FOLDER
exports.createFolder = async (req, res) => {
    try {
        const { name, parent } = req.body;
        const folder = new Folder({
            name,
            parent: parent || null,
            createdBy: req.user.id
        });
        await folder.save();
        res.status(201).json({ message: 'Folder created', folder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET FOLDER CONTENTS
exports.getFolderContents = async (req, res) => {
    try {
        const { id } = req.params;
        const folderId = id === 'root' ? null : id;

        const folders = await Folder.find({ parent: folderId, createdBy: req.user.id });

        // Query documents - handle both null folder and specific folder ID
        const documentQuery = {
            folder: folderId,
            uploadedBy: req.user.id
        };

        const documents = await Document.find(documentQuery).populate('uploadedBy', 'name email');

        res.json({ folders, documents });
    } catch (error) {
        console.error('Error in getFolderContents:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET BREADCRUMBS
exports.getBreadcrumbs = async (req, res) => {
    try {
        const { id } = req.params;
        const breadcrumbs = [];
        let currentId = id;

        while (currentId && currentId !== 'root') {
            const folder = await Folder.findById(currentId).select('name parent');
            if (!folder) break;
            breadcrumbs.unshift(folder);
            currentId = folder.parent;
        }

        res.json(breadcrumbs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// GET FOLDER TREE (Hierarchical)
exports.getFolderTree = async (req, res) => {
    try {
        const allFolders = await Folder.find({ createdBy: req.user.id }).lean();

        const folderMap = {};
        allFolders.forEach(f => {
            folderMap[f._id] = { ...f, children: [] };
        });

        const rootFolders = [];
        allFolders.forEach(f => {
            if (f.parent) {
                if (folderMap[f.parent]) {
                    folderMap[f.parent].children.push(folderMap[f._id]);
                }
            } else {
                rootFolders.push(folderMap[f._id]);
            }
        });

        res.json(rootFolders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// RENAME FOLDER
exports.renameFolder = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });

        const folder = await Folder.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );

        if (!folder) return res.status(404).json({ error: 'Folder not found' });

        res.json(folder);
    } catch (err) {
        res.status(500).json({ error: 'Rename failed' });
    }
};

// DELETE FOLDER (Recursive)
exports.deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const folder = await Folder.findById(id);
        if (!folder) return res.status(404).json({ message: 'Folder not found' });

        // Permission check
        if (folder.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Delete access denied' });
        }

        // Recursive deletion helper
        const recursiveDelete = async (folderId) => {
            // 1. Delete all documents in this folder
            const docs = await Document.find({ folder: folderId });
            for (const doc of docs) {
                // Delete physical file
                if (doc.filePath && fs.existsSync(doc.filePath)) {
                    fs.unlinkSync(doc.filePath);
                }
                // Delete version files
                doc.versions.forEach(v => {
                    if (v.filePath && fs.existsSync(v.filePath)) {
                        fs.unlinkSync(v.filePath);
                    }
                });
                await Document.findByIdAndDelete(doc._id);
            }

            // 2. Find and delete subfolders
            const subfolders = await Folder.find({ parent: folderId });
            for (const sub of subfolders) {
                await recursiveDelete(sub._id);
            }

            // 3. Delete the folder itself
            await Folder.findByIdAndDelete(folderId);
        };

        await recursiveDelete(id);
        res.json({ message: 'Folder and all contents deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
