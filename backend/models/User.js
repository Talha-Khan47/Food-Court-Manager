const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
        // Optional because we might allow other auth methods later
    },
    role: {
        type: String,
        enum: ['Customer', 'Admin'],
        default: 'Customer',
    },
    avatar: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
