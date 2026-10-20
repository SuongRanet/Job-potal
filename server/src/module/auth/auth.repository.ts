import User from "./auth.model.js";

export const getUsersRepository = async () => {
  return User.find();
};

export const getUserByIdRepository = async (id: string) => {
  return User.findById(id);
};

export const getUserByEmailRepository = async (email: string) => {
  return User.findOne({ email });
};

export const loginUserRepository = async (email: string) => {
  return User.findOne({ email }).select("+password");
};
