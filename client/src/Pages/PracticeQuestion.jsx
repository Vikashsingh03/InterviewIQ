import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ServerUrl } from "../App";
import { useTheme } from "../context/ThemeContext";
import { FaArrowLeft, FaSun, FaMoon, FaHistory, FaUndo, FaChevronRight, FaChevronDown, FaPlay, FaLock, FaLightbulb, FaCode, FaCopy, FaCheck } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { EditorView } from "@codemirror/view";
import { HighlightStyle, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { tags as leetTags } from "@lezer/highlight";
import { formatInput, formatOutput } from "../utils/dsaInputFormatter";

const CODE_MIRROR_LANGS = { javascript, python, cpp, java };

const LEET_MONO =
  "'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', monospace";

const leetDarkTheme = EditorView.theme(
  {
    "&": { backgroundColor: "#262626", color: "#d4d4d4" },
    "&.cm-focused": { outline: "none" },
    ".cm-content": {
      caretColor: "#aeafad",
      padding: "16px 0 40px 0",
      fontFamily: LEET_MONO,
    },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#aeafad" },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: "#264f78" },
    ".cm-activeLine": { backgroundColor: "#2e2e2e" },
    ".cm-gutters": {
      backgroundColor: "#262626",
      color: "#858585",
      border: "none",
      paddingTop: "16px",
    },
    ".cm-activeLineGutter": { backgroundColor: "#2e2e2e", color: "#c6c6c6" },
    ".cm-scroller": { overflow: "auto" },
    ".cm-matchingBracket": {
      backgroundColor: "#3a3d41",
      outline: "1px solid #7a7a7a",
    },
  },
  { dark: true },
);

const leetDarkHighlight = HighlightStyle.define([
  { tag: leetTags.comment, color: "#6a9955" },
  { tag: [leetTags.keyword, leetTags.controlKeyword, leetTags.definitionKeyword], color: "#c586c0" },
  { tag: leetTags.string, color: "#ce9178" },
  { tag: [leetTags.number, leetTags.integer, leetTags.float], color: "#b5cea8" },
  { tag: [leetTags.bool, leetTags.null], color: "#569cd6" },
  {
    tag: [leetTags.function(leetTags.variableName), leetTags.function(leetTags.propertyName)],
    color: "#dcdcaa",
  },
  { tag: [leetTags.variableName, leetTags.propertyName], color: "#9cdcfe" },
  { tag: [leetTags.typeName, leetTags.className], color: "#4ec9b0" },
  { tag: [leetTags.operator, leetTags.punctuation, leetTags.bracket], color: "#d4d4d4" },
  { tag: leetTags.annotation, color: "#dcdcaa" },
]);

const leetLightTheme = EditorView.theme({
  "&": { backgroundColor: "#ffffff", color: "#1f1f1f" },
  "&.cm-focused": { outline: "none" },
  ".cm-content": {
    caretColor: "#1f1f1f",
    padding: "16px 0 40px 0",
    fontFamily: LEET_MONO,
  },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#1f1f1f" },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
    { backgroundColor: "#add6ff" },
  ".cm-activeLine": { backgroundColor: "#f3f3f3" },
  ".cm-gutters": {
    backgroundColor: "#ffffff",
    color: "#808080",
    border: "none",
    paddingTop: "16px",
  },
  ".cm-activeLineGutter": { backgroundColor: "#f3f3f3", color: "#1f1f1f" },
  ".cm-scroller": { overflow: "auto" },
  ".cm-matchingBracket": {
    backgroundColor: "#d7d7d7",
    outline: "1px solid #a0a0a0",
  },
});

const leetLightHighlight = HighlightStyle.define([
  { tag: leetTags.comment, color: "#008000" },
  { tag: [leetTags.keyword, leetTags.controlKeyword, leetTags.definitionKeyword], color: "#af00db" },
  { tag: leetTags.string, color: "#a31515" },
  { tag: [leetTags.number, leetTags.integer, leetTags.float], color: "#098658" },
  { tag: [leetTags.bool, leetTags.null], color: "#0000ff" },
  {
    tag: [leetTags.function(leetTags.variableName), leetTags.function(leetTags.propertyName)],
    color: "#795e26",
  },
  { tag: [leetTags.variableName, leetTags.propertyName], color: "#001080" },
  { tag: [leetTags.typeName, leetTags.className], color: "#267f99" },
  { tag: [leetTags.operator, leetTags.punctuation, leetTags.bracket], color: "#1f1f1f" },
  { tag: leetTags.annotation, color: "#795e26" },
]);

const CODE_LANGUAGES = [
  { value: "javascript", label: "JavaScript", file: "main.js" },
  { value: "python", label: "Python", file: "main.py" },
  { value: "cpp", label: "C++", file: "main.cpp" },
  { value: "java", label: "Java", file: "Main.java" },
];

const DIFFICULTY_STYLES = {
  easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  medium:
    "bg-[#9A7B24]/10 dark:bg-[#E8A94C]/10 text-[#9A7B24] dark:text-[#E8A94C] border-[#9A7B24]/20 dark:border-[#E8A94C]/20",
  hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

const VERDICT_META = {
  accepted: { label: "ACCEPTED", color: "#4ADE80", soft: "text-[#2E9C5A] dark:text-[#4ADE80]" },
  wrong_answer: { label: "WRONG ANSWER", color: "#F87171", soft: "text-[#B3261E] dark:text-[#F87171]" },
  runtime_error: { label: "RUNTIME ERROR", color: "#F87171", soft: "text-[#B3261E] dark:text-[#F87171]" },
  compile_error: { label: "COMPILATION ERROR", color: "#F87171", soft: "text-[#B3261E] dark:text-[#F87171]" },
  time_limit_exceeded: { label: "TIME LIMIT EXCEEDED", color: "#FBBF24", soft: "text-[#9A7B24] dark:text-[#FBBF24]" },
  error: { label: "ERROR", color: "#E8A94C", soft: "text-[#9A7B24] dark:text-[#E8A94C]" },
};

const LEFT_TABS = [
  { value: "problem", label: "Problem" },
  { value: "solution", label: "Solution" },
  { value: "submissions", label: "Submissions" },
];

const codeKey = (qid, lang) => `dsa-code:v2:${qid}:${lang}`;
const historyKey = (qid) => `dsa-history:${qid}`;

const loadHistory = (qid) => {
  try {
    return JSON.parse(localStorage.getItem(historyKey(qid)) || "[]");
  } catch (e) {
    return [];
  }
};

const pushHistory = (qid, entry) => {
  try {
    const arr = loadHistory(qid);
    arr.unshift(entry);
    localStorage.setItem(historyKey(qid), JSON.stringify(arr.slice(0, 10)));
  } catch (e) {}
};

const SUPERSCRIPT_DIGITS = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "-": "⁻" };

const withSuperscripts = (text) => {
  if (typeof text !== "string") return text;
  return text.replace(/10\^(-?\d+)/g, (m, exp) => "10" + exp.split("").map((ch) => SUPERSCRIPT_DIGITS[ch] || ch).join(""));
};

const fmtInputPairs = (io, input) => {
  try {
    const r = formatInput(io, input);
    if (Array.isArray(r) && r.length) return r;
  } catch (e) {}
  return null;
};

const fmtOutputText = (io, output, returns) => {
  try {
    const r = formatOutput(io, output, returns);
    if (Array.isArray(r) && r.length)
      return r.map((p) => `${p.name} = ${p.value}`).join(", ");
    if (typeof r === "string") return r;
  } catch (e) {}
  return output;
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

function Spinner({ label }) {
  return (
    <p className="font-mono-studio text-xs tracking-[0.14em] text-[#5B636E] dark:text-[#8B92A0] px-5 py-4 flex items-center gap-2.5">
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-3.5 h-3.5 border-2 border-[#8A929C]/30 dark:border-[#8B92A0]/30 border-t-[#9A7B24] dark:border-t-[#E8A94C] rounded-full inline-block shrink-0"
      />
      {label}
    </p>
  );
}

function FormattedPairs({ pairs }) {
  return (
    <>
      {pairs.map((p, i) => (
        <span key={i}>
          {i > 0 && ", "}
          <span className="text-[#8A929C] dark:text-[#8B92A0]">{p.name}</span>
          <span className="text-[#5B636E] dark:text-[#9AA1AC]"> = </span>
          <span className="font-semibold text-[#14171B] dark:text-[#EDEEF0]">{p.value}</span>
        </span>
      ))}
    </>
  );
}

function ExampleCard({ ex, index, io, returns }) {
  const pairs = fmtInputPairs(io, ex.input);
  const outText = fmtOutputText(io, ex.output, returns);
  return (
    <div className="rounded-xl border border-[#E8E6E1] dark:border-[#232830] bg-[#F5F4F1] dark:bg-[#14171C] overflow-hidden">
      <div className="border-l-2 border-[#C99E41] dark:border-[#E8A94C] px-4 py-3.5">
        <p className="font-mono-studio text-[10px] font-bold tracking-[0.18em] text-[#9A7B24] dark:text-[#E8A94C] mb-2.5">
          EXAMPLE {index + 1}
        </p>
        <div className="space-y-2 font-mono-studio text-xs leading-relaxed">
          <p className="text-[#3E4650] dark:text-[#EDEEF0] wrap-break-word">
            <span className="font-bold text-[#14171B] dark:text-[#EDEEF0]">Input: </span>
            {pairs ? <FormattedPairs pairs={pairs} /> : ex.input}
          </p>
          <p className="text-[#3E4650] dark:text-[#EDEEF0] wrap-break-word">
            <span className="font-bold text-[#14171B] dark:text-[#EDEEF0]">Output: </span>
            <span className="font-semibold">{outText}</span>
          </p>
          {ex.explanation && (
            <p className="text-[#5B636E] dark:text-[#9AA1AC] wrap-break-word pt-0.5" style={{ fontFamily: "'Manrope', sans-serif", fontSize: "13px", lineHeight: "1.65" }}>
              <span className="font-mono-studio font-bold text-xs text-[#14171B] dark:text-[#EDEEF0]">Explanation: </span>
              {ex.explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function TestResultCard({ item, index, io, returns }) {
  const [open, setOpen] = useState(index === 0);
  const pairs = fmtInputPairs(io, item.input);
  const expected = fmtOutputText(io, item.expectedOutput, returns);
  const actual = item.error ? null : fmtOutputText(io, item.actualOutput, returns);

  return (
    <div className="bg-[#F5F4F1] dark:bg-[#14171C] border border-[#E8E6E1] dark:border-[#232830] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer"
      >
        <span
          className={`font-mono-studio text-[10px] font-bold tracking-[0.14em] px-2 py-1 rounded-md border shrink-0 ${
            item.passed
              ? "text-[#2E9C5A] dark:text-[#4ADE80] border-[#2E9C5A]/30 dark:border-[#4ADE80]/30 bg-[#2E9C5A]/8 dark:bg-[#4ADE80]/8"
              : "text-[#B3261E] dark:text-[#F87171] border-[#B3261E]/30 dark:border-[#F87171]/30 bg-[#B3261E]/8 dark:bg-[#F87171]/8"
          }`}
        >
          {item.passed ? "PASS" : "FAIL"}
        </span>
        <span className="font-mono-studio text-xs text-[#3E4650] dark:text-[#C7CBD1]">
          Sample case {index + 1}
        </span>
        <FaChevronRight
          size={10}
          className={`ml-auto text-[#8A929C] dark:text-[#565D68] transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 grid gap-2 font-mono-studio text-xs">
          <div className="bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-lg p-3">
            <p className="text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] mb-1.5">INPUT</p>
            <p className="text-[#3E4650] dark:text-[#EDEEF0] whitespace-pre-wrap wrap-break-word leading-relaxed">
              {pairs ? <FormattedPairs pairs={pairs} /> : item.input}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <div className="bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-lg p-3">
              <p className="text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] mb-1.5">EXPECTED</p>
              <p className="text-[#3E4650] dark:text-[#EDEEF0] whitespace-pre-wrap wrap-break-word">{expected}</p>
            </div>
            <div className="bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-lg p-3">
              <p className="text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] mb-1.5">YOUR OUTPUT</p>
              {item.error ? (
                <p className="text-[#B3261E] dark:text-[#F0918D] whitespace-pre-wrap wrap-break-word">{item.error}</p>
              ) : (
                <p className="text-[#3E4650] dark:text-[#EDEEF0] whitespace-pre-wrap wrap-break-word">{actual === "" ? "(empty)" : actual}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CaseDetail({ ex, result, io, returns }) {
  const pairs = fmtInputPairs(io, ex.input);
  const expected = result
    ? fmtOutputText(io, result.expectedOutput, returns)
    : fmtOutputText(io, ex.output ?? ex.expectedOutput, returns);
  const actual = result && !result.error ? fmtOutputText(io, result.actualOutput, returns) : null;
  return (
    <div className="grid gap-2 font-mono-studio text-xs">
      <div className="bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-xl p-3.5">
        <p className="text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] mb-2">INPUT</p>
        <div className="text-[#3E4650] dark:text-[#EDEEF0] whitespace-pre-wrap wrap-break-word leading-relaxed">
          {pairs ? <FormattedPairs pairs={pairs} /> : ex.input}
        </div>
      </div>
      {result ? (
        <div className="grid sm:grid-cols-2 gap-2">
          <div className="bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-xl p-3.5">
            <p className="text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] mb-2">YOUR OUTPUT</p>
            {result.error ? (
              <p className="text-[#B3261E] dark:text-[#F0918D] whitespace-pre-wrap wrap-break-word">{result.error}</p>
            ) : (
              <p className="text-[#3E4650] dark:text-[#EDEEF0] whitespace-pre-wrap wrap-break-word">
                {actual === "" ? "(empty)" : actual}
              </p>
            )}
          </div>
          <div className="bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-xl p-3.5">
            <p className="text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] mb-2">EXPECTED</p>
            <p className="text-[#3E4650] dark:text-[#EDEEF0] whitespace-pre-wrap wrap-break-word">{expected}</p>
          </div>
        </div>
      ) : (
        <p className="font-mono-studio text-[10px] tracking-widest text-[#8A929C] dark:text-[#565D68] text-center pt-1">
          PRESS RUN TO EXECUTE THESE CASES
        </p>
      )}
    </div>
  );
}

function SubmitVerdictCard({ submitResult, submitMeta, hiddenResults, animatedScore, io }) {
  const verdict = submitResult.verdict;
  const failedCase = submitResult.failedCase || null;
  const inputPairs = failedCase ? fmtInputPairs(io, failedCase.input) : null;
  const hiddenPassed = hiddenResults.filter((r) => r.passed).length;
  const anyHiddenFail = hiddenResults.some((r) => !r.passed && !r.skipped);
  const headline =
    verdict === "accepted"
      ? `${submitResult.testsPassedCount}/${submitResult.testsTotalCount} test cases passed`
      : verdict === "wrong_answer"
        ? "Wrong Answer"
        : verdict === "runtime_error"
          ? "Runtime Error"
          : verdict === "compile_error"
            ? "Compilation Error"
            : verdict === "time_limit_exceeded"
              ? "Time Limit Exceeded"
              : submitResult.errorMessage || "Something went wrong";
  const subline =
    verdict === "wrong_answer" && failedCase
      ? `Failed on test ${failedCase.index + 1} of ${submitResult.testsTotalCount}`
      : verdict === "time_limit_exceeded"
        ? "Your code took too long on a test case."
        : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-4 pb-0"
    >
      <div
        className="rounded-2xl border p-5 relative overflow-hidden"
        style={{
          borderColor: `${submitMeta.color}55`,
          backgroundColor: `${submitMeta.color}0D`,
        }}
      >
        {submitResult.verdict === "accepted" && (
          <motion.svg
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            viewBox="0 0 52 52"
            className="w-14 h-14 mb-3"
          >
            <motion.circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke={submitMeta.color}
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.path
              fill="none"
              stroke={submitMeta.color}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 27l8 8 16-17"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
            />
          </motion.svg>
        )}
        <div className="flex items-center gap-2.5 mb-2">
          <span
            className="w-1.5 h-1.5 rotate-45 shrink-0"
            style={{ backgroundColor: submitMeta.color }}
          />
          <p className="font-mono-studio text-[11px] tracking-[0.22em]" style={{ color: submitMeta.color }}>
            {submitMeta.label}
          </p>
        </div>
        <h3
          className="font-serif-display text-2xl sm:text-3xl tracking-tight mb-1.5"
          style={{ color: submitMeta.color }}
        >
          {headline}
        </h3>
        {subline && (
          <p className="text-sm text-[#5B636E] dark:text-[#8B92A0] mb-1">{subline}</p>
        )}
        {hiddenResults.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2.5">
              <p className="font-mono-studio text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#8B92A0]">
                HIDDEN TEST CASES
              </p>
              <p
                className={`font-mono-studio text-[11px] font-bold tracking-[0.14em] ${
                  anyHiddenFail
                    ? "text-[#B3261E] dark:text-[#F87171]"
                    : "text-[#2E9C5A] dark:text-[#4ADE80]"
                }`}
              >
                {hiddenPassed}/{hiddenResults.length} PASSED
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {hiddenResults.map((r, i) => (
                <span
                  key={i}
                  title={`Test ${i + 4}: ${r.skipped ? "not run" : r.passed ? "passed" : "failed"}`}
                  className={`w-4 h-4 rounded-full ${
                    r.skipped
                      ? "bg-[#C9CDD3] dark:bg-[#3A4048]"
                      : r.passed
                        ? "bg-[#2E9C5A] dark:bg-[#4ADE80]"
                        : "bg-[#B3261E] dark:bg-[#F87171]"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {failedCase && verdict !== "accepted" && verdict !== "error" && (
        <div className="rounded-2xl border border-[#E8E6E1] dark:border-[#232830] bg-white dark:bg-[#0C0E11] overflow-hidden mt-3">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#E8E6E1] dark:border-[#232830]">
            <p className="font-mono-studio text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#8B92A0]">
              {verdict === "wrong_answer" ? "FAILED TESTCASE" : "LAST EXECUTED INPUT"}
            </p>
            <p className="font-mono-studio text-[11px] font-bold" style={{ color: submitMeta.color }}>
              #{failedCase.index + 1}
            </p>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="font-mono-studio text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] mb-2">
                INPUT
              </p>
              {inputPairs ? (
                <div className="space-y-1">
                  {inputPairs.map((p, i) => (
                    <p key={i} className="text-sm wrap-break-word">
                      <span className="font-mono-studio text-[#9A7B24] dark:text-[#E8A94C]">{p.name}</span>
                      <span className="font-mono-studio text-[#8A929C] dark:text-[#565D68]"> = </span>
                      <span className="font-mono-studio text-[#3E4650] dark:text-[#EDEEF0]">{p.value}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="font-mono-studio text-sm text-[#3E4650] dark:text-[#EDEEF0] whitespace-pre-wrap wrap-break-word">
                  {failedCase.input}
                </p>
              )}
            </div>
            {verdict === "wrong_answer" && (
              <>
                <div>
                  <p className="font-mono-studio text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] mb-2">
                    EXPECTED OUTPUT
                  </p>
                  <p className="font-mono-studio text-sm text-[#3E4650] dark:text-[#EDEEF0] whitespace-pre-wrap wrap-break-word">
                    {failedCase.expectedOutput}
                  </p>
                </div>
                <div>
                  <p className="font-mono-studio text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] mb-2">
                    YOUR OUTPUT
                  </p>
                  <p
                    className="font-mono-studio text-sm whitespace-pre-wrap wrap-break-word text-[#B3261E] dark:text-[#F0918D]"
                    style={failedCase.actualOutput ? {} : { opacity: 0.55 }}
                  >
                    {failedCase.actualOutput || "(no output)"}
                  </p>
                </div>
              </>
            )}
            {(verdict === "runtime_error" || verdict === "compile_error") && failedCase.error && (
              <div>
                <p className="font-mono-studio text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] mb-2">
                  {verdict === "compile_error" ? "COMPILER OUTPUT" : "ERROR"}
                </p>
                <pre className="font-mono-studio text-[12px] leading-relaxed text-[#B3261E] dark:text-[#F0918D] whitespace-pre-wrap wrap-break-word bg-[#B3261E]/5 dark:bg-[#F87171]/10 border border-[#B3261E]/20 dark:border-[#F87171]/20 rounded-xl p-3.5 max-h-64 overflow-auto thin-scroll">
                  {failedCase.error}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {submitResult.verdict !== "error" && (
        <>
          <div className="flex items-center gap-5 bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-2xl p-5 mt-3 flex-wrap">
            <ScoreRing value={submitResult.score} displayValue={animatedScore} color={submitMeta.color} />
            <div className="flex-1 min-w-52 space-y-3.5">
              {[
                { label: "Confidence", value: submitResult.confidence },
                { label: "Communication", value: submitResult.communication },
                { label: "Correctness", value: submitResult.correctness },
              ].map((s, i) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-mono-studio text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#8B92A0]">
                      {s.label.toUpperCase()}
                    </p>
                    <p className="font-mono-studio text-xs text-[#14171B] dark:text-[#EDEEF0]">
                      {s.value}/10
                    </p>
                  </div>
                  <div className="bg-[#F5F4F1] dark:bg-[#14171C] h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.value || 0) * 10}%` }}
                      transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 + i * 0.08 }}
                      className="h-full rounded-full bg-[#C99E41] dark:bg-[#E8A94C]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative bg-white dark:bg-[#0C0E11] border border-[#9A7B24]/25 dark:border-[#E8A94C]/25 rounded-2xl p-5 mt-3 overflow-hidden">
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#C99E41] dark:bg-[#E8A94C]" />
            <p className="font-serif-display text-base sm:text-lg text-[#14171B] dark:text-[#EDEEF0] leading-relaxed">
              {submitResult.feedback}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#C99E41] dark:bg-[#E8A94C] shrink-0" />
              <p className="font-mono-studio text-[10px] text-[#9A7B24] dark:text-[#E8A94C] tracking-[0.22em]">
                AI FEEDBACK
              </p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

const PracticeQuestion = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isCoding = type === "coding";

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [siblingIds, setSiblingIds] = useState([]);

  const [answer, setAnswer] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const codesRef = useRef({});
  const startersRef = useRef({});

  const [themeOverride, setThemeOverride] = useState(null);
  const editorDark = themeOverride ? themeOverride === "leetcode-dark" : theme === "dark";

  const cmExtensions = useMemo(() => {
    const loader = CODE_MIRROR_LANGS[codeLanguage] || CODE_MIRROR_LANGS.javascript;
    return [
      loader(),
      indentUnit.of("    "),
      editorDark ? leetDarkTheme : leetLightTheme,
      syntaxHighlighting(editorDark ? leetDarkHighlight : leetLightHighlight),
    ];
  }, [codeLanguage, editorDark]);

  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [runError, setRunError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const [history, setHistory] = useState([]);

  const [result, setResult] = useState(null);

  const [leftTab, setLeftTab] = useState("problem");
  const [resultTab, setResultTab] = useState("testcase");
  const [panelHeight, setPanelHeight] = useState(() => {
    try {
      const saved = parseInt(localStorage.getItem("dsa-panel-height"), 10);
      if (saved >= 140 && saved <= 900) return saved;
    } catch (e) {}
    return 300;
  });
  const [panelDragging, setPanelDragging] = useState(false);
  const panelDragRef = useRef(null);
  const [selectedCase, setSelectedCase] = useState(0);
  const [expandedHint, setExpandedHint] = useState(null);
  const [editorial, setEditorial] = useState(null);
  const [editorialLoading, setEditorialLoading] = useState(false);
  const [editorialError, setEditorialError] = useState("");
  const [editorialCopied, setEditorialCopied] = useState(false);

  const animatedScore = useCountUp(result?.score || 0, 1100, !!result);
  const animatedSubmitScore = useCountUp(submitResult?.score || 0, 1100, !!submitResult);

  useEffect(() => {
    if (!isCoding) return;
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) submitCode();
        else runCode();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      setLoading(true);
      setError("");
      setQuestion(null);
      setRunResults(null);
      setRunError("");
      setSubmitResult(null);
      setResult(null);
      setAnswer("");
      setCode("");
      setLeftTab("problem");
      setResultTab("testcase");
      setSelectedCase(0);
      setExpandedHint(null);
      setEditorial(null);
      setEditorialLoading(false);
      setEditorialError("");
      codesRef.current = {};
      startersRef.current = {};

      try {
        const detailUrl =
          ServerUrl +
          `/api/practice/questions/${type}/${id}` +
          (type === "coding" ? "?language=javascript" : "");

        const [detailRes, listRes] = await Promise.all([
          axios.get(detailUrl, { withCredentials: true }),
          axios.get(ServerUrl + "/api/practice/questions", { withCredentials: true }),
        ]);

        if (cancelled) return;

        const detail = detailRes.data;
        setQuestion(detail);

        if (type === "coding") {
          setCodeLanguage("javascript");
          startersRef.current.javascript = detail.starterCode || "";
          let saved = null;
          try {
            saved = localStorage.getItem(codeKey(id, "javascript"));
          } catch (e) {}
          const initial = saved ? saved : detail.starterCode || "";
          codesRef.current.javascript = initial;
          setCode(initial);
          setHistory(loadHistory(id));
        }

        const pool = type === "coding" ? listRes.data.coding : listRes.data.hr;
        setSiblingIds((pool || []).map((q) => q.id).filter((qId) => qId !== id));
      } catch (err) {
        if (cancelled) return;
        setError(
          err?.response?.data?.message ||
            "Couldn't load this question. Please try again.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    boot();
    return () => {
      cancelled = true;
    };
  }, [type, id]);

  const ensureStarter = async (lang) => {
    if (startersRef.current[lang] !== undefined) return startersRef.current[lang];
    try {
      const res = await axios.get(
        ServerUrl + `/api/practice/questions/coding/${id}?language=${lang}`,
        { withCredentials: true },
      );
      const starter = res.data.starterCode || "";
      startersRef.current[lang] = starter;
      return starter;
    } catch (e) {
      return "";
    }
  };

  const switchLanguage = async (newLang) => {
    if (newLang === codeLanguage || isRunning || isSubmitting) return;

    codesRef.current[codeLanguage] = code;
    try {
      localStorage.setItem(codeKey(id, codeLanguage), code);
    } catch (e) {}

    setCodeLanguage(newLang);
    setRunResults(null);
    setRunError("");
    setEditorial(null);
    setEditorialError("");

    if (codesRef.current[newLang] !== undefined) {
      setCode(codesRef.current[newLang]);
      ensureStarter(newLang);
      return;
    }

    let saved = null;
    try {
      saved = localStorage.getItem(codeKey(id, newLang));
    } catch (e) {}

    if (saved) {
      codesRef.current[newLang] = saved;
      setCode(saved);
      ensureStarter(newLang);
      return;
    }

    try {
      const res = await axios.get(
        ServerUrl + `/api/practice/questions/coding/${id}?language=${newLang}`,
        { withCredentials: true },
      );
      const starter = res.data.starterCode || "";
      startersRef.current[newLang] = starter;
      codesRef.current[newLang] = starter;
      setCode(starter);
    } catch (err) {
      setError("Couldn't load starter code for this language.");
    }
  };

  const handleCodeChange = (value) => {
    const v = value ?? "";
    setCode(v);
    codesRef.current[codeLanguage] = v;
    try {
      localStorage.setItem(codeKey(id, codeLanguage), v);
    } catch (e) {}
  };

  const resetCode = async () => {
    if (!window.confirm("Reset your code to the starter template? Your current code will be lost.")) return;
    const starter = await ensureStarter(codeLanguage);
    setCode(starter);
    codesRef.current[codeLanguage] = starter;
    try {
      localStorage.setItem(codeKey(id, codeLanguage), starter);
    } catch (e) {}
  };

  const cycleEditorTheme = () => {
    setThemeOverride((prev) =>
      prev === null ? "leetcode-light" : prev === "leetcode-light" ? "leetcode-dark" : null,
    );
  };

  const runCode = async () => {
    if (isRunning || isSubmitting) return;
    setIsRunning(true);
    setRunError("");
    setRunResults(null);
    setSubmitResult(null);
    setResultTab("result");
    setSelectedCase(0);
    try {
      const res = await axios.post(
        ServerUrl + "/api/practice/run-code",
        { questionId: id, code, language: codeLanguage },
        { withCredentials: true },
      );
      if (res.data && res.data.supported === false) {
        setRunError(res.data.message || "Code execution isn't available for this language.");
      } else {
        setRunResults(res.data.results || []);
      }
    } catch (err) {
      const status = err?.response?.status;
      setRunError(
        status === 429
          ? "Too many runs — the code runner is busy. Wait a few seconds and try again."
          : err?.response?.data?.message || "Couldn't run your code right now.",
      );
    } finally {
      setIsRunning(false);
    }
  };

  const fetchEditorial = async () => {
    if (editorialLoading || editorial) return;
    setEditorialLoading(true);
    setEditorialError("");
    try {
      const res = await axios.post(
        ServerUrl + "/api/practice/editorial",
        { questionId: id, language: codeLanguage },
        { withCredentials: true },
      );
      setEditorial(res.data);
    } catch (err) {
      setEditorialError(
        err?.response?.data?.message || "Couldn't generate the editorial right now. Try again.",
      );
    } finally {
      setEditorialLoading(false);
    }
  };

  const copyEditorialCode = async () => {
    if (!editorial?.code) return;
    try {
      await navigator.clipboard.writeText(editorial.code);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = editorial.code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setEditorialCopied(true);
    setTimeout(() => setEditorialCopied(false), 1600);
  };

  const startPanelDrag = (e) => {
    e.preventDefault();
    panelDragRef.current = { startY: e.clientY, startH: panelHeight, latest: panelHeight };
    setPanelDragging(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "row-resize";
    const onMove = (ev) => {
      const d = panelDragRef.current;
      if (!d) return;
      const maxH = Math.max(220, window.innerHeight * 0.72);
      const next = Math.min(maxH, Math.max(140, d.startH + (d.startY - ev.clientY)));
      d.latest = next;
      setPanelHeight(next);
    };
    const onUp = () => {
      const latest = panelDragRef.current ? panelDragRef.current.latest : panelHeight;
      panelDragRef.current = null;
      setPanelDragging(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      try {
        localStorage.setItem("dsa-panel-height", String(Math.round(latest)));
      } catch (err) {}
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const resetPanelHeight = () => {
    setPanelHeight(300);
    try {
      localStorage.setItem("dsa-panel-height", "300");
    } catch (e) {}
  };

  const submitCode = async () => {
    if (isSubmitting || isRunning || !code.trim()) return;
    setIsSubmitting(true);
    setSubmitResult(null);
    setRunResults(null);
    setResultTab("result");
    try {
      const res = await axios.post(
        ServerUrl + "/api/practice/submit",
        { type: "coding", questionId: id, answer: code, language: codeLanguage },
        { withCredentials: true },
      );
      const data = res.data;
      setSubmitResult(data);
      pushHistory(id, {
        ts: Date.now(),
        verdict: data.verdict,
        score: data.score,
        passed: data.testsPassedCount,
        total: data.testsTotalCount,
      });
      setHistory(loadHistory(id));
    } catch (err) {
      const status = err?.response?.status;
      setSubmitResult({
        verdict: "error",
        errorMessage:
          status === 429
            ? "Too many submissions — wait a bit and try again."
            : err?.response?.data?.message || "Couldn't submit your code right now. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitHr = async () => {
    if (isSubmitting || !answer.trim()) return;
    setIsSubmitting(true);
    setError("");
    try {
      const res = await axios.post(
        ServerUrl + "/api/practice/submit",
        { type, questionId: id, answer },
        { withCredentials: true },
      );
      setResult(res.data);
    } catch (err) {
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

  if ((error && !question) || (question === null && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] dark:bg-[#0A0B0D] px-4">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <IoWarningOutline size={18} className="text-[#9A7B24] dark:text-[#E8A94C]" />
            <p className="font-mono-studio text-[11px] tracking-[0.24em] text-[#9A7B24] dark:text-[#E8A94C]">
              QUESTION NOT FOUND
            </p>
          </div>
          <p className="text-sm text-[#3E4650] dark:text-[#8B92A0] mb-6">
            {error || "This question doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/practice")}
            className="bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-mono-studio text-xs font-bold tracking-[0.16em] px-7 py-4 rounded-full hover:opacity-90 transition cursor-pointer"
          >
            BACK TO HUB
          </button>
        </div>
      </div>
    );
  }

  if (!isCoding) {
    const verdictColor = result ? scoreColor(result.score) : "#E8A94C";
    const verdict = result ? scoreVerdict(result.score) : null;

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
                PRACTICE MODE · HR
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 flex items-start gap-2">
              <IoWarningOutline size={16} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
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
              <span className="font-mono-studio text-[10px] tracking-[0.16em] border px-2.5 py-1 rounded-md text-[#6A5FBF] dark:text-[#B3A9F5] border-[#6A5FBF]/30 dark:border-[#8B7FD6]/30">
                HR / BEHAVIORAL
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
                {question?.category}
              </span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-5xl text-[#14171B] dark:text-[#EDEEF0] leading-[1.1] tracking-tight mb-10">
              {question?.question}
            </h1>

            {!result ? (
              <>
                <SectionHead num="01" title="YOUR ANSWER" />

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

                <div className="flex items-center gap-3 mt-6">
                  <motion.button
                    onClick={submitHr}
                    disabled={isSubmitting || !answer.trim()}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ y: -1 }}
                    className="flex-1 bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-mono-studio text-xs font-bold tracking-[0.16em] py-4 rounded-full hover:opacity-90 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
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
                    <span className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ backgroundColor: verdictColor }} />
                    <p className="font-mono-studio text-[11px] tracking-[0.26em]" style={{ color: verdictColor }}>
                      VERDICT
                    </p>
                  </div>

                  <div className="flex items-center gap-8 sm:gap-12 flex-wrap">
                    <ScoreRing value={result.score} displayValue={animatedScore} color={verdictColor} />
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
  }

  const activeFile = (CODE_LANGUAGES.find((l) => l.value === codeLanguage) || {}).file || "main.js";
  const examples = question?.examples || [];
  const constraints = question?.constraints || [];
  const hints = question?.hints || [];
  const companies = question?.companies || [];
  const descriptionParas = (question?.description || "").split(/\n\n+/).filter((p) => p.trim());
  const runPassedCount = runResults ? runResults.filter((r) => r.passed).length : 0;
  const firstRunFail = runResults ? runResults.findIndex((r) => !r.passed) : -1;
  const sampleCases = question?.sampleTestCases?.length ? question.sampleTestCases : examples;
  const cases = sampleCases.slice(0, 3);
  const firstFailError = firstRunFail >= 0 && runResults ? runResults[firstRunFail]?.error : null;
  const runHeadline = !runResults
    ? null
    : runPassedCount === runResults.length
      ? "Accepted"
      : firstFailError
        ? "Runtime Error"
        : "Wrong Answer";
  const runErrorKind = !runError
    ? null
    : /time limit/i.test(runError)
      ? "Time Limit Exceeded"
      : /unreachable|busy|JDOODLE|execution service/i.test(runError)
        ? "Execution Error"
        : "Runtime Error";
  const hiddenResults = submitResult?.hiddenResults || [];
  const submitMeta = VERDICT_META[submitResult?.verdict] || VERDICT_META.error;
  const hasAccepted = history.some((h) => h.verdict === "accepted");

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
        .thin-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .thin-scroll::-webkit-scrollbar-thumb { background: rgba(154,123,36,0.25); border-radius: 8px; }
        .thin-scroll::-webkit-scrollbar-track { background: transparent; }
        .lang-select { appearance: none; -webkit-appearance: none; }
        .lang-select option { background: #ffffff; color: #14171B; }
        .dark .lang-select option { background: #14171C; color: #EDEEF0; }
      `}</style>

      <div className="film-grain" />

      <div className="practiceq-root relative z-10 max-w-[1600px] mx-auto px-3 sm:px-5 py-4">

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-3 mb-3 flex-wrap"
        >
          <motion.button
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/practice")}
            aria-label="Back to practice hub"
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] transition-all duration-200 cursor-pointer"
          >
            <FaArrowLeft className="text-[#5B636E] dark:text-[#9AA1AC]" size={13} />
          </motion.button>
          <div className="flex items-center gap-2 bg-[#9A7B24]/8 dark:bg-[#E8A94C]/8 border border-[#9A7B24]/20 dark:border-[#E8A94C]/20 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#C99E41] dark:bg-[#E8A94C] shrink-0" />
            <span className="font-mono-studio text-[11px] tracking-[0.08em] text-[#9A7B24] dark:text-[#E8A94C]">
              PRACTICE MODE · CODING
            </span>
          </div>
          <span className="hidden md:inline font-mono-studio text-[10px] tracking-widest text-[#8A929C]/70 dark:text-[#565D68]">
            ⌃↵ RUN · ⇧⌃↵ SUBMIT
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={cycleEditorTheme}
              title="Toggle editor theme"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E8E6E1] dark:border-[#232830] bg-white dark:bg-[#0C0E11] text-[#5B636E] dark:text-[#9AA1AC] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 transition-colors cursor-pointer"
            >
              {editorDark ? <FaMoon size={13} /> : <FaSun size={13} />}
            </button>
            <button
              onClick={resetCode}
              disabled={isRunning || isSubmitting}
              title="Reset to starter code"
              className="h-9 px-4 flex items-center gap-1.5 rounded-full border border-[#E8E6E1] dark:border-[#232830] bg-white dark:bg-[#0C0E11] text-[#5B636E] dark:text-[#9AA1AC] font-mono-studio text-[10px] tracking-widest hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 transition-colors disabled:opacity-60 cursor-pointer"
            >
              <FaUndo size={11} />
              RESET
            </button>
            <button
              onClick={practiceAnother}
              className="h-9 px-5 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-mono-studio text-[10px] font-bold tracking-widest hover:opacity-90 transition cursor-pointer"
            >
              NEXT →
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="mb-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 flex items-start gap-2">
            <IoWarningOutline size={16} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-3 lg:h-[calc(100vh-8.5rem)] lg:min-h-155">

          <motion.section
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:w-[45%] shrink-0 flex flex-col bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-2xl overflow-hidden shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]"
          >
            <div className="flex items-center gap-1 px-4 pt-3 border-b border-[#E8E6E1] dark:border-[#232830] shrink-0">
              {LEFT_TABS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setLeftTab(t.value)}
                  className={`relative font-mono-studio text-xs tracking-[0.08em] px-4 py-3 transition-colors cursor-pointer ${
                    leftTab === t.value
                      ? "text-[#9A7B24] dark:text-[#E8A94C] font-bold"
                      : "text-[#8A929C] dark:text-[#8B92A0] hover:text-[#3E4650] dark:hover:text-[#C7CBD1]"
                  }`}
                >
                  {t.label}
                  {t.value === "submissions" && history.length > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[#9A7B24]/15 dark:bg-[#E8A94C]/15 text-[#9A7B24] dark:text-[#E8A94C] text-[10px] font-bold">
                      {history.length}
                    </span>
                  )}
                  {leftTab === t.value && (
                    <motion.span
                      layoutId="left-tab-underline"
                      className="absolute left-3 right-3 -bottom-px h-0.5 bg-[#C99E41] dark:bg-[#E8A94C] rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="thin-scroll flex-1 min-h-0 lg:overflow-y-auto">
              {leftTab === "problem" && (
                <div className="p-5 sm:p-7">
                  <div className="flex items-start gap-3 flex-wrap mb-4">
                    <h1 className="font-serif-display text-2xl sm:text-3xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight leading-tight flex-1 min-w-0">
                      {question?.title}
                    </h1>
                    {question?.difficulty && (
                      <span
                        className={`font-mono-studio px-2.5 py-1 rounded-md border text-[10px] tracking-[0.16em] uppercase shrink-0 mt-1 ${
                          DIFFICULTY_STYLES[question.difficulty] ||
                          "bg-[#F5F4F1] dark:bg-[#14171C] text-[#5B636E] dark:text-[#8B92A0] border-transparent"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-6">
                    {question?.topic && (
                      <span className="font-mono-studio text-[11px] tracking-[0.08em] text-[#2E8494] dark:text-[#5EC8D8] border border-[#2E8494]/30 dark:border-[#5EC8D8]/30 px-3 py-1.5 rounded-lg uppercase">
                        {question.topic}
                      </span>
                    )}
                    {companies.map((c) => (
                      <span
                        key={c}
                        className="font-mono-studio text-[11px] tracking-[0.06em] text-[#3E4650] dark:text-[#C7CBD1] bg-[#F5F4F1] dark:bg-[#14171C] border border-[#E8E6E1] dark:border-[#232830] px-3 py-1.5 rounded-lg"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-4 mb-8">
                    {descriptionParas.map((p, i) => (
                      <p key={i} className="text-[15px] text-[#3E4650] dark:text-[#9AA1AC] leading-relaxed whitespace-pre-line">
                        {p}
                      </p>
                    ))}
                  </div>

                  {(question?.images || []).length > 0 && (
                    <div className="mb-8 space-y-4">
                      {question.images.map((imgSrc, i) => (
                        <div
                          key={i}
                          className="rounded-xl overflow-hidden border border-[#E8E6E1] dark:border-[#232830] bg-white shadow-[0_12px_30px_-18px_rgba(20,23,27,0.25)]"
                        >
                          <img
                            src={imgSrc}
                            alt={"Illustration " + (i + 1)}
                            className="w-full h-auto object-contain max-h-85"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.closest("div").style.display = "none";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {examples.length > 0 && (
                    <div className="mb-8">
                      <SectionHead num="01" title="EXAMPLES" />
                      <div className="space-y-3">
                        {examples.map((ex, i) => (
                          <ExampleCard key={i} ex={ex} index={i} io={question?.io} returns={question?.returns} />
                        ))}
                      </div>
                    </div>
                  )}

                  {constraints.length > 0 && (
                    <div className="mb-8">
                      <SectionHead num="02" title="CONSTRAINTS" />
                      <div className="rounded-xl bg-[#F5F4F1] dark:bg-[#14171C] border border-[#E8E6E1] dark:border-[#232830] px-5 py-4">
                        <ul className="space-y-2">
                          {constraints.map((c, i) => (
                            <li key={i} className="flex items-start gap-2.5 font-mono-studio text-xs text-[#3E4650] dark:text-[#9AA1AC]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] shrink-0 mt-1.5" />
                              <span className="wrap-break-word">{withSuperscripts(c)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {hints.length > 0 && (
                    <div className="mb-2">
                      <SectionHead num="03" title="HINTS" />
                      <div className="space-y-2.5">
                        {hints.map((h, i) => {
                          const open = expandedHint === i;
                          return (
                            <div
                              key={i}
                              className={`rounded-xl border overflow-hidden transition-colors ${
                                open
                                  ? "bg-[#9A7B24]/6 dark:bg-[#E8A94C]/6 border-[#9A7B24]/25 dark:border-[#E8A94C]/25"
                                  : "bg-[#F5F4F1] dark:bg-[#14171C] border-[#E8E6E1] dark:border-[#232830]"
                              }`}
                            >
                              <button
                                onClick={() => setExpandedHint(open ? null : i)}
                                className="w-full flex items-center justify-between gap-3 px-4 py-3 cursor-pointer"
                              >
                                <span className="flex items-center gap-2.5 font-mono-studio text-xs tracking-[0.08em] text-[#3E4650] dark:text-[#C7CBD1]">
                                  <FaLightbulb size={11} className="text-[#9A7B24] dark:text-[#E8A94C] shrink-0" />
                                  Hint {i + 1}
                                </span>
                                <FaChevronDown
                                  size={11}
                                  className={`shrink-0 text-[#9A7B24] dark:text-[#E8A94C] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                                />
                              </button>
                              {open && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  transition={{ duration: 0.22 }}
                                  className="overflow-hidden"
                                >
                                  <p className="px-4 pb-4 text-sm text-[#3E4650] dark:text-[#9AA1AC] leading-relaxed">
                                    {h}
                                  </p>
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="font-mono-studio text-[10px] tracking-[0.06em] text-[#8A929C] dark:text-[#565D68] mt-5 leading-relaxed">
                        Company tags reference popular interview-prep lists, not verified company appearances.
                      </p>
                    </div>
                  )}
                  {hints.length === 0 && (
                    <p className="font-mono-studio text-[10px] tracking-[0.06em] text-[#8A929C] dark:text-[#565D68] leading-relaxed">
                      Company tags reference popular interview-prep lists, not verified company appearances.
                    </p>
                  )}
                </div>
              )}

              {leftTab === "solution" && (
                <div className="p-5 sm:p-7">
                  {!hasAccepted ? (
                    <div className="rounded-2xl border border-dashed border-[#9A7B24]/40 dark:border-[#E8A94C]/40 bg-[#9A7B24]/5 dark:bg-[#E8A94C]/5 p-8 text-center">
                      <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#9A7B24]/10 dark:bg-[#E8A94C]/10 border border-[#9A7B24]/25 dark:border-[#E8A94C]/25 flex items-center justify-center">
                        <FaLock size={20} className="text-[#9A7B24] dark:text-[#E8A94C]" />
                      </div>
                      <p className="font-mono-studio text-[11px] tracking-[0.24em] text-[#9A7B24] dark:text-[#E8A94C] mb-3">
                        EDITORIAL SOLUTION
                      </p>
                      <h3 className="font-serif-display text-2xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight mb-3">
                        Solve it first
                      </h3>
                      <p className="text-sm text-[#5B636E] dark:text-[#9AA1AC] leading-relaxed max-w-sm mx-auto">
                        Editorial solutions unlock once you solve the problem. Write your approach in the editor and hit Submit.
                      </p>
                      <button
                        onClick={() => setLeftTab("problem")}
                        className="mt-6 px-6 py-3 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-mono-studio text-[11px] font-bold tracking-[0.14em] hover:opacity-90 transition cursor-pointer"
                      >
                        BACK TO PROBLEM
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                        <SectionHead num="04" title="EDITORIAL SOLUTION" />
                        <span className="font-mono-studio text-[9px] tracking-[0.18em] px-2.5 py-1 rounded-full border border-[#9A7B24]/40 dark:border-[#E8A94C]/40 text-[#9A7B24] dark:text-[#E8A94C]">
                          AI GENERATED
                        </span>
                      </div>
                      {!editorial && !editorialLoading && !editorialError && (
                        <div className="rounded-2xl border border-dashed border-[#9A7B24]/40 dark:border-[#E8A94C]/40 bg-[#9A7B24]/5 dark:bg-[#E8A94C]/5 p-8 text-center">
                          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#9A7B24]/10 dark:bg-[#E8A94C]/10 border border-[#9A7B24]/25 dark:border-[#E8A94C]/25 flex items-center justify-center">
                            <FaLightbulb size={20} className="text-[#9A7B24] dark:text-[#E8A94C]" />
                          </div>
                          <h3 className="font-serif-display text-2xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight mb-3">
                            Solved — well done
                          </h3>
                          <p className="text-sm text-[#5B636E] dark:text-[#9AA1AC] leading-relaxed max-w-sm mx-auto mb-6">
                            Read the optimal approach, complexity breakdown and reference code for {question?.title || "this problem"}.
                          </p>
                          <button
                            onClick={fetchEditorial}
                            className="px-8 py-3.5 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-mono-studio text-[11px] font-bold tracking-[0.14em] hover:opacity-90 transition cursor-pointer"
                          >
                            REVEAL EDITORIAL
                          </button>
                        </div>
                      )}
                      {editorialLoading && (
                        <div className="rounded-2xl border border-[#E8E6E1] dark:border-[#232830] bg-[#F5F4F1] dark:bg-[#14171C] p-10 text-center">
                          <div className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-[#C99E41]/30 dark:border-[#E8A94C]/30 border-t-[#C99E41] dark:border-t-[#E8A94C] animate-spin" />
                          <p className="font-mono-studio text-[11px] tracking-[0.18em] text-[#5B636E] dark:text-[#9AA1AC]">
                            WRITING EDITORIAL…
                          </p>
                        </div>
                      )}
                      {editorialError && !editorialLoading && (
                        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-center">
                          <p className="text-sm text-red-600 dark:text-red-400 mb-4">{editorialError}</p>
                          <button
                            onClick={fetchEditorial}
                            className="px-6 py-2.5 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-mono-studio text-[11px] font-bold tracking-[0.14em] hover:opacity-90 transition cursor-pointer"
                          >
                            TRY AGAIN
                          </button>
                        </div>
                      )}
                      {editorial && (
                        <div className="space-y-6">
                          <div className="flex gap-2 flex-wrap">
                            {editorial.timeComplexity && (
                              <span className="font-mono-studio text-[10px] tracking-[0.12em] px-3 py-1.5 rounded-full bg-[#0E7C4B]/10 dark:bg-[#35D07F]/10 text-[#0E7C4B] dark:text-[#35D07F] border border-[#0E7C4B]/25 dark:border-[#35D07F]/25">
                                TIME {editorial.timeComplexity}
                              </span>
                            )}
                            {editorial.spaceComplexity && (
                              <span className="font-mono-studio text-[10px] tracking-[0.12em] px-3 py-1.5 rounded-full bg-[#2B6CB0]/10 dark:bg-[#6BA8FF]/10 text-[#2B6CB0] dark:text-[#6BA8FF] border border-[#2B6CB0]/25 dark:border-[#6BA8FF]/25">
                                SPACE {editorial.spaceComplexity}
                              </span>
                            )}
                          </div>
                          <div className="space-y-3">
                            <p className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#565D68]">
                              THE APPROACH
                            </p>
                            {(editorial.approach || []).map((para, i) => (
                              <p key={i} className="text-sm text-[#3A4048] dark:text-[#B9BFC7] leading-relaxed">
                                {para}
                              </p>
                            ))}
                          </div>
                          {editorial.code && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#565D68]">
                                  REFERENCE CODE
                                </p>
                                <button
                                  onClick={copyEditorialCode}
                                  className="flex items-center gap-1.5 font-mono-studio text-[10px] tracking-[0.12em] text-[#5B636E] dark:text-[#9AA1AC] hover:text-[#14171B] dark:hover:text-[#EDEEF0] transition cursor-pointer"
                                >
                                  {editorialCopied ? <FaCheck size={11} /> : <FaCopy size={11} />}
                                  {editorialCopied ? "COPIED" : "COPY"}
                                </button>
                              </div>
                              <pre className="rounded-xl border border-[#E8E6E1] dark:border-[#232830] bg-[#0A0B0D] text-[#D6DBE1] p-4 text-[12.5px] leading-relaxed overflow-auto max-h-105 font-mono whitespace-pre">
                                {editorial.code}
                              </pre>
                            </div>
                          )}
                          {(editorial.insights || []).length > 0 && (
                            <div className="rounded-xl border border-[#9A7B24]/25 dark:border-[#E8A94C]/25 bg-[#9A7B24]/5 dark:bg-[#E8A94C]/5 p-5">
                              <p className="font-mono-studio text-[10px] tracking-[0.2em] text-[#9A7B24] dark:text-[#E8A94C] mb-3">
                                KEY INSIGHTS
                              </p>
                              <ul className="space-y-2">
                                {editorial.insights.map((ins, i) => (
                                  <li key={i} className="flex gap-2.5 text-sm text-[#3A4048] dark:text-[#B9BFC7] leading-relaxed">
                                    <FaLightbulb size={12} className="text-[#C99E41] dark:text-[#E8A94C] mt-1 shrink-0" />
                                    <span>{ins}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {leftTab === "submissions" && (
                <div className="p-5 sm:p-7">
                  <SectionHead num="01" title="YOUR SUBMISSIONS" />
                  {history.length ? (
                    <div className="space-y-2">
                      {history.map((h, i) => {
                        const meta = VERDICT_META[h.verdict] || VERDICT_META.error;
                        return (
                          <div
                            key={`${h.ts}-${i}`}
                            className="flex items-center gap-3 bg-[#F5F4F1] dark:bg-[#14171C] border border-[#E8E6E1] dark:border-[#232830] rounded-xl px-4 py-3 flex-wrap"
                          >
                            <span className={`font-mono-studio text-[10px] font-bold tracking-[0.12em] ${meta.soft}`}>
                              {meta.label}
                            </span>
                            <span className="font-mono-studio text-[11px] text-[#5B636E] dark:text-[#9AA1AC]">
                              {h.passed}/{h.total} tests
                            </span>
                            <span className="font-mono-studio text-[11px] text-[#5B636E] dark:text-[#9AA1AC]">
                              Score {h.score}/10
                            </span>
                            <span className="font-mono-studio text-[10px] text-[#8A929C] dark:text-[#565D68] ml-auto">
                              {new Date(h.ts).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#E8E6E1] dark:border-[#232830] p-8 text-center">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#F5F4F1] dark:bg-[#14171C] flex items-center justify-center">
                        <FaHistory size={16} className="text-[#8A929C] dark:text-[#565D68]" />
                      </div>
                      <p className="text-sm text-[#8A929C] dark:text-[#8B92A0]">
                        No submissions yet — your attempts on this question will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="flex-1 min-w-0 flex flex-col bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-2xl overflow-hidden shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]"
          >
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-[#E8E6E1] dark:border-[#232830] bg-[#F5F4F1]/60 dark:bg-[#0C0E11] shrink-0 flex-wrap">
              <div className="flex items-center gap-2 bg-white dark:bg-[#14171C] border border-[#E8E6E1] dark:border-[#232830] rounded-lg pl-3 pr-1 py-1">
                <FaCode size={11} className="text-[#9A7B24] dark:text-[#E8A94C]" />
                <span className="font-mono-studio text-[11px] tracking-[0.08em] text-[#3E4650] dark:text-[#C7CBD1]">
                  {activeFile}
                </span>
                <span className="flex gap-1.5 pl-2 pr-1">
                  <span className="w-2 h-2 rounded-full bg-[#F87171]/70" />
                  <span className="w-2 h-2 rounded-full bg-[#C99E41]/70 dark:bg-[#E8A94C]/70" />
                  <span className="w-2 h-2 rounded-full bg-[#4ADE80]/70" />
                </span>
              </div>

              <div className="relative">
                <select
                  value={codeLanguage}
                  onChange={(e) => switchLanguage(e.target.value)}
                  disabled={isRunning || isSubmitting}
                  className="lang-select font-mono-studio text-[11px] font-bold tracking-[0.06em] pl-3 pr-8 py-2 rounded-lg border border-[#E8E6E1] dark:border-[#232830] bg-white dark:bg-[#14171C] text-[#3E4650] dark:text-[#C7CBD1] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 transition-colors disabled:opacity-60 cursor-pointer outline-none"
                >
                  {CODE_LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <FaChevronDown size={9} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A929C] dark:text-[#565D68] pointer-events-none" />
              </div>

              <span className="hidden xl:inline font-mono-studio text-[10px] tracking-widest text-[#8A929C]/60 dark:text-[#565D68]">
                AUTOSAVED LOCALLY
              </span>

              <div className="flex items-center gap-2 ml-auto">
                <motion.button
                  onClick={runCode}
                  disabled={isSubmitting || isRunning || !code.trim()}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ y: -1 }}
                  className="h-9 px-5 rounded-lg border-2 border-[#2E8494]/50 dark:border-[#5EC8D8]/50 text-[#2E8494] dark:text-[#5EC8D8] font-mono-studio text-[11px] font-bold tracking-[0.12em] hover:bg-[#2E8494]/8 dark:hover:bg-[#5EC8D8]/8 transition-all duration-200 disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                >
                  <FaPlay size={10} />
                  {isRunning ? "RUNNING" : "RUN"}
                </motion.button>
                <motion.button
                  onClick={submitCode}
                  disabled={isSubmitting || isRunning || !code.trim()}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1 }}
                  className="h-9 px-6 rounded-lg bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-mono-studio text-[11px] font-bold tracking-[0.12em] hover:opacity-90 transition-all duration-200 disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full"
                      />
                      SUBMITTING
                    </>
                  ) : (
                    "SUBMIT"
                  )}
                </motion.button>
              </div>
            </div>

            <div className="h-[58vh] lg:h-auto lg:flex-1 lg:min-h-0 overflow-hidden [&_.cm-editor]:h-full">
              <CodeMirror
                value={code}
                height="100%"
                theme="none"
                extensions={cmExtensions}
                onChange={handleCodeChange}
                readOnly={isSubmitting || isRunning}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: true,
                  highlightActiveLine: true,
                  foldGutter: false,
                  dropCursor: true,
                  allowMultipleSelections: true,
                  indentOnInput: true,
                  syntaxHighlighting: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                  rectangularSelection: true,
                  crosshairCursor: false,
                  highlightSelectionMatches: false,
                  closeBracketsKeymap: true,
                  searchKeymap: true,
                  foldKeymap: false,
                  completionKeymap: true,
                  lintKeymap: false,
                }}
                style={{ fontSize: 14, height: "100%" }}
              />
            </div>

            <div
              onMouseDown={startPanelDrag}
              onDoubleClick={resetPanelHeight}
              title="Drag to resize · double-click to reset"
              className="shrink-0 relative h-3 cursor-row-resize flex items-center justify-center group select-none"
            >
              <div
                className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-px transition-colors ${
                  panelDragging
                    ? "bg-[#C99E41] dark:bg-[#E8A94C]"
                    : "bg-[#E8E6E1] dark:bg-[#232830] group-hover:bg-[#C99E41]/60 dark:group-hover:bg-[#E8A94C]/60"
                }`}
              />
              <div
                className={`relative w-10 h-1 rounded-full transition-colors ${
                  panelDragging
                    ? "bg-[#C99E41] dark:bg-[#E8A94C]"
                    : "bg-[#C9C5BC] dark:bg-[#2E333B] group-hover:bg-[#C99E41] dark:group-hover:bg-[#E8A94C]"
                }`}
              />
            </div>

            <div
              className="shrink-0 border-t border-[#E8E6E1] dark:border-[#232830] bg-[#FAFAF9] dark:bg-[#0A0B0D] flex flex-col min-h-0"
              style={{ height: panelHeight }}
            >
              <div className="flex items-center gap-1 px-3 sm:px-4 pt-2 shrink-0">
                {[
                  { value: "testcase", label: "Testcase" },
                  { value: "result", label: "Test Result" },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setResultTab(t.value)}
                    className={`relative flex items-center gap-2 font-mono-studio text-xs tracking-[0.08em] px-4 py-2.5 transition-colors cursor-pointer ${
                      resultTab === t.value
                        ? "text-[#9A7B24] dark:text-[#E8A94C] font-bold"
                        : "text-[#8A929C] dark:text-[#8B92A0] hover:text-[#3E4650] dark:hover:text-[#C7CBD1]"
                    }`}
                  >
                    {t.label}
                    {t.value === "result" && (runResults || runError || submitResult) && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          runError || (submitResult && submitResult.verdict !== "accepted")
                            ? "bg-[#B3261E] dark:bg-[#F87171]"
                            : "bg-[#2E9C5A] dark:bg-[#4ADE80]"
                        }`}
                      />
                    )}
                    {resultTab === t.value && (
                      <motion.span
                        layoutId="result-tab-underline"
                        className="absolute left-3 right-3 bottom-0 h-0.5 bg-[#C99E41] dark:bg-[#E8A94C] rounded-full"
                      />
                    )}
                  </button>
                ))}
                <div className="ml-auto pr-1">
                  {runResults && !submitResult && (
                    <span
                      className={`font-mono-studio text-[11px] font-bold tracking-[0.12em] ${
                        runPassedCount === runResults.length
                          ? "text-[#2E9C5A] dark:text-[#4ADE80]"
                          : "text-[#B3261E] dark:text-[#F87171]"
                      }`}
                    >
                      {runPassedCount}/{runResults.length} PASSED
                    </span>
                  )}
                </div>
              </div>

              <div className="thin-scroll flex-1 min-h-0 overflow-y-auto border-t border-[#E8E6E1] dark:border-[#232830]">
                {resultTab === "testcase" ? (
                  <div className="p-4">
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      {cases.map((c, i) => {
                        const r = runResults ? runResults[i] : null;
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedCase(i)}
                            className={`flex items-center gap-2 font-mono-studio text-xs px-3.5 py-2 rounded-lg border transition-colors cursor-pointer ${
                              selectedCase === i
                                ? "border-[#9A7B24]/60 dark:border-[#E8A94C]/60 bg-[#C99E41]/10 dark:bg-[#E8A94C]/10 text-[#14171B] dark:text-[#EDEEF0] font-bold"
                                : "border-[#E8E6E1] dark:border-[#232830] bg-white dark:bg-[#14171C] text-[#8A929C] dark:text-[#8B92A0] hover:text-[#3E4650] dark:hover:text-[#C7CBD1]"
                            }`}
                          >
                            {r && (
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  r.passed ? "bg-[#2E9C5A] dark:bg-[#4ADE80]" : "bg-[#B3261E] dark:bg-[#F87171]"
                                }`}
                              />
                            )}
                            Case {i + 1}
                          </button>
                        );
                      })}
                    </div>
                    {cases[selectedCase] && (
                      <CaseDetail
                        ex={cases[selectedCase]}
                        result={runResults ? runResults[selectedCase] : null}
                        io={question?.io}
                        returns={question?.returns}
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    {isRunning && <Spinner label="RUNNING YOUR CODE…" />}
                    {isSubmitting && <Spinner label={`EVALUATING ON ${question?.totalTests || 12} HIDDEN TESTS…`} />}

                    {!isRunning && !isSubmitting && submitResult && (
                      <SubmitVerdictCard
                        submitResult={submitResult}
                        submitMeta={submitMeta}
                        hiddenResults={hiddenResults}
                        animatedScore={animatedSubmitScore}
                        io={question?.io}
                      />
                    )}

                    {!isRunning && !isSubmitting && !submitResult && runError && (
                      <div className="p-4">
                        <h3 className="font-serif-display text-2xl sm:text-3xl tracking-tight text-[#B3261E] dark:text-[#F87171]">
                          {runErrorKind}
                        </h3>
                        <p className="text-sm text-[#5B636E] dark:text-[#8B92A0] mt-1.5">
                          {runErrorKind === "Time Limit Exceeded"
                            ? "Your code took too long on a test case."
                            : runErrorKind === "Execution Error"
                              ? "The code runner hit a problem. Try again in a moment."
                              : "Your code threw an error during execution."}
                        </p>
                        <div className="mt-4 rounded-xl bg-[#14171B] p-4 overflow-x-auto">
                          <pre className="font-mono-studio text-xs leading-relaxed text-[#F0918D] whitespace-pre-wrap wrap-break-word">
                            {runError}
                          </pre>
                        </div>
                      </div>
                    )}

                    {!isRunning && !isSubmitting && !submitResult && !runError && runResults && (
                      <div className="p-4">
                        <h3
                          className={`font-serif-display text-2xl sm:text-3xl tracking-tight ${
                            runPassedCount === runResults.length
                              ? "text-[#2E9C5A] dark:text-[#4ADE80]"
                              : "text-[#B3261E] dark:text-[#F87171]"
                          }`}
                        >
                          {runHeadline}
                        </h3>
                        <p className="text-sm text-[#5B636E] dark:text-[#8B92A0] mt-1.5">
                          {runPassedCount}/{runResults.length} test cases passed
                          {firstRunFail >= 0 && ` · Failed on case ${firstRunFail + 1}`}
                        </p>
                        <div className="mt-4 space-y-2">
                          {runResults.map((r, i) => (
                            <TestResultCard key={i} item={r} index={i} io={question?.io} returns={question?.returns} />
                          ))}
                        </div>
                      </div>
                    )}

                    {!isRunning && !isSubmitting && !submitResult && !runError && !runResults && (
                      <div className="p-8 text-center">
                        <p className="text-sm text-[#8A929C] dark:text-[#8B92A0]">
                          Run your code or submit to see the results here.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestion;
