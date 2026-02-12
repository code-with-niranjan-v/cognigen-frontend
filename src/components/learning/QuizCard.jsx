// src/components/learning/QuizCard.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiRefreshCw, FiAward } from "react-icons/fi";
import toast from "react-hot-toast";

export default function QuizCard({ questions = [] }) {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = start screen
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({}); // { index: { selected, isCorrect } }
  const [isFinished, setIsFinished] = useState(false);

  // Shuffle once when questions arrive
  useEffect(() => {
    if (questions.length === 0) return;

    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    resetQuiz();
  }, [questions]);

  const resetQuiz = () => {
    setCurrentIndex(-1);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setAnswers({});
    setIsFinished(false);
  };

  const startQuiz = () => {
    setCurrentIndex(0);
    setSelected(null);
    setSubmitted(false);
  };

  const handleSelect = (option) => {
    if (submitted) return;
    setSelected(option);
  };

  const handleSubmit = () => {
    if (!selected) {
      toast("Please select an option", { icon: "⚠️" });
      return;
    }

    const qIndex = currentIndex;
    const currentQ = shuffledQuestions[qIndex];
    const isCorrect = selected === currentQ.answer;

    setAnswers((prev) => ({
      ...prev,
      [qIndex]: { selected, isCorrect },
    }));

    if (isCorrect) setScore((prev) => prev + 1);

    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setIsFinished(true); // Show final report card
    }
  };

  const currentQuestion = shuffledQuestions[currentIndex];

  // ─── START SCREEN ───────────────────────────────────────────────
  if (currentIndex === -1 && !isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-12 text-center shadow-xl border border-indigo-100 max-w-2xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Practice Quiz</h2>
        <p className="text-xl text-gray-700 mb-10">
          {shuffledQuestions.length} randomized questions
        </p>
        <button
          onClick={startQuiz}
          className="px-12 py-5 bg-[#5d60ef] hover:bg-[#4a4df2] text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105 text-lg"
        >
          Start Quiz
        </button>
      </motion.div>
    );
  }

  // ─── FINAL SCORE REPORT CARD ─────────────────────────────────────
  if (isFinished) {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    let feedback = "Good effort — try again!";
    if (score === shuffledQuestions.length)
      feedback = "Perfect! 🎉 You're a master.";
    else if (percentage >= 70) feedback = "Well done! Keep it up.";

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-12 text-center shadow-2xl border border-green-200 max-w-3xl mx-auto"
      >
        <FiAward className="text-8xl text-[#5d60ef] mx-auto mb-6" />
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4">
          Quiz Completed!
        </h2>
        <div className="text-7xl font-black text-[#5d60ef] mb-4">
          {score} / {shuffledQuestions.length}
        </div>
        <p className="text-2xl font-semibold text-gray-700 mb-8">
          {percentage}% — {feedback}
        </p>

        <button
          onClick={resetQuiz}
          className="px-12 py-5 bg-[#5d60ef] hover:bg-[#4a4df2] text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-3 mx-auto text-lg"
        >
          <FiRefreshCw />
          Restart Quiz
        </button>
      </motion.div>
    );
  }

  // ─── SINGLE QUESTION VIEW ────────────────────────────────────────
  const isLastQuestion = currentIndex === shuffledQuestions.length - 1;

  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-xl p-10 max-w-3xl mx-auto border border-gray-100"
    >
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-bold text-gray-900">
          Question {currentIndex + 1} of {shuffledQuestions.length}
        </h3>
        <span className="px-5 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          {currentQuestion.difficulty}
        </span>
      </div>

      <p className="text-xl font-medium mb-10 leading-relaxed">
        {currentQuestion.question}
      </p>

      <div className="space-y-4 mb-12">
        {currentQuestion.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          const isSelected = selected === letter;
          let style = "bg-gray-50 hover:bg-gray-100 border-gray-200";

          if (submitted) {
            if (letter === currentQuestion.answer) {
              style = "bg-green-100 border-green-300 text-green-800";
            } else if (isSelected) {
              style = "bg-red-100 border-red-300 text-red-800";
            }
          } else if (isSelected) {
            style = "bg-[#5d60ef]/10 border-[#5d60ef]";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(letter)}
              disabled={submitted}
              className={`w-full text-left p-5 rounded-xl border transition-all ${style} ${
                submitted ? "cursor-default" : "cursor-pointer hover:shadow-sm"
              }`}
            >
              <span className="font-bold text-lg mr-4">{letter}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className={`px-12 py-4 rounded-xl font-semibold text-white transition-all shadow-md ${
              selected
                ? "bg-[#5d60ef] hover:bg-[#4a4df2]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Submit Answer
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p
              className={`text-2xl font-bold ${
                answers[currentIndex]?.isCorrect
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {answers[currentIndex]?.isCorrect ? (
                <>
                  <FiCheckCircle className="inline mr-2 text-3xl" />
                  Correct!
                </>
              ) : (
                <>
                  <FiXCircle className="inline mr-2 text-3xl" />
                  Incorrect — Correct is {currentQuestion.answer}
                </>
              )}
            </p>
          </div>

          <button
            onClick={handleNext}
            className="px-12 py-4 bg-[#5d60ef] hover:bg-[#4a4df2] text-white font-semibold rounded-xl shadow-md transition text-lg"
          >
            {isLastQuestion ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
