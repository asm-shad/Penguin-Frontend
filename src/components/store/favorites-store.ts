import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IProduct } from "@/types/product.interface";

interface FavoriteItem extends IProduct {
  addedAt: Date;
}

interface FavoritesStore {
  favoriteProducts: FavoriteItem[];
  addToFavorite: (product: IProduct) => void;
  removeFromFavorite: (productId: string) => void;
  clearFavorites: () => void;
  isFavorite: (productId: string) => boolean;
  totalFavorites: number;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteProducts: [],

      addToFavorite: (product: IProduct) => {
        set((state) => {
          // Check if product already exists in favorites
          const exists = state.favoriteProducts.find(
            (item) => item.id === product.id
          );

          if (exists) {
            return state; // Don't add duplicate
          }

          return {
            favoriteProducts: [
              ...state.favoriteProducts,
              { ...product, addedAt: new Date() },
            ],
          };
        });
      },

      removeFromFavorite: (productId: string) => {
        set((state) => ({
          favoriteProducts: state.favoriteProducts.filter(
            (item) => item.id !== productId
          ),
        }));
      },

      clearFavorites: () => {
        set({ favoriteProducts: [] });
      },

      isFavorite: (productId: string) => {
        return get().favoriteProducts.some((item) => item.id === productId);
      },

      get totalFavorites() {
        return get().favoriteProducts.length;
      },
    }),
    {
      name: "favorites-storage", // name for localStorage
      storage: createJSONStorage(() => localStorage), // or sessionStorage
    }
  )
);
