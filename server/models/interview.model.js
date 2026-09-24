import mongoose from "mongoose";
const codeSolutionSchema = new mongoose.Schema({
  language: String,
  code: String,
  verified: {
    type: Boolean,
    default: null
  },
  passed: Number,
  total: Number
}, {
  _id: false
});
const coachingSchema = new mongoose.Schema({
  idealAnswer: String,
  gaps: [String],
  tips: [String],
  complexity: String,
  solutions: [codeSolutionSchema],
  generatedAt: Date
}, {
  _id: false
});
const confidenceMetricsSchema = new mongoose.Schema(
  {
    eyeContactPct: { type: Number, default: null },
    framesSampled: { type: Number, default: 0 },
    fillerWords: { type: Number, default: 0 },
    fillerRatio: { type: Number, default: 0 },
    wordCount: { type: Number, default: 0 },
    wordsPerMinute: { type: Number, default: null },
    speakingSeconds: { type: Number, default: 0 },
    cameraUsed: { type: Boolean, default: false },
    confidenceScore: { type: Number, default: null },
    notes: { type: [String], default: [] }
  },
  { _id: false }
);
const questionSchema = new mongoose.Schema({
  question: String,
  difficulty: String,
  timeLimit: Number,
  answer: String,
  feedback: String,
  score: {
    type: Number,
    default: 0
  },
  confidence: {
    type: Number,
    default: 0
  },
  communication: {
    type: Number,
    default: 0
  },
  correctness: {
    type: Number,
    default: 0
  },
  topicHint: {
    type: String,
    default: "general"
  },
  roundId: {
    type: String,
    default: null
  },
  roundLabel: {
    type: String,
    default: null
  },
  companyScore: {
    type: Number,
    default: null
  },
  companySignal: {
    type: String,
    default: null
  },
  skipped: {
    type: Boolean,
    default: false
  },
  isFollowUp: {
    type: Boolean,
    default: false
  },
  coaching: {
    type: coachingSchema,
    default: undefined
  },
  confidenceMetrics: { type: confidenceMetricsSchema, default: undefined },
  type: {
    type: String,
    enum: ["verbal", "coding", "sql"],
    default: "verbal"
  },
  askedBy: {
    type: String,
    enum: ["interviewerA", "interviewerB", null],
    default: null
  },
  dsaQuestionId: {
    type: String,
    default: null
  },
  sqlTaskId: {
    type: String,
    default: null
  },
  sqlSchema: {
    type: String,
    default: null
  },
  sqlResult: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  starterCode: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  language: {
    type: String,
    default: null
  },
  testResults: {
    passedCount: {
      type: Number,
      default: 0
    },
    totalCount: {
      type: Number,
      default: 0
    },
    allPassed: {
      type: Boolean,
      default: false
    }
  }
});
const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  role: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ["HR", "Technical"],
    required: true
  },
  interviewType: {
    type: String,
    enum: ["solo", "panel"],
    required: true,
    default: "solo"
  },
  language: {
    type: String,
    enum: ["english", "hinglish", "hindi"],
    default: "english"
  },
  company: {
    type: String,
    default: null
  },
  companyMode: {
    type: String,
    default: null
  },
  companyVerdict: {
    signal: {
      type: String,
      default: null
    },
    summary: {
      type: String,
      default: null
    },
    roundSignals: {
      type: [{
        roundId: String,
        label: String,
        signal: String,
        avgScore: Number
      }],
      default: []
    }
  },
  candidateName: {
    type: String,
    default: null
  },
  jobDescription: {
    type: String,
    default: null
  },
  resumeText: {
    type: String
  },
  projects: {
    type: [String],
    default: []
  },
  skills: {
    type: [String],
    default: []
  },
  coveredTopics: {
    type: [String],
    default: []
  },
  askedCodingQuestion: {
    type: Boolean,
    default: false
  },
  coachMessages: {
    type: [{
      role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
      },
      content: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    default: []
  },
  questions: [questionSchema],
  minQuestions: {
    type: Number,
    default: 4
  },
  maxQuestions: {
    type: Number,
    default: 8
  },
  finalScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["Incompleted", "Completed"],
    default: "Incompleted"
  },
  proctoring: {
    cameraEnabled: {
      type: Boolean,
      default: false
    },
    cameraDenied: {
      type: Boolean,
      default: false
    },
    screenShared: {
      type: Boolean,
      default: false
    },
    locationShared: {
      type: Boolean,
      default: false
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    tabSwitchCount: {
      type: Number,
      default: 0
    },
    fullscreenExitCount: {
      type: Number,
      default: 0
    },
    terminatedForMisbehavior: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});
const interviewModel = mongoose.model("Interview", interviewSchema);
export default interviewModel;
