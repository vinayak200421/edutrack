// Defines the MongoDB schema for login accounts and roles.
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "student"],
    default: "student"
  }
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);
