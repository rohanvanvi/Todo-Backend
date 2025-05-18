import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { registerUserService, verifyUserService } from "../services/auth.service";
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from "../utils/appError";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    // Generate token for Google login
    const token = jwt.sign({ id: req.user?._id }, config.JWT_SECRET, {
      expiresIn: '24h'
    });

    return res.redirect(
      `${config.FRONTEND_GOOGLE_CALLBACK_URL}?token=${token}&workspace=${currentWorkspace}`
    );
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    const user = await registerUserService(body);
    
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: '24h'
    });

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      token,
      user
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const user = await verifyUserService({ email, password });
      
      const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
        expiresIn: '24h'
      });

      return res.status(HTTPSTATUS.OK).json({
        message: "Logged in successfully",
        token,
        user
      });
    } catch (error) {
      throw new UnauthorizedException("Invalid email or password");
    }
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    return res.status(HTTPSTATUS.OK).json({ 
      message: "Logged out successfully" 
    });
  }
);
