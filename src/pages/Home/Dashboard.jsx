// src/pages/Home/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import BackgroundSplashes from "../../components/common/BackgroundSplashes";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <BackgroundSplashes />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-pink-50/40 relative overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="backdrop-blur-xl bg-white/40 border-b border-white/30 shadow-lg sticky top-0 z-10 px-6 py-4"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5d60ef] to-purple-600">
                Cognigen Dashboard
              </h1>
              <div className="relative hidden md:block">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search topics, assessments..."
                  className="pl-10 pr-4 py-2.5 w-72 bg-white/60 border border-white/40 rounded-2xl text-sm focus:outline-none focus:border-[#5d60ef] focus:ring-4 focus:ring-[#5d60ef]/20 transition-all placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button className="relative p-2.5 rounded-full hover:bg-white/30 transition">
                <FiBell className="text-xl text-gray-700" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5d60ef] to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                  N
                </div>
                <div className="hidden sm:block">
                  <p className="font-medium text-gray-800 group-hover:text-[#5d60ef] transition">
                    N Md
                  </p>
                  <p className="text-xs text-gray-500">Learner</p>
                </div>
              </div>

              <button className="p-2 rounded-full hover:bg-white/30 transition text-gray-600 hover:text-red-500">
                <FiLogOut className="text-xl" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {/* Learning Resources Card – now clickable */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              onClick={() => navigate("/learning-resources")} // ← added navigation
              className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all group cursor-pointer"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5d60ef]/10 to-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Learning Resources
              </h3>
              <p className="text-gray-600 text-sm">
                Personalized paths and materials generated just for you
              </p>
            </motion.div>

            {/* Adaptive Assessments */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all group"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Adaptive Assessments
              </h3>
              <p className="text-gray-600 text-sm">
                Smart quizzes that grow with your knowledge
              </p>
            </motion.div>

            {/* AI Mock Interviews */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
               onClick={() => navigate("/mock-interview")}
              className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all group"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/10 to-[#5d60ef]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">🎤</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                AI Mock Interviews
              </h3>
              <p className="text-gray-600 text-sm">
                Realistic practice with instant, detailed feedback
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center text-gray-600"
          >
            <p className="text-lg">Ready to level up your skills today? 🚀</p>
          </motion.div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
