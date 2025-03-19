'use client';
import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import useBoardStore from '@/store/board';
import List from './List';

const Board: React.FC = () => {
	const [isClient, setIsClient] = useState(false);
	const board = useBoardStore((state) => state.board);
	const moveCard = useBoardStore((state) => state.moveCard);

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
	};

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null; // 只在 Client 端渲染

	return (
		<DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
			<div className="flex gap-4 p-4 bg-gray-600 min-h-screen">
				{board.lists.map((list) => (
					<SortableContext key={list.id} items={list.cards}>
						<List list={list} />
					</SortableContext>
				))}
			</div>
		</DndContext>
	);
};

export default Board;
