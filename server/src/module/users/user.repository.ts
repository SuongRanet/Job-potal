import type { QueryFilter } from "mongoose";
import User from "./user.model.js";
import type { IUser } from "./user.model.js";
import type { AdminUpdateUserInput } from "./user.schema.js";

export const createUserRepository = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // already hashed
}) => {
  return User.create(data);
};

export const listUsersRepository = async (
  filter: QueryFilter<IUser>,
  skip: number,
  limit: number,
) => {
  return User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

export const countUsersRepository = async (filter: QueryFilter<IUser>) => {
  return User.countDocuments(filter);
};

export const findUserByIdRepository = async (id: string) => {
  return User.findById(id);
};

export const findUserByIdWithPasswordRepository = async (id: string) => {
  return User.findById(id).select("+password");
};

export const findUserByEmailRepository = async (email: string) => {
  return User.findOne({ email });
};

export const updateUserRepository = async (
  id: string,
  data: AdminUpdateUserInput,
) => {
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const updatePasswordRepository = async (
  id: string,
  password: string,
) => {
  return User.findByIdAndUpdate(id, { password }, { new: true });
};

export const deleteUserRepository = async (id: string) => {
  return User.findByIdAndDelete(id);
};
