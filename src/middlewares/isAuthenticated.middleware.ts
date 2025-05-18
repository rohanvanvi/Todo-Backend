import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";
import jwt from 'jsonwebtoken';
import { config } from "../config/app.config";
import { getUserById } from "../services/user.service";

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException("No token provided");
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
    
    const user = await getUserById(decoded.id);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new UnauthorizedException("Invalid or expired token");
  }
};

export default isAuthenticated;
