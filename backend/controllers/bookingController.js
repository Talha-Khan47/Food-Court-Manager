const Booking = require('../models/Booking');
const Table = require('../models/Table');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { date, timeSlot, guests } = req.body;

        // In a real app, we'd check table capacity. For simplicity, we'll just find an available table.
        // Or we let the admin manage tables, but for now let's just create a dummy table if none exist.
        
        let table = await Table.findOne();
        if (!table) {
            table = await Table.create({ tableNumber: 1, capacity: 4 });
        }

        // Check if user already has a booking for this time
        const existingBooking = await Booking.findOne({ 
            user: req.user._id, 
            date, 
            timeSlot,
            status: { $in: ['Pending', 'Confirmed'] }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'You already have a booking for this time' });
        }

        const booking = new Booking({
            user: req.user._id,
            table: table._id, // Assign to the first available table
            date,
            timeSlot,
            status: 'Pending'
        });

        const createdBooking = await booking.save();
        
        // Notify admin via socket
        const io = req.app.get('io');
        if (io) {
            io.emit('new_booking', createdBooking);
        }

        res.status(201).json(createdBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('table').sort({ date: 1, timeSlot: 1 });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'name email').populate('table').sort({ date: 1, timeSlot: 1 });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings
};
