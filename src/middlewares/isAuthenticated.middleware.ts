import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";
import { HTTPSTATUS } from "../config/http.config";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    throw new UnauthorizedException("Unauthorized. Please log in.");
  }
  next();
};

export default isAuthenticated;
