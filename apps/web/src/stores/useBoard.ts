// import { getUserByBookItem } from "@/actions/book/book";
// import { BookItem, SubTopic } from "@prisma/client";
// import { create } from "zustand";

// interface Board {
//   columns: Map<TypedColumn, Column>;
// }

// export type TypedColumn = "todo" | "inprogress" | "done";

// export interface Column {
//   id: TypedColumn;
//   bookItems: SubTopic & BookItem[];
// }

// interface BoardState {
//   board: Board;
//   getBoard: () => void;
// }

// export const useBoardStore = create<BoardState>((set) => ({
//   board: {
//     columns: new Map<TypedColumn, Column>(),
//   },
//   getBoard: async () => {
//     const board = await getUserByBookItem();
//     set({ board });
//   },
// }));
