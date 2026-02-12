// src/api/learningApi.js
import api from "./instance";

// ─── LEARNING PATH ──────────────────────────────────────────────────────────
export const generateTopicContent = async (pathId, topicId) => {
  try {
    const res = await api.post(
      `/learning-paths/${pathId}/topics/${topicId}/generate-content`,
    );
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to generate topic content",
    );
  }
};

export const generateMiniQuiz = async (pathId, topicId, submoduleId) => {
  try {
    const res = await api.post(
      `/learning-paths/${pathId}/topics/${topicId}/submodules/${submoduleId}/generate-quiz`,
    );
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to generate mini quiz",
    );
  }
};

export const markSubmoduleComplete = async (pathId, topicId, submoduleId) => {
  try {
    const res = await api.patch(
      `/learning-paths/${pathId}/topics/${topicId}/submodules/${submoduleId}/complete`,
    );
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to mark submodule complete",
    );
  }
};

// Optional: get updated path after generation
export const refreshLearningPath = async (pathId) => {
  try {
    const res = await api.get(`/learning-paths/${pathId}`);
    return res.data;
  } catch (err) {
    throw new Error("Failed to refresh learning path");
  }
};
