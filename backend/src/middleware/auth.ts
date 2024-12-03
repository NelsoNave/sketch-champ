import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { AuthRequest, JwtPayload } from "../models/auth.model";
import dotenv from "dotenv";
dotenv.config();

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    // Verify token
    const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Get user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Request is not authorized" });
  }
};
