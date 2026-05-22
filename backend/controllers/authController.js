const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Replace with your actual Google Client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy-client-id');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_for_dev', {
        expiresIn: '30d',
    });
};

// @desc    Auth user with Google
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
        });
        
        const { name, email, picture, sub } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Determine role (e.g., if it's a specific admin email, grant admin role)
            const role = (email === process.env.ADMIN_EMAIL) ? 'Admin' : 'Customer';
            
            // Create user
            user = await User.create({
                name,
                email,
                googleId: sub,
                avatar: picture,
                role
            });
        } else if (!user.googleId) {
            // Link google account to existing email
            user.googleId = sub;
            user.avatar = picture;
            await user.save();
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Invalid Google token' });
    }
};

module.exports = {
    googleAuth
};
