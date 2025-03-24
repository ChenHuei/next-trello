'use client';
import { useEffect, useState } from 'react';
import {
	closestCorners,
	defaultDropAnimation,
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import useBoardStore from '@/store/board';
import List from './List';
import SortableItem from './SortableItem';
import { Card } from '@/types';

const Board = () => {
	const [isClient, setIsClient] = useState(false);
	const { board, draggingCard, setBoard, setDraggingCard } = useBoardStore(
		(state) => state,
	);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null;
	// console.log('leo', board);
	const handleDragStart = (event: DragStartEvent) => {
		const card = board.lists
			.map((list) => list.cards)
			.flat()
			.find((item) => item.id === event.active.id);

		setDraggingCard(card || null);
	};
	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		const activeListId = board.lists.find((list) =>
			list.cards.some((item) => item.id === active.id),
		)?.id;
		const overListId = board.lists.find((list) =>
			list.cards.some((item) => item.id === over?.id),
		)?.id;

		if (!activeListId || !overListId || activeListId === overListId) {
			return;
		}

		const card = board.lists
			.map((list) => list.cards)
			.flat()
			.find((item) => item.id === event.active.id);

		const overIndex = board.lists
			.filter((list) => list.id === over?.id)
			.findIndex((item) => item.id === over?.id);

		const newLists = board.lists.map((list) => {
			if (list.id === activeListId) {
				return {
					...list,
					cards: list.cards.filter((item) => item.id !== active.id),
				};
			}
			if (list.id === overListId) {
				return {
					...list,
					cards: [
						...list.cards.slice(0, overIndex),
						card as Card,
						...list.cards.slice(overIndex, list.cards.length),
					],
				};
			}
			return list;
		});
		setBoard({ lists: newLists });
	};

	const handleDragEnd = (event: DragEndEvent) => {
		console.log('leo handleDragEnd', event);
		const { active, over } = event;
		const activeListId = board.lists.find((list) =>
			list.cards.some((item) => item.id === active.id),
		)?.id;
		const overListId = board.lists.find((list) =>
			list.cards.some((item) => item.id === over?.id),
		)?.id;
		if (!activeListId || !overListId || activeListId !== overListId) {
			return;
		}

		const activeIndex =
			board.lists
				.find((list) => list.id === activeListId)
				?.cards.findIndex((item) => item.id === active.id) ?? -1;

		const overIndex =
			board.lists
				.find((list) => list.id === overListId)
				?.cards.findIndex((item) => item.id === over?.id) ?? -1;

		if (activeIndex > -1 && overIndex > -1 && activeIndex !== overIndex) {
			const newLists = board.lists.map((list) => {
				if (list.id === overListId) {
					return {
						...list,
						cards: arrayMove(list.cards, activeIndex, overIndex),
					};
				}
				return list;
			});
			setBoard({ lists: newLists });
		}
		setDraggingCard(null);
	};
	return (
		<DndContext
			sensors={sensors}
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
						<SortableItem id={draggingCard.id} name={draggingCard.name} />
					) : null}
				</DragOverlay>
			</div>
		</DndContext>
	);
};

export default Board;
