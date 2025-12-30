const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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

module.exports = mongoose.model('Folder', folderSchema);
