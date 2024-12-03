import { create } from "zustand";

interface SidebarStore {
	isOpenSidebar: boolean;
}

interface SidebarAction {
	onSidebarDesktopToggle: () => void;
	onSidebarTabletToggle: () => void;
}

export const useSidebar = create<SidebarStore & SidebarAction>((set) => ({
	isOpenSidebar: false,
	onSidebarDesktopToggle: () => set((_state) => ({ isOpenSidebar: true })),
	onSidebarTabletToggle: () => set((_state) => ({ isOpenSidebar: false })),
}));
