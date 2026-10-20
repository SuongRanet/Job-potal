import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { getDashboardController } from "./dashboard.controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get(
  "/dashboard",
  authMiddleware,
  getDashboardController,
);

export default dashboardRouter;
