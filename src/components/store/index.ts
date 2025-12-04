import { useFavoritesStore } from "./favorites-store";
// Import other stores if you have them

// Re-export all stores
export { useFavoritesStore };

// Or create a combined hook if needed
export const useStore = () => {
  return {
    favorites: useFavoritesStore(),
    // Add other stores here
  };
};
