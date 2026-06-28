const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addToCart,
  getCart,
  updateCart,
  removeCartItem,
} = require("../controllers/cartController");

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:id", protect, updateCart);
router.delete("/:id", protect, removeCartItem);

module.exports = router;