import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  getPracticeQuestions,
  getPracticeQuestionDetail,
  runPracticeCode,
  submitPracticeAnswer,
  getPracticeStats,
  getDailyChallenge,
} from "../controllers/practice.controller.js";

const practiceRouter = express.Router();

practiceRouter.get("/questions", isAuth, getPracticeQuestions);
practiceRouter.get("/questions/:type/:id", isAuth, getPracticeQuestionDetail);
practiceRouter.post("/run-code", isAuth, runPracticeCode);
practiceRouter.post("/submit", isAuth, submitPracticeAnswer);
practiceRouter.get("/stats", isAuth, getPracticeStats);
practiceRouter.get("/daily", isAuth, getDailyChallenge);

export default practiceRouter;