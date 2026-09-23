import { motion, AnimatePresence } from "motion/react";
import { BsEyeSlash, BsPeopleFill } from "react-icons/bs";

const VARIANTS = {
  faces: {
    Icon: BsPeopleFill,
    tile: "bg-red-400/10",
    iconColor: "text-red-300",
    ring: "border-red-400/40",
    title: "Multiple Faces Detected",
    message:
      "More than one face is visible in your camera feed. Please make sure you are alone and fully in frame. This incident has been logged for review.",
    button: "I Understand",
  },
  eye: {
    Icon: BsEyeSlash,
    tile: "bg-amber-400/10",
    iconColor: "text-amber-300",
    ring: "border-amber-400/40",
    title: "Eye Contact Reminder",
    message:
      "Please look toward the camera while you answer. Sustained eye contact is factored into your delivery score.",
    button: "Got It",
  },
};

export default function ProctorWarningModal({ open, variant, onDismiss }) {
  const v = VARIANTS[variant] || VARIANTS.eye;
  const { Icon } = v;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-1100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0D0F12] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.8)]"
          >
            <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
              <span className="relative mb-6 flex h-20 w-20 items-center justify-center">
                <motion.span
                  className={`absolute inset-0 rounded-full border-2 ${v.ring}`}
                  animate={{ scale: [1, 1.3], opacity: [0.7, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "easeOut",
                  }}
                />
                <span
                  className={`flex h-20 w-20 items-center justify-center rounded-full ${v.tile}`}
                >
                  <Icon size={34} className={v.iconColor} />
                </span>
              </span>
              <h3 className="mb-3 text-2xl font-bold text-white">{v.title}</h3>
              <p className="mb-8 text-[15px] leading-relaxed text-zinc-400">
                {v.message}
              </p>
              <motion.button
                type="button"
                onClick={onDismiss}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-2xl bg-white py-3.5 text-[15px] font-semibold text-black transition hover:bg-zinc-200"
              >
                {v.button}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
