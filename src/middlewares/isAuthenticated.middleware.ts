import { NextFunction, Request, Response } from "express";
import { config } from "../config/app.config";
import { UserDocument } from "../models/user.model";

// Create a consistent demo user object that matches the database user
const createDemoUser = () => {
  const demoUser = {
    _id: '6828ecb231293ec06797420a',
    email: 'example@gmail.com' as string,
    name: 'Test Account' as string,
    profilePicture: null as string | null,
    isActive: true as boolean,
    lastLogin: null as Date | null,
    createdAt: new Date('2025-05-17T20:08:18.709Z') as Date,
    updatedAt: new Date('2025-05-18T18:19:21.240Z') as Date,
    currentWorkspace: '6828ecb231293ec06797420e',
    // Add required UserDocument methods
    comparePassword: async () => true,
    omitPassword: function() { return this as unknown as Omit<UserDocument, 'password'> },
  } as unknown as UserDocument;
  
  return demoUser;
};

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  // For hackathon demo, always authenticate with demo user
  req.user = createDemoUser();
  return next();
};

export default isAuthenticated;
