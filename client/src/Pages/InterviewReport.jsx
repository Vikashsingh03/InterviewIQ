import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ServerUrl } from "../App";
import axios from "axios";
import { motion } from "motion/react";
import Step3Report from "../components/Step3Report";
import { FaArrowLeft } from "react-icons/fa";

function InterviewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await axios.get(
          ServerUrl + "/api/interview/report/" + id,
          { withCredentials: true },
        );

        setReport(result.data);
      } catch (err) {
        console.log(err);
        setError(
          err?.response?.data?.message ||
            "Couldn't load this report. It may not exist or you may not have access to it.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#FAFAF9] dark:bg-[#0A0B0D] px-6">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rotate-45 bg-[#9A7B24] dark:bg-[#E8A94C] animate-pulse" />
          <span className="w-2.5 h-2.5 rotate-45 bg-[#9A7B24]/60 dark:bg-[#E8A94C]/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <span className="w-2.5 h-2.5 rotate-45 bg-[#9A7B24]/30 dark:bg-[#E8A94C]/30 animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
        <p className="font-mono-studio text-[11px] tracking-[0.22em] text-[#8A929C] dark:text-[#8B92A0]">
          PREPARING YOUR REPORT
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-[#FAFAF9] dark:bg-[#0A0B0D] px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full bg-white dark:bg-[#0C0E11] border-2 border-[#F87171]/30 rounded-3xl p-8 text-center shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]"
        >
          <span className="inline-block w-3 h-3 rotate-45 bg-[#F87171] mb-4" />
          <p className="font-serif-display text-xl text-[#14171B] dark:text-[#EDEEF0] mb-2">
            Report unavailable
          </p>
          <p className="text-sm text-[#5B636E] dark:text-[#9AA1AC] leading-relaxed mb-6">
            {error || "Report not found."}
          </p>
          <button
            onClick={() => navigate("/history")}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] font-mono-studio text-[11px] font-semibold tracking-[0.14em] uppercase hover:opacity-90 transition cursor-pointer"
          >
            <FaArrowLeft size={12} /> Back to History
          </button>
        </motion.div>
      </div>
    );
  }

  return <Step3Report report={report} />;
}

export default InterviewReport;
