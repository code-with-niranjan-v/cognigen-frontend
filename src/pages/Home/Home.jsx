import React, { useState } from "react";
import { motion } from "framer-motion";
import BackgroundSplashes from "../../components/common/BackgroundSplashes";
import Sidebar from "../../components/common/Sidebar";
import Dashboard from "./Dashboard";
import Profile from "../User/Profile";
import Leaderboard from "../User/Leaderboard";
import Settings from "../User/Settings";
import LogoutConfirmModal from "../../components/common/LogoutConfirmModal";

function Home() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleMenuClick = (label) => {
    if (label === "Log Out") {
      setShowLogoutModal(true);
    } else {
      setActiveMenu(label);
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <Dashboard />;
      case "Leaderboard":
        return <Leaderboard />;
      case "Settings":
        return <Settings />;
      case "Profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <BackgroundSplashes />

      <div className="min-h-screen flex bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/40 overflow-hidden">
        <Sidebar activeMenu={activeMenu} setActiveMenu={handleMenuClick} />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-y-auto p-6 md:p-8"
        >
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </motion.main>
      </div>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
}

export default Home;
