import mongoose from "mongoose";

const practiceAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    questionType: {
      type: String,
      enum: ["coding", "hr"],
      required: true,
    },
    questionId: {
      type: String,
      required: true,
    },
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
      default: null,
    },
    score: {
      type: Number,
      default: 0,
    },
    testsPassed: {
      type: Number,
      default: null,
    },
    testsTotal: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);

const practiceAttemptModel = mongoose.model(
  "PracticeAttempt",
  practiceAttemptSchema,
);

export default practiceAttemptModel;
