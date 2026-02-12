import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiZap, FiBookOpen } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/instance";
import { useNavigate } from "react-router-dom";

export default function TopicCard({
  topic,
  pathId,
  onContentGenerated,
  loadingTopicId,
  setLoadingTopicId,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const isGenerating = loadingTopicId === topic.id;

  const handleGenerateContent = async (e) => {
    e.stopPropagation();
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

      onContentGenerated(res.data.topic);
    } catch (err) {
      const msg = err.response?.data?.message || "Content generation failed";
      toast.error(msg, { duration: 6000 });
      console.error(err);
    } finally {
      setLoadingTopicId(null);
    }
  };

  const handleOpenNotebook = (e) => {
    e.stopPropagation();
    navigate(`/learning-resources/${pathId}/notebook/${topic.id}`);
  };

  const progress =
    topic.submodules.length > 0
      ? Math.round((topic.completedSubmodules / topic.submodules.length) * 100)
      : 0;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
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
            Est. time: {topic.estimatedTimeMinutes || "?"} min
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
              <div className="mb-6 flex flex-wrap gap-4">
                {!topic.contentGenerated ? (
                  <button
                    onClick={handleGenerateContent}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      isGenerating
                        ? "bg-gray-300 text-gray-600 cursor-wait"
                        : "bg-[#5d60ef] hover:bg-[#4a4df2] text-white shadow-sm hover:shadow"
                    }`}
                  >
                    <FiZap className="text-lg" />
                    {isGenerating ? "Generating..." : "Generate Content"}
                  </button>
                ) : (
                  <button
                    onClick={handleOpenNotebook}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all"
                  >
                    <FiBookOpen className="text-lg" />
                    Open Notebook
                  </button>
                )}
              </div>

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
                      {sub.cells?.length > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          Content ready ({sub.cells.length} cells)
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {sub.completed ? (
                        <span className="text-green-600 text-sm font-medium">
                          Completed
                        </span>
                      ) : null}
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
