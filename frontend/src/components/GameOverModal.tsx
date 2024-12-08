import { useEffect, useState } from "react";
import { useRoomStore } from "../store/useRoomStore";

const GameOverModal = ({ onClose }: { onClose: () => void }) => {
  const [count, setCount] = useState(3);
  const { roomCorrectAnswerData, clearRoomMessageData } = useRoomStore();

  useEffect(() => {
    console.log(count);
    if (count === 0) {
      // todo : clean canvas
      clearRoomMessageData();
      onClose();
    } else {
      const intervalId = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [count, onClose]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center ">
      <div className="flex flex-col items-center gap-6 bg-white py-6 rounded-2xl sm:w-1/2 lg:w-1/3 border-2 border-black shadow-custom">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-center font-sans italic">
            Congrats!
          </h2>
          <div className="flex flex-col items-center">
            <p className="font-poppins text-lg">
              {roomCorrectAnswerData.answerBy}
            </p>
            <div className="border border-black rounded-full bg-white w-12">
              <img src="/bee.png" alt="" className="w-full h-full" />
            </div>
            <p className="font-poppins text-sm">
              {`Answer : ${roomCorrectAnswerData.answer}`}
            </p>
          </div>
        </div>
        <div className="flex justify-center w-4/5 bg-custom-albescent-white rounded gap-2 p-2">
          <p className="text-gray-600 font-semibold">Next drawer is</p>
          <div className="flex gap-1">
            <div className="border border-black rounded-full bg-white w-6">
              <img src="/bee.png" alt="" className="w-full h-full" />
            </div>
            <p className="font-semibold">{roomCorrectAnswerData.nextDrawer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
