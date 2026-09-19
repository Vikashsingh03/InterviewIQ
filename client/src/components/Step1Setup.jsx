import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaFileAlt,
} from "react-icons/fa";
import {
  BsRobot,
  BsMic,
  BsBarChart,
  BsBuilding,
  BsCheckCircleFill,
  BsPeopleFill,
  BsPersonFill,
} from "react-icons/bs";
import { IoWarningOutline, IoSparklesSharp } from "react-icons/io5";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

// shown as datalist suggestions — the field also accepts any free-typed
// company name, the backend just won't have a curated style guide for it
const SUGGESTED_COMPANIES = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Apple",
  "Netflix",
  "Flipkart",
  "TCS",
  "Infosys",
  "Wipro",
  "Accenture",
  "Startup",
];

function Step1Setup({ onstart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [interviewType, setInterviewType] = useState("solo");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  // the candidate's real name, extracted from their resume — used to greet
  // them correctly in the interview instead of their account's login name
  const [candidateName, setCandidateName] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // shown to the user on resume-analysis or start-interview failures
  const [resumeError, setResumeError] = useState("");
  const [startError, setStartError] = useState("");

  // drives the small "fields ready" readout in the left panel — purely
  // cosmetic, doesn't gate anything the backend already validates
  const fieldsReady = [role, experience].filter(Boolean).length;

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);
    setResumeError("");

    const formdata = new FormData();
    formdata.append("resume", resumeFile);

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/resume",
        formdata,
        { withCredentials: true },
      );

      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      // these must stay arrays — a "" fallback would break the .map() calls below
      setProjects(
        Array.isArray(result.data.projects) ? result.data.projects : [],
      );
      setSkills(Array.isArray(result.data.skills) ? result.data.skills : []);
      setResumeText(result.data.resumeText || "");
      setCandidateName(result.data.name || "");
      setAnalysisDone(true);
    } catch (error) {
      console.log(error);
      setResumeError(
        error?.response?.data?.message ||
          "Couldn't analyze the resume. You can still fill the details manually below.",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    setStartError("");
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/generate-questions",
        {
          role,
          experience,
          mode,
          interviewType,
          company,
          jobDescription,
          resumeText,
          projects,
          skills,
          candidateName,
        },
        { withCredentials: true },
      );

      // backend sends `creditsLeft`, not `credits` — this was silently setting credits to undefined
      if (userData) {
        dispatch(
          setUserData({ ...userData, credits: result.data.creditsLeft }),
        );
      }
      onstart(result.data);
    } catch (error) {
      console.log(error);
      setStartError(
        error?.response?.data?.message ||
          "Couldn't start the interview. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const MODES = [
    { value: "Technical", icon: <BsRobot size={15} />, label: "Technical" },
    { value: "HR", icon: <BsMic size={15} />, label: "HR / Behavioral" },
  ];

  const INTERVIEW_TYPES = [
    {
      value: "solo",
      icon: <BsPersonFill size={16} />,
      label: "Solo AI",
      sub: "One interviewer",
    },
    {
      value: "panel",
      icon: <BsPeopleFill size={16} />,
      label: "Panel (2 AI)",
      sub: "Technical + HR, back to back",
    },
  ];

  return (
    <div className="min-h-screen relative bg-[#F7F6F3] dark:bg-[#0A0B0D] flex items-center justify-center p-4 sm:p-6 py-12 transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .studio-root, .studio-root * { font-family: 'Manrope', sans-serif; }
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }

        .film-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.03;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* fine diagonal hairline mesh — reads as an engineering blueprint,
           quiet at this opacity, sits behind the glow orbs on the left panel */
        .blueprint-mesh {
          position: absolute;
          inset: 0;
          opacity: 0.5;
          background-image:
            linear-gradient(115deg, rgba(232,169,76,0.05) 1px, transparent 1px),
            linear-gradient(25deg, rgba(94,200,216,0.04) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: radial-gradient(ellipse at 30% 20%, black 0%, transparent 70%);
        }

        .viewfinder-corner { position: absolute; width: 18px; height: 18px; z-index: 2; }
        .viewfinder-corner::before, .viewfinder-corner::after { content: ''; position: absolute; background: #E8A94C; box-shadow: 0 0 6px rgba(232,169,76,0.6); }
        .corner-tl { top: 9px; left: 9px; }
        .corner-tl::before { width: 2px; height: 100%; top: 0; left: 0; }
        .corner-tl::after { height: 2px; width: 100%; top: 0; left: 0; }
        .corner-tr { top: 9px; right: 9px; }
        .corner-tr::before { width: 2px; height: 100%; top: 0; right: 0; }
        .corner-tr::after { height: 2px; width: 100%; top: 0; right: 0; }
        .corner-bl { bottom: 9px; left: 9px; }
        .corner-bl::before { width: 2px; height: 100%; bottom: 0; left: 0; }
        .corner-bl::after { height: 2px; width: 100%; bottom: 0; left: 0; }
        .corner-br { bottom: 9px; right: 9px; }
        .corner-br::before { width: 2px; height: 100%; bottom: 0; right: 0; }
        .corner-br::after { height: 2px; width: 100%; bottom: 0; right: 0; }

        @keyframes livePulse { 0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(232,169,76,0.5); } 50% { opacity: 0.55; box-shadow: 0 0 0 4px rgba(232,169,76,0); } }
        .live-dot { animation: livePulse 1.8s ease-in-out infinite; }

        .studio-input {
          background: transparent;
        }
        .studio-input:focus-within {
          border-color: rgba(232,169,76,0.5) !important;
          box-shadow: 0 0 0 4px rgba(232,169,76,0.1);
        }

        /* shine sweep on the primary CTA — plays once on hover, not looping */
        .shine-cta { position: relative; overflow: hidden; }
        .shine-cta::after {
          content: '';
          position: absolute;
          top: 0; left: -60%;
          width: 40%; height: 100%;
          background: linear-gradient(115deg, transparent, rgba(255,255,255,0.35), transparent);
          transform: skewX(-20deg);
          transition: left 0.6s ease;
        }
        .shine-cta:hover::after { left: 130%; }
      `}</style>

      <div className="film-grain" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="studio-root relative z-10 w-full max-w-350 bg-white dark:bg-[#0F1115] rounded-[28px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] border border-[#EAE9E5] dark:border-[#1E2229] overflow-hidden grid md:grid-cols-2"
      >
        {/* ============ LEFT: editorial panel ============ */}
        <div className="relative bg-[#0C0E11] p-9 sm:p-11 flex flex-col justify-center overflow-hidden">
          <div className="blueprint-mesh" />
          <div className="pointer-events-none absolute -top-24 -left-16 w-72 h-72 bg-[#E8A94C]/12 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 bg-[#5EC8D8]/12 rounded-full blur-3xl" />

          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8A94C] live-dot" />
              <span className="font-mono-studio text-[11px] tracking-[0.08em] text-[#E8A94C]">
                SETUP · NEW SESSION
              </span>
            </div>
            <span className="font-mono-studio text-[10px] tracking-wide text-[#565D68]">
              {fieldsReady}/2 READY
            </span>
          </div>

          <h2 className="relative font-serif-display text-[2.3rem] sm:text-5xl text-white leading-[1.05] mb-5">
            Start your
            <br />
            AI interview
          </h2>

          <p className="relative text-sm text-[#9AA1AC] mb-10 leading-relaxed max-w-xs">
            A live, adaptive mock interview — tailored to your role,
            resume, and target company. Practiced like the real thing.
          </p>

          <div className="relative space-y-3">
            {[
              {
                icon: <FaUserTie className="text-[#E8A94C]" size={15} />,
                text: "Role, experience & target company",
              },
              {
                icon: <BsMic className="text-[#E8A94C]" size={15} />,
                text: "Live voice interview with follow-ups",
              },
              {
                icon: <BsBarChart className="text-[#E8A94C]" size={15} />,
                text: "Delivery, coding & performance analytics",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 + index * 0.12 }}
                className="flex items-center gap-3 bg-white/4 border border-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl hover:border-[#E8A94C]/25 transition-colors duration-300"
              >
                <span className="w-8 h-8 shrink-0 rounded-lg bg-[#E8A94C]/10 flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="text-[#D8DCE3] text-sm font-medium">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ============ RIGHT: the form desk ============ */}
        <div className="p-7 sm:p-10 bg-[#F7F6F3] dark:bg-[#0F1115]">
          <div className="flex items-center gap-2.5 mb-7">
            <IoSparklesSharp className="text-[#E8A94C]" size={18} />
            <h2 className="font-serif-display text-2xl sm:text-3xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight">
              Interview Setup
            </h2>
          </div>

          <div className="space-y-5">
            {/* role */}
            <div className="studio-input relative rounded-2xl border border-[#E5E4E0] dark:border-[#1E2229] bg-white dark:bg-[#0C0E11] transition-all duration-200">
              <FaUserTie
                className="absolute top-4 left-4 text-[#9AA1AC] dark:text-[#565D68]"
                size={14}
              />
              <input
                type="text"
                placeholder="Enter role — e.g. Frontend Developer"
                className="w-full pl-11 pr-4 py-3.5 bg-transparent text-[#1C1F24] dark:text-[#EDEEF0] placeholder-[#9AA1AC] dark:placeholder-[#565D68] outline-none text-sm"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>

            {/* experience */}
            <div className="studio-input relative rounded-2xl border border-[#E5E4E0] dark:border-[#1E2229] bg-white dark:bg-[#0C0E11] transition-all duration-200">
              <FaBriefcase
                className="absolute top-4 left-4 text-[#9AA1AC] dark:text-[#565D68]"
                size={14}
              />
              <input
                type="text"
                placeholder="Experience — e.g. 2 years"
                className="w-full pl-11 pr-4 py-3.5 bg-transparent text-[#1C1F24] dark:text-[#EDEEF0] placeholder-[#9AA1AC] dark:placeholder-[#565D68] outline-none text-sm"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>

            {/* mode — pill toggle instead of a plain select */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#EFEEEA] dark:bg-[#0C0E11] border border-[#E5E4E0] dark:border-[#1E2229]">
              {MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMode(m.value)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    mode === m.value
                      ? "bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] shadow-md"
                      : "text-[#5C6472] dark:text-[#8B92A0] hover:text-[#1C1F24] dark:hover:text-[#EDEEF0]"
                  }`}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>

            {/* interview type — Solo AI vs Mock Panel Mode */}
            <div>
              <p className="text-xs font-medium text-[#5C6472] dark:text-[#9AA1AC] mb-2 pl-1">
                Interviewer setup
              </p>
              <div className="grid grid-cols-2 gap-2">
                {INTERVIEW_TYPES.map((t) => {
                  const isSelected = interviewType === t.value;
                  return (
                    <motion.button
                      key={t.value}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInterviewType(t.value)}
                      className={`relative flex flex-col items-start gap-1.5 p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                        isSelected
                          ? "border-[#E8A94C] bg-[#E8A94C]/8 shadow-[0_8px_24px_-12px_rgba(232,169,76,0.5)]"
                          : "border-[#E5E4E0] dark:border-[#1E2229] bg-white dark:bg-[#0C0E11] hover:border-[#E8A94C]/30"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center mb-0.5 transition-colors duration-200 ${
                          isSelected
                            ? "bg-[#E8A94C] text-[#1C1F24]"
                            : "bg-[#EFEEEA] dark:bg-[#181B20] text-[#9AA1AC] dark:text-[#565D68]"
                        }`}
                      >
                        {t.icon}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          isSelected
                            ? "text-[#B27E2E] dark:text-[#E8A94C]"
                            : "text-[#1C1F24] dark:text-[#EDEEF0]"
                        }`}
                      >
                        {t.label}
                      </span>
                      <span className="text-[11px] text-[#8B92A0] leading-snug">
                        {t.sub}
                      </span>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-3 right-3"
                          >
                            <BsCheckCircleFill className="text-[#E8A94C]" size={14} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
              <AnimatePresence>
                {interviewType === "panel" && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-[11px] text-[#9AA1AC] dark:text-[#565D68] pl-1 leading-relaxed overflow-hidden"
                  >
                    Two AI interviewers alternate questions — Interviewer A goes
                    deep on technical depth, Interviewer B focuses on
                    communication and fit. Uses more credits than Solo AI.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* company */}
            <div>
              <div className="studio-input relative rounded-2xl border border-[#E5E4E0] dark:border-[#1E2229] bg-white dark:bg-[#0C0E11] transition-all duration-200">
                <BsBuilding
                  className="absolute top-4 left-4 text-[#9AA1AC] dark:text-[#565D68]"
                  size={14}
                />
                <input
                  type="text"
                  list="company-suggestions"
                  placeholder="Target company (optional, e.g. Google)"
                  className="w-full pl-11 pr-4 py-3.5 bg-transparent text-[#1C1F24] dark:text-[#EDEEF0] placeholder-[#9AA1AC] dark:placeholder-[#565D68] outline-none text-sm"
                  onChange={(e) => setCompany(e.target.value)}
                  value={company}
                />
                <datalist id="company-suggestions">
                  {SUGGESTED_COMPANIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <p className="mt-1.5 text-[11px] text-[#9AA1AC] dark:text-[#565D68] pl-1">
                AI tailors question style to that company's known interview
                culture.
              </p>
            </div>

            {/* job description */}
            <div>
              <button
                type="button"
                onClick={() => setShowJobDescription((v) => !v)}
                className="flex items-center gap-2 font-mono-studio text-[11px] tracking-wide text-[#B27E2E] dark:text-[#E8A94C] hover:opacity-80 transition"
              >
                <FaFileAlt size={11} />
                {showJobDescription
                  ? "HIDE JOB DESCRIPTION"
                  : "PASTE A JOB DESCRIPTION (OPTIONAL)"}
              </button>

              <AnimatePresence>
                {showJobDescription && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="studio-input mt-3 rounded-2xl border border-[#E5E4E0] dark:border-[#1E2229] bg-white dark:bg-[#0C0E11] transition-all duration-200">
                      <textarea
                        rows={5}
                        placeholder="Paste the actual job posting here — AI will tailor questions to its specific responsibilities and required skills, not just the role title."
                        className="w-full px-4 py-3.5 bg-transparent text-[#1C1F24] dark:text-[#EDEEF0] placeholder-[#9AA1AC] dark:placeholder-[#565D68] outline-none resize-none text-sm leading-relaxed"
                        onChange={(e) => setJobDescription(e.target.value)}
                        value={jobDescription}
                        maxLength={4000}
                      />
                    </div>
                    <p className="mt-1.5 font-mono-studio text-[10px] text-[#9AA1AC] dark:text-[#565D68] pl-1">
                      {jobDescription.length}/4000 CHARACTERS
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* resume upload — viewfinder-corner dropzone, matching the
                camera preview aesthetic from the live interview screen */}
            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => document.getElementById("resumeUpload").click()}
                className="relative rounded-2xl border-2 border-dashed border-[#E5E4E0] dark:border-[#262B34] p-7 text-center cursor-pointer hover:border-[#E8A94C]/50 hover:bg-[#E8A94C]/5 transition-all duration-200"
              >
                <div className="viewfinder-corner corner-tl" />
                <div className="viewfinder-corner corner-tr" />
                <div className="viewfinder-corner corner-bl" />
                <div className="viewfinder-corner corner-br" />

                <FaFileUpload
                  className="text-3xl mx-auto text-[#B27E2E] dark:text-[#E8A94C] mb-3"
                />
                <input
                  type="file"
                  id="resumeUpload"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    setResumeFile(e.target.files[0]);
                    setResumeError("");
                  }}
                />

                <p className="text-[#5C6472] dark:text-[#9AA1AC] font-medium text-sm">
                  {resumeFile
                    ? resumeFile.name
                    : "Click to upload resume (optional)"}
                </p>

                {resumeFile && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    disabled={analyzing}
                    className="mt-4 bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] px-5 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-70"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {resumeError && (
              <div className="bg-[#E8A94C]/8 border border-[#E8A94C]/25 rounded-xl p-3 flex items-start gap-2">
                <IoWarningOutline
                  size={15}
                  className="text-[#B27E2E] dark:text-[#E8A94C] mt-0.5 shrink-0"
                />
                <p className="text-[#8A6A2F] dark:text-[#E8B96A] text-xs leading-relaxed">
                  {resumeError}
                </p>
              </div>
            )}

            <AnimatePresence>
              {analysisDone && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-[#FAFAF8] dark:bg-[#0C0E11] border border-[#E5E4E0] dark:border-[#1E2229] rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <BsCheckCircleFill className="text-emerald-500" size={14} />
                    <h3 className="font-mono-studio text-[11px] tracking-wide text-[#5C6472] dark:text-[#8B92A0] uppercase">
                      Resume analysis result
                    </h3>
                  </div>

                  {projects.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-[#5C6472] dark:text-[#9AA1AC] mb-1.5">
                        Projects
                      </p>
                      <ul className="list-disc list-inside text-sm text-[#3D4148] dark:text-[#C7CBD1] space-y-1">
                        {projects.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-[#5C6472] dark:text-[#9AA1AC] mb-1.5">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((s, i) => (
                          <span
                            key={i}
                            className="font-mono-studio bg-[#E8A94C]/10 text-[#B27E2E] dark:text-[#E8A94C] px-2.5 py-1 rounded-full text-[11px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {startError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 flex items-start gap-2">
                <IoWarningOutline
                  size={15}
                  className="text-red-600 dark:text-red-400 mt-0.5 shrink-0"
                />
                <p className="text-red-700 dark:text-red-400 text-xs leading-relaxed">
                  {startError}
                </p>
              </div>
            )}

            <motion.button
              onClick={handleStart}
              disabled={!role || !experience || loading}
              whileHover={{ scale: role && experience ? 1.02 : 1 }}
              whileTap={{ scale: role && experience ? 0.98 : 1 }}
              className="shine-cta w-full disabled:bg-[#D8D6D0] dark:disabled:bg-[#1E2229] disabled:text-[#9AA1AC] dark:disabled:text-[#565D68] disabled:cursor-not-allowed bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] py-3.5 rounded-2xl text-base font-semibold transition-all duration-200 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2"
            >
              {loading && (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
                />
              )}
              {loading
                ? "Starting interview..."
                : interviewType === "panel"
                  ? "Start Panel Interview"
                  : "Start Interview"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Step1Setup;