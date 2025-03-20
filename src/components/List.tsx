'use client';
import { useDroppable } from '@dnd-kit/core';
import { List as ListType } from '@/types';
import SortableItem from './SortableItem';
import useBoardStore from '@/store/board';

interface ListProps {
	list: ListType;
}

const List: React.FC<ListProps> = ({ list }) => {
	const { addCard } = useBoardStore((state) => state);
	const { setNodeRef } = useDroppable({ id: list.id });

	return (
		<div className="bg-white p-4 shadow-lg rounded-lg w-72">
			<h2 className="font-bold text-lg mb-2">{list.name}</h2>
			<div ref={setNodeRef} className="min-h-12">
				{list.cards.map((card) => (
					<SortableItem key={card.id} id={card.id} name={card.name} />
				))}
			</div>
			<button
				className="w-full mt-2 bg-blue-500 text-white py-1 px-3 rounded cursor-pointer transition-opacity hover:opacity-90"
				onClick={() => addCard(list.id)}>
				+ 新增卡片
			</button>
		</div>
	);
};

export default List;
