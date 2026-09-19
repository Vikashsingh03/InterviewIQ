import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ServerUrl } from "../App";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import {
  BsClipboardData,
  BsCalendar3,
  BsBriefcase,
  BsChatDots,
} from "react-icons/bs";
import { IoSparklesSharp, IoWarningOutline } from "react-icons/io5";

// 4.666666666666667 -> "4.7", 7 -> "7", 2.4 -> "2.4"
const formatScore = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return String(Math.round(n * 10) / 10);
};

// colour tells you at a glance how the interview went
const scoreTone = (value) => {
  const n = Number(value) || 0;
  if (n >= 7) return "text-[#2E9C5A] dark:text-[#4ADE80]";
  if (n >= 4) return "text-[#B27E2E] dark:text-[#E8A94C]";
  return "text-[#E05252] dark:text-[#F87171]";
};

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await axios.get(
          ServerUrl + "/api/interview/get-interviews",
          { withCredentials: true },
        );
        setInterviews(result.data);
      } catch (err) {
        console.log(err);
        setError(
          err?.response?.data?.message ||
            "Couldn't load your interview history. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    getMyInterviews();
  }, []);


  const handleCardClick = (item) => {
    if (item.status !== "Completed") return;
    navigate(`/report/${item._id}`);
  };

  const requestDelete = (e, id) => {
    e.stopPropagation();
    setDeleteError("");
    setConfirmDeleteId(id);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  const confirmDelete = async (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    setDeleteError("");
    try {
      await axios.delete(ServerUrl + `/api/interview/delete/${id}`, {
        withCredentials: true,
      });
      setInterviews((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
      setDeleteError(
        err?.response?.data?.message ||
          "Couldn't delete this interview. Please try again.",
      );
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F7F6F3] dark:bg-[#0A0B0D] transition-colors duration-300 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .history-root, .history-root * { font-family: 'Manrope', sans-serif; }
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }

        .film-grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.025;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/rect%3E%3C/svg%3E");
          z-index: 0;
        }
      `}</style>

      <div className="film-grain" />

      {/* soft amber glow, replacing the old green blobs to match the brand accent */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-125 overflow-hidden z-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(232,169,76,0.10),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(94,200,216,0.08),transparent_35%)]"></div>
      </div>

      <div className="history-root relative z-10 w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 w-full flex items-start gap-4 flex-wrap"
        >
          <motion.button
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/")}
            className="mt-1 w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#131519]/90 backdrop-blur-md shadow-sm hover:shadow-md border border-[#EAE9E5] dark:border-[#232830] transition-all duration-200"
          >
            <FaArrowLeft className="text-[#5C6472] cursor-pointer dark:text-[#9AA1AC]" size={14} />
          </motion.button>

          <div>
            <span className="font-mono-studio inline-flex items-center gap-1.5 text-[11px] tracking-wide text-[#B27E2E] dark:text-[#E8A94C] bg-[#E8A94C]/10 border border-[#E8A94C]/25 px-3 py-1 rounded-full mb-3">
              <IoSparklesSharp size={11} />
              YOUR PROGRESS
            </span>
            <h1 className="font-serif-display text-3xl md:text-4xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight">
              Interview History
            </h1>
            <p className="text-[#5C6472] dark:text-[#8B92A0] mt-2 text-sm">
              Track your past interviews and performance reports
            </p>
          </div>
        </motion.div>

        {deleteError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-4 flex items-start gap-2"
          >
            <IoWarningOutline size={16} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-700 dark:text-red-400 text-sm">{deleteError}</p>
          </motion.div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-3xl bg-white/60 dark:bg-[#111318]/60 border border-[#EAE9E5] dark:border-[#1E2229] animate-pulse"
              ></div>
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/90 dark:bg-[#111318]/80 backdrop-blur-md border border-red-200 dark:border-red-900/40 p-10 rounded-[28px] shadow-sm text-center"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <IoWarningOutline size={24} />
            </div>
            <p className="text-[#1C1F24] dark:text-[#EDEEF0] font-medium">
              {error}
            </p>
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => window.location.reload()}
              className="mt-6 bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] px-8 py-2.5 rounded-full font-medium text-sm shadow-lg"
            >
              Retry
            </motion.button>
          </motion.div>
        ) : interviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/90 dark:bg-[#111318]/80 backdrop-blur-md border border-[#EAE9E5] dark:border-[#1E2229] p-14 rounded-[28px] shadow-sm text-center"
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#1C1F24] dark:bg-[#EDEEF0] flex items-center justify-center text-white dark:text-[#0A0B0D] shadow-lg">
              <BsClipboardData size={26} />
            </div>
            <p className="text-[#3D4148] dark:text-[#C7CBD1] font-medium">
              No interviews found yet
            </p>
            <p className="text-[#9AA1AC] text-sm mt-1">
              Start your first interview to see it here.
            </p>
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/interview")}
              className="mt-6 bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] px-8 py-2.5 rounded-full font-medium text-sm shadow-lg"
            >
              Start Interview
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-5">
            {interviews.map((item, index) => {
              const isCompleted = item.status === "Completed";
              const isDeleting = deletingId === item._id;

              return (
                <motion.div
                  key={item._id || index}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={isCompleted ? { y: -3 } : {}}
                  onClick={() => handleCardClick(item)}
                  title={
                    isCompleted
                      ? undefined
                      : "This interview wasn't finished, so no report is available."
                  }
                  className={`group relative bg-white/90 dark:bg-[#111318]/90 backdrop-blur-md p-6 rounded-3xl shadow-[0_20px_50px_-28px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_-28px_rgba(0,0,0,0.7)] transition-all duration-300 border border-[#EAE9E5] dark:border-[#1E2229] ${
                    isCompleted
                      ? "cursor-pointer hover:border-[#E8A94C]/40"
                      : "cursor-not-allowed opacity-80"
                  } ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
                >
                  {/* decorative glow lives in its own clipped layer — the
                      card itself must NOT have overflow-hidden, or the
                      delete-confirm popover below gets clipped/covered by
                      the next card in the list */}
                  {isCompleted && (
                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E8A94C]/0 group-hover:bg-[#E8A94C]/10 rounded-full blur-2xl transition-all duration-500"></div>
                    </div>
                  )}

                  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#1C1F24] dark:bg-[#EDEEF0] flex items-center justify-center text-white dark:text-[#0A0B0D] shadow-md group-hover:scale-105 transition-transform">
                        <BsBriefcase size={18} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif-display text-lg text-[#1C1F24] dark:text-[#EDEEF0] truncate">
                          {item.role}
                        </h3>

                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5">
                          <span className="text-[#5C6472] dark:text-[#9AA1AC] text-sm">
                            {item.mode}
                          </span>
                          {item.interviewType === "panel" && (
                            <span className="font-mono-studio text-[10px] tracking-wide px-2 py-0.5 rounded-md bg-[#5EC8D8]/10 text-[#2E8494] dark:text-[#5EC8D8]">
                              PANEL
                            </span>
                          )}
                          {item.company && (
                            <>
                              <span className="text-[#D8D6D0] dark:text-[#2A2F37]">
                                •
                              </span>
                              <span className="inline-flex items-center gap-1 text-[#5C6472] dark:text-[#9AA1AC] text-sm">
                                <BsBriefcase size={12} />
                                {item.company}
                              </span>
                            </>
                          )}
                          <span className="text-[#D8D6D0] dark:text-[#2A2F37]">
                            •
                          </span>
                          <span className="font-mono-studio inline-flex items-center gap-1 text-[#9AA1AC] dark:text-[#565D68] text-xs">
                            <BsCalendar3 size={11} />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* experience can be a whole pasted resume line, so
                            keep it to ONE line here; hover shows the full text */}
                        {item.experience && (
                          <p
                            title={item.experience}
                            className="mt-2 flex items-start gap-1.5 text-[#8B92A0] dark:text-[#7A828F] text-[13px]"
                          >
                            <BsChatDots size={12} className="shrink-0 mt-0.75" />
                            <span className="line-clamp-1">{item.experience}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-5 md:gap-7 pl-16 md:pl-0 shrink-0">
                      {isCompleted && (
                        <div className="text-right min-w-20">
                          <p
                            className={`font-mono-studio text-2xl font-bold ${scoreTone(item.finalScore)}`}
                          >
                            {formatScore(item.finalScore)}
                            <span className="text-sm text-[#9AA1AC] font-medium">
                              /10
                            </span>
                          </p>
                          <p className="text-[10px] text-[#9AA1AC] mt-0.5 tracking-wide">
                            OVERALL SCORE
                          </p>
                        </div>
                      )}

                      <span
                        className={`font-mono-studio px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap ${
                          isCompleted
                            ? "bg-[#4ADE80]/10 text-[#2E9C5A] dark:text-[#4ADE80]"
                            : "bg-[#E8A94C]/10 text-[#B27E2E] dark:text-[#E8A94C]"
                        }`}
                      >
                        {item.status}
                      </span>

                      {/* ---- delete control ---- */}
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={(e) => requestDelete(e, item._id)}
                        disabled={isDeleting}
                        title="Delete this interview"
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-[#EAE9E5] dark:border-[#262B34] text-[#9AA1AC] hover:text-[#F87171] hover:border-[#F87171]/40 hover:bg-[#F87171]/5 transition-all duration-200 disabled:opacity-50"
                      >
                        <FaTrashAlt className="cursor-pointer" size={13} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ---- delete-confirmation modal: fixed + centered so it can
             never clip off-screen, regardless of which card (or how far
             down the scrolled list) triggered it ---- */}
        <AnimatePresence>
          {confirmDeleteId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={cancelDelete}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm cursor-pointer bg-white dark:bg-[#15181D] border border-[#EAE9E5] dark:border-[#262B34] rounded-3xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.4)] p-6"
              >
                <div className="w-12 h-12 cursor-pointer rounded-2xl bg-[#F87171]/10 flex items-center justify-center text-[#F87171] mb-4">
                  <FaTrashAlt size={18}  className="cursor-pointer"/>
                </div>

                <h3 className="font-serif-display text-xl text-[#1C1F24] dark:text-[#EDEEF0] mb-2">
                  Delete this interview?
                </h3>
                <p className="text-sm text-[#5C6472] dark:text-[#9AA1AC] leading-relaxed mb-6">
                  This will permanently remove it from your history, including
                  its report and score. This can't be undone.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 border cursor-pointer border-[#EAE9E5] dark:border-[#262B34] text-[#3D4148] dark:text-[#C7CBD1] text-sm font-semibold py-2.5 rounded-xl hover:bg-[#F5F5F3] dark:hover:bg-[#1B1E24] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => confirmDelete(e, confirmDeleteId)}
                    disabled={deletingId === confirmDeleteId}
                    className="flex-1 bg-[#F87171] cursor-pointer hover:bg-[#F05C5C] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-70"
                  >
                    {deletingId === confirmDeleteId ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewHistory;