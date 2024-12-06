import { create } from "zustand";
import { Result } from "../types/result.type";

interface ResultStore {
  results: Result[];
  setResult: (result: Result) => void;
}

export const useResultStore = create<ResultStore>((set) => ({
  results: [],
  setResult: (result: Result) => {
    set((state) => ({ results: [...state.results, result] }));
  },
}));
