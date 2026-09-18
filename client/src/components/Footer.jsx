import React from "react";
import { BsRobot } from "react-icons/bs";

function Footer() {
  return (
    <div className="flex items-center justify-center px-4 pb-10 py-4 pt-4">
      <div className="relative w-full max-w-6xl rounded-3xl overflow-hidden bg-white/70 dark:bg-[#0F1115]/70 backdrop-blur-xl border border-white/60 dark:border-[#1E2229] shadow-lg shadow-black/5 py-10 px-6 text-center transition-colors duration-300">
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-[#E8A94C]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-center items-center gap-3 mb-3">
            <div className="bg-[#1C1F24] dark:bg-[#E8A94C] text-[#E8A94C] dark:text-[#0A0B0D] p-2 rounded-lg shadow-md">
              <BsRobot size={16} />
            </div>
            <h2 className="font-serif-display text-lg text-[#1C1F24] dark:text-[#EDEEF0]">
              InterviewIQ.AI
            </h2>
          </div>
          <p className="text-[#5C6472] dark:text-[#8B92A0] text-sm max-w-xl mx-auto">
            AI-Powered interview prepration platform designed to improve
            communication skills, technical depth and professional confidence.
          </p>
          <p className="font-mono-studio text-[#9AA1AC] dark:text-[#565D68] text-[11px] mt-4 tracking-wide">
            BUILT WITH REACT · NODE.JS · MONGODB · OPENROUTER AI
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;