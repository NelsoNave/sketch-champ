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

interface RoomMember {
  userId: string;
  username: string;
  isReady: boolean;
  joinedAt: Date;
}

interface RoomJoinedData {
  roomId: string;
  members: RoomMember[];
  settings: RoomSettings;
}

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
  roomJoinData: RoomJoinedData;
  isReady: boolean;

  createRoom: (roomSetting: Room) => Promise<void>;
  joinRoom: (codeWord: string) => Promise<void>;
  accessRoom: () => void;
  clearRoomId: () => void;
  setRoomJoinData: (data: RoomJoinedData) => void;
  updateRoomMember: (data: RoomMember) => void;
  setIsReady: () => void;
}

const setRoomSettings = (prefix: any) => {
  return {
    codeword: prefix.codeword,
    hostId: prefix.hostId,
    status: prefix.status,
    settings: {
      maxPlayers: prefix.settings.maxPlayers,
      numberOfPrompts: prefix.settings.numberOfPrompts,
      timeLimit: prefix.settings.timeLimit,
    },
    theme: prefix.theme,
    roomId: prefix._id,
  };
};

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
  roomJoinData: {
    roomId: "",
    members: [],
    settings: { maxPlayers: 2, numberOfPrompts: 2, timeLimit: 30 },
  },
  isReady: false,

  createRoom: async (roomSetting: Room) => {
    try {
      // create a new room
      const res = await axiosInstance.post("/room", {
        codeword: roomSetting.codeword,
        maxPlayers: roomSetting.maxPlayers,
        numberOfPrompts: roomSetting.numberOfPrompts,
        timeLimit: roomSetting.timeLimit,
      });

      set(setRoomSettings(res.data.room));
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

      set(setRoomSettings(res.data.room));
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
    set({ roomId: "" });
  },

  // join
  accessRoom: () => {
    const socket = getSocket();
    socket.emit("join-room");
  },

  setRoomJoinData: (roomJoinData: RoomJoinedData) => {
    set((state) => {
      const newMembers = roomJoinData.members.filter((newMember) => {
        return !state.roomJoinData.members.some(
          (existingMember) => existingMember.userId === newMember.userId
        );
      });

      return {
        roomJoinData: {
          ...state.roomJoinData,
          members: [...state.roomJoinData.members, ...newMembers],
        },
      };
    });
  },

  updateRoomMember: (newMember: RoomMember) => {
    set((state) => {
      const existingMemberIndex = state.roomJoinData.members.findIndex(
        (member) => member.userId === newMember.userId
      );

      // player already exist
      if (existingMemberIndex !== -1) {
        const updatedMembers = state.roomJoinData.members.map((member) =>
          member.userId === newMember.userId ? newMember : member
        );

        return {
          roomJoinData: {
            ...state.roomJoinData,
            members: updatedMembers,
          },
        };
      } else {
        return {
          roomJoinData: {
            ...state.roomJoinData,
            members: [...state.roomJoinData.members, newMember],
          },
        };
      }
    });
  },

  setIsReady: () => {
    set((state) => ({
      isReady: !state.isReady,
    }));
  },
}));
