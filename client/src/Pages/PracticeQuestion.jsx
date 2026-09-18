import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ServerUrl } from "../App";
import {
  FaArrowLeft,
} from "react-icons/fa";
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
    if (score >= 8) return "text-[#4ADE80]";
    if (score >= 5) return "text-[#E8A94C]";
    return "text-[#F87171]";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3] dark:bg-[#0A0B0D]">
        <p className="text-[#8B92A0] font-['Manrope',sans-serif]">Loading question...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F7F6F3] dark:bg-[#0A0B0D] transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .practiceq-root, .practiceq-root * { font-family: 'Manrope', sans-serif; }
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div className="practiceq-root relative z-10 w-[92vw] lg:w-[70vw] max-w-250 mx-auto py-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/practice")}
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-[#131519] border border-[#EAE9E5] dark:border-[#232830] shadow-sm hover:shadow-md transition-all duration-200"
          >
            <FaArrowLeft className="text-[#5C6472] dark:text-[#9AA1AC]" size={14} />
          </button>
          <span className="font-mono-studio inline-flex items-center gap-1.5 text-[11px] tracking-wide text-[#B27E2E] dark:text-[#E8A94C] bg-[#E8A94C]/10 border border-[#E8A94C]/25 px-3 py-1 rounded-full">
            <IoSparklesSharp size={11} />
            PRACTICE MODE
          </span>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 flex items-start gap-2">
            <IoWarningOutline size={16} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-3xl shadow-[0_20px_50px_-28px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_-28px_rgba(0,0,0,0.7)] p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`font-mono-studio inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] tracking-wide ${
                isCoding
                  ? "bg-[#5EC8D8]/10 text-[#2E8494] dark:text-[#5EC8D8]"
                  : "bg-[#E8A94C]/10 text-[#B27E2E] dark:text-[#E8A94C]"
              }`}
            >
              {isCoding ? <BsCode size={10} /> : <BsChatDots size={10} />}
              {isCoding ? "Coding" : "HR / Behavioral"}
            </span>
            <span className="font-mono-studio px-2 py-0.5 rounded-md bg-[#F0F0EE] dark:bg-[#1B1E24] text-[#6B7280] dark:text-[#8B92A0] text-[10px] tracking-wide capitalize">
              {question?.difficulty}
            </span>
            <span className="font-mono-studio text-[10px] text-[#9AA1AC] capitalize">
              {question?.category || question?.topic}
            </span>
          </div>

          <h1 className="font-serif-display text-xl sm:text-2xl text-[#1C1F24] dark:text-[#EDEEF0] leading-snug mb-2">
            {isCoding ? question?.title : question?.question}
          </h1>

          {isCoding && question?.description && (
            <p className="text-sm text-[#5C6472] dark:text-[#9AA1AC] whitespace-pre-line leading-relaxed mt-4">
              {question.description}
            </p>
          )}

          {isCoding && question?.sampleTestCases?.length > 0 && (
            <div className="space-y-2 mt-4">
              {question.sampleTestCases.map((tc, i) => (
                <div
                  key={i}
                  className="bg-[#F5F5F3] dark:bg-[#0B0D10] border border-[#E5E4E0] dark:border-[#1E2229] rounded-lg p-3 font-mono-studio text-xs"
                >
                  <p className="text-[#9AA1AC] mb-1">Example {i + 1}</p>
                  <p className="text-[#3D4148] dark:text-[#C7CBD1]">
                    Input: <span className="whitespace-pre-wrap">{tc.input}</span>
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
                <div className="flex flex-col rounded-2xl border border-[#22262E] overflow-hidden mt-6">
                  <div className="flex items-center justify-between bg-[#0F1115] px-4 py-2.5">
                    <span className="font-mono-studio text-[11px] text-[#8B92A0] tracking-wide">
                      Code Editor
                    </span>
                    <div className="relative">
                      <select
                        value={codeLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        disabled={isSubmitting}
                        className="font-mono-studio bg-[#1B1E24] text-[#D8DCE3] text-xs rounded-md pl-2.5 pr-6 py-1.5 outline-none disabled:opacity-60 border border-[#262B34] appearance-none"
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
                    <div className="bg-[#0C0E11] border-t border-[#1E2229] p-3 max-h-40 overflow-y-auto">
                      {isRunning ? (
                        <p className="font-mono-studio text-xs text-[#8B92A0]">
                          Running your code...
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {runResults.map((r, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              {r.passed ? (
                                <BsCheckCircleFill className="text-[#4ADE80] mt-0.5 shrink-0" size={12} />
                              ) : (
                                <BsXCircleFill className="text-[#F87171] mt-0.5 shrink-0" size={12} />
                              )}
                              <div className="font-mono-studio text-[#C7CBD1]">
                                <span>Test {i + 1}: {r.passed ? "Passed" : "Failed"}</span>
                                {!r.passed && (
                                  <div className="text-[#6B7280] mt-0.5">
                                    {r.error ? (
                                      <span className="text-[#F0918D]">{r.error}</span>
                                    ) : (
                                      <>Expected: {r.expectedOutput} | Got: {r.actualOutput}</>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isSubmitting}
                  rows={8}
                  className="w-full mt-6 bg-[#F5F5F3] dark:bg-[#0F1115] rounded-2xl p-5 border border-[#E5E4E0] dark:border-[#1E2229] text-[#1C1F24] dark:text-[#EDEEF0] placeholder-[#9AA1AC] text-base leading-relaxed resize-none outline-none focus:border-[#E8A94C]/50 focus:ring-4 focus:ring-[#E8A94C]/10 transition-all duration-200 disabled:opacity-60"
                />
              )}

              <div className="flex items-center gap-3 mt-5">
                {isCoding && (
                  <motion.button
                    onClick={runCode}
                    disabled={isSubmitting || isRunning}
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ y: -1 }}
                    className="shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl border border-[#5EC8D8]/40 text-[#2E8494] dark:text-[#5EC8D8] font-medium hover:bg-[#5EC8D8]/5 transition-all duration-200 disabled:opacity-60"
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
                  className="flex-1 bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] font-semibold py-3 rounded-2xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center shrink-0">
                  <p className={`font-mono-studio text-4xl font-bold ${scoreColor(result.score)}`}>
                    {result.score}
                    <span className="text-base text-[#9AA1AC]">/10</span>
                  </p>
                </div>
                <div className="h-10 w-px bg-[#EAE9E5] dark:bg-[#1E2229]" />
                <div className="flex-1 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-mono-studio text-sm text-[#1C1F24] dark:text-[#EDEEF0]">
                      {result.confidence}
                    </p>
                    <p className="text-[9px] text-[#9AA1AC] tracking-wide">CONFIDENCE</p>
                  </div>
                  <div>
                    <p className="font-mono-studio text-sm text-[#1C1F24] dark:text-[#EDEEF0]">
                      {result.communication}
                    </p>
                    <p className="text-[9px] text-[#9AA1AC] tracking-wide">COMMUNICATION</p>
                  </div>
                  <div>
                    <p className="font-mono-studio text-sm text-[#1C1F24] dark:text-[#EDEEF0]">
                      {result.correctness}
                    </p>
                    <p className="text-[9px] text-[#9AA1AC] tracking-wide">CORRECTNESS</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAFAF8] dark:bg-[#0C0E11] border border-[#E8A94C]/25 p-4 rounded-xl mb-6">
                <p className="font-mono-studio text-[10px] text-[#B27E2E] dark:text-[#E8A94C] tracking-wide uppercase mb-1.5">
                  AI feedback
                </p>
                <p className="text-sm text-[#3D4148] dark:text-[#C7CBD1] leading-relaxed">
                  {result.feedback}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  onClick={practiceAnother}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1 }}
                  className="flex-1 bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] font-semibold py-3 rounded-2xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <BsArrowRepeat size={15} />
                  Practice Another
                </motion.button>
                <button
                  onClick={() => navigate("/practice")}
                  className="px-5 py-3 rounded-2xl border border-[#EAE9E5] dark:border-[#262B34] text-[#5C6472] dark:text-[#9AA1AC] font-medium hover:bg-[#F5F5F3] dark:hover:bg-[#1B1E24] transition-colors"
                >
                  Back to Hub
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestion;