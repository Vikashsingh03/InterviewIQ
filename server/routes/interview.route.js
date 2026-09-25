import express from 'express'
import isAuth from '../middlewares/isAuth.js';
import { getSttToken } from '../controllers/stt.controller.js';
import { upload } from '../middlewares/multer.js';
import {
  analyzeResume,
  finishInterview,
  generateQuestion,
  getInterviewReport,
  getMyInterviews,
  runCode,
  submitAnswer,
  deleteInterview,
  getAnalyticsSummary,
  getResumeJobMatch,
  getQuestionCoaching,
  getCoachChat,
  sendCoachMessage
} from '../controllers/interview.controller.js';
import { clearCoachChat } from '../controllers/coachChat.controller.js';
import { interviewCodeLimiter } from '../middlewares/practiceRateLimit.js';
import { generateAptitudeSolution } from '../controllers/aptitude.controller.js';
import { getTtsConfig, synthesizeSpeech } from '../controllers/tts.controller.js';
import { transcribeUpload, transcribeAudio } from "../controllers/transcribe.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume", isAuth, upload.single("resume"), analyzeResume)
interviewRouter.post("/match-score", isAuth, getResumeJobMatch)
interviewRouter.post("/generate-questions", isAuth, generateQuestion)
interviewRouter.post("/submit-answer", isAuth, submitAnswer)
interviewRouter.post("/run-code", isAuth, interviewCodeLimiter, runCode)
interviewRouter.post("/finish", isAuth, finishInterview)
interviewRouter.get("/stt-token", isAuth, getSttToken)
interviewRouter.get("/tts-config", isAuth, getTtsConfig)
interviewRouter.post("/tts", isAuth, synthesizeSpeech)
interviewRouter.post("/transcribe", isAuth, transcribeUpload, transcribeAudio)

interviewRouter.get("/get-interviews", isAuth, getMyInterviews)
interviewRouter.get("/report/:id", isAuth, getInterviewReport)
interviewRouter.post("/coaching/:questionId", isAuth, getQuestionCoaching)
interviewRouter.post("/aptitude-solution", isAuth, generateAptitudeSolution)
interviewRouter.get("/coach/:id", isAuth, getCoachChat)
interviewRouter.post("/coach/:id", isAuth, sendCoachMessage)
interviewRouter.delete("/coach/:id", isAuth, clearCoachChat)
interviewRouter.get("/analytics-summary", isAuth, getAnalyticsSummary)

interviewRouter.delete("/delete/:id", isAuth, deleteInterview);

export default interviewRouter
