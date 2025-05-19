import { NextFunction, Request, Response } from "express";
import { config } from "../config/app.config";

// Create a consistent demo user object
const createDemoUser = () => ({
  _id: 'demo-user-id',
  email: 'example@gmail.com',
  name: 'Demo User',
  profilePicture: null,
  isActive: true,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  currentWorkspace: 'demo-workspace-id',
  userRole: 'owner',
  preferences: {},
  settings: {},
  status: 'active'
});

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  // For hackathon demo, always authenticate with demo user
  req.user = createDemoUser();
  return next();
};

export default isAuthenticated;
