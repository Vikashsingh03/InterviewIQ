import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ServerUrl } from "../App";
import { FaArrowLeft } from "react-icons/fa";
import {
  BsClipboardData,
  BsCalendar3,
  BsBriefcase,
  BsChatDots,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await axios.get(
          ServerUrl + "/api/interview/get-interviews",
          { withCredentials: true },
        );
        setInterviews(result.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getMyInterviews();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f3f3f3] dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      {/* background glow blobs, matching Home page */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-125 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(16,185,129,0.14),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(20,184,166,0.12),transparent_35%)]"></div>
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-green-300/25 dark:bg-green-700/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob"></div>
        <div className="absolute top-20 -right-24 w-80 h-80 bg-emerald-300/25 dark:bg-emerald-700/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 w-full flex items-start gap-4 flex-wrap"
        >
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/")}
            className="mt-1 p-3.5 rounded-full bg-white/80 dark:bg-gray-900/70 backdrop-blur-md shadow-sm hover:shadow-md border border-white/60 dark:border-gray-800 transition cursor-pointer"
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
          </motion.button>

          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
              <HiSparkles size={12} />
              YOUR PROGRESS
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 flex-nowrap">
              Interview History
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Track your past interviews and performance reports
            </p>
          </div>
        </motion.div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-3xl bg-white/60 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 animate-pulse"
              ></div>
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md border border-white/60 dark:border-gray-800 p-14 rounded-3xl shadow-sm text-center"
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-900/20">
              <BsClipboardData size={26} />
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              No interviews found yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Start your first interview to see it here.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/interview")}
              className="mt-6 bg-black dark:bg-white text-white dark:text-black px-8 py-2.5 rounded-full font-medium text-sm shadow-lg"
            >
              Start Interview
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-5">
            {interviews.map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => navigate(`/report/${item._id}`)}
                className="group relative bg-white/80 dark:bg-gray-900/70 backdrop-blur-md p-6 rounded-3xl shadow-sm hover:shadow-[0_0_40px_-15px_rgba(16,185,129,0.4)] transition-all duration-300 cursor-pointer border border-white/60 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-900/50 overflow-hidden"
              >
                {/* subtle accent glow on hover */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/0 group-hover:bg-emerald-400/10 dark:group-hover:bg-emerald-500/10 rounded-full blur-2xl transition-all duration-500"></div>

                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-green-900/20 group-hover:scale-105 transition-transform">
                      <BsBriefcase size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {item.role}
                      </h3>
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                          <BsChatDots size={13} />
                          {item.experience}
                        </span>
                        <span className="text-gray-300 dark:text-gray-700">
                          •
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {item.mode}
                        </span>
                        <span className="text-gray-300 dark:text-gray-700">
                          •
                        </span>
                        <span className="inline-flex items-center gap-1 text-gray-400 dark:text-gray-500 text-sm">
                          <BsCalendar3 size={12} />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 md:gap-8 pl-16 md:pl-0">
                    <div className="text-right">
                      <p className="text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        {item.finalScore || 0}
                        <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                          /10
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        Overall Score
                      </p>
                    </div>

                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        item.status === "Completed"
                          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                          : "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;
