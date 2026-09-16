import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import { BsRobot, BsCoin, BsClockHistory } from "react-icons/bs";
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
            className="w-full max-w-6xl bg-white/75 dark:bg-gray-900/70 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 dark:border-gray-800 px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex justify-between items-center relative transition-colors duration-300"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            >
              <div className="bg-linear-to-br from-green-500 to-emerald-600 text-white p-2 rounded-lg shadow-md shadow-green-900/20 shrink-0">
                <BsRobot size={18} />
              </div>
              <h2 className="font-display text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-tight whitespace-nowrap">
                InterviewIQ.AI
              </h2>
            </button>

            <div className="flex items-center gap-2 sm:gap-3 relative">
              <button
                onClick={toggleTheme}
                className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer flex items-center justify-center rounded-full bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition shrink-0"
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
                  className="flex items-center cursor-pointer gap-1.5 sm:gap-2 bg-gray-100/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <BsCoin className="text-amber-500" size={15} />
                  {userData?.credits || 0}
                </button>

                <AnimatePresence>
                  {showCreditPopup && (
                    <motion.div
                      {...popoverMotion}
                      className="absolute right-0 sm:-right-8 w-64 sm:w-72 mt-3 origin-top-right bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-2xl p-5 z-50 border border-gray-200/70 dark:border-gray-800"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-900/20">
                          <BsCoin size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Your balance
                          </p>
                          <p className="font-display text-xl font-semibold text-gray-900 dark:text-gray-50 leading-none">
                            {userData?.credits || 0} credits
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                        Each interview uses a small number of credits. Top up
                        anytime to keep practicing.
                      </p>
                      <button
                        onClick={() => navigate("/pricing")}
                        className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 px-4 rounded-xl font-medium transition shadow-md shadow-green-900/20"
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
                  className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer bg-linear-to-br from-gray-800 to-gray-950 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 rounded-full flex items-center justify-center font-semibold shadow-md ring-2 ring-white dark:ring-gray-900 shrink-0"
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
                      className="absolute right-0 mt-3 w-60 sm:w-64 origin-top-right bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/40 border border-gray-200/70 dark:border-gray-800 rounded-2xl overflow-hidden z-50"
                    >
                      <div className="px-5 pt-5 pb-4 bg-linear-to-br from-emerald-50 to-teal-50 dark:from-gray-800/60 dark:to-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 shrink-0 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-semibold text-lg shadow-md shadow-emerald-900/20">
                            {userData?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-display font-semibold text-gray-900 dark:text-gray-50 truncate">
                              {userData?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <BsCoin className="text-amber-500" size={11} />
                              {userData?.credits || 0} credits
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowUserPopup(false);
                            navigate("/history");
                          }}
                          className="w-full cursor-pointer flex items-center gap-3 text-left text-sm px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition"
                        >
                          <BsClockHistory size={15} className="text-gray-400" />
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