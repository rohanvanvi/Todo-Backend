import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    // For hackathon demo, return the user directly from req.user
    const user = req.user;

    if (!user) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({
        message: "User not found"
      });
    }

    return res.status(HTTPSTATUS.OK).json({
      message: "User fetched successfully",
      user
    });
  }
);
