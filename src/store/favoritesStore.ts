import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PicsumImage } from '../types';

interface FavoritesState {
  favorites: PicsumImage[];
  toggleFavorite: (image: PicsumImage) => void;
  isFavorite: (id: string) => boolean;
  removeFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (image: PicsumImage) => {
        const { favorites } = get();
        const exists = favorites.some((f) => f.id === image.id);
        if (exists) {
          set({ favorites: favorites.filter((f) => f.id !== image.id) });
        } else {
          set({ favorites: [...favorites, image] });
        }
      },

      isFavorite: (id: string) => {
        return get().favorites.some((f) => f.id === id);
      },

      removeFavorite: (id: string) => {
        set({ favorites: get().favorites.filter((f) => f.id !== id) });
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
