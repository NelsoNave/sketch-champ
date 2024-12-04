import React, { useState } from "react";
import Button from "./Button";

interface JoinRoomModalProps {
  closeJoinRoomModal: () => void;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  closeJoinRoomModal,
}) => {
  const [codeword, setCodeword] = useState<string>("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("TEST_JOINEROOM_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codeword }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // todo : join a new room
      alert("Room created successfully!");
      closeJoinRoomModal();
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center font-poppins">
      <div className="bg-white px-8 py-9 rounded-2xl sm:w-1/2 lg:w-1/3 border-2 border-black shadow-custom">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl mb-4 font-bold font-russo_one">Join Room</h2>
          <button onClick={closeJoinRoomModal} className="mb-4">
            <img src="../../public/close.svg" alt="close button" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Codeword */}
          <div className="mb-4">
            <label className="text-xs font-semibold">Codeword</label>
            <input
              type="text"
              value={codeword}
              onChange={(e) => setCodeword(e.target.value)}
              className="w-full px-4 py-2 border-1.5 border-black rounded-lg text-sm h-[50px]"
              placeholder="Enter Codeword"
            />
          </div>
          <Button className="w-full mt-4 text-2xl" variant="green">
            Join
          </Button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomModal;
