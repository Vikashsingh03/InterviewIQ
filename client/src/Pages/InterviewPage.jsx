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
  { id: 1, label: "Setup", icon: <BsGear size={13} /> },
  { id: 2, label: "Interview", icon: <BsMic size={13} /> },
  { id: 3, label: "Report", icon: <BsBarChart size={13} /> },
];

function InterviewPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [interviewData, setinterviewData] = useState(null);
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
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        * { scrollbar-width: thin; scrollbar-color: rgba(150,150,150,0.45) transparent; }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background-color: rgba(120,120,120,0.35);
          border-radius: 8px;
          border: 3px solid transparent;
          background-clip: content-box;
        }
        .dark ::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.16);
          border: 3px solid transparent;
          background-clip: content-box;
        }
        ::-webkit-scrollbar-thumb:hover, .dark ::-webkit-scrollbar-thumb:hover {
          background-color: #E8A94C;
          border: 3px solid transparent;
          background-clip: content-box;
        }
        ::-webkit-scrollbar-corner { background: transparent; }
        .premium-scroll::-webkit-scrollbar { width: 8px; }
        .premium-scroll::-webkit-scrollbar-thumb { border: 2.5px solid transparent; }
        .premium-scroll::-webkit-scrollbar-thumb:hover { border: 2.5px solid transparent; }
      `}</style>

      <div className="film-grain" />

      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-125 overflow-hidden z-0"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(232,169,76,0.10),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(94,200,216,0.08),transparent_35%)]"></div>
      </div>

      <div className="interviewpage-root relative z-10 pt-6 pb-2">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-center">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/")}
            title="Back to home"
            className="absolute left-4 sm:left-6 flex items-center gap-2 pl-3 pr-3.5 py-2.5 rounded-full bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl border border-[#EAE9E5] dark:border-[#232830] shadow-[0_10px_28px_-12px_rgba(0,0,0,0.2)] hover:border-[#E8A94C]/40 transition-colors duration-200"
          >
            <FaArrowLeft className="text-[#5C6472] cursor-pointer dark:text-[#9AA1AC]" size={12} />
            <span className="hidden sm:block cursor-pointer font-mono-studio text-[10px] tracking-[0.2em] text-[#5C6472] dark:text-[#9AA1AC]">HOME</span>
          </motion.button>

          <div className="flex items-center gap-0.5 p-1.5 rounded-full bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl border border-[#EAE9E5] dark:border-[#232830] shadow-[0_14px_36px_-14px_rgba(0,0,0,0.25)]">
            {steps.map((s, i) => {
              const isActive = step === s.id;
              const isDone = step > s.id;
              return (
                <React.Fragment key={s.id}>
                  <motion.div
                    animate={isActive ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className={`flex items-center gap-2.5 pl-4 pr-4 sm:pl-5 sm:pr-5 py-2.5 rounded-full transition-all duration-300 ${
                      isActive ? "bg-[#1C1F24] dark:bg-[#EDEEF0] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)]" : ""
                    }`}
                  >
                    <span className={`font-mono-studio text-[10px] tracking-[0.14em] ${
                      isActive ? "text-[#E8A94C]" : isDone ? "text-[#B27E2E] dark:text-[#E8A94C]" : "text-[#B9BEC7] dark:text-[#3A3F47]"
                    }`}>
                      {String(s.id).padStart(2, "0")}
                    </span>
                    {isDone ? (
                      <BsCheckLg size={13} className="text-[#B27E2E] dark:text-[#E8A94C]" />
                    ) : (
                      <span className={isActive ? "text-white dark:text-[#0A0B0D]" : "text-[#9AA1AC] dark:text-[#565D68]"}>
                        {s.icon}
                      </span>
                    )}
                    <span className={`hidden sm:block text-[13px] font-semibold tracking-wide ${
                      isActive ? "text-white dark:text-[#0A0B0D]" : isDone ? "text-[#B27E2E] dark:text-[#E8A94C]" : "text-[#9AA1AC] dark:text-[#565D68]"
                    }`}>
                      {s.label}
                    </span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#E8A94C]" />}
                  </motion.div>
                  {i < steps.length - 1 && (
                    <span className={`w-px h-5 transition-colors duration-300 ${isDone ? "bg-[#E8A94C]/50" : "bg-[#EAE9E5] dark:bg-[#232830]"}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="absolute right-4 sm:right-6 hidden md:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#E8A94C]" />
            <span className="font-mono-studio text-[10px] tracking-[0.2em] text-[#9AA1AC] dark:text-[#565D68]">SESSION Nº 001</span>
          </div>
        </div>
      </div>

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
              <Step3Report report={interviewData} showBackButton={false} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default InterviewPage;
