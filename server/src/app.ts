import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRouter from "./module/auth/auth.route.js";
import userRouter from "./module/users/user.route.js";
import jobRouter from "./module/jobs/job.route.js";
import dashboardRouter from "./module/dashboard/dashboard.route.js";
import locationRouter from "./module/locations/location.route.js";

const app = express();
const PREFIX = "/api/v1";

const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(
  (origin): origin is string => Boolean(origin),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(PREFIX, authRouter);
app.use(PREFIX, userRouter);
app.use(PREFIX, jobRouter);
app.use(PREFIX, dashboardRouter);
app.use(PREFIX, locationRouter);

export default app;
