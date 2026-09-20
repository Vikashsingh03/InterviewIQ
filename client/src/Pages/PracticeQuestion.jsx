import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ServerUrl } from "../App";
import { FaArrowLeft } from "react-icons/fa";
import {
  BsCode,
  BsChatDots,
  BsPlayFill,
  BsCheckCircleFill,
  BsXCircleFill,
  BsChevronDown,
  BsArrowRepeat,
} from "react-icons/bs";
import { IoWarningOutline, IoSparklesSharp } from "react-icons/io5";
import Editor from "@monaco-editor/react";

const CODE_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

const DIFFICULTY_STYLES = {
  easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  medium:
    "bg-[#E8A94C]/10 text-[#B27E2E] dark:text-[#E8A94C] border-[#E8A94C]/20",
  hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

// score ring drawn as raw SVG so it reads correctly in light AND dark
function ScoreRing({ value, color }) {
  const size = 104;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.max(0, Math.min(1, value / 10));

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-[#EFEEEA] dark:stroke-[#1E2229]"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - fraction) }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 7px ${color}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-serif-display text-3xl leading-none tracking-tight"
          style={{ color }}
        >
          {value}
        </span>
        <span className="font-mono-studio text-[9px] tracking-[0.12em] text-[#8B92A0] mt-1">
          OUT OF 10
        </span>
      </div>
    </div>
  );
}

const PracticeQuestion = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [answer, setAnswer] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");

  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const [siblingIds, setSiblingIds] = useState([]);

  const isCoding = type === "coding";
  const accent = isCoding ? "#5EC8D8" : "#8B7FD6";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      setResult(null);
      setRunResults(null);
      setAnswer("");

      try {
        const [detailRes, listRes] = await Promise.all([
          axios.get(ServerUrl + `/api/practice/questions/${type}/${id}`, {
            withCredentials: true,
          }),
          axios.get(ServerUrl + "/api/practice/questions", {
            withCredentials: true,
          }),
        ]);

        const detail = detailRes.data;
        setQuestion(detail);

        if (detail.type === "coding" && detail.starterCode) {
          setCodeLanguage("javascript");
          setAnswer(detail.starterCode.javascript || "");
        }

        const pool = type === "coding" ? listRes.data.coding : listRes.data.hr;
        setSiblingIds(pool.map((q) => q.id).filter((qId) => qId !== id));
      } catch (err) {
        console.log(err);
        setError(
          err?.response?.data?.message ||
            "Couldn't load this question. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [type, id]);

  const handleLanguageChange = (newLang) => {
    if (!question?.starterCode) return;
    const currentStarters = Object.values(question.starterCode);
    const isStillStarter = currentStarters.includes(answer);
    setCodeLanguage(newLang);
    if (isStillStarter) {
      setAnswer(question.starterCode[newLang] || "");
    }
    setRunResults(null);
  };

  const runCode = async () => {
    if (isRunning || isSubmitting) return;
    setIsRunning(true);
    setError("");
    setRunResults(null);
    try {
      const res = await axios.post(
        ServerUrl + "/api/practice/run-code",
        { questionId: id, code: answer, language: codeLanguage },
        { withCredentials: true },
      );
      setRunResults(res.data.results || []);
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message || "Couldn't run your code right now.",
      );
    } finally {
      setIsRunning(false);
    }
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;
    if (isCoding && !answer.trim()) return;
    if (!isCoding && !answer.trim()) return;

    setIsSubmitting(true);
    setError("");
    try {
      const res = await axios.post(
        ServerUrl + "/api/practice/submit",
        {
          type,
          questionId: id,
          answer,
          ...(isCoding ? { language: codeLanguage } : {}),
        },
        { withCredentials: true },
      );
      setResult(res.data);
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message ||
          "Couldn't submit your answer right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const practiceAnother = () => {
    if (!siblingIds.length) {
      navigate("/practice");
      return;
    }
    const nextId = siblingIds[Math.floor(Math.random() * siblingIds.length)];
    navigate(`/practice/${type}/${nextId}`);
  };

  const scoreColor = (score) => {
    if (score >= 8) return "#4ADE80";
    if (score >= 5) return "#E8A94C";
    return "#F87171";
  };

  const scoreVerdict = (score) => {
    if (score >= 8) return { label: "STRONG", note: "Sharp, specific answer — keep this standard." };
    if (score >= 5) return { label: "GOOD START", note: "Solid base. Tighten the details to push higher." };
    return { label: "NEEDS WORK", note: "Add concrete specifics and structure, then try again." };
  };

  const passedCount = runResults
    ? runResults.filter((r) => r.passed).length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3] dark:bg-[#0A0B0D]">
        <p className="text-[#8B92A0] font-['Manrope',sans-serif]">
          Loading question...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F7F6F3] dark:bg-[#0A0B0D] transition-colors duration-300 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .practiceq-root, .practiceq-root * { font-family: 'Manrope', sans-serif; }
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }

        .film-grain {
          position: fixed; inset: 0; pointer-events: none; opacity: 0.025;
          mix-blend-mode: overlay; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/rect%3E%3C/svg%3E");
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(232,169,76,0.5); }
          50% { opacity: 0.5; box-shadow: 0 0 0 4px rgba(232,169,76,0); }
        }
        .live-dot { animation: livePulse 1.8s ease-in-out infinite; }
      `}</style>

      <div className="film-grain" />

      {/* ambient glow, tinted to the question type */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-112 z-0"
        style={{
          background: `radial-gradient(circle at 14% 0%, ${accent}1A, transparent 42%), radial-gradient(circle at 88% 0%, rgba(232,169,76,0.10), transparent 40%)`,
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      />

      <div className="practiceq-root relative z-10 w-[92vw] lg:w-[70vw] max-w-250 mx-auto py-10">
        <div className="flex items-center gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/practice")}
            aria-label="Back to practice hub"
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#131519]/90 backdrop-blur-md border border-[#EAE9E5] dark:border-[#232830] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <FaArrowLeft className="text-[#5C6472] dark:text-[#9AA1AC]" size={14} />
          </motion.button>
          <span className="font-mono-studio inline-flex items-center gap-1.5 text-[11px] tracking-[0.08em] text-[#B27E2E] dark:text-[#E8A94C] bg-[#E8A94C]/8 border border-[#E8A94C]/20 px-3 py-1.5 rounded-full">
            <IoSparklesSharp size={11} />
            PRACTICE MODE
          </span>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 flex items-start gap-2">
            <IoWarningOutline
              size={16}
              className="text-red-600 dark:text-red-400 mt-0.5 shrink-0"
            />
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-3xl shadow-[0_28px_70px_-34px_rgba(0,0,0,0.35)] dark:shadow-[0_28px_70px_-34px_rgba(0,0,0,0.8)] p-6 sm:p-8 overflow-hidden"
        >
          {/* top accent hairline — coding vs HR at a glance */}
          <span
            className="absolute top-0 left-0 right-0 h-0.75"
            style={{
              background: `linear-gradient(90deg, ${accent}, ${accent}00 70%)`,
            }}
          />

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span
              className={`font-mono-studio inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] tracking-wide ${
                isCoding
                  ? "bg-[#5EC8D8]/10 text-[#2E8494] dark:text-[#5EC8D8] border-[#5EC8D8]/20"
                  : "bg-[#8B7FD6]/10 text-[#6A5FBF] dark:text-[#B3A9F5] border-[#8B7FD6]/20"
              }`}
            >
              {isCoding ? <BsCode size={10} /> : <BsChatDots size={10} />}
              {isCoding ? "Coding" : "HR / Behavioral"}
            </span>
            {question?.difficulty && (
              <span
                className={`font-mono-studio px-2 py-0.5 rounded-md border text-[10px] tracking-wide capitalize ${
                  DIFFICULTY_STYLES[question.difficulty] ||
                  "bg-[#EFEEEA] dark:bg-[#181B20] text-[#6B7280] border-transparent"
                }`}
              >
                {question.difficulty}
              </span>
            )}
            <span className="font-mono-studio text-[10px] text-[#9AA1AC] capitalize">
              {question?.category || question?.topic}
            </span>
          </div>

          <h1 className="font-serif-display text-2xl sm:text-3xl text-[#1C1F24] dark:text-[#EDEEF0] leading-snug tracking-tight">
            {isCoding ? question?.title : question?.question}
          </h1>

          {isCoding && question?.description && (
            <p className="text-sm text-[#5C6472] dark:text-[#9AA1AC] whitespace-pre-line leading-relaxed mt-4">
              {question.description}
            </p>
          )}

          {isCoding && question?.sampleTestCases?.length > 0 && (
            <div className="space-y-2 mt-5">
              {question.sampleTestCases.map((tc, i) => (
                <div
                  key={i}
                  className="bg-[#F5F5F3] dark:bg-[#0B0D10] border border-[#E5E4E0] dark:border-[#1E2229] rounded-xl p-3.5 font-mono-studio text-xs"
                >
                  <p className="text-[#9AA1AC] mb-1.5 tracking-wide">
                    EXAMPLE {i + 1}
                  </p>
                  <p className="text-[#3D4148] dark:text-[#C7CBD1]">
                    Input:{" "}
                    <span className="whitespace-pre-wrap">{tc.input}</span>
                  </p>
                  <p className="text-[#3D4148] dark:text-[#C7CBD1]">
                    Output: {tc.expectedOutput}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ---- answer area ---- */}
          {!result ? (
            <>
              {isCoding ? (
                <div className="flex flex-col rounded-2xl border border-[#22262E] overflow-hidden mt-6 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between bg-[#0C0E11] px-4 py-3 border-b border-[#1E2229]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E8A94C]/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]/70" />
                      </span>
                      <span className="font-mono-studio text-[11px] text-[#8B92A0] tracking-wide">
                        Code Editor
                      </span>
                    </div>
                    <div className="relative">
                      <select
                        value={codeLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        disabled={isSubmitting}
                        className="font-mono-studio bg-[#1B1E24] text-[#D8DCE3] text-xs rounded-lg pl-3 pr-7 py-1.5 outline-none disabled:opacity-60 border border-[#262B34] appearance-none cursor-pointer hover:border-[#E8A94C]/40 transition-colors"
                      >
                        {CODE_LANGUAGES.map((l) => (
                          <option key={l.value} value={l.value}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                      <BsChevronDown
                        size={9}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#565D68] pointer-events-none"
                      />
                    </div>
                  </div>

                  <div style={{ height: "340px" }}>
                    <Editor
                      height="340px"
                      language={codeLanguage === "cpp" ? "cpp" : codeLanguage}
                      value={answer}
                      onChange={(value) => setAnswer(value ?? "")}
                      theme="vs-dark"
                      options={{
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', monospace",
                        minimap: { enabled: false },
                        readOnly: isSubmitting,
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        automaticLayout: true,
                      }}
                    />
                  </div>

                  {(isRunning || runResults) && (
                    <div className="bg-[#0C0E11] border-t border-[#1E2229]">
                      {isRunning ? (
                        <p className="font-mono-studio text-xs text-[#8B92A0] p-4 flex items-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                            className="w-3 h-3 border-2 border-[#8B92A0]/30 border-t-[#8B92A0] rounded-full inline-block"
                          />
                          Running your code...
                        </p>
                      ) : (
                        <>
                          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E2229]">
                            <span className="font-mono-studio text-[10px] tracking-wide text-[#8B92A0] uppercase">
                              Sample tests
                            </span>
                            <span
                              className={`font-mono-studio text-[11px] font-semibold ${
                                passedCount === runResults.length
                                  ? "text-[#4ADE80]"
                                  : "text-[#E8A94C]"
                              }`}
                            >
                              {passedCount}/{runResults.length} passed
                            </span>
                          </div>
                          <div className="space-y-2 p-4 max-h-40 overflow-y-auto">
                            {runResults.map((r, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-xs"
                              >
                                {r.passed ? (
                                  <BsCheckCircleFill
                                    className="text-[#4ADE80] mt-0.5 shrink-0"
                                    size={12}
                                  />
                                ) : (
                                  <BsXCircleFill
                                    className="text-[#F87171] mt-0.5 shrink-0"
                                    size={12}
                                  />
                                )}
                                <div className="font-mono-studio text-[#C7CBD1]">
                                  <span>
                                    Test {i + 1}: {r.passed ? "Passed" : "Failed"}
                                  </span>
                                  {!r.passed && (
                                    <div className="text-[#6B7280] mt-0.5">
                                      {r.error ? (
                                        <span className="text-[#F0918D]">
                                          {r.error}
                                        </span>
                                      ) : (
                                        <>
                                          Expected: {r.expectedOutput} | Got:{" "}
                                          {r.actualOutput}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative mt-6">
                  <textarea
                    placeholder="Type your answer here — be specific, use a real example."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={isSubmitting}
                    rows={9}
                    className="w-full bg-[#F5F5F3] dark:bg-[#0C0E11] rounded-2xl p-5 pb-10 border border-[#E5E4E0] dark:border-[#1E2229] text-[#1C1F24] dark:text-[#EDEEF0] placeholder-[#9AA1AC] text-base leading-relaxed resize-none outline-none focus:border-[#E8A94C]/50 focus:ring-4 focus:ring-[#E8A94C]/10 transition-all duration-200 disabled:opacity-60"
                  />
                  <span className="font-mono-studio absolute bottom-4 right-5 text-[10px] text-[#9AA1AC] tracking-wide pointer-events-none">
                    {answer.trim() ? answer.trim().split(/\s+/).length : 0} WORDS
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mt-5">
                {isCoding && (
                  <motion.button
                    onClick={runCode}
                    disabled={isSubmitting || isRunning}
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ y: -1 }}
                    className="shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3.5 rounded-2xl border border-[#5EC8D8]/40 text-[#2E8494] dark:text-[#5EC8D8] font-medium hover:bg-[#5EC8D8]/8 transition-all duration-200 disabled:opacity-60 cursor-pointer"
                  >
                    <BsPlayFill size={16} />
                    {isRunning ? "Running..." : "Run"}
                  </motion.button>
                )}
                <motion.button
                  onClick={submitAnswer}
                  disabled={isSubmitting || !answer.trim()}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1 }}
                  className="flex-1 bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] font-semibold py-3.5 rounded-2xl shadow-[0_14px_36px_-12px_rgba(0,0,0,0.45)] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
                      />
                      Evaluating...
                    </>
                  ) : (
                    "Submit for feedback"
                  )}
                </motion.button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-7"
            >
              {/* score hero */}
              <div className="flex items-center gap-6 flex-wrap mb-6">
                <ScoreRing value={result.score} color={scoreColor(result.score)} />

                <div className="flex-1 min-w-50">
                  <span
                    className="font-mono-studio inline-block text-[10px] tracking-[0.12em] px-3 py-1 rounded-full mb-2.5"
                    style={{
                      backgroundColor: `${scoreColor(result.score)}1F`,
                      color: scoreColor(result.score),
                    }}
                  >
                    {scoreVerdict(result.score).label}
                  </span>
                  <p className="text-sm text-[#5C6472] dark:text-[#9AA1AC] leading-relaxed mb-4">
                    {scoreVerdict(result.score).note}
                  </p>

                  <div className="space-y-2.5">
                    {[
                      { label: "Confidence", value: result.confidence },
                      { label: "Communication", value: result.communication },
                      { label: "Correctness", value: result.correctness },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-[11px] text-[#5C6472] dark:text-[#9AA1AC]">
                            {s.label}
                          </span>
                          <span className="font-mono-studio text-[11px] font-semibold text-[#B27E2E] dark:text-[#E8A94C]">
                            {s.value}
                            <span className="text-[9px] text-[#9AA1AC] font-normal">
                              /10
                            </span>
                          </span>
                        </div>
                        <div className="bg-[#EFEEEA] dark:bg-[#1B1E24] h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(s.value || 0) * 10}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full bg-linear-to-r from-[#F4C97A] to-[#E8A94C]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative bg-[#FAFAF8] dark:bg-[#0C0E11] border border-[#E8A94C]/25 p-5 pl-6 rounded-2xl mb-6 overflow-hidden">
                <span className="absolute left-0 top-4 bottom-4 w-0.75 rounded-r-full bg-[#E8A94C]" />
                <p className="font-mono-studio text-[10px] text-[#B27E2E] dark:text-[#E8A94C] tracking-widest uppercase mb-2">
                  AI feedback
                </p>
                <p className="text-sm text-[#3D4148] dark:text-[#C7CBD1] leading-relaxed">
                  {result.feedback}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <motion.button
                  onClick={practiceAnother}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1 }}
                  className="flex-1 min-w-45 bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] font-semibold py-3.5 rounded-2xl shadow-[0_14px_36px_-12px_rgba(0,0,0,0.45)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BsArrowRepeat size={15} />
                  Practice Another
                </motion.button>
                <button
                  onClick={() => navigate("/practice")}
                  className="px-5 py-3.5 rounded-2xl border border-[#EAE9E5] dark:border-[#262B34] text-[#5C6472] dark:text-[#9AA1AC] font-medium hover:bg-[#F5F5F3] dark:hover:bg-[#1B1E24] transition-colors cursor-pointer"
                >
                  Back to Hub
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PracticeQuestion;