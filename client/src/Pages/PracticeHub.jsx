import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import {
  BsLightningCharge,
  BsCode,
  BsChatSquareText,
  BsFire,
  BsSearch,
  BsArrowRight,
  BsCheckCircleFill,
  BsGraphUp,
  BsListCheck,
} from "react-icons/bs";
import { FaCalendarDay, FaArrowLeft } from "react-icons/fa";
import { ServerUrl } from "../App";

const DIFFICULTY_STYLES = {
  easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  medium:
    "bg-[#E8A94C]/10 text-[#B27E2E] dark:text-[#E8A94C] border-[#E8A94C]/20",
  hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

const DIFFICULTY_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" };

const CARD_BASE =
  "bg-white dark:bg-[#0F1115] border border-[#EAE9E5] dark:border-[#1E2229]";

function StatPill({ label, value, icon, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${CARD_BASE} rounded-2xl px-5 py-4 flex items-center gap-4 flex-1 min-w-30 shadow-[0_16px_40px_-30px_rgba(0,0,0,0.35)]`}
    >
      <div
        className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${accent}1A`, color: accent }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-mono-studio text-[10px] tracking-wide uppercase text-[#8B92A0] mb-0.5">
          {label}
        </p>
        <p className="font-serif-display text-2xl text-[#1C1F24] dark:text-[#EDEEF0] leading-none">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function QuestionCard({ q, onClick, index }) {
  const isCoding = q.type === "coding";
  const accent = isCoding ? "#5EC8D8" : "#8B7FD6";

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.25) }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative text-left ${CARD_BASE} rounded-2xl p-5 pl-6 hover:border-[#E8A94C]/40 hover:shadow-[0_18px_40px_-20px_rgba(232,169,76,0.35)] transition-all duration-200 flex flex-col gap-3 cursor-pointer overflow-hidden`}
    >
      {/* left accent rail — tells coding vs HR at a glance */}
      <span
        className="absolute left-0 top-5 bottom-5 w-0.75 rounded-r-full opacity-70 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: accent }}
      />
      {/* hover glow */}
      <span className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl bg-[#E8A94C]/0 group-hover:bg-[#E8A94C]/12 transition-all duration-500" />

      <div className="relative flex items-center gap-2 flex-wrap">
        <span
          className={`font-mono-studio inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] tracking-wide ${
            isCoding
              ? "bg-[#5EC8D8]/10 text-[#2E8494] dark:text-[#5EC8D8] border-[#5EC8D8]/20"
              : "bg-[#8B7FD6]/10 text-[#6A5FBF] dark:text-[#B3A9F5] border-[#8B7FD6]/20"
          }`}
        >
          {isCoding ? <BsCode size={10} /> : <BsChatSquareText size={10} />}
          {isCoding ? "Coding" : "HR"}
        </span>

        {q.difficulty && (
          <span
            className={`font-mono-studio px-2 py-0.5 rounded-md border text-[10px] tracking-wide ${
              DIFFICULTY_STYLES[q.difficulty] ||
              "bg-[#EFEEEA] dark:bg-[#181B20] text-[#6B7280] border-transparent"
            }`}
          >
            {DIFFICULTY_LABEL[q.difficulty] || q.difficulty}
          </span>
        )}
      </div>

      <p className="relative font-serif-display text-base text-[#1C1F24] dark:text-[#EDEEF0] leading-snug line-clamp-2">
        {q.title}
      </p>

      <div className="relative flex items-center justify-between mt-auto pt-1">
        <span className="font-mono-studio text-[10px] tracking-wide text-[#8B92A0] capitalize">
          {q.category}
        </span>
        <span className="w-7 h-7 rounded-full flex items-center justify-center bg-[#EFEEEA] dark:bg-[#181B20] text-[#9AA1AC] group-hover:bg-[#E8A94C] group-hover:text-[#1C1F24] transition-all duration-200">
          <BsArrowRight size={12} />
        </span>
      </div>
    </motion.button>
  );
}

function DailyChallengeCard({ daily, onClick }) {
  if (!daily) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="w-full text-left relative overflow-hidden bg-[#0C0E11] border border-[#232830] rounded-3xl p-6 sm:p-7 mb-6 group transition-all duration-200 hover:border-[#E8A94C]/50 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.7)] cursor-pointer"
    >
      {/* blueprint mesh + glow, same language as the setup screen */}
      <span className="pointer-events-none absolute inset-0 daily-mesh" />
      <span className="pointer-events-none absolute -top-20 -right-16 w-56 h-56 bg-[#E8A94C]/10 group-hover:bg-[#E8A94C]/20 rounded-full blur-3xl transition-all duration-500" />
      <span className="pointer-events-none absolute -bottom-24 -left-12 w-52 h-52 bg-[#5EC8D8]/8 rounded-full blur-3xl" />

      <div className="relative flex items-center justify-between gap-5 flex-wrap">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#E8A94C]/12 border border-[#E8A94C]/25 text-[#E8A94C] flex items-center justify-center">
            <FaCalendarDay size={17} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A94C] live-dot" />
              <span className="font-mono-studio text-[10px] tracking-widest text-[#E8A94C] uppercase">
                Daily Challenge
              </span>
              <span
                className={`font-mono-studio inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] tracking-wide ${
                  daily.type === "coding"
                    ? "bg-[#5EC8D8]/10 text-[#5EC8D8]"
                    : "bg-[#8B7FD6]/10 text-[#B3A9F5]"
                }`}
              >
                {daily.type === "coding" ? (
                  <BsCode size={9} />
                ) : (
                  <BsChatSquareText size={9} />
                )}
                {daily.type === "coding" ? "Coding" : "HR"}
              </span>
            </div>
            <h3 className="font-serif-display text-lg sm:text-2xl text-[#EDEEF0] leading-snug line-clamp-2">
              {daily.title}
            </h3>
            <p className="text-[11px] text-[#8B92A0] mt-1.5">
              Same question for everyone today — keep the streak alive.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {daily.completed ? (
            <span className="font-mono-studio inline-flex items-center gap-2 text-[#4ADE80] text-xs bg-[#4ADE80]/10 border border-[#4ADE80]/25 px-4 py-2.5 rounded-xl">
              <BsCheckCircleFill size={13} />
              Completed today
            </span>
          ) : (
            <span className="font-mono-studio inline-flex items-center gap-2 bg-linear-to-br from-[#F4C97A] to-[#E8A94C] text-[#1C1F24] text-xs font-bold px-5 py-3 rounded-xl shadow-[0_10px_28px_-10px_rgba(232,169,76,0.6)] group-hover:gap-3.5 transition-all duration-200">
              Start Challenge
              <BsArrowRight size={13} />
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function PracticeHub() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [coding, setCoding] = useState([]);
  const [hr, setHr] = useState([]);
  const [stats, setStats] = useState(null);
  const [daily, setDaily] = useState(null);

  const [typeFilter, setTypeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const [questionsRes, statsRes, dailyRes] = await Promise.all([
          axios.get(ServerUrl + "/api/practice/questions", {
            withCredentials: true,
          }),

          axios.get(ServerUrl + "/api/practice/stats", {
            withCredentials: true,
          }),

          axios.get(ServerUrl + "/api/practice/daily", {
            withCredentials: true,
          }),
        ]);

        setCoding(questionsRes.data.coding || []);
        setHr(questionsRes.data.hr || []);
        setStats(statsRes.data);
        setDaily(dailyRes.data);
      } catch (error) {
        console.log(error);

        setErrorMessage(
          error?.response?.data?.message ||
            "Couldn't load practice questions. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const allQuestions = useMemo(() => [...coding, ...hr], [coding, hr]);

  const filtered = useMemo(() => {
    return allQuestions.filter((q) => {
      if (typeFilter !== "all" && q.type !== typeFilter) return false;

      if (
        difficultyFilter !== "all" &&
        q.difficulty !== difficultyFilter
      ) {
        return false;
      }

      if (
        search.trim() &&
        !q.title.toLowerCase().includes(search.trim().toLowerCase()) &&
        !q.category?.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [allQuestions, typeFilter, difficultyFilter, search]);

  const openQuestion = (q) =>
    navigate(`/practice/${q.type}/${q.id}`);

  const practiceRandom = () => {
    const pool = filtered.length ? filtered : allQuestions;

    if (!pool.length) return;

    const random =
      pool[Math.floor(Math.random() * pool.length)];

    openQuestion(random);
  };

  const typeCount = (t) =>
    t === "all"
      ? allQuestions.length
      : allQuestions.filter((q) => q.type === t).length;

  return (
    <div className="min-h-screen relative bg-[#F7F6F3] dark:bg-[#0A0B0D] transition-colors duration-300 px-4 sm:px-6 pb-16 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .practice-root,
        .practice-root * {
          font-family: 'Manrope', sans-serif;
        }

        .font-serif-display {
          font-family: 'Fraunces', serif;
          font-optical-sizing: auto;
        }

        .font-mono-studio {
          font-family: 'JetBrains Mono', monospace;
        }

        .film-grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.025;
          mix-blend-mode: overlay;
          z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/rect%3E%3C/svg%3E");
        }

        /* fine diagonal hairline mesh inside the daily-challenge card */
        .daily-mesh {
          opacity: 0.6;
          background-image:
            linear-gradient(115deg, rgba(232,169,76,0.05) 1px, transparent 1px),
            linear-gradient(25deg, rgba(94,200,216,0.04) 1px, transparent 1px);
          background-size: 30px 30px;
          mask-image: radial-gradient(ellipse at 25% 20%, black 0%, transparent 75%);
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(232,169,76,0.5); }
          50% { opacity: 0.5; box-shadow: 0 0 0 4px rgba(232,169,76,0); }
        }
        .live-dot { animation: livePulse 1.8s ease-in-out infinite; }
      `}</style>

      <div className="film-grain" />

      {/* ambient brand glow behind the header */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-125 z-0"
        style={{
          background:
            "radial-gradient(circle at 12% 0%, rgba(232,169,76,0.12), transparent 42%), radial-gradient(circle at 88% 0%, rgba(94,200,216,0.09), transparent 40%)",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      />

      <div className="practice-root relative z-10 max-w-6xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="pt-6 sm:pt-10 mb-8">

          {/* Back Button + Practice Hub - Same Line */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5">

            <motion.button
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate("/")}
              aria-label="Go back to home"
              className="
                w-10 h-10
                sm:w-11 sm:h-11
                shrink-0
                flex items-center justify-center
                rounded-full
                bg-white/90 dark:bg-[#131519]/90
                backdrop-blur-md
                shadow-sm hover:shadow-md
                border border-[#EAE9E5] dark:border-[#232830]
                transition-all duration-200
                cursor-pointer
              "
            >
              <FaArrowLeft
                className="text-[#5C6472] dark:text-[#9AA1AC]"
                size={14}
              />
            </motion.button>

            <div className="flex items-center gap-2 min-w-0 bg-[#E8A94C]/8 border border-[#E8A94C]/20 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#E8A94C] shrink-0 live-dot" />

              <span
                className="
                  font-mono-studio
                  text-[9px]
                  sm:text-[11px]
                  tracking-[0.06em]
                  sm:tracking-[0.08em]
                  text-[#B27E2E] dark:text-[#E8A94C]
                  whitespace-nowrap
                "
              >
                PRACTICE HUB · FREE · UNLIMITED
              </span>
            </div>

          </div>

          {/* Main Heading + Surprise Button */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

            <div className="min-w-0">

              <h1 className="font-serif-display text-3xl sm:text-5xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight mb-3 leading-[1.08]">
                Sharpen one question
                <br className="hidden sm:block" /> at a time
              </h1>

              <p className="text-sm text-[#5C6472] dark:text-[#8B92A0] max-w-xl leading-relaxed">
                No credits, no full mock interview — just pick a question and
                get instant AI feedback. Great for daily reps.
              </p>

            </div>

            <motion.button
              onClick={practiceRandom}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              disabled={!allQuestions.length}
              className="
                shrink-0
                w-full sm:w-auto
                flex items-center justify-center
                gap-2
                bg-[#1C1F24] dark:bg-[#EDEEF0]
                text-white dark:text-[#0A0B0D]
                font-semibold
                px-6 py-3.5
                rounded-2xl
                shadow-[0_14px_36px_-12px_rgba(0,0,0,0.45)]
                disabled:opacity-60
                transition-all duration-200
                cursor-pointer
              "
            >
              <BsLightningCharge size={15} />
              Surprise me
            </motion.button>

          </div>
        </div>

        {/* ================= DAILY CHALLENGE ================= */}
        <DailyChallengeCard
          daily={daily}
          onClick={() => daily && navigate(`/practice/${daily.type}/${daily.id}`)}
        />

        {/* ================= STATS ================= */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">

            <StatPill
              label="Current streak"
              icon={<BsFire size={16} />}
              accent="#E8A94C"
              value={`${stats.currentStreak} ${
                stats.currentStreak === 1 ? "day" : "days"
              }`}
            />

            <StatPill
              label="Total attempts"
              icon={<BsListCheck size={16} />}
              accent="#5EC8D8"
              value={stats.totalAttempts}
            />

            <StatPill
              label="Average score"
              icon={<BsGraphUp size={16} />}
              accent="#4ADE80"
              value={`${stats.averageScore || 0}/10`}
            />

          </div>
        )}

        {/* ================= FILTERS ================= */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          {/* Search */}
          <div className="relative flex-1 min-w-0">

            <BsSearch
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA1AC]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions or topics..."
              className="
                w-full
                bg-white dark:bg-[#0F1115]
                border border-[#EAE9E5] dark:border-[#1E2229]
                rounded-xl
                pl-10 pr-4 py-2.5
                text-sm
                text-[#1C1F24] dark:text-[#EDEEF0]
                placeholder-[#9AA1AC]
                outline-none
                focus:border-[#E8A94C]/50
                focus:ring-4
                focus:ring-[#E8A94C]/10
                transition
              "
            />

          </div>

          {/* Type Filters */}
          <div className="flex gap-2 overflow-x-auto">

            {["all", "coding", "hr"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`
                  shrink-0
                  font-mono-studio
                  text-xs
                  px-3.5 py-2.5
                  rounded-xl
                  border
                  transition-all duration-200
                  cursor-pointer
                  ${
                    typeFilter === t
                      ? "bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] border-transparent shadow-[0_8px_20px_-10px_rgba(0,0,0,0.5)]"
                      : "bg-white dark:bg-[#0F1115] text-[#5C6472] dark:text-[#8B92A0] border-[#EAE9E5] dark:border-[#1E2229] hover:border-[#E8A94C]/40"
                  }
                `}
              >
                {t === "all" ? "All" : t === "coding" ? "Coding" : "HR"}
                <span className="opacity-50"> · {typeCount(t)}</span>
              </button>
            ))}

          </div>

          {/* Difficulty — values match the backend's lowercase casing */}
          <select
            value={difficultyFilter}
            onChange={(e) =>
              setDifficultyFilter(e.target.value)
            }
            className="
              w-full sm:w-auto
              bg-white dark:bg-[#0F1115]
              border border-[#EAE9E5] dark:border-[#1E2229]
              rounded-xl
              px-3.5 py-2.5
              text-sm
              text-[#1C1F24] dark:text-[#EDEEF0]
              outline-none
              focus:border-[#E8A94C]/50
              transition
              cursor-pointer
            "
          >
            <option value="all">Any difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

        </div>

        {/* ================= ERROR ================= */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 text-red-700 dark:text-red-400 text-sm">
            {errorMessage}
          </div>
        )}

        {/* ================= QUESTIONS ================= */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="
                  h-36
                  rounded-2xl
                  bg-white dark:bg-[#0F1115]
                  border border-[#EAE9E5] dark:border-[#1E2229]
                  animate-pulse
                "
              />
            ))}

          </div>
        ) : filtered.length ? (
          <>
            <p className="font-mono-studio text-[10px] tracking-wide text-[#8B92A0] uppercase mb-3">
              {filtered.length} question{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((q, i) => (
                <QuestionCard
                  key={`${q.type}-${q.id}`}
                  q={q}
                  index={i}
                  onClick={() => openQuestion(q)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">

            <BsFire
              size={28}
              className="mx-auto text-[#9AA1AC] mb-3"
            />

            <p className="text-[#5C6472] dark:text-[#8B92A0] text-sm">
              No questions match those filters. Try clearing them.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default PracticeHub;