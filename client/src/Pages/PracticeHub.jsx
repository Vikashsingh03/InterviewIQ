import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import { BsSearch } from "react-icons/bs";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaRegCircle,
  FaChevronRight,
} from "react-icons/fa";
import { ServerUrl } from "../App";

const DIFFICULTY_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" };

const DIFFICULTY_STYLE = {
  easy: "text-[#2E9C5A] dark:text-[#4ADE80] border-[#2E9C5A]/30 dark:border-[#4ADE80]/30",
  medium:
    "text-[#9A7B24] dark:text-[#E8A94C] border-[#9A7B24]/30 dark:border-[#E8A94C]/30",
  hard: "text-[#E05252] dark:text-[#F06A6A] border-[#E05252]/30 dark:border-[#F06A6A]/30",
};

const CARD_BASE =
  "bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830]";

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

function useMidnightCountdown() {
  const [left, setLeft] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const ms = Math.max(0, end - now);
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setLeft(
        String(h).padStart(2, "0") +
          ":" +
          String(m).padStart(2, "0") +
          ":" +
          String(s).padStart(2, "0"),
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

function StatusIcon({ state }) {
  if (state === "solved") {
    return (
      <FaCheckCircle
        size={16}
        className="text-[#2E9C5A] dark:text-[#4ADE80] shrink-0"
      />
    );
  }
  if (state === "attempted") {
    return (
      <FaRegCircle
        size={16}
        className="text-[#9A7B24] dark:text-[#E8A94C] shrink-0"
      />
    );
  }
  return (
    <span className="w-4 h-4 shrink-0 rounded-full bg-[#D8D4CC] dark:bg-[#2B3138]" />
  );
}

function DsaRow({ q, index, state, onClick }) {
  const num = String(index + 1).padStart(2, "0");
  const companies = q.companies || [];
  const visible = companies.slice(0, 3);
  const extra = companies.length - visible.length;
  const accent =
    q.difficulty === "easy"
      ? "bg-[#2E9C5A] dark:bg-[#4ADE80]"
      : q.difficulty === "hard"
        ? "bg-[#E05252] dark:bg-[#F06A6A]"
        : "bg-[#C99E41] dark:bg-[#E8A94C]";

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.45) }}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.995 }}
      className={`group relative w-full text-left ${CARD_BASE} rounded-xl px-4 sm:px-5 py-4 hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 hover:shadow-[0_18px_44px_-20px_rgba(154,123,36,0.35)] transition-all duration-200 cursor-pointer shadow-[0_12px_36px_-24px_rgba(20,23,27,0.18)] overflow-hidden`}
    >
      <span
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
      />
      <div className="flex items-center gap-3 sm:gap-4">
        <StatusIcon state={state} />
        <span className="font-mono-studio text-xs tracking-[0.18em] text-[#9A7B24] dark:text-[#E8A94C] shrink-0 hidden sm:inline">
          {num}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-serif-display text-base sm:text-lg text-[#14171B] dark:text-[#EDEEF0] leading-snug truncate group-hover:text-[#9A7B24] dark:group-hover:text-[#E8A94C] transition-colors duration-200">
            {q.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="font-mono-studio text-[10px] tracking-[0.14em] text-[#8A929C] dark:text-[#8B92A0] capitalize">
              {q.topic}
            </span>
            <span
              className={`font-mono-studio text-[10px] tracking-[0.14em] border px-2 py-0.5 rounded-md ${
                DIFFICULTY_STYLE[q.difficulty] || DIFFICULTY_STYLE.medium
              }`}
            >
              {(DIFFICULTY_LABEL[q.difficulty] || q.difficulty).toUpperCase()}
            </span>
            {visible.map((c) => (
              <span
                key={c}
                className="font-mono-studio text-[10px] tracking-widest text-[#5B636E] dark:text-[#9AA1AC] bg-[#F1EFE9] dark:bg-[#161A1F] border border-[#E8E6E1] dark:border-[#232830] px-2 py-0.5 rounded-md"
              >
                {c.toUpperCase()}
              </span>
            ))}
            {extra > 0 && (
              <span className="font-mono-studio text-[10px] tracking-widest text-[#8A929C] dark:text-[#8B92A0]">
                +{extra}
              </span>
            )}
          </div>
        </div>
        <FaChevronRight
          size={12}
          className="text-[#C9C4B8] dark:text-[#3A4048] group-hover:text-[#9A7B24] dark:group-hover:text-[#E8A94C] group-hover:translate-x-1 transition-all duration-200 shrink-0"
        />
      </div>
    </motion.button>
  );
}

function QuestionCard({ q, onClick, index }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`group text-left ${CARD_BASE} rounded-2xl p-5 sm:p-6 hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 transition-all duration-200 flex flex-col gap-4 cursor-pointer shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono-studio text-xs tracking-[0.2em] text-[#9A7B24] dark:text-[#E8A94C]">
          Q.{num}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono-studio text-[10px] tracking-[0.16em] border px-2 py-1 rounded-md text-[#6A5FBF] dark:text-[#B3A9F5] border-[#6A5FBF]/30 dark:border-[#8B7FD6]/30">
            HR
          </span>
          {q.difficulty && (
            <span className="font-mono-studio text-[10px] tracking-[0.16em] text-[#8A929C] dark:text-[#8B92A0]">
              {(DIFFICULTY_LABEL[q.difficulty] || q.difficulty).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <p className="font-serif-display text-lg text-[#14171B] dark:text-[#EDEEF0] leading-snug line-clamp-3">
        {q.title}
      </p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#E8E6E1] dark:border-[#232830]">
        <span className="font-mono-studio text-[10px] tracking-wide text-[#8A929C] dark:text-[#8B92A0] capitalize">
          {q.category}
        </span>
        <span className="font-mono-studio text-xs tracking-[0.14em] text-[#8A929C] dark:text-[#9AA1AC] group-hover:text-[#9A7B24] dark:group-hover:text-[#E8A94C] transition-colors duration-200">
          OPEN{" "}
          <span className="inline-block group-hover:translate-x-1 transition-transform duration-200">
            →
          </span>
        </span>
      </div>
    </motion.button>
  );
}

function DailyChallengeCard({ daily, onClick }) {
  const countdown = useMidnightCountdown();
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
      className="relative w-full text-left bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-3xl p-7 sm:p-10 mb-8 group transition-all duration-200 hover:border-[#9A7B24]/60 dark:hover:border-[#E8A94C]/60 cursor-pointer overflow-hidden shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]"
    >
      <span className="pointer-events-none absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#9A7B24]/70 dark:border-[#E8A94C]/70 group-hover:border-[#9A7B24] dark:group-hover:border-[#E8A94C] transition-colors duration-300" />
      <span className="pointer-events-none absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#9A7B24]/70 dark:border-[#E8A94C]/70 group-hover:border-[#9A7B24] dark:group-hover:border-[#E8A94C] transition-colors duration-300" />
      <span className="pointer-events-none absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#9A7B24]/70 dark:border-[#E8A94C]/70 group-hover:border-[#9A7B24] dark:group-hover:border-[#E8A94C] transition-colors duration-300" />
      <span className="pointer-events-none absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#9A7B24]/70 dark:border-[#E8A94C]/70 group-hover:border-[#9A7B24] dark:group-hover:border-[#E8A94C] transition-colors duration-300" />

      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-[#9A7B24]/[0.07] dark:via-[#E8A94C]/[0.07] to-transparent shine-sweep" />

      <span className="pointer-events-none absolute right-8 bottom-4 font-serif-display italic text-[8rem] sm:text-[9rem] leading-none text-[#14171B]/5 dark:text-white/5 select-none hidden sm:block float-soft">
        01
      </span>

      <div className="relative">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#C99E41] dark:bg-[#E8A94C] shrink-0" />
            <span className="font-mono-studio text-[11px] tracking-[0.24em] text-[#9A7B24] dark:text-[#E8A94C]">
              DAILY CHALLENGE
            </span>
            <span
              className={`font-mono-studio text-[10px] tracking-[0.16em] border px-2 py-1 rounded-md ${
                daily.type === "coding"
                  ? "text-[#2E8494] dark:text-[#5EC8D8] border-[#2E8494]/30 dark:border-[#5EC8D8]/30"
                  : "text-[#6A5FBF] dark:text-[#B3A9F5] border-[#6A5FBF]/30 dark:border-[#8B7FD6]/30"
              }`}
            >
              {daily.type === "coding" ? "CODING" : "HR"}
            </span>
          </div>
          <span className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#8B92A0]">
            {today}
          </span>
          {!daily.completed && (
            <span className="flex items-center gap-2 font-mono-studio text-[10px] tracking-[0.2em] text-[#9A7B24] dark:text-[#E8A94C] bg-[#9A7B24]/8 dark:bg-[#E8A94C]/8 border border-[#9A7B24]/25 dark:border-[#E8A94C]/25 px-3 py-1.5 rounded-full">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-[#C99E41] dark:bg-[#E8A94C] opacity-60 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[#C99E41] dark:bg-[#E8A94C]" />
              </span>
              ENDS IN {countdown}
            </span>
          )}
        </div>

        <h3 className="font-serif-display text-2xl sm:text-4xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight leading-[1.15] line-clamp-3 max-w-3xl">
          {daily.title}
        </h3>

        <p className="text-xs text-[#5B636E] dark:text-[#8B92A0] mt-3 max-w-xl leading-relaxed">
          Same question for everyone today — solve it before midnight and keep
          the streak alive.
        </p>

        <div className="mt-7">
          {daily.completed ? (
            <span className="font-mono-studio inline-flex items-center gap-2.5 text-[#2E9C5A] dark:text-[#4ADE80] text-xs tracking-[0.14em] border border-[#2E9C5A]/30 dark:border-[#4ADE80]/30 px-5 py-3 rounded-full">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#2E9C5A] dark:bg-[#4ADE80] shrink-0" />
              DONE — STREAK SAFE
            </span>
          ) : (
            <span className="font-mono-studio inline-flex items-center gap-3 bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] text-sm font-bold tracking-[0.08em] px-7 py-4 rounded-full group-hover:opacity-90 group-hover:gap-4.5 transition-all duration-200">
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
  "47 PROBLEMS",
  "COMPANY TAGS",
  "TOPIC TRACKS",
  "HIDDEN TESTS",
  "ZERO CREDITS",
  "BUILD STREAKS",
];

function Ticker() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-[#E8E6E1] dark:border-[#232830] mb-8 py-3 select-none"
    >
      <div className="ticker-track flex whitespace-nowrap w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center shrink-0">
            {TICKER_ITEMS.map((t) => (
              <span key={`${copy}-${t}`} className="flex items-center shrink-0">
                <span className="font-mono-studio text-[10px] tracking-[0.32em] text-[#8A929C] dark:text-[#8B92A0] px-7">
                  {t}
                </span>
                <span className="w-1.5 h-1.5 rotate-45 bg-[#9A7B24]/60 dark:bg-[#E8A94C]/60 shrink-0" />
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
  const [topicsMeta, setTopicsMeta] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [totalCoding, setTotalCoding] = useState(0);
  const [stats, setStats] = useState(null);
  const [daily, setDaily] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [solvedCount, setSolvedCount] = useState(0);

  const [tab, setTab] = useState("dsa");
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [unsolvedOnly, setUnsolvedOnly] = useState(false);
  const [search, setSearch] = useState("");

  const animSolved = useCountUp(solvedCount, 1100, !loading);
  const animStreak = useCountUp(stats ? stats.currentStreak : 0, 900, !!stats);
  const animAttempts = useCountUp(stats ? stats.totalAttempts : 0, 1100, !!stats);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const [questionsRes, statsRes, dailyRes, progressRes] = await Promise.all([
          axios.get(ServerUrl + "/api/practice/questions", {
            withCredentials: true,
          }),
          axios.get(ServerUrl + "/api/practice/stats", {
            withCredentials: true,
          }),
          axios.get(ServerUrl + "/api/practice/daily", {
            withCredentials: true,
          }),
          axios.get(ServerUrl + "/api/practice/dsa-progress", {
            withCredentials: true,
          }),
        ]);

        setCoding(questionsRes.data.coding || []);
        setHr(questionsRes.data.hr || []);
        setTopicsMeta(questionsRes.data.topics || []);
        setCompaniesList(questionsRes.data.companies || []);
        setTotalCoding(questionsRes.data.totalCoding || 0);
        setStats(statsRes.data);
        setDaily(dailyRes.data);

        const map = {};
        (progressRes.data.progress || []).forEach((p) => {
          map[p.id] = p;
        });
        setProgressMap(map);
        setSolvedCount(progressRes.data.solvedCount || 0);
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

  const dsaFiltered = useMemo(() => {
    return coding.filter((q) => {
      if (topicFilter !== "all" && q.topic !== topicFilter) return false;
      if (difficultyFilter !== "all" && q.difficulty !== difficultyFilter)
        return false;
      if (
        companyFilter !== "all" &&
        !(q.companies || []).includes(companyFilter)
      )
        return false;
      if (unsolvedOnly && progressMap[q.id]?.solved) return false;
      if (search.trim()) {
        const s = search.trim().toLowerCase();
        if (
          !q.title.toLowerCase().includes(s) &&
          !q.topic.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [coding, topicFilter, difficultyFilter, companyFilter, unsolvedOnly, search, progressMap]);

  const hrFiltered = useMemo(() => {
    return hr.filter((q) => {
      if (difficultyFilter !== "all" && q.difficulty !== difficultyFilter)
        return false;
      if (search.trim()) {
        const s = search.trim().toLowerCase();
        if (
          !q.title.toLowerCase().includes(s) &&
          !q.category?.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [hr, difficultyFilter, search]);

  const openQuestion = (type, id) => navigate(`/practice/${type}/${id}`);

  const practiceRandom = () => {
    const pool = dsaFiltered.length ? dsaFiltered : coding;
    if (!pool.length) return;
    const unsolved = pool.filter((q) => !progressMap[q.id]?.solved);
    const pickFrom = unsolved.length ? unsolved : pool;
    const random = pickFrom[Math.floor(Math.random() * pickFrom.length)];
    openQuestion("coding", random.id);
  };

  const solvedPct = totalCoding
    ? Math.round((solvedCount / totalCoding) * 100)
    : 0;

  const statCards = [
    {
      label: "Solved",
      value: animSolved,
      suffix: `/ ${totalCoding}`,
      bar: true,
    },
    {
      label: "Day streak",
      value: animStreak,
      suffix: stats && stats.currentStreak === 1 ? "day" : "days",
    },
    { label: "Attempts", value: animAttempts, suffix: "total" },
  ];

  const stateFor = (id) => {
    const p = progressMap[id];
    if (!p) return "untouched";
    if (p.solved) return "solved";
    if (p.attempted) return "attempted";
    return "untouched";
  };

  return (
    <div className="min-h-screen relative bg-[#FAFAF9] dark:bg-[#0A0B0D] transition-colors duration-300 px-4 sm:px-6 pb-16 overflow-hidden">
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

        @keyframes gradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes auroraDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4%, -6%) scale(1.08); }
          66% { transform: translate(-5%, 4%) scale(0.96); }
        }
        .aurora-orb {
          position: fixed;
          border-radius: 9999px;
          pointer-events: none;
          z-index: 0;
          animation: auroraDrift 18s ease-in-out infinite;
        }
      `}</style>

      <div className="film-grain" />
      <div
        aria-hidden="true"
        className="aurora-orb w-2xl h-168 -top-40 -left-40 bg-[#C99E41]/[0.07] dark:bg-[#E8A94C]/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="aurora-orb w-xl h-144 top-1/3 -right-48 bg-[#2E8494]/6 dark:bg-[#5EC8D8]/4 blur-3xl"
        style={{ animationDelay: "-6s" }}
      />
      <div
        aria-hidden="true"
        className="aurora-orb w-120 h-120 -bottom-40 left-1/4 bg-[#9A7B24]/5 dark:bg-[#E8A94C]/3 blur-3xl"
        style={{ animationDelay: "-12s" }}
      />

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
              className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] transition-all duration-200 cursor-pointer"
            >
              <FaArrowLeft className="text-[#5B636E] dark:text-[#9AA1AC]" size={14} />
            </motion.button>

            <div className="flex items-center gap-2 min-w-0 bg-[#9A7B24]/8 dark:bg-[#E8A94C]/8 border border-[#9A7B24]/20 dark:border-[#E8A94C]/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#C99E41] dark:bg-[#E8A94C] shrink-0" />
              <span className="font-mono-studio text-[9px] sm:text-[11px] tracking-[0.08em] text-[#9A7B24] dark:text-[#E8A94C] whitespace-nowrap">
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
              <h1 className="font-serif-display text-4xl sm:text-6xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight mb-4 leading-[1.04]">
                DSA{" "}
                <em className="bg-linear-to-r from-[#9A7B24] via-[#C99E41] to-[#9A7B24] dark:from-[#E8A94C] dark:via-[#F5D48A] dark:to-[#E8A94C] bg-clip-text text-transparent bg-size-[200%_auto] animate-[gradientShift_6s_linear_infinite]">
                  Preparation
                </em>
              </h1>
              <p className="text-sm text-[#3E4650] dark:text-[#8B92A0] max-w-xl leading-relaxed">
                {totalCoding || 47} problems. Company tags. Hidden test cases. Zero
                credits — grind like it's the real round.
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
              onClick={practiceRandom}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              disabled={!coding.length}
              className="shrink-0 w-full sm:w-auto bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-mono-studio text-xs font-bold tracking-[0.14em] px-7 py-4 rounded-full disabled:opacity-60 hover:opacity-90 transition-all duration-200 cursor-pointer"
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className={`${CARD_BASE} relative rounded-3xl p-6 sm:p-7 overflow-hidden shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]`}
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                className="absolute top-0 left-6 right-6 h-0.5 bg-[#C99E41] dark:bg-[#E8A94C] origin-left"
              />
              <p className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8A929C] dark:text-[#8B92A0] mb-3">
                {s.label.toUpperCase()}
              </p>
              <p className="font-serif-display text-5xl sm:text-6xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight leading-none">
                {s.value}
                <span className="font-mono-studio text-xs tracking-[0.14em] text-[#8A929C] dark:text-[#8B92A0] ml-2 align-middle">
                  {String(s.suffix).toUpperCase()}
                </span>
              </p>
              {s.bar && (
                <div className="mt-4 h-1 rounded-full bg-[#EDEBE4] dark:bg-[#1B2026] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${solvedPct}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="h-full rounded-full bg-[#C99E41] dark:bg-[#E8A94C]"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-1 mb-6 border-b border-[#E8E6E1] dark:border-[#232830]">
          {[
            { id: "dsa", label: "DSA" },
            { id: "hr", label: "HR QUESTIONS" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative font-mono-studio text-xs font-bold tracking-[0.18em] px-4 sm:px-6 py-3.5 cursor-pointer transition-colors duration-200 ${
                tab === t.id
                  ? "text-[#14171B] dark:text-[#EDEEF0]"
                  : "text-[#8A929C] dark:text-[#565D68] hover:text-[#3E4650] dark:hover:text-[#9AA1AC]"
              }`}
            >
              {t.label}
              {t.id === "dsa" && (
                <span className="opacity-50"> · {totalCoding || "—"}</span>
              )}
              {t.id === "hr" && (
                <span className="opacity-50"> · {hr.length || "—"}</span>
              )}
              {tab === t.id && (
                <motion.span
                  layoutId="hub-tab-underline"
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#C99E41] dark:bg-[#E8A94C] rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {tab === "dsa" && (
          <div>
            <div className="flex items-end justify-between gap-4 mb-5 pb-4 border-b-2 border-[#14171B] dark:border-[#EDEEF0]">
              <h2 className="font-serif-display text-2xl sm:text-3xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight">
                The DSA bank
              </h2>
              <span className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#8B92A0] shrink-0">
                {String(dsaFiltered.length).padStart(2, "0")} /{" "}
                {String(coding.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <button
                onClick={() => setTopicFilter("all")}
                className={`font-mono-studio text-xs px-3.5 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                  topicFilter === "all"
                    ? "bg-[#14171B] dark:bg-[#EDEEF0] text-[#FAFAF9] dark:text-[#0A0B0D] border-transparent"
                    : "bg-white dark:bg-[#0C0E11] text-[#3E4650] dark:text-[#8B92A0] border-[#E8E6E1] dark:border-[#232830] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50"
                }`}
              >
                ALL
              </button>
              {topicsMeta.map((t) => (
                <button
                  key={t.topic}
                  onClick={() => setTopicFilter(t.topic)}
                  className={`font-mono-studio text-xs px-3.5 py-2 rounded-full border transition-all duration-200 cursor-pointer capitalize ${
                    topicFilter === t.topic
                      ? "bg-[#14171B] dark:bg-[#EDEEF0] text-[#FAFAF9] dark:text-[#0A0B0D] border-transparent"
                      : "bg-white dark:bg-[#0C0E11] text-[#3E4650] dark:text-[#8B92A0] border-[#E8E6E1] dark:border-[#232830] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50"
                  }`}
                >
                  {t.topic}
                  <span className="opacity-50"> · {t.total}</span>
                </button>
              ))}
              <button
                onClick={() => setUnsolvedOnly((v) => !v)}
                className={`font-mono-studio text-xs px-3.5 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                  unsolvedOnly
                    ? "bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] border-transparent font-bold"
                    : "bg-white dark:bg-[#0C0E11] text-[#3E4650] dark:text-[#8B92A0] border-[#E8E6E1] dark:border-[#232830] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50"
                }`}
              >
                UNSOLVED ONLY
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 min-w-0">
                <BsSearch
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A929C] dark:text-[#9AA1AC]"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search problems or topics..."
                  className="w-full bg-white dark:bg-[#111318] border border-[#E8E6E1] dark:border-[#232830] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#14171B] dark:text-[#EDEEF0] placeholder:text-[#8A929C] dark:placeholder:text-[#565D68] focus:border-[#9A7B24] dark:focus:border-[#E8A94C] focus:outline-none transition"
                />
              </div>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full sm:w-auto bg-white dark:bg-[#111318] border border-[#E8E6E1] dark:border-[#232830] rounded-xl px-3.5 py-2.5 text-sm text-[#14171B] dark:text-[#EDEEF0] focus:border-[#9A7B24] dark:focus:border-[#E8A94C] focus:outline-none transition cursor-pointer"
              >
                <option value="all">Any difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full sm:w-auto bg-white dark:bg-[#111318] border border-[#E8E6E1] dark:border-[#232830] rounded-xl px-3.5 py-2.5 text-sm text-[#14171B] dark:text-[#EDEEF0] focus:border-[#9A7B24] dark:focus:border-[#E8A94C] focus:outline-none transition cursor-pointer max-w-full"
              >
                <option value="all">All companies</option>
                {companiesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {errorMessage && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 text-red-700 dark:text-red-400 text-sm">
                {errorMessage}
              </div>
            )}

            {loading ? (
              <div className="flex flex-col gap-2.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-xl bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] animate-pulse"
                  />
                ))}
              </div>
            ) : dsaFiltered.length ? (
              <div className="flex flex-col gap-2.5">
                {dsaFiltered.map((q, i) => (
                  <DsaRow
                    key={q.id}
                    q={q}
                    index={i}
                    state={stateFor(q.id)}
                    onClick={() => openQuestion("coding", q.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="flex items-center justify-center gap-2.5 mb-4">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#C99E41] dark:bg-[#E8A94C] shrink-0" />
                  <p className="font-mono-studio text-[10px] tracking-[0.24em] text-[#9A7B24] dark:text-[#E8A94C]">
                    NO MATCHES
                  </p>
                </div>
                <p className="text-[#3E4650] dark:text-[#8B92A0] text-sm">
                  No problems match those filters. Try clearing them.
                </p>
              </div>
            )}
          </div>
        )}

        {tab === "hr" && (
          <div>
            <div className="flex items-end justify-between gap-4 mb-5 pb-4 border-b-2 border-[#14171B] dark:border-[#EDEEF0]">
              <h2 className="font-serif-display text-2xl sm:text-3xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight">
                HR questions
              </h2>
              <span className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#8B92A0] shrink-0">
                {String(hrFiltered.length).padStart(2, "0")} QUESTIONS
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 min-w-0">
                <BsSearch
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A929C] dark:text-[#9AA1AC]"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search questions or categories..."
                  className="w-full bg-white dark:bg-[#111318] border border-[#E8E6E1] dark:border-[#232830] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#14171B] dark:text-[#EDEEF0] placeholder:text-[#8A929C] dark:placeholder:text-[#565D68] focus:border-[#9A7B24] dark:focus:border-[#E8A94C] focus:outline-none transition"
                />
              </div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full sm:w-auto bg-white dark:bg-[#111318] border border-[#E8E6E1] dark:border-[#232830] rounded-xl px-3.5 py-2.5 text-sm text-[#14171B] dark:text-[#EDEEF0] focus:border-[#9A7B24] dark:focus:border-[#E8A94C] focus:outline-none transition cursor-pointer"
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
                    className="h-44 rounded-2xl bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] animate-pulse"
                  />
                ))}
              </div>
            ) : hrFiltered.length ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hrFiltered.map((q, i) => (
                  <QuestionCard
                    key={q.id}
                    q={q}
                    index={i}
                    onClick={() => openQuestion("hr", q.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="flex items-center justify-center gap-2.5 mb-4">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#C99E41] dark:bg-[#E8A94C] shrink-0" />
                  <p className="font-mono-studio text-[10px] tracking-[0.24em] text-[#9A7B24] dark:text-[#E8A94C]">
                    NO MATCHES
                  </p>
                </div>
                <p className="text-[#3E4650] dark:text-[#8B92A0] text-sm">
                  No questions match those filters. Try clearing them.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PracticeHub;
