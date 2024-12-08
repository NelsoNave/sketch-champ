import { FormEvent, useEffect, useRef, useState } from "react";
import DrawingCanvas from "./DrawingCanvas";
import Button from "./Button";
import { useRoomStore } from "../store/useRoomStore";
import { getSocket } from "../socket/socket.client";
import { useNavigate } from "react-router-dom";
import { createRoomHandler } from "../socket/handlers/room.handler.client";
import GameStartModal from "./GameStartModal";
import GameOverModal from "./GameOverModal";

const Room = () => {
  const navigate = useNavigate();
  const handleGetReady = () => {
    socket.emit("room:ready", roomId);
    setIsReady();
  };

  const {
    settings,
    pending,
    drawer,
    roomId,
    roomJoinData,
    isReady,
    isOpenGameStart,
    isOpenGameOver,
    roomMessageData,
    setIsReady,
    CloseGameStartModal,
    CloseGameOverModal,
  } = useRoomStore();

  const socket = getSocket();
  const hasJoinId = useRef(false);
  createRoomHandler(socket, navigate);
  // join room if component is mounted
  useEffect(() => {
    if (!socket || !roomId) return;
    if (hasJoinId.current) return;
    socket.emit("room:join", roomId);
    hasJoinId.current = true;
    const handleBeforeUnload = () => {
      socket.emit("room:leave", roomId);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [socket, roomId]);

  const [content, setContent] = useState<string>("");

  const handleCloseModal = () => {
    CloseGameStartModal();
  };

  const handleGameOverModal = () => {
    CloseGameOverModal();
  };

  const handleInputChange = (val: React.ChangeEvent<HTMLInputElement>) => {
    setContent(val.target.value);
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      console.log("roomId", roomId, "content", content);
      socket.emit("room:answer", {
        roomId,
        content,
      });
      setContent("");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-5">
      <div className="flex flex-col items-center w-full lg:w-2/3 gap-2">
        {pending ? (
          <p className="p-2 font-poppins text-center text-sm font-medium bg-custom-albescent-white w-full rounded-lg">
            Please wait for everyone to get ready.
          </p>
        ) : (
          <>
            {drawer ? (
              <div className="flex w-full gap-3">
                <div className="relative w-1/2">
                  <p className="absolute top-1/5 left-3 transform -translate-y-1/2 text-custom-cape-cod text-sm  bg-custom-serenade mx-1 px-2 font-bold">
                    Theme
                  </p>
                  <p className="flex justify-center items-center rounded-lg border-2 border-black h-11 font-russo_one shadow-custom_light">
                    {roomJoinData.theme}
                  </p>
                </div>
                <div className="relative w-1/2">
                  <p className="absolute top-1/5 left-3 transform -translate-y-1/2 text-custom-cape-cod text-sm bg-custom-serenade mx-1 px-2 font-bold">
                    Time Left
                  </p>
                  <div className="flex w-full justify-center items-center rounded-lg border-2 border-black h-11 font-russo_one shadow-custom_light gap-2">
                    <div className="w-[20px]">
                      <img src="../../public/stopwatch.png" alt="stopwatch" />
                    </div>
                    <p>00:00:30</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex w-full gap-3">
                <div className="relative w-1/2">
                  <p className="absolute top-1/5 left-3 transform -translate-y-1/2 text-custom-cape-cod text-sm  bg-custom-serenade mx-1 px-2 font-bold">
                    Drawer
                  </p>
                  <p className="flex justify-center items-center rounded-lg border-2 border-black h-11 font-russo_one shadow-custom_light">
                    {roomJoinData.nextDrawer}
                  </p>
                </div>
                <div className="relative w-1/2">
                  <p className="absolute top-1/5 left-3 transform -translate-y-1/2 text-custom-cape-cod text-sm bg-custom-serenade mx-1 px-2 font-bold">
                    Time Left
                  </p>
                  <div className="flex w-full justify-center items-center rounded-lg border-2 border-black h-11 font-russo_one shadow-custom_light gap-2">
                    <div className="w-[20px]">
                      <img src="../../public/stopwatch.png" alt="stopwatch" />
                    </div>
                    <p>00:00:30</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div className="w-full">
          <DrawingCanvas />
        </div>
      </div>
      <div className="flex flex-col h-full w-full lg:w-1/3 gap-5">
        {pending ? (
          <>
            <div className="relative border-2 border-black rounded-xl bg-custom-yellow">
              <div className="absolute top-1/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-black rounded-xl w-2/3 bg-white text-center font-russo_one">
                Room Settings
              </div>
              <div className="flex flex-col items-center justify-center h-full gap-2 text-lg rounded-xl font-nunito font-semibold p-5">
                <p>Time Limitation : {settings.timeLimit}sec</p>
                <p>Number of Prompts : {settings.numberOfPrompts}</p>
              </div>
            </div>
            <div className="relative h-full border-2 border-black rounded-xl bg-custom-teal">
              <div className="absolute top-1/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-black rounded-xl w-2/3 bg-white text-center font-russo_one">
                Player
              </div>
              <div>
                <ul className="flex flex-col gap-3 mt-7">
                  {roomJoinData.members.map((data, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-center gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <div className="border border-black rounded-full bg-white w-9">
                          <img
                            src="/bee.png"
                            alt=""
                            className="w-full h-full"
                          />
                        </div>
                        <p className="w-[100px] overflow-hidden font-mochiy_pop_one">
                          {data.username}
                        </p>
                      </div>
                      {data.isReady ? (
                        <p className="font-poppins font-semibold text-custom-midnight-blue">
                          Ready
                        </p>
                      ) : (
                        <p className="font-poppins font-semibold text-custom-dark-red">
                          Not ready
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="relative h-full border-2 border-black rounded-xl bg-custom-bianca">
            <div className="absolute top-1/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-black rounded-xl w-2/3 bg-custom-yellow text-center font-russo_one">
              chat
            </div>
            <div className="flex flex-col justify-between h-full">
              <ul className="flex flex-col h-full py-6 px-5">
                {roomMessageData.map((message, index) => {
                  return (
                    <li key={index} className="mt-3">
                      <div className="flex gap-5 items-center">
                        <div className="border border-black rounded-full bg-white w-11 h-11 mt-1">
                          <img
                            src="/bee.png"
                            alt="icon"
                            className="w-full h-full"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-xs text-gray-600">
                            {message.username}
                          </p>
                          <p className="font-mochiy_pop_one font-bold">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {!drawer ? (
                <form
                  action=""
                  className="p-5 relative"
                  onClick={handleSendMessage}
                >
                  <input
                    type="text"
                    className="border border-black rounded-md w-full p-3 text-sm pr-16"
                    placeholder="Send your message"
                    onChange={handleInputChange}
                    value={content}
                  />
                  <button className="absolute w-9 right-6 top-1/2 transform -translate-y-1/2 p-2 bg-black text-white rounded-md">
                    <img
                      src="/send.png"
                      alt="send message"
                      className="w-full h-full"
                    />
                  </button>
                </form>
              ) : (
                ""
              )}
            </div>
          </div>
        )}

        {pending ? (
          isReady ? (
            <Button
              variant="pink"
              onClick={handleGetReady}
              className="bg-custom-right-blue"
            >
              Cancel
            </Button>
          ) : (
            <Button variant="pink" onClick={handleGetReady}>
              I'm ready to join!
            </Button>
          )
        ) : drawer ? (
          <Button variant="pink">Start Drawing</Button>
        ) : null}
      </div>
      {isOpenGameStart && <GameStartModal onClose={handleCloseModal} />}
      {isOpenGameOver && <GameOverModal onClose={handleGameOverModal} />}
    </div>
  );
};

export default Room;
