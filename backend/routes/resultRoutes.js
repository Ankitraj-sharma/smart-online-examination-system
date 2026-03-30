// backend/routes/resultRoutes.js
const express = require("express");
const Result  = require("../models/Result");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/results — save exam result (student)
router.post("/", protect, async (req, res) => {
  try {
    const {
      examName, subject, answers,
      score, totalMarks, percentage, timeTaken,
      correctCount, wrongCount, skippedCount, unattemptedCount,
    } = req.body;

    if (score === undefined || totalMarks === undefined || percentage === undefined) {
      return res.status(400).json({ message: "score, totalMarks and percentage are required." });
    }

    const result = await Result.create({
      student:          req.user._id,
      examName:         examName  || "Online Exam",
      subject:          subject   || "General",
      answers:          answers   || {},
      score:            score,
      totalMarks:       totalMarks,
      percentage:       percentage,
      timeTaken:        timeTaken        || 0,
      correctCount:     correctCount     || 0,
      wrongCount:       wrongCount       || 0,
      skippedCount:     skippedCount     || 0,
      unattemptedCount: unattemptedCount || 0,
    });

    res.status(201).json({ message: "Result saved successfully.", result });
  } catch (err) {
    console.error("Save result error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/results/my — get logged-in student's results
router.get("/my", protect, async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ results });
  } catch (err) {
    console.error("Fetch my results error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/results — get ALL results (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const results = await Result.find()
      .populate("student", "name email studentId department avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({ results });
  } catch (err) {
    console.error("Fetch all results error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;