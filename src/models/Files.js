const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    buffer: {
        type: Object,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Files', FileSchema);