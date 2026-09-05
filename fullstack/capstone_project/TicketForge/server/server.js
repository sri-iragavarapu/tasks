const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

// Initialize database connection
require('./config/database');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (allow requests from Vite frontend dev server)
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'ticketforge_levitate_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // http in local dev
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/messages', messageRoutes);

// Base Status Route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'TicketForge API Server is running!',
        timestamp: new Date().toISOString()
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 TicketForge Backend Server listening on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
