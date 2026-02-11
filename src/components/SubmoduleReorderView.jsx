// src/components/SubmoduleReorderView.jsx
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

export default function SubmoduleReorderView({
  topics,
  selectedTopicId,
  onSelectTopic,
  onSave,
  onCancel,
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);
  const [items, setItems] = useState(selectedTopic?.submodules || []);

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

  if (!selectedTopicId) {
    return (
      <>
        <h3 className="text-xl font-semibold mb-6">Select a Topic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                onSelectTopic(topic.id);
                setItems(topic.submodules || []);
              }}
              className="p-6 border rounded-xl hover:border-[#5d60ef] hover:bg-[#5d60ef]/5 transition text-left"
            >
              <h4 className="font-medium">{topic.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {topic.submodules?.length || 0} submodules
              </p>
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h3 className="text-xl font-semibold mb-2">{selectedTopic.name}</h3>
      <p className="text-gray-600 mb-6">Drag to reorder submodules</p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 mb-8">
            {items.map((sub) => (
              <SortableItem key={sub.id} id={sub.id} isSubmodule>
                <div className="font-medium">{sub.title}</div>
                <div className="text-sm text-gray-600">
                  {sub.summary
                    ? sub.summary.substring(0, 60) + "..."
                    : "No summary"}
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => onSelectTopic(null)}
          className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          Back to Topics
        </button>
        <button
          onClick={() => onSave(selectedTopicId, items)}
          className="px-8 py-3 bg-[#5d60ef] text-white rounded-lg hover:bg-[#4a4df2]"
        >
          Save Order
        </button>
      </div>
    </>
  );
}
