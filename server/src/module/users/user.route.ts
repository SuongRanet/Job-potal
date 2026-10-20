import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  changePasswordController,
  createUserController,
  deleteUserController,
  getMeController,
  getUserController,
  listUsersController,
  updateMeController,
  updateUserController,
} from "./user.controller.js";

const userRouter = express.Router();
const path = "/users";

// Authentication for all /users routes
userRouter.use(path, authMiddleware);

// Current user
userRouter.get(`${path}/me`, getMeController);
userRouter.patch(`${path}/me`, updateMeController);
userRouter.patch(`${path}/me/password`, changePasswordController);

// Every authenticated user is an admin
userRouter.post(path, createUserController);
userRouter.get(path, listUsersController);
userRouter.get(`${path}/:id`, getUserController);
userRouter.patch(`${path}/:id`, updateUserController);
userRouter.delete(`${path}/:id`, deleteUserController);

export default userRouter;
