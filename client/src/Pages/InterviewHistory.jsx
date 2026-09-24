import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ServerUrl } from "../App";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";

const formatScore = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return String(Math.round(n * 10) / 10);
};

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

  const completedInterviews = interviews.filter((i) => i.status === "Completed");
  const averageScore = (() => {
    if (!completedInterviews.length) return "—";
    const avg =
      completedInterviews.reduce((sum, i) => sum + (Number(i.finalScore) || 0), 0) /
      completedInterviews.length;
    return `${formatScore(avg)}/10`;
  })();
  const thisMonthCount = interviews.filter((i) => {
    const d = new Date(i.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: "Total interviews", value: interviews.length },
    { label: "Average score", value: averageScore },
    { label: "This month", value: thisMonthCount },
  ];

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

      <div className="history-root relative z-10 w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto py-12">
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
            className="mt-1 w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-[#131519] border border-[#EAE9E5] dark:border-[#232830] transition-all duration-200 cursor-pointer"
          >
            <FaArrowLeft className="text-[#5C6472] dark:text-[#9AA1AC]" size={14} />
          </motion.button>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#E8A94C] shrink-0" />
              <span className="font-mono-studio text-[10px] tracking-[0.24em] text-[#B27E2E] dark:text-[#E8A94C]">
                YOUR PROGRESS
              </span>
            </div>
            <h1 className="font-serif-display text-3xl md:text-4xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight">
              Interview History
            </h1>
            <p className="text-[#5C6472] dark:text-[#8B92A0] mt-2 text-sm">
              Track your past interviews and performance reports
            </p>
          </div>
        </motion.div>

        {!loading && !error && interviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-3 rounded-3xl border border-[#EAE9E5] dark:border-[#1E2229] overflow-hidden mb-8 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE9E5] dark:divide-[#1E2229]"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-[#111318] p-6"
              >
                <p className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8B92A0] mb-4">
                  {String(i + 1).padStart(2, "0")} · {stat.label.toUpperCase()}
                </p>
                <p className="font-serif-display text-4xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight">
                  {stat.value}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {deleteError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-4 flex items-start gap-3"
          >
            <span className="w-1.5 h-1.5 rotate-45 bg-red-500 shrink-0 mt-1.5" />
            <p className="text-red-700 dark:text-red-400 text-sm">{deleteError}</p>
          </motion.div>
        )}

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
            className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] p-10 rounded-[28px] text-center"
          >
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#F87171] shrink-0" />
              <p className="font-mono-studio text-[10px] tracking-[0.24em] text-[#F87171]">
                LOAD FAILED
              </p>
            </div>
            <p className="text-[#1C1F24] dark:text-[#EDEEF0] font-medium">
              {error}
            </p>
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => window.location.reload()}
              className="mt-6 bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] px-8 py-2.5 rounded-full font-medium text-sm cursor-pointer"
            >
              Retry
            </motion.button>
          </motion.div>
        ) : interviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] p-14 rounded-[28px] text-center"
          >
            <div className="flex items-center justify-center gap-2.5 mb-5">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#E8A94C] shrink-0" />
              <p className="font-mono-studio text-[10px] tracking-[0.24em] text-[#B27E2E] dark:text-[#E8A94C]">
                ARCHIVE EMPTY
              </p>
            </div>
            <p className="font-serif-display text-2xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight mb-2">
              No interviews found yet
            </p>
            <p className="text-[#9AA1AC] text-sm">
              Start your first interview to see it here.
            </p>
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/interview")}
              className="mt-6 bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] px-8 py-2.5 rounded-full font-medium text-sm cursor-pointer"
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
                  className={`group relative bg-white dark:bg-[#111318] p-6 rounded-3xl transition-all duration-300 border border-[#EAE9E5] dark:border-[#1E2229] ${
                    isCompleted
                      ? "cursor-pointer hover:border-[#E8A94C]/50"
                      : "cursor-not-allowed opacity-80"
                  } ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
                >
                  <div className="relative flex flex-col md:flex-row md:items-center gap-5">
                    <span className="font-mono-studio text-[11px] tracking-[0.18em] text-[#8B92A0] shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif-display text-xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight truncate">
                        {item.role}
                      </h3>

                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
                        <span
                          className={`font-mono-studio text-[10px] tracking-[0.14em] ${
                            item.mode === "Technical"
                              ? "text-[#B27E2E] dark:text-[#E8A94C]"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {String(item.mode || "").toUpperCase()}
                        </span>
                        {item.interviewType === "panel" && (
                          <span className="font-mono-studio text-[10px] tracking-[0.14em] text-[#2E8494] dark:text-[#5EC8D8]">
                            PANEL
                          </span>
                        )}
                        {item.company && (
                          <span className="text-sm text-[#5C6472] dark:text-[#9AA1AC]">
                            {item.company}
                          </span>
                        )}
                        <span className="font-mono-studio text-[11px] text-[#9AA1AC] dark:text-[#565D68]">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {item.experience && (
                        <p
                          title={item.experience}
                          className="mt-2 text-[13px] text-[#8B92A0] dark:text-[#7A828F] line-clamp-1"
                        >
                          {item.experience}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-5 md:gap-7 pl-8 md:pl-0 shrink-0">
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
                          <p className="font-mono-studio text-[9px] text-[#9AA1AC] mt-1 tracking-[0.18em]">
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
                        {String(item.status || "").toUpperCase()}
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={(e) => requestDelete(e, item._id)}
                        disabled={isDeleting}
                        title="Delete this interview"
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-[#EAE9E5] dark:border-[#262B34] text-[#9AA1AC] hover:text-[#F87171] hover:border-[#F87171]/40 hover:bg-[#F87171]/5 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                      >
                        <FaTrashAlt size={13} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

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
                className="w-full max-w-sm bg-white dark:bg-[#15181D] border border-[#EAE9E5] dark:border-[#262B34] rounded-3xl p-6"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#F87171] shrink-0" />
                  <p className="font-mono-studio text-[10px] tracking-[0.24em] text-[#F87171]">
                    CONFIRM DELETION
                  </p>
                </div>

                <h3 className="font-serif-display text-xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight mb-2">
                  Delete this interview?
                </h3>
                <p className="text-sm text-[#5C6472] dark:text-[#9AA1AC] leading-relaxed mb-6">
                  This will permanently remove it from your history, including
                  its report and score. This can't be undone.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 border border-[#EAE9E5] dark:border-[#262B34] text-[#3D4148] dark:text-[#C7CBD1] text-sm font-semibold py-2.5 rounded-xl hover:bg-[#F5F5F3] dark:hover:bg-[#1B1E24] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => confirmDelete(e, confirmDeleteId)}
                    disabled={deletingId === confirmDeleteId}
                    className="flex-1 bg-[#F87171] hover:bg-[#F05C5C] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-70 cursor-pointer"
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
