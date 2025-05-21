import { create } from "zustand";
import { User } from "@/src/types/entities";
import { login, logout, register, me, resetPassword, requestPasswordReset } from "@/src/api/auth";
import { getToken } from "@/src/api/apiClient";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  test: string | null;
  login: (email: string, password: string) => Promise<void>;
  getMe: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
  test: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { accessToken } = await login({ email, password });
      set({ accessToken });
      await get().getMe();
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      });
      throw error;
    }
  },

  getMe: async () => {
    if (!get().accessToken) {
      const tokenFromStorage = await getToken();
      if (tokenFromStorage) {
        set({ accessToken: tokenFromStorage });
      }
    }

    if (get().accessToken) {
      try {
        set({ isLoading: true, error: null });
        const response = await me();
        if (response && response.id !== get().user?.id) {
          set({ user: response });
        }
        set({
          isLoading: false,
        });
      } catch (error) {
        set({
          isLoading: false,
          user: null,
          accessToken: null,
          error: error instanceof Error ? error.message : "My profile failed",
        });
        console.error("My profile error:", error);
      }
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await register({ email, password, name });
      set({
        user: response,
        isLoading: false,
      });
      await get().login(email, password);
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await logout();
      set({
        user: null,
        accessToken: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Logout failed",
      });
    }
  },

  requestPasswordReset: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      await requestPasswordReset(email);
      set({
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Password reset request failed",
      });
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      await resetPassword({ token, password });
      set({
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Password reset failed",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
