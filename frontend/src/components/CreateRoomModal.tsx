import Button from "./Button";

const CreateRoomModal = ({
  closeCreateRoomModal,
}: {
  closeCreateRoomModal: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white px-8 py-9 rounded-2xl sm:w-1/2 lg:w-1/3 border-2 border-black shadow-custom">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl mb-4 font-bold">Create a New Room</h2>
          <button onClick={closeCreateRoomModal} className="mb-4">
            <img src="../../public/close.svg" alt="close button" />
          </button>
        </div>
        <form>
          {/* Codeword */}
          <div className="mb-4">
            <label className="text-xs font-semibold">Codeword</label>
            <input
              type="text"
              className="w-full px-4 py-2 border-1.5 border-black rounded-lg text-sm h-[50px]"
              placeholder="Enter Codeword"
            />
          </div>

          {/* Number of Players */}
          <div className="mb-4">
            <label className="text-xs font-semibold">Number of Players</label>
            <div className="relative">
              <select
                className="w-full px-4 py-2 border-1.5 border-black rounded-lg text-sm h-[50px] appearance-none pr-10"
                defaultValue=""
              >
                <option value="" disabled>
                  Select number of players
                </option>
                <option value="2">2 players</option>
                <option value="3">3 players</option>
                <option value="4">4 players</option>
                <option value="6">6 players</option>
                <option value="7">7 players</option>
              </select>
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                  <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 9.793l5.646-5.147a.5.5 0 1 1 .708.707l-6 5.5a.5.5 0 0 1-.708 0l-6-5.5a.5.5 0 0 1 0-.707z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Number of Prompts */}
          <div className="mb-4">
            <label className="text-xs font-semibold">Number of Prompts</label>
            <div className="relative">
              <select
                className="w-full px-4 py-2 border-1.5 border-black rounded-lg text-sm h-[50px] appearance-none pr-10"
                defaultValue=""
              >
                <option value="" disabled>
                  Select number of prompts
                </option>
                <option value="2">2 prompts</option>
                <option value="3">3 prompts</option>
                <option value="4">4 prompts</option>
                <option value="5">5 prompts</option>
              </select>
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                  <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 9.793l5.646-5.147a.5.5 0 1 1 .708.707l-6 5.5a.5.5 0 0 1-.708 0l-6-5.5a.5.5 0 0 1 0-.707z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Time Limitation */}
          <div className="mb-4">
            <label className="text-xs font-semibold">
              Time Limitation (seconds)
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-2 border-1.5 border-black rounded-lg text-sm h-[50px] appearance-none pr-10"
                defaultValue=""
              >
                <option value="" disabled>
                  Select time limitation
                </option>
                <option value="30">30 seconds</option>
                <option value="60">60 seconds</option>
                <option value="90">90 seconds</option>
                <option value="120">120 seconds</option>
              </select>
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                  <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 9.793l5.646-5.147a.5.5 0 1 1 .708.707l-6 5.5a.5.5 0 0 1-.708 0l-6-5.5a.5.5 0 0 1 0-.707z" />
                </svg>
              </span>
            </div>
          </div>
          <Button className="w-full mt-4" variant="green">
            Create
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
