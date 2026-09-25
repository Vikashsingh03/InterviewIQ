import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  codeRunLimiter,
  codeSubmitLimiter,
} from "../middlewares/practiceRateLimit.js";
import {
  getPracticeQuestions,
  getPracticeQuestionDetail,
  runPracticeCode,
  submitPracticeAnswer,
  getPracticeStats,
  getDailyChallenge,
  getDsaProgress,
  getEditorial,
} from "../controllers/practice.controller.js";

const practiceRouter = express.Router();

practiceRouter.get("/questions", isAuth, getPracticeQuestions);
practiceRouter.get("/questions/:type/:id", isAuth, getPracticeQuestionDetail);
practiceRouter.post("/run-code", isAuth, codeRunLimiter, runPracticeCode);
practiceRouter.post("/submit", isAuth, codeSubmitLimiter, submitPracticeAnswer);
practiceRouter.post("/editorial", isAuth, codeRunLimiter, getEditorial);
practiceRouter.get("/stats", isAuth, getPracticeStats);
practiceRouter.get("/daily", isAuth, getDailyChallenge);
practiceRouter.get("/dsa-progress", isAuth, getDsaProgress);

export default practiceRouter;
