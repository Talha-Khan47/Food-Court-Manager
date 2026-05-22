const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MenuItem',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number, // Price at the time of order
                required: true,
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    paymentMethod: {
        type: String,
        enum: ['Card', 'Pay at Counter'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
