import { Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useRoomStore } from "../../store/useRoomStore";

interface RoomMember {
  userId: string;
  username: string;
  isReady: boolean;
  joinedAt: Date;
}

interface RoomSettings {
  maxPlayers: number;
  numberOfPrompts: number;
  timeLimit: number;
}

interface RoomJoinedData {
  roomId: string;
  members: RoomMember[];
  settings: RoomSettings;
}

export const createRoomHandler = (socket: Socket) => {
  const { setRoomJoinData, updateRoomMember } = useRoomStore();

  const handleRoomJoined = (data: RoomJoinedData) => {
    console.log("Room joined:", data);
    setRoomJoinData(data);
  };

  const handleMemberJoined = (data: RoomMember) => {
    toast.success(`${data.username} joined the room`);
    updateRoomMember(data);
  };

  const handleRoomReady = (data: RoomMember) => {
    console.log("Room ready:", data);
    // toast.success(`${data.username} is ready`); todo: figure out why multiple toasts are displayed.
    updateRoomMember(data);
  };

  const handleGameStart = (data: RoomJoinedData) => {
    console.log("Game start:", data);
    toast.success("Game started");
    // Todo update room store
  };

  const handleMemberLeft = (data: RoomJoinedData) => {
    console.log("Member left:", data);
    toast.success(`${data.members[0].userId} left the room`);
    // Room storeの更新など
  };

  const handleError = (error: Error) => {
    console.error("Socket error:", error);
  };

  // Register event handlers
  socket.on("room:member_joined", handleMemberJoined);
  socket.on("room:member_left", handleMemberLeft);
  socket.on("room:joined", handleRoomJoined);
  socket.on("room:member_ready", handleRoomReady);
  socket.on("room:game_start", handleGameStart);
  socket.on("error", handleError);

  // Return cleanup function
  return () => {
    socket.off("room:member_joined", handleMemberJoined);
    socket.off("room:member_left", handleMemberLeft);
    socket.off("room:member_ready", handleRoomReady);
    socket.off("room:game_start", handleGameStart);
    socket.off("room:joined", handleRoomJoined);
    socket.off("error", handleError);
  };
};
