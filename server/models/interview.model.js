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
  topicHint: { type: String, default: "general" },
  // NEW: marks a question the candidate chose to skip — excluded from
  // scoring averages so it doesn't unfairly drag down the final score
  skipped: { type: Boolean, default: false },
  speakingMetrics: {
    wordsPerMinute: { type: Number, default: 0 },
    wordCount: { type: Number, default: 0 },
    durationSeconds: { type: Number, default: 0 },
    fillerWordCount: { type: Number, default: 0 },
    fillerRatio: { type: Number, default: 0 },
    deliveryScore: { type: Number, default: 0 },
  },
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
    projects: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },

    coveredTopics: {
      type: [String],
      default: [],
    },
    askedCodingQuestion: {
      type: Boolean,
      default: false,
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
