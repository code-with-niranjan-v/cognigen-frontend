import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/useAuth";
import api from "../../api/instance";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";

export default function Settings() {
  const { user, setUser, logout } = useAuth();

  const [form, setForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  // ================= PROFILE UPDATE =================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!form.name?.trim() || !form.email?.trim()) {
      showMsg("Name and email are required", "error");
      return;
    }

    // 🚀 Optional UX improvement
    if (form.name === user.name && form.email === user.email) {
      showMsg("No changes detected", "error");
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const res = await api.put("/auth/update-profile", form);

      console.log("Update response:", res.data); // DEBUG

      if (res.data?.success) {
        setUser(res.data.user);
        showMsg(
          res.data.message || "Profile updated successfully ✓",
          "success",
        );
      } else {
        showMsg(res.data?.message || "Profile update failed", "error");
      }
    } catch (err) {
      console.error("Update error:", err); // DEBUG

      const errorMsg =
        err.response?.data?.message || err.message || "Profile update failed";

      showMsg(errorMsg, "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // ================= PASSWORD CHANGE =================
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordForm.current || !passwordForm.new) {
      showMsg("Both current and new password are required", "error");
      return;
    }

    if (passwordForm.new.length < 6) {
      showMsg("New password must be at least 6 characters long", "error");
      return;
    }

    // 🔥 EDGE CASE FIX
    if (passwordForm.current === passwordForm.new) {
      showMsg("New password must be different from current password", "error");
      return;
    }

    setIsChangingPassword(true);

    try {
      await api.put("/auth/change-password", {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.new,
      });

      showMsg("Password changed successfully ✓", "success");
      setPasswordForm({ current: "", new: "" });
    } catch (err) {
      console.error("Password error:", err);

      const errorMsg = err.response?.data?.message || "Password change failed";

      showMsg(errorMsg, "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ================= DELETE ACCOUNT =================
  const handleDeleteAccount = async () => {
    try {
      await api.delete("/auth/delete-account");
      await logout();
      window.location.href = "/login";
    } catch (err) {
      showMsg(
        err.response?.data?.message || "Account deletion failed",
        "error",
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5d60ef] to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-md">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5d60ef] to-purple-600 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your profile and preferences
          </p>
        </div>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* PROFILE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border shadow-xl"
      >
        <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <input
            type="text"
            value={form.name}
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-5 py-3 rounded-2xl border"
          />

          <input
            type="email"
            value={form.email}
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-5 py-3 rounded-2xl border"
          />

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="w-full py-4 bg-gradient-to-r from-[#5d60ef] to-purple-600 text-white rounded-2xl font-semibold disabled:opacity-70"
          >
            {isUpdatingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </motion.div>

      {/* PASSWORD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border shadow-xl"
      >
        <h2 className="text-2xl font-semibold mb-6">Change Password</h2>

        <form onSubmit={handleChangePassword} className="space-y-6">
          <input
            type="password"
            placeholder="Current Password"
            value={passwordForm.current}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                current: e.target.value,
              })
            }
            className="w-full px-5 py-3 rounded-2xl border"
          />

          <input
            type="password"
            placeholder="New Password"
            value={passwordForm.new}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                new: e.target.value,
              })
            }
            className="w-full px-5 py-3 rounded-2xl border"
          />

          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full py-4 bg-gradient-to-r from-[#5d60ef] to-purple-600 text-white rounded-2xl font-semibold disabled:opacity-70"
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </motion.div>

      {/* DELETE */}
      <motion.div className="bg-red-50 rounded-3xl p-8 border border-red-200">
        <h2 className="text-2xl font-semibold text-red-700 mb-4">
          Danger Zone
        </h2>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-8 py-3 bg-red-600 text-white rounded-2xl"
        >
          Delete Account
        </button>
      </motion.div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        itemName="your account"
      />
    </div>
  );
}
