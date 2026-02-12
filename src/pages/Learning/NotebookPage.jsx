// src/pages/Learning/NotebookPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiZap,
  FiLoader,
  FiCheckCircle,
  FiTrash2,
  FiPlus,
  FiEdit3,
  FiSave,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import NotebookCell from "../../components/learning/NotebookCell";
import QuizCard from "../../components/learning/QuizCard";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import { generateMiniQuiz, markSubmoduleComplete } from "../../api/learningApi";
import api from "../../api/instance";

export default function NotebookPage() {
  const { pathId, topicId } = useParams();
  const navigate = useNavigate();

  const [path, setPath] = useState(null);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [markingComplete, setMarkingComplete] = useState({});
  const [showDeleteQuizModal, setShowDeleteQuizModal] = useState(false);
  const [editingCellIndex, setEditingCellIndex] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [showDeleteCellModal, setShowDeleteCellModal] = useState(false);
  const [cellToDeleteIndex, setCellToDeleteIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/learning-paths/${pathId}`);
        setPath(res.data);
        const foundTopic = res.data.topics.find((t) => t.id === topicId);
        if (!foundTopic) throw new Error("Topic not found");
        setTopic(foundTopic);
        if (foundTopic.submodules?.length > 0 && !selectedSubId) {
          setSelectedSubId(foundTopic.submodules[0].id);
        }
      } catch (err) {
        setError(err.message || "Failed to load notebook");
        toast.error("Could not load notebook");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathId, topicId]);

  const currentSub = useMemo(() => {
    if (!topic || !selectedSubId) return null;
    return topic.submodules?.find((s) => s.id === selectedSubId) || null;
  }, [topic, selectedSubId]);

  const handleAddCell = async (afterIndex = -1) => {
    if (!currentSub) return;

    const newCell = {
      type: "markdown",
      content: "# New cell\nStart typing here...",
    };

    try {
      let newCells = [...currentSub.cells];
      if (afterIndex >= 0) {
        newCells.splice(afterIndex + 1, 0, newCell);
      } else {
        newCells.push(newCell);
      }

      setTopic((prev) => ({
        ...prev,
        submodules: prev.submodules.map((s) =>
          s.id === currentSub.id ? { ...s, cells: newCells } : s,
        ),
      }));

      await api.post(
        `/learning-paths/${pathId}/topics/${topicId}/submodules/${currentSub.id}/cells`,
        newCell,
      );

      toast.success("Cell added");
    } catch (err) {
      toast.error("Failed to add cell");
    }
  };

  const handleEditCell = (index) => {
    if (!currentSub) return;
    const cell = currentSub.cells[index];
    if (cell.type === "resource") return;

    setEditingCellIndex(index);
    setEditingContent(cell.content || "");
  };

  const handleSaveCell = async () => {
    if (editingCellIndex === null || !currentSub) return;

    try {
      const newCells = [...currentSub.cells];
      newCells[editingCellIndex] = {
        ...newCells[editingCellIndex],
        content: editingContent,
      };

      setTopic((prev) => ({
        ...prev,
        submodules: prev.submodules.map((s) =>
          s.id === currentSub.id ? { ...s, cells: newCells } : s,
        ),
      }));

      await api.patch(
        `/learning-paths/${pathId}/topics/${topicId}/submodules/${currentSub.id}/cells/${editingCellIndex}`,
        { content: editingContent },
      );

      toast.success("Cell saved");
    } catch (err) {
      toast.error("Failed to save cell");
    } finally {
      setEditingCellIndex(null);
      setEditingContent("");
    }
  };

  const handleDeleteCellConfirm = (index) => {
    if (!currentSub) return;
    const cell = currentSub.cells[index];
    if (cell.type === "resource") {
      toast.error("Resource cells cannot be deleted");
      return;
    }

    setCellToDeleteIndex(index);
    setShowDeleteCellModal(true);
  };

  const confirmDeleteCell = async () => {
    if (cellToDeleteIndex === null || !currentSub) return;

    try {
      const newCells = currentSub.cells.filter(
        (_, i) => i !== cellToDeleteIndex,
      );

      setTopic((prev) => ({
        ...prev,
        submodules: prev.submodules.map((s) =>
          s.id === currentSub.id ? { ...s, cells: newCells } : s,
        ),
      }));

      await api.delete(
        `/learning-paths/${pathId}/topics/${topicId}/submodules/${currentSub.id}/cells/${cellToDeleteIndex}`,
      );

      toast.success("Cell deleted");
    } catch (err) {
      toast.error("Failed to delete cell");
    } finally {
      setShowDeleteCellModal(false);
      setCellToDeleteIndex(null);
    }
  };

  // ─── OTHER HANDLERS ──────────────────────────────────────────────────

  const handleGenerateQuiz = async () => {
    if (!currentSub || quizLoading) return;
    setQuizLoading(true);
    try {
      const res = await generateMiniQuiz(pathId, topicId, currentSub.id);
      setTopic((prev) => ({
        ...prev,
        submodules: prev.submodules.map((s) =>
          s.id === currentSub.id ? { ...s, miniQuiz: res.miniQuiz } : s,
        ),
      }));
      toast.success("Quiz generated!");
    } catch (err) {
      toast.error(err.message || "Failed to generate quiz");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleDeleteAndRegenerateQuiz = () => setShowDeleteQuizModal(true);

  const confirmDeleteQuiz = () => {
    if (!currentSub) return;
    try {
      setTopic((prev) => ({
        ...prev,
        submodules: prev.submodules.map((s) =>
          s.id === currentSub.id ? { ...s, miniQuiz: [] } : s,
        ),
      }));
      toast.success("Quiz deleted");
      setShowDeleteQuizModal(false);

      toast(
        (t) => (
          <span>
            Quiz deleted.{" "}
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleGenerateQuiz();
              }}
              className="underline font-medium ml-2 text-[#5d60ef] hover:text-[#4a4df2]"
            >
              Generate new one?
            </button>
          </span>
        ),
        { duration: 10000 },
      );
    } catch (err) {
      toast.error("Failed to clear quiz");
    }
  };

  const handleMarkComplete = async () => {
    if (!currentSub || markingComplete[currentSub.id]) return;

    setMarkingComplete((prev) => ({ ...prev, [currentSub.id]: true }));

    try {
      const updatedPath = await markSubmoduleComplete(
        pathId,
        topicId,
        currentSub.id,
      );
      setPath(updatedPath);
      const updatedTopic = updatedPath.topics.find((t) => t.id === topicId);
      setTopic(updatedTopic);
      toast.success("Submodule marked as completed!");
    } catch (err) {
      toast.error(err.message || "Failed to mark complete");
    } finally {
      setMarkingComplete((prev) => ({ ...prev, [currentSub.id]: false }));
    }
  };

  const handleBack = () => navigate(`/learning-resources/${pathId}`);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="w-12 h-12 text-[#5d60ef] animate-spin" />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-[#5d60ef] text-white rounded-lg"
        >
          Back to Path
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 sticky top-0 bg-white z-10 border-b">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-700 hover:text-[#5d60ef] mb-6"
          >
            <FiArrowLeft /> Back to Path
          </button>
          <h2 className="text-xl font-bold">{topic.name}</h2>
        </div>

        <div className="p-4 space-y-2">
          {topic.submodules.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubId(sub.id)}
              className={`w-full text-left p-4 rounded-lg transition-all flex justify-between items-center ${
                selectedSubId === sub.id
                  ? "bg-[#5d60ef]/10 border border-[#5d60ef] shadow-sm"
                  : "hover:bg-gray-100 border border-transparent"
              }`}
            >
              <div>
                <div className="font-medium text-gray-900">{sub.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {sub.summary?.slice(0, 60) || "No description"}
                </div>
              </div>
              {sub.completed && (
                <FiCheckCircle className="text-green-500 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {currentSub ? (
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">
                {currentSub.title}
              </h1>

              <div className="flex items-center gap-4">
                {currentSub.completed ? (
                  <span className="bg-green-100 text-green-700 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2">
                    <FiCheckCircle /> Completed
                  </span>
                ) : (
                  <button
                    onClick={handleMarkComplete}
                    disabled={markingComplete[currentSub.id]}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                      markingComplete[currentSub.id]
                        ? "bg-gray-300 cursor-wait text-gray-700"
                        : "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                    }`}
                  >
                    <FiCheckCircle />
                    {markingComplete[currentSub.id]
                      ? "Marking..."
                      : "Mark as Completed"}
                  </button>
                )}
              </div>
            </div>

            {currentSub.summary && (
              <p className="text-gray-600 mb-10 leading-relaxed">
                {currentSub.summary}
              </p>
            )}

            {/* Cells */}
            <div className="space-y-10 mb-16">
              {currentSub.cells?.length > 0 ? (
                currentSub.cells.map((cell, idx) => (
                  <div key={cell._id || idx} className="relative group">
                    <div className="bg-white rounded-3xl shadow-sm p-10 transition hover:shadow-md border border-gray-100">
                      {/* Controls – only for non-resource cells */}
                      {cell.type !== "resource" && (
                        <div className="absolute -right-14 top-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={() => handleEditCell(idx)}
                            className="p-2.5 bg-white rounded-full shadow hover:bg-blue-50 text-blue-600"
                            title="Edit cell"
                          >
                            <FiEdit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteCellConfirm(idx)}
                            className="p-2.5 bg-white rounded-full shadow hover:bg-red-50 text-red-600"
                            title="Delete cell"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      )}

                      {/* Add cell above – only for non-resource */}
                      {cell.type !== "resource" && (
                        <button
                          onClick={() => handleAddCell(idx - 1)}
                          className="absolute -left-14 top-1/2 -translate-y-1/2 p-2.5 bg-white rounded-full shadow hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          title="Add cell above"
                        >
                          <FiPlus size={18} />
                        </button>
                      )}

                      {editingCellIndex === idx && cell.type !== "resource" ? (
                        <div className="relative">
                          <textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="w-full h-64 p-6 border border-gray-300 rounded-2xl font-mono text-base focus:outline-none focus:ring-2 focus:ring-[#5d60ef] resize-y"
                            autoFocus
                          />
                          <div className="flex justify-end gap-4 mt-4">
                            <button
                              onClick={() => {
                                setEditingCellIndex(null);
                                setEditingContent("");
                              }}
                              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                            >
                              <FiX size={18} />
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveCell}
                              className="px-8 py-2.5 bg-[#5d60ef] hover:bg-[#4a4df2] text-white rounded-lg font-medium transition flex items-center gap-2"
                            >
                              <FiSave size={18} />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <NotebookCell cell={cell} />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
                  <p className="text-gray-500 text-lg mb-6">
                    No cells yet. Start building your notebook!
                  </p>
                  <button
                    onClick={() => handleAddCell()}
                    className="px-8 py-3.5 bg-[#5d60ef] hover:bg-[#4a4df2] text-white rounded-xl shadow-md transition flex items-center gap-2 mx-auto"
                  >
                    <FiPlus size={20} />
                    Add First Cell
                  </button>
                </div>
              )}
            </div>

            {/* Add cell at bottom */}
            {currentSub.cells?.length > 0 && (
              <div className="flex justify-center my-12">
                <button
                  onClick={() => handleAddCell()}
                  className="flex items-center gap-2 px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl shadow-sm transition font-medium"
                >
                  <FiPlus size={20} />
                  Add Cell
                </button>
              </div>
            )}

            {/* Quiz Section */}
            <div className="max-w-4xl mx-auto pt-12 border-t">
              {currentSub.miniQuiz?.length > 0 ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Practice Quiz</h2>
                    <button
                      onClick={handleDeleteAndRegenerateQuiz}
                      className="flex items-center gap-2 px-5 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium border border-red-200 hover:border-red-300"
                    >
                      <FiTrash2 size={16} />
                      Delete & Regenerate
                    </button>
                  </div>

                  <QuizCard questions={currentSub.miniQuiz} />
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">
                    Ready to test yourself?
                  </h3>
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={quizLoading}
                    className={`px-10 py-4 rounded-xl font-semibold text-white transition-all shadow-md ${
                      quizLoading
                        ? "bg-gray-400 cursor-wait"
                        : "bg-[#5d60ef] hover:bg-[#4a4df2]"
                    }`}
                  >
                    {quizLoading ? (
                      <span className="flex items-center gap-2">
                        <FiLoader className="animate-spin" /> Generating...
                      </span>
                    ) : (
                      <>
                        <FiZap className="inline mr-2" />
                        Generate Quiz
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-32 text-gray-500">
            Select a submodule from the sidebar to begin
          </div>
        )}
      </main>

      {/* Quiz Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteQuizModal}
        onClose={() => setShowDeleteQuizModal(false)}
        onConfirm={confirmDeleteQuiz}
        itemName="this quiz"
      />

      {/* Cell Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteCellModal}
        onClose={() => {
          setShowDeleteCellModal(false);
          setCellToDeleteIndex(null);
        }}
        onConfirm={confirmDeleteCell}
        itemName="this cell"
      />
    </div>
  );
}
