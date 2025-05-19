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
    if (!req.user) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    const currentWorkspace = req.user.currentWorkspace;

    if (!currentWorkspace) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    // Generate token for Google login
    const token = jwt.sign({ id: req.user._id }, config.JWT_SECRET, {
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
    
    const token = jwt.sign({ id: user.userId }, config.JWT_SECRET, {
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

    // Hardcoded credentials for hackathon demo
    const demoEmail = 'example@gmail.com';
    const demoPassword = 'example@123';

    // For hackathon demo, always succeed with demo user
    const demoUser = {
      _id: '6828ecb231293ec06797420a',
      email: demoEmail,
      name: 'Test Account',
      profilePicture: null,
      isActive: true,
      lastLogin: null,
      createdAt: new Date('2025-05-17T20:08:18.709Z'),
      updatedAt: new Date('2025-05-18T18:19:21.240Z'),
      currentWorkspace: '6828ecb231293ec06797420e'
    };

    const token = jwt.sign({ id: demoUser._id }, config.JWT_SECRET, {
      expiresIn: '7d' // Extended token expiry for demo
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Logged in successfully",
      token,
      user: demoUser
    });
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    // For JWT-based auth, client should remove the token
    // Server-side we just send success response
    return res.status(HTTPSTATUS.OK).json({ 
      message: "Logged out successfully",
      success: true
    });
  }
);
