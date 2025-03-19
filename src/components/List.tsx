'use client';
import { useDroppable } from '@dnd-kit/core';
import useBoardStore from '@/store/board';
import { List as ListType } from '@/types';
import SortableItem from './SortableItem';

interface ListProps {
	list: ListType;
}

const List: React.FC<ListProps> = ({ list }) => {
	const addCard = useBoardStore((state) => state.addCard);
	const { setNodeRef } = useDroppable({ id: list.id });

	return (
		<div ref={setNodeRef} className="bg-white p-4 shadow-lg rounded-lg w-72">
			<h2 className="font-bold text-lg mb-2">{list.name}</h2>
			{list.cards.map((card) => (
				<SortableItem key={card.id} id={card.id} text={card.text} />
			))}
			<button
				className="w-full mt-2 bg-blue-500 text-white py-1 px-3 rounded"
				onClick={() => addCard(list.id, `新卡片 ${list.cards.length + 1}`)}>
				+ 新增卡片
			</button>
		</div>
	);
};

export default List;
