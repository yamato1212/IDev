import { create } from "zustand";

interface BookItemStore {
	isOpenItem: boolean;
}

interface BookItemAction {
	onOpenBookItem: () => void;
}

export const useBookItem = create<BookItemStore & BookItemAction>((set) => ({
	isOpenItem: true,
	onOpenBookItem: () => {
		set((state) => ({ isOpenItem: !state.isOpenItem }));
	},
}));
