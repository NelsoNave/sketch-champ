import mongoose, { Document } from "mongoose";

export interface IRoom extends Document {
  codeword: string;
  status: "pending" | "active" | "finished";
  hostId: mongoose.Types.ObjectId;
  members: {
    userId: mongoose.Types.ObjectId;
    isReady: boolean;
    joinedAt: Date;
  }[];
  settings: {
    maxPlayers: number;
    numberOfPrompts: number;
    timeLimit: number;
  };
  currentRound: number;
  theme?: string;
  drawings: {
    userId: mongoose.Types.ObjectId;
    drawing: string;
  }[];
}

const RoomSchema = new mongoose.Schema(
  {
    codeword: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "finished"],
      default: "pending",
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isReady: { type: Boolean, default: false },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    settings: {
      maxPlayers: { type: Number, required: true },
      numberOfPrompts: { type: Number, required: true },
      timeLimit: { type: Number, required: true },
    },
    currentRound: { type: Number, default: 0 },
    theme: { type: String, required: true },
    drawings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        drawing: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Room = mongoose.model<IRoom>("Room", RoomSchema);