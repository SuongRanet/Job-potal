import type { Request, Response } from "express";
import { getDashboardService } from "./dashboard.service.js";

export const getDashboardController = async (_req: Request, res: Response) => {
  try {
    const data = await getDashboardService();
    return res
      .status(200)
      .json({ message: "Dashboard retrieved successfully", data });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
