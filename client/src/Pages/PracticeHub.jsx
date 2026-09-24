import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import { BsSearch } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { ServerUrl } from "../App";

const DIFFICULTY_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" };

const CARD_BASE =
  "bg-white dark:bg-[#0F1115] border border-[#EAE9E5] dark:border-[#1E2229]";

function useCountUp(target, duration, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return val;
}

function QuestionCard({ q, onClick, index }) {
  const isCoding = q.type === "coding";
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`group text-left ${CARD_BASE} rounded-2xl p-5 sm:p-6 hover:border-[#E8A94C]/50 transition-all duration-200 flex flex-col gap-4 cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono-studio text-xs tracking-[0.2em] text-[#B27E2E] dark:text-[#E8A94C]">
          Q.{num}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`font-mono-studio text-[10px] tracking-[0.16em] border px-2 py-1 rounded-md ${
              isCoding
                ? "text-[#2E8494] dark:text-[#5EC8D8] border-[#5EC8D8]/30"
                : "text-[#6A5FBF] dark:text-[#B3A9F5] border-[#8B7FD6]/30"
            }`}
          >
            {isCoding ? "CODING" : "HR"}
          </span>
          {q.difficulty && (
            <span className="font-mono-studio text-[10px] tracking-[0.16em] text-[#8B92A0]">
              {(DIFFICULTY_LABEL[q.difficulty] || q.difficulty).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <p className="font-serif-display text-lg text-[#1C1F24] dark:text-[#EDEEF0] leading-snug line-clamp-3">
        {q.title}
      </p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#EAE9E5] dark:border-[#1E2229]">
        <span className="font-mono-studio text-[10px] tracking-wide text-[#8B92A0] capitalize">
          {q.category}
        </span>
        <span className="font-mono-studio text-xs tracking-[0.14em] text-[#9AA1AC] group-hover:text-[#E8A94C] transition-colors duration-200">
          OPEN <span className="inline-block group-hover:translate-x-1 transition-transform duration-200">→</span>
        </span>
      </div>
    </motion.button>
  );
}

function DailyChallengeCard({ daily, onClick }) {
  if (!daily) return null;

  const today = new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="relative w-full text-left bg-[#0C0E11] border border-[#232830] rounded-3xl p-7 sm:p-10 mb-8 group transition-all duration-200 hover:border-[#E8A94C]/60 cursor-pointer overflow-hidden"
    >
      <span className="pointer-events-none absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#E8A94C]/70 group-hover:border-[#E8A94C] transition-colors duration-300" />
      <span className="pointer-events-none absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#E8A94C]/70 group-hover:border-[#E8A94C] transition-colors duration-300" />
      <span className="pointer-events-none absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#E8A94C]/70 group-hover:border-[#E8A94C] transition-colors duration-300" />
      <span className="pointer-events-none absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#E8A94C]/70 group-hover:border-[#E8A94C] transition-colors duration-300" />

      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-[#E8A94C]/[0.07] to-transparent shine-sweep" />

      <span className="pointer-events-none absolute right-8 bottom-4 font-serif-display text-[8rem] sm:text-[9rem] leading-none text-white/5 select-none hidden sm:block float-soft">
        01
      </span>

      <div className="relative">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#E8A94C] shrink-0" />
            <span className="font-mono-studio text-[11px] tracking-[0.24em] text-[#E8A94C]">
              DAILY CHALLENGE
            </span>
            <span
              className={`font-mono-studio text-[10px] tracking-[0.16em] border px-2 py-1 rounded-md ${
                daily.type === "coding"
                  ? "text-[#5EC8D8] border-[#5EC8D8]/30"
                  : "text-[#B3A9F5] border-[#8B7FD6]/30"
              }`}
            >
              {daily.type === "coding" ? "CODING" : "HR"}
            </span>
          </div>
          <span className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8B92A0]">
            {today}
          </span>
        </div>

        <h3 className="font-serif-display text-2xl sm:text-4xl text-[#EDEEF0] tracking-tight leading-[1.15] line-clamp-3 max-w-3xl">
          {daily.title}
        </h3>

        <p className="text-xs text-[#8B92A0] mt-3 max-w-xl leading-relaxed">
          Same question for everyone today — solve it before midnight and keep
          the streak alive.
        </p>

        <div className="mt-7">
          {daily.completed ? (
            <span className="font-mono-studio inline-flex items-center gap-2.5 text-[#4ADE80] text-xs tracking-[0.14em] border border-[#4ADE80]/30 px-5 py-3 rounded-xl">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#4ADE80] shrink-0" />
              DONE — STREAK SAFE
            </span>
          ) : (
            <span className="font-mono-studio inline-flex items-center gap-3 bg-[#E8A94C] text-[#1C1F24] text-sm font-bold tracking-[0.08em] px-7 py-4 rounded-xl group-hover:gap-4.5 transition-all duration-200">
              START CHALLENGE
              <span>→</span>
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

const TICKER_ITEMS = [
  "DAILY REPS",
  "SHARPEN ANSWERS",
  "BUILD STREAKS",
  "CODING + HR",
  "INSTANT AI FEEDBACK",
  "NO CREDITS",
];

function Ticker() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-[#EAE9E5] dark:border-[#1E2229] mb-8 py-3 select-none"
    >
      <div className="ticker-track flex whitespace-nowrap w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center shrink-0">
            {TICKER_ITEMS.map((t) => (
              <span key={`${copy}-${t}`} className="flex items-center shrink-0">
                <span className="font-mono-studio text-[10px] tracking-[0.32em] text-[#8B92A0] px-7">
                  {t}
                </span>
                <span className="w-1.5 h-1.5 rotate-45 bg-[#E8A94C]/60 shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
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

  const animStreak = useCountUp(stats ? stats.currentStreak : 0, 900, !!stats);
  const animAttempts = useCountUp(stats ? stats.totalAttempts : 0, 1100, !!stats);
  const animAvg = useCountUp(stats ? stats.averageScore || 0 : 0, 1100, !!stats);

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

  const statItems = stats
    ? [
        {
          label: "Day streak",
          value: animStreak,
          suffix: stats.currentStreak === 1 ? "day" : "days",
        },
        { label: "Attempts", value: animAttempts, suffix: "total" },
        { label: "Average score", value: animAvg, suffix: "/ 10" },
      ]
    : [];

  return (
    <div className="min-h-screen relative bg-[#F7F6F3] dark:bg-[#0A0B0D] transition-colors duration-300 px-4 sm:px-6 pb-16 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

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

        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ticker-track { animation: tickerScroll 30s linear infinite; }

        @keyframes floatSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .float-soft { animation: floatSoft 7s ease-in-out infinite; }

        @keyframes shineSweep {
          0% { transform: translateX(-130%) skewX(-12deg); opacity: 0; }
          12% { opacity: 1; }
          45% { transform: translateX(340%) skewX(-12deg); opacity: 1; }
          60%, 100% { transform: translateX(340%) skewX(-12deg); opacity: 0; }
        }
        .shine-sweep { animation: shineSweep 7s ease-in-out infinite; }
      `}</style>

      <div className="film-grain" />

      <div className="practice-root relative z-10 max-w-6xl mx-auto">

        <div className="pt-6 sm:pt-10 mb-8">

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-6"
          >

            <motion.button
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate("/")}
              aria-label="Go back to home"
              className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-[#131519] border border-[#EAE9E5] dark:border-[#232830] transition-all duration-200 cursor-pointer"
            >
              <FaArrowLeft
                className="text-[#5C6472] dark:text-[#9AA1AC]"
                size={14}
              />
            </motion.button>

            <div className="flex items-center gap-2 min-w-0 bg-[#E8A94C]/8 border border-[#E8A94C]/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#E8A94C] shrink-0" />
              <span className="font-mono-studio text-[9px] sm:text-[11px] tracking-[0.08em] text-[#B27E2E] dark:text-[#E8A94C] whitespace-nowrap">
                PRACTICE HUB · FREE · UNLIMITED
              </span>
            </div>

          </motion.div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="min-w-0"
            >

              <h1 className="font-serif-display text-4xl sm:text-6xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight mb-4 leading-[1.04]">
                Sharpen one question{" "}
                <em className="text-[#B27E2E] dark:text-[#E8A94C]">
                  at a time.
                </em>
              </h1>

              <p className="text-sm text-[#5C6472] dark:text-[#8B92A0] max-w-xl leading-relaxed">
                No credits, no full mock interview — just pick a question and
                get instant AI feedback. Daily reps build interview muscle.
              </p>

            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
              onClick={practiceRandom}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              disabled={!allQuestions.length}
              className="shrink-0 w-full sm:w-auto bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] font-mono-studio text-xs font-bold tracking-[0.14em] px-7 py-4 rounded-2xl disabled:opacity-60 transition-all duration-200 cursor-pointer"
            >
              SURPRISE ME →
            </motion.button>

          </div>
        </div>

        <DailyChallengeCard
          daily={daily}
          onClick={() => daily && navigate(`/practice/${daily.type}/${daily.id}`)}
        />

        <Ticker />

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {statItems.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                className={`${CARD_BASE} relative rounded-3xl p-6 sm:p-7 overflow-hidden`}
              >
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                  className="absolute top-0 left-6 right-6 h-0.5 bg-[#E8A94C] origin-left"
                />
                <p className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8B92A0] mb-3">
                  {s.label.toUpperCase()}
                </p>
                <p className="font-serif-display text-5xl sm:text-6xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight leading-none">
                  {s.value}
                  <span className="font-mono-studio text-xs tracking-[0.14em] text-[#8B92A0] ml-2 align-middle">
                    {s.suffix.toUpperCase()}
                  </span>
                </p>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between gap-4 mb-5 pb-4 border-b-2 border-[#1C1F24] dark:border-[#EDEEF0]">
          <h2 className="font-serif-display text-2xl sm:text-3xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight">
            The question bank
          </h2>
          <span className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8B92A0] shrink-0">
            {String(filtered.length).padStart(2, "0")} QUESTIONS
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          <div className="relative flex-1 min-w-0">

            <BsSearch
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA1AC]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions or topics..."
              className="w-full bg-white dark:bg-[#0F1115] border border-[#EAE9E5] dark:border-[#1E2229] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1C1F24] dark:text-[#EDEEF0] placeholder-[#9AA1AC] outline-none focus:border-[#E8A94C]/50 transition"
            />

          </div>

          <div className="flex gap-2 overflow-x-auto">

            {["all", "coding", "hr"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`shrink-0 font-mono-studio text-xs px-3.5 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  typeFilter === t
                    ? "bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] border-transparent"
                    : "bg-white dark:bg-[#0F1115] text-[#5C6472] dark:text-[#8B92A0] border-[#EAE9E5] dark:border-[#1E2229] hover:border-[#E8A94C]/40"
                }`}
              >
                {t === "all" ? "All" : t === "coding" ? "Coding" : "HR"}
                <span className="opacity-50"> · {typeCount(t)}</span>
              </button>
            ))}

          </div>

          <select
            value={difficultyFilter}
            onChange={(e) =>
              setDifficultyFilter(e.target.value)
            }
            className="w-full sm:w-auto bg-white dark:bg-[#0F1115] border border-[#EAE9E5] dark:border-[#1E2229] rounded-xl px-3.5 py-2.5 text-sm text-[#1C1F24] dark:text-[#EDEEF0] outline-none focus:border-[#E8A94C]/50 transition cursor-pointer"
          >
            <option value="all">Any difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 text-red-700 dark:text-red-400 text-sm">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-white dark:bg-[#0F1115] border border-[#EAE9E5] dark:border-[#1E2229] animate-pulse"
              />
            ))}

          </div>
        ) : filtered.length ? (
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
        ) : (
          <div className="text-center py-20">

            <div className="flex items-center justify-center gap-2.5 mb-4">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#E8A94C] shrink-0" />
              <p className="font-mono-studio text-[10px] tracking-[0.24em] text-[#B27E2E] dark:text-[#E8A94C]">
                NO MATCHES
              </p>
            </div>

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
