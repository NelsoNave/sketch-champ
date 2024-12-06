import React, { useState, useEffect, useRef } from "react";
import { getSocket } from "../socket/socket.client";
import { useRoomStore } from "../store/useRoomStore";
import { registerSocketHandlers } from "../socket/handlers";

const DrawingCanvas = () => {
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const socket = getSocket();
  const colors = ["black", "red", "green", "blue", "yellow", "purple"];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const { roomId } = useRoomStore();
  const [isPressed, setIsPressed] = useState(false);

  const emitDraw = (
    e: React.MouseEvent<HTMLCanvasElement>,
    type: "start" | "move" | "end"
  ) => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // const x = e.nativeEvent.offsetX - rect.left;
    // const y = e.nativeEvent.offsetY - rect.top;
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    // convert to canvas coordinate
    const x = e.nativeEvent.offsetX * scaleX;
    const y = e.nativeEvent.offsetY * scaleY;

    socket.emit("room:draw", {
      x,
      y,
      type,
      color: contextRef.current?.strokeStyle || "black",
      roomId,
    });
  };

  const beginDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsPressed(true);
    emitDraw(e, "start");
  };

  const endDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPressed(false);
    emitDraw(e, "end");
  };

  const updateDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPressed) return;
    const context = contextRef.current;
    if (!context) return;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
    emitDraw(e, "move");
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (context) context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const setStrokeColor = (color: string) => {
    const context = contextRef.current;
    if (context) context.strokeStyle = color;
  };

  const handleTouch = (
    e: React.TouchEvent<HTMLCanvasElement>,
    type: "start" | "move" | "end"
  ) => {
    const touch = e.touches[0];
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    if (type === "start") {
      contextRef.current?.beginPath();
      contextRef.current?.moveTo(offsetX, offsetY);
      setIsPressed(true);
    } else if (type === "move" && isPressed) {
      contextRef.current?.lineTo(offsetX, offsetY);
      contextRef.current?.stroke();
    } else if (type === "end") {
      setIsPressed(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const container = containerRef.current as HTMLDivElement;
    if (!canvas || !container) return;

    //const { width, height } = container.getBoundingClientRect();
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvas.style.width = "100%";
    canvas.style.height = "auto";

    const context = canvas.getContext("2d");
    if (context) {
      context.lineCap = "round";
      context.strokeStyle = "black";
      context.lineWidth = 5;
      contextRef.current = context;
    }
    console.log("roomStore", roomId);
    // sync draw
    const handleDrawSync = (data: {
      x: number;
      y: number;
      type: "start" | "move" | "end";
      color: string;
    }) => {
      console.log("handleDrawSync", data);
      const context = contextRef.current;
      if (!context) return;

      // 受信した色を設定
      context.strokeStyle = data.color;

      if (data.type === "start") {
        context.beginPath();
        context.moveTo(data.x, data.y);
      } else if (data.type === "move") {
        context.lineTo(data.x, data.y);
        context.stroke();
      }
      // endの場合は特に何もしない
    };
    if (socket) socket.on("room:draw_sync", handleDrawSync);

    const cleanup = registerSocketHandlers(socket, context);
    return () => {
      cleanup();
      if (socket) socket.off("room:draw_sync", handleDrawSync);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[480px] rounded-xl border-2 border-black bg-white"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={beginDraw}
        onMouseMove={updateDraw}
        onMouseUp={endDraw}
        onTouchStart={(e) => handleTouch(e, "start")}
        onTouchMove={(e) => handleTouch(e, "move")}
        onTouchEnd={(e) => handleTouch(e, "end")}
      ></canvas>
      <div className="tools flex rounded-md p-3 gap-3">
        {colors.map((color) => (
          <button
            key={color}
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: color }}
            onClick={() => setStrokeColor(color)}
          ></button>
        ))}
        <button onClick={clearCanvas}>
          <img src="/trash.png" alt="" className="w-7" />
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
