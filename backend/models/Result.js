// backend/models/Result.js
const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    examName:         { type: String, default: "Online Exam" },
    subject:          { type: String, default: "General" },
    answers:          { type: Map, of: Number },
    score:            { type: Number, required: true },
    totalMarks:       { type: Number, required: true },
    percentage:       { type: Number, required: true },
    timeTaken:        { type: Number, default: 0 },
    correctCount:     { type: Number, default: 0 },
    wrongCount:       { type: Number, default: 0 },
    skippedCount:     { type: Number, default: 0 },
    unattemptedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);