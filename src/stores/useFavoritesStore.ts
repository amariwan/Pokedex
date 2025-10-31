"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type FavoritesStore = {
  favorites: string[];
  addFavorite: (name: string) => void;
  removeFavorite: (name: string) => void;
  toggleFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
  clearFavorites: () => void;
  setFavorites: (names: string[]) => void;
};

const storage =
  typeof window === "undefined"
    ? undefined
    : createJSONStorage(() => localStorage);

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (name: string) =>
        set((state) =>
          state.favorites.includes(name)
            ? state
            : { favorites: [...state.favorites, name] }
        ),
      removeFavorite: (name: string) =>
        set((state) => ({
          favorites: state.favorites.filter((favorite) => favorite !== name),
        })),
      toggleFavorite: (name: string) => {
        const { isFavorite, removeFavorite, addFavorite } = get();
        if (isFavorite(name)) {
          removeFavorite(name);
        } else {
          addFavorite(name);
        }
      },
      isFavorite: (name: string) => get().favorites.includes(name),
      clearFavorites: () => set({ favorites: [] }),
      setFavorites: (names: string[]) =>
        set({ favorites: Array.from(new Set(names.filter(Boolean))) }),
    }),
    {
      name: "favorites",
      storage,
    }
  )
);
