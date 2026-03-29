// src/pages/Home/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../../context/useAuth";
import LogoutConfirmModal from "../../components/common/LogoutConfirmModal";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <>
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
            </div>

            <div className="flex items-center gap-5">
              {/* User Info */}
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5d60ef] to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                  {userInitial}
                </div>
                <div className="hidden sm:block">
                  <p className="font-medium text-gray-800 group-hover:text-[#5d60ef] transition">
                    {user?.name || "Guest User"}
                  </p>
                  <p className="text-xs text-gray-500">Learner</p>
                </div>
              </div>

              {/* Exit / Logout Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogoutClick}
                className="p-3 rounded-full hover:bg-white/40 transition text-gray-600 hover:text-red-600"
                title="Logout"
              >
                <FiLogOut className="text-2xl" />
              </motion.button>
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
            {/* Your existing cards */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate("/learning-resources")}
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

            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              onClick={() => navigate("/test")}
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

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
}

export default Dashboard;
