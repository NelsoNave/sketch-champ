import React, { useState, useEffect, useRef } from "react";
import { getSocket } from "../socket/socket.client";
import { useRoomStore } from "../store/useRoomStore";

interface Point {
  x: number;
  y: number;
}

const DrawingCanvas = () => {
  const socket = getSocket();
  const { roomId } = useRoomStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [currentColor, setCurrentColor] = useState("black");
  const colors = ["black", "red", "green", "blue", "yellow", "purple"];

  const getCoordinates = (e: React.MouseEvent<SVGSVGElement>): Point => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;

    // SVGの座標系に変換
    const transformedPoint = point.matrixTransform(
      svg.getScreenCTM()?.inverse()
    );

    return {
      x: transformedPoint.x,
      y: transformedPoint.y,
    };
  };

  const startDrawing = (e: React.MouseEvent<SVGSVGElement>) => {
    const point = getCoordinates(e);
    setIsDrawing(true);
    setCurrentPath([point]);

    socket.emit("room:draw", {
      type: "start",
      points: [point],
      color: currentColor,
      roomId,
    });
  };

  const draw = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing) return;

    const point = getCoordinates(e);
    setCurrentPath((prev) => [...prev, point]);

    socket.emit("room:draw", {
      type: "move",
      points: [point],
      color: currentColor,
      roomId,
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    socket.emit("room:draw", {
      type: "end",
      points: currentPath,
      color: currentColor,
      roomId,
    });
  };

  useEffect(() => {
    if (!socket) return;

    const handleDrawSync = (data: {
      type: "start" | "move" | "end";
      points: Point[];
      color: string;
    }) => {
      if (data.type === "start") {
        setCurrentPath(data.points);
      } else if (data.type === "move") {
        setCurrentPath((prev) => [...prev, ...data.points]);
      }
    };

    socket.on("room:draw_sync", handleDrawSync);
    return () => {
      socket.off("room:draw_sync", handleDrawSync);
    };
  }, [socket]);

  const pathData =
    currentPath.length > 0
      ? `M ${currentPath[0].x} ${currentPath[0].y} ` +
        currentPath
          .slice(1)
          .map((point) => `L ${point.x} ${point.y}`)
          .join(" ")
      : "";

  return (
    <div className="h-[480px] rounded-xl border-2 border-black bg-white">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      >
        <path
          d={pathData}
          stroke={currentColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="tools flex rounded-md p-3 gap-3">
        {colors.map((color) => (
          <button
            key={color}
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: color }}
            onClick={() => setCurrentColor(color)}
          />
        ))}
        <button onClick={() => setCurrentPath([])}>
          <img src="/trash.png" alt="" className="w-7" />
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
