import { motion, AnimatePresence } from "motion/react";
import { BsEyeSlash, BsPeopleFill } from "react-icons/bs";

const VARIANTS = {
  faces: {
    Icon: BsPeopleFill,
    accent: "#F87171",
    kicker: "PROCTOR NOTICE · FACE CHECK",
    title: "Multiple faces detected",
    message: "More than one face is visible in your camera feed. Please make sure you are alone and fully in frame. This incident has been logged for review.",
    button: "I understand"
  },
  eye: {
    Icon: BsEyeSlash,
    accent: "#E8A94C",
    kicker: "PROCTOR NOTICE · PRESENCE",
    title: "A quick reminder",
    message: "Please look toward the camera while you answer. Sustained eye contact is factored into your delivery score.",
    button: "Got it"
  }
};

function Corner({ className, color }) {
  return (
    <span
      className={`pointer-events-none absolute w-5 h-5 border-2 ${className}`}
      style={{ borderColor: color }}
    />
  );
}

export default function ProctorWarningModal({ open, variant, onDismiss }) {
  const v = VARIANTS[variant] || VARIANTS.eye;
  const { Icon } = v;
  const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-1100 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0D0F12]"
          >
            <Corner className="top-3 left-3 border-r-0 border-b-0" color={`${v.accent}88`} />
            <Corner className="top-3 right-3 border-l-0 border-b-0" color={`${v.accent}88`} />
            <Corner className="bottom-3 left-3 border-r-0 border-t-0" color={`${v.accent}88`} />
            <Corner className="bottom-3 right-3 border-l-0 border-t-0" color={`${v.accent}88`} />

            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="block h-1 origin-left"
              style={{ backgroundColor: v.accent }}
            />

            <div className="px-8 pb-7 pt-7">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: v.accent }} />
                <span className="font-mono-studio text-[10px] tracking-[0.24em]" style={{ color: v.accent }}>
                  {v.kicker}
                </span>
              </div>

              <div className="flex items-start gap-4 mb-5">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
                  style={{ borderColor: `${v.accent}55`, backgroundColor: `${v.accent}12` }}
                >
                  <Icon size={21} style={{ color: v.accent }} />
                </span>
                <h3 className="font-serif-display text-[26px] text-white tracking-tight leading-tight pt-0.5">
                  {v.title}
                </h3>
              </div>

              <div className="h-px bg-white/10 mb-5" />

              <p className="text-[15px] leading-relaxed text-zinc-400 mb-7">
                {v.message}
              </p>

              <motion.button
                type="button"
                onClick={onDismiss}
                whileHover={{ filter: "brightness(1.08)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-xl py-3.5 text-[15px] font-bold transition cursor-pointer"
                style={{ backgroundColor: v.accent, color: "#0A0B0D" }}
              >
                {v.button}
              </motion.button>

              <div className="flex items-center justify-between mt-5">
                <span className="font-mono-studio text-[9px] tracking-[0.2em] text-zinc-600">
                  INCIDENT LOGGED
                </span>
                <span className="font-mono-studio text-[9px] tracking-[0.2em] text-zinc-600">
                  {stamp}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
