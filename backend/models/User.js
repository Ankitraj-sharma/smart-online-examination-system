// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:   { type: String, required: true, minlength: 6 },
    role:       { type: String, enum: ["student", "admin"], default: "student" },
    studentId:  { type: String, default: "" },
    rollNumber: { type: String, default: "" },
    department: { type: String, default: "" },
    semester:   { type: String, default: "" },
    batch:      { type: String, default: "" },
    phone:      { type: String, default: "" },
    avatar:     { type: String, default: "🧑‍🎓" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);