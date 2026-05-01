const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d'
    });
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, isGoogle } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        
        // If it's a Google login and user exists, just log them in
        if (userExists && isGoogle) {
            return res.status(200).json({
                message: 'Login successful',
                token: generateToken(userExists._id),
                user: {
                    id: userExists._id,
                    name: userExists.name,
                    email: userExists.email
                }
            });
        }

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                message: 'User registered successfully',
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        // Check password (the User model hashes it on save and provides comparePassword)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({
            message: 'Login successful',
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');
        res.status(200).json({
            message: 'Welcome to your dashboard',
            user
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
