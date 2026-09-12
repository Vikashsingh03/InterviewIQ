import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  difficulty: String,
  timeLimit: Number,
  answer: String,
  feedback: String,
  score: { type: Number, default: 0 },
  confidence: { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  correctness: { type: Number, default: 0 },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["HR", "Technical"],
      required: true,
    },
    resumeText: {
      type: String,
    },
    // previously dropped after the first question was generated — now
    // persisted so every follow-up question can stay resume-aware too
    projects: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    questions: [questionSchema],
    minQuestions: { type: Number, default: 4 },
    maxQuestions: { type: Number, default: 8 },
    finalScore: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Incompleted", "Completed"],
      default: "Incompleted",
    },
  },
  { timestamps: true },
);

const interviewModel = mongoose.model("Interview", interviewSchema);

export default interviewModel;
