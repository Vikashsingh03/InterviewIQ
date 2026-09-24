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

export default function ProctorWarningModal({ open, variant, onDismiss }) {
  const v = VARIANTS[variant] || VARIANTS.eye;
  const { Icon } = v;
  return <AnimatePresence>
      {open && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} transition={{
      duration: 0.25
    }} className="fixed inset-0 z-1100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <motion.div initial={{
        opacity: 0,
        scale: 0.94,
        y: 16
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.96,
        y: 10
      }} transition={{
        type: "spring",
        stiffness: 300,
        damping: 26
      }} className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0D0F12] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.8)]">
            <div className="px-8 pb-8 pt-8">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1.5 h-1.5 rotate-45" style={{
              backgroundColor: v.accent
            }} />
                <span className="font-mono-studio text-[10px] tracking-[0.22em]" style={{
              color: v.accent
            }}>
                  {v.kicker}
                </span>
              </div>
              <div className="flex items-start gap-4 mb-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border" style={{
              borderColor: `${v.accent}55`,
              backgroundColor: `${v.accent}14`
            }}>
                  <Icon size={20} style={{
                color: v.accent
              }} />
                </span>
                <h3 className="font-serif-display text-2xl text-white tracking-tight leading-tight pt-1">
                  {v.title}
                </h3>
              </div>
              <div className="h-px bg-white/10 mb-5" />
              <p className="text-[15px] leading-relaxed text-zinc-400 mb-8">
                {v.message}
              </p>
              <motion.button type="button" onClick={onDismiss} whileTap={{
            scale: 0.97
          }} className="w-full rounded-2xl py-3.5 text-[15px] font-semibold transition" style={{
            backgroundColor: v.accent,
            color: "#0A0B0D"
          }}>
                {v.button}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
}
