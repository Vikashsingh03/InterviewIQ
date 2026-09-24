import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ServerUrl } from "../App";
import { useTheme } from "../context/ThemeContext";
import { FaArrowLeft } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
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
    "bg-[#9A7B24]/10 dark:bg-[#E8A94C]/10 text-[#9A7B24] dark:text-[#E8A94C] border-[#9A7B24]/20 dark:border-[#E8A94C]/20",
  hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

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

function ScoreRing({ value, displayValue, color }) {
  const size = 132;
  const stroke = 10;
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
          className="stroke-[#E8E6E1] dark:stroke-[#232830]"
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
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-serif-display text-5xl leading-none tracking-tight"
          style={{ color }}
        >
          {displayValue}
        </span>
        <span className="font-mono-studio text-[9px] tracking-[0.16em] text-[#8A929C] dark:text-[#8B92A0] mt-1.5">
          OUT OF 10
        </span>
      </div>
    </div>
  );
}

function SectionHead({ num, title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono-studio text-xs font-bold tracking-[0.2em] text-[#9A7B24] dark:text-[#E8A94C]">
        {num}
      </span>
      <span className="w-10 h-0.5 bg-[#C99E41] dark:bg-[#E8A94C] shrink-0" />
      <h2 className="font-mono-studio text-[11px] tracking-[0.26em] text-[#3E4650] dark:text-[#9AA1AC]">
        {title}
      </h2>
    </div>
  );
}

const PracticeQuestion = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const editorTheme = theme === "dark" ? "vs-dark" : "vs";

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
  const animatedScore = useCountUp(result?.score || 0, 1100, !!result);

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

  const verdictColor = result ? scoreColor(result.score) : "#E8A94C";
  const verdict = result ? scoreVerdict(result.score) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] dark:bg-[#0A0B0D]">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rotate-45 bg-[#C99E41] dark:bg-[#E8A94C] shrink-0" />
          <p className="font-mono-studio text-xs tracking-[0.22em] text-[#8A929C] dark:text-[#8B92A0]">
            LOADING QUESTION
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAF9] dark:bg-[#0A0B0D] transition-colors duration-300 overflow-hidden">
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
      `}</style>

      <div className="film-grain" />

      <div className="practiceq-root relative z-10 w-[92vw] lg:w-[70vw] max-w-250 mx-auto py-10">
        <div className="flex items-center gap-3 mb-8">
          <motion.button
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/practice")}
            aria-label="Back to practice hub"
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] transition-all duration-200 cursor-pointer"
          >
            <FaArrowLeft className="text-[#5B636E] dark:text-[#9AA1AC]" size={14} />
          </motion.button>
          <div className="flex items-center gap-2 bg-[#9A7B24]/8 dark:bg-[#E8A94C]/8 border border-[#9A7B24]/20 dark:border-[#E8A94C]/20 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#C99E41] dark:bg-[#E8A94C] shrink-0" />
            <span className="font-mono-studio text-[11px] tracking-[0.08em] text-[#9A7B24] dark:text-[#E8A94C]">
              PRACTICE MODE · {isCoding ? "CODING" : "HR"}
            </span>
          </div>
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
          className="relative bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-3xl p-6 sm:p-10 overflow-hidden shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]"
        >
          <span className="absolute top-0 left-0 right-0 h-1 bg-[#C99E41] dark:bg-[#E8A94C]" />

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span
              className={`font-mono-studio text-[10px] tracking-[0.16em] border px-2.5 py-1 rounded-md ${
                isCoding
                  ? "text-[#2E8494] dark:text-[#5EC8D8] border-[#2E8494]/30 dark:border-[#5EC8D8]/30"
                  : "text-[#6A5FBF] dark:text-[#B3A9F5] border-[#6A5FBF]/30 dark:border-[#8B7FD6]/30"
              }`}
            >
              {isCoding ? "CODING" : "HR / BEHAVIORAL"}
            </span>
            {question?.difficulty && (
              <span
                className={`font-mono-studio px-2.5 py-1 rounded-md border text-[10px] tracking-[0.16em] uppercase ${
                  DIFFICULTY_STYLES[question.difficulty] ||
                  "bg-[#F5F4F1] dark:bg-[#14171C] text-[#5B636E] dark:text-[#8B92A0] border-transparent"
                }`}
              >
                {question.difficulty}
              </span>
            )}
            <span className="font-mono-studio text-[10px] tracking-[0.14em] text-[#8A929C] dark:text-[#565D68] uppercase">
              {question?.category || question?.topic}
            </span>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-5xl text-[#14171B] dark:text-[#EDEEF0] leading-[1.1] tracking-tight mb-10">
            {isCoding ? question?.title : question?.question}
          </h1>

          <SectionHead num="01" title="THE BRIEF" />

          {isCoding && question?.description && (
            <p className="text-[15px] text-[#3E4650] dark:text-[#9AA1AC] whitespace-pre-line leading-relaxed mb-8">
              {question.description}
            </p>
          )}

          {isCoding && question?.sampleTestCases?.length > 0 && (
            <div className="mb-10">
              <SectionHead num="02" title="EXAMPLES" />
              <div className="grid sm:grid-cols-2 gap-3">
                {question.sampleTestCases.map((tc, i) => (
                  <div
                    key={i}
                    className="bg-[#F5F4F1] dark:bg-[#14171C] border border-[#E8E6E1] dark:border-[#232830] rounded-xl p-4 font-mono-studio text-xs"
                  >
                    <p className="text-[#8A929C] dark:text-[#565D68] mb-1.5 tracking-[0.18em] text-[10px]">
                      EXAMPLE {i + 1}
                    </p>
                    <p className="text-[#3E4650] dark:text-[#EDEEF0]">
                      Input:{" "}
                      <span className="whitespace-pre-wrap">{tc.input}</span>
                    </p>
                    <p className="text-[#3E4650] dark:text-[#EDEEF0]">
                      Output: {tc.expectedOutput}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!result ? (
            <>
              <SectionHead num={isCoding && question?.sampleTestCases?.length > 0 ? "03" : "02"} title="YOUR SOLUTION" />

              {isCoding ? (
                <div className="flex flex-col rounded-2xl border border-[#E8E6E1] dark:border-[#232830] overflow-hidden bg-white dark:bg-[#0C0E11]">
                  <div className="flex items-center justify-between bg-[#F5F4F1] dark:bg-[#0C0E11] px-4 py-3 border-b border-[#E8E6E1] dark:border-[#232830]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#C99E41]/70 dark:bg-[#E8A94C]/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]/70" />
                      </span>
                      <span className="font-mono-studio text-[11px] tracking-[0.14em] text-[#8A929C] dark:text-[#8B92A0]">
                        CODE EDITOR
                      </span>
                    </div>
                    <div className="relative">
                      <select
                        value={codeLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        disabled={isSubmitting}
                        className="font-mono-studio bg-white dark:bg-[#1B1E24] text-[#14171B] dark:text-[#D8DCE3] text-xs rounded-lg pl-3 pr-7 py-1.5 outline-none disabled:opacity-60 border border-[#E8E6E1] dark:border-[#232830] appearance-none cursor-pointer hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/40 transition-colors"
                      >
                        {CODE_LANGUAGES.map((l) => (
                          <option key={l.value} value={l.value}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                      <BsChevronDown
                        size={9}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A929C] dark:text-[#565D68] pointer-events-none"
                      />
                    </div>
                  </div>

                  <div style={{ height: "340px" }}>
                    <Editor
                      height="340px"
                      language={codeLanguage === "cpp" ? "cpp" : codeLanguage}
                      value={answer}
                      onChange={(value) => setAnswer(value ?? "")}
                      theme={editorTheme}
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
                    <div className="bg-[#F5F4F1] dark:bg-[#0C0E11] border-t border-[#E8E6E1] dark:border-[#232830]">
                      {isRunning ? (
                        <p className="font-mono-studio text-xs tracking-[0.14em] text-[#5B636E] dark:text-[#8B92A0] p-4 flex items-center gap-2.5">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                            className="w-3 h-3 border-2 border-[#8A929C]/30 dark:border-[#8B92A0]/30 border-t-[#9A7B24] dark:border-t-[#E8A94C] rounded-full inline-block"
                          />
                          RUNNING YOUR CODE
                        </p>
                      ) : (
                        <>
                          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E8E6E1] dark:border-[#232830]">
                            <span className="font-mono-studio text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#8B92A0]">
                              SAMPLE TESTS
                            </span>
                            <span
                              className={`font-mono-studio text-[11px] font-bold tracking-widest ${
                                passedCount === runResults.length
                                  ? "text-[#2E9C5A] dark:text-[#4ADE80]"
                                  : "text-[#9A7B24] dark:text-[#E8A94C]"
                              }`}
                            >
                              {passedCount}/{runResults.length} PASSED
                            </span>
                          </div>
                          <div className="space-y-2 p-4 max-h-40 overflow-y-auto">
                            {runResults.map((r, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 text-xs"
                              >
                                <span
                                  className={`font-mono-studio text-[10px] font-bold tracking-[0.14em] mt-0.5 shrink-0 ${
                                    r.passed
                                      ? "text-[#2E9C5A] dark:text-[#4ADE80]"
                                      : "text-[#B3261E] dark:text-[#F87171]"
                                  }`}
                                >
                                  {r.passed ? "PASS" : "FAIL"}
                                </span>
                                <div className="font-mono-studio text-[#3E4650] dark:text-[#C7CBD1]">
                                  <span>Test {i + 1}</span>
                                  {!r.passed && (
                                    <div className="text-[#8A929C] dark:text-[#565D68] mt-0.5">
                                      {r.error ? (
                                        <span className="text-[#B3261E] dark:text-[#F0918D]">
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
                <div className="relative">
                  <textarea
                    placeholder="Type your answer here — be specific, use a real example."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={isSubmitting}
                    rows={9}
                    className="w-full bg-white dark:bg-[#111318] rounded-2xl p-5 pb-10 border border-[#E8E6E1] dark:border-[#232830] text-[#14171B] dark:text-[#EDEEF0] placeholder:text-[#8A929C] dark:placeholder:text-[#565D68] text-base leading-relaxed resize-none outline-none focus:border-[#9A7B24] dark:focus:border-[#E8A94C] transition-all duration-200 disabled:opacity-60"
                  />
                  <span className="font-mono-studio absolute bottom-4 right-5 text-[10px] tracking-[0.14em] text-[#8A929C] dark:text-[#565D68] pointer-events-none">
                    {answer.trim() ? answer.trim().split(/\s+/).length : 0} WORDS
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mt-6">
                {isCoding && (
                  <motion.button
                    onClick={runCode}
                    disabled={isSubmitting || isRunning}
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ y: -1 }}
                    className="shrink-0 px-6 py-4 rounded-full border-2 border-[#2E8494]/50 dark:border-[#5EC8D8]/50 text-[#2E8494] dark:text-[#5EC8D8] font-mono-studio text-xs font-bold tracking-[0.16em] hover:bg-[#2E8494]/8 dark:hover:bg-[#5EC8D8]/8  transition-all duration-200 disabled:opacity-60 cursor-pointer"
                  >
                    {isRunning ? "RUNNING" : "RUN"}
                  </motion.button>
                )}
                <motion.button
                  onClick={submitAnswer}
                  disabled={isSubmitting || !answer.trim()}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1 }}
                  className="flex-1 bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-mono-studio text-xs font-bold tracking-[0.16em] py-4 rounded-full hover:opacity-90 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2.5 cursor-pointer"
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
                      EVALUATING
                    </>
                  ) : (
                    "SUBMIT FOR FEEDBACK"
                  )}
                </motion.button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mt-10"
            >
              <div
                className="relative rounded-3xl border p-6 sm:p-9 mb-6 overflow-hidden"
                style={{
                  borderColor: `${verdictColor}55`,
                  backgroundColor: `${verdictColor}0D`,
                }}
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <span
                    className="w-1.5 h-1.5 rotate-45 shrink-0"
                    style={{ backgroundColor: verdictColor }}
                  />
                  <p
                    className="font-mono-studio text-[11px] tracking-[0.26em]"
                    style={{ color: verdictColor }}
                  >
                    VERDICT
                  </p>
                </div>

                <div className="flex items-center gap-8 sm:gap-12 flex-wrap">
                  <ScoreRing
                    value={result.score}
                    displayValue={animatedScore}
                    color={verdictColor}
                  />
                  <div className="flex-1 min-w-55">
                    <h2
                      className="font-serif-display text-4xl sm:text-6xl tracking-tight leading-none mb-3"
                      style={{ color: verdictColor }}
                    >
                      {verdict.label}
                    </h2>
                    <p className="text-sm text-[#3E4650] dark:text-[#9AA1AC] leading-relaxed max-w-md">
                      {verdict.note}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Confidence", value: result.confidence },
                  { label: "Communication", value: result.communication },
                  { label: "Correctness", value: result.correctness },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
                    className="bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-2xl p-5"
                  >
                    <p className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#8B92A0] mb-3">
                      {s.label.toUpperCase()}
                    </p>
                    <p className="font-serif-display text-5xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight leading-none mb-4">
                      {s.value}
                      <span className="font-mono-studio text-xs text-[#8A929C] dark:text-[#8B92A0] ml-1">
                        /10
                      </span>
                    </p>
                    <div className="bg-[#F5F4F1] dark:bg-[#14171C] h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.value || 0) * 10}%` }}
                        transition={{ duration: 0.9, ease: "easeOut", delay: 0.25 + i * 0.08 }}
                        className="h-full rounded-full bg-[#C99E41] dark:bg-[#E8A94C]"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="relative bg-white dark:bg-[#0C0E11] border border-[#9A7B24]/25 dark:border-[#E8A94C]/25 rounded-3xl p-6 sm:p-8 mb-7 overflow-hidden">
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#C99E41] dark:bg-[#E8A94C]" />
                <span className="font-serif-display text-6xl leading-[0.5] text-[#C99E41]/50 dark:text-[#E8A94C]/50 select-none">
                  &ldquo;
                </span>
                <p className="font-serif-display text-lg sm:text-xl text-[#14171B] dark:text-[#EDEEF0] leading-relaxed mt-3">
                  {result.feedback}
                </p>
                <div className="flex items-center gap-2 mt-5">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#C99E41] dark:bg-[#E8A94C] shrink-0" />
                  <p className="font-mono-studio text-[10px] text-[#9A7B24] dark:text-[#E8A94C] tracking-[0.22em]">
                    AI FEEDBACK
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <motion.button
                  onClick={practiceAnother}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1 }}
                  className="flex-1 min-w-45 bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-mono-studio text-xs font-bold tracking-[0.16em] py-4 rounded-full hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  PRACTICE ANOTHER →
                </motion.button>
                <button
                  onClick={() => navigate("/practice")}
                  className="px-6 py-4 rounded-full border border-[#E8E6E1] dark:border-[#232830] text-[#3E4650] dark:text-[#9AA1AC] font-medium hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 transition-colors cursor-pointer"
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
