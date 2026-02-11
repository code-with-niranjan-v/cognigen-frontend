import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import LearningHeader from "../../components/LearningHeader";
import TopicCard from "../../components/TopicCard";
import PathEditModal from "../../components/PathEditModal";
import RearrangeModal from "../../components/RearrangeModal";
import toast from "react-hot-toast";
import api from "../../api/instance";
import { FiEdit2, FiMove, FiPlus } from "react-icons/fi";

export default function LearningPathDetail() {
  const { pathId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingTopicId, setLoadingTopicId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRearrangeModal, setShowRearrangeModal] = useState(false);

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const res = await api.get(`/learning-paths/${pathId}`);
        setPath(res.data);
      } catch (err) {
        console.error(err);
        const msg =
          err.response?.data?.message || "Failed to load learning path";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, [pathId]);

  const handleContentGenerated = (updatedTopic) => {
    setPath((prev) => {
      if (!prev) return prev;
      const newTopics = prev.topics.map((t) =>
        t.id === updatedTopic.id ? updatedTopic : t,
      );
      return { ...prev, topics: newTopics };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#5d60ef]/30 border-t-[#5d60ef] rounded-full"
        />
        <p className="mt-6 text-lg text-gray-700">
          Loading your learning path...
        </p>
      </div>
    );
  }

  if (error || !path) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">{error || "Path not found"}</p>
        <button
          onClick={() => navigate("/learning-resources")}
          className="px-6 py-3 bg-[#5d60ef] text-white rounded-lg hover:bg-[#4a4df2]"
        >
          Back to Learning Resources
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LearningHeader title={path.title || `${path.courseName} Path`} />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Overview Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10">
            {/* Left: Title + Description + Buttons */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {path.title || `${path.courseName} Path`}
              </h1>

              <p className="text-gray-600 mb-6 leading-relaxed max-w-3xl">
                {path.description ||
                  `Personalized ${path.courseName} learning path for ${path.experienceLevel} level – focused on ${path.goal.toLowerCase()}.`}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm"
                >
                  <FiEdit2 size={16} />
                  Edit Path
                </button>

                <button
                  onClick={() => {
                    if (!path.topics || path.topics.length < 2) {
                      toast.error("Add at least two topic before rearranging!");
                      return;
                    }
                    setShowRearrangeModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition shadow-sm"
                >
                  <FiMove size={16} />
                  Rearrange
                </button>
              </div>
            </div>

            {/* Right: Progress & Status */}
            <div className="flex flex-col items-center lg:items-end gap-4 min-w-[180px]">
              <div className="text-center lg:text-right">
                <div className="text-sm text-gray-500 mb-1">
                  Overall Progress
                </div>
                <div className="text-4xl md:text-5xl font-bold text-[#5d60ef]">
                  {Math.round(path.progress?.percentage || 0)}%
                </div>
              </div>

              <span
                className={`inline-flex px-5 py-1.5 rounded-full text-sm font-medium uppercase tracking-wide ${
                  path.status === "active"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : path.status === "completed"
                      ? "bg-purple-100 text-purple-700 border border-purple-200"
                      : "bg-yellow-100 text-yellow-700 border border-yellow-200 animate-pulse"
                }`}
              >
                {path.status === "draft"
                  ? "Generating..."
                  : path.status.charAt(0).toUpperCase() + path.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#5d60ef]"
              initial={{ width: 0 }}
              animate={{ width: `${path.progress?.percentage || 0}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Topics Section */}
        {path.topics.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              No Topics Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              This learning path is empty. Add your first topic to get started!
            </p>

            {/* Add New Topic Button when no topics */}
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#5d60ef] hover:bg-[#4a4df2] text-white font-semibold rounded-xl shadow-md transition transform hover:scale-105"
            >
              <FiPlus size={20} />
              Add Your First Topic
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {path.topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                pathId={pathId}
                onContentGenerated={handleContentGenerated}
                loadingTopicId={loadingTopicId}
                setLoadingTopicId={setLoadingTopicId}
              />
            ))}
          </div>
        )}
      </div>

      <PathEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        path={path}
        onPathUpdated={(updatedPath) => setPath(updatedPath)}
        onTopicAdded={(newTopic) => {
          setPath((prev) => ({
            ...prev,
            topics: [...prev.topics, newTopic],
          }));
        }}
        onTopicUpdated={(updatedTopic) => {
          setPath((prev) => ({
            ...prev,
            topics: prev.topics.map((t) =>
              t.id === updatedTopic.id ? updatedTopic : t,
            ),
          }));
        }}
        onTopicDeleted={(topicId) => {
          setPath((prev) => ({
            ...prev,
            topics: prev.topics.filter((t) => t.id !== topicId),
          }));
        }}
      />

      <RearrangeModal
        isOpen={showRearrangeModal}
        onClose={() => setShowRearrangeModal(false)}
        path={path}
        onTopicsReordered={(newOrder) => {
          setPath((prev) => ({ ...prev, topics: newOrder }));
        }}
        onSubmodulesReordered={(topicId, newOrder) => {
          setPath((prev) => ({
            ...prev,
            topics: prev.topics.map((t) =>
              t.id === topicId ? { ...t, submodules: newOrder } : t,
            ),
          }));
        }}
      />
    </div>
  );
}
