import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import { BsSearch } from "react-icons/bs";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaDice,
  FaFire,
  FaRedoAlt,
  FaRegCircle,
} from "react-icons/fa";
import { ServerUrl } from "../App";

const DIFFICULTY_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" };

const DIFFICULTY_COLOR = {
  easy: "#00b8a3",
  medium: "#ffc01e",
  hard: "#ff375f",
};

const DIFFICULTY_TEXT = {
  easy: "text-[#00b8a3]",
  medium: "text-[#ffc01e]",
  hard: "text-[#ff375f]",
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

function useEasedFloat(duration, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, active]);
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
      <motion.span
        key="solved"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 18 }}
        className="shrink-0 flex"
      >
        <FaCheckCircle size={17} className="text-[#00b8a3]" />
      </motion.span>
    );
  }
  if (state === "attempted") {
    return (
      <motion.span
        key="attempted"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 18 }}
        className="shrink-0 flex"
      >
        <FaRegCircle size={17} className="text-[#E8A94C]" />
      </motion.span>
    );
  }
  return (
    <span className="w-4.25 h-4.25 shrink-0 rounded-full border-2 border-[#D8D4CC] dark:border-[#2B3138]" />
  );
}

const RING_R = 62;
const RING_C = 2 * Math.PI * RING_R;

function ProgressRing({ solved, total, diffSolved, diffTotals, active }) {
  const ease = useEasedFloat(1500, active);
  const animSolved = useCountUp(solved, 1400, active);
  const segs = [
    { key: "easy", color: DIFFICULTY_COLOR.easy },
    { key: "medium", color: DIFFICULTY_COLOR.medium },
    { key: "hard", color: DIFFICULTY_COLOR.hard },
  ];
  let accFrac = 0;
  const arcs = segs.map((s) => {
    const frac = total ? (diffSolved[s.key] || 0) / total : 0;
    const start = accFrac;
    accFrac += frac;
    return {
      key: s.key,
      color: s.color,
      len: RING_C * frac * ease,
      off: -RING_C * start * ease,
    };
  });

  return (
    <div>
      <div className="relative w-52 h-52 sm:w-56 sm:h-56 mx-auto">
        <svg viewBox="0 0 156 156" className="w-full h-full">
          <circle
            cx="78"
            cy="78"
            r={RING_R}
            fill="none"
            strokeWidth="13"
            className="stroke-[#EFEDE7] dark:stroke-[#171B21]"
          />
          {arcs.map((a) => (
            <circle
              key={a.key}
              cx="78"
              cy="78"
              r={RING_R}
              fill="none"
              stroke={a.color}
              strokeWidth="13"
              strokeLinecap="butt"
              strokeDasharray={`${a.len} ${RING_C}`}
              strokeDashoffset={a.off}
              transform="rotate(-90 78 78)"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif-display text-5xl sm:text-6xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight leading-none">
            {animSolved}
          </span>
          <span className="font-mono-studio text-[10px] tracking-[0.28em] text-[#8A929C] dark:text-[#8B92A0] mt-2">
            SOLVED
          </span>
          <span className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#565D68] mt-1">
            OF {total}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {["easy", "medium", "hard"].map((d, i) => {
          const t = diffTotals[d] || 0;
          const s = diffSolved[d] || 0;
          const pct = t ? Math.round((s / t) * 100) : 0;
          return (
            <div key={d}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: DIFFICULTY_COLOR[d] }}
                  />
                  <span className="font-mono-studio text-[10px] tracking-[0.22em] text-[#5B636E] dark:text-[#9AA1AC]">
                    {DIFFICULTY_LABEL[d].toUpperCase()}
                  </span>
                </span>
                <span className="font-mono-studio text-[11px] tracking-widest text-[#8A929C] dark:text-[#8B92A0]">
                  {s}
                  <span className="opacity-50"> / {t}</span>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[#EFEDE7] dark:bg-[#171B21] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: active ? `${pct}%` : 0 }}
                  transition={{ duration: 1.1, delay: 0.25 + i * 0.15, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: DIFFICULTY_COLOR[d] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const HEAT_WEEKS = 16;

function buildHeatWeeks(recentAttempts) {
  const days = HEAT_WEEKS * 7;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (days - 1));
  const counts = {};
  (recentAttempts || []).forEach((a) => {
    const d = new Date(a.createdAt);
    if (Number.isNaN(d.getTime())) return;
    d.setHours(0, 0, 0, 0);
    const k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    counts[k] = (counts[k] || 0) + 1;
  });
  const weeks = [];
  for (let w = 0; w < HEAT_WEEKS; w++) {
    const week = [];
    for (let dow = 0; dow < 7; dow++) {
      const dt = new Date(start);
      dt.setDate(dt.getDate() + w * 7 + dow);
      if (dt > today) {
        week.push(null);
        continue;
      }
      const k = dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");
      week.push({ count: counts[k] || 0, key: k });
    }
    weeks.push(week);
  }
  return weeks;
}

const CELL_BG = [
  "rgba(138,146,156,0.14)",
  "rgba(232,169,76,0.28)",
  "rgba(232,169,76,0.52)",
  "rgba(232,169,76,0.78)",
  "rgba(232,169,76,1)",
];

function heatLevel(count) {
  if (count >= 4) return 4;
  if (count === 3) return 3;
  if (count === 2) return 2;
  if (count === 1) return 1;
  return 0;
}

function SubmissionHeatmap({ recentAttempts, streak, active }) {
  const weeks = useMemo(() => buildHeatWeeks(recentAttempts), [recentAttempts]);
  const activeDays = useMemo(() => {
    const set = new Set();
    (recentAttempts || []).forEach((a) => {
      const d = new Date(a.createdAt);
      if (Number.isNaN(d.getTime())) return;
      set.add(d.toDateString());
    });
    return set.size;
  }, [recentAttempts]);

  return (
    <div>
      <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-0.75 min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.75">
              {week.map((day, di) =>
                day ? (
                  <motion.span
                    key={day.key}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={active ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.25, delay: Math.min(wi * 0.02, 0.4) }}
                    title={`${day.key} — ${day.count} submission${day.count === 1 ? "" : "s"}`}
                    className="w-2.5 h-2.5 rounded-[2.5px]"
                    style={{ backgroundColor: CELL_BG[heatLevel(day.count)] }}
                  />
                ) : (
                  <span key={`e-${di}`} className="w-2.5 h-2.5" />
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1.5">
          <span className="font-mono-studio text-[9px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68]">
            LESS
          </span>
          {CELL_BG.map((c, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-[2.5px]"
              style={{ backgroundColor: c }}
            />
          ))}
          <span className="font-mono-studio text-[9px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68]">
            MORE
          </span>
        </div>
        <span className="font-mono-studio text-[9px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68]">
          LAST {HEAT_WEEKS} WEEKS
        </span>
      </div>

      <div className="mt-5 pt-5 border-t border-[#E8E6E1] dark:border-[#232830]">
        {activeDays > 0 ? (
          <p className="font-mono-studio text-[11px] tracking-[0.12em] text-[#5B636E] dark:text-[#9AA1AC] leading-relaxed">
            <span className="text-[#9A7B24] dark:text-[#E8A94C] font-bold">
              {activeDays} ACTIVE {activeDays === 1 ? "DAY" : "DAYS"}
            </span>
            {"  ·  "}
            {streak > 0 ? (
              <span>
                <span className="text-[#9A7B24] dark:text-[#E8A94C] font-bold">
                  {streak}-DAY STREAK
                </span>{" "}
                — KEEP IT BURNING
              </span>
            ) : (
              <span>SOLVE TODAY TO START A STREAK</span>
            )}
          </p>
        ) : (
          <p className="font-mono-studio text-[11px] tracking-[0.12em] text-[#8A929C] dark:text-[#8B92A0] leading-relaxed">
            NO SUBMISSIONS IN THIS WINDOW — YOUR GRIND STARTS HERE.
          </p>
        )}
      </div>
    </div>
  );
}

function TopicPill({ topic, total, solved, pct, selected, onSelect, index }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-full pl-4 pr-4 pt-2.5 pb-3.5 cursor-pointer border transition-all duration-200 ${
        selected
          ? "border-[#C99E41] dark:border-[#E8A94C] bg-[#FBF7EE] dark:bg-[#1A1408] shadow-[0_10px_30px_-14px_rgba(232,169,76,0.6)]"
          : "border-[#E8E6E1] dark:border-[#232830] bg-white dark:bg-[#111318] hover:border-[#C99E41]/60 dark:hover:border-[#E8A94C]/60"
      }`}
    >
      <span className="flex items-center gap-2">
        <span
          className={`font-serif-display text-sm capitalize transition-colors duration-200 ${
            selected
              ? "text-[#9A7B24] dark:text-[#E8A94C]"
              : "text-[#14171B] dark:text-[#EDEEF0] group-hover:text-[#9A7B24] dark:group-hover:text-[#E8A94C]"
          }`}
        >
          {topic}
        </span>
        <span className="font-mono-studio text-[10px] tracking-[0.14em] text-[#8A929C] dark:text-[#8B92A0]">
          <span className="text-[#14171B] dark:text-[#EDEEF0] font-bold">{solved}</span>/{total}
        </span>
      </span>
      <span className="absolute bottom-1.75 left-4 right-4 h-0.5 rounded-full bg-[#EFEDE7] dark:bg-[#232830] overflow-hidden">
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="block h-full rounded-full bg-[#C99E41] dark:bg-[#E8A94C]"
        />
      </span>
    </motion.button>
  );
}

function DsaRow({ q, index, state, onClick }) {
  const num = String(index + 1).padStart(2, "0");
  const companies = q.companies || [];
  const visible = companies.slice(0, 3);
  const extra = companies.length - visible.length;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.02, 0.25) }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.995 }}
      className={`group relative w-full text-left ${CARD_BASE} rounded-xl px-4 sm:px-5 py-4 hover:border-[#C99E41]/60 dark:hover:border-[#E8A94C]/60 hover:shadow-[0_22px_48px_-22px_rgba(232,169,76,0.5)] transition-all duration-200 cursor-pointer overflow-hidden`}
    >
      <span className="absolute inset-y-0 left-0 w-0.75 bg-[#C99E41] dark:bg-[#E8A94C] scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-200" />
      <div className="flex items-center gap-3 sm:gap-4">
        <StatusIcon state={state} />
        <span className="font-mono-studio text-xs tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] shrink-0 hidden sm:inline w-8">
          {num}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-serif-display text-base sm:text-lg text-[#14171B] dark:text-[#EDEEF0] leading-snug truncate group-hover:text-[#9A7B24] dark:group-hover:text-[#E8A94C] transition-colors duration-200">
            {q.title}
          </p>
          <div className="flex items-center gap-x-2 gap-y-1 mt-1.5 flex-wrap">
            {visible.map((c) => (
              <span
                key={c}
                className="font-mono-studio text-[10px] tracking-widest text-[#8A929C] dark:text-[#565D68]"
              >
                {c.toUpperCase()}
              </span>
            ))}
            {extra > 0 && (
              <span className="font-mono-studio text-[10px] tracking-widest text-[#8A929C] dark:text-[#565D68]">
                +{extra}
              </span>
            )}
          </div>
        </div>
        <span
          className={`font-mono-studio text-[11px] font-bold tracking-[0.14em] shrink-0 ${DIFFICULTY_TEXT[q.difficulty] || "text-[#8A929C]"}`}
        >
          {(DIFFICULTY_LABEL[q.difficulty] || q.difficulty || "").toUpperCase()}
        </span>
        <span className="hidden md:inline-flex items-center gap-1.5 font-mono-studio text-[10px] font-bold tracking-[0.18em] text-[#9A7B24] dark:text-[#E8A94C] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0">
          SOLVE <FaArrowRight size={10} />
        </span>
      </div>
    </motion.button>
  );
}

function QuestionCard({ q, onClick, index }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative text-left ${CARD_BASE} rounded-2xl p-5 sm:p-6 hover:border-[#C99E41]/60 dark:hover:border-[#E8A94C]/60 hover:shadow-[0_22px_52px_-24px_rgba(232,169,76,0.5)] transition-all duration-200 flex flex-col gap-4 cursor-pointer overflow-hidden`}
    >
      <span className="absolute inset-x-0 top-0 h-0.5 bg-[#C99E41] dark:bg-[#E8A94C] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
      <div className="flex items-center justify-between">
        <span className="font-mono-studio text-xs tracking-[0.2em] text-[#9A7B24] dark:text-[#E8A94C]">
          Q.{num}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono-studio text-[10px] tracking-[0.16em] border px-2 py-1 rounded-md text-[#6A5FBF] dark:text-[#B3A9F5] border-[#6A5FBF]/30 dark:border-[#8B7FD6]/30">
            HR
          </span>
          {q.difficulty && (
            <span
              className={`font-mono-studio text-[10px] font-bold tracking-[0.16em] ${DIFFICULTY_TEXT[q.difficulty] || "text-[#8A929C]"}`}
            >
              {(DIFFICULTY_LABEL[q.difficulty] || q.difficulty).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <p className="font-serif-display text-lg text-[#14171B] dark:text-[#EDEEF0] leading-snug line-clamp-3 group-hover:text-[#9A7B24] dark:group-hover:text-[#E8A94C] transition-colors duration-200">
        {q.title}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E8E6E1] dark:border-[#232830]">
        <span className="font-mono-studio text-[10px] tracking-widest text-[#8A929C] dark:text-[#8B92A0] capitalize">
          {q.category}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono-studio text-[10px] font-bold tracking-[0.18em] text-[#9A7B24] dark:text-[#E8A94C]">
          OPEN <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform duration-200" />
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="relative w-full text-left bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-3xl p-7 sm:p-10 mb-8 group transition-all duration-200 hover:border-[#C99E41]/60 dark:hover:border-[#E8A94C]/60 hover:shadow-[0_28px_70px_-28px_rgba(232,169,76,0.5)] cursor-pointer overflow-hidden"
    >
      <span className="pointer-events-none absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#9A7B24]/70 dark:border-[#E8A94C]/70 group-hover:border-[#9A7B24] dark:group-hover:border-[#E8A94C] transition-colors duration-300" />
      <span className="pointer-events-none absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#9A7B24]/70 dark:border-[#E8A94C]/70 group-hover:border-[#9A7B24] dark:group-hover:border-[#E8A94C] transition-colors duration-300" />
      <span className="pointer-events-none absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#9A7B24]/70 dark:border-[#E8A94C]/70 group-hover:border-[#9A7B24] dark:group-hover:border-[#E8A94C] transition-colors duration-300" />
      <span className="pointer-events-none absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#9A7B24]/70 dark:border-[#E8A94C]/70 group-hover:border-[#9A7B24] dark:group-hover:border-[#E8A94C] transition-colors duration-300" />
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-[#9A7B24]/[0.07] dark:via-[#E8A94C]/[0.07] to-transparent shine-sweep" />
      <span className="pointer-events-none absolute -right-6 -bottom-10 font-serif-display italic text-[9rem] sm:text-[11rem] leading-none text-[#14171B]/4 dark:text-white/4 select-none hidden sm:block float-soft">
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
                  ? "text-[#00b8a3] border-[#00b8a3]/30"
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
            <span className="font-mono-studio inline-flex items-center gap-2.5 text-[#00b8a3] text-xs tracking-[0.14em] border border-[#00b8a3]/30 px-5 py-3 rounded-full">
              <FaCheckCircle size={14} />
              DONE — STREAK SAFE
            </span>
          ) : (
            <span className="font-mono-studio inline-flex items-center gap-3 bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] text-sm font-bold tracking-[0.08em] px-7 py-4 rounded-full group-hover:opacity-90 transition-all duration-200">
              START CHALLENGE <FaArrowRight size={13} />
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function Ticker({ totalCoding }) {
  const items = [
    totalCoding > 0 ? `${totalCoding} PROBLEMS` : "THE PROBLEM BANK",
    "COMPANY TAGS",
    "TOPIC TRACKS",
    "HIDDEN TESTS",
    "ZERO CREDITS",
    "BUILD STREAKS",
  ];
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-[#E8E6E1] dark:border-[#232830] mb-10 py-3 select-none"
    >
      <div className="ticker-track flex whitespace-nowrap w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center shrink-0">
            {items.map((t) => (
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

function RowSkeletons() {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-19 rounded-xl bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] animate-pulse"
        />
      ))}
    </div>
  );
}

function CardSkeletons() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-48 rounded-2xl bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] animate-pulse"
        />
      ))}
    </div>
  );
}

function DashboardSkeletons() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-85 rounded-3xl bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] animate-pulse"
        />
      ))}
    </div>
  );
}

function PracticeHub() {
  const navigate = useNavigate();
  const listRef = useRef(null);

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const loadData = async () => {
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
          "Couldn't load practice questions. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const animStreak = useCountUp(stats ? stats.currentStreak || 0 : 0, 900, !!stats);
  const animAttempts = useCountUp(stats ? stats.totalAttempts || 0 : 0, 1100, !!stats);
  const animAvg = useCountUp(
    stats && stats.averageScore ? Math.round(stats.averageScore) : 0,
    1100,
    !!stats,
  );

  const stateFor = (id) => {
    const p = progressMap[id];
    if (!p) return "untouched";
    if (p.solved) return "solved";
    if (p.attempted) return "attempted";
    return "untouched";
  };

  const diffTotals = useMemo(() => {
    const t = { easy: 0, medium: 0, hard: 0 };
    coding.forEach((q) => {
      if (t[q.difficulty] !== undefined) t[q.difficulty] += 1;
    });
    return t;
  }, [coding]);

  const diffSolved = useMemo(() => {
    const s = { easy: 0, medium: 0, hard: 0 };
    coding.forEach((q) => {
      if (progressMap[q.id]?.solved && s[q.difficulty] !== undefined)
        s[q.difficulty] += 1;
    });
    return s;
  }, [coding, progressMap]);

  const curriculum = useMemo(
    () =>
      topicsMeta.map((t) => {
        const qs = coding.filter((q) => q.topic === t.topic);
        const total = t.total || qs.length;
        const solved = qs.filter((q) => progressMap[q.id]?.solved).length;
        const pct = total ? Math.round((solved / total) * 100) : 0;
        return { topic: t.topic, total, solved, pct };
      }),
    [topicsMeta, coding, progressMap],
  );

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
      if (statusFilter !== "all") {
        const st = stateFor(q.id);
        if (statusFilter === "solved" && st !== "solved") return false;
        if (statusFilter === "attempted" && st !== "attempted") return false;
        if (statusFilter === "unsolved" && st !== "untouched") return false;
      }
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
  }, [coding, topicFilter, difficultyFilter, companyFilter, statusFilter, search, progressMap]);

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

  const selectTopic = (topic) => {
    setTab("dsa");
    setTopicFilter(topic);
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const clearFilters = () => {
    setTopicFilter("all");
    setDifficultyFilter("all");
    setCompanyFilter("all");
    setStatusFilter("all");
    setSearch("");
  };

  const hasActiveFilters =
    topicFilter !== "all" ||
    difficultyFilter !== "all" ||
    companyFilter !== "all" ||
    statusFilter !== "all" ||
    search.trim() !== "";

  const difficultyPills = ["all", "easy", "medium", "hard"];
  const statusPills = ["all", "solved", "attempted", "unsolved"];

  return (
    <div className="min-h-screen relative bg-[#FAFAF9] dark:bg-[#0A0B0D] transition-colors duration-300 px-4 sm:px-6 pb-20 overflow-hidden">
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
          opacity: 0.03;
          mix-blend-mode: overlay;
          z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/rect%3E%3C/svg%3E");
        }

        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ticker-track { animation: tickerScroll 32s linear infinite; }

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

        @keyframes flamePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        .flame-pulse { animation: flamePulse 1.8s ease-in-out infinite; }
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
        className="aurora-orb w-120 h- -bottom-40 left-1/4 bg-[#9A7B24]/5 dark:bg-[#E8A94C]/3 blur-3xl"
        style={{ animationDelay: "-12s" }}
      />

      <div className="practice-root relative z-10 max-w-6xl mx-auto">
        <div className="pt-6 sm:pt-10 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-7"
          >
            <motion.button
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate("/")}
              aria-label="Go back to home"
              className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] hover:border-[#C99E41]/60 dark:hover:border-[#E8A94C]/60 transition-all duration-200 cursor-pointer"
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
                {totalCoding > 0 ? `${totalCoding} problems` : "The full problem bank"}.
                Company tags. Hidden test cases. Zero credits — grind like it is
                the real round.
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
              className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-mono-studio text-xs font-bold tracking-[0.14em] px-7 py-4 rounded-full disabled:opacity-60 hover:opacity-90 transition-all duration-200 cursor-pointer shadow-[0_18px_40px_-16px_rgba(201,158,65,0.55)]"
            >
              <FaDice size={14} />
              SURPRISE ME
            </motion.button>
          </div>
        </div>

        <DailyChallengeCard
          daily={daily}
          onClick={() => daily && navigate(`/practice/${daily.type}/${daily.id}`)}
        />

        <Ticker totalCoding={totalCoding} />

        {loading ? (
          <DashboardSkeletons />
        ) : errorMessage ? (
          <div className="mb-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-3xl p-8 text-center">
            <p className="text-red-700 dark:text-red-400 text-sm mb-4">
              {errorMessage}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={loadData}
              className="inline-flex items-center gap-2 bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-mono-studio text-xs font-bold tracking-[0.14em] px-6 py-3 rounded-full cursor-pointer"
            >
              <FaRedoAlt size={12} />
              TRY AGAIN
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className={`${CARD_BASE} relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]`}
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="absolute top-0 left-6 right-6 h-0.5 bg-[#C99E41] dark:bg-[#E8A94C] origin-left"
              />
              <p className="font-mono-studio text-[10px] tracking-[0.24em] text-[#8A929C] dark:text-[#8B92A0] mb-6">
                PROGRESS
              </p>
              <ProgressRing
                solved={solvedCount}
                total={totalCoding}
                diffSolved={diffSolved}
                diffTotals={diffTotals}
                active={!loading && !errorMessage}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className={`${CARD_BASE} relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]`}
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.23, ease: "easeOut" }}
                className="absolute top-0 left-6 right-6 h-0.5 bg-[#C99E41] dark:bg-[#E8A94C] origin-left"
              />
              <p className="font-mono-studio text-[10px] tracking-[0.24em] text-[#8A929C] dark:text-[#8B92A0] mb-6">
                SUBMISSION ACTIVITY
              </p>
              <SubmissionHeatmap
                recentAttempts={stats ? stats.recentAttempts : []}
                streak={stats ? stats.currentStreak || 0 : 0}
                active={!loading && !errorMessage}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className={`${CARD_BASE} relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)] flex flex-col`}
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.31, ease: "easeOut" }}
                className="absolute top-0 left-6 right-6 h-0.5 bg-[#C99E41] dark:bg-[#E8A94C] origin-left"
              />
              <p className="font-mono-studio text-[10px] tracking-[0.24em] text-[#8A929C] dark:text-[#8B92A0] mb-6">
                THE GRIND
              </p>

              <div className="flex items-center gap-4 mb-6">
                <span className="flame-pulse w-12 h-12 rounded-2xl bg-[#C99E41]/12 dark:bg-[#E8A94C]/12 border border-[#C99E41]/25 dark:border-[#E8A94C]/25 flex items-center justify-center shrink-0">
                  <FaFire size={20} className="text-[#C99E41] dark:text-[#E8A94C]" />
                </span>
                <div>
                  <p className="font-serif-display text-5xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight leading-none">
                    {animStreak}
                  </p>
                  <p className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8A929C] dark:text-[#8B92A0] mt-1.5">
                    DAY STREAK
                  </p>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between pt-4 border-t border-[#E8E6E1] dark:border-[#232830]">
                  <span className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8A929C] dark:text-[#8B92A0]">
                    ATTEMPTS
                  </span>
                  <span className="font-serif-display text-3xl text-[#14171B] dark:text-[#EDEEF0]">
                    {animAttempts}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#E8E6E1] dark:border-[#232830]">
                  <span className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8A929C] dark:text-[#8B92A0]">
                    AVG SCORE
                  </span>
                  <span className="font-serif-display text-3xl text-[#14171B] dark:text-[#EDEEF0]">
                    {stats && stats.averageScore ? `${animAvg}` : "—"}
                    {stats && stats.averageScore ? (
                      <span className="font-mono-studio text-xs text-[#8A929C] dark:text-[#565D68] ml-1">
                        / 100
                      </span>
                    ) : null}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex items-center gap-1 mb-8 border-b border-[#E8E6E1] dark:border-[#232830]">
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

        {tab === "dsa" && curriculum.length > 0 && (
          <div className="mb-12">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <p className="font-mono-studio text-[10px] tracking-[0.24em] text-[#9A7B24] dark:text-[#E8A94C] mb-2">
                  TOPICS
                </p>
                <h2 className="font-serif-display text-2xl sm:text-3xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight">
                  Master every topic
                </h2>
              </div>
              {topicFilter !== "all" && (
                <button
                  onClick={() => setTopicFilter("all")}
                  className="font-mono-studio text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#8B92A0] hover:text-[#9A7B24] dark:hover:text-[#E8A94C] border border-[#E8E6E1] dark:border-[#232830] hover:border-[#C99E41]/50 dark:hover:border-[#E8A94C]/50 px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer shrink-0"
                >
                  CLEAR ✕
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {curriculum.map((c, i) => (
                <TopicPill
                  key={c.topic}
                  topic={c.topic}
                  total={c.total}
                  solved={c.solved}
                  pct={c.pct}
                  selected={topicFilter === c.topic}
                  index={i}
                  onSelect={() => selectTopic(c.topic)}
                />
              ))}
            </div>
          </div>
        )}

        {tab === "dsa" && (
          <div ref={listRef} className="scroll-mt-6">
            <div className="flex items-end justify-between gap-4 mb-5 pb-4 border-b-2 border-[#14171B] dark:border-[#EDEEF0]">
              <h2 className="font-serif-display text-2xl sm:text-3xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight">
                The DSA bank
              </h2>
              <span className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#8B92A0] shrink-0">
                {String(dsaFiltered.length).padStart(2, "0")} /{" "}
                {String(coding.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
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

              <div className="flex items-center gap-2">
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="flex-1 sm:flex-none sm:w-auto bg-white dark:bg-[#111318] border border-[#E8E6E1] dark:border-[#232830] rounded-xl px-3.5 py-2.5 text-sm text-[#14171B] dark:text-[#EDEEF0] focus:border-[#9A7B24] dark:focus:border-[#E8A94C] focus:outline-none transition cursor-pointer max-w-full"
                >
                  <option value="all">All companies</option>
                  {companiesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: -8 }}
                  whileTap={{ scale: 0.94, rotate: 8 }}
                  onClick={practiceRandom}
                  disabled={!coding.length}
                  aria-label="Pick a random problem"
                  title="Pick one for me"
                  className="shrink-0 w-10.5 h-10.5 flex items-center justify-center rounded-xl bg-white dark:bg-[#111318] border border-[#E8E6E1] dark:border-[#232830] hover:border-[#C99E41]/60 dark:hover:border-[#E8A94C]/60 text-[#9A7B24] dark:text-[#E8A94C] disabled:opacity-50 transition-all duration-200 cursor-pointer"
                >
                  <FaDice size={16} />
                </motion.button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="flex items-center gap-1 bg-white dark:bg-[#111318] border border-[#E8E6E1] dark:border-[#232830] rounded-full p-1">
                {difficultyPills.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    className={`font-mono-studio text-[11px] font-bold tracking-widest px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      difficultyFilter === d
                        ? "bg-[#14171B] dark:bg-[#EDEEF0] text-[#FAFAF9] dark:text-[#0A0B0D]"
                        : "text-[#8A929C] dark:text-[#8B92A0] hover:text-[#3E4650] dark:hover:text-[#9AA1AC]"
                    }`}
                  >
                    {d !== "all" && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: DIFFICULTY_COLOR[d] }}
                      />
                    )}
                    {d === "all" ? "ALL" : DIFFICULTY_LABEL[d].toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-white dark:bg-[#111318] border border-[#E8E6E1] dark:border-[#232830] rounded-full p-1">
                {statusPills.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`font-mono-studio text-[11px] font-bold tracking-widest px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                      statusFilter === s
                        ? "bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D]"
                        : "text-[#8A929C] dark:text-[#8B92A0] hover:text-[#3E4650] dark:hover:text-[#9AA1AC]"
                    }`}
                  >
                    {s === "all" ? "ALL" : s === "unsolved" ? "UNSOLVED" : s === "solved" ? "SOLVED" : "ATTEMPTED"}
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="font-mono-studio text-[11px] tracking-[0.14em] text-[#8A929C] dark:text-[#8B92A0] hover:text-[#9A7B24] dark:hover:text-[#E8A94C] px-2 py-1.5 transition-colors duration-200 cursor-pointer"
                >
                  CLEAR ALL ✕
                </button>
              )}
            </div>

            {errorMessage && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 text-red-700 dark:text-red-400 text-sm">
                {errorMessage}
              </div>
            )}

            {loading ? (
              <RowSkeletons />
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
                <p className="text-[#3E4650] dark:text-[#8B92A0] text-sm mb-5">
                  No problems match those filters. Try clearing them.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="font-mono-studio text-[11px] font-bold tracking-[0.14em] text-[#14171B] dark:text-[#0A0B0D] bg-[#C99E41] dark:bg-[#E8A94C] px-6 py-3 rounded-full hover:opacity-90 transition-opacity duration-200 cursor-pointer"
                  >
                    CLEAR FILTERS
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "hr" && (
          <div>
            <div className="flex items-end justify-between gap-4 mb-5 pb-4 border-b-2 border-[#14171B] dark:border-[#EDEEF0]">
              <div>
                <p className="font-mono-studio text-[10px] tracking-[0.24em] text-[#9A7B24] dark:text-[#E8A94C] mb-2">
                  BEHAVIORAL
                </p>
                <h2 className="font-serif-display text-2xl sm:text-3xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight">
                  HR questions
                </h2>
              </div>
              <span className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#8B92A0] shrink-0">
                {String(hrFiltered.length).padStart(2, "0")} QUESTIONS
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
              <div className="flex items-center gap-1 bg-white dark:bg-[#111318] border border-[#E8E6E1] dark:border-[#232830] rounded-full p-1 w-max">
                {difficultyPills.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    className={`font-mono-studio text-[11px] font-bold tracking-widest px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      difficultyFilter === d
                        ? "bg-[#14171B] dark:bg-[#EDEEF0] text-[#FAFAF9] dark:text-[#0A0B0D]"
                        : "text-[#8A929C] dark:text-[#8B92A0] hover:text-[#3E4650] dark:hover:text-[#9AA1AC]"
                    }`}
                  >
                    {d !== "all" && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: DIFFICULTY_COLOR[d] }}
                      />
                    )}
                    {d === "all" ? "ALL" : DIFFICULTY_LABEL[d].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 text-red-700 dark:text-red-400 text-sm">
                {errorMessage}
              </div>
            )}

            {loading ? (
              <CardSkeletons />
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
