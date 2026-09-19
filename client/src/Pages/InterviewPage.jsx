import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import Step1Setup from "../components/Step1Setup";
import Step2Interview from "../components/Step2Interview";
import Step2PanelInterview from "../components/Step2PanelInterview";
import Step3Report from "../components/Step3Report";
import { BsGear, BsMic, BsBarChart, BsCheckLg } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";

const steps = [
  { id: 1, label: "Setup", icon: <BsGear size={14} /> },
  { id: 2, label: "Interview", icon: <BsMic size={14} /> },
  { id: 3, label: "Report", icon: <BsBarChart size={14} /> },
];

function InterviewPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [interviewData, setinterviewData] = useState(null);

  // Step1 always returns interviewType ("solo" | "panel") in its payload —
  // this decides which Step2 component runs, existing solo flow (Step2Interview)
  // stays completely untouched either way.
  const isPanel = interviewData?.interviewType === "panel";

  return (
    <div className="relative min-h-screen bg-[#F7F6F3] dark:bg-[#0A0B0D] transition-colors duration-300 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .interviewpage-root, .interviewpage-root * { font-family: 'Manrope', sans-serif; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
        .film-grain {
          position: fixed; inset: 0; pointer-events: none; opacity: 0.02;
          mix-blend-mode: overlay; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/rect%3E%3C/svg%3E");
        }
      `}</style>

      <div className="film-grain" />

      {/* soft amber/cyan glow, matching the studio brand instead of the old green blobs */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-125 overflow-hidden z-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(232,169,76,0.10),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(94,200,216,0.08),transparent_35%)]"></div>
      </div>

      <div className="interviewpage-root relative z-10 pt-8 pb-4">
        {/* Step progress indicator */}
        <div className="relative flex items-center justify-center gap-2 md:gap-4 px-4">
          <motion.button
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/")}
            title="Back to home"
            className="absolute left-4 sm:left-8 w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#131519]/90 backdrop-blur-md shadow-sm hover:shadow-md border border-[#EAE9E5] dark:border-[#232830] transition-all duration-200"
          >
            <FaArrowLeft className="text-[#5C6472] dark:text-[#9AA1AC]" size={14} />
          </motion.button>

          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: step === s.id ? 1.08 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300
                                        ${
                                          step > s.id
                                            ? "bg-[#E8A94C] border-[#E8A94C] text-[#1C1F24]"
                                            : step === s.id
                                              ? "bg-[#1C1F24] dark:bg-[#EDEEF0] border-transparent text-white dark:text-[#0A0B0D] shadow-[0_0_0_4px_rgba(232,169,76,0.15),0_8px_20px_-8px_rgba(0,0,0,0.35)]"
                                              : "bg-white dark:bg-[#111318] border-[#EAE9E5] dark:border-[#232830] text-[#9AA1AC] dark:text-[#565D68]"
                                        }`}
                >
                  {step > s.id ? <BsCheckLg size={14} /> : s.icon}
                </motion.div>
                <span
                  className={`hidden sm:block font-mono-studio text-xs tracking-wide transition-colors duration-300
                                    ${
                                      step === s.id
                                        ? "text-[#1C1F24] dark:text-[#EDEEF0]"
                                        : step > s.id
                                          ? "text-[#B27E2E] dark:text-[#E8A94C]"
                                          : "text-[#9AA1AC] dark:text-[#565D68]"
                                    }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-8 md:w-16 h-0.5 rounded-full overflow-hidden bg-[#EAE9E5] dark:bg-[#1E2229]">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: step > s.id ? "100%" : "0%" }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-[#E8A94C]"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Animated step content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <Step1Setup
                onstart={(data) => {
                  setinterviewData(data);
                  setStep(2);
                }}
              />
            </motion.div>
          )}

          {step === 2 &&
            (isPanel ? (
              <motion.div
                key="step2-panel"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                <Step2PanelInterview
                  interviewData={interviewData}
                  onFinish={(report) => {
                    setinterviewData(report);
                    setStep(3);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="step2-solo"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                <Step2Interview
                  interviewData={interviewData}
                  onFinish={(report) => {
                    setinterviewData(report);
                    setStep(3);
                  }}
                />
              </motion.div>
            ))}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <Step3Report report={interviewData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default InterviewPage;