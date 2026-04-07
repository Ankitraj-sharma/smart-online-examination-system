// backend/createAdmin.js
// ─────────────────────────────────────────────────
// Run this ONCE to create your admin account:
//   node createAdmin.js
// ─────────────────────────────────────────────────

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const dotenv   = require("dotenv");

dotenv.config();

// ── Change these to whatever you want ──
const ADMIN_NAME     = "Admin User";
const ADMIN_EMAIL    = "admin@exam.com";
const ADMIN_PASSWORD = "admin123";
// ────────────────────────────────────────

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, default: "student" },
  avatar:   { type: String, default: "🧑‍💼" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (existing) {
      console.log("⚠️  Admin already exists with email:", ADMIN_EMAIL);
      console.log("    Use these credentials to login:");
      console.log("    Email   :", ADMIN_EMAIL);
      console.log("    Password: (whatever you set before)");
      process.exit(0);
    }

    // Hash password
    const salt     = await bcrypt.genSalt(10);
    const hashed   = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Create admin
    const admin = await User.create({
      name:     ADMIN_NAME,
      email:    ADMIN_EMAIL.toLowerCase(),
      password: hashed,
      role:     "admin",
      avatar:   "🧑‍💼",
    });

    console.log("✅ Admin account created successfully!");
    console.log("─────────────────────────────────────");
    console.log("   Name    :", admin.name);
    console.log("   Email   :", admin.email);
    console.log("   Password:", ADMIN_PASSWORD);
    console.log("   Role    :", admin.role);
    console.log("─────────────────────────────────────");
    console.log("👉 Open your frontend app and visit /login");
    console.log("👉 Click the Admin tab");
    console.log("👉 Login with above credentials");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
}

createAdmin();