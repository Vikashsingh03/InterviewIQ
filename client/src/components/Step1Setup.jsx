import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
  FaBuilding,
  FaFileAlt,
} from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

// shown as datalist suggestions — the field also accepts any free-typed
// company name, the backend just won't have a curated style guide for it
const SUGGESTED_COMPANIES = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Apple",
  "Netflix",
  "Flipkart",
  "TCS",
  "Infosys",
  "Wipro",
  "Accenture",
  "Startup",
];

function Step1Setup({ onstart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // shown to the user on resume-analysis or start-interview failures
  const [resumeError, setResumeError] = useState("");
  const [startError, setStartError] = useState("");

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);
    setResumeError("");

    const formdata = new FormData();
    formdata.append("resume", resumeFile);

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/resume",
        formdata,
        { withCredentials: true },
      );

      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      // these must stay arrays — a "" fallback would break the .map() calls below
      setProjects(
        Array.isArray(result.data.projects) ? result.data.projects : [],
      );
      setSkills(Array.isArray(result.data.skills) ? result.data.skills : []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
    } catch (error) {
      console.log(error);
      setResumeError(
        error?.response?.data?.message ||
          "Couldn't analyze the resume. You can still fill the details manually below.",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    setStartError("");
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/generate-questions",
        {
          role,
          experience,
          mode,
          company,
          jobDescription,
          resumeText,
          projects,
          skills,
        },
        { withCredentials: true },
      );

      // backend sends `creditsLeft`, not `credits` — this was silently setting credits to undefined
      if (userData) {
        dispatch(
          setUserData({ ...userData, credits: result.data.creditsLeft }),
        );
      }
      onstart(result.data);
    } catch (error) {
      console.log(error);
      setStartError(
        error?.response?.data?.message ||
          "Couldn't start the interview. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-[#f3f3f3] dark:bg-gray-950 transition-colors duration-300 px-4 py-10"
    >
      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl dark:shadow-black/40 grid md:grid-cols-2 overflow-hidden border border-transparent dark:border-gray-800">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative bg-linear-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-900 p-12 flex flex-col justify-center overflow-hidden"
        >
          {/* subtle glow accent for dark mode */}
          <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 bg-emerald-400/0 dark:bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 bg-green-400/0 dark:bg-green-500/10 rounded-full blur-3xl"></div>

          <h2 className="relative text-4xl font-bold text-gray-800 dark:text-gray-50 mb-6">
            Start your AI interview
          </h2>

          <p className="relative text-gray-700 dark:text-gray-400 mb-10">
            Practice real interview scenarios powered by AI. Improve
            communication, technical skills, and confidence.
          </p>

          <div className="relative space-y-5">
            {[
              {
                icon: (
                  <FaUserTie className="text-green-600 dark:text-green-400 text-xl" />
                ),
                text: "Choose Role & Experience",
              },
              {
                icon: (
                  <FaMicrophoneAlt className="text-green-600 dark:text-green-400 text-xl" />
                ),
                text: "Smart Voice Interview",
              },
              {
                icon: (
                  <FaChartLine className="text-green-600 dark:text-green-400 text-xl" />
                ),
                text: "Performance Analytics",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="flex items-center space-x-4 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-sm dark:shadow-none dark:border dark:border-gray-700 cursor-pointer"
              >
                {item.icon}
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-12 bg-white dark:bg-gray-900"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-50 mb-8">
            Interview SetUp
          </h2>

          <div className="space-y-6">
            <div className="relative">
              <FaUserTie className="absolute top-4 left-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Enter Role"
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 outline-none transition"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>

            <div className="relative">
              <FaBriefcase className="absolute top-4 left-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Experience (e.g. 2 years)"
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 outline-none transition"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 outline-none transition"
            >
              <option value="Technical"> Technical Interview</option>
              <option value="HR">HR Interview</option>
            </select>

            <div className="relative">
              <FaBuilding className="absolute top-4 left-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                list="company-suggestions"
                placeholder="Target Company (optional, e.g. Google)"
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 outline-none transition"
                onChange={(e) => setCompany(e.target.value)}
                value={company}
              />
              <datalist id="company-suggestions">
                {SUGGESTED_COMPANIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500 pl-1">
                AI will tailor question style to that company's known
                interview culture.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowJobDescription((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition"
              >
                <FaFileAlt className="text-xs" />
                {showJobDescription
                  ? "Hide job description"
                  : "Paste a job description (optional)"}
              </button>

              <AnimatePresence>
                {showJobDescription && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <textarea
                      rows={5}
                      placeholder="Paste the actual job posting here — AI will tailor questions to its specific responsibilities and required skills, not just the role title."
                      className="mt-3 w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 outline-none transition resize-none text-sm"
                      onChange={(e) => setJobDescription(e.target.value)}
                      value={jobDescription}
                      maxLength={4000}
                    />
                    <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500 pl-1">
                      {jobDescription.length}/4000 characters
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => document.getElementById("resumeUpload").click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition"
              >
                <FaFileUpload className="text-4xl mx-auto text-green-600 dark:text-green-400 mb-3" />
                <input
                  type="file"
                  id="resumeUpload"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    setResumeFile(e.target.files[0]);
                    setResumeError("");
                  }}
                />

                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  {resumeFile
                    ? resumeFile.name
                    : "Click to upload resume (optional)"}
                </p>

                {resumeFile && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    disabled={analyzing}
                    className="mt-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-70"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {resumeError && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-3 flex items-start gap-2">
                <IoWarningOutline
                  size={16}
                  className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0"
                />
                <p className="text-amber-700 dark:text-amber-400 text-xs sm:text-sm leading-relaxed">
                  {resumeError}
                </p>
              </div>
            )}

            <AnimatePresence>
              {analysisDone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Resume Analysis Result
                  </h3>
                  {projects.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Projects:
                      </p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                        {projects.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Skills:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((s, i) => (
                          <span
                            key={i}
                            className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {startError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3 flex items-start gap-2">
                <IoWarningOutline
                  size={16}
                  className="text-red-600 dark:text-red-400 mt-0.5 shrink-0"
                />
                <p className="text-red-700 dark:text-red-400 text-xs sm:text-sm leading-relaxed">
                  {startError}
                </p>
              </div>
            )}

            <motion.button
              onClick={handleStart}
              disabled={!role || !experience || loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="w-full disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md shadow-green-900/20"
            >
              {loading ? "Starting..." : "Start  Interview"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Step1Setup;