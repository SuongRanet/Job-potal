import { create } from "zustand";

type Toast = { id: number; kind: "ok" | "error"; text: string };
let n = 0;

export const useToast = create<{ items: Toast[]; push: (kind: Toast["kind"], text: string) => void; drop: (id: number) => void }>((set, get) => ({
  items: [],
  push: (kind, text) => {
    const id = ++n;
    set((s) => ({ items: [...s.items, { id, kind, text }] }));
    setTimeout(() => get().drop(id), 4500);
  },
  drop: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}));

export const toast = {
  ok: (t: string) => useToast.getState().push("ok", t),
  error: (t: string) => useToast.getState().push("error", t),
};
