import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: true,
      setAuth: (user, token) => {
        set({ user, token, isLoading: false });
        if (typeof window !== "undefined") {
          localStorage.setItem("finance_token", token);
          localStorage.setItem("finance_user", JSON.stringify(user));
        }
      },
      logout: () => {
        set({ user: null, token: null, isLoading: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem("finance_token");
          localStorage.removeItem("finance_user");
        }
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
    }
  )
);
