// backend/routes/questionRoutes.js
const express  = require("express");
const Question = require("../models/Question");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ── GET /api/questions ─────────────────────────────────────────
// Fetch questions — supports filtering by subject and examId
// ?subject=Algorithms  OR  ?examId=dsa  OR  ?subject=Mixed (all)
router.get("/", protect, async (req, res) => {
  try {
    const { subject, examId } = req.query;
    let filter = {};

    if (examId && examId !== "mixed") {
      filter.examId = examId;
    } else if (examId === "mixed") {
      // Mixed exam: fetch from ALL subjects — no filter
      filter = {};
    } else if (subject && subject !== "Mixed") {
      filter.subject = subject;
    }

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ questions });
  } catch (err) {
    console.error("Fetch questions error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ── GET /api/questions/by-exam/:examId ─────────────────────────
// Get questions for a specific exam (used by Exam.js)
router.get("/by-exam/:examId", protect, async (req, res) => {
  try {
    const { examId } = req.params;
    let filter = {};

    if (examId === "mixed") {
      // Mixed = all questions from all exams (random selection)
      filter = {};
    } else {
      filter.examId = examId;
    }

    const questions = await Question.find(filter).sort({ createdAt: -1 });

    // Shuffle for mixed exam
    if (examId === "mixed") {
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
    }

    res.status(200).json({ questions, total: questions.length });
  } catch (err) {
    console.error("Fetch by-exam error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ── GET /api/questions/stats ───────────────────────────────────
// Admin: get question count per examId
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const stats = await Question.aggregate([
      { $group: { _id: "$examId", count: { $sum: 1 }, subject: { $first: "$subject" } } },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json({ stats });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// ── POST /api/questions ────────────────────────────────────────
// Add a new question (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const {
      questionText, options, correctAnswer,
      subject, examId, examTitle, tags, marks,
    } = req.body;

    if (!questionText || !options || correctAnswer === undefined) {
      return res.status(400).json({
        message: "questionText, options and correctAnswer are required.",
      });
    }
    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: "Exactly 4 options are required." });
    }

    const question = await Question.create({
      questionText:  questionText.trim(),
      options:       options.map(o => o.trim()),
      correctAnswer: Number(correctAnswer),
      subject:       subject   || "General",
      examId:        examId    || "",
      examTitle:     examTitle || "",
      tags:          tags      || [],
      marks:         marks     || 1,
      createdBy:     req.user._id,
    });

    res.status(201).json({ message: "Question added successfully.", question });
  } catch (err) {
    console.error("Add question error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ── DELETE /api/questions/:id ──────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found." });
    res.status(200).json({ message: "Question deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// ── PUT /api/questions/:id ─────────────────────────────────────
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Question not found." });
    res.status(200).json({ message: "Question updated.", question: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;