const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");

const connectDB = () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined. Check your .env file.");
  }

  return mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
};

module.exports = connectDB;