import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function MockInterviewLanguageSelection() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [questions, setQuestions] = useState(5);
  const navigate = useNavigate();


  const languages = [
    { name: "Java", gradient: "from-blue-500 to-blue-700" },
    { name: "Python", gradient: "from-sky-400 to-blue-600" },
    { name: "JavaScript", gradient: "from-blue-400 to-indigo-600" },
    { name: "C++", gradient: "from-indigo-500 to-blue-800" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-blue-400/20 rounded-2xl shadow-2xl p-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-500/20 rounded-2xl">
              <Code2 className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Mock Interview Setup
          </h1>
          <p className="text-blue-200 text-lg">
            Choose your language and number of questions to begin
          </p>
        </div>

        {/* Language Selection */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-blue-300 mb-5">
            Select Programming Language
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {languages.map((lang, index) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                key={index}
                onClick={() => setSelectedLanguage(lang.name)}
                className={`p-6 rounded-2xl text-lg font-semibold transition-all duration-300 text-white bg-gradient-to-r ${lang.gradient} ${
                  selectedLanguage === lang.name
                    ? "ring-4 ring-blue-300/60"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                {lang.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-blue-300 mb-5">
            Number of Questions
          </h2>
          <div className="flex items-center gap-6">
            <input
              type="range"
              min="1"
              max="20"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              className="w-full accent-blue-500"
            />
            <div className="text-2xl font-bold text-blue-400 w-16 text-center">
              {questions}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!selectedLanguage}
            onClick={() =>
    navigate("/mock-interview/session", {
      state: {
        language: selectedLanguage,
        questions: questions,
      },
    })
  }
            className={`px-8 py-4 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 mx-auto transition-all duration-300 ${
              selectedLanguage
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/40"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            Start Interview
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
