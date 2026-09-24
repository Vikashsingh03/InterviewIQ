import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { BsArrowRight, BsCheck } from "react-icons/bs";
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

const heroWords = ["Walk", "in"];
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

const reportSkills = [
  { label: "Communication", score: 8 },
  { label: "Technical depth", score: 7 },
  { label: "Confidence", score: 9 },
];

const steps = [
  {
    n: "01",
    title: "Pick your role",
    desc: "Choose the role you're targeting — from frontend to backend to HR rounds. The interviewer calibrates difficulty and topics to match it.",
  },
  {
    n: "02",
    title: "Answer under pressure",
    desc: "Speak or type your answers against the clock. The interviewer pushes back with follow-up questions, exactly like a real panel would.",
  },
  {
    n: "03",
    title: "Get scored honestly",
    desc: "Every answer is scored on communication, technical accuracy, and confidence — with notes on what to fix before the real thing.",
  },
];

function SectionHead({ index, label, title, accent }) {
  return (
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-5">
        <span className="font-mono-studio text-xs text-[#B27E2E] dark:text-[#E8A94C]">{index}</span>
        <span className="h-px w-10 bg-[#E8A94C]/50" />
        <span className="font-mono-studio text-[11px] tracking-[0.18em] text-[#8B92A0]">{label}</span>
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-serif-display text-4xl md:text-5xl tracking-tight text-[#1C1F24] dark:text-[#EDEEF0]"
      >
        {title} <span className="italic text-[#B27E2E] dark:text-[#E8A94C]">{accent}</span>
      </motion.h2>
    </div>
  );
}

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
  const goPractice = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate("/practice");
  };

  return (
    <div className="relative min-h-screen bg-[#F7F6F3] dark:bg-[#0A0B0D] flex flex-col transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
        .film-grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 60;
          opacity: 0.03;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="film-grain" />

      <div className="relative z-50">
        <Navbar />
      </div>

      <div className="relative flex-1">
        <div className="relative z-10 px-6 pt-14 md:pt-20 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-10 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3 mb-8"
                >
                  <span className="h-px w-8 bg-[#E8A94C]" />
                  <span className="font-mono-studio text-[11px] tracking-[0.22em] text-[#8B92A0]">
                    PRACTICE — SCORE — IMPROVE
                  </span>
                </motion.div>

                <h1 className="font-serif-display text-5xl md:text-6xl lg:text-[4.2rem] leading-[1.04] tracking-tight text-[#1C1F24] dark:text-[#EDEEF0]">
                  <motion.span
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
                    className="inline-block"
                  >
                    {heroWords.map((word, i) => (
                      <motion.span
                        key={i}
                        variants={{ hidden: { opacity: 0, y: 34 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className="inline-block mr-4"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.span>{" "}
                  <motion.span
                    initial={{ opacity: 0, y: 34 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.3, ease: "easeOut" }}
                    className="inline-block italic text-[#B27E2E] dark:text-[#E8A94C]"
                  >
                    ready.
                  </motion.span>
                </h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.55 }}
                  className="text-[#5C6472] dark:text-[#9AA1AC] mt-7 max-w-lg text-lg leading-relaxed"
                >
                  Role-based mock interviews with sharp follow-up questions,
                  adaptive difficulty, and honest scoring on every answer —
                  so the real thing feels familiar.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.75 }}
                  className="flex flex-wrap items-center gap-6 mt-10"
                >
                  <motion.button
                    onClick={goStart}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="cursor-pointer bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] px-9 py-3.5 rounded-full font-semibold flex items-center gap-2.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.4)]"
                  >
                    Start interview
                    <BsArrowRight size={16} />
                  </motion.button>
                  <button
                    onClick={goPractice}
                    className="group cursor-pointer flex items-center gap-2 font-semibold text-[#1C1F24] dark:text-[#EDEEF0]"
                  >
                    <span className="border-b border-[#E8A94C] pb-0.5">Try free practice</span>
                    <BsArrowRight size={15} className="text-[#B27E2E] dark:text-[#E8A94C] group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="mt-12 pt-6 border-t border-[#E5E4E0] dark:border-[#1E2229]"
                >
                  <p className="font-mono-studio text-[10px] tracking-[0.18em] text-[#9AA1AC] leading-loose">
                    SOLO OR TWO-INTERVIEWER PANEL
                    <br />
                    PROCTORED SESSIONS · PDF REPORTS
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
                className="relative mx-auto w-full max-w-md"
              >
                <div className="absolute -inset-3 rounded-[28px] border border-[#E8A94C]/25 pointer-events-none" />
                <div className="relative bg-[#0C0E11] rounded-3xl shadow-[0_40px_90px_-30px_rgba(0,0,0,0.55)] border border-[#1E2229] overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2229]">
                    <div>
                      <p className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8B92A0]">INTERVIEW REPORT</p>
                      <p className="text-sm text-[#C7CBD1] mt-1">Backend Engineer · 6 questions</p>
                    </div>
                    <span className="font-mono-studio text-[10px] px-2.5 py-1 rounded-full border border-[#E8A94C]/30 text-[#E8A94C]">
                      SCORED
                    </span>
                  </div>

                  <div className="px-6 pt-6 pb-2 flex items-end gap-3">
                    <span className="font-serif-display text-6xl text-white leading-none">7.8</span>
                    <span className="font-mono-studio text-xs text-[#8B92A0] pb-1.5">/ 10 overall</span>
                  </div>

                  <div className="px-6 py-5 space-y-4">
                    {reportSkills.map((s, i) => (
                      <div key={s.label}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-xs text-[#9AA1AC]">{s.label}</span>
                          <span className="font-mono-studio text-xs text-[#E8A94C]">{s.score}/10</span>
                        </div>
                        <div className="h-1 rounded-full bg-[#1E2229] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.score * 10}%` }}
                            transition={{ duration: 1, delay: 0.9 + i * 0.18, ease: "easeOut" }}
                            className="h-full rounded-full bg-[#E8A94C]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mx-6 mb-5 rounded-xl bg-[#111318] border border-[#1E2229] p-4">
                    <p className="font-mono-studio text-[10px] tracking-[0.18em] text-[#8B92A0] mb-2">INTERVIEWER NOTE</p>
                    <p className="font-serif-display italic text-[15px] text-[#D8DCE3] leading-relaxed">
                      “Strong fundamentals — tighten up the trade-offs in your
                      system design answers.”
                    </p>
                  </div>

                  <div className="flex items-center justify-between px-6 py-4 border-t border-[#1E2229]">
                    <span className="font-mono-studio text-[10px] tracking-[0.14em] text-[#565D68]">SEP 24, 2026</span>
                    <span className="text-xs font-semibold text-[#E8A94C] flex items-center gap-1.5">
                      Download PDF <BsArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="relative mt-24 border-y border-[#E5E4E0] dark:border-[#1E2229] py-5 overflow-hidden"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
              }}
            >
              <div className="flex gap-10 w-max animate-marquee items-center">
                {[...techStack, ...techStack].map((tech, i) => (
                  <span key={i} className="flex items-center gap-10 shrink-0">
                    <span className="font-mono-studio text-[13px] tracking-wide text-[#8B92A0] whitespace-nowrap">{tech}</span>
                    <span className="w-1 h-1 bg-[#E8A94C]/60 rotate-45 shrink-0" />
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <SectionHead index="01" label="HOW IT WORKS" title="Three steps to a" accent="real rep." />

            <div className="grid md:grid-cols-3 gap-px bg-[#E5E4E0] dark:bg-[#1E2229] rounded-3xl overflow-hidden border border-[#E5E4E0] dark:border-[#1E2229]">
              {steps.map((item, index) => (
                <motion.div
                  key={item.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="bg-[#F7F6F3] dark:bg-[#0A0B0D] p-9"
                >
                  <p className="font-serif-display italic text-5xl text-[#E8A94C]/70 mb-6">{item.n}</p>
                  <h3 className="font-semibold text-xl mb-3 text-[#1C1F24] dark:text-[#EDEEF0]">{item.title}</h3>
                  <p className="text-[15px] text-[#5C6472] dark:text-[#8B92A0] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -3 }}
              onClick={goPractice}
              className="group relative w-full text-left overflow-hidden rounded-[28px] bg-[#0C0E11] border border-[#1E2229] hover:border-[#E8A94C]/40 p-8 sm:p-12 transition-colors duration-300 cursor-pointer"
            >
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="max-w-xl">
                  <p className="font-mono-studio text-[10px] tracking-[0.2em] text-[#E8A94C] mb-5">
                    FREE · UNLIMITED · NO CREDITS
                  </p>
                  <h3 className="font-serif-display text-3xl sm:text-4xl text-white leading-tight mb-4">
                    Not ready for the full thing? <span className="italic text-[#E8A94C]">Warm up first.</span>
                  </h3>
                  <p className="text-[#9AA1AC] leading-relaxed">
                    One question at a time — DSA problems or HR rounds — with
                    instant scoring and a daily challenge to keep the streak alive.
                  </p>
                </div>
                <span className="shrink-0 font-semibold inline-flex items-center gap-2.5 bg-[#E8A94C] text-[#0A0B0D] px-8 py-4 rounded-full group-hover:gap-4 transition-all duration-200">
                  Open Practice Hub
                  <BsArrowRight size={16} />
                </span>
              </div>
            </motion.button>
          </div>
        </div>

        <div className="relative z-10 px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <SectionHead index="02" label="WHAT YOU GET" title="Built for" accent="serious preparation." />

            <div className="border-t border-[#E5E4E0] dark:border-[#1E2229]">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid md:grid-cols-2 gap-10 items-center py-14 border-b border-[#E5E4E0] dark:border-[#1E2229]"
              >
                <div>
                  <p className="font-mono-studio text-[11px] tracking-[0.18em] text-[#B27E2E] dark:text-[#E8A94C] mb-4">ANSWER EVALUATION</p>
                  <h3 className="font-serif-display text-3xl mb-4 text-[#1C1F24] dark:text-[#EDEEF0]">Know exactly what to fix</h3>
                  <p className="text-[#5C6472] dark:text-[#8B92A0] leading-relaxed mb-6">
                    Every answer is scored on communication, technical accuracy,
                    and confidence — so you work on the right things instead of
                    guessing.
                  </p>
                  <ul className="space-y-2.5">
                    {["Per-answer breakdowns", "Strengths and gaps, spelled out", "Trackable across interviews"].map((t) => (
                      <li key={t} className="flex items-center gap-2.5 text-[15px] text-[#3D4148] dark:text-[#C7CBD1]">
                        <BsCheck size={16} className="text-[#B27E2E] dark:text-[#E8A94C] shrink-0" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-center">
                  <img src={evalImg} alt="Answer evaluation" className="w-full max-w-sm h-auto object-contain" />
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-px bg-[#E5E4E0] dark:bg-[#1E2229] border-b border-[#E5E4E0] dark:border-[#1E2229]">
                {[
                  { img: resumeImg, kicker: "RESUME-BASED", title: "Questions from your resume", desc: "Upload your resume and get grilled on your own projects — the way real interviewers do it." },
                  { img: analyticsImg, kicker: "HISTORY & ANALYTICS", title: "Watch yourself improve", desc: "Score trends and topic-level breakdowns across every interview you've taken." },
                ].map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-[#F7F6F3] dark:bg-[#0A0B0D] p-9"
                  >
                    <img src={f.img} alt={f.title} className="w-16 h-16 object-contain mb-6" />
                    <p className="font-mono-studio text-[11px] tracking-[0.18em] text-[#B27E2E] dark:text-[#E8A94C] mb-3">{f.kicker}</p>
                    <h3 className="font-semibold text-xl mb-2.5 text-[#1C1F24] dark:text-[#EDEEF0]">{f.title}</h3>
                    <p className="text-[15px] text-[#5C6472] dark:text-[#8B92A0] leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-12 border-b border-[#E5E4E0] dark:border-[#1E2229]"
              >
                <img src={pdfImg} alt="PDF report" className="w-16 h-16 object-contain shrink-0" />
                <div className="flex-1">
                  <p className="font-mono-studio text-[11px] tracking-[0.18em] text-[#B27E2E] dark:text-[#E8A94C] mb-3">PDF REPORT</p>
                  <h3 className="font-semibold text-xl mb-2 text-[#1C1F24] dark:text-[#EDEEF0]">Take the feedback with you</h3>
                  <p className="text-[15px] text-[#5C6472] dark:text-[#8B92A0] leading-relaxed">
                    Strengths, weaknesses, and improvement notes in one downloadable report. One click.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <SectionHead index="03" label="PICK YOUR FORMAT" title="Interview" accent="modes." />

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { img: hrImg, title: "HR Round", desc: "Behavioral questions and communication — the round most engineers underestimate." },
                { img: techImg, title: "Technical Round", desc: "Deep role-specific questioning, plus a live coding round when it matters." },
                { img: confidenceImg, title: "Delivery & Confidence", desc: "Pace, filler words, and tone — insights from how you actually sound." },
                { img: creditImg, title: "Simple credits", desc: "Pay per interview, nothing more. Practice Hub stays free forever." },
              ].map((mode, index) => (
                <motion.div
                  key={mode.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white dark:bg-[#111318] rounded-3xl p-8 border border-[#EAE9E5] dark:border-[#1E2229] hover:border-[#E8A94C]/40 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="font-semibold text-xl mb-2.5 text-[#1C1F24] dark:text-[#EDEEF0]">{mode.title}</h3>
                      <p className="text-[15px] text-[#5C6472] dark:text-[#8B92A0] leading-relaxed">{mode.desc}</p>
                    </div>
                    <img src={mode.img} alt={mode.title} className="w-20 h-20 object-contain shrink-0 group-hover:scale-105 transition-transform duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-4xl bg-[#0C0E11] px-8 py-16 md:px-16 md:py-20"
            >
              <span className="pointer-events-none absolute inset-x-16 top-0 h-px bg-linear-to-r from-transparent via-[#E8A94C]/50 to-transparent" />
              <div className="relative max-w-2xl">
                <p className="font-mono-studio text-[11px] tracking-[0.22em] text-[#E8A94C] mb-6">READY WHEN YOU ARE</p>
                <h2 className="font-serif-display text-4xl md:text-5xl text-white leading-[1.1] tracking-tight mb-5">
                  Your next interview is already on the calendar. <span className="italic text-[#E8A94C]">Be ready for it.</span>
                </h2>
                <p className="text-[#9AA1AC] text-lg leading-relaxed mb-10">
                  Pick a role, pick a mode, and start your first mock in minutes.
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <motion.button
                    onClick={goStart}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="cursor-pointer bg-[#EDEEF0] text-[#0A0B0D] px-9 py-3.5 rounded-full font-semibold flex items-center gap-2.5"
                  >
                    Start interview
                    <BsArrowRight size={16} />
                  </motion.button>
                  <button
                    onClick={goHistory}
                    className="cursor-pointer text-[#9AA1AC] hover:text-white font-medium transition-colors"
                  >
                    View past interviews
                  </button>
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
