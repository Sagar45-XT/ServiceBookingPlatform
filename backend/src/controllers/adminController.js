const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'Completed' });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalServices,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
