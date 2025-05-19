import { NextFunction, Request, Response } from "express";
import { config } from "../config/app.config";
import mongoose from "mongoose";
import { UserDocument } from "../models/user.model";

// Create a consistent demo user object that matches Mongoose Document structure
const createDemoUser = () => {
  const demoUser = {
    _id: new mongoose.Types.ObjectId('000000000000000000000000'),
    email: 'example@gmail.com' as string,
    name: 'Test Account' as string,
    profilePicture: null as string | null,
    isActive: true as boolean,
    lastLogin: new Date() as Date | null,
    createdAt: new Date() as Date,
    updatedAt: new Date() as Date,
    currentWorkspace: new mongoose.Types.ObjectId('000000000000000000000000') as mongoose.Types.ObjectId | null,
    // Add Mongoose Document methods
    $assertPopulated: () => {},
    $clone: () => ({ ...demoUser }),
    $getAllSubdocs: () => [],
    $ignore: () => {},
    $isDefault: () => false,
    $isDeleted: () => false,
    $getPopulatedDocs: () => [],
    $isEmpty: () => false,
    $isValid: () => true,
    $locals: {},
    $markValid: () => {},
    $model: () => ({}),
    $op: null,
    $session: () => null,
    $set: () => ({}),
    baseModelName: null,
    collection: {} as any,
    db: {} as any,
    errors: {},
    isNew: false,
    schema: {} as any,
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
