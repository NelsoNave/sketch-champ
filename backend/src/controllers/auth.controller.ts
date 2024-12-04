import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { AuthRequest } from "../models/auth.model";
import mongoose from "mongoose";

// create token
const createToken = (userId: mongoose.Types.ObjectId | string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

// signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // username duplicate check
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Username already registered" });
      return;
    }

    // create user
    const user = await User.create({ username, password });

    // create token
    const token = createToken(user._id as mongoose.Types.ObjectId);

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

// login
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // search user
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // password check
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // create token
    const token = createToken(user._id as mongoose.Types.ObjectId);

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

// logout
export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// get current user info
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user?._id,
        username: user?.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};
