import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FaArrowLeft } from "react-icons/fa";
import { BsArrowUpRight, BsClockHistory } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";

function TrendTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-white dark:bg-[#14161A] text-[#14171B] dark:text-[#EDEEF0] rounded-xl px-3.5 py-2.5 shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)] border border-[#E8E6E1] dark:border-white/10">
      <p className="font-mono-studio text-[10px] uppercase tracking-wider text-[#8A929C] dark:text-[#9AA1AC]">
        {p.label}
      </p>
      <p className="font-serif-display text-2xl mt-0.5">
        {p.score}
        <span className="text-sm text-[#8A929C] dark:text-[#9AA1AC]">/10</span>
      </p>
      <p className="text-[11px] text-[#5B636E] dark:text-[#9AA1AC] mt-0.5">
        {p.company ? `${p.role} @ ${p.company}` : p.role}
      </p>
    </div>
  );
}

function Analytics() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await axios.get(
          ServerUrl + "/api/interview/analytics-summary",
          { withCredentials: true },
        );
        setData(result.data);
      } catch (err) {
        console.log(err);
        setError("Couldn't load your progress right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] dark:bg-[#0A0B0D] transition-colors duration-300">
        <p className="text-[#8A929C] dark:text-[#8B92A0] text-lg font-['Manrope',sans-serif]">
          Loading your progress...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] dark:bg-[#0A0B0D] p-6 transition-colors duration-300">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-6 max-w-md text-center">
          <IoWarningOutline
            size={24}
            className="text-red-500 dark:text-red-400 mx-auto mb-3"
          />
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const {
    totalInterviews,
    averageScore,
    currentStreak,
    scoreTrend,
    skillAverages,
    bestScore,
    biggestJump,
    topicBreakdown = [],
    recentInterviews = [],
    activity = [],
  } = data;

  const lastDelta =
    scoreTrend.length > 1
      ? Number(
          (scoreTrend[scoreTrend.length - 1].score - scoreTrend[scoreTrend.length - 2].score).toFixed(1),
        )
      : 0;

  const radarData = [
    { skill: "Confidence", value: skillAverages.confidence },
    { skill: "Communication", value: skillAverages.communication },
    { skill: "Correctness", value: skillAverages.correctness },
  ];

  const topicColor = (score) =>
    score >= 7 ? "bg-emerald-500" : score >= 5 ? "bg-amber-500" : "bg-red-500";

  const scorePill = (score) =>
    score >= 7
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : score >= 5
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : "bg-red-500/10 text-red-600 dark:text-red-400";

  const heatCell = (count) =>
    count >= 3
      ? "bg-[#E8A94C]"
      : count === 2
        ? "bg-[#E8A94C]/60"
        : count === 1
          ? "bg-[#E8A94C]/30"
          : "bg-[#E8E6E1] dark:bg-[#232830]";

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

  const weeks = [];
  if (activity.length) {
    let col = [];
    const firstDay = new Date(activity[0].date + "T00:00:00").getDay();
    for (let i = 0; i < firstDay; i++) col.push(null);
    activity.forEach((d) => {
      col.push(d);
      if (col.length === 7) {
        weeks.push(col);
        col = [];
      }
    });
    if (col.length) weeks.push(col);
  }
  let lastMonthShown = "";
  const weekMonthLabel = (col) => {
    const first = col.find(Boolean);
    if (!first) return "";
    const d = new Date(first.date + "T00:00:00");
    const m = d.toLocaleDateString("en-IN", { month: "short" });
    if (d.getDate() <= 7 && m !== lastMonthShown) {
      lastMonthShown = m;
      return m;
    }
    return "";
  };

  const panel =
    "bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-2xl p-6 sm:p-8 shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]";

  const SectionHead = ({ index, title, right }) => (
    <div className="flex items-baseline gap-3 mb-6">
      <span className="font-serif-display italic text-2xl leading-none text-[#9A7B24] dark:text-[#E8A94C]">
        {index}
      </span>
      <h3 className="font-serif-display text-xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight">
        {title}
      </h3>
      {right && (
        <span className="font-mono-studio text-[10px] uppercase tracking-[0.22em] text-[#8A929C] dark:text-[#565D68] ml-auto">
          {right}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0A0B0D] px-4 sm:px-6 lg:px-10 py-8 transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .report-root, .report-root * { font-family: 'Manrope', sans-serif; }
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div className="report-root max-w-350 mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-[#E8E6E1] dark:border-[#232830] bg-white dark:bg-[#111318] text-[#3E4650] dark:text-[#9AA1AC] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 hover:-translate-y-0.5 transition-all duration-200"
          >
            <FaArrowLeft className="cursor-pointer" size={13} />
          </button>
          <div>
            <p className="font-mono-studio text-[10px] uppercase tracking-[0.22em] text-[#9A7B24] dark:text-[#E8A94C] mb-1.5">
              Progress report
            </p>
            <h1 className="font-serif-display text-2xl sm:text-3xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight">
              My Progress
            </h1>
          </div>
        </div>

        {totalInterviews === 0 ? (
          <div className={`${panel} text-center py-14`}>
            <p className="font-serif-display text-xl text-[#14171B] dark:text-[#EDEEF0] mb-2">
              No interviews yet
            </p>
            <p className="text-[#5B636E] dark:text-[#9AA1AC] mb-6 text-sm">
              Finish your first interview and your progress story starts here.
            </p>
            <button
              onClick={() => navigate("/interview")}
              className="bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition"
            >
              Start an interview
            </button>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] p-8 sm:p-10 relative overflow-hidden mb-6 shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]"
            >
              <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-[#9A7B24]/40 to-transparent dark:via-[#E8A94C]/30 pointer-events-none" />
              <div className="relative flex flex-col lg:flex-row lg:items-end gap-8">
                <div>
                  <p className="font-mono-studio text-[10px] uppercase tracking-[0.25em] text-[#9A7B24] dark:text-[#E8A94C] mb-4">
                    Overall performance
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <p className="font-serif-display tabular-nums text-7xl sm:text-8xl leading-none tracking-tight text-[#14171B] dark:text-[#EDEEF0]">
                      {averageScore}
                    </p>
                    <div>
                      <p className="text-[#8A929C] dark:text-[#9AA1AC] text-lg leading-none">/10</p>
                      {scoreTrend.length > 1 && (
                        <span
                          className={`inline-block mt-2 font-mono-studio text-[11px] px-2.5 py-1 rounded-full ${
                            lastDelta >= 0
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                              : "bg-red-500/15 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {lastDelta >= 0 ? "▲" : "▼"} {Math.abs(lastDelta)} vs
                          last
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="font-mono-studio text-[11px] text-[#5B636E] dark:text-[#9AA1AC] mt-5 tracking-wide">
                    {totalInterviews} interview{totalInterviews === 1 ? "" : "s"}
                    {"  ·  "}best {bestScore ? `${bestScore.score}/10` : "—"}
                    {"  ·  "}
                    {currentStreak} day streak
                    {biggestJump && biggestJump.delta > 0 && (
                      <>
                        {"  ·  "}biggest jump +{biggestJump.delta} (
                        {biggestJump.from}→{biggestJump.to})
                      </>
                    )}
                  </p>
                </div>
                <div className="lg:ml-auto w-full lg:w-80 h-28 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={scoreTrend}
                      margin={{ top: 6, bottom: 6, left: 0, right: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="sparkFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#E8A94C"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="100%"
                            stopColor="#E8A94C"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#C99B3F"
                        strokeWidth={2}
                        fill="url(#sparkFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="font-mono-studio text-[10px] uppercase tracking-wider text-[#8A929C] dark:text-[#6B7280] mt-1 text-right">
                    Sparkline · all attempts
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className={`lg:col-span-2 ${panel}`}
              >
                <SectionHead
                  index="01"
                  title="Performance trend"
                  right={`${scoreTrend.length} attempts`}
                />
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={scoreTrend}
                      margin={{ top: 8, bottom: 0, left: -12, right: 8 }}
                    >
                      <defs>
                        <linearGradient
                          id="progressFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#E8A94C"
                            stopOpacity={0.28}
                          />
                          <stop
                            offset="100%"
                            stopColor="#E8A94C"
                            stopOpacity={0.02}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        className="stroke-[#E8E6E1] dark:stroke-[#232830]"
                      />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tick={{
                          fill: "currentColor",
                          fontFamily: "JetBrains Mono",
                          fontSize: 11,
                        }}
                        className="text-[#8A929C] dark:text-[#9AA1AC]"
                      />
                      <YAxis
                        domain={[0, 10]}
                        tickLine={false}
                        axisLine={false}
                        tick={{
                          fill: "currentColor",
                          fontFamily: "JetBrains Mono",
                          fontSize: 11,
                        }}
                        className="text-[#8A929C] dark:text-[#9AA1AC]"
                      />
                      <Tooltip
                        content={<TrendTooltip />}
                        cursor={{
                          stroke: "#E8A94C",
                          strokeOpacity: 0.4,
                          strokeDasharray: "4 4",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#C99B3F"
                        strokeWidth={2}
                        fill="url(#progressFill)"
                        activeDot={{
                          r: 4,
                          fill: "#E8A94C",
                          stroke: "#fff",
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                className={panel}
              >
                <SectionHead index="02" title="Skill profile" />
                <div className="h-60 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="70%">
                      <PolarGrid className="stroke-[#E8E6E1] dark:stroke-[#232830]" />
                      <PolarAngleAxis
                        dataKey="skill"
                        tick={{
                          fill: "currentColor",
                          fontFamily: "JetBrains Mono",
                          fontSize: 10,
                        }}
                        className="text-[#8A929C] dark:text-[#9AA1AC]"
                      />
                      <PolarRadiusAxis
                        domain={[0, 10]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        dataKey="value"
                        stroke="#C99B3F"
                        fill="#E8A94C"
                        fillOpacity={0.3}
                        strokeWidth={1.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-1">
                  {radarData.map((s) => (
                    <div key={s.skill} className="text-center">
                      <p className="font-serif-display tabular-nums text-lg text-[#14171B] dark:text-[#EDEEF0]">
                        {s.value}
                      </p>
                      <p className="font-mono-studio text-[9px] uppercase tracking-wider text-[#8A929C] dark:text-[#9AA1AC]">
                        {s.skill}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`lg:col-span-2 ${panel}`}
              >
                <SectionHead
                  index="03"
                  title="Topic mastery"
                  right={`${topicBreakdown.length} topics`}
                />
                {topicBreakdown.length === 0 ? (
                  <p className="text-sm text-[#5B636E] dark:text-[#9AA1AC]">
                    Topic-wise scores will appear here as you answer more
                    questions.
                  </p>
                ) : (
                  <div className="divide-y divide-[#E8E6E1] dark:divide-[#232830] max-h-104 overflow-y-auto pr-1">
                    {topicBreakdown.map((t, i) => (
                      <div key={t.topic} className="py-3.5 flex items-center gap-4">
                        <span className="font-mono-studio tabular-nums text-[11px] text-[#8A929C] dark:text-[#565D68] w-7 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-3 mb-1.5">
                            <span className="text-sm text-[#3E4650] dark:text-[#9AA1AC] truncate">
                              {t.topic}
                              {t.averageScore < 5 && (
                                <span className="ml-2 font-mono-studio text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                                  focus
                                </span>
                              )}
                            </span>
                            <span className="font-mono-studio tabular-nums text-[11px] text-[#8A929C] dark:text-[#9AA1AC] shrink-0">
                              {t.averageScore}
                              <span className="text-[#8A929C] dark:text-[#565D68]">/10</span>
                              {"  ·  "}
                              {t.count}q
                            </span>
                          </div>
                          <div className="bg-[#F5F4F1] dark:bg-[#14171C] h-1.5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${t.averageScore * 10}%` }}
                              transition={{
                                duration: 0.9,
                                ease: "easeOut",
                                delay: 0.2 + i * 0.04,
                              }}
                              className={`${topicColor(t.averageScore)} h-full rounded-full`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 }}
                className={panel}
              >
                <SectionHead index="04" title="Consistency" right="30 days" />
                <div className="flex gap-1.5">
                  {weeks.map((col, ci) => (
                    <div key={ci} className="flex flex-col gap-1.5">
                      <div className="h-4 font-mono-studio text-[9px] text-[#8A929C] dark:text-[#9AA1AC]">
                        {weekMonthLabel(col)}
                      </div>
                      {col.map((d, ri) =>
                        d ? (
                          <div
                            key={ri}
                            title={`${d.date}: ${d.count} interview${d.count === 1 ? "" : "s"}`}
                            className={`w-4 h-4 rounded-[5px] ${heatCell(d.count)} transition-transform hover:scale-125`}
                          />
                        ) : (
                          <div key={ri} className="w-4 h-4" />
                        ),
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <span className="font-mono-studio text-[10px] text-[#8A929C] dark:text-[#9AA1AC]">
                    Less
                  </span>
                  {[0, 1, 2, 3].map((c) => (
                    <div
                      key={c}
                      className={`w-3.5 h-3.5 rounded-sm ${heatCell(c)}`}
                    />
                  ))}
                  <span className="font-mono-studio text-[10px] text-[#8A929C] dark:text-[#9AA1AC]">
                    More
                  </span>
                </div>
                <p className="font-serif-display italic text-lg text-[#14171B] dark:text-[#EDEEF0] mt-6 leading-snug">
                  {activity.reduce((s, d) => s + d.count, 0)} sessions
                </p>
                <p className="font-mono-studio text-[10px] uppercase tracking-wider text-[#8A929C] dark:text-[#9AA1AC] mt-1">
                  in the last 30 days
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className={`${panel} mb-6`}
            >
              <SectionHead
                index="05"
                title="Interview log"
                right="click a row for full report"
              />
              <div className="hidden sm:grid grid-cols-12 gap-3 pb-3 border-b border-[#E8E6E1] dark:border-[#232830]">
                {["#", "Interview", "Date", "Mode", "Score", ""].map((h, i) => (
                  <span
                    key={i}
                    className={`font-mono-studio text-[10px] uppercase tracking-wider text-[#8A929C] dark:text-[#9AA1AC] ${
                      i === 0
                        ? "col-span-1"
                        : i === 1
                          ? "col-span-5"
                          : i === 2
                            ? "col-span-2"
                            : i === 3
                              ? "col-span-2"
                              : i === 4
                                ? "col-span-1 text-right"
                                : "col-span-1"
                    }`}
                  >
                    {h}
                  </span>
                ))}
              </div>
              <div className="divide-y divide-[#E8E6E1] dark:divide-[#232830]">
                {recentInterviews.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => navigate(`/report/${r.id}`)}
                    className="w-full grid grid-cols-12 gap-3 items-center py-4 text-left hover:bg-[#F5F4F1] dark:hover:bg-[#14171C] transition-colors cursor-pointer px-2 -mx-2 rounded-lg"
                  >
                    <span className="col-span-2 sm:col-span-1 font-mono-studio tabular-nums text-[11px] text-[#8A929C] dark:text-[#565D68]">
                      {r.label}
                    </span>
                    <span className="col-span-7 sm:col-span-5 min-w-0">
                      <span className="block text-sm font-medium text-[#14171B] dark:text-[#EDEEF0] truncate">
                        {r.role}
                        {r.company ? (
                          <span className="font-normal text-[#8A929C] dark:text-[#9AA1AC]">
                            {" "}
                            @ {r.company}
                          </span>
                        ) : (
                          ""
                        )}
                      </span>
                      <span className="sm:hidden text-[11px] text-[#8A929C] dark:text-[#9AA1AC] flex items-center gap-1 mt-0.5">
                        <BsClockHistory size={10} />
                        {formatDate(r.createdAt)}
                      </span>
                    </span>
                    <span className="hidden sm:block col-span-2 text-[12px] text-[#8A929C] dark:text-[#9AA1AC]">
                      {formatDate(r.createdAt)}
                    </span>
                    <span className="hidden sm:block col-span-2">
                      {r.mode ? (
                        <span className="font-mono-studio uppercase text-[10px] tracking-wider text-[#5B636E] dark:text-[#9AA1AC]">
                          {r.mode}
                        </span>
                      ) : (
                        <span className="text-[#8A929C] dark:text-[#565D68]">—</span>
                      )}
                    </span>
                    <span className="col-span-2 sm:col-span-1 text-right">
                      <span
                        className={`font-mono-studio tabular-nums text-xs font-semibold ${scorePill(r.finalScore)} px-2 py-1 rounded-full`}
                      >
                        {r.finalScore}
                      </span>
                    </span>
                    <span className="col-span-1 text-right">
                      <BsArrowUpRight size={13} className="text-[#8A929C] dark:text-[#565D68] ml-auto" />
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;
