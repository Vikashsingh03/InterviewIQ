import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import {
  BsCoin,
  BsClockHistory,
  BsGraphUp,
} from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
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

const NAV_LINKS = [
  { label: "Practice", path: "/practice" },
  { label: "Progress", path: "/progress" },
  { label: "History", path: "/history" },
  { label: "Pricing", path: "/pricing" },
];

function BrandMark({ size = "md" }) {
  const box = size === "md" ? "w-9 h-9 text-lg" : "w-8 h-8 text-base";
  return (
    <div className={`${box} rounded-lg bg-[#0C0E11] dark:bg-[#E8A94C] flex items-center justify-center shrink-0 ring-1 ring-[#E8A94C]/50 shadow-[0_6px_18px_-6px_rgba(232,169,76,0.5)]`}>
      <span className="font-serif-display italic font-semibold text-[#E8A94C] dark:text-[#0A0B0D] leading-none">Q</span>
    </div>
  );
}

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showAuth, setShowAuth] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? h.scrollTop / max : 0);
      setScrolled(h.scrollTop > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const goProtected = (path) => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate(path);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div
        aria-hidden="true"
        className="h-23 sm:h-28 pointer-events-none select-none"
      />

      <div className="fixed top-0 left-0 right-0 z-50">
        <div
          className={`relative flex justify-center px-3 sm:px-4 transition-all duration-300 ${
            scrolled ? "pt-2.5 sm:pt-3 pb-2.5" : "pt-4 sm:pt-6 pb-3 sm:pb-4"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-full max-w-6xl bg-[#FFFFFF]/85 dark:bg-[#0C0E11]/85 backdrop-blur-xl rounded-3xl border border-[#E8E6E1] dark:border-[#232830] px-4 sm:px-6 md:px-8 flex justify-between items-center relative transition-all duration-300 ${
              scrolled
                ? "py-2.5 sm:py-3 shadow-[0_18px_50px_-18px_rgba(28,31,36,0.22)] dark:shadow-[0_18px_50px_-18px_rgba(0,0,0,0.7)]"
                : "py-3 sm:py-4 shadow-[0_14px_44px_-16px_rgba(28,31,36,0.16)] dark:shadow-[0_14px_44px_-16px_rgba(0,0,0,0.6)]"
            }`}
          >
            <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-[#9A7B24]/50 dark:via-[#E8A94C]/50 to-transparent" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-8 h-px bg-[#9A7B24]/70 dark:bg-[#E8A94C]/70 origin-left"
              style={{ width: "calc(100% - 4rem)", transform: `scaleX(${progress})` }}
            />

            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2.5 cursor-pointer shrink-0"
            >
              <span className="group-hover:scale-105 transition-transform duration-200 flex">
                <BrandMark />
              </span>
              <span className="flex flex-col items-start leading-none">
                <h2 className="font-serif-display text-base sm:text-lg text-[#14171B] dark:text-[#EDEEF0] tracking-tight whitespace-nowrap">
                  InterviewIQ<span className="text-[#9A7B24] dark:text-[#E8A94C]">.</span>
                </h2>
                <span className="font-mono-studio text-[8px] tracking-[0.3em] text-[#9AA1AC] dark:text-[#565D68] mt-1 hidden sm:block">
                  INTERVIEW OS
                </span>
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {NAV_LINKS.map((link) => {
                const active = location.pathname.startsWith(link.path);
                return (
                  <button
                    key={link.path}
                    onClick={() =>
                      link.path === "/pricing"
                        ? navigate(link.path)
                        : goProtected(link.path)
                    }
                    className={`relative cursor-pointer text-sm px-3.5 py-2 rounded-full transition-colors duration-200 ${
                      active
                        ? "text-[#14171B] dark:text-[#EDEEF0]"
                        : "text-[#5B636E] hover:text-[#14171B] dark:text-[#8B92A0] dark:hover:text-[#EDEEF0]"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-[#9A7B24]/10 border border-[#9A7B24]/30 dark:bg-[#E8A94C]/12 dark:border-[#E8A94C]/30"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 relative">
              <button
                onClick={toggleTheme}
                className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer flex items-center justify-center rounded-full bg-[#EFEEE9] text-[#3E4650] hover:bg-[#E8E6E1] dark:bg-[#181B20] dark:text-[#C7CBD1] dark:hover:bg-[#232830] hover:scale-105 transition-all duration-200 shrink-0"
                aria-label="Toggle dark mode"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex"
                  >
                    {theme === "dark" ? (
                      <HiOutlineSun size={17} />
                    ) : (
                      <HiOutlineMoon size={17} />
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>

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
                  className="flex items-center cursor-pointer gap-1.5 sm:gap-2 bg-[#EFEEE9] text-[#14171B] dark:bg-[#181B20] dark:text-[#EDEEF0] px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono-studio font-medium hover:bg-[#E8E6E1] dark:hover:bg-[#232830] border border-transparent hover:border-[#9A7B24]/40 dark:hover:border-[#E8A94C]/40 transition-all duration-200"
                >
                  <BsCoin className="text-[#9A7B24] dark:text-[#E8A94C]" size={15} />
                  {userData?.credits || 0}
                </button>

                <AnimatePresence>
                  {showCreditPopup && (
                    <motion.div
                      {...popoverMotion}
                      className="absolute right-0 sm:-right-8 w-64 sm:w-72 mt-3 origin-top-right bg-white/95 dark:bg-[#0F1115]/95 backdrop-blur-xl shadow-2xl rounded-2xl p-5 z-50 border border-[#E8E6E1] dark:border-[#232830] overflow-hidden"
                    >
                      <div className="relative flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#9A7B24]/12 dark:bg-[#E8A94C]/15 flex items-center justify-center text-[#9A7B24] dark:text-[#E8A94C]">
                          <BsCoin size={18} />
                        </div>
                        <div>
                          <p className="font-mono-studio text-[10px] tracking-wide uppercase text-[#5B636E] dark:text-[#8B92A0]">
                            Your balance
                          </p>
                          <p className="font-serif-display text-xl text-[#14171B] dark:text-[#EDEEF0] leading-none">
                            {userData?.credits || 0} credits
                          </p>
                        </div>
                      </div>
                      <p className="relative text-[#3E4650] dark:text-[#8B92A0] text-sm mb-4 leading-relaxed">
                        Each interview uses a small number of credits. Top up
                        anytime to keep practicing.
                      </p>
                      <button
                        onClick={() => navigate("/pricing")}
                        className="relative w-full cursor-pointer bg-[#C99E41] dark:bg-[#E8A94C] hover:opacity-90 text-[#14171B] dark:text-[#0A0B0D] py-2.5 px-4 rounded-xl font-medium transition shadow-md"
                      >
                        Purchase Credits
                      </button>
                      <p className="relative font-mono-studio text-[10px] text-[#9AA1AC] dark:text-[#565D68] text-center mt-3 tracking-wide">
                        PRACTICE HUB IS ALWAYS FREE
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                {userData ? (
                  <button
                    onClick={() => {
                      setShowUserPopup(!showUserPopup);
                      setShowCreditPopup(false);
                    }}
                    className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] rounded-full flex items-center justify-center font-semibold shadow-md ring-2 ring-[#FFFFFF] dark:ring-[#0C0E11] shrink-0 hover:scale-105 transition-transform duration-200"
                  >
                    {userData.name.charAt(0).toUpperCase()}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="cursor-pointer bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] text-sm font-semibold px-4 sm:px-5 py-2 rounded-full hover:opacity-90 transition shrink-0"
                  >
                    Sign in
                  </button>
                )}

                <AnimatePresence>
                  {showUserPopup && userData && (
                    <motion.div
                      {...popoverMotion}
                      className="absolute right-0 mt-3 w-60 sm:w-64 origin-top-right bg-white/95 dark:bg-[#0F1115]/95 backdrop-blur-xl shadow-2xl border border-[#E8E6E1] dark:border-[#232830] rounded-2xl overflow-hidden z-50"
                    >
                      <div className="relative px-5 pt-5 pb-4 bg-[#FAFAF9] dark:bg-[#0C0E11] border-b border-[#EFEEE9] dark:border-[#232830]">
                        <div className="relative flex items-center gap-3">
                          <div className="w-11 h-11 shrink-0 rounded-full bg-[#9A7B24]/12 dark:bg-[#E8A94C]/15 text-[#9A7B24] dark:text-[#E8A94C] flex items-center justify-center font-semibold text-lg">
                            {userData?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-serif-display text-[#14171B] dark:text-[#EDEEF0] truncate">
                              {userData?.name}
                            </p>
                            <p className="font-mono-studio text-[11px] text-[#5B636E] dark:text-[#8B92A0] flex items-center gap-1">
                              <BsCoin className="text-[#9A7B24] dark:text-[#E8A94C]" size={11} />
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
                          className="w-full cursor-pointer flex items-center gap-3 text-left text-sm px-3 py-2.5 rounded-xl hover:bg-[#F1F0EB] dark:hover:bg-[#181B20] text-[#2E343B] dark:text-[#C7CBD1] transition"
                        >
                          Practice Hub
                          <span className="font-mono-studio ml-auto text-[9px] tracking-wide px-1.5 py-0.5 rounded bg-[#9A7B24]/12 dark:bg-[#E8A94C]/12 text-[#9A7B24] dark:text-[#E8A94C]">
                            FREE
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setShowUserPopup(false);
                            navigate("/progress");
                          }}
                          className="w-full cursor-pointer flex items-center gap-3 text-left text-sm px-3 py-2.5 rounded-xl hover:bg-[#F1F0EB] dark:hover:bg-[#181B20] text-[#2E343B] dark:text-[#C7CBD1] transition"
                        >
                          <BsGraphUp size={15} className="text-[#9AA1AC] dark:text-[#8B92A0]" />
                          My Progress
                        </button>
                        <button
                          onClick={() => {
                            setShowUserPopup(false);
                            navigate("/history");
                          }}
                          className="w-full cursor-pointer flex items-center gap-3 text-left text-sm px-3 py-2.5 rounded-xl hover:bg-[#F1F0EB] dark:hover:bg-[#181B20] text-[#2E343B] dark:text-[#C7CBD1] transition"
                        >
                          <BsClockHistory size={15} className="text-[#9AA1AC] dark:text-[#8B92A0]" />
                          Interview History
                        </button>

                        <div className="h-px bg-[#EFEEE9] dark:bg-[#232830] my-1.5 mx-3" />

                        <button
                          onClick={handleLogout}
                          className="w-full cursor-pointer flex items-center gap-3 text-left text-sm px-3 py-2.5 rounded-xl hover:bg-red-900/20 text-red-400 transition"
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
export { BrandMark };
