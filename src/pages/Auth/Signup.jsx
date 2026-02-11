// src/pages/Auth/Signup.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import BackgroundSplashes from "../../components/common/BackgroundSplashes";
import RobotAvatar from "../../components/auth/RobotAvatar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordActive, setIsPasswordActive] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { signup: contextSignup } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    setLoading(true);

    try {
      await contextSignup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      toast.success("Account created successfully! 🎉", {
        duration: 3000,
        position: "top-center",
      });
      navigate("/home");
    } catch (err) {
      const message =
        err.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message, {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackgroundSplashes />

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-indigo-50/40">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl w-full items-center">
          <div className="hidden md:flex justify-center">
            <RobotAvatar
              isEmailFocused={isEmailFocused}
              isPasswordFocused={isPasswordActive}
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
              Create Account
            </motion.h2>

            <motion.p variants={itemVariants} className="text-gray-600 mb-8">
              Join Cognigen to unlock your full potential.
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Full Name
                </label>

                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <i className="fas fa-user"></i>
                  </span>

                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/60 border border-gray-200 focus:border-[#5d60ef] focus:ring-4 focus:ring-[#5d60ef]/20 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Email Address
                </label>

                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <i className="fas fa-envelope"></i>
                  </span>

                  <input
                    type="email"
                    placeholder="name@company.com"
                    required
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/60 border border-gray-200 focus:border-[#5d60ef] focus:ring-4 focus:ring-[#5d60ef]/20 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Password
                </label>

                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <i className="fas fa-lock"></i>
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    required
                    onFocus={() => setIsPasswordActive(true)}
                    onBlur={() => setIsPasswordActive(false)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/60 border border-gray-200 focus:border-[#5d60ef] focus:ring-4 focus:ring-[#5d60ef]/20 outline-none transition-all"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword((p) => !p);
                      setIsPasswordActive(true);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg hover:text-[#5d60ef]"
                  >
                    {showPassword ? (
                      <i className="fas fa-eye-slash"></i>
                    ) : (
                      <i className="fas fa-eye"></i>
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Confirm Password
                </label>

                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <i className="fas fa-lock"></i>
                  </span>

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/60 border border-gray-200 focus:border-[#5d60ef] focus:ring-4 focus:ring-[#5d60ef]/20 outline-none transition-all"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setShowConfirmPassword((p) => !p);
                      setIsPasswordActive(true);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg hover:text-[#5d60ef]"
                  >
                    {showConfirmPassword ? (
                      <i className="fas fa-eye-slash"></i>
                    ) : (
                      <i className="fas fa-eye"></i>
                    )}
                  </button>
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
                {loading ? "Creating Account..." : "Get Started"}
                <i className="fas fa-rocket text-sm"></i>
              </motion.button>
            </form>

            <motion.div
              variants={itemVariants}
              className="mt-8 text-center text-gray-600 text-sm"
            >
              Already a member?{" "}
              <Link
                to="/login"
                className="font-bold text-[#5d60ef] hover:underline"
              >
                Log in here
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
