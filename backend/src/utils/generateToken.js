const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || "service-booking-dev-secret";

  return jwt.sign(
    {
      id: userId,
      role,
    },
    secret,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;