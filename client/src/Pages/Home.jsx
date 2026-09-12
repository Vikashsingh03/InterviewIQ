import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
  BsArrowRight,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import AuthModel from "../components/AuthModel";
import evalImg from "../assets/ai-ans.png";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from "../components/Footer";

const heroWords = ["Practice", "Interview", "with"];
const techStack = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "OpenRouter AI",
  "Tailwind CSS",
  "Redux Toolkit",
  "Firebase",
];

function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const goStart = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate("/interview");
  };
  const goHistory = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate("/history");
  };

  return (
    <div className="relative min-h-screen bg-[#f3f3f3] dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <div className="relative z-50">
        <Navbar />
      </div>

      <div className="relative flex-1">
        {/* Mesh gradient + blobs — sirf hero area tak, bottom pe fade */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h- overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(20,184,166,0.14),transparent_35%)]"></div>
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-green-300/30 dark:bg-green-700/15 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob"></div>
          <div className="absolute top-32 -right-24 w-80 h-80 bg-emerald-300/30 dark:bg-emerald-700/15 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="relative bg-white/70 dark:bg-gray-900/60 backdrop-blur-md text-gray-600 dark:text-gray-300 text-sm px-4 py-2 rounded-full gap-2 flex items-center shadow-sm border border-white/50 dark:border-gray-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                AI Powered Smart Interview Platform
                <HiSparkles
                  size={16}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
            </motion.div>

            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-gray-900 dark:text-gray-50">
                <motion.span
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.12 } },
                  }}
                  className="inline-block"
                >
                  {heroWords.map((word, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.5 }}
                      className="inline-block mr-4"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
                  className="relative inline-block bg-linear-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent animate-gradient-x"
                >
                  AI Intelligence
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-gray-500 dark:text-gray-400 mt-6 max-w-2xl mx-auto text-lg"
              >
                Role-based mock interviews with smart follow-ups, adaptive
                diificulty and real-time performance evaluation.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex flex-wrap justify-center gap-5 mt-10"
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-300"></div>
                  <motion.button
                    onClick={goStart}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="btn-shine cursor-pointer relative bg-black dark:bg-white text-white dark:text-black px-10 py-3.5 rounded-full font-semibold flex items-center gap-2 shadow-xl"
                  >
                    Start Interview
                    <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Tech stack marquee */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="relative mb-24 overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              }}
            >
              <div className="flex gap-3 w-max animate-marquee">
                {[...techStack, ...techStack].map((tech, i) => (
                  <span
                    key={i}
                    className="text-sm px-4 py-2 rounded-full bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 whitespace-nowrap"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Step cards */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-32">
              {[
                {
                  icon: <BsRobot size={26} />,
                  step: "STEP 1",
                  title: "Role & Experience Selection",
                  desc: "AI adjust difficulty based on selected job role.",
                },
                {
                  icon: <BsMic size={26} />,
                  step: "STEP 2",
                  title: "Smart Voice Interview",
                  desc: "Dynamic follow-up questions based on your answers.",
                },
                {
                  icon: <BsClock size={26} />,
                  step: "STEP 3",
                  title: "Timer Based Simulation",
                  desc: "Real interview pressure with time tracking.",
                },
              ].map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 60, rotate: 0 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotate: index === 0 ? -4 : index === 1 ? 3 : -3,
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 + index * 0.2, type: "spring" }}
                  whileHover={{ rotate: 0, scale: 1.06, y: -8 }}
                  key={index}
                  className={`group relative bg-white dark:bg-gray-900 rounded-3xl shadow-md p-10 w-80 max-w-[90%] transition-shadow duration-300 hover:shadow-[0_0_45px_-12px_rgba(16,185,129,0.45)] border border-gray-100 dark:border-gray-800
                  ${index === 1 ? "md:-mt-6 shadow-xl" : ""}
                  `}
                >
                  <div className="w-16 h-16 mb-6 mx-auto rounded-2xl flex items-center justify-center text-white bg-linear-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-900/20 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-2 tracking-widest">
                      {item.step}
                    </div>
                    <h3 className="font-semibold mb-3 text-lg text-gray-900 dark:text-gray-100">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Advanced AI capabilities */}
            <div className="mb-32">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 dark:text-gray-50"
              >
                Advanced AI{" "}
                <span className="bg-linear-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                  Capabilities
                </span>
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    image: evalImg,
                    icon: <BsBarChart size={20} />,
                    title: "AI Answer Evaluation",
                    desc: "Scores communication, technical accuracy and confidence.",
                  },
                  {
                    image: resumeImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Resume Based Interview",
                    desc: "Project-specific questions based on uploaded resume.",
                  },
                  {
                    image: pdfImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Downloadable PDF Report",
                    desc: "Detailed strengths, weakness and improvment insights.",
                  },
                  {
                    image: analyticsImg,
                    icon: <BsBarChart size={20} />,
                    title: "History & Analytics",
                    desc: "Track progress with performance graph and topic analysis.",
                  },
                ].map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    key={index}
                    className="group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm transition-all duration-300 border border-transparent hover:border-green-200 dark:hover:border-green-900/50 hover:shadow-[0_0_45px_-15px_rgba(16,185,129,0.4)]"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-full md:w-1/2 flex justify-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-auto object-contain max-h-64 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="w-full md:w-1/2">
                        <div className="bg-linear-to-br from-green-500 to-emerald-600 text-white w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-green-900/20">
                          {item.icon}
                        </div>
                        <h3 className="font-semibold mb-3 text-xl text-gray-900 dark:text-gray-100">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Interview modes */}
            <div className="mb-24">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 dark:text-gray-50"
              >
                Multiple Interview{" "}
                <span className="bg-linear-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                  Modes
                </span>
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    img: hrImg,
                    title: "HR Interview Mode",
                    desc: "Behavioral and communication based evaluation",
                  },
                  {
                    img: techImg,
                    title: "Technical Mode",
                    desc: "Deep technical questioning based on selected role.",
                  },
                  {
                    img: confidenceImg,
                    title: "Confidence Detection",
                    desc: "Basic tone and voice anaysis insights.",
                  },
                  {
                    img: creditImg,
                    title: "Credit System",
                    desc: "Unlock premium interview session easily.",
                  },
                ].map((mode, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -6 }}
                    key={index}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex items-center justify-between gap-6">
                      <div className="w-1/2">
                        <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-100">
                          {mode.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>
                      <div className="w-1/2 flex justify-end">
                        <img
                          src={mode.img}
                          alt={mode.title}
                          className="w-28 h-28 object-contain animate-float"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAuth && <AuthModel onclose={() => setShowAuth(false)} />}

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
