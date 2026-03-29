// src/components/common/Sidebar.jsx
import { motion } from "framer-motion";
import { MdOutlineLeaderboard, MdDashboard } from "react-icons/md";
import { IoIosSettings, IoIosLogOut } from "react-icons/io";
import { CgProfile } from "react-icons/cg"; // Better profile icon
import { SiReact } from "react-icons/si";

const menuItems = [
  { icon: MdDashboard, label: "Dashboard" },
  { icon: MdOutlineLeaderboard, label: "Leaderboard" },
  { icon: CgProfile, label: "Profile" },
  { icon: IoIosSettings, label: "Settings" },
  { icon: IoIosLogOut, label: "Log Out", danger: true },
];

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const sidebarVariants = {
    hidden: { x: -80, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="w-72 backdrop-blur-xl bg-white/30 border-r border-white/30 shadow-2xl flex flex-col"
    >
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5d60ef] to-purple-600 flex items-center justify-center text-white shadow-md">
            <SiReact size={24} />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5d60ef] to-purple-700">
            Cognigen
          </h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.label;
          const isDanger = item.danger;

          return (
            <motion.button
              key={item.label}
              whileHover={{ scale: 1.04, x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveMenu(item.label)}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-left transition-all ${
                isActive
                  ? "bg-[#5d60ef] text-white shadow-lg shadow-[#5d60ef]/30"
                  : isDanger
                    ? "text-red-600 hover:bg-red-50/70 hover:text-red-700"
                    : "text-gray-700 hover:bg-white/40 hover:shadow-sm"
              }`}
            >
              <item.icon size={22} className={isActive ? "text-white" : ""} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="p-6 border-t border-white/20 text-xs text-gray-500 text-center">
        v1.0 • {new Date().getFullYear()}
      </div>
    </motion.aside>
  );
}
