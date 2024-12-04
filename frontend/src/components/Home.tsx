import { useState } from "react";
import Button from "./Button";
import CreateRoomModal from "./CreateRoomModal";

const Home = () => {
  const [isCreateRoom, setIsCreateRoom] = useState(false);
  const setCreateRoom = () => {
    setIsCreateRoom(true);
  };

  const closeCreateRoomModal = () => setIsCreateRoom(false);

  return (
    <div className="flex flex-col gap-8 items-center justify-center h-full mb-20">
      <div className="flex flex-col gap-1 justify-center items-center">
        <h1 className="text-6xl font-russo_one">SketchChamp</h1>
        <p className="font-poppins">Who’s the Best Artist? Let’s Find Out!</p>
      </div>
      <div className="flex flex-col gap-8 md:flex-row justify-center">
        <Button onClick={setCreateRoom} className="w-[200px]">
          Create Room
        </Button>
        <Button className="w-[200px]">Join Room</Button>
      </div>
      {isCreateRoom ? (
        <CreateRoomModal closeCreateRoomModal={closeCreateRoomModal} />
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
