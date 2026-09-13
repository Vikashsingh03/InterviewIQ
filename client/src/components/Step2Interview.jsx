import React, { useEffect, useRef, useState } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import { motion, AnimatePresence } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from "../App";
import { BsStars, BsSpeedometer2, BsSkipForward } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";

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

  const [errorMessage, setErrorMessage] = useState("");

  const videoRef = useRef(null);
  const answerWindowStartRef = useRef(null);

  const currentQuestion = questions[currentIndex];

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

        if (isMicOn) {
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
        },
        { withCredentials: true },
      );

      const {
        feedback: fb,
        isLast,
        nextQuestion,
        speakingMetrics,
      } = result.data;

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
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950 flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <div className="w-full max-w-350 min-h-[80vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl dark:shadow-black/40 border border-gray-200 dark:border-gray-800 flex flex-col lg:flex-row overflow-hidden">
        {/* video section */}
        <div className="w-full lg:w-[35%] bg-white dark:bg-gray-900 flex flex-col items-center p-6 space-y-6 border-r border-gray-200 dark:border-gray-800">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
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

          {subtitle && (
            <div className="w-full max-w-md bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
              <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base font-medium text-center leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          {micError && (
            <div className="w-full max-w-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-3 shadow-sm flex items-start gap-2">
              <IoWarningOutline
                size={16}
                className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0"
              />
              <p className="text-amber-700 dark:text-amber-400 text-xs sm:text-sm leading-relaxed">
                {micError}
              </p>
            </div>
          )}

          <div className="w-full max-w-md bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Interview Status
              </span>
              {isAIPlaying && (
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  AI Speaking
                </span>
              )}
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

            <div className="flex justify-center items-center">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit}
              />
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

            <div className="text-center">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                Question {currentIndex + 1}
              </span>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-gray-400 dark:text-gray-500">
                <BsStars
                  size={12}
                  className="text-emerald-500 dark:text-emerald-400"
                />
                <span>AI adapts questions based on your answers</span>
              </div>
            </div>

            <AnimatePresence>
              {lastDeliveryMetrics && (
                <>
                  <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <BsSpeedometer2
                        className="text-emerald-600 dark:text-emerald-400"
                        size={14}
                      />
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {deliveryLabel(lastDeliveryMetrics.deliveryScore)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                          {lastDeliveryMetrics.wordsPerMinute}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          words/min
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                          {lastDeliveryMetrics.fillerWordCount}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          filler words
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* text section */}

        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-6">
            AI Smart Interview
          </h2>

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

          {!isIntroPhase && (
            <div className="relative mb-2 bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-2">
                Question {currentIndex + 1}
                {currentQuestion?.difficulty && (
                  <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold uppercase tracking-wide">
                    {currentQuestion.difficulty}
                  </span>
                )}
              </p>
              <div className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
                {currentQuestion?.question}
              </div>
            </div>
          )}

          <textarea
            placeholder="Type your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            disabled={controlsDisabled}
            className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base sm:text-lg resize-none outline-none focus:ring-2 focus:ring-emerald-500 transition disabled:opacity-60"
          />

          {!feedback ? (
            <div className="flex items-center gap-3 mt-6">
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                disabled={controlsDisabled}
                className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg disabled:opacity-60"
              >
                {isMicOn ? (
                  <FaMicrophone size={20} />
                ) : (
                  <FaMicrophoneSlash size={20} />
                )}
              </motion.button>

              <motion.button
                onClick={submitAnswer}
                disabled={controlsDisabled}
                whileTap={{ scale: 0.9 }}
                className="flex-1 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2"
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
                      className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                    />
                    AI is evaluating your answer...
                  </>
                ) : (
                  "Submit Answer"
                )}
              </motion.button>

              <motion.button
                onClick={skipQuestion}
                disabled={controlsDisabled}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.03 }}
                className="shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-60"
              >
                <BsSkipForward size={16} />
                <span className="hidden sm:inline">Skip</span>
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/40 p-5 rounded-2xl shadow-sm"
            >
              <p className="text-emerald-700 dark:text-emerald-400 font-medium mb-4">
                {feedback}
              </p>

              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-3.5 h-3.5 border-2 border-emerald-300 dark:border-emerald-700 border-t-emerald-600 dark:border-t-emerald-400 rounded-full"
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
