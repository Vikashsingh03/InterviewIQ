import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { getVoiceCommand } from "../utils/voiceCommands.js";

const MIN_SPEECH_MS = 400;

const MIN_LISTEN_MS = 3000;

const SILENCE_MS = 2000;

const SHORT_UTTERANCE_MS = 2500;
const SHORT_COUNTDOWN_FROM = 1;

const MAX_ANSWER_MS = 180000;

const NO_SPEECH_PROMPT_MS = 20000;

const CALIBRATION_MS = 900;
const THRESHOLD_FLOOR = 0.01;
const THRESHOLD_CEIL = 0.06;
const THRESHOLD_MULT = 5;

const CANCEL_MULT = 1.6;
const CANCEL_SUSTAIN_MS = 500;

const COUNTDOWN_FROM = 3;

const SPEECH_ACTIVITY_GATE_MS = 1500;

const LEVEL_SMOOTHING = 0.75;

const SR =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const pickMimeType = () => {
  if (typeof MediaRecorder === "undefined") return "";
  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus"))
    return "audio/webm;codecs=opus";
  if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
  return "";
};

export function useVoiceAnswer({ apiUrl, onTranscript, onNoSpeech, onCommand, onSpeechActivity }) {
  const [status, setStatus] = useState("idle");
  const [level, setLevel] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [notice, setNotice] = useState("");
  const [lastTranscript, setLastTranscript] = useState("");
  const [lastCommand, setLastCommand] = useState(null);

  const onTranscriptRef = useRef(onTranscript);
  const onNoSpeechRef = useRef(onNoSpeech);
  const onCommandRef = useRef(onCommand);
  const onSpeechActivityRef = useRef(onSpeechActivity);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onNoSpeechRef.current = onNoSpeech;
    onCommandRef.current = onCommand;
    onSpeechActivityRef.current = onSpeechActivity;
  });

  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const mimeTypeRef = useRef("");

  const monRef = useRef(null);
  const shouldTranscribeRef = useRef(false);
  const levelRef = useRef(0);
  const lastLevelPushRef = useRef(0);
  const noSpeechFiredRef = useRef(false);

  const thresholdRef = useRef(0.02);

  const spotterRef = useRef(null);
  const commandsLive = !!SR;

  const sessionRef = useRef(0);

  const clearCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);
  };

  const releaseMic = () => {
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch {

      }
      sourceRef.current = null;
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((t) => t.stop());
      } catch {

      }
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {

      }
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
  };

  const stopMonitor = () => {
    monRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const stopCommandSpotter = () => {
    const s = spotterRef.current;
    spotterRef.current = null;
    if (s) {
      try {
        s.rec.onresult = null;
        s.rec.onerror = null;
        s.rec.onend = null;
        s.rec.stop();
      } catch {

      }
    }
  };

  const fireCommand = (id, via) => {
    stopCommandSpotter();
    console.log(`[voice-cmd] FIRED "${id}" (${via}) — acting now`);
    setLastCommand({ id, at: Date.now() });

    setTimeout(() => {
      setLastCommand((c) => (c && c.id === id ? null : c));
    }, 2600);
    if (onCommandRef.current) onCommandRef.current(id);
  };

  const startCommandSpotter = () => {
    stopCommandSpotter();
    if (!SR) {
      console.warn(
        "[voice-cmd] browser SpeechRecognition unavailable — real-time commands OFF. Commands still work via the post-transcription check (after the wrap-up), so say the command and stay silent.",
      );
      return;
    }
    let rec;
    try {
      rec = new SR();
    } catch {
      console.warn("[voice-cmd] could not construct SpeechRecognition");
      return;
    }
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-IN";
    const state = { rec };
    spotterRef.current = state;

    rec.onresult = (e) => {
      if (spotterRef.current !== state) return;
      const res = e.results[e.results.length - 1];
      const text = (res?.[0]?.transcript || "").trim();
      if (!text) return;
      const cmd = getVoiceCommand(text);
      console.log(
        `[voice-cmd] heard: "${text}"${res?.isFinal ? " (final)" : ""} -> ${cmd ? `COMMAND "${cmd}"` : "not a command"}`,
      );

      if (cmd) fireCommand(cmd, res?.isFinal ? "final" : "interim");
    };

    rec.onerror = (e) => {
      if (e?.error && e.error !== "no-speech") {
        console.warn("[voice-cmd] spotter error:", e.error);
      }
    };
    rec.onend = () => {

      if (spotterRef.current === state && monRef.current) {
        try {
          rec.start();
        } catch {

        }
      }
    };
    try {
      rec.start();
      console.log(
        '[voice-cmd] spotter live (en-IN) — "repeat" / "skip" / "wait" fire instantly',
      );
    } catch {
      console.warn("[voice-cmd] spotter failed to start");
      spotterRef.current = null;
    }
  };

  const teardown = useCallback(() => {
    sessionRef.current += 1;
    shouldTranscribeRef.current = false;
    stopMonitor();
    stopCommandSpotter();
    clearCountdown();
    const rec = recorderRef.current;
    recorderRef.current = null;
    if (rec && rec.state !== "inactive") {
      try {
        rec.stop();
      } catch {

      }
    }
    releaseMic();
    levelRef.current = 0;
    setLevel(0);
    setStatus("idle");
  }, []);

  const uploadForTranscription = async (blob, session) => {
    try {
      const form = new FormData();
      form.append("audio", blob, "answer.webm");
      const res = await axios.post(`${apiUrl}/api/interview/transcribe`, form, {
        withCredentials: true,
        timeout: 65000,
      });

      if (sessionRef.current !== session) return;
      const transcript = (res.data?.transcript || "").trim();
      if (!transcript) {
        handleEmptyTranscript();
        return;
      }
      setLastTranscript(transcript);
      setNotice("");
      releaseMic();
      setLevel(0);
      setStatus("idle");
      if (onTranscriptRef.current) onTranscriptRef.current(transcript);
    } catch (err) {
      if (sessionRef.current !== session) return;
      const httpStatus = err?.response?.status;
      console.error(
        "[voice] transcription upload failed:",
        httpStatus || err?.message,
        err?.response?.data,
      );
      releaseMic();
      setLevel(0);
      setStatus("error");

      const hint =
        httpStatus === 404
          ? " (server route missing — add POST /transcribe to interview.route.js and restart the server)"
          : httpStatus
            ? ` (HTTP ${httpStatus})`
            : "";
      setNotice(`Couldn't transcribe that${hint} — please switch to Type mode.`);
    }
  };

  const handleEmptyTranscript = () => {
    setNotice("I didn't catch that — please speak again.");
    beginCapture();
  };

  const finishAndTranscribe = () => {
    stopMonitor();
    stopCommandSpotter();
    clearCountdown();
    shouldTranscribeRef.current = true;
    setStatus("transcribing");
    setLevel(0);
    const rec = recorderRef.current;
    recorderRef.current = null;
    if (rec && rec.state !== "inactive") {
      try {
        rec.stop();
      } catch {
        shouldTranscribeRef.current = false;
        handleEmptyTranscript();
      }

    } else {
      shouldTranscribeRef.current = false;
      handleEmptyTranscript();
    }
  };

  const beginCountdown = (short = false) => {
    if (monRef.current) monRef.current.cancelLoudMs = 0;
    setNotice("");
    setStatus("countdown");
    let remaining = short ? SHORT_COUNTDOWN_FROM : COUNTDOWN_FROM;
    setCountdown(remaining);
    countdownTimerRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        setCountdown(null);
        finishAndTranscribe();
      } else {
        setCountdown(remaining);
      }
    }, 1000);
  };

  const ensureStream = async () => {
    const existing = streamRef.current;
    if (existing && existing.active) return existing;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,

        autoGainControl: true,
      },
    });
    streamRef.current = stream;
    return stream;
  };

  const beginCapture = async () => {
    const stream = streamRef.current;
    if (!stream || !stream.active) {
      setStatus("denied");
      return;
    }

    let ctx = audioCtxRef.current;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) {
        setStatus("error");
        setNotice("Audio capture isn't supported in this browser.");
        return;
      }
      ctx = new AC();
      audioCtxRef.current = ctx;
    }

    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {

      }
    }

    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch {

      }
      sourceRef.current = null;
    }
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    sourceRef.current = source;
    analyserRef.current = analyser;

    const mimeType = pickMimeType();
    mimeTypeRef.current = mimeType;
    let rec;
    try {
      rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch {
      setStatus("error");
      setNotice("Recording isn't supported in this browser — please use Type mode.");
      return;
    }
    chunksRef.current = [];
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size) chunksRef.current.push(e.data);
    };
    rec.onstop = () => {
      if (!shouldTranscribeRef.current) return;
      shouldTranscribeRef.current = false;
      const session = sessionRef.current;
      const chunks = chunksRef.current;
      chunksRef.current = [];
      const blob = new Blob(chunks, {
        type: mimeTypeRef.current || "audio/webm",
      });
      if (!blob.size) {
        handleEmptyTranscript();
        return;
      }
      uploadForTranscription(blob, session);
    };
    try {
      rec.start(250);
    } catch {
      setStatus("error");
      setNotice("Couldn't start recording — please switch to Type mode.");
      return;
    }
    recorderRef.current = rec;

    monRef.current = {
      startTime: performance.now(),
      speechMs: 0,
      lastReportedSpeechMs: 0,
      lastSpeechTs: 0,
      lastTick: performance.now(),
      cancelLoudMs: 0,

      calib: { until: performance.now() + CALIBRATION_MS, samples: [] },
    };
    noSpeechFiredRef.current = false;
    setNotice("");
    setLastCommand(null);

    setStatus("requesting");

    const data = new Uint8Array(analyser.fftSize);
    const loop = () => {
      if (!monRef.current) return;
      rafRef.current = requestAnimationFrame(loop);
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);

      levelRef.current =
        levelRef.current * LEVEL_SMOOTHING + rms * (1 - LEVEL_SMOOTHING);
      const now = performance.now();
      if (now - lastLevelPushRef.current > 120) {
        lastLevelPushRef.current = now;
        setLevel(Math.min(1, levelRef.current * 3));
      }

      const mon = monRef.current;
      const dt = now - mon.lastTick;
      mon.lastTick = now;

      if (mon.calib) {
        mon.calib.samples.push(rms);
        if (now >= mon.calib.until) {
          const sorted = mon.calib.samples.slice().sort((a, b) => a - b);
          const floor =
            sorted.length > 0 ? sorted[Math.floor(sorted.length * 0.25)] : 0;
          thresholdRef.current = Math.min(
            THRESHOLD_CEIL,
            Math.max(THRESHOLD_FLOOR, floor * THRESHOLD_MULT),
          );
          console.log(
            "[voice] mic calibrated — noise floor",
            floor.toFixed(4) + ", speech threshold",
            thresholdRef.current.toFixed(4),
          );
          mon.calib = null;

          mon.startTime = now;
          mon.lastTick = now;
          setStatus("listening");

          startCommandSpotter();
        }
        return;
      }

      const speaking = rms > thresholdRef.current;

      if (speaking) {
        mon.speechMs += dt;
        mon.lastSpeechTs = now;
        if (onSpeechActivityRef.current && mon.speechMs - mon.lastReportedSpeechMs >= SPEECH_ACTIVITY_GATE_MS) {
          mon.lastReportedSpeechMs = mon.speechMs;
          onSpeechActivityRef.current();
        }

        if (countdownTimerRef.current) {
          if (rms > thresholdRef.current * CANCEL_MULT) {
            mon.cancelLoudMs += dt;
          } else {
            mon.cancelLoudMs = 0;
          }
          if (mon.cancelLoudMs >= CANCEL_SUSTAIN_MS) {
            mon.cancelLoudMs = 0;
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
            setCountdown(null);
            setStatus("listening");
            setNotice("Heard you — keep going.");
          }
        }
      } else {
        mon.cancelLoudMs = 0;
      }

      const elapsed = now - mon.startTime;

      if (elapsed >= MAX_ANSWER_MS) {
        finishAndTranscribe();
        return;
      }

      if (
        mon.speechMs < MIN_SPEECH_MS &&
        elapsed >= NO_SPEECH_PROMPT_MS &&
        !noSpeechFiredRef.current
      ) {
        noSpeechFiredRef.current = true;
        if (onNoSpeechRef.current) onNoSpeechRef.current();
        return;
      }

      if (
        !countdownTimerRef.current &&
        elapsed >= MIN_LISTEN_MS &&
        mon.speechMs >= MIN_SPEECH_MS &&
        mon.lastSpeechTs > 0 &&
        now - mon.lastSpeechTs >= SILENCE_MS
      ) {
        beginCountdown(mon.speechMs < SHORT_UTTERANCE_MS);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const start = useCallback(async () => {
    if (monRef.current) return;
    const mySession = sessionRef.current + 1;
    sessionRef.current = mySession;
    setNotice("");
    setLastTranscript("");
    setCountdown(null);
    setStatus("requesting");
    try {
      await ensureStream();
    } catch (err) {
      console.error("[voice] mic access denied:", err?.message);
      setStatus("denied");
      return;
    }

    if (sessionRef.current !== mySession || monRef.current) {
      releaseMic();
      return;
    }
    beginCapture();

  }, []);

  const stop = useCallback(() => {
    teardown();
  }, [teardown]);

  const cancelAll = useCallback(() => {
    teardown();
    setNotice("");
    setLastTranscript("");
  }, [teardown]);

  useEffect(() => {
    return () => {
      teardown();
    };
  }, [teardown]);

  return {
    status,
    level,
    countdown,
    notice,
    lastTranscript,
    lastCommand,
    commandsLive,
    start,
    stop,
    cancelAll,
  };
}

export default useVoiceAnswer;
