import React, { useEffect, useRef, useState } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import femaleVideo2 from "../assets/Videos/female-ai-2.mp4";

import { motion, AnimatePresence } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from "../App";
import { createRecognition } from "../utils/speechRecognition";
import { createTts } from "../utils/neuralTts";
import { useVoiceAnswer } from "../hooks/useVoiceAnswer";
import { useConfidenceAnalyzer } from "../hooks/useConfidenceAnalyzer";
import ConfidenceLivePill from "./ConfidenceLivePill";
import { getVoiceCommand } from "../utils/voiceCommands";
import { BsSkipForward, BsCode, BsPlayFill, BsCheckCircleFill, BsXCircleFill, BsChevronDown, BsFullscreen, BsPersonFill, BsLightningCharge, BsArrowRight, BsTable } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import { useEyeContactTracking, EYE_CONTACT_WARNING_MS } from "../hooks/useEyeContactTracking";
import ProctorWarningModal from "./ProctorWarningModal";
import SqlWorkbench from "./SqlWorkbench";
import { runSqlQuery } from "../utils/sqlRunner";
import { useTheme } from "../context/ThemeContext";
import Editor from "@monaco-editor/react";
const CODE_LANGUAGES = [{
  value: "javascript",
  label: "JavaScript"
}, {
  value: "python",
  label: "Python"
}, {
  value: "cpp",
  label: "C++"
}, {
  value: "java",
  label: "Java"
}];
const MAX_FULLSCREEN_EXITS = 3;
const buildSpokenReply = ({
  ack,
  isLast,
  isCodingQuestion,
  isSqlQuestion,
  userName
}) => {
  const base = ack || (isCodingQuestion ? "Thanks, I've noted your solution." : isSqlQuestion ? "Thanks, I've noted your query." : "Alright, let's move on.");
  return isLast ? `${base} That was my last question. Thank you for your time, ${userName}.` : base;
};
const SILENCE_AUTO_SUBMIT_MS = 5000;
const SHORT_ANSWER_WORDS = 15;
const SILENCE_AUTO_SUBMIT_SHORT_MS = 9000;
const INACTIVITY_WARNING_MS = 10000;
const INACTIVITY_GRACE_MS = 15000;
const WAIT_EXTENSION_MS = 30000;
const REPEAT_COMMAND_REGEX = /\b(repeat|say that again|didn'?t (hear|catch)|come again|pardon|one more time)\b/i;
const WAIT_COMMAND_REGEX = /\b(wait|hold on|give me (a )?(second|minute|sec|moment)|one (sec|second|minute)|hang on)\b/i;
const PRESENCE_REGEX = /\b(yes|yeah|i'?m here|still here|here|okay|ok)\b/i;
const SKIP_COMMAND_REGEX = /\b(skip(?:ped|ping)?(?!\s*list)|next question|move on|pass (on )?this|go to (the )?next|(just|scape|skit|ski) (give )?(this|the) question|leave this question)\b/i;
const COMMAND_MAX_WORDS = 8;
const ANALYSIS_MS = 3000;
const PANEL_PERSONAS = {
  interviewerA: {
    label: "Interviewer A",
    subtitle: "Technical",
    video: maleVideo,
    voiceGender: "male",
    accent: "#5EC8D8"
  },
  interviewerB: {
    label: "Interviewer B",
    subtitle: "Behavioral",
    video: femaleVideo,
    voiceGender: "female",
    accent: "#E8A94C"
  }
};
function AnalysisOverlay({
  progress = 0
}) {
  const R = 54;
  const C = 2 * Math.PI * R;
  const secondsLeft = Math.max(1, Math.ceil((1 - progress) * 3));
  return <div className="relative z-10 flex flex-col items-center justify-center py-8 select-none">
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full bg-[#E8A94C]/15 blur-2xl animate-pulse hidden dark:block" />
        <svg viewBox="0 0 128 128" className="relative w-40 h-40 -rotate-90">
          <defs>
            <linearGradient id="analysisGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F6D68A" />
              <stop offset="100%" stopColor="#E8A94C" />
            </linearGradient>
          </defs>
          <circle cx="64" cy="64" r={R} fill="none" stroke="currentColor" strokeWidth="8" className="text-[#E8E6E1] dark:text-[#262B34]" />
          <circle cx="64" cy="64" r={R} fill="none" stroke="url(#analysisGold)" strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} style={{
          transition: "stroke-dashoffset 0.1s linear"
        }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif-display text-4xl font-semibold text-[#14171B] dark:text-[#EDEEF0] tabular-nums">
            {secondsLeft}
          </span>
          <span className="font-mono-studio text-[10px] tracking-[0.25em] text-[#8A929C] dark:text-[#565D68] mt-1">
            SEC
          </span>
        </div>
      </div>
      <div className="mt-6 font-mono-studio text-xs tracking-[0.25em] uppercase text-[#9A7B24] dark:text-[#E8A94C]">
        Analyzing your answer
      </div>
      <p className="mt-2 text-sm text-[#5B636E] dark:text-[#8B92A0]">
        The interviewer is listening to every word…
      </p>
    </div>;
}
function VoiceAnswerPanel({
  voice,
  onRepeat,
  onSwitchToType,
  headerChips = null,
  analyzing = false,
  analysisProgress = 0
}) {
  const {
    status,
    level,
    notice,
    lastCommand
  } = voice;
  const listening = status === "listening" || status === "countdown";
  const busy = listening || status === "requesting" || status === "transcribing";
  const statusLabel = {
    idle: "Get ready…",
    requesting: "Setting up your mic…",
    listening: "Listening — speak your answer",
    countdown: "Wrapping up — stay silent to submit",
    transcribing: "Transcribing your answer…",
    denied: "Mic access blocked",
    error: "Transcription failed"
  }[status] || "Get ready…";
  if (analyzing) {
    return <div className="flex-1 mt-3 relative overflow-hidden rounded-3xl bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#1E2229] p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-95">
        <div className="absolute inset-0 pointer-events-none hidden dark:block" style={{
        background: "radial-gradient(ellipse 65% 55% at 50% 38%, rgba(232,169,76,0.14), transparent 70%)"
      }} />
        <AnalysisOverlay progress={analysisProgress} />
      </div>;
  }
  return <div className="flex-1 mt-3 relative overflow-hidden rounded-3xl bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#1E2229] p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-95">
      {}
      <div className="absolute inset-0 pointer-events-none hidden dark:block" style={{
      background: "radial-gradient(ellipse 65% 55% at 50% 38%, rgba(232,169,76,0.14), transparent 70%)"
    }} />
      {headerChips}

      {}
      <div className={`relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border transition-all duration-300 ${listening ? "bg-[#C99E41]/10 border-[#C99E41]/40 dark:bg-[#E8A94C]/10 dark:border-[#E8A94C]/40 dark:shadow-[0_0_24px_-6px_rgba(232,169,76,0.55)]" : "bg-[#F5F4F1] border-[#E8E6E1] dark:bg-white/5 dark:border-white/10"}`}>
        <span className={`w-1.5 h-1.5 rotate-45 ${listening ? "bg-[#9A7B24] dark:bg-[#E8A94C]" : status === "transcribing" ? "bg-[#5EC8D8]" : "bg-[#8A929C] dark:bg-[#565D68]"}`} />
        <span className="font-mono-studio text-[11px] tracking-[0.08em] text-[#3E4650] dark:text-[#C7CBD1] uppercase">
          {statusLabel}
        </span>
      </div>

      {}
      <motion.div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 mb-6" animate={listening ? {
      scale: [1, 1.045, 1]
    } : {
      scale: 1
    }} transition={listening ? {
      repeat: Infinity,
      duration: 2.4,
      ease: "easeInOut"
    } : {
      duration: 0.2
    }}>
        {listening && <>
            <span className="voice-ring absolute inset-0 rounded-full border-2 border-[#C99E41]/60 dark:border-[#E8A94C]/60" />
            <span className="voice-ring-2 absolute inset-0 rounded-full border-2 border-[#C99E41]/40 dark:border-[#E8A94C]/40" />
            {}
            <motion.span className="absolute -inset-4 rounded-full bg-[#E8A94C]/25 blur-2xl hidden dark:block" animate={{
          opacity: [0.35, 0.7, 0.35]
        }} transition={{
          repeat: Infinity,
          duration: 2.4,
          ease: "easeInOut"
        }} />
          </>}
        <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-colors duration-300 ${listening ? "orb-live bg-linear-to-br from-[#F2C063] via-[#E8A94C] to-[#B27E2E] dark:shadow-[0_0_80px_-10px_rgba(232,169,76,0.8)]" : "bg-[#F5F4F1] border border-[#E8E6E1] dark:bg-[#14171C] dark:border-[#2A2F38]"}`}>
          {}
          <span className="absolute inset-0 rounded-full bg-linear-to-b from-white/25 via-transparent to-transparent pointer-events-none" />
          {status === "transcribing" ? <motion.span animate={{
          rotate: 360
        }} transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear"
        }} className="w-8 h-8 border-[3px] border-[#C99E41]/25 border-t-[#C99E41] dark:border-[#E8A94C]/25 dark:border-t-[#E8A94C] rounded-full" /> : <FaMicrophone size={32} className={listening ? "text-[#0C0E11]" : "text-[#8A929C] dark:text-[#565D68]"} />}
        </div>
      </motion.div>

      {}
      <div className="relative z-10 flex items-end justify-center gap-1 h-14 mb-5" aria-hidden="true">
        {Array.from({
        length: 28
      }).map((_, i) => {
        const h = 6 + Math.min(1, level) * 46 * (0.35 + 0.65 * Math.abs(Math.sin(i * 1.7)));
        return <div key={i} className={`w-1.5 rounded-full transition-[height] duration-150 ${busy ? "bg-linear-to-t from-[#B27E2E] via-[#C99E41] to-[#F6D68A] dark:from-[#B27E2E] dark:via-[#E8A94C] dark:to-[#F6D68A]" : "bg-[#E8E6E1] dark:bg-[#2A2F38]"}`} style={{
          height: `${busy ? h : 6}px`,
          opacity: busy ? 0.95 : 0.22
        }} />;
      })}
      </div>

      <div className="relative z-10 flex items-center justify-center gap-5 mb-5">
        {["repeat", "skip", "wait"].map(cmd => <span key={cmd} className="font-mono-studio text-[9px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68]">
            SAY <span className="text-[#5B636E] dark:text-[#8B92A0]">"{cmd}"</span>
          </span>)}
      </div>

      {}
      {notice && <p className="relative z-10 text-sm text-[#9A7B24] dark:text-[#E8B96A] mb-3 max-w-md">
          {notice}
        </p>}

      {}
      {status === "denied" && <div className="relative z-10 w-full max-w-md bg-[#C99E41]/10 dark:bg-[#E8A94C]/8 border border-[#C99E41]/30 dark:border-[#E8A94C]/25 rounded-2xl px-4 py-4 mb-4">
          <p className="text-sm text-[#9A7B24] dark:text-[#E8B96A] mb-3 leading-relaxed">
            Your browser blocked mic access. Allow the microphone, then{" "}
            <button type="button" onClick={onRepeat} className="underline font-semibold">
              try again
            </button>
            , or answer by typing instead.
          </p>
          <button type="button" onClick={onSwitchToType} className="w-full py-2.5 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] text-sm font-semibold hover:opacity-90 transition">
            Type instead
          </button>
        </div>}

      {}
      {status === "error" && <div className="relative z-10 w-full max-w-md bg-red-500/10 dark:bg-red-500/8 border border-red-500/25 rounded-2xl px-4 py-4 mb-4">
          <p className="text-sm text-red-700 dark:text-red-300 mb-3 leading-relaxed">
            Transcription isn&apos;t working right now. Your interview is
            safe — switch to typing and keep going.
          </p>
          <button type="button" onClick={onSwitchToType} className="w-full py-2.5 rounded-full bg-white dark:bg-[#EDEEF0] text-[#0A0B0D] text-sm font-semibold border border-red-500/20 hover:opacity-90 transition">
            Switch to Type mode
          </button>
        </div>}

      {}
      {lastCommand && <motion.div key={lastCommand.at} initial={{
      opacity: 0,
      scale: 0.9
    }} animate={{
      opacity: 1,
      scale: 1
    }} className="relative z-10 font-mono-studio text-[11px] tracking-wide px-4 py-2 rounded-xl border border-[#C99E41]/40 bg-[#C99E41]/10 text-[#9A7B24] dark:border-[#E8A94C]/40 dark:bg-[#E8A94C]/10 dark:text-[#E8B96A] dark:shadow-[0_0_24px_-6px_rgba(232,169,76,0.5)]">
          {lastCommand.id === "repeat" && "Repeating the question…"}
          {lastCommand.id === "skip" && "Skipping…"}
          {lastCommand.id === "wait" && "Take your time…"}
        </motion.div>}

    </div>;
}
function Step2PanelInterview({
  interviewData,
  onFinish
}) {
  const {
    interviewId,
    userName,
    company
  } = interviewData;
  const interviewLanguage = interviewData.language || "english";
  const useHindiVoice = interviewLanguage !== "english";
  const getPersona = key => {
    const base = PANEL_PERSONAS[key];
    if (useHindiVoice && key === "interviewerA") {
      return { ...base, video: femaleVideo2, voiceGender: "female", pitch: 1.0, name: "Ananya" };
    }
    return { ...base, pitch: base.voiceGender === "male" ? 0.82 : useHindiVoice ? 1.15 : 1.12, name: key === "interviewerA" ? "Marcus" : "Elena" };
  };
  const useHindiStt = interviewLanguage === "hindi";
  const STILL_THERE_SPEECH = interviewLanguage === "hindi" ? "क्या आप अभी भी हैं?" : interviewLanguage === "hinglish" ? "Kya tum abhi bhi ho?" : "Are you still there?";
  const STILL_THERE_TEXT = interviewLanguage === "hindi" ? "क्या आप अभी भी हैं? जब तैयार हों तो जवाब बोलिए — या typing पर switch कर लीजिए।" : interviewLanguage === "hinglish" ? "Kya tum abhi bhi ho? Jab ready ho to jawab bolo — ya typing pe switch kar lo." : "Are you still there? Please speak your answer whenever you're ready — or switch to typing if you prefer.";
  const STILL_THERE_BANNER = interviewLanguage === "hindi" ? "अभी भी हैं? कुछ भी बोलिए ताकि पता चले।" : interviewLanguage === "hinglish" ? "Abhi bhi ho? Kuch bhi bolo taaki pata chale." : "Still there? Say anything to let us know.";
  const TAKE_YOUR_TIME_OK = interviewLanguage === "hindi" ? "ठीक है, अपना समय लीजिए।" : interviewLanguage === "hinglish" ? "Ok, apna time lo." : "Ok, take your time.";
  const TAKE_YOUR_TIME = interviewLanguage === "hindi" ? "अपना समय लीजिए।" : interviewLanguage === "hinglish" ? "Apna time lo." : "Take your time.";
  const [questions, setQuestions] = useState(interviewData.questions || []);
  const { theme } = useTheme();
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [micError, setMicError] = useState("");
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [personaVideoReady, setPersonaVideoReady] = useState({ interviewerA: false, interviewerB: false });
  const [showAnswerBox, setShowAnswerBox] = useState(false);
  const [answerMode, setAnswerMode] = useState("voice");
  const answerModeRef = useRef("voice");
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [warningSecondsLeft, setWarningSecondsLeft] = useState(15);
  const [interimText, setInterimText] = useState("");
  const silenceTimerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const graceTimerRef = useRef(null);
  const warningIntervalRef = useRef(null);
  const inactivityWarningRef = useRef(false);
  const hasSpokenRef = useRef(false);
  const wantListeningRef = useRef(false);
  const currentQuestionRef = useRef(null);
  const activeSpeakerRef = useRef("interviewerA");
  const isMicOnRef = useRef(true);
  const showAnswerBoxRef = useRef(false);
  const answerRef = useRef("");
  const submitAnswerRef = useRef(() => {});
  const sqlPayloadRef = useRef({ query: "", result: null, error: null });
  const skipQuestionRef = useRef(() => {});
  const speakTextRef = useRef(() => Promise.resolve());
  const isAIPlayingRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const isIntroPhaseRef = useRef(true);
  const isCodingQuestionRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [subtitle, setSubtitle] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submitTestResults, setSubmitTestResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [maleVoice, setMaleVoice] = useState(null);
  const [femaleVoice, setFemaleVoice] = useState(null);
  const [ttsProvider, setTtsProvider] = useState(null);
  const ttsRef = useRef(null);
  const browserSpeakRef = useRef(() => Promise.resolve());
  const maleVoiceRef = useRef(null);
  const femaleVoiceRef = useRef(null);
  const handleVoiceNoSpeechRef = useRef(() => {});
  const handleVoiceCommandRef = useRef(() => {});
  const voiceAnswer = useVoiceAnswer({
    apiUrl: ServerUrl,
    onTranscript: transcript => {
      const cmd = getVoiceCommand(transcript);
      if (cmd) {
        handleVoiceCommandRef.current(cmd);
        return;
      }
      submitAnswerRef.current(transcript);
    },
    onNoSpeech: () => {
      handleVoiceNoSpeechRef.current();
    },
    onCommand: cmd => {
      handleVoiceCommandRef.current(cmd);
    },
    onSpeechActivity: () => {
      if (!inactivityWarningRef.current && !isSubmittingRef.current && !terminatedRef.current) {
        armInactivityTimer();
      }
    }
  });
  const [proctoringReady, setProctoringReady] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const pipVideoRef = useRef(null);
  const confidence = useConfidenceAnalyzer({ stream: cameraStream, videoRef: pipVideoRef });
  const [cameraError, setCameraError] = useState("");
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [fullscreenWarning, setFullscreenWarning] = useState(null);
  const [isTerminated, setIsTerminated] = useState(false);
  const selfVideoRef = useRef(null);
  const screenStreamRef = useRef(null);
  const wasFullscreenRef = useRef(false);
  const fullscreenExitCountRef = useRef(0);
  const proctoringReadyRef = useRef(false);
  const terminatedRef = useRef(false);
  const isFinishingRef = useRef(false);
  const videoRefA = useRef(null);
  const videoRefB = useRef(null);
  const answerWindowStartRef = useRef(null);
  const eyeContactTracking = useEyeContactTracking(pipVideoRef, {
    active: proctoringReady && !!cameraStream
  });
  const [faceWarningOpen, setFaceWarningOpen] = useState(false);
  const [eyeWarningOpen, setEyeWarningOpen] = useState(false);
  const faceDismissedRef = useRef(false);
  const eyeDismissedRef = useRef(false);
  const currentQuestion = questions[currentIndex];
  const isCodingQuestion = currentQuestion?.type === "coding";
  const isSqlQuestion = currentQuestion?.type === "sql";
  const isHandsOnQuestion = isCodingQuestion || isSqlQuestion;
  const activeSpeaker = currentQuestion?.askedBy || "interviewerA";
  const activePersona = getPersona(activeSpeaker);
  const controlsDisabled = isSubmitting || isIntroPhase || isAIPlaying || !!fullscreenWarning || isTerminated;
  useEffect(() => {
    proctoringReadyRef.current = proctoringReady;
  }, [proctoringReady]);
  useEffect(() => {
    if (!cameraStream || fullscreenWarning || isTerminated) return;
    if (eyeContactTracking.faceCount > 1) {
      if (!faceDismissedRef.current) setFaceWarningOpen(true);
    } else {
      faceDismissedRef.current = false;
      setFaceWarningOpen(false);
    }
  }, [eyeContactTracking.faceCount, cameraStream, fullscreenWarning, isTerminated]);
  useEffect(() => {
    if (!cameraStream || fullscreenWarning || isTerminated) return;
    if (eyeContactTracking.awayStreakMs >= EYE_CONTACT_WARNING_MS) {
      if (!eyeDismissedRef.current) setEyeWarningOpen(true);
    } else {
      eyeDismissedRef.current = false;
      setEyeWarningOpen(false);
    }
  }, [eyeContactTracking.awayStreakMs, cameraStream, fullscreenWarning, isTerminated]);
  useEffect(() => {
    isAIPlayingRef.current = isAIPlaying;
  }, [isAIPlaying]);
  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);
  useEffect(() => {
    isIntroPhaseRef.current = isIntroPhase;
  }, [isIntroPhase]);
  useEffect(() => {
    isCodingQuestionRef.current = isHandsOnQuestion;
  }, [isHandsOnQuestion]);
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);
  useEffect(() => {
    activeSpeakerRef.current = activeSpeaker;
  }, [activeSpeaker]);
  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);
  useEffect(() => {
    answerModeRef.current = answerMode;
  }, [answerMode]);
  useEffect(() => {
    answerRef.current = answer;
    submitAnswerRef.current = submitAnswer;
    skipQuestionRef.current = skipQuestion;
    speakTextRef.current = speakText;
  });
  const clearAllVoiceTimers = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
    if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
    silenceTimerRef.current = null;
    inactivityTimerRef.current = null;
    graceTimerRef.current = null;
    warningIntervalRef.current = null;
    inactivityWarningRef.current = false;
    setInactivityWarning(false);
    setInterimText("");
  };
  const safeStartRecognition = () => {
    if (!recognitionRef.current || !isMicOnRef.current) return;
    wantListeningRef.current = true;
    try {
      recognitionRef.current.start();
    } catch {}
  };
  const safeStopRecognition = () => {
    wantListeningRef.current = false;
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {}
  };
  const dismissInactivityWarning = () => {
    setInactivityWarning(false);
    inactivityWarningRef.current = false;
    if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
    if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
    graceTimerRef.current = null;
    warningIntervalRef.current = null;
  };
  const armSilenceAutoSubmit = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    const words = answerRef.current.trim().split(/\s+/).filter(Boolean).length;
    const delay = words < SHORT_ANSWER_WORDS ? SILENCE_AUTO_SUBMIT_SHORT_MS : SILENCE_AUTO_SUBMIT_MS;
    silenceTimerRef.current = setTimeout(() => {
      if (!isAIPlayingRef.current && !isSubmittingRef.current) {
        submitAnswerRef.current();
      }
    }, delay);
  };
  const handleInactivityTimeout = () => {
    if (terminatedRef.current) return;
    dismissInactivityWarning();
    if (hasSpokenRef.current) {
      submitAnswerRef.current();
    } else {
      skipQuestionRef.current();
    }
  };
  const handleInactivityWarning = async () => {
    if (isAIPlayingRef.current || isSubmittingRef.current || isCodingQuestionRef.current || showAnswerBoxRef.current || terminatedRef.current) {
      return;
    }
    if (answerModeRef.current === "voice") voiceAnswer.stop(); else safeStopRecognition();
    await speakTextRef.current(STILL_THERE_SPEECH, activeSpeakerRef.current);
    if (terminatedRef.current) return;
    setInactivityWarning(true);
    inactivityWarningRef.current = true;
    setWarningSecondsLeft(Math.round(INACTIVITY_GRACE_MS / 1000));
    safeStartRecognition();
    warningIntervalRef.current = setInterval(() => {
      setWarningSecondsLeft(s => s > 0 ? s - 1 : 0);
    }, 1000);
    graceTimerRef.current = setTimeout(() => {
      handleInactivityTimeout();
    }, INACTIVITY_GRACE_MS);
  };
  const armInactivityTimer = (delayMs = INACTIVITY_WARNING_MS) => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      handleInactivityWarning();
    }, delayMs);
  };
  const handleRepeatCommand = async () => {
    if (!currentQuestionRef.current || terminatedRef.current) return;
    clearAllVoiceTimers();
    safeStopRecognition();
    await speakTextRef.current(currentQuestionRef.current.question, activeSpeakerRef.current);
    if (terminatedRef.current) return;
    safeStartRecognition();
    armInactivityTimer();
  };
  const handleWaitCommand = async () => {
    if (terminatedRef.current) return;
    clearAllVoiceTimers();
    safeStopRecognition();
    await speakTextRef.current(TAKE_YOUR_TIME_OK, activeSpeakerRef.current);
    if (terminatedRef.current) return;
    if (answerModeRef.current === "voice") voiceAnswer.start(); else safeStartRecognition();
    armInactivityTimer(WAIT_EXTENSION_MS);
  };
  const handleSkipCommand = () => {
    if (terminatedRef.current) return;
    clearAllVoiceTimers();
    safeStopRecognition();
    skipQuestionRef.current();
  };
  const switchAnswerMode = mode => {
    if (mode === answerModeRef.current) return;
    if (isIntroPhaseRef.current || terminatedRef.current) return;
    voiceAnswer.stop();
    stopMic();
    clearAllVoiceTimers();
    dismissInactivityWarning();
    answerModeRef.current = mode;
    setAnswerMode(mode);
    const typing = mode === "type";
    showAnswerBoxRef.current = typing;
    setShowAnswerBox(typing);
    if (isCodingQuestionRef.current) return;
    if (isSubmittingRef.current || isAIPlayingRef.current) return;
    if (typing) {
      if (isMicOnRef.current) {
        hasSpokenRef.current = false;
        startMic();
        armInactivityTimer();
      }
    } else {
      voiceAnswer.start();
      armInactivityTimer();
    }
  };
  const handleRepeatQuestion = async () => {
    if (!currentQuestionRef.current || terminatedRef.current) return;
    if (isAIPlayingRef.current || isSubmittingRef.current) return;
    voiceAnswer.stop();
    stopMic();
    clearAllVoiceTimers();
    await speakTextRef.current(currentQuestionRef.current.question, activeSpeakerRef.current);
    if (terminatedRef.current) return;
    if (isCodingQuestionRef.current) return;
    if (answerModeRef.current === "voice") {
      voiceAnswer.start();
      armInactivityTimer();
    } else if (isMicOnRef.current) {
      startMic();
      armInactivityTimer();
    }
  };
  const handleVoiceNoSpeech = async () => {
    if (terminatedRef.current) return;
    voiceAnswer.stop();
    await speakTextRef.current(STILL_THERE_TEXT, activeSpeakerRef.current);
    if (terminatedRef.current) return;
    if (answerModeRef.current === "voice" && !isSubmittingRef.current && !isCodingQuestionRef.current) {
      voiceAnswer.start();
      armInactivityTimer();
    }
  };
  const handleVoiceWait = async () => {
    if (terminatedRef.current) return;
    voiceAnswer.stop();
    stopMic();
    clearAllVoiceTimers();
    await speakTextRef.current(TAKE_YOUR_TIME, activeSpeakerRef.current);
    if (terminatedRef.current) return;
    if (answerModeRef.current === "voice" && !isSubmittingRef.current && !isCodingQuestionRef.current) {
      voiceAnswer.start();
      armInactivityTimer(WAIT_EXTENSION_MS);
    }
  };
  const handleVoiceCommand = cmd => {
    if (terminatedRef.current) return;
    if (isSubmittingRef.current || isAIPlayingRef.current) return;
    if (cmd === "repeat") handleRepeatQuestion();else if (cmd === "skip") skipQuestion();else if (cmd === "wait") handleVoiceWait();
  };
  useEffect(() => {
    handleVoiceNoSpeechRef.current = handleVoiceNoSpeech;
    handleVoiceCommandRef.current = handleVoiceCommand;
  });
  const requestCamera = async () => {
    setCameraError("");
    setIsRequestingCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      setCameraStream(stream);
    } catch (err) {
      console.log(err);
      setCameraError("Camera access was denied or isn't available. You can still continue without it.");
    } finally {
      setIsRequestingCamera(false);
    }
  };
  useEffect(() => {
    if (selfVideoRef.current && cameraStream) {
      selfVideoRef.current.srcObject = cameraStream;
    }
    if (pipVideoRef.current && cameraStream) {
      pipVideoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, proctoringReady]);
  const requestLocation = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Location isn't supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
      setLocationShared(true);
      setLocationCoords({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });
    }, () => {
      setLocationError("Location access was denied. You can still continue without it.");
    });
  };
  const requestScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      screenStreamRef.current = stream;
      setScreenShareActive(true);
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        setScreenShareActive(false);
      });
    } catch (err) {
      console.log(err);
    }
  };
  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        wasFullscreenRef.current = true;
        return;
      }
      if (!wasFullscreenRef.current) return;
      if (isFinishingRef.current) return;
      if (!proctoringReadyRef.current) return;
      if (terminatedRef.current) return;
      const nextCount = fullscreenExitCountRef.current + 1;
      fullscreenExitCountRef.current = nextCount;
      setFullscreenExitCount(nextCount);
      if (nextCount >= MAX_FULLSCREEN_EXITS) {
        terminatedRef.current = true;
        setIsTerminated(true);
        setFullscreenWarning({
          count: nextCount,
          isFinal: true
        });
      } else {
        setFullscreenWarning({
          count: nextCount,
          isFinal: false
        });
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitchCount(c => c + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
  useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach(t => t.stop());
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      confidence.release();
    };
  }, []);
  const startInterviewFromGate = () => {
    enterFullscreen();
    setProctoringReady(true);
  };
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const lower = v => (v.name || "").toLowerCase();
      const hindiVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith("hi"));
      const maleHint = v => /male|पुरुष|david|mark|arjun|ravi|amit/i.test(lower(v));
      const femaleHint = v => /female|महिला|zira|samantha|meera|priya|anita/i.test(lower(v));
      let female;
      let male;
      if (useHindiVoice && hindiVoices.length) {
        female = hindiVoices.find(femaleHint) || hindiVoices[0];
        male = hindiVoices.find(maleHint) || hindiVoices.find(v => v !== female) || hindiVoices[0];
      } else {
        female = voices.find(v => lower(v).includes("zira") || lower(v).includes("samantha") || lower(v).includes("female"));
        male = voices.find(v => lower(v).includes("david") || lower(v).includes("mark") || lower(v).includes("male"));
      }
      setFemaleVoice(female || voices[0]);
      setMaleVoice(male || voices[1] || voices[0]);
      femaleVoiceRef.current = female || voices[0];
      maleVoiceRef.current = male || voices[1] || voices[0];
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);
  const browserSpeakText = (chunk, voiceGenderParam, voiceOpts = {}) => {
    return new Promise(resolve => {
      const voice = voiceGenderParam === "male" ? maleVoiceRef.current : femaleVoiceRef.current;
      if (!window.speechSynthesis || !voice) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const humanText = chunk.replace(/,/g, ", ...").replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = voice;
      utterance.lang = useHindiVoice ? "hi-IN" : "en-IN";
      utterance.rate = 0.92;
      utterance.pitch = voiceOpts.pitch ?? (voiceGenderParam === "male" ? 0.82 : 1.12);
      utterance.volume = 1;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };
  useEffect(() => {
    browserSpeakRef.current = browserSpeakText;
  });
  if (!ttsRef.current) {
    ttsRef.current = createTts({
      onProviderChange: p => setTtsProvider(p),
      forceBrowser: useHindiVoice,
      getConfig: async () => {
        const res = await axios.get(ServerUrl + "/api/interview/tts-config", {
          withCredentials: true
        });
        return res.data;
      },
      fetchAudio: async (chunk, voiceGenderParam) => {
        const res = await axios.post(ServerUrl + "/api/interview/tts", {
          text: chunk,
          voiceGender: voiceGenderParam
        }, {
          withCredentials: true,
          responseType: "arraybuffer"
        });
        return res.data;
      },
      browser: {
        speak: (chunk, voiceGenderParam, voiceOpts) => browserSpeakRef.current(chunk, voiceGenderParam, voiceOpts),
        cancel: () => {
          try {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
          } catch {}
        }
      }
    });
  }
  useEffect(() => {
    let cancelled = false;
    ttsRef.current.getProvider().then(p => {
      if (!cancelled) setTtsProvider(p);
    }).catch(() => {
      if (!cancelled) setTtsProvider("browser");
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const speakText = (text, askedBy) => {
    return new Promise(async resolve => {
      ttsRef.current.cancel();
      const persona = getPersona(askedBy);
      const voiceGender = persona.voiceGender === "male" ? "male" : "female";
      const speakingRef = askedBy === "interviewerA" ? videoRefA : videoRefB;
      setSubtitle(text);
      setIsAIPlaying(true);
      stopMic();
      voiceAnswer.stop();
      speakingRef.current?.play();
      try {
        await Promise.race([ttsRef.current.speak(text, voiceGender, { pitch: persona.pitch }), new Promise(res => setTimeout(() => res("tts-timeout"), 25000))]);
      } catch {}
      if (speakingRef.current) {
        speakingRef.current.pause();
        speakingRef.current.currentTime = 0;
      }
      setIsAIPlaying(false);
      setTimeout(() => {
        setSubtitle("");
        resolve();
      }, 300);
    });
  };
  useEffect(() => {
    if (!maleVoice && !femaleVoice || !proctoringReady) return;
    if (terminatedRef.current) return;
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(`Hi, I'm ${getPersona("interviewerA").name} — I'll be handling the technical side of today's interview. I've spent several years working on systems like the ones we'll be discussing.`, "interviewerA");
        await speakText(`And I'm ${getPersona("interviewerB").name} — I'll be focusing on communication, ownership, and how you work with others. Great to have you with us today.`, "interviewerB");
        await speakText(`We'll take turns asking questions, so just answer naturally and take your time. Let's begin.`, "interviewerA");
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));
        if (isLastQuestion) {
          await speakText("Alright, this might be a bit challenging", activeSpeaker);
        }
        await speakText(currentQuestion.question, activeSpeaker);
        answerWindowStartRef.current = Date.now();
        confidence.beginAnswer();
        if (currentQuestion.type !== "coding") {
          if (answerModeRef.current === "voice") {
            voiceAnswer.start();
            armInactivityTimer();
          } else if (isMicOn) {
            hasSpokenRef.current = false;
            startMic();
            armInactivityTimer();
          }
        }
      }
    };
    runIntro();
  }, [maleVoice, femaleVoice, isIntroPhase, currentIndex, proctoringReady]);
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (isSubmitting) return;
    if (fullscreenWarning) return;
    if (isTerminated) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, isSubmitting, fullscreenWarning, isTerminated]);
  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);
  useEffect(() => {
    if (isCodingQuestion && currentQuestion?.starterCode) {
      const langToUse = currentQuestion.starterCode[codeLanguage] ? codeLanguage : "javascript";
      setCodeLanguage(langToUse);
      setAnswer(currentQuestion.starterCode[langToUse] || "");
    }
    setRunResults(null);
    setSubmitTestResults(null);
    sqlPayloadRef.current = { query: "", result: null, error: null };
  }, [currentIndex, isCodingQuestion]);
  const handleLanguageChange = newLang => {
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
    const recognition = createRecognition({
      fetchConfig: async () => {
        const res = await axios.get(ServerUrl + "/api/interview/stt-token?language=" + (useHindiStt ? "hi" : "en"), {
          withCredentials: true
        });
        return res.data;
      },
      keyterms: interviewData.sttKeyterms || []
    });
    recognition.lang = useHindiStt ? "hi-IN" : "en-IN";
    recognition.maxAlternatives = 3;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = event => {
      if (isAIPlayingRef.current || isSubmittingRef.current || isIntroPhaseRef.current || isCodingQuestionRef.current) {
        return;
      }
      let finalText = "";
      let interimChunk = "";
      const finalAlternatives = [];
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalText += " " + res[0].transcript;
          for (let a = 0; a < res.length; a++) {
            finalAlternatives.push(res[a].transcript.toLowerCase());
          }
        } else {
          interimChunk += " " + res[0].transcript;
        }
      }
      finalText = finalText.trim();
      interimChunk = interimChunk.trim();
      if (interimChunk) {
        setInterimText(interimChunk);
        if (inactivityWarningRef.current) {
          if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
          if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
          graceTimerRef.current = null;
          warningIntervalRef.current = null;
        } else {
          armInactivityTimer();
        }
        if (!showAnswerBoxRef.current && answerRef.current.trim()) {
          armSilenceAutoSubmit();
        }
      }
      if (!finalText) return;
      setInterimText("");
      const lower = finalText.toLowerCase();
      const wordCount = finalText.split(/\s+/).length;
      const isShort = wordCount <= COMMAND_MAX_WORDS;
      const matchesAny = re => finalAlternatives.some(alt => re.test(alt));
      if (isShort && matchesAny(SKIP_COMMAND_REGEX)) {
        handleSkipCommand();
        return;
      }
      if (isShort && matchesAny(REPEAT_COMMAND_REGEX)) {
        handleRepeatCommand();
        return;
      }
      if (isShort && matchesAny(WAIT_COMMAND_REGEX)) {
        handleWaitCommand();
        return;
      }
      if (inactivityWarningRef.current) {
        const isPresenceOnly = isShort && PRESENCE_REGEX.test(lower);
        dismissInactivityWarning();
        if (isPresenceOnly) {
          handleWaitCommand();
          return;
        }
      }
      hasSpokenRef.current = true;
      const next = answerRef.current ? answerRef.current + " " + finalText : finalText;
      answerRef.current = next;
      setAnswer(next);
      if (showAnswerBoxRef.current) return;
      armInactivityTimer();
      armSilenceAutoSubmit();
    };
    recognition.onend = () => {
      if (!wantListeningRef.current) return;
      setTimeout(() => {
        if (!wantListeningRef.current || !isMicOnRef.current || isAIPlayingRef.current || isSubmittingRef.current || terminatedRef.current) {
          return;
        }
        try {
          recognition.start();
        } catch {}
      }, 250);
    };
    recognition.onerror = event => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        wantListeningRef.current = false;
      }
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setMicError("Mic access was denied. Please type your answer, or enable mic permission in your browser settings.");
        setIsMicOn(false);
      } else if (event.error === "no-speech") {} else {
        setMicError("Mic isn't working right now. You can type your answer instead.");
        setIsMicOn(false);
      }
    };
    recognitionRef.current = recognition;
  }, []);
  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      wantListeningRef.current = true;
      try {
        recognitionRef.current.start();
        setMicError("");
      } catch {}
    }
  };
  const stopMic = () => {
    wantListeningRef.current = false;
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
  const finishInterview = async ({
    terminatedForMisbehavior = false
  } = {}) => {
    isFinishingRef.current = true;
    try {
      const proctoring = {
        cameraEnabled: Boolean(cameraStream),
        cameraDenied: Boolean(cameraError),
        screenShared: screenShareActive,
        locationShared,
        latitude: locationCoords?.latitude ?? null,
        longitude: locationCoords?.longitude ?? null,
        tabSwitchCount,
        fullscreenExitCount: fullscreenExitCountRef.current,
        terminatedForMisbehavior
      };
      const result = await axios.post(ServerUrl + "/api/interview/finish", {
        interviewId,
        proctoring
      }, {
        withCredentials: true
      });
      cameraStream?.getTracks().forEach(t => t.stop());
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      onFinish(result.data);
    } catch (error) {
      console.log(error);
      isFinishingRef.current = false;
      setErrorMessage(error?.response?.data?.message || "Couldn't finish the interview. Please try again.");
    }
  };
  useEffect(() => {
    if (!fullscreenWarning) return;
    let cancelled = false;
    const handle = async () => {
      clearAllVoiceTimers();
      stopMic();
      voiceAnswer.stop();
      ttsRef.current.cancel();
      if (fullscreenWarning.isFinal) {
        await speakText(`${userName}, you have left fullscreen mode ${MAX_FULLSCREEN_EXITS} times. I have to end this interview here.`, activeSpeaker);
        if (cancelled) return;
        await finishInterview({
          terminatedForMisbehavior: true
        });
      } else {
        await speakText(`Please stay in fullscreen mode. This is warning ${fullscreenWarning.count} of ${MAX_FULLSCREEN_EXITS}. If you leave fullscreen again, the interview will be ended.`, activeSpeaker);
      }
    };
    handle();
    return () => {
      cancelled = true;
    };
  }, [fullscreenWarning]);
  const dismissWarningAndResume = () => {
    enterFullscreen();
    setFullscreenWarning(null);
    if (isHandsOnQuestion) return;
    if (answerModeRef.current === "voice") {
      setTimeout(() => voiceAnswer.start(), 400);
    } else if (isMicOn) {
      setTimeout(() => startMic(), 400);
    }
  };
  const runCode = async () => {
    if (isRunning || isSubmitting) return;
    if (!isCodingQuestion) return;
    setIsRunning(true);
    setErrorMessage("");
    setRunResults(null);
    try {
      const result = await axios.post(ServerUrl + "/api/interview/run-code", {
        interviewId,
        questionIndex: currentIndex,
        code: answer,
        language: codeLanguage
      }, {
        withCredentials: true
      });
      setRunResults(result.data.results || []);
    } catch (error) {
      console.log(error);
      setErrorMessage(error?.response?.data?.message || "Couldn't run your code right now. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };
  const runAnalysisBeat = () => new Promise(resolve => {
    const start = Date.now();
    const tick = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / ANALYSIS_MS);
      setAnalysisProgress(p);
      if (p >= 1) {
        clearInterval(tick);
        resolve();
      }
    }, 100);
  });
  const submitAnswer = async answerOverride => {
    if (isSubmitting) return;
    if (!currentQuestion) return;
    if (isIntroPhase || isAIPlaying) return;
    if (isTerminated || fullscreenWarning) return;
    clearAllVoiceTimers();
    stopMic();
    voiceAnswer.stop();
    const finalAnswer = typeof answerOverride === "string" ? answerOverride : answer;
    const submitText = isSqlQuestion ? sqlPayloadRef.current?.query || "" : finalAnswer;
    if (isSqlQuestion) {
      const p = sqlPayloadRef.current || { query: "", result: null, error: null };
      if (!p.result && !p.error && currentQuestion?.sqlSchema) {
        try {
          const out = await runSqlQuery(currentQuestion.sqlSchema, p.query || "");
          sqlPayloadRef.current = out.error ? { query: p.query || "", result: null, error: out.error } : { query: p.query || "", result: { columns: out.columns, rows: out.rows }, error: null };
        } catch (ignored) { void ignored; }
      }
    }
    setAnswer(submitText);
    answerRef.current = submitText;
    setIsSubmitting(true);
    const useBeat = !isHandsOnQuestion;
    if (useBeat) {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
    }
    setErrorMessage("");
    setFeedback("");
    const durationSeconds = answerWindowStartRef.current ? Math.max(1, Math.round((Date.now() - answerWindowStartRef.current) / 1000)) : currentQuestion.timeLimit - timeLeft;
    const confidenceMetrics = confidence.endAnswer({ transcript: submitText, durationSec: durationSeconds });
    const beatPromise = useBeat ? runAnalysisBeat() : Promise.resolve();
    let data = null;
    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer: submitText,
        timeTaken: currentQuestion.timeLimit - timeLeft,
        durationSeconds,
        confidenceMetrics,
        ...(isCodingQuestion ? {
          language: codeLanguage
        } : {}),
        ...(isSqlQuestion ? {
          sqlResult: sqlPayloadRef.current?.result || null,
          sqlError: sqlPayloadRef.current?.error || null
        } : {})
      }, {
        withCredentials: true,
        timeout: 60000
      });
      data = result.data;
    } catch (apiError) {
      console.log("[interview] submit-answer failed:", apiError?.message);
      data = null;
    }
    await beatPromise;
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    try {
      const evaluationFailed = !data;
      const {
        ack,
        isLast,
        nextQuestion,
        testResults,
        testsPassedCount,
        testsTotalCount
      } = data || {};
      const effectiveIsLast = evaluationFailed ? isLastQuestion : !!isLast;
      if (!evaluationFailed) {
        if (isCodingQuestion || isSqlQuestion) {
          setSubmitTestResults({
            results: testResults || [],
            passed: testsPassedCount ?? 0,
            total: testsTotalCount ?? 0
          });
        }
        if (!isLast && nextQuestion) {
          setQuestions(prev => [...prev, nextQuestion]);
        }
        setIsLastQuestion(!!isLast);
      }
      const spokenReply = buildSpokenReply({
        ack: evaluationFailed ? null : ack,
        isLast: effectiveIsLast,
        isCodingQuestion,
        isSqlQuestion,
        userName
      });
      setFeedback(spokenReply);
      if (terminatedRef.current) return;
      await speakText(spokenReply, activeSpeaker);
      if (terminatedRef.current) return;
      if (effectiveIsLast) {
        await finishInterview();
        return;
      }
      setAnswer("");
      setFeedback("");
      setSubmitTestResults(null);
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.log("[interview] advance failed:", error);
      try {
        if (isLastQuestion) await finishInterview();else setCurrentIndex(prev => prev + 1);
      } catch {}
    } finally {
      setIsSubmitting(false);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };
  const skipQuestion = async () => {
    if (isSubmitting) return;
    if (!currentQuestion) return;
    if (isIntroPhase || isAIPlaying) return;
    if (isTerminated || fullscreenWarning) return;
    clearAllVoiceTimers();
    stopMic();
    voiceAnswer.stop();
    confidence.cancelAnswer();
    setIsSubmitting(true);
    setErrorMessage("");
    setFeedback("");
    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer: "",
        timeTaken: 0,
        skipped: true
      }, {
        withCredentials: true,
        timeout: 60000
      });
      const {
        feedback: fb,
        isLast,
        nextQuestion
      } = result.data;
      if (!isLast && nextQuestion) {
        setQuestions(prev => [...prev, nextQuestion]);
      }
      setIsLastQuestion(!!isLast);
      const spokenSkip = buildSpokenReply({
        ack: isLast ? "No problem." : fb || "No problem, let's move on.",
        isLast,
        isCodingQuestion: false,
        userName
      });
      setFeedback(spokenSkip);
      if (terminatedRef.current) return;
      await speakText(spokenSkip, activeSpeaker);
      if (terminatedRef.current) return;
      if (isLast) {
        await finishInterview();
        return;
      }
      setAnswer("");
      setFeedback("");
      setSubmitTestResults(null);
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.log(error);
      setErrorMessage(error?.response?.data?.message || "Couldn't skip this question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (fullscreenWarning || isTerminated) return;
    if (timeLeft === 0 && !isSubmitting && !feedback && answerModeRef.current === "type") {
      submitAnswer();
    }
  }, [timeLeft]);
  useEffect(() => {
    return () => {
      wantListeningRef.current = false;
      clearAllVoiceTimers();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      ttsRef.current.cancel();
    };
  }, []);
  if (!proctoringReady) {
    return <div className="min-h-screen relative bg-[#FAFAF9] dark:bg-[#0A0B0D] flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
          .studio-root, .studio-root * { font-family: 'Manrope', sans-serif; }
          .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
          .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
          .viewfinder-corner { position: absolute; width: 20px; height: 20px; z-index: 2; }
          .viewfinder-corner::before, .viewfinder-corner::after { content: ''; position: absolute; background: #E8A94C; box-shadow: 0 0 6px rgba(232,169,76,0.6); }
          .corner-tl { top: 10px; left: 10px; } .corner-tl::before { width: 2px; height: 100%; top: 0; left: 0; } .corner-tl::after { height: 2px; width: 100%; top: 0; left: 0; }
          .corner-tr { top: 10px; right: 10px; } .corner-tr::before { width: 2px; height: 100%; top: 0; right: 0; } .corner-tr::after { height: 2px; width: 100%; top: 0; right: 0; }
          .corner-bl { bottom: 10px; left: 10px; } .corner-bl::before { width: 2px; height: 100%; bottom: 0; left: 0; } .corner-bl::after { height: 2px; width: 100%; bottom: 0; left: 0; }
          .corner-br { bottom: 10px; right: 10px; } .corner-br::before { width: 2px; height: 100%; bottom: 0; right: 0; } .corner-br::after { height: 2px; width: 100%; bottom: 0; right: 0; }
          @keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
          .live-dot { animation: livePulse 1.8s ease-in-out infinite; }
          @keyframes speakPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.028); } }
          .speaking-card { animation: speakPulse 1.15s ease-in-out infinite; }
        `}</style>

        <motion.div initial={{
        opacity: 0,
        y: 16
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="studio-root w-full max-w-2xl bg-white dark:bg-[#0F1115] rounded-[28px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] border border-[#E8E6E1] dark:border-[#1E2229] overflow-hidden">
          <div className="h-px bg-linear-to-r from-transparent via-[#9A7B24]/40 to-transparent dark:via-[#E8A94C]/30" />
          <div className="p-7 sm:p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rotate-45 bg-[#9A7B24] dark:bg-[#E8A94C]" />
                <span className="font-mono-studio text-[11px] tracking-[0.22em] text-[#9A7B24] dark:text-[#E8A94C]">PANEL MODE · GREEN ROOM</span>
              </div>
              <span className="font-mono-studio text-[10px] tracking-[0.14em] text-[#8A929C] dark:text-[#565D68]">2 INTERVIEWERS</span>
            </div>

            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight leading-[1.08]">
              Two interviewers, <span className="italic text-[#9A7B24] dark:text-[#E8A94C]">one session.</span>
            </h2>
            <p className="text-[15px] text-[#3E4650] dark:text-[#9AA1AC] mt-3 leading-relaxed max-w-xl">
              Interviewer A goes deep on technical depth, Interviewer B on communication and fit. They take turns — everything below is optional except fullscreen, once you press start.
            </p>

            <div className="mt-9 border-t border-[#E8E6E1] dark:border-[#1E2229]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-5 border-b border-[#E8E6E1] dark:border-[#1E2229]">
                <span className="font-serif-display italic text-lg text-[#9A7B24] dark:text-[#E8A94C] w-8 shrink-0">01</span>
                <div className="relative w-full sm:w-36 aspect-video rounded-xl overflow-hidden bg-[#14171B] dark:bg-black shrink-0 ring-1 ring-black/20 dark:ring-black/30">
                  {cameraStream ? <video ref={selfVideoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" /> : <div className="w-full h-full flex items-center justify-center bg-[#F5F4F1] dark:bg-black">
                      <span className="font-mono-studio text-[9px] tracking-[0.22em] text-[#8A929C] dark:text-[#565D68]">NO SIGNAL</span>
                    </div>}
                  <span className="absolute top-2 left-2 font-mono-studio text-[8px] tracking-[0.18em] text-white/70 bg-black/50 px-1.5 py-0.5 rounded">PREVIEW</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <p className="text-sm font-semibold text-[#14171B] dark:text-[#EDEEF0]">Camera</p>
                    <span className={`font-mono-studio text-[9px] tracking-[0.16em] px-2 py-0.5 rounded-full border ${cameraStream ? "text-[#9A7B24] dark:text-[#E8A94C] border-[#C99E41]/40 dark:border-[#E8A94C]/40 bg-[#C99E41]/10 dark:bg-[#E8A94C]/8" : "text-[#8A929C] dark:text-[#565D68] border-[#E8E6E1] dark:border-[#262B34]"}`}>
                      {cameraStream ? "READY" : "NOT SET"}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B636E] dark:text-[#8B92A0] mt-1">Lets the panel read the room. Eye-contact tracking needs it.</p>
                  {cameraError && <p className="text-xs text-amber-700 dark:text-amber-400 mt-1.5">{cameraError}</p>}
                </div>
                <button onClick={requestCamera} disabled={isRequestingCamera || !!cameraStream} className="shrink-0 text-xs font-semibold px-4 py-2.5 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] disabled:opacity-50 hover:opacity-90 transition">
                  {cameraStream ? "Enabled" : isRequestingCamera ? "Requesting..." : "Enable camera"}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-5 border-b border-[#E8E6E1] dark:border-[#1E2229]">
                <span className="font-serif-display italic text-lg text-[#9A7B24] dark:text-[#E8A94C] w-8 shrink-0">02</span>
                <div className="hidden sm:block w-36 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <p className="text-sm font-semibold text-[#14171B] dark:text-[#EDEEF0]">Location</p>
                    <span className={`font-mono-studio text-[9px] tracking-[0.16em] px-2 py-0.5 rounded-full border ${locationShared ? "text-[#9A7B24] dark:text-[#E8A94C] border-[#C99E41]/40 dark:border-[#E8A94C]/40 bg-[#C99E41]/10 dark:bg-[#E8A94C]/8" : "text-[#8A929C] dark:text-[#565D68] border-[#E8E6E1] dark:border-[#262B34]"}`}>
                      {locationShared ? "READY" : "NOT SET"}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B636E] dark:text-[#8B92A0] mt-1">Approximate coordinates only, shared once.</p>
                  {locationError && <p className="text-xs text-amber-700 dark:text-amber-400 mt-1.5">{locationError}</p>}
                </div>
                <button onClick={requestLocation} disabled={locationShared} className="shrink-0 text-xs font-semibold px-4 py-2.5 rounded-full border border-[#E8E6E1] dark:border-[#262B34] text-[#3E4650] dark:text-[#EDEEF0] disabled:opacity-50 transition hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50">
                  {locationShared ? "Shared" : "Share location"}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-5 border-b border-[#E8E6E1] dark:border-[#1E2229]">
                <span className="font-serif-display italic text-lg text-[#9A7B24] dark:text-[#E8A94C] w-8 shrink-0">03</span>
                <div className="hidden sm:block w-36 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <p className="text-sm font-semibold text-[#14171B] dark:text-[#EDEEF0]">Screen share</p>
                    <span className={`font-mono-studio text-[9px] tracking-[0.16em] px-2 py-0.5 rounded-full border ${screenShareActive ? "text-[#9A7B24] dark:text-[#E8A94C] border-[#C99E41]/40 dark:border-[#E8A94C]/40 bg-[#C99E41]/10 dark:bg-[#E8A94C]/8" : "text-[#8A929C] dark:text-[#565D68] border-[#E8E6E1] dark:border-[#262B34]"}`}>
                      {screenShareActive ? "READY" : "NOT SET"}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B636E] dark:text-[#8B92A0] mt-1">Optional, mirrors real panel technical rounds.</p>
                </div>
                <button onClick={requestScreenShare} disabled={screenShareActive} className="shrink-0 text-xs font-semibold px-4 py-2.5 rounded-full border border-[#E8E6E1] dark:border-[#262B34] text-[#3E4650] dark:text-[#EDEEF0] disabled:opacity-50 transition hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50">
                  {screenShareActive ? "Shared" : "Share screen"}
                </button>
              </div>
            </div>

            <div className="mt-7 border-l-2 border-[#C99E41] dark:border-[#E8A94C] pl-4 py-0.5">
              <p className="font-mono-studio text-[10px] tracking-[0.22em] text-[#9A7B24] dark:text-[#E8A94C] mb-1.5">HOUSE RULES</p>
              <p className="text-xs text-[#3E4650] dark:text-[#9AA1AC] leading-relaxed">
                The interview runs in fullscreen. After <strong className="text-[#14171B] dark:text-[#EDEEF0]">{MAX_FULLSCREEN_EXITS} exits</strong> the session ends automatically. Tab switches are logged too.
              </p>
            </div>

            <motion.button onClick={startInterviewFromGate} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
              className="mt-7 w-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-semibold py-4 rounded-full shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] hover:opacity-90 transition flex items-center justify-center gap-2.5">
              Start Panel Interview
              <BsArrowRight size={16} />
            </motion.button>
            <p className="font-mono-studio text-[10px] tracking-[0.22em] text-[#8A929C] dark:text-[#565D68] text-center mt-4">
              TECHNICAL + BEHAVIORAL · ALTERNATING TURNS
            </p>
          </div>
        </motion.div>
      </div>;
  }
  return <div className="min-h-screen relative bg-[#FAFAF9] dark:bg-[#0A0B0D] flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .studio-root, .studio-root * { font-family: 'Manrope', sans-serif; }
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
        .film-grain { position: absolute; inset: 0; pointer-events: none; opacity: 0.035; mix-blend-mode: overlay; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        @keyframes livePulse { 0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(232,169,76,0.5); } 50% { opacity: 0.55; box-shadow: 0 0 0 4px rgba(232,169,76,0); } }
        .live-dot { animation: livePulse 1.8s ease-in-out infinite; }
        .studio-select { -webkit-appearance: none; appearance: none; }
        .lang-select-wrap:hover .lang-caret { color: #E8A94C; }
        .speaker-active { border-color: var(--accent) !important; box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent); }

        @keyframes voiceRing { 0% { transform: scale(0.85); opacity: 0.65; } 100% { transform: scale(1.65); opacity: 0; } }
        .voice-ring { animation: voiceRing 1.9s ease-out infinite; }
        .voice-ring-2 { animation: voiceRing 1.9s ease-out 0.6s infinite; }
        @keyframes orbBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
        .orb-live { animation: orbBreathe 2.4s ease-in-out infinite; }
      `}</style>

      <div className="film-grain" />

      {}
      <AnimatePresence>
        {voiceAnswer.countdown !== null && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.2
      }} className="fixed inset-0 z-1000 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md">
            <motion.div key={voiceAnswer.countdown} initial={{
          scale: 0.5,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }} className="font-serif-display text-[9rem] sm:text-[11rem] leading-none tabular-nums bg-linear-to-b from-[#F6D68A] via-[#E8A94C] to-[#B27E2E] bg-clip-text text-transparent drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
              {voiceAnswer.countdown}
            </motion.div>
            {}
            <motion.div key={`bar-${voiceAnswer.countdown}`} className="mt-6 h-1 rounded-full bg-linear-to-r from-[#E8A94C] to-[#F6D68A] origin-left" initial={{
          width: 160,
          opacity: 1
        }} animate={{
          width: 0,
          opacity: 0.6
        }} transition={{
          duration: 1,
          ease: "linear"
        }} />
            <p className="mt-4 text-xs sm:text-sm text-white/70 font-mono-studio tracking-[0.08em] uppercase">
              Speak now to keep answering — staying silent submits
            </p>
          </motion.div>}
      </AnimatePresence>

      <ProctorWarningModal open={faceWarningOpen} variant="faces" onDismiss={() => {
      faceDismissedRef.current = true;
      setFaceWarningOpen(false);
    }} />
      <ProctorWarningModal open={!faceWarningOpen && eyeWarningOpen} variant="eye" onDismiss={() => {
      eyeDismissedRef.current = true;
      setEyeWarningOpen(false);
    }} />
      <AnimatePresence>
        {fullscreenWarning && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{
          opacity: 0,
          scale: 0.94,
          y: 12
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.96
        }} transition={{
          duration: 0.25
        }} className="studio-root w-full max-w-md bg-white dark:bg-[#0F1115] rounded-3xl border border-[#E8E6E1] dark:border-[#1E2229] shadow-2xl overflow-hidden">
              <div className={`h-1.5 ${fullscreenWarning.isFinal ? "bg-red-500" : "bg-[#C99E41] dark:bg-[#E8A94C]"}`} />
              <div className="p-7">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${fullscreenWarning.isFinal ? "bg-red-500/15 text-red-600 dark:text-red-400" : "bg-[#C99E41]/15 dark:bg-[#E8A94C]/15 text-[#9A7B24] dark:text-[#E8A94C]"}`}>
                    <IoWarningOutline size={20} />
                  </div>
                  <span className={`w-1.5 h-1.5 rotate-45 shrink-0 ${fullscreenWarning.isFinal ? "bg-red-500" : "bg-[#9A7B24] dark:bg-[#E8A94C]"}`} />
                  <span className={`font-mono-studio text-[11px] tracking-[0.08em] ${fullscreenWarning.isFinal ? "text-red-600 dark:text-red-400" : "text-[#9A7B24] dark:text-[#E8A94C]"}`}>
                    {fullscreenWarning.isFinal ? "SESSION TERMINATED" : `WARNING ${fullscreenWarning.count} OF ${MAX_FULLSCREEN_EXITS}`}
                  </span>
                </div>
                <h3 className="font-serif-display text-2xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight mb-2.5">
                  {fullscreenWarning.isFinal ? "Interview ended" : "You left fullscreen mode"}
                </h3>
                <p className="text-sm text-[#3E4650] dark:text-[#8B93A1] leading-relaxed mb-6">
                  {fullscreenWarning.isFinal ? <>
                      You exited fullscreen {MAX_FULLSCREEN_EXITS} times. The session
                      has ended and your report will be marked as unsuccessful.
                    </> : <>
                      Your timer is paused right now. If you leave fullscreen{" "}
                      {MAX_FULLSCREEN_EXITS - fullscreenWarning.count} more
                      time{MAX_FULLSCREEN_EXITS - fullscreenWarning.count > 1 ? "s" : ""}
                      , the interview will end automatically.
                    </>}
                </p>
                {fullscreenWarning.isFinal ? <div className="flex items-center gap-2 font-mono-studio text-[#5B636E] dark:text-[#8B92A0] text-xs">
                    <motion.span animate={{
                rotate: 360
              }} transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear"
              }} className="w-3.5 h-3.5 border-2 border-[#8A929C]/30 dark:border-[#8B92A0]/30 border-t-[#8A929C] dark:border-t-[#8B92A0] rounded-full" />
                    Generating your report...
                  </div> : <motion.button onClick={dismissWarningAndResume} whileTap={{
              scale: 0.97
            }} className="w-full flex items-center justify-center gap-2 bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-semibold py-3.5 rounded-full hover:opacity-90 shadow-lg transition">
                    <BsFullscreen size={14} />
                    Return to fullscreen & continue
                  </motion.button>}
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      <div className="studio-root w-full max-w-350 min-h-[80vh] bg-white dark:bg-[#0F1115] rounded-[28px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] border border-[#E8E6E1] dark:border-[#1E2229] flex flex-col overflow-hidden relative">
        <div className="h-px bg-linear-to-r from-transparent via-[#9A7B24]/40 to-transparent dark:via-[#E8A94C]/30 shrink-0" />
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-[#E8E6E1] dark:border-[#1E2229] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#9A7B24] dark:bg-[#E8A94C] shrink-0" />
            <p className="font-mono-studio text-[10px] tracking-[0.22em] text-[#9A7B24] dark:text-[#E8A94C] whitespace-nowrap">LIVE SESSION</p>
            <span className="w-px h-4 bg-[#E8E6E1] dark:bg-[#262B34] shrink-0" />
            <h2 className="font-serif-display text-lg sm:text-xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight truncate">Mock Panel Interview{company ? <span className="text-[#9A7B24] dark:text-[#E8A94C]">{" · "}{company}</span> : null}</h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {ttsProvider && <span className="hidden sm:inline-flex items-center gap-1.5 font-mono-studio text-[10px] tracking-wide px-2.5 py-1.5 rounded-full bg-[#C99E41]/10 dark:bg-[#E8A94C]/10 text-[#9A7B24] dark:text-[#E8A94C] border border-[#C99E41]/25 dark:border-[#E8A94C]/25">
                {ttsProvider === "deepgram" ? "NEURAL VOICE" : "STANDARD VOICE"}
              </span>}
            <span className="font-mono-studio text-[11px] text-[#5B636E] dark:text-[#8B92A0] tracking-wide tabular-nums whitespace-nowrap">
              {String(currentIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
            </span>
            <span className="w-px h-4 bg-[#E8E6E1] dark:bg-[#262B34]" />
            <span className="font-mono-studio text-[11px] text-[#5B636E] dark:text-[#8B92A0] tracking-wide tabular-nums whitespace-nowrap">
              {String(Math.floor((timeLeft || 0) / 60)).padStart(2, "0")}:{String((timeLeft || 0) % 60).padStart(2, "0")}
            </span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {}
        <div className="w-full lg:w-[38%] bg-[#F5F4F1] dark:bg-[#0C0E11] flex flex-col p-6 sm:p-7 space-y-5 border-r border-[#E8E6E1] dark:border-[#1E2229] relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: activePersona.accent }} />
              <span className="font-mono-studio text-[11px] tracking-[0.22em] text-[#5B636E] dark:text-[#8B92A0]">
                {isAIPlaying ? `${activePersona.label} · SPEAKING` : "STANDBY"}
              </span>
            </div>
            <span className="font-mono-studio text-[11px] text-[#8A929C] dark:text-[#565D68]">
              PANEL · 2 INTERVIEWERS
            </span>
          </div>

          {}
          <div className="grid grid-cols-2 gap-3">
            {["interviewerA", "interviewerB"].map(key => {
            const persona = getPersona(key);
            const isActive = activeSpeaker === key;
            const speaking = isActive && isAIPlaying;
            return <div key={key} className={`relative rounded-xl overflow-hidden bg-[#14171B] dark:bg-[#0A0B0D] ring-1 transition-all duration-500 ${isActive ? "ring-[#C99E41]/60 dark:ring-[#E8A94C]/60 opacity-100" : "ring-[#E8E6E1] dark:ring-white/10 opacity-55"}`}>
                  {!personaVideoReady[key] && <div className="w-full aspect-4/5 animate-pulse bg-[#EDEBE6] dark:bg-[#15181D] flex items-center justify-center">
                      <span className="font-mono-studio text-[8px] tracking-[0.24em] text-[#8A929C] dark:text-[#565D68]">LOADING</span>
                    </div>}
                  <video src={persona.video} key={persona.video} ref={key === "interviewerA" ? videoRefA : videoRefB} muted playsInline preload="auto" onLoadStart={() => setPersonaVideoReady(r => ({ ...r, [key]: false }))} onLoadedData={() => setPersonaVideoReady(r => ({ ...r, [key]: true }))} className={`w-full h-auto object-cover aspect-4/5 transition-opacity duration-700 ${personaVideoReady[key] ? "opacity-100" : "opacity-0 absolute inset-0"}`} />
                  {speaking && personaVideoReady[key] && <span className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/55 backdrop-blur px-1.5 py-0.5 rounded">
                      <span className="w-1 h-1 rotate-45" style={{
                  backgroundColor: persona.accent
                }} />
                      <span className="font-mono-studio text-[7px] tracking-[0.18em]" style={{
                  color: persona.accent
                }}>SPEAKING</span>
                    </span>}
                  <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/55 backdrop-blur px-1.5 py-0.5 rounded">
                    <span className="font-mono-studio text-[7px] tracking-[0.16em] text-white/85">{persona.name.toUpperCase()}</span>
                    <span className="w-px h-2 bg-white/25" />
                    <span className="font-mono-studio text-[7px] tracking-[0.12em] text-[#8B92A0]">{persona.subtitle.toUpperCase()}</span>
                  </span>
                </div>;
          })}
          </div>

          {}
          {cameraStream && <div className="relative w-full aspect-video rounded-lg overflow-hidden ring-1 ring-[#E8E6E1] dark:ring-white/20 shadow-lg -mt-1">
              <video ref={pipVideoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
              <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] live-dot" />
              <span className="absolute bottom-1.5 left-1.5 font-mono-studio text-[9px] text-white/80">
                YOU
              </span>
            </div>}
          <div className="flex items-center gap-2 flex-wrap">
            <ConfidenceLivePill analyzer={confidence} />
            {cameraStream && <span className="font-mono-studio text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                CAM ●
              </span>}
            {screenShareActive && <span className="font-mono-studio text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                SCREEN ●
              </span>}
            {fullscreenExitCount > 0 && <span className="font-mono-studio text-[10px] px-2 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                FS EXIT {fullscreenExitCount}/{MAX_FULLSCREEN_EXITS}
              </span>}
          </div>

          <AnimatePresence>
            {tabSwitchCount > 0 && <motion.div key="tab-warning" initial={{
            opacity: 0,
            y: 6
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.3
          }} className="border-l-2 border-amber-500/70 bg-amber-500/[0.07] rounded-r-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rotate-45 bg-amber-500 shrink-0" />
                  <p className="font-mono-studio text-[9px] tracking-[0.22em] text-amber-700 dark:text-amber-400">PROCTOR LOG</p>
                  <span className="font-mono-studio text-[9px] tracking-[0.14em] text-amber-700/70 dark:text-amber-400/70 ml-auto whitespace-nowrap">{tabSwitchCount} RECORDED</span>
                </div>
                <p className="text-xs text-[#8A6A2F] dark:text-[#E8B96A] leading-relaxed">
                  Tab switch detected and logged. Repeated switching is flagged in your final report.
                </p>
              </motion.div>}
          </AnimatePresence>

          {}
          <AnimatePresence mode="wait">
            {subtitle && !(answerMode === "voice" && !isCodingQuestion) && <motion.div key={subtitle} initial={{
            opacity: 0,
            y: 6
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -4
          }} transition={{
            duration: 0.25
          }} className="bg-white dark:bg-[#15181D] border border-[#E8E6E1] dark:border-[#232830] rounded-xl px-4 py-3">
                <p className="text-[#3E4650] dark:text-[#D8DCE3] text-sm leading-relaxed">{subtitle}</p>
              </motion.div>}
          </AnimatePresence>

          {micError && !isCodingQuestion && <div className="bg-[#C99E41]/10 dark:bg-[#211A0F] border border-[#C99E41]/30 dark:border-[#493318] rounded-xl p-3 flex items-start gap-2">
              <IoWarningOutline size={16} className="text-[#9A7B24] dark:text-[#E8A94C] mt-0.5 shrink-0" />
              <p className="text-[#9A7B24] dark:text-[#E8B96A] text-xs leading-relaxed">{micError}</p>
            </div>}

          <div className="bg-white dark:bg-[#131519] border border-[#E8E6E1] dark:border-[#232830] rounded-2xl p-5 space-y-4 shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]">
            <div className="text-center">
              <p className="font-mono-studio text-[10px] tracking-[0.22em] text-[#9A7B24] dark:text-[#E8A94C] mb-2">QUESTION</p>
              <p className="font-serif-display text-4xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight">
                {String(currentIndex + 1).padStart(2, "0")}
              </p>
              <p className="font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#565D68] mt-1.5">
                OF {String(questions.length).padStart(2, "0")}
              </p>
              <div className="mt-3 h-px bg-[#E8E6E1] dark:bg-[#232830] relative overflow-hidden rounded-full">
                <div className="absolute inset-y-0 left-0 transition-all duration-500" style={{
              width: `${questions.length ? (currentIndex + 1) / questions.length * 100 : 0}%`,
              backgroundColor: activePersona.accent
            }} />
              </div>
              <p className="text-[11px] text-[#8A929C] dark:text-[#565D68] mt-3">Interviewers alternate every question</p>
            </div>

            {isHandsOnQuestion && submitTestResults && <>
                <div className="h-px bg-linear-to-r from-transparent via-[#9A7B24]/40 to-transparent dark:via-[#E8A94C]/30" />
                <div className="bg-[#5EC8D8]/8 dark:bg-[#5EC8D8]/6 border border-[#5EC8D8]/30 dark:border-[#5EC8D8]/25 rounded-xl p-4 text-center">
                  <p className="font-serif-display text-2xl text-[#2E8494] dark:text-[#5EC8D8]">
                    {submitTestResults.passed}/{submitTestResults.total}
                  </p>
                  <p className="text-[10px] text-[#8A929C] dark:text-[#565D68] mt-1">{isSqlQuestion ? "expected rows matched" : "test cases passed"}</p>
                </div>
              </>}
          </div>
        </div>

        {}
        <div className="flex-1 flex flex-col p-5 sm:p-8 md:p-10 relative bg-[#FAFAF9] dark:bg-[#0F1115]">
          {errorMessage && <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <IoWarningOutline size={16} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-700 dark:text-red-400 text-xs sm:text-sm leading-relaxed">
                  {errorMessage}
                </p>
              </div>
              <button onClick={() => setErrorMessage("")} className="text-red-600 dark:text-red-400 text-xs font-semibold shrink-0">
                Dismiss
              </button>
            </div>}

          {}
          {!isIntroPhase && !isHandsOnQuestion && <div className="flex justify-center mb-5">
              <div className="inline-flex items-center p-1 rounded-full bg-[#F5F4F1] dark:bg-[#131519] border border-[#E8E6E1] dark:border-[#232830] shadow-sm">
                {[{
              id: "voice",
              label: "Voice",
              hint: "Speak your answer — auto transcribed & submitted"
            }, {
              id: "type",
              label: "Type",
              hint: "Classic typing mode"
            }].map(m => <button key={m.id} type="button" title={m.hint} onClick={() => switchAnswerMode(m.id)} className={`px-5 sm:px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${answerMode === m.id ? "bg-[#14171B] dark:bg-[#EDEEF0] text-[#FAFAF9] dark:text-[#0A0B0D] shadow" : "text-[#8A929C] hover:text-[#14171B] dark:text-[#8B92A0] dark:hover:text-[#EDEEF0]"}`}>
                    {m.label}
                  </button>)}
              </div>
            </div>}

          <AnimatePresence mode="wait">
            {!isIntroPhase && <motion.div key={currentIndex} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.35,
            ease: "easeOut"
          }} className="mb-3 pb-6 border-b border-[#E8E6E1] dark:border-[#1E2229]">
                <p className="font-mono-studio text-[10px] tracking-[0.22em] mb-2.5" style={{
              color: activePersona.accent
            }}>
                  QUESTION {String(currentIndex + 1).padStart(2, "0")}
                </p>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="font-mono-studio inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] tracking-wide" style={{
                backgroundColor: `${activePersona.accent}1A`,
                color: activePersona.accent
              }}>
                    <BsPersonFill size={10} /> {activePersona.label}
                  </span>
                  {currentQuestion?.isFollowUp && <span className="font-mono-studio inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 text-[10px] tracking-wide">
                      <BsLightningCharge size={10} /> Follow-up
                    </span>}
                  {currentQuestion?.difficulty && <span className="font-mono-studio px-2 py-0.5 rounded-md bg-[#F5F4F1] dark:bg-[#181B20] text-[#5B636E] dark:text-[#8B92A0] text-[10px] tracking-wide">
                      {currentQuestion.difficulty}
                    </span>}
                  {isCodingQuestion && <span className="font-mono-studio inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#5EC8D8]/10 text-[#2E8494] dark:text-[#5EC8D8] text-[10px] tracking-wide">
                      <BsCode size={10} /> Coding Round
                    </span>}
                  {isSqlQuestion && <span className="font-mono-studio inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#A78BFA]/10 text-[#6D4FC2] dark:text-[#A78BFA] text-[10px] tracking-wide">
                      <BsTable size={10} /> SQL Round
                    </span>}
                  {currentQuestion?.roundLabel && <span className="font-mono-studio px-2 py-0.5 rounded-md bg-[#C99E41]/10 dark:bg-[#E8A94C]/10 text-[#9A7B24] dark:text-[#E8A94C] border border-[#C99E41]/30 dark:border-[#E8A94C]/30 text-[10px] tracking-wide">
                      {currentQuestion.roundLabel}
                    </span>}
                </div>
                <div className="font-serif-display text-xl sm:text-2xl text-[#14171B] dark:text-[#EDEEF0] leading-snug tracking-tight">
                  {currentQuestion?.question}
                </div>
                <p className="font-mono-studio text-[9px] tracking-[0.22em] text-[#8A929C] dark:text-[#565D68] mt-3">
                  ASKED BY {activePersona.name.toUpperCase()}
                </p>

                {isCodingQuestion && currentQuestion?.description && <div className="mt-5 space-y-3">
                    <p className="text-sm text-[#3E4650] dark:text-[#9AA1AC] whitespace-pre-line leading-relaxed">
                      {currentQuestion.description}
                    </p>
                    {currentQuestion.sampleTestCases?.length > 0 && <div className="space-y-2">
                        {currentQuestion.sampleTestCases.map((tc, i) => <div key={i} className="bg-[#F5F4F1] dark:bg-[#0A0B0D] border border-[#E8E6E1] dark:border-[#1E2229] rounded-lg p-3 font-mono-studio text-xs">
                            <p className="text-[#8A929C] dark:text-[#9AA1AC] mb-1">Example {i + 1}</p>
                            <p className="text-[#3E4650] dark:text-[#C7CBD1]">
                              Input: <span className="whitespace-pre-wrap">{tc.input}</span>
                            </p>
                            <p className="text-[#3E4650] dark:text-[#C7CBD1]">
                              Output: {tc.expectedOutput}
                            </p>
                          </div>)}
                      </div>}
                  </div>}
              </motion.div>}
          </AnimatePresence>

          {isCodingQuestion ? <div className="flex flex-col rounded-2xl border border-[#E8E6E1] dark:border-[#1E2229] overflow-hidden mt-3 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.25)]">
              <div className="flex items-center justify-between bg-[#F5F4F1] dark:bg-[#0C0E11] px-4 py-2.5">
                <span className="font-mono-studio text-[11px] text-[#5B636E] dark:text-[#8B92A0] tracking-[0.08em]">
                  Code Editor
                </span>
                <div className="lang-select-wrap relative">
                  <select value={codeLanguage} onChange={e => handleLanguageChange(e.target.value)} disabled={controlsDisabled} className="studio-select font-mono-studio bg-white dark:bg-[#181B20] text-[#3E4650] dark:text-[#D8DCE3] text-xs rounded-md pl-2.5 pr-6 py-1.5 outline-none disabled:opacity-60 border border-[#E8E6E1] dark:border-[#262B34]">
                    {CODE_LANGUAGES.map(l => <option key={l.value} value={l.value}>
                        {l.label}
                      </option>)}
                  </select>
                  <BsChevronDown size={9} className="lang-caret absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A929C] dark:text-[#565D68] pointer-events-none transition-colors" />
                </div>
              </div>

              <div style={{
            height: "380px"
          }}>
                <Editor height="380px" language={codeLanguage === "cpp" ? "cpp" : codeLanguage} value={answer} onChange={value => setAnswer(value ?? "")} theme={theme === "dark" ? "vs-dark" : "vs"} options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: {
                enabled: false
              },
              readOnly: controlsDisabled,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true
            }} />
              </div>

              {(isRunning || runResults) && <div className="bg-[#F5F4F1] dark:bg-[#0C0E11] border-t border-[#E8E6E1] dark:border-[#1E2229] p-3 max-h-40 overflow-y-auto">
                  {isRunning ? <p className="font-mono-studio text-xs text-[#5B636E] dark:text-[#8B92A0]">Running your code...</p> : <div className="space-y-2">
                      {runResults.map((r, i) => <div key={i} className="flex items-start gap-2 text-xs">
                          {r.passed ? <BsCheckCircleFill className="text-[#4ADE80] mt-0.5 shrink-0" size={12} /> : <BsXCircleFill className="text-[#F87171] mt-0.5 shrink-0" size={12} />}
                          <div className="font-mono-studio text-[#3E4650] dark:text-[#C7CBD1]">
                            <span>Test {i + 1}: {r.passed ? "Passed" : "Failed"}</span>
                            {!r.passed && <div className="text-[#6B7280] mt-0.5">
                                {r.error ? <span className="text-[#B3402E] dark:text-[#F0918D]">{r.error}</span> : <>Expected: {r.expectedOutput} | Got: {r.actualOutput}</>}
                              </div>}
                          </div>
                        </div>)}
                    </div>}
                </div>}
            </div> : isSqlQuestion ? <SqlWorkbench schemaSql={currentQuestion.sqlSchema} disabled={controlsDisabled} onPayload={p => {
              sqlPayloadRef.current = p;
            }} /> : answerMode === "voice" ? <VoiceAnswerPanel voice={voiceAnswer} onRepeat={handleRepeatQuestion} onSwitchToType={() => switchAnswerMode("type")} analyzing={isAnalyzing && !isHandsOnQuestion} analysisProgress={analysisProgress} headerChips={<div className="relative z-10 flex items-center gap-3 mb-6">
                  {["interviewerA", "interviewerB"].map(key => {
            const p = getPersona(key);
            const isActive = activeSpeaker === key;
            return <div key={key} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F4F1] dark:bg-white/5 border border-[#E8E6E1] dark:border-white/10" style={isActive ? {
              borderColor: p.accent
            } : undefined}>
                        <span className="w-1.5 h-1.5 rotate-45" style={{
                backgroundColor: p.accent
              }} />
                        <span className="font-mono-studio text-[10px] tracking-[0.08em] text-[#3E4650] dark:text-[#C7CBD1] uppercase">
                          {p.label}
                        </span>
                      </div>;
          })}
                </div>} /> : isAnalyzing ? <div className="flex-1 mt-3 relative overflow-hidden rounded-3xl bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#1E2229] p-6 sm:p-8 flex flex-col items-center justify-center min-h-95">
              <div className="absolute inset-0 pointer-events-none hidden dark:block" style={{
            background: "radial-gradient(ellipse 65% 55% at 50% 38%, rgba(232,169,76,0.14), transparent 70%)"
          }} />
              <AnalysisOverlay progress={analysisProgress} />
            </div> : <div className="flex-1 mt-3 flex flex-col min-h-70">
              <div className="flex items-center justify-between px-1 pb-2">
                <span className="font-mono-studio text-[10px] tracking-[0.22em] uppercase text-[#5B636E] dark:text-[#8B92A0]">
                  Your answer
                </span>
                <span className="font-mono-studio text-[10px] tracking-[0.15em] text-[#8A929C] dark:text-[#565D68] tabular-nums">
                  {answer.trim() ? answer.trim().split(/\s+/).length : 0} words
                </span>
              </div>
              <textarea placeholder="Type your answer here…" onChange={e => setAnswer(e.target.value)} value={answer} disabled={controlsDisabled} className="flex-1 bg-white dark:bg-[#0C0E11] rounded-xl p-5 sm:p-6 border border-[#E8E6E1] dark:border-[#1E2229] text-[#14171B] dark:text-[#EDEEF0] placeholder:text-[#8A929C] dark:placeholder:text-[#565D68] text-base leading-relaxed resize-none focus:border-[#9A7B24] dark:focus:border-[#E8A94C] focus:outline-none transition-all duration-200 disabled:opacity-60" />
            </div>}

          <AnimatePresence>
            {inactivityWarning && !isCodingQuestion && !isSqlQuestion && <motion.div initial={{
            opacity: 0,
            y: 8
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -8
          }} className="mt-4 relative overflow-hidden bg-white dark:bg-[#131519] border-2 border-[#C99E41]/50 dark:border-[#E8A94C]/45 rounded-2xl px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rotate-45 bg-[#9A7B24] dark:bg-[#E8A94C] shrink-0 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono-studio text-[9px] font-bold tracking-[0.24em] text-[#9A7B24] dark:text-[#E8A94C] mb-0.5">STILL THERE?</p>
                    <p className="text-[#3E4650] dark:text-[#9AA1AC] text-sm leading-snug">
                      {STILL_THERE_BANNER}
                    </p>
                  </div>
                  <span className="font-mono-studio text-base font-bold tabular-nums text-[#9A7B24] dark:text-[#E8A94C] shrink-0">
                    {warningSecondsLeft}s
                  </span>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-[#C99E41] dark:bg-[#E8A94C]"
                  initial={false}
                  animate={{ width: `${(warningSecondsLeft / (INACTIVITY_GRACE_MS / 1000)) * 100}%` }}
                  transition={{ duration: 0.9, ease: "linear" }}
                />
              </motion.div>}
          </AnimatePresence>

          {!feedback ? answerMode === "voice" && !isHandsOnQuestion ? (null) : <div className="flex items-center gap-3 mt-6">
              {!isHandsOnQuestion && <motion.button onClick={toggleMic} whileTap={{
            scale: 0.92
          }} disabled={controlsDisabled} className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center rounded-full shadow-lg disabled:opacity-60 transition-all duration-200 ${isMicOn ? "bg-[#14171B] dark:bg-[#EDEEF0] text-[#FAFAF9] dark:text-[#0A0B0D]" : "bg-[#F5F4F1] dark:bg-[#181B20] text-[#8A929C] dark:text-[#8B92A0] border border-[#E8E6E1] dark:border-[#262B34]"}`}>
                  {isMicOn ? <FaMicrophone size={19} /> : <FaMicrophoneSlash size={19} />}
                </motion.button>}

              {isCodingQuestion && <motion.button onClick={runCode} disabled={controlsDisabled || isRunning} whileTap={{
            scale: 0.96
          }} whileHover={{
            y: -1
          }} className="shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-4 rounded-full border border-[#5EC8D8]/40 text-[#2E8494] dark:text-[#5EC8D8] font-medium hover:bg-[#5EC8D8]/8 dark:hover:bg-[#5EC8D8]/5 transition-all duration-200 disabled:opacity-60">
                  <BsPlayFill size={16} />
                  <span className="hidden sm:inline">{isRunning ? "Running..." : "Run"}</span>
                </motion.button>}

              <motion.button onClick={submitAnswer} disabled={controlsDisabled} whileTap={{
            scale: 0.97
          }} whileHover={{
            y: -1
          }} className="flex-1 bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-semibold py-3 sm:py-4 rounded-full shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] hover:opacity-90 transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting ? <>
                    <motion.span animate={{
                rotate: 360
              }} transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear"
              }} className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full" />
                    {isCodingQuestion ? "Running tests & reviewing..." : isSqlQuestion ? "Checking your result..." : `${activePersona.label} is evaluating...`}
                  </> : isCodingQuestion ? "Submit Code" : isSqlQuestion ? "Submit Query" : "Submit Answer"}
              </motion.button>

              <motion.button onClick={skipQuestion} disabled={controlsDisabled} whileTap={{
            scale: 0.92
          }} whileHover={{
            y: -1
          }} className="shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-4 rounded-full border border-[#E8E6E1] dark:border-[#262B34] text-[#3E4650] dark:text-[#8B92A0] font-medium hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 transition-all duration-200 disabled:opacity-60">
                <BsSkipForward size={16} />
                <span className="hidden sm:inline">Skip</span>
              </motion.button>
            </div> : <motion.div initial={{
          opacity: 0,
          y: 6
        }} animate={{
          opacity: 1,
          y: 0
        }} className="mt-6 bg-white dark:bg-[#131519] border border-[#E8E6E1] dark:border-[#232830] p-5 rounded-2xl shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]" style={{
          borderColor: `${activePersona.accent}4D`
        }}>
              {answerMode === "voice" && !isHandsOnQuestion ? (<div className="flex items-center gap-3 mb-4">
                  <span className="w-2 h-2 rotate-45 shrink-0" style={{
                backgroundColor: activePersona.accent
              }} />
                  <p className="font-mono-studio text-xs tracking-[0.2em] uppercase" style={{
              color: activePersona.accent
            }}>
                    {activePersona.label} is speaking…
                  </p>
                </div>) : <p className="text-[#14171B] dark:text-[#EDEEF0] font-medium mb-4 leading-relaxed">
                  {feedback}
                </p>}
              {isLastQuestion ? <div className="py-2">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-1.5 h-1.5 rotate-45 shrink-0" style={{
                backgroundColor: activePersona.accent
              }} />
                    <p className="font-mono-studio text-[10px] tracking-[0.24em]" style={{
                color: activePersona.accent
              }}>SESSION COMPLETE</p>
                  </div>
                  <p className="font-serif-display text-2xl text-[#14171B] dark:text-[#EDEEF0] tracking-tight mb-2">Wrapping up your report</p>
                  <p className="text-sm text-[#3E4650] dark:text-[#8B92A0] mb-5">Scoring your answers and compiling your feedback.</p>
                  <div className="h-px bg-[#E8E6E1] dark:bg-[#232830] relative overflow-hidden rounded-full">
                    <motion.div className="absolute inset-y-0 left-0 w-1/3" style={{
                backgroundColor: activePersona.accent
              }} animate={{
                x: ["-100%", "300%"]
              }} transition={{
                repeat: Infinity,
                duration: 1.4,
                ease: "easeInOut"
              }} />
                  </div>
                  <p className="font-mono-studio text-[9px] tracking-[0.22em] text-[#8A929C] dark:text-[#565D68] mt-3">FINALISING</p>
                </div> : <div className="flex items-center gap-2 font-mono-studio text-xs tracking-wide" style={{
            color: activePersona.accent
          }}>
                <motion.span animate={{
              rotate: 360
            }} transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear"
            }} className="w-3.5 h-3.5 border-2 rounded-full" style={{
              borderColor: `${activePersona.accent}4D`,
              borderTopColor: activePersona.accent
            }} />
                Moving to the next question...
              </div>}
            </motion.div>}
        </div>
        </div>
      </div>
    </div>;
}
export default Step2PanelInterview;
