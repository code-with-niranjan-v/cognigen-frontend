import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiZap } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/instance";

export default function TopicCard({
  topic,
  pathId,
  onContentGenerated,
  loadingTopicId,
  setLoadingTopicId,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isGenerating = loadingTopicId === topic.id;

  const handleGenerateContent = async () => {
    if (isGenerating) return;

    setLoadingTopicId(topic.id);

    try {
      const payload = {
        submodules: topic.submodules.map((sm) => ({
          id: sm.id,
          title: sm.title,
          summary: sm.summary || "",
        })),
      };

      const res = await api.post(
        `/learning-paths/${pathId}/topics/${topic.id}/generate-content`,
        payload,
      );

      toast.success(`Content generated for "${topic.name}"!`, {
        duration: 4000,
      });

      onContentGenerated(res.data.updatedTopic);
    } catch (err) {
      const msg = err.response?.data?.message || "Content generation failed";
      toast.error(msg, { duration: 6000 });
      console.error(err);
    } finally {
      setLoadingTopicId(null);
    }
  };

  const progress =
    topic.submodules.length > 0
      ? Math.round((topic.completedSubmodules / topic.submodules.length) * 100)
      : 0;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {topic.name}
            </h3>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                topic.difficulty === "easy"
                  ? "bg-green-100 text-green-700"
                  : topic.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {topic.difficulty}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Est. time: {topic.estimated_time_hours || "?"} hour
            {topic.estimated_time_hours !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">
              {progress}% complete
            </div>
          </div>

          {isExpanded ? (
            <FiChevronUp className="text-gray-500 text-xl" />
          ) : (
            <FiChevronDown className="text-gray-500 text-xl" />
          )}
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t">
              {/* Generate button if not generated */}
              {!topic.contentGenerated && (
                <div className="mb-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateContent();
                    }}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      isGenerating
                        ? "bg-gray-300 text-gray-600 cursor-wait"
                        : "bg-[#5d60ef] hover:bg-[#4a4df2] text-white shadow-sm hover:shadow"
                    }`}
                  >
                    <FiZap className="text-lg" />
                    {isGenerating
                      ? "Generating..."
                      : "Generate Content for this Topic"}
                  </button>
                </div>
              )}

              {/* Submodules list */}
              <div className="space-y-4">
                {topic.submodules.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-start justify-between py-4 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{sub.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {sub.summary || "No summary available"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {sub.completed ? (
                        <span className="text-green-600 text-sm font-medium">
                          Completed
                        </span>
                      ) : sub.content && Object.keys(sub.content).length > 0 ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: open content viewer modal / page
                            toast("View content modal coming soon!");
                          }}
                          className="text-[#5d60ef] hover:text-[#4a4df2] font-medium"
                        >
                          View Content
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Optional: generate single submodule content
                            toast("Single submodule generation coming soon!");
                          }}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          Generate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
