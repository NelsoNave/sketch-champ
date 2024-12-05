import { create } from "zustand";
import { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import { Room } from "../types/room.type";
import { getSocket } from "../socket/socket.client";

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

  createRoom: (roomSetting: Room) => Promise<void>;
  joinRoom: (codeWord: string) => Promise<void>;
  accessRoom: () => void;
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

  createRoom: async (roomSetting: Room) => {
    try {
      // create a new room
      const res = await axiosInstance.post("/room", {
        codeword: roomSetting.codeword,
        maxPlayers: roomSetting.maxPlayers,
        numberOfPrompts: roomSetting.numberOfPrompts,
        timeLimit: roomSetting.timeLimit,
      });

      set({
        codeword: res.data.codeword,
        hostId: res.data.hostId,
        status: res.data.status,
        settings: {
          maxPlayers: res.data.settings.maxPlayers,
          numberOfPrompts: res.data.settings.numberOfPrompts,
          timeLimit: res.data.settings.timeLimit,
        },
        theme: res.data.theme,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
    }
  },

  joinRoom: async (codeWord: string) => {
    try {
      const res = await axiosInstance.put("/room/join", { codeWord });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
    }
  },

  // join
  accessRoom: () => {
    const socket = getSocket();
    socket.emit("join-room?");
  },
}));
