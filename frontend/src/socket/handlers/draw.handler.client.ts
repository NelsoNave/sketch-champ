import { Socket } from "socket.io-client";

interface DrawData {
  x: number;
  y: number;
  type: "start" | "move" | "end";
  color: string;
  userId: string;
}

export const createDrawHandler = (
  socket: Socket,
  context: CanvasRenderingContext2D
) => {
  console.log("createDrawHandler");
  const handleDraw = (data: DrawData) => {
    console.log("Received draw event:", data);

    context.strokeStyle = data.color;

    switch (data.type) {
      case "start":
        context.beginPath();
        context.moveTo(data.x, data.y);
        break;
      case "move":
        context.lineTo(data.x, data.y);
        context.stroke();
        break;
      case "end":
        context.closePath();
        break;
    }
  };

  // Register event handler
  socket.on("room:draw", handleDraw);
  //socket.on("draw", handleDraw);
  socket.on("error", (error) => {
    console.error("Error in draw handler", error);
  });

  // Cleanup function
  return () => {
    socket.off("room:draw", handleDraw);
  };
};
