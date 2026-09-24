import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { BsEye, BsEyeSlash, BsCameraVideoOff } from "react-icons/bs";

export default function ConfidenceLivePill({ analyzer }) {
  if (!analyzer || !analyzer.answerActive) return null;

  const { cameraState, looking, eyeContactPct } = analyzer;
  const eyeTracking = cameraState === "live" || cameraState === "no-face";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none relative z-30 flex items-center gap-2.5 rounded-2xl border border-[#EAE9E5] dark:border-[#262B34] bg-white/90 dark:bg-[#111318]/90 backdrop-blur-md px-3.5 py-2 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]"
      >
        {eyeTracking ? (
          <>
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${
                  looking ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  looking ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
            </span>
            {looking ? (
              <BsEye size={14} className="text-emerald-500" />
            ) : (
              <BsEyeSlash size={14} className="text-amber-500" />
            )}
            <span className="font-mono-studio text-[11px] tracking-wide text-[#3D4148] dark:text-[#C7CBD1]">
              {looking ? "Eye contact" : "Look at the camera"}
            </span>
            {eyeContactPct != null && (
              <span className="font-mono-studio text-[11px] font-semibold text-[#8B92A0] tabular-nums">
                {eyeContactPct}%
              </span>
            )}
            <span
              className="h-1.5 w-14 rounded-full bg-[#EFEEEA] dark:bg-[#1E2229] overflow-hidden"
              aria-hidden
            >
              <span
                className={`block h-full rounded-full transition-all duration-300 ${
                  looking ? "bg-emerald-400" : "bg-amber-400"
                }`}
                style={{ width: `${eyeContactPct ?? 0}%` }}
              />
            </span>
          </>
        ) : (
          <>
            <BsCameraVideoOff size={14} className="text-[#8B92A0]" />
            <span className="font-mono-studio text-[11px] tracking-wide text-[#8B92A0]">
              {cameraState === "unsupported"
                ? "Eye tracking not supported here"
                : cameraState === "requesting"
                  ? "Starting eye tracking…"
                  : "Camera off — voice insights only"}
            </span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
