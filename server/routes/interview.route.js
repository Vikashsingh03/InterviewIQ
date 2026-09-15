import express from 'express'
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';
import {
  analyzeResume,
  finishInterview,
  generateQuestion,
  getInterviewReport,
  getMyInterviews,
  runCode,
  submitAnswer,
} from '../controllers/interview.controller.js';


const interviewRouter = express.Router();

interviewRouter.post("/resume", isAuth, upload.single("resume"), analyzeResume)
interviewRouter.post("/generate-questions", isAuth, generateQuestion)
interviewRouter.post("/submit-answer", isAuth, submitAnswer)
// NEW: lets the candidate test their code against the question's test cases
// before submitting — does not save anything or affect scoring.
interviewRouter.post("/run-code", isAuth, runCode)
interviewRouter.post("/finish", isAuth, finishInterview)

interviewRouter.get("/get-interviews", isAuth, getMyInterviews)
interviewRouter.get("/report/:id", isAuth, getInterviewReport)



export default interviewRouter