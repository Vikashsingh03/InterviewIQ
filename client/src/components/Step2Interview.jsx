// ====================================================================
// InterviewIQ voice-to-voice — FINAL BUILD 2026-09-22-D
// New in D: instant commands (first-interim fire, utterance-anchored
// matching via ../utils/voiceCommands), pure-voice UI — no transcript text,
// no AI reply text, no subtitles in voice mode (speaking indicator instead).
// If you do NOT see this header, you are looking at an OLD cached copy.
// ====================================================================
import React, { useEffect, useRef, useState } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import { motion, AnimatePresence } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from "../App";
import { createRecognition } from "../utils/speechRecognition";
import { createTts } from "../utils/neuralTts";
import { useVoiceAnswer } from "../hooks/useVoiceAnswer";
import { getVoiceCommand } from "../utils/voiceCommands";
import {
  BsStars,
  BsSpeedometer2,
  BsSkipForward,
  BsCode,
  BsPlayFill,
  BsCheckCircleFill,
  BsXCircleFill,
  BsChevronDown,
  BsFullscreen,
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

// leaving fullscreen this many times ends the interview
const MAX_FULLSCREEN_EXITS = 3;

// A real interviewer never shows a live scorecard (pace / filler words)
// after each answer, so it is hidden by default. The numbers are still
// saved and appear in the final report. Set to true to bring the card back.
const SHOW_LIVE_DELIVERY_CARD = false;

// A real interviewer doesn't read out a verdict after every answer. They
// react briefly ("okay, got it") and move straight on; detailed feedback
// lives in the final report. `ack` comes from the server (it references
// something the candidate actually said); the fallbacks cover paths where
// the server sends none (skips, empty answers, coding questions).
const buildSpokenReply = ({ ack, isLast, isCodingQuestion, userName }) => {
  const base =
    ack ||
    (isCodingQuestion
      ? "Thanks, I've noted your solution."
      : "Alright, let's move on.");
  return isLast
    ? `${base} That was my last question. Thank you for your time, ${userName}.`
    : base;
};

// ---- conversational voice engine tuning ----
// how long to wait, after the candidate's last spoken word, before treating
// their answer as "finished" and auto-submitting it. Lower = snappier but
// risks cutting someone off mid-thought; higher = safer but slower to advance.
// A normal answer waits this long after the last word. Short answers
// (under SHORT_ANSWER_WORDS) wait longer, because people pause to think
// after a sentence or two and shouldn't be cut off.
const SILENCE_AUTO_SUBMIT_MS = 5000;
const SHORT_ANSWER_WORDS = 15;
const SILENCE_AUTO_SUBMIT_SHORT_MS = 9000;
// total silence (no speech at all) before the AI checks in
const INACTIVITY_WARNING_MS = 10000;
// grace window after the check-in before the AI moves on by itself
const INACTIVITY_GRACE_MS = 15000;
// after the candidate says "wait", stay quiet for this long before checking in
const WAIT_EXTENSION_MS = 30000;
// short utterances matching these are treated as voice COMMANDS, not part
// of the answer — capped at COMMAND_MAX_WORDS so a genuine long answer that
// happens to contain the word "wait" is never swallowed as a command
const REPEAT_COMMAND_REGEX =
  /\b(repeat|say that again|didn'?t (hear|catch)|come again|pardon|one more time)\b/i;
const WAIT_COMMAND_REGEX =
  /\b(wait|hold on|give me (a )?(second|minute|sec|moment)|one (sec|second|minute)|hang on)\b/i;
const PRESENCE_REGEX = /\b(yes|yeah|i'?m here|still here|here|okay|ok)\b/i;
// also matches how Chrome commonly mishears "skip this question"
// ("just give this question"); "skip list" is excluded so a real answer
// about the data structure is never treated as a command
const SKIP_COMMAND_REGEX =
  /\b(skip(?:ped|ping)?(?!\s*list)|next question|move on|pass (on )?this|go to (the )?next|(just|scape|skit|ski) (give )?(this|the) question|leave this question)\b/i;
const COMMAND_MAX_WORDS = 8;

// analysis beat after every submitted answer: the AI visibly "thinks" for
// nine seconds while the evaluation runs, then responds and moves on
const ANALYSIS_MS = 9000;

// post-transcription safety net for voice commands — imported from
// ../utils/voiceCommands so the real-time spotter and this check always agree.
// The hook's spotter catches "repeat" / "skip" / "wait" on the first interim
// result when the browser's speech recognition cooperates — but on machines
// where it doesn't, the command would otherwise be transcribed and submitted
// as a real answer (exactly the "repeat this question got submitted" bug).
// So after Deepgram returns the transcript we check once more: a short,
// command-shaped utterance is NEVER submitted — it is handled as a command
// instead. Deterministic, no browser dependency.

// ---------------------------------------------------------------------------
// Voice-to-voice answer panel — premium dark-glass UI for the
// record -> Deepgram-transcribe pipeline. Rendered when answerMode === "voice".
// headerChips lets panel mode show its interviewer avatars above the orb.
// ---------------------------------------------------------------------------
// premium 9-second "the interviewer is thinking" moment — gold progress ring
// with a live countdown, shown after every submitted answer while the
// evaluation runs. The interview always advances when the ring completes.
function AnalysisOverlay({ progress = 0 }) {
  const R = 54;
  const C = 2 * Math.PI * R;
  const secondsLeft = Math.max(1, Math.ceil((1 - progress) * 9));
  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-8 select-none">
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full bg-[#E8A94C]/15 blur-2xl animate-pulse" />
        <svg viewBox="0 0 128 128" className="relative w-40 h-40 -rotate-90">
          <defs>
            <linearlinear id="analysisGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F6D68A" />
              <stop offset="100%" stopColor="#E8A94C" />
            </linearlinear>
          </defs>
          <circle cx="64" cy="64" r={R} fill="none" stroke="#262B34" strokeWidth="8" />
          <circle
            cx="64"
            cy="64"
            r={R}
            fill="none"
            stroke="url(#analysisGold)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold text-[#EDEEF0] tabular-nums">
            {secondsLeft}
          </span>
          <span className="font-mono-studio text-[10px] tracking-[0.25em] text-[#565D68] mt-1">
            SEC
          </span>
        </div>
      </div>
      <div className="mt-6 font-mono-studio text-xs tracking-[0.25em] uppercase text-[#E8B96A]">
        Analyzing your answer
      </div>
      <p className="mt-2 text-sm text-[#8B92A0]">
        The interviewer is listening to every word…
      </p>
    </div>
  );
}

function VoiceAnswerPanel({ voice, onRepeat, onSwitchToType, headerChips = null, analyzing = false, analysisProgress = 0 }) {
  // NOTE: voice mode is pure voice — the candidate's transcribed words are
  // deliberately NEVER shown as text (no "You said" box). They speak, the
  // interviewer speaks back. lastTranscript is intentionally not rendered.
  const { status, level, notice, lastCommand } = voice;
  const listening = status === "listening" || status === "countdown";
  const busy = listening || status === "requesting" || status === "transcribing";

  const statusLabel =
    {
      idle: "Get ready…",
      requesting: "Setting up your mic…",
      listening: "Listening — speak your answer",
      countdown: "Wrapping up — stay silent to submit",
      transcribing: "Transcribing your answer…",
      denied: "Mic access blocked",
      error: "Transcription failed",
    }[status] || "Get ready…";

  // 9-second analysis beat — replaces the orb while the AI "thinks"
  if (analyzing) {
    return (
      <div className="flex-1 mt-3 relative overflow-hidden rounded-3xl bg-[#0C0E11] border border-[#1E2229] p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-95">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-linear(ellipse 65% 55% at 50% 38%, rgba(232,169,76,0.14), transparent 70%)",
          }}
        />
        <AnalysisOverlay progress={analysisProgress} />
      </div>
    );
  }

  return (
    <div className="flex-1 mt-3 relative overflow-hidden rounded-3xl bg-[#0C0E11] border border-[#1E2229] p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-95">
      {/* ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-linear(ellipse 65% 55% at 50% 38%, rgba(232,169,76,0.14), transparent 70%)",
        }}
      />
      {headerChips}

      {/* status pill */}
      <div
        className={`relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border transition-all duration-300 ${
          listening
            ? "bg-[#E8A94C]/10 border-[#E8A94C]/40 shadow-[0_0_24px_-6px_rgba(232,169,76,0.55)]"
            : "bg-white/5 border-white/10"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            listening
              ? "bg-[#E8A94C] live-dot"
              : status === "transcribing"
                ? "bg-[#5EC8D8] live-dot"
                : "bg-[#565D68]"
          }`}
        />
        <span className="font-mono-studio text-[11px] tracking-[0.08em] text-[#C7CBD1] uppercase">
          {statusLabel}
        </span>
      </div>

      {/* mic orb */}
      <motion.div
        className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 mb-6"
        animate={listening ? { scale: [1, 1.045, 1] } : { scale: 1 }}
        transition={
          listening
            ? { repeat: Infinity, duration: 2.4, ease: "easeInOut" }
            : { duration: 0.2 }
        }
      >
        {listening && (
          <>
            <span className="voice-ring absolute inset-0 rounded-full border-2 border-[#E8A94C]/60" />
            <span className="voice-ring-2 absolute inset-0 rounded-full border-2 border-[#E8A94C]/40" />
            {/* breathing halo */}
            <motion.span
              className="absolute -inset-4 rounded-full bg-[#E8A94C]/25 blur-2xl"
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            />
          </>
        )}
        <div
          className={`absolute inset-0 rounded-full flex items-center justify-center transition-colors duration-300 ${
            listening
              ? "orb-live bg-linear-to-br from-[#F2C063] via-[#E8A94C] to-[#B27E2E] shadow-[0_0_80px_-10px_rgba(232,169,76,0.8)]"
              : "bg-[#14171C] border border-[#2A2F38]"
          }`}
        >
          {/* inner top highlight for depth */}
          <span className="absolute inset-0 rounded-full bg-linear-to-b from-white/25 via-transparent to-transparent pointer-events-none" />
          {status === "transcribing" ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-[3px] border-[#E8A94C]/25 border-t-[#E8A94C] rounded-full"
            />
          ) : (
            <FaMicrophone
              size={32}
              className={listening ? "text-[#0C0E11]" : "text-[#565D68]"}
            />
          )}
        </div>
      </motion.div>

      {/* live waveform */}
      <div
        className="relative z-10 flex items-end justify-center gap-1 h-14 mb-5"
        aria-hidden="true"
      >
        {Array.from({ length: 28 }).map((_, i) => {
          const h =
            6 +
            Math.min(1, level) * 46 * (0.35 + 0.65 * Math.abs(Math.sin(i * 1.7)));
          return (
            <div
              key={i}
              className="w-1.5 rounded-full transition-[height] duration-150"
              style={{
                height: `${busy ? h : 6}px`,
                opacity: busy ? 0.95 : 0.22,
                background: busy
                  ? "linear-linear(to top, #B27E2E, #E8A94C 60%, #F6D68A)"
                  : "#2A2F38",
              }}
            />
          );
        })}
      </div>

      {/* helper notice (e.g. "I didn't catch that — please speak again.") */}
      {notice && (
        <p className="relative z-10 text-sm text-[#E8B96A] mb-3 max-w-md">
          {notice}
        </p>
      )}

      {/* mic blocked -> nudge to type mode */}
      {status === "denied" && (
        <div className="relative z-10 w-full max-w-md bg-[#E8A94C]/8 border border-[#E8A94C]/25 rounded-2xl px-4 py-4 mb-4">
          <p className="text-sm text-[#E8B96A] mb-3 leading-relaxed">
            Your browser blocked mic access. Allow the microphone, then{" "}
            <button
              type="button"
              onClick={onRepeat}
              className="underline font-semibold"
            >
              try again
            </button>
            , or answer by typing instead.
          </p>
          <button
            type="button"
            onClick={onSwitchToType}
            className="w-full py-2.5 rounded-xl bg-[#E8A94C] text-[#0C0E11] text-sm font-bold hover:bg-[#F0B95E] transition"
          >
            ⌨ Type instead
          </button>
        </div>
      )}

      {/* transcription error -> type mode fallback */}
      {status === "error" && (
        <div className="relative z-10 w-full max-w-md bg-red-500/8 border border-red-500/25 rounded-2xl px-4 py-4 mb-4">
          <p className="text-sm text-red-300 mb-3 leading-relaxed">
            Transcription isn&apos;t working right now. Your interview is
            safe — switch to typing and keep going.
          </p>
          <button
            type="button"
            onClick={onSwitchToType}
            className="w-full py-2.5 rounded-xl bg-white text-[#0C0E11] text-sm font-bold hover:bg-gray-100 transition"
          >
            ⌨ Switch to Type mode
          </button>
        </div>
      )}

      {/* voice-command flash — instant feedback when "repeat"/"skip"/"wait" is heard */}
      {lastCommand && (
        <motion.div
          key={lastCommand.at}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 font-mono-studio text-[11px] tracking-wide px-4 py-2 rounded-xl border border-[#E8A94C]/40 bg-[#E8A94C]/10 text-[#E8B96A] shadow-[0_0_24px_-6px_rgba(232,169,76,0.5)]"
        >
          {lastCommand.id === "repeat" && "🔁 Repeating the question…"}
          {lastCommand.id === "skip" && "⏭ Skipping…"}
          {lastCommand.id === "wait" && "⏸ Take your time…"}
        </motion.div>
      )}

    </div>
  );
}

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, userName } = interviewData;

  const [questions, setQuestions] = useState(interviewData.questions || []);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const [micError, setMicError] = useState("");
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  // ---- conversational voice engine state ----
  // textarea is hidden by default — voice is the primary input, typing is
  // an explicit fallback the candidate can reveal
  const [showAnswerBox, setShowAnswerBox] = useState(false);
  // ---- answer input mode ----
  // "voice" (default): record -> Deepgram transcribe -> auto-submit.
  // "type": the classic textarea UI, exactly as before. showAnswerBox stays
  // synced so every legacy code path keeps working untouched.
  const [answerMode, setAnswerMode] = useState("voice");
  const answerModeRef = useRef("voice");
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [warningSecondsLeft, setWarningSecondsLeft] = useState(15);
  // words still being spoken (not yet finalized by the browser), shown live
  const [interimText, setInterimText] = useState("");

  const silenceTimerRef = useRef(null); // pause-after-speech -> auto-submit
  const inactivityTimerRef = useRef(null); // total silence -> "are you there?"
  const graceTimerRef = useRef(null); // after warning -> auto-advance
  const warningIntervalRef = useRef(null); // ticks warningSecondsLeft down
  const inactivityWarningRef = useRef(false);
  const hasSpokenRef = useRef(false);

  // "latest value" refs — the SpeechRecognition object and its callbacks are
  // set up once on mount, so anything they read must come through a ref,
  // otherwise it would forever see only the very first render's values
  const currentQuestionRef = useRef(null);
  const isMicOnRef = useRef(true);
  const submitAnswerRef = useRef(() => {});
  const skipQuestionRef = useRef(() => {});
  const speakTextRef = useRef(() => Promise.resolve());
  const isAIPlayingRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const isIntroPhaseRef = useRef(true);
  const isCodingQuestionRef = useRef(false);
  // true while we WANT the mic open; lets recognition.onend tell a
  // deliberate stop() apart from Chrome silently ending the session
  const wantListeningRef = useRef(false);
  const showAnswerBoxRef = useRef(false);
  const answerRef = useRef("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 9-second analysis beat state — the premium "AI is thinking" moment
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [voiceGender, setVoiceGender] = useState("female");
  // "deepgram" (neural) | "browser" (standard) — resolved once per interview
  const [ttsProvider, setTtsProvider] = useState(null);
  const ttsRef = useRef(null);
  const browserSpeakRef = useRef(() => Promise.resolve());
  const browserVoiceMapRef = useRef({ male: null, female: null });

  // ---- voice-to-voice answer capture (record -> Deepgram transcribe) ----
  // The transcript flows into the EXISTING submit pipeline through
  // submitAnswerRef, so evaluation / ack speech / auto-advance are untouched.
  const handleVoiceNoSpeechRef = useRef(() => {});
  const handleVoiceCommandRef = useRef(() => {});
  const voiceAnswer = useVoiceAnswer({
    apiUrl: ServerUrl,
    onTranscript: (transcript) => {
      // safety net: a transcribed command is handled as a command, never
      // submitted as an answer — the interviewer *responds* instead
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
    // real-time voice commands — "repeat" / "skip" / "wait" act instantly,
    // bypassing the wrap-up countdown, like a face-to-face interviewer
    onCommand: (cmd) => {
      handleVoiceCommandRef.current(cmd);
    },
  });
  const [subtitle, setSubtitle] = useState("");
  const [lastDeliveryMetrics, setLastDeliveryMetrics] = useState(null);
  const [codeLanguage, setCodeLanguage] = useState("javascript");

  // ---- coding-round-specific state ----
  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState(null); // sample test run (Run button)
  const [submitTestResults, setSubmitTestResults] = useState(null); // full grading result

  const [errorMessage, setErrorMessage] = useState("");

  // ---- proctoring state ----
  const [proctoringReady, setProctoringReady] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);

  // ---- fullscreen strike system ----
  // { count, isFinal } — drives the warning modal + the AI's spoken warning
  const [fullscreenWarning, setFullscreenWarning] = useState(null);
  const [isTerminated, setIsTerminated] = useState(false);

  const selfVideoRef = useRef(null);
  const pipVideoRef = useRef(null);
  const screenStreamRef = useRef(null);
  const wasFullscreenRef = useRef(false);

  // refs mirror state for use inside the native fullscreen listener, which
  // otherwise closes over stale values
  const fullscreenExitCountRef = useRef(0);
  const proctoringReadyRef = useRef(false);
  const terminatedRef = useRef(false);
  // true while we're intentionally ending the interview — stops our own
  // exitFullscreen() call from being counted as a violation
  const isFinishingRef = useRef(false);

  const videoRef = useRef(null);
  const answerWindowStartRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const isCodingQuestion = currentQuestion?.type === "coding";

  useEffect(() => {
    proctoringReadyRef.current = proctoringReady;
  }, [proctoringReady]);

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
    isCodingQuestionRef.current = isCodingQuestion;
  }, [isCodingQuestion]);

  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);

  useEffect(() => {
    answerModeRef.current = answerMode;
  }, [answerMode]);

  // "latest function" refs — updated after EVERY render (no dependency
  // array) so frozen callbacks always call the freshest version, which
  // closes over the freshest state (answer, timeLeft, currentIndex, etc.)
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
    } catch {
      // already running — ignore
    }
  };

  const safeStopRecognition = () => {
    wantListeningRef.current = false;
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // already stopped — ignore
    }
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
    const delay =
      words < SHORT_ANSWER_WORDS
        ? SILENCE_AUTO_SUBMIT_SHORT_MS
        : SILENCE_AUTO_SUBMIT_MS;
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
    if (
      isAIPlayingRef.current ||
      isSubmittingRef.current ||
      isCodingQuestionRef.current ||
      showAnswerBoxRef.current || // typing mode: never nag or auto-skip
      terminatedRef.current
    ) {
      return;
    }

    // just ask, no hints. The countdown only begins once the AI has
    // FINISHED speaking, so the candidate always gets the full window
    safeStopRecognition();
    await speakTextRef.current("Are you still there?");
    if (terminatedRef.current) return;

    setInactivityWarning(true);
    inactivityWarningRef.current = true;
    setWarningSecondsLeft(Math.round(INACTIVITY_GRACE_MS / 1000));
    safeStartRecognition();

    warningIntervalRef.current = setInterval(() => {
      setWarningSecondsLeft((s) => (s > 0 ? s - 1 : 0));
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
    await speakTextRef.current(currentQuestionRef.current.question);
    if (terminatedRef.current) return;
    safeStartRecognition();
    armInactivityTimer();
  };

  const handleWaitCommand = async () => {
    if (terminatedRef.current) return;
    clearAllVoiceTimers();
    safeStopRecognition();
    await speakTextRef.current("Ok, take your time.");
    if (terminatedRef.current) return;
    safeStartRecognition();
    armInactivityTimer(WAIT_EXTENSION_MS);
  };

  const handleSkipCommand = () => {
    if (terminatedRef.current) return;
    clearAllVoiceTimers();
    safeStopRecognition();
    skipQuestionRef.current();
  };

  // ---- answer input mode switching ----
  // voice: record -> Deepgram transcribe -> auto-submit (new pipeline).
  // type:  the classic textarea UI, exactly as before (browser dictation,
  //        inactivity check-ins and the question-clock auto-submit all stay).
  const switchAnswerMode = (mode) => {
    if (mode === answerModeRef.current) return;
    if (isIntroPhaseRef.current || terminatedRef.current) return;

    // stop whichever capture path is currently running
    voiceAnswer.stop();
    stopMic();
    clearAllVoiceTimers();
    dismissInactivityWarning();

    answerModeRef.current = mode;
    setAnswerMode(mode);
    const typing = mode === "type";
    showAnswerBoxRef.current = typing;
    setShowAnswerBox(typing);

    if (isCodingQuestionRef.current) return; // the editor is mode-independent
    if (isSubmittingRef.current || isAIPlayingRef.current) return;

    if (typing) {
      if (isMicOnRef.current) {
        hasSpokenRef.current = false;
        startMic();
        armInactivityTimer();
      }
    } else {
      voiceAnswer.start();
    }
  };

  // re-ask the current question out loud, then resume listening
  const handleRepeatQuestion = async () => {
    if (!currentQuestionRef.current || terminatedRef.current) return;
    if (isAIPlayingRef.current || isSubmittingRef.current) return;
    voiceAnswer.stop();
    stopMic();
    clearAllVoiceTimers();
    await speakTextRef.current(currentQuestionRef.current.question);
    if (terminatedRef.current) return;
    if (isCodingQuestionRef.current) return;
    if (answerModeRef.current === "voice") {
      voiceAnswer.start();
    } else if (isMicOnRef.current) {
      startMic();
      armInactivityTimer();
    }
  };

  // voice mode: the candidate went quiet for a long stretch without saying
  // anything — check in out loud, then resume listening
  const handleVoiceNoSpeech = async () => {
    if (terminatedRef.current) return;
    voiceAnswer.stop();
    await speakTextRef.current(
      "Are you still there? Please speak your answer whenever you're ready — or switch to typing if you prefer.",
    );
    if (terminatedRef.current) return;
    if (
      answerModeRef.current === "voice" &&
      !isSubmittingRef.current &&
      !isCodingQuestionRef.current
    ) {
      voiceAnswer.start();
    }
  };

  // "wait" voice command — the candidate needs a breather. Discard the partial
  // recording (nothing worth transcribing yet), acknowledge instantly, and
  // start listening fresh. No countdown, no waiting.
  const handleVoiceWait = async () => {
    if (terminatedRef.current) return;
    voiceAnswer.stop();
    stopMic();
    clearAllVoiceTimers();
    await speakTextRef.current("Take your time.");
    if (terminatedRef.current) return;
    if (
      answerModeRef.current === "voice" &&
      !isSubmittingRef.current &&
      !isCodingQuestionRef.current
    ) {
      voiceAnswer.start();
    }
  };

  // Real-time voice commands from the spotter ("repeat" / "skip" / "wait").
  // They bypass the wrap-up countdown entirely — the parent acts the instant
  // the command is heard, like a face-to-face interviewer would.
  const handleVoiceCommand = (cmd) => {
    if (terminatedRef.current) return;
    if (isSubmittingRef.current || isAIPlayingRef.current) return;
    if (cmd === "repeat") handleRepeatQuestion();
    else if (cmd === "skip") skipQuestion();
    else if (cmd === "wait") handleVoiceWait();
  };

  useEffect(() => {
    handleVoiceNoSpeechRef.current = handleVoiceNoSpeech;
    handleVoiceCommandRef.current = handleVoiceCommand;
  });

  // ---- proctoring: camera ----
  const requestCamera = async () => {
    setCameraError("");
    setIsRequestingCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setCameraStream(stream);
    } catch (err) {
      console.log(err);
      setCameraError(
        "Camera access was denied or isn't available. You can still continue without it.",
      );
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

  // ---- proctoring: one-time location (browsers never expose WiFi network
  // details to web pages — this is just approximate GPS/IP-based coordinates,
  // shared once, with explicit consent) ----
  const requestLocation = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Location isn't supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationShared(true);
        setLocationCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => {
        setLocationError(
          "Location access was denied. You can still continue without it.",
        );
      },
    );
  };

  // ---- proctoring: optional screen share ----
  const requestScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      screenStreamRef.current = stream;
      setScreenShareActive(true);
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        setScreenShareActive(false);
      });
    } catch (err) {
      console.log(err);
      // declined — screen share stays optional, no hard error shown
    }
  };

  // ---- proctoring: fullscreen enforcement ----
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

      // only counts as an "exit" if we were actually in fullscreen before —
      // avoids miscounting the very first (non-fullscreen) render
      if (!wasFullscreenRef.current) return;
      // our own exitFullscreen() at the end of the interview isn't a violation
      if (isFinishingRef.current) return;
      // ignore anything that happens before the interview actually starts
      if (!proctoringReadyRef.current) return;
      // already terminated — no more strikes
      if (terminatedRef.current) return;

      const nextCount = fullscreenExitCountRef.current + 1;
      fullscreenExitCountRef.current = nextCount;
      setFullscreenExitCount(nextCount);

      if (nextCount >= MAX_FULLSCREEN_EXITS) {
        terminatedRef.current = true;
        setIsTerminated(true);
        setFullscreenWarning({ count: nextCount, isFinal: true });
      } else {
        setFullscreenWarning({ count: nextCount, isFinal: false });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // ---- proctoring: tab-switch / window-blur detection ----
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitchCount((c) => c + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // stop all media tracks on unmount so the browser's camera/screen-share
  // indicator turns off even if the candidate closes the tab mid-interview
  useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startInterviewFromGate = () => {
    enterFullscreen();
    setProctoringReady(true);
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const findVoice = (names) =>
        voices.find((v) =>
          names.some((n) => v.name.toLowerCase().includes(n)),
        );
      const femaleVoice = findVoice(["zira", "samantha", "female"]);
      const maleVoice = findVoice(["david", "mark", "male"]);

      // both genders, for the neural-TTS browser fallback path
      browserVoiceMapRef.current = {
        male: maleVoice || voices[0],
        female: femaleVoice || voices[0],
      };

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

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

  // ---- neural interviewer voice ----
  // When the server has a Deepgram key the interviewer speaks with a neural
  // (Aura) voice; otherwise this browser speech-synthesis path is used.
  const browserSpeakText = (chunk, voiceGenderParam) => {
    return new Promise((resolve) => {
      const map = browserVoiceMapRef.current;
      const voice =
        (voiceGenderParam === "male" ? map.male : map.female) || selectedVoice;
      if (!window.speechSynthesis || !voice) {
        resolve();
        return;
      }

      // NB: plain speechSynthesis.cancel() here, NOT ttsRef.current.cancel() —
      // the engine owns the generation counter and this runs inside its speak()
      window.speechSynthesis.cancel();

      const humanText = chunk.replace(/,/g, ", ...").replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = voice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  // always-fresh impl for the engine (it holds a stable wrapper)
  useEffect(() => {
    browserSpeakRef.current = browserSpeakText;
  });

  if (!ttsRef.current) {
    ttsRef.current = createTts({
      // resilience fix: the engine reports a permanent neural->browser
      // fallback so the header badge flips to STANDARD VOICE by itself
      onProviderChange: (p) => setTtsProvider(p),
      getConfig: async () => {
        const res = await axios.get(ServerUrl + "/api/interview/tts-config", {
          withCredentials: true,
        });
        return res.data;
      },
      fetchAudio: async (chunk, voiceGenderParam) => {
        const res = await axios.post(
          ServerUrl + "/api/interview/tts",
          { text: chunk, voiceGender: voiceGenderParam },
          { withCredentials: true, responseType: "arraybuffer" },
        );
        return res.data;
      },
      browser: {
        speak: (chunk, voiceGenderParam) =>
          browserSpeakRef.current(chunk, voiceGenderParam),
        cancel: () => {
          try {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
          } catch {
            /* noop */
          }
        },
      },
    });
  }

  // resolve once per interview for the voice badge in the header
  useEffect(() => {
    let cancelled = false;
    ttsRef.current
      .getProvider()
      .then((p) => {
        if (!cancelled) setTtsProvider(p);
      })
      .catch(() => {
        if (!cancelled) setTtsProvider("browser");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const speakText = (text) => {
    return new Promise(async (resolve) => {
      // cut off anything currently playing (e.g. "repeat that" mid-sentence)
      ttsRef.current.cancel();

      setSubtitle(text);
      setIsAIPlaying(true);
      stopMic();
      voiceAnswer.stop();
      videoRef.current?.play();

      try {
        // hang-proof: if the TTS engine never settles (network stall on the
        // neural voice fetch), the interview must still move on — the
        // candidate is never left hanging on a silent promise
        await Promise.race([
          ttsRef.current.speak(text, voiceGender),
          new Promise((res) => setTimeout(() => res("tts-timeout"), 25000)),
        ]);
      } catch {
        // the engine already fell back to the browser voice — never leave
        // the interview hanging on a TTS failure
      }

      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
      setIsAIPlaying(false);

      setTimeout(() => {
        setSubtitle("");
        resolve();
      }, 300);
    });
  };

  useEffect(() => {
    if (!selectedVoice || !proctoringReady) {
      return;
    }
    if (terminatedRef.current) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        const interviewerName = voiceGender === "male" ? "Marcus" : "Elena";
        await speakText(
          `Hi, I'm ${interviewerName}, and I'll be conducting your interview today. I've spent several years interviewing candidates for roles like this one, so let's have a good conversation.`,
        );
        await speakText(`Alright, let's begin.`);
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        if (isLastQuestion) {
          await speakText("Alright, this might be a bit challenging");
        }
        await speakText(currentQuestion.question);

        // candidate's answer window starts NOW
        answerWindowStartRef.current = Date.now();

        if (currentQuestion.type !== "coding") {
          if (answerModeRef.current === "voice") {
            // voice-to-voice: record the answer, transcribe it with
            // Deepgram, auto-submit after the wrap-up countdown
            voiceAnswer.start();
          } else if (isMicOn) {
            hasSpokenRef.current = false;
            startMic();
            armInactivityTimer();
          }
        }
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex, proctoringReady]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (isSubmitting) return;
    // pause the clock while a fullscreen warning is on screen — it isn't
    // fair to burn the candidate's answer time while they're blocked
    if (fullscreenWarning) return;
    if (isTerminated) return;

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
  }, [isIntroPhase, currentIndex, isSubmitting, fullscreenWarning, isTerminated]);

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
    // Deepgram when the server has a key (far better with accents and
    // technical words), otherwise the browser's own recognition. Both expose
    // the same interface, so everything below works with either.
    const recognition = createRecognition({
      fetchConfig: async () => {
        const res = await axios.get(ServerUrl + "/api/interview/stt-token", {
          withCredentials: true,
        });
        return res.data;
      },
      // project names + skills from the resume, so "BrokerBase" isn't misheard
      keyterms: interviewData.sttKeyterms || [],
    });
    // en-IN understands Indian-accented English far better than en-US
    recognition.lang = "en-IN";
    recognition.maxAlternatives = 3;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      if (
        isAIPlayingRef.current ||
        isSubmittingRef.current ||
        isIntroPhaseRef.current ||
        isCodingQuestionRef.current
      ) {
        return;
      }

      // walk only the results that changed in this event. "final" pieces are
      // committed to the answer; "interim" pieces (still being spoken) are
      // shown live and keep every silence timer pushed back, so the answer is
      // never submitted while the candidate is mid-sentence
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
          // they're talking during the check-in: hold the countdown, the
          // final result decides whether it was "I'm here" or a real answer
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
      // check every alternative Chrome considered, not just its top guess:
      // "skip this question" is often ranked 2nd behind a misheard phrase
      const matchesAny = (re) => finalAlternatives.some((alt) => re.test(alt));

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

      // any speech during the "are you still there?" window counts as
      // presence. A bare "yes / I'm here" is not added to the answer;
      // anything longer is real content and falls through as the answer.
      if (inactivityWarningRef.current) {
        const isPresenceOnly = isShort && PRESENCE_REGEX.test(lower);
        dismissInactivityWarning();
        if (isPresenceOnly) {
          // "yes I'm here": acknowledge out loud, then give them quiet time
          handleWaitCommand();
          return;
        }
      }

      hasSpokenRef.current = true;
      const next = answerRef.current ? answerRef.current + " " + finalText : finalText;
      answerRef.current = next;
      setAnswer(next);

      // in typing mode voice just appends text, no auto-submit / nagging
      if (showAnswerBoxRef.current) return;

      armInactivityTimer();
      armSilenceAutoSubmit();
    };

    // Chrome ends a "continuous" session by itself after a stretch of
    // silence. If we still want the mic open, quietly reopen it.
    recognition.onend = () => {
      if (!wantListeningRef.current) return;
      setTimeout(() => {
        if (
          !wantListeningRef.current ||
          !isMicOnRef.current ||
          isAIPlayingRef.current ||
          isSubmittingRef.current ||
          terminatedRef.current
        ) {
          return;
        }
        try {
          recognition.start();
        } catch {
          // already running: ignore
        }
      }, 250);
    };

    recognition.onerror = (event) => {
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        wantListeningRef.current = false;
      }
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
      wantListeningRef.current = true;
      try {
        recognitionRef.current.start();
        setMicError("");
      } catch {
        // already running — safe to ignore
      }
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

  const finishInterview = async ({ terminatedForMisbehavior = false } = {}) => {
    // set before anything else so our own exitFullscreen() below doesn't
    // register as a violation
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
        terminatedForMisbehavior,
      };

      const result = await axios.post(
        ServerUrl + "/api/interview/finish",
        { interviewId, proctoring },
        { withCredentials: true },
      );

      cameraStream?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      onFinish(result.data);
    } catch (error) {
      console.log(error);
      isFinishingRef.current = false;
      setErrorMessage(
        error?.response?.data?.message ||
          "Couldn't finish the interview. Please try again.",
      );
    }
  };

  // ---- fullscreen strike: speak the warning, or end the interview ----
  useEffect(() => {
    if (!fullscreenWarning) return;

    let cancelled = false;

    const handle = async () => {
      clearAllVoiceTimers();
      stopMic();
      voiceAnswer.stop();
      ttsRef.current.cancel();

      if (fullscreenWarning.isFinal) {
        await speakText(
          `${userName}, you have left fullscreen mode ${MAX_FULLSCREEN_EXITS} times. I have to end this interview here.`,
        );
        if (cancelled) return;
        await finishInterview({ terminatedForMisbehavior: true });
      } else {
        await speakText(
          `Please stay in fullscreen mode. This is warning ${fullscreenWarning.count} of ${MAX_FULLSCREEN_EXITS}. If you leave fullscreen again, the interview will be ended.`,
        );
      }
    };

    handle();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreenWarning]);

  const dismissWarningAndResume = () => {
    enterFullscreen();
    setFullscreenWarning(null);
    if (isCodingQuestion) return;
    if (answerModeRef.current === "voice") {
      setTimeout(() => voiceAnswer.start(), 400);
    } else if (isMicOn) {
      setTimeout(() => startMic(), 400);
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
  // answerOverride lets the voice-to-voice pipeline feed a Deepgram
  // transcript straight in; otherwise the textarea/editor state is used.
  // drives the 9-second analysis ring; resolves when the beat completes
  const runAnalysisBeat = () =>
    new Promise((resolve) => {
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

  const submitAnswer = async (answerOverride) => {
    if (isSubmitting) return;
    if (!currentQuestion) return;
    if (isIntroPhase || isAIPlaying) return;
    if (isTerminated || fullscreenWarning) return;

    clearAllVoiceTimers();
    stopMic();
    voiceAnswer.stop();
    const finalAnswer =
      typeof answerOverride === "string" ? answerOverride : answer;
    setAnswer(finalAnswer);
    answerRef.current = finalAnswer;
    setIsSubmitting(true);
    // 9-second analysis beat (non-coding): the AI visibly "thinks" while the
    // evaluation runs, then responds and moves on — never shorter, never stuck
    const useBeat = !isCodingQuestion;
    if (useBeat) {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
    }
    setErrorMessage("");
    setFeedback("");

    const durationSeconds = answerWindowStartRef.current
      ? Math.max(
          1,
          Math.round((Date.now() - answerWindowStartRef.current) / 1000),
        )
      : currentQuestion.timeLimit - timeLeft;

    // the analysis beat runs in PARALLEL with the evaluation — the interview
    // always advances after the beat, even if the API is slow or dies
    const beatPromise = useBeat ? runAnalysisBeat() : Promise.resolve();
    let data = null;
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer: finalAnswer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
          durationSeconds,
          ...(isCodingQuestion ? { language: codeLanguage } : {}),
        },
        { withCredentials: true, timeout: 60000 },
      );
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
        speakingMetrics,
        testResults,
        testsPassedCount,
        testsTotalCount,
      } = data || {};
      // on evaluation failure we advance with a generic acknowledgement
      // instead of stranding the candidate — the interview never stalls
      const effectiveIsLast = evaluationFailed ? isLastQuestion : !!isLast;

      if (!evaluationFailed) {
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
      }
      const spokenReply = buildSpokenReply({
        ack: evaluationFailed ? null : ack,
        isLast: effectiveIsLast,
        isCodingQuestion,
        userName,
      });
      setFeedback(spokenReply);

      // if they got terminated mid-evaluation, don't keep going
      if (terminatedRef.current) return;

      // speak a short acknowledgement (not a verdict), then auto-advance —
      // no manual "Next Question" click needed. speakText is hang-proof.
      await speakText(spokenReply);

      if (terminatedRef.current) return;

      if (effectiveIsLast) {
        await finishInterview();
        return;
      }

      setAnswer("");
      setFeedback("");
      setSubmitTestResults(null);
      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      console.log("[interview] advance failed:", error);
      // last resort — never strand the candidate on a question
      try {
        if (isLastQuestion) await finishInterview();
        else setCurrentIndex((prev) => prev + 1);
      } catch {
        /* noop */
      }
    } finally {
      setIsSubmitting(false);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  // ---- skip: move to next question without answering the current one ----
  const skipQuestion = async () => {
    if (isSubmitting) return;
    if (!currentQuestion) return;
    if (isIntroPhase || isAIPlaying) return;
    if (isTerminated || fullscreenWarning) return;

    clearAllVoiceTimers();
    stopMic();
    voiceAnswer.stop();
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
        { withCredentials: true, timeout: 60000 },
      );

      const { feedback: fb, isLast, nextQuestion } = result.data;

      if (!isLast && nextQuestion) {
        setQuestions((prev) => [...prev, nextQuestion]);
      }
      setIsLastQuestion(!!isLast);
      setLastDeliveryMetrics(null);
      // on the very last question just say goodbye, no "next question" talk
      const spokenSkip = buildSpokenReply({
        ack: isLast ? "No problem." : fb || "No problem, let's move on.",
        isLast,
        isCodingQuestion: false,
        userName,
      });
      setFeedback(spokenSkip);

      if (terminatedRef.current) return;

      await speakText(spokenSkip);

      if (terminatedRef.current) return;

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
    if (fullscreenWarning || isTerminated) return;

    // voice-to-voice mode runs its own capture lifecycle (silence ->
    // countdown -> transcribe -> submit), so the question clock never
    // auto-submits there; type mode keeps the classic behavior untouched
    if (
      timeLeft === 0 &&
      !isSubmitting &&
      !feedback &&
      answerModeRef.current === "type"
    ) {
      submitAnswer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const deliveryLabel = (score) => {
    if (score >= 8) return "Excellent delivery";
    if (score >= 6) return "Good delivery";
    if (score >= 4) return "Needs polish";
    return "Work on pacing & fillers";
  };

  const controlsDisabled =
    isSubmitting || isIntroPhase || isAIPlaying || !!fullscreenWarning || isTerminated;

  // ---- proctoring consent gate — shown before the interview starts ----
  if (!proctoringReady) {
    return (
      <div className="min-h-screen relative bg-[#F7F6F3] dark:bg-[#0A0B0D] flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
          .studio-root, .studio-root * { font-family: 'Manrope', sans-serif; }
          .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
          .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
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
          @keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
          .live-dot { animation: livePulse 1.8s ease-in-out infinite; }
        `}</style>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="studio-root w-full max-w-2xl bg-white dark:bg-[#0F1115] rounded-[28px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] border border-[#EAE9E5] dark:border-[#1E2229] overflow-hidden"
        >
          <div className="p-7 sm:p-9">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#E8A94C] live-dot" />
              <span className="font-mono-studio text-[11px] tracking-[0.08em] text-[#E8A94C]">
                SETUP · BEFORE WE BEGIN
              </span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-gray-900 dark:text-white mb-2">
              Let's set the room up
            </h2>
            <p className="text-sm text-gray-500 dark:text-[#8B93A1] mb-8 leading-relaxed">
              Just like a real proctored interview, we'll use your camera and
              a few browser signals during the session. Everything here is
              optional except entering fullscreen when you press start.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* camera */}
              <div className="rounded-2xl border border-[#EAE9E5] dark:border-[#1E2229] bg-[#FAFAF8] dark:bg-[#0C0E11] p-4">
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video mb-3 ring-1 ring-black/40">
                  <div className="viewfinder-corner corner-tl" />
                  <div className="viewfinder-corner corner-tr" />
                  <div className="viewfinder-corner corner-bl" />
                  <div className="viewfinder-corner corner-br" />
                  {cameraStream ? (
                    <video
                      ref={selfVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-mono-studio text-[10px] text-[#565D68]">
                        NO SIGNAL
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
                  Camera
                </p>
                {cameraError && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
                    {cameraError}
                  </p>
                )}
                <button
                  onClick={requestCamera}
                  disabled={isRequestingCamera || !!cameraStream}
                  className="w-full text-xs font-medium py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 disabled:opacity-60 transition"
                >
                  {cameraStream
                    ? "Camera enabled"
                    : isRequestingCamera
                      ? "Requesting..."
                      : "Enable camera"}
                </button>
              </div>

              {/* other permissions */}
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#EAE9E5] dark:border-[#1E2229] bg-[#FAFAF8] dark:bg-[#0C0E11] p-4">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
                    Location
                  </p>
                  <p className="text-xs text-gray-500 dark:text-[#8B93A1] mb-3">
                    Approximate coordinates only, shared once — browsers
                    can't expose your WiFi network name to a webpage.
                  </p>
                  {locationError && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
                      {locationError}
                    </p>
                  )}
                  <button
                    onClick={requestLocation}
                    disabled={locationShared}
                    className="w-full text-xs font-medium py-2 rounded-lg border border-gray-300 dark:border-[#232830] text-gray-700 dark:text-gray-200 disabled:opacity-60 transition"
                  >
                    {locationShared ? "Location shared ✓" : "Share location"}
                  </button>
                </div>

                <div className="rounded-2xl border border-[#EAE9E5] dark:border-[#1E2229] bg-[#FAFAF8] dark:bg-[#0C0E11] p-4">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
                    Screen share
                  </p>
                  <p className="text-xs text-gray-500 dark:text-[#8B93A1] mb-3">
                    Optional — mirrors how technical rounds sometimes ask you
                    to share your screen.
                  </p>
                  <button
                    onClick={requestScreenShare}
                    disabled={screenShareActive}
                    className="w-full text-xs font-medium py-2 rounded-lg border border-gray-300 dark:border-[#232830] text-gray-700 dark:text-gray-200 disabled:opacity-60 transition"
                  >
                    {screenShareActive ? "Screen shared ✓" : "Share screen"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#E8A94C]/30 bg-[#E8A94C]/5 p-4 flex items-start gap-3">
              <IoWarningOutline
                size={17}
                className="text-[#B27E2E] dark:text-[#E8A94C] mt-0.5 shrink-0"
              />
              <p className="text-xs text-[#8A6A2F] dark:text-[#E8B96A] leading-relaxed">
                The interview runs in fullscreen. If you leave fullscreen,
                you'll get a warning — after{" "}
                <strong>{MAX_FULLSCREEN_EXITS} exits</strong> the session is
                ended automatically and your report will be marked
                unsuccessful. Tab switches are logged too.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <motion.button
                onClick={startInterviewFromGate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-3.5 rounded-2xl shadow-lg transition"
              >
                Start Interview
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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

        /* ---- voice-to-voice mode ---- */
        @keyframes voiceRing { 0% { transform: scale(0.85); opacity: 0.65; } 100% { transform: scale(1.65); opacity: 0; } }
        .voice-ring { animation: voiceRing 1.9s ease-out infinite; }
        .voice-ring-2 { animation: voiceRing 1.9s ease-out 0.6s infinite; }
        @keyframes orbBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
        .orb-live { animation: orbBreathe 2.4s ease-in-out infinite; }

        .studio-select {
          -webkit-appearance: none;
          appearance: none;
        }

        .lang-select-wrap:hover .lang-caret { color: #E8A94C; }
      `}</style>

      <div className="film-grain" />

      {/* ============ voice wrap-up countdown overlay (3 -> 1) ============ */}
      <AnimatePresence>
        {voiceAnswer.countdown !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-1000 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md"
          >
            <motion.div
              key={voiceAnswer.countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="font-serif-display text-[9rem] sm:text-[11rem] leading-none tabular-nums bg-linear-to-b from-[#F6D68A] via-[#E8A94C] to-[#B27E2E] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(232,169,76,0.45)]"
            >
              {voiceAnswer.countdown}
            </motion.div>
            {/* depleting bar — one second per number */}
            <motion.div
              key={`bar-${voiceAnswer.countdown}`}
              className="mt-6 h-1 rounded-full bg-linear-to-r from-[#E8A94C] to-[#F6D68A] origin-left"
              initial={{ width: 160, opacity: 1 }}
              animate={{ width: 0, opacity: 0.6 }}
              transition={{ duration: 1, ease: "linear" }}
            />
            <p className="mt-4 text-xs sm:text-sm text-white/70 font-mono-studio tracking-[0.08em] uppercase">
              Speak now to keep answering — staying silent submits
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ fullscreen violation modal ============ */}
      <AnimatePresence>
        {fullscreenWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="studio-root w-full max-w-md bg-white dark:bg-[#0F1115] rounded-3xl border border-[#EAE9E5] dark:border-[#1E2229] shadow-2xl overflow-hidden"
            >
              <div
                className={`h-1.5 ${
                  fullscreenWarning.isFinal ? "bg-red-500" : "bg-[#E8A94C]"
                }`}
              />
              <div className="p-7">
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      fullscreenWarning.isFinal
                        ? "bg-red-500/15 text-red-600 dark:text-red-400"
                        : "bg-[#E8A94C]/15 text-[#B27E2E] dark:text-[#E8A94C]"
                    }`}
                  >
                    <IoWarningOutline size={20} />
                  </div>
                  <span
                    className={`font-mono-studio text-[11px] tracking-[0.08em] ${
                      fullscreenWarning.isFinal
                        ? "text-red-600 dark:text-red-400"
                        : "text-[#B27E2E] dark:text-[#E8A94C]"
                    }`}
                  >
                    {fullscreenWarning.isFinal
                      ? "SESSION TERMINATED"
                      : `WARNING ${fullscreenWarning.count} OF ${MAX_FULLSCREEN_EXITS}`}
                  </span>
                </div>

                <h3 className="font-serif-display text-2xl text-[#1C1F24] dark:text-[#EDEEF0] mb-2.5">
                  {fullscreenWarning.isFinal
                    ? "Interview ended"
                    : "You left fullscreen mode"}
                </h3>

                <p className="text-sm text-[#5C6472] dark:text-[#8B93A1] leading-relaxed mb-6">
                  {fullscreenWarning.isFinal ? (
                    <>
                      You exited fullscreen {MAX_FULLSCREEN_EXITS} times during
                      this interview. The session has been ended and your report
                      will be marked as unsuccessful.
                    </>
                  ) : (
                    <>
                      This interview must stay in fullscreen. Your timer is
                      paused right now. If you leave fullscreen{" "}
                      {MAX_FULLSCREEN_EXITS - fullscreenWarning.count} more
                      time{MAX_FULLSCREEN_EXITS - fullscreenWarning.count > 1 ? "s" : ""}
                      , the interview will end automatically.
                    </>
                  )}
                </p>

                {fullscreenWarning.isFinal ? (
                  <div className="flex items-center gap-2 font-mono-studio text-[#8B92A0] text-xs">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="w-3.5 h-3.5 border-2 border-[#8B92A0]/30 border-t-[#8B92A0] rounded-full"
                    />
                    Generating your report...
                  </div>
                ) : (
                  <motion.button
                    onClick={dismissWarningAndResume}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] font-semibold py-3.5 rounded-2xl shadow-lg transition"
                  >
                    <BsFullscreen size={14} />
                    Return to fullscreen & continue
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

            {/* candidate self-view PIP — visual only, never uploaded */}
            {cameraStream && (
              <div className="absolute bottom-2.5 right-2.5 w-16 sm:w-20 aspect-video rounded-lg overflow-hidden ring-1 ring-white/20 shadow-lg">
                <video
                  ref={pipVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#E8A94C] live-dot" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {cameraStream && (
              <span className="font-mono-studio text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                CAM ●
              </span>
            )}
            {screenShareActive && (
              <span className="font-mono-studio text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                SCREEN ●
              </span>
            )}
            {tabSwitchCount > 0 && (
              <span className="font-mono-studio text-[10px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {tabSwitchCount} TAB SWITCH{tabSwitchCount > 1 ? "ES" : ""}
              </span>
            )}
            {fullscreenExitCount > 0 && (
              <span className="font-mono-studio text-[10px] px-2 py-1 rounded-full bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20">
                FS EXIT {fullscreenExitCount}/{MAX_FULLSCREEN_EXITS}
              </span>
            )}
          </div>

          {/* AI subtitles — hidden in voice mode (pure voice: the interviewer
              is HEARD, not read). The question itself stays visible in the
              question card above. */}
          <AnimatePresence mode="wait">
            {subtitle && !(answerMode === "voice" && !isCodingQuestion) && (
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
            {/* voice mode runs on spoken turn-taking — the per-question clock
                readout is hidden so the 3s voice wrap-up is the only timer */}
            {!(answerMode === "voice" && !isCodingQuestion) && (
              <>
            <div className="flex justify-center">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit}
              />
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-[#232830] to-transparent" />
              </>
            )}

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
              {SHOW_LIVE_DELIVERY_CARD && lastDeliveryMetrics && !isCodingQuestion && (
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
            <div className="flex items-center gap-2">
              {ttsProvider && (
                <span
                  title={
                    ttsProvider === "deepgram"
                      ? "The interviewer is speaking with a neural voice"
                      : "The interviewer is speaking with the browser voice — set DEEPGRAM_API_KEY on the server for the neural voice"
                  }
                  className={`font-mono-studio text-[10px] px-2 py-1 rounded-full border tracking-wide ${
                    ttsProvider === "deepgram"
                      ? "bg-[#5EC8D8]/10 text-[#2E8494] dark:text-[#5EC8D8] border-[#5EC8D8]/30"
                      : "bg-[#EFEEEA] dark:bg-[#181B20] text-[#8B92A0] border-[#E5E4E0] dark:border-[#262B34]"
                  }`}
                >
                  {ttsProvider === "deepgram" ? "NEURAL VOICE" : "STANDARD VOICE"}
                </span>
              )}
              <span className="font-mono-studio text-xs text-[#8B92A0] tracking-wide">
                {String(currentIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
              </span>
            </div>
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

          {/* ============ answer input mode toggle ============ */}
          {!isIntroPhase && !isCodingQuestion && (
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center p-1 rounded-2xl bg-[#EFEEEA] dark:bg-[#131519] border border-[#E5E4E0] dark:border-[#232830] shadow-sm">
                {[
                  {
                    id: "voice",
                    label: "🎙 Voice",
                    hint: "Speak your answer — auto transcribed & submitted",
                  },
                  {
                    id: "type",
                    label: "⌨ Type",
                    hint: "Classic typing mode",
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    title={m.hint}
                    onClick={() => switchAnswerMode(m.id)}
                    className={`px-5 sm:px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      answerMode === m.id
                        ? "bg-[#1C1F24] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] shadow"
                        : "text-[#8B92A0] hover:text-[#1C1F24] dark:hover:text-[#EDEEF0]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
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
          ) : answerMode === "voice" ? (
            <VoiceAnswerPanel
              voice={voiceAnswer}
              onRepeat={handleRepeatQuestion}
              onSwitchToType={() => switchAnswerMode("type")}
              analyzing={isAnalyzing && !isCodingQuestion}
              analysisProgress={analysisProgress}
            />
          ) : isAnalyzing ? (
            <div className="flex-1 mt-3 relative overflow-hidden rounded-3xl bg-[#0C0E11] border border-[#1E2229] p-6 sm:p-8 flex flex-col items-center justify-center min-h-95">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-linear(ellipse 65% 55% at 50% 38%, rgba(232,169,76,0.14), transparent 70%)",
                }}
              />
              <AnalysisOverlay progress={analysisProgress} />
            </div>
          ) : (
            <div className="flex-1 mt-3 flex flex-col min-h-70">
              <div className="flex items-center justify-between px-1 pb-2">
                <span className="font-mono-studio text-[10px] tracking-[0.25em] uppercase text-[#8B92A0]">
                  Your answer
                </span>
                <span className="font-mono-studio text-[10px] tracking-[0.15em] text-[#565D68] tabular-nums">
                  {answer.trim() ? answer.trim().split(/\s+/).length : 0} words
                </span>
              </div>
              <textarea
                placeholder="Type your answer here…"
                onChange={(e) => setAnswer(e.target.value)}
                value={answer}
                disabled={controlsDisabled}
                className="flex-1 bg-white dark:bg-[#0C0E11] rounded-2xl p-5 sm:p-6 border border-[#E5E4E0] dark:border-[#1E2229] text-[#1C1F24] dark:text-[#EDEEF0] placeholder-[#9AA1AC] dark:placeholder-[#565D68] text-base leading-relaxed resize-none outline-none focus:border-[#E8A94C]/60 focus:ring-4 focus:ring-[#E8A94C]/15 focus:shadow-[0_0_50px_-12px_rgba(232,169,76,0.4)] transition-all duration-200 disabled:opacity-60"
              />
            </div>
          )}

          <AnimatePresence>
            {inactivityWarning && !isCodingQuestion && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 flex items-center justify-between gap-3 bg-[#E8A94C]/10 border border-[#E8A94C]/25 rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <IoWarningOutline
                    size={16}
                    className="text-[#B27E2E] dark:text-[#E8A94C] shrink-0"
                  />
                  <p className="text-[#8A6A2F] dark:text-[#E8B96A] text-sm">
                    Still there? Say anything to let me know.
                  </p>
                </div>
                <span className="font-mono-studio text-xs font-semibold text-[#B27E2E] dark:text-[#E8A94C] shrink-0">
                  {warningSecondsLeft}s
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {!feedback ? (
            answerMode === "voice" && !isCodingQuestion ? (
              /* voice-to-voice: pure voice — every control is a spoken
                 command ("repeat" / "skip" / "wait"). No buttons by design. */
              null
            ) : (
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
                className="flex-1 bg-linear-to-r from-[#F2C063] via-[#E8A94C] to-[#D89A3D] text-[#0A0B0D] font-semibold py-3 sm:py-4 rounded-2xl shadow-[0_10px_30px_-8px_rgba(232,169,76,0.5)] hover:shadow-[0_14px_36px_-8px_rgba(232,169,76,0.6)] hover:brightness-[1.04] active:brightness-95 transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
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
            )
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-white dark:bg-[#131519] border border-[#E8A94C]/30 p-5 rounded-2xl shadow-[0_12px_30px_-16px_rgba(232,169,76,0.3)]"
            >
              {answerMode === "voice" && !isCodingQuestion ? (
                /* voice mode is pure voice: the acknowledgement is SPOKEN,
                   never shown as text — this is just the "on air" light so
                   the candidate knows the interviewer is responding */
                <div className="flex items-center gap-3 mb-4">
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8A94C] opacity-60" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E8A94C]" />
                  </span>
                  <p className="font-mono-studio text-xs tracking-[0.2em] uppercase text-[#B27E2E] dark:text-[#E8A94C]">
                    Interviewer is speaking…
                  </p>
                </div>
              ) : (
                <p className="text-[#1C1F24] dark:text-[#EDEEF0] font-medium mb-4 leading-relaxed">
                  {feedback}
                </p>
              )}

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