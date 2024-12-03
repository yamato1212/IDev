import { create } from "zustand";

interface BookItemEditorState {
	openBookItem: boolean;
}

interface BookItemEditorAction {
	onOpenBookItem: () => void;
}

export const useBookItmeEdiror = create<BookItemEditorState & BookItemEditorAction>((set) => ({
	openBookItem: false,
	onOpenBookItem: () => set((state) => ({ openBookItem: !state.openBookItem })),
}));
