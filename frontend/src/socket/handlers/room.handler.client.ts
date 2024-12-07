import { Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { Result } from "../../types/result.type";

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

interface RoomMessageData {
  username: string;
  content: string;
}

interface RoomCorrectAnswerData {
  content: string;
  answer: string;
  answerBy: string;
  nextDrawer: string;
  currentRound: number;
  totalRounds: number;
}

interface RoomFinishedData {
  results: Result[];
}

export const createRoomHandler = (socket: Socket) => {
  const handleRoomJoined = (data: RoomJoinedData) => {
    // JoinしたユーザーにRoomの設定とメンバーを通知
    console.log("Room joined:", data);
    // Room storeの更新など
  };

  const handleMemberJoined = (data: RoomMember) => {
    // 他のユーザーがJoinした時に通知
    console.log("Member joined:", data);
    toast.success(`${data.username} joined the room`);
    // Todo update room store
  };

  const handleRoomReady = (data: RoomMember) => {
    // ユーザーがReadyした時に通知
    console.log("Room ready:", data);
    toast.success(`${data.username} is ready`);
    // Todo update room store
  };

  const handleGameStart = (data: RoomJoinedData) => {
    // ゲームが開始(全員Readyした時)に通知
    console.log("Game start:", data);
    toast.success("Game started");
    // Todo update room store
  };

  const handleTimeUp = (data: RoomJoinedData) => {
    // お題のTimeupで通知
    console.log("Time up:", data);
    toast.success("Time is up");
    // Todo show message in room
    // Todo update room store
  };

  const handleCorrectAnswer = (data: RoomCorrectAnswerData) => {
    // 正解した時に通知
    console.log("Answer correct:", data);
    toast.success(`Answer by ${data.answerBy}: ${data.content}`);
    // Todo show message in room
    // Todo update room store
  };

  const handleMessage = (data: RoomMessageData) => {
    // メッセージ(Answer)が送信された(正解ではない)時に通知
    console.log("Message:", data);
    toast.success(`${data.username}: ${data.content}`);
    // Todo show message in chat
  };

  const handleFinished = (data: RoomFinishedData) => {
    // ゲームが終了した時に通知
    console.log("Finished:", data);
    toast.success("Game finished");
    // Todo update result store
  };

  const handleMemberLeft = (data: RoomJoinedData) => {
    console.log("Member left:", data);
    toast.success(`${data.members[0].username} left the room`);
    // Todo update room store
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
  socket.on("room:time_up", handleTimeUp);
  socket.on("room:correct", handleCorrectAnswer);
  socket.on("room:message", handleMessage);
  socket.on("room:finished", handleFinished);
  socket.on("error", handleError);

  // Return cleanup function
  return () => {
    socket.off("room:member_joined", handleMemberJoined);
    socket.off("room:member_left", handleMemberLeft);
    socket.off("room:member_ready", handleRoomReady);
    socket.off("room:joined", handleRoomJoined);
    socket.off("room:game_start", handleGameStart);
    socket.off("room:message", handleMessage);
    socket.off("room:correct", handleCorrectAnswer);
    socket.off("room:finished", handleFinished);
    socket.off("error", handleError);
  };
};
