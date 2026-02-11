// src/components/RearrangeModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { FiX, FiMove } from "react-icons/fi";
import SubmoduleReorderView from "./SubmoduleReorderView";
import TopicReorderView from "./TopicReorderView";
import SortableItem from "./SortableItem";
import toast from "react-hot-toast";
import api from "../api/instance";

export default function RearrangeModal({
  isOpen,
  onClose,
  path,
  onTopicsReordered,
  onSubmodulesReordered,
}) {
  const [mode, setMode] = useState(null); // null | "topics" | "submodules"
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setMode(null);
    setSelectedTopicId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-8 py-5 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Rearrange Content
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiX className="text-2xl text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-8 overflow-y-auto">
          {mode === null ? (
            // Choose mode
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setMode("topics")}
                className="p-8 border-2 border-gray-200 rounded-xl hover:border-[#5d60ef] hover:bg-[#5d60ef]/5 transition text-center"
              >
                <FiMove className="text-5xl text-[#5d60ef] mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Rearrange Topics</h3>
                <p className="text-gray-600 mt-2">
                  Change the order of main topics
                </p>
              </button>

              <button
                onClick={() => setMode("submodules")}
                className="p-8 border-2 border-gray-200 rounded-xl hover:border-[#5d60ef] hover:bg-[#5d60ef]/5 transition text-center"
              >
                <FiMove className="text-5xl text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Rearrange Submodules</h3>
                <p className="text-gray-600 mt-2">
                  Reorder lessons inside a topic
                </p>
              </button>
            </div>
          ) : mode === "topics" ? (
            <TopicReorderView
              topics={path.topics}
              onSave={(newOrder) => {
                api
                  .patch(`/learning-paths/${path._id}/reorder-topics`, {
                    orderedTopicIds: newOrder.map((t) => t.id),
                  })
                  .then((res) => {
                    onTopicsReordered(res.data.topics);
                    toast.success("Topics reordered");
                    handleClose();
                  })
                  .catch(() => toast.error("Failed to save order"));
              }}
              onCancel={handleClose}
            />
          ) : (
            <SubmoduleReorderView
              topics={path.topics}
              selectedTopicId={selectedTopicId}
              onSelectTopic={setSelectedTopicId}
              onSave={(topicId, newOrder) => {
                api
                  .patch(
                    `/learning-paths/${path._id}/topics/${topicId}/reorder-submodules`,
                    {
                      orderedSubmoduleIds: newOrder.map((s) => s.id),
                    },
                  )
                  .then((res) => {
                    onSubmodulesReordered(topicId, res.data.submodules);
                    toast.success("Submodules reordered");
                    handleClose();
                  })
                  .catch(() => toast.error("Failed to save order"));
              }}
              onCancel={handleClose}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
