// src/components/SortableItem.jsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMove } from "react-icons/fi";

export default function SortableItem({ id, children, isSubmodule = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-4 cursor-grab active:cursor-grabbing ${
        isDragging ? "shadow-lg ring-2 ring-[#5d60ef]" : ""
      }`}
      {...attributes}
    >
      <div {...listeners} className="cursor-grab text-gray-400">
        <FiMove size={20} />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
