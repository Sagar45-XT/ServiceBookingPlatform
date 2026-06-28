const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

const { getDashboardStats } = require('../controllers/adminController');
const { getAllBookings, deleteBooking } = require('../controllers/bookingController');

// Dashboard stats
router.get('/stats', protect, isAdmin, getDashboardStats);

// Admin bookings management
router.get('/bookings', protect, isAdmin, getAllBookings);
router.delete('/bookings/:id', protect, isAdmin, deleteBooking);

module.exports = router;
