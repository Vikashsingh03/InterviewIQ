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

    skipped: { type: Boolean, default: false },

    type: { type: String, enum: ["verbal", "coding"], default: "verbal" },
    askedBy: {
        type: String,
        enum: ["interviewerA", "interviewerB", null],
        default: null,
    },
    dsaQuestionId: { type: String, default: null },
    starterCode: { type: mongoose.Schema.Types.Mixed, default: null },
    language: { type: String, default: null },
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
        interviewType: {
            type: String,
            enum: ["solo", "panel"],
            required: true,
            default: "solo",
        },

        company: {
            type: String,
            default: null,
        },
        jobDescription: {
            type: String,
            default: null,
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
        proctoring: {
            cameraEnabled: { type: Boolean, default: false },
            cameraDenied: { type: Boolean, default: false },
            screenShared: { type: Boolean, default: false },
            locationShared: { type: Boolean, default: false },
            latitude: { type: Number, default: null },
            longitude: { type: Number, default: null },
            tabSwitchCount: { type: Number, default: 0 },
            fullscreenExitCount: { type: Number, default: 0 },
            terminatedForMisbehavior: { type: Boolean, default: false },
        },
    },
    { timestamps: true },
);

const interviewModel = mongoose.model("Interview", interviewSchema);

export default interviewModel;