// src/pages/User/Profile.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/useAuth";
import api from "../../api/instance";

export default function Profile() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    coursesCreated: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageProgress: 0,
  });

  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch stats
        const statsRes = await api.get("/auth/stats");
        if (statsRes.data?.stats) {
          setStats(statsRes.data.stats);
        }

        // Fetch user's learning paths
        const pathsRes = await api.get("/learning-paths");
        setLearningPaths(pathsRes.data || pathsRes.data?.data || []);
      } catch (err) {
        console.error("Failed to load profile data:", err);
        setError("Failed to load some stats. Showing available data.");

        // Fallback: at least try to load the list
        try {
          const pathsRes = await api.get("/learning-paths/my-paths");
          setLearningPaths(pathsRes.data || pathsRes.data?.data || []);
        } catch (pathErr) {
          console.error("Also failed to load paths:", pathErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#5d60ef]/30 border-t-[#5d60ef] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-xl"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5d60ef] to-purple-600 bg-clip-text text-transparent mb-8">
          My Profile
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="flex items-center gap-6">
            <div className="w-26 h-26 rounded-3xl bg-gradient-to-br from-[#5d60ef] to-purple-600 flex items-center justify-center text-white text-6xl font-bold shadow-inner">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-4xl font-semibold text-gray-800">
                {user?.name}
              </h2>
              <p className="text-lg text-gray-600 mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/60 rounded-3xl p-7 text-center border border-white/40"
            >
              <p className="text-5xl font-bold text-[#5d60ef]">
                {stats.coursesCreated}
              </p>
              <p className="text-gray-600 mt-3 font-medium">Courses Created</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/60 rounded-3xl p-7 text-center border border-white/40"
            >
              <p className="text-5xl font-bold text-emerald-600">
                {stats.completedCourses}
              </p>
              <p className="text-gray-600 mt-3 font-medium">Completed</p>
            </motion.div>
          </div>
        </div>

        {error && <p className="text-amber-600 text-sm mt-4">{error}</p>}
      </motion.div>

      {/* Learning Paths Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-semibold">Your Learning Paths</h3>
          {stats.inProgressCourses > 0 && (
            <span className="px-5 py-1.5 bg-amber-100 text-amber-700 rounded-2xl text-sm font-medium">
              {stats.inProgressCourses} in progress
            </span>
          )}
        </div>

        {learningPaths.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No learning paths created yet.
            <br />
            Start from the Dashboard!
          </div>
        ) : (
          <div className="space-y-4">
            {learningPaths.map((path) => (
              <motion.div
                key={path._id}
                whileHover={{ scale: 1.01 }}
                className="flex justify-between items-center bg-white/60 p-6 rounded-2xl border border-white/50 hover:bg-white/80 transition"
              >
                <div>
                  <h4 className="font-semibold text-lg">
                    {path.courseName || path.title}
                  </h4>
                  <p className="text-sm text-gray-500 capitalize">
                    {path.status} • {path.experienceLevel}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#5d60ef]">
                    {Math.round(path.overallProgress || 0)}%
                  </div>
                  <div className="text-xs text-gray-500">PROGRESS</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
