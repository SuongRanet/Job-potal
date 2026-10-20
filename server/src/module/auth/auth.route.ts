import express from "express";
import {
  getMyProfileController,
  getUserByIDController,
  loginController,
  logoutController,
  refreshTokenController,
} from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const authRouter = express.Router();
const path = "/auth";
// Public routes (no self-registration: admins create accounts via POST /users)
authRouter.post(`${path}/login`, loginController);
authRouter.post(`${path}/refresh`, refreshTokenController);
authRouter.post(`${path}/logout`, logoutController);

// Authenticated user: get own profile
authRouter.get(`${path}/me`, authMiddleware, getMyProfileController);
authRouter.get(
  `${path}/getUser/:id`,
  authMiddleware,
  getUserByIDController,
);

// Missing user ID
authRouter.get(`${path}/getUser`, authMiddleware, (req, res) => {
  return res.status(400).json({
    message: "User ID is required",
  });
});

export default authRouter;
