import { create } from "zustand";

const useUiStore = create((set) => ({
  // ── Sidebar ──────────────────────────────────────────────────────────────
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
}));

export default useUiStore;
