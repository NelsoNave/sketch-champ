import { create } from "zustand";
import { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import { Room } from "../types/room.type";
import { getSocket } from "../socket/socket.client";
import toast from "react-hot-toast";

type RoomSettings = {
  maxPlayers: number;
  numberOfPrompts: number;
  timeLimit: number;
};

interface RoomStore {
  codeword: string;
  maxPlayers: number;
  numberOfPrompts: number;
  timeLimit: number;
  status: string;
  settings: RoomSettings;
  theme: string;
  hostId: number;
  pending: boolean;
  drawer: boolean;
  roomId: string;
  roomJoinId: string;

  createRoom: (roomSetting: Room) => Promise<void>;
  joinRoom: (codeWord: string) => Promise<void>;
  accessRoom: () => void;
  clearRoomId: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  codeword: "",
  maxPlayers: 2,
  numberOfPrompts: 2,
  timeLimit: 30,
  status: "",
  settings: { maxPlayers: 2, numberOfPrompts: 2, timeLimit: 30 },
  theme: "",
  hostId: 0,
  pending: true,
  drawer: true,
  roomId: "",
  roomJoinId: "",

  createRoom: async (roomSetting: Room) => {
    try {
      // create a new room
      const res = await axiosInstance.post("/room", {
        codeword: roomSetting.codeword,
        maxPlayers: roomSetting.maxPlayers,
        numberOfPrompts: roomSetting.numberOfPrompts,
        timeLimit: roomSetting.timeLimit,
      });

      const preUrl = res.data.room;

      set({
        codeword: preUrl.codeword,
        hostId: preUrl.hostId,
        status: preUrl.status,
        settings: {
          maxPlayers: preUrl.settings.maxPlayers,
          numberOfPrompts: preUrl.settings.numberOfPrompts,
          timeLimit: preUrl.settings.timeLimit,
        },
        theme: preUrl.theme,
        roomId: preUrl._id,
      });

      toast.success("The game is starting soon!");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },

  joinRoom: async (codeword: string) => {
    try {
      const res = await axiosInstance.post("/room/join", {
        codeword,
      });
      set({ roomJoinId: res.data.room._id });
      toast.success("The game is starting soon!");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },

  clearRoomId: async () => {
    set({ roomJoinId: "" });
  },

  // join
  accessRoom: () => {
    const socket = getSocket();
    socket.emit("join-room?");
  },
}));
