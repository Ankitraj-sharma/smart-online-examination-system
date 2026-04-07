// backend/models/Question.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String, required: true, trim: true,
    },
    options: {
      type: [String],
      validate: {
        validator: (arr) => arr.length === 4,
        message: "Exactly 4 options are required.",
      },
      required: true,
    },
    correctAnswer: {
      type: Number, required: true, min: 0, max: 3,
    },
    // subject maps to exam type e.g. "Algorithms","DBMS","OS","Networks","Programming","Mixed"
    subject: {
      type: String, default: "General", trim: true,
    },
    // examId maps to Home.js catalog: "dsa","dbms","os","networks","programming","mixed"
    examId: {
      type: String, default: "", trim: true,
    },
    // Full exam title e.g. "Data Structures & Algorithms"
    examTitle: {
      type: String, default: "", trim: true,
    },
    // Topic tags for this question
    tags: {
      type: [String], default: [],
    },
    marks: {
      type: Number, default: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
  },
  { timestamps: true }
);

questionSchema.index({ subject: 1 });
questionSchema.index({ examId: 1 });

module.exports = mongoose.model("Question", questionSchema);