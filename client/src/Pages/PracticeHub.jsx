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
} from "react-icons/bs";
import { FaCalendarDay } from "react-icons/fa";
import { ServerUrl } from "../App";
import { FaArrowLeft } from "react-icons/fa";


const DIFFICULTY_STYLES = {
  easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  medium:
    "bg-[#E8A94C]/10 text-[#B27E2E] dark:text-[#E8A94C] border-[#E8A94C]/20",
  hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

const DIFFICULTY_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" };

function StatPill({ label, value }) {
  return (
    <div className="bg-white dark:bg-[#0F1115] border border-[#EAE9E5] dark:border-[#1E2229] rounded-2xl px-5 py-4 flex-1 min-w-30">
      <p className="font-mono-studio text-[10px] tracking-wide uppercase text-[#8B92A0] mb-1">
        {label}
      </p>

      <p className="font-serif-display text-2xl text-[#1C1F24] dark:text-[#EDEEF0]">
        {value}
      </p>
    </div>
  );
}

function QuestionCard({ q, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="text-left bg-white dark:bg-[#0F1115] border border-[#EAE9E5] dark:border-[#1E2229] rounded-2xl p-5 hover:border-[#E8A94C]/40 hover:shadow-[0_12px_30px_-16px_rgba(232,169,76,0.3)] transition-all duration-200 flex flex-col gap-3"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`font-mono-studio inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] tracking-wide ${
            q.type === "coding"
              ? "bg-[#5EC8D8]/10 text-[#2E8494] dark:text-[#5EC8D8] border-[#5EC8D8]/20"
              : "bg-[#8B7FD6]/10 text-[#6A5FBF] dark:text-[#B3A9F5] border-[#8B7FD6]/20"
          }`}
        >
          {q.type === "coding" ? (
            <BsCode size={10} />
          ) : (
            <BsChatSquareText size={10} />
          )}

          {q.type === "coding" ? "Coding" : "HR"}
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

      <p className="font-serif-display text-base text-[#1C1F24] dark:text-[#EDEEF0] leading-snug line-clamp-2">
        {q.title}
      </p>

      <div className="flex items-center justify-between mt-1 cursor-pointer">
        <span className="text-xs text-[#8B92A0]">{q.category}</span>

        <BsArrowRight size={14} className="text-[#9AA1AC]" />
      </div>
    </motion.button>
  );
}

function DailyChallengeCard({ daily, onClick }) {
  if (!daily) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="w-full text-left relative overflow-hidden bg-[#0F1115] border border-[#232830] rounded-2xl p-5 sm:p-6 mb-6 group transition-all duration-200 hover:border-[#E8A94C]/40"
    >
      <div className="absolute -top-14 -right-14 w-40 h-40 bg-[#E8A94C]/0 group-hover:bg-[#E8A94C]/10 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />

      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#E8A94C]/10 text-[#E8A94C] flex items-center justify-center">
            <FaCalendarDay size={16} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono-studio text-[10px] tracking-wide text-[#E8A94C] uppercase">
                Daily Challenge
              </span>
              <span
                className={`font-mono-studio inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] tracking-wide ${
                  daily.type === "coding"
                    ? "bg-[#5EC8D8]/10 text-[#5EC8D8]"
                    : "bg-[#E8A94C]/10 text-[#E8A94C]"
                }`}
              >
                {daily.type === "coding" ? <BsCode size={9} /> : <BsChatSquareText size={9} />}
                {daily.type === "coding" ? "Coding" : "HR"}
              </span>
            </div>
            <h3 className="font-serif-display text-lg sm:text-xl text-[#EDEEF0] leading-snug truncate">
              {daily.title}
            </h3>
          </div>
        </div>

        <div className="shrink-0">
          {daily.completed ? (
            <span className="font-mono-studio inline-flex items-center gap-2 text-[#4ADE80] text-xs bg-[#4ADE80]/10 px-4 py-2.5 rounded-xl">
              <BsCheckCircleFill size={13} />
              Completed today
            </span>
          ) : (
            <span className="font-mono-studio inline-flex items-center gap-2 bg-[#E8A94C] text-[#1C1F24] text-xs font-semibold px-4 py-2.5 rounded-xl group-hover:gap-3 transition-all duration-200">
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

  return (
    <div className="min-h-screen relative bg-[#F7F6F3] dark:bg-[#0A0B0D] transition-colors duration-300 px-4 sm:px-6 pb-16">
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
      `}</style>

      <div className="practice-root max-w-6xl mx-auto">

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
              "
            >
              <FaArrowLeft
                className="text-[#5C6472] dark:text-[#9AA1AC]"
                size={14}
              />
            </motion.button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#E8A94C] shrink-0" />

              <span
                className="
                  font-mono-studio
                  text-[9px]
                  sm:text-[11px]
                  tracking-[0.06em]
                  sm:tracking-[0.08em]
                  text-[#E8A94C]
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

              <h1 className="font-serif-display text-3xl sm:text-4xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight mb-2">
                Sharpen one question at a time
              </h1>

              <p className="text-sm text-[#5C6472] dark:text-[#8B92A0] max-w-xl leading-relaxed">
                No credits, no full mock interview — just pick a question and
                get instant AI feedback. Great for daily reps.
              </p>

            </div>

            <motion.button
              onClick={practiceRandom}
              whileHover={{ scale: 1.02 }}
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
                px-5 py-3
                rounded-2xl
                shadow-lg
                disabled:opacity-60
                transition
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
              value={`${stats.currentStreak} ${
                stats.currentStreak === 1 ? "day" : "days"
              }`}
            />

            <StatPill
              label="Total attempts"
              value={stats.totalAttempts}
            />

            <StatPill
              label="Average score"
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
                  transition
                  ${
                    typeFilter === t
                      ? "bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] border-transparent"
                      : "bg-white dark:bg-[#0F1115] text-[#5C6472] dark:text-[#8B92A0] border-[#EAE9E5] dark:border-[#1E2229]"
                  }
                `}
              >
                {t === "all"
                  ? "All"
                  : t === "coding"
                  ? "Coding"
                  : "HR"}
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
                  h-32
                  rounded-2xl
                  bg-white dark:bg-[#0F1115]
                  border border-[#EAE9E5] dark:border-[#1E2229]
                  animate-pulse
                "
              />
            ))}

          </div>
        ) : filtered.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {filtered.map((q) => (
              <QuestionCard
                key={`${q.type}-${q.id}`}
                q={q}
                onClick={() => openQuestion(q)}
              />
            ))}

          </div>
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