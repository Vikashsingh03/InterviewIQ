import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import { IoClose, IoSparklesSharp, IoSendSharp } from "react-icons/io5";
import { BsRobot } from "react-icons/bs";

function CoachChat({ interviewId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const scrollRef = useRef(null);

  useEffect(() => {
    const load = async () => {
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
    };
    if (interviewId) load();
  }, [interviewId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setErrorMessage("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setSending(true);

    try {
      const res = await axios.post(
        ServerUrl + `/api/interview/coach/${interviewId}`,
        { message: text },
        { withCredentials: true },
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Couldn't send that message. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .coach-root, .coach-root * { font-family: 'Manrope', sans-serif; }
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
        @keyframes coachDot { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-2px); } }
        .coach-typing span { animation: coachDot 1.2s infinite; }
        .coach-typing span:nth-child(2) { animation-delay: 0.15s; }
        .coach-typing span:nth-child(3) { animation-delay: 0.3s; }
      `}</style>

      {/* backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-998"
      />

      {/* slide-in panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="coach-root fixed top-0 right-0 h-full w-full sm:w-105 bg-[#F7F6F3] dark:bg-[#0A0B0D] z-999 shadow-[-20px_0_60px_-20px_rgba(0,0,0,0.3)] flex flex-col border-l border-[#EAE9E5] dark:border-[#1E2229]"
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAE9E5] dark:border-[#1E2229] bg-white dark:bg-[#0F1115] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8A94C]/12 flex items-center justify-center">
              <BsRobot className="text-[#B27E2E] dark:text-[#E8A94C]" size={16} />
            </div>
            <div>
              <p className="font-serif-display text-lg text-[#1C1F24] dark:text-[#EDEEF0] leading-none">
                AI Coach
              </p>
              <p className="font-mono-studio text-[10px] text-[#8B92A0] mt-0.5">
                Talk through your interview
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#8B92A0] hover:bg-[#EFEEEA] dark:hover:bg-[#181B20] transition"
          >
            <IoClose size={18} />
          </button>
        </div>

        {/* messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-[#E8A94C]/30 border-t-[#E8A94C] rounded-full"
              />
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] rounded-br-sm"
                        : "bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] text-[#1C1F24] dark:text-[#EDEEF0] rounded-bl-sm"
                    }`}
                  >
                    {m.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <IoSparklesSharp size={11} className="text-[#E8A94C]" />
                        <span className="font-mono-studio text-[9px] tracking-wide text-[#B27E2E] dark:text-[#E8A94C]">
                          COACH
                        </span>
                      </div>
                    )}
                    {m.content}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#111318] border border-[#EAE9E5] dark:border-[#1E2229] rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="coach-typing flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9AA1AC]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9AA1AC]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9AA1AC]" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {errorMessage && (
          <div className="mx-4 mb-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-2.5 text-red-700 dark:text-red-400 text-xs">
            {errorMessage}
          </div>
        )}

        {/* composer */}
        <div className="p-3.5 border-t border-[#EAE9E5] dark:border-[#1E2229] bg-white dark:bg-[#0F1115] shrink-0">
          <div className="flex items-end gap-2 bg-[#F7F6F3] dark:bg-[#0C0E11] border border-[#E5E4E0] dark:border-[#1E2229] rounded-2xl px-3 py-2 focus-within:border-[#E8A94C]/50 focus-within:ring-4 focus-within:ring-[#E8A94C]/10 transition-all">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask about a question, or how to improve..."
              className="flex-1 bg-transparent outline-none resize-none text-sm text-[#1C1F24] dark:text-[#EDEEF0] placeholder-[#9AA1AC] dark:placeholder-[#565D68] py-1.5 max-h-24"
            />
            <button
              onClick={send}
              disabled={!input.trim() || sending || loading}
              className="w-8 h-8 shrink-0 rounded-full bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] flex items-center justify-center disabled:opacity-40 transition"
            >
              <IoSendSharp size={13} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default CoachChat;