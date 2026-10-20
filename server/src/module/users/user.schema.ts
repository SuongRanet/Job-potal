import { z } from "zod";
import mongoose from "mongoose";

const nameSchema = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(50, `${label} must not exceed 50 characters`);

const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .transform((value) => value.toLowerCase());

export const userIdParamSchema = z.object({
  id: z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), "Invalid user id"),
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).max(100).optional(),
});

export const updateProfileSchema = z
  .object({
    firstName: nameSchema("First name").optional(),
    lastName: nameSchema("Last name").optional(),
    email: emailSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const adminUpdateUserSchema = updateProfileSchema;

export const createUserSchema = z.object({
  firstName: nameSchema("First name"),
  lastName: nameSchema("Last name"),
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must not exceed 72 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must not exceed 72 characters"),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
