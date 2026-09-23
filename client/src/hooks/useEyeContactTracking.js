import { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const MODEL_URL = "/models";
let modelsLoadPromise = null;

function loadModels() {
  if (!modelsLoadPromise) {
    modelsLoadPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);
  }
  return modelsLoadPromise;
}

const avgX = (pts) => pts.reduce((sum, p) => sum + p.x, 0) / pts.length;
const avgY = (pts) => pts.reduce((sum, p) => sum + p.y, 0) / pts.length;

export function isLookingAtCamera(landmarks) {
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

export function pickPrimaryFace(detections) {
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

const DETECTION_INTERVAL_MS = 400;

export const EYE_CONTACT_WARNING_MS = 2000;

export function useEyeContactTracking(videoRef, { active }) {
  const [modelsReady, setModelsReady] = useState(false);
  const [modelsFailed, setModelsFailed] = useState(false);
  const [liveLookingAtCamera, setLiveLookingAtCamera] = useState(null);
  const [awayStreakMs, setAwayStreakMs] = useState(0);
  const [faceCount, setFaceCount] = useState(0);
  const framesRef = useRef({ total: 0, onCamera: 0 });
  const busyRef = useRef(false);
  const awayStartedAtRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadModels()
      .then(() => {
        if (!cancelled) setModelsReady(true);
      })
      .catch((err) => {
        console.log("[eye-contact] model load failed:", err?.message);
        if (!cancelled) setModelsFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!active || !modelsReady) return undefined;

    const tick = async () => {
      if (busyRef.current) return;
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      busyRef.current = true;
      try {
        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 224 }),
          )
          .withFaceLandmarks();

        setFaceCount((prev) =>
          prev === detections.length ? prev : detections.length,
        );

        const primary = pickPrimaryFace(detections);

        framesRef.current.total += 1;

        const looking = !!primary && isLookingAtCamera(primary.landmarks);

        if (!primary) {
          setLiveLookingAtCamera(null);
        } else {
          setLiveLookingAtCamera(looking);
        }

        if (looking) {
          framesRef.current.onCamera += 1;
          awayStartedAtRef.current = null;
          setAwayStreakMs(0);
        } else {
          if (awayStartedAtRef.current === null) {
            awayStartedAtRef.current = Date.now();
          }
          setAwayStreakMs(Date.now() - awayStartedAtRef.current);
        }
      } catch {
      } finally {
        busyRef.current = false;
      }
    };

    const intervalId = setInterval(tick, DETECTION_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [active, modelsReady, videoRef]);

  useEffect(() => {
    if (!active) {
      awayStartedAtRef.current = null;
      setAwayStreakMs(0);
      setLiveLookingAtCamera(null);
      setFaceCount(0);
    }
  }, [active]);

  const resetWindow = useCallback(() => {
    framesRef.current = { total: 0, onCamera: 0 };
    awayStartedAtRef.current = null;
    setAwayStreakMs(0);
    setLiveLookingAtCamera(null);
  }, []);

  const getWindowPercent = useCallback(() => {
    const { total, onCamera } = framesRef.current;
    if (!total) return null;
    return Math.round((onCamera / total) * 100);
  }, []);

  return {
    modelsReady,
    modelsFailed,
    liveLookingAtCamera,
    awayStreakMs,
    faceCount,
    resetWindow,
    getWindowPercent,
  };
}
