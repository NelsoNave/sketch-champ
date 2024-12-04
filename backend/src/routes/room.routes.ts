import express from "express";
import {
  createRoom,
  joinRoom,
  readyRoom,
  deleteRoom,
} from "../controllers/room.controller";

const router = express.Router();

router.post("/", createRoom);
router.post("/join", joinRoom);
router.post("/:roomId/ready", readyRoom);
router.post("/:roomId/delete", deleteRoom);

export default router;
