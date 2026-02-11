// src/pages/Learning/components/GeneratePathModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiArrowLeft, FiArrowRight, FiZap } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import api from "../../../api/instance";

const steps = [
  { id: 1, title: "What do you want to learn?", field: "course_name" },
  { id: 2, title: "Your experience level?", field: "experience_level" },
  { id: 3, title: "What's your main goal?", field: "goal" },
  {
    id: 4,
    title: "Preferred learning style?",
    field: "preferred_learning_style",
  },
  { id: 5, title: "How much time per day?", field: "time_availability" },
  { id: 6, title: "Any specific topics?", field: "custom_topics" },
];

const experienceLevels = ["Beginner", "Intermediate", "Advanced"];
const goals = ["Placement", "Mastery", "Revision"];
const timeOptions = ["1", "2", "3", "4+"];

const learningStyles = [
  { label: "Theory-Based (Books, Articles, Concepts)", value: "theory" },
  { label: "Practical / Hands-On (Code, Projects)", value: "practical" },
  { label: "Mixed (Videos + Text + Practice)", value: "mixed" },
];

export default function GeneratePathModal({
  isOpen,
  onClose,
  onGenerateStart,
  onGenerateError,
  onSuccess,
}) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [customTopicInput, setCustomTopicInput] = useState("");

  const [formData, setFormData] = useState({
    course_name: "",
    experience_level: "",
    goal: "",
    preferred_learning_style: "",
    time_availability: { per_day_hours: 2 },
    custom_topics: [],
  });

  if (!isOpen) return null;
  const currentStep = steps.find((s) => s.id === step);

  const isStepValid = () => {
    if (step === 1) return formData.course_name.trim().length > 0;
    if (step === 2) return formData.experience_level !== "";
    if (step === 3) return formData.goal !== "";
    if (step === 4) return formData.preferred_learning_style !== "";
    return true;
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      course_name: "",
      experience_level: "",
      goal: "",
      preferred_learning_style: "",
      time_availability: { per_day_hours: 2 },
      custom_topics: [],
    });
    setCustomTopicInput("");
  };

  const handleNext = () => {
    if (step < steps.length) setStep(step + 1);
    else handleGenerate();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const addCustomTopic = () => {
    if (!customTopicInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      custom_topics: [
        ...new Set([...prev.custom_topics, customTopicInput.trim()]),
      ],
    }));
    setCustomTopicInput("");
  };

  const removeCustomTopic = (topic) => {
    setFormData((prev) => ({
      ...prev,
      custom_topics: prev.custom_topics.filter((t) => t !== topic),
    }));
  };

  const handleGenerate = async () => {
    if (!isStepValid()) return;

    onGenerateStart();
    onClose();
    setLoading(true);

    try {
      const payload = {
        user_id: user._id,
        course_name: formData.course_name.trim(),
        experience_level: formData.experience_level.toLowerCase(),
        goal: formData.goal.toLowerCase(),
        preferred_learning_style: formData.preferred_learning_style,
        time_availability: formData.time_availability,
        custom_topics: formData.custom_topics,
      };

      console.log("Sending payload:", payload);

      const res = await api.post("/learning-paths/generate", payload, {
        timeout: 300000,
      });

      toast.success("Learning path created successfully!", {
        icon: "🚀",
        duration: 5000,
      });

      onSuccess(res.data);
    } catch (err) {
      console.error("Generation error:", err);

      const msg =
        err.response?.data?.message || err.message || "Failed to generate path";

      toast.error(msg, { duration: 8000 });
      onGenerateError();
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="px-8 pt-8 pb-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {currentStep?.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <FiX className="text-xl text-gray-600" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#5d60ef]"
                initial={{ width: 0 }}
                animate={{ width: `${(step / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm text-gray-600">
              Step {step} of {steps.length}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="min-h-[320px]"
            >
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Course or Skill Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Java, Python, System Design, React..."
                    value={formData.course_name}
                    onChange={(e) =>
                      setFormData({ ...formData, course_name: e.target.value })
                    }
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d60ef]/30 focus:border-[#5d60ef]"
                  />
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Select your current level
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {experienceLevels.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, experience_level: level })
                        }
                        className={`py-4 px-5 rounded-lg border-2 font-medium transition-all ${
                          formData.experience_level === level
                            ? "border-[#5d60ef] bg-[#5d60ef]/10 text-[#5d60ef]"
                            : "border-gray-300 hover:border-gray-400 text-gray-700"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Primary Learning Goal
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {goals.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, goal: g })}
                        className={`py-4 px-5 rounded-lg border-2 font-medium transition-all ${
                          formData.goal === g
                            ? "border-[#5d60ef] bg-[#5d60ef]/10 text-[#5d60ef]"
                            : "border-gray-300 hover:border-gray-400 text-gray-700"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4 — LEARNING STYLE (FIXED ENUMS) */}
              {step === 4 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    How do you prefer to learn?
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {learningStyles.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            preferred_learning_style: s.value,
                          })
                        }
                        className={`py-4 px-5 rounded-lg border-2 font-medium transition-all ${
                          formData.preferred_learning_style === s.value
                            ? "border-[#5d60ef] bg-[#5d60ef]/10 text-[#5d60ef]"
                            : "border-gray-300 hover:border-gray-400 text-gray-700"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5 */}
              {step === 5 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Daily time commitment
                  </label>
                  <div className="grid grid-cols-4 gap-4">
                    {timeOptions.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            time_availability: {
                              per_day_hours: parseInt(t) || 4,
                            },
                          })
                        }
                        className={`py-4 px-5 rounded-lg border-2 font-medium transition-all ${
                          formData.time_availability.per_day_hours ===
                          (parseInt(t) || 4)
                            ? "border-[#5d60ef] bg-[#5d60ef]/10 text-[#5d60ef]"
                            : "border-gray-300 hover:border-gray-400 text-gray-700"
                        }`}
                      >
                        {t} hr{t !== "1" ? "s" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6 */}
              {step === 6 && (
                <div className="space-y-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Add any specific topics (optional)
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {formData.custom_topics.map((topic) => (
                      <div
                        key={topic}
                        className="flex items-center gap-2 px-4 py-2 bg-[#5d60ef]/10 text-[#5d60ef] rounded-full text-sm font-medium"
                      >
                        {topic}
                        <button
                          onClick={() => removeCustomTopic(topic)}
                          className="text-[#5d60ef] hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={customTopicInput}
                      onChange={(e) => setCustomTopicInput(e.target.value)}
                      placeholder="e.g. Multithreading, Spring Boot, GraphQL..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomTopic();
                        }
                      }}
                      className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d60ef]/30 focus:border-[#5d60ef]"
                    />
                    <button
                      type="button"
                      onClick={addCustomTopic}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition"
                    >
                      Add
                    </button>
                  </div>

                  <p className="text-sm text-gray-500">
                    Leave empty to let AI generate a complete curriculum.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t flex justify-between items-center bg-gray-50">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              step === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiArrowLeft /> Back
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!isStepValid() || loading}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all ${
              isStepValid() && !loading
                ? "bg-[#5d60ef] hover:bg-[#4a4df2] shadow-md"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              "Creating..."
            ) : step === steps.length ? (
              <>
                <FiZap className="text-lg" /> Generate Learning Path
              </>
            ) : (
              <>
                Next <FiArrowRight />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
