import type { Request, Response } from "express";
import {
  getUserByID,
  loginService,
  logoutService,
} from "./auth.service.js";
import { loginUserSchema } from "./auth.schema.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const loginController = async (req: Request, res: Response) => {
  try {
    const result = loginUserSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }
    const { email, password } = result.data;
    const resultLogin = await loginService(email, password);
    res.cookie("accessToken", resultLogin.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", resultLogin.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        data: resultLogin,
      },
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as {
      id: string;
    };
    
    const user = await getUserByID(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    const newAccessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Access token refreshed",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

export const getUserByIDController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !id.trim()) {
      return res.status(400).json({
        message: "Invalid id",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    console.log("Received ID:", id);

    const user = await getUserByID(id);

    console.log("User retrieved:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const logoutController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await logoutService(refreshToken);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};
export const getMyProfileController = async (req: Request, res: Response) => {
  try {
    // authMiddleware attaches the decoded JWT to req.user
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const user = await getUserByID(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get my profile error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
