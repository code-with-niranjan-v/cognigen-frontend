// src/components/PathEditModal.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiX, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/instance";

function SubmoduleDeleteConfirm({ isOpen, onClose, onConfirm, subTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
      >
        <h2 className="text-xl font-bold text-red-700 mb-4">
          Delete Submodule?
        </h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete <strong>"{subTitle}"</strong>?<br />
          This cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PathEditModal({
  isOpen,
  onClose,
  path,
  onPathUpdated,
  onTopicAdded,
  onTopicUpdated,
  onTopicDeleted,
}) {
  const [activeTab, setActiveTab] = useState("path");
  const [title, setTitle] = useState("");

  // Topic form states
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicName, setTopicName] = useState("");
  const [topicDifficulty, setTopicDifficulty] = useState("medium");
  const [topicEstTime, setTopicEstTime] = useState(60);
  const [submodules, setSubmodules] = useState([]);

  // New submodule input
  const [newSubTitle, setNewSubTitle] = useState("");
  const [newSubSummary, setNewSubSummary] = useState("");

  // Submodule inline edit
  const [editingSubmoduleId, setEditingSubmoduleId] = useState(null);
  const [editSubTitle, setEditSubTitle] = useState("");
  const [editSubSummary, setEditSubSummary] = useState("");

  // Delete confirmation
  const [showSubDeleteModal, setShowSubDeleteModal] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);

  const formRef = useRef(null);

  // Reset form when modal opens or path changes
  useEffect(() => {
    if (isOpen && path) {
      setTitle(path.title || "");
      setActiveTab("path");
      setShowTopicForm(false);
      setEditingTopic(null);
      setTopicName("");
      setTopicDifficulty("medium");
      setTopicEstTime(60);
      setSubmodules([]);
      setNewSubTitle("");
      setNewSubSummary("");
      setEditingSubmoduleId(null);
      setEditSubTitle("");
      setEditSubSummary("");
      setShowSubDeleteModal(false);
      setSubToDelete(null);
    }
  }, [isOpen, path]);

  // Auto-scroll to form
  useEffect(() => {
    if (showTopicForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showTopicForm]);

  if (!isOpen || !path) return null;

  const handleSavePath = async () => {
    if (!title.trim()) return toast.error("Title is required");

    try {
      const res = await api.patch(`/learning-paths/${path._id}`, {
        title: title.trim(),
      });
      onPathUpdated(res.data);
      toast.success("Path title updated");
      onClose();
    } catch (err) {
      toast.error("Failed to update path");
    }
  };

  const addSubmoduleToForm = () => {
    if (!newSubTitle.trim()) return toast.error("Submodule title required");

    setSubmodules((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: newSubTitle.trim(),
        summary: newSubSummary.trim(),
        content: {},
        completed: false,
      },
    ]);

    setNewSubTitle("");
    setNewSubSummary("");
  };

  const removeSubmoduleFromForm = (subId) => {
    setSubmodules((prev) => {
      const afterRemove = prev.filter((s) => s.id !== subId);

      // Only auto-add default if this was the LAST submodule and not in edit mode
      if (afterRemove.length === 0 && editingSubmoduleId === null) {
        toast("Last submodule removed — added default one");
        return [
          {
            id: crypto.randomUUID(),
            title: topicName.trim() || "Default Submodule",
            summary: `Default submodule for "${topicName.trim() || "Topic"}"`,
            content: {},
            completed: false,
          },
        ];
      }

      return afterRemove;
    });
  };

  const startEditSubmodule = (sub) => {
    setEditingSubmoduleId(sub.id);
    setEditSubTitle(sub.title);
    setEditSubSummary(sub.summary || "");
  };

  const saveEditedSubmodule = () => {
    if (!editSubTitle.trim()) return toast.error("Submodule title required");

    setSubmodules((prev) =>
      prev.map((s) =>
        s.id === editingSubmoduleId
          ? { ...s, title: editSubTitle.trim(), summary: editSubSummary.trim() }
          : s,
      ),
    );

    setEditingSubmoduleId(null);
    setEditSubTitle("");
    setEditSubSummary("");
    toast.success("Submodule updated");
  };

  const cancelEditSubmodule = () => {
    setEditingSubmoduleId(null);
    setEditSubTitle("");
    setEditSubSummary("");
  };

  const handleSaveTopic = async () => {
    if (!topicName.trim()) return toast.error("Topic name required");

    let finalSubmodules = [...submodules];

    // Ensure at least one submodule
    if (finalSubmodules.length === 0) {
      finalSubmodules = [
        {
          id: crypto.randomUUID(),
          title: topicName.trim(),
          summary: `Default submodule for "${topicName.trim()}"`,
          content: {},
          completed: false,
        },
      ];
      toast("No submodules — added default one");
    }

    try {
      const payload = {
        name: topicName.trim(),
        difficulty: topicDifficulty,
        estimatedTimeMinutes: Number(topicEstTime) || 60,
        submodules: finalSubmodules,
      };

      let res;
      if (editingTopic) {
        res = await api.patch(
          `/learning-paths/${path._id}/topics/${editingTopic.id}`,
          payload,
        );
        onTopicUpdated(res.data);
        toast.success("Topic & submodules updated");
      } else {
        res = await api.post(`/learning-paths/${path._id}/topics`, payload);
        onTopicAdded(res.data);
        toast.success("Topic & submodules added");
      }

      // Reset
      setTopicName("");
      setTopicDifficulty("medium");
      setTopicEstTime(60);
      setSubmodules([]);
      setNewSubTitle("");
      setNewSubSummary("");
      setEditingSubmoduleId(null);
      setShowTopicForm(false);
      setEditingTopic(null);
    } catch (err) {
      toast.error("Failed to save topic");
      console.error(err);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    setShowSubDeleteModal(true);
    setSubToDelete({ type: "topic", id: topicId });
  };

  const confirmDelete = async () => {
    if (!subToDelete) return;

    try {
      if (subToDelete.type === "topic") {
        await api.delete(
          `/learning-paths/${path._id}/topics/${subToDelete.id}`,
        );
        onTopicDeleted(subToDelete.id);
        toast.success("Topic deleted");
      } else if (subToDelete.type === "submodule") {
        removeSubmoduleFromForm(subToDelete.id);
        toast.success("Submodule removed");
      }
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setShowSubDeleteModal(false);
      setSubToDelete(null);
    }
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setTopicName(topic.name);
    setTopicDifficulty(topic.difficulty || "medium");
    setTopicEstTime(topic.estimatedTimeMinutes || 60);
    setSubmodules(topic.submodules || []);
    setShowTopicForm(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-8 py-5 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Learning Path
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FiX className="text-2xl text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b px-8">
            <button
              onClick={() => setActiveTab("path")}
              className={`py-4 px-6 font-medium ${
                activeTab === "path"
                  ? "border-b-2 border-[#5d60ef] text-[#5d60ef]"
                  : "text-gray-600"
              }`}
            >
              Path Info
            </button>
            <button
              onClick={() => setActiveTab("topics")}
              className={`py-4 px-6 font-medium ${
                activeTab === "topics"
                  ? "border-b-2 border-[#5d60ef] text-[#5d60ef]"
                  : "text-gray-600"
              }`}
            >
              Manage Topics
            </button>
          </div>

          <div className="p-8">
            {activeTab === "path" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#5d60ef]"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSavePath}
                    disabled={!title.trim()}
                    className={`px-8 py-3 rounded-lg text-white ${
                      title.trim() ? "bg-[#5d60ef]" : "bg-gray-400"
                    }`}
                  >
                    Save Title
                  </button>
                </div>
              </div>
            )}

            {activeTab === "topics" && (
              <div className="space-y-8">
                {!showTopicForm && (
                  <button
                    onClick={() => {
                      setEditingTopic(null);
                      setTopicName("");
                      setTopicDifficulty("medium");
                      setTopicEstTime(60);
                      setSubmodules([]);
                      setShowTopicForm(true);
                    }}
                    className="w-full py-4 bg-[#5d60ef]/10 border-2 border-dashed border-[#5d60ef]/40 rounded-lg text-[#5d60ef] font-semibold hover:bg-[#5d60ef]/20 flex items-center justify-center gap-2"
                  >
                    <FiPlus /> Add New Topic
                  </button>
                )}

                <div className="space-y-3">
                  {path.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-4 bg-gray-50 rounded-lg border flex justify-between"
                    >
                      <div>
                        <h4 className="font-medium">{topic.name}</h4>
                        <p className="text-sm text-gray-600">
                          {topic.difficulty} •{" "}
                          {topic.estimatedTimeMinutes || "?"} min •{" "}
                          {topic.submodules?.length || 0} submodules
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <FiEdit2
                          className="text-blue-600 cursor-pointer"
                          onClick={() => handleEditTopic(topic)}
                        />
                        <FiTrash2
                          className="text-red-600 cursor-pointer"
                          onClick={() => handleDeleteTopic(topic.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {showTopicForm && (
                  <div ref={formRef} className="p-6 border rounded-xl bg-white">
                    <h3 className="text-lg font-semibold mb-5">
                      {editingTopic ? "Edit Topic" : "Add New Topic"}
                    </h3>

                    <div className="space-y-6">
                      <input
                        value={topicName}
                        onChange={(e) => setTopicName(e.target.value)}
                        placeholder="Topic Name *"
                        className="w-full px-4 py-3 border rounded-lg"
                      />
                      <select
                        value={topicDifficulty}
                        onChange={(e) => setTopicDifficulty(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                      <input
                        type="number"
                        value={topicEstTime}
                        onChange={(e) => setTopicEstTime(e.target.value)}
                        placeholder="Est. Time (min)"
                        className="w-full px-4 py-3 border rounded-lg"
                      />

                      {/* Submodules */}
                      <div className="border-t pt-6">
                        <h4 className="font-semibold mb-4">Submodules</h4>

                        {submodules.map((sub) => (
                          <div
                            key={sub.id}
                            className={`flex justify-between items-center p-3 bg-gray-50 rounded mb-2 ${
                              editingSubmoduleId === sub.id
                                ? "border-[#5d60ef] bg-[#5d60ef]/5"
                                : ""
                            }`}
                          >
                            {editingSubmoduleId === sub.id ? (
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                  value={editSubTitle}
                                  onChange={(e) =>
                                    setEditSubTitle(e.target.value)
                                  }
                                  className="px-3 py-2 border rounded"
                                  placeholder="Submodule Title"
                                />
                                <input
                                  value={editSubSummary}
                                  onChange={(e) =>
                                    setEditSubSummary(e.target.value)
                                  }
                                  className="px-3 py-2 border rounded"
                                  placeholder="Summary (optional)"
                                />
                              </div>
                            ) : (
                              <div className="flex-1">
                                <p className="font-medium">{sub.title}</p>
                                <p className="text-sm text-gray-600">
                                  {sub.summary || "No summary"}
                                </p>
                              </div>
                            )}

                            <div className="flex gap-3">
                              {editingSubmoduleId === sub.id ? (
                                <>
                                  <button
                                    onClick={saveEditedSubmodule}
                                    className="text-green-600"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEditSubmodule}
                                    className="text-gray-600"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <FiEdit2
                                    className="text-blue-600 cursor-pointer"
                                    onClick={() => startEditSubmodule(sub)}
                                  />
                                  <FiTrash2
                                    className="text-red-600 cursor-pointer"
                                    onClick={() => {
                                      setSubToDelete({
                                        type: "submodule",
                                        id: sub.id,
                                        title: sub.title,
                                      });
                                      setShowSubDeleteModal(true);
                                    }}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        ))}

                        {editingSubmoduleId === null && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <input
                                value={newSubTitle}
                                onChange={(e) => setNewSubTitle(e.target.value)}
                                placeholder="Submodule Title"
                                className="px-4 py-3 border rounded-lg"
                              />
                              <input
                                value={newSubSummary}
                                onChange={(e) =>
                                  setNewSubSummary(e.target.value)
                                }
                                placeholder="Summary (optional)"
                                className="px-4 py-3 border rounded-lg"
                              />
                            </div>
                            <button
                              onClick={addSubmoduleToForm}
                              disabled={!newSubTitle.trim()}
                              className={`mt-3 w-full py-3 rounded-lg ${
                                newSubTitle.trim()
                                  ? "bg-[#5d60ef]/20 text-[#5d60ef]"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              + Add Submodule
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                      <button
                        onClick={() => setShowTopicForm(false)}
                        className="px-6 py-3 text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveTopic}
                        disabled={!topicName.trim()}
                        className={`px-8 py-3 text-white rounded-lg ${
                          topicName.trim() ? "bg-[#5d60ef]" : "bg-gray-400"
                        }`}
                      >
                        {editingTopic ? "Update Topic" : "Add Topic"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <SubmoduleDeleteConfirm
        isOpen={showSubDeleteModal}
        onClose={() => setShowSubDeleteModal(false)}
        onConfirm={confirmDelete}
        subTitle={subToDelete?.title || "this submodule"}
      />
    </>
  );
}
