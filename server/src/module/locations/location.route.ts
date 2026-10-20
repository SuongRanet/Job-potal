import express from "express";
import { listLocationsController } from "./location.controller.js";

const locationRouter = express.Router();

locationRouter.get("/locations", listLocationsController);

export default locationRouter;
