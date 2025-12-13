// stores/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  userRole: string | null;
  setIsAuthenticated: (auth: boolean) => void;
  setUserRole: (role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userRole: null,
      setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
      setUserRole: (role) => set({ userRole: role }),
      logout: () => set({ isAuthenticated: false, userRole: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
