import React from "react";
import { FiSearch, FiBell } from "react-icons/fi";

function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <p className="text-2xl font-bold text-gray-800">Dashboard</p>

          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <FiBell className="text-xl text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-9 h-9 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700">User</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-50 rounded-lg p-6">
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card */}
          <div
            className="bg-red-200 rounded-xl shadow-sm p-6 flex flex-col items-center
                          hover:shadow-md transition cursor-pointer"
          >
            <img src="/book.png" alt="Learning" className="w-16 h-16 mb-3" />
            <p className="font-medium text-gray-700">Learning Resources</p>
          </div>

          {/* Card */}
          <div
            className="bg-green-200 rounded-xl shadow-sm p-6 flex flex-col items-center
                          hover:shadow-md transition cursor-pointer"
          >
            <img
              src="/document.png"
              alt="Learning"
              className="w-16 h-16 mb-3"
            />
            <p className="font-medium text-gray-700">Assessments</p>
          </div>

          <div
            className="bg-blue-200 rounded-xl shadow-sm p-6 flex flex-col items-center
                          hover:shadow-md transition cursor-pointer"
          >
            <img
              src="/interview.png"
              alt="Learning"
              className="w-16 h-16 mb-3"
            />
            <p className="font-medium text-gray-700">AI Interview</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
