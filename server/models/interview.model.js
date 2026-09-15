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
    // which resume item (or "general"/"coding-question") this question
    // targets — lets us track, deterministically, what's already been
    // covered so the AI doesn't have to rely purely on re-reading the whole
    // transcript each time
    topicHint: { type: String, default: "general" },
    // candidate explicitly skipped this question instead of answering it
    skipped: { type: Boolean, default: false },

    // ---- coding-round specific fields (only set when type === "coding") ----
    type: { type: String, enum: ["verbal", "coding"], default: "verbal" },
    dsaQuestionId: { type: String, default: null },
    // starter code shown in the editor per language, e.g. { javascript: "...", python: "..." }
    starterCode: { type: mongoose.Schema.Types.Mixed, default: null },
    // language the candidate actually submitted in
    language: { type: String, default: null },
    // summary of the automated test-case run backing the correctness score
    // (the raw expectedOutput values are never stored here — only the
    // pass/fail summary — so nothing sensitive leaks via the report API)
    testResults: {
        passedCount: { type: Number, default: 0 },
        totalCount: { type: Number, default: 0 },
        allPassed: { type: Boolean, default: false },
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
        // topicHints that have already been asked about — prevents the AI
        // from circling back to the same project/skill twice
        coveredTopics: {
            type: [String],
            default: [],
        },
        // Technical-mode-only: whether the one DSA coding-round question has
        // already been asked in this interview
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