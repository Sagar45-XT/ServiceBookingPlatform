const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const secret = process.env.JWT_SECRET || "service-booking-dev-secret";
      const decoded = jwt.verify(token, secret);

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    }

    return res.status(401).json({
      message: "Not authorized, token missing",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = protect;