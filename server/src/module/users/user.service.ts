import argon2 from "argon2";
import type { QueryFilter } from "mongoose";
import type { IUser } from "./user.model.js";
import {
  countUsersRepository,
  createUserRepository,
  deleteUserRepository,
  findUserByEmailRepository,
  findUserByIdRepository,
  findUserByIdWithPasswordRepository,
  listUsersRepository,
  updatePasswordRepository,
  updateUserRepository,
} from "./user.repository.js";
import type {
  AdminUpdateUserInput,
  ChangePasswordInput,
  CreateUserInput,
  ListUsersQuery,
  UpdateProfileInput,
} from "./user.schema.js";

export class UserError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "UserError";
  }
}

export const toPublicUser = (user: IUser) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const listUsersService = async (query: ListUsersQuery) => {
  const filter: QueryFilter<IUser> = {};
  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }];
  }

  const skip = (query.page - 1) * query.limit;
  const [users, total] = await Promise.all([
    listUsersRepository(filter, skip, query.limit),
    countUsersRepository(filter),
  ]);

  return {
    users: users.map(toPublicUser),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const createUserService = async (input: CreateUserInput) => {
  if (await findUserByEmailRepository(input.email)) {
    throw new UserError("Email already exists", 409);
  }
  const password = await argon2.hash(input.password);
  const user = await createUserRepository({ ...input, password });
  return toPublicUser(user);
};

export const getUserService = async (id: string) => {
  const user = await findUserByIdRepository(id);
  if (!user) throw new UserError("User not found", 404);
  return toPublicUser(user);
};

export const updateUserService = async (
  id: string,
  data: UpdateProfileInput | AdminUpdateUserInput,
) => {
  if (data.email) {
    const existing = await findUserByEmailRepository(data.email);
    if (existing && existing.id !== id) {
      throw new UserError("Email already exists", 409);
    }
  }

  const user = await updateUserRepository(id, data);
  if (!user) throw new UserError("User not found", 404);
  return toPublicUser(user);
};

export const changePasswordService = async (
  id: string,
  { currentPassword, newPassword }: ChangePasswordInput,
) => {
  const user = await findUserByIdWithPasswordRepository(id);
  if (!user) throw new UserError("User not found", 404);

  const valid = await argon2.verify(user.password, currentPassword);
  if (!valid) throw new UserError("Current password is incorrect", 400);

  await updatePasswordRepository(id, await argon2.hash(newPassword));
};

export const deleteUserService = async (id: string) => {
  const user = await deleteUserRepository(id);
  if (!user) throw new UserError("User not found", 404);
};
