import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createJobController,
  deleteJobController,
  getJobController,
  listJobsController,
  listAllJobsController,
  updateJobController,
} from "./job.controller.js";

const jobRouter = express.Router();
const path = "/jobs";

// Public
jobRouter.get(path, listJobsController);

// Admin only (declared before /:id so "manage" isn't treated as an id)
jobRouter.get(
  `${path}/manage`,
  authMiddleware,
  listAllJobsController,
);
jobRouter.post(
  path,
  authMiddleware,
  createJobController,
);

jobRouter.get(`${path}/:id`, getJobController);

jobRouter.patch(
  `${path}/:id`,
  authMiddleware,
  updateJobController,
);
jobRouter.delete(
  `${path}/:id`,
  authMiddleware,
  deleteJobController,
);

export default jobRouter;
