// backend/server.js
const express          = require("express");
const mongoose         = require("mongoose");
const cors             = require("cors");
const dotenv           = require("dotenv");
const authRoutes       = require("./routes/auth");
const questionRoutes   = require("./routes/questionRoutes");
const resultRoutes     = require("./routes/resultRoutes");

dotenv.config();

const app = express();

// ── MIDDLEWARE ──────────────────────────────────────────────────
// Allow any localhost port (3000, 3001, 3002, 3003, etc.)
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    // Allow any localhost origin regardless of port
    if (origin.startsWith("http://localhost")) return callback(null, true);
    // Block everything else
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ──────────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results",   resultRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "SmartExam API is running ✅" });
});

// ── DATABASE + START SERVER ──────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });