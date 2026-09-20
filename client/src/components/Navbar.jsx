import React, { useEffect, useState } from "react";
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

// desktop-only quick links — mobile keeps them in the profile popover
// so the bar never gets crowded on small screens
const NAV_LINKS = [
  { label: "Practice", path: "/practice" },
  { label: "Progress", path: "/progress" },
  { label: "History", path: "/history" },
  { label: "Pricing", path: "/pricing" },
];

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showAuth, setShowAuth] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // the bar tightens and gains a stronger edge once the page scrolls —
  // purely cosmetic, makes it read as "floating" rather than pinned
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
        <div
          className={`relative flex justify-center px-3 sm:px-4 transition-all duration-300 ${
            scrolled ? "pt-2.5 sm:pt-3 pb-2.5" : "pt-4 sm:pt-6 pb-3 sm:pb-4"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-full max-w-6xl bg-white/75 dark:bg-[#0F1115]/80 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-[#1E2229] px-4 sm:px-6 md:px-8 flex justify-between items-center relative transition-all duration-300 ${
              scrolled
                ? "py-2.5 sm:py-3 shadow-[0_14px_44px_-18px_rgba(0,0,0,0.28)] dark:shadow-[0_14px_44px_-18px_rgba(0,0,0,0.75)]"
                : "py-3 sm:py-4 shadow-[0_10px_40px_-16px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_-16px_rgba(0,0,0,0.6)]"
            }`}
          >
            {/* thin amber hairline along the top edge of the bar */}
            <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-[#E8A94C]/40 to-transparent" />

            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0"
            >
              <div className="bg-[#1C1F24] dark:bg-[#E8A94C] text-[#E8A94C] dark:text-[#0A0B0D] p-2 rounded-lg shadow-md shadow-black/10 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <BsRobot size={18} />
              </div>
              <h2 className="font-serif-display text-base sm:text-lg text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight whitespace-nowrap">
                InterviewIQ.AI
              </h2>
            </button>

            {/* ---- desktop quick links ---- */}
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
                        ? "text-[#1C1F24] dark:text-[#EDEEF0]"
                        : "text-[#5C6472] dark:text-[#8B92A0] hover:text-[#1C1F24] dark:hover:text-[#EDEEF0]"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-[#E8A94C]/12 border border-[#E8A94C]/25"
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
                className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer flex items-center justify-center rounded-full bg-[#F0EFEA]/80 dark:bg-[#181B20] text-[#5C6472] dark:text-[#C7CBD1] hover:bg-[#E5E4E0] dark:hover:bg-[#232830] hover:scale-105 transition-all duration-200 shrink-0"
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
                  className="flex items-center cursor-pointer gap-1.5 sm:gap-2 bg-[#F0EFEA]/80 dark:bg-[#181B20] text-[#1C1F24] dark:text-[#EDEEF0] px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono-studio font-medium hover:bg-[#E5E4E0] dark:hover:bg-[#232830] border border-transparent hover:border-[#E8A94C]/30 transition-all duration-200"
                >
                  <BsCoin className="text-[#E8A94C]" size={15} />
                  {userData?.credits || 0}
                </button>

                <AnimatePresence>
                  {showCreditPopup && (
                    <motion.div
                      {...popoverMotion}
                      className="absolute right-0 sm:-right-8 w-64 sm:w-72 mt-3 origin-top-right bg-white/95 dark:bg-[#0F1115]/95 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/50 rounded-2xl p-5 z-50 border border-[#EAE9E5] dark:border-[#1E2229] overflow-hidden"
                    >
                      <span className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#E8A94C]/10 blur-3xl" />
                      <div className="relative flex items-center gap-3 mb-3">
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
                      <p className="relative text-[#5C6472] dark:text-[#8B92A0] text-sm mb-4 leading-relaxed">
                        Each interview uses a small number of credits. Top up
                        anytime to keep practicing.
                      </p>
                      <button
                        onClick={() => navigate("/pricing")}
                        className="relative w-full cursor-pointer bg-[#1C1F24] dark:bg-[#EDEEF0] hover:opacity-90 text-white dark:text-[#0A0B0D] py-2.5 px-4 rounded-xl font-medium transition shadow-md"
                      >
                        Purchase Credits
                      </button>
                      <p className="relative font-mono-studio text-[10px] text-[#9AA1AC] text-center mt-3 tracking-wide">
                        PRACTICE HUB IS ALWAYS FREE
                      </p>
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
                  className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer bg-[#1C1F24] dark:bg-[#EDEEF0] text-[#E8A94C] dark:text-[#0A0B0D] rounded-full flex items-center justify-center font-semibold shadow-md ring-2 ring-white dark:ring-[#0F1115] shrink-0 hover:scale-105 transition-transform duration-200"
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
                      <div className="relative px-5 pt-5 pb-4 bg-[#FAFAF8] dark:bg-[#0C0E11] border-b border-[#EAE9E5] dark:border-[#1E2229] overflow-hidden">
                        <span className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#E8A94C]/10 blur-2xl" />
                        <div className="relative flex items-center gap-3">
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
                          <span className="font-mono-studio ml-auto text-[9px] tracking-wide px-1.5 py-0.5 rounded bg-[#E8A94C]/12 text-[#B27E2E] dark:text-[#E8A94C]">
                            FREE
                          </span>
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

                        <div className="h-px bg-[#EAE9E5] dark:bg-[#1E2229] my-1.5 mx-3" />

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