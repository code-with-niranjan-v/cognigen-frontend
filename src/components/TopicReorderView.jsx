// src/components/TopicReorderView.jsx
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { useState } from "react";

export default function TopicReorderView({ topics, onSave, onCancel }) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [items, setItems] = useState(topics);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      <h3 className="text-xl font-semibold mb-6">Rearrange Topics</h3>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 mb-8">
            {items.map((topic) => (
              <SortableItem key={topic.id} id={topic.id}>
                <div className="font-medium">{topic.name}</div>
                <div className="text-sm text-gray-600">
                  {topic.submodules?.length || 0} submodules
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(items)}
          className="px-8 py-3 bg-[#5d60ef] text-white rounded-lg hover:bg-[#4a4df2]"
        >
          Save Order
        </button>
      </div>
    </>
  );
}
