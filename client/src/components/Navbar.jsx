import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";
import { useTheme } from "../context/ThemeContext";

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
    <div className="bg-[#f3f3f3] dark:bg-gray-950 flex justify-center px-4 pt-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 px-8 py-4 flex justify-between items-center relative transition-colors duration-300"
      >
        <div className="flex items-center gap-3 pointer-cursor">
          <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <h2 className="text-lg font-semibold hidden md:block text-gray-800 dark:text-gray-100">
            InterviewIQ.AI
          </h2>
        </div>

        <div className="flex items-center gap-3 relative">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 cursor-pointer flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <HiOutlineSun size={18} />
            ) : (
              <HiOutlineMoon size={18} />
            )}
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
              className="flex items-center cursor-pointer gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-full text-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <BsCoin size={18} />
              {userData?.credits || 0}
            </button>

            {showCreditPopup && (
              <div className="absolute -right-12.5 w-64 mt-2 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 z-50 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-100 text-sm mb-4">
                  Need more credits? You can purchase additional credits to
                  continue using our services.
                </p>
                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded-lg"
                >
                  Purchase Credits
                </button>
              </div>
            )}
          </div>

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
              className="w-9 h-9 cursor-pointer bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-semibold"
            >
              {userData ? (
                userData.name.charAt(0).toUpperCase()
              ) : (
                <FaUserAstronaut size={18} />
              )}
            </button>
            {showUserPopup && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl p-4 z-50">
                <p className="text-md text-blue-500 dark:text-blue-400 font-medium mb-1">
                  {userData.name}
                </p>
                <button
                  onClick={() => {
                    navigate("/history");
                  }}
                  className="w-full cursor-pointer text-left text-sm py-2 hover:text-black dark:hover:text-white text-gray-600 dark:text-gray-300"
                >
                  Interview History
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left cursor-pointer text-sm py-2 flex items-center gap-2 text-red-500 dark:text-red-400"
                >
                  <HiOutlineLogout size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showAuth && <AuthModel onclose={() => setShowAuth(false)} />}
    </div>
  );
}

export default Navbar;
