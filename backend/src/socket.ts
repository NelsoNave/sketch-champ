import { Server } from "socket.io";
import { createRoomHandler } from "./handlers/room.handler";
import { verifyUser } from "./middleware/auth";
import { Server as HttpServer } from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/user.model";
dotenv.config();

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // Debug middleware
  io.use((socket, next) => {
    console.log("Socket middleware - New connection attempt:", socket.id);
    next();
  });

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      if (process.env.NODE_ENV === "test") {
        const mockUser = new User({
          _id: new mongoose.Types.ObjectId(),
          username: "mock_user",
          password: "mock_password",
          createdAt: new Date(),
        });
        socket.user = mockUser;
        return next();
      }
      const cookie = socket.handshake.headers.cookie;
      console.log("cookie", cookie);
      const token = cookie
        ?.split("; ")
        ?.find((row) => row.startsWith("token="))
        ?.split("=")[1];
      if (!token) {
        console.log("No token provided");
        return next(new Error("Authentication required"));
      }

      // Verify and attach user to socket
      const user = await verifyUser(token);
      socket.user = user;
      next();
    } catch (error) {
      console.error("Authentication failed", error);
      next(new Error("Authentication failed"));
    }
  });

  // Connection handler
  io.on("connection", (socket) => {
    console.log("User connected:", socket.user?.username);

    // Initialize room handlers
    createRoomHandler(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user?.username);
    });
  });

  return io;
};
