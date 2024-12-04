import { Request, Response } from "express";
import { Room } from "../models/room.model";
import { AuthRequest } from "../models/auth.model";

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { codeword, maxPlayers, numberOfPrompts, timeLimit } = req.body;
    // TODO: validate input

    // check if codeword is already taken
    const existingRoom = await Room.findOne({ codeword });
    if (existingRoom) {
      res.status(400).json({ message: "Codeword already taken" });
      return;
    }

    // create room
    const room = await Room.create({
      codeword,
      hostId: req.user?._id,
      status: "pending",
      settings: { maxPlayers, numberOfPrompts, timeLimit },
      theme: "test theme",
    });

    res.status(201).json({ room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const joinRoom = async (req: AuthRequest, res: Response) => {
  const { codeword } = req.body;
  // check if room exists
  const room = await Room.findOne({ codeword });
  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  // check if room is full
  if (room.members.length >= room.settings.maxPlayers) {
    res.status(400).json({ message: "Room is full" });
    return;
  }

  if (!req.user || !req.user._id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  // add user to room
  room.members.push({
    userId: req.user._id,
    isReady: false,
    joinedAt: new Date(),
  });
  await room.save();

  res.status(200).json({ room });
};

// /api/rooms/:id/ready
export const readyRoom = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // check if room exists
  const room = await Room.findById(id);
  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  // check if user is in room
  const member = room.members.find((member) =>
    member.userId.equals(req.user?._id)
  );
  if (!member) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // set user as ready
  member.isReady = true;
  await room.save();

  res.status(200).json({ room });
};

export const deleteRoom = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // check if room exists
  const room = await Room.findById(id);
  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  // check if user is host
  if (!room.hostId.equals(req.user?._id)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
