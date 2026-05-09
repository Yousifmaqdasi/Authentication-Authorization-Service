import express from "express";
import authRouter from "./routes/auth.routes";
import usersRouter from "./routes/users.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middleware/error.handler.middleware";
import helmet from "helmet";
import { generalLimiter } from "./middleware/rate.limiter.middleware";
import { AppError } from "./utils/custom.error";

const app = express();

// Trust proxy so Express uses the real client IP (not the proxy IP).
// Needed in production (e.g. Vercel, Railway, Nginx), otherwise
// rate limiting will think all requests come from the same IP.
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);

app.get("/", (req, res) => {
  res.json({ message: "Home" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(errorHandler);

export default app;
