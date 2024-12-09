import { useState } from "react";
import Button from "./Button";
import CreateRoomModal from "./CreateRoomModal";
import JoinRoomModal from "./JoinRoomModal";

const Home = () => {
  const [isCreateRoom, setIsCreateRoom] = useState(false);
  const [isJoinRoom, setIsJoinRoom] = useState(false);

  const setCreateRoom = () => {
    setIsCreateRoom(true);
  };

  const setJoinRoom = () => {
    setIsJoinRoom(true);
  };

  const closeCreateRoomModal = () => setIsCreateRoom(false);
  const closeJoinRoomModal = () => setIsJoinRoom(false);

  return (
    <div className="flex flex-col gap-8 items-center justify-center h-full mb-[300px] md:mb-[450px] relative">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-5xl md:text-6xl font-russo_one">SketchChamp</h1>
        <p className="font-poppins">Who’s the Best Artist? Let’s Find Out!</p>
      </div>
      <div className="flex flex-col gap-8 md:flex-row justify-center">
        <Button onClick={setCreateRoom} className="w-[250px]">
          Create Room
        </Button>
        <Button onClick={setJoinRoom} className="w-[250px]">
          Join Room
        </Button>
      </div>

      <div className="hidden md:block">
        <div className="absolute top-10 left-16 w-48 animate-pulse-left-right">
          <img
            src="./commet-svgrepo-com.svg"
            alt="comet"
            className="w-full h-auto"
          />
        </div>
        <div className="absolute top-16 right-16 w-48 animate-pulse-left-right">
          <img
            src="./crab-svgrepo-com.svg"
            alt="crab"
            className="w-full h-auto"
          />
        </div>
        <div className="absolute top-56 right-4 w-48 animate-pulse-left-right">
          <img
            src="./crocodile-svgrepo-com.svg"
            alt="crocodile"
            className="w-full h-auto"
          />
        </div>
        <div className="absolute bottom-12 left-48 w-48 animate-pulse-left-right">
          <img
            src="./penguin-svgrepo-com.svg"
            alt="penguin"
            className="w-full h-auto"
          />
        </div>
        <div className="absolute bottom-16 right-32 w-48 animate-pulse-left-right">
          <img
            src="./fox-svgrepo-com.svg"
            alt="fox"
            className="w-full h-auto"
          />
        </div>
        <div className="absolute bottom-56 left-16 w-24 animate-pulse-left-right">
          <img
            src="./drawing-of-an-apple.png"
            alt="apple"
            className="w-full h-auto"
          />
        </div>

        <div className="absolute bottom-0 left-[40%] w-48 animate-pulse-left-right">
          <img
            src="./lion-svgrepo-com.svg"
            alt="lion"
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="w-48 block md:hidden">
        <img src="./fox-svgrepo-com.svg" alt="fox" className="w-full h-auto" />
      </div>

      {isCreateRoom ? (
        <CreateRoomModal closeCreateRoomModal={closeCreateRoomModal} />
      ) : (
        ""
      )}
      {isJoinRoom ? (
        <JoinRoomModal closeJoinRoomModal={closeJoinRoomModal} />
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
