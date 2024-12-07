import { useState, useEffect } from "react";
import { useRoomStore } from "../store/useRoomStore";

const GameStartModal = ({ onClose }: { onClose: () => void }) => {
  const [count, setCount] = useState(3);
  const { updatePending } = useRoomStore();

  useEffect(() => {
    // count down
    const intervalId = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    if (count === 0) {
      onClose();
      updatePending(); // game start
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [count]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Game starts in</h2>
        <div className="text-center text-4xl font-semibold">
          <p>{count}</p>
        </div>
        <div className="mt-4 flex justify-center"></div>
      </div>
    </div>
  );
};

export default GameStartModal;
