import { create } from "zustand";
import { api, errorMessage } from "@/lib/api";

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type State = {
  user: AdminUser | null;
  /** "idle" until the first /auth/me check resolves. */
  status: "idle" | "ready";
  restore: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<State>((set) => ({
  user: null,
  status: "idle",

  restore: async () => {
    try {
      const res = await api.get<{ data: AdminUser }>("/auth/me");
      set({ user: res.data.data, status: "ready" });
    } catch {
      set({ user: null, status: "ready" });
    }
  },

  login: async (email, password) => {
    try {
      const res = await api.post<{ user: { data: { data: AdminUser } } }>("/auth/login", {
        email,
        password,
      });
      set({ user: res.data.user.data.data, status: "ready" });
    } catch (e) {
      throw new Error(errorMessage(e, "Sign in failed. Try again."));
    }
  },

  logout: async () => {
    await api.post("/auth/logout").catch(() => {});
    set({ user: null });
  },
}));
