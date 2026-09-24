import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import {
  IoClose,
  IoSendSharp,
  IoTrashOutline,
  IoCopyOutline,
  IoCheckmark,
  IoWarningOutline,
} from "react-icons/io5";

const MAX_MESSAGE_LENGTH = 2000;

const SUGGESTIONS = [
  "What was my weakest answer, and why?",
  "Give me a stronger sample answer",
  "Quiz me with a follow-up question",
  "How can I sound more confident?",
];

const INLINE_SOURCE = "(`[^`\\n]+`)|(\\*\\*[^\\n]+?\\*\\*)|(\\*[^*\\s][^*\\n]*?\\*)";

const renderInline = (text, keyPrefix = "i") => {
  const nodes = [];
  const tokenRegex = new RegExp(INLINE_SOURCE, "g");
  let last = 0;
  let match;
  let n = 0;

  const pushPlain = (chunk) => {
    const clean = chunk.replace(/\*\*/g, "");
    if (clean) nodes.push(clean);
  };

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > last) pushPlain(text.slice(last, match.index));
    const key = `${keyPrefix}-${n++}`;
    if (match[1]) {
      nodes.push(
        <code
          key={key}
          className="font-mono-studio text-[12px] px-1.5 py-0.5 rounded-md bg-[#E8A94C]/12 text-[#8A6A2F] dark:text-[#E8B96A]"
        >
          {match[1].slice(1, -1)}
        </code>,
      );
    } else if (match[2]) {
      nodes.push(
        <strong
          key={key}
          className="font-semibold text-[#1C1F24] dark:text-white"
        >
          {renderInline(match[2].slice(2, -2), key)}
        </strong>,
      );
    } else {
      nodes.push(
        <em key={key} className="italic">
          {renderInline(match[3].slice(1, -1), key)}
        </em>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) pushPlain(text.slice(last));
  return nodes;
};

const parseBlocks = (text) => {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "p", lines: paragraph });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(/^\s{0,3}#{1,6}\s+(.*)$/);
    const bullet = line.match(/^\s*[-*\u2022]\s+(.*)$/);
    const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)$/);

    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h", text: heading[1] });
    } else if (bullet) {
      flushParagraph();
      if (!list || list.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(bullet[1]);
    } else if (numbered) {
      flushParagraph();
      if (!list || list.type !== "ol") {
        flushList();
        list = { type: "ol", items: [], start: Number(numbered[1]) };
      }
      list.items.push(numbered[2]);
    } else if (list && /^\s{2,}\S/.test(raw)) {
      list.items[list.items.length - 1] += " " + line.trim();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
};

export function CoachMarkdown({ text }) {
  const blocks = parseBlocks(text);
  return (
    <div className="space-y-2.5">
      {blocks.map((block, i) => {
        if (block.type === "h") {
          return (
            <p
              key={i}
              className="font-serif-display text-[15px] text-[#1C1F24] dark:text-white"
            >
              {renderInline(block.text, `h${i}`)}
            </p>
          );
        }
        if (block.type === "ul" || block.type === "ol") {
          const List = block.type === "ul" ? "ul" : "ol";
          return (
            <List
              key={i}
              start={block.type === "ol" ? block.start : undefined}
              className={`space-y-1.5 pl-5 marker:text-[#E8A94C] marker:font-semibold ${
                block.type === "ul" ? "list-disc" : "list-decimal"
              }`}
            >
              {block.items.map((item, j) => (
                <li key={j} className="pl-1">
                  {renderInline(item, `l${i}-${j}`)}
                </li>
              ))}
            </List>
          );
        }
        return (
          <p key={i}>
            {block.lines.map((line, j) => (
              <React.Fragment key={j}>
                {j > 0 && <br />}
                {renderInline(line, `p${i}-${j}`)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

const formatTime = (value) => {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function CoachAvatar({ size = 28 }) {
  const d = Math.round(size * 0.34);
  return (
    <div
      style={{ width: size, height: size }}
      className="shrink-0 rounded-xl bg-[#1C1F24] dark:bg-[#EDEEF0] flex items-center justify-center"
    >
      <span className="rotate-45 bg-[#E8A94C] block" style={{ width: d, height: d }} />
    </div>
  );
}

function CoachChat({ interviewId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const loadChat = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await axios.get(
        ServerUrl + `/api/interview/coach/${interviewId}`,
        { withCredentials: true },
      );
      setMessages(res.data.messages || []);
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Couldn't load the AI Coach right now.",
      );
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    if (interviewId) loadChat();
  }, [interviewId, loadChat]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending, loading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 128) + "px";
  }, [input]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (confirmClear) setConfirmClear(false);
      else onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmClear, onClose]);

  const send = async (override) => {
    const text = (typeof override === "string" ? override : input).trim();
    if (!text || sending || loading) return;

    setInput("");
    setErrorMessage("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, createdAt: new Date().toISOString() },
    ]);
    setSending(true);

    try {
      const res = await axios.post(
        ServerUrl + `/api/interview/coach/${interviewId}`,
        { message: text },
        { withCredentials: true },
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.reply,
          createdAt: res.data.createdAt || new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
      setErrorMessage(
        error?.response?.data?.message ||
          "Couldn't send that message. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const clearChat = async () => {
    if (clearing) return;
    setClearing(true);
    setErrorMessage("");
    try {
      await axios.delete(ServerUrl + `/api/interview/coach/${interviewId}`, {
        withCredentials: true,
      });
      setConfirmClear(false);
      setMessages([]);
      setInput("");
      await loadChat();
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Couldn't clear the chat. Please try again.",
      );
    } finally {
      setClearing(false);
    }
  };

  const copyMessage = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const showSuggestions =
    !loading &&
    !sending &&
    messages.length === 1 &&
    messages[0]?.role === "assistant";

  const nearLimit = input.length > MAX_MESSAGE_LENGTH - 500;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .coach-root, .coach-root * { font-family: 'Manrope', sans-serif; }
        .coach-root .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .coach-root .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
        @keyframes coachDot { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
        .coach-typing span { animation: coachDot 1.2s infinite; }
        .coach-typing span:nth-child(2) { animation-delay: 0.15s; }
        .coach-typing span:nth-child(3) { animation-delay: 0.3s; }
        .coach-scroll::-webkit-scrollbar { width: 6px; }
        .coach-scroll::-webkit-scrollbar-thumb { background: rgba(139,146,160,0.35); border-radius: 999px; }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-998"
      />

      <motion.div
        role="dialog"
        aria-label="AI Coach"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="coach-root fixed top-0 right-0 h-full w-full sm:w-110 bg-[#F7F6F3] dark:bg-[#0A0B0D] z-999 flex flex-col border-l-2 border-[#E8A94C]/40 overflow-hidden"
      >
        <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-[#EAE9E5] dark:border-[#1E2229] bg-white/80 dark:bg-[#0F1115]/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <CoachAvatar size={40} />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rotate-45 bg-[#4ADE80] border-2 border-white dark:border-[#0F1115]" />
            </div>
            <div>
              <p className="font-serif-display text-xl text-[#1C1F24] dark:text-[#EDEEF0] leading-none tracking-tight">
                AI Coach
              </p>
              <p className="font-mono-studio text-[10px] tracking-[0.14em] text-[#8B92A0] mt-1.5">
                READS YOUR INTERVIEW · READY TO HELP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Clear chat"
              title="Clear chat"
              onClick={() => setConfirmClear((v) => !v)}
              disabled={loading || clearing}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#8B92A0] hover:text-[#F87171] hover:bg-[#F87171]/8 transition disabled:opacity-40 cursor-pointer"
            >
              <IoTrashOutline size={17} />
            </button>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#8B92A0] hover:bg-[#EFEEEA] dark:hover:bg-[#181B20] transition cursor-pointer"
            >
              <IoClose size={19} />
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {confirmClear && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 overflow-hidden shrink-0"
            >
              <div className="mx-4 mt-3 rounded-2xl border border-[#F87171]/30 bg-[#F87171]/8 p-4">
                <p className="text-sm font-semibold text-[#1C1F24] dark:text-[#EDEEF0]">
                  Clear this conversation?
                </p>
                <p className="text-xs text-[#5C6472] dark:text-[#8B92A0] mt-1 leading-relaxed">
                  Only the chat is removed. Your report and scores stay as they
                  are, and the coach will start a fresh conversation.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    disabled={clearing}
                    className="flex-1 text-sm font-semibold py-2 rounded-xl border border-[#EAE9E5] dark:border-[#262B34] text-[#3D4148] dark:text-[#C7CBD1] hover:bg-white dark:hover:bg-[#181B20] transition cursor-pointer disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={clearChat}
                    disabled={clearing}
                    className="flex-1 text-sm font-semibold py-2 rounded-xl bg-[#F87171] hover:bg-[#F05C5C] text-white transition cursor-pointer disabled:opacity-70"
                  >
                    {clearing ? "Clearing..." : "Clear chat"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          className="coach-scroll relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-5"
        >
          {loading ? (
            <div className="space-y-4">
              <div className="flex items-end gap-2.5">
                <CoachAvatar />
                <div className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-2xl rounded-bl-md px-4 py-3.5 w-64 space-y-2 animate-pulse">
                  <div className="h-2.5 rounded bg-[#E8A94C]/20 w-full" />
                  <div className="h-2.5 rounded bg-[#E8A94C]/15 w-10/12" />
                  <div className="h-2.5 rounded bg-[#E8A94C]/10 w-7/12" />
                </div>
              </div>
              <p className="font-mono-studio text-[10px] tracking-wide text-[#8B92A0] pl-10">
                READING YOUR INTERVIEW...
              </p>
            </div>
          ) : (
            <>
              {messages.map((m, i) => {
                const isUser = m.role === "user";
                return (
                  <motion.div
                    key={`${i}-${m.createdAt || ""}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`group flex items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && <CoachAvatar />}

                    <div
                      className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`text-sm leading-relaxed px-4 py-3 ${
                          isUser
                            ? "bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] rounded-2xl rounded-br-md whitespace-pre-wrap wrap-break-word shadow-[0_10px_24px_-14px_rgba(0,0,0,0.5)]"
                            : "bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] text-[#2B2F36] dark:text-[#D8DCE3] rounded-2xl rounded-bl-md shadow-[0_10px_24px_-18px_rgba(0,0,0,0.25)] wrap-break-word"
                        }`}
                      >
                        {isUser ? m.content : <CoachMarkdown text={m.content} />}
                      </div>

                      <div className="flex items-center gap-2 mt-1.5 px-1">
                        <span className="font-mono-studio text-[9px] tracking-wide text-[#9AA1AC] dark:text-[#565D68]">
                          {isUser ? "YOU" : "COACH"}
                          {formatTime(m.createdAt) &&
                            ` · ${formatTime(m.createdAt)}`}
                        </span>
                        {!isUser && (
                          <button
                            type="button"
                            aria-label="Copy message"
                            onClick={() => copyMessage(m.content, i)}
                            className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition text-[#9AA1AC] hover:text-[#B27E2E] dark:hover:text-[#E8A94C] cursor-pointer"
                          >
                            {copiedIndex === i ? (
                              <IoCheckmark size={13} />
                            ) : (
                              <IoCopyOutline size={12} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="pl-10"
                >
                  <p className="font-mono-studio text-[10px] tracking-wide text-[#8B92A0] mb-2.5">
                    TRY ASKING
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="text-xs font-medium text-[#8A6A2F] dark:text-[#E8B96A] bg-[#E8A94C]/8 hover:bg-[#E8A94C]/16 border border-[#E8A94C]/30 rounded-full px-3.5 py-2 transition cursor-pointer text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {sending && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2.5"
                >
                  <CoachAvatar />
                  <div className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-2xl rounded-bl-md px-4 py-3.5 flex items-center gap-3">
                    <div className="coach-typing flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8A94C]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8A94C]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8A94C]" />
                    </div>
                    <span className="font-mono-studio text-[10px] tracking-wide text-[#8B92A0]">
                      COACH IS THINKING
                    </span>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>

        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="relative z-10 mx-4 mb-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 flex items-start justify-between gap-3 shrink-0"
            >
              <div className="flex items-start gap-2">
                <IoWarningOutline
                  size={15}
                  className="text-red-600 dark:text-red-400 mt-0.5 shrink-0"
                />
                <p className="text-red-700 dark:text-red-400 text-xs leading-relaxed">
                  {errorMessage}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage("")}
                className="text-[11px] font-semibold text-red-600 dark:text-red-400 shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 px-4 pt-3 pb-4 border-t border-[#EAE9E5] dark:border-[#1E2229] bg-white/85 dark:bg-[#0F1115]/85 backdrop-blur-xl shrink-0">
          <div className="flex items-end gap-2 bg-[#F7F6F3] dark:bg-[#0C0E11] border border-[#E5E4E0] dark:border-[#1E2229] rounded-2xl pl-4 pr-2 py-2 focus-within:border-[#E8A94C]/60 focus-within:ring-4 focus-within:ring-[#E8A94C]/10 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || clearing}
              placeholder="Ask about a question, or how to improve..."
              className="flex-1 bg-transparent outline-none resize-none text-sm text-[#1C1F24] dark:text-[#EDEEF0] placeholder-[#9AA1AC] dark:placeholder-[#565D68] py-2 max-h-32 leading-relaxed"
            />
            <button
              type="button"
              aria-label="Send message"
              onClick={() => send()}
              disabled={!input.trim() || sending || loading || clearing}
              className="w-10 h-10 shrink-0 rounded-xl bg-[#E8A94C] hover:bg-[#F0B865] text-[#1C1F24] flex items-center justify-center active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <IoSendSharp size={15} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 px-1">
            <p className="font-mono-studio text-[9px] tracking-wide text-[#9AA1AC] dark:text-[#565D68]">
              ENTER TO SEND · SHIFT + ENTER FOR A NEW LINE
            </p>
            {nearLimit && (
              <p className="font-mono-studio text-[9px] tracking-wide text-[#B27E2E] dark:text-[#E8A94C]">
                {input.length}/{MAX_MESSAGE_LENGTH}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default CoachChat;