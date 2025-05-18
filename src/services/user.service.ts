import { NotFoundException } from "../utils/appError";
import UserModel from "../models/user.model";

export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    throw new NotFoundException("User not found");
  }

  return { user };
};

export const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password");
  if (!user) {
    throw new NotFoundException("User not found");
  }
  return user;
};
