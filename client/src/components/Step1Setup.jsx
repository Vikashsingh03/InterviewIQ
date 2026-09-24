import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaUserTie, FaBriefcase, FaFileUpload, FaFileAlt } from "react-icons/fa";
import { BsTerminal, BsChatLeftText, BsBuilding, BsCheckCircleFill, BsCheckLg, BsPeopleFill, BsPersonFill, BsBullseye, BsArrowRight, BsChevronDown } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
const SUGGESTED_COMPANIES = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Flipkart", "TCS", "Infosys", "Wipro", "Accenture", "Startup"];

const OPT_SELECTED = "border-[#9A7B24] dark:border-[#E8A94C] bg-[#C99E41]/8 dark:bg-[#E8A94C]/8";
const OPT_IDLE = "border-[#E8E6E1] dark:border-[#232830] bg-white dark:bg-[#111318] hover:border-[#9A7B24]/40 dark:hover:border-[#E8A94C]/40";
const OPT_ICON_SELECTED = "bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D]";
const OPT_ICON_IDLE = "bg-[#F5F4F1] dark:bg-[#14171C] text-[#8A929C] dark:text-[#565D68]";
const OPT_LABEL_SELECTED = "text-[#9A7B24] dark:text-[#E8A94C]";
const OPT_LABEL_IDLE = "text-[#14171B] dark:text-[#EDEEF0]";
const CHECK_GOLD = "text-[#9A7B24] dark:text-[#E8A94C]";
const INPUT_WRAP = "studio-input relative rounded-xl border border-[#E8E6E1] dark:border-[#232830] bg-white dark:bg-[#111318] transition-all duration-200";
const INPUT_TEXT = "w-full bg-transparent text-[#14171B] dark:text-[#EDEEF0] placeholder:text-[#8A929C] dark:placeholder:text-[#565D68] outline-none text-sm";
const INPUT_ICON = "absolute left-4 text-[#8A929C] dark:text-[#565D68]";

function FormSection({ n, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="font-serif-display italic text-lg leading-none text-[#9A7B24] dark:text-[#E8A94C]">{n}</span>
        <span className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8A929C] dark:text-[#565D68]">{title}</span>
        <span className="h-px flex-1 bg-[#E8E6E1] dark:bg-[#232830]" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SpecRow({ label, value, live }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 border-b border-[#E8E6E1] dark:border-[#232830]">
      <span className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#565D68]">{label}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className={`text-sm text-right truncate max-w-[60%] ${live ? "text-[#9A7B24] dark:text-[#E8A94C] font-medium" : "text-[#3E4650] dark:text-[#9AA1AC]"}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Step1Setup({ onstart }) {
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [interviewType, setInterviewType] = useState("solo");
  const [language, setLanguage] = useState("english");
  const [company, setCompany] = useState("");
  const [companyMode, setCompanyMode] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const [startError, setStartError] = useState("");
  const [showMoreCompanies, setShowMoreCompanies] = useState(false);
  const fieldsReady = [role, experience].filter(Boolean).length;

  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
  const langLabel = language === "english" ? "English" : language === "hinglish" ? "Hinglish" : "हिन्दी";
  const typeLabel = interviewType === "solo" ? "Solo" : "Panel · 2 AI";
  const resumeLabel = analysisDone ? "Attached" : resumeFile ? "Selected" : "—";

  const selectCompanyMode = (c) => {
    setCompanyMode(c.id);
    setCompany(c.id ? c.name : "");
  };
  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);
    setResumeError("");
    const formdata = new FormData();
    formdata.append("resume", resumeFile);
    try {
      const result = await axios.post(ServerUrl + "/api/interview/resume", formdata, { withCredentials: true });
      setRole(prev => prev || result.data.role || "");
      setExperience(prev => prev || result.data.experience || "");
      setProjects(Array.isArray(result.data.projects) ? result.data.projects : []);
      setSkills(Array.isArray(result.data.skills) ? result.data.skills : []);
      setResumeText(result.data.resumeText || "");
      setCandidateName(result.data.name || "");
      setAnalysisDone(true);
    } catch (error) {
      console.log(error);
      setResumeError(error?.response?.data?.message || "Couldn't analyze the resume. You can still fill the details manually below.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCheckMatch = async () => {
    if (matchLoading) return;
    setMatchLoading(true);
    setMatchError("");
    setMatchResult(null);
    try {
      const result = await axios.post(ServerUrl + "/api/interview/match-score", {
        resumeText, skills, projects, jobDescription
      }, { withCredentials: true });
      setMatchResult(result.data);
    } catch (error) {
      console.log(error);
      setMatchError(error?.response?.data?.message || "Couldn't check the match right now. Please try again.");
    } finally {
      setMatchLoading(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    setStartError("");
    try {
      const result = await axios.post(ServerUrl + "/api/interview/generate-questions", {
        role, experience, mode, interviewType, company, companyMode, jobDescription,
        resumeText, projects, skills, candidateName, language
      }, { withCredentials: true });
      if (userData) {
        dispatch(setUserData({ ...userData, credits: result.data.creditsLeft }));
      }
      onstart(result.data);
    } catch (error) {
      console.log(error);
      setStartError(error?.response?.data?.message || "Couldn't start the interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const MODES = [
    { value: "Technical", icon: <BsTerminal size={15} />, label: "Technical", sub: "Role-depth questions" },
    { value: "HR", icon: <BsChatLeftText size={15} />, label: "HR / Behavioral", sub: "Fit & communication" },
  ];
  const LANGUAGES = [
    { value: "english", label: "English", sub: "Default" },
    { value: "hinglish", label: "Hinglish", sub: "Roman script" },
    { value: "hindi", label: "हिन्दी", sub: "देवनागरी" },
  ];
  const INTERVIEW_TYPES = [
    { value: "solo", icon: <BsPersonFill size={16} />, label: "Solo", sub: "One interviewer" },
    { value: "panel", icon: <BsPeopleFill size={16} />, label: "Panel · 2 AI", sub: "Technical + HR" },
  ];
  const COMPANY_MODES_UI = [
    { id: null, name: "Standard", tagline: "Adaptive questions, no company filter" },
    { id: "google", name: "Google", tagline: "First-principles thinking, sealed with Googleyness" },
    { id: "amazon", name: "Amazon", tagline: "16 Leadership Principles. STAR or nothing." },
    { id: "meta", name: "Meta", tagline: "Move fast. Show impact. Prove it with numbers." },
    { id: "microsoft", name: "Microsoft", tagline: "Collaborative problem-solving, growth mindset." },
  ];
  const MORE_COMPANY_MODES = [
    { id: "infosys", name: "Infosys", tagline: "Fundamentals first. Clarity always." },
    { id: "tcs", name: "TCS", tagline: "Honest basics, steady attitude." },
    { id: "wipro", name: "Wipro", tagline: "Practical skills, clear thinking." },
    { id: "hcltech", name: "HCLTech", tagline: "Role-ready fundamentals." },
    { id: "techmahindra", name: "Tech Mahindra", tagline: "Connected thinking, clear delivery." },
    { id: "ltimindtree", name: "LTIMindtree", tagline: "Engineering mindset, done right." },
    { id: "cognizant", name: "Cognizant", tagline: "Friendly, but quietly sharp." },
    { id: "capgemini", name: "Capgemini", tagline: "Structured thinking, European polish." },
    { id: "deloitte", name: "Deloitte", tagline: "Consulting-grade clarity." },
    { id: "accenture", name: "Accenture", tagline: "Deliver at scale, learn always." },
    { id: "ibm", name: "IBM", tagline: "Enterprise-grade reliability." },
    { id: "oracle", name: "Oracle", tagline: "Data is sacred. Precision wins." },
  ];
  const ALL_NAMED_MODES = [...COMPANY_MODES_UI.filter(c => c.id), ...MORE_COMPANY_MODES];
  const moreSelected = MORE_COMPANY_MODES.some(c => c.id === companyMode);

  return (
    <div className="min-h-screen relative bg-[#FAFAF9] dark:bg-[#0A0B0D] text-[#14171B] dark:text-[#EDEEF0] flex items-center justify-center p-4 sm:p-6 py-12 transition-colors duration-300">
      <style>{`
        .film-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .studio-input { background: transparent; }
        .studio-input:focus-within {
          border-color: rgba(154,123,36,0.6) !important;
          box-shadow: 0 0 0 4px rgba(154,123,36,0.08);
        }
        .dark .studio-input:focus-within {
          border-color: rgba(232,169,76,0.55) !important;
          box-shadow: 0 0 0 4px rgba(232,169,76,0.1);
        }
        @keyframes seal-spin { to { transform: rotate(360deg); } }
        .seal-spin { animation: seal-spin 22s linear infinite; }
        .seal-text { fill: #9A7B24; }
        .dark .seal-text { fill: #E8A94C; }
        .dashed-ticket {
          background-image: linear-gradient(to right, #D8D4C9 45%, transparent 45%);
          background-size: 10px 1px; background-repeat: repeat-x; height: 1px;
        }
        .dark .dashed-ticket {
          background-image: linear-gradient(to right, #2A2F38 45%, transparent 45%);
        }
      `}</style>

      <div className="film-grain" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="studio-root relative z-10 w-full max-w-6xl bg-white dark:bg-[#0C0E11] rounded-[28px] shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)] border border-[#E8E6E1] dark:border-[#232830] overflow-hidden grid md:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="relative bg-[#F5F4F1] dark:bg-[#111318] border-b md:border-b-0 md:border-r border-[#E8E6E1] dark:border-[#232830] p-9 sm:p-11 flex flex-col overflow-hidden">
          <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-[#9A7B24]/40 dark:via-[#E8A94C]/30 to-transparent" />
          <span className="pointer-events-none absolute inset-4 border border-[#E8E6E1] dark:border-[#232830] rounded-2xl" />

          <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -right-12 z-20 w-24 h-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#F5F4F1] dark:bg-[#111318] border border-[#9A7B24]/40 dark:border-[#E8A94C]/35" />
            <svg viewBox="0 0 100 100" className="absolute inset-0 seal-spin">
              <defs>
                <path id="seal-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
              </defs>
              <text fontSize="10" letterSpacing="2.6" className="seal-text font-mono-studio">
                <textPath href="#seal-circle">LIVE MOCK SESSION · INTERVIEWIQ ·</textPath>
              </text>
            </svg>
            <span className="w-2 h-2 rotate-45 bg-[#9A7B24] dark:bg-[#E8A94C]" />
          </div>

          <div className="relative flex items-center justify-between mb-10">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#9A7B24] dark:bg-[#E8A94C]" />
              <span className="font-mono-studio text-[11px] tracking-[0.2em] text-[#5B636E] dark:text-[#8B92A0]">SESSION Nº 001</span>
            </div>
            <span className="font-mono-studio text-[10px] tracking-[0.14em] text-[#8A929C] dark:text-[#565D68]">{today}</span>
          </div>

          <div className="relative mb-2">
            <p className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8A929C] dark:text-[#565D68] mb-3">LIVE MANIFEST</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.h2
                key={role || "empty"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className={`font-serif-display tracking-tight text-4xl sm:text-[2.9rem] leading-[1.05] ${role ? "text-[#14171B] dark:text-[#EDEEF0]" : "italic text-[#8A929C] dark:text-[#565D68]"}`}
              >
                {role || "Untitled session"}
              </motion.h2>
            </AnimatePresence>
            <AnimatePresence>
              {experience && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden text-[15px] text-[#5B636E] dark:text-[#9AA1AC] mt-2"
                >
                  {experience} experience
                  {candidateName ? ` · ${candidateName}` : ""}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="relative mt-8 border-t border-[#E8E6E1] dark:border-[#232830]">
            <SpecRow label="MODE" value={mode} live />
            <SpecRow label="FORMAT" value={typeLabel} live />
            <SpecRow label="LANGUAGE" value={langLabel} live />
            <SpecRow label="COMPANY" value={company || "—"} live={!!company} />
            <SpecRow label="RÉSUMÉ" value={resumeLabel} live={analysisDone || !!resumeFile} />
          </div>

          <div className="relative mt-auto pt-10">
            <div className="dashed-ticket w-full mb-6" />
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#565D68]">READINESS</span>
              <span className="font-mono-studio text-[10px] tracking-[0.14em] text-[#8A929C] dark:text-[#565D68]">{fieldsReady}/2 CORE FIELDS</span>
            </div>
            <div className="h-0.75 rounded-full bg-[#E8E6E1] dark:bg-[#232830] overflow-hidden">
              <motion.div
                animate={{ width: `${(fieldsReady / 2) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full rounded-full bg-[#C99E41] dark:bg-[#E8A94C]"
              />
            </div>
            <p className="font-mono-studio text-[9px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] mt-5">
              {fieldsReady === 2 ? "READY TO BEGIN — PRESS START" : "FILL ROLE & EXPERIENCE TO BEGIN"}
            </p>
          </div>
        </div>

        <div className="premium-scroll p-7 sm:p-10 bg-white dark:bg-[#0C0E11] max-h-[88vh] overflow-y-auto">
          <div className="mb-8">
            <p className="font-mono-studio text-[10px] tracking-[0.22em] text-[#9A7B24] dark:text-[#E8A94C] mb-2.5">CONFIGURE</p>
            <h2 className="font-serif-display tracking-tight text-2xl sm:text-3xl text-[#14171B] dark:text-[#EDEEF0]">
              Interview Setup
            </h2>
          </div>

          <div className="space-y-8">
            <FormSection n="01" title="THE POSITION">
              <div className={INPUT_WRAP}>
                <FaUserTie className={`${INPUT_ICON} top-4`} size={14} />
                <input type="text" placeholder="Role — e.g. Frontend Developer" className={`${INPUT_TEXT} pl-11 pr-4 py-3.5`} onChange={e => setRole(e.target.value)} value={role} />
              </div>
              <div className={INPUT_WRAP}>
                <FaBriefcase className={`${INPUT_ICON} top-4`} size={14} />
                <input type="text" placeholder="Experience — e.g. 2 years" className={`${INPUT_TEXT} pl-11 pr-4 py-3.5`} onChange={e => setExperience(e.target.value)} value={experience} />
              </div>
            </FormSection>

            <FormSection n="02" title="THE FORMAT">
              <div className="grid grid-cols-2 gap-2">
                {MODES.map(m => {
                  const isSelected = mode === m.value;
                  return (
                    <motion.button key={m.value} type="button" whileTap={{ scale: 0.98 }} onClick={() => setMode(m.value)}
                      className={`relative flex flex-col items-start gap-1 p-4 rounded-2xl border text-left transition-all duration-200 ${isSelected ? OPT_SELECTED : OPT_IDLE}`}>
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-colors duration-200 ${isSelected ? OPT_ICON_SELECTED : OPT_ICON_IDLE}`}>
                        {m.icon}
                      </span>
                      <span className={`text-sm font-semibold ${isSelected ? OPT_LABEL_SELECTED : OPT_LABEL_IDLE}`}>{m.label}</span>
                      <span className="text-[11px] text-[#8A929C] dark:text-[#565D68] leading-snug">{m.sub}</span>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="absolute top-3 right-3">
                            <BsCheckCircleFill className={CHECK_GOLD} size={14} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>

              <div>
                <p className="text-xs font-medium text-[#5B636E] dark:text-[#8B92A0] mb-2 pl-1">Interviewer setup</p>
                <div className="grid grid-cols-2 gap-2">
                  {INTERVIEW_TYPES.map(t => {
                    const isSelected = interviewType === t.value;
                    return (
                      <motion.button key={t.value} type="button" whileTap={{ scale: 0.98 }} onClick={() => setInterviewType(t.value)}
                        className={`relative flex flex-col items-start gap-1.5 p-3.5 rounded-2xl border text-left transition-all duration-200 ${isSelected ? OPT_SELECTED : OPT_IDLE}`}>
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center mb-0.5 transition-colors duration-200 ${isSelected ? OPT_ICON_SELECTED : OPT_ICON_IDLE}`}>
                          {t.icon}
                        </span>
                        <span className={`text-sm font-semibold ${isSelected ? OPT_LABEL_SELECTED : OPT_LABEL_IDLE}`}>{t.label}</span>
                        <span className="text-[11px] text-[#8A929C] dark:text-[#565D68] leading-snug">{t.sub}</span>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="absolute top-3 right-3">
                              <BsCheckCircleFill className={CHECK_GOLD} size={14} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {interviewType === "panel" && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="mt-2 text-[11px] text-[#8A929C] dark:text-[#565D68] pl-1 leading-relaxed overflow-hidden">
                      Two interviewers alternate — one goes deep on technical depth, the other on communication and fit. Uses more credits than Solo.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <p className="text-xs font-medium text-[#5B636E] dark:text-[#8B92A0] mb-2 pl-1">Interview language</p>
                <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-[#F5F4F1] dark:bg-[#14171C] border border-[#E8E6E1] dark:border-[#232830]">
                  {LANGUAGES.map(l => (
                    <button key={l.value} type="button" onClick={() => setLanguage(l.value)}
                      className={`flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl transition-all duration-200 ${language === l.value ? "bg-[#14171B] dark:bg-[#EDEEF0] text-[#FAFAF9] dark:text-[#0A0B0D] shadow-md" : "text-[#5B636E] dark:text-[#8B92A0] hover:text-[#14171B] dark:hover:text-[#EDEEF0]"}`}>
                      <span className="text-sm font-semibold">{l.label}</span>
                      <span className="text-[10px] opacity-70">{l.sub}</span>
                    </button>
                  ))}
                </div>
                {language !== "english" && (
                  <p className="mt-1.5 text-[11px] text-[#8A929C] dark:text-[#565D68] pl-1">
                    {language === "hindi" ? "पूरा interview Hindi (देवनागरी) में होगा। Interviewer की voice browser वाली होगी।" : "Poora interview Hinglish (Roman) me hoga. Interviewer ki voice browser wali hogi."}
                  </p>
                )}
              </div>
            </FormSection>

            <FormSection n="03" title="THE CONTEXT">
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {COMPANY_MODES_UI.map(c => {
                    const isSelected = companyMode === c.id;
                    return (
                      <motion.button key={c.id || "standard"} type="button" whileTap={{ scale: 0.98 }} onClick={() => selectCompanyMode(c)}
                        className={`relative flex flex-col items-start gap-1 p-4 rounded-2xl border text-left transition-all duration-200 ${isSelected ? OPT_SELECTED : OPT_IDLE}`}>
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-colors duration-200 ${isSelected ? OPT_ICON_SELECTED : OPT_ICON_IDLE}`}>
                          {c.id ? <span className="font-serif-display italic text-lg leading-none">{c.name[0]}</span> : <BsBuilding size={14} />}
                        </span>
                        <span className={`text-sm font-semibold ${isSelected ? OPT_LABEL_SELECTED : OPT_LABEL_IDLE}`}>{c.name}</span>
                        <span className="text-[11px] text-[#8A929C] dark:text-[#565D68] leading-snug">{c.tagline}</span>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="absolute top-3 right-3">
                              <BsCheckCircleFill className={CHECK_GOLD} size={14} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
                <button type="button" onClick={() => setShowMoreCompanies(v => !v)}
                  className={`mt-3 w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-200 ${moreSelected ? OPT_SELECTED : OPT_IDLE}`}>
                  <span className="flex items-center gap-3 min-w-0">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${moreSelected ? OPT_ICON_SELECTED : OPT_ICON_IDLE}`}>
                      <span className="font-mono-studio text-[10px] font-semibold">+12</span>
                    </span>
                    <span className="text-left min-w-0">
                      <span className={`block text-sm font-semibold truncate ${moreSelected ? OPT_LABEL_SELECTED : OPT_LABEL_IDLE}`}>{moreSelected ? ALL_NAMED_MODES.find(c => c.id === companyMode)?.name : "More companies"}</span>
                      <span className="block text-[11px] text-[#8A929C] dark:text-[#565D68] truncate">Infosys, TCS, Deloitte, Capgemini, Wipro + 7 more</span>
                    </span>
                  </span>
                  <motion.span animate={{ rotate: showMoreCompanies ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-[#8A929C] dark:text-[#565D68] shrink-0 ml-2">
                    <BsChevronDown size={14} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {showMoreCompanies && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3">
                        {MORE_COMPANY_MODES.map(c => {
                          const isSelected = companyMode === c.id;
                          return (
                            <button key={c.id} type="button" onClick={() => selectCompanyMode(c)}
                              className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-left transition-all duration-200 ${isSelected ? OPT_SELECTED : OPT_IDLE}`}>
                              <span className="min-w-0">
                                <span className={`block text-[13px] font-semibold truncate ${isSelected ? OPT_LABEL_SELECTED : OPT_LABEL_IDLE}`}>{c.name}</span>
                                <span className="block text-[10px] text-[#8A929C] dark:text-[#565D68] leading-snug truncate">{c.tagline}</span>
                              </span>
                              {isSelected && <BsCheckCircleFill className={`${CHECK_GOLD} shrink-0`} size={13} />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!companyMode && (
                  <div className={`${INPUT_WRAP} mt-3`}>
                    <BsBuilding className={`${INPUT_ICON} top-4`} size={14} />
                    <input type="text" list="company-suggestions" placeholder="Target company (optional, e.g. Google)" className={`${INPUT_TEXT} pl-11 pr-4 py-3.5`} onChange={e => setCompany(e.target.value)} value={company} />
                    <datalist id="company-suggestions">
                      {SUGGESTED_COMPANIES.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                )}
                <p className="mt-1.5 text-[11px] text-[#8A929C] dark:text-[#565D68] pl-1">{companyMode ? `${ALL_NAMED_MODES.find(c => c.id === companyMode)?.name} loop: structured rounds, company-rubric scoring, bar-raiser finale.` : "Questions adapt to that company's known interview style."}</p>
              </div>

              <div>
                <button type="button" onClick={() => setShowJobDescription(v => !v)} className="flex items-center gap-2 font-mono-studio text-[11px] tracking-[0.18em] text-[#9A7B24] dark:text-[#E8A94C] hover:opacity-80 transition">
                  <FaFileAlt size={11} />
                  {showJobDescription ? "HIDE JOB DESCRIPTION" : "PASTE A JOB DESCRIPTION (OPTIONAL)"}
                </button>
                <AnimatePresence>
                  {showJobDescription && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className={`${INPUT_WRAP} mt-3`}>
                        <textarea rows={5} placeholder="Paste the actual job posting here — questions will target its specific responsibilities and required skills, not just the role title." className={`${INPUT_TEXT} px-4 py-3.5 resize-none leading-relaxed`} onChange={e => setJobDescription(e.target.value)} value={jobDescription} maxLength={4000} />
                      </div>
                      <p className="mt-1.5 font-mono-studio text-[10px] text-[#8A929C] dark:text-[#565D68] pl-1">{jobDescription.length}/4000 CHARACTERS</p>
                      {resumeText && jobDescription.trim().length >= 30 && (
                        <motion.button type="button" onClick={handleCheckMatch} disabled={matchLoading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                          className="mt-3 flex items-center justify-center gap-2 w-full border border-[#E8E6E1] dark:border-[#232830] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 text-[#3E4650] dark:text-[#9AA1AC] py-2.5 rounded-full text-sm font-semibold transition disabled:opacity-70">
                          <BsBullseye size={14} />
                          {matchLoading ? "Checking match..." : "Check Match Score"}
                        </motion.button>
                      )}
                      {matchError && (
                        <div className="mt-3 bg-[#C99E41]/8 dark:bg-[#E8A94C]/8 border border-[#9A7B24]/25 dark:border-[#E8A94C]/25 rounded-xl p-3 flex items-start gap-2">
                          <IoWarningOutline size={15} className="text-[#9A7B24] dark:text-[#E8A94C] mt-0.5 shrink-0" />
                          <p className="text-[#8A6A2F] dark:text-[#E8B96A] text-xs leading-relaxed">{matchError}</p>
                        </div>
                      )}
                      <AnimatePresence>
                        {matchResult && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            className="mt-3 bg-[#F5F4F1] dark:bg-[#14171C] border border-[#E8E6E1] dark:border-[#232830] rounded-2xl p-5 space-y-4 relative overflow-hidden">
                            <span className="absolute top-0 left-10 right-10 h-0.5 bg-linear-to-r from-transparent via-[#9A7B24]/40 dark:via-[#E8A94C]/30 to-transparent" />
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shrink-0" style={{
                                background: matchResult.matchScore >= 75 ? "rgba(74, 222, 128, 0.15)" : matchResult.matchScore >= 40 ? "rgba(232, 169, 76, 0.15)" : "rgba(248, 113, 113, 0.15)",
                                color: matchResult.matchScore >= 75 ? "#22c55e" : matchResult.matchScore >= 40 ? "#B27E2E" : "#ef4444"
                              }}>
                                {matchResult.matchScore}%
                              </div>
                              <p className="text-sm text-[#3E4650] dark:text-[#9AA1AC] leading-relaxed">{matchResult.summary}</p>
                            </div>
                            {matchResult.matchedSkills.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-[#5B636E] dark:text-[#8B92A0] mb-1.5">You match on</p>
                                <div className="flex flex-wrap gap-2">
                                  {matchResult.matchedSkills.map((s, i) => (
                                    <span key={i} className="font-mono-studio flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full text-[11px]">
                                      <BsCheckCircleFill size={10} />{s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {matchResult.missingSkills.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-[#5B636E] dark:text-[#8B92A0] mb-1.5">Missing from your resume</p>
                                <div className="flex flex-wrap gap-2">
                                  {matchResult.missingSkills.map((s, i) => (
                                    <span key={i} className="font-mono-studio bg-[#C99E41]/10 dark:bg-[#E8A94C]/10 text-[#9A7B24] dark:text-[#E8A94C] px-2.5 py-1 rounded-full text-[11px]">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!analysisDone && (
                <motion.div whileHover={{ scale: 1.005 }} onClick={() => document.getElementById("resumeUpload").click()}
                  className="relative rounded-2xl border-2 border-dashed border-[#E8E6E1] dark:border-[#232830] p-6 text-center cursor-pointer hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 hover:bg-[#C99E41]/5 dark:hover:bg-[#E8A94C]/5 transition-all duration-200">
                  <FaFileUpload className="text-2xl mx-auto text-[#9A7B24] dark:text-[#E8A94C] mb-3" />
                  <input type="file" id="resumeUpload" accept="application/pdf" className="hidden" onChange={e => { setResumeFile(e.target.files[0]); setResumeError(""); }} />
                  <p className="text-[#5B636E] dark:text-[#8B92A0] font-medium text-sm">{resumeFile ? resumeFile.name : "Upload your resume (optional)"}</p>
                  <p className="font-mono-studio text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] mt-1.5">PDF · AUTO-FILLS ROLE & SKILLS</p>
                  {resumeFile && (
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={e => { e.stopPropagation(); handleUploadResume(); }} disabled={analyzing}
                      className="mt-4 border border-[#E8E6E1] dark:border-[#232830] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 text-[#3E4650] dark:text-[#9AA1AC] px-5 py-2 rounded-full text-sm font-semibold transition disabled:opacity-70">
                      {analyzing ? "Analyzing..." : "Analyze Resume"}
                    </motion.button>
                  )}
                </motion.div>
              )}
              {resumeError && (
                <div className="bg-[#C99E41]/8 dark:bg-[#E8A94C]/8 border border-[#9A7B24]/25 dark:border-[#E8A94C]/25 rounded-xl p-3 flex items-start gap-2">
                  <IoWarningOutline size={15} className="text-[#9A7B24] dark:text-[#E8A94C] mt-0.5 shrink-0" />
                  <p className="text-[#8A6A2F] dark:text-[#E8B96A] text-xs leading-relaxed">{resumeError}</p>
                </div>
              )}
              <AnimatePresence>
                {analysisDone && (
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                    className="relative overflow-hidden rounded-2xl border border-[#E8E6E1] dark:border-[#232830] bg-[#F5F4F1] dark:bg-[#14171C]">
                    <span className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#9A7B24]/60 dark:via-[#E8A94C]/50 to-transparent" />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] flex items-center justify-center shrink-0">
                            <BsCheckLg size={13} className="text-[#14171B] dark:text-[#0A0B0D]" />
                          </span>
                          <div>
                            <h3 className="font-mono-studio text-[11px] tracking-[0.18em] text-[#14171B] dark:text-[#EDEEF0]">RÉSUMÉ PARSED</h3>
                            {resumeFile && <p className="font-mono-studio text-[10px] text-[#8A929C] dark:text-[#565D68] truncate max-w-55 mt-0.5">{resumeFile.name}</p>}
                          </div>
                        </div>
                        <span className="font-mono-studio text-[10px] tracking-[0.14em] text-[#9A7B24] dark:text-[#E8A94C] shrink-0">
                          {projects.length}P · {skills.length}S
                        </span>
                      </div>

                      {projects.length > 0 && (
                        <div className="mt-5">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8A929C] dark:text-[#565D68]">PROJECTS</span>
                            <span className="h-px flex-1 bg-[#E8E6E1] dark:bg-[#232830]" />
                          </div>
                          {projects.map((p, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.07 }}
                              className="flex items-baseline gap-4 py-3 border-b border-[#E8E6E1] dark:border-[#232830] last:border-0">
                              <span className="font-serif-display italic text-sm text-[#9A7B24] dark:text-[#E8A94C] shrink-0 w-7">{String(i + 1).padStart(2, "0")}</span>
                              <p className="text-sm text-[#3E4650] dark:text-[#9AA1AC] leading-relaxed">{p}</p>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {skills.length > 0 && (
                        <div className="mt-5">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8A929C] dark:text-[#565D68]">SKILLS</span>
                            <span className="h-px flex-1 bg-[#E8E6E1] dark:bg-[#232830]" />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((s, i) => (
                              <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.04 }}
                                className="font-mono-studio text-[11px] px-3 py-1.5 rounded-full border border-[#9A7B24]/30 dark:border-[#E8A94C]/30 bg-[#C99E41]/8 dark:bg-[#E8A94C]/8 text-[#9A7B24] dark:text-[#E8A94C] hover:bg-[#C99E41]/15 dark:hover:bg-[#E8A94C]/15 transition-colors duration-150 cursor-default">
                                {s}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </FormSection>
          </div>

          {startError && (
            <div className="mt-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 flex items-start gap-2">
              <IoWarningOutline size={15} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-700 dark:text-red-400 text-xs leading-relaxed">{startError}</p>
            </div>
          )}

          <motion.button onClick={handleStart} disabled={!role || !experience || loading}
            whileHover={{ scale: role && experience ? 1.015 : 1 }} whileTap={{ scale: role && experience ? 0.985 : 1 }}
            className="mt-6 w-full disabled:bg-[#E8E6E1] dark:disabled:bg-[#232830] disabled:text-[#8A929C] dark:disabled:text-[#565D68] disabled:cursor-not-allowed bg-[#C99E41] dark:bg-[#E8A94C] hover:opacity-90 text-[#14171B] dark:text-[#0A0B0D] py-4 rounded-full text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2.5">
            {loading && (
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full" />
            )}
            {loading ? "Starting interview..." : (
              <>
                {interviewType === "panel" ? "Start Panel Interview" : "Start Interview"}
                {!loading && <BsArrowRight size={16} />}
              </>
            )}
          </motion.button>
          <p className="font-mono-studio text-[10px] tracking-[0.16em] text-[#8A929C] dark:text-[#565D68] text-center mt-4">
            {mode.toUpperCase()} · {typeLabel.toUpperCase()} · {langLabel.toUpperCase()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
export default Step1Setup;
