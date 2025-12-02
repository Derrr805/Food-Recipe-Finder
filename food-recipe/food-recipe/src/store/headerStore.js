import { create } from "zustand";

export const useHeaderStore = create((set) => ({
  searchQuery: "",
  selectedCategory: "all",

  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ selectedCategory: category }),
  clearSearch: () => set({ searchQuery: "" }),
}));
