const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
