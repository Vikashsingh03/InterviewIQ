import React from "react";
import { BsRobot } from "react-icons/bs";

function Footer() {
  return (
    <div className="flex items-center justify-center px-4 pb-10 py-4 pt-4">
      <div className="relative w-full max-w-6xl rounded-3xl overflow-hidden bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-white/60 dark:border-gray-800 shadow-lg shadow-green-900/5 py-10 px-6 text-center">
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-green-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-center items-center gap-3 mb-3">
            <div className="bg-linear-to-br from-green-500 to-emerald-600 text-white p-2 rounded-lg shadow-md shadow-green-900/20">
              <BsRobot size={16} />
            </div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              InterviewIQ.AI
            </h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
            AI-Powered interview prepration platform designed to improve
            communication skills, technical depth and professional confidence.
          </p>
          <p className="text-gray-400 dark:text-gray-600 text-xs mt-4">
            Built with React, Node.js, MongoDB & OpenRouter AI
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
