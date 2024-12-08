import React, { useEffect, useState } from "react";

type Props = {};

const GameOverModal = (props: Props) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    // count down
    const intervalId = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    if (count === 0) {
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [count]);
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center ">
      <div className="flex flex-col items-center bg-white py-12 rounded-2xl sm:w-1/2 lg:w-1/3 border-2 border-black shadow-custom">
        <h2 className="text-3xl font-bold text-center mb-4 font-sans italic">
          Congrats!
        </h2>
        <div className="flex flex-col items-center">
          <p>amane</p>
          <div className="border border-black rounded-full bg-white w-9">
            <img src="/bee.png" alt="" className="w-full h-full" />
          </div>
        </div>
        <p>Next drawer is Ben</p>
        <div className="text-center text-4xl font-semibold"></div>
      </div>
    </div>
  );
};

export default GameOverModal;
