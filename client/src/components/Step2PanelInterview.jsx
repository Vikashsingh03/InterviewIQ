// ====================================================================
// InterviewIQ voice-to-voice — FINAL BUILD 2026-09-22-D
// New in D: instant commands (first-interim fire, utterance-anchored
// matching via ../utils/voiceCommands), pure-voice UI — no transcript text,
// no AI reply text, no subtitles in voice mode (speaking indicator instead).
// If you do NOT see this header, you are looking at an OLD cached copy.
// ====================================================================
// Feature 1 (2026-09-22): rapid-fire grilling — counter-questions from the
// server carry isFollowUp=true and show an amber "Follow-up" badge.
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
  BsSkipForward,
  BsCode,
  BsPlayFill,
  BsCheckCircleFill,
  BsXCircleFill,
  BsChevronDown,
  BsFullscreen,
  BsPersonFill,
  BsLightningCharge,
} from "react-icons/bs";
import { IoWarningOutline, IoSparklesSharp } from "react-icons/io5";
import Editor from "@monaco-editor/react";

const CODE_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

const MAX_FULLSCREEN_EXITS = 3;

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
// pause after the candidate's last spoken words before the answer is
// treated as "finished" and auto-submitted
// A normal answer waits this long after the last word. Short answers
// (under SHORT_ANSWER_WORDS) wait longer, because people pause to think
// after a sentence or two and shouldn't be cut off.
const SILENCE_AUTO_SUBMIT_MS = 5000;
const SHORT_ANSWER_WORDS = 15;
const SILENCE_AUTO_SUBMIT_SHORT_MS = 9000;
// total silence (no speech at all) before the interviewer checks in
const INACTIVITY_WARNING_MS = 10000;
// grace window after the check-in before the panel moves on by itself
const INACTIVITY_GRACE_MS = 15000;
// after the candidate says "wait", stay quiet for this long before checking in
const WAIT_EXTENSION_MS = 30000;
// short utterances matching these are voice COMMANDS, not part of the
// answer. Capped at COMMAND_MAX_WORDS so a long real answer that happens
// to contain "wait" is never swallowed as a command
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
// five seconds while the evaluation runs, then responds and moves on
const ANALYSIS_MS = 3000;

// post-transcription safety net for voice commands — imported from
// ../utils/voiceCommands so the real-time spotter and this check always agree.
// The hook's spotter catches "repeat" / "skip" / "wait" on the first interim
// result when the browser's speech recognition cooperates — but on machines
// where it doesn't, the command would otherwise be transcribed and submitted
// as a real answer (exactly the "repeat this question got submitted" bug).
// So after Deepgram returns the transcript we check once more: a short,
// command-shaped utterance is NEVER submitted — it is handled as a command
// instead. Deterministic, no browser dependency.

// client-side mirror of the backend's INTERVIEWER_PERSONAS — only the
// presentation bits (video, label, accent) live here, the actual grading
// persona lives server-side
const PANEL_PERSONAS = {
  interviewerA: {
    label: "Interviewer A",
    subtitle: "Technical",
    video: maleVideo,
    voiceGender: "male",
    accent: "#5EC8D8",
  },
  interviewerB: {
    label: "Interviewer B",
    subtitle: "Behavioral",
    video: femaleVideo,
    voiceGender: "female",
    accent: "#E8A94C",
  },
};

// ---------------------------------------------------------------------------
// Voice-to-voice answer panel — premium dark-glass UI for the
// record -> Deepgram-transcribe pipeline. Rendered when answerMode === "voice".
// headerChips lets panel mode show its interviewer avatars above the orb.
// ---------------------------------------------------------------------------
// premium 5-second "the interviewer is thinking" moment — gold progress ring
// with a live countdown, shown after every submitted answer while the
// evaluation runs. The interview always advances when the ring completes.
function AnalysisOverlay({ progress = 0 }) {
  const R = 54;
  const C = 2 * Math.PI * R;
  const secondsLeft = Math.max(1, Math.ceil((1 - progress) * 3));
  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-8 select-none">
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full bg-[#E8A94C]/15 blur-2xl animate-pulse" />
        <svg viewBox="0 0 128 128" className="relative w-40 h-40 -rotate-90">
          <defs>
            <linearGradient id="analysisGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F6D68A" />
              <stop offset="100%" stopColor="#E8A94C" />
            </linearGradient>
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
  // interviewers speak back. lastTranscript is intentionally not rendered.
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

  // 3-second analysis beat — replaces the orb while the AI "thinks"
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

function Step2PanelInterview({ interviewData, onFinish }) {
  const { interviewId, userName } = interviewData;

  const [questions, setQuestions] = useState(interviewData.questions || []);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const [micError, setMicError] = useState("");
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  // ---- conversational voice engine state ----
  // voice is the primary input; the textarea is an explicit typing fallback
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
  const graceTimerRef = useRef(null); // after check-in -> auto-advance
  const warningIntervalRef = useRef(null); // ticks warningSecondsLeft down
  const inactivityWarningRef = useRef(false);
  const hasSpokenRef = useRef(false);
  // true while we WANT the mic open; lets recognition.onend tell a
  // deliberate stop() apart from Chrome silently ending the session
  const wantListeningRef = useRef(false);

  // "latest value" refs: SpeechRecognition callbacks are created once on
  // mount, so anything they read must come through a ref or they would
  // forever see the first render's values (stale closure)
  const currentQuestionRef = useRef(null);
  const activeSpeakerRef = useRef("interviewerA");
  const isMicOnRef = useRef(true);
  const showAnswerBoxRef = useRef(false);
  const answerRef = useRef("");
  const submitAnswerRef = useRef(() => {});
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
  // 9-second analysis beat state — the premium "AI is thinking" moment
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [subtitle, setSubtitle] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");

  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submitTestResults, setSubmitTestResults] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  // ---- voices — both personas' voices are resolved once, then picked
  // per-question based on who's asking ----
  const [maleVoice, setMaleVoice] = useState(null);
  const [femaleVoice, setFemaleVoice] = useState(null);
  // "deepgram" (neural) | "browser" (standard) — resolved once per interview
  const [ttsProvider, setTtsProvider] = useState(null);
  const ttsRef = useRef(null);
  const browserSpeakRef = useRef(() => Promise.resolve());
  // ref mirrors (the engine's browser fallback reads these, avoiding stale closures)
  const maleVoiceRef = useRef(null);
  const femaleVoiceRef = useRef(null);

  // ---- voice-to-voice answer capture (record -> Deepgram transcribe) ----
  // The transcript flows into the EXISTING submit pipeline through
  // submitAnswerRef, so evaluation / ack speech / auto-advance are untouched.
  // The active interviewer is read from activeSpeakerRef at submit time, so
  // the transcript is always attributed to whoever asked the question.
  const handleVoiceNoSpeechRef = useRef(() => {});
  const handleVoiceCommandRef = useRef(() => {});
  const voiceAnswer = useVoiceAnswer({
    apiUrl: ServerUrl,
    onTranscript: (transcript) => {
      // safety net: a transcribed command is handled as a command, never
      // submitted as an answer — the interviewer *responds* instead.
      // Speaker attribution still flows through activeSpeakerRef.
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

  // ---- proctoring state (same contract as solo mode) ----
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
  const [fullscreenWarning, setFullscreenWarning] = useState(null);
  const [isTerminated, setIsTerminated] = useState(false);

  const selfVideoRef = useRef(null);
  const pipVideoRef = useRef(null);
  const screenStreamRef = useRef(null);
  const wasFullscreenRef = useRef(false);
  const fullscreenExitCountRef = useRef(0);
  const proctoringReadyRef = useRef(false);
  const terminatedRef = useRef(false);
  const isFinishingRef = useRef(false);

  const videoRefA = useRef(null);
  const videoRefB = useRef(null);
  const answerWindowStartRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const isCodingQuestion = currentQuestion?.type === "coding";
  // first question (intro) is always interviewerA — matches backend
  const activeSpeaker = currentQuestion?.askedBy || "interviewerA";
  const activePersona = PANEL_PERSONAS[activeSpeaker];
  const controlsDisabled =
    isSubmitting || isIntroPhase || isAIPlaying || !!fullscreenWarning || isTerminated;

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
    activeSpeakerRef.current = activeSpeaker;
  }, [activeSpeaker]);

  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);

  useEffect(() => {
    answerModeRef.current = answerMode;
  }, [answerMode]);

  // "latest function" refs, refreshed after EVERY render (no dependency
  // array) so frozen callbacks always call the freshest version
  useEffect(() => {
    answerRef.current = answer;
    submitAnswerRef.current = submitAnswer;
    skipQuestionRef.current = skipQuestion;
    speakTextRef.current = speakText;
  });

  // ---- conversational voice engine ----
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
      // already running: ignore
    }
  };

  const safeStopRecognition = () => {
    wantListeningRef.current = false;
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // already stopped: ignore
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
    await speakTextRef.current("Are you still there?", activeSpeakerRef.current);
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
    await speakTextRef.current(
      currentQuestionRef.current.question,
      activeSpeakerRef.current,
    );
    if (terminatedRef.current) return;
    safeStartRecognition();
    armInactivityTimer();
  };

  const handleWaitCommand = async () => {
    if (terminatedRef.current) return;
    clearAllVoiceTimers();
    safeStopRecognition();
    await speakTextRef.current("Ok, take your time.", activeSpeakerRef.current);
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
    await speakTextRef.current(currentQuestionRef.current.question, activeSpeakerRef.current);
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
      activeSpeakerRef.current,
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
    await speakTextRef.current("Take your time.", activeSpeakerRef.current);
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
        setFullscreenWarning({ count: nextCount, isFinal: true });
      } else {
        setFullscreenWarning({ count: nextCount, isFinal: false });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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

  // ---- voices: resolve one male + one female voice up front ----
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const female = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female"),
      );
      const male = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male"),
      );

      setFemaleVoice(female || voices[0]);
      setMaleVoice(male || voices[1] || voices[0]);
      // ref mirrors for the neural-TTS browser fallback path
      femaleVoiceRef.current = female || voices[0];
      maleVoiceRef.current = male || voices[1] || voices[0];
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // ---- neural interviewer voice ----
  // When the server has a Deepgram key each persona speaks with a neural
  // (Aura) voice; otherwise this browser speech-synthesis path is used.
  const browserSpeakText = (chunk, voiceGenderParam) => {
    return new Promise((resolve) => {
      const voice =
        voiceGenderParam === "male"
          ? maleVoiceRef.current
          : femaleVoiceRef.current;
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

  const speakText = (text, askedBy) => {
    return new Promise(async (resolve) => {
      // cut off anything currently playing (e.g. "repeat that" mid-sentence)
      ttsRef.current.cancel();

      const voiceGender =
        PANEL_PERSONAS[askedBy]?.voiceGender === "male" ? "male" : "female";
      const speakingRef = askedBy === "interviewerA" ? videoRefA : videoRefB;

      setSubtitle(text);
      setIsAIPlaying(true);
      stopMic();
      voiceAnswer.stop();
      speakingRef.current?.play();

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
    if ((!maleVoice && !femaleVoice) || !proctoringReady) return;
    if (terminatedRef.current) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi, I'm Marcus — I'll be handling the technical side of today's interview. I've spent several years working on systems like the ones we'll be discussing.`,
          "interviewerA",
        );
        await speakText(
          `And I'm Elena — I'll be focusing on communication, ownership, and how you work with others. Great to have you with us today.`,
          "interviewerB",
        );
        await speakText(
          `We'll take turns asking questions, so just answer naturally and take your time. Let's begin.`,
          "interviewerA",
        );
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        if (isLastQuestion) {
          await speakText("Alright, this might be a bit challenging", activeSpeaker);
        }
        await speakText(currentQuestion.question, activeSpeaker);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maleVoice, femaleVoice, isIntroPhase, currentIndex, proctoringReady]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (isSubmitting) return;
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
      } catch {
        // already running
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

  const submitAnswer = async (overrideAnswer) => {
    // voice pipeline passes the transcript in; every other caller uses state
    const finalAnswer =
      typeof overrideAnswer === "string" ? overrideAnswer : answer;
    if (!finalAnswer.trim() || isSubmitting) return;
    if (terminatedRef.current) return;

    setIsSubmitting(true);
    clearAllVoiceTimers();
    dismissInactivityWarning();
    setFeedback("⏳ Evaluating your answer…");
    // the 9-second analysis beat — the AI visibly "thinks" before speaking
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    const askedBy = currentQuestion.askedBy || "interviewerA";

    try {
      const response = await axios.post(ServerUrl + "/api/interview/submit", {
        interviewId,
        questionId: currentQuestion._id,
        answer: finalAnswer,
        isPanel: true,
        askedBy,
      });

      // 9-second analysis beat: the AI "thinks" while the ring counts down.
      // The interview always advances when the ring finishes — the request
      // resolving early only ends the beat early, never sooner than 3s, so
      // the beat never feels cheap or glitchy.
      await new Promise((resolve) => {
        const startedAt = Date.now();
        const minMs = 3000;
        const totalMs = 9000;
        const tick = () => {
          const elapsed = Date.now() - startedAt;
          setAnalysisProgress(Math.min(1, elapsed / totalMs));
          if (elapsed >= totalMs) return resolve();
          if (elapsed >= minMs && response) return resolve();
          setTimeout(tick, 100);
        };
        tick();
      });
      setIsAnalyzing(false);

      const updatedQuestion = response.data.question;
      setFeedback(updatedQuestion.feedback);
      const nextIndex = currentIndex + 1;
      const nextQuestion = response.data.nextQuestion;

      if (nextQuestion) {
        setQuestions((prevQuestions) => {
          const newQuestions = [...prevQuestions];
          newQuestions[currentIndex] = updatedQuestion;
          if (!newQuestions[nextIndex]) newQuestions.push(nextQuestion);
          else newQuestions[nextIndex] = nextQuestion;
          return newQuestions;
        });
        setAnswer("");
        answerRef.current = "";
        setFeedback("");
        // the next question belongs to whoever the backend picked (takes
        // turns). The "thanks for that" acknowledgement comes from the
        // interviewer who JUST ASKED, then the next one takes the floor.
        await speakText(
          "Thanks for that. Let me pass it to my colleague.",
          askedBy,
        );
        if (terminatedRef.current) return;
        setCurrentIndex(nextIndex);
      } else {
        setQuestions((prevQuestions) => {
          const newQuestions = [...prevQuestions];
          newQuestions[currentIndex] = updatedQuestion;
          return newQuestions;
        });
        await speakText(
          "Thank you, we'll now move to the final evaluation",
          askedBy,
        );
        if (terminatedRef.current) return;
        finishInterview();
      }
    } catch (error) {
      setFeedback("Error submitting answer.");
      console.error(error);
    }
    setIsSubmitting(false);
  };

  const skipQuestion = async () => {
    if (isSubmitting) return;
    if (terminatedRef.current) return;

    setIsSubmitting(true);
    clearAllVoiceTimers();
    dismissInactivityWarning();
    const askedBy = currentQuestion.askedBy || "interviewerA";

    try {
      await axios.post(ServerUrl + "/api/interview/submit", {
        interviewId,
        questionId: currentQuestion._id,
        answer: "",
        isPanel: true,
        askedBy,
        skipped: true,
      });

      const nextIndex = currentIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentIndex(nextIndex);
        setAnswer("");
        answerRef.current = "";
        setFeedback("");
        await speakText("No worries, let's move on.", askedBy);
      } else {
        finishInterview();
      }
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  const handleRunCode = async () => {
    if (!answer.trim()) {
      setRunResults({ error: "Please write some code first." });
      return;
    }
    setRunResults({ info: "⏳ Running your code…" });
    try {
      const response = await axios.post(ServerUrl + "/api/interview/run-code", {
        interviewId,
        questionId: currentQuestion._id,
        code: answer,
        language: codeLanguage,
      });
      setRunResults(response.data);
    } catch (error) {
      setRunResults({
        error: error.response?.data?.message || "Failed to run code.",
      });
    }
  };

  const handleSubmitCode = async () => {
    if (terminatedRef.current) return;
    setIsSubmitting(true);
    clearAllVoiceTimers();
    dismissInactivityWarning();
    const askedBy = currentQuestion.askedBy || "interviewerA";
    try {
      const response = await axios.post(
        ServerUrl + "/api/interview/submit-code",
        {
          interviewId,
          questionId: currentQuestion._id,
          code: answer,
          language: codeLanguage,
          isPanel: true,
          askedBy,
        },
      );

      const updatedQuestion = response.data.question;
      setFeedback(updatedQuestion.feedback);
      setSubmitTestResults(response.data.testResults);

      // give them a moment to read their score, then the asker speaks
      await new Promise((r) => setTimeout(r, 6000));

      if (response.data.nextQuestion) {
        await speakText(
          "Thanks for that. Let me pass it to my colleague.",
          askedBy,
        );
        if (terminatedRef.current) return;
        setQuestions((prev) => [...prev, response.data.nextQuestion]);
        setCurrentIndex((prev) => prev + 1);
        setAnswer("");
        answerRef.current = "";
        setFeedback("");
        setRunResults(null);
        setSubmitTestResults(null);
      } else {
        await speakText(
          "Thank you, we'll now move to the final evaluation",
          askedBy,
        );
        if (terminatedRef.current) return;
        finishInterview();
      }
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (isIntroPhase) return;
    if (terminatedRef.current) return;
    if (timeLeft === 0) {
      // voice mode: still recording — transcribe whatever was captured
      // (no-speech -> the check-in path), typing mode: keep the old behavior
      if (answerModeRef.current === "voice" && !isCodingQuestionRef.current) {
        voiceAnswer.stop();
      } else if (showAnswerBoxRef.current) {
        if (answer.trim()) {
          submitAnswerRef.current();
        } else {
          skipQuestionRef.current();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // "repeat" in a pure-voice room = just say it again. The old textarea
  // toggle only makes sense while typing, so hide it in voice mode.
  const voiceToVoice = answerMode === "voice";

  const finishInterview = async () => {
    // never double-finish (a stale inactivity timer could re-fire)
    if (isFinishingRef.current) return;
    isFinishingRef.current = true;

    setFeedback("");
    setIsSubmitting(true);
    stopMic();
    voiceAnswer.stop();
    clearAllVoiceTimers();
    dismissInactivityWarning();

    // unmount cleanup: the shared hook's stop() already released the
    // MediaRecorder, but the mic track itself is this file's responsibility
    const track = voiceAnswer.getTrack && voiceAnswer.getTrack();
    if (track) {
      try {
        track.stop();
      } catch {
        /* noop */
      }
    }

    // goodbye, spoken before leaving: 9 seconds of audio, then a 2-second
    // pause so the voice doesn't clip into the evaluation screen
    await speakText(
      "Thank you for your time today. It was a pleasure getting to know you, and we appreciate you walking us through your experience.",
      "interviewerA",
    );
    await new Promise((r) => setTimeout(r, 2000));

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        /* noop */
      }
    }
    onFinish(interviewId);
  };

  if (!proctoringReady) {
    const camOff = !cameraStream && !cameraError && !isRequestingCamera;
    return (
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            Panel Interview Setup
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Two interviewers are waiting — let&apos;s get your setup ready.
          </p>

          {/* interviewer cards */}
          <div className="linear linear-cols-2 gap-3 mb-6">
            {Object.entries(PANEL_PERSONAS).map(([key, p]) => (
              <div
                key={key}
                className={`rounded-xl p-4 border ${p.ring} bg-linear-to-br from-slate-50 to-white`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white bg-linear-to-br ${p.accent}`}
                  >
                    {p.initials}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">
                      {p.name}
                    </div>
                    <div className="text-xs text-slate-500">{p.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* status rows */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <div className="font-semibold text-slate-800 text-sm">
                  Camera
                </div>
                <div className="text-xs text-slate-500">
                  The interviewers would like to see you.
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cameraStream && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <FaVideo size={12} /> ON
                  </span>
                )}
                {camOff && (
                  <button
                    onClick={requestCamera}
                    disabled={isRequestingCamera}
                    className="px-4 py-2 text-sm font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
                  >
                    {isRequestingCamera ? "Requesting…" : "Enable Camera"}
                  </button>
                )}
                {cameraError && (
                  <button
                    onClick={requestCamera}
                    className="px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
            {cameraError && (
              <p className="text-xs text-amber-600 -mt-2 mb-2">{cameraError}</p>
            )}

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <div className="font-semibold text-slate-800 text-sm">
                  Location
                </div>
                <div className="text-xs text-slate-500">
                  Used only for verification.
                </div>
              </div>
              {locationShared ? (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <FaMapMarkerAlt size={12} /> SHARED
                </span>
              ) : (
                <button
                  onClick={requestLocation}
                  className="px-4 py-2 text-sm font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                >
                  Share Location
                </button>
              )}
            </div>
            {locationError && (
              <p className="text-xs text-amber-600 -mt-2 mb-2">{locationError}</p>
            )}

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <div className="font-semibold text-slate-800 text-sm">
                  Screen Sharing
                </div>
                <div className="text-xs text-slate-500">
                  Optional — helps during the coding round.
                </div>
              </div>
              {screenShareActive ? (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <FaDesktop size={12} /> SHARING
                </span>
              ) : (
                <button
                  onClick={requestScreenShare}
                  className="px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                >
                  Share Screen
                </button>
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div>
                <div className="font-semibold text-slate-800 text-sm">
                  Fullscreen
                </div>
                <div className="text-xs text-slate-500">
                  Keeps the session focused. Exiting twice ends the interview.
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                STARTS AUTOMATICALLY
              </span>
            </div>
          </div>

          <button
            onClick={startInterviewFromGate}
            className="w-full py-3.5 rounded-xl bg-[#E8A94C] hover:bg-[#F0B95E] text-[#0C0E11] font-bold text-base transition shadow-lg"
          >
            Meet Your Interviewers →
          </button>
        </div>
      </div>
    );
  }

  const headerChips = (
    <div className="relative z-10 flex items-center justify-center gap-3 mb-6">
      {Object.entries(PANEL_PERSONAS).map(([key, p]) => {
        const speaking = isAIPlaying && activeSpeaker === key;
        return (
          <div
            key={key}
            className={`flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full border bg-white/5 transition-all duration-300 ${
              speaking
                ? `${p.ring} shadow-[0_0_24px_-6px_rgba(232,169,76,0.5)]`
                : "border-white/10"
            }`}
          >
            <span
              className={`relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-linear-to-br ${p.accent}`}
            >
              {p.initials}
              {speaking && (
                <span className="absolute -inset-1 rounded-full border-2 border-[#E8A94C]/60 voice-ring" />
              )}
            </span>
            <span className="text-left">
              <span className="block text-sm font-semibold text-[#EDEEF0] leading-tight">
                {p.name}
              </span>
              <span className="block text-[11px] text-[#8B92A0] leading-tight">
                {p.role}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-10 relative">
      <video
        ref={selfVideoRef}
        autoPlay
        muted
        playsInline
        className="hidden"
        aria-hidden="true"
      />

      {/* header */}
      <div className="bg-linear-to-r from-[#8a5a1e] via-[#a4712a] to-[#8a5a1e] text-white p-6 rounded-2xl shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* both personas shown together */}
            <div className="flex -space-x-3">
              {Object.entries(PANEL_PERSONAS).map(([key, p]) => (
                <div
                  key={key}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 border-white/40 bg-linear-to-br ${p.accent} shadow-lg`}
                >
                  {p.initials}
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {activePersona.name} <span className="font-normal opacity-80">& {Object.values(PANEL_PERSONAS).find((p) => p !== activePersona)?.name}</span>
              </h2>
              <p className="opacity-90 text-sm">
                Welcome, {userName}! Question {Math.min(currentIndex + 1, questions.length)} of{" "}
                {questions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`font-mono-studio text-[10px] tracking-[0.2em] px-3 py-1.5 rounded-full border ${
                ttsProvider === "deepgram"
                  ? "bg-[#E8A94C]/15 border-[#E8A94C]/40 text-[#F0C878]"
                  : "bg-white/10 border-white/25 text-white/80"
              }`}
              title={
                ttsProvider === "deepgram"
                  ? "Speaking with a neural Deepgram voice"
                  : ttsProvider === null
                    ? "Checking voice engine…"
                    : "Speaking with the browser's standard voice"
              }
            >
              {ttsProvider === "deepgram" ? "NEURAL VOICE" : "STANDARD VOICE"}
            </span>
            {cameraStream && (
              <video
                ref={pipVideoRef}
                autoPlay
                muted
                playsInline
                className="w-24 h-16 rounded-xl object-cover border-2 border-white/40 shadow-lg"
              />
            )}
          </div>
        </div>
      </div>

      {/* panel video overlays (A left, B right; both muted so they never
          fight the TTS track, playing = the active speaker's avatar) */}
      <div className="linear linear-cols-2 gap-4 mb-6">
        <div className="relative rounded-2xl overflow-hidden border border-[#1E2229] bg-[#0C0E11] aspect-video">
          <video
            ref={videoRefA}
            src="/interview/A.mp4"
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            Marcus — Technical
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-[#1E2229] bg-[#0C0E11] aspect-video">
          <video
            ref={videoRefB}
            src="/interview/B.mp4"
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            Elena — People &amp; Process
          </div>
        </div>
      </div>

      {/* fullscreen / terminated modals */}
      {fullscreenWarning && !fullscreenWarning.isFinal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
            <FaExclamationTriangle size={40} className="text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Please stay in fullscreen
            </h3>
            <p className="text-slate-600 mb-6 text-sm">
              You exited fullscreen ({fullscreenWarning.count} of{" "}
              {MAX_FULLSCREEN_EXITS - 1} warnings). One more exit will end your
              interview.
            </p>
            <button
              onClick={() => {
                setFullscreenWarning(null);
                enterFullscreen();
              }}
              className="w-full py-3 rounded-xl bg-[#E8A94C] text-[#0C0E11] font-bold hover:bg-[#F0B95E] transition"
            >
              Return to Fullscreen
            </button>
          </div>
        </div>
      )}

      {isTerminated && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
            <FaExclamationTriangle size={40} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Interview Ended
            </h3>
            <p className="text-slate-600 mb-6 text-sm">
              The interview was ended because fullscreen was exited too many
              times. Your progress up to this point has been saved.
            </p>
            <button
              onClick={() => onFinish(interviewId)}
              className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition"
            >
              View Results
            </button>
          </div>
        </div>
      )}

      {/* question + answer */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* question display */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <FaQuestionCircle className="text-[#c98f3d]" />
              Question {Math.min(currentIndex + 1, questions.length)} of{" "}
              {questions.length}
            </span>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full bg-linear-to-r ${activePersona.accent} text-white`}>
                {activePersona.name}
              </span>
              {currentQuestion?.isFollowUp && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  <BsLightningCharge size={11} /> Follow-up
                </span>
              )}
              {currentQuestion?.difficulty && (
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
                  {currentQuestion.difficulty}
                </span>
              )}
              {isCodingQuestion && (
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700">
                  💻 Coding
                </span>
              )}
            </div>
          </div>
          <p className="text-lg text-slate-800 leading-relaxed whitespace-pre-wrap">
            {currentQuestion?.question}
          </p>
        </div>

        {isCodingQuestion ? (
          <div className="p-6">
            <CodingPanel
              language={codeLanguage}
              onLanguageChange={handleLanguageChange}
              answer={answer}
              onCodeChange={(v) => setAnswer(v)}
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
              runResults={runResults}
              submitTestResults={submitTestResults}
              isSubmitting={isSubmitting}
              starterCode={currentQuestion?.starterCode}
              exampleTests={currentQuestion?.exampleTests}
            />
          </div>
        ) : voiceToVoice ? (
          <>
            <VoiceAnswerPanel
              voice={voiceAnswer}
              onRepeat={handleRepeatQuestion}
              onSwitchToType={() => switchAnswerMode("type")}
              headerChips={headerChips}
              analyzing={isAnalyzing}
              analysisProgress={analysisProgress}
            />

            {/* mode toggle + controls row (voice mode) */}
            <div className="px-6 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => switchAnswerMode("type")}
                  disabled={controlsDisabled}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
                >
                  <FaKeyboard size={14} /> Type instead
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRepeatQuestion}
                    disabled={controlsDisabled}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition"
                  >
                    <FaRedo size={13} /> Repeat question
                  </button>
                  <button
                    type="button"
                    onClick={toggleMic}
                    disabled={isSubmitting || isAIPlaying}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${
                      isMicOn
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {isMicOn ? <FaMicrophone size={13} /> : <FaMicrophoneSlash size={13} />}
                    {isMicOn ? "Mic on" : "Mic off"}
                  </button>
                  <button
                    type="button"
                    onClick={skipQuestion}
                    disabled={controlsDisabled}
                    className="px-4 py-2.5 rounded-xl bg-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-300 disabled:opacity-50 transition"
                  >
                    Skip →
                  </button>
                </div>
              </div>

              {micError && (
                <p className="text-xs text-amber-600 mt-3">{micError}</p>
              )}

              {/* inactivity check-in overlay (legacy path; voice mode uses its own) */}
              {inactivityWarning && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
                  <p className="text-sm text-amber-800">
                    Are you still there? Auto-advancing in{" "}
                    <span className="font-bold">{warningSecondsLeft}s</span>…
                  </p>
                  <button
                    onClick={dismissInactivityWarning}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 shrink-0"
                  >
                    I&apos;m here
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-6">
            {/* answer input mode toggle */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-studio text-[10px] tracking-[0.2em] uppercase text-slate-400">
                Answer input
              </span>
              <div className="flex rounded-xl overflow-hidden border border-slate-200">
                <button
                  type="button"
                  onClick={() => switchAnswerMode("voice")}
                  className="px-3.5 py-1.5 text-xs font-bold bg-white text-slate-500 hover:bg-slate-50"
                >
                  🎙 Voice
                </button>
                <button
                  type="button"
                  className="px-3.5 py-1.5 text-xs font-bold bg-slate-800 text-white"
                >
                  ⌨ Type
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here…"
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#E8A94C] focus:ring-2 focus:ring-[#E8A94C]/30 outline-none resize-y text-slate-800"
              />
              {interimText && (
                <div className="absolute bottom-3 left-4 right-4 text-sm text-slate-400 italic pointer-events-none truncate">
                  🎙 {interimText}
                </div>
              )}
            </div>

            {feedback && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap">
                {feedback}
              </div>
            )}

            {micError && (
              <p className="text-xs text-amber-600 mt-2">{micError}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMic}
                  disabled={isSubmitting || isAIPlaying}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${
                    isMicOn
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {isMicOn ? <FaMicrophone size={13} /> : <FaMicrophoneSlash size={13} />}
                  {isMicOn ? "Dictation on" : "Dictation off"}
                </button>
                <button
                  type="button"
                  onClick={handleRepeatQuestion}
                  disabled={controlsDisabled}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition"
                >
                  <FaRedo size={13} /> Repeat question
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={skipQuestion}
                  disabled={controlsDisabled}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-300 disabled:opacity-50 transition"
                >
                  Skip →
                </button>
                <button
                  type="button"
                  onClick={() => submitAnswer()}
                  disabled={controlsDisabled || !answer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#E8A94C] text-[#0C0E11] text-sm font-bold hover:bg-[#F0B95E] disabled:opacity-50 transition"
                >
                  {isSubmitting ? "Submitting…" : "Submit Answer"}
                </button>
              </div>
            </div>

            {/* timer bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <FaClock /> Time remaining
                </span>
                <span className="font-mono-studio font-bold tabular-nums">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#E8A94C] to-[#c98f3d] transition-all duration-1000"
                  style={{
                    width: `${Math.max(0, (timeLeft / (currentQuestion?.timeLimit || 60)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {inactivityWarning && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
                <p className="text-sm text-amber-800">
                  Are you still there? Auto-advancing in{" "}
                  <span className="font-bold">{warningSecondsLeft}s</span>…
                </p>
                <button
                  onClick={dismissInactivityWarning}
                  className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 shrink-0"
                >
                  I&apos;m here
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* interviewer subtitles (voice mode hides them to keep it pure voice) */}
      {subtitle && !voiceToVoice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[calc(100%-2rem)]">
          <div className="bg-black/75 text-white text-center text-sm px-5 py-3 rounded-2xl backdrop-blur">
            <span className="font-semibold text-[#F0C878]">
              {activePersona.name}:{" "}
            </span>
            {subtitle}
          </div>
        </div>
      )}
    </div>
  );
}

export default Step2PanelInterview;
