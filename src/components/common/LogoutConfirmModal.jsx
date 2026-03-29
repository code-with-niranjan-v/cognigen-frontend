import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LogoutConfirmModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Log Out?</h2>
        <p className="text-gray-600 mb-8">
          Are you sure you want to log out of Cognigen?
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border border-gray-300 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
          >
            Yes, Log Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
