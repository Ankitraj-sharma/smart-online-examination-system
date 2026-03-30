// backend/routes/auth.js
const express  = require("express");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const User     = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ── Helper: sign JWT ─────────────────────────────────────────────
const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── POST /api/auth/register ──────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const {
      name, email, password, role,
      studentId, rollNumber, department,
      semester, batch, phone, avatar,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const salt     = await bcrypt.genSalt(10);
    const hashed   = await bcrypt.hash(password, salt);

    const user = await User.create({
      name:       name.trim(),
      email:      normalizedEmail,
      password:   hashed,
      role:       role || "student",
      studentId:  studentId  || "",
      rollNumber: rollNumber || "",
      department: department || "",
      semester:   semester   || "",
      batch:      batch      || "",
      phone:      phone      || "",
      avatar:     avatar     || "🧑‍🎓",
    });

    const token = signToken(user._id, user.role);

    res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
        id:         user._id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        avatar:     user.avatar,
        studentId:  user.studentId,
        rollNumber: user.rollNumber,
        department: user.department,
        semester:   user.semester,
        batch:      user.batch,
        phone:      user.phone,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// ── POST /api/auth/login (student) ───────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (user.role !== "student") {
      return res.status(403).json({ message: "Please use the admin login." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signToken(user._id, user.role);

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id:         user._id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        avatar:     user.avatar,
        studentId:  user.studentId,
        rollNumber: user.rollNumber,
        department: user.department,
        semester:   user.semester,
        batch:      user.batch,
        phone:      user.phone,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
});

// ── POST /api/auth/admin-login ───────────────────────────────────
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin accounts only." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signToken(user._id, user.role);

    res.status(200).json({
      message: "Admin login successful.",
      token,
      user: {
        id:     user._id,
        name:   user.name,
        email:  user.email,
        role:   user.role,
        avatar: user.avatar || "🧑‍💼",
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ── POST /api/auth/forgot-password ──────────────────────────────
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    const salt    = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ── GET /api/auth/profile (protected) ───────────────────────────
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// ── GET /api/auth/users (admin — get all students) ───────────────
router.get("/users", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only." });
    }
    const users = await User.find({ role: "student" }).select("-password");
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;