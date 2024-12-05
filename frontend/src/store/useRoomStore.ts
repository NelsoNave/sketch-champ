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
  roomId: string;

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
  roomId: "",

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
