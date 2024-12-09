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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white py-12 rounded-2xl w-1/2 lg:w-1/3 border-2 border-black shadow-custom">
        <h2 className="text-2xl font-bold text-center mb-4 font-mochiy_pop_one">
          Game starts in
        </h2>
        <div className="text-center text-4xl font-semibold">
          <p
            className={`font-poppins font-semibold ${
              count === 3
                ? "text-green-500"
                : count === 2
                ? "text-yellow-500"
                : count === 1
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {count}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameStartModal;
