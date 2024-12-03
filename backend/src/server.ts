import express from "express";
import { createServer } from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Create server
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Create HTTP server
const server = createServer(app);

// Connect to MongoDB and start server
const MONGO_URI = process.env.DATABASE_URL!;
mongoose
  .connect(MONGO_URI, { dbName: "chatroom" })
  .then(() => {
    console.log("Connected to MongoDB database");

    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
