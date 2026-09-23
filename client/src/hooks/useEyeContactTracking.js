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

const DETECTION_INTERVAL_MS = 400;

export const EYE_CONTACT_WARNING_MS = 3000;

/**
 * Runs client-side face-tracking against a <video> element and reports
 * what fraction of sampled frames looked toward the camera.
 *
 * @param {React.RefObject<HTMLVideoElement>} videoRef
 * @param {{ active: boolean }} options - only samples frames while active
 */
export function useEyeContactTracking(videoRef, { active }) {
  const [modelsReady, setModelsReady] = useState(false);
  const [modelsFailed, setModelsFailed] = useState(false);
  // null = no reading yet, true/false = last sampled frame's verdict
  const [liveLookingAtCamera, setLiveLookingAtCamera] = useState(null);
  const [awayStreakMs, setAwayStreakMs] = useState(0);
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
        const detection = await faceapi
          .detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 224 }),
          )
          .withFaceLandmarks();

        framesRef.current.total += 1;

        // no face in frame counts as "away" too — the candidate has either
        // looked far off-camera or stepped out of view entirely
        const looking = !!detection && isLookingAtCamera(detection.landmarks);

        if (!detection) {
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
      } catch (err) {
        // face-api occasionally throws on a mid-decode video frame —
        // skip this sample and try again on the next tick
      } finally {
        busyRef.current = false;
      }
    };

    const intervalId = setInterval(tick, DETECTION_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [active, modelsReady, videoRef]);

  // whenever tracking stops being active (camera off, intro phase, question
  // transition, interview ended) drop any in-progress away streak so a
  // stale warning can't linger or reappear a beat later
  useEffect(() => {
    if (!active) {
      awayStartedAtRef.current = null;
      setAwayStreakMs(0);
      setLiveLookingAtCamera(null);
    }
  }, [active]);

  // call when a new answer window starts, so each question's % is its own
  const resetWindow = useCallback(() => {
    framesRef.current = { total: 0, onCamera: 0 };
    awayStartedAtRef.current = null;
    setAwayStreakMs(0);
    setLiveLookingAtCamera(null);
  }, []);

  // call right before submitting an answer to read that window's result
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
    resetWindow,
    getWindowPercent,
  };
}