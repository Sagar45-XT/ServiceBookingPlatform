const express = require("express");

const router = express.Router();

const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

// Public Routes
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// Admin Routes
router.post("/", protect, isAdmin, createService);
router.put("/:id", protect, isAdmin, updateService);
router.delete("/:id", protect, isAdmin, deleteService);

module.exports = router;