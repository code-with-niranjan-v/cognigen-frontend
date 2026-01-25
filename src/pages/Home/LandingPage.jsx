import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
function LandingPage() {
  const navigate = useNavigate();
  const footerData = {
    brand: {
      name: "CogniGen",
      copyright: "All Rights Reserved © CogniGen.com",
      address: ["28 W 12th St, New York,", "NY 10012, NYC"],
      social: [
        { icon: <FaFacebookF />, link: "#" },
        { icon: <FaTwitter />, link: "#" },
        { icon: <FaLinkedinIn />, link: "#" },
        { icon: <FaYoutube />, link: "#" },
      ],
    },
    columns: [
      {
        title: "Product",
        links: [
          "Product",
          "Pricing",
          "Enterprise",
          "Partners",
          "Affiliates",
          "Integrations",
          "Developers",
          "Students",
          "Work OS",
        ],
      },
      {
        title: "Team",
        links: [
          "About Us",
          "Contact Us",
          "Careers",
          "Find a Partner",
          "In the News",
        ],
      },
      {
        title: "Solutions",
        links: [
          "Project Management",
          "Marketing",
          "CRM and Sales",
          "Software Development",
          "Constructions",
          "Creative Production",
          "Remote Work",
          "HR",
          "IT",
          "See More Solutions",
        ],
      },
      {
        title: "Resources",
        links: [
          "Knowledge Base",
          "Guides",
          "Daily Webinars",
          "Community",
          "Customer Stories",
          "Templates",
          "Professional Services",
          "Video Tutorials",
          "Blog",
          "Podcast",
        ],
      },
    ],
  };

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen overflow-hidden">
        {/* LEFT BLUE */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-500"></div>

        {/* RIGHT WHITE SLANT */}
        <div className="absolute top-0 right-0 h-full w-full md:w-[45%] bg-white clip-slant"></div>

        {/* CONTENT */}
        <div className="relative z-10">
          {/* NAVBAR */}
          <nav className="flex items-center justify-between px-6 md:px-10 py-6 text-white">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
              CogniGen
            </div>

            <div className="hidden md:flex gap-6 text-sm">
              <a href="#">Features</a>
              <a href="#">Learning Paths</a>
              <a href="#">For Instruction</a>
              <a href="#">Resources</a>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <Link onClick={navigate("/signup")} className="text-gray-700">
                Login
              </Link>
              <Link
                to={"/signup"}
                className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold"
              >
                Sign Up
              </Link>
            </div>
          </nav>

          {/* HERO BODY */}
          <div className="flex flex-col-reverse md:flex-row px-6 md:px-10 pt-12 md:pt-20 gap-12 mb-32">
            {/* TEXT */}
            <div className="md:w-1/2 text-white">
              <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                👋 Welcome to CogniGen
              </span>

              <h1 className="text-4xl md:text-5xl font-bold mt-4">
                Upgrade Your Cognitive Skills <br /> with AI
              </h1>

              <p className="mt-6 text-lg text-white/90">
                Learn faster, think smarter, and prepare for real-world tech
                interviews using AI-powered learning paths.
              </p>

              <button className="mt-8 bg-yellow-400 text-black px-5 py-3 rounded-md font-semibold">
                Get Started with CogniGen
              </button>
            </div>

            {/* MOCK CARDS */}
            <div className="md:w-1/2 relative flex justify-center items-center">
              <div className="absolute top-10 right-10 bg-white rounded-lg shadow-lg p-4 w-64">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-sm">Lucy Niana</span>
                  <span className="text-xs bg-green-400 text-white px-2 rounded">
                    Done
                  </span>
                </div>
                <p className="text-sm">Develop Communication Plan</p>
                <div className="text-yellow-400">★★★★★</div>
              </div>

              <div className="absolute bottom-10 left-10 bg-white rounded-lg shadow-lg p-4 w-64">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-sm">Mark Anderson</span>
                  <span className="text-xs bg-orange-400 text-white px-2 rounded">
                    Pending
                  </span>
                </div>
                <p className="text-sm">Update Contract Agreement</p>
                <div className="text-yellow-400">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHAT YOU CAN DO ================= */}
      <section className="px-6 md:px-10 py-16 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">
          What you <span className="text-yellow-400">can do?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: "📈", title: "Business Planning" },
            { icon: "💡", title: "Financial Planning" },
            { icon: "🔍", title: "Market Analysis" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 p-6 rounded-xl shadow text-center"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">
                Structured AI-powered planning to boost productivity.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-6 md:px-10 py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-20">
          Our <span className="text-yellow-400">Features</span>
        </h2>

        {/* Feature 1 */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 mb-24">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold mb-4">
              Manage everything in one workspace
            </h3>
            <p className="text-gray-600">
              Planning, tracking and delivering your team's best work has never
              been easier.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md h-64 bg-white rounded-xl shadow"></div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md h-64 bg-white rounded-xl shadow"></div>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold mb-4">Set up in minutes</h3>
            <p className="text-gray-600">
              Hundreds of templates to help you start instantly.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold mb-4">AI-powered insights</h3>
            <p className="text-gray-600">
              Make smarter decisions with real-time analytics.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md h-64 bg-white rounded-xl shadow"></div>
          </div>
        </div>
      </section>

      {/* VISUALIZE WORK WITH VIEWS */}
      <section className="px-6 md:px-10 py-28 bg-white">
        <div className="flex items-center">
          {/* LEFT TEXT (NARROW COLUMN) */}
          <div className="w-full md:w-[40%] flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-gray-800">
              Visualize work with Views
            </h3>

            <div className="w-10 h-[2px] bg-indigo-500 my-4"></div>

            <p className="text-sm text-gray-600">
              View data as a map, calendar, timeline, kanban, and more
            </p>

            <p className="text-sm text-gray-600 mt-2">
              The easy-to-use, visual interface lets any team member jump in and
              get started, no training required.
            </p>
          </div>

          {/* RIGHT ORBIT (WIDE + RIGHT ALIGNED) */}
          <div className="hidden md:flex w-[60%] justify-end relative">
            <div className="relative w-[420px] h-[420px]">
              {/* OUTER DOTTED CIRCLE */}
              <div className="absolute inset-0 border border-dashed border-gray-300 rounded-full"></div>

              {/* INNER DOTTED CIRCLE */}
              <div className="absolute inset-[60px] border border-dashed border-gray-300 rounded-full"></div>

              {/* MAP (TOP RIGHT – BIG) */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-400 rounded-full flex flex-col items-center justify-center text-white">
                <span className="text-lg">📍</span>
                <span className="text-sm">Map</span>
              </div>

              {/* CALENDAR (LEFT – MEDIUM) */}
              <div className="absolute left-0 top-[140px] w-20 h-20 bg-yellow-400 rounded-full flex flex-col items-center justify-center text-white">
                <span className="text-base">📅</span>
                <span className="text-xs">Calendar</span>
              </div>

              {/* TIMELINE (BOTTOM RIGHT – MEDIUM) */}
              <div className="absolute bottom-4 right-[40px] w-20 h-20 bg-orange-300 rounded-full flex flex-col items-center justify-center text-white">
                <span className="text-base">⏰</span>
                <span className="text-xs">Timeline</span>
              </div>

              {/* SMALL DOTS */}
              <div className="absolute top-10 left-[55%] w-3 h-3 bg-orange-400 rounded-full"></div>
              <div className="absolute right-6 top-[55%] w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="absolute bottom-20 left-20 w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {/* BRAND */}
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <div className="w-7 h-7 bg-indigo-500 rounded-full"></div>
                {footerData.brand.name}
              </div>

              <p className="text-sm text-gray-500 mb-4">
                {footerData.brand.copyright}
              </p>

              <div className="text-sm text-gray-600 mb-6">
                {footerData.brand.address.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              <div className="flex gap-3">
                {footerData.brand.social.map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-600 hover:bg-indigo-500 hover:text-white transition"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* FOOTER COLUMNS */}
            {footerData.columns.map((column, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-800 mb-4">
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-sm text-gray-600 hover:text-indigo-500 transition"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
      {/* CLIP PATH */}
      <style>
        {`
          .clip-slant {
            clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);
          }
        `}
      </style>
    </>
  );
}

export default LandingPage;
