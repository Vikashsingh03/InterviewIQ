import React, { useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { ServerUrl } from "../App";
import {
  BsStars,
  BsChevronDown,
  BsClipboard,
  BsCheck2,
  BsCheckCircleFill,
  BsExclamationTriangleFill,
  BsInfoCircle,
} from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";

// must match what the backend can run/generate (codeExecution.service.js)
const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

// Was the reference solution actually run against the question's test cases?
function SolutionBadge({ solution }) {
  if (solution.verified === true) {
    return (
      <span className="font-mono-studio inline-flex items-center gap-1.5 text-[10px] tracking-wide px-2.5 py-1 rounded-full bg-[#4ADE80]/10 text-[#2E9C5A] dark:text-[#4ADE80]">
        <BsCheckCircleFill size={10} />
        PASSED {solution.total}/{solution.total} TEST CASES
      </span>
    );
  }
  if (solution.verified === false) {
    return (
      <span
        title="This solution didn't pass every test case when we ran it. Read it as a guide, not the final word."
        className="font-mono-studio inline-flex items-center gap-1.5 text-[10px] tracking-wide px-2.5 py-1 rounded-full bg-[#E8A94C]/10 text-[#B27E2E] dark:text-[#E8A94C]"
      >
        <BsExclamationTriangleFill size={10} />
        PASSED {solution.passed}/{solution.total} · USE AS A GUIDE
      </span>
    );
  }
  return (
    <span
      title="The code runner wasn't reachable, so this solution wasn't tested."
      className="font-mono-studio inline-flex items-center gap-1.5 text-[10px] tracking-wide px-2.5 py-1 rounded-full bg-[#8B92A0]/10 text-[#8B92A0]"
    >
      <BsInfoCircle size={10} />
      NOT AUTO-TESTED
    </span>
  );
}

// "See a stronger answer" for one question of the report.
//  - spoken questions: a sample answer, what was missing, tips
//  - coding questions: how to approach it, complexity, a reference solution in
//    the language you pick (run against the test cases), what was missing, tips
// Generated on demand and cached by the server, so opening a report never
// triggers AI calls by itself.
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
  const [loading, setLoading] = useState(false); // first request
  const [codeLoading, setCodeLoading] = useState(false); // another language
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  // a question without an id can't be looked up on the server
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
      return; // nothing to fetch: already have it
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
      // clipboard blocked: the text is still selectable on screen
    }
  };

  const renderCopyButton = (text, id) => (
    <button
      type="button"
      onClick={() => copy(text, id)}
      className="font-mono-studio inline-flex items-center gap-1.5 text-[10px] tracking-wide text-[#8B92A0] hover:text-[#2E8494] dark:hover:text-[#5EC8D8] transition cursor-pointer"
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

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border border-[#5EC8D8]/40 text-[#2E8494] dark:text-[#5EC8D8] hover:bg-[#5EC8D8]/5 transition cursor-pointer"
      >
        <BsStars size={14} />
        {buttonLabel}
        <BsChevronDown
          size={11}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {loading && (
                <div className="bg-white dark:bg-[#111318] border border-[#5EC8D8]/25 rounded-xl p-4 animate-pulse space-y-2.5">
                  <p className="font-mono-studio text-[10px] tracking-wide text-[#2E8494] dark:text-[#5EC8D8] uppercase">
                    {isCoding
                      ? "Writing and testing a solution... this can take up to 20 seconds"
                      : "Preparing your coaching..."}
                  </p>
                  <div className="h-3 rounded bg-[#5EC8D8]/10 w-full" />
                  <div className="h-3 rounded bg-[#5EC8D8]/10 w-11/12" />
                  <div className="h-3 rounded bg-[#5EC8D8]/10 w-9/12" />
                </div>
              )}

              {!loading && error && !coaching && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-4 flex items-start justify-between gap-3">
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
                    className="text-xs font-semibold text-red-600 dark:text-red-400 shrink-0 cursor-pointer"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading && coaching && (
                <div className="space-y-4">
                  {/* ---- explanation ---- */}
                  <div className="bg-white dark:bg-[#111318] border border-[#5EC8D8]/25 rounded-xl p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
                      <p className="font-mono-studio text-[10px] tracking-wide text-[#2E8494] dark:text-[#5EC8D8] uppercase">
                        {isCoding ? "How to approach it" : "A stronger answer"}
                      </p>
                      <div className="flex items-center gap-3">
                        {isCoding && coaching.complexity && (
                          <span className="font-mono-studio text-[10px] tracking-wide px-2.5 py-1 rounded-full bg-[#5EC8D8]/10 text-[#2E8494] dark:text-[#5EC8D8]">
                            {coaching.complexity}
                          </span>
                        )}
                        {renderCopyButton(coaching.idealAnswer, "answer")}
                      </div>
                    </div>
                    <p className="font-serif-display text-[15px] sm:text-base text-[#1C1F24] dark:text-[#EDEEF0] leading-relaxed">
                      {coaching.idealAnswer}
                    </p>
                    {hasPlaceholders && (
                      <p className="text-xs text-[#8B92A0] mt-3">
                        Replace anything in [brackets] with your own real
                        details.
                      </p>
                    )}
                  </div>

                  {/* ---- reference solution (coding only) ---- */}
                  {isCoding && (
                    <div className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-xl p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                        <p className="font-mono-studio text-[10px] tracking-wide text-[#B27E2E] dark:text-[#E8A94C] uppercase">
                          Reference solution
                        </p>
                        <div className="flex items-center gap-3">
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
                            className={`font-mono-studio text-[11px] tracking-wide px-3 py-1.5 rounded-lg border transition cursor-pointer disabled:opacity-60 disabled:cursor-wait ${
                              activeLang === l.value
                                ? "bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] border-transparent"
                                : "border-[#EAE9E5] dark:border-[#262B34] text-[#5C6472] dark:text-[#8B92A0] hover:bg-[#F5F5F3] dark:hover:bg-[#181B20]"
                            }`}
                          >
                            {l.label}
                          </button>
                        ))}
                      </div>

                      {codeLoading && (
                        <div className="bg-[#0C0E11] border border-[#1E2229] rounded-xl p-4 animate-pulse space-y-2.5">
                          <p className="font-mono-studio text-[10px] tracking-wide text-[#5EC8D8] uppercase">
                            Writing and testing{" "}
                            {LANGUAGES.find((l) => l.value === activeLang)?.label}
                            ...
                          </p>
                          <div className="h-3 rounded bg-white/5 w-10/12" />
                          <div className="h-3 rounded bg-white/5 w-8/12" />
                          <div className="h-3 rounded bg-white/5 w-9/12" />
                        </div>
                      )}

                      {!codeLoading && solution && (
                        <pre className="font-mono-studio bg-[#0C0E11] text-[#D8DCE3] text-xs sm:text-sm p-4 rounded-xl overflow-x-auto border border-[#1E2229]">
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
                            className="text-xs font-semibold text-red-600 dark:text-red-400 shrink-0 cursor-pointer"
                          >
                            Try again
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ---- gaps + tips ---- */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {coaching.gaps?.length > 0 && (
                      <div className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-xl p-4">
                        <p className="font-mono-studio text-[10px] tracking-wide text-[#B27E2E] dark:text-[#E8A94C] uppercase mb-2.5">
                          {isCoding
                            ? hadSubmission
                              ? "What was missing in your code"
                              : "What a good solution needs"
                            : hadSubmission
                              ? "What was missing"
                              : "What a good answer covers"}
                        </p>
                        <ul className="space-y-2">
                          {coaching.gaps.map((gap, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-sm text-[#3D4148] dark:text-[#C7CBD1] leading-relaxed"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A94C] mt-2 shrink-0" />
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {coaching.tips?.length > 0 && (
                      <div className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-xl p-4">
                        <p className="font-mono-studio text-[10px] tracking-wide text-[#2E8494] dark:text-[#5EC8D8] uppercase mb-2.5">
                          Try this next time
                        </p>
                        <ul className="space-y-2">
                          {coaching.tips.map((tip, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-sm text-[#3D4148] dark:text-[#C7CBD1] leading-relaxed"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#5EC8D8] mt-2 shrink-0" />
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