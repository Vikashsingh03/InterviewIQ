import React, { useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { ServerUrl } from "../App";
import {
  BsChevronDown,
  BsClipboard,
  BsCheck2,
  BsCheckCircleFill,
  BsExclamationTriangleFill,
  BsInfoCircle,
} from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

function SolutionBadge({ solution }) {
  if (solution.verified === true) {
    return (
      <span className="font-mono-studio inline-flex items-center gap-1.5 text-[10px] tracking-widest px-2.5 py-1 rounded-md bg-[#4ADE80]/10 text-[#2E9C5A] dark:text-[#4ADE80] border border-[#2E9C5A]/25 dark:border-[#4ADE80]/25">
        <BsCheckCircleFill size={10} />
        PASSED {solution.total}/{solution.total} TEST CASES
      </span>
    );
  }
  if (solution.verified === false) {
    return (
      <span
        title="This solution didn't pass every test case when we ran it. Read it as a guide, not the final word."
        className="font-mono-studio inline-flex items-center gap-1.5 text-[10px] tracking-widest   px-2.5 py-1 rounded-md bg-[#9A7B24]/10 dark:bg-[#E8A94C]/10 text-[#9A7B24] dark:text-[#E8A94C] border border-[#9A7B24]/25 dark:border-[#E8A94C]/25"
      >
        <BsExclamationTriangleFill size={10} />
        PASSED {solution.passed}/{solution.total} · USE AS A GUIDE
      </span>
    );
  }
  return (
    <span
      title="The code runner wasn't reachable, so this solution wasn't tested."
      className="font-mono-studio inline-flex items-center gap-1.5 text-[10px] tracking-widest px-2.5 py-1 rounded-md bg-[#8A929C]/10 dark:bg-[#8B92A0]/10 text-[#8A929C] dark:text-[#8B92A0] border border-[#8A929C]/20 dark:border-[#8B92A0]/20"
    >
      <BsInfoCircle size={10} />
      NOT AUTO-TESTED
    </span>
  );
}

function SectionLabel({ num, text, accent }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span className={`font-mono-studio text-[10px] font-bold tracking-[0.18em] ${accent}`}>
        {num}
      </span>
      <span className={`font-mono-studio text-[10px] tracking-[0.16em] uppercase ${accent}`}>
        {text}
      </span>
      <span className="flex-1 h-px bg-[#E8E6E1] dark:bg-[#232830]" />
    </div>
  );
}

function QuestionCoaching({ question }) {
  const isCoding = question?.type === "coding";
  const defaultLanguage = LANGUAGES.some((l) => l.value === question?.language)
    ? question.language
    : "javascript";

  const [coaching, setCoaching] = useState(
    question?.coaching?.idealAnswer ? question.coaching : null,
  );
  const [activeLang, setActiveLang] = useState(
    question?.coaching?.solutions?.[0]?.language || defaultLanguage,
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  if (!question?._id) return null;

  const hadSubmission =
    !question.skipped && Boolean(question.answer && question.answer.trim());

  const request = async (language) => {
    const res = await axios.post(
      ServerUrl + `/api/interview/coaching/${question._id}`,
      isCoding ? { language } : {},
      { withCredentials: true },
    );
    return res.data.coaching;
  };

  const errorText = (err) =>
    err?.response?.data?.message ||
    "Couldn't prepare coaching right now. Please try again.";

  const loadFirst = async () => {
    setLoading(true);
    setError("");
    try {
      setCoaching(await request(activeLang));
    } catch (err) {
      console.log(err);
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  };

  const selectLanguage = async (language) => {
    setActiveLang(language);
    setError("");
    if (!coaching || coaching.solutions?.some((s) => s.language === language)) {
      return;
    }
    setCodeLoading(true);
    try {
      setCoaching(await request(language));
    } catch (err) {
      console.log(err);
      setError(errorText(err));
    } finally {
      setCodeLoading(false);
    }
  };

  const handleToggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (!coaching && !loading) loadFirst();
  };

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1600);
    } catch {
    }
  };

  const renderCopyButton = (text, id) => (
    <button
      type="button"
      onClick={() => copy(text, id)}
      className="font-mono-studio inline-flex items-center gap-1.5 text-[10px] tracking-[0.12em] text-[#8A929C] dark:text-[#8B92A0] hover:text-[#9A7B24] dark:hover:text-[#E8A94C] transition cursor-pointer"
    >
      {copied === id ? (
        <>
          <BsCheck2 size={12} /> COPIED
        </>
      ) : (
        <>
          <BsClipboard size={11} /> COPY
        </>
      )}
    </button>
  );

  const solution = coaching?.solutions?.find((s) => s.language === activeLang);
  const hasPlaceholders = !isCoding && coaching?.idealAnswer?.includes("[");

  const buttonLabel = open
    ? "Hide coaching"
    : coaching
      ? "Show coaching"
      : isCoding
        ? "See the solution & approach"
        : "See a stronger answer";

  const gapsLabel = isCoding
    ? hadSubmission
      ? "What was missing in your code"
      : "What a good solution needs"
    : hadSubmission
      ? "What was missing"
      : "What a good answer covers";

  return (
    <div className="mt-4">
      <motion.button
        type="button"
        onClick={handleToggle}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border-2 border-[#14171B] dark:border-[#EDEEF0] font-mono-studio text-[11px] font-bold tracking-[0.14em] uppercase text-[#14171B] dark:text-[#EDEEF0] hover:bg-[#14171B] hover:text-[#FAFAF9] dark:hover:bg-[#EDEEF0] dark:hover:text-[#0A0B0D] transition-colors cursor-pointer"
      >
        <span className="w-2 h-2 rotate-45 bg-[#C99E41] dark:bg-[#E8A94C] shrink-0" />
        {buttonLabel}
        <BsChevronDown
          size={11}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {loading && (
                <div className="bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-2xl p-5 animate-pulse space-y-2.5">
                  <p className="font-mono-studio text-[10px] tracking-[0.16em] text-[#9A7B24] dark:text-[#E8A94C] uppercase">
                    {isCoding
                      ? "Writing and testing a solution... this can take up to 20 seconds"
                      : "Preparing your coaching..."}
                  </p>
                  <div className="h-3 rounded bg-[#C99E41]/10 dark:bg-[#E8A94C]/10 w-full" />
                  <div className="h-3 rounded bg-[#C99E41]/10 dark:bg-[#E8A94C]/10 w-11/12" />
                  <div className="h-3 rounded bg-[#C99E41]/10 dark:bg-[#E8A94C]/10 w-9/12" />
                </div>
              )}

              {!loading && error && !coaching && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <IoWarningOutline
                      size={16}
                      className="text-red-600 dark:text-red-400 mt-0.5 shrink-0"
                    />
                    <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                      {error}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadFirst}
                    className="font-mono-studio text-[10px] tracking-[0.12em] font-semibold text-red-600 dark:text-red-400 shrink-0 cursor-pointer"
                  >
                    TRY AGAIN
                  </button>
                </div>
              )}

              {!loading && coaching && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-[#0C0E11] border-2 border-[#9A7B24]/30 dark:border-[#E8A94C]/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]">
                    <span className="pointer-events-none absolute top-0 left-8 right-8 h-0.5 bg-[#C99E41] dark:bg-[#E8A94C]" />
                    <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                      <div className="flex-1 min-w-40">
                        <SectionLabel
                          num="01"
                          text={isCoding ? "How to approach it" : "A stronger answer"}
                          accent="text-[#9A7B24] dark:text-[#E8A94C]"
                        />
                      </div>
                      <div className="flex items-center gap-3 -mt-3">
                        {isCoding && coaching.complexity && (
                          <span className="font-mono-studio text-[10px] tracking-widest px-2.5 py-1 rounded-md bg-[#2E8494]/10 dark:bg-[#5EC8D8]/10 text-[#2E8494] dark:text-[#5EC8D8] border border-[#2E8494]/25 dark:border-[#5EC8D8]/25">
                            {coaching.complexity}
                          </span>
                        )}
                        {renderCopyButton(coaching.idealAnswer, "answer")}
                      </div>
                    </div>
                    <p className="font-serif-display text-[16px] sm:text-[17px] text-[#14171B] dark:text-[#EDEEF0] leading-relaxed">
                      {coaching.idealAnswer}
                    </p>
                    {hasPlaceholders && (
                      <p className="text-xs text-[#5B636E] dark:text-[#8B92A0] mt-3">
                        Replace anything in [brackets] with your own real
                        details.
                      </p>
                    )}
                  </div>

                  {isCoding && (
                    <div className="bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-2xl p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                        <div className="flex-1 min-w-40">
                          <SectionLabel num="02" text="Reference solution" accent="text-[#9A7B24] dark:text-[#E8A94C]" />
                        </div>
                        <div className="flex items-center gap-3 -mt-3">
                          {solution && !codeLoading && (
                            <SolutionBadge solution={solution} />
                          )}
                          {solution &&
                            !codeLoading &&
                            renderCopyButton(solution.code, "code")}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {LANGUAGES.map((l) => (
                          <button
                            key={l.value}
                            type="button"
                            disabled={codeLoading}
                            onClick={() => selectLanguage(l.value)}
                            className={`font-mono-studio text-[11px] tracking-[0.08em] px-3.5 py-2 rounded-full border transition cursor-pointer disabled:opacity-60 disabled:cursor-wait ${
                              activeLang === l.value
                                ? "bg-[#14171B] dark:bg-[#EDEEF0] text-[#FAFAF9] dark:text-[#0A0B0D] border-transparent font-bold"
                                : "border-[#E8E6E1] dark:border-[#232830] text-[#3E4650] dark:text-[#8B92A0] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50"
                            }`}
                          >
                            {l.label}
                          </button>
                        ))}
                      </div>

                      {codeLoading && (
                        <div className="bg-[#F5F4F1] dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-xl p-4 animate-pulse space-y-2.5">
                          <p className="font-mono-studio text-[10px] tracking-[0.14em] text-[#2E8494] dark:text-[#5EC8D8] uppercase">
                            Writing and testing{" "}
                            {LANGUAGES.find((l) => l.value === activeLang)?.label}
                            ...
                          </p>
                          <div className="h-3 rounded bg-[#14171B]/5 dark:bg-white/5 w-10/12" />
                          <div className="h-3 rounded bg-[#14171B]/5 dark:bg-white/5 w-8/12" />
                          <div className="h-3 rounded bg-[#14171B]/5 dark:bg-white/5 w-9/12" />
                        </div>
                      )}

                      {!codeLoading && solution && (
                        <pre className="font-mono-studio bg-[#F5F4F1] dark:bg-[#0C0E11] text-[#14171B] dark:text-[#D8DCE3] text-xs sm:text-sm p-4 rounded-xl overflow-x-auto border border-[#E8E6E1] dark:border-[#232830]">
                          <code>{solution.code}</code>
                        </pre>
                      )}

                      {!codeLoading && !solution && error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 flex items-start justify-between gap-3">
                          <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                            {error}
                          </p>
                          <button
                            type="button"
                            onClick={() => selectLanguage(activeLang)}
                            className="font-mono-studio text-[10px] tracking-[0.12em] font-semibold text-red-600 dark:text-red-400 shrink-0 cursor-pointer"
                          >
                            TRY AGAIN
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {coaching.gaps?.length > 0 && (
                      <div className="bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-2xl p-4 sm:p-5">
                        <SectionLabel num="03" text={gapsLabel} accent="text-[#9A7B24] dark:text-[#E8A94C]" />
                        <ul className="space-y-2.5">
                          {coaching.gaps.map((gap, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-sm text-[#3E4650] dark:text-[#9AA1AC] leading-relaxed"
                            >
                              <span className="w-1.5 h-1.5 rotate-45 bg-[#C99E41] dark:bg-[#E8A94C] mt-1.5 shrink-0" />
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {coaching.tips?.length > 0 && (
                      <div className="bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] rounded-2xl p-4 sm:p-5">
                        <SectionLabel num={coaching.gaps?.length > 0 ? "04" : "03"} text="Try this next time" accent="text-[#2E8494] dark:text-[#5EC8D8]" />
                        <ul className="space-y-2.5">
                          {coaching.tips.map((tip, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-sm text-[#3E4650] dark:text-[#9AA1AC] leading-relaxed"
                            >
                              <span className="w-1.5 h-1.5 rotate-45 bg-[#2E8494] dark:bg-[#5EC8D8] mt-1.5 shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default QuestionCoaching;
