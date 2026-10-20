import type { Request, Response } from "express";
import { listLocationsService } from "./location.service.js";

export const listLocationsController = async (_req: Request, res: Response) => {
  try {
    const data = await listLocationsService();
    return res.status(200).json({ message: "Locations retrieved successfully", data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
