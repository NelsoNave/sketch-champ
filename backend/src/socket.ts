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
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication required"));
      }

      // Verify and attach user to socket
      const user = await verifyUser(token);
      socket.user = user;
      next();
    } catch (error) {
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
