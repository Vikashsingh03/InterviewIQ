import mongoose from "mongoose";

// One row per single-question practice attempt (Practice Hub). Kept
// deliberately lightweight and separate from the full interview.model.js —
// practice attempts are free/unlimited and don't need the full question
// history, resume context, or credits accounting a real interview needs.
const practiceAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    // "coding" | "hr"
    questionType: {
      type: String,
      enum: ["coding", "hr"],
      required: true,
    },
    questionId: {
      type: String,
      required: true,
    },
    // for coding: dsaQuestion.topic (e.g. "array"); for hr: question.category
    // (e.g. "teamwork") — used to build the per-category breakdown
    category: {
      type: String,
      default: "general",
    },
    difficulty: {
      type: String,
      default: "medium",
    },
    language: {
      type: String,
      default: null, // coding attempts only
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const practiceAttemptModel = mongoose.model(
  "PracticeAttempt",
  practiceAttemptSchema,
);

export default practiceAttemptModel;