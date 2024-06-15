import { Request, Response , NextFunction } from "express";
import UserModel, {IUser} from "../models/user.mode";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsycnError } from "../middleware/catchAsyncErrors";

// register user
