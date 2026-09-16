import React, { useEffect, useRef, useState } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import { motion, AnimatePresence } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from "../App";
import {
  BsStars,
  BsSpeedometer2,
  BsSkipForward,
  BsCode,
  BsPlayFill,
  BsCheckCircleFill,
  BsXCircleFill,
  BsChevronDown,
} from "react-icons/bs";
import { IoWarningOutline, IoSparklesSharp } from "react-icons/io5";
import Editor from "@monaco-editor/react";

// must exactly match what the backend (codeExecution.service.js +
// dsaQuestions.js starterCode) actually supports — adding a language here
// without backend support will silently fail on submit
const CODE_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, userName } = interviewData;

  const [questions, setQuestions] = useState(interviewData.questions || []);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const [micError, setMicError] = useState("");
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const [lastDeliveryMetrics, setLastDeliveryMetrics] = useState(null);
  const [codeLanguage, setCodeLanguage] = useState("javascript");

  // ---- coding-round-specific state ----
  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState(null); // sample test run (Run button)
  const [submitTestResults, setSubmitTestResults] = useState(null); // full grading result

  const [errorMessage, setErrorMessage] = useState("");

  const videoRef = useRef(null);
  const answerWindowStartRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const isCodingQuestion = currentQuestion?.type === "coding";

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female"),
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male"),
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text.replace(/,/g, ", ...").replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;

      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) {
      return;
    }
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you'are feeling confident and ready`,
        );

        await speakText(
          `I'll ask you a few questions. Just answer naturally, and take your time. Let us begin.`,
        );
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        if (isLastQuestion) {
          await speakText("Alright, this might be a bit challenging");
        }
        await speakText(currentQuestion.question);

        // candidate's answer window starts NOW
        answerWindowStartRef.current = Date.now();

        if (isMicOn && currentQuestion.type !== "coding") {
          startMic();
        }
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (isSubmitting) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, isSubmitting]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);

  // seed the editor with the question's OWN starter code (stdin parsing
  // boilerplate matched to its test cases) — never a generic snippet
  useEffect(() => {
    if (isCodingQuestion && currentQuestion?.starterCode) {
      const langToUse = currentQuestion.starterCode[codeLanguage]
        ? codeLanguage
        : "javascript";
      setCodeLanguage(langToUse);
      setAnswer(currentQuestion.starterCode[langToUse] || "");
    }
    setRunResults(null);
    setSubmitTestResults(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isCodingQuestion]);

  // switching language mid-question swaps in that language's starter code
  // — only if the candidate hasn't diverged from a starter snippet yet
  const handleLanguageChange = (newLang) => {
    if (!currentQuestion?.starterCode) return;

    const currentStarters = Object.values(currentQuestion.starterCode);
    const isStillStarter = currentStarters.includes(answer);

    setCodeLanguage(newLang);
    if (isStillStarter) {
      setAnswer(currentQuestion.starterCode[newLang] || "");
    }
    setRunResults(null);
  };

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setMicError(
        "Voice input isn't supported in this browser. Please type your answers.",
      );
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };

    recognition.onerror = (event) => {
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setMicError(
          "Mic access was denied. Please type your answer, or enable mic permission in your browser settings.",
        );
        setIsMicOn(false);
      } else if (event.error === "no-speech") {
        // benign
      } else {
        setMicError(
          "Mic isn't working right now. You can type your answer instead.",
        );
        setIsMicOn(false);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
        setMicError("");
      } catch {
        // already running — safe to ignore
      }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };

  const finishInterview = async () => {
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/finish",
        { interviewId },
        { withCredentials: true },
      );

      onFinish(result.data);
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Couldn't finish the interview. Please try again.",
      );
    }
  };

  // ---- "Run" button: check code against sample test cases only ----
  const runCode = async () => {
    if (isRunning || isSubmitting) return;
    if (!isCodingQuestion) return;

    setIsRunning(true);
    setErrorMessage("");
    setRunResults(null);

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/run-code",
        {
          interviewId,
          questionIndex: currentIndex,
          code: answer,
          language: codeLanguage,
        },
        { withCredentials: true },
      );

      setRunResults(result.data.results || []);
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

  // ---- core flow: submit -> evaluate -> speak feedback -> auto-advance ----
  const submitAnswer = async () => {
    if (isSubmitting) return;
    if (!currentQuestion) return;
    if (isIntroPhase || isAIPlaying) return;

    stopMic();
    setIsSubmitting(true);
    setErrorMessage("");
    setFeedback("");

    const durationSeconds = answerWindowStartRef.current
      ? Math.max(
          1,
          Math.round((Date.now() - answerWindowStartRef.current) / 1000),
        )
      : currentQuestion.timeLimit - timeLeft;

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
          durationSeconds,
          ...(isCodingQuestion ? { language: codeLanguage } : {}),
        },
        { withCredentials: true },
      );

      const {
        feedback: fb,
        isLast,
        nextQuestion,
        speakingMetrics,
        testResults,
        testsPassedCount,
        testsTotalCount,
      } = result.data;

      if (isCodingQuestion) {
        setSubmitTestResults({
          results: testResults || [],
          passed: testsPassedCount ?? 0,
          total: testsTotalCount ?? 0,
        });
      }

      if (!isLast && nextQuestion) {
        setQuestions((prev) => [...prev, nextQuestion]);
      }
      setIsLastQuestion(!!isLast);
      setLastDeliveryMetrics(speakingMetrics || null);
      setFeedback(fb);

      // speak the feedback addressed to the candidate, then auto-advance —
      // no manual "Next Question" click needed
      await speakText(`Thank you ${userName}. ${fb}`);

      if (isLast) {
        await finishInterview();
        return;
      }

      setAnswer("");
      setFeedback("");
      setSubmitTestResults(null);
      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Something went wrong while submitting your answer. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- skip: move to next question without answering the current one ----
  const skipQuestion = async () => {
    if (isSubmitting) return;
    if (!currentQuestion) return;
    if (isIntroPhase || isAIPlaying) return;

    stopMic();
    setIsSubmitting(true);
    setErrorMessage("");
    setFeedback("");

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer: "",
          timeTaken: 0,
          skipped: true,
        },
        { withCredentials: true },
      );

      const { feedback: fb, isLast, nextQuestion } = result.data;

      if (!isLast && nextQuestion) {
        setQuestions((prev) => [...prev, nextQuestion]);
      }
      setIsLastQuestion(!!isLast);
      setLastDeliveryMetrics(null);
      setFeedback(fb || "No problem, let's move on.");

      await speakText(fb || "No problem, let's move on to the next question.");

      if (isLast) {
        await finishInterview();
        return;
      }

      setAnswer("");
      setFeedback("");
      setSubmitTestResults(null);
      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Couldn't skip this question. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const deliveryLabel = (score) => {
    if (score >= 8) return "Excellent delivery";
    if (score >= 6) return "Good delivery";
    if (score >= 4) return "Needs polish";
    return "Work on pacing & fillers";
  };

  const controlsDisabled = isSubmitting || isIntroPhase || isAIPlaying;

  return (
    <div className="min-h-screen relative bg-[#F7F6F3] dark:bg-[#0A0B0D] flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .studio-root, .studio-root * { font-family: 'Manrope', sans-serif; }
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }

        .film-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.035;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .viewfinder-corner { position: absolute; width: 20px; height: 20px; z-index: 2; }
        .viewfinder-corner::before, .viewfinder-corner::after { content: ''; position: absolute; background: #E8A94C; box-shadow: 0 0 6px rgba(232,169,76,0.6); }
        .corner-tl { top: 10px; left: 10px; }
        .corner-tl::before { width: 2px; height: 100%; top: 0; left: 0; }
        .corner-tl::after { height: 2px; width: 100%; top: 0; left: 0; }
        .corner-tr { top: 10px; right: 10px; }
        .corner-tr::before { width: 2px; height: 100%; top: 0; right: 0; }
        .corner-tr::after { height: 2px; width: 100%; top: 0; right: 0; }
        .corner-bl { bottom: 10px; left: 10px; }
        .corner-bl::before { width: 2px; height: 100%; bottom: 0; left: 0; }
        .corner-bl::after { height: 2px; width: 100%; bottom: 0; left: 0; }
        .corner-br { bottom: 10px; right: 10px; }
        .corner-br::before { width: 2px; height: 100%; bottom: 0; right: 0; }
        .corner-br::after { height: 2px; width: 100%; bottom: 0; right: 0; }

        @keyframes livePulse { 0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(232,169,76,0.5); } 50% { opacity: 0.55; box-shadow: 0 0 0 4px rgba(232,169,76,0); } }
        .live-dot { animation: livePulse 1.8s ease-in-out infinite; }

        .studio-select {
          -webkit-appearance: none;
          appearance: none;
        }

        .lang-select-wrap:hover .lang-caret { color: #E8A94C; }
      `}</style>

      <div className="film-grain" />

      <div className="studio-root w-full max-w-350 min-h-[80vh] bg-white dark:bg-[#0F1115] rounded-[28px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] border border-[#EAE9E5] dark:border-[#1E2229] flex flex-col lg:flex-row overflow-hidden relative">
        {/* ============ LEFT: broadcast monitor panel ============ */}
        <div className="w-full lg:w-[36%] bg-[#0C0E11] flex flex-col p-6 sm:p-7 space-y-5 border-r border-[#1E2229] relative">
          {/* status strip */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full bg-[#E8A94C] ${isAIPlaying ? "live-dot" : ""}`}
              />
              <span className="font-mono-studio text-[11px] tracking-[0.08em] text-[#E8A94C]">
                {isAIPlaying ? "ON AIR" : "STANDBY"}
              </span>
            </div>
            <span className="font-mono-studio text-[11px] text-[#565D68]">
              CAM 01 · {voiceGender === "male" ? "M" : "F"}
            </span>
          </div>

          {/* viewfinder-framed video */}
          <div className="relative rounded-2xl overflow-hidden bg-black ring-1 ring-black/40">
            <div className="viewfinder-corner corner-tl" />
            <div className="viewfinder-corner corner-tr" />
            <div className="viewfinder-corner corner-bl" />
            <div className="viewfinder-corner corner-br" />
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          <AnimatePresence mode="wait">
            {subtitle && (
              <motion.div
                key={subtitle}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="bg-[#15181D] border border-[#232830] rounded-xl px-4 py-3"
              >
                <p className="text-[#D8DCE3] text-sm leading-relaxed">
                  {subtitle}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {micError && !isCodingQuestion && (
            <div className="bg-[#211A0F] border border-[#493318] rounded-xl p-3 flex items-start gap-2">
              <IoWarningOutline
                size={16}
                className="text-[#E8A94C] mt-0.5 shrink-0"
              />
              <p className="text-[#E8B96A] text-xs leading-relaxed">
                {micError}
              </p>
            </div>
          )}

          {/* countdown / status readout */}
          <div className="bg-[#131519] border border-[#232830] rounded-2xl p-5 space-y-4">
            <div className="flex justify-center">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit}
              />
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-[#232830] to-transparent" />

            <div className="text-center">
              <p className="font-serif-display text-4xl text-[#EDEEF0] tracking-tight">
                {String(currentIndex + 1).padStart(2, "0")}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-[11px] text-[#565D68]">
                <BsStars size={11} className="text-[#5EC8D8]" />
                <span>AI adapts questions based on your answers</span>
              </div>
            </div>

            <AnimatePresence>
              {lastDeliveryMetrics && !isCodingQuestion && (
                <>
                  <div className="h-px bg-linear-to-r from-transparent via-[#232830] to-transparent" />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-[#5EC8D8]/6 border border-[#5EC8D8]/25 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <BsSpeedometer2 className="text-[#5EC8D8]" size={13} />
                      <span className="font-mono-studio text-[11px] tracking-wide text-[#5EC8D8]">
                        {deliveryLabel(lastDeliveryMetrics.deliveryScore)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="font-mono-studio text-lg text-[#EDEEF0]">
                          {lastDeliveryMetrics.wordsPerMinute}
                        </p>
                        <p className="text-[10px] text-[#565D68]">words/min</p>
                      </div>
                      <div>
                        <p className="font-mono-studio text-lg text-[#EDEEF0]">
                          {lastDeliveryMetrics.fillerWordCount}
                        </p>
                        <p className="text-[10px] text-[#565D68]">
                          filler words
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {isCodingQuestion && submitTestResults && (
              <>
                <div className="h-px bg-linear-to-r from-transparent via-[#232830] to-transparent" />
                <div className="bg-[#5EC8D8]/6 border border-[#5EC8D8]/25 rounded-xl p-4 text-center">
                  <p className="font-mono-studio text-2xl text-[#5EC8D8]">
                    {submitTestResults.passed}/{submitTestResults.total}
                  </p>
                  <p className="text-[10px] text-[#565D68] mt-1">
                    test cases passed
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ============ RIGHT: the desk ============ */}
        <div className="flex-1 flex flex-col p-5 sm:p-8 md:p-10 relative bg-[#F7F6F3] dark:bg-[#0F1115]">
          <div className="flex items-baseline justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <IoSparklesSharp className="text-[#E8A94C]" size={18} />
              <h2 className="font-serif-display text-2xl sm:text-3xl text-[#1C1F24] dark:text-[#EDEEF0] tracking-tight">
                AI Smart Interview
              </h2>
            </div>
            <span className="font-mono-studio text-xs text-[#8B92A0] tracking-wide">
              {String(currentIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
            </span>
          </div>

          {errorMessage && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <IoWarningOutline
                  size={16}
                  className="text-red-600 dark:text-red-400 mt-0.5 shrink-0"
                />
                <p className="text-red-700 dark:text-red-400 text-xs sm:text-sm leading-relaxed">
                  {errorMessage}
                </p>
              </div>
              <button
                onClick={() => setErrorMessage("")}
                className="text-red-500 dark:text-red-400 text-xs font-semibold shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!isIntroPhase && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="mb-3 pb-6 border-b border-[#E5E4E0] dark:border-[#1E2229]"
              >
                <div className="flex items-center gap-2 mb-3">
                  {currentQuestion?.difficulty && (
                    <span className="font-mono-studio px-2 py-0.5 rounded-md bg-[#EFEEEA] dark:bg-[#181B20] text-[#6B7280] dark:text-[#8B92A0] text-[10px] tracking-wide">
                      {currentQuestion.difficulty}
                    </span>
                  )}
                  {isCodingQuestion && (
                    <span className="font-mono-studio inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#5EC8D8]/10 text-[#2E8494] dark:text-[#5EC8D8] text-[10px] tracking-wide">
                      <BsCode size={10} /> Coding Round
                    </span>
                  )}
                </div>
                <div className="font-serif-display text-xl sm:text-2xl text-[#1C1F24] dark:text-[#EDEEF0] leading-snug tracking-tight">
                  {currentQuestion?.question}
                </div>

                {isCodingQuestion && currentQuestion?.description && (
                  <div className="mt-5 space-y-3">
                    <p className="text-sm text-[#5C6472] dark:text-[#9AA1AC] whitespace-pre-line leading-relaxed">
                      {currentQuestion.description}
                    </p>

                    {currentQuestion.sampleTestCases?.length > 0 && (
                      <div className="space-y-2">
                        {currentQuestion.sampleTestCases.map((tc, i) => (
                          <div
                            key={i}
                            className="bg-[#EFEEEA] dark:bg-[#0A0B0D] border border-[#E2E1DC] dark:border-[#1E2229] rounded-lg p-3 font-mono-studio text-xs"
                          >
                            <p className="text-[#9AA1AC] mb-1">
                              Example {i + 1}
                            </p>
                            <p className="text-[#3D4148] dark:text-[#C7CBD1]">
                              Input:{" "}
                              <span className="whitespace-pre-wrap">
                                {tc.input}
                              </span>
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
              </motion.div>
            )}
          </AnimatePresence>

          {isCodingQuestion ? (
            <div className="flex flex-col rounded-2xl border border-[#1E2229] overflow-hidden mt-3 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.25)]">
              <div className="flex items-center justify-between bg-[#0C0E11] px-4 py-2.5">
                <span className="font-mono-studio text-[11px] text-[#8B92A0] tracking-wide">
                  Code Editor
                </span>
                <div className="lang-select-wrap relative">
                  <select
                    value={codeLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    disabled={controlsDisabled}
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
                    className="lang-caret absolute right-2.5 top-1/2 -translate-y-1/2 text-[#565D68] pointer-events-none transition-colors"
                  />
                </div>
              </div>

              <div style={{ height: "380px" }}>
                <Editor
                  height="380px"
                  language={codeLanguage === "cpp" ? "cpp" : codeLanguage}
                  value={answer}
                  onChange={(value) => setAnswer(value ?? "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', monospace",
                    minimap: { enabled: false },
                    readOnly: controlsDisabled,
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
                  )}
                </div>
              )}
            </div>
          ) : (
            <textarea
              placeholder="Type your answer here..."
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              disabled={controlsDisabled}
              className="flex-1 mt-3 bg-white dark:bg-[#0C0E11] rounded-2xl p-5 sm:p-6 border border-[#E5E4E0] dark:border-[#1E2229] text-[#1C1F24] dark:text-[#EDEEF0] placeholder-[#9AA1AC] dark:placeholder-[#565D68] text-base leading-relaxed resize-none outline-none focus:border-[#E8A94C]/50 focus:ring-4 focus:ring-[#E8A94C]/10 transition-all duration-200 disabled:opacity-60"
            />
          )}

          {!feedback ? (
            <div className="flex items-center gap-3 mt-6">
              {!isCodingQuestion && (
                <motion.button
                  onClick={toggleMic}
                  whileTap={{ scale: 0.92 }}
                  disabled={controlsDisabled}
                  className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center rounded-full shadow-lg disabled:opacity-60 transition-all duration-200 ${
                    isMicOn
                      ? "bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D]"
                      : "bg-[#EFEEEA] dark:bg-[#181B20] text-[#8B92A0] border border-[#E5E4E0] dark:border-[#262B34]"
                  }`}
                >
                  {isMicOn ? (
                    <FaMicrophone size={19} />
                  ) : (
                    <FaMicrophoneSlash size={19} />
                  )}
                </motion.button>
              )}

              {isCodingQuestion && (
                <motion.button
                  onClick={runCode}
                  disabled={controlsDisabled || isRunning}
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
                onClick={submitAnswer}
                disabled={controlsDisabled}
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -1 }}
                className="flex-1 bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] font-semibold py-3 sm:py-4 rounded-2xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] hover:shadow-[0_14px_36px_-8px_rgba(0,0,0,0.4)] transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
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
                    {isCodingQuestion
                      ? "Running tests & reviewing..."
                      : "AI is evaluating your answer..."}
                  </>
                ) : isCodingQuestion ? (
                  "Submit Code"
                ) : (
                  "Submit Answer"
                )}
              </motion.button>

              <motion.button
                onClick={skipQuestion}
                disabled={controlsDisabled}
                whileTap={{ scale: 0.92 }}
                whileHover={{ y: -1 }}
                className="shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-[#E5E4E0] dark:border-[#262B34] text-[#5C6472] dark:text-[#8B92A0] font-medium hover:bg-white dark:hover:bg-[#181B20] transition-all duration-200 disabled:opacity-60"
              >
                <BsSkipForward size={16} />
                <span className="hidden sm:inline">Skip</span>
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-white dark:bg-[#131519] border border-[#E8A94C]/30 p-5 rounded-2xl shadow-[0_12px_30px_-16px_rgba(232,169,76,0.3)]"
            >
              <p className="text-[#1C1F24] dark:text-[#EDEEF0] font-medium mb-4 leading-relaxed">
                {feedback}
              </p>

              <div className="flex items-center gap-2 font-mono-studio text-[#B27E2E] dark:text-[#E8A94C] text-xs tracking-wide">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-3.5 h-3.5 border-2 border-[#E8A94C]/30 border-t-[#E8A94C] rounded-full"
                />
                {isLastQuestion
                  ? "Wrapping up your report..."
                  : "Moving to the next question..."}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;