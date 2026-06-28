const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
} = require("../controllers/bookingController");

router.post("/", protect, createBooking);
router.get("/", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.patch("/:id/status", protect, isAdmin, updateBookingStatus);

module.exports = router;