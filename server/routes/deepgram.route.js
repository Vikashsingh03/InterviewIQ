import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getDeepgramToken } from "../controllers/deepgramToken.controller.js";

const deepgramRouter = express.Router();

deepgramRouter.get("/token", isAuth, getDeepgramToken);

export default deepgramRouter;