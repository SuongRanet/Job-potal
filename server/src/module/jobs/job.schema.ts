import { z } from "zod";
import mongoose from "mongoose";
import { EMPLOYMENT_TYPES, JOB_STATUSES } from "./job.model.js";

const salarySchema = z
  .object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
    currency: z.string().trim().length(3, "Currency must be a 3-letter code").optional(),
  })
  .refine((s) => s.min === undefined || s.max === undefined || s.min <= s.max, {
    message: "Salary min must not exceed max",
  });

const applySchema = z
  .object({
    email: z.string().trim().email("Invalid apply email").optional(),
    telegram: z
      .string()
      .trim()
      .regex(
        /^(@[A-Za-z0-9_]{5,32}|https?:\/\/t\.me\/[A-Za-z0-9_+\/-]+)$/,
        "Telegram must be @username or a https://t.me/ link",
      )
      .optional(),
  })
  .refine((a) => a.email !== undefined || a.telegram !== undefined, {
    message: "Provide an apply email or Telegram",
  });

const futureDate = z.coerce
  .date()
  .refine((d) => d.getTime() > Date.now(), "Deadline must be in the future");

export const createJobSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(10000),
  company: z.string().trim().min(1, "Company is required").max(150),
  location: z
    .string()
    .refine((v) => mongoose.Types.ObjectId.isValid(v), "Invalid location id"),
  salary: salarySchema.optional(),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  category: z.string().trim().min(1, "Category is required").max(100),
  requirements: z.array(z.string().trim().min(1).max(300)).max(50).default([]),
  apply: applySchema,
  deadline: futureDate.nullable(),
  status: z.enum(JOB_STATUSES).optional(),
});

export const updateJobSchema = createJobSchema
  .extend({ deadline: z.union([z.null(), futureDate]).optional() })
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const jobIdParamSchema = z.object({
  id: z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), "Invalid job id"),
});

export const listJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).max(100).optional(),
  category: z.string().trim().min(1).max(100).optional(),
  location: z.string().trim().min(1).max(100).optional(), // location slug
  employmentType: z.enum(EMPLOYMENT_TYPES).optional(),
  status: z.enum(JOB_STATUSES).optional(),
  minSalary: z.coerce.number().min(0).optional(),
  maxSalary: z.coerce.number().min(0).optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;
