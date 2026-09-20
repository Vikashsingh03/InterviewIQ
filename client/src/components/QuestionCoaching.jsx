import React, { useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { ServerUrl } from "../App";
import { BsStars, BsChevronDown, BsClipboard, BsCheck2 } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";

// "See a stronger answer" for one question of the report: a sample answer the
// candidate could actually say, what was missing in theirs, and tips for next
// time. Generated on demand (server caches it), so opening a report never
// triggers AI calls by itself.
function QuestionCoaching({ question }) {
  const [coaching, setCoaching] = useState(
    question?.coaching?.idealAnswer ? question.coaching : null,
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // coding answers aren't coached; a question without an id can't be looked up
  if (!question?._id || question.type === "coding") return null;

  const hadAnswer =
    !question.skipped && Boolean(question.answer && question.answer.trim());

  const loadCoaching = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        ServerUrl + `/api/interview/coaching/${question._id}`,
        {},
        { withCredentials: true },
      );
      setCoaching(res.data.coaching);
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message ||
          "Couldn't prepare coaching right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (!coaching && !loading) loadCoaching();
  };

  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(coaching.idealAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked: the text is still selectable on screen
    }
  };

  const hasPlaceholders = coaching?.idealAnswer?.includes("[");

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border border-[#5EC8D8]/40 text-[#2E8494] dark:text-[#5EC8D8] hover:bg-[#5EC8D8]/5 transition cursor-pointer"
      >
        <BsStars size={14} />
        {open
          ? "Hide coaching"
          : coaching
            ? "Show coaching"
            : "See a stronger answer"}
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
                    Preparing your coaching...
                  </p>
                  <div className="h-3 rounded bg-[#5EC8D8]/10 w-full" />
                  <div className="h-3 rounded bg-[#5EC8D8]/10 w-11/12" />
                  <div className="h-3 rounded bg-[#5EC8D8]/10 w-9/12" />
                </div>
              )}

              {!loading && error && (
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
                    onClick={loadCoaching}
                    className="text-xs font-semibold text-red-600 dark:text-red-400 shrink-0 cursor-pointer"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && coaching && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-[#111318] border border-[#5EC8D8]/25 rounded-xl p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <p className="font-mono-studio text-[10px] tracking-wide text-[#2E8494] dark:text-[#5EC8D8] uppercase">
                        A stronger answer
                      </p>
                      <button
                        type="button"
                        onClick={copyAnswer}
                        className="font-mono-studio inline-flex items-center gap-1.5 text-[10px] tracking-wide text-[#8B92A0] hover:text-[#2E8494] dark:hover:text-[#5EC8D8] transition cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <BsCheck2 size={12} /> COPIED
                          </>
                        ) : (
                          <>
                            <BsClipboard size={11} /> COPY
                          </>
                        )}
                      </button>
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

                  <div className="grid md:grid-cols-2 gap-4">
                    {coaching.gaps?.length > 0 && (
                      <div className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-xl p-4">
                        <p className="font-mono-studio text-[10px] tracking-wide text-[#B27E2E] dark:text-[#E8A94C] uppercase mb-2.5">
                          {hadAnswer
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