import {
  getUserByIdRepository,
  loginUserRepository,
} from "./auth.repository.js";
import { toPublicUser } from "../users/user.service.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const loginService = async (email: string, password: string) => {
  const user = await loginUserRepository(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }
  const validPassword = await argon2.verify(user.password, password);

  if (!validPassword) {
    throw new Error("Invalid email or password");
  }
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15m",
    },
  );
  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    },
  );
  return {
    data: toPublicUser(user),
    token: token,
    refreshToken: refreshToken,
  };
};

export const getUserByID = async (id: string) => {
  const user = await getUserByIdRepository(id);
  return user ? toPublicUser(user) : null;
};

export const logoutService = async (refreshToken: string) => {
  return {
    message: "Logout successful",
  };
};
