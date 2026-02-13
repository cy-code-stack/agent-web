import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  isMobileOpen: boolean;
  isCollapsed: boolean;
}

interface SidebarActions {
  setOpen: (isOpen: boolean) => void;
  setMobileOpen: (isMobileOpen: boolean) => void;
  setCollapsed: (isCollapsed: boolean) => void;
  toggle: () => void;
  toggleMobile: () => void;
  toggleCollapse: () => void;
}

type SidebarStore = SidebarState & SidebarActions;

const initialState: SidebarState = {
  isOpen: true,
  isMobileOpen: false,
  isCollapsed: false,
};

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      ...initialState,

      setOpen: (isOpen) => set({ isOpen }),

      setMobileOpen: (isMobileOpen) => set({ isMobileOpen }),

      setCollapsed: (isCollapsed) => set({ isCollapsed }),

      toggle: () => set((state) => ({ isOpen: !state.isOpen })),

      toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),

      toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
      }),
    }
  )
);
