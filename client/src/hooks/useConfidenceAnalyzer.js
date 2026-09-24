import { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import {
  countFillerWords,
  computeWpm,
  computeConfidenceScore,
} from "../utils/confidenceMath.js";

const SAMPLE_MS = 400;
const MIN_FRAMES = 3;
const MODEL_URL = "/models";
const EXTERNAL_READY_MS = 250;
const EXTERNAL_TIMEOUT_MS = 6000;
const NO_FACE_HINT_AFTER = 8;

let faceApiModelsPromise = null;
function loadFaceApiModels() {
  if (!faceApiModelsPromise) {
    faceApiModelsPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);
  }
  return faceApiModelsPromise;
}

const avgX = (pts) => pts.reduce((sum, p) => sum + p.x, 0) / pts.length;
const avgY = (pts) => pts.reduce((sum, p) => sum + p.y, 0) / pts.length;

function isLookingAtCamera(landmarks) {
  const nose = landmarks.getNose();
  const jaw = landmarks.getJawOutline();
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const mouth = landmarks.getMouth();
  const noseTip = nose[3];
  const leftJaw = jaw[0];
  const rightJaw = jaw[16];
  const eyeCenterX = (avgX(leftEye) + avgX(rightEye)) / 2;
  const eyeCenterY = (avgY(leftEye) + avgY(rightEye)) / 2;
  const mouthCenterY = avgY(mouth);
  const faceWidth = Math.abs(rightJaw.x - leftJaw.x) || 1;
  const faceHeight = Math.abs(mouthCenterY - eyeCenterY) || 1;
  const horizontalOffset = (noseTip.x - eyeCenterX) / faceWidth;
  const verticalOffset = (noseTip.y - eyeCenterY) / faceHeight;
  return (
    Math.abs(horizontalOffset) < 0.18 &&
    verticalOffset > 0.15 &&
    verticalOffset < 0.85
  );
}

function pickPrimaryFace(detections) {
  let best = null;
  let bestArea = -1;
  for (const d of detections) {
    const box = d.detection.box;
    const area = box.width * box.height;
    if (area > bestArea) {
      bestArea = area;
      best = d;
    }
  }
  return best;
}

export function useConfidenceAnalyzer({ stream, videoRef: externalVideoRef }) {
  const [cameraState, setCameraState] = useState("idle");
  const [looking, setLooking] = useState(true);
  const [eyeContactPct, setEyeContactPct] = useState(null);
  const [answerActive, setAnswerActive] = useState(false);

  const hiddenVideoRef = useRef(null);
  const engineRef = useRef(null);
  const readyRef = useRef(false);
  const busyRef = useRef(false);
  const answerRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const getVideo = useCallback(() => {
    if (externalVideoRef && externalVideoRef.current) return externalVideoRef.current;
    return hiddenVideoRef.current;
  }, [externalVideoRef]);

  useEffect(() => {
    streamRef.current = stream || null;
    if (!stream) {
      setCameraState((s) => (s === "live" || s === "no-face" ? "idle" : s));
      engineRef.current = null;
      readyRef.current = false;
      return;
    }

    let cancelled = false;
    let started = false;
    let readyTimer = null;
    let readyTimeout = null;
    let hiddenVideo = null;

    const startEngine = async () => {
      try {
        await loadFaceApiModels();
        if (cancelled) return;
        engineRef.current = "faceapi";
        readyRef.current = true;
        setCameraState("live");
        console.log("[confidence] eye-tracking live (face-api.js + landmarks)");
      } catch {
        if (!cancelled) setCameraState("unsupported");
      }
    };

    const ensureEngine = () => {
      if (!cancelled && !started) {
        started = true;
        startEngine();
      }
    };

    const startHiddenVideo = () => {
      let video = hiddenVideoRef.current;
      if (!video) {
        video = document.createElement("video");
        video.muted = true;
        video.playsInline = true;
        hiddenVideoRef.current = video;
      }
      hiddenVideo = video;
      video.srcObject = stream;
      video
        .play()
        .then(() => {
          if (!cancelled) ensureEngine();
        })
        .catch(() => {
          if (!cancelled) setCameraState("denied");
        });
    };

    setCameraState("requesting");

    if (externalVideoRef) {
      const videoReady = () => {
        const v = externalVideoRef.current;
        return v && v.readyState >= 2 && v.videoWidth > 0;
      };
      if (videoReady()) {
        ensureEngine();
      } else {
        readyTimer = setInterval(() => {
          if (cancelled || videoReady()) {
            clearInterval(readyTimer);
            readyTimer = null;
            ensureEngine();
          }
        }, EXTERNAL_READY_MS);
        readyTimeout = setTimeout(() => {
          if (cancelled) return;
          if (readyTimer) {
            clearInterval(readyTimer);
            readyTimer = null;
          }
          if (videoReady()) ensureEngine();
          else startHiddenVideo();
        }, EXTERNAL_TIMEOUT_MS);
      }
    } else {
      startHiddenVideo();
    }

    return () => {
      cancelled = true;
      if (readyTimer) clearInterval(readyTimer);
      if (readyTimeout) clearTimeout(readyTimeout);
      if (hiddenVideo) {
        try { hiddenVideo.pause(); } catch {}
        hiddenVideo.srcObject = null;
      }
    };
  }, [stream, externalVideoRef, getVideo]);

  const stopSampling = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const sampleOnce = useCallback(async () => {
    const ans = answerRef.current;
    const video = getVideo();
    if (!ans || !ans.active || !video || !engineRef.current) return;
    if (video.readyState < 2 || video.videoWidth === 0) return;
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const detections = await faceapi
        .detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224 }),
        )
        .withFaceLandmarks();
      const primary = pickPrimaryFace(detections);
      ans.total += 1;
      if (!primary) {
        ans.noFaceStreak = (ans.noFaceStreak || 0) + 1;
        if (ans.noFaceStreak >= NO_FACE_HINT_AFTER) setLooking(false);
        setCameraState("no-face");
      } else {
        ans.facesFound = (ans.facesFound || 0) + 1;
        ans.noFaceStreak = 0;
        setCameraState((s) => (s === "no-face" ? "live" : s));
        const isLooking = isLookingAtCamera(primary.landmarks);
        if (isLooking) ans.lookingCount += 1;
        setLooking(isLooking);
      }
      setEyeContactPct(Math.round((ans.lookingCount / ans.total) * 100));
    } catch {
    } finally {
      busyRef.current = false;
    }
  }, [getVideo]);

  const beginAnswer = useCallback(() => {
    const cameraUsed = Boolean(streamRef.current && readyRef.current && engineRef.current);
    answerRef.current = {
      active: true,
      total: 0,
      lookingCount: 0,
      facesFound: 0,
      noFaceStreak: 0,
      cameraUsed,
    };
    setAnswerActive(true);
    setEyeContactPct(null);
    setLooking(true);
    stopSampling();
    if (cameraUsed) {
      sampleOnce();
      timerRef.current = setInterval(sampleOnce, SAMPLE_MS);
    }
  }, [sampleOnce]);

  const endAnswer = useCallback(({ transcript = "", durationSec = 0 } = {}) => {
    const ans = answerRef.current;
    answerRef.current = null;
    stopSampling();
    setAnswerActive(false);
    if (!ans) return null;

    const text = (transcript || "").trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    const { count: fillerWords, ratio: fillerRatio } = countFillerWords(text);
    const wpm = computeWpm(wordCount, durationSec);

    const eyeContactPct =
      ans.cameraUsed && ans.total >= MIN_FRAMES
        ? Math.round((ans.lookingCount / ans.total) * 100)
        : null;

    console.log("[confidence] answer done", {
      engine: engineRef.current,
      frames: ans.total,
      faces: ans.facesFound || 0,
      eyeContactPct,
    });

    const { score, notes } = computeConfidenceScore({
      eyeContactPct,
      fillerRatio,
      wpm,
      cameraUsed: ans.cameraUsed && eyeContactPct != null,
      wordCount,
    });

    return {
      eyeContactPct,
      framesSampled: ans.total,
      fillerWords,
      fillerRatio,
      wordCount,
      wordsPerMinute: wpm,
      speakingSeconds: Math.max(0, Math.round(Number(durationSec) || 0)),
      cameraUsed: Boolean(ans.cameraUsed && eyeContactPct != null),
      confidenceScore: score,
      notes,
    };
  }, []);

  const cancelAnswer = useCallback(() => {
    answerRef.current = null;
    stopSampling();
    setAnswerActive(false);
    setEyeContactPct(null);
  }, []);

  const release = useCallback(() => {
    cancelAnswer();
    engineRef.current = null;
    readyRef.current = false;
    busyRef.current = false;
    if (hiddenVideoRef.current) {
      try { hiddenVideoRef.current.pause(); } catch {}
      hiddenVideoRef.current.srcObject = null;
      hiddenVideoRef.current = null;
    }
  }, [cancelAnswer]);

  useEffect(() => () => stopSampling(), []);

  return {
    cameraState,
    looking,
    eyeContactPct,
    answerActive,
    cameraSupported: cameraState === "live" || cameraState === "no-face",
    beginAnswer,
    endAnswer,
    cancelAnswer,
    release,
  };
}

export default useConfidenceAnalyzer;
