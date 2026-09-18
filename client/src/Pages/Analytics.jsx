import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FaArrowLeft } from "react-icons/fa";
import { BsFire, BsBarChart, BsTrophy, BsClockHistory } from "react-icons/bs";
import { IoSparklesSharp, IoWarningOutline } from "react-icons/io5";

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
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3] dark:bg-[#0A0B0D] transition-colors duration-300">
        <p className="text-[#8B92A0] text-lg font-['Manrope',sans-serif]">
          Loading your progress...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3] dark:bg-[#0A0B0D] p-6 transition-colors duration-300">
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
    weakTopics,
  } = data;

  const skillBars = [
    { label: "Confidence", value: skillAverages.confidence },
    { label: "Communication", value: skillAverages.communication },
    { label: "Correctness", value: skillAverages.correctness },
  ];

  const overviewCards = [
    {
      icon: <BsBarChart size={18} />,
      label: "Total interviews",
      value: totalInterviews,
    },
    {
      icon: <BsTrophy size={18} />,
      label: "Average score",
      value: `${averageScore}/10`,
    },
    {
      icon: <BsFire size={18} />,
      label: "Current streak",
      value: `${currentStreak} day${currentStreak === 1 ? "" : "s"}`,
    },
  ];

  return (
    <div className="min-h-screen relative bg-[#F7F6F3] dark:bg-[#0A0B0D] px-4 sm:px-6 lg:px-10 py-8 transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .report-root, .report-root * { font-family: 'Manrope', sans-serif; }
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div className="report-root relative z-10 max-w-350 mx-auto">
        {/* ============ header ============ */}
        <div className="mb-8 flex items-start gap-4 flex-wrap">
          <button
            onClick={() => navigate("/")}
            className="mt-1 w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-[#131519] border border-[#EAE9E5] dark:border-[#232830] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <FaArrowLeft
              className="text-[#5C6472] cursor-pointer dark:text-[#9AA1AC]"
              size={14}
            />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <IoSparklesSharp className="text-[#E8A94C]" size={18} />
              <h1 className="font-serif-display text-2xl sm:text-3xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight">
                My Progress
              </h1>
            </div>
            <p className="text-[#5C6472] dark:text-[#8B92A0] mt-2 text-sm">
              Your interview practice, tracked over time
            </p>
          </div>
        </div>

        {totalInterviews === 0 ? (
          <div className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-3xl p-10 text-center">
            <p className="text-[#5C6472] dark:text-[#8B92A0] mb-4">
              You haven't completed any interviews yet — finish one to see
              your progress here.
            </p>
            <button
              onClick={() => navigate("/interview")}
              className="bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] px-6 py-3 rounded-2xl font-semibold text-sm"
            >
              Start an interview
            </button>
          </div>
        ) : (
          <>
            {/* ============ overview cards ============ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
              {overviewCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-3xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)] p-6"
                >
                  <div className="flex items-center gap-2 mb-3 text-[#B27E2E] dark:text-[#E8A94C]">
                    {card.icon}
                    <span className="font-mono-studio text-[11px] tracking-wide uppercase text-[#8B92A0]">
                      {card.label}
                    </span>
                  </div>
                  <p className="font-serif-display text-3xl text-[#1C1F24] dark:text-[#EDEEF0]">
                    {card.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ============ skill averages ============ */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-3xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)] p-6 sm:p-8"
              >
                <h3 className="font-mono-studio text-[11px] tracking-wide text-[#8B92A0] mb-6 uppercase">
                  Skill averages (all interviews)
                </h3>
                <div className="space-y-5">
                  {skillBars.map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-[#3D4148] dark:text-[#C7CBD1]">
                          {s.label}
                        </span>
                        <span className="font-mono-studio font-semibold text-[#E8A94C]">
                          {s.value}
                        </span>
                      </div>
                      <div className="bg-[#EFEEEA] dark:bg-[#1B1E24] h-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.value * 10}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="bg-[#E8A94C] h-full rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ============ score trend ============ */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="lg:col-span-2 bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-3xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)] p-6 sm:p-8"
              >
                <h3 className="font-mono-studio text-[11px] tracking-wide text-[#8B92A0] mb-6 uppercase">
                  Score trend across interviews
                </h3>
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scoreTrend}>
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
                            stopOpacity={0.35}
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
                        className="stroke-[#EAE9E5] dark:stroke-[#1E2229]"
                      />
                      <XAxis
                        dataKey="label"
                        tick={{
                          fill: "currentColor",
                          fontFamily: "JetBrains Mono",
                          fontSize: 11,
                        }}
                        className="text-[#8B92A0]"
                      />
                      <YAxis
                        domain={[0, 10]}
                        tick={{
                          fill: "currentColor",
                          fontFamily: "JetBrains Mono",
                          fontSize: 11,
                        }}
                        className="text-[#8B92A0]"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--tooltip-bg, #fff)",
                          border: "1px solid #EAE9E5",
                          borderRadius: "10px",
                          fontFamily: "JetBrains Mono",
                          fontSize: "12px",
                        }}
                        formatter={(value, name, props) => [
                          `${value}/10`,
                          props.payload.company
                            ? `${props.payload.role} @ ${props.payload.company}`
                            : props.payload.role,
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#E8A94C"
                        strokeWidth={2.5}
                        fill="url(#progressFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* ============ weak topics ============ */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-3 bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-3xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)] p-6 sm:p-8"
              >
                <h3 className="font-mono-studio text-[11px] tracking-wide text-[#8B92A0] mb-6 uppercase">
                  Areas to focus on
                </h3>

                {weakTopics.length === 0 ? (
                  <p className="text-sm text-[#5C6472] dark:text-[#9AA1AC]">
                    No consistently weak topics yet — nice work! Keep
                    practicing to build a fuller picture.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {weakTopics.map((t) => (
                      <div
                        key={t.topic}
                        className="flex items-center justify-between bg-[#FAFAF8] dark:bg-[#0C0E11] border border-[#EAE9E5] dark:border-[#1E2229] rounded-2xl px-4 py-3.5"
                      >
                        <div className="flex items-center gap-3">
                          <BsClockHistory
                            className="text-[#9AA1AC] shrink-0"
                            size={14}
                          />
                          <div>
                            <p className="text-sm font-medium text-[#1C1F24] dark:text-[#EDEEF0]">
                              {t.topic}
                            </p>
                            <p className="text-xs text-[#9AA1AC]">
                              Asked {t.count} time{t.count > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono-studio text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          {t.averageScore}/10
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;