const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Configure Socket.io
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust for production
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible to our router
app.set('io', io);

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // Clients can join a room to listen for their specific order updates
    socket.on('join_order_room', (orderId) => {
        socket.join(orderId);
        console.log(`Socket ${socket.id} joined room ${orderId}`);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

const path = require('path');

// Basic route for testing (you can remove this if serving static files)
// app.get('/', (req, res) => {
//     res.send('Food Court API is running');
// });

// Routes Setup
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/tables', require('./routes/tableRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) =>
        res.sendFile(
            path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html')
        )
    );
} else {
    app.get('/', (req, res) => {
        res.send('API is running....');
    });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
