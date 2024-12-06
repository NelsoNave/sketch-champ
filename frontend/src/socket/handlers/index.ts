import { Socket } from "socket.io-client";
import { createDrawHandler } from "./draw.handler.client";
import { createRoomHandler } from "./room.handler.client";

export const registerSocketHandlers = (
  socket: Socket,
  context: CanvasRenderingContext2D | null
) => {
  console.log(context);
  const cleanupFunctions = [
    //if context is not null, createDrawHandler is executed
    context ? createDrawHandler(socket, context) : null,
    createRoomHandler(socket),
  ].filter((fn) => fn !== null);

  // Return cleanup function
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup && cleanup());
  };
};
