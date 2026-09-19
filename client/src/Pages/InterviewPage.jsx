import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Step1Setup from "../components/Step1Setup";
import Step2Interview from "../components/Step2Interview";
import Step2PanelInterview from "../components/Step2PanelInterview";
import Step3Report from "../components/Step3Report";
import { BsGear, BsMic, BsBarChart, BsCheckLg } from "react-icons/bs";

const steps = [
  { id: 1, label: "Setup", icon: <BsGear size={15} /> },
  { id: 2, label: "Interview", icon: <BsMic size={15} /> },
  { id: 3, label: "Report", icon: <BsBarChart size={15} /> },
];

function InterviewPage() {
  const [step, setStep] = useState(1);
  const [interviewData, setinterviewData] = useState(null);

  // Step1 always returns interviewType ("solo" | "panel") in its payload —
  // this decides which Step2 component runs, existing solo flow (Step2Interview)
  // stays completely untouched either way.
  const isPanel = interviewData?.interviewType === "panel";

  return (
    <div className="relative min-h-screen bg-[#f3f3f3] dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      {/* background glow, matching rest of app */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-125 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(16,185,129,0.14),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(20,184,166,0.12),transparent_35%)]"></div>
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-green-300/25 dark:bg-green-700/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob"></div>
        <div className="absolute top-20 -right-24 w-80 h-80 bg-emerald-300/25 dark:bg-emerald-700/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 pt-10 pb-6">
        {/* Step progress indicator */}
        <div className="flex items-center justify-center gap-2 md:gap-4 px-4">
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
                                            ? "bg-emerald-500 border-emerald-500 text-white"
                                            : step === s.id
                                              ? "bg-linear-to-br from-green-500 to-emerald-600 border-transparent text-white shadow-lg shadow-green-900/20"
                                              : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500"
                                        }`}
                >
                  {step > s.id ? <BsCheckLg size={15} /> : s.icon}
                </motion.div>
                <span
                  className={`hidden sm:block text-sm font-medium transition-colors duration-300
                                    ${
                                      step === s.id
                                        ? "text-gray-900 dark:text-gray-100"
                                        : step > s.id
                                          ? "text-emerald-600 dark:text-emerald-400"
                                          : "text-gray-400 dark:text-gray-500"
                                    }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-8 md:w-16 h-0.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: step > s.id ? "100%" : "0%" }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-linear-to-r from-green-500 to-emerald-600"
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