import { Server, Socket } from "socket.io";
import { Room } from "../models/room.model";

export const createRoomHandler = (io: Server, socket: Socket) => {
  // Join room
  const handleJoinRoom = async (roomId: string) => {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      // Join socket room
      socket.join(roomId);

      // Notify other members
      io.to(roomId).emit("room:member_joined", {
        userId: socket.user?._id,
        username: socket.user?.username,
        joinedAt: new Date(),
      });
    } catch (error) {
      console.error("Error in handleJoinRoom", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  };

  // Leave room
  const handleLeaveRoom = async (roomId: string) => {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      // Remove member from room
      room.members = room.members.filter(
        (m) => !m.userId.equals(socket.user?._id)
      );
      if (room.members.length === 0) {
        await room.deleteOne();
      }
      // If host leaves, assign new host
      if (room.hostId.equals(socket.user?._id)) {
        room.hostId = room.members[0].userId;
      }
      await room.save();
      socket.leave(roomId);

      // Notify other members
      io.to(roomId).emit("room:member_left", {
        userId: socket.user?._id,
        username: socket.user?.username,
        leftAt: new Date(),
      });
    } catch (error) {
      socket.emit("error", { message: "Failed to leave room" });
    }
  };

  // Ready status change
  const handleReady = async (roomId: string) => {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      // Update member ready status
      const member = room.members.find((m) =>
        m.userId.equals(socket.user?._id)
      );
      if (member) {
        member.isReady = !member.isReady;
        await room.save();

        // Broadcast ready status change
        io.to(roomId).emit("room:member_ready", {
          userId: socket.user?._id,
          username: socket.user?.username,
          isReady: member.isReady,
        });

        // Check if all members are ready
        const allReady = room.members.every((m) => m.isReady);
        if (allReady) {
          io.to(roomId).emit("room:game_start", {
            roomId,
            startTime: new Date(),
          });

          // Update room status
          room.status = "active";
          await room.save();
        }
      }
    } catch (error) {
      socket.emit("error", { message: "Failed to update ready status" });
    }
  };

  // Register event handlers
  socket.on("room:join", handleJoinRoom);
  socket.on("room:ready", handleReady);
  socket.on("room:leave", handleLeaveRoom);
};
