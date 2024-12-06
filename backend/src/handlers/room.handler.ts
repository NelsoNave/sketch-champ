import { Server, Socket } from "socket.io";
import { Room } from "../models/room.model";

export const createRoomHandler = (io: Server, socket: Socket) => {
  // Join room
  const handleJoinRoom = async (roomId: string) => {
    try {
      // check and update room
      const room = await Room.findOneAndUpdate(
        {
          _id: roomId,
          "members.userId": { $ne: socket.user?._id }, // user is not joined
          $expr: {
            $lt: [{ $size: "$members" }, "$settings.maxPlayers"], // room is not full
          },
        },
        {
          $addToSet: {
            members: {
              userId: socket.user?._id,
              isReady: false,
              joinedAt: new Date(),
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!room) {
        // check if already joined or room not found
        const existingRoom = await Room.findById(roomId);
        if (!existingRoom) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        const isMember = existingRoom.members.some((m) =>
          m.userId.equals(socket.user?._id)
        );
        if (isMember) {
          socket.emit("error", { message: "You are already in this room" });
          return;
        }

        socket.emit("error", { message: "Room is full" });
        return;
      }

      // success
      socket.join(roomId);
      // send room info to client
      socket.emit("room:joined", {
        roomId,
        members: room.members,
        settings: room.settings,
      });
      console.log("room:joined", room.members);
      // notify other members
      socket.to(roomId).emit("room:member_joined", {
        userId: socket.user?._id,
        username: socket.user?.username,
        joinedAt: new Date(),
      });
    } catch (error) {
      console.error("Error in handleJoinRoom:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  };
  // Leave room
  const handleLeaveRoom = async (roomId: string) => {
    try {
      console.log("handleLeaveRoom", roomId);
      const room = await Room.findByIdAndUpdate(roomId, {
        $pull: { members: { userId: socket.user?._id } },
        new: true,
      });
      if (!room) {
        console.error("Room not found in handleLeaveRoom", roomId);
        socket.emit("error", { message: "Room not found" });
        return;
      }
      console.log("check user on socket", socket.user?.username);
      // Remove member from room
      room.members = room.members.filter(
        (m) => !m.userId.equals(socket.user?._id)
      );
      if (room.members.length === 0) {
        console.log("delete room", roomId);
        await Room.findByIdAndDelete(roomId);
        io.to(roomId).emit("room:deleted", { roomId });
        socket.leave(roomId);
        return;
      }
      // If host leaves, assign new host
      if (room.hostId.equals(socket.user?._id)) {
        room.hostId = room.members[0].userId;
        await room.save();
      }

      socket.leave(roomId);

      // Notify other members
      io.to(roomId).emit("room:member_left", {
        userId: socket.user?._id,
        username: socket.user?.username,
        leftAt: new Date(),
      });
    } catch (error) {
      console.error("Error in handleLeaveRoom", error);
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

        console.log("room:member_ready");
        // Broadcast ready status change
        io.to(roomId).emit("room:member_ready", {
          userId: socket.user?._id,
          username: socket.user?.username,
          isReady: member.isReady,
        });

        // Check if all members are ready
        const allReady = room.members.every((m) => m.isReady);
        if (allReady) {
          console.log("room:game_start", roomId);
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

  // Draw
  const handleDraw = async (data: {
    x: number;
    y: number;
    type: "start" | "move" | "end";
    color: string;
    roomId: string;
  }) => {
    try {
      // Broadcast draw event to all members in the room except the sender
      socket.to(data.roomId).emit("room:draw_sync", data);
    } catch (error) {
      console.error("Error in handleDraw", error);
      socket.emit("error", { message: "Failed to draw" });
    }
  };

  // Register event handlers
  socket.on("room:join", handleJoinRoom);
  socket.on("room:ready", handleReady);
  socket.on("room:leave", handleLeaveRoom);
  socket.on("room:draw", handleDraw);

  return {
    handleJoinRoom,
    handleLeaveRoom,
    handleReady,
    handleDraw,
  };
};
