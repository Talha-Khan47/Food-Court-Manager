const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod } = req.body;

        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            paymentMethod,
            paymentStatus: paymentMethod === 'Card' ? 'Paid' : 'Pending', // Assuming Dummy Card payment is instant
            status: 'Pending'
        });

        const createdOrder = await order.save();

        // Emit socket event to admin dashboard
        const io = req.app.get('io');
        if (io) {
            io.emit('new_order', createdOrder);
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.menuItem');

        if (order) {
            // Check if user owns order or is Admin
            if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'Admin') {
                res.json(order);
            } else {
                res.status(401).json({ message: 'Not authorized to view this order' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').populate('items.menuItem').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status;
            const updatedOrder = await order.save();

            // Emit socket event to the specific user's room
            const io = req.app.get('io');
            if (io) {
                io.to(order._id.toString()).emit('order_status_update', updatedOrder);
                io.emit('admin_order_update', updatedOrder); // Also update admin dashboard
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};
