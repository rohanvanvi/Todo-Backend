import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";
import jwt from 'jsonwebtoken';
import { config } from "../config/app.config";
import { getUserById } from "../services/user.service";

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException("Please login to continue");
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
    } catch (error) {
      throw new UnauthorizedException("Session expired, please login again");
    }
    
    const user = await getUserById(decoded.id);
    if (!user) {
      throw new UnauthorizedException("User not found, please login again");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new UnauthorizedException("Authentication failed, please login again");
  }
};

export default isAuthenticated;
