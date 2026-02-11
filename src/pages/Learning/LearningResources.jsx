// src/pages/Learning/LearningResources.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProCard from "../../components/ui/ProCard";
import ProgressCircle from "../../components/ui/ProgressCircle";
import AnimatedRobot from "../../components/AnimatedRobot";
import LearningHeader from "../../components/LearningHeader";
import GeneratePathModal from "./components/GeneratePathModal";
import { FiZap, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/instance";

const loadingMessages = [
  "Crafting your personalized learning journey...",
  "Analyzing your goals and experience level...",
  "Building the perfect roadmap just for you...",
  "Almost there — AI is working its magic...",
  "Your path to mastery is taking shape...",
  "Finalizing topics tailored to your schedule...",
];

/* ---------------- DELETE MODAL ---------------- */

function DeleteConfirmModal({ isOpen, onClose, onConfirm, pathTitle }) {
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const confirmed = input.trim().toLowerCase() === "delete";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-red-700 mb-4">
          Delete Learning Path
        </h2>

        <p className="text-gray-700 mb-6">
          This action cannot be undone.
          <br />
          To delete <strong>"{pathTitle}"</strong>,<br />
          type <strong>delete</strong> below:
        </p>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type 'delete' to confirm"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-red-500 outline-none mb-6"
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={!confirmed}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              confirmed
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ----------------------------------------------------- */

export default function LearningResources() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [backgroundMode, setBackgroundMode] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pathToDelete, setPathToDelete] = useState(null);

  const hasDraft = paths.some((p) => p.status === "draft");

  /* ---------------- Load Paths ---------------- */

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const res = await api.get("/learning-paths");
        setPaths(res.data || []);
      } catch (err) {
        toast.error("Could not load your learning paths");
      } finally {
        setLoading(false);
      }
    };

    fetchPaths();
  }, []);

  /* ---------------- Loading Messages Rotator ---------------- */

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  /* ---------------- Delete Confirm ---------------- */

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/learning-paths/${pathToDelete._id}`);
      setPaths((prev) => prev.filter((p) => p._id !== pathToDelete._id));
      toast.success("Learning path deleted");
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setShowDeleteModal(false);
      setPathToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /* ---------------- Loading State ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5d60ef]" />
        <p className="ml-4 text-lg font-medium text-gray-700">Loading...</p>
      </div>
    );
  }

  /* ---------------- Main UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <LearningHeader title="Learning Resources" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 pb-16">
        {/* CTA Card */}
        <ProCard className="mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Level Up?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Generate a personalized learning path tailored to your goals,
                experience level, and available time.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (hasDraft || isGenerating || backgroundMode) {
                  toast.error("A path is already being generated.");
                  return;
                }
                setShowModal(true);
              }}
              className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-10 py-6 
                          rounded-xl font-bold shadow-md transition-all min-w-[280px] text-white 
                ${
                  hasDraft || isGenerating || backgroundMode
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#5d60ef] hover:bg-[#4a4df2]"
                }`}
            >
              <AnimatedRobot size={64} />
              <span className="text-xl">
                {hasDraft || backgroundMode
                  ? "Generating..."
                  : "Generate New Path"}
              </span>
            </motion.button>
          </div>
        </ProCard>

        {/* ---------------- Learning Paths Grid ---------------- */}

        {paths.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="text-7xl mb-6">🌌</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              No Learning Paths Yet
            </h3>
            <p className="text-gray-600 text-lg mb-10 max-w-lg mx-auto">
              Start your journey by creating your first AI-personalized learning
              path.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="px-10 py-5 rounded-xl font-bold shadow-md transition text-white 
                         bg-[#5d60ef] hover:bg-[#4a4df2]"
            >
              Create Your First Path →
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {paths.map((path) => (
              <ProCard
                key={path._id}
                onClick={() => navigate(`/learning-resources/${path._id}`)}
                className="cursor-pointer group hover:border-[#5d60ef]/30 transition-colors relative"
              >
                {/* DELETE BUTTON (top-right floating) */}
                <div className="absolute top-4 right-4 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPathToDelete(path);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition 
             opacity-0 group-hover:opacity-100"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>

                <div className="flex justify-between items-start mb-5 pr-12">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#5d60ef]">
                      {path.title || `${path.courseName} Path`}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {path.courseName} •{" "}
                      {path.experienceLevel
                        ? path.experienceLevel.charAt(0).toUpperCase() +
                          path.experienceLevel.slice(1)
                        : ""}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      path.status === "active"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : path.status === "completed"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-200 animate-pulse"
                    }`}
                  >
                    {path.status === "draft" ? "Generating..." : path.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <ProgressCircle
                    percentage={path.overallProgress || 0}
                    size={90}
                  />
                  <p className="text-sm text-gray-500">
                    Updated {formatDate(path.updatedAt)}
                  </p>
                </div>
              </ProCard>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- Generate Path Modal ---------------- */}

      <GeneratePathModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onGenerateStart={() => setIsGenerating(true)}
        onSuccess={(newPath) => {
          setPaths((prev) => [{ ...newPath, status: "draft" }, ...prev]);
          setIsGenerating(false);
          toast.success("Path created! Redirecting...");
          setTimeout(() => {
            navigate(`/learning-resources/${newPath._id}`);
          }, 1500);
        }}
      />

      {/* ---------------- Delete Confirmation Modal ---------------- */}

      <DeleteConfirmModal
        key={pathToDelete?._id ?? "default"}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPathToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        pathTitle={
          pathToDelete?.title ||
          pathToDelete?.courseName ||
          "this learning path"
        }
      />

      {/* ---------------- Generating Overlay ---------------- */}

      <AnimatePresence>
        {isGenerating && !backgroundMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center
              bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
          >
            <div className="relative mb-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-4 border-[#5d60ef]/30 border-t-[#5d60ef] rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <FiZap className="text-5xl text-[#5d60ef] drop-shadow-lg" />
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6 }}
                className="text-2xl font-semibold text-gray-800 text-center max-w-xl px-6 mb-4"
              >
                {loadingMessages[messageIndex]}
              </motion.p>
            </AnimatePresence>

            <p className="text-base text-gray-600 mt-2 mb-8">
              This may take 30–90 seconds depending on complexity...
            </p>

            <button
              onClick={() => {
                toast("Generation continues in background", { icon: "⚡" });
                setBackgroundMode(true);
              }}
              className="px-6 py-3 bg-white text-[#5d60ef] font-semibold shadow-md rounded-lg
                border border-[#5d60ef]/40 hover:bg-gray-50 transition"
            >
              Continue in Background
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
