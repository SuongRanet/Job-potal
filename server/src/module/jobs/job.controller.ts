import type { Request, Response } from "express";
import {
  createJobSchema,
  jobIdParamSchema,
  listJobsQuerySchema,
  updateJobSchema,
} from "./job.schema.js";
import {
  createJobService,
  deleteJobService,
  getPublicJobService,
  JobError,
  listAllJobsService,
  listPublicJobsService,
  updateJobService,
} from "./job.service.js";

const handleError = (res: Response, error: unknown) => {
  if (error instanceof JobError) {
    return res.status(error.status).json({ message: error.message });
  }
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

const validationError = (res: Response, issues: { message: string }[]) =>
  res.status(400).json({
    message: "Validation failed",
    errors: issues.map((issue) => issue.message),
  });

export const listJobsController = async (req: Request, res: Response) => {
  const query = listJobsQuerySchema.safeParse(req.query);
  if (!query.success) return validationError(res, query.error.issues);

  try {
    const result = await listPublicJobsService(query.data);
    return res.status(200).json({
      message: "Jobs retrieved successfully",
      data: result.jobs,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const listAllJobsController = async (req: Request, res: Response) => {
  const query = listJobsQuerySchema.safeParse(req.query);
  if (!query.success) return validationError(res, query.error.issues);

  try {
    const result = await listAllJobsService(query.data);
    return res.status(200).json({
      message: "Jobs retrieved successfully",
      data: result.jobs,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getJobController = async (req: Request, res: Response) => {
  const params = jobIdParamSchema.safeParse(req.params);
  if (!params.success) return validationError(res, params.error.issues);

  try {
    const job = await getPublicJobService(params.data.id);
    return res
      .status(200)
      .json({ message: "Job retrieved successfully", data: job });
  } catch (error) {
    return handleError(res, error);
  }
};

export const createJobController = async (req: Request, res: Response) => {
  const body = createJobSchema.safeParse(req.body);
  if (!body.success) return validationError(res, body.error.issues);

  try {
    const job = await createJobService(req.user!.id, body.data);
    return res
      .status(201)
      .json({ message: "Job created successfully", data: job });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateJobController = async (req: Request, res: Response) => {
  const params = jobIdParamSchema.safeParse(req.params);
  if (!params.success) return validationError(res, params.error.issues);
  const body = updateJobSchema.safeParse(req.body);
  if (!body.success) return validationError(res, body.error.issues);

  try {
    const job = await updateJobService(params.data.id, body.data);
    return res
      .status(200)
      .json({ message: "Job updated successfully", data: job });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteJobController = async (req: Request, res: Response) => {
  const params = jobIdParamSchema.safeParse(req.params);
  if (!params.success) return validationError(res, params.error.issues);

  try {
    await deleteJobService(params.data.id);
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};
