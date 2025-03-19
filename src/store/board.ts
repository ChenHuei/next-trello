import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Board, Card } from '@/types';
import { arrayMove } from '@dnd-kit/sortable';

// 初始資料
const initialBoard: Board = {
	lists: [
		{ id: 'todo', name: '待辦', cards: [{ id: '1', text: '學習 Zustand' }] },
		{
			id: 'doing',
			name: '進行中',
			cards: [{ id: '2', text: '開發 Trello Clone' }],
		},
		{ id: 'done', name: '已完成', cards: [] },
	],
};

// 定義 Zustand Store
interface BoardStore {
	board: Board;
	nextCardNumber: number; // 全局累加變數
	draggingCard: string | null; // 目前拖曳中的卡片 ID
	moveCard: (
		sourceListId: string,
		targetListId: string,
		cardId: string,
		targetIndex: number,
	) => void;
	moveList: (oldIndex: number, newIndex: number) => void;
	addCard: (listId: string, text?: string) => void;
	addList: (name: string) => void;
	setDraggingCard: (cardId: string | null) => void; // 設定拖曳卡片
}

const useBoardStore = create<BoardStore>()(
	persist(
		(set) => ({
			board: initialBoard,
			nextCardNumber: 1,
			draggingCard: null,

			moveCard: (sourceListId, targetListId, cardId, targetIndex) =>
				set((state) => {
					const lists = [...state.board.lists];
					let card: Card;

					lists.forEach((list) => {
						if (list.id === sourceListId) {
							list.cards = list.cards.filter((c) => {
								if (c.id === cardId) {
									card = c;
									return false;
								}
								return true;
							});
						}
					});

					lists.forEach((list) => {
						if (list.id === targetListId && card) {
							list.cards.splice(targetIndex, 0, card);
						}
					});

					return { board: { lists }, draggingCard: null };
				}),

			moveList: (oldIndex, newIndex) =>
				set((state) => ({
					board: { lists: arrayMove(state.board.lists, oldIndex, newIndex) },
				})),

			addCard: (listId, text) =>
				set((state) => {
					const newCardNumber = state.nextCardNumber; // 取得當前的累計編號
					const newCardText = text || `新卡片 ${newCardNumber}`;

					return {
						board: {
							lists: state.board.lists.map((list) =>
								list.id === listId
									? {
											...list,
											cards: [
												...list.cards,
												{ id: crypto.randomUUID(), text: newCardText },
											],
									  }
									: list,
							),
						},
						nextCardNumber: newCardNumber + 1,
					};
				}),

			addList: (name) =>
				set((state) => ({
					board: {
						lists: [
							...state.board.lists,
							{ id: crypto.randomUUID(), name, cards: [] },
						],
					},
				})),

			setDraggingCard: (cardId) => set({ draggingCard: cardId }),
		}),
		{ name: 'board-storage' },
	),
);

export default useBoardStore;
