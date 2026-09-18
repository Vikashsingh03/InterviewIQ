import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
  BsArrowRight,
  BsCheckCircleFill,
} from "react-icons/bs";
import { IoSparklesSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AuthModel from "../components/AuthModel";
import evalImg from "../assets/ai-ans.png";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from "../components/Footer";

const heroWords = ["Practice", "Interview", "with"];
const techStack = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "OpenRouter AI",
  "Tailwind CSS",
  "Redux Toolkit",
  "Firebase",
];

const waveHeights = [40, 70, 100, 55, 85, 35, 65, 95, 45, 75];

function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const goStart = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate("/interview");
  };
  const goHistory = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate("/history");
  };

  return (
    <div className="relative min-h-screen bg-[#F7F6F3] dark:bg-[#0A0B0D] flex flex-col transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
        @keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
        .live-dot { animation: livePulse 1.8s ease-in-out infinite; }
        .film-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.025;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Mesh gradient — painted from the TRUE top of the page (y=0),
          fixed so it sits underneath the transparent fixed Navbar too.
          One single continuous background, no seam anywhere. Fades out
          by mid-page. */}
      <div
        className="pointer-events-none fixed top-0 left-0 right-0 h-225 overflow-hidden z-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(232,169,76,0.14),transparent_35%),radial-gradient(circle_at_85%_5%,rgba(94,200,216,0.10),transparent_35%)]"></div>
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#E8A94C]/15 dark:bg-[#E8A94C]/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob"></div>
        <div className="absolute top-32 -right-24 w-80 h-80 bg-[#5EC8D8]/15 dark:bg-[#5EC8D8]/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="film-grain" />

      <div className="relative z-50">
        <Navbar />
      </div>

      <div className="relative flex-1">
        {/* ============ HERO ============ */}
        <div className="relative z-10 px-6 pt-20 pb-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center lg:justify-start mb-8"
            >
              <div className="relative bg-white/70 dark:bg-[#111318]/70 backdrop-blur-md text-[#5C6472] dark:text-[#9AA1AC] text-sm px-4 py-2 rounded-full gap-2 flex items-center shadow-sm border border-white/50 dark:border-[#1E2229]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#E8A94C] opacity-75 live-dot"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E8A94C]"></span>
                </span>
                AI-powered smart interview platform
                <IoSparklesSharp size={15} className="text-[#E8A94C]" />
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
              {/* ---- left: headline + copy + CTA ---- */}
              <div className="text-center lg:text-left">
                <h1 className="font-serif-display text-5xl md:text-6xl lg:text-[3.6rem] leading-[1.08] tracking-tight text-[#1C1F24] dark:text-[#EDEEF0]">
                  <motion.span
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.12 } },
                    }}
                    className="inline-block"
                  >
                    {heroWords.map((word, i) => (
                      <motion.span
                        key={i}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.5 }}
                        className="inline-block mr-3"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.span>{" "}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
                    className="relative inline-block text-[#E8A94C]"
                  >
                    AI Intelligence
                  </motion.span>
                </h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-[#5C6472] dark:text-[#8B92A0] mt-6 max-w-lg mx-auto lg:mx-0 text-lg leading-relaxed"
                >
                  Role-based mock interviews with smart follow-up questions,
                  adaptive difficulty, and real-time performance evaluation —
                  built to feel like the real thing.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mt-10"
                >
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-[#E8A94C]/60 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-300"></div>
                    <motion.button
                      onClick={goStart}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="btn-shine cursor-pointer relative bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] px-10 py-3.5 rounded-full font-semibold flex items-center gap-2 shadow-xl"
                    >
                      Start Interview
                      <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>

                  <button
                    onClick={goHistory}
                    className="text-[#5C6472] dark:text-[#9AA1AC] font-medium px-6 py-3.5 rounded-full hover:bg-white/60 dark:hover:bg-[#111318]/60 transition"
                  >
                    View past interviews
                  </button>
                </motion.div>
              </div>

              {/* ---- right: live product mockup, viewfinder-framed to
                    match the actual live interview screen's studio look ---- */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: -1 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.4, type: "spring" }}
                className="relative mx-auto w-full max-w-sm"
              >
                <div className="absolute -inset-4 bg-[#E8A94C]/15 rounded-4xl blur-2xl"></div>

                <div className="relative bg-[#0C0E11] rounded-3xl shadow-2xl shadow-black/30 border border-[#1E2229] overflow-hidden">
                  {/* top bar */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E2229]">
                    <span className="font-mono-studio text-[11px] tracking-wide text-[#8B92A0]">
                      LIVE MOCK INTERVIEW
                    </span>
                    <span className="font-mono-studio text-[11px] px-2 py-1 rounded-full bg-[#E8A94C]/15 text-[#E8A94C]">
                      Q3 / 6
                    </span>
                  </div>

                  {/* avatar + waveform */}
                  <div className="px-6 pt-7 pb-5 flex flex-col items-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-[#E8A94C]/25 blur-xl animate-pulse"></div>
                      <div className="relative w-20 h-20 rounded-full bg-[#E8A94C] flex items-center justify-center shadow-lg shadow-black/30">
                        <BsRobot size={30} className="text-[#0A0B0D]" />
                      </div>
                    </div>

                    <div className="flex items-end gap-1 h-8 mt-5">
                      {waveHeights.map((h, i) => (
                        <span
                          key={i}
                          className="w-1 rounded-full bg-[#E8A94C]/80 animate-wave-bar"
                          style={{
                            height: `${h}%`,
                            animationDelay: `${i * 0.08}s`,
                          }}
                        ></span>
                      ))}
                    </div>
                  </div>

                  {/* transcript line */}
                  <div className="px-5 pb-5">
                    <div className="bg-[#15181D] border border-[#232830] rounded-xl p-4 text-sm text-[#D8DCE3] leading-relaxed">
                      "Tell me about a challenging bug you fixed recently —
                      what made it tricky?"
                    </div>
                  </div>

                  {/* live scoring chips */}
                  <div className="px-5 pb-5 flex flex-wrap gap-2">
                    {[
                      { label: "Confidence", value: "8/10" },
                      { label: "Communication", value: "7/10" },
                      { label: "Correctness", value: "9/10" },
                    ].map((s) => (
                      <span
                        key={s.label}
                        className="font-mono-studio text-[11px] px-2.5 py-1.5 rounded-lg bg-[#181B20] text-[#8B92A0] flex items-center gap-1.5"
                      >
                        <BsCheckCircleFill className="text-[#E8A94C]" size={10} />
                        {s.label}{" "}
                        <span className="text-[#E8A94C] font-semibold">
                          {s.value}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Tech stack marquee */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="relative mt-24 overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              }}
            >
              <div className="flex gap-3 w-max animate-marquee">
                {[...techStack, ...techStack].map((tech, i) => (
                  <span
                    key={i}
                    className="font-mono-studio text-xs px-4 py-2 rounded-full bg-white/70 dark:bg-[#111318]/70 backdrop-blur border border-[#EAE9E5] dark:border-[#1E2229] text-[#5C6472] dark:text-[#8B92A0] whitespace-nowrap"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ============ HOW IT WORKS ============ */}
        <div className="relative z-10 px-6 pb-28">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-4">
              {[
                {
                  icon: <BsRobot size={24} />,
                  step: "1",
                  title: "Role & experience selection",
                  desc: "AI adjusts difficulty based on the job role you pick.",
                },
                {
                  icon: <BsMic size={24} />,
                  step: "2",
                  title: "Smart voice interview",
                  desc: "Dynamic follow-up questions based on your answers.",
                },
                {
                  icon: <BsClock size={24} />,
                  step: "3",
                  title: "Timed simulation",
                  desc: "Real interview pressure with per-question time tracking.",
                },
              ].map((item, index) => (
                <React.Fragment key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    whileHover={{ y: -6 }}
                    className="group relative bg-white dark:bg-[#111318] rounded-3xl shadow-md p-8 w-72 max-w-[90%] transition-shadow duration-300 hover:shadow-[0_0_45px_-12px_rgba(232,169,76,0.35)] border border-[#EAE9E5] dark:border-[#1E2229]"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#0A0B0D] bg-[#E8A94C] shadow-lg shadow-black/10 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      {/* step number — was near-invisible in both themes
                          (light text on light bg, dark text on dark bg);
                          now dark/black in light mode, white in dark mode */}
                      <span className="font-serif-display text-3xl text-[#1C1F24] dark:text-white">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 text-lg text-[#1C1F24] dark:text-[#EDEEF0]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#5C6472] dark:text-[#8B92A0] leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>

                  {index < 2 && (
                    <BsArrowRight
                      size={20}
                      className="hidden md:block text-[#D8D6D0] dark:text-[#262B34] shrink-0"
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* ============ CAPABILITIES — bento grid ============ */}
        <div className="relative z-10 px-6 pb-28">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-serif-display text-4xl md:text-5xl text-center mb-16 text-[#1C1F24] dark:text-[#EDEEF0]"
            >
              Advanced AI <span className="text-[#E8A94C]">capabilities</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-3 gap-6 md:auto-rows-55"
            >
              {/* featured, larger cell */}
              <div className="md:col-span-2 md:row-span-2 group relative bg-white dark:bg-[#111318] rounded-3xl p-8 shadow-sm transition-all duration-300 border border-transparent hover:border-[#E8A94C]/30 hover:shadow-[0_0_45px_-15px_rgba(232,169,76,0.35)] flex flex-col md:flex-row items-center gap-6 overflow-hidden">
                <div className="w-full md:w-1/2 order-2 md:order-1">
                  <div className="bg-[#E8A94C] text-[#0A0B0D] w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-black/10">
                    <BsBarChart size={20} />
                  </div>
                  <h3 className="font-semibold mb-3 text-2xl text-[#1C1F24] dark:text-[#EDEEF0]">
                    AI Answer Evaluation
                  </h3>
                  <p className="text-[#5C6472] dark:text-[#8B92A0] leading-relaxed">
                    Every answer is scored on communication, technical
                    accuracy, and confidence — so you know exactly what to
                    work on, not just how you did overall.
                  </p>
                </div>
                <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center">
                  <img
                    src={evalImg}
                    alt="AI answer evaluation"
                    className="w-full h-auto object-contain max-h-56 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* two medium cells */}
              <div className="group relative bg-white dark:bg-[#111318] rounded-3xl p-6 shadow-sm transition-all duration-300 border border-transparent hover:border-[#E8A94C]/30 hover:shadow-[0_0_45px_-15px_rgba(232,169,76,0.35)] flex flex-col justify-between">
                <div>
                  <div className="bg-[#E8A94C] text-[#0A0B0D] w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/10">
                    <BsFileEarmarkText size={16} />
                  </div>
                  <h3 className="font-semibold mb-2 text-lg text-[#1C1F24] dark:text-[#EDEEF0]">
                    Resume-Based Questions
                  </h3>
                  <p className="text-sm text-[#5C6472] dark:text-[#8B92A0] leading-relaxed">
                    Project-specific questions pulled straight from your
                    uploaded resume.
                  </p>
                </div>
                <img
                  src={resumeImg}
                  alt="Resume based interview"
                  className="w-20 h-20 object-contain self-end group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="group relative bg-white dark:bg-[#111318] rounded-3xl p-6 shadow-sm transition-all duration-300 border border-transparent hover:border-[#E8A94C]/30 hover:shadow-[0_0_45px_-15px_rgba(232,169,76,0.35)] flex flex-col justify-between">
                <div>
                  <div className="bg-[#E8A94C] text-[#0A0B0D] w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/10">
                    <BsBarChart size={16} />
                  </div>
                  <h3 className="font-semibold mb-2 text-lg text-[#1C1F24] dark:text-[#EDEEF0]">
                    History & Analytics
                  </h3>
                  <p className="text-sm text-[#5C6472] dark:text-[#8B92A0] leading-relaxed">
                    Track progress over time with score trends and
                    topic-level breakdowns.
                  </p>
                </div>
                <img
                  src={analyticsImg}
                  alt="History and analytics"
                  className="w-20 h-20 object-contain self-end group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* wide small cell */}
              <div className="md:col-span-3 group relative bg-white dark:bg-[#111318] rounded-3xl p-6 shadow-sm transition-all duration-300 border border-transparent hover:border-[#E8A94C]/30 hover:shadow-[0_0_45px_-15px_rgba(232,169,76,0.35)] flex items-center gap-6">
                <div className="bg-[#E8A94C] text-[#0A0B0D] w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-black/10 shrink-0">
                  <BsFileEarmarkText size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-lg text-[#1C1F24] dark:text-[#EDEEF0]">
                    Downloadable PDF Report
                  </h3>
                  <p className="text-sm text-[#5C6472] dark:text-[#8B92A0] leading-relaxed">
                    Take your strengths, weaknesses, and improvement notes
                    with you — one click, one PDF.
                  </p>
                </div>
                <img
                  src={pdfImg}
                  alt="Downloadable PDF report"
                  className="w-16 h-16 object-contain hidden sm:block group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ============ INTERVIEW MODES ============ */}
        <div className="relative z-10 px-6 pb-28">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-serif-display text-4xl md:text-5xl text-center mb-16 text-[#1C1F24] dark:text-[#EDEEF0]"
            >
              Multiple interview <span className="text-[#E8A94C]">modes</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {[
                {
                  img: hrImg,
                  title: "HR Interview Mode",
                  desc: "Behavioral and communication-based evaluation.",
                },
                {
                  img: techImg,
                  title: "Technical Mode",
                  desc: "Deep technical questioning tailored to your role, plus a live coding round.",
                },
                {
                  img: confidenceImg,
                  title: "Delivery & Confidence",
                  desc: "Pace, filler words, and tone insights from how you actually speak.",
                },
                {
                  img: creditImg,
                  title: "Credit System",
                  desc: "Unlock interview sessions with a simple, transparent credit balance.",
                },
              ].map((mode, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-[#111318] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-[#EAE9E5] dark:border-[#1E2229]"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="w-1/2">
                      <h3 className="font-semibold text-xl mb-3 text-[#1C1F24] dark:text-[#EDEEF0]">
                        {mode.title}
                      </h3>
                      <p className="text-[#5C6472] dark:text-[#8B92A0] text-sm leading-relaxed">
                        {mode.desc}
                      </p>
                    </div>
                    <div className="w-1/2 flex justify-end">
                      <img
                        src={mode.img}
                        alt={mode.title}
                        className="w-28 h-28 object-contain animate-float group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ============ FINAL CTA ============ */}
        <div className="relative z-10 px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[2.5rem] p-px bg-linear-to-r from-[#E8A94C]/50 via-white/10 to-[#E8A94C]/50"
            >
              <div className="relative overflow-hidden rounded-[calc(2.5rem-1px)] bg-[#0A0B0D] px-8 py-16 md:px-16 md:py-20 text-center">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(232,169,76,0.16),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(94,200,216,0.10),transparent_45%)]"></div>
                <div className="film-grain opacity-[0.04]" />

                <span className="relative inline-flex items-center gap-2 font-mono-studio text-[11px] tracking-[0.08em] text-[#E8A94C] bg-[#E8A94C]/10 border border-[#E8A94C]/20 px-4 py-1.5 rounded-full mb-6">
                  <IoSparklesSharp size={13} />
                  READY WHEN YOU ARE
                </span>

                <h2 className="relative font-serif-display text-3xl md:text-5xl text-white mb-5 leading-tight">
                  Walk into your next interview
                  <br className="hidden md:block" /> already prepared.
                </h2>
                <p className="relative text-[#9AA1AC] max-w-xl mx-auto mb-10">
                  Pick a role, pick a mode, and start practicing in minutes —
                  your AI interviewer is ready when you are.
                </p>

                <div className="relative inline-block group">
                  <div className="absolute -inset-1 bg-[#E8A94C] rounded-full blur-md opacity-60 group-hover:opacity-90 transition duration-300"></div>
                  <motion.button
                    onClick={goStart}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="btn-shine cursor-pointer relative bg-white text-[#1C1F24] px-10 py-3.5 rounded-full font-semibold flex items-center gap-2 shadow-xl"
                  >
                    Start Interview
                    <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {showAuth && <AuthModel onclose={() => setShowAuth(false)} />}

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default Home;