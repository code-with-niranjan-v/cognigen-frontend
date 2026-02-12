import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function MockInterviewFeedback() {
  const feedback = {
    overallScore: 8.5,
    strengths: [
      "Clear explanation of OOP principles",
      "Good confidence while speaking",
      "Strong understanding of abstraction",
    ],
    improvements: [
      "Provide more real-world examples",
      "Improve answer structure",
      "Reduce filler words",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE - AI ROBOT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative"
          >
            <div className="absolute inset-0 bg-cyan-500/30 blur-3xl rounded-full"></div>

            <div className="relative bg-white/10 backdrop-blur-2xl border border-cyan-400/30 p-10 rounded-full shadow-2xl">
              <Bot className="w-28 h-28 text-cyan-400" />
            </div>
          </motion.div>

          <h2 className="mt-6 text-2xl font-bold text-cyan-300">
            Cognigen AI Feedback
          </h2>
          <p className="text-blue-200 mt-2 text-center max-w-sm">
            Here’s your personalized interview analysis powered by AI.
          </p>
        </motion.div>

       {/* RIGHT SIDE - FEEDBACK CARD */}
<motion.div
  initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className="bg-white/10 backdrop-blur-2xl border border-purple-400/20 rounded-3xl p-10 shadow-2xl"
>
  {/* Score */}
  <div className="mb-8 text-center">
    <h3 className="text-lg text-purple-300 uppercase tracking-widest">
      Overall Score
    </h3>
    <p className="text-5xl font-bold text-cyan-400 mt-2">
      {feedback?.overallScore}/10
    </p>
  </div>

  {/* AI Feedback Text */}
  <div>
    <h4 className="text-xl font-semibold text-cyan-300 mb-4">
      AI Analysis
    </h4>

    <div className="bg-white/5 border border-cyan-400/20 rounded-2xl p-6 leading-relaxed text-blue-100 text-lg whitespace-pre-line">
      {feedback?.feedbackText || "Generating AI feedback..."}
    </div>
  </div>
</motion.div>

      </div>
    </div>
  );
}
