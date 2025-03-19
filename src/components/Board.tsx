'use client';
import { useState, useEffect } from 'react';
import {
	DndContext,
	DragStartEvent,
	DragOverEvent,
	DragEndEvent,
	closestCorners,
	defaultDropAnimation,
	DragOverlay,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import useBoardStore from '@/store/board';
import List from './List';
import SortableItem from './SortableItem';

const Board: React.FC = () => {
	const [isClient, setIsClient] = useState(false);
	const board = useBoardStore((state) => state.board);
	const moveCard = useBoardStore((state) => state.moveCard);
	const draggingCard = useBoardStore((state) => state.draggingCard);
	const setDraggingCard = useBoardStore((state) => state.setDraggingCard);

	const getDraggingCardText = (cardId: string) => {
		for (const list of board.lists) {
			const card = list.cards.find((c) => c.id === cardId);
			if (card) return card.text;
		}
		return '未知卡片'; // 如果找不到，給預設文字
	};

	// 🔥 拖曳開始 (onDragStart)
	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		setDraggingCard(active.id as string); // 記錄正在拖曳的卡片
	};

	// 🔥 拖曳過程 (onDragOver) → 確保插入位置預覽
	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;
		const sourceListId = board.lists.find((list) =>
			list.cards.some((c) => c.id === activeId),
		)?.id;
		const targetListId =
			board.lists.find((list) => list.cards.some((c) => c.id === overId))?.id ||
			overId;

		// 🔹 確保卡片被正確插入目標 List，而不會亂跳
		if (sourceListId && targetListId && sourceListId !== targetListId) {
			const targetIndex =
				board.lists
					.find((list) => list.id === targetListId)
					?.cards.findIndex((c) => c.id === overId) || 0;

			// 👇 設定插入位置預覽 (你可以更新狀態來顯示 UI)
			console.log(
				`卡片 ${activeId} 可能會插入到 ${targetListId} 的第 ${targetIndex} 位`,
			);
		}
	};

	// 🔥 拖曳結束 (onDragEnd)
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;
		const sourceListId = board.lists.find((list) =>
			list.cards.some((c) => c.id === activeId),
		)?.id;
		const targetListId =
			board.lists.find((list) => list.cards.some((c) => c.id === overId))?.id ||
			overId;

		if (sourceListId && targetListId) {
			const targetIndex =
				board.lists
					.find((list) => list.id === targetListId)
					?.cards.findIndex((c) => c.id === overId) || 0;
			moveCard(
				sourceListId,
				targetListId as string,
				activeId as string,
				targetIndex,
			);
		}

		setDraggingCard(null); // 拖曳結束後清除狀態
	};

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null; // 只在 Client 端渲染

	return (
		<DndContext
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}>
			<div className="flex gap-4 p-4 bg-gray-600 min-h-screen">
				{board.lists.map((list) => (
					<div key={list.id}>
						<SortableContext items={list.cards}>
							<List list={list} />
						</SortableContext>
					</div>
				))}
				<DragOverlay dropAnimation={defaultDropAnimation}>
					{draggingCard ? (
						<SortableItem
							id={draggingCard}
							text={getDraggingCardText(draggingCard)}
						/>
					) : null}
				</DragOverlay>
			</div>
		</DndContext>
	);
};

export default Board;
