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
import { generateAptitudeSolution } from '../controllers/aptitude.controller.js';
import { getTtsConfig, synthesizeSpeech } from '../controllers/tts.controller.js';
// voice-to-voice answer transcription (Deepgram Nova) — the recorded answer
// is transcribed server-side, then fed into the normal submit pipeline
import { transcribeUpload, transcribeAudio } from "../controllers/transcribe.controller.js";




const interviewRouter = express.Router();

interviewRouter.post("/resume", isAuth, upload.single("resume"), analyzeResume)
// no credits deducted — this is a lightweight pre-interview check, not the interview itself
interviewRouter.post("/match-score", isAuth, getResumeJobMatch)
interviewRouter.post("/generate-questions", isAuth, generateQuestion)
interviewRouter.post("/submit-answer", isAuth, submitAnswer)
// NEW: lets the candidate test their code against the question's test cases
// before submitting — does not save anything or affect scoring.
interviewRouter.post("/run-code", isAuth, runCode)
interviewRouter.post("/finish", isAuth, finishInterview)
// short-lived token so the browser can stream the mic to Deepgram (falls back to browser STT)
interviewRouter.get("/stt-token", isAuth, getSttToken)
// neural interviewer voice (Deepgram Aura TTS); the client falls back to the
// browser's built-in voice when the server has no Deepgram key
interviewRouter.get("/tts-config", isAuth, getTtsConfig)
interviewRouter.post("/tts", isAuth, synthesizeSpeech)
// voice-to-voice: transcribe the candidate's recorded answer (multipart field "audio")
interviewRouter.post("/transcribe", isAuth, transcribeUpload, transcribeAudio)

interviewRouter.get("/get-interviews", isAuth, getMyInterviews)
interviewRouter.get("/report/:id", isAuth, getInterviewReport)
// AI coaching for one question of a finished interview (cached after first use)
interviewRouter.post("/coaching/:questionId", isAuth, getQuestionCoaching)
interviewRouter.post("/aptitude-solution", isAuth, generateAptitudeSolution)
// full conversation with the AI coach about this finished interview
interviewRouter.get("/coach/:id", isAuth, getCoachChat)
interviewRouter.post("/coach/:id", isAuth, sendCoachMessage)
interviewRouter.delete("/coach/:id", isAuth, clearCoachChat)
interviewRouter.get("/analytics-summary", isAuth, getAnalyticsSummary)

interviewRouter.delete("/delete/:id", isAuth, deleteInterview);



export default interviewRouter