// cognigen-frontend/src/pages/Auth/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import BackgroundSplashes from "../../components/BackgroundSplashes";
import RobotAvatar from "../../components/RobotAvatar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { login: contextLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contextLogin(formData);
      toast.success("Login successful! 🎉", {
        duration: 3000,
        position: "top-center",
      });
      navigate("/home");
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(message, {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackgroundSplashes />

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-pink-50/40">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl w-full items-center">
          <div className="hidden md:flex justify-center">
            <RobotAvatar
              isEmailFocused={isEmailFocused}
              isPasswordFocused={isPasswordFocused}
              mousePosition={mousePosition}
            />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="backdrop-blur-xl bg-white/40 border border-white/30 shadow-2xl rounded-3xl p-10 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#5d60ef]/5 rounded-full blur-3xl -mr-20 -mt-20" />

            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-gray-800 mb-2"
            >
              Welcome Back
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-600 mb-8">
              Sign in to continue your learning journey.
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5d60ef] transition-colors">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    required
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/60 border border-gray-200 focus:border-[#5d60ef] focus:ring-4 focus:ring-[#5d60ef]/20 outline-none transition-all placeholder:text-gray-400"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </motion.div>

              {/* Password field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-bold text-[#5d60ef] hover:text-[#4a4df2]"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5d60ef] transition-colors">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/60 border border-gray-200 focus:border-[#5d60ef] focus:ring-4 focus:ring-[#5d60ef]/20 outline-none transition-all placeholder:text-gray-400"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#5d60ef] hover:bg-[#4a4df2] text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#5d60ef]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Sign In"}
                <i className="fas fa-arrow-right text-sm"></i>
              </motion.button>
            </form>

            <motion.div
              variants={itemVariants}
              className="mt-10 text-center text-gray-600 text-sm"
            >
              New to Cognigen?{" "}
              <Link
                to="/signup"
                className="font-bold text-[#5d60ef] hover:underline"
              >
                Create an account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
