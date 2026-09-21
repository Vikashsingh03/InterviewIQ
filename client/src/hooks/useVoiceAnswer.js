// ====================================================================
// InterviewIQ voice-to-voice — FINAL BUILD 2026-09-22-D
// New in D: commands fire on the FIRST interim result (no stability wait),
// utterance-anchored command matching (shared with the post-transcription
// safety net via ../utils/voiceCommands), [voice-cmd] diagnostics.
// If you do NOT see this header, you are looking at an OLD cached copy.
// ====================================================================
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { getVoiceCommand } from "../utils/voiceCommands.js";

// ---------------------------------------------------------------------------
// useVoiceAnswer — record-then-transcribe voice capture for interview answers,
// plus a REAL-TIME voice-command spotter.
//
// Two parallel listeners run while the candidate talks:
//   1. MediaRecorder -> silence -> short wrap-up countdown -> Deepgram
//      transcribe -> onTranscript(text).  (for real answers)
//   2. Browser SpeechRecognition (interim results) -> onCommand("repeat" |
//      "skip" | "wait") the instant a command is heard — no waiting for the
//      countdown.  (for "repeat the question", "skip", "wait"...)
// A command bypasses transcription entirely: the partial recording is
// discarded and the parent acts at once, like a face-to-face interviewer.
//
// Flow per question:
//   requesting (~0.9s mic calibration) -> listening (mic energy monitored,
//   command spotter live) -> 2s of quiet -> countdown (3..1, or a single
//   beat for short utterances like commands) -> stop recorder -> POST audio
//   to /api/interview/transcribe -> onTranscript(text).
//
// Empty transcript  -> "I didn't catch that", fresh recorder, keep listening.
// Transcribe failure -> status "error", parent shows the Type-mode fallback.
// Mic denied        -> status "denied", parent shows the Type-mode fallback.
//
// Speech detection is self-calibrating: the noise floor is measured fresh on
// every capture, so quiet laptop mics work without manual tuning. If the mic
// still seems deaf, check the console for the "[voice] mic calibrated" line —
// it prints the measured noise floor and the threshold being used.
// ---------------------------------------------------------------------------

// how much detected speech must accumulate before silence can trigger
// the wrap-up. Low on purpose: a lone "skip!" is only ~half a second of
// voiced audio — if the bar were higher, short commands would never wrap up
// and the interview would look stuck. Anything above a mic pop is either a
// command or answer content; the transcript (plus the command safety net)
// sorts out which one it was.
const MIN_SPEECH_MS = 400;
// minimum listening time before silence can trigger (lets slow starters in)
const MIN_LISTEN_MS = 3000;
// continuous quiet after speech -> start the wrap-up countdown
const SILENCE_MS = 2000;
// utterances shorter than this much voiced audio get a 1-count wrap-up
// instead of 3 — a command ("repeat the question") is always short, so the
// AI reacts ~2s sooner instead of idling through a full 3-2-1
const SHORT_UTTERANCE_MS = 2500;
const SHORT_COUNTDOWN_FROM = 1;
// hard cap: force stop + transcribe whatever was recorded
const MAX_ANSWER_MS = 180000;
// no speech at all for this long -> parent nudges out loud ("are you still
// there?") and listening resumes. 20s: long enough to think, short enough
// that silence never feels like the interview died.
const NO_SPEECH_PROMPT_MS = 20000;
// --- speech-detection tuning -------------------------------------------------
// A fixed threshold fails on quiet laptop mics (speech never crosses it, so
// the UI looks "stuck listening"). Instead the hook calibrates itself: on
// every capture it samples ~0.9s of room tone, takes the 25th percentile as
// the noise floor, and sets the speech threshold to floor * THRESHOLD_MULT,
// clamped to [THRESHOLD_FLOOR, THRESHOLD_CEIL]. Quiet mics then "just work".
const CALIBRATION_MS = 900;
const THRESHOLD_FLOOR = 0.01;
const THRESHOLD_CEIL = 0.06;
const THRESHOLD_MULT = 5;
// Cancelling the wrap-up countdown needs *deliberate* speech: this much louder
// than the noise floor, sustained for this long. A door slam, chair creak or
// fan gust must never blow the countdown away mid-way.
const CANCEL_MULT = 1.6;
const CANCEL_SUSTAIN_MS = 500;
// seconds in the full-screen wrap-up overlay
const COUNTDOWN_FROM = 3;
// smoothing for the waveform level meter
const LEVEL_SMOOTHING = 0.75;

// --- real-time voice commands ----------------------------------------------
// The browser's built-in speech recognition (free, interim results, no server
// round-trip) spots a tiny command vocabulary while the candidate talks:
// "repeat (the question)", "skip", "wait" — fired via onCommand the instant
// the FIRST interim result opens with a command. No "stability" wait: while
// the candidate keeps speaking the interim keeps growing, so any hold-still
// timer just keeps resetting and the command lands only after the whole
// silence -> transcribe cycle (the "skip didn't work instantly" bug).
// False positives are contained by getVoiceCommand (../utils/voiceCommands):
// matching is anchored at the utterance start, so answer content that merely
// mentions these words mid-sentence ("we used a skip list") never fires.

// SpeechRecognition exists in Chromium browsers; elsewhere commands simply
// stay unavailable (commandsLive === false) and recording is unaffected.
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

export function useVoiceAnswer({ apiUrl, onTranscript, onNoSpeech, onCommand }) {
  const [status, setStatus] = useState("idle");
  const [level, setLevel] = useState(0); // 0..1 smoothed mic level (waveform)
  const [countdown, setCountdown] = useState(null); // 3..1 while wrapping up
  const [notice, setNotice] = useState(""); // transient helper line
  const [lastTranscript, setLastTranscript] = useState(""); // read-only preview
  const [lastCommand, setLastCommand] = useState(null); // { id, at } — flash UI

  // parent callbacks via refs so the 60fps monitor loop never goes stale
  const onTranscriptRef = useRef(onTranscript);
  const onNoSpeechRef = useRef(onNoSpeech);
  const onCommandRef = useRef(onCommand);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onNoSpeechRef.current = onNoSpeech;
    onCommandRef.current = onCommand;
  });

  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null); // MediaStreamSourceNode, disconnected on re-capture
  const rafRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const mimeTypeRef = useRef("");
  // null when not capturing; otherwise { startTime, speechMs, lastSpeechTs, lastTick }
  const monRef = useRef(null);
  const shouldTranscribeRef = useRef(false);
  const levelRef = useRef(0);
  const lastLevelPushRef = useRef(0);
  const noSpeechFiredRef = useRef(false);
  // dynamic speech threshold, learned by the calibration phase in beginCapture
  const thresholdRef = useRef(0.02);
  // command spotter state: { rec } | null
  const spotterRef = useRef(null);
  const commandsLive = !!SR;
  // bumped on every stop/start so a late transcription can't submit a stale answer
  const sessionRef = useRef(0);

  // ---- teardown helpers (plain functions; they only touch refs + setState) ----

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
        /* noop */
      }
      sourceRef.current = null;
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((t) => t.stop());
      } catch {
        /* noop */
      }
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        /* noop */
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

  // ---- real-time command spotter -------------------------------------------
  // Runs the browser's SpeechRecognition with interim results *alongside* the
  // MediaRecorder (both consume the mic independently). Spots "repeat" /
  // "skip" / "wait" and fires onCommand the instant the FIRST interim result
  // opens with a command — the parent then acts at once (re-ask / skip /
  // pause), discarding the partial recording instead of transcribing it as
  // an answer. Like interrupting a human interviewer: no waiting, no text.

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
        /* noop */
      }
    }
  };

  const fireCommand = (id, via) => {
    stopCommandSpotter();
    console.log(`[voice-cmd] FIRED "${id}" (${via}) — acting now`);
    setLastCommand({ id, at: Date.now() });
    // auto-clear the flash pill after a beat
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
      // first interim that opens with a command fires immediately — no
      // stability timer (it kept resetting while the candidate kept talking)
      if (cmd) fireCommand(cmd, res?.isFinal ? "final" : "interim");
    };
    // If interim recognition glitches, commands just go quiet — the answer
    // recording path is completely independent and keeps working. Errors are
    // logged (not swallowed) so a deaf spotter is visible in the console:
    // send the [voice-cmd] lines if commands ever feel slow again.
    rec.onerror = (e) => {
      if (e?.error && e.error !== "no-speech") {
        console.warn("[voice-cmd] spotter error:", e.error);
      }
    };
    rec.onend = () => {
      // Chromium auto-stops recognition after a while; restart it while we're
      // still supposed to be listening.
      if (spotterRef.current === state && monRef.current) {
        try {
          rec.start();
        } catch {
          /* noop */
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

  // Full stop: no transcription, mic released, back to idle. Safe to call
  // any number of times, from any status.
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
        /* noop */
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
      // a stop() in the meantime invalidates this session — drop the result
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
      // Surface the HTTP status: 404 means the /transcribe route was never
      // registered (or the server wasn't restarted after adding it), while
      // 502/503 point at the Deepgram key / Deepgram being unreachable.
      const hint =
        httpStatus === 404
          ? " (server route missing — add POST /transcribe to interview.route.js and restart the server)"
          : httpStatus
            ? ` (HTTP ${httpStatus})`
            : "";
      setNotice(`Couldn't transcribe that${hint} — please switch to Type mode.`);
    }
  };

  // Deepgram heard nothing usable — keep the mic open and listen again with
  // a fresh recorder on the same stream (no re-permission prompt).
  const handleEmptyTranscript = () => {
    setNotice("I didn't catch that — please speak again.");
    beginCapture();
  };

  // Stop the recorder and transcribe what was captured.
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
      // onstop (wired in beginCapture) uploads the blob
    } else {
      shouldTranscribeRef.current = false;
      handleEmptyTranscript();
    }
  };

  // Short utterances (commands, one-liners) wrap up with a single beat
  // instead of the full 3-2-1, so the interviewer reacts sooner. If the
  // candidate keeps talking, the countdown still cancels as usual.
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
        // lifts quiet laptop mics so soft speech still registers; the
        // calibration phase measures the *amplified* noise floor, so this
        // can't cause false speech detection by itself
        autoGainControl: true,
      },
    });
    streamRef.current = stream;
    return stream;
  };

  // Start (or restart) the recorder + energy monitor on the current stream.
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
    // A suspended AudioContext yields all-zero samples (looks exactly like a
    // dead mic — the UI sits in "listening" forever), so wait for it to
    // actually run before measuring anything.
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        /* noop */
      }
    }
    // disconnect the previous capture graph (e.g. after an empty-transcript
    // retry) so old source/analyser nodes never pile up on the context
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch {
        /* noop */
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
      lastSpeechTs: 0,
      lastTick: performance.now(),
      cancelLoudMs: 0, // sustained-loud accumulator for countdown cancel
      // calibration phase: learn the room's noise floor before listening
      calib: { until: performance.now() + CALIBRATION_MS, samples: [] },
    };
    noSpeechFiredRef.current = false;
    setNotice("");
    setLastCommand(null);
    // "Setting up your mic…" shows during the ~0.9s calibration; the monitor
    // loop flips it to "listening" once the threshold is learned
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

      // smoothed level for the waveform UI (state push throttled)
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

      // --- calibration: sample room tone, then derive the speech threshold
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
          // don't count calibration time against the minimum listen window
          mon.startTime = now;
          mon.lastTick = now;
          setStatus("listening");
          // now that we're truly listening, arm the real-time command spotter
          startCommandSpotter();
        }
        return; // keep sampling; speech counting starts after calibration
      }

      const speaking = rms > thresholdRef.current;

      if (speaking) {
        mon.speechMs += dt;
        mon.lastSpeechTs = now;
        // Speech during the wrap-up countdown cancels it — but ONLY deliberate,
        // sustained speech. A door slam, chair creak or fan gust must not blow
        // the countdown away; the candidate has to actually keep talking.
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

      // hard cap: transcribe whatever we have
      if (elapsed >= MAX_ANSWER_MS) {
        finishAndTranscribe();
        return;
      }

      // long total silence with no real speech at all -> parent nudges the
      // candidate. Sub-threshold blips (throat clear, mic pop) count as
      // silence too, so the interview can never hang forever on a noise.
      if (
        mon.speechMs < MIN_SPEECH_MS &&
        elapsed >= NO_SPEECH_PROMPT_MS &&
        !noSpeechFiredRef.current
      ) {
        noSpeechFiredRef.current = true;
        if (onNoSpeechRef.current) onNoSpeechRef.current();
        return;
      }

      // enough speech + enough quiet -> wrap-up countdown
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

  // ---- public API ----

  // Begin a fresh capture session for the current question.
  const start = useCallback(async () => {
    if (monRef.current) return; // already capturing
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
    // a stop() while permission was pending invalidates this start — don't
    // leak the freshly granted stream, just release it and stay idle
    if (sessionRef.current !== mySession || monRef.current) {
      releaseMic();
      return;
    }
    beginCapture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stop = useCallback(() => {
    teardown();
  }, [teardown]);

  // Full reset for unmount / interview end.
  const cancelAll = useCallback(() => {
    teardown();
    setNotice("");
    setLastTranscript("");
  }, [teardown]);

  // Belt-and-suspenders: never leak the mic if the component unmounts.
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
    lastCommand, // { id: "repeat"|"skip"|"wait", at } — flash UI, auto-clears
    commandsLive, // false where the browser has no SpeechRecognition
    start,
    stop,
    cancelAll,
  };
}

export default useVoiceAnswer;
