const Booking = require("../models/Booking");
const Cart = require("../models/Cart");

const createBooking = async (req, res) => {
  try {
    const { address } = req.body;

    // Validation
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    // Get user's cart
    const cartItems = await Cart.find({
      userId: req.user._id,
    }).populate("serviceId");

    // Check if cart is empty
    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Prepare booking services
    let services = [];
    let totalAmount = 0;

    cartItems.forEach((item) => {
      services.push({
        serviceId: item.serviceId._id,
        quantity: item.quantity,
        price: item.serviceId.price,
      });

      totalAmount += item.quantity * item.serviceId.price;
    });

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      services,
      totalAmount,
      address
    });

    // Clear cart
    await Cart.deleteMany({
      userId: req.user._id,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("userId", "name email")
      .populate("services.serviceId");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
    })
      .populate("userId", "name email")
      .populate("services.serviceId");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name email")
      .populate("services.serviceId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only owner or admin can access
    if (
      booking.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "Pending",
      "Confirmed",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("userId", "name email")
      .populate("services.serviceId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {createBooking, getMyBookings, getBookingById, updateBookingStatus};