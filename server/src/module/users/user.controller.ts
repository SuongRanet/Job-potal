import type { Request, Response } from "express";
import {
  adminUpdateUserSchema,
  changePasswordSchema,
  createUserSchema,
  listUsersQuerySchema,
  updateProfileSchema,
  userIdParamSchema,
} from "./user.schema.js";
import {
  changePasswordService,
  createUserService,
  deleteUserService,
  getUserService,
  listUsersService,
  updateUserService,
  UserError,
} from "./user.service.js";

const handleError = (res: Response, error: unknown) => {
  if (error instanceof UserError) {
    return res.status(error.status).json({ message: error.message });
  }
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

const validationError = (
  res: Response,
  issues: { message: string }[],
) =>
  res.status(400).json({
    message: "Validation failed",
    errors: issues.map((issue) => issue.message),
  });

export const listUsersController = async (req: Request, res: Response) => {
  const query = listUsersQuerySchema.safeParse(req.query);
  if (!query.success) return validationError(res, query.error.issues);

  try {
    const result = await listUsersService(query.data);
    return res.status(200).json({
      message: "Users retrieved successfully",
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getUserController = async (req: Request, res: Response) => {
  const params = userIdParamSchema.safeParse(req.params);
  if (!params.success) return validationError(res, params.error.issues);

  try {
    const user = await getUserService(params.data.id);
    return res
      .status(200)
      .json({ message: "User retrieved successfully", data: user });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getMeController = async (req: Request, res: Response) => {
  try {
    const user = await getUserService(req.user!.id);
    return res
      .status(200)
      .json({ message: "Profile retrieved successfully", data: user });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateMeController = async (req: Request, res: Response) => {
  const body = updateProfileSchema.safeParse(req.body);
  if (!body.success) return validationError(res, body.error.issues);

  try {
    const user = await updateUserService(req.user!.id, body.data);
    return res
      .status(200)
      .json({ message: "Profile updated successfully", data: user });
  } catch (error) {
    return handleError(res, error);
  }
};

export const changePasswordController = async (req: Request, res: Response) => {
  const body = changePasswordSchema.safeParse(req.body);
  if (!body.success) return validationError(res, body.error.issues);

  try {
    await changePasswordService(req.user!.id, body.data);
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  const params = userIdParamSchema.safeParse(req.params);
  if (!params.success) return validationError(res, params.error.issues);
  const body = adminUpdateUserSchema.safeParse(req.body);
  if (!body.success) return validationError(res, body.error.issues);

  try {
    const user = await updateUserService(params.data.id, body.data);
    return res
      .status(200)
      .json({ message: "User updated successfully", data: user });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  const params = userIdParamSchema.safeParse(req.params);
  if (!params.success) return validationError(res, params.error.issues);

  if (params.data.id === req.user!.id) {
    return res
      .status(400)
      .json({ message: "You cannot delete your own account here" });
  }

  try {
    await deleteUserService(params.data.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};

export const createUserController = async (req: Request, res: Response) => {
  const body = createUserSchema.safeParse(req.body);
  if (!body.success) return validationError(res, body.error.issues);

  try {
    const user = await createUserService(body.data);
    return res
      .status(201)
      .json({ message: "User created successfully", data: user });
  } catch (error) {
    return handleError(res, error);
  }
};
