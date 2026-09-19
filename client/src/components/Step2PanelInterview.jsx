import React, { useEffect, useRef, useState } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import { motion, AnimatePresence } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from "../App";
import { createRecognition } from "../utils/speechRecognition";
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

  // switching to typing pauses every voice timer (so a slow typist is never
  // nagged or auto-skipped); switching back re-arms the check-in timer
  const toggleTypingMode = () => {
    const next = !showAnswerBoxRef.current;
    showAnswerBoxRef.current = next;
    setShowAnswerBox(next);
    if (next) {
      clearAllVoiceTimers();
    } else if (!isAIPlayingRef.current && !isSubmittingRef.current) {
      armInactivityTimer();
    }
  };

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
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const voiceFor = (askedBy) =>
    PANEL_PERSONAS[askedBy]?.voiceGender === "male" ? maleVoice : femaleVoice;

  const speakText = (text, askedBy) => {
    return new Promise((resolve) => {
      const voice = voiceFor(askedBy);
      if (!window.speechSynthesis || !voice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const humanText = text.replace(/,/g, ", ...").replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = voice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      const speakingRef =
        askedBy === "interviewerA" ? videoRefA : videoRefB;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        speakingRef.current?.play();
      };

      utterance.onend = () => {
        if (speakingRef.current) {
          speakingRef.current.pause();
          speakingRef.current.currentTime = 0;
        }
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
    if ((!maleVoice && !femaleVoice) || !proctoringReady) return;
    if (terminatedRef.current) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi, I'm Arjun — I'll be handling the technical side of today's interview. I've spent several years working on systems like the ones we'll be discussing.`,
          "interviewerA",
        );
        await speakText(
          `And I'm Priya — I'll be focusing on communication, ownership, and how you work with others. Great to have you with us today.`,
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

        if (isMicOn && currentQuestion.type !== "coding") {
          hasSpokenRef.current = false;
          startMic();
          armInactivityTimer();
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

  const finishInterview = async ({ terminatedForMisbehavior = false } = {}) => {
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

  useEffect(() => {
    if (!fullscreenWarning) return;
    let cancelled = false;

    const handle = async () => {
      clearAllVoiceTimers();
      stopMic();
      window.speechSynthesis.cancel();

      if (fullscreenWarning.isFinal) {
        await speakText(
          `${userName}, you have left fullscreen mode ${MAX_FULLSCREEN_EXITS} times. I have to end this interview here.`,
          activeSpeaker,
        );
        if (cancelled) return;
        await finishInterview({ terminatedForMisbehavior: true });
      } else {
        await speakText(
          `Please stay in fullscreen mode. This is warning ${fullscreenWarning.count} of ${MAX_FULLSCREEN_EXITS}. If you leave fullscreen again, the interview will be ended.`,
          activeSpeaker,
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
    if (isMicOn && !isCodingQuestion) {
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

  const submitAnswer = async () => {
    if (isSubmitting) return;
    if (!currentQuestion) return;
    if (isIntroPhase || isAIPlaying) return;
    if (isTerminated || fullscreenWarning) return;

    clearAllVoiceTimers();
    stopMic();
    setIsSubmitting(true);
    setErrorMessage("");
    setFeedback("");

    const durationSeconds = answerWindowStartRef.current
      ? Math.max(1, Math.round((Date.now() - answerWindowStartRef.current) / 1000))
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

      const { ack, isLast, nextQuestion, testResults, testsPassedCount, testsTotalCount } =
        result.data;

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
      const spokenReply = buildSpokenReply({ ack, isLast, isCodingQuestion, userName });
      setFeedback(spokenReply);

      if (terminatedRef.current) return;

      await speakText(spokenReply, activeSpeaker);

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
          "Something went wrong while submitting your answer. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipQuestion = async () => {
    if (isSubmitting) return;
    if (!currentQuestion) return;
    if (isIntroPhase || isAIPlaying) return;
    if (isTerminated || fullscreenWarning) return;

    clearAllVoiceTimers();
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
      // on the very last question just say goodbye, no "next question" talk
      const spokenSkip = buildSpokenReply({
        ack: isLast ? "No problem." : fb || "No problem, let's move on.",
        isLast,
        isCodingQuestion: false,
        userName,
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

    if (timeLeft === 0 && !isSubmitting && !feedback) {
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
      window.speechSynthesis.cancel();
    };
  }, []);

  // ---- proctoring consent gate ----
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
          .corner-tl { top: 10px; left: 10px; } .corner-tl::before { width: 2px; height: 100%; top: 0; left: 0; } .corner-tl::after { height: 2px; width: 100%; top: 0; left: 0; }
          .corner-tr { top: 10px; right: 10px; } .corner-tr::before { width: 2px; height: 100%; top: 0; right: 0; } .corner-tr::after { height: 2px; width: 100%; top: 0; right: 0; }
          .corner-bl { bottom: 10px; left: 10px; } .corner-bl::before { width: 2px; height: 100%; bottom: 0; left: 0; } .corner-bl::after { height: 2px; width: 100%; bottom: 0; left: 0; }
          .corner-br { bottom: 10px; right: 10px; } .corner-br::before { width: 2px; height: 100%; bottom: 0; right: 0; } .corner-br::after { height: 2px; width: 100%; bottom: 0; right: 0; }
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
                PANEL MODE · BEFORE WE BEGIN
              </span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-gray-900 dark:text-white mb-2">
              Two interviewers, one session
            </h2>
            <p className="text-sm text-gray-500 dark:text-[#8B93A1] mb-8 leading-relaxed">
              Interviewer A (technical) and Interviewer B (behavioral) will take
              turns. Same camera and browser signals as usual, everything optional
              except fullscreen once you press start.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
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

              <div className="space-y-3">
                <div className="rounded-2xl border border-[#EAE9E5] dark:border-[#1E2229] bg-[#FAFAF8] dark:bg-[#0C0E11] p-4">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
                    Location
                  </p>
                  <p className="text-xs text-gray-500 dark:text-[#8B93A1] mb-3">
                    Approximate coordinates only, shared once.
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
                    Optional, mirrors real panel technical rounds.
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
                The interview runs in fullscreen. After{" "}
                <strong>{MAX_FULLSCREEN_EXITS} exits</strong> the session ends
                automatically. Tab switches are logged too.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <motion.button
                onClick={startInterviewFromGate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-3.5 rounded-2xl shadow-lg transition"
              >
                Start Panel Interview
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
        .film-grain { position: absolute; inset: 0; pointer-events: none; opacity: 0.035; mix-blend-mode: overlay; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        @keyframes livePulse { 0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(232,169,76,0.5); } 50% { opacity: 0.55; box-shadow: 0 0 0 4px rgba(232,169,76,0); } }
        .live-dot { animation: livePulse 1.8s ease-in-out infinite; }
        .studio-select { -webkit-appearance: none; appearance: none; }
        .lang-select-wrap:hover .lang-caret { color: #E8A94C; }
        .speaker-active { border-color: var(--accent) !important; box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent); }
      `}</style>

      <div className="film-grain" />

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
              <div className={`h-1.5 ${fullscreenWarning.isFinal ? "bg-red-500" : "bg-[#E8A94C]"}`} />
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
                  {fullscreenWarning.isFinal ? "Interview ended" : "You left fullscreen mode"}
                </h3>
                <p className="text-sm text-[#5C6472] dark:text-[#8B93A1] leading-relaxed mb-6">
                  {fullscreenWarning.isFinal ? (
                    <>
                      You exited fullscreen {MAX_FULLSCREEN_EXITS} times. The session
                      has ended and your report will be marked as unsuccessful.
                    </>
                  ) : (
                    <>
                      Your timer is paused right now. If you leave fullscreen{" "}
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
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
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
        {/* ============ LEFT: dual-panel broadcast monitor ============ */}
        <div className="w-full lg:w-[38%] bg-[#0C0E11] flex flex-col p-6 sm:p-7 space-y-5 border-r border-[#1E2229] relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${isAIPlaying ? "live-dot" : ""}`}
                style={{ backgroundColor: activePersona.accent }}
              />
              <span
                className="font-mono-studio text-[11px] tracking-[0.08em]"
                style={{ color: activePersona.accent }}
              >
                {isAIPlaying ? `${activePersona.label} · ON AIR` : "STANDBY"}
              </span>
            </div>
            <span className="font-mono-studio text-[11px] text-[#565D68]">
              PANEL · 2 INTERVIEWERS
            </span>
          </div>

          {/* dual avatar strip */}
          <div className="grid grid-cols-2 gap-3">
            {["interviewerA", "interviewerB"].map((key) => {
              const persona = PANEL_PERSONAS[key];
              const isActive = activeSpeaker === key;
              return (
                <div
                  key={key}
                  className={`relative rounded-xl overflow-hidden bg-black ring-1 transition-all duration-300 ${
                    isActive
                      ? "ring-2 opacity-100"
                      : "ring-black/40 opacity-45 grayscale-30"
                  }`}
                  style={
                    isActive
                      ? { boxShadow: `0 0 0 2px ${persona.accent}` }
                      : undefined
                  }
                >
                  <video
                    src={persona.video}
                    key={persona.video}
                    ref={key === "interviewerA" ? videoRefA : videoRefB}
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-auto object-cover aspect-4/5"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent px-2 py-1.5">
                    <p
                      className="font-mono-studio text-[9px] tracking-wide truncate"
                      style={{ color: isActive ? persona.accent : "#8B92A0" }}
                    >
                      {persona.label}
                    </p>
                    <p className="text-[8px] text-[#6B7280]">{persona.subtitle}</p>
                  </div>
                  {isActive && isAIPlaying && (
                    <span
                      className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full live-dot"
                      style={{ backgroundColor: persona.accent }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* candidate self-view PIP */}
          {cameraStream && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden ring-1 ring-white/20 shadow-lg -mt-1">
              <video
                ref={pipVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#E8A94C] live-dot" />
              <span className="absolute bottom-1.5 left-1.5 font-mono-studio text-[9px] text-white/80">
                YOU
              </span>
            </div>
          )}

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
                <p className="text-[#D8DCE3] text-sm leading-relaxed">{subtitle}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {micError && !isCodingQuestion && (
            <div className="bg-[#211A0F] border border-[#493318] rounded-xl p-3 flex items-start gap-2">
              <IoWarningOutline size={16} className="text-[#E8A94C] mt-0.5 shrink-0" />
              <p className="text-[#E8B96A] text-xs leading-relaxed">{micError}</p>
            </div>
          )}

          <div className="bg-[#131519] border border-[#232830] rounded-2xl p-5 space-y-4">
            <div className="flex justify-center">
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
            </div>
            <div className="h-px bg-linear-to-r from-transparent via-[#232830] to-transparent" />
            <div className="text-center">
              <p className="font-serif-display text-4xl text-[#EDEEF0] tracking-tight">
                {String(currentIndex + 1).padStart(2, "0")}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-[11px] text-[#565D68]">
                <BsStars size={11} className="text-[#5EC8D8]" />
                <span>Interviewers alternate every question</span>
              </div>
            </div>

            {isCodingQuestion && submitTestResults && (
              <>
                <div className="h-px bg-linear-to-r from-transparent via-[#232830] to-transparent" />
                <div className="bg-[#5EC8D8]/6 border border-[#5EC8D8]/25 rounded-xl p-4 text-center">
                  <p className="font-mono-studio text-2xl text-[#5EC8D8]">
                    {submitTestResults.passed}/{submitTestResults.total}
                  </p>
                  <p className="text-[10px] text-[#565D68] mt-1">test cases passed</p>
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
                Mock Panel Interview
              </h2>
            </div>
            <span className="font-mono-studio text-xs text-[#8B92A0] tracking-wide">
              {String(currentIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
            </span>
          </div>

          {errorMessage && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <IoWarningOutline size={16} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
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
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className="font-mono-studio inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] tracking-wide"
                    style={{
                      backgroundColor: `${activePersona.accent}1A`,
                      color: activePersona.accent,
                    }}
                  >
                    <BsPersonFill size={10} /> {activePersona.label}
                  </span>
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
                            <p className="text-[#9AA1AC] mb-1">Example {i + 1}</p>
                            <p className="text-[#3D4148] dark:text-[#C7CBD1]">
                              Input: <span className="whitespace-pre-wrap">{tc.input}</span>
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
                    <p className="font-mono-studio text-xs text-[#8B92A0]">Running your code...</p>
                  ) : (
                    <div className="space-y-2">
                      {runResults.map((r, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          {r.passed ? (
                            <BsCheckCircleFill className="text-[#4ADE80] mt-0.5 shrink-0" size={12} />
                          ) : (
                            <BsXCircleFill className="text-[#F87171] mt-0.5 shrink-0" size={12} />
                          )}
                          <div className="font-mono-studio text-[#C7CBD1]">
                            <span>Test {i + 1}: {r.passed ? "Passed" : "Failed"}</span>
                            {!r.passed && (
                              <div className="text-[#6B7280] mt-0.5">
                                {r.error ? (
                                  <span className="text-[#F0918D]">{r.error}</span>
                                ) : (
                                  <>Expected: {r.expectedOutput} | Got: {r.actualOutput}</>
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
          ) : showAnswerBox ? (
            <textarea
              placeholder="Type your answer here..."
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              disabled={controlsDisabled}
              className="flex-1 mt-3 bg-white dark:bg-[#0C0E11] rounded-2xl p-5 sm:p-6 border border-[#E5E4E0] dark:border-[#1E2229] text-[#1C1F24] dark:text-[#EDEEF0] placeholder-[#9AA1AC] dark:placeholder-[#565D68] text-base leading-relaxed resize-none outline-none focus:border-[#E8A94C]/50 focus:ring-4 focus:ring-[#E8A94C]/10 transition-all duration-200 disabled:opacity-60"
            />
          ) : (
            <div className="flex-1 mt-3 bg-white dark:bg-[#0C0E11] rounded-2xl p-5 sm:p-6 border border-[#E5E4E0] dark:border-[#1E2229] flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isMicOn && !controlsDisabled ? "live-dot" : "bg-[#9AA1AC]"
                  }`}
                  style={
                    isMicOn && !controlsDisabled
                      ? { backgroundColor: activePersona.accent }
                      : undefined
                  }
                />
                <span className="font-mono-studio text-[11px] tracking-wide text-[#8B92A0] uppercase">
                  {isMicOn && !controlsDisabled ? "Listening..." : "Mic paused"}
                </span>
              </div>
              <p className="text-[#1C1F24] dark:text-[#EDEEF0] text-base leading-relaxed">
                {answer || interimText ? (
                  <>
                    {answer}
                    {interimText && (
                      <span className="text-[#9AA1AC] dark:text-[#565D68]">
                        {answer ? " " : ""}
                        {interimText}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-[#9AA1AC] dark:text-[#565D68]">
                    Just start speaking whenever you're ready, the panel will
                    pick it up automatically. Say "repeat" if you missed the
                    question, or "wait" if you need a moment.
                  </span>
                )}
              </p>
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
                    Still there? Say anything to let us know.
                  </p>
                </div>
                <span className="font-mono-studio text-xs font-semibold text-[#B27E2E] dark:text-[#E8A94C] shrink-0">
                  {warningSecondsLeft}s
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {!feedback ? (
            <div className="flex items-center gap-3 mt-6">
              {!isCodingQuestion && (
                <motion.button
                  type="button"
                  onClick={toggleTypingMode}
                  whileTap={{ scale: 0.95 }}
                  className="shrink-0 font-mono-studio text-[10px] sm:text-[11px] tracking-wide px-2.5 sm:px-3 py-2 rounded-xl border border-[#E5E4E0] dark:border-[#262B34] text-[#5C6472] dark:text-[#8B92A0] hover:bg-white dark:hover:bg-[#181B20] transition"
                >
                  {showAnswerBox ? "USE VOICE" : "TYPE INSTEAD"}
                </motion.button>
              )}

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
                  {isMicOn ? <FaMicrophone size={19} /> : <FaMicrophoneSlash size={19} />}
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
                  <span className="hidden sm:inline">{isRunning ? "Running..." : "Run"}</span>
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
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
                    />
                    {isCodingQuestion ? "Running tests & reviewing..." : `${activePersona.label} is evaluating...`}
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
              className="mt-6 bg-white dark:bg-[#131519] border p-5 rounded-2xl shadow-[0_12px_30px_-16px_rgba(0,0,0,0.2)]"
              style={{ borderColor: `${activePersona.accent}4D` }}
            >
              <p className="text-[#1C1F24] dark:text-[#EDEEF0] font-medium mb-4 leading-relaxed">
                {feedback}
              </p>
              <div
                className="flex items-center gap-2 font-mono-studio text-xs tracking-wide"
                style={{ color: activePersona.accent }}
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-3.5 h-3.5 border-2 rounded-full"
                  style={{
                    borderColor: `${activePersona.accent}4D`,
                    borderTopColor: activePersona.accent,
                  }}
                />
                {isLastQuestion ? "Wrapping up your report..." : "Moving to the next question..."}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step2PanelInterview;