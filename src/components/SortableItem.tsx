'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
	id: string;
	text: string;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, text }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			className="bg-stone-300 p-2 rounded mb-2 cursor-pointer shadow-md"
			style={style}>
			{text}
		</div>
	);
};

export default SortableItem;
