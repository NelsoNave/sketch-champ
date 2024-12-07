import { Server, Socket } from "socket.io";
import { Room } from "../models/room.model";
import { getRandomTheme } from "../utils/rondom.theme";
export const createGameHandler = (io: Server, socket: Socket) => {
  const handleAnswer = async (roomId: string, content: string) => {
    const room = await Room.findById(roomId);
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    // check if the game is active
    if (room.status !== "active") {
      socket.emit("error", { message: "Game is not active" });
      return;
    }

    // current drawer can't answer
    if (room.currentDrawer?.userId === socket.user?._id) {
      socket.emit("error", { message: "Drawer can't answer" });
      return;
    }

    // check if the answer is correct
    const isCorrect = room.theme === content;

    // if inCorrect, send message to room and return
    if (!isCorrect) {
      // Broadcast message to room
      io.to(roomId).emit("message", {
        username: socket.user?.username,
        content: content,
      });
      return;
    }

    // if correct, processing score, and send message to room
    const member = room.members.find(
      (member) => member.userId === socket.user?._id
    );
    if (member) {
      member.score++;
    }
    // set next drawer who is not the current / previous drawer
    const previousDrawers = room.previousDrawers;
    if (previousDrawers.length === room.members.length) {
      room.previousDrawers = [];
    }
    const nextDrawer = room.members.find(
      (member) =>
        member.userId !== socket.user?._id &&
        !previousDrawers.includes(member.userId)
    );
    if (nextDrawer) {
      const timeLimit = room.settings.timeLimit * 1000;
      setTimeout(() => {
        handleTimeUp(roomId);
      }, timeLimit);

      room.currentDrawer = {
        userId: nextDrawer.userId,
        startedAt: new Date(),
      };
      room.previousDrawers.push(nextDrawer.userId);
    }
    // set new theme
    room.theme = getRandomTheme();

    // increment round
    room.currentRound++;

    // check if round is over
    if (room.currentRound === room.settings.numberOfPrompts) {
      room.status = "finished";
    }
    // update room
    await room.save();

    // Broadcast message to room
    io.to(roomId).emit("game:message", {
      username: socket.user?.username,
      content: content,
    });

    // if round is over, notify all members
    if (room.status === "finished") {
      // show result (members score)
      const memberResults = room.members.map((member) => ({
        username: member.username,
        score: member.score,
      }));
      io.to(roomId).emit("game:finished", {
        content: "Round is over",
        memberResults,
      });
    } else {
      io.to(roomId).emit("game:correct", {
        content: `${socket.user?.username} is correct!`,
        answer: content,
        answerBy: socket.user?.username,
        nextDrawer: nextDrawer?.username,
        currentRound: room.currentRound,
        totalRounds: room.settings.numberOfPrompts,
      });
    }
  };

  const handleTimeUp = async (roomId: string) => {
    const room = await Room.findById(roomId);
    if (!room) {
      return;
    }
    io.to(roomId).emit("game:time_up", {
      content: "Time is up",
      answer: room.theme,
    });
  };

  // Register event handlers
  socket.on("game:answer", handleAnswer);

  return { handleAnswer };
};

// Server receives
// game:answer

// Client Events and params
// game:message
// params: username, content
// game:time_up
// params: roomId,content, answer
// game:correct
// params: roomId, answer, answerBy, nextDrawer, currentRound, totalRounds
// game:finished
// params: roomId
