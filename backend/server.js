// backend/server.js
const express        = require("express");
const mongoose       = require("mongoose");
const cors           = require("cors");
const dotenv         = require("dotenv");
const authRoutes     = require("./routes/auth");
const questionRoutes = require("./routes/questionRoutes");
const resultRoutes   = require("./routes/resultRoutes");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://smart-online-examination-system.vercel.app",
  "https://smart-online-examination-system.onrender.com",
];

// ── CORS — allows the local dev frontend and the deployed frontend origin ──
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// ── BODY PARSERS ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── REQUEST LOGGER ────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// ── ROUTES ────────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results",   resultRoutes);

// ── HEALTH CHECK ──────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ message: "SmartExam API is running ✅", version: "2.0.0" });
});

// ── 404 HANDLER ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.path} not found.` });
});

// ── GLOBAL ERROR HANDLER ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Server error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal server error." });
});

// ── CONNECT DB + START SERVER ─────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });