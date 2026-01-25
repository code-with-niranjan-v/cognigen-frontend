import React from "react";
import { useState } from "react";
import { MdOutlineLeaderboard } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { SiGreatlearning } from "react-icons/si";
import Dashboard from "./Dashboard";

function Home() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const MenuItem = ({ icon: Icon, label }) => {
    const isActive = activeMenu === label;

    return (
      <div
        onClick={() => setActiveMenu(label)}
        className={`p-3 flex items-center space-x-2 cursor-pointer rounded
          ${
            isActive
              ? "bg-purple-600 text-white"
              : "text-gray-400 hover:bg-purple-100"
          }`}
      >
        <Icon size={20} />
        <p>{label}</p>
      </div>
    );
  };
  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <Dashboard />;
      case "Leaderboard":
        return <h1 className="text-xl font-bold">Leaderboard Content</h1>;
      case "Settings":
        return <h1 className="text-xl font-bold">Settings Content</h1>;
      case "Log Out":
        return <h1 className="text-xl font-bold">Logging out...</h1>;
      default:
        return null;
    }
  };
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="flex-1 border-r">
        <div className="m-3 flex flex-col">
          <div className="p-3 flex items-center space-x-2 text-blue-950 font-bold">
            <SiGreatlearning size={22} />
            <p>CogniGen</p>
          </div>

          <div className="mt-4 flex flex-col space-y-1">
            <MenuItem icon={MdDashboard} label="Dashboard" />
            <MenuItem icon={MdOutlineLeaderboard} label="Leaderboard" />
            <MenuItem icon={IoIosSettings} label="Settings" />
            <MenuItem icon={IoIosLogOut} label="Log Out" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-[4] p-6">{renderContent()}</div>
    </div>
  );
}

export default Home;
