const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileType: {
        type: String
    },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    },
    tags: [String],
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    version: {
        type: Number,
        default: 1
    },
    versions: [
        {
            filePath: String,
            updatedAt: Date
        }
    ],
    permissions: {
        view: {
            type: [String],
            default: ['admin', 'user']
        },
        edit: {
            type: [String],
            default: ['admin']
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
