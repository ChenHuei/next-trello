import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board, Card } from '@/types';
// import { arrayMove } from '@dnd-kit/sortable';

// 初始資料
const initialBoard: Board = {
	lists: [
		{ id: 'todo', name: '待辦', cards: [{ id: '1', name: '學習 Zustand' }] },
		{
			id: 'doing',
			name: '進行中',
			cards: [{ id: '2', name: '開發 Trello Clone' }],
		},
		{ id: 'done', name: '已完成', cards: [] },
	],
};

// 定義 Zustand Store
interface BoardStore {
	board: Board;
	nextCardNumber: number;
	draggingCard: Card | null;
	addCard: (listId: string) => void;
	setBoard: (board: Board) => void;
	setDraggingCard: (card: Card | null) => void;
}

const useBoardStore = create<BoardStore>()(
	persist(
		(set): BoardStore => ({
			board: initialBoard,
			nextCardNumber: 1, // 調整為從 3 開始，避免 ID 重複
			draggingCard: null,
			addCard: (listId: string) =>
				set((state) => {
					const {
						board: { lists },
						nextCardNumber,
					} = state;
					return {
						board: {
							lists: lists.map((list) => {
								return list.id === listId
									? {
											...list,
											cards: [
												...list.cards,
												{
													id: crypto.randomUUID(),
													name: `新卡片 ${nextCardNumber}`,
												},
											],
									  }
									: list;
							}),
						},
						nextCardNumber: nextCardNumber + 1,
					};
				}),
			setBoard: (board: Board) =>
				set(() => {
					return {
						board,
					};
				}),
			setDraggingCard: (card: Card | null) =>
				set(() => {
					return {
						draggingCard: card,
					};
				}),
		}),
		{ name: 'board-storage' },
	),
);

export default useBoardStore;
