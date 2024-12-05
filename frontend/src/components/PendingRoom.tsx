import DrawingCanvas from "./DrawingCanvas";
import Button from "./Button";
import { useRoomStore } from "../store/useRoomStore";

type Props = {};

const Room = (props: Props) => {
  const handleGetReady = () => {};

  const { settings, pending, drawer } = useRoomStore();

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
                    Apple
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
                    ONO BEN
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
              <div className=""></div>
            </div>
          </>
        ) : (
          <div className="relative h-full border-2 border-black rounded-xl bg-custom-bianca">
            <div className="absolute top-1/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-black rounded-xl w-2/3 bg-custom-yellow text-center font-russo_one">
              chat
            </div>
            <ul className="h-full p-5">
              <li>hello</li>
              <li>hi</li>
            </ul>
          </div>
        )}
        <Button variant="pink" onClick={handleGetReady}>
          I'm ready to join!
        </Button>
      </div>
    </div>
  );
};

export default Room;
