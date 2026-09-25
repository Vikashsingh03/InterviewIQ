import "dotenv/config";
import express from "express";
import connectDb from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";
import practiceRouter from "./routes/practice.route.js";

const app = express();

app.set("trust proxy", 1);

const FRONTEND_URL = "https://YOUR-FRONTEND.vercel.app";
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000", FRONTEND_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked: origin not allowed"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/practice", practiceRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDb();
});
