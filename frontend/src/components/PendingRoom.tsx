import DrawingCanvas from "./DrawingCanvas";
import Button from "./Button";

type Props = {};

const Room = (props: Props) => {
  const handleGetReady = () => {
    // let the server know that user is ready.
  };

  return (
    <div className="flex gap-8">
      <div className="flex flex-col items-center w-2/3 gap-2 ">
        <p className="p-2 font-poppins text-center text-sm font-medium bg-custom-albescent-white w-full rounded-lg">
          Please wait for everyone to get ready.
        </p>
        <div className="hidden sm:block w-full">
          <DrawingCanvas />
        </div>
      </div>
      <div className="flex flex-col h-full w-full sm:w-1/3 gap-4">
        <div className="h-[200px] w-full sm:w-full sm:h-auto sm:flex-grow rounded-xl border-2 border-black bg-white">
          Room settings
        </div>
        <div className="h-[200px] w-full sm:w-full sm:h-auto sm:flex-grow rounded-xl border-2 border-black bg-white">
          player
        </div>
        <Button variant="pink" onClick={handleGetReady}>
          I'm ready to join!
        </Button>
      </div>
    </div>
  );
};

export default Room;
