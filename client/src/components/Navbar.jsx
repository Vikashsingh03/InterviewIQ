import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import {
  BsRobot,
  BsCoin,
  BsClockHistory,
  BsGraphUp,
  BsLightningCharge,
} from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";
import { useTheme } from "../context/ThemeContext";

const popoverMotion = {
  initial: { opacity: 0, y: -8, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.97 },
  transition: { duration: 0.16, ease: "easeOut" },
};

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAuth, setShowAuth] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
        @keyframes livePulse { 0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(232,169,76,0.5); } 50% { opacity: 0.55; box-shadow: 0 0 0 4px rgba(232,169,76,0); } }
        .live-dot { animation: livePulse 1.8s ease-in-out infinite; }
      `}</style>

      {/* SPACER — invisible, reserves the height the fixed navbar takes up
          so page content never hides behind it. */}
      <div
        aria-hidden="true"
        className="h-23 sm:h-28 pointer-events-none select-none"
      />

      {/* ACTUAL NAVBAR — fixed, fully transparent. The page underneath
          paints one continuous background from the true top of the page,
          so it simply shows through here — no second background layer
          competing with it, no seam possible. */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="relative flex justify-center px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl bg-white/75 dark:bg-[#0F1115]/80 backdrop-blur-md rounded-3xl shadow-[0_10px_40px_-16px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_-16px_rgba(0,0,0,0.6)] border border-white/60 dark:border-[#1E2229] px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex justify-between items-center relative transition-colors duration-300"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            >
              <div className="bg-[#1C1F24] dark:bg-[#E8A94C] text-[#E8A94C] dark:text-[#0A0B0D] p-2 rounded-lg shadow-md shadow-black/10 shrink-0">
                <BsRobot size={18} />
              </div>
              <h2 className="font-serif-display text-base sm:text-lg text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight whitespace-nowrap">
                InterviewIQ.AI
              </h2>
            </button>

            <div className="flex items-center gap-2 sm:gap-3 relative">
              <button
                onClick={toggleTheme}
                className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer flex items-center justify-center rounded-full bg-[#F0EFEA]/80 dark:bg-[#181B20] text-[#5C6472] dark:text-[#C7CBD1] hover:bg-[#E5E4E0] dark:hover:bg-[#232830] transition shrink-0"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? (
                  <HiOutlineSun size={17} />
                ) : (
                  <HiOutlineMoon size={17} />
                )}
              </button>

              {/* ---- credits ---- */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (!userData) {
                      setShowAuth(true);
                      return;
                    }
                    setShowCreditPopup(!showCreditPopup);
                    setShowUserPopup(false);
                  }}
                  className="flex items-center cursor-pointer gap-1.5 sm:gap-2 bg-[#F0EFEA]/80 dark:bg-[#181B20] text-[#1C1F24] dark:text-[#EDEEF0] px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono-studio font-medium hover:bg-[#E5E4E0] dark:hover:bg-[#232830] transition"
                >
                  <BsCoin className="text-[#E8A94C]" size={15} />
                  {userData?.credits || 0}
                </button>

                <AnimatePresence>
                  {showCreditPopup && (
                    <motion.div
                      {...popoverMotion}
                      className="absolute right-0 sm:-right-8 w-64 sm:w-72 mt-3 origin-top-right bg-white/95 dark:bg-[#0F1115]/95 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/50 rounded-2xl p-5 z-50 border border-[#EAE9E5] dark:border-[#1E2229]"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E8A94C]/15 flex items-center justify-center text-[#B27E2E] dark:text-[#E8A94C] shadow-md shadow-black/5">
                          <BsCoin size={18} />
                        </div>
                        <div>
                          <p className="font-mono-studio text-[10px] tracking-wide uppercase text-[#8B92A0]">
                            Your balance
                          </p>
                          <p className="font-serif-display text-xl text-[#1C1F24] dark:text-[#EDEEF0] leading-none">
                            {userData?.credits || 0} credits
                          </p>
                        </div>
                      </div>
                      <p className="text-[#5C6472] dark:text-[#8B92A0] text-sm mb-4 leading-relaxed">
                        Each interview uses a small number of credits. Top up
                        anytime to keep practicing.
                      </p>
                      <button
                        onClick={() => navigate("/pricing")}
                        className="w-full bg-[#1C1F24] dark:bg-[#EDEEF0] hover:opacity-90 text-white dark:text-[#0A0B0D] py-2.5 px-4 rounded-xl font-medium transition shadow-md"
                      >
                        Purchase Credits
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ---- profile ---- */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (!userData) {
                      setShowAuth(true);
                      return;
                    }
                    setShowUserPopup(!showUserPopup);
                    setShowCreditPopup(false);
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer bg-[#1C1F24] dark:bg-[#EDEEF0] text-[#E8A94C] dark:text-[#0A0B0D] rounded-full flex items-center justify-center font-semibold shadow-md ring-2 ring-white dark:ring-[#0F1115] shrink-0"
                >
                  {userData ? (
                    userData.name.charAt(0).toUpperCase()
                  ) : (
                    <FaUserAstronaut size={17} />
                  )}
                </button>

                <AnimatePresence>
                  {showUserPopup && (
                    <motion.div
                      {...popoverMotion}
                      className="absolute right-0 mt-3 w-60 sm:w-64 origin-top-right bg-white/95 dark:bg-[#0F1115]/95 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/50 border border-[#EAE9E5] dark:border-[#1E2229] rounded-2xl overflow-hidden z-50"
                    >
                      <div className="px-5 pt-5 pb-4 bg-[#FAFAF8] dark:bg-[#0C0E11] border-b border-[#EAE9E5] dark:border-[#1E2229]">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 shrink-0 rounded-full bg-[#E8A94C]/15 text-[#B27E2E] dark:text-[#E8A94C] flex items-center justify-center font-semibold text-lg">
                            {userData?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-serif-display text-[#1C1F24] dark:text-[#EDEEF0] truncate">
                              {userData?.name}
                            </p>
                            <p className="font-mono-studio text-[11px] text-[#8B92A0] flex items-center gap-1">
                              <BsCoin className="text-[#E8A94C]" size={11} />
                              {userData?.credits || 0} credits
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowUserPopup(false);
                            navigate("/practice");
                          }}
                          className="w-full cursor-pointer flex items-center gap-3 text-left text-sm px-3 py-2.5 rounded-xl hover:bg-[#F0EFEA] dark:hover:bg-[#181B20] text-[#3D4148] dark:text-[#C7CBD1] transition"
                        >
                          <BsLightningCharge size={15} className="text-[#9AA1AC]" />
                          Practice Hub
                        </button>
                        <button
                          onClick={() => {
                            setShowUserPopup(false);
                            navigate("/progress");
                          }}
                          className="w-full cursor-pointer flex items-center gap-3 text-left text-sm px-3 py-2.5 rounded-xl hover:bg-[#F0EFEA] dark:hover:bg-[#181B20] text-[#3D4148] dark:text-[#C7CBD1] transition"
                        >
                          <BsGraphUp size={15} className="text-[#9AA1AC]" />
                          My Progress
                        </button>
                        <button
                          onClick={() => {
                            setShowUserPopup(false);
                            navigate("/history");
                          }}
                          className="w-full cursor-pointer flex items-center gap-3 text-left text-sm px-3 py-2.5 rounded-xl hover:bg-[#F0EFEA] dark:hover:bg-[#181B20] text-[#3D4148] dark:text-[#C7CBD1] transition"
                        >
                          <BsClockHistory size={15} className="text-[#9AA1AC]" />
                          Interview History
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full cursor-pointer flex items-center gap-3 text-left text-sm px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition"
                        >
                          <HiOutlineLogout size={16} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showAuth && <AuthModel onclose={() => setShowAuth(false)} />}
    </>
  );
}

export default Navbar;