// src/components/LearningHeader.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../context/AuthContext"; // ← add this import
import BackgroundSplashes from "./BackgroundSplashes";

export default function LearningHeader({ title = "Learning Resources" }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user from context
  const { user } = useAuth(); // ← add this line

  const isDetailPage =
    location.pathname.includes("/learning-resources/") &&
    location.pathname !== "/learning-resources";

  return (
    <>
      <BackgroundSplashes />

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-20 backdrop-blur-xl bg-white/40 border-b border-white/30 shadow-sm px-6 py-4 md:py-5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-white/40 transition"
              aria-label="Go back"
            >
              <FiArrowLeft className="text-2xl text-gray-700" />
            </motion.button>

            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5d60ef] to-purple-600">
              {title}
            </h1>
          </div>

          {/* User avatar */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5d60ef] to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() ||
                user?.email?.charAt(0)?.toUpperCase() ||
                "U"}
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}
