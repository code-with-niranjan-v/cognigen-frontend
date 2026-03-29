// src/pages/User/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdEmojiEvents } from "react-icons/md";
import api from "../../api/instance";
import { useAuth } from "../../context/useAuth";

export default function Leaderboard() {
  const { user } = useAuth();
  const [allLeaderboard, setAllLeaderboard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/auth/leaderboard");
        setAllLeaderboard(res.data.leaderboard || []);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        setError("Failed to load leaderboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Calculate current user's rank
  const currentUserRank =
    allLeaderboard.findIndex((entry) => entry.email === user?.email) + 1;

  const totalPages = Math.ceil(allLeaderboard.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = allLeaderboard.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const showCurrentUserAtBottom =
    currentUserRank > itemsPerPage && currentPage === 1;

  return (
    <div>
      <div className="flex items-center gap-4 mb-10">
        <MdEmojiEvents size={48} className="text-amber-500" />
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#5d60ef] to-purple-600 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-gray-600">Top creators & learners on Cognigen</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
        {error && (
          <div className="p-6 text-center text-red-600 bg-red-50 border-b border-red-100">
            {error}
          </div>
        )}

        <table className="w-full">
          <thead className="bg-white/50 border-b border-white/30">
            <tr>
              <th className="px-8 py-5 text-left font-medium text-gray-500">
                Rank
              </th>
              <th className="px-8 py-5 text-left font-medium text-gray-500">
                User
              </th>
              <th className="px-8 py-5 text-center font-medium text-gray-500">
                Courses Created
              </th>
              <th className="px-8 py-5 text-center font-medium text-gray-500">
                Avg Progress
              </th>
              <th className="px-8 py-5 text-center font-medium text-gray-500">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 && !loading ? (
              <tr>
                <td colSpan="5" className="text-center py-16 text-gray-500">
                  No data available yet.
                </td>
              </tr>
            ) : (
              paginatedData.map((entry, idx) => {
                const globalRank = startIndex + idx + 1;
                const isCurrentUser = entry.email === user?.email;

                return (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-b border-white/20 hover:bg-white/40 transition ${
                      isCurrentUser ? "bg-[#5d60ef]/10" : ""
                    }`}
                  >
                    <td className="px-8 py-6 font-bold text-xl text-amber-600">
                      #{globalRank}
                    </td>
                    <td className="px-8 py-6">
                      <div
                        className={`font-medium ${isCurrentUser ? "text-[#5d60ef]" : ""}`}
                      >
                        {entry.name}
                      </div>
                      <div className="text-sm text-gray-500">{entry.email}</div>
                    </td>
                    <td className="px-8 py-6 text-center font-semibold">
                      {entry.coursesCreated}
                    </td>
                    <td className="px-8 py-6 text-center">
                      {entry.avgProgress || 0}%
                    </td>
                    <td className="px-8 py-6 text-center font-bold text-[#5d60ef]">
                      {Math.round(entry.score || 0)}
                    </td>
                  </motion.tr>
                );
              })
            )}

            {/* Current user highlight at bottom if not in top 10 */}
            {showCurrentUserAtBottom && user && (
              <motion.tr className="bg-[#5d60ef]/10 border-t-2 border-[#5d60ef]">
                <td className="px-8 py-6 font-bold text-xl text-amber-600">
                  #{currentUserRank}
                </td>
                <td className="px-8 py-6">
                  <div className="font-medium text-[#5d60ef]">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-8 py-6 text-center font-semibold">—</td>
                <td className="px-8 py-6 text-center">—</td>
                <td className="px-8 py-6 text-center font-bold text-[#5d60ef]">
                  —
                </td>
              </motion.tr>
            )}
          </tbody>
        </table>

        {loading && (
          <div className="text-center py-12 text-gray-500 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-[#5d60ef]/30 border-t-[#5d60ef] rounded-full animate-spin" />
            Loading rankings...
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 py-6 border-t border-white/30 bg-white/30">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-6 py-2 rounded-xl bg-white disabled:opacity-50 hover:bg-gray-100 transition"
            >
              Previous
            </button>
            <span className="px-6 py-2 font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-6 py-2 rounded-xl bg-white disabled:opacity-50 hover:bg-gray-100 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
