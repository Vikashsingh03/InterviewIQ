import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import Editor from "@monaco-editor/react";
import {
  BsArrowLeft,
  BsCode,
  BsChatSquareText,
  BsPlayFill,
  BsCheckCircleFill,
  BsXCircleFill,
  BsChevronDown,
  BsArrowRepeat,
} from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import { ServerUrl } from "../App";

const CODE_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

function ScoreRow({ label, value }) {
  return (
    <div className="text-center">
      <p className="font-mono-studio text-lg text-[#EDEEF0]">{value ?? "—"}</p>
      <p className="text-[10px] text-[#565D68]">{label}</p>
    </div>
  );
}

function PracticeQuestion() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [question, setQuestion] = useState(null);

  const [answer, setAnswer] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");

  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [runSupported, setRunSupported] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { score, confidence, communication, correctness, feedback, testResults... }

  const isCoding = type === "coding";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMessage("");
      setResult(null);
      setRunResults(null);
      setAnswer("");
      try {
        const res = await axios.get(
          ServerUrl + `/api/practice/questions/${type}/${id}`,
          { withCredentials: true },
        );
        setQuestion(res.data);
        if (res.data.type === "coding" && res.data.starterCode) {
          const langToUse = res.data.starterCode[codeLanguage]
            ? codeLanguage
            : "javascript";
          setCodeLanguage(langToUse);
          setAnswer(res.data.starterCode[langToUse] || "");
        }
      } catch (error) {
        console.log(error);
        setErrorMessage(
          error?.response?.data?.message ||
            "Couldn't load this question. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (isRunning || isSubmitting || !isCoding) return;
    setIsRunning(true);
    setErrorMessage("");
    setRunResults(null);
    try {
      const res = await axios.post(
        ServerUrl + "/api/practice/run-code",
        { questionId: id, code: answer, language: codeLanguage },
        { withCredentials: true },
      );
      setRunSupported(res.data.supported);
      setRunResults(res.data.supported ? res.data.results : []);
      if (!res.data.supported) {
        setErrorMessage(
          res.data.message || "Run isn't supported for this language yet.",
        );
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Couldn't run your code right now. Please try again.",
      );
    } finally {
      setIsRunning(false);
    }
  };

  const submit = async () => {
    if (isSubmitting) return;
    if (isCoding && !answer.trim()) return;
    if (!isCoding && !answer.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const payload = isCoding
        ? { type, questionId: id, answer, language: codeLanguage }
        : { type, questionId: id, answer };

      const res = await axios.post(ServerUrl + "/api/practice/submit", payload, {
        withCredentials: true,
      });
      setResult(res.data);
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Something went wrong while grading your answer. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const practiceAnother = async () => {
    try {
      const res = await axios.get(ServerUrl + "/api/practice/questions", {
        withCredentials: true,
      });
      const pool = [...(res.data.coding || []), ...(res.data.hr || [])].filter(
        (q) => !(q.type === type && q.id === id),
      );
      if (!pool.length) {
        navigate("/practice");
        return;
      }
      const random = pool[Math.floor(Math.random() * pool.length)];
      navigate(`/practice/${random.type}/${random.id}`);
    } catch (error) {
      console.log(error);
      navigate("/practice");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3] dark:bg-[#0A0B0D]">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-6 h-6 border-2 border-[#E8A94C]/30 border-t-[#E8A94C] rounded-full"
        />
      </div>
    );
  }

  if (errorMessage && !question) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F7F6F3] dark:bg-[#0A0B0D] px-4 text-center">
        <IoWarningOutline size={22} className="text-red-500" />
        <p className="text-[#5C6472] dark:text-[#8B92A0] text-sm max-w-sm">
          {errorMessage}
        </p>
        <button
          onClick={() => navigate("/practice")}
          className="text-sm font-medium text-[#B27E2E] dark:text-[#E8A94C]"
        >
          Back to Practice Hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-[#F7F6F3] dark:bg-[#0A0B0D] transition-colors duration-300 px-4 sm:px-6 pb-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .practice-root, .practice-root * { font-family: 'Manrope', sans-serif; }
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
        .studio-select { -webkit-appearance: none; appearance: none; }
      `}</style>

      <div className="practice-root max-w-4xl mx-auto pt-6 sm:pt-10">
        <button
          onClick={() => navigate("/practice")}
          className="flex items-center gap-2 text-sm text-[#5C6472] dark:text-[#8B92A0] hover:text-[#1C1F24] dark:hover:text-[#EDEEF0] transition mb-6"
        >
          <BsArrowLeft size={14} />
          Practice Hub
        </button>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span
            className={`font-mono-studio inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] tracking-wide ${
              isCoding
                ? "bg-[#5EC8D8]/10 text-[#2E8494] dark:text-[#5EC8D8] border-[#5EC8D8]/20"
                : "bg-[#8B7FD6]/10 text-[#6A5FBF] dark:text-[#B3A9F5] border-[#8B7FD6]/20"
            }`}
          >
            {isCoding ? <BsCode size={10} /> : <BsChatSquareText size={10} />}
            {isCoding ? "Coding" : "HR"}
          </span>
          {question?.difficulty && (
            <span className="font-mono-studio px-2 py-0.5 rounded-md bg-[#EFEEEA] dark:bg-[#181B20] text-[#6B7280] dark:text-[#8B92A0] text-[10px] tracking-wide">
              {question.difficulty}
            </span>
          )}
          {(question?.topic || question?.category) && (
            <span className="font-mono-studio px-2 py-0.5 rounded-md bg-[#EFEEEA] dark:bg-[#181B20] text-[#6B7280] dark:text-[#8B92A0] text-[10px] tracking-wide">
              {question.topic || question.category}
            </span>
          )}
        </div>

        <h1 className="font-serif-display text-2xl sm:text-3xl text-[#1C1F24] dark:text-[#EDEEF0] leading-snug tracking-tight mb-6">
          {isCoding ? question?.title : question?.question}
        </h1>

        {isCoding && question?.description && (
          <div className="mb-6 space-y-3">
            <p className="text-sm text-[#5C6472] dark:text-[#9AA1AC] whitespace-pre-line leading-relaxed">
              {question.description}
            </p>
            {question.sampleTestCases?.length > 0 && (
              <div className="space-y-2">
                {question.sampleTestCases.map((tc, i) => (
                  <div
                    key={i}
                    className="bg-[#EFEEEA] dark:bg-[#0A0B0D] border border-[#E2E1DC] dark:border-[#1E2229] rounded-lg p-3 font-mono-studio text-xs"
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
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 text-red-700 dark:text-red-400 text-xs sm:text-sm">
            {errorMessage}
          </div>
        )}

        {/* answer surface */}
        {!result &&
          (isCoding ? (
            <div className="flex flex-col rounded-2xl border border-[#1E2229] overflow-hidden shadow-[0_12px_30px_-12px_rgba(0,0,0,0.25)]">
              <div className="flex items-center justify-between bg-[#0C0E11] px-4 py-2.5">
                <span className="font-mono-studio text-[11px] text-[#8B92A0] tracking-wide">
                  Code Editor
                </span>
                <div className="relative">
                  <select
                    value={codeLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    disabled={isSubmitting}
                    className="studio-select font-mono-studio bg-[#181B20] text-[#D8DCE3] text-xs rounded-md pl-2.5 pr-6 py-1.5 outline-none disabled:opacity-60 border border-[#262B34]"
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

              <div style={{ height: "360px" }}>
                <Editor
                  height="360px"
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
                  ) : runSupported ? (
                    <div className="space-y-2">
                      {runResults.map((r, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
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
                                  <span className="text-[#F0918D]">{r.error}</span>
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
                  ) : null}
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
              className="w-full bg-white dark:bg-[#0C0E11] rounded-2xl p-5 sm:p-6 border border-[#E5E4E0] dark:border-[#1E2229] text-[#1C1F24] dark:text-[#EDEEF0] placeholder-[#9AA1AC] dark:placeholder-[#565D68] text-base leading-relaxed resize-none outline-none focus:border-[#E8A94C]/50 focus:ring-4 focus:ring-[#E8A94C]/10 transition-all duration-200 disabled:opacity-60"
            />
          ))}

        {/* actions */}
        {!result && (
          <div className="flex items-center gap-3 mt-6">
            {isCoding && (
              <motion.button
                onClick={runCode}
                disabled={isSubmitting || isRunning}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -1 }}
                className="shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-[#5EC8D8]/40 text-[#2E8494] dark:text-[#5EC8D8] font-medium hover:bg-[#5EC8D8]/5 transition-all duration-200 disabled:opacity-60"
              >
                <BsPlayFill size={16} />
                <span className="hidden sm:inline">
                  {isRunning ? "Running..." : "Run"}
                </span>
              </motion.button>
            )}

            <motion.button
              onClick={submit}
              disabled={isSubmitting || !answer.trim()}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              className="flex-1 bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] font-semibold py-3 sm:py-4 rounded-2xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] hover:shadow-[0_14px_36px_-8px_rgba(0,0,0,0.4)] transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
                  />
                  {isCoding ? "Running tests & reviewing..." : "AI is evaluating..."}
                </>
              ) : isCoding ? (
                "Submit Code"
              ) : (
                "Submit Answer"
              )}
            </motion.button>
          </div>
        )}

        {/* result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2"
            >
              <div className="bg-[#131519] border border-[#232830] rounded-2xl p-5 sm:p-6 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono-studio text-[11px] tracking-[0.08em] text-[#E8A94C]">
                    RESULT
                  </span>
                  <span className="font-serif-display text-3xl text-[#EDEEF0]">
                    {result.score}
                    <span className="text-sm text-[#565D68]">/10</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <ScoreRow label="confidence" value={result.confidence} />
                  <ScoreRow label="communication" value={result.communication} />
                  <ScoreRow label="correctness" value={result.correctness} />
                </div>

                {isCoding && typeof result.testsPassedCount === "number" && (
                  <div className="bg-[#5EC8D8]/6 border border-[#5EC8D8]/25 rounded-xl p-3 text-center mb-4">
                    <p className="font-mono-studio text-lg text-[#5EC8D8]">
                      {result.testsPassedCount}/{result.testsTotalCount}
                    </p>
                    <p className="text-[10px] text-[#565D68] mt-0.5">
                      test cases passed
                    </p>
                  </div>
                )}

                <div className="h-px bg-linear-to-r from-transparent via-[#232830] to-transparent mb-4" />
                <p className="text-[#D8DCE3] text-sm leading-relaxed">
                  {result.feedback}
                </p>
              </div>

              <motion.button
                onClick={practiceAnother}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] font-semibold py-3.5 rounded-2xl shadow-lg transition"
              >
                <BsArrowRepeat size={16} />
                Practice Another
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PracticeQuestion;